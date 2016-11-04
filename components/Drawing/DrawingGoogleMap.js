import React from 'react';
import { withGoogleMap, GoogleMap, Polygon } from 'react-google-maps';
import DrawingManager from 'react-google-maps/lib/drawing/DrawingManager';
import style from './mapStyle.json';

const polygonOptions = {
  clickable: true,
  editable: true,
  fillColor: '#ff0',
  fillOpacity: 0.15,
  strokeColor: '#f00',
  strokeWeight: 5,
  zIndex: 1,
};

export const DrawingGoogleMap = withGoogleMap(({ polygon, onPolygonComplete }) => {

  function onClick() {
    onPolygonComplete(this);
  }

  return (
    <GoogleMap
      defaultZoom={14}
      defaultCenter={new google.maps.LatLng(41.563891, -8.453595)}
      options={{
        mapTypeControl: true,
        styles: style,
      }}
    >
      {polygon.length ?
        <Polygon
          path={polygon}
          onClick={onClick}
          options={polygonOptions}
        />
      : ''}

      <DrawingManager
        onPolygonComplete={onPolygonComplete}
        defaultOptions={{
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
          },
          polygonOptions,
        }}
      />
    </GoogleMap>
  );
});

export default DrawingGoogleMap;
