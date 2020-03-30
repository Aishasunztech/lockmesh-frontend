import React, { Fragment } from 'react'
import {
    GET_DEVICE_DETAILS,
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
    SHOW_HISTORY_MODAL,
    UNLINK_DEVICE,
    CHANGE_PAGE,
    GUEST_PASSWORD,
    ENCRYPTED_PASSWORD,
    DURESS_PASSWORD,
    ADMIN_PASSWORD,
    SHOW_SAVE_PROFILE_MODAL,
    // HANDLE_PROFILE_INPUT,
    RESET_CHAT_PIN,
    CHANGE_SCHAT_ACCOUNT_STATUS,
    POLICY,
    PROFILE,
    ACTIVATE_DEVICE2,
    SUSPEND_DEVICE2,
    HANDLE_CHECK_APP,
    HANDLE_CHECK_ALL,
    GET_USER_ACC_ID,
    GET_POLICIES,
    FLAG_DEVICE,
    UNFLAG_DEVICE,
    WIPE_DEVICE,
    CHAT_ID_SETTINGS,
    CHECKPASS,
    GET_DEALER_APPS,
    HANDLE_CHECK_EXTENSION,
    HANDLE_CHECK_ALL_EXTENSION,
    UNDO_EXTENSIONS,
    REDO_EXTENSIONS,
    HANDLE_CHECK_CONTROL,
    UNDO_CONTROLS,
    REDO_CONTROLS,
    GET_APPS_PERMISSIONS,
    HANDLE_CHECK_MAIN_SETTINGS,
    GET_IMIE_HISTORY,
    SHOW_PUSH_APPS_MODAL,
    SHOW_PULL_APPS_MODAL,
    PULL_APPS,
    WRITE_IMEI,
    GET_ACTIVITIES,
    HIDE_POLICY_CONFIRM,
    APPLY_POLICY,
    CLEAR_APPLICATIONS,
    SAVE_PROFILE,
    EDIT_DEVICE,
    CLEAR_STATE,
    DEVICE_SYNCED,
    ADD_SIM_REGISTER,
    GET_SIMS,
    UPDATE_SIM,
    RECEIVE_SIM_DATA,
    DELETE_SIM,
    SIM_HISTORY,
    MESSAGE_HANDLER,
    TRANSFER_HISTORY,
    SINGLE_APP_PULLED,
    SINGLE_APP_PUSHED,
    PASSWORD_CHANGED,
    PUSH_APP_CHECKED,
    RESET_PUSH_APPS,
    GET_UNREG_SIMS,
    HANDLE_CHECK_ALL_PUSH_APPS,
    HANDLE_CHECK_SECURE_SETTINGS,
    RESET_DEVICE,
    SIM_LOADING,
    TRANSFER_DEVICE,
    SERVICES_DETAIL,
    SERVICES_HISTORY,
    CANCEL_EXTENDED_SERVICE,
    GET_DEVICE_LIST,
    GET_DEVICE_BILLING_HISTORY,
    DEVICE_NOT_FOUND,
    ENABLE_PWD_CONFIRM,
    RESET_PGP_LIMIT
} from "../../constants/ActionTypes";

import {
    NOT_AVAILABLE, MAIN_MENU, WARNNING, PROCEED_WITH_WIPING_THE_DEVICE, Main_SETTINGS, SECURE_SETTING, SAVE_PROFILE_TEXT, APPS, SYSTEM_CONTROLS
} from '../../constants/Constants';

import { message, Modal, Alert, Icon } from 'antd';
import { ACK_UNINSTALLED_APPS, ACK_INSTALLED_APPS, ACK_SETTING_APPLIED, SEND_ONLINE_OFFLINE_STATUS } from '../../constants/SocketConstants';
import { checkIsArray } from '../../routes/utils/commonUtils';
// import { Button_Cancel } from '../../constants/ButtonConstants';
// import { convertToLang } from '../../routes/utils/commonUtils';
// import { WIPE_DEVICE_DESCRIPTION } from '../../constants/DeviceConstants';

const warning = Modal.warning;
const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error


const initialState = {
    isLoading: false,
    forceUpdate: 0,
    messageText: '',
    messageType: '',
    showMessage: false,

    pageName: MAIN_MENU,
    status: '',
    appPermissions: [],

    isSaveProfileBtn: false,
    syncStatus: false,
    device: {},
    allExtensions: [],

    wipeDevice: {},
    wipeDeviceID: '',
    wipeDevieStatus: '',

    checked_app_id: {},
    app_list: [],
    undoApps: [],
    redoApps: [],

    guestAll: false,
    encryptedAll: false,
    enableAll: false,

    applyBtn: false,
    undoBtn: false,
    redoBtn: false,
    clearBtn: false,

    profiles: [],
    policies: [],

    historyModal: false,
    device_histories: [],

    saveProfileModal: false,
    historyType: "history",
    saveProfileType: '',
    profileName: '',
    policyName: '',

    pwdType: '',

    isGuestPwd: false,
    isAdminPwd: false,
    isEncryptedPwd: false,
    isDuressPwd: false,

    guestPwd: '',
    guestCPwd: '',

    adminPwd: '',
    adminCPwd: '',

    encryptedPwd: '',
    encryptedCPwd: '',

    duressPwd: '',
    duressCPwd: '',

    apk_list: [],
    apk_list_dump: [],

    extensions: [],
    secureSettingsMain: [],

    undoExtensions: [],
    redoExtensions: [],
    controls: {},
    undoControls: [],
    redoControls: [],
    activities: [],

    guestAllExt: false,
    encryptedAllExt: false,

    imei_list: [],
    pushAppsModal: false,
    pullAppsModal: false,
    applyPolicyConfirm: false,
    device_found: true,
    noOfApp_push_pull: 0,
    noOfApp_pushed_pulled: 0,
    is_push_apps: 0,
    is_policy_process: 0,
    reSync: false,

    // sim module
    simloading: false,
    sim_list: [],
    guestSimAll: 1,
    encryptSimAll: 1,
    unrGuest: 0,
    unrEncrypt: 1,
    simUpdated: false,
    simDeleted: false,
    simHistoryList: [],
    unRegSims: [],

    // Transfer
    transferHistoryList: [],
    getHistory: '',
    guestAllPushApps: false,
    enableAllPushApp: false,
    encryptedAllPushApps: false,
    servicesHistoryList: [],
    device_list: [],
    device_billing_history: [],
    chatIdSettingsEnable: false
};
let pwdObject = { "admin_password": null, "guest_password": null, "encrypted_password": null, "duress_password": null }


