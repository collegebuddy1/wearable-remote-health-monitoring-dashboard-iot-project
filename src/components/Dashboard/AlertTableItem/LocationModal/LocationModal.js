import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {Button} from "reactstrap";
import GoogleMap from "google-map-react";


class LocationModal extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            center: [49.263232, -123.25429],
            zoom: 17,
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
        const {location} = this.props;
        let newMarker  = new maps.Marker({
            map: map,
            position: location
        })
        newMarker.setMap(map);
    }

    render() {
        const { show, onHide, location } = this.props;

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
                                    User Location at Time of Alert
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"} style={{width: "480px", height: "380px"}}>
                            <div className={"col d-flex justify-content-center"}>
                                <GoogleMap
                                    bootstrapURLKeys={{
                                        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                                        libraries: ['drawing', 'geometry', 'places'],
                                    }}
                                    defaultCenter={location}
                                    defaultZoom={19}
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


export default LocationModal;