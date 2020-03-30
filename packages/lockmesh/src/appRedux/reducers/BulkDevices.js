
import moment from 'moment';
import {
    BULK_SUSPEND_DEVICES, LOADING, BULK_DEVICES_LIST, BULK_LOADING, BULK_ACTIVATE_DEVICES, BULK_HISTORY, BULK_PUSH_APPS, SET_PUSH_APPS, SET_PULL_APPS, BULK_PULL_APPS, SET_SELECTED_BULK_DEVICES, UNLINK_BULK_DEVICES, WIPE_BULK_DEVICES, CLOSE_RESPONSE_MODAL, APPLY_BULK_POLICY, SET_BULK_MESSAGE, SEND_BULK_MESSAGE, SEND_BULK_WIPE_PASS, HANDLE_BULK_WIPE_PASS, BULK_HISTORY_LOADING, SET_BULK_ACTION, SET_BULK_DATA, GET_BULK_MSGS, DELETE_BULK_MSG, UPDATE_BULK_MESSAGE
} from "../../constants/ActionTypes";
import { message, Modal } from 'antd';
import { SERVER_TIMEZONE, TIMESTAMP_FORMAT } from "../../constants/Application";
import { checkIsArray } from '../../routes/utils/commonUtils';


const success = Modal.success
const error = Modal.error
const warning = Modal.warning;


const initialState = {
    bulkDevices: [], // all filtered devices
    bulkDevicesHistory: [],
    msg: "",
    showMsg: false,
    isloading: false,
    usersOfDealers: [],
    selectedDevices: [], // again filter devices against applied action
    noOfApp_push_pull: 0,
    bulkSelectedPushApps: [],
    bulkSelectedPullApps: [],
    bulkResponseModal: false,
    responseStatus: false,
    failed_device_ids: [],
    queue_device_ids: [],
    pushed_device_ids: [],
    expire_device_ids: [],
    response_modal_action: '',
    bulkMsg: '',
    bulkWipePassModal: false,
    wipePassMsg: '',
    bulkMsgs: [],
    history_loading: false,
    bulkAction: '',
    bulkDealers: [],
    bulkUsers: [],
    errorAction: ''
};

