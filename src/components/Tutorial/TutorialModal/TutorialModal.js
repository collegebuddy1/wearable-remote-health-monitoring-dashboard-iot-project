import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {Button} from "reactstrap";


class TutorialModal extends React.Component{



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
        const { show, onHide } = this.props;
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
                                    Application FAQs
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col"}>
                                <h3>Location:</h3>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col"}>
                                <ol>
                                    <li>
                                        To assign a location to a user, you must first pair a device with the user.
                                    </li>
                                    <li>
                                        Locations can be assigned by accessing the actions tab in the User Management Console table.
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col"}>
                                <h3>User:</h3>
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col"}>
                                <ol>
                                    <li>
                                        To view/edit a user's profile, please select "View Profile" in the actions tab in the User Management Console table.
                                    </li>
                                </ol>
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



export default TutorialModal;