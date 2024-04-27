// App.js
import './App.css';
import MapComponent from './pages/MapComponent/MapComponent';
import WeatherInfo from './pages/WeatherInfo/WeatherInfo';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme'; // Import the custom theme


function App() {
  return (
    <ThemeProvider theme={theme}  >
      <CssBaseline sx={{ fontFamily: 'Inter, sans-serif'}}/>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<WeatherInfo/>} />
            <Route path="/map" element={<MapComponent />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
