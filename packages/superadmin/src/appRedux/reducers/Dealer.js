import {
    DEALERS_LIST,
    SUSPEND_DEALERS,
    DELETE_DEALERS,
    EDIT_DEALER,
    CHANGE_PASSWORD,
    ACTIVATE_DEALER,
    UNDO_DEALER,
    ADD_DEALER,
    LOADING,
    GET_DROPDOWN,
    POST_DROPDOWN,
    GET_PAGINATION,
    SPIN_lOADING
} from "constants/ActionTypes";

import {
    DEALER_ID,
    DEALER_NAME,
    DEALER_EMAIL,
    DEALER_PIN,
    DEALER_DEVICES,
    DEALER_TOKENS
} from '../../constants/DealerConstants';
import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error

const initialState = {
    isloading: false,
    subIsloading: false,
    dealers: [],
    suspended: 'no change',
    action: '',
    msg: 'no message',
    selectedOptions: [],
    options: [
        DEALER_ID,
        DEALER_NAME,
        DEALER_EMAIL,
        DEALER_PIN,
        DEALER_DEVICES,
        DEALER_TOKENS
    ],
    // options: ["DEALER ID", "DEALER NAME", "DEALER EMAIL", "DEALER PIN", "DEVICES", "TOKENS"],

};

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADING:

            return {
                ...state,
                isloading: true,
                dealers: [],
                options: state.options
            }

        case SPIN_lOADING:

            return {
                ...state,
                spinloading: true,
                options: state.options
            }

        case DEALERS_LIST:
            // console.log('DEALERS_LIST');
            // console.log(action.payload);
            return {
                ...state,
                isloading: false,
                spinloading: false,
                dealers: action.payload,
                options: state.options
            }

        case SUSPEND_DEALERS:

            if (action.response.status === true) {
                let objIndex = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                state.dealers[objIndex].account_status = "suspended";
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
                dealers: [...state.dealers],
                isloading: false,
                suspended: action.payload.msg,
                action: action.payload,
            }


        case ACTIVATE_DEALER:

            if (action.response.status) {
                let objIndex1 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                state.dealers[objIndex1].account_status = null;
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
                dealers: [...state.dealers],
                isloading: false,
                suspended: action.payload.msg,
                action: action.payload,
            }



        case DELETE_DEALERS:

            if (action.response.status) {
                let objIndex2 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                state.dealers[objIndex2].unlink_status = 1;
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
                dealers: [...state.dealers],
                isloading: false,
                action: action.payload,
            }


        case UNDO_DEALER:

            if (action.response.status) {
                let objIndex3 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.id));
                state.dealers[objIndex3].unlink_status = 0;
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
                dealers: [...state.dealers],
                isloading: false,
                action: action.payload,
            }


        case CHANGE_PASSWORD:

            if (action.response.status) {

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
                dealers: [...state.dealers],
                isloading: false,
                action: action.payload,
            }


        case EDIT_DEALER:

            if (action.response.status) {

                let objIndex4 = state.dealers.findIndex((obj => obj.dealer_id === action.payload.formData.dealer_id));
                if (objIndex4 !== undefined) {
                    state.dealers[objIndex4].dealer_name = action.payload.formData.name;
                    if (action.response.alreadyAvailable === false) {
                        state.dealers[objIndex4].dealer_email = action.payload.formData.email;
                    }
                }
                if (action.response.alreadyAvailable === false) {
                    success({
                        title: action.response.msg,
                    });
                } else {
                    error({
                        title: "Given email is already in use. Please choose different Email",
                    });
                }
            }
            else {
                error({
                    title: action.response.msg,
                });
            }

            return {

                dealers: [...state.dealers],
                selectedOptions: [...state.selectedOptions],
                isloading: false,
                action: action.payload,
            }


        case ADD_DEALER:
            // console.log('item added is:',action.response.item_added[0])

            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                // if(action.response.item_added[0] !== undefined)
                // {
                //     state.dealers.push({'dchec':'lsdkflk'})
                // }
                //  console.log('daelers length',state.dealers.length)
                //  state.dealers[state.dealers.length] = action.response.item_added[0];
            }
            else {
                error({
                    title: action.response.msg,
                });
            }
            // console.log('msg', action.payload.msg)
            return {
                ...state,
                isloading: false,
                dealers: [...state.dealers],
                options: [...state.options],

            }
            break;
        case GET_DROPDOWN: {
            // console.log(GET_DROPDOWN);
            // console.log({
            //     ...state,
            //     selectedOptions: action.payload
            // });
            return {
                ...state,
                selectedOptions: action.payload
            }
        }

        case GET_PAGINATION: {
            // console.log(GET_DROPDOWN);
            // console.log({
            //     ...state,
            //     selectedOptions: action.payload
            // });
            return {
                ...state,
                DisplayPages: action.payload
            }
        }

        case POST_DROPDOWN: {
            return {
                ...state
            }
        }
        default:
            return state;

    }
}