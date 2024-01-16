import { API, graphqlOperation } from 'aws-amplify';
import { createUser, deleteUser, updateUser } from '../graphql/mutations';
import { listUsers } from '../graphql/queries';
import {enqueueAppNotification} from "./notificationActions";
import {retrieveImageService} from "../services/profilePhotoFetcher/profilePhotoFetcher";


// ===================================---FETCHING USERS---=======================================
// Fetch users from AWS, set loading flag
export const fetchUsers = () => {
    return (dispatch) => {
        dispatch({ type: "FETCH_USERS_REQUEST" });
        API.graphql(graphqlOperation(listUsers)).then((response) => {
            const users = response.data.listUsers.items;
            dispatch(fetchUsersSuccess(users));
        }).catch((err) => {
            console.log("Error fetching users: ", err);
            dispatch(fetchUsersFailure(err));
        })
    }
}

// Respond to failure condition
export const fetchUsersFailure = (error) => {
    return (dispatch) => {
        dispatch({type: "FETCH_USERS_FAILURE", payload: error});
        dispatch(enqueueAppNotification({type: "error", message: "Error fetching users, please refresh the page: " + error}));
    }
}

// Success condition, update local state with fetched user data, remove loading flag
export const fetchUsersSuccess = (payload) => {
    return async (dispatch) => {
        for (let user of payload) {
            if (user.profileImage) {
                const image = await retrieveImageService(user.profileImage.key);
                if (image) {
                    user.image = image;
                }
            }
        }
        dispatch({type: "FETCH_USERS_SUCCESS", payload: payload})
    }
}

// =====================================---ADDING NEW USER---=======================================

// Add new user to DynamoDB
export const registerNewUser = (payload) => {
    return (dispatch) => {
        dispatch({type: "ADD_NEW_USER_REQUEST", payload: payload});
        API.graphql(graphqlOperation(createUser, {input: payload})).then((response) => {
            dispatch(addNewUserSuccess());
        }).catch((err) => {
            console.log("Error registering new user: ", err);
            dispatch(registerNewUserFailure(err));
        })
    }
}

// Respond to failure condition
export const registerNewUserFailure = (error) => {
    return (dispatch) => {
        dispatch({type: "ADD_NEW_USER_FAILURE", payload: error});
        dispatch(enqueueAppNotification({type: "error", message: "Error adding user: " + error.errors[0].message}));
    }
}

// Respond to success condition
export const addNewUserSuccess = () => {
    return (dispatch) => {
        dispatch({ type: "ADD_NEW_USER_SUCCESS"});
        dispatch(enqueueAppNotification({type: "success", message: "New user added successfully!"}));
    }
}

// =====================================---UPDATING USER INFORMATION---=======================================

// Updates user information in DynamoDB
export const updateUserInformation = (payload) => {
    return (dispatch) => {
        API.graphql(graphqlOperation(updateUser, {input: payload})).then((response) => {
            console.log(response);
            dispatch(updateUserSuccess());
        }).catch((err) => {
            console.log("Error updating user: ", err);
            dispatch(updateUserFailure(err));
        })
    }
}

// Respond to failure condition
export const updateUserFailure = (error) => {
    return (dispatch) => {
        dispatch({type: "UPDATE_USER_FAILURE", payload: error });
        dispatch(enqueueAppNotification({type: "error", message: "Error updating user: " + error.errors[0].message}));
    }
}

// Respond to success condition
export const updateUserSuccess = () => {
    return (dispatch) => {
        dispatch({ type: "UPDATE_USER_SUCCESS"});
        dispatch(enqueueAppNotification({type: "success", message: "User information updated successfully!"}));
    }
}

// Update user information locally
export const updateUserInformationLocally = (payload) => {
    return {
        type: "UPDATE_USER_INFORMATION",
        payload: payload,
    }
}

// =====================================---DELETING A USER---=======================================

// Delete user locally, and from DynamoDB.
export const deleteUserRequest = (payload) => {
    return (dispatch) => {
        dispatch({ type: "DELETE_USER", payload: payload});
        API.graphql(graphqlOperation(deleteUser, {input: {id: payload}})).then((response) => {
            dispatch(deleteUserSuccess());
        }).catch((err) => {
            console.log("Error deleting user: ", err);
            dispatch(deleteUserFailure(err));
        })
    }
}

// Respond to failure condition
export const deleteUserFailure = (error) => {
    return (dispatch) => {
        dispatch({type: "DELETE_USER_FAILURE", payload: error});
        dispatch(enqueueAppNotification({type: "error", message: "Error deleting user: " + error.errors[0].message}));
    }
}

// Respond to success condition
export const deleteUserSuccess = () => {
    return (dispatch) => {
        dispatch({ type: "DELETE_USER_SUCCESS"});
        dispatch(enqueueAppNotification({type: "info", message: "User deleted successfully!"}));
    }
}

// =====================================---UPDATE USER PROFILE IMAGE---=======================================

// updates the user profile image information locally
export const updateUserProfileImage = (payload) => {
    return async (dispatch) => {
        payload.image = await retrieveImageService(payload.profileImage.key);
        dispatch({type: "UPDATE_USER_PROFILE_IMAGE", payload: payload })
    }
}
