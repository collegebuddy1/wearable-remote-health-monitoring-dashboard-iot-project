import * as React from "react";
import GoogleMap from "google-map-react";


class LocationMap extends React.Component{


    constructor(props) {
        super(props);
        this.state = {
            center: [49.263232, -123.25429],
            zoom: 17,
        }
    }


    mapOptions = (maps) => {
        return {
            streetViewControl: false,
            scaleControl: false,
            fullscreenControl: false,
            zoomControl: false,
            clickableIcons: false,
        }
    }

    apiActions = (map, maps) => {
        const {path} = this.props;

        // define polygon
        let polygon = new maps.Polygon({
            paths: path,
            strokeWeight: 2,
            fillOpacity: 0.3,
            fillColor: "#20b2c9",
            strokeColor: "#20b2c9",
        })
        // add the polygon to the map
        polygon.setMap(map);


        // fit map viewport with polygon bounds
        let bounds = new maps.LatLngBounds();
        for (let i = 0; i < path.length; i++) {
            let point = new maps.LatLng(path[i].lat, path[0].lng);
            bounds.extend(point);
        }
        map.fitBounds(bounds);
    }


    render() {
        const {center, zoom} = this.state;
        return(
            <div style={{width: "250px", height: "250px"}}>
                <GoogleMap
                    bootstrapURLKeys={{
                        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                        libraries: ['drawing', 'geometry', 'places'],
                    }}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => this.apiActions(map, maps)}
                    options={this.mapOptions}
                />
            </div>
        )
    }

}


export default LocationMap;