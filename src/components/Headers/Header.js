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

// reactstrap components
import {
  Card,
  Container,
  Row,
  Col,
  CardHeader,
  Table,
} from "reactstrap";
import AlertTableItem from "../Dashboard/AlertTableItem/AlertTableItem";

class Header extends React.Component {
  render() {
    const {alerts} = this.props;
    // map our list of alerts to the "Alerts" table
    const alertsList = alerts.map((alert) => {
      return(
          <AlertTableItem
              key={alert.id}
              alert={alert}
          />
      )
    })
    return (
      <div>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card Header for HomePage -- place Alerts here */}
              <Row>
                <Col lg="12" xl="12">
                  <Card className="shadow table-container">
                    <CardHeader className="border-0">
                      <h3 className="mb-0">Alerts</h3>
                    </CardHeader>
                    <Table className="align-items-center table-flush" responsive>
                      <thead className="thead-light">
                      <tr>
                        <th className={"th-class"} scope="col">User</th>
                        <th className={"th-class"} scope="col">Time</th>
                        <th className={"th-class"} scope="col">Type</th>
                        <th className={"th-class"} scope="col">Summary</th>
                        <th className={"th-class"} scope="col">Location</th>
                        <th className={"th-class"} scope="col">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {alertsList}
                      </tbody>
                    </Table>

                  </Card>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users,
    alerts: state.alerts,
  };
};

export default connect(mapStateToProps)(Header);
