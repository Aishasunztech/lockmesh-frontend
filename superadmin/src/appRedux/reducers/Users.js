import {
    SAVE_USERS,
    LOAD_USER,
    LOADING,
    USERS_LIST,
    EDIT_USERS,
    DELETE_USER,
    UNDO_DELETE_USER
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
const success = Modal.success
const error = Modal.error

const initialState = {
    isloading: false,
    addUserFlag: false,
    subIsloading: false,
    users_list: [],
    action: '',
    msg: 'no message',

};

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADING:

            return {
                ...state,
                isloading: true,
                users: [],
            }
        case SAVE_USERS:
            // console.log('item added is:', action.response.user)
            let result = []
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                result = [...action.response.user, ...state.users_list]
            }
            else {
                error({
                    title: action.response.msg,
                });
                result = state.users_list
            }
            // console.log(result);
            return {
                ...state,
                isloading: false,
                addUserFlag: false,
                users_list: result,
            }
        case EDIT_USERS:
            console.log('item added is:', action.response)
            if (action.response.status) {
                let objIndex4 = state.users_list.findIndex((obj => obj.user_id === action.payload.userData.user_id));
                state.users_list[objIndex4] = action.response.user[0];

                success({
                    title: action.response.msg,
                });
            }
            else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                isloading: false,
                addUserFlag: false,
                users_list: [...state.users_list]
            }

        case LOAD_USER:
            return {
                ...state,
                addUserFlag: true,
            }

        case USERS_LIST:
            // console.log('item added is:', action.payload.users_list)
            return {
                ...state,
                isloading: false,
                users_list: action.payload.users_list,
            }
        case DELETE_USER:
            if (action.payload.status) {
                let objIndex4 = state.users_list.findIndex((obj => obj.user_id === action.payload.user_id));
                state.users_list[objIndex4].del_status = 1;
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
                users_list: [...state.users_list]
            }
        case UNDO_DELETE_USER:
            if (action.payload.status) {
                let objIndex4 = state.users_list.findIndex((obj => obj.user_id === action.payload.user_id));
                state.users_list[objIndex4].del_status = 0;
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
                users_list: [...state.users_list]
            }
        default:
            return state;

    }
}