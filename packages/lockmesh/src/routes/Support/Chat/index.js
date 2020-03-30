import React, { Component } from "react";
import { Avatar, Button, Drawer, Input, Tabs } from "antd";
import CustomScrollbars from "util/CustomScrollbars";
import Moment from "moment";
import './chat.css';
import ChatUserList from "./components/ChatUserList";
import Conversation from "./components/Conversation/index";
import ContactList from "./components/ContactList/index";
import users from "./data/chatUsers";

import SearchBox from "./components/SearchBox";
import CircularProgress from "../../../components/CircularProgress/index";
import { bindActionCreators } from "redux";
import { SUPPORT_LIVE_CHAT_I_AM_TYPING, SUPPORT_LIVE_CHAT_I_STOPPED_TYPING } from "../../../constants/ActionTypes";
import { setCurrentConversation, markMessagesRead, resetCurrentConversation } from "../../../appRedux/actions";
import { connect } from "react-redux";
import {
  getAllDealers,
  getAllToAllDealers,
  getSupportLiveChatConversation,
  getSupportLiveChatMessages,
  sendSupportLiveChatMessage,
  getSupportLiveChatPreviousMessages
} from "../../../appRedux/actions";
import {ADMIN, DEALER, SDEALER} from "../../../constants/Constants";
import { checkIsArray } from "../../utils/commonUtils";
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

class Chat extends Component {
  filterContact = (userName) => {
    if (userName === '') {
      return this.state.copyContactList;
    }
    return checkIsArray(this.state.copyContactList).filter((list) => {
      if (list.dealer_name.toLowerCase().indexOf(userName.toLowerCase()) > -1) {
        return list;
      } else if (list.link_code.toLowerCase().indexOf(userName.toLowerCase()) > -1) {
        return list;
      }
    }
    );
  };

  doIfKeyCode(e, keys=[], cb=null){
    if(!Array.isArray(keys)){
      return;
    }
    if(keys.includes(e.keyCode) && typeof cb === 'function'){
      cb();
    }
    return;
  };
  filterUsers = (userName) => {
    if (userName === '') {
      return this.state.copyChatUsers;
    }
    return checkIsArray(this.state.copyChatUsers).filter((list) => {
      if (list.user.dealer_name.toLowerCase().indexOf(userName.toLowerCase()) > -1) {
        return list;
      } else if (list.user.link_code.toLowerCase().indexOf(userName.toLowerCase()) > -1) {
        return list;
      }
    }
    );
  };

  resetDrawer = () => {
    this.props.resetCurrentConversation();
    this.setState({
      lastId: ''
    });
  };

  fetchMessages(){}

