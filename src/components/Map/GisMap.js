import React, { useCallback, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Overlay } from 'ol';

import MapContext from 'components/Map/MapContext';
import { getMarkerLayer } from 'components/Map/GisMarkerLayer';
import { fromLonLat, get } from 'ol/proj';

function GisMap({ id, data }) {
  const map = useContext(MapContext);

  /* 마커 추가 */
  const addMarkerLayer = useCallback(
    async map => {
      const markerLayer = getMarkerLayer(data);
      map.addLayer(markerLayer);
    },
    [data],
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

    /* center 설정 */
    map
      .getView()
      .setCenter(fromLonLat([data[0].lon, data[0].lat], get('EPSG:4326')));

    /* zoomLevel 설정 */
    map.getView().setZoom(19);

    addMarkerLayer(map);
    addOverlay(map);
  }, [map, data, addMarkerLayer]);

  return <MapDiv id={id} />;
}

export default GisMap;

const MapDiv = styled.div`
  width: 100%;
  height: 390px;
`;
