import React, { useEffect } from 'react';
import initializeMap from './LeafletTimeDimensionMap'; // Import the map initialization function

const MapComponent = () => {
  useEffect(() => {
    initializeMap(); // Call the function to initialize the map when the component mounts
  }, []);

  return (
    <div id="map" style={{ width: '100%', height: 'calc(100vh - 40px)' }}></div>
  );
};

export default MapComponent;