import React from "react";
import {connect} from "react-redux";
import { Alert } from '@material-ui/lab';
import {Snackbar} from "@material-ui/core";

import {removeAppNotification} from "../../../actions/notificationActions";



class AppNotification extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            notificationOpen: true,
        }
    }

    handleClose = () => {
        this.setState({
            notificationOpen: false,
        });

        const {id, removeAppNotification} = this.props;
        removeAppNotification({id: id});
    }

    render(){
        const {notificationOpen} = this.state;
        const {message, type} = this.props;
        return(
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={notificationOpen}
                autoHideDuration={(type === "info" || type === "error")? 5000 : 1500}
                onClose={this.handleClose}
            >
                <Alert severity={type}>
                    {message}
                </Alert>
            </Snackbar>
        )
    }
}

const mapDispatchToProps = {
    removeAppNotification,
};

export default connect(null, mapDispatchToProps)(AppNotification);