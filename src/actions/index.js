
/**
 * Location.
 */

export const SET_MAP_LOCATION = 'SET_MAP_LOCATION';

export const setMapLocation = (LngLat, zoom) => ({
  LngLat,
  type: SET_MAP_LOCATION,
  zoom,
});
