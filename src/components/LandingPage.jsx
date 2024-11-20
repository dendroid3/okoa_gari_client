import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import images
import towingImage from '../assets/towing.jpg';
import mechanicImage from '../assets/mechanic.jpg';
import batteryImage from '../assets/battery-replacement-1160x773.jpeg';
import careEmergencyImage from '../assets/caremergency.avif';
import safetyInspectionImage from '../assets/Safety-Inspection.jpg';
import tyreServiceImage from '../assets/tyreservice.jpg';

// FontAwesome Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const handleLogOut = () => {
  const confirmationMessage = "You are about to log out, do you wish to proceed?"
  if(!confirm(confirmationMessage)) return
  localStorage.removeItem('userData');
  localStorage.removeItem('userToken');
  window.location.href = '/';
};

// Services Data
const services = [
  {
    title: 'Towing Service',
    image: towingImage,
    description: 'We offer reliable towing services for all types of vehicles, including flatbed and hook & chain trucks.',
  },
  {
    title: 'Mechanical Service',
    image: mechanicImage,
    description: 'From engine repairs to regular maintenance, we provide comprehensive mechanical services to get your car back on the road.',
  },
  {
    title: 'Emergency Assistance',
    image: careEmergencyImage,
    description: 'Our team is available 24/7 for emergency roadside assistance, including battery replacements and fuel delivery.',
  },
  {
    title: 'Battery Replacement',
    image: batteryImage,
    description: 'Quick and efficient battery replacements for any type of vehicle, available on-site.',
  },
  {
    title: 'Car Inspection',
    image: safetyInspectionImage,
    description: 'Thorough vehicle inspections to ensure your car is in top condition and ready for the road.',
  },
  {
    title: 'Tyre Service',
    image: tyreServiceImage,
    description: 'We provide tyre fitting, repairs, and replacements for all vehicle types. Stay safe on the road with our quality tyre services.',
  },
];

// Testimonials Data
const testimonials = [
  {
    text: "This towing service saved me in a pinch! Quick, reliable, and professional. Highly recommended!",
    author: "Steve John",
    role: "Satisfied Customer"
  },
  {
    text: "Amazing service! They arrived quickly and solved my battery issue right on the spot. Highly recommend!",
    author: "Jane Smith",
    role: "Happy Client"
  },
  // Add more testimonials as needed
];

// ServiceCard Component
const ServiceCard = ({ title, image, description }) => (
  <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out">
    <h3 className="text-xl font-semibold text-yellow-400">{title}</h3>
    <img src={image} alt={title} className="w-full h-60 object-cover rounded-lg mt-4" />
    <p className="text-gray-300 mt-2">{description}</p>
  </div>
);

// TestimonialCard Component
const TestimonialCard = ({ text, author, role }) => (
  <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-lg text-center">
    <p className="text-gray-300">"{text}"</p>
    <h4 className="text-yellow-400 mt-4">{author}</h4>
    <p className="text-gray-500">{role}</p>
  </div>
);

// Navbar Component
const Navbar = () => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return localStorage.getItem('userToken'); // Example check for authentication
  };

  const role = () => {
    const role = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).role : "null"
    
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  const handleDashboardClick = (role) => {
    if (isAuthenticated()) {
      navigate(`/${role}-dashboard`);
    } else {
      if(role == 'admin') {
        const adminSecretPhrase = 'LetAdminIn'
        const adminSecretPhraseConfirmation = prompt("Enter Admin Secret Phrase")
        if(adminSecretPhrase !== adminSecretPhraseConfirmation) {
          alert("Wrong Admin Secret Phrase..")
          return
        }
      }
      if(role == 'garage') {
        const garageSecretPhrase = 'LetGarageIn'
        const garageSecretPhraseConfirmation = prompt("Enter Garage Secret Phrase")
        if(garageSecretPhrase !== garageSecretPhraseConfirmation) {
          alert("Wrong Garage Secret Phrase.")
          return
        }
      }
      navigate(`/login?role=${role}`);
    }
  };

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Okoa Gari</h1>
        <div className="space-x-6">
          <>
            {isAuthenticated() ? (
              <>
                <button onClick={() => handleDashboardClick(role())} className="text-gray-200 hover:text-white">
                  {`${role()} Dashboard`}
                </button>
                
                <button onClick={handleLogOut} 
                  className="text-gray-200 p-1 rounded"
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Normal shadow
                    transition: 'box-shadow 0.3s ease', // Smooth transition for hover effect
                  }}
                  onMouseEnter={(e) => e.target.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.2)'} // Hover effect
                  onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
                  >
                    {"Log out"}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleDashboardClick('admin')} className="text-gray-200 hover:text-white">
                  Admin Dashboard
                </button>
                <button onClick={() => handleDashboardClick('garage')} className="text-gray-200 hover:text-white">
                  Garage Dashboard
                </button>
                <button onClick={() => handleDashboardClick('user')} className="text-gray-200 hover:text-white">
                  User Dashboard
                </button>
              </>
            )}
          </>

          {/* <button onClick={() => handleDashboardClick('super-admin')} className="text-gray-200 hover:text-white">Super Admin Dashboard</button> */}
        </div>
      </div>
    </nav>
  );
};

// Main LandingPage Component
const LandingPage = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      <main className="flex-grow p-6">
        <header className="text-center py-12">
          <h1 className="text-4xl font-bold text-white">Welcome to Towing Services</h1>
          <p className="text-xl text-gray-400 mt-4">Your one-stop solution for towing and mechanic services.</p>
        </header>

        {/* Services Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-center text-white">Our Services</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                image={service.image}
                description={service.description}
              />
            ))}
          </div>
        </div>

        {/* Client Testimonial Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-center text-white">What Our Clients Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                text={testimonial.text}
                author={testimonial.author}
                role={testimonial.role}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer with Contact and Social Media */}
      <footer className="bg-gray-900 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2024 Towing Services. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <a href="mailto:contact@towingservices.com" className="text-gray-200 hover:text-white" aria-label="Email us">Email Us</a>
            <a href="tel:+1234567890" className="text-gray-200 hover:text-white" aria-label="Call us">Call Us</a>
          </div>
          <div className="mt-4 space-x-6 flex justify-center">
            <a href="https://facebook.com/towingservices" className="text-gray-200 hover:text-white" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a href="https://twitter.com/towingservices" className="text-gray-200 hover:text-white" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a href="https://instagram.com/towingservices" className="text-gray-200 hover:text-white" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