export default (state = initialState, action) => {

    switch (action.type) {

        case ENABLE_PWD_CONFIRM: {
            return {
                ...state,
                chatIdSettingsEnable: false
            }
        }
        case CHANGE_PAGE: {

            let checkApplyBtn = handleApplyBtn(action.payload, state.undoControls, state.redoControls, state.undoExtensions, state.redoExtensions, state.undoApps, state.redoApps);
            // console.log("checkApplyBtn ", checkApplyBtn)

            return {
                ...state,
                pageName: action.payload,
                ...checkApplyBtn
            }
        }
        case CLEAR_STATE: {
            // console.log("CLEAR STATE FUNCTION");
            return {
                ...state,
                is_push_apps: 0,
                is_policy_process: 0,
                noOfApp_push_pull: 0,
                noOfApp_pushed_pulled: 0,
            }
        }
        case DEVICE_NOT_FOUND: {
            // console.log("CLEAR STATE FUNCTION");
            return {
                ...state,
                device_found: false,
            }
        }
        case GET_DEVICE_DETAILS: {
            let device = action.payload;
            // console.log(device);
            if (device) {
                if (device.account_status === "suspended" || device.status === "expired" || device.unlink_status === 1) {
                    let status = null;

                    if (device.status === "expired") {
                        status = "Expired"
                    } else if (device.account_status === "suspended") {
                        status = "Suspended";
                    } else if (device.unlink_status === 1) {
                        status = "Unlinked"
                    }

                    return {
                        ...state,
                        device: action.payload,
                        applyBtn: false,
                        undoBtn: false,
                        redoBtn: false,
                        clearBtn: false,
                        pageName: NOT_AVAILABLE,
                        status: status,
                        device_found: true,
                    }
                } else {
                    return {
                        ...state,
                        device: action.payload,
                        device_found: true,
                    }
                }
            } else {
                return { ...state, device_found: false }
            }

        }
        case GET_DEVICE_LIST: {
            return {
                ...state,
                device_list: action.payload
            }

        }


        case PUSH_APP_CHECKED: {
            let key = action.payload.key;
            let value = action.payload.value;
            let apk_id = action.payload.apk_id

            let apklist = state.apk_list;
            let index = apklist.findIndex(apk => apk.apk_id == apk_id);
            if (index > -1) {
                apklist[index][key] = value
            }
            let checked = getCheckedAllPushApp(apklist);
            // console.log(checked, 'checked')
            return {
                ...state,
                apk_list: JSON.parse(JSON.stringify(apklist)),
                ...checked
            }
        }

        case HANDLE_CHECK_ALL_PUSH_APPS: {
            let key = action.payload.key;
            let value = action.payload.value;
            let apklist = state.apk_list;
            // console.log(key, 'key', 'value', value, 'ajku', apklist)
            for (let apk of apklist) {
                apk[key] = value
                // console.log(apk)
            }
            state[key + 'AllPushApps'] = value;

            return {
                ...state,
                apk_list: JSON.parse(JSON.stringify(apklist)),
                guestAllPushApps: state.guestAllPushApps,
                enableAllPushApps: state.enableAllPushApps,
                encryptedAllPushApps: state.encryptedAllPushApps,
            }
        }

        case SUSPEND_DEVICE2: {
            // console.log('check suspended data ', action.response.data);
            if (action.response.status) {
                // console.log(state.device, 'device is the', action.response.data)
                state.device = action.response.data;
                let date = getCurrentDate();
                state.activities.push({
                    action_name: 'SUSPENDED',
                    created_at: date
                })
                // state.device.account_status = 'suspended';

                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });

            }
            // let device = state.device;
            return {
                ...state,
                isloading: false,
                device: state.device,
                activities: state.activities,
                pageName: MAIN_MENU
            }

        }

        case FLAG_DEVICE: {
            // console.log(state.device, 'def devbice is ', action.payload.device)
            if (action.response.status) {

                state.device = action.payload.device;
                state.pageName = NOT_AVAILABLE;
                state.status = 'Suspended';
                state.activities.push({
                    action_name: 'FLAGED',
                    created_at: getCurrentDate()
                })
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });

            }
            return {
                ...state,
                device: state.device,
                activities: state.activities,
                isloading: false,
            }
        }

        case UNFLAG_DEVICE: {
            // console.log(action.payload.device, 'unflage device is the ');
            if (action.response.status) {

                state.device = action.payload.device;
                state.activities.push({
                    action_name: 'UNFLAGED',
                    created_at: getCurrentDate()
                })


                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });

            }
            // console.log('action done ', state.device)
            return {
                ...state,
                device: state.device,
                activities: state.activities,
                isloading: false,
            }
        }


        case RESET_PUSH_APPS: {
            return {
                ...state,
                apk_list: JSON.parse(JSON.stringify(state.apk_list_dump)),
                guestAllPushApps: false,
                enableAllPushApps: false,
                encryptedAllPushApps: false
            }
        }

        case WIPE_DEVICE: {
            // console.log(action.response.msg);
            if (action.response.status) {
                if (action.response.online) {
                    success({
                        title: action.response.msg,
                    });
                } else {
                    warning({
                        title: action.response.msg, //  'Warning Device Offline',
                        content: action.response.content // "Wipe command sent to device. Action will be performed when device is back online", // 'Apps pushed to device. Action will be performed when device is back online',
                    });
                }
            } else {
                error({
                    title: action.response.msg,
                });
            }
            // console.log('action done ', state.device)
            return {
                ...state,
                isloading: false,
            }
        }
        case GET_DEVICE_APPS: {

            if (state.undoApps.length === 0) {
                state.undoApps.push(JSON.parse(JSON.stringify(action.payload.app_list)));
            }

            if (state.undoExtensions.length === 0) {
                state.undoExtensions.push(JSON.parse(JSON.stringify(action.payload.extensions)));
            }

            if (state.undoControls.length === 0) {
                state.undoControls.push(JSON.parse(JSON.stringify(action.payload.controls)));
            }

            let applications = action.payload.app_list;
            let check = handleCheckedAll(applications);

            // console.log("GET_DEVICE_APPS ", action.extensions);
            let checkExt = {};
            if (action.payload.extensions.length) {
                checkExt = handleCheckedAllExts(action.payload.extensions);
            }

            return {
                ...state,
                app_list: action.payload.app_list,
                extensions: action.payload.extensions,
                controls: action.payload.controls,
                // secureSettingsMain: action.controls.settings,
                isAdminPwd: false,
                isDuressPwd: false,
                isEncryptedPwd: false,
                isGuestPwd: false,
                applyBtn: false,
                ...check,
                ...checkExt
            }
        }

        case EDIT_DEVICE: {
            if (action.response.status) {
                if (action.response.data.length) {
                    state.device = action.response.data[0];
                }

                return {
                    ...state,
                    //   device: state.device
                }


            }
        }


        case GET_PROFILES: {
            // console.log(action.payload, 'profils are')
            return {
                ...state,
                isloading: true,
                profiles: action.payload
            }
        }

        case GET_POLICIES: {
            return {
                ...state,
                isloading: true,
                policies: action.payload
            }
        }

        case GET_ACTIVITIES: {
            // console.log('action to palylad activities', action.payload.data)
            return {
                ...state,
                activities: action.payload.data
            }
        }

        case GET_USER_ACC_ID: {

            return {
                ...state,
                isloading: true,
                user_acc_id: action.response.user_acount_id
            }
        }
        case GET_DEVICE_HISTORIES: {

            // console.log(GET_PROFILES);
            // console.log({
            //     ...state,
            //     isloading: true,
            //     device_histories: action.payload
            // });
            return {
                ...state,
                isloading: true,
                device_histories: action.payload
            }
        }
        case PUSH_APPS: {
            let noOfApps = 0
            if (action.payload.status) {
                if (action.payload.online) {
                    success({
                        title: action.payload.msg, // "Apps are Being pushed"
                    });
                } else {
                    // message.warning(<Fragment><span>Warning Device Offline</span> <div>Apps pushed to device. </div> <div>Action will be performed when device is back online</div></Fragment>)
                    warning({
                        title: action.payload.msg, //  'Warning Device Offline',
                        content: action.payload.content // "Apps pushed to device. Action will be performed when device is back online", // 'Apps pushed to device. Action will be performed when device is back online',
                    });
                }
                noOfApps = action.payload.noOfApps
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                noOfApp_push_pull: noOfApps
            }
        }
        case APPLY_POLICY: {
            if (action.payload.status) {
                // console.log(action.policyId, 'policy id', action.policyName, 'policyName', state.activities);
                let date = getCurrentDate();
                state.activities.push({
                    action_name: 'POLICY APPLIED',
                    created_at: date,
                    data: {
                        policy_name: action.policyName,
                        policy_id: action.policyId
                    }
                })
                if (action.payload.online) {
                    success({
                        title: action.payload.msg, // "Policy is Being applied",
                    });

                } else {
                    // message.warning(<Fragment><span>Warning Device Offline</span> <div>Apps pushed to device. </div> <div>Action will be performed when device is back online</div></Fragment>)
                    warning({
                        title: action.payload.msg, // 'Warning Device Offline',
                        content: action.payload.content // 'Policy Applied to device. Action will be performed when device is back online',
                    });
                }
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            // console.log(state.activities, 'new activities')
            return {
                ...state,
                is_policy_process: 1,
                applyPolicyConfirm: false,
                activities: state.activities
            }
        }

        case LOAD_PROFILE: {
            // console.log(LOAD_PROFILE);
            state.undoApps.push(action.payload);
            let check = handleCheckedAll(action.payload);
            return {
                ...state,
                app_list: action.payload,
                ...check
            }
        }
        case SETTINGS_APPLIED: {

            if (action.payload.status) {
                if (action.payload.online) {
                    success({
                        title: action.payload.msg,
                    });

                } else {
                    // message.warning(<Fragment><span>Warning Device Offline</span> <div>Apps pushed to device. </div> <div>Action will be performed when device is back online</div></Fragment>)
                    warning({
                        title: 'Warning Device Offline',
                        content: action.payload.msg,
                    });
                }
            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                undoApps: [],
                redoApps: [],
                undoControls: [],
                redoControls: [],
                undoExtensions: [],
                redoExtensions: [],
                pageName: MAIN_MENU,
                showMessage: false,
                applyBtn: false,
                undoBtn: false,
                redoBtn: false,
                clearBtn: false
            }
        }
        case START_LOADING: {
            return {
                ...state,
                isLoading: true
            }
        }

        case SHOW_HISTORY_MODAL: {
            // console.log(SHOW_HISTORY_MODAL);
            // console.log({
            //     ...state,SHOW_HISTORY_MODAL
            //     historyType: action.payload.ProfileType,
            //     historyModal: action.payload.visible
            // })
            // console.log(action.payload.profileType, action.payload.visible, 'ok')
            return {
                ...state,
                historyType: action.payload.profileType,
                historyModal: action.payload.visible
            }
        }

        case END_LOADING: {

            return {
                ...state,
                isLoading: false,
                simloading: false
            }
        }

        case RESET_CHAT_PIN: {

            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                });
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
            }
        }

        case RESET_PGP_LIMIT: {

            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                });
                state.device.pgp_remaining_limit = 10
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            // console.log(state.device.pgp_remaining_limit);
            return {
                ...state,
                device: JSON.parse(JSON.stringify(state.device))
            }
        }

        case CHANGE_SCHAT_ACCOUNT_STATUS: {

            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                });
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
            }
        }


        // Common Reducer: to display the message from server
        case MESSAGE_HANDLER: {
            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                })
                return {
                    ...state,
                    getHistory: new Date()
                }
            } else {
                error({
                    title: action.payload.msg,
                })
                return {
                    ...state,
                }
            }

        }

        case TRANSFER_HISTORY: {
            // if (action.payload.status) {
            return {
                ...state,
                transferHistoryList: action.payload.data,
                // getHistory: new Date()
            }
            // }
        }

        case SERVICES_HISTORY: {
            console.log("action.payload.data at reducer for sevices:: ", action.payload.data);
            let data = state.servicesHistoryList;

            if (action.payload.status) {
                data = action.payload.data
            }
            return {
                ...state,
                servicesHistoryList: data
            }
        }

        case TRANSFER_DEVICE: {

            console.log(action.payload, 'check devices TRANSFER_DEVICE ', state.device)
            if (action.response.status) {

                state.device.finalStatus = 'Transfered';
                state.device.transfer_status = 1;
            }
            // console.log('unlink called');
            return {
                ...state,
                isLoading: false,
                device: state.device,
                getHistory: new Date()
            }
        }

        case SHOW_MESSAGE: {

            if (action.payload.showMessage) {
                if (action.payload.messageType === 'success') {
                    success({
                        title: action.payload.messageText,
                    })
                } else {
                    error({
                        title: action.payload.messageText,
                    })
                }
            }

            return {
                ...state,
            }
        }

        case ACTIVATE_DEVICE2: {

            //  console.log(state.device, 'active device done', action.response.device);
            if (action.response.status) {

                state.device = action.response.data;
                state.status = '';
                state.pageName = MAIN_MENU;
                let date = getCurrentDate();
                state.activities.push({
                    action_name: 'ACTIVE',
                    created_at: date
                })
                success({
                    title: action.response.msg,
                });

            } else {
                error({
                    title: action.response.msg,
                });

            }

            // console.log('action done ', state.device)
            return {
                ...state,
                device: state.device,
                activities: state.activities,
                isloading: true
            }
        }

        // case UNLINK_DEVICE: {
        //     let devices = state.devices;

        //     if (action.response.status) {
        //         success({
        //             title: action.response.msg,
        //         });
        //         if (action.isTransferred) {
        //             devices = state.devices.filter((obj => obj.device_id !== action.payload.device_id));
        //         }
        //     } else {
        //         error({
        //             title: action.response.msg,
        //         });
        //     }
        //     // console.log('unlink called');
        //     return {
        //         ...state,
        //         isLoading: false,
        //         devices
        //     }
        // }
        case GUEST_PASSWORD: {
            return {
                ...state,
                guestPwd: action.payload.pwd,
                guestCPwd: action.payload.confirm,
                isGuestPwd: true,
                applyBtn: true
            }
        }

        case ENCRYPTED_PASSWORD: {
            return {
                ...state,
                encryptedPwd: action.payload.pwd,
                encryptedCPwd: action.payload.confirm,
                isEncryptedPwd: true,
                applyBtn: true
            }
        }

        case DURESS_PASSWORD: {
            return {
                ...state,
                duressPwd: action.payload.pwd,
                duressCPwd: action.payload.confirm,
                isDuressPwd: true,
                applyBtn: true
            }
        }

        case ADMIN_PASSWORD: {
            return {
                ...state,
                adminPwd: action.payload.pwd,
                adminCPwd: action.payload.confirm,
                isAdminPwd: true,
                applyBtn: true
            }
        }

        case CHECKPASS: {
            if (action.payload.PasswordMatch.password_matched) {
                // alert(action.payload.actionType);

                if (action.payload.actionType === PUSH_APPS) {
                    return {
                        ...state,
                        pushAppsModal: true
                    }
                } else if (action.payload.actionType === PULL_APPS) {
                    return {
                        ...state,
                        pullAppsModal: true
                    }
                } else if (action.payload.actionType === WIPE_DEVICE) {
                    return {
                        ...state,
                        // wipeDevice: action.payload.device,
                        // msg: "Do you really want to Wipe the device " + action.payload.device.device_id + "?",
                        // wipeDeviceID: action.payload.device.device_id,
                        wipeDevieStatus: new Date()
                    }
                    // showConfirm1(action.payload.device, "Do you really want to Wipe the device " + action.payload.device.device_id + "?")
                } else if (action.payload.actionType === CHAT_ID_SETTINGS) {
                    return {
                        ...state,
                        chatIdSettingsEnable: true
                    }
                }
                else if (action.payload.actionType === POLICY) {
                    return {
                        ...state,
                        historyModal: false,
                        applyPolicyConfirm: true,
                        is_policy_process: 0
                    }
                }
            }
            else {
                error({
                    title: action.payload.PasswordMatch.msg, // "Password Did not Match. Please Try again.",
                });
            }

        }

        case POLICY: {
            return {
                ...state,
                policyName: action.payload
            }
        }

        case PROFILE: {
            return {
                ...state,
                profileName: action.payload
            }
        }

        case SAVE_PROFILE: {
            // console.log(action.response, 'response from save profle');
            if (action.response.status) {
                state.profiles.push(action.response.data)
            }
            // console.log('new profiles are', state.profiles)
            return {
                ...state,
                profiles: state.profiles,
                isSaveProfileBtn: false,
            }
        }

        case SHOW_SAVE_PROFILE_MODAL: {
            return {
                ...state,
                saveProfileModal: action.payload.visible,
                saveProfileType: action.payload.profileType
            }
        }

        case PULL_APPS: {
            let noOfApps = 0
            if (action.payload.status) {
                if (action.payload.online) {
                    success({
                        title: action.payload.msg, // "Apps are Being pulled",
                    });
                } else {
                    warning({
                        title: action.payload.msg, //  'Warning Device Offline',
                        content: action.payload.content // 'Apps pulled from device. Action will be performed when device is back online',
                    });
                }
                noOfApps = action.payload.noOfApps
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                noOfApp_push_pull: noOfApps
            }
        }


        case GET_APPS_PERMISSIONS: {
            // console.log('data permissions', action.payload)
            return {
                ...state,
                appPermissions: action.payload.appPermissions,
                allExtensions: action.payload.extensions

            }
        }

        case HANDLE_CHECK_CONTROL: {
            // copy of System Permission state #removed JSON.parse(JSON.stringify())
            let controls = JSON.parse(JSON.stringify(state.controls));
            // let controls = state.controls.controls;
            // console.log("CHANGE CONTROLS", controls, action.payload.key);
            // console.log(action.payload.key);
            // console.log(controls.controls);
            let index = controls.findIndex((control) => control.setting_name === action.payload.key);
            if (index > -1) {
                // console.log("permission index:", index);

                controls[index].setting_status = action.payload.value;
                controls[index].isChanged = true;
                console.log(controls[index]);
                // push into stack
                state.undoControls.push(JSON.parse(JSON.stringify(controls)));
                state.controls = JSON.parse(JSON.stringify(controls));
            }

            return {
                ...state,
                controls: state.controls,
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
                isSaveProfileBtn: true
            }
        }

        case HANDLE_CHECK_MAIN_SETTINGS: {

            let changedMainSetting = JSON.parse(JSON.stringify(state.app_list));

            let objIndex = changedMainSetting.findIndex(item => item.uniqueName === action.payload.main);
            // console.log(action.payload.main, ' obj index is', objIndex)
            if (objIndex > -1) {
                changedMainSetting[objIndex][action.payload.key] = action.payload.value;
                changedMainSetting[objIndex]["isChanged"] = true;
                // let mainSetting = changedMainSetting.find(item => item.uniqueName === action.payload.main);
                // console.log("mainSetting:", mainSetting);
                // state.undoExtensions.push(mainSetting);
            }
            state.app_list = JSON.parse(JSON.stringify(changedMainSetting));
            // state.undoControls.push(JSON.parse(JSON.stringify(changedMainSetting)));
            // console.log('reduver aongds', state.controls);
            return {
                ...state,
                app_list: changedMainSetting,
                applyBtn: true,
                undoBtn: true,
                isSaveProfileBtn: true
            }

        }
        case HANDLE_CHECK_SECURE_SETTINGS: {

            let changedMainSetting = JSON.parse(JSON.stringify(state.app_list));

            let objIndex = changedMainSetting.findIndex(item => item.uniqueName === action.payload.main);
            // console.log(action.payload.main, ' obj index is', objIndex)
            if (objIndex > -1) {
                changedMainSetting[objIndex][action.payload.key] = action.payload.value;
                changedMainSetting[objIndex]["isChanged"] = true;
                // console.log(changedSettings[objIndex], 'app is the ', changedSettings[objIndex][action.payload.key])
            }
            state.app_list = JSON.parse(JSON.stringify(changedMainSetting));
            // state.undoControls.push(JSON.parse(JSON.stringify(changedMainSetting)));
            // console.log('reduver aongds', state.controls);

            return {
                ...state,
                app_list: changedMainSetting,
                applyBtn: true,
                undoBtn: true,
                isSaveProfileBtn: true
            }

        }


        case UNDO_CONTROLS: {

            if (state.undoControls.length > 1) {

                let controls = state.undoControls[state.undoControls.length - 1];
                state.undoControls.pop();

                state.redoControls.push(JSON.parse(JSON.stringify(controls)));

                if (state.undoControls.length === 1) {
                    return {
                        ...state,
                        undoBtn: false,
                        applyBtn: false,
                        redoBtn: true,
                        controls: JSON.parse(JSON.stringify(state.undoControls[state.undoControls.length - 1]))
                    };
                } else {
                    return {
                        ...state,
                        redoBtn: true,
                        controls: state.undoControls[state.undoControls.length - 1]
                    };
                }
            } else {
                return {
                    ...state,
                    undoBtn: false,
                    applyBtn: false,
                };
            }
        }

        case REDO_CONTROLS: {
            if (state.redoControls.length > 0) {

                let controls = state.redoControls[state.redoControls.length - 1];
                state.redoControls.pop();
                state.undoControls.push(JSON.parse(JSON.stringify(controls)));

                if (state.redoControls.length === 0) {
                    return {
                        ...state,
                        controls: controls,
                        undoBtn: true,
                        applyBtn: true,
                        redoBtn: false,
                        clearBtn: true
                    };
                } else {
                    return {
                        ...state,
                        controls: controls,
                        undoBtn: true,
                        applyBtn: true,
                        clearBtn: true
                    };

                }
            } else {
                return {
                    ...state,
                    redoBtn: false
                };
            }
        }

        case HANDLE_CHECK_EXTENSION: {

            let changedExtensions = JSON.parse(JSON.stringify(state.extensions));
            // console.log("changedExtensions: ", changedExtensions, action.payload);

            checkIsArray(changedExtensions).forEach(extension => {
                if (extension.app_id === action.payload.app_id) {
                    // console.log(extension, extension[action.payload.key]);
                    extension[action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                    extension.isChanged = true;
                }

                // if (action.payload.app_id === '000') {
                //     extension["isChanged"] = true;
                //     extension[action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                // } else {

                //     let objIndex = extension.findIndex((obj => obj.app_id === action.payload.app_id));
                //     if (objIndex > -1) {
                //         extension.subExtension[objIndex][action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                //         extension.subExtension[objIndex].isChanged = true;
                //     }
                // }
            });

            // console.log("after change: ", changedExtensions);
            let extensions = JSON.parse(JSON.stringify(changedExtensions));
            // let extensions = state.extensions;
            state.undoExtensions.push(extensions);
            // let check = handleCheckedAllExts(extensions);
            let check = handleCheckedAllExts(extensions);

            return {
                ...state,
                extensions: extensions,
                checked_app_id: {
                    id: action.payload.app_id,
                    key: action.payload.key,
                    value: action.payload.value
                },
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
                isSaveProfileBtn: true,
                ...check
            }
        }

        case HANDLE_CHECK_ALL_EXTENSION: {
            let changedExtensions = JSON.parse(JSON.stringify(state.extensions));
            state[action.payload.keyAll] = action.payload.value;

            checkIsArray(changedExtensions).forEach(extension => {
                extension[action.payload.key] = action.payload.value === true ? 1 : 0;
                extension.isChanged = true;

            });

            state.undoExtensions.push(JSON.parse(JSON.stringify(changedExtensions)));

            return {
                ...state,
                extensions: changedExtensions,
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
                isSaveProfileBtn: true,
                // ...check
            }
        }

        case UNDO_EXTENSIONS: {
            console.log("length before: ", state.undoExtensions.length)
            if (state.undoExtensions.length > 1) {

                let exten = state.undoExtensions[state.undoExtensions.length - 1];
                state.undoExtensions.pop();

                state.redoExtensions.push(JSON.parse(JSON.stringify(exten)));

                let extensions = JSON.parse(JSON.stringify(state.undoExtensions[state.undoExtensions.length - 1]));
                // console.log("UNDO_EXTENSIONS ", extensions);
                console.log("length:", state.undoExtensions.length);
                let check = handleCheckedAllExts(extensions);

                if (state.undoExtensions.length === 1) {
                    return {
                        ...state,
                        undoBtn: false,
                        applyBtn: false,
                        redoBtn: true,
                        extensions: extensions,
                        ...check
                    };
                } else {
                    return {
                        ...state,
                        redoBtn: true,
                        extensions: extensions,
                        ...check
                    };
                }
            } else {
                return {
                    ...state,
                    undoBtn: false,
                    applyBtn: false,
                };
            }
        }

        case REDO_EXTENSIONS: {
            if (state.redoExtensions.length > 0) {

                let extensions = state.redoExtensions[state.redoExtensions.length - 1];
                // console.log("REDO_EXTENSIONS ", extensions);
                let check = handleCheckedAllExts(extensions);
                // console.log('if exist ex', extensions)
                state.redoExtensions.pop();
                state.undoExtensions.push(JSON.parse(JSON.stringify(extensions)));

                if (state.redoExtensions.length === 0) {
                    return {
                        ...state,
                        extensions: extensions,
                        undoBtn: true,
                        applyBtn: true,
                        redoBtn: false,
                        clearBtn: true,
                        ...check
                    };
                } else {
                    return {
                        ...state,
                        extensions: extensions,
                        undoBtn: true,
                        applyBtn: true,
                        clearBtn: true,
                        ...check
                    };

                }
            } else {
                return {
                    ...state,
                    redoBtn: false
                };
            }
        }
        case HANDLE_CHECK_APP: {
            let changedApps = JSON.parse(JSON.stringify(state.app_list));
            checkIsArray(changedApps).forEach(app => {
                if (app.app_id === action.payload.app_id) {
                    app.isChanged = true;
                    app[action.payload.key] = action.payload.value;
                }
            });

            state.app_list = JSON.parse(JSON.stringify(changedApps));
            let applications = state.app_list;
            state.undoApps.push(JSON.parse(JSON.stringify(changedApps)));
            let check = handleCheckedAll(applications);
            return {
                ...state,
                // app_list: changedApps,
                checked_app_id: {
                    id: action.payload.app_id,
                    key: action.payload.key,
                    value: action.payload.value
                },
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
                isSaveProfileBtn: true,
                ...check
            }
        }

        case HANDLE_CHECK_ALL: {
            let applications = JSON.parse(JSON.stringify(state.app_list));
            checkIsArray(applications).forEach(app => {
                if (!app.extension && app.visible) {
                    // console.log(app[action.payload.key], 'kkkkkk', 'guest')
                    app.isChanged = true;
                    if (app.default_app !== 1) {
                        app[action.payload.key] = action.payload.value;
                    } else if (app.default_app === 1 && action.payload.key === 'guest') {
                        app[action.payload.key] = action.payload.value;
                    }
                }
            })

            state[action.payload.keyAll] = action.payload.value;
            state.undoApps.push(JSON.parse(JSON.stringify(applications)));

            return {
                ...state,
                app_list: applications,
                checked_app_id: {
                    key: action.payload.key,
                    value: action.payload.value,
                },
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
                isSaveProfileBtn: true
            }
        }

        case UNDO_APPS: {

            if (state.undoApps.length > 1) {

                let apps = state.undoApps[state.undoApps.length - 1];
                state.undoApps.pop();

                state.redoApps.push(JSON.parse(JSON.stringify(apps)));

                if (state.undoApps.length === 1) {
                    return {
                        ...state,
                        undoBtn: false,
                        applyBtn: false,
                        redoBtn: true,
                        clearBtn: true,
                        app_list: JSON.parse(JSON.stringify(state.undoApps[state.undoApps.length - 1]))
                    };
                } else {
                    return {
                        ...state,
                        redoBtn: true,
                        applyBtn: true,
                        clearBtn: true,
                        app_list: state.undoApps[state.undoApps.length - 1]
                    };
                }
            } else {
                return {
                    ...state,
                    undoBtn: false,
                    applyBtn: false,
                };
            }
        }

        case REDO_APPS: {
            if (state.redoApps.length > 0) {

                let apps = state.redoApps[state.redoApps.length - 1];
                state.redoApps.pop();
                state.undoApps.push(JSON.parse(JSON.stringify(apps)));

                if (state.redoApps.length === 0) {
                    return {
                        ...state,
                        app_list: apps,
                        undoBtn: true,
                        applyBtn: true,
                        redoBtn: false,
                        clearBtn: true

                    };
                } else {
                    return {
                        ...state,
                        app_list: apps,
                        undoBtn: true,
                        applyBtn: true,
                    };

                }
            } else {
                return {
                    ...state,
                    redoBtn: false
                };
            }
        }

        case CLEAR_APPLICATIONS: {
            let extensions = state.undoExtensions.length ? state.undoExtensions[0] : [];
            let controls = state.undoControls.length ? state.undoControls[0] : [];
            let apps = state.undoApps.length ? state.undoApps[0] : [];
            state.undoApps.length = 1;
            state.undoControls.length = 1;
            state.undoExtensions.length = 1;
            return {
                ...state,
                extensions: extensions,
                controls: controls,
                app_list: apps,
                undoApps: state.undoApps,
                undoControls: state.undoControls,
                undoExtensions: state.undoExtensions,
                redoApps: [],
                redoControls: [],
                redoExtensions: [],
                clearBtn: false,
                redoBtn: false,
                undoBtn: false,
                applyBtn: false,
                pageName: MAIN_MENU
            }
        }

        case GET_DEALER_APPS: {

            return {
                ...state,
                apk_list: action.payload,
                apk_list_dump: JSON.parse(JSON.stringify(action.payload))
            }
        }

        case SHOW_PUSH_APPS_MODAL: {
            return {
                ...state,
                pushAppsModal: action.payload
            }
        }

        case SHOW_PULL_APPS_MODAL: {
            return {
                ...state,
                pullAppsModal: action.payload
            }
        }

        case GET_IMIE_HISTORY: {
            // console.log(action.payload);
            return {
                ...state,
                imei_list: action.payload,
            }
        }
        case HIDE_POLICY_CONFIRM: {
            return {
                ...state,
                applyPolicyConfirm: false,
            }
        }

        case ADD_SIM_REGISTER: {
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });

                // console.log('ADD_SIM_REGISTER ', action.payload);
                // console.log("state.sim_list ", state.sim_list);
                let index = state.sim_list.findIndex(e => e.iccid === action.payload.iccid);

                if (index === -1) {
                    state.sim_list.push(action.payload);
                }

                let unRegSims = checkIsArray(state.unRegSims).filter(e => e.iccid !== action.payload.iccid);
                let getCheckAllValues = checkAllSims(state.sim_list);

                return {
                    ...state,
                    sim_list: state.sim_list,
                    unRegSims: unRegSims,
                    ...getCheckAllValues,
                    // simUpdated: new Date(),
                    // sim_list: [...state.sim_list, action.payload]
                }
            } else {
                error({
                    title: action.response.msg,
                });
                return {
                    ...state
                }
            }
        }

        case SIM_HISTORY: {

            return {
                ...state,
                simHistoryList: action.payload.data
            }
        }

        case GET_SIMS: {
            // console.log('reducer call', action.payload);
            let unrSetting = action.payload.unRegisterSetting;

            let sims = action.payload.data;
            let getCheckAllValues = checkAllSims(sims);

            // let checkunrEncrypt = sims.filter(e => e.unrEncrypt != true);
            // let checkunrGuest = sims.filter(e => e.unrGuest != true);

            // let unrGuest;
            // let unrEncrypt;
            // if (checkunrGuest.length > 0) unrGuest = 0; else unrGuest = 1;
            // if (checkunrEncrypt.length > 0) unrEncrypt = 0; else unrEncrypt = 1;


            return {
                ...state,
                sim_list: sims,
                // guestSimAll,
                // encryptSimAll,
                ...getCheckAllValues,
                unrGuest: unrSetting.unRegisterGuest,
                unrEncrypt: unrSetting.unRegisterEncrypt,
            }
        }
        case RECEIVE_SIM_DATA: {
            if (action.payload.unRegSims.length > 0) {
                // console.log('unRegSims red')
                return {
                    ...state,
                    simloading: false,
                    simUpdated: new Date(),
                    unRegSims: action.payload.unRegSims
                }
            } else {
                // console.log('not unRegSims red')
                return {
                    ...state,
                    simUpdated: new Date(),
                    simloading: false,
                    unRegSims: []
                }
            }
        }

        case DELETE_SIM: {
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });

                let stateSims = state.sim_list;
                let getCheckAllValues = checkAllSims(stateSims);
                let sims = checkIsArray(stateSims).filter(e => e.iccid !== action.payload.iccid);
                action.payload["created_at"] = new Date();
                state.simHistoryList.push(action.payload);

                return {
                    ...state,
                    sim_list: sims,
                    ...getCheckAllValues,
                    simHistoryList: state.simHistoryList
                    // simDeleted: new Date()
                }
            } else {
                error({
                    title: action.response.msg,
                });
                return {
                    ...state
                }
            }
        }

        case UPDATE_SIM: {
            let simList = state.sim_list;
            // console.log('== UPDATE_SIM ==> ', action)
            // console.log('state sims:', simList);

            if (action.response.status) {


                // if (action.payload.obj.id === "unrAll") {

                //     if (action.payload.label === "unrGuest") {
                //         state.unrGuest = action.payload.value;
                //     } else if (action.payload.label === "unrEncrypt") {
                //         state.unrEncrypt = action.payload.value;
                //     }
                // } else if (action.payload.obj.id === "all") {

                //     if (action.payload.label === "guest") {
                //         simList = simList.map((item) => {
                //             item.guest = action.payload.value ? 1 : 0;
                //             return item;
                //         })
                //     } else if (action.payload.label === "encrypt") {
                //         simList = simList.map((item) => {
                //             item.encrypt = action.payload.value ? 1 : 0;
                //             return item;
                //         })
                //     }
                // } else {
                //     let index = simList.findIndex(e => e.iccid === action.payload.obj.iccid);
                //     console.log("index ", index);
                //     if (index !== -1) {
                //         simList[index] = action.payload.obj;
                //     }
                // }
                // console.log("index simList ", simList);
                // let getCheckAllValues = checkAllSims(simList);

                success({
                    title: action.response.msg,
                });

                return {
                    ...state,
                    // sim_list: simList,
                    // unrGuest: state.unrGuest,
                    // unrEncrypt: state.unrEncrypt,
                    simUpdated: new Date(),
                    // ...getCheckAllValues,
                }
            } else {
                error({
                    title: action.response.msg,
                });
                return {
                    ...state
                }
            }
        }

        case SIM_LOADING: {
            return {
                ...state,
                simloading: true,
            }
        }

        case GET_UNREG_SIMS: {
            // console.log("action.payload.data ", action.payload.data);

            if (action.payload.status) {

                return {
                    ...state,
                    simloading: false,
                    unRegSims: []
                }
            } else {
                return {
                    ...state,
                    // simloading: false,
                    unRegSims: []
                }
            }
        }

        case WRITE_IMEI: {
            if (action.payload.status) {
                // if (action.payload.insertedData !== null) {
                //     state.imei_list.unshift(action.payload.insertedData)
                // }

                if (action.payload.online) {
                    success({
                        title: action.imeiData.imeiNo + `${action.payload.title1}` + action.imeiData.type + `${action.payload.title2}`,
                    });
                } else {
                    warning({
                        title: action.payload.msg, //  'Warning Device Offline',
                        content: action.imeiData.imeiNo + `${action.payload.title1}` + action.imeiData.type + `${action.payload.title2}`,
                    });
                }
                // console.log('new state is', state.imei_list)
            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                // imei_list: [...state.imei_list]
            }
        }

        case DEVICE_SYNCED: {
            return {
                ...state,
                reSync: action.payload,
                // isLoading: false
            }
        }
        case PASSWORD_CHANGED: {

            // console.log('password reducer', action.payload)

            if (action.payload.response.status) {
                if (action.payload.response.online) {

                    success({
                        title: action.payload.response.msg,
                    });

                } else {
                    // message.warning(<Fragment><span>Warning Device Offline</span> <div>Apps pushed to device. </div> <div>Action will be performed when device is back online</div></Fragment>)
                    warning({
                        title: 'Warning Device Offline',
                        content: action.payload.response.msg,
                    });
                }
                if (action.payload.pwdType) {
                    pwdObject[action.payload.pwdType] = action.payload.passwords.pwd ? action.payload.passwords.pwd : null;
                }

                state.activities.push({
                    action_name: 'PASSWORD',
                    created_at: getCurrentDate(),
                    data: { passwords: JSON.stringify(pwdObject) }
                })

            } else {
                error({
                    title: action.payload.response.msg,
                });
            }

            return {
                ...state,
                activities: state.activities
            }
        }

        case ACK_INSTALLED_APPS: {
            // console.log("add app in app_list")
            let app_list = state.app_list;
            if (action.payload.status) {
                checkIsArray(action.payload.app_list).forEach((app) => {
                    let found = checkIsArray(state.app_list).filter(e => e.uniqueName === app.uniqueName);
                    if (found.length === 0) {
                        app_list.push(app)
                    }
                });
            } else {

            }
            console.log("ACK_INSTALLED_APPS ", app_list)
            return {
                ...state,
                app_list: app_list,
                pageName: MAIN_MENU
            }
        }
        case ACK_UNINSTALLED_APPS: {
            let app_list = state.app_list;
            if (action.payload.status) {
                checkIsArray(action.payload.app_list).forEach((app) => {
                    let index = 0;
                    checkIsArray(app_list).forEach((apk, i) => {
                        if (apk.package_name === app.packageName) {
                            index = i;
                        }
                    });

                    if (index !== 0) {
                        app_list.splice(index, 1);
                    }

                })
            } else {

            }

            console.log("ACK_UNINSTALLED_APPS ", [...app_list])
            return {
                ...state,
                app_list: [...app_list],
                pageName: MAIN_MENU
            }
        }

        case ACK_SETTING_APPLIED: {

            let settings = {};
            let checkApps = {};
            let checkExt = {};

            if (action.payload.app_list) {
                settings.app_list = action.payload.app_list;
                checkApps = handleCheckedAll(action.payload.app_list)
            }

            if (action.payload.extensions) {
                settings.extensions = action.payload.extensions;
                checkExt = handleCheckedAllExts(action.payload.extensions);
            }

            if (action.payload.controls) {
                settings.controls = action.payload.controls;
            }

            console.log("testing: ", settings, checkExt, checkApps);

            return {
                ...state,
                ...settings,
                ...checkExt,
                ...checkApps
                // extensions: extensions,
                // ...check
            }
        }
        case SEND_ONLINE_OFFLINE_STATUS: {
            let device = JSON.parse(JSON.stringify(state.device));
            device.online = action.payload;

            return {
                ...state,
                device: device
            }
        }
        case RESET_DEVICE: {
            return {
                ...state,

                undoApps: JSON.parse('[]'),
                redoApps: JSON.parse('[]'),

                undoExtensions: JSON.parse('[]'),
                redoExtensions: JSON.parse('[]'),

                undoControls: JSON.parse('[]'),
                redoControls: JSON.parse('[]'),
            }
        }

        case CANCEL_EXTENDED_SERVICE:
            {
                if (action.payload.status) {
                    success({
                        title: action.payload.msg
                    })
                    return {
                        ...state,
                        device: action.payload.data
                    }
                } else {
                    error({
                        title: action.payload.msg
                    })
                }
            }
        case GET_DEVICE_BILLING_HISTORY:
            {
                return {
                    ...state,
                    device_billing_history: action.payload.data
                }

            }

        default:
            return state;
    }
}


