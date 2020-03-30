import {
    DEVICES_LIST,
    SUSPEND_DEVICE,
    EDIT_DEVICE,
    ACTIVATE_DEVICE,
    LOADING,
    GET_DROPDOWN,
    POST_DROPDOWN,
    POST_PAGINATION,
    GET_PAGINATION,
    OFFLINE_DEVICES_STATUS,
    NEW_REQUEST_LIST
} from "../../constants/ActionTypes";

import {
    DEVICE_ID,
    DEVICE_REMAINING_DAYS,
    DEVICE_STATUS,
    DEVICE_MAC_ADDRESS,
    DEVICE_SERIAL_NUMBER,
    DEVICE_START_DATE,
    DEVICE_EXPIRY_DATE,
} from '../../constants/DeviceConstants';

import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error


const initialState = {
    devices: [],
    msg: "",
    showMsg: false,
    isloading: true,
    selectedOptions: [],
    options: [
        DEVICE_ID,
        DEVICE_REMAINING_DAYS,
        DEVICE_STATUS,
        DEVICE_MAC_ADDRESS,
        DEVICE_SERIAL_NUMBER,
        DEVICE_START_DATE,
        DEVICE_EXPIRY_DATE,
    ],
    newRequests: [],
};

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADING:
            return {
                ...state,
                isloading: true,
                msg: state.msg,
                showMsg: "hello",
                options: state.options,
                devices: [],
            }

        case DEVICES_LIST: {
            // if (action.payload.status) {
            //     success({
            //         title: action.payload.msg,
            //     });
            // }
            // else {
            //     error({
            //         title: action.payload.msg,
            //     });
            // }
            return {
                ...state,
                isloading: false,
                showMsg: "hello",
                devices: action.payload,
            }
        }

        case OFFLINE_DEVICES_STATUS: {
            console.log(state.devices, 'OFFLINE_DEVICES_STATUS reducer :: ', action.payload)
            if (action.payload.status) {
                console.log('record is: ', action.payload.devices)

                let objIndex = state.devices.findIndex((obj => obj.id == action.payload.devices[0].id));
                console.log('index is : ', objIndex);
                if (objIndex !== -1) {
                    console.log(state.devices[objIndex], 'record2 is: ', ...action.payload.devices);
                    state.devices[objIndex] = action.payload.devices[0];
                }
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
                devices: [...state.devices]
            }
        }
        // case SUSPEND_DEVICE: {
        //     if (action.response.status) {
        //         // console.log('dedlksjaflkj', action.response)
        //         let objIndex = state.devices.findIndex((obj => obj.device_id === action.response.data.device_id));
        //         if (objIndex !== -1) {
        //             state.devices[objIndex] = action.response.data;
        //         }
        //         success({
        //             title: action.response.msg,
        //         });
        //     }
        //     else {
        //         error({
        //             title: action.response.msg,
        //         });
        //     }


        //     return {
        //         ...state,
        //         devices: [...state.devices],
        //         msg: action.payload.msg,
        //         showMsg: true,
        //         options: state.options,
        //     }

        // }
        // case ACTIVATE_DEVICE:
        //     if (action.response.status) {
        //         let objIndex1 = state.devices.findIndex((obj => obj.device_id === action.response.data.device_id));
        //         if (objIndex1 !== -1) {
        //             state.devices[objIndex1] = action.response.data;
        //         }
        //         success({
        //             title: action.response.msg,
        //         });
        //     }
        //     else {
        //         error({
        //             title: action.response.msg,
        //         });

        //     }
        //     return {
        //         ...state,
        //         devices: [...state.devices],
        //         msg: action.payload.msg,
        //         showMsg: true,
        //         options: state.options,
        //     }


        case EDIT_DEVICE:

            if (action.response.status) {
                let objIndex4 = state.devices.findIndex((obj => obj.device_id === action.payload.formData.device_id));
                state.devices[objIndex4] = action.response.data[0];

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
                devices: [...state.devices],
                //    selectedOptions: [...state.selectedOptions],
                options: state.options,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                // options: state.options,
                // devices: action.payload,
            }

            break;

        case GET_DROPDOWN: {
            // console.log(GET_DROPDOWN);
            // console.log({
            //     ...state,
            //     selectedOptions: action.payload
            // });
            // console.log('reducer selected options', action.payload);
            if (action.payload.length === 0) {
                // console.log('array add', )
                action.payload[0] = 'ACTIONS';
            }
            // console.log('array', action.payload);
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
            return state
        }

        case POST_PAGINATION: {
            return state
        }

        default:
            return state;

    }
}