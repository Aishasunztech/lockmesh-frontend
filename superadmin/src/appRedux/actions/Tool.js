import {
    INVALID_TOKEN,
    RESTART_WHITELABEL
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

export function restartWhiteLabel(wlID) {
    return (dispatch) => {
        RestService.restartWhiteLabel(wlID).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: RESTART_WHITELABEL,
                    payload: response.data
                });
            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }

}