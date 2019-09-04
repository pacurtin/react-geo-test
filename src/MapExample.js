import React, { Component } from 'react';

import {
  SimpleButton,
  MapComponent,
  NominatimSearch,
  MeasureButton,
  LayerTree,
  MapProvider,
  mappify,
  onDropAware
} from '@terrestris/react-geo';
import { Drawer } from 'antd';

import './MapExample.css';
import 'ol/ol.css';
import 'antd/dist/antd.css';
import './react-geo.css';

import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceOsm from 'ol/source/OSM';
import OlSourceTileJson from 'ol/source/TileJSON';
import OlLayerGroup from 'ol/layer/Group';

const MappifiedNominatimSearch = mappify(NominatimSearch);
const MappifiedMeasureButton = mappify(MeasureButton);
const MappifiedLayerTree = mappify(LayerTree);
const Map = mappify(onDropAware(MapComponent));

const layer = new OlLayerTile({
  source: new OlSourceOsm()
});

const layerGroup = new OlLayerGroup({
  name: 'Layergroup',
  layers: [
    new OlLayerTile({
      name: 'Food insecurity layer',
      minResolution: 200,
      maxResolution: 2000,
      source: new OlSourceTileJson({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.20110804-hoa-foodinsecurity-3month.json?secure',
        crossOrigin: 'anonymous'
      })
    }),
    new OlLayerTile({
      name: 'World borders layer',
      minResolution: 2000,
      maxResolution: 20000,
      source: new OlSourceTileJson({
        url: 'https://api.tiles.mapbox.com/v3/mapbox.world-borders-light.json?secure',
        crossOrigin: 'anonymous'
      })
    })
  ]
});

const center = [ 788453.4890155146, 6573085.729161344 ];

// create a new instance of ol.map in ES6 syntax
const map = new OlMap({
  view: new OlView({
    center: center,
    zoom: 16,
  }),
  layers: [layer]
});

map.on('postcompose', map.updateSize);

class MapExample extends Component {
  state = {visible: false};

  toggleDrawer = () => {
    this.setState({visible: !this.state.visible});
  };

  render() {
    return (
      <div className="MapExample">
        <MapProvider map={map}>
          <Map/>
          <SimpleButton
            style={{position: 'fixed', top: '30px', right: '30px'}}
            onClick={this.toggleDrawer}
            icon="bars"
          />
          <Drawer
            title="react-geo-application"
            placement="right"
            onClose={this.toggleDrawer}
            visible={this.state.visible}
            mask={false}
          >
            <MappifiedNominatimSearch
              key="search"
              map={map}
            />
            <MappifiedMeasureButton
              key="measureButton"
              name="line"
              map={map}
              measureType="line"
              icon="pencil"
            >
              Measure Button
            </MappifiedMeasureButton>
            <MappifiedLayerTree
              map={map}
              layerGroup={layerGroup}
            />
          </Drawer>
        </MapProvider>
      </div>
    );
  }
}

export default MapExample;
