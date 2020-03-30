import {
    DEALERS_LIST,
    SUSPEND_DEALERS,
    DELETE_DEALERS,
    INVALID_TOKEN,
    CHANGE_PASSWORD,
    ACTIVATE_DEALER,
    UNDO_DEALER,
    EDIT_DEALER,
    LOADING,ADD_DEALER,
    INIT_URL,
    SPIN_lOADING
} from "constants/ActionTypes"
// import { message } from 'antd';

import RestService from '../services/RestServices';

// action creaters 

export function getDealerList(d) {
    return (dispatch) => {
        dispatch({
            type: LOADING,
            isloading: true
        });
        RestService.DealerList(d).then((response) => {
            // console.log('data form server', response.data);

            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: DEALERS_LIST,
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

export function getAllDealers() {
    return (dispatch) => {
        dispatch({
            type: SPIN_lOADING,
            spinloading: true
        });
        
        RestService.getAllDealers().then((response) => {
            
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: DEALERS_LIST,
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

export function suspendDealer(id) {
    return (dispatch) => {
        RestService.suspendDealer(id).then((response) => {

            if (RestService.checkAuth(response.data)) {
               // console.log('suspend response',response.data);
               
                dispatch({
                    type: SUSPEND_DEALERS,
                    response:response.data,
                    payload: {
                        id: id, 
                        
                    }
                });



            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    };
}

export function activateDealer(id) {
    return (dispatch) => {
        RestService.activateDealer(id).then((response) => {
            if (RestService.checkAuth(response.data)) {
              // console.log('active response',response.data);
              
                if (response.data.status) {
                    dispatch({
                        type: ACTIVATE_DEALER,
                        response:response.data,
                        payload: {
                            id: id,
                            msg: "Dealer activated successfully"
                        }
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



export function editDealer(formData) {
    return (dispatch) => {
        RestService.updateDealerDetails(formData).then((response) => {

            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: EDIT_DEALER,
                    response:response.data,
                    payload: {
                        formData: formData,
                        msg: "Dealer Edit successfully"
                    }
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    };
}

export function addDealer(formData) {
    return (dispatch) => {

        // console.log('add dealer call',formData);
        RestService.addDealer(formData).then((response) => {
            // console.log('response from add dealer',response);
            if (RestService.checkAuth(response.data)) {
               
                dispatch({
                    type: ADD_DEALER,
                    response:response.data,
                    payload: {
                        formData: formData,
                        msg: response.data.msg
                    }
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });

    };
}

export function deleteDealer(id) {
    return (dispatch) => {
        RestService.unlinkDealer(id).then((response) => {

            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: DELETE_DEALERS,
                    response:response.data,
                    payload: {
                        id: id,
                        msg: "Dealer Deleted Successfully"
                    }
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });

            }
        });
    };
}

export function undoDealer(id) {
    return (dispatch) => {
        RestService.undoDealer(id).then((response) => {

            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: UNDO_DEALER,
                    response:response.data,
                    payload: {
                        id: id,
                        msg: "Dealer Undo Successfully"
                    }
                });


            } else {
                dispatch({
                    type: INVALID_TOKEN
                });

            }
        });
    };
}


export function updatePassword(dealer) {
    return (dispatch) => {
        // console.log('functino call', dealer);
        RestService.updatePassword(dealer).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: CHANGE_PASSWORD,
                    response:response.data,
                    payload: {
                        dealer: dealer,
                        msg: "Password Updated Successfully"
                    }
                });


            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    };
}






