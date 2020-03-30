import {
    AGENT_LIST,
    SAVE_AGENT,
    LOAD_USER,
    LOADING,
    UPDATE_AGENT,
    DELETE_AGENT,
    CHANGE_AGENT_STATUS,
    RESET_AGENT_PWD
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success
const error = Modal.error

const initialState = {
    isloading: false,
    addUserFlag: false,
    subIsloading: false,
    dealerAgents: [],
    options: [],

    action: '',
    msg: 'no message',

};

export default (state = initialState, action) => {

    switch (action.type) {

        case AGENT_LIST: {
            // console.log('item added is:', action.payload)
            return {
                ...state,
                isloading: false,
                dealerAgents: action.payload.agents,
            }
        }

        case SAVE_AGENT: {
            // console.log('item added is:', action.response.user)
            let result = []
            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                });
                result = [...action.payload.agent, ...state.dealerAgents]
            } else {
                error({
                    title: action.payload.msg,
                });
                result = state.dealerAgents
            }
            // console.log(result);
            return {
                ...state,
                isloading: false,
                addUserFlag: false,
                dealerAgents: result,
            }
        }
        case UPDATE_AGENT: {

            if (action.payload.status) {
                let objIndex = state.dealerAgents.findIndex((obj => obj.id === action.payload.agent.id));
                state.dealerAgents[objIndex] = action.payload.agent;
                success({
                    title: action.payload.msg,
                });
            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                dealerAgents: [...state.dealerAgents]
            }
        }

        case CHANGE_AGENT_STATUS: {
            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                });
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state
            }
        }


        case DELETE_AGENT: {
            if (action.payload.status) {
                let objIndex4 = state.dealerAgents.findIndex((obj => obj.id === action.payload.agentID));
                state.dealerAgents.splice(objIndex4, 1)
                success({
                    title: action.payload.msg,
                });
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                dealerAgents: [...state.dealerAgents]
            }
        }

        case RESET_AGENT_PWD: {
            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                });
            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
            }
        }

        // case UNDO_DELETE_USER:
        //     if (action.payload.status) {
        //         let objIndex4 = state.users_list.findIndex((obj => obj.user_id === action.payload.user_id));
        //         state.users_list[objIndex4].del_status = 0;
        //         success({
        //             title: action.payload.msg,
        //         });
        //     } else {
        //         error({
        //             title: action.payload.msg,
        //         });
        //     }
        //     return {
        //         ...state,
        //         users_list: [...state.users_list]
        //     }
        default:
            return state;

    }
}