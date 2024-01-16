import * as React from "react";
import Modal from "react-bootstrap/Modal";
import {Button, Input} from "reactstrap";
import {deleteUserRequest} from "../../../actions/userActions"
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
import {Storage} from "aws-amplify";
import LinearProgress from "@material-ui/core/LinearProgress";



class DeleteUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmationComplete: false,
            isProcessing: false,
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

    // handle deletion cancellation event
    onCancel = () => {
        this.setState({
            confirmationComplete: false,
        });
        const {onHide} = this.props;
        onHide();
    }

    onProceed = async () => {
        // set loading screen state
        this.setState({
            isProcessing: true,
        })
        const {deleteUserRequest, userID, history, imageKey} = this.props;
        deleteUserRequest(userID);
        // delete user profile image in S3 if it exists
        try {
            if (imageKey) {
                await Storage.remove(imageKey);
            }
        } catch (err) {
            console.log("Error, could not delete user image: ", err);
        }
        // redirect to user management page after deleting user
        let path = '/admin/manage-users';
        history.push(path);
    }

    render() {
        const { show, onHide, userName, userID, device } = this.props;
        const {confirmationComplete, isProcessing} = this.state;
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
                                    Delete Confirmation
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {(isProcessing)?
                            <div>
                               <div className={"row"}>
                                   <div className={"col d-flex justify-content-center"}>
                                       <h1>
                                           Please wait while user deletion request is being processed...
                                       </h1>
                                   </div>
                               </div>
                                <div className={"row"}>
                                    <div className={"col d-flex justify-content-center"}>
                                        <LinearProgress />
                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                                {(device)?
                                <div>
                                    <div className={"row"}>
                                        <div className={"col d-flex justify-content-center"}>
                                            This user's device must be unpaired before this user can be deleted.
                                        </div>
                                    </div>
                                </div>
                                    :
                                    <div>
                                        <div className={"row"}>
                                            <div className={"col d-flex justify-content-center"}>
                                                Are you sure you want to delete user "{userName}" with ID {userID}?
                                            </div>
                                        </div>
                                        <div className={"row"}>
                                            <div className={"col d-flex justify-content-center"}>
                                                <p>For deletion, please type "confirm" below then click "Proceed".</p>
                                            </div>
                                            <br/>
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
                                    </div>

                                }

                            </div>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        {(isProcessing)?
                            null
                            :
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
                                        disabled={!confirmationComplete}
                                        onClick={this.onProceed}
                                    >
                                        Proceed
                                    </Button>
                                </div>
                            </div>
                        }
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const mapDispatchToProps = {
    deleteUserRequest,
};

export default withRouter(connect(null, mapDispatchToProps)(DeleteUserModal));
