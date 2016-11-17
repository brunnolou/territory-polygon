import React, { Component } from 'react';
import MapGeoJson from './components/MapGeoJson';
import GeoJSON from './containers/GeoJSON';
import './App.css';

class App extends Component {
  render() {
    return (
      <GeoJSON>
        <MapGeoJson />
      </GeoJSON>
    );
  }
}

export default App;
