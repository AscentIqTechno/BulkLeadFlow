import { features } from "../data/featuresData";

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
              Powerful Features of LeadReachXpro
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Send bulk emails using your personal SMTP and bulk SMS using your Android phone as a gateway. Complete control, maximum deliverability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/5 group animate-on-scroll"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-yellow-500/20 rounded-lg w-12 h-12 flex items-center justify-center mb-5 text-yellow-500 group-hover:bg-yellow-500/30 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;