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
import { v4 as uuidv4 } from 'uuid';

// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col, Table
} from "reactstrap";
// core components
import DeviceManagementHeader from "../../../components/Headers/DeviceManagementHeader.js";
import {connect} from "react-redux";
import DeviceTableItem from "../../../components/DeviceManagement/DeviceTableItem/DeviceTableItem";


class DeviceManager extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      devicesList: [],
    }
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    // fetch associated users for each device
    this.pairUserDeviceInfo();
  }

  componentDidUpdate(prevProps) {
    if (this.props.users !== prevProps.users) {
      this.pairUserDeviceInfo();
    }
  }

  pairUserDeviceInfo = () => {
    const {devices, users} = this.props;
    users.forEach(user => {
      devices.forEach(device => {
        if (user.id === device.userID) {
          device.userName = user.firstName + " " + user.lastName;
        }
      })
    })
    this.setState({
      devicesList: devices,
    })
  }


  render() {
    const {devicesList} = this.state;
    // map our list of devices to the device table
    const deviceList = devicesList.map((device) => {
      return(
          <DeviceTableItem
              key={uuidv4()}
              device={device}
              associatedUserName={(!device.userName)? "NONE" : device.userName}
              associatedUserID={(!device.userID)? "NONE" : device.userID}
          />
      )
    })
    return (
      <div>
        <DeviceManagementHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow table-container">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">All Devices</h3>
                    </Col>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                  <tr>
                    <th className={"th-class"} scope="col">Device ID</th>
                    <th className={"th-class"} scope="col">Device OS</th>
                    <th className={"th-class"} scope="col">Device Status</th>
                    <th className={"th-class"} scope="col">Associated User</th>
                    <th className={"th-class"} scope="col">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {deviceList}
                  </tbody>
                </Table>
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
    devices: state.devices,
    users: state.users,
  };
};

export default connect(mapStateToProps)(DeviceManager);
