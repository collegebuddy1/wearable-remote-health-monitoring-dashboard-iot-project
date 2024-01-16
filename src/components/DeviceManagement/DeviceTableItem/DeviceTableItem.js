import * as React from "react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
} from "reactstrap";
import UnpairDeviceModal from "../UnpairDeviceModal/UnpairDeviceModal";
import PairDeviceModal from "../PairDeviceModal/PairDeviceModal";
import DeleteDeviceModal from "../DeleteDeviceModal/DeleteDeviceModal";
import DeviceStatus from "../../RealTimeData/DeviceStatus/DeviceStatus";


class DeviceTableItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            unpairDeviceModalShow: false,
            pairDeviceModalShow: false,
            deleteDeviceModalShow: false,
            userAssociated: false,
        }
    }

    componentDidMount() {
        const {associatedUserID} = this.props;
        if (associatedUserID !== "NONE") {
            this.setState({
                userAssociated: true,
            })
        }
    }

    // Triggers the opening/closing of the unpairDeviceModal
    setUnpairDeviceModalShow = (bool) => {
        this.setState({
            unpairDeviceModalShow: bool,
        });
    };

    // Triggers the opening/closing of the pairDeviceModal
    setPairDeviceModalShow = (bool) => {
        this.setState({
            pairDeviceModalShow: bool,
        });
    };

    // Triggers the opening/closing of the deleteDeviceModal
    setDeleteDeviceModalShow = (bool) => {
        this.setState({
            deleteDeviceModalShow: bool,
        });
    };


    render() {
        const {device, associatedUserID, associatedUserName} = this.props;
        const {unpairDeviceModalShow, pairDeviceModalShow, userAssociated, deleteDeviceModalShow} = this.state;
        return(
            <tr>
                <th scope="row">
                    {device.id}
                </th>
                <td>{(device.deviceOS)? device.deviceOS : "Unknown"}</td>
                <td>{(device.deviceStatus === null)? "N/A" : <DeviceStatus deviceID={device.id}/> }</td>
                <td>{(associatedUserID !== "NONE")? associatedUserName : "NONE"}</td>
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
                            {(userAssociated)?
                                <DropdownItem
                                href=""
                                onClick={() => this.setUnpairDeviceModalShow(true)}
                            >
                                Unpair Device
                            </DropdownItem>
                                :
                                <DropdownItem
                                    href=""
                                    onClick={() => this.setPairDeviceModalShow(true)}
                                >
                                    Pair Device
                                </DropdownItem>
                            }
                            {(userAssociated)?
                            null
                                :
                                <DropdownItem
                                    href=""
                                    onClick={() => this.setDeleteDeviceModalShow(true)}
                                >
                                    Delete Device
                                </DropdownItem>
                            }
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <PairDeviceModal show={pairDeviceModalShow} device={device} onHide={() => this.setPairDeviceModalShow(false)} />
                    <DeleteDeviceModal show={deleteDeviceModalShow} deviceID={device.id} onHide={() => this.setDeleteDeviceModalShow(false)} />
                    <UnpairDeviceModal show={unpairDeviceModalShow} deviceID={device.id} userName={associatedUserName} userID={associatedUserID} onHide={() => this.setUnpairDeviceModalShow(false)} />
                </td>
            </tr>
        )
    }

}

export default DeviceTableItem;