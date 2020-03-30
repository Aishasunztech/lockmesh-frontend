import {
  SEND_SUPPORT_LIVE_CHAT_MESSAGE, SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED,
  LOADING, GET_SUPPORT_LIVE_CHAT_CONVERSATION, GET_SUPPORT_LIVE_CHAT_MESSAGES,
  SUPPORT_LIVE_CHAT_USER_TYPING, SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING,
  SUPPORT_LIVE_CHAT_MESSAGE_DELETED, SUPPORT_LIVE_CHAT_CONVERSATION_DELETED,
  GET_SUPPORT_LIVE_CHAT_PREVIOUS_MESSAGES
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
import { checkIsArray } from "../../routes/utils/commonUtils";
const success = Modal.success;
const error   = Modal.error;
const initialState = {
  isloading: true,
  supportLiveChatMessages: [],
  supportLiveChatConversations: [],
  typingConversations: []
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        isloading: true,
        dealers: [],
      };

    case SEND_SUPPORT_LIVE_CHAT_MESSAGE:{
      let supportLiveChatMessages = state.supportLiveChatMessages;
      let supportLiveChatConversations = state.supportLiveChatConversations;

      if (action.payload.status) {
        supportLiveChatMessages.push(action.payload.message);

        if(!supportLiveChatConversations.some(conversation => conversation._id === action.payload.conversation._id)){
          supportLiveChatConversations.unshift(action.payload.conversation);
        }
      }
      else {
        error({
          title: action.payload.msg,
        });
      }

      return {
        ...state,
        supportLiveChatMessages: [...supportLiveChatMessages],
        supportLiveChatConversations: [...supportLiveChatConversations]
      };
    }

    case SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED: {
      let supportLiveChatMessages = state.supportLiveChatMessages;
      let supportLiveChatConversations = checkIsArray(state.supportLiveChatConversations).filter(conversation => conversation._id !== action.payload.conversation._id);

      // if(!supportLiveChatConversations.some(conversation => conversation._id === action.payload.conversation._id)){
      //   supportLiveChatConversations.push(action.payload.conversation);
      // }

      if(supportLiveChatMessages.some(message => message.conversation_id === action.payload.message.conversation_id)){
        supportLiveChatMessages.push(action.payload.message);
      }

      return {
        ...state,
        supportLiveChatMessages: [...supportLiveChatMessages],
        supportLiveChatConversations: [action.payload.conversation, ...supportLiveChatConversations]
      };
    }

    case GET_SUPPORT_LIVE_CHAT_CONVERSATION:{
      return {
        ...state,
        supportLiveChatConversations: action.payload.data,
      };
    }

    case GET_SUPPORT_LIVE_CHAT_MESSAGES:{
      let msgs = action.payload.data;
      if(Array.isArray(msgs)){
        msgs.reverse();
      }
      return {
        ...state,
        supportLiveChatMessages: msgs,
      };
    }

    case GET_SUPPORT_LIVE_CHAT_PREVIOUS_MESSAGES:
      let allmsgs = state.supportLiveChatMessages;
      let prevMsgs = action.payload.data;
      if(Array.isArray(prevMsgs)){
        prevMsgs.reverse();
      }

      return {
        ...state,
        supportLiveChatMessages: prevMsgs.concat(allmsgs)
      };

    case SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING:
      let typingConversations = checkIsArray(state.typingConversations).filter(item => item !== action.payload);
      return {
        ...state,
        typingConversations
      };

    case SUPPORT_LIVE_CHAT_USER_TYPING:
      let typings = state.typingConversations;
      typings = checkIsArray(typings).filter(item => item !== action.payload);
      typings.push(action.payload);
      return {
        ...state,
        typingConversations: typings
      };

    // case SUPPORT_LIVE_CHAT_MESSAGE_DELETED:
    //   let supportLiveChatConversations = state.supportLiveChatConversations.filter(conv => conv._id !== action.payload);
    //
    //   return {
    //     ...state,
    //     supportLiveChatConversations: supportLiveChatConversations
    //   };

    // case SUPPORT_LIVE_CHAT_CONVERSATION_DELETED:
    //   let supportLiveChatConversations = state.supportLiveChatConversations.filter(conv => conv._id !== action.payload);
    //
    //   return {
    //     ...state,
    //     supportLiveChatConversations: supportLiveChatConversations
    //   };

    default:
      return state;

  }
}
