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
    GET_PARENT_PACKAGES,
    GET_PRODUCT_PRICES,
    USER_CREDITS,
    TRANSFER_DEVICE,
    ADD_DEVICE,
    DEVICES_LIST_FOR_REPORT,
    BULK_DEVICES_LIST,
    GET_PARENT_HARDWARES,
    ADD_PRODUCT,
    ADD_DATA_PLAN,
    REJECT_RELINK_DEVICE,
    RELINK_DEVICE,
    RESET_ADD_PRODUCT_PROPS,
    RESET_IDS
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

// action creaters

export function getDevicesList() {

    return (dispatch) => {
        dispatch({
            type: LOADING,
            isloading: true
        });
        RestService.DeviceList().then((response) => {
            //
            //
            if (RestService.checkAuth(response.data)) {
                //

                dispatch({
                    type: DEVICES_LIST,
                    payload: response.data.data,
                    response: response.data,

                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })

    };
}

export function getDevicesForReport() {

    return (dispatch) => {
        dispatch({
            type: LOADING,
            isloading: true
        });
        RestService.getDevicesForReport().then((response) => {

            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: DEVICES_LIST_FOR_REPORT,
                    payload: response.data,

                });
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
        //
        RestService.updateDeviceDetails(formData).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: EDIT_DEVICE,
                    response: response.data,
                    payload: {
                        formData: formData,
                    }
                });
                if (response.data.status && response.data.credits) {
                    dispatch({
                        type: USER_CREDITS,
                        response: response.data
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

export function extendServices(formData) {
    return (dispatch) => {
        //
        RestService.extendServices(formData).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: EDIT_DEVICE,
                    response: response.data,
                    payload: {
                        formData: formData,
                    }
                });
                if (response.data.status && response.data.credits) {
                    dispatch({
                        type: USER_CREDITS,
                        response: response.data
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

export function addDataPlan(formData) {
    return (dispatch) => {
        //
        RestService.addDataPlan(formData).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: ADD_DATA_PLAN,
                    response: response.data,
                    payload: {
                        formData: formData,
                    }
                });
                if (response.data.status && response.data.credits) {
                    dispatch({
                        type: USER_CREDITS,
                        response: response.data
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

export function deleteUnlinkDevice(action, devices) {
    return (dispatch) => {
        // alert("hello");
        //
        RestService.deleteUnlinkDevice(action, devices).then((response) => {
            if (RestService.checkAuth(response.data)) {
                //
                console.log(action);
                dispatch({
                    type: DELETE_UNLINK_DEVICE,
                    response: response.data,
                    payload: {
                        formData: devices,
                        type: action
                    }

                });
                if (action === 'pre-active') {
                    if (response.data.status) {
                        dispatch({
                            type: USER_CREDITS,
                            response: response.data
                        });
                    }

                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

export function suspendDevice(device) {

    console.log("suspendDevice action file =========> ", device);
    return (dispatch) => {

        RestService.suspendDevice(device.usr_device_id).then((response) => {

            if (RestService.checkAuth(response.data)) {

                //   device.account_status = "suspended";

                if (response.data.status) {
                    dispatch({
                        type: SUSPEND_DEVICE,
                        response: response.data,
                        payload: {
                            // device: device,
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

export function activateDevice(device) {

    return (dispatch) => {

        RestService.activateDevice(device.usr_device_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                //
                device.account_status = '';

                if (response.data.status) {
                    dispatch({
                        type: ACTIVATE_DEVICE,
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

export function rejectDevice(device) {
    return (dispatch) => {
        //
        RestService.rejectDevice(device).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: REJECT_DEVICE,
                    response: response.data,
                    device: device,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}

// export function rejectRelinkDevice(device) {
//     return (dispatch) => {
//         //
//         RestService.rejectRelinkDevcie(device).then((response) => {
//             if (RestService.checkAuth(response.data)) {
//                 dispatch({
//                     type: REJECT_RELINK_DEVICE,
//                     response: response.data,
//                     device: device,
//                 })
//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 })
//             }
//         });
//     }
// }

export function relinkDevice(id) {
    return (dispatch) => {
        //
        RestService.relinkDevice(id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: RELINK_DEVICE,
                    response: response.data,
                    user_acc_id: id,
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
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
                //
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

export function getChatIDs(user_acc_id, dealer_id) {
    return (dispatch) => {

        RestService.getChatIDs(user_acc_id, dealer_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                //
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

export function getPGPEmails(user_acc_id, dealer_id) {
    return (dispatch) => {
        // alert("hello");
        RestService.getPGPEmails(user_acc_id, dealer_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
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

// get All ids
export function getAllSimIDs() {
    return (dispatch) => {

        RestService.getAllSimIDs().then((response) => {
            if (RestService.checkAuth(response.data)) {
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

export function getAllChatIDs() {
    return (dispatch) => {

        RestService.getAllChatIDs().then((response) => {
            if (RestService.checkAuth(response.data)) {
                //
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

export function getAllPGPEmails() {
    return (dispatch) => {
        // alert("hello");
        RestService.getAllPGPEmails().then((response) => {
            if (RestService.checkAuth(response.data)) {
                //
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

export function addDevice(device) {
    return (dispatch) => {
        // alert("hello");
        RestService.addDevice(device).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: ADD_DEVICE,
                    response: response.data,
                    payload: {
                        formData: device,
                    }
                });
                if (response.data.status) {
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
        });
    }
}

export function preActiveDevice(device) {
    //
    return (dispatch) => {
        RestService.preActiveDevice(device).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: PRE_ACTIVATE_DEVICE,
                    response: response.data,
                    payload: {
                        formData: device,
                    }
                });
                if (response.data.status) {
                    //
                    dispatch({
                        type: USER_CREDITS,
                        response: response.data.data
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

export const getParentPackages = () => {
    return (dispatch) => {
        RestService.getParentPackages().then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: GET_PARENT_PACKAGES,
                    response: response.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const getHardwaresPrices = () => {
    return (dispatch) => {
        RestService.getHardwaresPrices().then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: GET_PARENT_HARDWARES,
                    response: response.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const getProductPrices = () => {
    return (dispatch) => {
        RestService.getProductPrices().then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: GET_PRODUCT_PRICES,
                    response: response.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

/**
 * @author Hamza Dawood
 * @description action for creating pgp, chat and sim
 */

export const resetIds = () => {
    return (dispatch) => {
        dispatch({
            type: RESET_IDS,
        })
    }
}

export const addProduct = (payload) => {
    return (dispatch) => {
        RestService.addProduct(payload).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: ADD_PRODUCT,
                    payload: {
                        type: payload.type,
                        ...response.data,
                        user_acc_id: payload.user_acc_id
                    }
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const resetProductAddProps = (payload) => {
    return (dispatch) => {
        dispatch({
            type: RESET_ADD_PRODUCT_PROPS,
        })
    }
}

// export function getBulkDevicesList(data) {
//     console.log('at action file ', data)

//     return (dispatch) => {
//         dispatch({
//             type: LOADING,
//             isloading: true
//         });
//         RestService.getBulkDevicesList(data).then((response) => {
//             if (RestService.checkAuth(response.data)) {
//                 if (response.data.status) {
//                     console.log('at action file on response')
//                     dispatch({
//                         type: BULK_DEVICES_LIST,
//                         payload: response.data.data,
//                         response: response.data,

//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 });
//             }
//         })

//     };
// }

// export function getBulkDealers(data) {

//     return (dispatch) => {
//         RestService.getBulkDealers(data).then((response) => {
//             if (RestService.checkAuth(response.data)) {
//                 if (response.data.status) {

//                     dispatch({
//                         type: BULK_DEALERS_LIST,
//                         payload: response.data.data,
//                         response: response.data,

//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 });
//             }
//         })

//     };
// }

// export function getBulkUsers(data) {

//     return (dispatch) => {
//         RestService.getBulkUsers(data).then((response) => {
//             if (RestService.checkAuth(response.data)) {
//                 if (response.data.status) {

//                     dispatch({
//                         type: BULK_USERS_LIST,
//                         payload: response.data.data,
//                         response: response.data,

//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 });
//             }
//         })

//     };
// }
