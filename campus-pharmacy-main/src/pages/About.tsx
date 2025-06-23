import React, { useEffect, useRef } from 'react';
import { Clock, MapPin, ShieldCheck, User } from 'lucide-react';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import VoiceAgent from '../components/VoiceAgent';

export const About: React.FC = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teamMembers = [
    { name: 'Samuel Gyasi Fordjour', role: 'Backend Developer' },
    
  ];
  
  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#F2ECFD] to-white">
        {/* Hero Section with Video Background */}
        <div className="relative h-[770px] overflow-hidden ">
          <div className="absolute inset-0  h-full z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/images/vid.mp4" type="video/mp4" />
            </video>
          </div>
          
          
        </div>

        {/* Main Content */}
        <div className="bg-[#F2ECFD]">
          <div className="container mx-auto px-4 py-12 md:py-16">
            
            <Parallax translateY={[-20, 20]}>
              {/* Value Propositions */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                  { 
                    icon: <Clock className="w-8 h-8" />,
                    title: 'Real-Time Updates',
                    description: 'Instant medication availability and pricing information'
                  },
                  { 
                    icon: <MapPin className="w-8 h-8" />,
                    title: 'Easy Navigation',
                    description: 'Turn-by-turn directions to nearest pharmacies'
                  },
                  { 
                    icon: <ShieldCheck className="w-8 h-8" />,
                    title: 'Verified Information',
                    description: 'All pharmacies and medications are thoroughly verified'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </section>
            </Parallax>

            <Parallax scale={[0.9, 1]}>
              {/* Mission Statement */}
              <section className="mb-16 bg-white rounded-2xl p-8 md:p-12 shadow-sm">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-lg text-gray-700 mb-8">
                    We're dedicated to ensuring students have immediate access to accurate medication availability information, creating a seamless experience that eliminates the hassle of pharmacy searches.
                  </p>
                  <div className="bg-gray-100 rounded-xl p-6 text-left">
                    <p className="text-gray-700 italic">
                      "Our goal is to save students valuable time and reduce stress by providing real-time medication availability at campus pharmacies."
                    </p>
                  </div>
                </div>
              </section>
            </Parallax>

            <Parallax translateY={[20, -20]}>
              {/* How It Works */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
                <div className="relative">
                  <div className="absolute h-full w-0.5 bg-gray-200 left-1/2 transform -translate-x-1/2 hidden md:block"></div>
                  <div className="grid md:grid-cols-4 gap-8">
                    {[
                      { step: 1, title: 'Search', description: 'Search for your location or a Medication' },
                      { step: 2, title: 'Locate', description: 'See your location or you medications' },
                      { step: 3, title: 'Navigate', description: 'Get directions to your location or the available pharmacies' },
                      { step: 4, title: 'Purchase', description: 'Get your medication' }
                    ].map((item, index) => (
                      <div key={item.step} className="flex flex-col items-center text-center relative">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-4 text-lg font-bold z-10">
                          {item.step}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Parallax>

     

            <Parallax translateY={[-10, 10]}>
              {/* Team Section */}
              <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { name: "Samuel G. Fordjour", role: "Founder & CEO", image: "/images/4.jpg" }, // Update with actual image path
                    { name: "Bolt AI", role: "Lead Developer", image: "/images/2.png" }, // Update with actual image path
                    { name: "ChatGPT", role: "Product Designer", image: "/images/3.png" } // Update with actual image path
                  ].map((member, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
                    </div>
                  ))}
                </div>
              </section>
            </Parallax>
          </div>
        </div>
        <VoiceAgent />
      </div>
    </ParallaxProvider>
  );
};