import * as React from "react";
import {
    Badge,
    Media,
    UncontrolledTooltip
} from "reactstrap";
import HeartRate from "../../RealTimeData/HeartRate/HeartRate";
import DeviceStatus from "../../RealTimeData/DeviceStatus/DeviceStatus";



class UserTableItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profilePhoto:  require("../../../assets/img/theme/blank-profile.png"),
        }
    }

    componentDidMount() {
       const {  profileImg } = this.props;
       if (profileImg) {
           this.setState({
               profilePhoto: profileImg,
           })
       }
    }


    render() {
        const {name,id, deviceID } = this.props;
        const { profilePhoto } = this.state;
        return (
            <tr>
                <th scope="row">
                    <Media className="align-items-center">
                            <span className="mb-0 text-sm">
                                {name}
                            </span>
                    </Media>
                </th>
                <td>
                    <div className="avatar-group">
                        <a
                            className="avatar avatar-sm"
                            href="#pablo"
                            id={"tooltip" + id}
                            onClick={e => e.preventDefault()}
                        >
                            <img
                                alt="..."
                                className="rounded-circle"
                                src={profilePhoto}
                            />
                        </a>
                        <UncontrolledTooltip
                            delay={0}
                            target={"tooltip" + id}
                        >
                            {name}
                        </UncontrolledTooltip>
                    </div>
                </td>
                <td>
                    <Badge color="" className="badge-dot mr-4">
                        <DeviceStatus deviceID={deviceID} />
                    </Badge>
                </td>
                <td>
                    <div className="d-flex align-items-center">
                        <span className="mr-2">
                            <HeartRate deviceID={deviceID} />
                        </span>
                    </div>
                </td>
            </tr>
        )
    }
}

export default UserTableItem;