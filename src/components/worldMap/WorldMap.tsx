import proj4 from 'proj4';
import { register } from 'ol/proj/proj4.js';
import { OSM } from 'ol/source';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import { Map, View, TileLayer, WebGLTileLayer } from 'react-openlayers';
import 'react-openlayers/dist/index.css'; // for css
import { useEffect, useState } from 'react';
import type GeoTIFFSource from 'ol/source/GeoTIFF.js';
import { FlyToRegions } from '../../utilities/constants';
import './world-map.scss';

type WorldMapParams = {
    region: string
}

export function WorldMap({region}: WorldMapParams) {
    const [tiffSource, setTiffSource] = useState<GeoTIFFSource>();
    const selectedFlyTo = FlyToRegions[region];

    useEffect(() => {
        proj4.defs("EPSG:3035", "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
        register(proj4);
        const cogSource = new GeoTIFF({
            sources: [{
                url: "maps/output.tif",
                nodata: 65535, // obtained from geodalinfo
            }],
            projection: 'EPSG:3035',
        });
        setTiffSource(cogSource)
    }, []);


    return (
        <section className="middle-panel">
            {tiffSource && selectedFlyTo ? <Map>
                <TileLayer source={new OSM()} />
                <WebGLTileLayer source={tiffSource} opacity={0.5} ></WebGLTileLayer>
                <View key={region} zoom={selectedFlyTo.zoom} projection={'EPSG:3857'} center={selectedFlyTo.center}/>
            </Map> : ''}
        </section>
    );
}