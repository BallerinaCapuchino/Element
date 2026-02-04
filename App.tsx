import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Intro from './components/Intro';
import CookieConsent from './components/CookieConsent';
import { AuthProvider } from './context/AuthContext';
import { mockApi } from './utils/api';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
     mockApi.logVisitor();
     const consent = localStorage.getItem('element_cookie_consent');
     if (consent === 'true') {
         setCookieConsent(true);
     } else {
         setTimeout(() => setShowCookieBanner(true), 4000); 
     }
  }, []);

  const handleAcceptCookies = () => {
      setCookieConsent(true);
      setShowCookieBanner(false);
      localStorage.setItem('element_cookie_consent', 'true');
  };

  const handleDeclineCookies = () => {
      setCookieConsent(false);
      setShowCookieBanner(false);
      localStorage.setItem('element_cookie_consent', 'false');
  };

  const requestConsent = () => {
      setShowCookieBanner(true);
  }

  return (
    <AuthProvider>
        {loading && <Intro onComplete={() => setLoading(false)} />}
        
        <Router>
          <Routes>
            <Route path="/" element={<Landing hasConsented={cookieConsent} requestConsent={requestConsent} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admfil" element={<Admin />} />
          </Routes>
        </Router>

        <CookieConsent isVisible={showCookieBanner} onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} />
    </AuthProvider>
  );
};

export default App;