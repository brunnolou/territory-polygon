import React from 'react';

/**
 * `ControlGroup` Component.
 */

const ControlGroup = ({ children }) => {
  return (
    <div className="mapboxgl-ctrl mapboxgl-ctrl-group">
      {children}
    </div>
  );
};

export default ControlGroup;