function handleApplyBtn(pageName, undoControls, redoControls, undoExtensions, redoExtensions, undoApps, redoApps) {
    // console.log("pageName =============> ", pageName, undoApps, undoExtensions, undoControls)

    let buttons = {
        undoBtn: false,
        applyBtn: false,
        redoBtn: false,
        clearBtn: false,
    }

    if (pageName === APPS) {
        // console.log("undoApps.length ", undoApps.length, "redoApps.length ", redoApps.length)

        if ((undoApps.length === 0 || undoApps.length === 1) && redoApps.length === 0) {
            // buttons = buttons;
            if (undoControls.length > 1 || undoExtensions.length > 1) {
                buttons = {
                    applyBtn: true,
                    undoBtn: false,
                    redoBtn: false,
                    clearBtn: true
                }
            }
        } else if (undoApps.length > 1 && redoApps.length === 0) {
            buttons = {
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
            }

        } else if ((undoApps.length === 0 || undoApps.length === 1) && redoApps.length > 0) {

            buttons = {
                undoBtn: false,
                redoBtn: true,
                clearBtn: true,
                applyBtn: false,
            }
        } else if (undoApps.length > 1 && redoApps.length > 0) {
            buttons = {
                undoBtn: true,
                applyBtn: true,
                redoBtn: true,
                clearBtn: true,
            }
        }

    }
    else if (pageName === SYSTEM_CONTROLS) {
        console.log("undoControls.length ", undoControls.length, "redoControls.length ", redoControls.length)

        if ((undoControls.length === 0 || undoControls.length === 1) && redoControls.length === 0) {
            // buttons = buttons;
            if (undoExtensions.length > 1 || undoApps.length > 1) {

                buttons = {
                    applyBtn: true,
                    undoBtn: false,
                    redoBtn: false,
                    clearBtn: true
                }
            } else {
            }
        } else if (undoControls.length > 1 && redoControls.length === 0) {
            buttons = {
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
            }

        } else if ((undoControls.length === 0 || undoControls.length === 1) && redoControls.length > 0) {

            buttons = {
                undoBtn: false,
                redoBtn: true,
                clearBtn: true,
                applyBtn: false,
            }
        } else if (undoControls.length > 1 && redoControls.length > 0) {
            buttons = {
                undoBtn: true,
                applyBtn: true,
                redoBtn: true,
                clearBtn: true,
            }
        }

    }
    else if (pageName === SECURE_SETTING) {
        // console.log("undoExtensions.length ", undoExtensions.length, "redoExtensions.length ", redoExtensions.length)

        if ((undoExtensions.length === 0 || undoExtensions.length === 1) && redoExtensions.length === 0) {
            // buttons = buttons;
            if (undoControls.length > 1 || undoApps.length > 1) {

                buttons = {
                    applyBtn: true,
                    undoBtn: false,
                    redoBtn: false,
                    clearBtn: true
                }
            } else {
            }
        } else if (undoExtensions.length > 1 && redoExtensions.length === 0) {
            buttons = {
                applyBtn: true,
                undoBtn: true,
                clearBtn: true,
            }

        } else if ((undoExtensions.length === 0 || undoExtensions.length === 1) && redoExtensions.length > 0) {

            buttons = {
                undoBtn: false,
                redoBtn: true,
                clearBtn: true,
                applyBtn: false,
            }
        } else if (undoExtensions.length > 1 && redoExtensions.length > 0) {
            buttons = {
                undoBtn: true,
                applyBtn: true,
                redoBtn: true,
                clearBtn: true,
            }
        }

    }
    else {
        // console.log("changes: ", undoControls, undoExtensions, undoApps);
        if (undoControls.length > 1 || undoExtensions.length > 1 || undoApps.length > 1) {
            buttons = {
                applyBtn: true,
                undoBtn: false,
                redoBtn: false,
                clearBtn: true
            }
        } else {
            buttons = {
                undoBtn: false,
                redoBtn: false,
                clearBtn: false,
                applyBtn: false
            }
        }

    }
    return buttons

}

