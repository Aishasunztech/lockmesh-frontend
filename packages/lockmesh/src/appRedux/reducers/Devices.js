import {
    DEVICES_LIST,
    SUSPEND_DEVICE,
    CONNECT_DEVICE,
    EDIT_DEVICE,
    ACTIVATE_DEVICE,
    LOADING,
    GET_DROPDOWN,
    POST_DROPDOWN,
    GET_SIM_IDS,
    GET_CHAT_IDS,
    GET_PGP_EMAILS,
    GET_USED_PGP_EMAILS,
    GET_USED_CHAT_IDS,
    GET_USED_SIM_IDS,
    REJECT_DEVICE,
    NEW_DEVICES_LIST,
    POST_PAGINATION,
    GET_PAGINATION,
    PRE_ACTIVATE_DEVICE,
    DELETE_UNLINK_DEVICE,
    UNFLAG_DEVICE,
    GET_PARENT_PACKAGES,
    GET_PRODUCT_PRICES,
    UNLINK_DEVICE,
    ADD_DEVICE,
    BULK_DEVICES_LIST,
    DEVICES_LIST_FOR_REPORT,
    TRANSFER_DEVICE,
    FLAG_DEVICE,
    GET_PARENT_HARDWARES,
    ACCEPT_REQUEST,
    ADD_PRODUCT,
    VALIDATE_ICCID,
    ADD_DATA_PLAN,
    RELINK_DEVICE,
    REJECT_RELINK_DEVICE,
    RESET_ADD_PRODUCT_PROPS,
    RESET_IDS
} from "../../constants/ActionTypes";

// import { convertToLang } from '../../routes/utils/commonUtils';

// import {
//     DEVICE_ID,
//     USER_ID,
//     DEVICE_REMAINING_DAYS,
//     DEVICE_FLAGGED,
//     DEVICE_STATUS,
//     DEVICE_MODE,
//     DEVICE_NAME,
//     DEVICE_ACTIVATION_CODE,
//     DEVICE_ACCOUNT_EMAIL,
//     DEVICE_PGP_EMAIL,
//     DEVICE_CHAT_ID,
//     DEVICE_CLIENT_ID,
//     DEVICE_DEALER_ID,
//     DEVICE_DEALER_PIN,
//     DEVICE_MAC_ADDRESS,
//     DEVICE_SIM_ID,
//     DEVICE_IMEI_1,
//     DEVICE_SIM_1,
//     DEVICE_IMEI_2,
//     DEVICE_SIM_2,
//     DEVICE_SERIAL_NUMBER,
//     DEVICE_MODEL,
//     DEVICE_START_DATE,
//     DEVICE_EXPIRY_DATE,
//     DEVICE_DEALER_NAME,
//     DEVICE_S_DEALER,
//     DEVICE_S_DEALER_NAME,


// } from '../../constants/DeviceConstants';

import SettingStates from './InitialStates';
import React from 'react';
import { message, Modal, Row, Col, Table } from 'antd';
import { DEVICE_PRE_ACTIVATION, DEVICE_UNLINKED } from "../../constants/Constants";
import { convertToLang, checkIsArray } from "../../routes/utils/commonUtils";

var { translation } = SettingStates;


const success = Modal.success
const error = Modal.error


