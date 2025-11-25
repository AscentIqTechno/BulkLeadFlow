import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useGetPlansQuery } from "@/redux/api/planApi";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  // Fetch dynamic plans
  const { data: planResponse, isLoading } = useGetPlansQuery(null);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);

  // Transform backend → UI
  useEffect(() => {
    if (planResponse?.success && Array.isArray(planResponse.data)) {
      const transformed = planResponse.data.map((p: any) => ({
        name: p.name,
        price: {
          monthly: p.interval === "month" ? `₹${p.price / 100}` : "₹0",
          annual: p.interval === "year" ? `₹${p.price / 100}` : "₹0",
        },
        description: p.description,
        features: p.features || [],
        highlighted: p.isPopular || false,
        buttonText: p.price === 0 ? "Start Free" : "Get Started",
      }));

      setPricingPlans(transformed);
    }
  }, [planResponse]);

  if (isLoading) {
    return <div className="text-center text-white py-20">Loading…</div>;
  }

  return (
    <section id="pricing" className="py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            No hidden fees. Use your own email and mobile accounts. Scale as you grow.
          </p>

          {/* Toggle */}
          <div className="inline-flex p-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <button
              className={`px-4 py-2 rounded-full transition-colors ${
                billingCycle === "monthly"
                  ? "bg-yellow-500 text-gray-900 font-semibold"
                  : "text-gray-400"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>

            {/* <button
              className={`px-4 py-2 rounded-full transition-colors ${
                billingCycle === "annual"
                  ? "bg-yellow-500 text-gray-900 font-semibold"
                  : "text-gray-400"
              }`}
              onClick={() => setBillingCycle("annual")}
            >
              Annual <span className="text-xs font-medium ml-1">Save 17%</span>
            </button> */}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white/5 backdrop-blur-sm border rounded-xl overflow-hidden ${
                plan.highlighted
                  ? "border-yellow-500 relative shadow-xl shadow-yellow-500/10"
                  : "border-white/10"
              }`}
            >
              {plan.highlighted && (
                <div className="bg-yellow-500 text-gray-900 text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>

                <div className="mb-4">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {billingCycle === "monthly"
                      ? plan.price.monthly
                      : plan.price.annual}
                  </span>
                  <span className="text-gray-400 ml-1">
                    {plan.price.monthly !== "₹0"
                      ? billingCycle === "monthly"
                        ? "/month"
                        : "/year"
                      : ""}
                  </span>
                </div>

                <p className="text-gray-400 mb-6">{plan.description}</p>

                <Button
                  className={`w-full mb-6 ${
                    plan.highlighted
                      ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
                      : plan.name === "Starter"
                      ? "bg-white/10 hover:bg-white/20 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
                  }`}
                >
                  {plan.buttonText}
                </Button>

                <div>
                  <p className="text-sm font-medium text-gray-300 mb-4">What's included:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-yellow-500 mr-3 shrink-0" />
                        <span className="text-gray-400 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            All plans include: Personal account usage • No sending limits (only on Starter)
            • Real-time analytics • Secure data handling
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