function handleCheckedAll(applications) {
    // console.log('handleCheckedAllExts applications  ', applications)
    let guestCount = 0;
    let encryptedCount = 0;
    let enableCount = 0;

    let applicationLength = 0;

    let guestAll = false;
    let encryptedAll = false;
    let enableAll = false;

    checkIsArray(applications).forEach(app => {
        if (!app.extension && app.visible) {
            applicationLength = applicationLength + 1;
            if (app.guest === true || app.guest === 1) {
                guestCount = guestCount + 1;
            }

            if (app.encrypted === true || app.encrypted === 1) {
                encryptedCount = encryptedCount + 1;
            }

            if (app.enable === true || app.enable === 1) {
                enableCount = enableCount + 1;
            }
        }

    })

    if (guestCount === applicationLength) {
        guestAll = true;
    }

    if (encryptedCount === applicationLength) {
        encryptedAll = true;
    }

    if (enableCount === applicationLength) {
        enableAll = true;
    }
    return {
        guestAll: guestAll,
        encryptedAll: encryptedAll,
        enableAll: enableAll
    }
}

function handleCheckedAllExts(extensions) {
    // console.log('handleCheckedAllExts extensions  ', extensions)
    let guestCount = 0;
    let encryptedCount = 0;
    let enableCount = 0;

    let guestAll = false;
    let encryptedAll = false;

    checkIsArray(extensions).forEach(app => {
        if (app.guest === true || app.guest === 1) {
            ++guestCount;
        }

        if (app.encrypted === true || app.encrypted === 1) {
            ++encryptedCount;
        }

        if (app.enable === true || app.enable === 1) {
            ++enableCount;
        }

    })

    // console.log("guestCount === extensions.length ", guestCount, extensions.length)
    // console.log("encryptedCount === extensions.length ", encryptedCount, extensions.length)
    if (guestCount === extensions.length) {
        guestAll = true;
    }

    if (encryptedCount === extensions.length) {
        encryptedAll = true;
    }

    return {
        guestAllExt: guestAll,
        encryptedAllExt: encryptedAll,
    }
}


