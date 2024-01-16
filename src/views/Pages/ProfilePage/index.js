/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import {connect} from "react-redux";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col, UncontrolledTooltip
} from "reactstrap";
// core components
import UserHeader from "../../../components/Headers/UserHeader.js";
import DeleteUserModal from "../../../components/UserProfile/DeleteUserModal/DeleteUserModal";
import ProfilePhotoModal from "../../../components/UserProfile/ProfilePhotoModal/ProfilePhotoModal";
import HeartRate from "../../../components/RealTimeData/HeartRate/HeartRate";
import MapModal from "../../../components/RealTimeData/MapModal/MapModal";
// actions
import {updateUserInformation, updateUserInformationLocally} from "../../../actions/userActions";

class Profile extends React.Component {

  constructor(props) {
    super(props);
    const {location } = this.props;
    let userID = location.pathname.replace(/.admin.user-profile./, "");
    let userProfile = this.findUser(userID);
    this.state = {
        id: userProfile.id,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        age: userProfile.age,
        facility: userProfile.facility,
        phoneNumber: userProfile.phoneNumber,
        email: userProfile.email,
        streetAddress: userProfile.address.streetAddress,
        city: userProfile.address.city,
        stateProvince: userProfile.address.stateProvince,
        country: userProfile.address.country,
        postalZip: userProfile.address.postalZip,
        additionalNotes: userProfile.additionalNotes,
        emergencyContacts: [],
      originalProfile: userProfile,
      profilePhoto:  require("../../../assets/img/theme/blank-profile.png"),
      editMode: false,
      profileInfoEdited: false,
      deleteModalShow: false,
      profilePhotoModalShow: false,
      mapModalShow: false,
    }
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    const { originalProfile } = this.state;
    if (originalProfile.image) {
      this.setState({
        profilePhoto: originalProfile.image,
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.users !== prevProps.users) {
      const { originalProfile } = this.state;
      if (originalProfile.image) {
        this.setState({
          profilePhoto: originalProfile.image,
        })
      }
    }
  }

  findUser = (id) => {
    const {users} = this.props;
    return users.find(user => user.id === id);
  }



  // Toggles profile edit mode on/off when "Edit/Save" button clicked. If changes were made, transmit them
  toggleEdit = (e) => {
    e.preventDefault();
    const {editMode, profileInfoEdited} = this.state;
    // if save profile button clicked, propagate updated profile information
    if (editMode && profileInfoEdited) {
      const {originalProfile, id, firstName, lastName, age, facility, phoneNumber, email,
        streetAddress, city, stateProvince, country, postalZip, additionalNotes, emergencyContacts} = this.state;
      const {updateUserInformation: updateUserInfo, updateUserInformationLocally: updateUserInfoLocal } = this.props;
      const updatedUser = {
        id: id, firstName: firstName, lastName: lastName, age: age, facility: facility, phoneNumber: phoneNumber,
        email: email, address: {streetAddress: streetAddress, city: city, stateProvince: stateProvince,
          country: country, postalZip: postalZip}, additionalNotes: additionalNotes, emergencyContacts: emergencyContacts
      }
      // update user info in DynamoDB, only input possible changed fields
      updateUserInfo(updatedUser);

      // local user info needs entire profile
      const updatedUserLocal = {
        ...originalProfile,
        firstName: firstName, lastName: lastName, age: age, facility: facility, phoneNumber: phoneNumber,
        email: email, address: {streetAddress: streetAddress, city: city, stateProvince: stateProvince,
          country: country, postalZip: postalZip}, additionalNotes: additionalNotes, emergencyContacts: emergencyContacts
      }
      updateUserInfoLocal(updatedUserLocal);
    }

    // toggle edit mode on/off
    this.setState({
      editMode: !editMode
    })
  }

  // handles profile information edits
  handleChange = (e) => {
    e.preventDefault();
    // edit any profile information changes, set profileInfoEdited flag to true
    this.setState({
      [e.target.id] : e.target.value,
      profileInfoEdited: true,
    })
  }

  // Triggers the opening/closing of the DeleteUserModal
  setDeleteModalShow = (bool) => {
    this.setState({
      deleteModalShow: bool,
    });
  };

  // Triggers the opening/closing of the profilePhotoModalShow
  setProfilePhotoModalShow = (bool) => {
    this.setState({
      profilePhotoModalShow: bool,
    });
  };

  // Triggers the opening/closing of the mapModal
  setMapModalShow = (bool) => {
    this.setState({
      mapModalShow: bool,
    });
  };

  // handles redirect to data visualizer page
  switchToDataVisualizerPage = () => {
    const {history} = this.props;
    const {id} = this.state;
    let path = "/admin/data-visualizer/".concat(id);
    history.push(path);
  };

  render() {
    const { originalProfile, id, firstName, lastName, age, facility, phoneNumber, email,
      streetAddress, city, stateProvince, country, postalZip, additionalNotes, profilePhoto,
      editMode, deleteModalShow, profilePhotoModalShow, mapModalShow } = this.state;
      return (
          <div>
            <UserHeader userName={firstName + " " + lastName}/>
            {/* Page content */}
            <Container className="mt--7" fluid>
              <Row>
                <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
                  <Card className="card-profile shadow">
                    <Row className="justify-content-center">
                      <Col className="order-lg-2" lg="3">
                        <div className="card-profile-image">
                          <a href="#pablo"
                             id={"profileImage"}
                             onClick={() => this.setProfilePhotoModalShow(true)}>
                            <img
                                alt="..."
                                className="rounded-circle"
                                src={profilePhoto}
                            />
                          </a>
                          <UncontrolledTooltip
                              delay={0}
                              target={"profileImage"}
                          >
                            Click to change photo.
                          </UncontrolledTooltip>
                        </div>
                        <ProfilePhotoModal
                            show={profilePhotoModalShow} userID={id}
                            oldKey={(originalProfile.profileImage)? originalProfile.profileImage.key : null}
                            onHide={() => this.setProfilePhotoModalShow(false)}
                            fetchImage={this.fetchImage}
                        />
                      </Col>
                    </Row>
                    <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                      <div className="d-flex justify-content-between">
                        <Button
                            className="mr-4"
                            color="info"
                            href=""
                            onClick={this.switchToDataVisualizerPage}
                            size="sm"
                        >
                          View Data
                        </Button>
                        <Button
                            className="float-right"
                            color="warning"
                            href="#"
                            onClick={() => this.setDeleteModalShow(true)}
                            size="sm"
                        >
                          Delete User
                        </Button>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0 pt-md-4">
                      <Row>
                        <div className="col">
                          <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                            <div>
                              <span className="heading">{(originalProfile.device)?
                                  (originalProfile.device.geofence)? originalProfile.device.geofence.locationName : "N/A"
                              :
                              "N/A"}</span>
                              <span className="description">Location</span>
                            </div>
                            <div>
                              <span
                                  className="heading">{(originalProfile.device) ?
                                  <HeartRate deviceID={originalProfile.device.id} />  : "N/A"}
                              </span>
                              <span className="description">Heart Rate (BPM)</span>
                            </div>
                          </div>
                        </div>
                      </Row>
                      <div className="text-center">
                        <h3>
                          {firstName + " " + lastName}
                          <span className="font-weight-light">, {(age) ? age : "N/A"}</span>
                        </h3>
                        <div className="h5 font-weight-300">
                          {facility}
                        </div>
                        <div className="h5 mt-4">
                          <i className="ni ni-pin-3 mr-2"/>
                          Last Known Location
                        </div>
                        <div>
                          {(originalProfile.device)?
                              <Button
                              size={"sm"}
                              onClick={() => this.setMapModalShow(true)}
                          >
                            Locate User
                          </Button> : "Location Data N/A. Please pair a device."}
                          <MapModal show={mapModalShow}
                                    deviceID={(originalProfile.device)? originalProfile.device.id :  null}
                                    onHide={() => this.setMapModalShow(false)}
                          />
                        </div>
                        <div className="h5 mt-4">
                          {(originalProfile.device)?
                              (originalProfile.device.deviceStatus === "Location_Anomaly" ||
                                  originalProfile.device.deviceStatus === "HeartRate_Anomaly" ||
                                  originalProfile.device.deviceStatus === "Inactive"
                              )?
                                  <i className="fas fa-exclamation-triangle mr-2" style={{"color": "orange"}}/> :
                              <i className="ni ni-check-bold mr-2" style={{"color": "green"}}/>
                              :
                              <i className="fas fa-times mr-2"  style={{"color": "red"}}/>
                          }
                          {(originalProfile.device)?
                              <span>Device paired with status: {originalProfile.device.deviceStatus}</span>
                              :
                              <span>No device paired</span>}
                        </div>
                        <hr className="my-4"/>
                        <h2>Additional Notes</h2>
                        <p>
                          {(additionalNotes !== null) ? additionalNotes : "N/A"}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col className="order-xl-1" xl="8">
                  <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                        <Col xs="8">
                          <h3 className="mb-0">Account Information</h3>
                          <h5>* indicates a required field</h5>
                        </Col>
                        <Col className="text-right" xs="4">
                          <Button
                              color={(editMode) ? "danger" : "primary"}
                              href="#"
                              onClick={this.toggleEdit}
                              size="md"
                          >
                            {(editMode) ? "Save Changes" : "Edit Profile"}
                          </Button>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <h6 className="heading-small text-muted mb-4">
                          User information
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="firstName"
                                >
                                  First Name*
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="firstName"
                                    defaultValue={firstName}
                                    type="text"
                                    onChange={this.handleChange}
                                    required={true}
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="lastName"
                                >
                                  Last Name*
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="lastName"
                                    defaultValue={lastName}
                                    type="text"
                                    onChange={this.handleChange}
                                    required={true}
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="age"
                                >
                                  Age
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="age"
                                    defaultValue={age}
                                    onChange={this.handleChange}
                                    type="number"
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="facility"
                                >
                                  Facility Name
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="facility"
                                    defaultValue={facility}
                                    type="text"
                                    onChange={this.handleChange}
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4"/>
                        {/* Address */}
                        <h6 className="heading-small text-muted mb-4">
                          Contact information
                        </h6>
                        <div className="pl-lg-4">
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="phoneNumber"
                                >
                                  Phone Number
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="phoneNumber"
                                    defaultValue={phoneNumber}
                                    type="text"
                                    onChange={this.handleChange}
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="email"
                                >
                                  Email Address
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="email"
                                    defaultValue={email}
                                    type="email"
                                    onChange={this.handleChange}
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="streetAddress"
                                >
                                  Street Address
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="streetAddress"
                                    defaultValue={streetAddress}
                                    type="text"
                                    onChange={this.handleChange}
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="city"
                                >
                                  City
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="city"
                                    defaultValue={city}
                                    type="text"
                                    onChange={this.handleChange}
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="stateProvince"
                                >
                                  State/Province
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="stateProvince"
                                    defaultValue={stateProvince}
                                    type="text"
                                    onChange={this.handleChange}
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="country"
                                >
                                  Country
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="country"
                                    defaultValue={country}
                                    type="text"
                                    onChange={this.handleChange}
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="postalZip"
                                >
                                  Postal/Zip Code
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="postalZip"
                                    defaultValue={postalZip}
                                    type="text"
                                    onChange={this.handleChange}
                                    disabled={!editMode}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4"/>
                        {/* Description */}
                        <h6 className="heading-small text-muted mb-4">About Resident</h6>
                        <div className="pl-lg-4">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="additionalNotes"
                            >Additional Notes</label>
                            <Input
                                className="form-control-alternative"
                                id="additionalNotes"
                                defaultValue={additionalNotes}
                                rows="4"
                                type="textarea"
                                onChange={this.handleChange}
                                disabled={!editMode}
                            />
                          </FormGroup>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
            <DeleteUserModal show={deleteModalShow} userID={originalProfile.id}
                             userName={firstName + " " + lastName}
                             imageKey={(originalProfile.profileImage)? originalProfile.profileImage.key : null}
                             device={(originalProfile.device)? originalProfile.device.id : null}
                             onHide={() => this.setDeleteModalShow(false)}/>
          </div>
      );
    }

}

const mapStateToProps = (state) => {
  return {
    users: state.users,
    devices: state.devices,
  };
};

export default connect(mapStateToProps, {updateUserInformation, updateUserInformationLocally}) (Profile);
