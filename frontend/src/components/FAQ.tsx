import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is ReachIQ?",
    answer:
      "ReachIQ is an AI-powered marketing platform that helps you manage SMTP, create smart email campaigns, and track leads — all from one unified dashboard.",
  },
  {
    question: "How does ReachIQ generate leads?",
    answer:
      "ReachIQ uses your campaign data and SMTP insights to track user engagement such as clicks and responses, helping you identify and qualify genuine leads automatically.",
  },
  {
    question: "Do I need technical knowledge to use ReachIQ?",
    answer:
      "Not at all! ReachIQ is built for marketers, founders, and agencies. Its intuitive dashboard and automation features make campaign setup and lead tracking effortless.",
  },
  {
    question: "Can I integrate my own SMTP or email service?",
    answer:
      "Yes, you can easily connect your SMTP credentials to ReachIQ. Once configured, all emails are sent securely through your account — ReachIQ doesn’t store or resend your messages.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! You can try ReachIQ free for 15 days with full access to all features. After the trial, you can continue using it with the Basic ($5/month) or Premium ($25/month) plan.",
  },
  {
    question: "How secure is my data on ReachIQ?",
    answer:
      "We use advanced encryption and secure infrastructure to protect your campaign data, SMTP credentials, and user information. Security is one of our top priorities.",
  },
  {
    question: "Can I upgrade or cancel my plan anytime?",
    answer:
      "Yes, you can upgrade or cancel your subscription at any time from your account dashboard. Your data and campaign settings remain safe and accessible.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-[#12141C] to-crypto-blue">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Got questions about ReachIQ? We’ve got answers. Here are some common queries to help you get started.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger className="px-6 py-4 text-white hover:text-crypto-purple hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
