import React from "react";
import Modal from "react-bootstrap/Modal";
import { AmplifySignOut } from '@aws-amplify/ui-react'
import { Button } from "reactstrap";



class LogoutModal extends React.Component {


    // handles cancelling/closing the modal
    onCancel = (e) => {
        e.preventDefault();
        const {onHide} = this.props;
        onHide();
    }


    render() {
        const { show, onHide } = this.props;
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
                                    Logout Confirmation
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                    <label
                                        className="form-control-label"
                                    >
                                        <span>Are you sure you would like to logout?</span>
                                    </label>
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
                                <AmplifySignOut />
                            </div>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default LogoutModal;