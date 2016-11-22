import React from 'react';

const ControlButton = ({ style, className, children, onClick }) => (
  <button
    className={`mapboxgl-ctrl-icon ${className ? `mapboxgl-ctrl-${className}` : ''}`}
    type="button"
    onClick={onClick}
    style={style}
  >
    {children}
  </button>
)

export default ControlButton;