const initialState = {
    devices: [],
    bulkDevices: [],
    // allDealers: [],
    // allUsers: [],
    msg: "",
    showMsg: false,
    isloading: true,
    selectedOptions: [],
    sim_ids: [],
    chat_ids: [],
    pgp_emails: [],

    parent_packages: [],
    parent_hardwares: [],
    // options: [
    //     { "key": DEVICE_ID, "value": convertToLang(translation[DEVICE_ID], DEVICE_ID) },
    //     { "key": USER_ID, "value": convertToLang(translation[USER_ID], USER_ID) },
    //     { "key": DEVICE_REMAINING_DAYS, "value": convertToLang(translation[DEVICE_REMAINING_DAYS], DEVICE_REMAINING_DAYS) },
    //     { "key": DEVICE_STATUS, "value": convertToLang(translation[DEVICE_STATUS], DEVICE_STATUS) },
    //     { "key": DEVICE_MODE, "value": convertToLang(translation[DEVICE_MODE], DEVICE_MODE) },
    //     { "key": DEVICE_FLAGGED, "value": convertToLang(translation[DEVICE_FLAGGED], DEVICE_FLAGGED) },
    //     { "key": DEVICE_NAME, "value": convertToLang(translation[DEVICE_NAME], DEVICE_NAME) },
    //     { "key": DEVICE_ACCOUNT_EMAIL, "value": convertToLang(translation[DEVICE_ACCOUNT_EMAIL], DEVICE_ACCOUNT_EMAIL) },
    //     { "key": DEVICE_CLIENT_ID, "value": convertToLang(translation[DEVICE_CLIENT_ID], DEVICE_CLIENT_ID) },
    //     { "key": DEVICE_ACTIVATION_CODE, "value": convertToLang(translation[DEVICE_ACTIVATION_CODE], DEVICE_ACTIVATION_CODE) },
    //     { "key": DEVICE_PGP_EMAIL, "value": convertToLang(translation[DEVICE_PGP_EMAIL], DEVICE_PGP_EMAIL) },
    //     { "key": DEVICE_SIM_ID, "value": convertToLang(translation[DEVICE_SIM_ID], DEVICE_SIM_ID) },
    //     { "key": DEVICE_CHAT_ID, "value": convertToLang(translation[DEVICE_CHAT_ID], DEVICE_CHAT_ID) },
    //     { "key": DEVICE_DEALER_ID, "value": convertToLang(translation[DEVICE_DEALER_ID], DEVICE_DEALER_ID) },
    //     { "key": DEVICE_DEALER_NAME, "value": convertToLang(translation[DEVICE_DEALER_NAME], DEVICE_DEALER_NAME) },
    //     { "key": DEVICE_DEALER_PIN, "value": convertToLang(translation[DEVICE_DEALER_PIN], DEVICE_DEALER_PIN) },
    //     { "key": DEVICE_MAC_ADDRESS, "value": convertToLang(translation[DEVICE_MAC_ADDRESS], DEVICE_MAC_ADDRESS) },
    //     { "key": DEVICE_IMEI_1, "value": convertToLang(translation[DEVICE_IMEI_1], DEVICE_IMEI_1) },
    //     { "key": DEVICE_SIM_1, "value": convertToLang(translation[DEVICE_SIM_1], DEVICE_SIM_1) },
    //     { "key": DEVICE_IMEI_2, "value": convertToLang(translation[DEVICE_IMEI_2], DEVICE_IMEI_2) },
    //     { "key": DEVICE_SIM_2, "value": convertToLang(translation[DEVICE_SIM_2], DEVICE_SIM_2) },
    //     { "key": DEVICE_SERIAL_NUMBER, "value": convertToLang(translation[DEVICE_SERIAL_NUMBER], DEVICE_SERIAL_NUMBER) },
    //     { "key": DEVICE_MODEL, "value": convertToLang(translation[DEVICE_MODEL], DEVICE_MODEL) },
    //     { "key": DEVICE_S_DEALER, "value": convertToLang(translation[DEVICE_S_DEALER], DEVICE_S_DEALER) },
    //     { "key": DEVICE_S_DEALER_NAME, "value": convertToLang(translation[DEVICE_S_DEALER_NAME], DEVICE_S_DEALER_NAME) },
    //     { "key": DEVICE_START_DATE, "value": convertToLang(translation[DEVICE_START_DATE], DEVICE_START_DATE) },
    //     { "key": DEVICE_EXPIRY_DATE, "value": convertToLang(translation[DEVICE_EXPIRY_DATE], DEVICE_EXPIRY_DATE) },
    // ],
    // options: ["DEVICE ID", "REMAINING DAYS", "FLAGGED", "STATUS", "MODE", "DEVICE NAME", "ACCOUNT EMAIL", "ACTIVATION CODE", "PGP EMAIL", "CHAT ID", "CLIENT ID", "DEALER ID", "DEALER PIN", "MAC ADDRESS", "SIM ID", "IMEI 1", "SIM 1", "IMEI 2", "SIM 2", "SERIAL NUMBER", "MODEL", "START DATE", "EXPIRY DATE", "DEALER NAME", "S-DEALER", "S-DEALER NAME"],
    newDevices: [],
    product_prices: [],
    devicesForReport: [],
    pgp_added: false,
    chat_added: false
};

