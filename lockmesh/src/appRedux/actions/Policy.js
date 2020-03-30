import {
    GET_POLICIES,
    INVALID_TOKEN,
    HANDLE_CHECK_APP_POLICY,
    GET_APPS_PERMISSIONS,
    HANDLE_CHECK_SYSTEM_PERMISSIONS,
    SAVE_POLICY,
    PERMISSION_SAVED,
    HANDLE_CHECK_ALL_APP_POLICY,
    HANDLE_POLICY_STATUS,
    EDIT_POLICY,
    POLICY_PERMISSION_SAVED,
    SAVE_POLICY_CHANGES,
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

import RestService from '../services/RestServices';

export function getPolicies() {
    return (dispatch) => {
        RestService.getPolicies().then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_POLICIES,
                    payload: response.data.policies
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }

}

export function getAppPermissions() {
    
    return (dispatch) => {
        RestService.getAppPermissions().then((response) => {

            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_APPS_PERMISSIONS,
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

export function getSystemPermissions() {
    return (dispatch) => {
        RestService.getSystemPermissions().then((response) => {

            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_SYSTEM_PERMISSIONS,
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

export function getDefaultApps() {
    return (dispatch) => {
        RestService.getDefaultApps().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log("hello", response.data);

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}


export function handleCheckSystemPermission(e, key) {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_SYSTEM_PERMISSIONS,
            payload: {
                value: e,
                key: key,

            }
        })
    }
}

export function savePolicy(data) {

    // console.log('device', device);
    return (dispatch) => {
        RestService.savePolicy(data).then((response) => {
            //  console.log('conect device method call', data);
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                if (response.data) {
                    dispatch({
                        type: SAVE_POLICY,
                        response: response.data,
                        payload: {
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

export function handleCheckAppPolicy(e, key, app_id, stateToUpdate, uniqueName = '', main='') {
    
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_APP_POLICY,
            payload: {
                value: e,
                key: key,
                app_id: app_id,
                stateToUpdate: stateToUpdate,
                uniqueName: uniqueName,
                main: main
            }
        })
    }
}

export function handleAppGotted(value) {
    return (dispatch) => {
        dispatch({
            type: HANDLE_APPS_GOTTED,
            payload: {
                value: value,
            }
        })
    }
}

export function handlePolicyStatus(e, key, id, translation={}) {
    let data = { value: e, key: key, id: id }
    return (dispatch) => {
        RestService.deleteORStatusPolicy(data).then((response) => {
            //  console.log('conect device method call', data);
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                if (response.data.status) {
                    dispatch({
                        type: HANDLE_POLICY_STATUS,
                        payload: {
                            value: e,
                            key: key,
                            id: id,
                        },
                        translation
                    })
                } else {
                    dispatch({
                        type: INVALID_TOKEN
                    });
                }
            }
        })
    }
}


export function SavePolicyChanges(record) {
    return (dispatch) => {
        RestService.SavePolicyChanges(record).then((response) => {
            //  console.log('conect device method call', data);
            if (RestService.checkAuth(response.data)) {
                // console.log('response', response.data);
                if (response.data) {
                    dispatch({
                        type: SAVE_POLICY_CHANGES,
                        payload: {
                            response: response.data
                        }
                    })
                } else {
                    dispatch({
                        type: INVALID_TOKEN
                    });
                }
            }
        })
    }
}


export function handleEditPolicy(e, key, id, stateToUpdate = '', rowId, uniqueName = '') {
    //  console.log('action called', e , key, id, stateToUpdate, uniqueName)
    return (dispatch) => {
        dispatch({
            type: EDIT_POLICY,
            payload: {
                value: e,
                key: key,
                id: id,
                rowId: rowId,
                stateToUpdate: stateToUpdate,
                uniqueName: uniqueName
            }
        })
    }
}

export function resetAddPolicyForm(){
    return(dispatch) => {
        dispatch({
            type: RESET_ADD_POLICY_FORM
        })
    }
}

export function resetPlicies(){
    return (dispatch) => {
        dispatch({
            type: RESET_POLICY,
     
        })
    }
} 

export function addAppsToPolicies(apps, policy_id, dataType) {
    return (dispatch) => {
        dispatch({
            type: ADD_APPS_TO_POLICIES,
            payload: {
              apps: apps,
              policy_id: policy_id,
              dataType: dataType
            }
        })
    }
}

export function removeAppsFromPolicies(app_id, policy_id, dataType) {
    return (dispatch) => {
        dispatch({
            type: REMOVE_APPS_FROM_POLICIES,
            payload: {
              app_id: app_id,
              policy_id: policy_id,
              dataType: dataType
            }
        })
    }
}

export function checktogglebuttons(policy) {
    return (dispatch) => {
        dispatch({
            type: CHECK_TOGGLE_BUTTONS,
            payload: {
              policy: policy,
            }
        })
    }
}



export function handleCheckAllAppPolicy(e, key, stateToUpdate, uniqueName = '') {
    return (dispatch) => {
        dispatch({
            type: HANDLE_CHECK_ALL_APP_POLICY,
            payload: {
                value: e,
                key: key,
                // app_id: app_id,
                stateToUpdate: stateToUpdate,
                uniqueName: uniqueName
            }
        })
    }
}

export function handleCheckAll(e, key, stateToUpdate, uniqueName = '', rowId) {
    // console.log('handle check all action', e, key, stateToUpdate, uniqueName, rowId)
    return (dispatch) => {
        dispatch({
            type: CHECK_HANDLE_ALL_POLICY,
            payload: {
                value: e,
                key: key,
                // app_id: app_id,
                stateToUpdate: stateToUpdate,
                uniqueName: uniqueName,
                rowId: rowId
            }
        })
    }
}


export function policyPermission(id, dealers, action, statusAll = false, user) {
    // console.log('at domainPermission action ', id, dealers, action, statusAll)
    return (dispatch) => {
        RestService.dealerPermissions(id, dealers, action, statusAll, 'policy').then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: POLICY_PERMISSION_SAVED,
                    payload: response.data,
                    formData: {
                        id,
                        dealers,
                        action,
                        statusAll,
                        user
                    }
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }

}

// export function savePermission(policy_id, dealers, action) {
//     // alert(policy_id);

//     return (dispatch) => {
//         RestService.savePolicyPermissions(policy_id, dealers, action).then((response) => {
//             if (RestService.checkAuth(response.data)) {

//                 dispatch({
//                     type: POLICY_PERMISSION_SAVED,
//                     payload: response.data.msg,
//                     permission_count: response.data.permission_count,
//                     policy_id: policy_id,
//                     dealers: dealers
//                 })

//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 });
//             }
//         })
//     }

// }
export function defaultPolicyChange(enable, policy_id) {
    return (dispatch) => {
        RestService.defaultPolicyChange(enable, policy_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: DEFAULT_POLICY_CHANGE,
                    payload: response.data.msg,
                    policy_id: policy_id
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }

}