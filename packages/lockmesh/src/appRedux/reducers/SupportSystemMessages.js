import {
  GENERATE_SUPPORT_SYSTEM_MESSAGE,
  GET_SUPPORT_SYSTEM_MESSAGE,
  GET_RECEIVED_SUPPORT_SYSTEM_MESSAGES,
  LOADING, UPDATE_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION, GET_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION, SYSTEM_SUPPORT_MESSAGE_RECEIVED, ADD_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION
} from "../../constants/ActionTypes";

import { message, Modal, notification } from 'antd';
import { checkIsArray } from "../../routes/utils/commonUtils";
const nSuccess = notification.info;
const nError = notification.error;
const success = Modal.success;
const error = Modal.error;
const initialState = {
  isloading: true,
  supportSystemMessages: [],
  receivedSupportSystemMessages: [],
  supportSystemMessagesNotifications: [],
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        isloading: true,
        dealers: [],
      };

    case GENERATE_SUPPORT_SYSTEM_MESSAGE: {
      let supportSystemMessages = state.supportSystemMessages;

      if (action.payload.status) {
        supportSystemMessages.unshift(action.payload.data);
        success({
          title: action.payload.msg,
        });
      }
      else {
        error({
          title: action.payload.msg,
        });
      }

      return {
        ...state,
        supportSystemMessages: [...supportSystemMessages],
      };
    }

    case GET_SUPPORT_SYSTEM_MESSAGE: {
      return {
        ...state,
        supportSystemMessages: action.payload,
      };
    }

    case GET_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION: {
      return {
        ...state,
        supportSystemMessagesNotifications: action.payload,
      };
    }

    case GET_RECEIVED_SUPPORT_SYSTEM_MESSAGES: {
      return {
        ...state,
        receivedSupportSystemMessages: action.payload,
      };
    }

    case SYSTEM_SUPPORT_MESSAGE_RECEIVED: {
      let receivedSupportSystemMessagesList = state.receivedSupportSystemMessages;
      let subject = '';
      if(action.payload && action.payload.data && action.payload.data.system_message && action.payload.data.system_message.subject){
        subject = (action.payload.data.system_message.subject.length > 50) ? action.payload.data.system_message.subject.substr(0, 50) + '...' : action.payload.data.system_message.subject;
      }
      nSuccess({
        message: action.payload.msg,
        description: subject,
        placement: 'bottomRight',
        duration: 15
      })
      // success({
      //   title: action.payload.msg
      // });
      return {
        ...state,
        receivedSupportSystemMessages: [action.payload.data, ...receivedSupportSystemMessagesList]
      }
    }

    case UPDATE_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION: {
      let supportSystemMessagesNotifications;
      if(action.payload.status){
        supportSystemMessagesNotifications = checkIsArray(state.supportSystemMessagesNotifications).filter(notification => !action.payload.seenId.includes(notification.system_message._id));
      } else {
        supportSystemMessagesNotifications = state.supportSystemMessagesNotifications;
      }

      return {
        ...state,
        supportSystemMessagesNotifications: [...supportSystemMessagesNotifications]
      };
    }
    case ADD_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION: {
      let supportSystemMessagesNotifications = state.supportSystemMessagesNotifications;

      if (action.payload.status) {
        supportSystemMessagesNotifications.unshift(action.payload.data);

      }
      return {
        ...state,
        supportSystemMessagesNotifications: [...supportSystemMessagesNotifications]
      };
    }

    default:
      return state;

  }
}
