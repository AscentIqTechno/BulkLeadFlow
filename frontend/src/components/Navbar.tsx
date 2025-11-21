import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import LoginModal from "@/components/LoginModal";
import SignupModal from "@/components/SignupModal";
import ForgotPasswordModal from "@/components/ForgotPassword";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isSignupOpen, setIsSignupOpen] = useState<boolean>(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openLogin = (): void => {
    setIsSignupOpen(false);
    setIsForgotPasswordOpen(false);
    setIsLoginOpen(true);
  };

  const openSignup = (): void => {
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(false);
    setIsSignupOpen(true);
  };

  const openForgotPassword = (): void => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const closeAllModals = (): void => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    setIsForgotPasswordOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900/90 backdrop-blur-md py-3 shadow-lg"
            : "py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-extrabold text-white tracking-wide">
              Lead<span className="text-yellow-500">Reach</span>
              <span className="text-white">Xpro</span>
            </h1>
          </div>

          <ul className="hidden lg:flex items-center space-x-8">
            {["Features", "How it works", "Testimonials", "Pricing", "FAQ"].map(
              (item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white"
              onClick={openLogin}
            >
              Login
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold w-full"
              onClick={openSignup}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-900/95 backdrop-blur-lg absolute top-full left-0 w-full py-4 shadow-lg">
            <div className="container mx-auto px-4">
              <ul className="flex flex-col space-y-4">
                {["Features", "How it works", "Testimonials", "Pricing", "FAQ"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                      className="text-gray-300 hover:text-white transition-colors block py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  </li>
                ))}
                <li className="pt-4 flex flex-col space-y-3">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white w-full justify-start"
                    onClick={openLogin}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold w-full"
                    onClick={openSignup}
                  >
                    Get Started
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <LoginModal 
        open={isLoginOpen} 
        onClose={closeAllModals}
        onSwitchToSignup={openSignup}
        onSwitchToForgotPassword={openForgotPassword}
      />
      <SignupModal 
        open={isSignupOpen} 
        onClose={closeAllModals}
        onSwitchToLogin={openLogin}
      />
      <ForgotPasswordModal 
        open={isForgotPasswordOpen} 
        onClose={closeAllModals}
        onSwitchToLogin={openLogin}
      />
    </>
  );
};

export default Navbar;