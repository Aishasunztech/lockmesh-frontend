import {
    APK_LIST,
    INVALID_TOKEN,
    // EDIT_APK,
    LOADING,
    IMPORT_CSV,
    RELEASE_CSV,
    GET_USED_PGP_EMAILS,
    GET_USED_CHAT_IDS,
    GET_USED_SIM_IDS,
    DUPLICATE_SIM_IDS,
    NEW_DATA_INSERTED,
    CREATE_BACKUP_DB,
    GET_OVERDUE_DETAILS,
    CHECK_BACKUP_PASS,
    SHOW_BACKUP_MODAL,
    SAVE_ID_PRICES,
    SAVE_PACKAGE,
    GET_PRICES,
    SET_PRICE,
    RESET_PRICE,
    GET_PACKAGES,
    PURCHASE_CREDITS,
    PACKAGE_PERMISSION_SAVED,
    DELETE_PACKAGE,
    EDIT_PACKAGE,
    RESYNC_IDS,
    USER_CREDITS,
    GET_DOMAINS,
    PERMISSION_SAVED,
    PERMISSION_DOMAINS,
    GET_HARDWARE,
    LATEST_PAYMENT_HISTORY,
    MODIFY_ITEM_PRICE
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
                console.log('duplicated data', response.data)
                if (response.data.status) {
                    if (response.data.duplicateData.length) {
                        // console.log('duplicated data', response.data);
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
                if (RestService.checkAuth(response.data)) {

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
        // alert("hello");
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
export function createBackupDB() {
    return (dispatch) => {
        // alert("hello");
        RestService.createBackupDB().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log("asdd");
                RestService.getBackupFile(response.data.path);
                dispatch({
                    type: CREATE_BACKUP_DB,
                    // payload: response.data.data
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    }
}
export const checkPass = (user) => {
    // console.log(user);
    return (dispatch) => {
        RestService.checkPass(user).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: CHECK_BACKUP_PASS,
                    payload: {
                        PasswordMatch: response.data,
                        msg: response.data.msg
                    }
                })
            }
            else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}
export const showBackupModal = (visible) => {
    console.log(visible);
    return (dispatch) => {
        dispatch({
            type: SHOW_BACKUP_MODAL,
            payload: visible

        })
    }
}

export const saveIDPrices = (data) => {
    console.log('at action, ', data);
    return (dispatch) => {
        RestService.saveIDPrices(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: SAVE_ID_PRICES,
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

export const setPackage = (data) => {
    return (dispatch) => {
        RestService.setPackage(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: SAVE_PACKAGE,
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

export const editPackage = (data) => {
    return (dispatch) => {
        RestService.editPackage(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: EDIT_PACKAGE,
                    response: response.data,
                    package_id: data.package_id
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const getPrices = () => {
    return (dispatch) => {
        RestService.getPrices().then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_PRICES,
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

export const getPackages = () => {
    return (dispatch) => {
        RestService.getPackages().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: GET_PACKAGES,
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

export const getHardwares = () => {
    return (dispatch) => {
        RestService.getHardwares().then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log(response.data);
                dispatch({
                    type: GET_HARDWARE,
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


export const resetPrice = () => {
    return (dispatch) => {
        dispatch({
            type: RESET_PRICE,
        })
    }
}

export const setPrice = (field, value, price_for = '') => {
    // console.log('action called successfully')
    return (dispatch) => {
        dispatch({
            type: SET_PRICE,
            payload: {
                field: field,
                value: value,
                price_for: price_for
            }
        })
    }
}
export const purchaseCredits = (data) => {
    return (dispatch) => {
        console.log(data);
        RestService.purchaseCredits(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: PURCHASE_CREDITS,
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
export const purchaseCreditsFromCC = (cardInfo, creditInfo) => {
    return (dispatch) => {
        // console.log(data);
        RestService.purchaseCreditsFromCC(cardInfo, creditInfo).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: PURCHASE_CREDITS,
                    response: response.data
                })
                if (response.data.status) {
                    dispatch({
                        type: USER_CREDITS,
                        response: response.data
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

export function packagePermission(id, dealers, action, statusAll = false, user) {
    // console.log('at domainPermission action ', id, dealers, action, statusAll)
    return (dispatch) => {
        RestService.dealerPermissions(id, dealers, action, statusAll, 'package').then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: PACKAGE_PERMISSION_SAVED,
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

export function deletePackage(id) {
    // alert(package_id);

    return (dispatch) => {
        RestService.deletePackage(id).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: DELETE_PACKAGE,
                    payload: response.data,
                    package_id: id
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}
export function modifyItemPrice(id, price, retail_price = 0, isModify = false, type) {
    // alert(package_id);

    return (dispatch) => {
        RestService.modifyItemPrice(id, price, retail_price, isModify, type).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: MODIFY_ITEM_PRICE,
                    payload: response.data,
                    item_id: id,
                    price: price,
                    item_type: type
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}
export const resyncIds = () => {
    return (dispatch) => {
        dispatch({
            type: RESYNC_IDS,
        })
    }
}

export function getDomains(noLoading=true) {
    return (dispatch) => {
        if(noLoading){
            dispatch({
                type: LOADING,
                isloading: true
            });
        }
        RestService.getDomains().then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    dispatch({
                        type: GET_DOMAINS,
                        payload: response.data
                    });
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    };
}

export function domainPermission(id, dealers, action, statusAll = false, user) {
    // console.log('at domainPermission action ', id, dealers, action, statusAll)
    return (dispatch) => {
        RestService.dealerPermissions(id, dealers, action, statusAll, 'domain').then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: PERMISSION_DOMAINS,
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
export const getLatestPaymentHistory = (data) => {
    return (dispatch) => {
        RestService.getLatestPaymentHistory(data).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: LATEST_PAYMENT_HISTORY,
                    payload: response.data
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
};


export const getOverdueDetails = () => {
    return (dispatch) => {
        RestService.getOverdueDetails().then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_OVERDUE_DETAILS,
                    payload: response.data
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
};
