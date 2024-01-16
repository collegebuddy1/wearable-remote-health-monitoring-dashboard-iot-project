import {API} from "aws-amplify";
import {listDatas} from "../../graphql/queries";

// retrieves data of type "dataType" for a given userID

export const retrieveUserDataService = async (userID, dataType) => {
    return new Promise((resolve, reject) => {
        let filter = {
            userID: {eq: userID},
            observationType: {eq: dataType}
        }

        API.graphql({query: listDatas, variables: {filter: filter}}).then((response) => {
            const data = response.data.listDatas.items;
            resolve(data);
        }).catch((err) => {
            console.log("Error fetching user data: ", err);
            reject(err);
        })
    })

}