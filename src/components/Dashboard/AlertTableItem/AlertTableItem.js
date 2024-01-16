import * as React from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import {connect} from "react-redux";
import {deleteAlertRequest, clearDeviceStatus} from "../../../actions/alertActions.js"
import moment from "moment";
import LocationModal from "./LocationModal/LocationModal";
import "./AlertTableItem.css";


class AlertTableItem extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            locationModalShow: false,
        }
    }

    componentDidMount() {
        let associatedUser = this.findUser();
        this.setState({
            user: associatedUser,
        })
    }

    findUser = () => {
        const {users, alert} = this.props;
        return users.find(user => {
            return user.id === alert.userID;
        });
    }

    // Triggers the opening/closing of the locationModal
    setLocationModalShow = (bool) => {
        this.setState({
            locationModalShow: bool,
        });
    };


    // Delete Alert
    onResolve = (e) => {
        e.preventDefault();
        const {deleteAlertRequest, clearDeviceStatus, alert} = this.props;
        const {user} = this.state;
        let deviceID = "";
        // guard against edge case where device is deleted from the user before alert is cleared
        if (user.device) {
            deviceID = user.device.id;
        }
        let payload = {alertID: alert.id, deviceID: deviceID, userID: user.id};
        deleteAlertRequest(payload);
        clearDeviceStatus(payload);
    }

    render() {
     const {alert} = this.props;
     const {user, locationModalShow} = this.state;
     const time = alert.createdAt;
        return(
            <tr>
                <th scope="row">
                    {user.firstName + " " + user.lastName}
                </th>
                <td>
                    {moment(time).format("ddd, MMM D YYYY, h:mm:ss a")}
                </td>
                <td>{alert.type}</td>
                <td>{alert.description}</td>
                <td>{(alert.location)? <button className={"locationBtn"} onClick={() => this.setLocationModalShow(true)}>View</button>
                    :
                    "Unknown"}
                    <LocationModal show={locationModalShow} location={(alert.location)? alert.location : null}
                                   onHide={() => this.setLocationModalShow(false)} />
                </td>
                <td className="text-right">
                    <UncontrolledDropdown>
                        <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={e => e.preventDefault()}
                        >
                            <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                                href=""
                                onClick={this.onResolve}
                            >
                                Mark As Resolved
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>

                </td>
            </tr>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
    };
};

export default connect(mapStateToProps, {deleteAlertRequest, clearDeviceStatus})(AlertTableItem);