import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-black hero-glow">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-yellow-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-10 w-96 h-96 bg-yellow-400/10 rounded-full filter blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Text Section */}
          <div className="lg:w-1/2 animate-fade-in-left">
            <div className="inline-flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-yellow-500 mr-2">
                Powerful Features
              </span>
              <span className="text-xs text-gray-300">
                Personal Email & SMS Gateway
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-1" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
                Send Bulk Emails & SMS
              </span>{" "}
              with Your Personal Accounts
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              LeadReachXpro enables you to send bulk email campaigns using your personal SMTP configuration and bulk SMS using your Android phone as a gateway. Complete control, maximum deliverability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-8 py-6"
              >
                Start Campaign
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-700 text-white hover:bg-white/5 py-6"
              >
                Configure Gateway
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button> */}
            </div>

            <div className="mt-8 flex items-center space-x-6">
              <div>
                <p className="text-2xl font-bold text-white">98%</p>
                <p className="text-sm text-gray-400">Inbox Rate</p>
              </div>
              <div className="h-12 w-px bg-gray-700"></div>
              <div>
                <p className="text-2xl font-bold text-white">Unlimited</p>
                <p className="text-sm text-gray-400">Personal Accounts</p>
              </div>
              <div className="h-12 w-px bg-gray-700"></div>
              <div>
                <p className="text-2xl font-bold text-white">Zero</p>
                <p className="text-sm text-gray-400">Monthly Fees</p>
              </div>
            </div>
          </div>

          {/* Right Image Section */}
          <div className="lg:w-1/2 mt-12 lg:mt-0 animate-fade-in-right">
            <div className="relative max-w-md mx-auto animate-float">
              <img
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80"
                alt="Bulk email and SMS campaign dashboard"
                className="rounded-xl shadow-2xl border border-white/10"
              />

              {/* Bottom Right Card */}
              <div className="absolute -right-6 -bottom-6 bg-yellow-500/20 backdrop-blur-md rounded-lg p-4 border border-yellow-500/30 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">SMS Delivery</p>
                    <p className="text-lg font-bold text-green-500">+95.2%</p>
                  </div>
                </div>
              </div>

              {/* Top Left Card */}
              <div className="absolute -left-6 -top-6 bg-yellow-500/20 backdrop-blur-md rounded-lg p-4 border border-yellow-500/30 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Gateway Status</p>
                    <p className="text-lg font-bold text-white">Connected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;