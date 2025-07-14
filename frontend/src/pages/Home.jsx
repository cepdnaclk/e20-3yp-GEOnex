import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobeAmericas,
  faBars,
  faTimes,
  faMapMarkerAlt,
  faBroadcastTower,
  faSatelliteDish,
  faRoute,
  faBrain,
  faCloudUploadAlt,
  faDatabase,
  faChartLine,
  faFileExport,
  faCheck,
  faPlayCircle,
  faCheckCircle,
  faEnvelope,
  faArrowUp,
  faTimes as faCross,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalCaption, setModalCaption] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Initialize intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe elements to animate
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openModal = (image, caption) => {
    setModalImage(image);
    setModalCaption(caption);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="font-['Poppins',sans-serif] text-gray-800">
      {/* Header / Navigation */}
      <header
        className={`fixed top-0 left-0 w-full bg-white z-50 transition-all duration-300 ${
          scrolled ? "shadow-md py-2" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            <FontAwesomeIcon
              icon={faGlobeAmericas}
              className="text-blue-600 mr-2"
            />
            <span>Geo</span>
            <span className="text-blue-600">Nex</span>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#about"
                  className="hover:text-blue-600 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-blue-600 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#comparison"
                  className="hover:text-blue-600 transition-colors"
                >
                  Comparison
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  className="hover:text-blue-600 transition-colors"
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors py-2 px-6 rounded-full"
                >
                  Login
                </a>
              </li>
            </ul>
          </nav>

          <button
            className="md:hidden text-xl focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? "max-h-70" : "max-h-0"
          }`}
        >
          <ul className="py-4">
            <li className="py-2 border-b border-gray-100">
              <a
                href="#about"
                className="block px-6 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li className="py-2 border-b border-gray-100">
              <a
                href="#features"
                className="block px-6 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
            </li>
            <li className="py-2 border-b border-gray-100">
              <a
                href="#comparison"
                className="block px-6 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Comparison
              </a>
            </li>
            <li className="py-2 border-b border-gray-100">
              <a
                href="#team"
                className="block px-6 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Team
              </a>
            </li>
            <li className="py-2">
              <a
                href="#contact"
                className="block px-6 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </li>
            <li className="py-2 bg-blue-600">
              <a
                href="/login"
                className="block px-6 text-white hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 text-white text-center relative min-h-96">
        
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Smart Surveying Redefined
          </h1>
          <p className="text-xl mb-8">
            Next-Gen, Cost-Effective Solution for Precise Land Mapping
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#demo"
              className="bg-white text-blue-600 hover:bg-gray-100 transition-colors py-2 px-6 rounded-full font-medium"
            >
              Watch Demo
            </a>
            <a
              href="./data/GEOnex-user-guide.pdf"
              className="border-2 border-white hover:bg-white hover:text-blue-600 transition-colors py-2 px-6 rounded-full font-medium"
            >
              Documentation
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            What is GEOnex?
          </h2>
          <p className="text-lg max-w-4xl mx-auto mb-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-500">
            <span className="font-semibold">GEOnex</span> is a smart and
            affordable surveying tool that helps people measure land and plan
            construction projects easily. It works
            <span className="font-semibold">
              {" "}
              like a traditional total station
            </span>{" "}
            but uses modern technology like GPS, sensors, and wireless
            communication to make the process
            <span className="font-semibold">
              {" "}
              faster, cheaper, and more accurate.
            </span>
          </p>
          <p className="text-lg max-w-4xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-500 delay-100">
            Whether you're a student, a startup, or a professional, GEOnex gives
            you the tools to do land surveys without needing expensive
            equipment. It's easy to use, works with a mobile app or website, and
            helps you get accurate location data for your projects.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: faMapMarkerAlt,
                title: "1. Initialization",
                description:
                  "The base station is placed at a fixed, known location and starts generating GNSS correction data in real-time.",
              },
              {
                icon: faBroadcastTower,
                title: "2. RTK Signal Transmission",
                description:
                  "Correction signals are transmitted via Wi-Fi or LoRa from the base to the rover, reducing GPS error to a few centimeters.",
              },
              {
                icon: faSatelliteDish,
                title: "3. Rover Data Collection",
                description:
                  "The mobile rover collects GPS data enhanced by RTK and uses an IMU for improved precision in all terrains.",
              },
              {
                icon: faRoute,
                title: "4. Dead Reckoning & Filtering",
                description:
                  "When GPS signals drop, the system switches to IMU-based dead reckoning with Kalman filtering to maintain accuracy.",
              },
              {
                icon: faBrain,
                title: "5. Kalman Filter Fusion",
                description:
                  "Data is smoothed and corrected through Kalman filters, combining GPS and IMU inputs for accuracy.",
              },
              {
                icon: faCloudUploadAlt,
                title: "6. MQTT Cloud Communication",
                description:
                  "The rover sends GPS data to the cloud through MQTT protocol for real-time processing and storage.",
              },
              {
                icon: faDatabase,
                title: "7. Cloud Database Storage",
                description:
                  "All data points are securely stored in MongoDB Atlas, enabling scalable and fast access for web dashboards.",
              },
              {
                icon: faChartLine,
                title: "8. Web Dashboard Interface",
                description:
                  "The GeoNex web app shows live rover movement, lets users capture points, and export survey files.",
              },
              {
                icon: faFileExport,
                title: "9. Export & CAD Integration",
                description:
                  "Export surveyed points in JSON, CSV, or DXF format for seamless integration with CAD and GIS tools.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg animate-on-scroll opacity-0 translate-y-10 transition-all duration-500"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <FontAwesomeIcon
                  icon={feature.icon}
                  className="text-blue-400 text-3xl mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            GeoNex vs Total Station
          </h2>
          <div className="overflow-x-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-500">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Feature</th>
                  <th className="py-3 px-4 text-left">GeoNex</th>
                  <th className="py-3 px-4 text-left">Total Station</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">Price</td>
                  <td className="py-3 px-4">$150–200</td>
                  <td className="py-3 px-4">$3,000+</td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-3 px-4">RTK Accuracy</td>
                  <td className="py-3 px-4">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-green-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-green-500"
                    />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">Live Sync</td>
                  <td className="py-3 px-4">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-green-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <FontAwesomeIcon icon={faCross} className="text-red-500" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="py-3 px-4">Portability</td>
                  <td className="py-3 px-4">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="text-green-500"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <FontAwesomeIcon icon={faCross} className="text-red-500" />
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">Setup Time</td>
                  <td className="py-3 px-4">2-5 minutes</td>
                  <td className="py-3 px-4">15-30 minutes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4">User Training</td>
                  <td className="py-3 px-4">Minimal</td>
                  <td className="py-3 px-4">Extensive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-12 md:py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Product Demo</h2>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2 animate-on-scroll opacity-0 translate-y-10 transition-all duration-500">
              <div className="bg-gray-800 aspect-video rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faPlayCircle}
                    className="text-6xl text-blue-400 mb-4"
                  />
                  <p className="text-lg">Demo video coming soon</p>
                </div>
                {/* YouTube embed will replace this when available */}
                {/* <iframe className="w-full h-full rounded-lg" src="https://www.youtube.com/embed/VIDEO_ID" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
              </div>
            </div>
            <div className="w-full lg:w-1/2 animate-on-scroll opacity-0 translate-y-10 transition-all duration-500 delay-100">
              <h3 className="text-2xl font-semibold mb-4">
                See GeoNex in Action
              </h3>
              <p className="mb-6">
                Our product demo is currently being prepared and will be
                available soon. This video will showcase the complete workflow
                of our smart surveying solution, from setup to data collection
                and visualization.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-blue-400 mr-3"
                  />
                  <span>Easy 5-minute setup process</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-blue-400 mr-3"
                  />
                  <span>Real-time data collection</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-blue-400 mr-3"
                  />
                  <span>Cloud synchronization</span>
                </li>
                <li className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-blue-400 mr-3"
                  />
                  <span>Dashboard visualization</span>
                </li>
              </ul>
              <a
                href="#contact"
                className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors py-2 px-6 rounded-full font-medium"
              >
                Get Notified When Available
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Project Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                src: "./images/gallery/3D.PNG",
                alt: "3D image of the model",
                title: "GEOnex Rover",
                description: "Side view",
              },
              {
                src: "./images/gallery/device.png",
                alt: "Rover & Base",
                title: "Rover and Base",
                description: "Base sends correction data",
              },
              {
                src: "./images/gallery/explode.png",
                alt: "Exploded View",
                title: "Exploded",
                description: "View of rover",
              },
              {
                src: "./images/gallery/prototype.jpg",
                alt: "Prototype",
                title: "Prototype model",
                description: "Very first prototype model of GEOnex",
              },
              {
                src: "./images/gallery/measuring.jpg",
                alt: "Testing on Site",
                title: "Testing on Site",
                description: "Check functionalities in university premises",
              },
              {
                src: "./images/gallery/grop.jpg",
                alt: "team",
                title: "Project Team",
                description: "After exhausting presentation session",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all hover:scale-105 animate-on-scroll opacity-0 translate-y-10 duration-500"
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => openModal(item.src, item.title)}
              >
                <div className="relative aspect-video">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          {modalOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              <div
                className="relative max-w-4xl w-full bg-white rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-gray-800 hover:text-gray-600 text-2xl z-10 bg-white bg-opacity-75 rounded-full w-8 h-8 flex items-center justify-center"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
                <div className="p-2">
                  <img
                    src={modalImage}
                    alt={modalCaption}
                    className="w-full max-h-[500px] object-contain rounded"
                  />
                  <div className="p-4 text-center">
                    <p className="text-lg font-medium">{modalCaption}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
<section id="team" className="py-12 md:py-20 bg-gray-900 text-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          name: "Rodger Jay",
          role: "C++ Firmware, Figma UI, Backend MS, Fusion 3D Modeling",
          image: "./images/Rodger.jpg",
          linkedin: "https://www.linkedin.com/in/rodger-jay/",
          github: "https://github.com/rodgerrashan",
        },
        {
          name: "Imesha Malinga",
          role: "Backend Auth, MongoDB",
          image: "./images/Malinga.jpg",
          linkedin: "https://www.linkedin.com/in/imesha-malinga-3884a5300/",
          github: "https://github.com/ImeshaMalinga",
        },
        {
          name: "Nisitha Padeniya",
          role: "Frontend, React, API Integration",
          image: "./images/Nishitha.jpg",
          linkedin: "https://www.linkedin.com/in/nisitha-padeniya/",
          github: "https://github.com/NisithaPadeniya",
        },
        {
          name: "Samuditha Senavirathne",
          role: "C++ Firmware dev, RTK, PCB Design",
          image: "./images/Samuditha.JPG",
          linkedin: "https://www.linkedin.com/in/samuditha-seneviratne-bb65a1254/",
          github: "https://github.com/gssamuditha",
        },
      ].map((member, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-lg overflow-hidden shadow-lg animate-on-scroll opacity-0 translate-y-10 transition-all duration-500"
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <img
            src={member.image}
            alt={member.name}
            className="w-full aspect-square object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
            <p className="text-gray-300 mb-4">{member.role}</p>
            <div className="flex space-x-4">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
              </a>
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FontAwesomeIcon icon={faGithub} className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


    {/* Contact Section */}
<section id="contact" className="py-12 md:py-20">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
    <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-10 max-w-4xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-500">
      
      {/* Email */}
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faEnvelope}
          className="text-blue-600 text-2xl mr-4"
        />
        <a
          href="mailto:user.geonex@gmail.com"
          className="hover:underline"
        >
          user.geonex@gmail.com
        </a>
      </div>
      
      {/* Github */}
      <div className="flex items-center">
        <FontAwesomeIcon
          icon={faGithub}
          className="text-blue-600 text-2xl mr-4"
        />
        <a
          href="https://github.com/cepdnaclk/e20-3yp-GEOnex"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 hover:underline"
        >
          github.com/cepdnaclk/e20-3yp-GEOnex
        </a>
      </div>
      
      {/* Address */}
      <div className="flex items-center max-w-xs">
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          className="text-blue-600 text-2xl mr-4"
        />
        <div>
          <p>University of Peradeniya,<br/>
          Sri Lanka</p>
        </div>
      </div>
      
    </div>
  </div>
</section>



      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-4">
          <p>&copy; 2025 GeoNex. All rights reserved.</p>
        </div>
      </footer>

      {/* Scroll to top button */}
      <button
        className={`fixed bottom-6 right-6 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={scrollToTop}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  );
};

export default HomePage;
