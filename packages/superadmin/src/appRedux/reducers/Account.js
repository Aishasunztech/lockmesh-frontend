import {
    IMPORT_CSV,
    GET_USED_PGP_EMAILS,
    GET_USED_CHAT_IDS,
    GET_USED_SIM_IDS,
    GET_PGP_EMAILS,
    GET_CHAT_IDS,
    GET_SIM_IDS,
    RELEASE_CSV,
    DUPLICATE_SIM_IDS,
    NEW_DATA_INSERTED,
    CHECK_DEALER_PIN,
    DELETE_IDS,
    SYNC_IDS,
    GET_SALE_LIST,
    GET_DEALER_LIST,
    GET_DEVICE_LIST
} from "../../constants/ActionTypes";
import { message, Modal } from "antd";

const success = Modal.success
const error = Modal.error

const initialState = {
    msg: "",
    showMsg: false,
    used_pgp_emails: [],
    used_sim_ids: [],
    used_chat_ids: [],
    sim_ids: [],
    chat_ids: [],
    pgp_emails: [],
    duplicate_ids: [],
    duplicate_modal_show: false,
    duplicate_data_type: '',
    newData: [],
    salesList: [],
    dealerList: [],
    deviceList: []
};

export default (state = initialState, action) => {

    switch (action.type) {

        case IMPORT_CSV:
            return {
                ...state,
                msg: action.payload.msg,
                showMsg: action.showMsg,
            }
        case GET_USED_PGP_EMAILS: {
            // alert("hello");
            return {
                ...state,
                used_pgp_emails: action.payload
            }
        }
        case GET_SIM_IDS: {
            // console.log(GET_SIM_IDS);
            // console.log(
            //     action.payload
            // )
            return {
                ...state,
                sim_ids: action.payload
            }
        }
        case GET_CHAT_IDS: {
            return {
                ...state,
                chat_ids: action.payload
            }
        }
        case GET_PGP_EMAILS: {
            // alert("hello");
            return {
                ...state,
                pgp_emails: action.payload
            }
        }
        case GET_USED_CHAT_IDS: {
            // alert("hello");
            return {
                ...state,
                used_chat_ids: action.payload
            }
        }
        case GET_USED_SIM_IDS: {
            // alert("hello");
            return {
                ...state,
                used_sim_ids: action.payload
            }
        }

        case NEW_DATA_INSERTED: {

            if (action.payload.status && action.showMsg) {
                success({
                    title: action.payload.msg,
                });
            } else if (action.payload.status == false && action.showMsg) {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                duplicate_ids: [],
                duplicate_data_type: '',
                duplicate_modal_show: false,
                newData: []

            }
        }

        case DUPLICATE_SIM_IDS: {
            return {
                ...state,
                duplicate_ids: action.payload.duplicateData,
                duplicate_data_type: action.payload.type,
                duplicate_modal_show: true,
                newData: action.payload.newData
            }
        }

        case DELETE_IDS: {
            // alert("hello");
            // console.log(action.response);
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
            if (action.response.data) {

                if (action.response.type === 'sim') {
                    return {
                        ...state,
                        sim_ids: action.response.data
                    }
                } else if (action.response.type === 'chat') {
                    return {
                        ...state,
                        chat_ids: action.response.data
                    }
                } else if (action.response.type === 'pgp') {
                    return {
                        ...state,
                        pgp_emails: action.response.data
                    }
                } else {
                    return {
                        ...state,
                    }
                }
            }
            else {
                return {
                    ...state,
                }
            }
        }

        case SYNC_IDS: {
            if (action.response.status) {
                if (action.isButton) {
                    success({
                        title: action.response.msg
                    })
                }
                return {
                    ...state,
                    pgp_emails: action.response.pgp_emails,
                    chat_ids: action.response.chat_ids,
                    sim_ids: action.response.sim_ids
                }
            } else {
                if (action.isButton) {
                    error({
                        title: action.response.msg
                    })
                }
                return {
                    ...state
                }
            }
        }

        case GET_SALE_LIST: {
            // alert("hello");
            // console.log(action.payload);
            return {
                ...state,
                salesList: action.payload
            }
        }
        case GET_DEALER_LIST: {
            return {
                ...state,
                dealerList: action.payload
            }
        }

        case GET_DEVICE_LIST: {
            return {
                ...state,
                deviceList: action.payload
            }
        }
        default:
            return state;
    }
}