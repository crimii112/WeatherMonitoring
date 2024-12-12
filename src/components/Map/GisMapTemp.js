// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { Map, Overlay, View } from 'ol';
// import { defaults } from 'ol/control';
// import { defaults as interationDefaults } from 'ol/interaction';
// import { fromLonLat, get } from 'ol/proj';
// import Button from 'ol-ext/control/Button';
// import styled from 'styled-components';
// import { baseLayer, satelliteLayer } from './GisMapLayer';
// import { getMarkerLayer } from './GisMarkerLayer';

// function GisMap({ coordInfo }) {
//   const mapRef = useRef(null);
//   const [mapMode, setMapMode] = useState('Satellite');

//   /* 지도 모드(일반/위성) 버튼 추가 */
//   const addChangeModeBtn = map => {
//     const baseLayerBtn = new Button({
//       html: '<span>일반</span>',
//       title: 'Base',
//       handleClick: () => {
//         setMapMode('Base');
//       },
//     });
//     const satelliteLayerBtn = new Button({
//       html: '<span>위성</span>',
//       title: 'Satellite',
//       handleClick: () => {
//         setMapMode('Satellite');
//       },
//     });

//     map.addControl(baseLayerBtn);
//     map.addControl(satelliteLayerBtn);
//   };

//   /* 마커 추가 */
//   const addMarkerLayer = useCallback(
//     map => {
//       const markerLayer = getMarkerLayer(coordInfo);
//       map.addLayer(markerLayer);
//     },
//     [coordInfo],
//   );

//   /* 오버레이 추가 */
//   const addOverlay = map => {
//     let selected = null;
//     const style =
//       'position:relative; padding: 10px; color: #FFF; border-radius: 5px; background-color: #000; font-size: 12px;';
//     map.on('pointermove', function (e) {
//       if (selected !== null) {
//         map.getOverlays().forEach(ol => map.removeOverlay(ol));
//         selected = null;
//       }

//       map.forEachFeatureAtPixel(e.pixel, function (f) {
//         selected = f;
//         const info = selected.get('overlayInfo');
//         if (info !== undefined) {
//           let container = document.createElement('div');
//           container.style.cssText = style;
//           const content = '측정소명 : ' + info.nodeNm;
//           container.innerText = content;
//           const overlay = new Overlay({
//             element: container,
//             position: [info.lon, info.lat],
//             positioning: 'bottom-center',
//           });

//           map.addOverlay(overlay);
//         }

//         return true;
//       });
//     });
//   };

//   /* 지도 */
//   useEffect(() => {
//     const center = fromLonLat([127.95, 35.95], get('EPSG:4326'));
//     const zoomLevel = 7.5;

//     const map = new Map({
//       controls: defaults({ zoom: false, rotate: false }).extend([]),
//       layers: [mapMode === 'Base' ? baseLayer : satelliteLayer],
//       target: mapRef.current,
//       view: new View({
//         projection: get('EPSG:4326'),
//         center: center,
//         zoom: zoomLevel,
//       }),
//       interactions: interationDefaults({
//         dragPan: false,
//         mouseWheelZoom: false,
//       }),
//     });

//     console.log(map);

//     addChangeModeBtn(map);
//     addMarkerLayer(map);
//     addOverlay(map);

//     return () => map.setTarget(undefined);
//   }, [mapMode, coordInfo, addMarkerLayer]);

//   return <MapDiv ref={mapRef} style={{ width: '100%', height: '100%' }} />;
// }

// export default GisMap;

// const MapDiv = styled.div`
//   .ol-overlaycontainer-stopevent {
//     padding: 5px;
//   }

//   /* change map mode */
//   .ol-button button {
//     width: 60px;
//     height: 30px;
//     border: 1px solid lightgrey;
//     background-color: rgba(255, 255, 255, 0.8);
//     cursor: pointer;
//   }
//   .ol-button.ol-control {
//     width: fit-content;
//   }
// `;
