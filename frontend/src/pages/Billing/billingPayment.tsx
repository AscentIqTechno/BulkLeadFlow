// components/BillingPage.tsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

import {
    useCreateRazorpayOrderMutation,
    useVerifyPaymentMutation,
} from "@/redux/api/paymentApi";

import { useGetPlansQuery } from "@/redux/api/planApi";

interface Plan {
    _id: string;
    name: string;
    price: number; // in the smallest unit (e.g. paise or cents)
    currency: string; // “INR” or “USD”
    interval: "month" | "year";
    description: string;
    features: string[];
    isPopular?: boolean;
    emailsPerMonth: number;
    smsPerMonth: number;
    smtpConfigs: number;
    androidGateways: number;
}

const BillingPage = () => {
    const user = useSelector((state: any) => state.auth?.user || {});
    const { data: planResponse, isLoading: loadingPlans } = useGetPlansQuery(null);
    const [plans, setPlans] = useState<Plan[]>([]);

    const [createOrder, { isLoading: creatingOrder }] = useCreateRazorpayOrderMutation();
    const [verifyPayment, { isLoading: verifyingPayment }] = useVerifyPaymentMutation();

    useEffect(() => {
        if (planResponse?.success && Array.isArray(planResponse.data)) {
            // Remove free plan, or filter as needed
            const filtered = planResponse.data.filter((p: Plan) => p.price >= 0);
            setPlans(filtered);
        }
    }, [planResponse]);

    // Format price based on currency
    const formatPrice = (price: number, currency: string) => {
        // price is in smallest unit: paise (if INR) or cents (if USD)
        const amount = currency === "INR" ? price / 100 : price / 100;
        return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve, reject) => {
            if (typeof window !== "undefined" && (window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error("Failed to load Razorpay"));
            document.body.appendChild(script);
        });
    };

    const handleSubscribe = async (plan: Plan) => {
        try {
            if (plan.price === 0) {
                await handleFreeSubscription(plan);
                return;
            }
            const result = await createOrder({
                planId: plan._id,
                amount: plan.price,
                currency: plan.currency,
            }).unwrap();

            if (!result.success) throw new Error(result.message);
            await loadRazorpayScript();
            openRazorpayCheckout(result.data, plan);
        } catch (err: any) {
            toast.error(err?.message || "Order creation failed");
        }
    };

    const openRazorpayCheckout = (order: any, plan: Plan) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "LeadReachXpro",
            description: `${plan.name} Plan Subscription`,
            order_id: order.id,

            handler: async (response: any) => {
                try {
                    const verifyResult = await verifyPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        planId: plan._id,
                    }).unwrap();

                    if (verifyResult.success) toast.success("Subscription activated!");
                } catch (err: any) {
                    toast.error("Payment verification failed");
                }
            },

            prefill: {
                name: user?.name || "",
                email: user?.email || "",
                contact: user?.phone || "",
            },

            theme: { color: "#F59E0B" },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
    };

    const handleFreeSubscription = async (plan: Plan) => {
        try {
            const result = await verifyPayment({ planId: plan._id, isFree: true }).unwrap();
            if (result.success) toast.success("Free plan activated!");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to activate free plan");
        }
    };

    if (loadingPlans) {
        return <div className="text-center text-white mt-20">Loading plans...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl text-white font-bold">Choose Your Plan</h1>
                    <p className="text-lg mt-2 text-gray-300">
                        Upgrade your account and unlock premium features.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        // Skip "Starter" (free) card, if you want to hide it
                        plan.price === 0 ? null : (
                            <Card
                                key={plan._id}
                                className="bg-gray-800 border border-gray-700 hover:border-yellow-500 transition"
                            >
                                <CardHeader className="text-center">
                                    {plan.isPopular && (
                                        <Badge className="bg-yellow-500 text-gray-900 mb-2 mx-auto">
                                            Most Popular
                                        </Badge>
                                    )}
                                    <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                                    <p className="text-yellow-400 text-3xl font-bold mt-3">
                                        {plan.price}/{plan.interval}
                                    </p>
                                    <p className="text-gray-400 mt-2">{plan.description}</p>
                                </CardHeader>

                                <CardContent>
                                    <ul className="space-y-3 text-gray-300 mb-6">
                                        {plan.features.map((f, idx) => (
                                            <li key={idx} className="flex items-center">
                                                <span className="mr-2 text-yellow-500">✔</span> {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        onClick={() => handleSubscribe(plan)}
                                        disabled={creatingOrder || verifyingPayment}
                                        className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                                    >
                                        Subscribe Now
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
