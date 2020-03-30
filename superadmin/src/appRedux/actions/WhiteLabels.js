import {
    INVALID_TOKEN,
    GET_WHITE_LABEL_INFO,
    EDIT_WHITE_LABEL_INFO,
    WHITE_LABEL_BACKUPS,
    SAVE_ID_PRICES,
    SAVE_PACKAGE,
    GET_PRICES,
    SET_PRICE,
    RESET_PRICE,
    GET_PACKAGES,
    GET_ALL_WHITE_LABELS,
    SAVE_BACKUP,
    START_BACKUP_LOADING,
    SAVE_HARDWARE,
    GET_HARDWARES,
    DELETE_PAKAGE,
    DELETE_HARDWARE,
    EDIT_HARDWARE,
    GET_DOMAINS,
    DELETE_DOMAINS,
    ADD_DOMAIN,
    EDIT_DOMAIN
} from "../../constants/ActionTypes"

import RestService from '../services/RestServices';

export const getAllWhiteLabels = () => {
    return (dispatch) => {
        RestService.getAllWhiteLabels().then(response => {

            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_ALL_WHITE_LABELS,
                    payload: response.data.whiteLabels
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }

        })
    }
}

export const getWhiteLabelInfo = (id) => {
    // 
    return (dispatch) => {
        RestService.getWhiteLabelInfo(id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_WHITE_LABEL_INFO,
                    payload: response.data.whiteLabel
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const setPrice = (field, value, price_for = '') => {
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

export const resetPrice = () => {
    return (dispatch) => {
        dispatch({
            type: RESET_PRICE,

        })
    }
}

export const getWhitelabelBackups = (id) => {
    // 
    return (dispatch) => {
        RestService.whitelabelBackups(id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: WHITE_LABEL_BACKUPS,
                    payload: response.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const getPrices = (data) => {
    return (dispatch) => {
        RestService.getPrices(data).then((response) => {
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

export const getPackages = (data) => {
    return (dispatch) => {
        RestService.getPackages(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
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
export const getHardwares = (data) => {
    return (dispatch) => {
        RestService.getHardwares(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_HARDWARES,
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

export const editHardware = (data) => {
    // console.log('edit record: ', data);
    return (dispatch) => {
        RestService.editHardware(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: EDIT_HARDWARE,
                    payload: response.data,
                    response: data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const deletePakage = (data) => {
    // console.log('deletePakage acion id :', data);
    return (dispatch) => {
        RestService.deletePakage(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: DELETE_PAKAGE,
                    payload: response.data,
                    response: data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const deleteHardware = (data) => {
    // console.log('deleteHardware acion id :', data);
    return (dispatch) => {
        RestService.deleteHardware(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: DELETE_HARDWARE,
                    payload: response.data,
                    response: data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const editWhiteLabelInfo = (data) => {
    return (dispatch) => {
        RestService.editWhiteLabelInfo(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: EDIT_WHITE_LABEL_INFO,
                    payload: response.data
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

export const saveHardware = (data) => {
    return (dispatch) => {
        RestService.saveHardware(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: SAVE_HARDWARE,
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

export const saveIDPrices = (data) => {
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

export const saveBackup = (id) => {
    return (dispatch) => {
        dispatch({
            type: START_BACKUP_LOADING,
        })
        RestService.saveBackup(id).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: SAVE_BACKUP,
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

export const getFile = (data) => {
    return (dispatch) => {
        RestService.getFile(data)
        // .then((response) => {

        //     if(RestService.checkAuth(response.data)){
        // dispatch({
        //     type: GET_FILE
        // })
        //     } else {
        //         dispatch({
        //             type: INVALID_TOKEN
        //         })                
        //     }
        // });
    }
}

export const getDomains = (whitelabel_id) => {
    return (dispatch) => {
        RestService.getDomains(whitelabel_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: GET_DOMAINS,
                    response: response.data,

                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const addDomain = (data) => {
    return (dispatch) => {
        RestService.addDomain(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: ADD_DOMAIN,
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

export const editDomain = (data) => {
    return (dispatch) => {
        RestService.editDomain(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: EDIT_DOMAIN,
                    response: response.data,
                    data: data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}

export const deleteDomains = (domain_id, wl_id) => {
    return (dispatch) => {
        RestService.deleteDomains(domain_id, wl_id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: DELETE_DOMAINS,
                    response: response.data,
                    id: domain_id
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });

    }
}