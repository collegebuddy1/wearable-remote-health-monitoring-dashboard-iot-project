import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {Button} from "reactstrap";
import { connect } from "react-redux";
import { removeLocationRequest } from "../../../actions/deviceActions";


class RemoveLocationModal extends React.Component{


    // handles removing the location from the user's device
    onRemove = (e) => {
        e.preventDefault();
        const {onHide, removeLocationRequest, deviceID} = this.props;
        const payload = {id: deviceID, deviceGeofenceId: null};
        removeLocationRequest(payload);
        onHide();
    }

    // handles cancelling/closing the form
    onCancel = (e) => {
        e.preventDefault();
        const {onHide} = this.props;
        onHide();
    }


    render() {
        const { show, onHide, locationName, userName } = this.props;
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
                                    Location Removal Confirmation
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                Are you sure you would like to remove location '{locationName}' from user '{userName}'.
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
                                    color="danger"
                                    onClick={this.onRemove}
                                >
                                    Remove Location
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
    removeLocationRequest,
};


export default connect(null, mapDispatchToProps)(RemoveLocationModal);