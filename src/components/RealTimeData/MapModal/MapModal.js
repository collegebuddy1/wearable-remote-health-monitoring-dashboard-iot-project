import * as React from "react";
import {connect} from "react-redux";
import Modal from "react-bootstrap/Modal";
import {Button} from "reactstrap";
import GoogleMap from "google-map-react";


class MapModal extends React.Component{

    constructor(props) {
        super(props);
        const {deviceID} = this.props;
        let device = "NONE";
        if (deviceID) {
            device = deviceID;
        }
        this.state = {
            deviceID: device,
            location: {lat: 0, lng: 0},
            locationDataAvailable: false,
            zoom: 19,
            map: null,
            maps: null,
            marker: null,
        }
    }

    componentDidMount() {
        this.updateLocation();
    }

    componentDidUpdate(prevProps) {
        if (this.props.devices !== prevProps.devices) {
            this.updateLocation();
        }
    }

    updateLocation = () => {
        const { devices } = this.props;
        const { deviceID, map, maps, marker } = this.state;
        let device = devices.find(device => device.id === deviceID);
        if (device && device.lastLocation) {
            this.setState({
                location: device.lastLocation,
                locationDataAvailable: true,
            })
        }

        if (marker) {
            marker.setMap(null);
        }
        if (map && maps && device.lastLocation) {
            let newMarker  = new maps.Marker({
                map: map,
                position: device.lastLocation
            })
            newMarker.setMap(map);
            this.setState({
                marker: newMarker,
            })
        }
    }

    // handles cancelling/closing the form
    onCancel = (e) => {
        e.preventDefault();
        const {onHide} = this.props;
        onHide();
    }

    mapOptions = (maps) => {
        return {
            streetViewControl: true,
            scaleControl: true,
            fullscreenControl: false,
            zoomControl: true,
            clickableIcons: false,
            mapTypeControl: true,
            styles: [{
                featureType: "poi.business",
                elementType: "labels",
                stylers: [{
                    visibility: "on"
                }]
            }],
            mapTypeControlOptions: {
                style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: maps.ControlPosition.TOP_LEFT,
                mapTypeIds: [
                    maps.MapTypeId.ROADMAP,
                    maps.MapTypeId.HYBRID
                ]
            },
        }
    }

    apiActions = (map, maps) => {
        const {location} = this.state;
        this.setState({
            map: map,
            maps: maps,
        })
        let newMarker  = new maps.Marker({
            map: map,
            position: location
        })

        this.setState({
            marker: newMarker,
        })
        newMarker.setMap(map);
    }

    render() {
        const { show, onHide } = this.props;
        const { location, locationDataAvailable, zoom } = this.state;
        return(
            <div>
                <Modal
                    onHide={onHide}
                    size="md"
                    show={show}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div className="row">
                                <div className="col d-flex justify-content-center align-items-center">
                                    User Location
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                {(!locationDataAvailable)? "Sorry no location data for this user is available at this time." : null}
                            </div>
                        </div>
                        <div className={"row"} style={{width: "480px", height: "380px"}}>
                            <div className={"col d-flex justify-content-center"}>
                                <GoogleMap
                                    bootstrapURLKeys={{
                                        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                                        libraries: ['drawing', 'geometry', 'places'],
                                    }}
                                    center={[location.lat, location.lng]}
                                    zoom={zoom}
                                    yesIWantToUseGoogleMapApiInternals
                                    onGoogleApiLoaded={({ map, maps }) => this.apiActions(map, maps)}
                                    options={this.mapOptions}
                                />

                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className={"row"}>
                            <div className={"col-6 d-flex justify-content-center"}>
                                <Button
                                    color="primary"
                                    onClick={this.onCancel}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        devices: state.devices,
    };
};


export default connect(mapStateToProps)(MapModal);