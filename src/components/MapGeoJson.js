import React, { Component } from "react";
// import ReactMapboxGl, { GeoJSONLayer, ScaleControl, ZoomControl } from "react-mapbox-gl";
import geojson from "../config/geojson.json";
import { accessToken } from "../config/config.json";
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl-draw/dist/mapbox-gl-draw';

mapboxgl.accessToken = accessToken;

const containerStyle = {
  height: '100vh',
  width: '100%'
};

export default class MapGeoJson extends Component {
  // state = {
  //   popup: null,
  //   center: [ -77.01239, 38.91275 ]
  // };
  //
  // handleStyleLoad(map) {
  //   const Draw = mapboxgl.Draw();
  //
  //   map.addControl(Draw);
  // }

  onLoad() {
    const map = new mapboxgl.Map({
      container: 'me',
      style: 'mapbox://styles/mapbox/streets-v9'
    });

    console.info(mapboxgl.Draw);

    const Draw = mapboxgl.Draw();
console.info(Draw);
    map.addControl(Draw)
  }

  render() {
    return (
      <div
        id="me"
        ref={this.onLoad}
        style={containerStyle}
      >
      </div>
      // <ReactMapboxGl
      //   style="mapbox://styles/mapbox/light-v8"
      //   accessToken={accessToken}
      //   center={this.state.center}
      //   movingMethod="jumpTo"
      //   containerStyle={containerStyle}>
      //   onStyleLoad={this.handleStyleLoad}
      //
      //   <ScaleControl/>
      //   <ZoomControl/>
      //   <GeoJSONLayer
      //     data={geojson}
      //     symbolLayout={{
      //       "text-field": "{place}",
      //       "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      //       "text-offset": [0, 0.6],
      //       "text-anchor": "top"
      //     }}/>
      //
      // </ReactMapboxGl>
    );
  }
}
