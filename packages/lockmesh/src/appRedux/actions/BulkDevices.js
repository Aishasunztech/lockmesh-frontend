import { BULK_DEVICES_LIST, BULK_SUSPEND_DEVICES, LOADING, INVALID_TOKEN, BULK_LOADING, BULK_ACTIVATE_DEVICES, BULK_HISTORY, BULK_PUSH_APPS, SET_PUSH_APPS, SET_PULL_APPS, BULK_PULL_APPS, SET_SELECTED_BULK_DEVICES, WIPE_BULK_DEVICES, UNLINK_BULK_DEVICES, CLOSE_RESPONSE_MODAL, APPLY_BULK_POLICY, SET_BULK_MESSAGE, SEND_BULK_MESSAGE, SEND_BULK_WIPE_PASS, HANDLE_BULK_WIPE_PASS, BULK_HISTORY_LOADING, SET_BULK_ACTION, SET_BULK_DATA, GET_BULK_MSGS, DELETE_BULK_MSG, UPDATE_BULK_MESSAGE } from "../../constants/ActionTypes";

import RestService from '../services/RestServices';
import { SERVER_TIMEZONE, TIMESTAMP_FORMAT } from "../../constants/Application";

import moment from 'moment';
import { checkIsArray } from "../../routes/utils/commonUtils";




