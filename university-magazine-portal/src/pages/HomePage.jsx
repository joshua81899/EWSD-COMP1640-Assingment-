import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  // State for mobile navigation menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // GSAP Animations
  useEffect(() => {
    // Ensure animations run after component mount
    const animationTimer = setTimeout(() => {
      // Hero section animations
      const heroTimeline = gsap.timeline();
      heroTimeline
        .from('.hero-title', {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: 'power3.out'
        })
        .from('.hero-subtitle', {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power3.out'
        }, 0.3)
        .from('.hero-buttons', {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power3.out'
        }, 0.6);

      // Scroll-triggered animations with more robust setup
      const createScrollAnimation = (selector, options) => {
        const elements = document.querySelectorAll(selector);
        if (elements && elements.length > 0) {
          gsap.from(elements, {
            scrollTrigger: {
              trigger: elements[0],
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true
            },
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out',
            ...options
          });
        }
      };

      // Apply scroll animations
      createScrollAnimation('.feature-card');
      createScrollAnimation('.step-item', { x: -30, ease: 'back.out(1.2)' });
      createScrollAnimation('.timeline-item', {
        scale: 0.9,
        ease: 'power1.out'
      });

      // Refresh ScrollTrigger
      ScrollTrigger.refresh();
    }, 300);

    // Cleanup timer
    return () => clearTimeout(animationTimer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="bg-gray-900/95 backdrop-blur-sm text-white fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="ml-2 text-xl font-medium">University Magazine</span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {/* Navigation Links with Glow Effect on Hover */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-0 group-hover:opacity-60 transition duration-300 group-hover:blur-md"></div>
                    <Link to="/about" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-300 group-hover:text-white group-hover:bg-gray-800 transition">About</Link>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-0 group-hover:opacity-60 transition duration-300 group-hover:blur-md"></div>
                    <Link to="/submissions" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-300 group-hover:text-white group-hover:bg-gray-800 transition">Submissions</Link>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-0 group-hover:opacity-60 transition duration-300 group-hover:blur-md"></div>
                    <Link to="/guidelines" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-300 group-hover:text-white group-hover:bg-gray-800 transition">Guidelines</Link>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-0 group-hover:opacity-60 transition duration-300 group-hover:blur-md"></div>
                    <Link to="/contact" className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-300 group-hover:text-white group-hover:bg-gray-800 transition">Contact</Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Auth buttons - Only visible above 880px width */}
            <div className="hidden lg:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Gradient Login Button - Desktop */}
                <div className="relative group mr-2">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:blur-lg"></div>
                  <Link to="/login" className="relative px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md transition block whitespace-nowrap">Log In</Link>
                </div>
                
                {/* Gradient Register Button - Desktop */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:blur-lg"></div>
                  <Link to="/register" className="relative px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md transition block whitespace-nowrap">Register</Link>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                <svg
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Auth buttons for medium screens - Visible between md and lg breakpoints */}
        <div className="hidden md:block lg:hidden border-t border-gray-700">
          <div className="px-4 py-2 flex items-center justify-end gap-2">
            {/* Gradient Login Button - Medium Screen */}
            <div className="relative group flex-none">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:blur-lg"></div>
              <Link to="/login" className="relative px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md transition block whitespace-nowrap">Log In</Link>
            </div>
            
            {/* Gradient Register Button - Medium Screen */}
            <div className="relative group flex-none">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:blur-lg"></div>
              <Link to="/register" className="relative px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md transition block whitespace-nowrap">Register</Link>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800">
            {/* Mobile Nav Links with Glow Effect */}
            <div className="relative group mb-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-0 group-hover:opacity-60 transition duration-300 group-hover:blur-md"></div>
              <Link to="/about" className="relative block px-3 py-2 rounded-md text-base font-medium text-gray-300 group-hover:text-white group-hover:bg-gray-700 transition">About</Link>
            </div>
            
            <div className="relative group mb-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-0 group-hover:opacity-60 transition duration-300 group-hover:blur-md"></div>
              <Link to="/submissions" className="relative block px-3 py-2 rounded-md text-base font-medium text-gray-300 group-hover:text-white group-hover:bg-gray-700 transition">Submissions</Link>
            </div>
            
            <div className="relative group mb-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-0 group-hover:opacity-60 transition duration-300 group-hover:blur-md"></div>
              <Link to="/guidelines" className="relative block px-3 py-2 rounded-md text-base font-medium text-gray-300 group-hover:text-white group-hover:bg-gray-700 transition">Guidelines</Link>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-0 group-hover:opacity-60 transition duration-300 group-hover:blur-md"></div>
              <Link to="/contact" className="relative block px-3 py-2 rounded-md text-base font-medium text-gray-300 group-hover:text-white group-hover:bg-gray-700 transition">Contact</Link>
            </div>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700 bg-gray-800">
            <div className="flex items-center px-5">
              <div className="px-2 py-2 flex gap-2 w-full">
                {/* Gradient Login Button - Mobile */}
                <div className="relative group flex-1">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:blur-lg"></div>
                  <Link to="/login" className="relative block w-full px-4 py-2 text-center text-sm text-white bg-gray-900 rounded-md transition">Log In</Link>
                </div>
                
                {/* Gradient Register Button - Mobile */}
                <div className="relative group flex-1">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:blur-lg"></div>
                  <Link to="/register" className="relative block w-full px-4 py-2 text-center text-sm text-white bg-gray-900 rounded-md transition">Register</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        {/* Image Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <div className="absolute inset-0 bg-gray-900 opacity-80 z-10"></div>
          <img
            className="absolute min-w-full min-h-full object-cover brightness-50"
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxhbGx8fHx8fHx8fHwxNjIwMzg5OTM5&ixlib=rb-1.2.1&q=80&w=1080"
            alt="University background"
          />
        </div>

        <div className="max-w-4xl w-full text-center z-20">
          <h1 className="hero-title text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            University Magazine Submission Portal
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-8 drop-shadow-md">
            Share your creativity, get published, and join our university's literary community
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            {/* Gradient Hero Login Button */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:blur-lg"></div>
              <Link
                to="/login"
                className="relative bg-gray-900 text-white font-medium py-3 px-8 rounded-md transition duration-300 shadow-lg hover:shadow-xl block"
              >
                Log In
              </Link>
            </div>
            
            {/* Gradient Hero Register Button */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md blur opacity-60 group-hover:opacity-100 transition duration-300 group-hover:blur-lg"></div>
              <Link
                to="/register"
                className="relative bg-gray-900 text-white font-medium py-3 px-8 rounded-md transition duration-300 shadow-lg hover:shadow-xl block"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
       
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-20 px-4 sm:px-6 lg:px-8 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="feature-card bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-600">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-white mb-3">Submit Articles</h3>
              <p className="text-gray-300 text-center">
                Upload your articles as Word documents and images to be considered for publication
              </p>
            </div>
           
            <div className="feature-card bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-600">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-white mb-3">Receive Feedback</h3>
              <p className="text-gray-300 text-center">
                Get personalized feedback from your Faculty's Marketing Coordinator
              </p>
            </div>
           
            <div className="feature-card bg-gray-700 rounded-xl p-8 shadow-lg border border-gray-600">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-white mb-3">Get Published</h3>
              <p className="text-gray-300 text-center">
                Selected contributions will be featured in the university's annual magazine
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            How It Works
          </h2>
         
          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-4 md:gap-8">
            {[
              {
                number: '1',
                title: 'Register',
                description: 'Create an account with your university email'
              },
              {
                number: '2',
                title: 'Create',
                description: 'Write your article and prepare your images'
              },
              {
                number: '3',
                title: 'Submit',
                description: 'Upload your contributions before the deadline'
              },
              {
                number: '4',
                title: 'Review',
                description: 'Receive feedback and make any requested edits'
              }
            ].map((step) => (
              <div
                key={step.number}
                className="step-item flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-center">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Important Dates
          </h2>
         
          <div className="space-y-8">
            <div className="timeline-item flex">
              <div className="flex flex-col items-center mr-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="h-full w-0.5 bg-gray-600"></div>
              </div>
              <div className="bg-gray-700 rounded-lg p-6 shadow-md flex-1 mb-2 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Submissions Open
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  1st September 2023
                </p>
                <p className="text-gray-300">
                  The portal opens for new article and image submissions
                </p>
              </div>
            </div>
            
            <div className="timeline-item flex">
              <div className="flex flex-col items-center mr-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="h-full w-0.5 bg-gray-600"></div>
              </div>
              <div className="bg-gray-700 rounded-lg p-6 shadow-md flex-1 mb-2 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Deadline for New Submissions
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  15th February 2024
                </p>
                <p className="text-gray-300">
                  Last day to submit new articles and images
                </p>
              </div>
            </div>
            
            <div className="timeline-item flex">
              <div className="flex flex-col items-center mr-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="h-full w-0.5 bg-gray-600"></div>
              </div>
              <div className="bg-gray-700 rounded-lg p-6 shadow-md flex-1 mb-2 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Edits & Updates Period
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  15th Feb - 15th March 2024
                </p>
                <p className="text-gray-300">
                  Period for making updates to existing submissions based on coordinator feedback
                </p>
              </div>
            </div>
            
            <div className="timeline-item flex">
              <div className="flex flex-col items-center mr-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* No connector for the last item */}
              </div>
              <div className="bg-gray-700 rounded-lg p-6 shadow-md flex-1 mb-2 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Final Selections Announced
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  1st April 2024
                </p>
                <p className="text-gray-300">
                  Announcement of articles selected for publication in this year's magazine
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">University Magazine</h3>
            <p className="text-gray-300">
              Showcasing student creativity and talent across all faculties
            </p>
          </div>
         
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-white transition"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-white transition"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-300 hover:text-white transition"
                >
                  Help
                </Link>
              </li>
            </ul>
          </div>
         
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">Email: magazine@university.edu</p>
            <p className="text-gray-300">Phone: (123) 456-7890</p>
          </div>
        </div>
       
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} University Magazine. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;