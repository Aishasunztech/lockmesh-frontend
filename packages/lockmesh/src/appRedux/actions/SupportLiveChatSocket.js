//==========> Connect Device events

import { SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED, SUPPORT_LIVE_CHAT_USER_TYPING, SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING, SUPPORT_LIVE_CHAT_MESSAGE_DELETED, SUPPORT_LIVE_CHAT_CONVERSATION_DELETED, SUPPORT_LIVE_CHAT_NOTIFICATION_NEW_MESSAGE } from "../../constants/ActionTypes";
import { notification } from "antd";
const nInfo = notification.info;
export const supportLiveChatSocket = (socket) => {

  return (dispatch, getState) => {
    if (socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED] == undefined) {

      socket.on(SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED, (response) => {
        let { currentConversation } = getState().sidebar;
        let { allDealers } = getState().dealers;
        if(!currentConversation || !currentConversation._id || currentConversation._id !== response.message.conversation_id){
          let msg = 'New message';
          let sender = allDealers.filter(dealer => dealer.dealer_id === response.message.sender);
          if(sender[0] && sender[0].dealer_name){
            msg = sender[0].dealer_name;
          }
          nInfo({
            message: msg,
            description: response.message.message,
            placement: 'bottomRight',
            duration: 10
          });
        }
        dispatch({
          type: SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED,
          payload: response
        });

        dispatch({
          type: SUPPORT_LIVE_CHAT_NOTIFICATION_NEW_MESSAGE,
          payload: response.message
        });
      })
    }

    if(socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_USER_TYPING] == undefined){

      socket.on(SUPPORT_LIVE_CHAT_USER_TYPING, (data) => {
        dispatch({
          type: SUPPORT_LIVE_CHAT_USER_TYPING,
          payload: data
        })
      })
    }

    if(socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING] == undefined){
      socket.on(SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING, (data) => {
        dispatch({
          type: SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING,
          payload: data
        })
      })
    }

    // if(socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_MESSAGE_DELETED] == undefined){
    //   socket.on(SUPPORT_LIVE_CHAT_MESSAGE_DELETED, (data) => {
    //     dispatch({
    //       type: SUPPORT_LIVE_CHAT_MESSAGE_DELETED,
    //       payload: data
    //     })
    //   })
    // }
    //
    // if(socket && socket._callbacks['$' + SUPPORT_LIVE_CHAT_CONVERSATION_DELETED] == undefined){
    //   socket.on(SUPPORT_LIVE_CHAT_CONVERSATION_DELETED, (data) => {
    //     dispatch({
    //       type: SUPPORT_LIVE_CHAT_CONVERSATION_DELETED,
    //       payload: data
    //     })
    //   })
    // }
  }
};
