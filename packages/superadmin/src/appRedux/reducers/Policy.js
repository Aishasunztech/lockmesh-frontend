import {
    GET_POLICIES,
    APK_LIST,
    HANDLE_CHECK_APP_POLICY,
    GET_APPS_PERMISSIONS,
    GET_DEALER_APPS,
    HANDLE_CHECK_SYSTEM_PERMISSIONS,
    SAVE_POLICY,
    PERMSSION_SAVED,
    HANDLE_CHECK_ALL_APP_POLICY,
    HANDLE_POLICY_STATUS,
    POLICY_PERMSSION_SAVED,
    EDIT_POLICY,
    SAVE_POLICY_CHANGES,
    GET_PAGINATION,
    CHECK_HANDLE_ALL_POLICY,
    DEFAULT_POLICY_CHANGE
} from "../../constants/ActionTypes";
import {
    POLICY_NAME,
    POLICY_INFO,
    POLICY_NOTE,
    POLICY_COMMAND
} from "../../constants/PolicyConstants";

import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error

const initialState = {
    policies: [],
    msg: "",
    apk_list: [],
    app_list: [],
    dealer_apk_list: [],
    showMsg: false,
    isloading: true,
    selectedOptions: [],
    options: [POLICY_NAME, POLICY_NOTE],
    allExtensions: [],
    appPermissions: [],
    systemPermissions: { "wifi_status": true, "bluetooth_status": false, "screenshot_status": false, "location_status": false, "hotspot_status": false },
    systemPermissionsdump: { "wifi_status": true, "bluetooth_status": false, "screenshot_status": false, "location_status": false, "hotspot_status": false },

    guestAlldealerApps: false,
    encryptedAlldealerApps: false,
    enableAlldealerApps: false,

    guestAllappPermissions: false,
    encryptedAllappPermissions: false,
    enableAllappPermissions: false,

    guestAllallExtensions: false,
    encryptedAllallExtensions: false,
    enableAllallExtensions: false,

    guestAll2dealerApps: false,
    encryptedAll2dealerApps: false,
    enableAll2dealerApps: false,

    guestAll2appPermissions: false,
    encryptedAll2appPermissions: false,
    enableAll2appPermissions: false,

    guestAll2allExtensions: false,
    encryptedAll2allExtensions: false,
    enableAll2allExtensions: false,
    DisplayPages: 10,
}

