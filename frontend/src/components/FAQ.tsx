import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is LeadReachXpro?",
    answer: "LeadReachXpro is a bulk email and SMS platform that lets you use your personal email accounts (via SMTP) and Android phones (as SMS gateways) to send campaigns. You maintain complete control over your sending accounts while benefiting from our campaign management tools."
  },
  {
    question: "How does the Android SMS gateway work?",
    answer: "You install our gateway app on your Android phone, connect it to your LeadReachXpro account, and then you can send bulk SMS messages directly through your phone. The app handles message queuing and delivery, using your phone's native messaging capabilities."
  },
  {
    question: "Can I use my personal Gmail, Outlook, or other email accounts?",
    answer: "Yes! You can configure any email provider that supports SMTP. This includes Gmail, Outlook, Yahoo, iCloud, and custom domain emails. We provide step-by-step guides for setting up each provider."
  },
  {
    question: "Is there a limit to how many emails or SMS I can send?",
    answer: "With our Starter plan, you get 500 emails and 100 SMS per month. Our Professional plan offers 10,000 emails and 2,000 SMS, while Enterprise has unlimited sending. These limits help maintain good sender reputation with providers."
  },
  {
    question: "Will using my personal accounts affect my email reputation?",
    answer: "We provide tools to maintain good sender reputation, including sending speed controls, bounce handling, and engagement tracking. However, you should always follow email best practices and respect anti-spam laws."
  },
  {
    question: "Do I need multiple Android phones for large SMS campaigns?",
    answer: "For larger volumes, we recommend using multiple devices to avoid carrier limits and ensure better delivery rates. Our Enterprise plan supports unlimited gateway connections for this purpose."
  },
  {
    question: "How secure is my account information?",
    answer: "We encrypt all SMTP credentials and gateway connections. Your passwords are never stored in plain text, and we use secure protocols for all data transmission. You maintain ownership of all your accounts and data."
  },
  {
    question: "Can I schedule campaigns for optimal delivery times?",
    answer: "Yes! Our platform includes smart scheduling that lets you send emails and SMS at the best times for engagement. You can also set up time-zone based delivery for international audiences."
  },
  {
    question: "What kind of analytics and reporting do you provide?",
    answer: "You get real-time analytics including delivery rates, open rates, click-through rates for emails, and delivery status for SMS. Our dashboard shows campaign performance and lead engagement metrics."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! Our Starter plan is completely free and includes 500 emails and 100 SMS per month. You can upgrade to Professional ($29/month) or Enterprise ($99/month) anytime for higher limits and advanced features."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about LeadReachXpro and how to get started with bulk email and SMS using your personal accounts.
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
                <AccordionTrigger className="px-6 py-4 text-white hover:text-yellow-500 hover:no-underline text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Additional CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            Still have questions? We're here to help.
          </p>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;