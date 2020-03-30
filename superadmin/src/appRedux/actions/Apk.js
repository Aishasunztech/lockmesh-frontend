import {
    APK_LIST,
    INVALID_TOKEN,
    ADD_APK,
    UNLINK_APK,
    EDIT_APK,
    LOADING,
    PERMSSION_SAVED,
    RESET_UPLOAD_FORM
} from "../../constants/ActionTypes"
// import AuthFailed from './Auth';

import RestService from '../services/RestServices';

export function getApkList() {
    return (dispatch) => {
        dispatch({
            type: LOADING,
            isloading: true
        });
        RestService.ApkList()
            .then((response) => {
                // console.log("apk_list form server");
                //  console.log(response.data);
                if (RestService.checkAuth(response.data)) {
                    if (response.data.status) {
                        dispatch({
                            type: APK_LIST,
                            payload: response.data.list
                        });
                    } else {
                        dispatch({
                            type: APK_LIST,
                            payload: []
                        })
                    }


                } else {
                    dispatch({
                        type: INVALID_TOKEN
                    });
                }
            });

    };
}

export function changeAppStatus(appId, appStatus) {
    return (dispatch) => {

        let apkData = {
            apk_id: appId,
            status: (appStatus === true) ? "On" : 'off'
        }
        RestService.toggleApk(apkData).then((response) => {

            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: "APK_STATUS_CHANGED",
                    payload: appId
                });


            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });


    };
}

export function deleteApk(appId) {
    return (dispatch) => {
        RestService.unlinkAPK(appId).then((response) => {
            // console.log('delete apk');
            // console.log(response);
            // console.log('delted id');
            // console.log(appId);
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: UNLINK_APK,
                    payload: appId,
                    response: response.data
                });


            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }

        });
    }
}


export function addApk(formData) {
    return (dispatch) => {
        // console.log('form data in action');
        // console.log(formData);
        RestService.addAPK(formData).then((response) => {

            // console.log('add apk resopnse');
            // console.log(response.data);
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: ADD_APK,
                    response: response.data,
                    payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    };
}

export function editApk(formData) {
    return (dispatch) => {
        // console.log('form data in action');
        // console.log(formData);
        RestService.updateApkDetails(formData).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: EDIT_APK,
                    response: response.data,
                    payload: formData
                });


            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    };
}

export function savePermission(apk_id, dealers, action) {
    return (dispatch) => {
        RestService.saveAPKPermissions(apk_id, dealers, action).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: PERMSSION_SAVED,
                    payload: response.data.msg,
                    permission_count: response.data.permission_count,
                    apk_id: apk_id,
                    dealers: dealers
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }

}
export function resetUploadForm(visible) {
    return (dispatch) => {
        dispatch({
            type: RESET_UPLOAD_FORM,
            payload: visible
        });
    }
}