  onScroll = (e) => {
    let { currentConversation } = this.props;
    if(e.srcElement.scrollHeight <= e.srcElement.scrollTop + e.srcElement.clientHeight + 10){
      if(this.state.isScrolledUp) {
        this.setState({isScrolledUp: false});
      }
    } else {
      if(e.srcElement.scrollTop <= 10){
        if(this.state.conversation.length){
          if(this.state.lastId !== this.state.conversation[0]._id){
            let convId = (currentConversation !== null) ? currentConversation.hasOwnProperty('_id') && currentConversation._id !== null ? currentConversation._id : '' : '';
            let lastId = this.state.conversation[0]._id;
            this.props.getSupportLiveChatPreviousMessages({type: 'conversation', id: convId, last: this.state.conversation[0]._id});
            this.setState({lastId: lastId});
          }
        }
      }
      if(!this.state.isScrolledUp){
        this.setState({isScrolledUp: true});
      }
    }
  };
  Communication = () => {
    const { message, selectedUser } = this.state;
    return <div className="gx-chat-main">
      <div className="gx-chat-main-header">
        <div className="gx-d-block gx-d-lg-none">
          <span className="gx-chat-btn support-chat-small"><i className="gx-icon-btn icon icon-menu"
                                                              onClick={this.onToggleDrawer.bind(this)} /></span>
        </div>
        <span className="gx-chat-btn support-chat-small"><i className="gx-icon-btn icon icon-arrow-left"
          onClick={this.resetDrawer.bind(this)} /></span>
        <div className="gx-chat-main-header-info">

          <div className="gx-chat-avatar gx-mr-2">
            <div className="gx-status-pos">
              <Avatar src='/static/media/profile-image.c9452584.png'
                className="gx-rounded-circle gx-size-60"
                alt="" />

              <span className={`gx-status gx-${selectedUser.hasOwnProperty('user') && selectedUser.user.hasOwnProperty('status') && selectedUser.user.status}`} />
            </div>
          </div>

          <div className="gx-chat-contact-name">
            {selectedUser.hasOwnProperty('user') && selectedUser.user.hasOwnProperty('dealer_name') && selectedUser.user.dealer_name} {selectedUser.hasOwnProperty('user') && selectedUser.user.hasOwnProperty('link_code') && selectedUser.user.type === ADMIN ? "" : `(${selectedUser.user.link_code})`}
            {/*<div className="gx-chat-info-des gx-text-truncate">{selectedUser.hasOwnProperty('user') && selectedUser.user.hasOwnProperty('link_code') && selectedUser.user.link_code}</div>*/}
          </div>

        </div>

      </div>

      <CustomScrollbars className="gx-chat-list-scroll support-chat-list-scroll" id="chatScroll" onScroll={(e) => this.onScroll(e)}>
        <Conversation
          conversationData={this.state.conversation}
          selectedUser={selectedUser}
          user={this.props.user}
        />
      </CustomScrollbars>

      <div className="gx-chat-main-footer">
        <div className="gx-flex-row gx-align-items-center" style={{ maxHeight: 51 }}>
          <div className="gx-col">
            <div className="gx-form-group">
              <TextArea
                id="required" className="gx-border-0 ant-input gx-chat-textarea"
                onKeyDown={this._handleKeyPress.bind(this)}
                onChange={this.updateMessageValue.bind(this)}
                value={message}
                required={true}
                placeholder="Type and hit enter to send message"
              />
            </div>
          </div>
          <i className="gx-icon-btn icon icon-sent" tabIndex="0" onKeyDown={(e) => this.doIfKeyCode(e, [32, 13], this.submitComment)} onClick={this.submitComment} />
        </div>
      </div>
    </div>
  };

  ChatUsers = () => {
    return <div className="gx-chat-sidenav-main">

      <div className="gx-chat-sidenav-header">

        <div className="gx-chat-user-hd">

          <div className="gx-chat-avatar gx-mr-3" onClick={() => {
            this.setState({
              userState: 2
            });
          }}>
            <div className="gx-status-pos">
              <Avatar id="avatar-button" src='/static/media/profile-image.c9452584.png'
                className="gx-size-50"
                alt="" />
              {/*<span className="gx-status gx-online"/>*/}
            </div>
          </div>

          <div className="gx-module-user-info gx-flex-column gx-justify-content-center">
            <div className="gx-module-title">
              <h5 className="gx-mb-0">{this.props.user.name}</h5>
            </div>
            <div className="gx-module-user-detail">
              <span className="gx-text-grey gx-link">{this.props.user.email}</span>
            </div>
          </div>
        </div>

        <div className="gx-chat-search-wrapper">

          <SearchBox styleName="gx-chat-search-bar gx-lt-icon-search-bar-lg"
            placeholder="Search or start new chat"
            onChange={this.updateSearchChatUser.bind(this)}
            value={this.state.searchChatUser} />

        </div>
      </div>

      <div className="gx-chat-sidenav-content">

        <Tabs className="gx-tabs-half" defaultActiveKey="1">
          <TabPane label="Chat History" tab="Chat History" key="1">
            <CustomScrollbars className="gx-chat-sidenav-scroll-tab-1 gx-support-chat-list-scroll">
              {this.state.chatUsers.length === 0 ?
                <div className="gx-p-5">{this.state.userNotFound}</div>
                :
                <ChatUserList
                  chatUsers={this.state.chatUsers}
                  selectedSectionId={this.state.selectedSectionId}
                  onSelectUser={this.onSelectUser.bind(this)} />
              }
            </CustomScrollbars>
          </TabPane>
          <TabPane label="Contacts List" tab="Contacts List" key="2">
            <CustomScrollbars className="gx-chat-sidenav-scroll-tab-2 gx-support-chat-list-scroll">
              {
                this.state.contactList.length === 0 ?
                  <div className="gx-p-5">{this.state.userNotFound}</div>
                  :
                  <ContactList
                    contactList={this.state.contactList}
                    selectedSectionId={this.state.selectedSectionId}
                    onSelectUser={this.onSelectUser.bind(this)} />
              }
            </CustomScrollbars>
          </TabPane>
        </Tabs>


      </div>
    </div>
  };

