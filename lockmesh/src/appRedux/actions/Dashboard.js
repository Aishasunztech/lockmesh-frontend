import {
    GET_DASHBOARD_DATA,
    INVALID_TOKEN
} from "../../constants/ActionTypes"


import RestService from '../services/RestServices';


export function getDashboardData(apk_id, dealers, action) {
    return (dispatch) => {
        RestService.getDashboardData(apk_id, dealers, action).then((response) => {
            if (RestService.checkAuth(response.data)) {
// console.log('action dashboard response', response)
                dispatch({
                    type: GET_DASHBOARD_DATA,
                    response: response,
                })

            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }

}
