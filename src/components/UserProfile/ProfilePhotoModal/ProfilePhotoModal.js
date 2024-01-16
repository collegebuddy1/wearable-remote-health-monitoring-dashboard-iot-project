import * as React from "react";
import { Storage, API, graphqlOperation } from "aws-amplify";
import {updateUser} from "../../../graphql/mutations";
import Modal from "react-bootstrap/Modal";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import getCroppedImg from "./CropImage";
import { v4 as uuid } from "uuid";
import {Spinner} from "react-bootstrap";
import {enqueueAppNotification} from "../../../actions/notificationActions";
import {updateUserProfileImage} from "../../../actions/userActions";
import "./ProfilePhotoModal.css";

/* Adapted from an example on the react-easy-crop component page: https://github.com/ricardo-ch/react-easy-crop */

class ProfilePhotoModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imageSrc: null,
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 4 / 3,
            croppedAreaPixels: null,
            isCropping: false,
            fileName: "",
            fileTooLarge: false,
            imageProcessing: false,
        };
    }

    onCropChange = (crop) => {
        this.setState({ crop });
    };

    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({
            croppedAreaPixels,
        });
    };

    onZoomChange = (zoom) => {
        this.setState({ zoom });
    };

    onClose = async () => {
        this.setState({
            imageProcessing: true,
        });
        try {
            this.setState({
                isCropping: true,
            });
            const { imageSrc, fileName, croppedAreaPixels } = this.state;
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            croppedImage.lastModifiedDate = new Date();
            const {type: mimeType} = croppedImage;
            croppedImage.name = fileName;
            this.setState({
                isCropping: false,
            });
            const { onHide, updateUserProfileImage, userID } = this.props;
            const key = `${uuid()}-${fileName}`;
            const bucket = process.env.REACT_APP_AWS_S3_BUCKET;
            const region = process.env.REACT_APP_AWS_S3_REGION;
            const inputData = {id: userID, profileImage: {bucket: bucket, region: region, key: key}};
            // updates in persistent storage
            try {
                // delete existing profile image in S3 if it exists
                const { oldKey } = this.props;
                if (oldKey) {
                    await Storage.remove(oldKey);
                }
                // try uploading new image to S3
                await Storage.put(key, croppedImage, {
                    contentType: mimeType
                });
                // update profileImage in user
                await API.graphql(graphqlOperation(updateUser, { input: inputData }));
                // add new photo information locally
                updateUserProfileImage(inputData);
                // image upload successful
                const {enqueueAppNotification} = this.props;
                enqueueAppNotification({type: "success", message: "Image updated successfully."});
            } catch (err) {
                console.log('error: ', err)
            }
            this.setState({
                imageProcessing: false,
                imageSrc: null,
            });
            onHide();
        } catch (e) {
            console.error(e);
            this.setState({
                isCropping: false,
                imageSrc: null,
                imageProcessing: false,
            });
        }
    };


    onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileSize = file.size / 1024 / 1024;
            if (fileSize <= 3) {
                const imageDataUrl = await this.readFile(file);
                this.setState({
                    imageSrc: imageDataUrl,
                    crop: { x: 0, y: 0 },
                    zoom: 1,
                    aspect: 1,
                    fileName: file.name,
                    fileTooLarge: false,
                });
            } else {
                // reset variables and abort
                this.setState({
                    imageSrc: null,
                    crop: { x: 0, y: 0 },
                    zoom: 1,
                    aspect: 4 / 3,
                    croppedAreaPixels: null,
                    isCropping: false,
                    fileName: "",
                    fileTooLarge: true,
                });
            }
        }
    };

    readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    render() {
        const {
            isCropping,
            zoom,
            aspect,
            crop,
            imageSrc,
            fileTooLarge,
            imageProcessing,
        } = this.state;
        const { show, onHide } = this.props;
        return (
            <div>
                <Modal
                    onHide={onHide}
                    size="lg"
                    show={show}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            <div className="row">
                                <div className="col d-flex justify-content-center align-items-center">
                                    User Photo Editor
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {(imageProcessing)?
                             <div>
                                 <div className={"row"}>
                                     <div className={"col d-flex justify-content-center"}>
                                         <h1>Please wait while photo is processed...</h1>
                                     </div>
                                 </div>
                                 <div className={"row"}>
                                     <div className={"col d-flex justify-content-center"}>
                                         <Spinner animation="border" variant="success"/>                                     </div>
                                 </div>

                             </div>
                            :

                            <div className="row">
                                <div className="col" style={{ height: "380px" }}>
                                    <h6>
                                        <strong>Maximum</strong> file size: 3 MB
                                    </h6>
                                    {fileTooLarge ? (
                                        <h6 className="fileSizeWarning">
                                            Selected image is over 3 MB! Please choose another image.
                                        </h6>
                                    ) : null}
                                    <input
                                        style={{ width: "80%" }}
                                        type="file"
                                        name="image"
                                        accept=".png, .jpg, .jpeg, .svg"
                                        onChange={this.onFileChange}
                                    />
                                    {imageSrc && (
                                        <>
                                            <div className="row">
                                                <div className="col d-flex justify-content-center">
                                                    <div
                                                        className="crop-container"
                                                        style={{ height: "270px", width: "400px" }}
                                                    >
                                                        <Cropper
                                                            image={imageSrc}
                                                            crop={crop}
                                                            cropShape="round"
                                                            zoom={zoom}
                                                            aspect={aspect}
                                                            onCropChange={this.onCropChange}
                                                            onCropComplete={this.onCropComplete}
                                                            onZoomChange={this.onZoomChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="controls">
                                                <Slider
                                                    id="photoSlider"
                                                    value={zoom}
                                                    min={1}
                                                    max={3}
                                                    step={0.1}
                                                    aria-labelledby="Zoom"
                                                    onChange={(e, zooming) => this.onZoomChange(zooming)}
                                                />
                                            </div>
                                            <div className="button">
                                                <Button
                                                    id="photoSubmit"
                                                    variant="contained"
                                                    onClick={this.onClose}
                                                    disabled={isCropping}
                                                >
                                                    Submit
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        }
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

const mapDispatchToProps = {
    enqueueAppNotification,
    updateUserProfileImage
};

export default connect(null, mapDispatchToProps)(ProfilePhotoModal);