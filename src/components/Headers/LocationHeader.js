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
import {withRouter} from "react-router-dom";


// reactstrap components
import { Button, Container, Row, Col } from "reactstrap";

class LocationHeader extends React.Component {

    onClick = (e) => {
        e.preventDefault();
        const {history} = this.props;
        let path = "/admin/create-location";
        history.push(path);
    }

  render() {
    return (
      <>
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "600px",
            backgroundImage:
              "url(" + require("../../assets/img/theme/globe.jpg") + ")",
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-8" />
          {/* Header container */}
          <Container className="d-flex align-items-center" fluid>
            <Row>
              <Col lg="12" md="12">
                <h1 className="display-2 text-white">Location Management Console</h1>
                  <Button
                      color="info"
                      onClick={this.onClick}
                  >
                      Create a Location
                  </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default withRouter(LocationHeader);
