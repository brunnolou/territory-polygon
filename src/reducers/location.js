import { SET_MAP_LOCATION } from '../actions';
import { center, zoom } from '../config/config.json';

const initialState = {
  LngLat: center,
  zoom,
};

/**
 * Location reducer.
 */

export default function location(state = initialState, { type, LngLat, zoom }) {
  switch (type) {
    case SET_MAP_LOCATION:
      return {
        ...state,
        ...{
          LngLat,
          zoom,
        },
      };
    default:
      return state;
  }
}
