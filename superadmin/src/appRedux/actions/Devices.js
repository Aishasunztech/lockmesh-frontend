import {
    DEVICES_LIST,
    SUSPEND_DEVICE,
    CONNECT_DEVICE,
    EDIT_DEVICE,
    SET_VISIBILITY_FILTER,
    ACTIVATE_DEVICE,
    LOADING,
    INVALID_TOKEN,
    GET_SIM_IDS,
    GET_CHAT_IDS,
    GET_PGP_EMAILS,
    REJECT_DEVICE,
    PRE_ACTIVATE_DEVICE,
    DELETE_UNLINK_DEVICE,
    OFFLINE_DEVICES_STATUS
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

// action creaters 

export function saveOfflineDevice(data) {

    return (dispatch) => {

        RestService.saveOfflineDevice(data).then((response) => {
            // console.log("data form server");
            // console.log(response.data);
            console.log('at action file for save-offline-device: ', response.data)
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {

                    // get all updated ofline devices
                    RestService.getOfflineDevices().then((response) => {
                        console.log("data form server");
                        console.log(response.data);
                        if (RestService.checkAuth(response.data)) {
                            // console.log(response.data)
                            if (response.data.status) {

                                dispatch({
                                    type: DEVICES_LIST,
                                    payload: response.data.devices,

                                });
                            }
                        } else {
                            dispatch({
                                type: INVALID_TOKEN
                            });
                        }
                    })
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })

    };
}

export function getOfflineDevices() {

    return (dispatch) => {

        RestService.getOfflineDevices().then((response) => {
            console.log("data form server");
            console.log(response.data);
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data)
                if (response.data.status) {

                    dispatch({
                        type: DEVICES_LIST,
                        payload: response.data.devices,

                    });
                }
                else {
                    dispatch({
                        type: DEVICES_LIST,
                        payload: [],

                    });
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })

    };
}
export function editDevice(formData) {
    return (dispatch) => {
        // console.log('edit form data ', formData);
        RestService.updateDeviceDetails(formData).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: EDIT_DEVICE,
                    response: response.data,
                    payload: {
                        formData: formData,
                    }
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }
}

export function deleteUnlinkDevice(action, devices) {
    return (dispatch) => {
        // alert("hello");
        // console.log(devices);
        RestService.deleteUnlinkDevice(action, devices).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('successfully ', response.data);
                dispatch({
                    type: DELETE_UNLINK_DEVICE,
                    response: response.data,
                    payload: {
                        formData: devices
                    }
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


// export function suspendDevice(device) {

//     return (dispatch) => {
//         console.log("suspendDevice action", device);

//         RestService.suspendDevice(device.id).then((response) => {

//             if (RestService.checkAuth(response.data)) {

//                 // get all updated ofline devices
//                 RestService.getOfflineDevices().then((response) => {
//                     console.log("data form server");
//                     console.log(response.data);
//                     if (RestService.checkAuth(response.data)) {
//                         // console.log(response.data)
//                         if (response.data.status) {

//                             dispatch({
//                                 type: DEVICES_LIST,
//                                 payload: response.data.devices,

//                             });
//                         }
//                     } else {
//                         dispatch({
//                             type: INVALID_TOKEN
//                         });
//                     }
//                 })


//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 });
//             }
//         });
//     }


// }

// export function activateDevice(device) {

//     return (dispatch) => {

//         RestService.activateDevice(device.usr_device_id).then((response) => {
//             if (RestService.checkAuth(response.data)) {
//                 // console.log('response', response.data);
//                 device.account_status = '';

//                 if (response.data.status) {
//                     dispatch({
//                         type: ACTIVATE_DEVICE,
//                         response: response.data,
//                         payload: {
//                             device: device,
//                             msg: response.data.msg,
//                         }
//                     });
//                 }

//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 });
//             }
//         });
//     }

// }

export function statusDevice(device, requireStatus) {
    console.log('at action status is: ', requireStatus);

    return (dispatch) => {

        RestService.statusDevice(device, requireStatus).then((response) => {
            console.log('statusDevice response at action is: ', response.data);
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: OFFLINE_DEVICES_STATUS,
                        payload: response.data,
                        // msg: "Offline Device Status Successfully Updated!",
                    });
                } else {
                    dispatch({
                        type: OFFLINE_DEVICES_STATUS,
                        payload: response.data,
                        // msg: "Failed to update Offline Device Status!",
                    });
                }

                // get all updated ofline devices
                // RestService.getOfflineDevices().then((response) => {
                //     // console.log("data form server");
                //     console.log(response.data);
                //     if (RestService.checkAuth(response.data)) {
                //         // console.log(response.data)
                //         if (response.data) {

                //             dispatch({
                //                 type: DEVICES_LIST,
                //                 payload: response.data,
                //             });

                //             // dispatch({
                //             //     type: OFFLINE_DEVICES_STATUS,
                //             //     status: response.data.status,
                //             //     msg: "Offline Device Status Successfully Updated!",
                //             // });
                //         } else {
                //             dispatch({
                //                 type: DEVICES_LIST,
                //                 payload: response.data,
                //             });
                //             // dispatch({
                //             //     type: OFFLINE_DEVICES_STATUS,
                //             //     status: response.data.status,
                //             //     msg: "Failed to update Offline Device Status!",
                //             // });
                //         }
                //     } else {
                //         dispatch({
                //             type: INVALID_TOKEN
                //         });
                //     }
                // })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }

        });
    }

}


export function connectDevice(device_id) {

    return { type: CONNECT_DEVICE, device_id }

}

export function setVisibilityFilter(filter) {

    return { type: SET_VISIBILITY_FILTER, filter }

}

export function getSimIDs() {
    return (dispatch) => {

        RestService.getSimIDs().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_SIM_IDS,
                    payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }

}
export function getSimIDsLabel(labelID) {

    console.log('what SimIDsLabel', labelID)
    // if(labelID) {
    console.log('action file true label id', labelID)

    return (dispatch) => {

        RestService.getSimIDsLabel(labelID).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_SIM_IDS,
                    payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }
    // }else{
    console.log('action file false label id', labelID)

    //     return (dispatch) => {

    //         RestService.getSimIDs().then((response) => {
    //             if (RestService.checkAuth(response.data)) {
    //                 // console.log('response', response.data);
    //                 dispatch({
    //                     type: GET_SIM_IDS,
    //                     payload: response.data.data
    //                 });

    //             } else {
    //                 dispatch({
    //                     type: INVALID_TOKEN
    //                 });
    //             }
    //         });
    //     }
    // }
}

export function getChatIDs() {
    return (dispatch) => {

        RestService.getChatIDs().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_CHAT_IDS,
                    payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }
}

export function getPGPEmails() {
    return (dispatch) => {
        // alert("hello");
        RestService.getPGPEmails().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_PGP_EMAILS,
                    payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }
}

// get ids with label
export function getChatIDsLabel(labelID) {
    return (dispatch) => {

        RestService.getChatIDsLabel(labelID).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_CHAT_IDS,
                    payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }
}

export function getPGPEmailsLabel(labelID) {
    return (dispatch) => {
        // alert("hello");
        RestService.getPGPEmailsLabel(labelID).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_PGP_EMAILS,
                    payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }
}




