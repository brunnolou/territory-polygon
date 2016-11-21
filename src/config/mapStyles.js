
/**
 * Map preview styles.
 */

export const marker = {
  id: 'markers',
  layout: {
    'icon-image': '{icon}-11',
    'text-field': '{title}',
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-offset': [0, -0.6],
    'text-anchor': 'bottom'
  },
  source: 'geoJSON',
  type: 'symbol',
};

export const polygon = {
  id: 'polygons',
  paint: {
    'fill-opacity': .01,
    'fill-color': '#f00',
    'fill-outline-color': '#fff',
  },
  source: 'geoJSON',
  type: 'fill',
};

export const lineLayer = {
  id: 'lines',
  layout: {
    'line-cap': 'round',
    'line-join': 'round'
  },
  paint: {
    'line-color': '#f00',
    'line-width': 4,
  },
  source: 'geoJSON',
  type: 'line',
};