export default (state = initialState, action) => {

    switch (action.type) {

        case HANDLE_BULK_WIPE_PASS: {
            return {
                ...state,
                bulkWipePassModal: action.payload
            }
        }

        case SET_PUSH_APPS: {
            return {
                ...state,
                bulkSelectedPushApps: action.payload
            }
        }

        case SET_PULL_APPS: {
            return {
                ...state,
                bulkSelectedPullApps: action.payload
            }
        }

        case SET_SELECTED_BULK_DEVICES: {
            return {
                ...state,
                selectedDevices: action.payload
            }
        }


        case BULK_LOADING:
            return {
                ...state,
                isloading: true,
                msg: state.msg,
                showMsg: "hello",
                bulkDevices: [],
            }

        case BULK_HISTORY_LOADING: {
            return {
                ...state,
                history_loading: true
            }
        }

        case BULK_HISTORY: {

            // console.log("action.payload history at red : ", action.payload)
            if (action.payload.status) {
                return {
                    ...state,
                    isloading: false,
                    history_loading: false,
                    bulkDevicesHistory: action.payload.history,
                }
            } else {
                return {
                    ...state,
                    isloading: false,
                    history_loading: false
                }
            }
        }



        case BULK_DEVICES_LIST:
            // console.log("action.payload BULK_DEVICES_LIST, ", action.payload)
            if (action.payload.status) {
                return {
                    ...state,
                    isloading: false,
                    bulkDevices: action.payload.data,
                    selectedDevices: [],
                    usersOfDealers: action.payload.users_list
                }
            } else {
                return {
                    ...state,
                }
            }

        case GET_BULK_MSGS:
            // console.log("action.payload GET_BULK_MSGS, ", action.payload.data)
            return {
                ...state,
                bulkMsgs: action.payload.data,
            }


        case BULK_SUSPEND_DEVICES: {
            // console.log('BULK_SUSPEND_DEVICES reducer data:: ', action.payload, state.selectedDevices);

            let updatePrevBulkDevices = [];
            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {

                let allSuspendedDevices = [...action.payload.data.queue_device_ids, ...action.payload.data.pushed_device_ids];
                updatePrevBulkDevices = checkIsArray(state.bulkDevices).map((item) => {
                    let bulkObjIndex = allSuspendedDevices.findIndex(obj => obj === item.device_id);
                    if (bulkObjIndex !== -1) {
                        item.finalStatus = "Suspended";
                        item.account_status = "suspended";
                    }
                    return item;
                })
                if (action.payload.online && !action.payload.offline && !action.payload.failed && !action.payload.expire) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed && !action.payload.expire) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else if (!action.payload.online && !action.payload.offline && !action.payload.failed && action.payload.expire) {
                    warning({
                        title: action.payload.msg,
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    state.expire_device_ids = action.payload.data.expire_device_ids;
                    showResponseModal = true;
                }

            } else {
                updatePrevBulkDevices = state.bulkDevices;
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                bulkDevices: updatePrevBulkDevices,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                expire_device_ids: [...state.expire_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "suspend",

                responseStatus: action.payload.status,

                selectedDevices: [],
                bulkDevices: [],
                bulkAction: '',
                bulkDealers: [],
                bulkUsers: [],
                errorAction: ''
            }
        }

        case BULK_ACTIVATE_DEVICES: {
            // console.log('BULK_ACTIVATE_DEVICES reducer data:: ', action.payload);

            let updatePrevBulkDevices = [];
            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {

                let allSuspendedDevices = [...action.payload.data.queue_device_ids, ...action.payload.data.pushed_device_ids];
                updatePrevBulkDevices = checkIsArray(state.bulkDevices).map((item) => {
                    let bulkObjIndex = allSuspendedDevices.findIndex(obj => obj === item.device_id);
                    if (bulkObjIndex !== -1) {
                        item.finalStatus = "Active";
                        item.account_status = "";
                    }
                    return item;
                })
                if (action.payload.online && !action.payload.offline && !action.payload.failed && !action.payload.expire) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed && !action.payload.expire) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else if (!action.payload.online && !action.payload.offline && !action.payload.failed && action.payload.expire) {
                    warning({
                        title: action.payload.msg,
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    state.expire_device_ids = action.payload.data.expire_device_ids;
                    showResponseModal = true;
                }

            } else {
                updatePrevBulkDevices = state.bulkDevices;
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                bulkDevices: updatePrevBulkDevices,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                expire_device_ids: [...state.expire_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "active",
                responseStatus: action.payload.status,

                selectedDevices: [],
                bulkDevices: [],
                bulkAction: '',
                bulkDealers: [],
                bulkUsers: [],
                errorAction: ''
            }
        }


        case BULK_PUSH_APPS: {
            console.log('BULK_PUSH_APPS reducer data:: ', action.payload);

            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {
                if (action.payload.online && !action.payload.offline && !action.payload.failed) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    showResponseModal = true;
                }

            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "push",
                responseStatus: action.payload.status,

                // bulkSelectedPushApps: []
                selectedDevices: [],
                bulkDevices: [],
                bulkAction: '',
                bulkDealers: [],
                bulkUsers: [],
                errorAction: ''
            }
        }


        case UPDATE_BULK_MESSAGE: {
            // console.log('UPDATE_BULK_MESSAGE reducer data:: ', action.msg_data);

            if (action.payload.status) {
                let index = state.bulkMsgs.findIndex(item => item.id === action.msg_data.id);
                let updateMsg = action.msg_data;
                updateMsg['date_time'] = action.dealerTZ ? moment(updateMsg.date_time).tz(SERVER_TIMEZONE).tz(action.dealerTZ).format(TIMESTAMP_FORMAT) : 'N/A';
                state.bulkMsgs[index] = updateMsg;
                // console.log("updateMsg ", updateMsg);
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
                bulkMsgs: [...state.bulkMsgs]
            }
        }

        case BULK_PULL_APPS: {
            // console.log('BULK_PULL_APPS reducer data:: ', action.payload);

            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {
                if (action.payload.online && !action.payload.offline && !action.payload.failed) {
                    success({
                        title: action.payload.msg, // "Apps are Being puslled"
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    showResponseModal = true;
                }

            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "pull",

                responseStatus: action.payload.status,
                // bulkSelectedPullApps: []
                selectedDevices: [],
                bulkDevices: [],
                bulkAction: '',
                bulkDealers: [],
                bulkUsers: [],
                errorAction: ''
            }
        }

        case UNLINK_BULK_DEVICES: {
            // console.log('UNLINK_BULK_DEVICES reducer data:: ', action.payload, "state.bulkDevices ", state.bulkDevices);

            let updatePrevBulkDevices = [];
            let showResponseModal = state.bulkResponseModal;
            if (action.payload.status) {

                let allUnlinkedDevices = [...action.payload.data.queue_device_ids, ...action.payload.data.pushed_device_ids];
                // console.log("allUnlinkedDevices ", allUnlinkedDevices);
                updatePrevBulkDevices = checkIsArray(state.bulkDevices).filter(item => !allUnlinkedDevices.includes(item.device_id))
                // updatePrevBulkDevices = checkIsArray(state.bulkDevices).map((item) => {
                // let bulkObjIndex = allUnlinkedDevices.findIndex(obj => obj === item.device_id);
                // if (bulkObjIndex !== -1) {
                //     // item.finalStatus = "Unlinked";
                //     // item.unlink_status = 1;
                //     return item;
                // }
                // })
                if (action.payload.online && !action.payload.offline && !action.payload.failed) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    showResponseModal = true;
                }

            } else {
                updatePrevBulkDevices = state.bulkDevices;
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                bulkDevices: updatePrevBulkDevices,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "unlink",

                responseStatus: action.payload.status,
                selectedDevices: [],
                bulkDevices: [],
                bulkAction: '',
                bulkDealers: [],
                bulkUsers: [],
                errorAction: ''
            }
        }

        case WIPE_BULK_DEVICES: {
            // console.log('WIPE_BULK_DEVICES reducer data:: ', action.payload, "state.bulkDevices ", state.bulkDevices);
            let wipePassMsg = ''
            let wipeModal = false;
            let updatePrevBulkDevices = [];
            let selectedBulkDevices = state.selectedDevices;
            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {
                selectedBulkDevices = [];
                let allWipedDevices = [...action.payload.data.queue_device_ids, ...action.payload.data.pushed_device_ids];
                // console.log("allWipedDevices ", allWipedDevices);
                updatePrevBulkDevices = checkIsArray(state.bulkDevices).filter(item => !allWipedDevices.includes(item.device_id))
                // updatePrevBulkDevices = checkIsArray(state.bulkDevices).map((item) => {
                //     let bulkObjIndex = allWipedDevices.findIndex(obj => obj === item.device_id);
                //     if (bulkObjIndex === -1) {
                //         return item;
                //     }
                // })
                if (action.payload.online && !action.payload.offline && !action.payload.failed) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    showResponseModal = true;
                }

                state.bulkDevices = [];
                state.bulkAction = '';
                state.bulkDealers = [];
                state.bulkUsers = [];
                state.errorAction = '';

            } else {
                // wipePassMsg = action.payload.wipePassNotMatch ? action.payload.ms : false;
                wipeModal = action.payload.wipePassNotMatch ? action.payload.wipePassNotMatch : false;
                updatePrevBulkDevices = state.bulkDevices;
                error({
                    title: action.payload.msg,
                });
            }

            console.log("at reducer wipe:: ", selectedBulkDevices)

            return {
                ...state,
                bulkDevices: updatePrevBulkDevices,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "wipe",
                selectedDevices: selectedBulkDevices,
                // wipePassMsg,
                bulkWipePassModal: wipeModal,
                responseStatus: action.payload.status,

                bulkDevices: state.bulkDevices,
                bulkAction: state.bulkAction,
                bulkDealers: state.bulkDealers,
                bulkUsers: state.bulkUsers,
                errorAction: state.errorAction,
            }
        }

        case APPLY_BULK_POLICY: {
            console.log('APPLY_BULK_POLICY reducer data:: ', action.payload);

            let showResponseModal = state.bulkResponseModal;

            if (action.payload.status) {
                if (action.payload.online && !action.payload.offline && !action.payload.failed) {
                    success({
                        title: action.payload.msg,
                    });
                } else if (!action.payload.online && action.payload.offline && !action.payload.failed) {
                    warning({
                        title: action.payload.msg,
                        content: action.payload.content
                    });
                } else {
                    state.failed_device_ids = action.payload.data.failed_device_ids;
                    state.queue_device_ids = action.payload.data.queue_device_ids;
                    state.pushed_device_ids = action.payload.data.pushed_device_ids;
                    showResponseModal = true;
                }

            } else {
                error({
                    title: action.payload.msg,
                });
            }

            return {
                ...state,
                failed_device_ids: [...state.failed_device_ids],
                queue_device_ids: [...state.queue_device_ids],
                pushed_device_ids: [...state.pushed_device_ids],
                bulkResponseModal: showResponseModal,
                response_modal_action: "policy",

                responseStatus: action.payload.status,

                selectedDevices: [],
                bulkDevices: [],
                bulkAction: '',
                bulkDealers: [],
                bulkUsers: [],
                errorAction: ''
            }
        }

        case CLOSE_RESPONSE_MODAL: {
            return {
                ...state,
                bulkResponseModal: false,
                failed_device_ids: [],
                queue_device_ids: [],
                pushed_device_ids: [],
                expire_device_ids: [],
            }
        }

        case SET_BULK_DATA: {
            if (action.dataType === 'action') {
                return {
                    ...state,
                    bulkAction: action.payload,
                    errorAction: ''
                }
            }
            else if (action.dataType === 'dealers') {
                return {
                    ...state,
                    bulkDealers: action.payload,
                    bulkUsers: []
                }
            }
            else if (action.dataType === 'users') {
                return {
                    ...state,
                    bulkUsers: action.payload
                }
            }
            else if (action.dataType === 'errorAction') {
                return {
                    ...state,
                    errorAction: action.payload
                }
            }
            else {
                return {
                    ...state,
                }
            }
        }

        case SET_BULK_MESSAGE: {
            console.log("reducerv ", action.payload)

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
                bulkMsg: action.payload.msg_txt
            }
        }

        case DELETE_BULK_MSG: {
            console.log("reducerv ", action.payload, action.delete_id)
            let allMsgs = state.bulkMsgs;

            if (action.payload.status) {
                allMsgs = checkIsArray(state.bulkMsgs).filter(msg => msg.id !== action.delete_id);
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
                bulkMsgs: allMsgs
            }
        }

        case SEND_BULK_MESSAGE: {
            // console.log('SEND_BULK_MESSAGE reducer data:: ', { ...action.payload.lastMsg, devices: action.payload.devices });

            if (action.payload.status) {

                let newMsg = { ...action.payload.lastMsg, devices: action.payload.devices };
                state.bulkMsgs.unshift(newMsg);

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
                bulkMsgs: [...state.bulkMsgs]
            }
        }

        default:
            return state;
    }
}