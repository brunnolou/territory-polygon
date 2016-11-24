
/**
 * Map preview styles.
 */

const marker = {
  id: 'markers',
  layout: {
    'icon-image': '{icon}-11',
    'text-anchor': 'bottom',
    'text-field': '{title}',
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-offset': [0, -0.6],
    'text-size': 20,
  },
  paint: {
    'text-color': '#f00',
    'text-halo-color': '#fff',
    'text-halo-width': 1,
  },
  source: 'geoJSON',
  type: 'symbol',
};

const polygon = {
  id: 'polygons',
  paint: {
    'fill-color': '#f00',
    'fill-opacity': 0,
    'fill-outline-color': '#fff',
  },
  source: 'geoJSON',
  type: 'fill',
};

const lineLayer = {
  id: 'lines',
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
  paint: {
    'line-color': '#f00',
    'line-width': 4,
  },
  source: 'geoJSON',
  type: 'line',
};

/**
 * Export styles.
 */

export {
  marker,
  polygon,
  lineLayer,
};
