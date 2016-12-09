import './App.css';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { loadState, saveState } from './core/localStorage';
import MapGeoJson from './containers/MapGeoJson';
import React, { Component } from 'react';
import rootReducer from './reducers';

// Load initial state from localStorage.
const persistedState = loadState();

/**
 * Create store.
 */

const store = createStore(
  rootReducer,
  persistedState,
  // eslint-disable-next-line
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  saveState(store.getState());
});

/**
 * Export `App` Component.
 */

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MapGeoJson />
      </Provider>
    );
  }
}
