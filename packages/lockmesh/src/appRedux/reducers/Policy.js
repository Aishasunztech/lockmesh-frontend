import {
    GET_POLICIES,
    APK_LIST,
    HANDLE_CHECK_APP_POLICY,
    GET_APPS_PERMISSIONS,
    GET_DEALER_APPS,
    HANDLE_CHECK_SYSTEM_PERMISSIONS,
    SAVE_POLICY,
    PERMISSION_SAVED,
    HANDLE_CHECK_ALL_APP_POLICY,
    HANDLE_POLICY_STATUS,
    POLICY_PERMISSION_SAVED,
    EDIT_POLICY,
    SAVE_POLICY_CHANGES,
    GET_PAGINATION,
    CHECK_HANDLE_ALL_POLICY,
    DEFAULT_POLICY_CHANGE,
    ADD_APPS_TO_POLICIES,
    REMOVE_APPS_FROM_POLICIES,
    CHECK_TOGGLE_BUTTONS,
    RESET_POLICY,
    RESET_ADD_POLICY_FORM,
    HANDLE_APPS_GOTTED,
    GET_SYSTEM_PERMISSIONS
} from "../../constants/ActionTypes";
import {
    POLICY_NAME,
    POLICY_INFO,
    POLICY_NOTE,
    POLICY_COMMAND
} from "../../constants/PolicyConstants";

import { message, Modal } from 'antd';
import { convertToLang, findAndRemove_duplicate_in_array, removeDuplicateObjects, checkIsArray } from "../../routes/utils/commonUtils";
import { POLICY_DELETED_SUCCESSFULLY, STATUS_UPDATED } from "../../constants/Constants";

const success = Modal.success
const error = Modal.error

const initialState = {
    policies: [],
    msg: "",
    apk_list: [],
    app_list: [],
    dealer_apk_list: [],
    dealer_apk_listCopy: [],
    showMsg: false,
    isloading: true,
    copyPolicies: [],
    selectedOptions: [],
    options: [POLICY_NAME, POLICY_NOTE,],
    allExtensions: [],
    appPermissions: [],
    allExtensionsCopy: [],
    appPermissionsCopy: [],

    systemPermissions: [],
    systemPermissionsCopy: [],
    systemPermissionsDump: [],

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

    appsGotted: false
}

