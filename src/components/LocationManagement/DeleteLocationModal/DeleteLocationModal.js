import * as React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { deleteLocationRequest } from "../../../actions/locationActions";


class DeleteLocationModal extends React.Component{


    // handles deleting the location
    onDelete = (e) => {
        e.preventDefault();
        const {onHide, location, deleteLocationRequest} = this.props;
        let payload = {id: location.id};
        deleteLocationRequest(payload);
        onHide();
    }

    // handles cancelling/closing the form
    onCancel = (e) => {
        e.preventDefault();
        const {onHide} = this.props;
        onHide();
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
                                    Location Deletion Confirmation
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"row"}>
                            <div className={"col d-flex justify-content-center"}>
                                Are you sure you want to permanently delete Location '{location.locationName}' with ID '{location.id}'?
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
                                >
                                    Delete Location
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
    deleteLocationRequest,
};

export default connect(null, mapDispatchToProps)(DeleteLocationModal);