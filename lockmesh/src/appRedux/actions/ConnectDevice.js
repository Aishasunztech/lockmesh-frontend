import {
    GET_DEVICE_DETAILS,
    INVALID_TOKEN,
    GET_DEVICE_APPS,
    GET_PROFILES,
    GET_DEVICE_HISTORIES,
    PUSH_APPS,
    UNDO_APPS,
    REDO_APPS,
    SETTINGS_APPLIED,
    START_LOADING,
    END_LOADING,
    SHOW_MESSAGE,
    LOAD_PROFILE,
    UNLINK_DEVICE,
    CHANGE_SCHAT_ACCOUNT_STATUS,
    CHANGE_PAGE,
    SHOW_HISTORY_MODAL,
    SHOW_SAVE_PROFILE_MODAL,
    SAVE_PROFILE,
    ACTIVATE_DEVICE2,
    SUSPEND_DEVICE2,
    HANDLE_CHECK_APP,
    HANDLE_CHECK_ALL,
    GET_USER_ACC_ID,
    FLAG_DEVICE,
    UNFLAG_DEVICE,
    WIPE_DEVICE,
    CHECKPASS,
    GET_DEALER_APPS,
    HANDLE_CHECK_EXTENSION,
    HANDLE_CHECK_ALL_EXTENSION,
    UNDO_EXTENSIONS,
    REDO_EXTENSIONS,
    HANDLE_CHECK_CONTROL,
    HANDLE_CHECK_MAIN_SETTINGS,
    UNDO_CONTROLS,
    REDO_CONTROLS,
    GET_IMIE_HISTORY,
    GET_POLICIES,
    SHOW_PUSH_APPS_MODAL,
    SHOW_PULL_APPS_MODAL,
    PULL_APPS,
    WRITE_IMEI,
    GET_ACTIVITIES,
    POLICY,
    HIDE_POLICY_CONFIRM,
    APPLY_POLICY,
    CLEAR_APPLICATIONS,
    CLEAR_STATE,
    DEVICE_SYNCED,
    ADD_SIM_REGISTER,
    GET_SIMS,
    UPDATE_SIM,
    DELETE_SIM,
    SIM_HISTORY,
    MESSAGE_HANDLER,
    TRANSFER_HISTORY,
    PASSWORD_CHANGED,
    PUSH_APP_CHECKED,
    RESET_PUSH_APPS,
    GET_UNREG_SIMS,
    TRANSFER_DEVICE,
    HANDLE_CHECK_ALL_PUSH_APPS,
    HANDLE_CHECK_SECURE_SETTINGS,
    RESET_DEVICE,
    SIM_LOADING,
    SERVICES_DETAIL,
    SERVICES_HISTORY,
    CANCEL_EXTENDED_SERVICE,
    USER_CREDITS,
    GET_DEVICE_LIST,
    GET_DEVICE_BILLING_HISTORY,
    DEVICE_NOT_FOUND,
    RESET_CHAT_PIN,
    CHAT_ID_SETTINGS,
    ENABLE_PWD_CONFIRM,
    RESET_PGP_LIMIT
} from "../../constants/ActionTypes"

import RestService from '../services/RestServices';
import { checkIsArray } from "../../routes/utils/commonUtils";

// import { Modal } from 'antd';
// import { convertToLang } from "../../routes/utils/commonUtils";
// import { PASSWORD_SAVED } from "../../constants/Constants";
// const success = Modal.success;
// const error = Modal.error;

// action creaters

export function changePage(pageName) {
    return {
        type: CHANGE_PAGE,
        payload: pageName
    }
}
export function clearState(pageName) {
    return {
        type: CLEAR_STATE,
    }
}

export function closeChatIdSettingsEnable() {
    return {
        type: ENABLE_PWD_CONFIRM,
    }
}

export function getDeviceDetails(deviceId) {
    //console.log('object is callse')
    return (dispatch) => {
        RestService.getDeviceDetails(deviceId).then((response) => {
            // console.log("slkdflaskdfjlasf", response.data);
            if (RestService.checkAuth(response.data)) {
                // console.log("slkdflaskdfjlasf", response.data);
                dispatch({
                    type: GET_DEVICE_DETAILS,
                    payload: response.data.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    };
}
export function deviceNotFound() {
    //console.log('object is callse')
    return (dispatch) => {
        dispatch({
            type: DEVICE_NOT_FOUND
        })
    };
}
export function getDeviceListConnectDevice(deviceId) {
    //console.log('object is callse')
    return (dispatch) => {
        RestService.getDeviceListConnectDevice(deviceId).then((response) => {
            // console.log("slkdflaskdfjlasf", response.data);
            if (RestService.checkAuth(response.data)) {
                // console.log("slkdflaskdfjlasf", response.data);
                if (response.data) {
                    dispatch({
                        type: GET_DEVICE_LIST,
                        payload: response.data.data
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

export function getDeviceApps(deviceId) {
    return (dispatch) => {
        RestService.getDeviceApps(deviceId).then((response) => {
            // console.log('dat form sercer', response.data)
            if (RestService.checkAuth(response.data)) {
                // console.log('dat form sercer', response.data)
                if (response.data.status) {
                    dispatch({
                        type: GET_DEVICE_APPS,
                        payload: response.data
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function getProfiles(device_id) {
    return (dispatch) => {
        RestService.getDeviceProfiles(device_id).then((response) => {

            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_PROFILES,
                        payload: response.data.profiles
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

// export function getAppPermissions(device_id) {
//     return (dispatch) => {
//         RestService.getAppPermissions(device_id).then((response) => {

//             if (RestService.checkAuth(response.data)) {
//                 if (response.data.status) {
//                     dispatch({
//                         type: GET_APPS_PERMISSIONS,
//                         payload: response.data
//                     })
//                 }

//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 })
//             }
//         });
//     }
// }

export function getPolicies() {
    return (dispatch) => {
        RestService.getPolicies().then((response) => {

            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_POLICIES,
                        payload: response.data.policies
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function getDeviceHistories(user_acc_id) {
    return (dispatch) => {
        RestService.getDeviceHistory(user_acc_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_DEVICE_HISTORIES,
                        payload: response.data.profiles
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function getAccIdFromDvcId(deviceId) {
    //  console.log('Do it')
    return (dispatch) => {
        RestService.getUserAccountId(deviceId).then((response) => {
            //  console.log('t e s t', response );
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_USER_ACC_ID,
                    response: response.data,
                    payload: {

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

export function suspendDevice2(device) {

    return (dispatch) => {
        console.log("suspendDevice action", device);

        RestService.suspendDevice(device.usr_device_id).then((response) => { // usr_device_id


            if (RestService.checkAuth(response.data)) {
                // console.log('reslut response ', response);
                // console.log('conect device', device);
                // console.log('done status');
                dispatch({
                    type: SUSPEND_DEVICE2,
                    response: response.data,
                    // payload: {
                    //     device: devices,
                    //     msg: response.data.msg,
                    // }
                });


            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }


}

export function wipe(device) {
    return (dispatch) => {
        RestService.wipe(device.usr_device_id).then((response) => {

            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: WIPE_DEVICE,
                    response: response.data,
                });
            }
        });
    }
}

export function unlinkDevice(device, transferred = false) {
    // console.log(transferred, 'you are at action file of unlinkDevice', device)
    return (dispatch) => {
        RestService.unlinkDevice(device).then((response) => {
            // console.log('response to unlink device', response);
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        response: response.data,
                        type: UNLINK_DEVICE,
                        payload: device,
                        isTransferred: transferred
                    })
                }

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function activateDevice2(device) {

    // console.log('device', device);

    return (dispatch) => {

        RestService.activateDevice(device.usr_device_id).then((response) => {
            // console.log('conect device method call', device);
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);

                if (response.data.status) {
                    dispatch({
                        type: ACTIVATE_DEVICE2,
                        response: response.data,
                        payload: {
                            device: device,
                            msg: response.data.msg,
                        }
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

export function showHistoryModal(visible, profileType = "") {

    return {
        type: SHOW_HISTORY_MODAL,
        payload: {
            visible: visible,
            profileType: profileType
        }
    }
}

export function hidePolicyConfirm() {
    return {
        type: HIDE_POLICY_CONFIRM,
    }
}
export function loadDeviceProfile(app_list) {
    return {
        type: LOAD_PROFILE,
        payload: JSON.parse(app_list)
    };
}

export function applySetting(app_list, passwords, extensions, controls, device_id, usr_acc_id, type = 'setting', name = '') {

    // console.log('app list after apply settings ::: ', app_list);
    return (dispatch) => {
        let device_setting = {
            app_list: app_list,
            passwords: {
                admin_password: (passwords.adminPwd === '') ? null : passwords.adminPwd,
                guest_password: (passwords.guestPwd === '') ? null : passwords.guestPwd,
                encrypted_password: (passwords.encryptedPwd === '') ? null : passwords.encryptedPwd,
                duress_password: (passwords.duressPwd === '') ? null : passwords.duressPwd
            },
            controls: controls,
            subExtensions: extensions,
            type: type,
            name: name
        }
        // console.log("hello setting", device_setting);

        RestService.applySettings(device_setting, device_id, usr_acc_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: SETTINGS_APPLIED,
                        payload: response.data
                    })
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export function undoApps() {
    return (dispatch) => {
        dispatch({
            type: UNDO_APPS
        })
    }
}

export function clearApplications() {
    return (dispatch) => {
        dispatch({
            type: CLEAR_APPLICATIONS
        })
    }
}

export function redoApps() {
    return (dispatch) => {
        dispatch({
            type: REDO_APPS
        })
    }
}

export function undoControls() {
    return (dispatch) => {
        dispatch({
            type: UNDO_CONTROLS
        })
    }
}

export function redoControls() {
    return (dispatch) => {
        dispatch({
            type: REDO_CONTROLS
        })
    }
}

export function undoExtensions() {
    return (dispatch) => {
        dispatch({
            type: UNDO_EXTENSIONS
        })
    }
}

export function redoExtensions() {
    // console.log('redo ex action')
    return (dispatch) => {
        dispatch({
            type: REDO_EXTENSIONS
        })
    }
}

export function pushApps(apps, deviceId, userAccId) {
    // console.log("app_list", app_list);
    return (dispatch) => {
        let device_setting = {
            app_list: [],
            passwords: {
                admin_password: null,
                guest_password: null,
                encrypted_password: null,
                duress_password: null
            },
            controls: {},
            extensions: []
        }

        RestService.applySettings(device_setting, deviceId, "history", null, null, userAccId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: SHOW_MESSAGE,
                        payload: {
                            showMessage: true,
                            messageType: 'success',
                            messageText: "Settings are applied"
                        }
                    })
                    dispatch({
                        type: SETTINGS_APPLIED,
                        payload: response.data
                    })
                    dispatch({
                        type: SHOW_MESSAGE,
                        payload: {
                            showMessage: false,
                            messageType: 'success',
                            messageText: 'Settings are applied'
                        }
                    })
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }

}

export function startLoading() {
    return {
        type: START_LOADING
    }
}

export function endLoading() {
    return {
        type: END_LOADING
    }
}
export function showMessage(show, message, type) {

    // dispatch({
    //     type:SHOW_MESSAGE,
    //     payload:{
    //         showMessage: show,
    //         messageType: message,
    //         messageText: type
    //     }
    // })
}



export function handleControlCheck(e, key) {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_CONTROL,
            payload: {
                value: e,
                key: key
            }
        })
    }
}


export function handleMainSettingCheck(e, key, main) {
    // console.log('name in action', e, key, main)
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_MAIN_SETTINGS,
            payload: {
                value: e,
                key: key,
                main: main
            }
        })
    }
}
export function handleSecureSettingCheck(e, key, main) {
    // console.log('name in action', e, key, main)
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_SECURE_SETTINGS,
            payload: {
                value: e,
                key: key,
                main: main
            }
        })
    }
}


export function handleCheckExtension(e, key, app_id, uniqueName) {
    // console.log('name in action', uniqueName)
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_EXTENSION,
            payload: {
                value: e,
                key: key,
                app_id: app_id,
                uniqueName: uniqueName
            }
        })
    }
}

export function handleCheckApp(e, key, app_id) {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_APP,
            payload: {
                value: e,
                key: key,
                app_id: app_id
            }
        })
    }
}


export function handleCheckAll(keyAll, key, value) {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_ALL,
            payload: {
                keyAll: keyAll,
                key: key,
                value: value
            }
        })
    }
}

export function handleCheckAllExtension(keyAll, key, value, uniqueName) {
    // console.log('actoin is called')
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_ALL_EXTENSION,
            payload: {
                keyAll: keyAll,
                key: key,
                value: value,
                uniqueName: uniqueName
            }
        })
    }
}



export function submitPassword(passwords, pwdType, device_id, usr_acc_id) {
    // console.log("Passwords: ", usr_acc_id);
    return (dispatch) => {

        RestService.submitPassword({ passwords, pwdType, device_id, usr_acc_id }).then((response) => {
            // console.log('action saveProfileCND', device_setting);
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: PASSWORD_CHANGED,
                    payload: {
                        response: response.data,
                        passwords: passwords,
                        pwdType: pwdType,

                    }
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }

        })
    }
}

export function showSaveProfileModal(visible, profileType = '') {
    return (dispatch) => {
        dispatch({
            type: SHOW_SAVE_PROFILE_MODAL,
            payload: {
                visible: visible,
                profileType: profileType
            }
        })
    }
}
export function hanldeProfileInput(profileType, profileValue) {
    return (dispatch) => {
        dispatch({
            type: profileType,
            payload: profileValue
        })
    }
}
export function saveProfile(app_list, passwords = null, profileName, usr_acc_id, controls, extensions) {
    return (dispatch) => {
        let pwd = {};
        // console.log(passwords);
        if (passwords !== null) {
            pwd = {
                admin_password: (passwords.adminPwd === '') ? null : passwords.adminPwd,
                guest_password: (passwords.guestPwd === '') ? null : passwords.guestPwd,
                encrypted_password: (passwords.encryptedPwd === '') ? null : passwords.encryptedPwd,
                duress_password: (passwords.duressPwd === '') ? null : passwords.duressPwd
            }
        } else {
            pwd = {
                admin_password: null,
                guest_password: null,
                encrypted_password: null,
                duress_password: null
            }
        }
        let device_setting = {
            app_list: app_list,
            passwords: pwd,
            controls: controls,
            extensions: extensions
        }

        // console.log("applist save profile", device_setting);
        RestService.saveProfileCND(device_setting, profileName, usr_acc_id).then((response) => {
            // console.log('action saveProfileCND', device_setting);
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: true,
                        messageType: (response.data.status === true) ? 'success' : 'error',
                        messageText: response.data.msg
                    }
                })
                dispatch({
                    type: SAVE_PROFILE,
                    response: response.data
                })
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: false,
                        messageType: 'success',
                        messageText: response.data.msg //"Profile saved successfully"
                    }
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }

        })

    }

}

export function savePolicy(app_list, passwords = null, profileType, profileName, usr_acc_id) {
    return (dispatch) => {
        let pwd = {};
        if (passwords !== null) {
            pwd = {
                admin_password: (passwords.adminPwd === '') ? null : passwords.adminPwd,
                guest_password: (passwords.guestPwd === '') ? null : passwords.guestPwd,
                encrypted_password: (passwords.encryptedPwd === '') ? null : passwords.encryptedPwd,
                duress_password: (passwords.duressPwd === '') ? null : passwords.duressPwd
            }
        } else {
            pwd = {
                admin_password: null,
                guest_password: null,
                encrypted_password: null,
                duress_password: null
            }
        }
        let device_setting = {
            app_list: app_list,
            passwords: pwd,
            controls: {}
        }

        // console.log("applist save profile", device_setting);
        RestService.applySettings(device_setting, null, profileType, profileName, null, usr_acc_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: true,
                        messageType: (response.data.status === true) ? 'success' : 'error',
                        messageText: response.data.msg
                    }
                })
                dispatch({
                    type: SAVE_PROFILE
                })
                dispatch({
                    type: SHOW_MESSAGE,
                    payload: {
                        showMessage: false,
                        messageType: 'success',
                        messageText: response.data.msg, // "Profile saved successfully"
                    }
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }

        })

    }

}

export const transferDeviceProfile = (data) => {
    // console.log("transferDeviceProfile action file",data);
    return (dispatch) => {
        RestService.transferDeviceProfile(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: TRANSFER_DEVICE,
                    response: response.data,
                    payload: data.flagged_device
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}


export const transferUser = (data) => {
    // alert(data);
    return (dispatch) => {
        RestService.transferUser(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: MESSAGE_HANDLER,
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


export const transferHistory = (device_id) => {
    return (dispatch) => {
        RestService.transferHistory(device_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: TRANSFER_HISTORY,
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

export const getServicesHistory = (data) => {
    return (dispatch) => {
        RestService.getServicesHistory(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: SERVICES_HISTORY,
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

export const unflagged = (device_id) => {
    return (dispatch) => {
        RestService.unflagged(device_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: UNFLAG_DEVICE,
                    response: response.data,
                    device_id: device_id,
                    payload: {
                        device: response.data.data,
                        msg: response.data.msg,
                    }
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export const flagged = (device_id, data) => {
    return (dispatch) => {
        RestService.flagged(device_id, data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: FLAG_DEVICE,
                    response: response.data,
                    payload: {
                        device: response.data.data,
                        msg: response.data.msg,
                    }
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export const checkPass = (user, actionType) => {
    // console.log(user);
    return (dispatch) => {
        RestService.checkPass(user).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (actionType === PUSH_APPS) {
                    dispatch({
                        type: CHECKPASS,
                        payload: {
                            actionType: actionType,
                            PasswordMatch: response.data,
                        }
                    })
                } else if (actionType === WIPE_DEVICE) {
                    dispatch({
                        type: CHECKPASS,
                        payload: {
                            actionType: actionType,
                            device: user.device,
                            PasswordMatch: response.data,
                        }
                    })
                } else if (actionType === PULL_APPS) {
                    dispatch({
                        type: CHECKPASS,
                        payload: {
                            actionType: actionType,
                            PasswordMatch: response.data,
                        }
                    })
                } else if (actionType === POLICY) {
                    dispatch({
                        type: CHECKPASS,
                        payload: {
                            actionType: actionType,
                            PasswordMatch: response.data,
                        }
                    })
                } else if (actionType === CHAT_ID_SETTINGS) {
                    dispatch({
                        type: CHECKPASS,
                        payload: {
                            actionType: actionType,
                            PasswordMatch: response.data,
                        }
                    })
                } else {
                    dispatch({
                        type: INVALID_TOKEN
                    })
                }
            }
        })

    }
}

export const getDealerApps = () => {
    return (dispatch) => {
        // console.log('in return of fucntion')
        RestService.getDealerApps().then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_DEALER_APPS,
                    payload: response.data.list
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

// Get IMEI history list
export const getImeiHistory = (device_id) => {
    // console.log(device_id)
    return (dispatch) => {
        RestService.getImeiHistory(device_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_IMIE_HISTORY,
                    payload: response.data.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}


export const writeImei = (device_id, usrAccId, type, imeiNo, device) => {
    return (dispatch) => {
        RestService.writeImei(device_id, usrAccId, type, imeiNo, device).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: WRITE_IMEI,
                    payload: response.data,
                    imeiData: {
                        device_id, usrAccId, type, imeiNo
                    }
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}


export const reSyncDevice = (deviceId) => {
    return (dispatch) => {
        RestService.reSyncDevice(deviceId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: DEVICE_SYNCED,
                    payload: response.data.status
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export const clearResyncFlag = () => {
    return (dispatch) => {
        dispatch({
            type: DEVICE_SYNCED,
            payload: false
        });
    }
}

export const showPushAppsModal = (visible) => {
    return (dispatch) => {
        dispatch({
            type: SHOW_PUSH_APPS_MODAL,
            payload: visible

        })
    }
}

export const showPullAppsModal = (visible) => {
    return (dispatch) => {
        dispatch({
            type: SHOW_PULL_APPS_MODAL,
            payload: visible

        })
    }
}

export const applyPushApps = (apps, deviceId, usrAccId) => {
    checkIsArray(apps).forEach((el) => {
        el.enable = (typeof (el.enable) === Boolean || typeof (el.enable) === 'Boolean' || typeof (el.enable) === 'boolean') ? el.enable : false;
        el.guest = (typeof (el.guest) === Boolean || typeof (el.guest) === 'Boolean' || typeof (el.guest) === 'boolean') ? el.guest : false;
        el.encrypted = (typeof (el.encrypted) === Boolean || typeof (el.encrypted) === 'Boolean' || typeof (el.encrypted) === 'boolean') ? el.encrypted : false;
        delete el.apk_logo;
        delete el.apk_status;
    })
    return (dispatch) => {
        RestService.applyPushApps(apps, deviceId, usrAccId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: PUSH_APPS,
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


export const handleChecked = (value, key, apk_id) => {

    return (dispatch) => {
        dispatch({
            type: PUSH_APP_CHECKED,
            payload: {
                apk_id: apk_id,
                key: key,
                value: value
            },
        })

    }
}

export const resetPushApps = () => {

    return (dispatch) => {
        dispatch({
            type: RESET_PUSH_APPS,
        })

    }
}

export const handleCheckedAllPushApps = (value, key) => {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_ALL_PUSH_APPS,
            payload: {
                value: value,
                key: key
            }
        })
    }
}


export const applyPolicy = (deviceId, userAccId, policyId, policyName) => {
    return (dispatch) => {
        RestService.applyPolicy(deviceId, userAccId, policyId).then((response) => {
            getActivities(deviceId);
            if (RestService.checkAuth(response.data)) {

                // console.log(response.data);
                dispatch({
                    type: APPLY_POLICY,
                    payload: response.data,
                    policyId: policyId,
                    policyName: policyName
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}
export const getActivities = (device_id) => {
    // console.log('object', 'activitiers')
    return (dispatch) => {
        RestService.getActivities(device_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: GET_ACTIVITIES,
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

export const applyPullApps = (apps, deviceId, usrAccId) => {
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
        RestService.applyPullApps(apps, deviceId, usrAccId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data, 'done task')
                dispatch({
                    type: PULL_APPS,
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

// ********* Sim Module
export const simRegister = (data) => {
    // console.log('data is: ', data)
    return (dispatch) => {
        RestService.simRegister(data).then((response) => {
            // console.log('response is: ', response);
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);

                dispatch({
                    type: ADD_SIM_REGISTER,
                    response: response.data,
                    payload: data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export const simHistory = (device_id) => {
    // console.log('device_id is: ', device_id)
    return (dispatch) => {
        RestService.simHistory(device_id).then((response) => {
            // console.log('response is: ', response);
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: SIM_HISTORY,
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

export const getSims = (device_id) => {
    // console.log('data is: ', data)
    return (dispatch) => {
        RestService.getSims(device_id).then((response) => {
            // console.log('response is: ', response);
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: GET_SIMS,
                    payload: response.data
                    // payload: response.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }


        })
    }
}

export const deleteSim = (data) => {
    // console.log('data is: ', data)
    return (dispatch) => {
        RestService.deleteSim(data).then((response) => {
            // console.log('response is: ', response);
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: DELETE_SIM,
                    response: response.data,
                    payload: data,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export const handleSimUpdate = (data) => {
    // console.log('data is: ', data)
    return (dispatch) => {
        RestService.handleSimUpdate(data).then((response) => {
            // console.log('response is: ', response);
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: UPDATE_SIM,
                    response: response.data,
                    payload: data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }


        })
    }
}

export const getUnRegisterSims = (data) => {
    console.log('getUnRegisterSims data is: ', data)
    return (dispatch) => {
        dispatch({
            type: SIM_LOADING
        })

        RestService.getUnRegisterSims(data).then((response) => {
            console.log('response is: ', response);
            if (RestService.checkAuth(response.data)) {
                console.log("getUnRegisterSims", response.data);
                dispatch({
                    type: GET_UNREG_SIMS,
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

export const cancelExtendedServices = (service_date) => {
    console.log('data is: ', service_date)
    return (dispatch) => {
        RestService.cancelExtendedServices(service_date).then((response) => {
            if (RestService.checkAuth(response.data)) {
                console.log("getUnRegisterSims", response.data);
                dispatch({
                    type: CANCEL_EXTENDED_SERVICE,
                    payload: response.data
                })
                if (response.data.status && response.data.credits) {
                    dispatch({
                        type: USER_CREDITS,
                        response: response.data
                    });
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }


        })
    }
}


export const getDeviceBillingHistory = (device_id, dealer_id) => {
    return (dispatch) => {
        RestService.getDeviceBillingHistory(device_id, dealer_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_DEVICE_BILLING_HISTORY,
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

export const resetChatPin = (data) => {
    return (dispatch) => {
        RestService.resetChatPin(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: RESET_CHAT_PIN,
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

export const resetPgpLimit = (user_acc_id) => {
    return (dispatch) => {
        RestService.resetPgpLimit(user_acc_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: RESET_PGP_LIMIT,
                    payload: response.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
};


export const changeSchatPinStatus = (data) => {
    return (dispatch) => {
        RestService.changeSchatPinStatus(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: CHANGE_SCHAT_ACCOUNT_STATUS,
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





export const resetDevice = () => {
    return (dispatch) => {
        dispatch({
            type: RESET_DEVICE
        })

    }
}


// socket.on(Constants.RECV_SIM + device_id, (response) => {
//     // console.log('ack ===== RECV_SIM =========> ', response)
//     sockets.updateSimRecord(device_id, response);
// })