export default (state = initialState, action) => {

    switch (action.type) {

        case LOADING:
            return {
                ...state,
                isloading: true,
                msg: state.msg,
                showMsg: "hello",
                // options: state.options,
                devices: [],
            }

        case DEVICES_LIST:
            return {
                ...state,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                // options: state.options,
                devices: action.payload,
            }

        case ACCEPT_REQUEST: {
            console.log("ACCEPT_REQUEST at devices", action);
            if (action.response.status) {
                // let objIndex = state.devices.findIndex((obj => obj.device_id === action.payload.device.device_id));
                // if (objIndex !== -1) {
                //     state.devices[objIndex].flagged = action.payload.device.flagged;
                //     state.devices[objIndex].finalStatus = action.payload.device.finalStatus;
                // }
            }
            return {
                ...state,
                // devices: [...state.devices]
            }

        }

        case FLAG_DEVICE: {
            if (action.response.status) {
                let objIndex = state.devices.findIndex((obj => obj.device_id === action.payload.device.device_id));
                if (objIndex !== -1) {
                    state.devices[objIndex].flagged = action.payload.device.flagged;
                    state.devices[objIndex].finalStatus = action.payload.device.finalStatus;
                }
            }
            return {
                ...state,
                devices: [...state.devices]
            }
        }

        case UNFLAG_DEVICE: {
            if (action.response.status) {
                //
                let objIndex = state.devices.findIndex((obj => obj.device_id === action.payload.device.device_id));
                if (objIndex !== -1) {
                    state.devices[objIndex].flagged = 'Not flagged';
                    state.devices[objIndex].finalStatus = action.payload.device.finalStatus;
                }
            }
            return {
                ...state,
                devices: [...state.devices]
            }
        }

        case UNLINK_DEVICE: {
            // console.log("UNLINK_DEVICE reducer:: ", action.payload)
            let stateDevices = state.devices;

            if (action.response.status) {
                success({
                    title: action.response.msg,
                });

                let objIndex = stateDevices.findIndex((obj => obj.device_id === action.payload.device_id));
                // console.log("objIndex ", objIndex)
                if (objIndex !== -1) {
                    stateDevices[objIndex].unlink_status = 1;
                    stateDevices[objIndex].finalStatus = "Unlinked";
                }

                // if (action.isTransferred) {
                //     devices = stateDevices.filter((obj => obj.device_id !== action.payload.device_id));
                // }
                // console.log("stateDevices", stateDevices)
            } else {
                error({
                    title: action.response.msg,
                });
            }
            // console.log('unlink called');
            return {
                ...state,
                isLoading: false,
                devices: [...stateDevices]
            }
        }

        case TRANSFER_DEVICE: {
            let stateDevices = state.devices;
            // console.log('check devices', stateDevices)
            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                let objIndex = stateDevices.findIndex((obj => obj.device_id === action.payload.device_id));
                if (objIndex !== -1) {
                    stateDevices[objIndex].finalStatus = 'Transfered';
                    stateDevices[objIndex].transfer_status = 1;
                }
            } else {
                error({
                    title: action.response.msg,
                });
            }
            // console.log('unlink called');
            return {
                ...state,
                isLoading: false,
                devices: [...stateDevices]
            }
        }

        case NEW_DEVICES_LIST: {
            //
            return {
                ...state,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                // options: state.options,
                newDevices: action.payload,
            }
        }
        case SUSPEND_DEVICE: {
            if (action.response.status) {
                //
                let objIndex = state.devices.findIndex((obj => obj.device_id === action.response.data.device_id));
                if (objIndex !== -1) {
                    state.devices[objIndex] = action.response.data;
                }
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
                msg: action.payload.msg,
                showMsg: true,
                // options: state.options,
            }
        }

        // case UNLINK_DEVICE:
        //     if (action.response.status) {
        //
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
        //         isLoading: false
        //     }


        case ACTIVATE_DEVICE: {
            if (action.response.status) {
                let objIndex1 = state.devices.findIndex((obj => obj.device_id === action.response.data.device_id));
                if (objIndex1 !== -1) {
                    state.devices[objIndex1] = action.response.data;
                }
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
                msg: action.payload.msg,
                showMsg: true,
                // options: state.options,
            }
        }

        case DELETE_UNLINK_DEVICE:
            let type = DEVICE_UNLINKED
            if (action.response.status) {
                if (action.payload.type === 'pre-active') {
                    type = DEVICE_PRE_ACTIVATION
                }
                // console.log(action.response.data, type, action);
                for (let id of action.response.data) {
                    let objIndex = state.devices.findIndex((obj => obj.id === id && obj.finalStatus == type));
                    console.log(objIndex);
                    state.devices.splice(objIndex, 1);
                }
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });
            }
            return {
                ...state,
                devices: [...state.devices],
                // options: state.options
            }

        case CONNECT_DEVICE:
            return {
                ...state,
            }
            break;

        case EDIT_DEVICE: {
            if (!action.response.status) {
                error({
                    title: action.response.msg,
                });
                return {
                    ...state
                }
            }

            let filteredDevices = state.newDevices;
            let editDevices = state.devices;

            let foundDeviceIndex = checkIsArray(editDevices).findIndex((obj => obj.device_id === action.payload.formData.device_id));
            // console.log('Data: ', action.response.data[0]);
            // console.log('device id: ', action.payload.formData.device_id);
            // console.log('foundDeviceIndex: ', foundDeviceIndex);
            if(foundDeviceIndex!==-1){
                editDevices[foundDeviceIndex] = action.response.data[0];
                // console.log(editDevices);
            }

            /**
             * @description yeh code nahe bghairti he
             */
            // var alldevices = state.newDevices;
            // var device_id = action.payload.formData.device_id;
            // filteredDevices = checkIsArray(alldevices).filter(device => device.device_id !== device_id);

            success({
                title: action.response.msg,
            });


            return {
                ...state,
                devices: [...editDevices],
                newDevices: filteredDevices,
                // selectedOptions: [...state.selectedOptions],
                // options: state.options,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                options: state.options,
                // devices: action.payload,
            }
        }

        case ADD_DATA_PLAN:
            if (action.response.status) {
                let objIndex4 = state.devices.findIndex((obj => obj.id === action.payload.formData.usr_acc_id));
                state.devices[objIndex4] = action.response.data;
                var device_id = action.payload.formData.device_id;
                // filteredDevices = alldevices.filter(device => device.device_id !== device_id);

                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                devices: [...state.devices],
            }

        case ADD_DEVICE: {

            var filteredNewDevices = state.newDevices;
            let devicess = JSON.parse(JSON.stringify(state.devices))
            if (action.response.status) {
                var device_id = action.payload.formData.device_id;
                console.log(state.devices, 'add device reducer', action.response)
                let index = state.devices.findIndex(dev => dev.device_id == device_id)
                console.log(index, 'index is the');

                if (index > -1) {
                    devicess[index] = action.response.data[0]
                } else {
                    devicess.unshift(action.response.data[0])
                }
                var alldevices = state.newDevices;

                filteredNewDevices = checkIsArray(alldevices).filter(device => device.device_id !== device_id);

                let randerData = [
                    {
                        key: "device_id",
                        left: "DEVICE ID :",
                        right: action.response.data[0].device_id ? action.response.data[0].device_id : 'N/A'
                    },
                    {
                        key: "user_id",
                        left: "USER ID :",
                        right: action.response.data[0].user_id
                    },
                    {
                        key: "status",
                        left: "STATUS :",
                        right: action.response.data[0].finalStatus
                    },
                    {
                        key: "pgp_email",
                        left: "PGP EMAIL :",
                        right: action.response.data[0].pgp_email
                    },
                    {
                        key: "chat_id",
                        left: "CHAT ID :",
                        right: action.response.data[0].chat_id
                    },
                    {
                        key: "sim_id",
                        left: "SIM ID :",
                        right: action.response.data[0].sim_id
                    },
                    {
                        key: "sim_id2",
                        left: "SIM ID 2 :",
                        right: action.response.data[0].sim_id2
                    },
                    {
                        key: "expiry_date",
                        left: "EXPIRY DATE :",
                        right: action.response.data[0].expiry_date
                    },
                ]
                // state.devices.push(action.response.data.data)
                let successHtml = <div>
                    <h3>Device Activated Successfully</h3>
                    <Table
                        columns={[
                            {
                                title: "",
                                align: "center",
                                dataIndex: 'left',
                                key: "left",
                                className: 'weight_400',

                            },
                            {
                                title: "",
                                align: "center",
                                dataIndex: 'right',
                                key: "right",
                                className: '',
                            },
                        ]}
                        showHeader={false}

                        bordered={false}
                        dataSource={randerData}
                        pagination={false}
                        className='addDevcie_popup'
                    />
                </div>


                // console.log(filteredNewDevices, 'filtered new devices', alldevices)
                success({
                    title: successHtml
                });
            }
            else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                devices: devicess,
                newDevices: filteredNewDevices,
                //    selectedOptions: [...state.selectedOptions],
                // options: state.options,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
                options: state.options,
                // devices: action.payload,
            }
        }

        case RELINK_DEVICE: {

            var filteredNewDevices = state.newDevices;
            let devicess = JSON.parse(JSON.stringify(state.devices))
            if (action.response.status) {
                var user_acc_id = action.user_acc_id;
                console.log(state.devices, 'add device reducer')
                let index = state.devices.findIndex(dev => dev.id == user_acc_id)
                console.log(index, 'index is the', action.response.data);

                if (index > -1) {
                    devicess[index] = action.response.data
                } else {
                    devicess.unshift(action.response.data)
                }

                var alldevices = state.newDevices;

                filteredNewDevices = checkIsArray(alldevices).filter(device => device.id !== user_acc_id);

                // console.log(filteredNewDevices, 'filtered new devices', alldevices)
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
                devices: devicess,
                newDevices: filteredNewDevices,
            }
        }

        // case REJECT_RELINK_DEVICE: {

        //     let filteredDevices = state.devices;
        //     let filteredNewDevices = state.newDevices;
        //     if (action.response.status) {
        //         //
        //         var alldevices = state.devices;
        //         var device_id = action.device.device_id;
        //         filteredDevices = alldevices.filter(device => device.device_id !== device_id);
        //         filteredNewDevices = filteredNewDevices.filter(device => device.device_id !== device_id);
        //         success({
        //             title: action.response.msg,
        //         });
        //     } else {
        //         error({
        //             title: action.response.msg,
        //         });
        //     }

        //     return {
        //         ...state,
        //         devices: filteredDevices,
        //         newDevices: filteredNewDevices,
        //     }
        // }

        case PRE_ACTIVATE_DEVICE:
            let devices = [...state.devices]
            if (action.response.status) {
                let randerData = [
                    {
                        key: "activation_code",
                        left: "ACTIVATION CODE :",
                        right: action.response.data.data[0].activation_code ? action.response.data.data[0].activation_code : 'N/A '
                    },
                    {
                        key: "device_id",
                        left: "DEVICE ID :",
                        right: action.response.data.data[0].device_id ? action.response.data.data[0].device_id : 'N/A'
                    },
                    {
                        key: "user_id",
                        left: "USER ID :",
                        right: action.response.data.data[0].user_id
                    },
                    {
                        key: "status",
                        left: "STATUS :",
                        right: action.response.data.data[0].finalStatus
                    },
                    {
                        key: "pgp_email",
                        left: "PGP EMAIL :",
                        right: action.response.data.data[0].pgp_email
                    },
                    {
                        key: "chat_id",
                        left: "CHAT ID :",
                        right: action.response.data.data[0].chat_id
                    },
                    {
                        key: "sim_id",
                        left: "SIM ID :",
                        right: action.response.data.data[0].sim_id
                    },
                    {
                        key: "sim_id2",
                        left: "SIM ID 2 :",
                        right: action.response.data.data[0].sim_id2
                    },
                    {
                        key: "expiry_months",
                        left: "EXPIRY MONTHS :",
                        right: action.response.data.data[0].expiry_months
                    },
                ]
                // state.devices.push(action.response.data.data)
                let successHtml = <div>
                    <h3>Pre Active Device generated Successfully</h3>
                    <Table
                        columns={[
                            {
                                title: "",
                                align: "center",
                                dataIndex: 'left',
                                key: "left",
                                className: 'weight_400',

                            },
                            {
                                title: "",
                                align: "center",
                                dataIndex: 'right',
                                key: "right",
                                className: '',
                            },
                        ]}
                        showHeader={false}

                        bordered={false}
                        dataSource={randerData}
                        pagination={false}
                        className='addDevcie_popup'
                    />
                </div>
                // console.log(filteredNewDevices, 'filtered new devices', alldevices)
                success({
                    title: successHtml,
                    // width : 362
                });
                devices = [...action.response.data.data, ...state.devices]
                // message.success('done');
            } else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                devices: devices,
                // selectedOptions: [...state.selectedOptions],
                // options: state.options,
                isloading: false,
                msg: state.msg,
                showMsg: "hello",
            }


        case GET_DROPDOWN: {
            //
            //
            // console.log({
            //     ...state,
            //     selectedOptions: action.payload
            // });
            //
            if (action.payload.length === 0) {
                //
                action.payload[0] = 'ACTIONS';
            }
            //
            return {
                ...state,
                selectedOptions: action.payload
            }
        }

        case GET_PAGINATION: {
            //
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

        case RESET_IDS: {

            return {
                ...state,
                sim_ids: [],
                chat_ids: [],
                pgp_emails: []
            }
        }
        case GET_SIM_IDS: {
            //
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

        case REJECT_DEVICE: {

            let filteredDevices = state.devices;
            let filteredNewDevices = state.newDevices;
            if (action.response.status) {
                //
                var alldevices = state.devices;
                var device_id = action.device.device_id;
                filteredDevices = checkIsArray(alldevices).filter(device => device.device_id !== device_id);
                filteredNewDevices = checkIsArray(filteredNewDevices).filter(device => device.device_id !== device_id);
                success({
                    title: action.response.msg,
                });
            } else {
                error({
                    title: action.response.msg,
                });
            }

            return {
                ...state,
                devices: filteredDevices,
                newDevices: filteredNewDevices,
            }
        }

        case GET_PARENT_PACKAGES: {

            return {
                ...state,
                parent_packages: action.response.data,
            }
        }

        case GET_PARENT_HARDWARES: {
            return {
                ...state,
                parent_hardwares: action.response.data,
            }
        }

        case GET_PRODUCT_PRICES: {
            //
            return {
                ...state,
                product_prices: action.response.data,
            }
        }

        case DEVICES_LIST_FOR_REPORT: {
            return {
                ...state,
                devicesForReport: action.payload.data,
            }
        }

        case ADD_PRODUCT: {
            let pgp_emails = state.pgp_emails;
            let chat_ids = state.chat_ids;
            let chat_added = false
            let pgp_added = false
            if (action.payload.status) {
                if (action.payload.type === 'chat_id') {
                    chat_ids.unshift(action.payload.product);
                    success({
                        title: "Chat ID has been generated successfully."
                    })
                    chat_added = true
                    // console.log(chat_ids);
                } else if (action.payload.type === 'pgp_email') {
                    pgp_emails.unshift(action.payload.product);
                    let deviceIndex = state.devices.findIndex(item => item.id == action.payload.user_acc_id)
                    // console.log(deviceIndex);
                    if (deviceIndex > -1) {
                        state.devices[deviceIndex].pgp_remaining_limit = state.devices[deviceIndex].pgp_remaining_limit - 1
                    }
                    // console.log(pgp_emails)
                    success({
                        title: "Pgp email has been generated successfully."
                    })
                    pgp_added = true
                }
                else if (action.payload.type === 'sim_id') {
                    success({
                        title: "Sim ID has been generated successfully."
                    })
                }

            } else {
                error({
                    title: action.payload.msg,
                });
            }
            return {
                ...state,
                pgp_emails: [...pgp_emails],
                chat_ids: [...chat_ids],
                chat_added: chat_added,
                pgp_added: pgp_added,
                devices: [...state.devices]
            }
        }

        case RESET_ADD_PRODUCT_PROPS: {
            return {
                ...state,
                chat_added: false,
                pgp_added: false
            }
        }


        default:
            return state;

    }
}
