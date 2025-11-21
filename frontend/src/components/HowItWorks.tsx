import { Button } from "@/components/ui/button";
import { steps } from "../data/howItWorks";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
              How LeadReachXpro Works
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Start sending bulk emails and SMS in just a few simple steps — configure your SMTP, set up Android gateway, and launch campaigns.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <span className="absolute -top-4 -left-4 bg-yellow-500 border rounded-md border-yellow-400/30 text-gray-900 font-bold text-xl px-3 py-1">
                {step.number}
              </span>
              <div className="bg-yellow-500/20 rounded-xl w-12 h-12 flex items-center justify-center mb-6 text-yellow-500">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8"
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;