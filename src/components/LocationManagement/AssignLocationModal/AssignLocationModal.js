import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {Button, FormGroup, Input} from "reactstrap";
import { connect } from "react-redux";
import { assignLocationRequest, assignLocationLocal } from "../../../actions/deviceActions";


class AssignLocationModal extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            locationID: "",
        }
    }

    componentDidMount() {
        const {locations} = this.props;
        // set default location to the first location, if any are available
        if (locations.length > 0) {
            this.setState({
                locationID: locations[0].id,
            })
        }
    }

    // handles tracking the location selected
    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    // handles assigning the location to the user's device
    onAssign = (e) => {
        e.preventDefault();
        const {onHide, assignLocationRequest, assignLocationLocal, deviceID} = this.props;
        const { locationID } = this.state;

        // payload for DynamoDB
        const payload = {id: deviceID, deviceGeofenceId: locationID};
        assignLocationRequest(payload);

        const {locations} = this.props;
        // retrieve the associated location
        let location =  locations.find(location => location.id === locationID);
        // payload for local state update
        const payloadLocal = {id: deviceID, geofence: location};
        assignLocationLocal(payloadLocal);
        onHide();
    }

    // handles cancelling/closing the form
    onCancel = (e) => {
        e.preventDefault();
        const {onHide} = this.props;
        onHide();
    }



    render() {
        const { show, onHide, locations, userName } = this.props;
        const {locationID} = this.state;
        const locationsList = locations.map(location => {
            return(
              <option key={location.id} value={location.id}>{location.locationName}</option>
            );
        })
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
                                    Assign a Location
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                Please select a location to assign to {userName}.
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="locationID"
                                    >
                                        <span>Location</span>
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="locationID"
                                        type="select"
                                        onChange={this.handleChange}
                                        required={true}
                                    >
                                        {locationsList}
                                    </Input>
                                </FormGroup>
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
                                    Cancel
                                </Button>
                            </div>
                            <div className={"col-6 d-flex justify-content-center"}>
                                <Button
                                    color="success"
                                    onClick={this.onAssign}
                                    disabled={locationID.length === 0}

                                >
                                    Assign Location
                                </Button>
                            </div>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}

const mapDispatchToProps = {
    assignLocationRequest,
    assignLocationLocal,
};

const mapStateToProps = (state) => {
    return {
        locations: state.locations,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignLocationModal);