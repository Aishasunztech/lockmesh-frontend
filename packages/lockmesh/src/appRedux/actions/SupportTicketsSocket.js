//==========> Connect Device events

import {
  GENERATE_SUPPORT_TICKET, UPDATE_SUPPORT_TICKET_REPLY, UPDATE_SUPPORT_TICKET_NOTIFICATIONS,
  GENERATE_SUPPORT_TICKET_SOCKET, UPDATE_SUPPORT_TICKET_REPLY_SOCKET
} from "../../constants/ActionTypes";

export const generateSupportTicketEvent = (socket) => {

  return (dispatch) => {
    if (socket && socket._callbacks['$' + GENERATE_SUPPORT_TICKET] == undefined) {
      socket.on(GENERATE_SUPPORT_TICKET, (response) => {
        dispatch({
          type: GENERATE_SUPPORT_TICKET_SOCKET,
          payload: response
        });
        dispatch({
          type: UPDATE_SUPPORT_TICKET_NOTIFICATIONS,
          payload: response
        })
      })
    }

    if (socket && socket._callbacks['$' + UPDATE_SUPPORT_TICKET_REPLY] == undefined) {

      socket.on(UPDATE_SUPPORT_TICKET_REPLY, (response) => {

        dispatch({
          type: UPDATE_SUPPORT_TICKET_REPLY_SOCKET,
          payload: response
        })
      })
    }
  }
};