export default (state = initialState, action) => {

    switch (action.type) {

        case GET_POLICIES:
            // console.log(action.payload);
            return {
                ...state,
                policies: action.payload
            }

        case APK_LIST: {
            return {
                ...state,
                isloading: false,
                apk_list: action.payload,
            }
        }

        case GET_APPS_PERMISSIONS: {
            // console.log('data permissions', action.payload)
            return {
                ...state,
                appPermissions: action.payload.appPermissions,
                allExtensions: action.payload.extensions,
                systemPermissions: initialState.systemPermissionsdump
            }
        }

        case GET_PAGINATION: {
            return {
                ...state,
                DisplayPages: action.payload
            }
        }

        case GET_DEALER_APPS: {

            return {
                ...state,
                dealer_apk_list: action.payload,
            }
        }

        case SAVE_POLICY: {
            // console.log(action.response, 'resp')
            if (action.response.status) {
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
                guestAlldealerApps: false,
                encryptedAlldealerApps: false,
                enableAlldealerApps: false,

                guestAllappPermissions: false,
                encryptedAllappPermissions: false,
                enableAllappPermissions: false,

                guestAllallExtensions: false,
                encryptedAllallExtensions: false,
                enableAllallExtensions: false,
                // dealer_apk_list: action.payload,
            }
        }

        case HANDLE_CHECK_SYSTEM_PERMISSIONS: {

            let changedState = state.systemPermissions;
            //  console.log(changedState[action.payload.key], 'REDUCER INS PERMISDFAO', action.payload.key)   
            changedState[action.payload.key] = action.payload.value
            state.systemPermissions = changedState;
            // console.log(changedState, 'relst')
            return {
                ...state,
                systemPermissions: { ...state.systemPermissions },
            }
        }

        case SAVE_POLICY_CHANGES: {

            if (action.payload.response.status) {
                success({
                    title: action.payload.response.msg,
                });
            } else {
                error({
                    title: action.payload.response.msg,
                });
            }
            return {
                ...state,
            }
        }

        case EDIT_POLICY: {
            let changedState = state.policies;
            // console.log('changeded state : ', changedState)
            let id = action.payload.id;
            let policyId = action.payload.rowId;
            let key = action.payload.key;
            let stateToUpdate = action.payload.stateToUpdate;
            let rowId = changedState.findIndex(item => item.id == policyId);
            //  console.log(policyId, 'row id', rowId)

            if (rowId >= 0) {
                let index = -1;
                if (stateToUpdate == 'app_list') {
                    index = changedState[rowId][stateToUpdate].findIndex(item => item.id == id);
                    if (index >= 0) {
                        changedState[rowId][stateToUpdate][index][key] = action.payload.value;
                    }
                } else if (stateToUpdate == 'push_apps') {
                    index = changedState[rowId][stateToUpdate].findIndex(item => item.apk_id == id);
                    if (index >= 0) {
                        changedState[rowId][stateToUpdate][index][key] = action.payload.value;
                    }
                } else if (stateToUpdate == 'secure_apps') {
                    console.log('object', changedState)

                    // let permissionIndex = changedState[rowId][stateToUpdate].findIndex(item => item.uniqueName == action.payload.uniqueName);
                    // if (permissionIndex >= 0) {
                        index = changedState[rowId][stateToUpdate].findIndex(item => item.id == id);
                        if (index >= 0) {
                            changedState[rowId][stateToUpdate][index][key] = action.payload.value;
                        }
                    // }
                } else if (stateToUpdate == 'controls') {
                    changedState[rowId][stateToUpdate][key] = action.payload.value;
                }


                changedState[rowId]['isChangedPolicy'] = true;

                // console.log(index, 'lll')
            }



            state.policies = changedState;
            return {
                ...state,
                policies: [...state.policies],
            }
        }


        case HANDLE_POLICY_STATUS: {

            let changedState = state.policies;
            let index = changedState.findIndex((policy) => policy.id == action.payload.id);
            if (index >= 0) {
                if (action.payload.key == 'delete_status') {
                    changedState.splice(index, 1);
                    success({
                        title: 'Policy Deleted Successfully',
                    });

                } else if (action.payload.key == 'status') {
                    changedState[index][action.payload.key] = action.payload.value;
                    message.success('Status Changed Sccessfully');
                    // success({
                    //     title: ' Status Changed Sccessfully',
                    // });
                }
                state.policies = changedState;
                return {
                    ...state,
                    policies: [...state.policies],
                }
            }

        }


        case HANDLE_CHECK_APP_POLICY: {
            // console.log('reducer', action.payload);
            if (action.payload.stateToUpdate === 'allExtensions') {

                let changedExtensions = JSON.parse(JSON.stringify(state.allExtensions));

                changedExtensions.forEach(extension => {
                    // console.log(extension.uniqueName, '===', action.payload.uniqueName)
                    if (extension.uniqueName === action.payload.uniqueName) {
                        let objIndex = extension.subExtension.findIndex((obj => obj.id === action.payload.app_id));
                        if (objIndex > -1) {
                            extension.subExtension[objIndex][action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                            extension.subExtension[objIndex].isChanged = true;
                        }
                    }
                });

                state.allExtensions = JSON.parse(JSON.stringify(changedExtensions));

                return {
                    ...state,
                    allExtensions: [...state.allExtensions],
                    // checked_app_id: {
                    //     id: action.payload.app_id,
                    //     key: action.payload.key,
                    //     value: action.payload.value
                    // },
                }
            }

            else if (action.payload.stateToUpdate === 'dealerApps') {
                let changedApps = JSON.parse(JSON.stringify(state.dealer_apk_list));
                changedApps.forEach(app => {
                    // console.log(app.app_id,'====', action.payload.app_id)
                    if (app.apk_id === action.payload.app_id) {
                        app.isChanged = true;
                        app[action.payload.key] = action.payload.value;
                    }
                });

                state.dealer_apk_list = JSON.parse(JSON.stringify(changedApps));
                let applications = state.dealer_apk_list;

                return {
                    ...state,
                    dealer_apk_list: changedApps,
                    checked_app_id: {
                        id: action.payload.app_id,
                        key: action.payload.key,
                        value: action.payload.value
                    },

                }
            }

            else if (action.payload.stateToUpdate === 'appPermissions') {
                let changedApps = JSON.parse(JSON.stringify(state.appPermissions));
                changedApps.forEach(app => {
                    // console.log(app.id,'====', action.payload.app_id ,app)
                    if (app.id === action.payload.app_id) {
                        app.isChanged = true;
                        app[action.payload.key] = action.payload.value;
                    }
                });

                state.appPermissions = JSON.parse(JSON.stringify(changedApps));

                return {
                    ...state,
                    appPermissions: changedApps,
                    checked_app_id: {
                        id: action.payload.app_id,
                        key: action.payload.key,
                        value: action.payload.value
                    },

                }
            }


        }

        case HANDLE_CHECK_ALL_APP_POLICY: {
            // console.log('reducer', action.payload);
            if (action.payload.stateToUpdate === 'allExtensions') {
                // console.log(action.payload.key + 'All' + action.payload.stateToUpdate, 'state to update')

                let changedExtensions = JSON.parse(JSON.stringify(state.allExtensions));
                state[action.payload.key + 'All' + action.payload.stateToUpdate] = action.payload.value;

                changedExtensions.forEach(extension => {
                    // console.log(extension.uniqueName, '===', action.payload.uniqueName)
                    if (extension.uniqueName === action.payload.uniqueName) {
                        extension.subExtension.forEach(obj => {
                            obj[action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                            obj.isChanged = true;
                        });
                    }
                });

                state.allExtensions = JSON.parse(JSON.stringify(changedExtensions));

                return {
                    ...state,
                    allExtensions: [...state.allExtensions],
                    // checked_app_id: {
                    //     id: action.payload.app_id,
                    //     key: action.payload.key,
                    //     value: action.payload.value
                    // },
                }
            }

            else if (action.payload.stateToUpdate === 'dealerApps') {
                let changedApps = JSON.parse(JSON.stringify(state.dealer_apk_list));
                // console.log(action.payload.key + 'All' + action.payload.stateToUpdate, 'state to update')

                state[action.payload.key + 'All' + action.payload.stateToUpdate] = action.payload.value;
                changedApps.forEach(app => {
                    // console.log(app.app_id,'====', action.payload.app_id)
                    app.isChanged = true;
                    app[action.payload.key] = action.payload.value;
                });

                state.dealer_apk_list = JSON.parse(JSON.stringify(changedApps));

                return {
                    ...state,
                    dealer_apk_list: changedApps,
                    checked_app_id: {
                        id: action.payload.app_id,
                        key: action.payload.key,
                        value: action.payload.value
                    },

                }
            }

            else if (action.payload.stateToUpdate === 'appPermissions') {
                let changedApps = JSON.parse(JSON.stringify(state.appPermissions));
                // console.log(action.payload.key + 'All' + action.payload.stateToUpdate, 'state to update')
                state[action.payload.key + 'All' + action.payload.stateToUpdate] = action.payload.value;
                changedApps.forEach(app => {
                    // console.log(app.id,'====', action.payload.app_id ,app)
                    app.isChanged = true;
                    app[action.payload.key] = action.payload.value;
                });

                state.appPermissions = JSON.parse(JSON.stringify(changedApps));

                return {
                    ...state,
                    appPermissions: changedApps,
                    checked_app_id: {
                        id: action.payload.app_id,
                        key: action.payload.key,
                        value: action.payload.value
                    },

                }
            }
        }


        case CHECK_HANDLE_ALL_POLICY: {

            //  console.log(state.policies,'reducer', action.payload);
            let changedState = JSON.parse(JSON.stringify(state.policies));
            let chandedRowIndex = changedState.findIndex((item) => item.id == action.payload.rowId)

            if (action.payload.stateToUpdate === 'allExtensions') {
                state[action.payload.key + 'All2' + action.payload.stateToUpdate] = action.payload.value;
                changedState[chandedRowIndex]['secure_apps'].forEach(extension => {
                    // if (extension.uniqueName === action.payload.uniqueName) {
                        // extension.subExtension.forEach(obj => {
                            extension[action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                            extension.isChanged = true;
                        // });
                    // }
                });

                state.policies = JSON.parse(JSON.stringify(changedState));

                // console.log(state.policies, 'updated')
                return {
                    ...state,
                    policies: [...state.policies],
                }
            }

            else if (action.payload.stateToUpdate === 'dealerApps') {

                state[action.payload.key + 'All2' + action.payload.stateToUpdate] = action.payload.value;
                changedState[chandedRowIndex]['push_apps'].forEach(app => {
                    app.isChanged = true;
                    app[action.payload.key] = action.payload.value;
                });

                state.policies = JSON.parse(JSON.stringify(changedState));

                // console.log(state.policies, 'updated')
                return {
                    ...state,
                    policies: [...state.policies],
                }
            }

            else if (action.payload.stateToUpdate === 'appPermissions') {
                state[action.payload.key + 'All2' + action.payload.stateToUpdate] = action.payload.value;
                changedState[chandedRowIndex]['app_list'].forEach(app => {
                    app.isChanged = true;
                    app[action.payload.key] = action.payload.value;
                });

                state.policies = JSON.parse(JSON.stringify(changedState));

                // console.log(state.policies, 'updated')
                return {
                    ...state,
                    policies: [...state.policies],
                }
            }
        }

        case POLICY_PERMSSION_SAVED: {
            // console.log("dasdasdad");
            success({
                title: action.payload
            });
            let dealers = JSON.parse(action.dealers)
            // console.log(dealers.length ,'itrititt',action.apk_id);
            let objIndex = state.policies.findIndex((obj => obj.id === action.policy_id));
            state.policies[objIndex].permission_count = action.permission_count;

            return {
                ...state,
                policies: [...state.policies]
            }
        }
        case DEFAULT_POLICY_CHANGE: {

            // success({
            //     title: action.payload
            // });
            message.success(action.payload)
            let objIndex = state.policies.findIndex((obj => obj.id === action.policy_id));
            let defaultPolicyIndex = state.policies.findIndex((obj => obj.is_default === true));
            if (defaultPolicyIndex === -1) {
                state.policies[objIndex].is_default = true;
            } else {
                state.policies[objIndex].is_default = true;
                state.policies[defaultPolicyIndex].is_default = false;
            }


            return {
                ...state,
                policies: [...state.policies]
            }
        }

        default: {

            return state;
        }

    }
}