  _emitEvent = (e) => {
    if (this.props.supportSocket && this.state.selectedConversation !== null && this.state.selectedUser !== null && this.state.selectedUser.hasOwnProperty('user')) {
      if (this.state.message.length > 0 && !this.state.isTypingEventEmitted) {
        this.props.supportSocket.emit(SUPPORT_LIVE_CHAT_I_AM_TYPING, { conversation: this.state.selectedConversation, user: this.state.selectedUser.user.dealer_id });
        this.setState({ isTypingEventEmitted: true });
      } else {
        if (!this.state.message.length > 0) {
          this.props.supportSocket.emit(SUPPORT_LIVE_CHAT_I_STOPPED_TYPING, { conversation: this.state.selectedConversation, user: this.state.selectedUser.user.dealer_id });
          this.setState({ isTypingEventEmitted: false });
        }
      }
    }
  }

  _handleKeyPress = (e) => {
    this._emitEvent(e);
    if(e.keyCode === 13 && !e.shiftKey){
      e.preventDefault();
      if(this.props.supportSocket && this.state.selectedConversation !== null && this.state.selectedUser !== null && this.state.selectedUser.hasOwnProperty('user')){
        this.props.supportSocket.emit(SUPPORT_LIVE_CHAT_I_STOPPED_TYPING, {conversation: this.state.selectedConversation, user: this.state.selectedUser.user.dealer_id});
      }
      this.submitComment();
    }
    // if (e.key === 'Enter') {
    //   this.submitComment();
    // }
  };

  handleChange = (event, value) => {

    this.setState({ selectedTabIndex: value });
  };

  onSelectUser = (data, type) => {

    let u = type === 'chat' ? data.user : data;
    if(this.props.currentConversation && this.props.currentConversation.user && this.props.currentConversation.user.dealer_id === u.dealer_id){
      return false;
    }

    // let { currentConversation } = this.props;
    // if(currentConversation && currentConversation.user && currentConversation._id){
    //   if(this.props.supportSocket){
    //     this.props.supportSocket.emit(SUPPORT_LIVE_CHAT_I_STOPPED_TYPING, {conversation: currentConversation._id, user: currentConversation.user.dealer_id});
    //   }
    // }

    if (type === 'chat') {
      this.props.getSupportLiveChatMessages({ type: 'conversation', id: data._id });
      // this.props.markMessagesRead({conversations: [data._id]});
    } else {
      this.props.getSupportLiveChatMessages({type: 'user', id: data.dealer_id});
    }

    let selectedConversation = (data.hasOwnProperty('_id')) ? data._id : null;
    let user = type === 'chat' ? data.user : data;

    this.props.setCurrentConversation(user, selectedConversation);

    this.setState({
      loader: true,
      drawerState: false,
      isScrolledUp: false,
      lastId: '',
      message: '',
      isTypingEventEmitted: false
    });
    setTimeout(() => {
      this.setState({ loader: false });
    }, 500);
  };

  showCommunication = () => {
    return (
      <div className="gx-chat-box">
        {this.state.selectedUser === null ?
          <div className="gx-comment-box support-comment-box">
            <div className="gx-fs-80"><i className="icon icon-chat gx-text-muted" /></div>
            <h1 className="gx-text-muted">Select User to start Chat</h1>
            <Button className="gx-d-block gx-d-lg-none" type="primary"
              onClick={this.onToggleDrawer.bind(this)}>Select User to start Chat</Button>

          </div>
          : this.Communication()}
      </div>)
  };

  constructor(props) {
    super(props);

    this.state = {
      loader: false,
      userNotFound: 'No user found',
      drawerState: false,
      selectedSectionId: '',
      selectedTabIndex: 1,
      userState: 1,
      searchChatUser: '',
      contactList: [],
      copyContactList: [],
      selectedUser: null,
      selectedConversation: null,
      message: '',
      isTypingEventEmitted: false,
      chatUsers: [],
      copyChatUsers: [],
      conversation: [],
      isScrolledUp: false,
      lastId: ''
    }

    this.submitComment = this.submitComment.bind(this);
  }

