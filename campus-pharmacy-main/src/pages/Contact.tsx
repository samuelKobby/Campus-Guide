import React, { useState, useEffect, FC, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { MapPin, Mail, Phone, Clock, Send, User, MessageSquare, Star, Sparkles, Navigation, Info, Headphones } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export const Contact: FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const bgParallax = scrollY * 0.1;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section with Background */}
      <div className="relative min-h-[500px] md:min-h-[600px] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-purple-600 to-pink-600" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
          
          {/* Animated Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl"
              style={{ 
                left: `${20 + mousePosition.x * 0.02}%`,
                top: `${10 + mousePosition.y * 0.02}%`,
                transform: `translate(-50%, -50%) translateY(${bgParallax}px)`
              }}
            />
            <div 
              className="absolute w-80 h-80 bg-white/3 rounded-full blur-3xl"
              style={{ 
                right: `${15 + mousePosition.x * -0.01}%`,
                top: `${30 + mousePosition.y * 0.015}%`,
                transform: `translate(50%, -50%) translateY(${-bgParallax}px)`
              }}
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-12 md:pb-20 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Icon Row */}
            <div className="flex items-center justify-center mb-6 md:mb-8 space-x-3 sm:space-x-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm"
              >
                <MessageSquare className="h-7 w-7 sm:h-10 sm:w-10 text-white" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm"
              >
                <Headphones className="h-7 w-7 sm:h-10 sm:w-10 text-white" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm"
              >
                <MapPin className="h-7 w-7 sm:h-10 sm:w-10 text-white" />
              </motion.div>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight"
            >
              Get in Touch
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-6 md:mb-10 px-4"
            >
              Your campus journey starts with a conversation. We're here to help you navigate 
              every step of your academic adventure.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-sm text-white/80">Support Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">&lt;1hr</div>
                <div className="text-sm text-white/80">Response Time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-sm text-white/80">Student Focused</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 w-full h-16 md:h-20 bg-gradient-to-t from-[#F2ECFD] dark:from-[#050816] to-transparent" />
      </div>

      {/* Main Content Section with Dynamic Background */}
      <div className="bg-gradient-to-b from-[#F2ECFD] to-white dark:from-[#050816] dark:to-[#0a0a2a] relative">
        {/* Dynamic Background with Mouse Interaction */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 dark:from-cyan-400/10 dark:to-blue-400/10 rounded-full blur-3xl animate-pulse"
            style={{ 
              left: `${20 + mousePosition.x * 0.02}%`,
              top: `${50 + mousePosition.y * 0.02}%`,
              transform: `translate(-50%, -50%) translateY(${bgParallax}px)`
            }}
          />
          <div 
            className="absolute w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-400/10 dark:to-pink-400/10 rounded-full blur-3xl animate-pulse"
            style={{ 
              right: `${15 + mousePosition.x * -0.01}%`,
              bottom: `${30 + mousePosition.y * 0.015}%`,
              transform: `translate(50%, 50%) translateY(${-bgParallax}px)`
            }}
          />
        </div>

        {/* Main Content */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12 md:pb-20 pt-4 md:pt-8">
          <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            
            {/* Contact Form */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 transition-all duration-500">
              <div className="flex items-center mb-6 sm:mb-8">
                <MessageSquare className="h-6 w-6 text-cyan-600 dark:text-cyan-400 mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/60 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-cyan-400/50 focus:border-cyan-500/50 dark:focus:border-cyan-400/50 transition-all duration-300"
                        placeholder="Your name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/60 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-cyan-400/50 focus:border-cyan-500/50 dark:focus:border-cyan-400/50 transition-all duration-300"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-cyan-400/50 focus:border-cyan-500/50 dark:focus:border-cyan-400/50 transition-all duration-300"
                    placeholder="How can we help you today?"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-cyan-400/50 focus:border-cyan-500/50 dark:focus:border-cyan-400/50 transition-all duration-300 resize-none"
                    placeholder="Tell us more about what you need help with..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
              
              {isSubmitted && (
                <div className="mt-6 p-4 bg-green-500/20 dark:bg-green-500/10 border border-green-500/30 dark:border-green-500/20 rounded-xl text-green-700 dark:text-green-300 text-center">
                  <Star className="h-5 w-5 inline mr-2" />
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-6 md:space-y-8">
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-2xl hover:shadow-cyan-500/20 dark:hover:shadow-cyan-500/10 transition-all duration-500">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                  <Info className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
                  Campus Guide Hub
                </h2>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="group flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-purple-50 dark:hover:from-cyan-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:shadow-lg">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Visit Us</h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Student Services Building<br />Room 204, Main Campus<br />University Drive, Campus City</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-purple-50 dark:hover:from-cyan-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:shadow-lg">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Call Us</h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">+1 (555) 123-GUIDE<br />+1 (555) 123-4843</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-purple-50 dark:hover:from-cyan-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:shadow-lg">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Email Us</h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">help@campusguide.edu<br />support@campusguide.edu</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-purple-50 dark:hover:from-cyan-950/20 dark:hover:to-purple-950/20 transition-all duration-300 hover:shadow-lg">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Office Hours</h3>
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Monday - Friday: 8:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Help Section */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-600/10 dark:from-cyan-600/20 dark:to-purple-600/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 hover:shadow-lg transition-all duration-500">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-yellow-400 mr-2" />
                  Need Immediate Help?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
                  Can't wait for a response? Check out our quick help resources or connect with our live chat support.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-white/60 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white py-3 px-4 rounded-xl transition-all duration-300 text-sm font-medium border border-gray-200 dark:border-white/10 hover:scale-105 transform hover:shadow-md">
                    Live Chat Support
                  </button>
                  <button className="flex-1 bg-white/60 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white py-3 px-4 rounded-xl transition-all duration-300 text-sm font-medium border border-gray-200 dark:border-white/10 hover:scale-105 transform hover:shadow-md">
                    FAQ & Help Center
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

    </div>
  );
};
