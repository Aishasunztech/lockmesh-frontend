import {
    APK_LIST,
    INVALID_TOKEN,
    ADD_APK,
    UNLINK_APK,
    // EDIT_APK,
    LOADING,
    IMPORT_CSV,
    RELEASE_CSV,
    GET_USED_PGP_EMAILS,
    GET_USED_CHAT_IDS,
    GET_USED_SIM_IDS,
    DUPLICATE_SIM_IDS,
    NEW_DATA_INSERTED,
    CHECK_DEALER_PIN,
    DELETE_IDS,
    SYNC_IDS,
    GET_SALE_LIST,
    GET_DEALER_LIST,
    GET_DEVICE_LIST
} from "../../constants/ActionTypes"


import RestService from '../services/RestServices';

export function importCSV(formData, fieldName) {
    return (dispatch) => {
        // dispatch({
        //     type: LOADING,
        //     isloading: true

        // });
        RestService.importCSV(formData, fieldName).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('duplicated data at action file ::', response.data)
                if (response.data.duplicateData.length) {
                    // console.log('duplicated data at action file :: ', response.data);
                    dispatch({
                        type: DUPLICATE_SIM_IDS,
                        payload: response.data,
                        showMsg: true,
                    })
                } else {
                    dispatch({
                        type: IMPORT_CSV,
                        payload: response.data,
                        showMsg: true,
                    })
                    dispatch({
                        type: IMPORT_CSV,
                        payload: response.data,
                        showMsg: false,
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
        // RestService.ApkList()
        //     .then((response) => {
        //         // console.log("apk_list form server");
        //         //  console.log(response.data);
        //         if (RestService.checkAuth(response.data)) {

        //             // dispatch({
        //             //     type: APK_LIST,
        //             //     payload: response.data.list
        //             // });

        //             // dispatch({
        //             //     type: LOADING,
        //             //     isloading: true
        //             // });

        //         } else {
        //             dispatch({
        //                 type: INVALID_TOKEN
        //             });
        //         }
        //     });

    };
}


export function insertNewData(newData) {
    return (dispatch) => {
        if (newData.submit) {
            RestService.saveNewData(newData).then((response) => {
                // console.log('response', response)
                if (RestService.checkAuth(response.data)) {

                    // console.log('success', response.data)
                    dispatch({
                        type: NEW_DATA_INSERTED,
                        payload: response.data,
                        showMsg: true,
                    })

                } else {
                    dispatch({
                        type: INVALID_TOKEN
                    })
                }
            })
        } else {
            dispatch({
                type: NEW_DATA_INSERTED,
                payload: {
                    msg: '',
                    status: false
                },
                showMsg: false,
            })
        }

    }
}

export function exportCSV(fieldName) {
    return (dispatch) => {
        RestService.exportCSV(fieldName).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status === true) {
                    RestService.getFile(response.data.path);
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}
export function releaseCSV(fieldName, ids) {
    // console.log(fieldName, ids);
    return (dispatch) => {
        RestService.releaseCSV(fieldName, ids).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: RELEASE_CSV,
                    payload: response.data,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}
export function getUsedPGPEmails() {
    return (dispatch) => {
        RestService.getUsedPGPEmails().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_USED_PGP_EMAILS,
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
export function getUsedSimIds() {
    return (dispatch) => {
        // alert("hello");
        RestService.getUsedSimIds().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_USED_SIM_IDS,
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
export function getUsedChatIds() {
    return (dispatch) => {
        // alert("hello");
        RestService.getUsedChatIds().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_USED_CHAT_IDS,
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
export function deleteCSVids(type, ids) {
    return (dispatch) => {
        // alert("hello");
        // console.log(ids);
        RestService.deleteCSVids(type, ids).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('successfully ', response.data);
                dispatch({
                    type: DELETE_IDS,
                    response: response.data,
                    payload: {
                        formData: ids
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
export function syncWhiteLabelsIDs(isButton) {
    return (dispatch) => {
        RestService.syncWhiteLabelsIDs().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('successfully ', response.data);
                dispatch({
                    type: SYNC_IDS,
                    response: response.data,
                    isButton: isButton
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}
export function getSalesList() {
    return (dispatch) => {
        // alert("hello");
        RestService.getSalesList().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_SALE_LIST,
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

export function getDealerList(labelId) {
    return (dispatch) => {
        // alert("hello");
        RestService.getDealerList(labelId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: GET_DEALER_LIST,
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

export function getDeviceList(labelId) {
    return (dispatch) => {
        // alert("hello");
        RestService.getDeviceList(labelId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                console.log('response', response.data);
                dispatch({
                    type: GET_DEVICE_LIST,
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
