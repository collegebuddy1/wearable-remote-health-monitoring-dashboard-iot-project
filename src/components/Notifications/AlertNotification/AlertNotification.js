import React from "react";
import {connect} from "react-redux";
import Toast from 'react-bootstrap/Toast';
import moment from "moment";
import "./SideBar.css";
import {removeAlertNotification} from "../../../actions/notificationActions";



class AlertNotification extends React.Component{

    // remove alert notification
    removeAlert = (e) => {
        e.preventDefault();
        const {removeAlertNotification, alert} = this.props;
        removeAlertNotification({id: alert.id});
    }

    render() {
        const {alert, user} = this.props;
        const time = alert.createdAt;

        return(
            <div className={"py-1"}>
                <Toast className={"bg-yellow rounded mr-auto px-1 toast"}
                       animation={true} onClose={this.removeAlert}>
                    <Toast.Header style={{borderBottom: "1px solid gray"}}>
                        <strong className="mr-auto">New Alert</strong>
                        <small> {moment(time).fromNow()}</small>
                    </Toast.Header>
                    <Toast.Body>
                        <div className={"row"}>
                            <div className={"col d-flex"}>
                                User: {user.firstName + " " + user.lastName}
                            </div>
                        </div>
                        <div className={"row"}>
                            <div className={"col"}>
                                Type: {alert.type}
                            </div>
                        </div>
                    </Toast.Body>
                </Toast>
            </div>
        )
    }

}


const mapDispatchToProps = {
    removeAlertNotification,
};

export default connect(null, mapDispatchToProps)(AlertNotification);