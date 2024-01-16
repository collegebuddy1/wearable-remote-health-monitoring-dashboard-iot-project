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
import LogoutModal from "../Auth/LogoutModal/LogoutModal";
import TutorialModal from "../Tutorial/TutorialModal/TutorialModal";


// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media, UncontrolledTooltip
} from "reactstrap";
import { IconButton } from '@material-ui/core';


class AdminNavbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      logoutModalShow: false,
      tutorialModalShow: false,
    }
  }

  // Triggers the opening/closing of the logoutModal
  setLogoutModalShow = (bool) => {
    this.setState({
      logoutModalShow: bool,
    });
  };

  // Triggers the opening/closing of the tutorialModal
  setTutorialModalShow = (bool) => {
    this.setState({
      tutorialModalShow: bool,
    });
  };


  render() {
    const { alertsConnected } = this.props;
    const { logoutModalShow, tutorialModalShow } = this.state;

    return (
      <div>
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <div
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            >
              {this.props.brandText}
            </div>

            <div className="navbar-search navbar-search-dark text-white form-inline mr-3 d-none d-md-flex ml-lg-auto">
               {(alertsConnected)?
                 <span id={"status"}>Realtime Status: <i className="fas fa-dot-circle" style={{color: "lightGreen"}}></i> Connected</span>
                 :
                 <span id={"status"}>Realtime Status: <i className="fas fa-dot-circle" style={{color: "red"}}></i> Disconnected</span>}
              <UncontrolledTooltip
                  delay={0}
                  target={"status"}
              >
                {(alertsConnected)? "Normal" :
                    "Disconnected from server. Please check your internet connection and reload this app."}
              </UncontrolledTooltip>
            </div>
            <div className={"h2 text-white form-inline d-none d-md-flex ml-lg-auto"}>
              <IconButton aria-label={"help"}
                          id={"helpModal"}
                          onClick={(e) => {
                            e.preventDefault();
                            this.setTutorialModalShow(true);
                          }}
              >
                <i className={"fas fa-question-circle"} style={{color: "white"}} />
              </IconButton>
              <UncontrolledTooltip
                  delay={0}
                  target={"helpModal"}
              >
                Click here for help
              </UncontrolledTooltip>
              <TutorialModal show={tutorialModalShow} onHide={() => this.setTutorialModalShow(false)} />
            </div>
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("../../assets/img/theme/blank-profile.png")}
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        Menu
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem href="" onClick={() => this.setLogoutModalShow(true)}>
                    <i className="fas fa-sign-out-alt" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
                <LogoutModal show={logoutModalShow} onHide={() => this.setLogoutModalShow(false)} />
              </UncontrolledDropdown>
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    alertsConnected: state.applicationStatus.alertsConnected,
  };
};

export default connect(mapStateToProps)(AdminNavbar);
