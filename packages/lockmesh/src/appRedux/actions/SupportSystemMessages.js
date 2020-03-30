import {
  GENERATE_SUPPORT_SYSTEM_MESSAGE, GET_RECEIVED_SUPPORT_SYSTEM_MESSAGES,
  GET_SUPPORT_SYSTEM_MESSAGE, GET_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION,
  INVALID_TOKEN,
  SPIN_lOADING, UPDATE_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';


export function generateSupportSystemMessages(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.generateSupportSystemMessages(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GENERATE_SUPPORT_SYSTEM_MESSAGE,
          payload: response.data
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  };
}

export function getSupportSystemMessages(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.getSupportSystemMessages(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GET_SUPPORT_SYSTEM_MESSAGE,
          payload: response.data
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  };
}

export function getReceivedSupportSystemMessages(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.getReceivedSupportSystemMessages(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GET_RECEIVED_SUPPORT_SYSTEM_MESSAGES,
          payload: response.data
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  };
}

export function getSupportSystemMessagesNotifications(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.getSupportSystemMessagesNotifications(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GET_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION,
          payload: response.data
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  };
}


export function updateSupportSystemMessageNotification(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.updateSupportSystemMessageNotification(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: UPDATE_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION,
          payload: response.data
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });
  };
}
