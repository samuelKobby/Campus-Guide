import React from 'react';
import { Star, Quote, Zap, Globe } from 'lucide-react';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';

export const About: React.FC = () => {
  const missionRef      = useScrollReveal<HTMLElement>({ type: 'fadeIn', duration: 1 });
  const stepsRef        = useStaggerReveal<HTMLDivElement>({ type: 'scaleUp', stagger: 0.15 });
  const testimonialsRef = useStaggerReveal<HTMLDivElement>({ type: 'fadeUp', stagger: 0.2 });

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#F2ECFD] to-white dark:from-[#050816] dark:to-[#050816] overflow-x-hidden">

        {/* ── Hero Video ── */}
        <div className="relative w-full aspect-video max-h-[770px] min-h-[240px] overflow-hidden">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/images/vid.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ── Main Content ── */}
        <div className="bg-[#F2ECFD] dark:bg-[#050816]">
          <div className="container mx-auto px-4 py-12 md:py-16">

            {/* ── Our Story ── */}
            <Parallax translateY={[-10, 10]}>
              <section className="mb-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Text */}
                  <div>
                    <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3">Our Story</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 dark:text-white leading-tight">
                      Born from a<br />
                      <span className="text-indigo-600 dark:text-indigo-400">Campus Struggle</span>
                    </h2>
                    <p className="text-gray-600 dark:text-[#a09cb9] mb-5 text-lg leading-relaxed">
                      It started with a simple problem — a student running between pharmacies on campus, only to find the medicine they needed was out of stock. Again. That frustration sparked an idea.
                    </p>
                    <p className="text-gray-600 dark:text-[#a09cb9] mb-5 leading-relaxed">
                      Campus Guide was built to eliminate that guesswork. We mapped every campus pharmacy, catalogued their inventory, and built a smart search layer on top — so students spend less time searching and more time recovering.
                    </p>
                    <p className="text-gray-600 dark:text-[#a09cb9] leading-relaxed">
                      Today, hundreds of students rely on us every day. We're not just a directory — we're a campus companion.
                    </p>
                  </div>
                  {/* 3D Image */}
                  <div className="flex justify-center" style={{ perspective: '1000px' }}>
                    <div
                      className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
                      style={{ transform: 'rotateY(-10deg) rotateX(4deg)', transformStyle: 'preserve-3d', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'rotateY(-2deg) rotateX(1deg) scale(1.03)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'rotateY(-10deg) rotateX(4deg)')}
                    >
                      <img src="/images/9.png" alt="Our Story" className="w-full h-[400px] object-cover" />
                      <div className="absolute bottom-6 left-6 text-white drop-shadow-md">
                        <p className="text-xs font-medium opacity-80 uppercase tracking-widest mb-1">Founder & CEO</p>
                        <p className="text-2xl font-extrabold">Samuel G. Fordjour</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </Parallax>

            {/* ── Mission Statement ── */}
            <Parallax scale={[0.9, 1]}>
              <section
                ref={missionRef as React.RefObject<HTMLElement>}
                className="mb-20 bg-white dark:bg-[#151030] rounded-2xl p-8 md:p-12 shadow-sm"
              >
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-6 dark:text-white">Our Mission</h2>
                  <p className="text-lg text-gray-700 dark:text-[#a09cb9] mb-8">
                    We're dedicated to ensuring students have immediate access to accurate medication availability information, creating a seamless experience that eliminates the hassle of pharmacy searches.
                  </p>
                  <div className="bg-gray-100 dark:bg-[#0a0820] rounded-xl p-6 text-left">
                    <p className="text-gray-700 dark:text-[#a09cb9] italic">
                      "Our goal is to save students valuable time and reduce stress by providing real-time medication availability at campus pharmacies."
                    </p>
                  </div>
                </div>
              </section>
            </Parallax>

            {/* ── Feature Showcase 1: Image Left / Text Right ── */}
            <Parallax translateY={[-15, 15]}>
              <section className="mb-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* 3D Image left */}
                  <div className="flex justify-center order-2 md:order-1" style={{ perspective: '900px' }}>
                    <div
                      className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                      style={{ transform: 'rotateY(10deg) rotateX(-3deg)', transformStyle: 'preserve-3d', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'rotateY(2deg) rotateX(-1deg) scale(1.03)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'rotateY(10deg) rotateX(-3deg)')}
                    >
                      <img src="/images/2.png" alt="Find Medicines" className="w-full h-[360px] object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-transparent" />
                    </div>
                  </div>
                  {/* Text right */}
                  <div className="order-1 md:order-2">
                    <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3">
                      <Zap className="w-4 h-4" /> Instant Access
                    </span>
                    <h2 className="text-4xl font-extrabold mb-6 dark:text-white leading-tight">
                      Find What You Need,<br />
                      <span className="text-indigo-600 dark:text-indigo-400">Right Now</span>
                    </h2>
                    <p className="text-gray-600 dark:text-[#a09cb9] mb-6 leading-relaxed">
                      Search across every campus pharmacy in seconds. Our smart search understands generic names, brand names, and even common student terms — so you always find what you're looking for.
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Live stock availability',
                        'Price comparisons across pharmacies',
                        'Alternative medicine suggestions',
                        'Operating hours at a glance',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-[#a09cb9]">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </Parallax>

            {/* ── Feature Showcase 2: Text Left / Image Right ── */}
            <Parallax translateY={[15, -15]}>
              <section className="mb-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Text left */}
                  <div>
                    <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3">
                      <Globe className="w-4 h-4" /> Navigation
                    </span>
                    <h2 className="text-4xl font-extrabold mb-6 dark:text-white leading-tight">
                      Navigate Campus<br />
                      <span className="text-indigo-600 dark:text-indigo-400">Like a Pro</span>
                    </h2>
                    <p className="text-gray-600 dark:text-[#a09cb9] mb-5 leading-relaxed">
                      Never get lost again. Campus Guide maps every study spot, canteen, health center, and service point on campus — with live walking directions from wherever you are.
                    </p>
                    <p className="text-gray-600 dark:text-[#a09cb9] leading-relaxed">
                      Our interactive map updates in real time, so even new layouts and temporary facilities are always shown correctly.
                    </p>
                  </div>
                  {/* 3D Image right */}
                  <div className="flex justify-center" style={{ perspective: '900px' }}>
                    <div
                      className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                      style={{ transform: 'rotateY(-10deg) rotateX(3deg)', transformStyle: 'preserve-3d', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'rotateY(-2deg) rotateX(1deg) scale(1.03)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'rotateY(-10deg) rotateX(3deg)')}
                    >
                      <img src="/images/12.avif" alt="Navigate Campus" className="w-full h-[360px] object-cover" />
                    </div>
                  </div>
                </div>
              </section>
            </Parallax>

            {/* ── How It Works ── */}
            <Parallax translateY={[20, -20]}>
              <section className="mb-20">
                <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">How It Works</h2>
                <div className="relative">
                  <div className="absolute h-full w-0.5 bg-gray-200 dark:bg-[#151030] left-1/2 transform -translate-x-1/2 hidden md:block" />
                  <div ref={stepsRef} className="grid md:grid-cols-4 gap-8">
                    {[
                      { step: 1, title: 'Search', description: 'Search for your location or a medication' },
                      { step: 2, title: 'Locate', description: 'See your location or your medications' },
                      { step: 3, title: 'Navigate', description: 'Get directions to your location or the available pharmacies' },
                      { step: 4, title: 'Purchase', description: 'Get your medication without the runaround' },
                    ].map((item) => (
                      <div key={item.step} className="flex flex-col items-center text-center relative">
                        <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full flex items-center justify-center mb-4 text-lg font-bold z-10">
                          {item.step}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 dark:text-white">{item.title}</h3>
                        <p className="text-gray-600 dark:text-[#a09cb9]">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Parallax>

            {/* ── 3D Image Gallery ── */}
            <Parallax translateY={[-12, 12]}>
              <section className="mb-20">
                <div className="text-center mb-12">
                  <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3">Gallery</span>
                  <h2 className="text-3xl font-bold dark:text-white">Life on Campus</h2>
                  <p className="text-gray-600 dark:text-[#a09cb9] mt-3 max-w-xl mx-auto">
                    A glimpse into the places and people Campus Guide helps connect every day.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
                  {[
                    { img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80', label: 'Campus Pharmacy', sub: 'KNUST Main Campus', rotate: 'rotateY(-8deg) rotateX(4deg)' },
                    { img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80', label: 'Medicine Search', sub: 'Real-Time Inventory', rotate: 'rotateY(0deg) rotateX(-5deg) scale(1.04)' },
                    { img: '/images/map.jpeg', label: 'Navigate Easy', sub: 'Interactive Map', rotate: 'rotateY(8deg) rotateX(4deg)' },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                      style={{ transform: card.rotate, transformStyle: 'preserve-3d', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1.06)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = card.rotate)}
                    >
                      <img src={card.img} alt={card.label} className="w-full h-[260px] object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-5 left-5 text-white">
                        <p className="text-xs opacity-70 uppercase tracking-widest mb-1">{card.sub}</p>
                        <p className="text-lg font-bold">{card.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </Parallax>

            {/* ── Testimonials / Ratings ── */}
            <Parallax translateY={[-10, 10]}>
              <section className="mb-20">
                <style>{`
                  @keyframes marquee-left  { from { transform: translateX(0) } to { transform: translateX(-50%) } }
                  @keyframes marquee-right { from { transform: translateX(-50%) } to { transform: translateX(0) } }
                  .marquee-left  { animation: marquee-left  14s linear infinite; }
                  .marquee-right { animation: marquee-right 14s linear infinite; }
                `}</style>

                {/* Header */}
                <div className="text-center mb-12">
                  <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3">Student Reviews</span>
                  <h2 className="text-3xl font-bold dark:text-white">What Students Say</h2>
                  <div className="flex justify-center items-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-3 text-gray-600 dark:text-[#a09cb9] font-semibold">4.9 / 5 &nbsp;·&nbsp; 200+ reviews</span>
                  </div>
                </div>

                {/* Marquee wrapper — clips overflow and adds edge fades */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                  }}
                >
                  {/* Row 1 — scrolls LEFT */}
                  <div className="flex gap-5 mb-5 marquee-left" style={{ width: 'max-content' }}>
                    {[
                      { handle: '@AbenaK_300', img: 'https://i.pravatar.cc/150?img=16', text: "I used to walk to three pharmacies before finding my medication. Now I check Campus Guide first and go straight to the right one. Total lifesaver!" },
                      { handle: '@KofiM_Eng',  img: 'https://i.pravatar.cc/150?img=12', text: "The navigation feature is brilliant. I'm new on campus and I found the health center on my very first try. UI is super clean." },
                      { handle: '@AmaS_Biz',   img: 'https://i.pravatar.cc/150?img=47', text: "Love that it shows opening hours and stock together. Saved me so much time during exam season when I couldn't search around." },
                      { handle: '@Kwame_Pharm',img: 'https://i.pravatar.cc/150?img=33', text: "Found a pharmacy open at 10 PM in under a minute. No cap, this app is built for students who actually need things fast." },
                      { handle: '@EfiaSci',    img: 'https://i.pravatar.cc/150?img=23', text: "The prescription upload feature blew my mind. Sent it, got confirmation of availability. Done. Didn't even have to leave my room." },
                      { handle: '@NanaB_Arts', img: 'https://i.pravatar.cc/150?img=11', text: "Compared prices across two pharmacies, saved GH₵8. Small thing but it adds up when you're a broke student." },
                      // duplicate for seamless loop
                      { handle: '@AbenaK_300', img: 'https://i.pravatar.cc/150?img=16', text: "I used to walk to three pharmacies before finding my medication. Now I check Campus Guide first and go straight to the right one. Total lifesaver!" },
                      { handle: '@KofiM_Eng',  img: 'https://i.pravatar.cc/150?img=12', text: "The navigation feature is brilliant. I'm new on campus and I found the health center on my very first try. UI is super clean." },
                      { handle: '@AmaS_Biz',   img: 'https://i.pravatar.cc/150?img=47', text: "Love that it shows opening hours and stock together. Saved me so much time during exam season when I couldn't search around." },
                      { handle: '@Kwame_Pharm',img: 'https://i.pravatar.cc/150?img=33', text: "Found a pharmacy open at 10 PM in under a minute. No cap, this app is built for students who actually need things fast." },
                      { handle: '@EfiaSci',    img: 'https://i.pravatar.cc/150?img=23', text: "The prescription upload feature blew my mind. Sent it, got confirmation of availability. Done. Didn't even have to leave my room." },
                      { handle: '@NanaB_Arts', img: 'https://i.pravatar.cc/150?img=11', text: "Compared prices across two pharmacies, saved GH₵8. Small thing but it adds up when you're a broke student." },
                    ].map((r, i) => (
                      <div key={i} className="w-[280px] flex-shrink-0 bg-white dark:bg-[#151030] rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/5 flex flex-col justify-between">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">{r.text}</p>
                        <div className="flex items-center gap-3">
                          <img src={r.img} alt={r.handle} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-500 dark:text-[#a09cb9]">{r.handle}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Row 2 — scrolls RIGHT */}
                  <div className="flex gap-5 marquee-right" style={{ width: 'max-content' }}>
                    {[
                      { handle: '@OseiMed2',   img: 'https://i.pravatar.cc/150?img=52', text: "Finally an app that knows what's in stock before I even walk there. Every student clinic should have this." },
                      { handle: '@YaaLaw400',  img: 'https://i.pravatar.cc/150?img=44', text: "Shared it with my whole hall. Three people already used it during the flu wave. We all got our meds without any drama." },
                      { handle: '@Baffour_IT', img: 'https://i.pravatar.cc/150?img=15', text: "As an IT student I respect the build quality. Fast, no bugs, does exactly what it says. Rare for a campus app." },
                      { handle: '@Akosua_Sci', img: 'https://i.pravatar.cc/150?img=49', text: "The dark mode is everything. Using Campus Guide at night before bed to check if the pharmacy opens early — and it just works perfectly." },
                      { handle: '@DwobengK',   img: 'https://i.pravatar.cc/150?img=22', text: "Directions took me straight there. No confusion, no asking around. Just opened the app and walked to the door." },
                      { handle: '@MaameE_300', img: 'https://i.pravatar.cc/150?img=38', text: "I didn't know half the pharmacies on campus existed until Campus Guide showed me. There's one 2 mins from my hostel!" },
                      // duplicate for seamless loop
                      { handle: '@OseiMed2',   img: 'https://i.pravatar.cc/150?img=52', text: "Finally an app that knows what's in stock before I even walk there. Every student clinic should have this." },
                      { handle: '@YaaLaw400',  img: 'https://i.pravatar.cc/150?img=44', text: "Shared it with my whole hall. Three people already used it during the flu wave. We all got our meds without any drama." },
                      { handle: '@Baffour_IT', img: 'https://i.pravatar.cc/150?img=15', text: "As an IT student I respect the build quality. Fast, no bugs, does exactly what it says. Rare for a campus app." },
                      { handle: '@Akosua_Sci', img: 'https://i.pravatar.cc/150?img=49', text: "The dark mode is everything. Using Campus Guide at night before bed to check if the pharmacy opens early — and it just works perfectly." },
                      { handle: '@DwobengK',   img: 'https://i.pravatar.cc/150?img=22', text: "Directions took me straight there. No confusion, no asking around. Just opened the app and walked to the door." },
                      { handle: '@MaameE_300', img: 'https://i.pravatar.cc/150?img=38', text: "I didn't know half the pharmacies on campus existed until Campus Guide showed me. There's one 2 mins from my hostel!" },
                    ].map((r, i) => (
                      <div key={i} className="w-[280px] flex-shrink-0 bg-white dark:bg-[#151030] rounded-2xl p-6 shadow-md border border-gray-100 dark:border-white/5 flex flex-col justify-between">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">{r.text}</p>
                        <div className="flex items-center gap-3">
                          <img src={r.img} alt={r.handle} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-500 dark:text-[#a09cb9]">{r.handle}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </Parallax>


          </div>
        </div>
      </div>
    </ParallaxProvider>
  );
};