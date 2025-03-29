import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Eye, ArrowRight, Check, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { getBusinessInfo, getServicesOffered, getLatestWork, getFeedbacks, getFAQs, sendMessage } from '../api';
import { WorkModal } from '../components/WorkModal';
import { ServiceModal } from '../components/ServiceModal';
import { toast } from 'react-hot-toast';
import { useAuth } from '../components/AuthContext';
import type { BusinessAbout, ServiceOffered, ShallowCompletedOrder, UserFeedback, FAQ, CompletedOrderDetail } from '../types';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [businessInfo, setBusinessInfo] = useState<BusinessAbout | null>(null);
  const [services, setServices] = useState<ServiceOffered[]>([]);
  const [latestWork, setLatestWork] = useState<ShallowCompletedOrder[]>([]);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedFAQ, setExpandedFAQ] = useState<number>(0);
  const [selectedWork, setSelectedWork] = useState<CompletedOrderDetail | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceOffered | null>(null);
  const [contactForm, setContactForm] = useState({
    sender: '',
    email: '',
    body: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [info, servicesData, workData, feedbackData, faqData] = await Promise.all([
          getBusinessInfo(),
          getServicesOffered(),
          getLatestWork(),
          getFeedbacks(),
          getFAQs(),
        ]);
        setBusinessInfo({
          ...info,
          business_hours: "Monday to Saturday: 8:00 AM - 5:00 PM\nSunday: Closed"
        });
        setServices(servicesData);
        setLatestWork(workData);
        setFeedbacks(feedbackData);
        setFaqs(faqData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sendMessage(contactForm);
      setContactForm({ sender: '', email: '', body: '' });
      toast.success(response.detail);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to send message');
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/latest-work/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail);
      }
      const data = await response.json();
      setSelectedWork(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const formatPrice = (price: number) => {
    return `Ksh ${price.toLocaleString()}`;
  };

  const renderStars = (rate: string) => {
    const ratings = {
      'Excellent': 5,
      'Good': 4,
      'Average': 3,
      'Poor': 2,
      'Terrible': 1,
    };
    const stars = ratings[rate as keyof typeof ratings] || 0;

    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">{businessInfo?.name}</span>
                  <span className="block text-indigo-600 mt-3">{businessInfo?.short_name}</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {businessInfo?.slogan}
                </p>
                <p className="mt-3 text-sm text-gray-500 sm:mt-5 sm:max-w-xl sm:mx-auto lg:mx-0">
                  {businessInfo?.details}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {!isAuthenticated && (
                    <div className="rounded-md shadow">
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  )}
                  <div className={`${!isAuthenticated ? 'mt-3 sm:mt-0 sm:ml-3' : ''}`}>
                    <button
                      onClick={() => scrollToSection('services')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Our Services
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src={businessInfo?.wallpaper || "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80"}
            alt="Tailoring"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Excellence in Every Stitch
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {[
                {
                  title: 'Expert Craftsmanship',
                  description: 'Years of experience in creating perfectly fitted garments.',
                  icon: <Check className="h-6 w-6" />,
                },
                {
                  title: 'Custom Measurements',
                  description: 'Precise measurements for the perfect fit every time.',
                  icon: <Check className="h-6 w-6" />,
                },
                {
                  title: 'Quality Materials',
                  description: 'Only the finest fabrics and materials for your garments.',
                  icon: <Star className="h-6 w-6" />,
                },
              ].map((feature) => (
                <div key={feature.title} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Services</h2>
            <p className="mt-4 text-lg text-gray-500">Choose from our wide range of tailoring services</p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.name} className="bg-white overflow-hidden shadow-lg rounded-lg transition-transform duration-300 hover:transform hover:scale-105">
                  <div className="relative h-48">
                    <img
                      className="w-full h-full object-cover"
                      src={service.picture}
                      alt={service.name}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => setSelectedService(service)}
                        className="px-4 py-2 bg-white text-indigo-600 rounded-md font-medium hover:bg-indigo-50"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                    <p className="mt-2 text-sm text-gray-500">{service.description}</p>
                    <div className="mt-4">
                      <span className="text-sm font-medium text-gray-500">Starting from</span>
                      <span className="ml-2 text-lg font-bold text-indigo-600">
                        {formatPrice(service.starting_price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Work Section */}
      <div id="latest-work" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Latest Work</h2>
            <p className="mt-4 text-lg text-gray-500">See what we've created for our clients</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latestWork.map((work) => (
              <div key={work.id} className="relative group">
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                  <img
                    src={work.picture}
                    alt="Latest work"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => handleViewDetails(work.id)}
                        className="transform -translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">What Our Clients Say</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white overflow-hidden shadow-lg rounded-lg transform transition-all duration-300 hover:-translate-y-2">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    {feedback.user.profile ? (
                      <img
                        src={feedback.user.profile}
                        alt={feedback.user.first_name || 'User'}
                        className="h-12 w-12 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full mr-4 bg-indigo-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {feedback.user.first_name} {feedback.user.last_name}
                      </h4>
                      <p className="text-sm text-gray-500">{feedback.user.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-2">{renderStars(feedback.rate)}</div>
                  <p className="text-gray-600 italic">{feedback.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="mt-10 max-w-3xl mx-auto">
            <dl className="space-y-6 divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={faq.question} className="pt-6">
                  <dt className="text-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? -1 : index)}
                      className="text-left w-full flex justify-between items-center text-gray-900"
                    >
                      <span className="font-medium">{faq.question}</span>
                      <span className="ml-6 h-7 flex items-center">
                        <ChevronRight
                          className={`h-6 w-6 transform ${
                            expandedFAQ === index ? 'rotate-90' : ''
                          } transition-transform duration-200`}
                        />
                      </span>
                    </button>
                  </dt>
                  <dd
                    className={`mt-2 pr-12 transition-all duration-200 ${
                      expandedFAQ === index ? 'block opacity-100' : 'hidden opacity-0'
                    }`}
                  >
                    <p className="text-base text-gray-500">{faq.answer}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">📞 Contact Us</h2>
            <p className="mt-4 text-lg text-gray-500">Get in touch with us</p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">{businessInfo?.address}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-indigo-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-600">{businessInfo?.phone_number}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-indigo-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">{businessInfo?.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-gray-900">Business Hours</h4>
                    <p className="text-gray-600 whitespace-pre-line">{businessInfo?.business_hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">✉️ Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="sender" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="sender"
                    id="sender"
                    required
                    value={contactForm.sender}
                    onChange={(e) => setContactForm({ ...contactForm, sender: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="body"
                    id="body"
                    required
                    rows={4}
                    value={contactForm.body}
                    onChange={(e) => setContactForm({ ...contactForm, body: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Work Details Modal */}
      <WorkModal work={selectedWork} onClose={() => setSelectedWork(null)} />

      {/* Service Details Modal */}
      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  );
};