import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Overlay } from 'ol';

import Loading from 'components/Loading';
import MapContext from 'components/Map/MapContext';
import { getMarkerLayer } from 'components/Map/GisMarkerLayer';
import cmmnStyles from '../css/Common.module.css';

function StationGIS() {
  const apiUrl = `${process.env.REACT_APP_SERVER_URL}/weatheris/srch/datas.do`;
  const map = useContext(MapContext);
  const [loading, setLoading] = useState(true);

  /* 마커 추가 */
  const addMarkerLayer = useCallback(
    async map => {
      const json = await axios.post(apiUrl, {
        page: 'weather/nodeid',
      });
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

  return (
    <div className={cmmnStyles.basicDiv}>
      <MapDiv id="gis">{loading && <Loading />}</MapDiv>
    </div>
  );
}

export default StationGIS;

const MapDiv = styled.div`
  width: 100%;
  height: 795px;
`;
