import {
    RESET_UPLOAD_FORM,
    RESTART_WHITELABEL
    // ADD_APK
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error

const initialState = {
    isloading: false,
};

export default (state = initialState, action) => {

    switch (action.type) {

        case RESTART_WHITELABEL:

            if (action.payload.status) {
                success({
                    title: action.payload.msg,
                });
            } else {
                error({
                    title: action.payload.msg,
                });;
            }

            return {
                ...state,
            }

        default:

            return state;

    }
}