export default (state = initialState, action) => {

    switch (action.type) {

        case GET_POLICIES:
            // console.log(action.payload);
            return {
                ...state,
                policies: action.payload,
                appsGotted: state.appsGotted,
                copyPolicies: JSON.parse(JSON.stringify(action.payload))
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
                appPermissionsCopy: JSON.parse(JSON.stringify(action.payload.appPermissions)),
                allExtensionsCopy: JSON.parse(JSON.stringify(action.payload.extensions)),
            }
        }

        case GET_SYSTEM_PERMISSIONS: {
            return {
                ...state,
                systemPermissions: action.payload.sysPermissions
            }
        }
        case HANDLE_APPS_GOTTED: {
            return {
                ...state,
                appsGotted: action.value
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
                dealer_apk_listCopy: JSON.parse(JSON.stringify(action.payload)),
            }
        }

        case CHECK_TOGGLE_BUTTONS: {

            let checkButtons = checkToggleButtons(action.payload.policy);

            return {
                ...state,
                ...checkButtons
            }
        }

        case RESET_ADD_POLICY_FORM: {
            return {
                ...state,
                appPermissions: state.appPermissionsCopy,
                allExtensions: state.allExtensionsCopy,
                systemPermissions: state.systemPermissionsCopy,
                dealer_apk_list: state.dealer_apk_listCopy,
                guestAlldealerApps: false,
                encryptedAlldealerApps: false,
                enableAlldealerApps: false,

                guestAllappPermissions: false,
                encryptedAllappPermissions: false,
                enableAllappPermissions: false,

                guestAllallExtensions: false,
                encryptedAllallExtensions: false,
                enableAllallExtensions: false,
            }


        }

        case ADD_APPS_TO_POLICIES: {

            let policies = state.policies;
            let checkButtons;
            let policy_index = state.policies.findIndex((item) => item.id === action.payload.policy_id);
            if (policy_index > -1) {
                for (let app_id of action.payload.apps) {
                    let index1 = 0;
                    if (action.payload.dataType === 'push_apps') {
                        index1 = policies[policy_index][action.payload.dataType].findIndex(app => app.apk_id === app_id);
                    } else {
                        index1 = policies[policy_index][action.payload.dataType].findIndex(app => app.id === app_id);
                    }
                    // console.log(index1, 'index is ')
                    if (index1 === -1) {
                        let app = null;
                        if (action.payload.dataType === 'push_apps') {
                            app = state.dealer_apk_list.find(item => item.apk_id === app_id);
                            if (app) {
                                policies[policy_index].push_apps.push(app)
                            }
                        } else {

                            app = state.appPermissions.find(item => item.id === app_id);
                            if (app) {
                                policies[policy_index].app_list.push(app)
                            }
                        }
                    }
                }
                checkButtons = checkToggleButtons(policies[policy_index])
            }
            // console.log(policies[policy_index].app_list.length, 'aps are')
            state.policies = policies;


            return {
                ...state,
                policies: [...state.policies],
                ...checkButtons
            }
        }


        case REMOVE_APPS_FROM_POLICIES: {
            let policies = state.policies;
            let app_id = action.payload.app_id;
            let checkButtons;
            let policy_index = state.policies.findIndex((item) => item.id === action.payload.policy_id);
            if (policy_index > -1) {
                if (action.payload.dataType === 'push_apps') {
                    let index = policies[policy_index].push_apps.findIndex(item => item.apk_id === app_id);
                    if (index > -1) {
                        policies[policy_index].push_apps.splice(index, 1);
                    }
                }
                else if (action.payload.dataType === 'appPermissions') {
                    let index = policies[policy_index].app_list.findIndex(item => item.apk_id === app_id);
                    if (index > -1) {
                        policies[policy_index].app_list.splice(index, 1);
                    }
                }
                checkButtons = checkToggleButtons(policies[policy_index])
            }
            state.policies = policies

            return {
                ...state,
                policies: [...state.policies],
                ...checkButtons
            }
        }

        case SAVE_POLICY: {
            // console.log(action.response, 'resp')
            let policies = state.policies
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                action.response.data["permission_count"] = 0;
                policies.push(action.response.data)
            } else {
                error({
                    title: action.response.msg,
                });
            }
            // console.log("policies ", policies);
            return {
                ...state,
                policies: [...policies],
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

            let changeSysPermissions = state.systemPermissions;

            let index = changeSysPermissions.findIndex(sysPermission => sysPermission.setting_name === action.payload.key);
            //  console.log(changeSysPermissions[action.payload.key], 'REDUCER INS PERMISDFAO', action.payload.key)   
            changeSysPermissions[index].setting_status = action.payload.value
            // console.log(changeSysPermissions, 'relst')
            return {
                ...state,
                systemPermissions: [...changeSysPermissions],
            }
        }

        case SAVE_POLICY_CHANGES: {
            // console.log('response is', action.payload.response)

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
                policies: JSON.parse(JSON.stringify(state.copyPolicies))
            }
        }


        case RESET_POLICY: {
            // console.log(state.copyPolicies, 'copypolicies')
            return {
                ...state,
                policies: state.copyPolicies,
            }
        }

        case EDIT_POLICY: {
            let changedState = state.policies;
            // console.log('changeded state : ', changedState)
            let id = action.payload.id;
            let policyId = action.payload.rowId;
            let key = action.payload.key;
            let stateToUpdate = action.payload.stateToUpdate;
            let checkButtons;
            // console.log(stateToUpdate, 'state to update')
            let rowId = changedState.findIndex(item => item.id === policyId);
            //  console.log(policyId, 'row id', rowId)

            if (rowId >= 0) {
                let index = -1;
                if (stateToUpdate === 'app_list') {
                    index = changedState[rowId][stateToUpdate].findIndex(item => item.id === id);
                    if (index >= 0) {
                        changedState[rowId][stateToUpdate][index][key] = action.payload.value;
                    }
                } else if (stateToUpdate === 'push_apps') {
                    index = changedState[rowId][stateToUpdate].findIndex(item => item.apk_id === id);
                    if (index >= 0) {
                        changedState[rowId][stateToUpdate][index][key] = action.payload.value;
                    }
                } else if (stateToUpdate === 'secure_apps') {
                    // console.log('object', changedState)

                    // let permissionIndex = changedState[rowId][stateToUpdate].findIndex(item => item.uniqueName === action.payload.uniqueName);
                    // if (permissionIndex >= 0) {
                    index = changedState[rowId][stateToUpdate].findIndex(item => item.id === id);
                    if (index >= 0) {
                        changedState[rowId][stateToUpdate][index][key] = action.payload.value;
                    }
                    // }
                } else if (stateToUpdate === 'controls') {
                    console.log('key', key)
                    let index = changedState[rowId][stateToUpdate].findIndex(control => control.setting_name === key);
                    console.log("index", index)
                    changedState[rowId][stateToUpdate][index].setting_status = action.payload.value;
                }

                changedState[rowId]['isChangedPolicy'] = true;
                checkButtons = checkToggleButtons(changedState[rowId])

                // console.log(index, 'lll')
            }

            state.policies = changedState;
            return {
                ...state,
                appsGotted: true,
                policies: [...state.policies],
                ...checkButtons
            }
        }


        case HANDLE_POLICY_STATUS: {

            let changedState = state.policies;
            let index = changedState.findIndex((policy) => policy.id === action.payload.id);
            if (index >= 0) {
                if (action.payload.key === 'delete_status') {
                    changedState.splice(index, 1);
                    success({
                        // title: 'Policy Deleted Successfully',
                        title: convertToLang(action.translation[POLICY_DELETED_SUCCESSFULLY], "Policy Deleted Successfully"),
                    });

                } else if (action.payload.key === 'status') {
                    changedState[index][action.payload.key] = action.payload.value;
                    message.success(convertToLang(action.translation[STATUS_UPDATED], 'Status Changed Sccessfully'));
                    // success({
                    //     title: ' Status Changed Sccessfully',
                    // });
                }
                state.policies = changedState;
                return {
                    ...state,
                    policies: [...state.policies],
                }
            } else {
                return {
                    ...state
                }
            }
        }


        case HANDLE_CHECK_APP_POLICY: {
            // console.log('reducer', action.payload);
            if (action.payload.stateToUpdate === 'allExtensions') {
                let checkButtons = null;
                let changedExtensions = JSON.parse(JSON.stringify(state.allExtensions));

                checkIsArray(changedExtensions).forEach(extension => {
                    // console.log(extension.uniqueName, '===', action.payload.uniqueName)

                    if (extension.uniqueName === action.payload.uniqueName) {
                        if (action.payload.main === 'main') {
                            extension[action.payload.key] = action.payload.value;
                        } else {
                            let objIndex = extension.subExtension.findIndex((obj => obj.id === action.payload.app_id));
                            if (objIndex > -1) {
                                extension.subExtension[objIndex][action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                                extension.subExtension[objIndex].isChanged = true;

                                checkButtons = check_all_apps_buttons(extension.subExtension, 'extenssions')
                            }
                        }
                    }
                });

                state.allExtensions = JSON.parse(JSON.stringify(changedExtensions));


                return {
                    ...state,
                    allExtensions: [...state.allExtensions],
                    ...checkButtons
                    // checked_app_id: {
                    //     id: action.payload.app_id,
                    //     key: action.payload.key,
                    //     value: action.payload.value
                    // },
                }
            }

            else if (action.payload.stateToUpdate === 'dealerApps') {
                let changedApps = JSON.parse(JSON.stringify(state.dealer_apk_list));
                checkIsArray(changedApps).forEach(app => {
                    // console.log(app.app_id,'====', action.payload.app_id)
                    if (app.apk_id === action.payload.app_id) {
                        app.isChanged = true;
                        app[action.payload.key] = action.payload.value;
                    }
                });

                state.dealer_apk_list = JSON.parse(JSON.stringify(changedApps));
                let applications = state.dealer_apk_list;
                let checkButtons = check_all_apps_buttons(changedApps, 'push_apps')

                return {
                    ...state,
                    dealer_apk_list: changedApps,
                    ...checkButtons,
                    checked_app_id: {
                        id: action.payload.app_id,
                        key: action.payload.key,
                        value: action.payload.value
                    },

                }
            }

            else if (action.payload.stateToUpdate === 'appPermissions') {
                let changedApps = JSON.parse(JSON.stringify(state.appPermissions));
                checkIsArray(changedApps).forEach(app => {
                    // console.log(app.id,'====', action.payload.app_id ,app)
                    if (app.id === action.payload.app_id) {
                        app.isChanged = true;
                        app[action.payload.key] = action.payload.value;
                    }
                });

                state.appPermissions = JSON.parse(JSON.stringify(changedApps));
                let checkButtons = check_all_apps_buttons(changedApps, 'appPermissions')

                return {
                    ...state,
                    appPermissions: changedApps,
                    ...checkButtons,
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

                checkIsArray(changedExtensions).forEach(extension => {
                    // console.log(extension.uniqueName, '===', action.payload.uniqueName)
                    if (extension.uniqueName === action.payload.uniqueName) {
                        checkIsArray(extension.subExtension).forEach(obj => {
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
            } else if (action.payload.stateToUpdate === 'dealerApps') {
                let changedApps = JSON.parse(JSON.stringify(state.dealer_apk_list));
                // console.log(action.payload.key + 'All' + action.payload.stateToUpdate, 'state to update')

                state[action.payload.key + 'All' + action.payload.stateToUpdate] = action.payload.value;
                checkIsArray(changedApps).forEach(app => {
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
            } else if (action.payload.stateToUpdate === 'appPermissions') {
                let changedApps = JSON.parse(JSON.stringify(state.appPermissions));
                // console.log(action.payload.key + 'All' + action.payload.stateToUpdate, 'state to update')
                state[action.payload.key + 'All' + action.payload.stateToUpdate] = action.payload.value;
                checkIsArray(changedApps).forEach(app => {
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
            } else {
                return {
                    ...state
                }
            }
        }


        case CHECK_HANDLE_ALL_POLICY: {

            // console.log('reducer', action.payload);
            let changedState = JSON.parse(JSON.stringify(state.policies));
            let chandedRowIndex = changedState.findIndex((item) => item.id === action.payload.rowId)

            if (action.payload.stateToUpdate === 'allExtensions') {
                state[action.payload.key + 'All2' + action.payload.stateToUpdate] = action.payload.value;
                checkIsArray(changedState[chandedRowIndex]['secure_apps']).forEach(extension => {

                    extension[action.payload.key] = (action.payload.value === true || action.payload.value === 1) ? 1 : 0;
                    extension.isChanged = true;

                });

                state.policies = JSON.parse(JSON.stringify(changedState));

                // console.log(state.policies, 'updated')
                return {
                    ...state,
                    policies: [...state.policies],
                }
            } else if (action.payload.stateToUpdate === 'dealerApps') {

                state[action.payload.key + 'All2' + action.payload.stateToUpdate] = action.payload.value;
                checkIsArray(changedState[chandedRowIndex]['push_apps']).forEach(app => {
                    app.isChanged = true;
                    app[action.payload.key] = action.payload.value;
                    // console.log(action.payload.key, 'value', action.payload.value)
                });

                state.policies = JSON.parse(JSON.stringify(changedState));

                // console.log(state.policies, 'updated')
                return {
                    ...state,
                    policies: state.policies,
                }
            } else if (action.payload.stateToUpdate === 'appPermissions') {
                state[action.payload.key + 'All2' + action.payload.stateToUpdate] = action.payload.value;
                checkIsArray(changedState[chandedRowIndex]['app_list']).forEach(app => {
                    app.isChanged = true;
                    app[action.payload.key] = action.payload.value;
                });

                state.policies = JSON.parse(JSON.stringify(changedState));

                // console.log(state.policies, 'updated')
                return {
                    ...state,
                    policies: [...state.policies],
                }
            } else {
                return {
                    ...state
                }
            }
        }

        // case POLICY_PERMISSION_SAVED: {
        //     // console.log("dasdasdad");
        //     success({
        //         title: action.payload
        //     });
        //     // let dealers = JSON.parse(action.dealers)
        //     // console.log(dealers.length ,'itrititt',action.apk_id);

        //     let objIndex = state.policies.findIndex((obj => obj.id === action.policy_id));
        //     state.policies[objIndex].permission_count = action.permission_count;

        //     return {
        //         ...state,
        //         policies: [...state.policies]
        //     }
        // }

        // case POLICY_PERMISSION_SAVED: {

        //     // console.log("at reducer POLICY_PERMISSION_SAVED:: ", state.policies, action);
        //     if (action.payload.status) {
        //         success({
        //             title: action.payload.msg
        //         });
        //         let user = action.formData.user;
        //         let index = state.policies.findIndex((item) => item.id == action.formData.id);
        //         let newDealers = (JSON.parse(action.formData.dealers)) ? JSON.parse(action.formData.dealers) : [];
        //         let oldDealers = (state.policies[index].dealer_permission) ? state.policies[index].dealer_permission : [];
        //         // console.log('index is: ', index);
        //         // console.log('newDealers : ', newDealers);
        //         // console.log('oldDealers : ', oldDealers);

        //         // Save permission for new dealers
        //         if (action.formData.action == "save") {

        //             if (index !== -1) {
        //                 newDealers = checkIsArray(newDealers).map((item) => {
        //                     return {
        //                         dealer_id: item,
        //                         dealer_type: user.type,
        //                         permission_by: user.id
        //                     }
        //                 });
        //                 if (!action.formData.statusAll) {
        //                     // let allDealers = findAndRemove_duplicate_in_array([...oldDealers, ...newDealers]);
        //                     let allDealers = removeDuplicateObjects([...oldDealers, ...newDealers], "dealer_id");
        //                     // console.log("allDealers ", allDealers);

        //                     // console.log('remove duplicate ', findAndRemove_duplicate_in_array(allDealers));


        //                     state.policies[index].permission_count = allDealers.length;
        //                     state.policies[index].dealer_permission = allDealers;
        //                     state.policies[index].statusAll = false;
        //                 } else {
        //                     state.policies[index].permission_count = "All";
        //                     state.policies[index].statusAll = true;
        //                     state.policies[index].dealer_permission = newDealers;
        //                 }
        //             }
        //         }
        //         else if (action.formData.action == "delete") {
        //             // delete permission for dealers

        //             if (index !== -1) {
        //                 if (!action.formData.statusAll) {
        //                     let allDealers = checkIsArray(oldDealers).filter((item) => !newDealers.includes(item.dealer_id));
        //                     state.policies[index].dealer_permission = allDealers;
        //                     state.policies[index].permission_count = allDealers.length;
        //                 } else {
        //                     if (user && user.type === "dealer") {
        //                         state.policies[index].dealer_permission = checkIsArray(oldDealers).filter((item) => item.dealer_type == "admin")
        //                     }
        //                     else if (user && user.type === "sdealer") {
        //                         state.policies[index].dealer_permission = checkIsArray(oldDealers).filter((item) => item.dealer_type == "admin" || item.dealer_type == "dealer")
        //                     }
        //                     else {
        //                         state.policies[index].dealer_permission = [];
        //                     }
        //                     state.policies[index].statusAll = false;
        //                     state.policies[index].permission_count = 0;
        //                 }
        //             }
        //         }
        //     } else {
        //         error({
        //             title: action.payload.msg
        //         });
        //     }

        //     return {
        //         ...state,
        //         isloading: false,
        //         policies: [...state.policies]
        //     }
        // }

        case POLICY_PERMISSION_SAVED: {

            // console.log("at reducer POLICY_PERMISSION_SAVED:: ", state.policies, action);
            if (action.payload.status) {
                success({
                    title: action.payload.msg
                });
                let user = action.formData.user;
                let index = state.policies.findIndex((item) => item.id == action.formData.id);
                let newDealers = (JSON.parse(action.formData.dealers)) ? JSON.parse(action.formData.dealers) : [];
                let oldDealers = (state.policies[index].dealer_permission) ? state.policies[index].dealer_permission : [];
                // console.log('index is: ', index);
                // console.log('newDealers : ', newDealers);
                // console.log('oldDealers : ', oldDealers);

                // Save permission for new dealers
                if (action.formData.action == "save") {

                    if (index !== -1) {
                        newDealers = checkIsArray(newDealers).map((item) => {
                            return {
                                dealer_id: item,
                                dealer_type: user.type,
                                permission_by: user.id
                            }
                        });
                        if (!action.formData.statusAll) {
                            // let allDealers = findAndRemove_duplicate_in_array([...oldDealers, ...newDealers]);
                            let allDealers = removeDuplicateObjects([...oldDealers, ...newDealers], "dealer_id");
                            // console.log("allDealers ", allDealers);

                            // console.log('remove duplicate ', findAndRemove_duplicate_in_array(allDealers));


                            state.policies[index].permission_count = allDealers.length;
                            state.policies[index].dealer_permission = allDealers;
                            state.policies[index].statusAll = false;
                        } else {
                            state.policies[index].permission_count = "All";
                            state.policies[index].statusAll = true;
                            // state.policies[index].dealer_permission = newDealers;
                            if (user.type !== "admin") {

                                let finalDealers = [];
                                let deleteIds = checkIsArray(oldDealers).map((dlr) => dlr.dealer_id);
                                checkIsArray(newDealers).forEach((item) => {
                                    if (deleteIds.includes(item.dealer_id)) {
                                        let indexIs = oldDealers.findIndex((e) => e.dealer_id === item.dealer_id);
                                        finalDealers.push(oldDealers[indexIs]);
                                    } else {
                                        finalDealers.push(item);

                                    }
                                })
                                state.policies[index].dealer_permission = finalDealers;
                            } else {
                                state.policies[index].dealer_permission = newDealers;
                            }

                        }
                    }
                }
                else if (action.formData.action == "delete") {
                    // delete permission for dealers

                    if (index !== -1) {
                        if (!action.formData.statusAll) {
                            let allDealers = checkIsArray(oldDealers).filter((item) => !newDealers.includes(item.dealer_id));
                            // state.policies[index].dealer_permission = allDealers;
                            // state.policies[index].permission_count = allDealers.length;
                            // if (user && user.type !== "admin") {
                            //     let filterDealers = checkIsArray(allDealers).filter((item) => item.dealer_type === "admin");
                            //     state.policies[index].dealer_permission = filterDealers;
                            //     state.policies[index].permission_count = filterDealers.length;
                            // } else {
                            state.policies[index].dealer_permission = allDealers;
                            state.policies[index].permission_count = allDealers.length;
                            // }
                            state.policies[index].statusAll = false;
                        } else {
                            let allDealers = [];
                            if (user && user.type !== "admin") {
                                if (user && user.type === "dealer") {
                                    allDealers = checkIsArray(oldDealers).filter((item) => item.dealer_type == "admin");
                                    state.policies[index].dealer_permission = allDealers
                                    state.policies[index].permission_count = allDealers.length;
                                }
                                else if (user && user.type === "sdealer") {
                                    allDealers = checkIsArray(oldDealers).filter((item) => item.dealer_type == "admin" || item.dealer_type == "dealer");
                                    state.policies[index].dealer_permission = allDealers
                                    state.policies[index].permission_count = allDealers.length;
                                }
                                else {
                                    state.policies[index].dealer_permission = [];
                                    state.policies[index].permission_count = 0;
                                }
                                state.policies[index].statusAll = false;
                            }
                        }
                    }
                }
            } else {
                error({
                    title: action.payload.msg
                });
            }

            return {
                ...state,
                isloading: false,
                policies: [...state.policies]
            }
        }

        case DEFAULT_POLICY_CHANGE: {

            success({
                title: action.payload
            });
            // message.success(action.payload)
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


function check_all_apps_buttons(apps, type) {

    let guestCount = 0;
    let encryptedCount = 0;
    let enableCount = 0;

    for (let app of apps) {
        if (app.guest === true || app.guest === 1) {
            guestCount += 1;
        }
        if (app.encrypted === true || app.encrypted === 1) {
            encryptedCount += 1;
        }
        if (app.enable === true || app.enable === 1) {
            enableCount += 1;
        }
    }

    let guestAll = guestCount === apps.length ? true : false;
    let encryptedAll = encryptedCount === apps.length ? true : false;
    let enableAll = enableCount === apps.length ? true : false;

    if (type === 'push_apps') {
        return {
            guestAlldealerApps: guestAll,
            encryptedAlldealerApps: encryptedAll,
            enableAlldealerApps: enableAll,
        }
    } else if (type === 'appPermissions') {
        return {
            guestAllappPermissions: guestAll,
            encryptedAllappPermissions: encryptedAll,
            enableAllappPermissions: enableAll,
        }
    } else if (type === 'extenssions') {
        return {
            guestAllallExtensions: guestAll,
            encryptedAllallExtensions: encryptedAll,
            enableAllallExtensions: enableAll,
        }
    }
}


function checkToggleButtons(policy) {

    let push_apps_guestCount = 0;
    let push_apps_encryptedCount = 0;
    let push_apps_enableCount = 0;

    let appPermissions_guestCount = 0;
    let appPermissions_encryptedCount = 0;
    let appPermissions_enableCount = 0;

    let extension_guestCount = 0;
    let extension_encryptedCount = 0;
    let extension_enableCount = 0;

    for (let app of policy.push_apps) {
        if (app.guest === true || app.guest === 1) {
            push_apps_guestCount += 1;
        }
        if (app.encrypted === true || app.encrypted === 1) {
            push_apps_encryptedCount += 1;
        }
        if (app.enable === true || app.enable === 1) {
            push_apps_enableCount += 1;
        }
    }

    for (let app of policy.app_list) {
        if (app.guest === true || app.guest === 1) {
            appPermissions_guestCount += 1;
        }
        if (app.encrypted === true || app.encrypted === 1) {
            appPermissions_encryptedCount += 1;
        }
        if (app.enable === true || app.enable === 1) {
            appPermissions_enableCount += 1;
        }
    }

    for (let app of policy.secure_apps) {
        if (app.guest === true || app.guest === 1) {
            extension_guestCount += 1;
        }
        if (app.encrypted === true || app.encrypted === 1) {
            extension_encryptedCount += 1;
        }
        if (app.enable === true || app.enable === 1) {
            extension_enableCount += 1;
        }
    }


    let guestAll2dealerApps = push_apps_guestCount === policy.push_apps.length ? true : false;

    let encryptedAll2dealerApps = push_apps_encryptedCount === policy.push_apps.length ? true : false;

    let enableAll2dealerApps = push_apps_enableCount === policy.push_apps.length ? true : false;

    let guestAll2appPermissions = appPermissions_guestCount === policy.app_list.length ? true : false;

    let encryptedAll2appPermissions = appPermissions_encryptedCount === policy.app_list.length ? true : false;

    let enableAll2appPermissions = appPermissions_enableCount === policy.app_list.length ? true : false;

    let guestAll2allExtensions = extension_guestCount === policy.secure_apps.length ? true : false;

    let encryptedAll2allExtensions = extension_encryptedCount === policy.secure_apps.length ? true : false;

    let enableAll2allExtensions = extension_enableCount === policy.secure_apps.length ? true : false
    // console.log('reducer',  guestAll2appPermissions,encryptedAll2appPermissions, enableAll2appPermissions)
    return {
        guestAll2dealerApps: guestAll2dealerApps,
        encryptedAll2dealerApps: encryptedAll2dealerApps,
        enableAll2dealerApps: enableAll2dealerApps,
        guestAll2appPermissions: guestAll2appPermissions,
        encryptedAll2appPermissions: encryptedAll2appPermissions,
        enableAll2appPermissions: enableAll2appPermissions,
        guestAll2allExtensions: guestAll2allExtensions,
        encryptedAll2allExtensions: encryptedAll2allExtensions,
        enableAll2allExtensions: enableAll2allExtensions
    }
}