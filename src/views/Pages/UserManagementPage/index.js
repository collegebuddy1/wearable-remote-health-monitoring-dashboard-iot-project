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

// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col, Table
} from "reactstrap";
// core components
import UserManagementHeader from "../../../components/Headers/UserManagementHeader";
import {connect} from "react-redux";
import UserManagementTableItem from "../../../components/UserManagement/UserTableItem/UserTableItem";
import {v4 as uuidv4} from "uuid";

class UserManagement extends React.Component {

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }

  render() {
    const {users} = this.props;
    // map our list of users to the "Current Status" table
    const userList = users.map((user) => {
      return(
          <UserManagementTableItem
              key={uuidv4()}
              name={user.firstName + " " + user.lastName}
              profileImg={(user.image)? user.image : null}
              id={user.id}
              device={user.device}
          />
      )
    })
    return (
      <div>
        <UserManagementHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow table-container">
                <CardHeader className="border-0">
                  <h3 className="mb-0">All Users</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                  <tr>
                    <th className={"th-class"} scope="col">Name</th>
                    <th className={"th-class"} scope="col">Image</th>
                    <th className={"th-class"} scope="col">Assigned Device</th>
                    <th className={"th-class"} scope="col">Assigned Location</th>
                    <th className={"th-class"} scope="col">Actions</th>
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

export default connect(mapStateToProps) (UserManagement);
