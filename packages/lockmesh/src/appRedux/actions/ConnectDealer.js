import {
    INVALID_TOKEN,
    DEALER_DETAILS,
    DEALER_PAYMENT_HISTORY,
    SET_DEALER_LIMIT,
    DEALER_SALES_HISTORY,
    DEALER_DOMAINS,
    CONNECT_DEALER_LOADING,
    DEALER_ACCOUNT_STATUS,
    CD_PERMISSION_DOMAINS,
    ERROR_PERMISSION_DOMAINS,
    SET_DEMOS_LIMIT,
    DEALER_DOMAINS_LOADING,
} from "../../constants/ActionTypes"
// import { message } from 'antd';

import RestService from '../services/RestServices';


export function getDealerDetails(dealerId) {
    return (dispatch) => {
        dispatch({
            type: CONNECT_DEALER_LOADING,
        });

        RestService.getDealerDetails(dealerId).then((response) => {

            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: DEALER_DETAILS,
                    payload: response.data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    };
}

export function getDealerPaymentHistory(dealerId, status = '') {
    return (dispatch) => {
        RestService.getDealerPaymentHistory(dealerId, status).then((response) => {

            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: DEALER_PAYMENT_HISTORY,
                    payload: response.data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    }
}

export function setCreditLimit(data) {
    return (dispatch) => {
        RestService.setCreditLimit(data).then((response) => {

            if (RestService.checkAuth(response.data)) {
                console.log(response.data)
                dispatch({
                    type: SET_DEALER_LIMIT,
                    payload: response.data,
                    formData: data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    }
}

export function setDemosLimit(data) {
    return (dispatch) => {
        RestService.setDemosLimit(data).then((response) => {

            if (RestService.checkAuth(response.data)) {
                console.log(response.data)
                dispatch({
                    type: SET_DEMOS_LIMIT,
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

export function getDealerSalesHistory(dealerId) {
    return (dispatch) => {
        RestService.getDealerSalesHistory(dealerId).then((response) => {

            if (RestService.checkAuth(response.data)) {
                console.log(response.data)
                dispatch({
                    type: DEALER_SALES_HISTORY,
                    payload: response.data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}

export function getDealerDomains(dealerId) {
    return (dispatch) => {
        RestService.getDealerDomains(dealerId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                console.log(response.data)
                dispatch({
                    type: DEALER_DOMAINS,
                    payload: response.data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}

export function changeDealerStatus(dealerId, dealerStatus) {
    return (dispatch) => {
        RestService.changeDealerStatus(dealerId, dealerStatus).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: DEALER_ACCOUNT_STATUS,
                    payload: response.data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}

export function connectDealerDomainPermission(id, dealers, action, statusAll = false, user, selectedDomains) {
    console.log('at connectDealerDomainPermission action ', id, dealers, action, statusAll)
    return (dispatch) => {
        dispatch({
            type: DEALER_DOMAINS_LOADING
        });
        RestService.connectDealerDomainPermission(id, dealers, action, statusAll).then((response) => {
            // console.log("response.data ", response.data)
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: CD_PERMISSION_DOMAINS,
                    payload: response.data,
                    formData: {
                        id,
                        dealers,
                        action,
                        statusAll,
                        user
                    },
                    selectedDomains
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        }).catch(error => {
            console.warn(error)
            dispatch({
                type: ERROR_PERMISSION_DOMAINS
            })
        })
    }

}