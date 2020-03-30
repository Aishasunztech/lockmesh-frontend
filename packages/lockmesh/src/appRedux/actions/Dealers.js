import {
  DEALERS_LIST,
  SUSPEND_DEALERS,
  DELETE_DEALERS,
  INVALID_TOKEN,
  CHANGE_PASSWORD,
  ACTIVATE_DEALER,
  UNDO_DEALER,
  EDIT_DEALER,
  LOADING, ADD_DEALER,
  // INIT_URL,
  SPIN_lOADING,
  DEALERS_LIST_IN_SDEALER,
  CONNECT_DELETE_DEALER,
  CONNECT_UNDO_DEALER,
  CONNECT_SUSPEND_DEALER,
  CONNECT_ACTIVATE_DEALER, ALL_TO_ALL_DEALERS,CHANGE_TIMEZONE, HANDLE_ADD_DEALER_MODAL,
  ADD_DEALER_LOADING

} from "../../constants/ActionTypes"
// import { message } from 'antd';

import RestService from '../services/RestServices';
import { DEALER_LOADING } from "../../constants/ActionTypes";

// action creaters

export function getDealerList(d, is_loading_show = true) {
    // alert("test")
    return (dispatch) => {
        if (is_loading_show) {
            dispatch({
                type: DEALER_LOADING,
                isloading: true
            });
        }

        RestService.DealerList(d).then((response) => {
            // console.log('data form server', response.data);
            if (RestService.checkAuth(response.data)) {
                if (is_loading_show) {
                    dispatch({
                        type: DEALERS_LIST,
                        payload: response.data
                    });
                } else {
                    dispatch({
                        type: DEALERS_LIST_IN_SDEALER,
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

export function getAllToAllDealers() {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
      spinloading: true
    });

    RestService.getAllToAllDealers().then((response) => {

      if (RestService.checkAuth(response.data)) {

        dispatch({
          type: ALL_TO_ALL_DEALERS,
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

export function getUserDealers() {
    return (dispatch) => {
        dispatch({
            type: SPIN_lOADING,
            spinloading: true
        });

        RestService.getUserDealers().then((response) => {

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

export function suspendDealer(id, actionType = null) {
    return (dispatch) => {
        RestService.suspendDealer(id).then((response) => {

            if (RestService.checkAuth(response.data)) {
                // console.log('suspend response',response.data);
                let action = SUSPEND_DEALERS
                if (actionType) {
                    action = CONNECT_SUSPEND_DEALER
                }
                dispatch({
                    type: action,
                    response: response.data,
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

export function activateDealer(id, actionType = null) {
    return (dispatch) => {
        RestService.activateDealer(id).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('active response',response.data);
                let action = ACTIVATE_DEALER
                if (actionType) {
                    action = CONNECT_ACTIVATE_DEALER
                }
                if (response.data.status) {
                    dispatch({
                        type: action,
                        response: response.data,
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

export function editDealer(formData, actionType) {
    return (dispatch) => {
        RestService.updateDealerDetails(formData).then((response) => {

            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: actionType,
                    response: response.data,
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
export function handleAddDealerModalAction(visible) {
    return (dispatch) => {
        dispatch({
            type: HANDLE_ADD_DEALER_MODAL,
            payload: visible
        })
    }
}
export function addDealer(formData) {
    return (dispatch) => {

        dispatch({
            type: ADD_DEALER_LOADING
        })

        // console.log('add dealer call',formData);
        RestService.addDealer(formData).then((response) => {
            // console.log('response from add dealer',response);
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: ADD_DEALER,
                    response: response.data,
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

export function deleteDealer(id, actionType = null) {
    return (dispatch) => {
        RestService.unlinkDealer(id).then((response) => {

            if (RestService.checkAuth(response.data)) {
                let action = DELETE_DEALERS
                if (actionType) {
                    action = CONNECT_DELETE_DEALER
                }
                dispatch({
                    type: action,
                    response: response.data,
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

export function undoDealer(id, actionType = null) {
    return (dispatch) => {
        RestService.undoDealer(id).then((response) => {

            if (RestService.checkAuth(response.data)) {
                let action = UNDO_DEALER
                if (actionType) {
                    action = CONNECT_UNDO_DEALER
                }
                dispatch({
                    type: action,
                    response: response.data,
                    payload: {
                        id: id,
                        msg: "Dealer Undelete Successfully"
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

        RestService.updatePassword(dealer).then((response) => {
            if (RestService.checkAuth(response.data)) {

                dispatch({
                    type: CHANGE_PASSWORD,
                    response: response.data,
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

export function changeTimeZone(data) {
    // console.log('at actionfile : ', data);
    return (dispatch) => {
        RestService.changeTimeZone(data).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: CHANGE_TIMEZONE,
                    response: response.data,
                    data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        });
    };
}