function getCheckedAllPushApp(apkList) {
    let guestCount = 0;
    let encryptedCount = 0;
    let enableCount = 0;

    let guestAll = false;
    let encryptedAll = false;
    let enableAll = false;

    checkIsArray(apkList).forEach(app => {
        if (app.guest === true || app.guest === 1) {
            guestCount = guestCount + 1;
        }

        if (app.encrypted === true || app.encrypted === 1) {
            encryptedCount = encryptedCount + 1;
        }

        if (app.enable === true || app.enable === 1) {
            enableCount = enableCount + 1;
        }

    })

    if (guestCount === apkList.length) {
        guestAll = true;
    }

    if (enableCount === apkList.length) {
        enableAll = true;
    }

    if (encryptedCount === apkList.length) {
        encryptedAll = true;
    }

    return {
        guestAllPushApps: guestAll,
        encryptedAllPushApps: encryptedAll,
        enableAllPushApps: enableAll,
    }
}


function getCurrentDate() {
    var tempDate = new Date();
    var date = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds();
    return date
}

function checkAllSims(sims) {

    let guestSimAll = 1;
    let encryptSimAll = 1;

    if (sims.obj && sims.obj.id === "all") {

        if (sims.label === "guest") {
            guestSimAll = sims.value;
        } else if (sims.label === "encrypt") {
            encryptSimAll = sims.value;
        }
    } else if (sims.length) {

        let checkEnc = checkIsArray(sims).filter(e => e.encrypt != true);
        let checkGst = checkIsArray(sims).filter(e => e.guest != true);

        if (checkGst.length > 0) guestSimAll = 0; else guestSimAll = 1;
        if (checkEnc.length > 0) encryptSimAll = 0; else encryptSimAll = 1;
    }

    return {
        guestSimAll,
        encryptSimAll
    }
}
