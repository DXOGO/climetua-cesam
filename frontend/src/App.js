import React, { useState, useEffect } from 'react';
import './App.css';
import MapComponent from './pages/MapComponent/MapComponent';
import WeatherInfo from './pages/WeatherInfo/WeatherInfo';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme'; // Import the custom theme
import WelcomeModal from './components/Modal/WelcomeModal';

function App() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Reset the flag in local storage whenever the page is loaded
    localStorage.removeItem('hasModalBeenShown');
  }, []);

  useEffect(() => {
    // Check if the welcome modal has been shown before
    const hasModalBeenShown = localStorage.getItem('hasModalBeenShown');
    if (!hasModalBeenShown) {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    // Set the flag in local storage to indicate that the modal has been shown
    localStorage.setItem('hasModalBeenShown', true);
  };

  return (
    <ThemeProvider theme={theme}  >
      <CssBaseline sx={{ fontFamily: 'Inter, sans-serif'}}/>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<WeatherInfo />} />
            <Route path="/map" element={<MapComponent />} />
          </Routes>
          {showWelcomeModal && <WelcomeModal onClose={handleCloseWelcomeModal} />}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
