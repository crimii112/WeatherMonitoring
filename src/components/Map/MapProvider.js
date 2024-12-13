import React, { useCallback, useEffect, useState } from 'react';
import { Map as OlMap, View } from 'ol';
import { fromLonLat, get } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import {
  DblClickDragZoom,
  defaults as defaultInteractions,
} from 'ol/interaction';
import { Tile } from 'ol/layer';
import { XYZ } from 'ol/source';
import Button from 'ol-ext/control/Button';
import styled from 'styled-components';
import MapContext from './MapContext';

const MapProvider = ({ id, defaultMode = 'Satellite', children }) => {
  const [mapObj, setMapObj] = useState({});

  /* 지도 모드(일반/위성) 버튼 추가 */
  const addChangeModeBtn = useCallback(map => {
    const baseLayerBtn = new Button({
      html: '일반',
      title: 'Base',
      handleClick: e => handleMapMode(e, map),
    });
    const satelliteLayerBtn = new Button({
      html: '위성',
      title: 'Satellite',
      handleClick: e => handleMapMode(e, map),
    });

    map.addControl(baseLayerBtn);
    map.addControl(satelliteLayerBtn);
  }, []);

  /* 지도 모드(일반/위성) 변경 */
  const handleMapMode = (e, map) => {
    map
      .getLayers()
      .getArray()
      .forEach(ly => {
        if (ly instanceof Tile) {
          if (ly.get('name') === e.target.title) {
            ly.setVisible(true);
          } else {
            ly.setVisible(false);
          }
        }
      });
  };

  useEffect(() => {
    const center = fromLonLat([127.95, 35.95], get('EPSG:4326'));
    const zoomLevel = 7.5;

    const map = new OlMap({
      controls: defaultControls({ zoom: false, rotate: false }).extend([]),
      interactions: defaultInteractions().extend([new DblClickDragZoom()]),
      layers: [
        new Tile({
          name: 'Base',
          visible: false,
          source: new XYZ({
            url: `http://api.vworld.kr/req/wmts/1.0.0/${process.env.REACT_APP_VWORLD_API_KEY}/Base/{z}/{y}/{x}.png`,
          }),
        }),
        new Tile({
          name: 'Satellite',
          visible: false,
          source: new XYZ({
            url: `http://api.vworld.kr/req/wmts/1.0.0/${process.env.REACT_APP_VWORLD_API_KEY}/Satellite/{z}/{y}/{x}.jpeg`,
          }),
        }),
      ],
      view: new View({
        projection: get('EPSG:4326'),
        center: center,
        zoom: zoomLevel,
        maxZoom: 20,
        minZoom: 7,
      }),
      target: id,
    });

    /* 기본 Map 모드 설정 */
    map
      .getLayers()
      .getArray()
      .forEach(ly => {
        if (ly.get('name') === defaultMode) ly.setVisible(true);
      });

    addChangeModeBtn(map);
    setMapObj(map);

    return () => map.setTarget(undefined);
  }, [id, defaultMode, addChangeModeBtn]);

  return (
    <MapContext.Provider value={mapObj}>
      <MapDiv>{children}</MapDiv>
    </MapContext.Provider>
  );
};

export default MapProvider;

const MapDiv = styled.div`
  .ol-overlaycontainer-stopevent {
    padding: 5px;
  }

  /* change map mode */
  .ol-button button {
    width: 60px;
    height: 30px;
    border: 1px solid lightgrey;
    background-color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    font-family: 'NanumBarunGothic', sans-serif;
  }
  .ol-button.ol-control {
    width: fit-content;
  }
`;
