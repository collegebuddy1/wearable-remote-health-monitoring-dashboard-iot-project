import * as React from "react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
} from "reactstrap";
import DeleteLocationModal from "../DeleteLocationModal/DeleteLocationModal";
import LocationMap from "./LocationMap/LocationMap";
import {v4 as uuidv4} from "uuid";
import "./LocationTableItem.css";



class LocationTableItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            deleteLocationModalShow: false,
        }
    }


    // Triggers the opening/closing of the deleteLocationModal
    setDeleteLocationModalShow = (bool) => {
        this.setState({
            deleteLocationModalShow: bool,
        });
    };


    render() {
        const {location} = this.props;
        const {deleteLocationModalShow} = this.state;
        let boundaryList = location.boundary.map(point => {
            return(
                <li key={uuidv4()}><span>[lat: {point.lat}, lng: {point.lng}]</span></li>
            )
        })
        return(
            <tr>
                <th scope="row">
                    {location.locationName}
                </th>
                <td><LocationMap path={location.boundary} /></td>
                <td className={"p-0 m-0"}><ul className={"boundaryList"}>{boundaryList}</ul></td>
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
                                onClick={() => this.setDeleteLocationModalShow(true)}
                            >
                                Delete Location
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <DeleteLocationModal show={deleteLocationModalShow} location={location} onHide={() => this.setDeleteLocationModalShow(false)} />
                </td>
            </tr>
        )
    }

}

export default LocationTableItem;