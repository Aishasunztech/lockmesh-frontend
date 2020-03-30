import {
    INVALID_TOKEN, GET_QUE_JOBS
} from "../../constants/ActionTypes"
import RestService from '../services/RestServices';

export function getSocketProcesses(status=false, filter=false, offset=false, limit=false) {
    return (dispatch) => {
        RestService.getSocketProcesses(status, filter, offset, limit).then((response) => {
            if (RestService.checkAuth(response.data)) {
                
                if (response.data.status) {
                    dispatch({
                        type: GET_QUE_JOBS,
                        payload: response.data.tasks,
                    });
                }
            } else {
                dispatch({
                    type: INVALID_TOKEN
                });
            }
        })
    }
}