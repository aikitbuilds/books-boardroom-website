import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/ui/navigation';
import BooksBoardroomHome from '@/pages/BooksBoardroomHome';
import ServicesPage from '@/pages/ServicesPage';
import { CONTACT_INFO, SERVICES } from '@/lib/constants';

// Individual Service Pages
const BookkeepingPage = () => {
  const bookkeepingService = SERVICES.find(s => s.id === 'bookkeeping');
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">{bookkeepingService?.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {bookkeepingService?.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto">
            {bookkeepingService?.description}
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bookkeepingService && Object.entries(bookkeepingService.pricing).map(([key, package_]) => (
              <div key={key} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-primary-900 mb-2">{package_.name}</h3>
                <div className="text-2xl font-bold text-primary-900 mb-4">{package_.price}/month</div>
                <p className="text-text-secondary mb-6">{package_.description}</p>
                <ul className="space-y-2">
                  {package_.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-secondary-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const TaxServicesPage = () => {
  const taxService = SERVICES.find(s => s.id === 'tax-services');
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">{taxService?.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {taxService?.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto">
            {taxService?.description}
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {taxService && Object.entries(taxService.pricing).map(([key, package_]) => (
              <div key={key} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-primary-900 mb-2">{package_.name}</h3>
                <div className="text-2xl font-bold text-primary-900 mb-4">{package_.price}</div>
                <p className="text-text-secondary mb-6">{package_.description}</p>
                <ul className="space-y-2">
                  {package_.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-secondary-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ConsultingPage = () => {
  const consultingService = SERVICES.find(s => s.id === 'accounting-consulting');
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">{consultingService?.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {consultingService?.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto">
            {consultingService?.description}
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {consultingService && Object.entries(consultingService.pricing).map(([key, package_]) => (
              <div key={key} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-primary-900 mb-2">{package_.name}</h3>
                <div className="text-2xl font-bold text-primary-900 mb-4">{package_.price}/hour</div>
                <p className="text-text-secondary mb-6">{package_.description}</p>
                <ul className="space-y-2">
                  {package_.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-secondary-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ControllerPage = () => {
  const controllerService = SERVICES.find(s => s.id === 'fractional-controller');
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">{controllerService?.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {controllerService?.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto">
            {controllerService?.description}
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {controllerService && Object.entries(controllerService.pricing).map(([key, package_]) => (
              <div key={key} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-primary-900 mb-2">{package_.name}</h3>
                <div className="text-2xl font-bold text-primary-900 mb-4">{package_.price}/month</div>
                <p className="text-text-secondary mb-6">{package_.description}</p>
                <ul className="space-y-2">
                  {package_.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-secondary-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const CFOPage = () => {
  const cfoService = SERVICES.find(s => s.id === 'fractional-cfo');
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">{cfoService?.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {cfoService?.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-4xl mx-auto">
            {cfoService?.description}
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cfoService && Object.entries(cfoService.pricing).map(([key, package_]) => (
              <div key={key} className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-primary-900 mb-2">{package_.name}</h3>
                <div className="text-2xl font-bold text-primary-900 mb-4">{package_.price}/month</div>
                <p className="text-text-secondary mb-6">{package_.description}</p>
                <ul className="space-y-2">
                  {package_.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-secondary-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const WhoWeServePage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary-900 mb-4">Who We Serve</h1>
      <p className="text-text-secondary">Coming soon...</p>
    </div>
  </div>
);

const AboutPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary-900 mb-4">Our Approach</h1>
      <p className="text-text-secondary">Coming soon...</p>
    </div>
  </div>
);

const ResourcesPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary-900 mb-4">Resources</h1>
      <p className="text-text-secondary">Coming soon...</p>
    </div>
  </div>
);

const ContactPage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-primary-900 mb-4">Contact Us</h1>
      <p className="text-text-secondary">Coming soon...</p>
    </div>
  </div>
);

// Redirect component for Calendly
const ScheduleRedirect = () => {
  React.useEffect(() => {
    window.location.href = CONTACT_INFO.calendly;
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary-900 mb-4">Redirecting to Scheduling...</h1>
        <p className="text-text-secondary mb-4">You'll be redirected to Cyndi's calendar in a moment.</p>
        <a 
          href={CONTACT_INFO.calendly}
          className="text-accent-600 hover:text-accent-700 underline"
        >
          Click here if you're not redirected automatically
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<BooksBoardroomHome />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/bookkeeping" element={<BookkeepingPage />} />
          <Route path="/services/tax-services" element={<TaxServicesPage />} />
          <Route path="/services/accounting-consulting" element={<ConsultingPage />} />
          <Route path="/services/fractional-controller" element={<ControllerPage />} />
          <Route path="/services/fractional-cfo" element={<CFOPage />} />
          <Route path="/who-we-serve" element={<WhoWeServePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/schedule" element={<ScheduleRedirect />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
