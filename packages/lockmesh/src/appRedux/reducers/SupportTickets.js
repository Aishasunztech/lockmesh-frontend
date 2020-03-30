import {
  GENERATE_SUPPORT_TICKET,
  SUPPORT_TICKET_REPLY,
  GET_SUPPORT_TICKET_REPLY,
  GET_SUPPORT_TICKET,
  CLOSE_SUPPORT_TICKET,
  DELETE_SUPPORT_TICKET,
  LOADING, GENERATE_SUPPORT_TICKET_SOCKET,
  SET_CURRENT_TICKET_ID,
  RESET_CURRENT_TICKET_ID,
  UPDATE_SUPPORT_TICKET_REPLY,
  UPDATE_SUPPORT_TICKET_REPLY_SOCKET,
  ADMIN_OBJECT_RECEIVED_FOR_USER
} from "../../constants/ActionTypes";

import { message, Modal, notification } from 'antd';
import { checkIsArray } from "../../routes/utils/commonUtils";
const nSuccess = notification.info;
const nError = notification.error;
const success = Modal.success;
const error   = Modal.error;
const initialState = {
  isloading: true,
  supportTickets: [],
  currentTicketId: null,
  closeSupportTicketStatus: false,
  supportTicketReplies: [],
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        isloading: true,
        dealers: [],
      };

    case SET_CURRENT_TICKET_ID: {
      return {
        ...state,
        currentTicketId: action.payload
      };
    }

    case RESET_CURRENT_TICKET_ID: {
      return {
        ...state,
        currentTicketId: null
      }
    }

    case GENERATE_SUPPORT_TICKET:{
      let tickets = state.supportTickets;

      if (action.payload.status) {
        tickets.unshift(action.payload.data);
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
        supportTickets: [...tickets],
      };
    }

    case GENERATE_SUPPORT_TICKET_SOCKET:{
      let tickets = state.supportTickets;

      if (action.payload.status) {
        tickets.unshift(action.payload.data);
        let subject = '';
        if(action.payload && action.payload.data && action.payload.data.subject){
          subject = (action.payload.data.subject.length > 50) ? action.payload.data.subject.substr(0, 50) + '...' : action.payload.data.subject;
        }
        nSuccess({
          message: action.payload.msg,
          description: subject,
          placement: 'bottomRight',
          duration: 15
        })
      }
      else {
        nError({
          message: action.payload.msg,
          description: '',
          placement: 'bottomRight',
          duration: 15
        })
      }

      return {
        ...state,
        supportTickets: [...tickets],
      };
    }

    case SUPPORT_TICKET_REPLY:{
      let replies = state.supportTicketReplies;
      if (action.payload.status) {
        replies = action.payload.data;
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
        supportTicketReplies: [...replies],
      };
    }

    case GET_SUPPORT_TICKET:{
      return {
        ...state,
        supportTickets: action.payload,
      };
    }

    case GET_SUPPORT_TICKET_REPLY:{
      // let ticketId = action.payload.data.replies.filter(a => );

      return {
        ...state,
        supportTicketReplies: action.payload.data,
      };
    }

    case UPDATE_SUPPORT_TICKET_REPLY: {
      let replies = state.supportTicketReplies;
      if (action.payload.status) {
        replies = action.payload.data;
        success({
          title: action.payload.msg,
        });
      }
      else {
        error({
          title: action.payload.msg,
        });
      }

      if(state.currentTicketId != null){
        if(state.currentTicketId === action.payload.data._id){
          replies = action.payload.data.replies;
        } else {
          replies = state.supportTicketReplies
        }
      } else {
        replies = []
      }

      return {
        ...state,
        supportTicketReplies: replies,
      };
    }

    case UPDATE_SUPPORT_TICKET_REPLY_SOCKET: {
      let replies = state.supportTicketReplies;
      if (action.payload.status) {
        replies = action.payload.data;
        let subject = '';
        if(action.payload && action.payload.data && action.payload.data.subject){
          subject = (action.payload.data.subject.length > 50) ? action.payload.data.subject.substr(0, 50) + '...' : action.payload.data.subject;
        }
        nSuccess({
          message: action.payload.msg,
          description: subject,
          placement: 'bottomRight',
          duration: 15
        });
      }
      else {
        nError({
          message: action.payload.msg,
          description: '',
          placement: 'bottomRight',
          duration: 15
        });
      }

      if(state.currentTicketId != null){
        if(state.currentTicketId === action.payload.data._id){
          replies = action.payload.data.replies;
        } else {
          replies = state.supportTicketReplies
        }
      } else {
        replies = []
      }

      return {
        ...state,
        supportTicketReplies: replies,
      };
    }

    case CLOSE_SUPPORT_TICKET:{
      let tickets = state.supportTickets;
      if (action.payload.status) {
        checkIsArray(tickets).map(item => {
          if(item._id === action.payload.data){
            item.status = 'closed'
          }
          return item;
        });
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
        supportTickets: tickets,
        closeSupportTicketStatus: action.payload.status
      };
    }

    case DELETE_SUPPORT_TICKET:{
      let updatedTickets    = [];
      if (action.payload.status) {
        let deletedIds        = action.payload.deletedIds;
        updatedTickets        = checkIsArray(state.supportTickets).filter(supportTicket => !deletedIds.includes(supportTicket._id));
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
        supportTickets: [...updatedTickets]
      };
    }

    default:
      return state;

  }
}
