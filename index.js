// Import stylesheets
import './style.css';
import {
  Map,
  TileLayer,
  Marker,
  Icon,
  GeoJSON,
  Polygon,
  LayerGroup,
  Control,
} from 'leaflet';
import * as d3 from 'd3';
import config from './config.json';
import pois from './data/poi.json';
import roadls from './data/roadl.json';
import roadps from './data/roadp.json';
import buildings from './data/building.json';
import waters from './data/water.json';
import greens from './data/green.json';
import plazas from './data/plaza.json';
import trainings from './data/training.json';
import boundary from './data/boundary.json';
// Write Javascript code!
const map = new Map('map');
const gaodeLayer = new TileLayer(
  'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  { subdomains: '1234' }
);
gaodeLayer.addTo(map);
map.setView([30.873098, 120.13309], 16);
// 兴趣点图层
const poiLayer = new GeoJSON(pois, {
  pointToLayer: function (geoJsonPoint, latlng) {
    const marker = new Marker(latlng, {
      icon: new Icon({
        iconUrl: 'data:image/svg+xml,' + encodeURIComponent(config.default.svg),
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
    });
    return marker;
  },
});
poiLayer.addTo(map);
// 道路线图层
const roadlLayer = new GeoJSON(roadls, {
  style: function (geoJsonFeature) {
    return {
      color: '#eeeeee',
      weight: 3,
    };
  },
});
roadlLayer.addTo(map);
// 边界图层
const boundaryLayer = new GeoJSON(boundary, {
  style: function (geoJsonFeature) {
    return {
      color: '#eeeeee',
      weight: 5,
    };
  },
});
boundaryLayer.addTo(map);
// 水系图层
const waterLayer = new GeoJSON(waters, {
  style: function (geoJsonFeature) {
    return {
      color: '#3388ff',
      weight: 1,
      fillOpacity: 1,
    };
  },
});
waterLayer.addTo(map);
// 道路面图层
const roadpLayer = new GeoJSON(roadps, {
  style: function (geoJsonFeature) {
    return {
      color: '#eeeeee',
      weight: 2,
    };
  },
});
roadpLayer.addTo(map);
// 绿地图层
const greenLayer = new GeoJSON(greens, {
  style: function (geoJsonFeature) {
    return {
      color: '#33ff88',
      weight: 1,
      stroke: false,
    };
  },
});
greenLayer.addTo(map);
// 建筑图层
const buildingLayer = new GeoJSON(buildings, {
  style: function (geoJsonFeature) {
    return {
      color: '#333333',
      weight: 1,
    };
  },
});
buildingLayer.addTo(map);
// 广场图层
const plazaLayer = new GeoJSON(plazas, {
  style: function (geoJsonFeature) {
    return {
      color: '#dddddd',
      weight: 1,
    };
  },
});
plazaLayer.addTo(map);
// 操场图层
const trainingLayer = new LayerGroup();
trainingLayer.addTo(map);
trainings.features.forEach((feature) => {
  const latlngs = feature.geometry.coordinates.map((ring) =>
    ring.map((latlng) => [latlng[1], latlng[0]])
  );
  const polygon = new Polygon(latlngs, {
    color: '#ff3388',
    weight: 1,
  });
  trainingLayer.addLayer(polygon);
});
// 图层控制
const control = new Control.Layers(
  {},
  {
    高德影像: gaodeLayer,
    边界: boundaryLayer,
    道路线: roadlLayer,
    道路面: roadpLayer,
    建筑: buildingLayer,
    水系: waterLayer,
    绿地: greenLayer,
    广场: plazaLayer,
    操场: trainingLayer,
  },
  {
    collapsed: false,
  }
);
control.addTo(map);
// d3 magic
const svg = d3.select('svg');
const defs = svg.append('svg:defs');
const pattern = defs.append('svg:pattern');
pattern
  .attr('id', 'water')
  .attr('width', 225)
  .attr('height', 225)
  .attr('patternUnits', 'userSpaceOnUse');
const image = pattern.append('svg:image');
image
  .attr(
    'href',
    'https://cdn.jsdelivr.net/gh/shengzheng1981/leaflet-campus@main/assets/images/water01.jpg'
  )
  .attr('width', 225)
  .attr('height', 225)
  .attr('x', 0)
  .attr('y', 0);

waterLayer.eachLayer((layer) => {
  const path = layer._path;
  path.setAttribute('fill', 'url(#water)');
});
