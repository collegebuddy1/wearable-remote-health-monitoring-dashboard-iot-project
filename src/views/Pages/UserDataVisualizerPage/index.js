import React from "react";
import {connect} from "react-redux";
import {Card, Container, CardBody} from "reactstrap";
import DataVisualizerHeader from "../../../components/Headers/DataVisualizerHeader";
import LineGraph from "../../../components/UserDataVisualizer/LineGraph/LineGraph";
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { retrieveUserDataService } from "../../../services/userDataFetcher/userDataFetcher.js";

const useStyles = theme => ({
    root: {
        width: "100%",
    },
    bar: {
        borderRadius: 4,
        height: "10px",
        filter: "drop-shadow(0 0 2px #4444dd)",
    }
});


class DataVisualizerComponent extends React.Component {

    _isMounted = false;


    constructor(props) {
        super(props);
        const {location } = this.props;
        let userID = location.pathname.replace(/.admin.data-visualizer./, "");
        let userProfile = this.findUser(userID);
        this.state = {
            userID: userProfile.id,
            dataType: "heart_rate",
            dataLoading: true,
            hasData: false,
            rawData: null,
            processedData: null,
            isLoading: true,
            progress: 10,
        }
    }

    findUser = (id) => {
        const {users} = this.props;
        return users.find(user => user.id === id);
    }

    async componentDidMount() {
        const {userID} = this.state;
        this._isMounted = true;
        try {
           await this.fetchUserData(userID);
        } catch (err) {
            console.log("User data processing function call error: ", err);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchUserData = async (userID) => {
        if (!this._isMounted) {
            return;
        }
        const {dataType} = this.state;
        try {

            let data = await retrieveUserDataService(userID, dataType);
            if (!data) {
                console.log("Error: Data could not be retrieved for this user.");
                return;
            }
            if ((data.length !== 0) && this._isMounted) {
                this.setState({
                    hasData: true,
                    rawData: data,
                })
            } else {
                if (this._isMounted) {
                    this.setState({
                        isLoading: false,
                    })
                }
                return;
            }

            this.processData();

        } catch (err) {
            console.log("Sorry, an error occurred during data retrieval: ", err);
        }
    }

    processData = () => {
        if (!this._isMounted) {
            return;
        }
        const { rawData } = this.state;
        let dataLength = rawData.length;
        let progress = 10;
        let progressStep = 90/dataLength;
        rawData.sort(function(a,b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        let data = [];
        if (rawData) {
            rawData.forEach(record => {
                data.push({x: new Date(record.createdAt), y: parseInt(record.observationValue) });
                progress += progressStep;
                if (this._isMounted) {
                    this.setState({
                        progress: progress,
                    })
                }
            })
        }
        let processedData = [
            {
                id: "heart_rate",
                color: "hsl(12,100%,46%)",
                data: data,
            }
        ]
        if (this._isMounted) {
            this.setState({
                processedData: processedData,
                isLoading: false,
            })
        }
    }

    render() {
        const {processedData, hasData, isLoading, progress, dataType} = this.state;
        const { classes } = this.props;
        return (
            <div>
                {/*Header*/}
                <div>
                <DataVisualizerHeader />
                </div>
                {/*Page Content*/}
                <Container className="mt--7" fluid>
                    <div className={"row"}>
                        <div className={"col d-flex justify-content-center"}>
                            <Card className="bg-secondary shadow">
                                <CardBody>
                                    {(hasData && !isLoading)?
                                        <div>
                                            <div className={"row"}>
                                                <div className={"col d-flex justify-content-center"}>
                                                    <h1 className={"display-4"}>Heart Rate Over The Past Hour</h1>
                                                </div>
                                            </div>
                                            <div className={"row"}>
                                                <div className={"col d-flex justify-content-center align-items-center"}>
                                                    <LineGraph data={processedData} />
                                                </div>
                                            </div>
                                        </div>
                                    :
                                        null
                                    }
                                    {(isLoading)?
                                        <div>
                                            <div className={"row"}>
                                                <div className={"col d-flex justify-content-center align-items-center"}>
                                                    <h1>Loading data...</h1>
                                                </div>
                                            </div>
                                            <div className={"row"} style={{width: "800px", height: "400px"}}>
                                                <div className={"col d-flex justify-content-center align-items-center"}>
                                                    <div className={classes.root}>
                                                        <LinearProgress variant="determinate" className={classes.bar} value={progress} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                    {(!hasData && !isLoading)?
                                        <div className={"row"} style={{width: "800px", height: "400px"}}>
                                            <div className={"col d-flex justify-content-center align-items-center"}>
                                                <h1>
                                                    Sorry, no data of type '{dataType}' is available!
                                                </h1>
                                            </div>
                                        </div>
                                        :
                                        null
                                    }
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </Container>

            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        users: state.users,
        devices: state.devices,
    };
};

const DataVisualizer = withStyles(useStyles())(DataVisualizerComponent);

export default connect(mapStateToProps) (DataVisualizer);


