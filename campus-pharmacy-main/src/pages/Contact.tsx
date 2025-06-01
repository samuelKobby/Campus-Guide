import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { FC } from 'react';

export const Contact: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Profile images for floating circles
  const profiles = [
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/women/3.jpg',
    'https://randomuser.me/api/portraits/men/4.jpg',
    'https://randomuser.me/api/portraits/women/5.jpg'
  ];

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 mt-[-100px] ml-[-130px] mr-[-130px]">
      {/* Hero Section with Search */}
      <div className="relative h-[480px] flex items-center inset-0 bg-gradient-to-r from-blue-300 to-blue-500 overflow-hidden">
      
      {/* Decorative circles */}
      <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full top-10 left-[-100px] z-0"></div>
      <div className="absolute w-64 h-64 bg-white opacity-10 rounded-full bottom-[-50px] right-[-80px] z-0"></div>
      <div className="absolute w-48 h-48 bg-white opacity-10 rounded-full bottom-20 left-[20%] z-0"></div>

      {/* Floating circular images */}
      <div className="absolute w-full z-10 h-[410px] mt-[550px]">
        {profiles.map((img, index) => (
          <div
            key={index}
            className={`absolute w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg 
              ${index === 0 ? 'top-[25%] left-[15%]' : ''}
              ${index === 1 ? 'top-[35%] left-[25%]' : ''}
              ${index === 2 ? 'top-[45%] left-[45%]' : ''}
              ${index === 3 ? 'top-[25%] right-[25%]' : ''}
              ${index === 4 ? 'top-[35%] right-[15%]' : ''}
            `}
            style={{
              animation: `float ${4 + index}s ease-in-out infinite`,
              animationDelay: `${index * 0.7}s`,
              transform: 'scale(1)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src={img} alt="Team member" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 text-white">Contact</h1>
        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
          Let's start something great together. Get in touch with one of the team today!
        </p>
        <div className="animate-bounce text-white text-3xl">&#8595;</div>
      </div>
    </div>

    {/* SVG wave */}
      <div className="absolute left-0 right-0 overflow-hidden ">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[120px]"
        >
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#93c5fd" /> {/* blue-300 */}
              <stop offset="100%" stopColor="#3b82f6" /> {/* blue-500 */}
            </linearGradient>
          </defs>
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="url(#blueGradient)"
          ></path>
        </svg>
      </div>


      <div className="bg-white py-10 mt-[120px] px-4 relative z-10">
      <div className="container mx-auto">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in touch</h2>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-50 p-3 rounded-full">
                <FaPhone className="text-blue-600 w-6 h-6" />
              </div>
              <div className="text-gray-600">
                <p>Phone: +233 55 123 4567</p>
                <p>Email: <a href="mailto:info@campuspharmacyfinder.com" className="text-blue-600 hover:text-blue-800">info@campuspharmacyfinder.com</a></p>
                <p>Address: University of Ghana, Legon</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>
            
            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
       


  );
};

export default Contact;