  componentDidMount() {
    this.props.getAllToAllDealers();
    this.props.getSupportLiveChatConversation();
    let selectedConversation = null;
    let selectedUser = null;
    let dealerId = '';

    if (!this.state.isScrolledUp) {
      if (document.getElementById('chatScroll')) {
        if (document.getElementById('chatScroll').children.length) {
          document.getElementById('chatScroll').children[0].scrollTop = document.getElementById('chatScroll').children[0].scrollHeight;
        }
      }
    }

    if (this.props.currentConversation) {
      selectedConversation = this.props.currentConversation._id ? this.props.currentConversation._id : null;
      selectedUser = this.props.currentConversation;
      dealerId = this.props.currentConversation.user.dealer_id;
    }

    if (this.props.currentConversation && this.props.currentConversation._id !== null && this.state.conversation.length === 0) {
      this.props.getSupportLiveChatMessages({ type: 'conversation', id: this.props.currentConversation._id });
      this.props.markMessagesRead({ conversations: [this.props.currentConversation._id] });
    }

    this.setState({
      selectedSectionId: dealerId,
      selectedConversation: selectedConversation,
      selectedUser: selectedUser
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    let chatUsersWithUser = [];

    if (!this.state.isScrolledUp) {
      if (document.getElementById('chatScroll')) {
        if (document.getElementById('chatScroll').children.length) {
          document.getElementById('chatScroll').children[0].scrollTop = document.getElementById('chatScroll').children[0].scrollHeight;
        }
      }
    }

    if (prevProps !== this.props) {

      let { lastId } = this.state;
      if(lastId){
        if(document.getElementById(lastId).length){
          setTimeout(function(){
              document.getElementById(lastId).scrollIntoView();
          }, 50);
        }
      }

      if (this.state.chatUsers !== this.props.supportLiveChatConversations && this.props.supportLiveChatConversations.length > 0 && this.props.dealerList.length > 0) {

        checkIsArray(this.props.supportLiveChatConversations).map((chatUsers) => {

          if (this.props.user.id === chatUsers.sender) {
            chatUsers.user = this.props.dealerList.find((dealer) => (dealer.dealer_id === chatUsers.receiver));
          } else {
            chatUsers.user = this.props.dealerList.find((dealer) => (dealer.dealer_id === chatUsers.sender));
          }

          if (chatUsers.hasOwnProperty('user') && chatUsers.user.hasOwnProperty('type') && chatUsers.user.type === ADMIN) {
            let adminObject = chatUsers.user;
            adminObject.dealer_name = 'Admin';
            adminObject.link_code = '';
            chatUsers.user = adminObject;
          }


          chatUsersWithUser.push(chatUsers)
        });

        this.setState({
          chatUsers: chatUsersWithUser,
          copyChatUsers: chatUsersWithUser,
        });

      }

      let admin;
      if (this.props.user.type === SDEALER || this.props.user.type === DEALER) {
        admin = this.props.admin;
        admin.dealer_name = 'Admin';
        admin.link_code = '';
      }

      if (this.props.user.type === SDEALER) {
        //   && this.props.dealerList.length > 0

        let dealer = this.props.dealerList.find((dealer) => (dealer.dealer_id === this.props.user.connected_dealer));

        this.setState({
          contactList: [dealer, admin],
          copyContactList: [dealer, admin],
        })

      } else if (this.props.user.type === DEALER) {
        //  && this.props.contactList.length > 0

        this.setState({
          contactList: [...this.props.contactList, admin],
          copyContactList: [...this.props.contactList, admin],
        })

      } else if (this.props.contactList.length > 0) {

        this.setState({
          contactList: this.props.contactList,
          copyContactList: this.props.contactList,
        })

      }

      if (this.props.supportLiveChatMessages.length > 0) {
        this.setState({
          conversation: this.props.supportLiveChatMessages,
        })
      }

      if (this.props.currentConversation !== prevProps.currentConversation) {
        if (this.props.currentConversation) {
          if (this.props.currentConversation._id === null) {
            this.setState({
              selectedSectionId: this.props.currentConversation.user.dealer_id,
              selectedConversation: this.props.currentConversation._id,
              selectedUser: this.props.currentConversation,
              conversation: []
            });
          } else {
            this.props.markMessagesRead({ conversations: [this.props.currentConversation._id] });
            this.props.getSupportLiveChatMessages({ type: 'conversation', id: this.props.currentConversation._id });
            this.setState({
              selectedSectionId: this.props.currentConversation.user.dealer_id,
              selectedConversation: this.props.currentConversation._id,
              selectedUser: this.props.currentConversation
            });
          }
        } else if (this.props.currentConversation === null) {
          this.setState({
            selectedSectionId: '',
            selectedConversation: null,
            selectedUser: null,
            conversation: []
          });
        }
      }

      if (this.props.supportLiveChatMessages !== prevProps.supportLiveChatMessages) {
        if (this.props.currentConversation !== null && this.props.currentConversation._id !== null) {
          if (this.props.supportLiveChatMessages.length) {
            let lastItemNo = this.props.supportLiveChatMessages.length;
            let lastItem = this.props.supportLiveChatMessages[lastItemNo - 1];
            if (lastItem !== undefined && lastItem.hasOwnProperty('receiver') && lastItem.receiver === this.props.user.dealerId && lastItem.hasOwnProperty('is_read') && lastItem.is_read === false) {
              this.props.markMessagesRead({ conversations: [this.props.currentConversation._id] });
            }
          }
        }
      }
    }

  }

  submitComment() {

    if (this.state.message.length > 0 && this.state.message.trim().length > 0) {
      // let data = {
      //   receiver: this.state.selectedUser.user.dealer_id,
      //   message: this.state.message,
      // };
      let data = {
          receiver: this.state.selectedUser.user.dealer_id,
          message: btoa(this.state.message),
        };
      this.props.sendSupportLiveChatMessage(data);
      this.setState({
        message: '',
        isTypingEventEmitted: false
      });
    }
  }

  updateMessageValue(evt) {
    this.setState({
      message: evt.target.value
    });
  }

  updateSearchChatUser(evt) {
    this.setState({
      searchChatUser: evt.target.value,
      contactList: this.filterContact(evt.target.value),
      chatUsers: this.filterUsers(evt.target.value)
    });
  }

  onToggleDrawer() {
    this.setState({
      drawerState: !this.state.drawerState
    });
  }

  render() {
    const { loader, drawerState } = this.state;
    return (
      <div className="gx-main-content support-chat-content">
        <div className="gx-app-module gx-chat-module m-0">
          <div className="gx-d-block gx-d-lg-none">
            <Drawer
              placement="left"
              closable={false}
              visible={drawerState}
              onClose={this.onToggleDrawer.bind(this)}>
              {this.ChatUsers()}
            </Drawer>

          </div>

          <div className="gx-chat-module-box">
            {this.props.currentConversation === null && <div className="gx-chat-module-box-header">
              <span className="gx-drawer-btn gx-d-flex gx-d-lg-none">
                <i className="icon icon-menu gx-icon-btn" aria-label="Menu"
                  onClick={this.onToggleDrawer.bind(this)} />
              </span>
            </div>}
            <div className="gx-chat-sidenav gx-d-none gx-d-lg-flex">
              {this.ChatUsers()}
            </div>
            {loader ?
              <div className="gx-loader-view">
                <CircularProgress />
              </div> : this.showCommunication()
            }
          </div>
        </div>
      </div>
    )
  }
}

var mapStateToProps = ({ auth, SupportLiveChat, dealers, sidebar, socket }) => {

  return {
    contactList: dealers.dealers,
    dealerList: dealers.allDealers,
    admin: sidebar.admin,
    user: auth.authUser,
    currentConversation: sidebar.currentConversation,
    supportSocket: socket.supportSystemSocket,
    supportLiveChatConversations: SupportLiveChat.supportLiveChatConversations,
    supportLiveChatMessages: SupportLiveChat.supportLiveChatMessages,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
    sendSupportLiveChatMessage: sendSupportLiveChatMessage,
    getSupportLiveChatConversation: getSupportLiveChatConversation,
    getSupportLiveChatMessages: getSupportLiveChatMessages,
    getSupportLiveChatPreviousMessages: getSupportLiveChatPreviousMessages,
    getAllToAllDealers: getAllToAllDealers,
    setCurrentConversation: setCurrentConversation,
    markMessagesRead: markMessagesRead,
    resetCurrentConversation: resetCurrentConversation
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
