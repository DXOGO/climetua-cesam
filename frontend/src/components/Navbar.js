import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

// import cesam logo from assets
import cesamLogo from '../assets/CESAM.png';

const Navbar = () => {
  const location = useLocation();

  const screenWidth = window.innerWidth;

  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: '#303236',
        boxShadow: 'none',
        height: screenWidth > 500 ? '40px' : '36px',
      }}
    >
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'center',
        width: "100%",
        maxWidth: '1580px',
        margin: '0 auto',
      }}>
        <IconButton
          color="inherit"
          component={Link}
          to="/"
          sx={{
            backgroundColor: location.pathname === '/' ? 'white' : 'transparent',
            color: location.pathname === '/' ? '#303236' : 'white',
            borderRadius: '0 0 0 0',
            padding: '8px 20px',
            fontSize: '16px',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: location.pathname === '/' ? 'white' : 'transparent',
            },
            marginTop: -3,
          }}
        >
          <LightModeOutlinedIcon />
          <div
            style={{
              marginLeft: '5px',
              fontSize: '16px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Previsões
          </div>
        </IconButton>

        {/* Button with icon for Mapa */}
        <IconButton
          color="inherit"
          component={Link}
          to="/map"
          sx={{
            backgroundColor: location.pathname === '/map' ? 'white' : 'transparent',
            color: location.pathname === '/map' ? '#303236' : 'white',
            borderRadius: '0 0 0 0',
            padding: '8px 16px',
            fontSize: '16px',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: location.pathname === '/map' ? 'white' : 'transparent',
            },
            marginTop: -3,
          }}
        >
          <MapOutlinedIcon />
          Mapa
        </IconButton>

        <div style={{ flexGrow: 1 }}></div>

        <a href="https://www.cesam-la.pt" target="_blank" rel="noopener noreferrer">
          <img src={cesamLogo} alt="CESAM Logo" style={{ height: '24px', marginBottom: '20px' }} />
        </a>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
