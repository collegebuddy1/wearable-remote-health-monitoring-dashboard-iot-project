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
import { connect } from "react-redux";
import {registerNewUser} from "../../../actions/userActions";
import { v4 as uuidv4 } from 'uuid';



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
  Col
} from "reactstrap";
// core components
import UserRegistrationHeader from "../../../components/Headers/UserRegistrationHeader.js";

class RegisterUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      age: 0,
      facility: "",
      phoneNumber: "",
      email: "",
      streetAddress: "",
      city: "",
      stateProvince: "",
      country: "",
      postalZip: "",
      additionalNotes: "",
      emergencyContacts: [],
    }
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {firstName, lastName, age, facility, phoneNumber, email,
      streetAddress, city, stateProvince, country, postalZip, additionalNotes, emergencyContacts} = this.state;
    const {registerNewUser: registerUser , history} = this.props;
    let newUserID = uuidv4();

    let newUser = {
      id: newUserID, firstName: firstName, lastName: lastName, age: age,
      facility: facility, phoneNumber: phoneNumber, email: email, address: {streetAddress: streetAddress,
        city: city, stateProvince: stateProvince, country: country, postalZip: postalZip},
      additionalNotes: additionalNotes, emergencyContacts: emergencyContacts
    }
    // submit new user info for storage in redux and in DynamoDB
    registerUser(newUser);

    // return to user management page after submit
    history.push("/admin/manage-users");
  }


  render() {
    return (
      <div>
        <UserRegistrationHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="12">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">New Account Information</h3>
                      <h5>* indicates a required field</h5>
                    </Col>
                    <Col className="text-right" xs="4">
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
                              placeholder="Jane"
                              type="text"
                              onChange={this.handleChange}
                              required={true}
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
                              placeholder="Doe"
                              type="text"
                              onChange={this.handleChange}
                              required={true}
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
                                placeholder="68"
                                onChange={this.handleChange}
                                type="number"
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
                                placeholder="Vancouver Care Center"
                                type="text"
                                onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
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
                                placeholder="604-444-4444"
                                type="text"
                                onChange={this.handleChange}
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
                                placeholder="email@example.com"
                                type="email"
                                onChange={this.handleChange}
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
                              placeholder="5555 Pandora Street"
                              type="text"
                              onChange={this.handleChange}
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
                                placeholder="Vancouver"
                                type="text"
                                onChange={this.handleChange}
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
                                placeholder="British Columbia"
                                type="text"
                                onChange={this.handleChange}
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
                              placeholder="Canada"
                              type="text"
                              onChange={this.handleChange}
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
                              placeholder="V5Z 6E7"
                              type="text"
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Description */}
                    <h6 className="heading-small text-muted mb-4">About User</h6>
                    <div className="pl-lg-4">
                      <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="additionalNotes"
                        >Additional Notes</label>
                        <Input
                          className="form-control-alternative"
                          id="additionalNotes"
                          placeholder="A few health notes for the patient."
                          rows="4"
                          type="textarea"
                          onChange={this.handleChange}
                        />
                      </FormGroup>
                    </div>
                    <Row>
                      <Col lg={"12"} className={"d-flex justify-content-center"}>
                        <Button type={"submit"} onClick={this.handleSubmit} color="info">
                          Register
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users,
  };
};

export default connect(mapStateToProps,{registerNewUser})(RegisterUser);
