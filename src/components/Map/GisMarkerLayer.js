import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector } from 'ol/layer';
import { fromLonLat, get } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Style, Icon } from 'ol/style';

const getFeature = (overlayInfo, lon, lat) => {
  const feature = new Feature({
    geometry: new Point(fromLonLat([lon, lat], get('EPSG:4326'))),
    overlayInfo: overlayInfo,
  });

  return feature;
};

export const getMarkerLayer = coordInfo => {
  let features = [];
  console.log(coordInfo);
  coordInfo.forEach(c => {
    features.push(getFeature(c, c.lon, c.lat));
  });

  const vectorLayer = new Vector({
    source: new VectorSource({
      features: features,
    }),
    style: new Style({
      image: new Icon({
        src: '/assets/images/marker.png',
        anchor: [0.5, 0.6],
        width: 20,
        height: 20,
      }),
    }),
  });

  return vectorLayer;
};
