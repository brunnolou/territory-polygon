import React, { PropTypes } from 'react'

const miniMapStyle = {
  maxWidth: '250px',
  maxHeight: '250px',
  position: 'fixed',
  boxShadow: '0 10px 50px -5px #000',
  right: 0,
  top: 80,
  opacity: 0.9,
};

const MiniMap = ({ rotate, staticMapUrl }) => (
  <div>
    <button
      onClick={rotate}
      style={{
        ...miniMapStyle,
        zIndex: 2,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 486.805 486.805">
        <path
          d="M261.397 17.983c-88.91 0-167.372 51.302-203.91 129.073L32.073 94.282 0 109.73l52.783 109.565 109.565-52.786-15.45-32.07-57.078 27.49c30.833-65.31 96.818-108.35 171.577-108.35 104.668 0 189.818 85.15 189.818 189.82s-85.15 189.82-189.818 189.82c-61.63 0-119.663-30.11-155.228-80.54l-29.1 20.52c42.24 59.87 111.14 95.612 184.32 95.612 124.284 0 225.41-101.12 225.41-225.42S385.68 17.984 261.39 17.984z"
          fill="#006DF0"
        />
      </svg>
    </button>

    <a href={staticMapUrl} target="_blank">
      <img
        alt="Static map"
        style={{ ...miniMapStyle, border: '3px solid #fff' }}
        src={staticMapUrl}
      />
    </a>
  </div>
);

MiniMap.propTypes = {
  staticMapUrl: PropTypes.string,
  rotate: PropTypes.func,
};

export default MiniMap;
