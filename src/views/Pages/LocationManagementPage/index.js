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
import LocationTableItem from "../../../components/LocationManagement/LocationTableItem/LocationTableItem";


// reactstrap components
import {Card, CardHeader, Col, Container, Row, Table} from "reactstrap";

// core components
import LocationHeader from "../../../components/Headers/LocationHeader.js";
import {v4 as uuidv4} from "uuid";



class ManageLocations extends React.Component {

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }

  render() {
    const {locations} = this.props;
    const locationList = locations.map((location) => {
      return(
          <LocationTableItem key={uuidv4()} location={location} />
      )
    });

    return (
      <div>
        <LocationHeader />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="12">
              <Card className="shadow table-container">
                <CardHeader className="border-0">
                  <h3 className="mb-0">All Locations</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                  <tr>
                    <th className={"th-class"} scope="col">Location Name</th>
                    <th className={"th-class"} scope="col">Map</th>
                    <th className={"th-class"} scope="col">Boundary Points</th>
                    <th className={"th-class"} scope="col">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {locationList}
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
    locations: state.locations,
  };
};



export default connect(mapStateToProps)(ManageLocations);
