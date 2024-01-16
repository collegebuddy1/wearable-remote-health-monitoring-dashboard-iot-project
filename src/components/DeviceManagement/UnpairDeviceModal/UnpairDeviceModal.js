import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {Button } from "reactstrap";
import { connect } from "react-redux";
import { disassociateDeviceWithUser } from "../../../actions/deviceActions";


class UnpairDeviceModal extends React.Component{


    // handles unpairing the device
    onRemove = (e) => {
        e.preventDefault();
        const {onHide, userID, deviceID, disassociateDeviceWithUser} = this.props;
        let payload = {deviceID: deviceID, userID: userID};
        disassociateDeviceWithUser(payload);
        onHide();
    }

    // handles cancelling/closing the form
    onCancel = (e) => {
        e.preventDefault();
        const {onHide} = this.props;
        onHide();
    }

    render() {
        const { show, onHide, userName, userID, deviceID } = this.props;

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
                                    Device Removal Confirmation
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                Are you sure you want to remove Device '{deviceID}' from user '{userName}' with ID {userID}?
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
                                    Unpair Device
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
    disassociateDeviceWithUser,
};

export default connect(null, mapDispatchToProps)(UnpairDeviceModal);