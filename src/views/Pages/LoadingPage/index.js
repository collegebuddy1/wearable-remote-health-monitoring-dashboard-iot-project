import React from "react";
import {CircularProgress} from "@material-ui/core";
import "./LoadingPage.css";


class LoadingPage extends React.Component {


    render() {
        return(
            <div className={"container"}>
                <div className={"row loadRow-1"}>
                    <div className={"col d-flex justify-content-center align-items-end"}>
                        <h1 className={"display-3"}>Loading System Information...</h1>
                    </div>
                </div>
                <div className={"row loadRow-2"}>
                    <div className={"col d-flex justify-content-center align-items-center"}>
                        <CircularProgress />
                    </div>
                </div>
            </div>
        )
    }
}


export default LoadingPage;