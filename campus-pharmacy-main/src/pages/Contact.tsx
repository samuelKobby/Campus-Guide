import React, { useState, FC, FormEvent } from 'react';
import { MapPin, Mail, Phone, Clock, Send, User, MessageSquare, Star, Headphones, ShieldCheck, Zap, Users, Quote, CheckCircle } from 'lucide-react';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal';
import { useTheme } from '../context/ThemeContext';

export const Contact: FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const statsRef   = useStaggerReveal<HTMLDivElement>({ type: 'scaleUp', stagger: 0.12 });
  const channelRef = useStaggerReveal<HTMLDivElement>({ type: 'fadeUp',  stagger: 0.1 });
  const bentoRef   = useScrollReveal<HTMLDivElement>({ type: 'fadeIn',   duration: 0.9 });
  const quoteRef   = useScrollReveal<HTMLDivElement>({ type: 'fadeIn',   duration: 1 });
  const ctaRef     = useScrollReveal<HTMLDivElement>({ type: 'fadeIn',   duration: 0.9 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#F2ECFD] to-white dark:from-[#050816] dark:to-[#050816] overflow-x-hidden">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-[#f2ecfd] dark:bg-[#050816]">

          {/* Diagonal peach background - desktop only */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 30% 100%)',
                backgroundColor: '#f4c4d0'
              }}
            />
          </div>

          {/* Mobile background with image */}
          <div className="absolute inset-0 md:hidden flex items-center justify-center" style={{ backgroundColor: '#f4c4d0' }}>
            <img
              src="/images/12.webp"
              alt="Campus student"
              className="w-full h-full object-contain rounded-lg scale-[175%]"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Desktop layout */}
            <div className="hidden md:grid md:grid-cols-[1fr_2fr] md:items-center min-h-[750px]">

              {/* Left — title */}
              <div className="py-24 md:py-20 text-left">
                <h1 className="font-extrabold leading-none tracking-tight mb-6">
                  <span className="block text-6xl lg:text-7xl text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>Contact</span>
                  <span className="block text-6xl lg:text-7xl mt-1" style={{ fontFamily: "'Playfair Display','Georgia',serif", color: '#ff8575' }}>Us.</span>
                </h1>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed max-w-xs mb-8" style={{ fontFamily: "'Inter',system-ui,sans-serif" }}>
                  Your campus journey starts with a conversation. We're here every step of the way.
                </p>
                <div className="flex items-center justify-start gap-6 flex-wrap">
                  {[
                    { value: '24/7', label: 'Support' },
                    { value: '<1hr', label: 'Response' },
                    { value: '100%', label: 'Student Focused' },
                  ].map((s, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <div className="w-px h-8 bg-rose-300/60 dark:bg-rose-400/60" />}
                      <div>
                        <p className="text-xl font-extrabold text-gray-900 dark:text-white" style={{ fontFamily: "'Inter',system-ui,sans-serif" }}>{s.value}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5" style={{ fontFamily: "'Inter',system-ui,sans-serif" }}>{s.label}</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div className="mt-8 w-12 h-1.5 rounded-full bg-rose-400 dark:bg-rose-500" />
              </div>

              {/* Right — illustration (desktop only) */}
              <div className="flex relative items-end justify-end md:min-h-[660px] pb-6">
                <img
                  src="/images/12.webp"
                  alt="Campus student"
                  className="h-[480px] w-auto object-contain select-none ml-28 scale-110"
                  draggable={false}
                />
              </div>

            </div>

            {/* Mobile layout - Home page style */}
            <div className="md:hidden flex flex-col justify-center gap-36 px-2 min-h-[100vh]">
              <div>
                <h2 className={`font-bold tracking-tight text-left ${isDark ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontFamily: "'Playfair Display','Georgia',serif", fontSize: 'clamp(2.8rem, 12vw, 4.5rem)', lineHeight: 1.05 }}>
                  Get In<br/>Touch
                </h2>
              </div>

              <div className="text-center">
                {/* Empty center section to maintain spacing */}
              </div>

              <div>
                <h2 className={`font-bold tracking-tight text-right`}
                  style={{ fontFamily: "'Playfair Display','Georgia',serif", fontSize: 'clamp(2.8rem, 12vw, 4.5rem)', lineHeight: 1.05, color: '#ff8575' }}>
                  With<br/>Us.
                </h2>
              </div>
            </div>
          </div>

          {/* fade into page bg */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#F2ECFD] dark:from-[#050816] to-transparent z-20" />
        </div>

        {/* ── Contact Info Section ── */}
        <div className="bg-[#F2ECFD] dark:bg-[#050816] py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>Get in Touch</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">We're here to help you navigate campus life</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: MapPin,
                    title: 'Visit Us',
                    line1: 'Student Services Building',
                    line2: 'Room 204, Main Campus'
                  },
                  {
                    icon: Phone,
                    title: 'Call Us',
                    line1: '+1 (555) 123-GUIDE',
                    line2: 'Mon-Fri: 8AM - 6PM'
                  },
                  {
                    icon: Mail,
                    title: 'Email Us',
                    line1: 'help@campusguide.edu',
                    line2: 'We reply within 1 hour'
                  },
                  {
                    icon: Clock,
                    title: 'Office Hours',
                    line1: 'Mon-Fri: 8:00 AM - 6:00 PM',
                    line2: 'Sat: 10:00 AM - 4:00 PM'
                  },
                ].map(({ icon: Icon, title, line1, line2 }, i) => (
                  <div key={i} className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{line1}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{line2}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div className="bg-[#F2ECFD] dark:bg-[#050816]">
          <div className="container mx-auto px-4 pb-12 md:pb-16">
            <Parallax translateY={[-8, 8]}>
              <div ref={bentoRef as React.RefObject<HTMLDivElement>} className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[260px]">

                {/* A — large image card */}
                <div className="md:col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&q=80"
                    alt="Support"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-7 left-7">
                    <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase text-indigo-300 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" /> Dedicated Support
                    </span>
                    <h3 className="text-2xl font-extrabold text-white leading-snug" style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>
                      Real people.<br />Real answers.
                    </h3>
                  </div>
                </div>

                {/* B — stat card */}
                <div className="relative rounded-3xl bg-indigo-600 flex flex-col justify-between p-7 overflow-hidden">
                  <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <Zap className="w-8 h-8 text-indigo-200" />
                  <div>
                    <p className="text-6xl font-extrabold text-white mb-2" style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>&lt;1hr</p>
                    <p className="text-indigo-200 text-sm font-medium">Average response on weekdays</p>
                  </div>
                </div>

                {/* C — stat card */}
                <div className="relative rounded-3xl bg-white dark:bg-[#151030] flex flex-col justify-between p-7 overflow-hidden border border-gray-100 dark:border-white/5">
                  <Users className="w-8 h-8 text-indigo-500" />
                  <div>
                    <p className="text-6xl font-extrabold dark:text-white mb-2" style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>500<span className="text-indigo-500">+</span></p>
                    <p className="text-gray-500 dark:text-[#a09cb9] text-sm font-medium">Students helped every week</p>
                  </div>
                </div>

                {/* D — wide image card */}
                <div className="md:col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer">
                  <img
                    src="https://img.freepik.com/premium-photo/scooter-smartphone-man-city-night-texting-scroll-social-media-gps-map-technology-street-directions-modern-university-student-cellphone-text-message-mobile-web-communication_590464-101259.jpg"
                    alt="Campus life"
                    className="w-full h-full object-fill transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 via-indigo-900/30 to-transparent" />
                  <div className="absolute bottom-7 left-7">
                    <span className="text-xs font-bold tracking-[0.18em] uppercase text-indigo-300 block mb-2">Campus Life</span>
                    <h3 className="text-2xl font-extrabold text-white leading-snug max-w-xs" style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>
                      Woven into every part of campus.
                    </h3>
                  </div>
                </div>

              </div>
            </Parallax>
          </div>
        </div>

        {/* ── Full-bleed Banner — KEEP ── */}
        <div className="relative h-[460px] overflow-hidden">
          <Parallax translateY={[-20, 20]} className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
              alt="Campus community"
              className="w-full h-[520px] object-cover object-center"
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-12">
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-indigo-300 mb-4">Campus. Connected. Always.</span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5 max-w-xl" style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>
                Part of your<br />
                <span className="text-indigo-300">campus family</span>
              </h2>
              <p className="text-white/75 max-w-md text-lg leading-relaxed">
                From finding medicine to navigating buildings — we're woven into every part of your campus life.
              </p>
            </div>
          </div>
        </div>

        {/* ── Dark Editorial Quote Section ── */}
        <div className="bg-[#0a0820]">
          <div className="container mx-auto px-4 py-20 md:py-24">
            <Parallax translateY={[-10, 10]}>
              <div ref={quoteRef as React.RefObject<HTMLDivElement>} className="grid md:grid-cols-2 gap-12 items-center">

                {/* Quote */}
                <div>
                  <Quote className="w-12 h-12 text-indigo-400 mb-6 opacity-60" />
                  <blockquote className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-8">
                    "We built Campus Guide because no student should waste precious time hunting for help. You deserve answers — fast."
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500">
                      <img src="https://i.pravatar.cc/150?img=33" alt="Founder" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Samuel G. Fordjour</p>
                      <p className="text-indigo-400 text-xs uppercase tracking-widest">Founder & CEO</p>
                    </div>
                  </div>
                  {/* commitment list */}
                  <div className="mt-10 space-y-3">
                    {[
                      'Every message is read by a real person',
                      'No automated bot replies — ever',
                      'Your feedback shapes the product directly',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span className="text-sm text-gray-400">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div className="relative rounded-3xl overflow-hidden h-[420px]">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80"
                    alt="Student connected"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent" />
                  {/* floating stat badge */}
                  <div className="absolute top-6 right-6 bg-indigo-600 rounded-2xl px-4 py-3 text-center backdrop-blur-sm">
                    <p className="text-2xl font-extrabold text-white" style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>4.9★</p>
                    <p className="text-indigo-200 text-xs">Student Rating</p>
                  </div>
                </div>

              </div>
            </Parallax>
          </div>
        </div>

        {/* ── Contact Form — Last Section ── */}
        <div className="bg-[#F2ECFD] dark:bg-[#050816]">
          <div className="container mx-auto px-4 py-20 md:py-24">
            <Parallax translateY={[-6, 6]}>
              <div ref={ctaRef as React.RefObject<HTMLDivElement>} className="max-w-5xl mx-auto">

                <div className="text-center mb-14">
                  <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-indigo-500 mb-3">Drop us a line</span>
                  <h2 className="text-4xl md:text-5xl font-extrabold dark:text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display','Georgia',serif" }}>
                    Let's <span className="text-indigo-600 dark:text-indigo-400">Talk</span>
                  </h2>
                  <p className="text-gray-500 dark:text-[#a09cb9] max-w-md mx-auto">
                    Have a question, suggestion, or just want to say hi? We read every message.
                  </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0d0b2a] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all text-sm"
                            placeholder="Your name" required />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0d0b2a] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all text-sm"
                            placeholder="you@example.com" required />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Subject</label>
                      <input type="text" name="subject" value={formData.subject} onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white dark:bg-[#0d0b2a] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all text-sm"
                        placeholder="How can we help?" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Message</label>
                      <textarea name="message" value={formData.message} onChange={handleInputChange} rows={5}
                        className="w-full px-4 py-3 bg-white dark:bg-[#0d0b2a] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all resize-none text-sm"
                        placeholder="Tell us what's on your mind..." required />
                    </div>
                    <button type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 text-sm">
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                    {isSubmitted && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/20 rounded-xl text-green-700 dark:text-green-300 text-center text-sm">
                        <Star className="w-4 h-4 inline mr-2" />
                        Message sent! We'll get back to you soon.
                      </div>
                    )}
                  </form>

                  {/* Info */}
                  <div className="lg:col-span-2 space-y-8 pt-1">
                    {[
                      { icon: MapPin, title: 'Visit Us',     body: 'Student Services Building, Room 204\nMain Campus, University Drive' },
                      { icon: Phone,  title: 'Call Us',      body: '+1 (555) 123-GUIDE\n+1 (555) 123-4843' },
                      { icon: Mail,   title: 'Email Us',     body: 'help@campusguide.edu\nsupport@campusguide.edu' },
                      { icon: Clock,  title: 'Office Hours', body: 'Mon – Fri: 8:00 AM – 6:00 PM\nSat: 10:00 AM – 4:00 PM' },
                    ].map(({ icon: Icon, title, body }, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#0d0b2a] border border-gray-100 dark:border-white/5 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{title}</p>
                          <p className="text-sm text-gray-500 dark:text-[#a09cb9] whitespace-pre-line leading-relaxed">{body}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200 dark:border-white/10 flex flex-col gap-2">
                      <button className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-white dark:hover:bg-indigo-900/20 transition-all duration-200">
                        Live Chat Support
                      </button>
                      <button className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-white dark:hover:bg-indigo-900/20 transition-all duration-200">
                        FAQ & Help Center
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </Parallax>
          </div>
        </div>

      </div>
    </ParallaxProvider>
  );
};
