import React, { useState, useEffect } from 'react';
import { ChevronRight, Play, Shield, Zap, Globe, Database, Clock, Users, Star, ArrowRight, Menu, X } from 'lucide-react';

const GEOnexLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const AnimatedCard = ({ children, delay = 0 }) => (
    <div 
      className={`transform transition-all duration-1000 hover:scale-105 hover:shadow-2xl animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  const FloatingElement = ({ children, className = "" }) => (
    <div className={`animate-float ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GEOnex
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#products" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Products</a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Benefits</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">Testimonials</a>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <FloatingElement className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></FloatingElement>
        <FloatingElement className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></FloatingElement>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
              <span className="block mb-2">Replacement of</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Millions
              </span>
              <span className="block">like never before</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              Revolutionary surveying technology that transforms how professionals capture, process, and share geospatial data worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 animate-pulse-glow">
                Explore Products
                <ChevronRight className="inline ml-2" size={20} />
              </button>
              <button className="bg-white/80 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white transition-all duration-200 transform hover:scale-105 border border-gray-200/50">
                <Play className="inline mr-2" size={20} />
                See Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedCard>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why GEOnex Replaces Traditional Solutions
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Traditional total stations and GNSS systems are becoming obsolete. GEOnex delivers the precision you need with modern connectivity, real-time collaboration, and intelligent automation.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time data synchronization across teams",
                  "Cloud-based processing and storage",
                  "IoT integration for smart workflows",
                  "Eliminate manual data transfer errors",
                  "Reduce survey time by up to 70%"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedCard>
            
            <AnimatedCard delay={200}>
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Problem-Solution Visualization</span>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section id="products" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Three Products.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Infinite Possibilities.
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our complete ecosystem designed to revolutionize your surveying workflow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "GEOnex Client",
                subtitle: "Portable Field Device",
                description: "Professional-grade portable device for field data collection with unmatched precision and reliability.",
                icon: <Shield className="w-12 h-12 text-blue-600" />
              },
              {
                title: "GEOnex Base",
                subtitle: "Base Station System",
                description: "Advanced base station delivering real-time corrections and ensuring centimeter-level accuracy.",
                icon: <Zap className="w-12 h-12 text-purple-600" />
              },
              {
                title: "GEOnex Web App",
                subtitle: "Cloud Platform",
                description: "Comprehensive cloud platform for real-time monitoring, data management, and team collaboration.",
                icon: <Globe className="w-12 h-12 text-green-600" />
              }
            ].map((product, index) => (
              <AnimatedCard key={index} delay={index * 100}>
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="mb-6">
                    <FloatingElement>
                      {product.icon}
                    </FloatingElement>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-blue-600 font-semibold mb-4">{product.subtitle}</p>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-gray-500">Product Image</span>
                  </div>
                  <button className="w-full bg-gray-900 text-white py-3 rounded-full hover:bg-gray-800 transition-all duration-200 transform hover:scale-105">
                    Learn More
                  </button>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Built for the
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Future</span>
            </h2>
            <p className="text-xl text-gray-600">Experience the advantages that set GEOnex apart</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Database className="w-8 h-8" />, title: "Real-Time Data Sharing", desc: "Instant synchronization across all team members" },
              { icon: <Zap className="w-8 h-8" />, title: "IoT Integration", desc: "Connect with smart sensors and automated workflows" },
              { icon: <Globe className="w-8 h-8" />, title: "Web Dashboard", desc: "Monitor projects from anywhere in the world" },
              { icon: <Shield className="w-8 h-8" />, title: "Cloud Storage", desc: "Secure, scalable data storage and backup" },
              { icon: <Clock className="w-8 h-8" />, title: "Faster Surveys", desc: "Complete projects 70% faster than traditional methods" },
              { icon: <Users className="w-8 h-8" />, title: "Team Collaboration", desc: "Seamless collaboration tools for distributed teams" }
            ].map((benefit, index) => (
              <AnimatedCard key={index} delay={index * 50}>
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-blue-600 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              See the
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Difference</span>
            </h2>
          </div>
          
          <AnimatedCard>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">Feature</th>
                      <th className="px-6 py-4 text-center text-lg font-semibold text-gray-900">Total Station</th>
                      <th className="px-6 py-4 text-center text-lg font-semibold text-gray-900">Traditional GNSS</th>
                      <th className="px-6 py-4 text-center text-lg font-semibold bg-blue-50 text-blue-900">GEOnex</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { feature: "Real-time Data Sharing", total: "❌", gnss: "⚠️", geonex: "✅" },
                      { feature: "Cloud Integration", total: "❌", gnss: "❌", geonex: "✅" },
                      { feature: "IoT Connectivity", total: "❌", gnss: "❌", geonex: "✅" },
                      { feature: "Setup Time", total: "30+ min", gnss: "15+ min", geonex: "< 5 min" },
                      { feature: "Accuracy", total: "mm", gnss: "cm", geonex: "mm" },
                      { feature: "Team Collaboration", total: "❌", gnss: "Limited", geonex: "✅" }
                    ].map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{row.feature}</td>
                        <td className="px-6 py-4 text-center">{row.total}</td>
                        <td className="px-6 py-4 text-center">{row.gnss}</td>
                        <td className="px-6 py-4 text-center bg-blue-50 font-semibold text-blue-900">{row.geonex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Trusted by
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Professionals</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <AnimatedCard key={index} delay={index * 100}>
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    "GEOnex has revolutionized our surveying workflow. The real-time collaboration features alone have saved us countless hours."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                    <div>
                      <p className="font-semibold text-gray-900">John Smith</p>
                      <p className="text-gray-600">Senior Surveyor</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Transform
            <br />
            Your Surveying?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who have already made the switch to GEOnex
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
              Schedule a Demo
              <ArrowRight className="inline ml-2" size={20} />
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">GEOnex</h3>
              <p className="text-gray-400">
                Revolutionary surveying technology for the modern professional.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">GEOnex Client</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GEOnex Base</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GEOnex Web App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm">Li</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm">Tw</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm">Fb</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GEOnex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GEOnexLanding;