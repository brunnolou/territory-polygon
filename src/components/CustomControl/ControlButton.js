import React from 'react';

/**
 * `ControlButton` Component.
 */

const ControlButton = ({ style, className, children, onClick }) => {
  return (
    <button
      className={`mapboxgl-ctrl-icon ${className ? `mapboxgl-ctrl-${className}` : ''}`}
      onClick={onClick}
      style={style}
      type="button"
      >
      {children}
    </button>
  );
};

export default ControlButton;
