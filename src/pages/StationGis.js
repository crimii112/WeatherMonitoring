import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Overlay } from 'ol';

import Loading from 'components/Loading';
import MapContext from 'components/Map/MapContext';
import { getMarkerLayer } from 'components/Map/GisMarkerLayer';
import cmmnStyles from '../css/Common.module.css';
import { fromLonLat, get } from 'ol/proj';
import Button from 'components/Button';

function StationGIS() {
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/weatheris/srch/datas.do`;
  const map = useContext(MapContext);
  const [loading, setLoading] = useState(true);
  const [stationList, setStationList] = useState([]);
  const currentCenterRef = useRef(
    fromLonLat([127.95, 35.95], get('EPSG:4326')),
  );
  const currentZoomLevelRef = useRef(7.5);

  /* 마커 추가 */
  const addMarkerLayer = useCallback(
    async map => {
      const json = await axios.post(apiUrl, {
        page: 'weather/nodeid',
      });
      setStationList(json.data.rstList);
      setLoading(false);

      const markerLayer = getMarkerLayer(json.data.rstList);
      map.addLayer(markerLayer);
    },
    [apiUrl],
  );

  /* 오버레이 추가 */
  const addOverlay = map => {
    let selected = null;
    const style =
      'position:relative; padding: 10px; color: #FFF; border-radius: 5px; background-color: #000; font-size: 12px;';
    map.on('pointermove', function (e) {
      if (selected !== null) {
        map.getOverlays().forEach(ol => map.removeOverlay(ol));
        selected = null;
      }

      map.forEachFeatureAtPixel(e.pixel, function (f) {
        selected = f;
        const info = selected.get('overlayInfo');
        if (info !== undefined) {
          let container = document.createElement('div');
          container.style.cssText = style;
          const content = '측정소명 : ' + info.nodeNm;
          container.innerText = content;
          const overlay = new Overlay({
            element: container,
            position: [info.lon, info.lat],
            positioning: 'bottom-center',
          });

          map.addOverlay(overlay);
        }

        return true;
      });
    });
  };

  useEffect(() => {
    if (!map.ol_uid) {
      return;
    }

    addMarkerLayer(map);
    addOverlay(map);
  }, [map, addMarkerLayer]);

  const handleChangeSelect = (e, map) => {
    let center;
    let zoomLevel;

    if (e.target.value === 'all') {
      center = fromLonLat([127.95, 35.95], get('EPSG:4326'));
      zoomLevel = 7.5;
    } else {
      const station = stationList.filter(s => s.nodeNm === e.target.value)[0];
      center = fromLonLat([station.lon, station.lat], get('EPSG:4326'));
      zoomLevel = 19;
    }

    currentCenterRef.current = center;
    currentZoomLevelRef.current = zoomLevel;

    /* center 설정 */
    map.getView().setCenter(center);

    /* zoomLevel 설정 */
    map.getView().setZoom(zoomLevel);
  };

  const handleRefresh = map => {
    map.getView().setCenter(currentCenterRef.current);
    map.getView().setZoom(currentZoomLevelRef.current);
  };

  return (
    <div className={cmmnStyles.basicDiv}>
      <MapDiv id="gis">
        {loading && <Loading />}
        <div id="select-box">
          <label>측정소</label>
          <select
            className={cmmnStyles.selectBox}
            onChange={e => handleChangeSelect(e, map)}
          >
            <option value="all" key="all">
              전체
            </option>
            {stationList.map(s => (
              <option value={s.nodeNm} key={s.nodeId}>
                {s.nodeNm}
              </option>
            ))}
          </select>
        </div>
        <div id="refresh-btn">
          <button onClick={() => handleRefresh(map)}>
            <img
              src="/assets/images/refresh.png"
              alt="refresh"
              width={15}
              height={15}
            />
          </button>
        </div>
      </MapDiv>
    </div>
  );
}

export default StationGIS;

const MapDiv = styled.div`
  width: 100%;
  height: 795px;
  position: relative;

  #select-box {
    display: flex;
    z-index: 1;
    position: absolute;
    top: 70px;
    left: 5px;
    box-sizing: border-box;
    padding: 5px;
    border: 1px solid lightgrey;
    background-color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    align-items: center;

    label {
      margin-left: 5px;
    }
    select {
      margin-left: 10px;
    }
  }

  #refresh-btn {
    z-index: 1;
    position: absolute;
    top: 125px;
    left: 5px;
    box-sizing: border-box;
    padding: 5px;
    border: 1px solid lightgrey;
    background-color: rgba(255, 255, 255, 0.8);

    button {
      padding: 0;
      margin: 0;
      border: 0;
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0);
    }
  }
`;
