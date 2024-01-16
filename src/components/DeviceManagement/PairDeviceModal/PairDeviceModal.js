import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {Button, FormGroup, Input} from "reactstrap";
import { connect } from "react-redux";
import { associateDeviceWithUser } from "../../../actions/deviceActions";



class PairDeviceModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            availableUsers: [],
            selectedUserID: "",
        }
        //this.populateFormFields();
    }

    componentDidMount() {
        this.populateFormFields();
    }

    componentDidUpdate(prevProps) {
        if (this.props.users !== prevProps.users) {
            this.populateFormFields();
        }
    }


    //  check for users without a registered device
    populateFormFields = () => {
        const {users} = this.props;
        let availableUsers = [];
        users.forEach(user => {
            if ((!user.device) || (user.device === null)) {
                availableUsers.push(user);
            }
        });
        // save the available users to the local state
        this.setState({
            availableUsers: availableUsers,
        });
        // set default value for select input (handleChange isn't triggered if first option is selected)
        if (availableUsers.length >= 1) {
            this.setState({
                selectedUserID: availableUsers[0].id,
            });
        }
    }



    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value,
        })
    }



    // handles pairing the device
    onPair = (e) => {
        e.preventDefault();
        const {associateDeviceWithUser, device, onHide} = this.props;
        const {selectedUserID, availableUsers} = this.state;
        const selectedUser = availableUsers.find(user => user.id === selectedUserID);
        associateDeviceWithUser({device: device, user: selectedUser});
        onHide();
    }

    // handles cancelling/closing the form
    onCancel = (e) => {
        e.preventDefault();
        const {onHide} = this.props;
        onHide();
    }


    render() {
        const { show, onHide, device } = this.props;
        const {  availableUsers } = this.state;

        let userOptions = availableUsers.map(user => {
            return(
                <option key={user.id} value={user.id}>{user.firstName  + " " + user.lastName + ": " + user.id}</option>
            )
        });

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
                                    Pair Device
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center text-center"}>
                                <h4>Select a user to pair with device {device.id}.</h4>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="selectedUserID"
                                    >
                                        Available Users
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="selectedUserID"
                                        type="select"
                                        onChange={this.handleChange}
                                        required={true}
                                    >
                                        <option disabled>User</option>
                                        {userOptions}
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
                                    color="danger"
                                    onClick={this.onPair}
                                    disabled={availableUsers.length === 0}
                                >
                                    Pair Device
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
    associateDeviceWithUser,
};

const mapStateToProps = (state) => {
    return {
        devices: state.devices,
        users: state.users,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PairDeviceModal);