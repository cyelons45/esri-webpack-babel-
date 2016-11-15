import Map from 'esri/map';
import FeatureLayer from 'esri/layers/FeatureLayer';
import clusterfeaturelayer from 'cluster-layer-js/clusterfeaturelayer';

var map = new Map('content', {
  basemap: "streets",
  zoom: 3
});

map.on('load', () => {
  var clusterLayer = new clusterfeaturelayer({
    url: '//services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer/0',
    distance: 60,
    id: 'clusterLayer',
    labelColor: '#fff',
    resolution: (map.extent.getWidth() / map.width),
    useDefaultSymbol: false,
    zoomOnClick: true,
    showSingles: true,
    objectIdField: 'FID',
    mode: FeatureLayer.MODE_SNAPSHOT
  });

  map.addLayer(clusterLayer);
});
