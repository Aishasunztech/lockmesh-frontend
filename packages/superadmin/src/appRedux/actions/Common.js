import {
    GET_DROPDOWN,
    POST_DROPDOWN,
    INVALID_TOKEN,
    NEW_REQUEST_LIST,
    POST_PAGINATION,
    GET_PAGINATION,
    CHECK_PASS
} from "../../constants/ActionTypes"
// import AuthFailed from './Auth';

import RestService from '../services/RestServices';


export function getDropdown(pageName) {

    return (dispatch) => {
        RestService.getSelectedItems(pageName)
            .then((response) => {
                //  console.log("apk_list form server");
                //   console.log(response.data);
                if (RestService.checkAuth(response.data)) {
                    //  console.log("action selected options", JSON.parse(response.data.data));
                    let res = response.data.data;
                    // console.log(res);
                    if (res === undefined || res === 'undefined') {

                        res = [];

                    }
                    else {
                        res = JSON.parse(res)
                    }
                    //  res = (res !== undefined || res !== 'undefined') ? res : [""];
                    dispatch({
                        type: GET_DROPDOWN,
                        payload: res
                    });

                } else {
                    dispatch({
                        type: INVALID_TOKEN
                    });
                }
            });

    };
}

export function postDropdown(selectedItems, pageName) {
    return (dispatch) => {
        RestService.postSelectedItems(selectedItems, pageName).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // if(response.data.status === true)
                dispatch({
                    type: POST_DROPDOWN,
                    payload: response.data.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        });
    }
}
export function postPagination(selectedValue, pageName) {

    return (dispatch) => {

        RestService.postPagenation(selectedValue, pageName).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // if(response.data.status === true)
                dispatch({
                    type: POST_PAGINATION,
                    payload: response.data.data
                })
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    };

}
export function getPagination(pageName) {
    return (dispatch) => {
        RestService.getPagination(pageName)
            .then((response) => {
                // console.log(response)
                // console.log("apk_list form server");
                //  console.log(response.data);
                if (RestService.checkAuth(response.data)) {
                    //  console.log("action selected options", JSON.parse(response.data.data));

                    dispatch({
                        type: GET_PAGINATION,
                        payload: response.data.data
                    });


                } else {
                    dispatch({
                        type: INVALID_TOKEN
                    });
                }
            });

    };
}

export const checkPass = (user) => {
    console.log(user);
    return (dispatch) => {
        RestService.checkPass(user).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: CHECK_PASS,
                    payload: response.data
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