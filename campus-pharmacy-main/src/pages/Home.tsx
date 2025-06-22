import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/home/SearchBar';
import { LocationCategories } from '../components/home/LocationCategories';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import {
  MapPin, Compass, Zap, Users, Calendar, Coffee, BookOpen, Car, Navigation2, Star,Navigation,
  ArrowDown, Play, Globe, Target, Smartphone, ChevronRight, Clock, Shield, Award, Utensils, Hospital
} from 'lucide-react';
import { Link } from 'react-router-dom';
import VoiceAgent from '../components/VoiceAgent';  



  
  const campusZones = [
    { name: 'Academic Buildings', color: 'from-emerald-400 to-teal-600', path: '/category/academic', icon: BookOpen },
    { name: 'Student Centers', color: 'from-purple-400 to-indigo-600', path: '/category/student-centers', icon: Users },
    { name: 'Libraries', color: 'from-orange-400 to-red-600', path: '/category/libraries', icon: BookOpen },
    { name: 'Sports Facilities', color: 'from-blue-400 to-cyan-600', path: '/category/sports', icon: Target },
    { name: 'Dining Halls', color: 'from-pink-400 to-rose-600', path: '/category/dining', icon: Utensils },
    { name: 'Health Services', color: 'from-violet-400 to-purple-600', path: '/category/health', icon: Hospital }
  ];

  const features = [
    {
      icon: Navigation2,
      title: 'Instant Directions',
      description: 'Get turn-by-turn navigation to any location on campus in seconds',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Smartphone,
      title: 'AR Wayfinding',
      description: 'Use augmented reality to see directions overlaid on your camera view',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Clock,
      title: 'Live Schedules',
      description: 'Real-time updates on building hours, events, and room availability',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Target,
      title: 'Smart Suggestions',
      description: 'AI-powered recommendations based on your schedule and preferences',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const testimonials = [
    {
      name: 'Alex Rivera',
      role: 'Engineering Student',
      text: 'I used to be late to every class. Now I navigate campus like a pro!',
      avatar: '👨‍💻'
    },
    {
      name: 'Maya Patel',
      role: 'Graduate Researcher',
      text: 'The AR feature is incredible - it makes finding research labs so easy.',
      avatar: '👩‍🔬'
    },
    {
      name: 'Jordan Kim',
      role: 'Campus Tour Guide',
      text: 'This app revolutionized how I give campus tours to prospective students.',
      avatar: '👨‍🎓'
    }
  ];

export const Home: React.FC = () => {

  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Auto-rotating testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const heroParallax = scrollY * 0.2;
  const bgParallax = scrollY * 0.1;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
          
          {/* Dynamic Background with Mouse Interaction */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div 
              className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"
              style={{ 
                left: `${20 + mousePosition.x * 0.02}%`,
                top: `${10 + mousePosition.y * 0.02}%`,
                transform: `translate(-50%, -50%) translateY(${bgParallax}px)`
              }}
            />
            <div 
              className="absolute w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"
              style={{ 
                right: `${15 + mousePosition.x * -0.01}%`,
                top: `${30 + mousePosition.y * 0.015}%`,
                transform: `translate(50%, -50%) translateY(${-bgParallax}px)`
              }}
            />
            <div 
              className="absolute w-72 h-72 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"
              style={{ 
                left: `${60 + mousePosition.x * 0.01}%`,
                bottom: `${20 + mousePosition.y * -0.01}%`,
                transform: `translate(-50%, 50%) translateY(${bgParallax * 0.5}px)`
              }}
            />
          </div>
    
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
            <Link to="https://bolt.new" className="absolute top-8 right-8 z-10" target="_blank" rel="noopener noreferrer">
              <img 
                src="/images/black_circle_360x360.png" 
                alt="Campus Guide Logo" 
                className="w-16 h-16 hover:scale-110 transition-transform duration-300"
              />
            </Link>
            <div 
              className="absolute inset-0 bg-[radial-gradient(circle,rgba(139,69,193,0.3)_0%,transparent_70%)]"
              style={{ transform: `translateY(${heroParallax}px)` }}
            />
            <HeroSlideshow />
            <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
              <div className="mb-8 inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-white font-medium">Powered by Advanced AI Navigation</span>
              </div>
              
              <h1 className="text-5xl font-bold mb-6 text-white">
                Find Your Way Around Campus
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-300 mb-20 max-w-4xl mx-auto leading-relaxed">
                Never get lost again. Discover the smartest way to navigate your university. 
                
              </p>
    
              <SearchBar />
              <div className="flex justify-center space-x-6 mt-16">
                <button className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4 hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <MapPin className="w-6 h-6 text-white group-hover:text-blue-300" />
                </button>
                <button className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4 hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <Navigation className="w-6 h-6 text-white group-hover:text-purple-300" />
                </button>
                <button className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4 hover:bg-white/20 transition-all duration-300 hover:scale-110">
                  <Clock className="w-6 h-6 text-white group-hover:text-pink-300" />
                </button>
              </div>
            </div>

            

          </section>
    
          {/* Campus Zones Section */}
          <section className="py-14 relative">
            <div className="container mx-auto px-6">
              
    
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-[-80px]">
                {campusZones.map((zone, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-700 hover:scale-105"
                    style={{
                      animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${zone.color} opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
                    
                    <div className="relative p-8">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${zone.color} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                        <zone.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-3">{zone.name}</h3>
                      
                      <Link to={zone.path}>
                        <div className="flex items-center text-cyan-400 group-hover:text-white transition-colors duration-300">
                          <span className="font-medium">Discover Zone</span>
                          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
    
          {/* Features Showcase */}
          <section className="py-32 relative">
            <div className="container mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Revolutionary Features
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Experience navigation like never before with cutting-edge technology that adapts to your needs.
                </p>
              </div>
    
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group relative"
                    style={{
                      animation: `slideInLeft 0.8s ease-out ${index * 0.2}s both`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl blur-xl"
                         style={{background: `linear-gradient(to right, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})`}} />
                    
                    <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-white/20 transition-all duration-700 hover:scale-105">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r ${feature.color} mb-8 group-hover:scale-110 transition-transform duration-500`}>
                        <feature.icon className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-3xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-gray-400 text-lg leading-relaxed">{feature.description}</p>
                      
                      <div className="mt-8 flex items-center text-cyan-400 group-hover:text-white transition-colors duration-300">
                        <span className="font-semibold">Learn More</span>
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
    
          {/* Stats Section */}
          <section className="py-32 relative">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { number: '95%', label: 'Navigation Accuracy', color: 'from-green-400 to-emerald-600' },
                  { number: '30K+', label: 'Daily Users', color: 'from-blue-400 to-cyan-600' },
                  { number: '2.5M', label: 'Directions Given', color: 'from-purple-400 to-pink-600' },
                  { number: '4.9★', label: 'User Rating', color: 'from-yellow-400 to-orange-600' }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className={`text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-300 text-lg font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
    
          {/* Testimonials Carousel */}
          <section className="py-32 relative">
            <div className="container mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Student Stories
                </h2>
                <p className="text-xl text-gray-400">Real experiences from real students</p>
              </div>
    
              <div className="relative max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                  <div className="text-center">
                    <div className="text-6xl mb-6">{testimonials[currentSlide].avatar}</div>
                    <blockquote className="text-2xl text-white mb-8 font-medium italic">
                      "{testimonials[currentSlide].text}"
                    </blockquote>
                    <div>
                      <div className="text-xl font-bold text-white">{testimonials[currentSlide].name}</div>
                      <div className="text-gray-400">{testimonials[currentSlide].role}</div>
                    </div>
                  </div>
                </div>
    
                {/* Carousel Indicators */}
                <div className="flex justify-center mt-8 space-x-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-cyan-400 scale-125' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
    
          {/* Final CTA */}
          <section className="py-32 relative">
            <div className="container mx-auto px-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full" />
                <div className="relative">
                  <h2 className="text-7xl font-black mb-8 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                    Start Your Journey
                  </h2>
                  <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                    Join thousands of students who've transformed their campus experience. 
                    Never be late, never be lost, never be confused again.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-16 py-6 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105">
                      <span className="relative z-10">Get Started Free</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                    
                    <button className="group text-white text-2xl font-semibold hover:text-cyan-300 transition-colors duration-300 flex items-center">
                      Download App
                      <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <VoiceAgent />
          </section>
    
          
    
          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes slideInLeft {
              from {
                opacity: 0;
                transform: translateX(-50px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
  );
};  