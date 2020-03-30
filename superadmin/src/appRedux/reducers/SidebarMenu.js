import {
    GET_WHITE_LABELS,
    NEW_REQUEST_LIST,
    REJECT_REQUEST,
    ACCEPT_REQUEST,
    CHECK_DEALER_PIN,
    RESET_ACCEPT_PASSWORD_FORM
} from "../../constants/ActionTypes";
import { Modal, message } from 'antd';

const success = Modal.success
const error = Modal.error

const initialSidebar = {
    whiteLabels: [],
    newRequests: [],
    acceptPasswordForm: false
};

export default (state = initialSidebar, action) => {

    switch (action.type) {
        case GET_WHITE_LABELS: {

            return {
                ...state,
                whiteLabels: action.payload
            }
        }

        case NEW_REQUEST_LIST:
            // console.log('reducer new device', action.payload);
            return {
                ...state,
                newRequests: action.payload,
            }
        case REJECT_REQUEST: {
            var newRequests = state.newRequests;
            var request_id = action.request.id;
            var filteredRequests = newRequests;

            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                filteredRequests = newRequests.filter(request => request.id !== request_id);
            } else {
                error({
                    title: action.response.msg,
                });
            }



            return {
                ...state,
                newRequests: filteredRequests,
            }
        }
        case ACCEPT_REQUEST: {
            var newRequests = state.newRequests;
            var request_id = action.request.id;
            var filteredRequests = newRequests;
            var acceptPasswordForm = true;

            if (action.response.status) {
                success({
                    title: action.response.msg,
                });
                filteredRequests = newRequests.filter(request => request.id !== request_id);
                acceptPasswordForm = false;

            } else {
                error({
                    title: action.response.msg,
                });
            }



            return {
                ...state,
                newRequests: filteredRequests,
                acceptPasswordForm: acceptPasswordForm

            }
        }

        case CHECK_DEALER_PIN: {
            if (action.payload.dealerPinMatched.pin_matched) {
                message.success("Password has been sent to your Email. Please verify Your account.");
                return {
                    ...state,
                    acceptPasswordForm: true
                }
            }
            else {
                error({
                    title: "ADMIN PIN did not Match. Please try again.",
                });
                return {
                    ...state
                }
            }
            break

        }
        case RESET_ACCEPT_PASSWORD_FORM: {

            return {
                ...state,
                acceptPasswordForm: false
            }

        }

        default:
            return state;
    }
}