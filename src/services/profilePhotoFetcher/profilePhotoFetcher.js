import {Storage} from "aws-amplify";

// retrieves user profile image from S3 given respective key
export const retrieveImageService = async (key) => {
    // 404 error workaround, see: https://github.com/aws-amplify/amplify-js/issues/1145
    // & FAQ: https://docs.amplify.aws/lib/storage/download/q/platform/js#frequently-asked-questions
    const imageList = await Storage.list('');
    let exists = false;
    imageList.forEach(entry => {
        if (entry.key === key) {
            exists = true;
        }
    })
    if (exists) {
        return await Storage.get(key);
    } else {
        return null;
    }

}