export function getBulkDevicesList(data) {
    // console.log('at action file ', data)

    return (dispatch) => {
        dispatch({
            type: BULK_LOADING,
            isloading: true
        });
        RestService.getBulkDevicesList(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    // console.log('at action file on response', response)
                    dispatch({
                        type: BULK_DEVICES_LIST,
                        payload: response.data,

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

export function bulkSuspendDevice(devices) {

    // console.log("bulkSuspendDevice action file =========> ", devices);
    return (dispatch) => {

        RestService.bulkSuspendDevice(devices).then((response) => {

            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                // if (response.data.status) {
                dispatch({
                    type: BULK_SUSPEND_DEVICES,
                    payload: response.data,
                });
                // }


            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }


}


export function bulkActivateDevice(devices) {
    // console.log('bulkActivateDevice at action file ', devices)
    return (dispatch) => {

        RestService.bulkActivateDevice(devices).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                dispatch({
                    type: BULK_ACTIVATE_DEVICES,
                    payload: response.data,
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }

}

export function getbulkHistory() {

    return (dispatch) => {
        // dispatch({
        //     type: BULK_HISTORY_LOADING,
        // });
        RestService.getbulkHistory().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);

                if (response.data) {
                    dispatch({
                        type: BULK_HISTORY,
                        payload: response.data,
                    });
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }

}




export const setBulkPushApps = (apps) => {
    // console.log("apps at action file for push apps ", apps)
    checkIsArray(apps).forEach((el) => {
        // el.enable = (typeof (el.enable) === Boolean || typeof (el.enable) === 'Boolean' || typeof (el.enable) === 'boolean') ? el.enable : false;
        // el.guest = (typeof (el.guest) === Boolean || typeof (el.guest) === 'Boolean' || typeof (el.guest) === 'boolean') ? el.guest : false;
        // el.encrypted = (typeof (el.encrypted) === Boolean || typeof (el.encrypted) === 'Boolean' || typeof (el.encrypted) === 'boolean') ? el.encrypted : false;
        delete el.apk_logo;
        delete el.apk_status;
    })
    return (dispatch) => {
        dispatch({
            type: SET_PUSH_APPS,
            payload: apps,
        })
    }
}

export const applyBulkPushApps = (data) => {
    // console.log("applyBulkPushApps data at action file: ", data);
    return (dispatch) => {
        RestService.applyBulkPushApps(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('response is ', response.data);
                dispatch({
                    type: BULK_PUSH_APPS,
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


// Set Pull apps 
export const setBulkPullApps = (apps) => {
    checkIsArray(apps).forEach((el) => {

        delete el.icon;
        el.apk_id = el.key;
        el.apk_name = el.label;
        el.version_name = "";
        el.apk = "";
        el.guest = false;
        el.encrypted = false;
        el.enable = false;
    })
    return (dispatch) => {
        dispatch({
            type: SET_PULL_APPS,
            payload: apps

        })
    }
}

export const applyBulkPullApps = (data) => {
    return (dispatch) => {
        RestService.applyBulkPullApps(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: BULK_PULL_APPS,
                    payload: response.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

// Set Selected Devices
export const setSelectedBulkDevices = (data) => {
    return (dispatch) => {
        dispatch({
            type: SET_SELECTED_BULK_DEVICES,
            payload: data

        })
    }
}

export function unlinkBulkDevices(data) {
    // console.log('you are at action file of unlinkBulkDevices', data)
    return (dispatch) => {
        RestService.unlinkBulkDevices(data).then((response) => {
            // console.log('response to unlink device', response);
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    payload: response.data,
                    type: UNLINK_BULK_DEVICES,
                    // payload: device,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function wipeBulkDevices(data) {
    return (dispatch) => {
        RestService.wipeBulkDevices(data).then((response) => {

            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: WIPE_BULK_DEVICES,
                    payload: response.data,
                });
            }
        });
    }
}

export function closeResponseModal() {
    return (dispatch) => {
        dispatch({
            type: CLOSE_RESPONSE_MODAL,
        });
    }
}


// Push Policy
export const applyBulkPolicy = (data) => {
    return (dispatch) => {
        RestService.applyBulkPolicy(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: APPLY_BULK_POLICY,
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



// Set Bulk Msg
export const setBulkMsg = (data) => {
    // console.log("at action file")
    return (dispatch) => {
        dispatch({
            type: SET_BULK_MESSAGE,
            payload: data
        })
    }
}

// Set Bulk action
export const setBulkData = (data, dataType) => {
    // console.log("at action file")
    return (dispatch) => {
        dispatch({
            type: SET_BULK_DATA,
            payload: data,
            dataType
        })
    }
}

// send msg
export const sendBulkMsg = (data, dealerTZ) => {
    return (dispatch) => {
        RestService.sendBulkMsg(data, dealerTZ).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: SEND_BULK_MESSAGE,
                    payload: response.data,
                    // data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

// update msg
export const updateBulkMsg = (record, devices, dealerTZ) => {
    // console.log("updateBulkMsg action file: ", record)

    // let cloneRecord = JSON.parse(JSON.stringify(record));
    // cloneRecord["date_time"] = dealerTZ ? moment(cloneRecord.date_time).tz(dealerTZ).tz(SERVER_TIMEZONE).format(TIMESTAMP_FORMAT) : '';
    // console.log(record, "cloneRecord ", cloneRecord);
    return (dispatch) => {
        RestService.updateBulkMsg(record, dealerTZ).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: UPDATE_BULK_MESSAGE,
                    payload: response.data,
                    msg_data: { ...record, devices },
                    dealerTZ
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

// handle wipe passwoed for bulk
export const handleWipePwdConfirmModal = (data) => {
    // console.log("at action file ", data);
    return (dispatch) => {
        dispatch({
            type: HANDLE_BULK_WIPE_PASS,
            payload: data
        })
    }
}

export function getBulkMsgsList(timezone) {
    // console.log('at action file ')

    return (dispatch) => {
        RestService.getBulkMsgsList(timezone).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('at action file on response', response)
                if (response.data.status) {
                    dispatch({
                        type: GET_BULK_MSGS,
                        payload: response.data,
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

// delete bulk msg
export const deleteBulkMsg = (data) => {
    console.log("at action file ", data);
    return (dispatch) => {
        RestService.deleteBulkMsg(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                console.log('at action file on response', response)
                // if (response.data.status) {
                dispatch({
                    type: DELETE_BULK_MSG,
                    payload: response.data,
                    delete_id: data
                });
                // }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}