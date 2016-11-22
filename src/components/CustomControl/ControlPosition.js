import React from 'react';

const ControlPosition = ({ children }) => (
  <div className="mapboxgl-control-container">
    <div className="mapboxgl-ctrl-top-left">
      {children}
    </div>
  </div>
);

export default ControlPosition;
