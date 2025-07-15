import React, { useState, useEffect, useContext } from "react";
import {
  ChevronRight,
  Play,
  Shield,
  Zap,
  Globe,
  Database,
  Clock,
  Users,
  Star,
  ArrowRight,
  Menu,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Context } from "../context/Context";

const GEOnexLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { navigate } = useContext(Context);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const whatsappBaseUrl = "https://wa.me/+94788428664";

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) errs.email = "Invalid email address";
    }
    return errs;
  };

  const buildWhatsAppMessage = () => {
    const msgLines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Message: ${form.message || "(No message)"}`,
    ];
    return encodeURIComponent(msgLines.join("\n"));
  };

  // Handle redirect to WhatsApp with message
  const handleWhatsAppRedirect = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const waUrl = `${whatsappBaseUrl}?text=${buildWhatsAppMessage()}`;
    window.open(waUrl, "_blank");
  };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const AnimatedCard = ({ children, delay = 0, className = '' }) => (
    <div
      className={`transform transition-all duration-1000 hover:scale-105  animate-fade-in
        ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );

  const FloatingElement = ({ children, className = "" }) => (
    <div className={`animate-float ${className}`}>{children}</div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-md 
      bg-white/80 border-b border-gray-200/50
      "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GEOnex
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#products"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Products
              </a>
              <a
                href="#benefits"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Benefits
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Contact Us
              </a>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign in
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

      {isMenuOpen && (
        <div
          className="md:hidden fixed top-16 inset-x-0 bg-white/80 backdrop-blur border-t
                  flex flex-col gap-4 p-4 shadow-lg z-[1000]"
        >
          <a onClick={() => setIsMenuOpen(false)} href="#products">
            Products
          </a>
          <a onClick={() => setIsMenuOpen(false)} href="#benefits">
            Benefits
          </a>
          <a onClick={() => setIsMenuOpen(false)} href="#contact">
            Contact Us
          </a>
          <button
            onClick={() => {
              navigate("/login");
              setIsMenuOpen(false);
            }}
            className="bg-blue-600 text-white py-2 rounded-md"
          >
            Sign in
          </button>
        </div>
      )}

      {/* Hero Section */}
      {/* <section className="relative pt-32 sm:pt-40 lg:pt-48 pb-24 sm:pb-32  overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <FloatingElement className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl" />
        <FloatingElement className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-[2.25rem] md:text-7xl font-bold text-gray-800 mb-6 animate-fade-in">
              <div className="block mb-4">
                <span className="mr-2 md:mr-4">Survey</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
                text-5xl sm:text-6xl lg:text-8xl whitespace-nowrap">
                  Millions
                </span>

                
                
                <span className="ml-4">of points</span>

              </div>
              <span className="block">
                <span className="mr-4">with</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  One
                </span>
                <span className="ml-4">simple solution.</span>
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              Powered by smart hardware and cloud technology, GEOnex redefines
              how surveys are done.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <a
                href="#products"
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 animate-pulse-glow flex items-center justify-center"
              >
                Explore Products
                <ChevronRight className="inline ml-2" size={20} />
              </a>
              <button className="bg-white/80 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white transition-all duration-200 transform hover:scale-105 border border-gray-200/50 flex items-center justify-center">
                <Play className="inline mr-2" size={20} />
                See Live Demo
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* ─────────────── HERO ─────────────── */}
      <section
        id="hero"
        className="relative overflow-hidden
             pt-20 sm:pt-32 lg:pt-40
             pb-10 sm:pb-20 lg:pb-32"
      >
        {/* soft BG tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />

        {/* floating blobs */}
        <FloatingElement className="absolute top-14 left-4 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/20 rounded-full blur-xl" />
        <FloatingElement className="absolute -bottom-6 right-4 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full blur-xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* ---------- HEADLINE ---------- */}
            <h1
              className="font-bold text-gray-800 leading-tight
                   text-[2.25rem] sm:text-5xl lg:text-7xl
                   mb-6 animate-fade-in"
            >
              {/* Shared “Survey Millions” */}
              Survey&nbsp;
              <span
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
                         text-[2.75rem] sm:text-6xl lg:text-8xl whitespace-nowrap"
              >
                Millions
              </span>
              {/* Phones (<640 px) additional lines */}
              <br className="block sm:hidden" />
              <span className="block sm:hidden">
                of points with
                <br />
                <span
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent
                text-[2.25rem]"
                >
                  One
                </span>
                &nbsp;simple solution
              </span>
              {/* Tablet / Desktop version */}
              <span className="hidden sm:inline">
                <span className="ml-2">of points</span>
                <span className="block mt-3">
                  with&nbsp;
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    One
                  </span>
                  &nbsp;simple&nbsp;solution.
                </span>
              </span>
            </h1>

            {/* ---------- SUB-HEADLINE ---------- */}
            <p
              className="mx-auto max-w-lg sm:max-w-2xl
                   text-md sm:text-lg lg:text-2xl
                   text-gray-600 mb-10 sm:mb-12 animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              Powered by smart hardware and cloud technology, GEOnex redefines
              how surveys are done.
            </p>

            {/* ---------- CTA BUTTONS ---------- */}

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              <a
                href="#products"
                className="bg-blue-600 text-white px-7 sm:px-8 py-4 rounded-full
                     text-base sm:text-lg font-semibold
                     hover:bg-blue-700 transition transform hover:scale-105
                     animate-pulse-glow 
                     flex items-center justify-center"
              >
                Explore Products
                <ChevronRight size={20} className="ml-2" />
              </a>

              <button
                className="bg-white/80 backdrop-blur-sm text-gray-900
                     px-7 sm:px-8 py-4 rounded-full
                     text-base sm:text-lg font-semibold
                     hover:bg-white transition transform hover:scale-105
                     border border-gray-200/70
                     flex items-center justify-center"
              >
                <Play size={20} className="mr-2" />
                See Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── ABOUT ─────────────── */}
      <section className="py-20 bg-gray-50" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedCard className="order-2 md:order-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why Choose GEOnex
              </h2>
              <p className="text-md md:text-xl text-gray-600 mb-8">
                Total stations and GNSS systems have shaped surveying for years.
                GEOnex builds on that foundation, offering a modern, connected
                solution designed for speed, precision, and teamwork.
              </p>
              <ul className="space-y-3 md:space-y-4 list-inside list-none">
                {[
                  "Real-time data sharing between field and office teams",
                  "Cloud-based processing and instant access from anywhere",
                  "IoT-connected devices streamline every step",
                  "Minimize manual data handling and reduce errors",
                  "Complete surveys up to 70% faster with automated workflows",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mt-2 w-1.5 h-1.5 sm:w-2 sm:h-2 flex-shrink-0 bg-blue-600 rounded-full"></div>
                    <span className="ml-3 text-gray-700 text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedCard>

            <AnimatedCard delay={200} className="order-1 md:order-2">
              <div className="p-4 sm:p-8">
                <div className="w-full h-56 sm:h-72 md:h-96 rounded-xl flex items-center justify-center">
                  <img
                    src="/images/LandingPage/geonex-r-b.png"
                    alt="GEOnex Problem-Solution Visualization"
                    className="object-contain"
                  />
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      

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
              Discover our complete ecosystem designed to revolutionize your
              surveying workflow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "GEOnex Client",
                subtitle: "Portable Field Device",
                description:
                  "Professional-grade portable device for field data collection with unmatched precision and reliability.",
                icon: <Shield className="w-12 h-12 text-blue-600" />,
                image: "/images/LandingPage/geonex-r.png",
              },
              {
                title: "GEOnex Base",
                subtitle: "Base Station System",
                description:
                  "Advanced base station delivering real-time corrections and ensuring centimeter-level accuracy.",
                icon: <Zap className="w-12 h-12 text-purple-600" />,
                image: "/images/LandingPage/geonex-b.png",
              },
              {
                title: "GEOnex Web App",
                subtitle: "Cloud Platform",
                description:
                  "Comprehensive cloud platform for real-time monitoring, data management, and team collaboration.",
                icon: <Globe className="w-12 h-12 text-green-600" />,
                image: "/images/LandingPage/geonex-x.png",
              },
            ].map((product, index) => (
              <AnimatedCard key={index} delay={index * 100}>
                <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {/* <div className="mb-6">
              <FloatingElement>
                {product.icon}
              </FloatingElement>
            </div> */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-4">
                    {product.subtitle}
                  </p>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  <div className="w-full h-auto rounded-xl flex items-center justify-center mb-6">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-contain h-full"
                    />
                  </div>
                  {/* <button className="w-full bg-gray-900 text-white py-3 rounded-full hover:bg-gray-800 transition-all duration-200 transform hover:scale-105">
              Learn More
            </button> */}
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
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Future
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Experience the advantages that set GEOnex apart
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Database className="w-8 h-8" />,
                title: "Real-Time Data Sharing",
                desc: "Instant synchronization across all team members",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "IoT Integration",
                desc: "Connect with smart sensors and automated workflows",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Web Dashboard",
                desc: "Monitor projects from anywhere in the world",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Cloud Storage",
                desc: "Secure, scalable data storage and backup",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Faster Surveys",
                desc: "Complete projects 70% faster than traditional methods",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                desc: "Seamless collaboration tools for distributed teams",
              },
            ].map((benefit, index) => (
              <AnimatedCard key={index} delay={index * 50}>
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-blue-600 mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
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
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Difference
              </span>
            </h2>
          </div>

          <AnimatedCard>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-lg font-semibold text-gray-900">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-center text-lg font-semibold text-gray-900">
                        Total Station
                      </th>
                      <th className="px-6 py-4 text-center text-lg font-semibold text-gray-900">
                        Traditional GNSS
                      </th>
                      <th className="px-6 py-4 text-center text-lg font-semibold bg-blue-50 text-blue-900">
                        GEOnex
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        feature: "Real-time Data Sharing",
                        total: "cross",
                        gnss: "alert",
                        geonex: "check",
                      },
                      {
                        feature: "Cloud Integration",
                        total: "cross",
                        gnss: "cross",
                        geonex: "check",
                      },
                      {
                        feature: "IoT Connectivity",
                        total: "cross",
                        gnss: "cross",
                        geonex: "check",
                      },
                      {
                        feature: "Setup Time",
                        total: "30+ min",
                        gnss: "15+ min",
                        geonex: "< 5 min",
                      },
                      {
                        feature: "Accuracy",
                        total: "mm",
                        gnss: "cm",
                        geonex: "cm",
                      },
                      {
                        feature: "Team Collaboration",
                        total: "cross",
                        gnss: "Limited",
                        geonex: "check",
                      },
                    ].map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {row.feature}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.total === "cross" ? (
                            <X
                              className="mx-auto w-6 h-6 text-red-500"
                              aria-label="No"
                            />
                          ) : row.total === "alert" ? (
                            <AlertTriangle
                              className="mx-auto w-6 h-6 text-yellow-500"
                              aria-label="Limited"
                            />
                          ) : row.total === "check" ? (
                            <Check
                              className="mx-auto w-6 h-6 text-green-600"
                              aria-label="Yes"
                            />
                          ) : (
                            row.total
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.gnss === "cross" ? (
                            <X
                              className="mx-auto w-6 h-6 text-red-500"
                              aria-label="No"
                            />
                          ) : row.gnss === "alert" ? (
                            <AlertTriangle
                              className="mx-auto w-6 h-6 text-yellow-500"
                              aria-label="Limited"
                            />
                          ) : row.gnss === "check" ? (
                            <Check
                              className="mx-auto w-6 h-6 text-green-600"
                              aria-label="Yes"
                            />
                          ) : (
                            row.gnss
                          )}
                        </td>
                        <td className="px-6 py-4 text-center bg-blue-50 font-semibold text-blue-900">
                          {row.geonex === "cross" ? (
                            <X
                              className="mx-auto w-6 h-6 text-red-500"
                              aria-label="No"
                            />
                          ) : row.geonex === "alert" ? (
                            <AlertTriangle
                              className="mx-auto w-6 h-6 text-yellow-500"
                              aria-label="Limited"
                            />
                          ) : row.geonex === "check" ? (
                            <Check
                              className="mx-auto w-6 h-6 text-green-600"
                              aria-label="Yes"
                            />
                          ) : (
                            row.geonex
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>
      {/* <section id="testimonials" className="py-20 bg-gray-50">
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
      </section> */}

      {/* CTA Section */}
      <section
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600"
        id="contact"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Transform
            <br />
            Your Surveying?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who have already made the switch to
            GEOnex
          </p>

          <form
            onSubmit={handleWhatsAppRedirect}
            className="max-w-2xl mx-auto mb-12 space-y-6 text-left"
            noValidate
          >
            <div>
              <label
                htmlFor="name"
                className="block text-white font-semibold mb-1"
              >
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full rounded-full px-4 py-3 text-gray-900 focus:outline-none ${
                  errors.name ? "border-2 border-red-500" : ""
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-400 mt-1 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-white font-semibold mb-1"
              >
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full rounded-full px-4 py-3 text-gray-900 focus:outline-none ${
                  errors.email ? "border-2 border-red-500" : ""
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-400 mt-1 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-white font-semibold mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl px-4 py-3 text-gray-900 focus:outline-none"
                placeholder="Optional"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="submit"
                onClick={handleWhatsAppRedirect}
                className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
              >
                Schedule a Demo
                <ArrowRight className="inline ml-2" size={20} />
              </button>
              <button
                type="submit"
                onClick={handleWhatsAppRedirect}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
              >
                Contact Sales
              </button>
            </div>
          </form>
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
                <li>
                  <a
                    href="#products"
                    className="hover:text-white transition-colors"
                  >
                    GEOnex Client
                  </a>
                </li>
                <li>
                  <a
                    href="#products"
                    className="hover:text-white transition-colors"
                  >
                    GEOnex Base
                  </a>
                </li>
                <li>
                  <a
                    href="#products"
                    className="hover:text-white transition-colors"
                  >
                    GEOnex Web App
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
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
