

const initialLocations = [];

// Deletes location from local state
const deleteLocationHelper = (locations, target) => {
    const index = locations.findIndex(location =>
        location.id === target.id
    );

    if (index !== -1) {
        locations.splice(index, 1);
    }

    return locations;
}

// sort locations by name
const sortByName = (locations) => {

    locations.sort((a, b) => {
        let nameA = a.locationName.toUpperCase();
        let nameB = b.locationName.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        return 0;
    })

    return locations;
}


const locationReducer = (locations = initialLocations, action) => {
    let newLocationsList = [...locations];
    switch (action.type) {
        case "FETCH_LOCATIONS_SUCCESS": {
            return sortByName(action.payload);
        }
        case "ADD_NEW_LOCATION_REQUEST": {
            return sortByName([...newLocationsList, action.payload]);
        }
        case "DELETE_LOCATION_REQUEST": {
            return deleteLocationHelper(newLocationsList, action.payload);
        }
        default:
            return newLocationsList;
    }

};

export default locationReducer;