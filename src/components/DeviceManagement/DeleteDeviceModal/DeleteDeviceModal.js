import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {Button, Input} from "reactstrap";
import { connect } from "react-redux";
import { deleteDeviceRequest } from "../../../actions/deviceActions";


class DeleteDeviceModal extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            confirmationComplete: false,
        }
    }


    // handles confirmation box changes, sets boolean to true when complete
    handleChange = (e) => {
        e.preventDefault();
        // check if confirmation is complete
        if (e.target.value === "confirm") {
            this.setState({
                confirmationComplete: true,
            })
        } else {
            this.setState({
                confirmationComplete: false,
            })
        }
    }


    // handles deleting the device
    onDelete = (e) => {
        e.preventDefault();
        const {onHide, deviceID, deleteDeviceRequest} = this.props;
        let payload = {deviceID: deviceID};
        deleteDeviceRequest(payload);
        onHide();
    }

    // handles cancelling/closing the form
    onCancel = (e) => {
        e.preventDefault();
        const {onHide} = this.props;
        this.setState({
            confirmationComplete: false,
        })
        onHide();
    }



    render() {
        const { show, onHide, deviceID } = this.props;
        const {confirmationComplete} = this.state;
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
                                    Device Deletion Confirmation
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                Are you sure you want to permanently delete Device '{deviceID}'?
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                <p>For deletion, please type "confirm" below then click "Delete Device".</p>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col-10 d-flex justify-content-center"}>
                                <Input className="form-control-alternative" type="text" id="confirmationBox" onChange={this.handleChange} />
                            </div>
                            <div className={"col-2"}>
                                {(confirmationComplete)? <i className={"fas fa-check-circle"} style={{color: "green", fontSize: "32px"}} />
                                    :
                                    <i className={"fas fa-times-circle"} style={{color: "red", fontSize: "32px"}} />}
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
                                    onClick={this.onDelete}
                                    disabled={!confirmationComplete}
                                >
                                    Delete Device
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
    deleteDeviceRequest,
};

export default connect(null, mapDispatchToProps)(DeleteDeviceModal);