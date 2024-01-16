import React from 'react';
import "./MapSearchBox.css";


class MapSearchBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            places: [],
            currentMarker: null,
        }
    }

    componentDidMount() {
        const {map, mapApi} = this.props;
        this.searchBox = new mapApi.places.SearchBox(this.searchInput);
        this.searchBox.addListener('places_changed', this.onPlacesChanged);
        this.searchBox.bindTo('bounds', map);
    }

    componentWillUnmount() {
        // https://developers.google.com/maps/documentation/javascript/events#removing
        const {mapApi} = this.props;
        mapApi.event.clearInstanceListeners(this.searchInput);
    }

    clearSearchBox = () => {
        this.searchInput.value = '';
    }


    onPlacesChanged = () => {
        const {map, addplace, mapApi} = this.props;
        const selected = this.searchBox.getPlaces();
        const { 0: place } = selected;
        if (!place.geometry) return;
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
            map.setZoom(19);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(19);
        }
        const {currentMarker} = this.state;
        // if set, remove current location pinpoint marker on the map
        if (currentMarker) {
            currentMarker.setMap(null);
        }
        let newMarker  = new mapApi.Marker({
            map: map,
            title: place.name,
            position: place.geometry.location
        })
        // save current location marker for later removal
        this.setState({
            currentMarker: newMarker,
        })
        // set new marker on map
        newMarker.setMap(map);
        // add place to the map
        addplace(selected);
        this.searchInput.blur();
    }


    render() {
        return <input id={"inputBox"}
                      ref={(ref) => {
            this.searchInput = ref;

        }} onFocus={this.clearSearchBox} placeholder="Enter an address..." type="text"/>;
    }
}


export default MapSearchBox;