import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0E14] pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">
              Reach<span className="text-crypto-purple">IQ</span>
            </h2>
            <p className="text-gray-400 mb-6 max-w-xs">
              Automate your outreach, generate qualified leads, and track engagement — all in one platform built for smart growth.
            </p>
            <div className="flex space-x-4">
              <a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-medium mb-4">Products</h3>
            <ul className="space-y-2">
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Email Campaigns</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Lead Tracking</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Analytics Dashboard</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Integrations</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Automation Tools</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Documentation</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Guides & Tutorials</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">FAQ</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Community</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">About Us</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Careers</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Contact</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Privacy Policy</a></li>
              <li><a href="#!" className="text-gray-400 hover:text-crypto-purple transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} <span className="text-white font-semibold">ReachIQ</span>. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#!" className="text-gray-400 hover:text-crypto-purple text-sm transition-colors">Terms</a>
            <a href="#!" className="text-gray-400 hover:text-crypto-purple text-sm transition-colors">Privacy</a>
            <a href="#!" className="text-gray-400 hover:text-crypto-purple text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
