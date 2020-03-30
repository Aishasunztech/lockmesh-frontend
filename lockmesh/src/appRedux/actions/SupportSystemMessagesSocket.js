//==========> Connect Device events

import { SYSTEM_SUPPORT_MESSAGE_RECEIVED, ADD_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION } from "../../constants/ActionTypes";

export const systemMessageSocket = (socket) => {

  return (dispatch) => {
    if (socket && socket._callbacks['$' + SYSTEM_SUPPORT_MESSAGE_RECEIVED] == undefined) {

      socket.on(SYSTEM_SUPPORT_MESSAGE_RECEIVED, (response) => {
        dispatch({
          type: SYSTEM_SUPPORT_MESSAGE_RECEIVED,
          payload: response
        })

        dispatch({
          type: ADD_SUPPORT_SYSTEM_MESSAGE_NOTIFICATION,
          payload: response
        })
      })
    }
  }
};
