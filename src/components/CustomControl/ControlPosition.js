import React from 'react';

const ControlPosition = ({ children }) => {
  return (
    <div className="mapboxgl-control-container">
      <div className="mapboxgl-ctrl-top-left">
        {children}
      </div>
    </div>
  );
};

export default ControlPosition;
