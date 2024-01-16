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



import Header from "../../../components/Headers/Header.js";


// reactstrap components
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";
// other imports
import UserTableItem from "../../../components/Dashboard/UserTableItem/UserTableItem";
import {v4 as uuidv4} from "uuid";


class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      activeNav: 1,
    };
  }

  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
    });
  };
  render() {
    const {users} = this.props;
    // map our list of users to the "Current Status" table
    const userList = users.map((user) => {
      return(
          <UserTableItem
              key={uuidv4()}
              name={user.firstName + " " + user.lastName}
              profileImg={(user.image)? user.image : null}
              id={user.id}
              deviceID={(user.device)? user.device.id: null}
              heartRate={0}
              profileURL={user.profileURL}
          />
          )
    })
    return (
      <div>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">

            </Col>
            <Col xl="4">

            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow table-container">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Current User Status</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                  <tr>
                    <th className={"th-class"} scope="col">Name</th>
                    <th className={"th-class"} scope="col">Image</th>
                    <th className={"th-class"} scope="col">Status</th>
                    <th className={"th-class"} scope="col">Heart Rate (BPM)</th>
                  </tr>
                  </thead>
                  <tbody>
                  {userList}
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
    users: state.users,
  };
};

export default connect(mapStateToProps)(HomePage);
