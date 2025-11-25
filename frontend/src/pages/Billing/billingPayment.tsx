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
import { useGetActiveRazorpayQuery } from "@/redux/api/razorpayApi";

interface Plan {
  _id: string;
  name: string;
  price: number;
  currency: string;
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
  
  // Fetch plans
  const { data: planResponse, isLoading: loadingPlans } = useGetPlansQuery(null);
  
  // Fetch active Razorpay config dynamically
  const { 
    data: razorpayConfig, 
    isLoading: loadingRazorpayConfig,
    error: razorpayConfigError 
  } = useGetActiveRazorpayQuery(null);
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [razorpayKey, setRazorpayKey] = useState<string>("");

  const [createOrder, { isLoading: creatingOrder }] = useCreateRazorpayOrderMutation();
  const [verifyPayment, { isLoading: verifyingPayment }] = useVerifyPaymentMutation();

  useEffect(() => {
    if (planResponse?.success && Array.isArray(planResponse.data)) {
      const filtered = planResponse.data.filter((p: Plan) => p.price >= 0);
      setPlans(filtered);
    }
  }, [planResponse]);

  useEffect(() => {
    if (razorpayConfig?.success) {
      setRazorpayKey(razorpayConfig.data.keyId);
    }
  }, [razorpayConfig]);

  // Format price based on currency
  const formatPrice = (price: number, currency: string) => {
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
      // Check if Razorpay config is available
      if (!razorpayKey && plan.price > 0) {
        toast.error("Payment gateway is not configured. Please try again later.");
        return;
      }

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
    if (!razorpayKey) {
      toast.error("Payment gateway not configured");
      return;
    }

    const options = {
      key: razorpayKey, // ✅ Dynamic key from backend
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

          if (verifyResult.success) {
            toast.success("Subscription activated successfully!");
            // Optionally refresh user data or redirect
          }
        } catch (err: any) {
          console.error("Payment verification error:", err);
          toast.error(err?.data?.message || "Payment verification failed");
        }
      },

      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || ""
      },

      theme: { color: "#F59E0B" },
      
      modal: {
        ondismiss: function() {
          toast.error("Payment cancelled");
        }
      }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  const handleFreeSubscription = async (plan: Plan) => {
    try {
      const result = await verifyPayment({ 
        planId: plan._id, 
        isFree: true 
      }).unwrap();
      
      if (result.success) toast.success("Free plan activated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to activate free plan");
    }
  };

  if (loadingPlans || loadingRazorpayConfig) {
    return <div className="text-center text-white mt-20">Loading plans...</div>;
  }

  if (razorpayConfigError && plans.some(plan => plan.price > 0)) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl text-white mb-4">Payment System Unavailable</h1>
          <p className="text-gray-300">
            We're experiencing issues with our payment gateway. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl text-black font-bold">Choose Your Plan</h1>
          <p className="text-lg mt-2 text-gray-300">
            Upgrade your account and unlock premium features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan._id}
              className={`bg-gray-800 border border-gray-700 hover:border-yellow-500 transition ${
                plan.isPopular ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              <CardHeader className="text-center">
                {plan.isPopular && (
                  <Badge className="bg-yellow-500 text-gray-900 mb-2 mx-auto">
                    Most Popular
                  </Badge>
                )}
                <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                <p className="text-yellow-400 text-3xl font-bold mt-3">
                  {formatPrice(plan.price, plan.currency)}/{plan.interval}
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
                  disabled={creatingOrder || verifyingPayment || (!razorpayKey && plan.price > 0)}
                  className={`w-full ${
                    plan.isPopular 
                      ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {creatingOrder || verifyingPayment ? "Processing..." : "Subscribe Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;