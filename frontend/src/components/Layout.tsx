import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LogIn, UserPlus, Settings } from 'lucide-react';
import { useAuth } from './AuthContext';
import { logout, getBusinessInfo, getServicesOffered } from '../api';
import type { BusinessAbout, ServiceOffered } from '../types';

export const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [businessInfo, setBusinessInfo] = useState<BusinessAbout | null>(null);
  const [services, setServices] = useState<ServiceOffered[]>([]);
  const { isAuthenticated, user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [info, servicesData] = await Promise.all([
          getBusinessInfo(),
          getServicesOffered()
        ]);
        setBusinessInfo({
          ...info,
          business_hours: "Monday to Saturday: 8:00 AM - 5:00 PM\nSunday: Closed"
        });
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  const handleAdminPanel = () => {
    window.location.href = '/d/admin';
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                {businessInfo?.logo ? (
                  <img src={businessInfo.logo} alt="Logo" className="h-8 w-auto" />
                ) : (
                  <div className="h-8 w-8 bg-indigo-600 rounded-full"></div>
                )}
                <span className="text-xl font-bold text-indigo-600">{businessInfo?.short_name}</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {isHomePage && (
                <>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => scrollToSection('latest-work')}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Latest Work
                  </button>
                  <button
                    onClick={() => scrollToSection('testimonials')}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Testimonials
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Contact
                  </button>
                </>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  {user?.is_staff && (
                    <button
                      onClick={handleAdminPanel}
                      className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">{user?.username}</span>
                  </div>
                </>
              ) : isHomePage ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Create Account
                  </Link>
                </>
              ) : null}
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {isHomePage && (
                <>
                  <button
                    onClick={() => {
                      scrollToSection('services');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('latest-work');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    Latest Work
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('testimonials');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    Testimonials
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('contact');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  >
                    Contact
                  </button>
                </>
              )}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.is_staff && (
                    <button
                      onClick={() => {
                        handleAdminPanel();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                  <div className="px-3 py-2 text-base font-medium text-gray-700">
                    Signed in as {user?.username}
                  </div>
                </>
              ) : isHomePage ? (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Create Account
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                {businessInfo?.logo ? (
                  <img src={businessInfo.logo} alt="Logo" className="h-8 w-auto" />
                ) : (
                  <div className="h-8 w-8 bg-white rounded-full"></div>
                )}
                <span className="text-xl font-bold text-white">{businessInfo?.short_name}</span>
              </div>
              <p className="mt-4 text-gray-300">
                Your trusted partner for all your tailoring needs. Quality craftsmanship, perfect fit.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="text-gray-300 hover:text-white"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('latest-work')}
                    className="text-gray-300 hover:text-white"
                  >
                    Latest Work
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-300 hover:text-white"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {services.map((service) => (
                  <li key={service.name}>
                    <button
                      onClick={() => scrollToSection('services')}
                      className="text-gray-300 hover:text-white"
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Connect with us</h3>
              <div className="space-y-2">
                {businessInfo?.facebook && (
                  <a href={businessInfo.facebook} target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white">
                    👥 Facebook
                  </a>
                )}
                {businessInfo?.twitter && (
                  <a href={businessInfo.twitter} target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white">
                    🐦 Twitter
                  </a>
                )}
                {businessInfo?.instagram && (
                  <a href={businessInfo.instagram} target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white">
                    📸 Instagram
                  </a>
                )}
                {businessInfo?.linkedin && (
                  <a href={businessInfo.linkedin} target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white">
                    💼 LinkedIn
                  </a>
                )}
                {businessInfo?.youtube && (
                  <a href={businessInfo.youtube} target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white">
                    🎥 YouTube
                  </a>
                )}
                {businessInfo?.tiktok && (
                  <a href={businessInfo.tiktok} target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white">
                    🎵 TikTok
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-center text-gray-300">
              © {new Date().getFullYear()} {businessInfo?.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};