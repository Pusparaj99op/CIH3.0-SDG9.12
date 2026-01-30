'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import BondCard from './components/BondCard';
import { Bond, fetchBonds, getBondId } from './data/bonds';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import {
  fadeInStagger,
  scrollFadeIn,
  animateCounter,
  prefersReducedMotion,
  isMobile,
} from '@/lib/animations';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  uptime: number;
}

// 3D Floating Bond Component
function FloatingBond({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[-0.5, 0.5]}
    >
      <mesh position={position} castShadow>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <MeshDistortMaterial
          color={color}
          speed={1}
          distort={0.3}
          radius={1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

// 3D Hero Scene
function HeroScene() {
  if (isMobile() || prefersReducedMotion()) return null;

  return (
    <div className="absolute inset-0 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3b82f6" />
        
        {/* Floating bonds in 3D space */}
        <FloatingBond position={[-3, 2, 0]} color="#6366f1" />
        <FloatingBond position={[3, 1, -1]} color="#8b5cf6" />
        <FloatingBond position={[0, -1, 1]} color="#3b82f6" />
        <FloatingBond position={[-2, -2, -0.5]} color="#ec4899" />
        <FloatingBond position={[2, 3, 0.5]} color="#10b981" />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [bondsLoading, setBondsLoading] = useState(true);

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const bondsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check backend health
    fetch('http://localhost:3210/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth(null));

    // Fetch bonds
    fetchBonds()
      .then((data) => setBonds(data.slice(0, 6)))
      .catch(() => setBonds([]))
      .finally(() => setBondsLoading(false));
  }, []);

  // GSAP Animations
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // Hero title animation with split text effect
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      gsap.from(heroTitle, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
      gsap.from(heroSubtitle, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out',
      });
    }

    // Animate hero CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-cta-btn');
    if (ctaButtons.length) {
      gsap.from(ctaButtons, {
        opacity: 0,
        y: 20,
        scale: 0.9,
        duration: 0.6,
        delay: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)',
      });
    }

    // Animate feature badges
    const badges = document.querySelectorAll('.feature-badge');
    if (badges.length) {
      gsap.from(badges, {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        delay: 0.9,
        stagger: 0.1,
        ease: 'back.out(1.7)',
      });
    }

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        statNumbers.forEach((stat) => {
          const element = stat as HTMLElement;
          const endValue = parseInt(element.dataset.value || '0');
          animateCounter(element, endValue, {
            duration: 2,
            decimals: element.dataset.decimals ? parseInt(element.dataset.decimals) : 0,
            prefix: element.dataset.prefix || '',
            suffix: element.dataset.suffix || '',
          });
        });
      },
    });

    // Feature cards stagger animation
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length) {
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.from(featureCards, {
            opacity: 0,
            y: 60,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
          });
        },
      });
    }

    // How it works section with sequential reveals
    const steps = document.querySelectorAll('.step-card');
    if (steps.length) {
      ScrollTrigger.create({
        trigger: '.how-it-works-section',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.from(steps, {
            opacity: 0,
            x: (index) => (index % 2 === 0 ? -50 : 50),
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
          });
        },
      });
    }

    // Bond cards grid stagger
    const bondCards = document.querySelectorAll('.bond-card');
    if (bondCards.length) {
      ScrollTrigger.create({
        trigger: bondsRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          gsap.from(bondCards, {
            opacity: 0,
            y: 40,
            scale: 0.95,
            duration: 0.6,
            stagger: {
              amount: 0.8,
              from: 'start',
            },
            ease: 'power2.out',
          });
        },
      });
    }

    // Parallax effect on hero background
    if (!isMobile()) {
      gsap.to('.hero-bg-gradient', {
        backgroundPosition: '50% 100%',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      <Navbar />

      {/* Hero Section with 3D Background */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated gradient background */}
        <div className="hero-bg-gradient absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-blue-600/30 animate-gradient-xy" 
             style={{ backgroundSize: '400% 400%' }} />
        
        {/* 3D Scene */}
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-8">
            {/* Health Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full">
              {health ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-glow" />
                  <span className="text-green-400 text-sm font-medium">System Online</span>
                </>
              ) : (
                <span className="text-yellow-400 text-sm font-medium">Connecting...</span>
              )}
            </div>

            {/* Main Title */}
            <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
              Invest in India&apos;s
              <br />
              <span className="text-gradient-blue inline-block mt-2">
                Infrastructure Future
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Tokenized infrastructure bonds democratizing access to India&apos;s growth story.
              <br className="hidden md:block" />
              Secure, transparent, and powered by blockchain technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/register"
                className="hero-cta-btn group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl overflow-hidden transition-transform hover:scale-105 shadow-lg shadow-orange-500/50"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/bonds"
                className="hero-cta-btn px-8 py-4 glass-strong text-white font-semibold rounded-xl transition-all hover:border-white/40"
              >
                Explore Bonds →
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              {[
                { icon: '🔗', text: 'Blockchain Secured' },
                { icon: '🏛️', text: 'Government Backed' },
                { icon: '📊', text: 'Transparent Returns' },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="feature-badge flex items-center gap-2 px-4 py-2 glass rounded-full text-white/70 hover:text-white transition-colors"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Stats Section with Counter Animations */}
      <section
        ref={statsRef}
        className="py-16 px-4 border-y border-white/10 glass backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 50, label: 'Total Investment', prefix: '₹', suffix: 'Cr+', color: 'text-yellow-400' },
              { value: 10, label: 'Active Bonds', prefix: '', suffix: '+', color: 'text-green-400' },
              { value: 500, label: 'Investors', prefix: '', suffix: '+', color: 'text-blue-400' },
              { value: 8.5, label: 'Avg. Returns', prefix: '', suffix: '%', color: 'text-purple-400', decimals: 1 },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`stat-number text-4xl md:text-5xl font-bold ${stat.color} mb-2 transition-transform group-hover:scale-110`}
                  data-value={stat.value}
                  data-prefix={stat.prefix}
                  data-suffix={stat.suffix}
                  data-decimals={stat.decimals || 0}
                >
                  {stat.prefix}0{stat.suffix}
                </div>
                <div className="text-white/60 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Card Animations */}
      <section ref={featuresRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Why Choose <span className="text-gradient-blue">Mudra</span>?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Built for the modern investor with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                emoji: '🔗',
                title: 'Blockchain Powered',
                description:
                  'Every bond is tokenized on blockchain, ensuring transparency, security, and immutability of your investments.',
                gradient: 'from-yellow-500 to-orange-500',
                hoverColor: 'yellow-500/50',
              },
              {
                emoji: '🏛️',
                title: 'Government Backed',
                description:
                  'Invest in infrastructure bonds backed by government projects - railways, highways, and more.',
                gradient: 'from-green-500 to-teal-500',
                hoverColor: 'green-500/50',
              },
              {
                emoji: '📊',
                title: 'Real-time Analytics',
                description:
                  'Track your portfolio with live updates, detailed analytics, and AI-powered risk assessments.',
                gradient: 'from-blue-500 to-purple-500',
                hoverColor: 'blue-500/50',
              },
              {
                emoji: '💰',
                title: 'Low Entry Barrier',
                description:
                  'Start investing with as little as ₹10,000. No need for crores to access infrastructure bonds.',
                gradient: 'from-purple-500 to-pink-500',
                hoverColor: 'purple-500/50',
              },
              {
                emoji: '🎯',
                title: 'Diversify Portfolio',
                description:
                  'Access multiple sectors - transport, energy, urban infrastructure - all in one platform.',
                gradient: 'from-orange-500 to-red-500',
                hoverColor: 'orange-500/50',
              },
              {
                emoji: '🛡️',
                title: 'Paper Trading',
                description:
                  'Practice with virtual money before investing real funds. Perfect for beginners to learn.',
                gradient: 'from-cyan-500 to-blue-500',
                hoverColor: 'cyan-500/50',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`feature-card glass-strong rounded-2xl p-8 border border-white/20 hover:border-${feature.hoverColor} transition-all cursor-pointer group preserve-3d`}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <span className="text-3xl">{feature.emoji}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient-blue transition-all">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section py-20 px-4 glass backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Three simple steps to start investing in India&apos;s infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines - Desktop only */}
            {!isMobile() && (
              <>
                <div className="hidden md:block absolute top-20 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-yellow-500 via-green-500 to-transparent" />
                <div className="hidden md:block absolute top-20 right-0 w-1/3 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-transparent" />
              </>
            )}

            {[
              {
                step: 1,
                title: 'Create Account',
                description:
                  'Sign up in seconds with just your email. Get ₹10,00,000 virtual money to start paper trading immediately.',
                gradient: 'from-yellow-500/20 to-orange-500/20',
                borderColor: 'yellow-500/30',
                bgGradient: 'from-yellow-500 to-orange-500',
              },
              {
                step: 2,
                title: 'Browse Bonds',
                description:
                  'Explore 10+ infrastructure bonds across sectors. View detailed analytics, risk scores, and AI insights.',
                gradient: 'from-green-500/20 to-teal-500/20',
                borderColor: 'green-500/30',
                bgGradient: 'from-green-500 to-teal-500',
              },
              {
                step: 3,
                title: 'Start Investing',
                description:
                  'Buy bonds with a click. Track portfolio in real-time. Sell anytime with transparent pricing.',
                gradient: 'from-blue-500/20 to-purple-500/20',
                borderColor: 'blue-500/30',
                bgGradient: 'from-blue-500 to-purple-500',
              },
            ].map((step, index) => (
              <div key={index} className="step-card relative z-10">
                <div
                  className={`bg-gradient-to-br ${step.gradient} backdrop-blur-lg rounded-2xl p-8 border border-${step.borderColor} hover:scale-105 transition-transform cursor-pointer`}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${step.bgGradient} rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-lg glow`}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Bonds Section */}
      <section ref={bondsRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Infrastructure Bonds
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Start with these high-performing bonds from trusted issuers
            </p>
          </div>

          {bondsLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white/60">Loading bonds...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {bonds.map((bond, index) => (
                <div key={getBondId(bond)} className="bond-card">
                  <BondCard bond={bond} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              href="/bonds"
              className="inline-flex items-center gap-2 px-8 py-4 glass-strong hover:glass text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 transition-all group"
            >
              View All Bonds
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 animate-gradient-x" 
             style={{ backgroundSize: '200% 200%' }} />
        <div className="absolute inset-0 border-y border-orange-500/30" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Infrastructure Portfolio?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join hundreds of investors already earning steady returns from India&apos;s growth
            story. Start with ₹10,00,000 virtual money.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/50 text-lg"
            >
              Start Investing Now
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 glass-strong hover:glass text-white font-semibold rounded-xl border border-white/30 hover:border-white/50 transition-all text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 glass backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🏦</span>
                <span className="text-2xl font-bold text-gradient-blue">Mudra</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Democratizing infrastructure investment through blockchain technology.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                {['Browse Bonds', 'Leaderboard', 'Dashboard', 'Portfolio', 'Transactions'].map(
                  (item, i) => (
                    <li key={i}>
                      <Link
                        href={`/${item.toLowerCase().replace(' ', '-')}`}
                        className="text-white/60 hover:text-white transition-colors text-sm"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Pricing', 'About Us', 'How It Works', 'FAQ', 'Support'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Risk Warning'].map(
                  (item, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="text-white/60 hover:text-white transition-colors text-sm"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/50 text-sm">
                © 2026 Mudra. Built for CIH 3.0 - SDG 9 | Team Co Devians
              </p>
              <div className="flex items-center gap-6">
                {['Twitter', 'GitHub', 'LinkedIn'].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-white/50 hover:text-white transition-colors"
                    aria-label={social}
                  >
                    <div className="w-6 h-6 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform">
                      <span className="text-xs">{social[0]}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
