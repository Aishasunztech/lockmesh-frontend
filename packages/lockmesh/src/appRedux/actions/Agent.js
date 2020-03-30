import {
    AGENT_LIST,
    SAVE_AGENT,
    LOAD_USER,
    INVALID_TOKEN,
    LOADING,
    UPDATE_AGENT,
    DELETE_AGENT,
    CHANGE_AGENT_STATUS,
    RESET_AGENT_PWD
    // UNDO_DELETE_USER
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';

export function getAgentList() {
    
    return (dispatch) => {
        
        RestService.getAgentList().then((response) => {
            
            if (RestService.checkAuth(response.data)) {
                
                dispatch({
                    type: AGENT_LIST,
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

export function addAgent(agent) {
    
    return (dispatch) => {
    
        RestService.addAgent(agent).then((response) => {
            if (RestService.checkAuth(response.data)) {
                
                dispatch({
                    type: SAVE_AGENT,
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

export function updateAgent(agent) {
    return (dispatch) => {
        RestService.updateAgent(agent).then((response) => {
            if (RestService.checkAuth(response.data)) {
                dispatch({
                    type: UPDATE_AGENT,
                    payload: {
                        status: response.data.status,
                        agent: response.data.agent,
                        msg: response.data.msg
                    },
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export function changeAgentStatus(agent, status){
    return (dispatch) => {

        RestService.changeAgentStatus(agent, status).then((response) => {
            if (RestService.checkAuth(response.data)) {
                
                dispatch({
                    type: CHANGE_AGENT_STATUS,
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

export function deleteAgent(agentID) {
    return (dispatch) => {

        RestService.deleteAgent(agentID).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('action done ', response.data);
                dispatch({
                    type: DELETE_AGENT,
                    payload: {
                        status: response.data.status,
                        msg: response.data.msg,
                        agentID: agentID
                    }
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}

export function resetAgentPwd (agentID){
    return (dispatch) => {

        RestService.resetAgentPwd(agentID).then((response) => {
            if (RestService.checkAuth(response.data)) {
                // console.log('action done ', response.data);
                dispatch({
                    type: RESET_AGENT_PWD,
                    payload: {
                        status: response.data.status,
                        msg: response.data.msg,
                        agentID: agentID
                    }
                });

            } else {
                dispatch({
                    type: INVALID_TOKEN
                })
            }
        })
    }
}
// export function undoDeleteUser(userId) {
//     return (dispatch) => {

//         RestService.undoDeleteUser(userId).then((response) => {
//             if (RestService.checkAuth(response.data)) {
//                 // console.log('action done ', response.data);
//                 dispatch({
//                     type: UNDO_DELETE_USER,
//                     payload: {
//                         status: response.data.status,
//                         msg: response.data.msg,
//                         user_id: userId
//                     }
//                 });

//             } else {
//                 dispatch({
//                     type: INVALID_TOKEN
//                 })
//             }
//         })
//     }
// }