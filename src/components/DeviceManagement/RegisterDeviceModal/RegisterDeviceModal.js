import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {Button, FormGroup, Input} from "reactstrap";
import { connect } from "react-redux";
import { registerNewDevice } from "../../../actions/deviceActions";



class RegisterDeviceModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deviceID: "",
            deviceOS: null,
            deviceIDUnique: false,
        }
    }


    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value,
        })
        if (e.target.id === "deviceID") {
            let isUnique = this.deviceUnique(e.target.value);
            this.setState({
                deviceIDUnique: isUnique,
            })
        }
    }

    // checks that the given device ID is unique
    deviceUnique = (id) => {
        const { devices } = this.props;
        let isUnique = true;
        devices.forEach(device => {
            if (device.id === id) {
                isUnique = false;
            }
        });
        return isUnique;
    }

    // handles adding the new device
    onAdd = (e) => {
        e.preventDefault();
        const {registerNewDevice, onHide} = this.props;
        const {deviceID, deviceOS } = this.state;
        let newDevice = {id: deviceID, deviceStatus: "Inactive", deviceOS: deviceOS };
        registerNewDevice(newDevice);
        onHide();
    }

    // handles cancelling/closing the modal
    onCancel = (e) => {
        e.preventDefault();
        const {onHide} = this.props;
        onHide();
    }


    render() {
        const { show, onHide } = this.props;
        const { deviceIDUnique, deviceID } = this.state;

        return(
            <div>
                <Modal
                    onHide={onHide}
                    size="sm"
                    show={show}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div className="row">
                                <div className="col d-flex justify-content-center align-items-center">
                                    Add New Device
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                    <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="deviceID"
                                    >
                                        <span>Unique Device ID{(!deviceIDUnique)?
                                            <i className={"far fa-times-circle"} style={{color: "red"}} /> :
                                            <i className={"far fa-check-circle"} style={{color: "green"}} />}</span>
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="deviceID"
                                        type="text"
                                        onChange={this.handleChange}
                                        required={true}
                                    />
                                </FormGroup>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="deviceOS"
                                    >
                                        <span>Device OS</span>
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="deviceOS"
                                        type="text"
                                        onChange={this.handleChange}
                                    />
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
                                    color="danger"
                                    onClick={this.onAdd}
                                    disabled={(!deviceIDUnique) || (deviceID.length === 0)}
                                >
                                    Add Device
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
    registerNewDevice,
};

const mapStateToProps = (state) => {
    return {
        devices: state.devices,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterDeviceModal);