import React, { Component } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Modal, Tabs } from "antd";
import { checkValue, convertToLang, getDateFromTimestamp, getOnlyTimeFromTimestamp, checkIsArray } from '../../utils/commonUtils'
import ListSystemMessages from './components/ListSystemMessages';
import SendMessage from './components/SendMessage';
import { getAllDealers } from "../../../appRedux/actions/Dealers";
import { resetCurrentSystemMessageId, setCurrentSystemMessageId } from "../../../appRedux/actions";

import {
  generateSupportSystemMessages,
  getReceivedSupportSystemMessages,
  getSupportSystemMessages,
  updateSupportSystemMessageNotification
} from "../../../appRedux/actions/SupportSystemMessages";
import { supportSystemMessage } from "../../utils/columnsUtils";
import { ADMIN, DEALER, SDEALER } from "../../../constants/Constants";

const TabPane = Tabs.TabPane;
var copySystemMessages = [];

class SystemMessages extends Component {

  constructor(props) {
    super(props);
    var columns = supportSystemMessage(props.translation);
    columns = this.removeColumns(props, columns);

    this.state = {
      columns: columns,
      filter: 'all',
      searchText: '',
      filteredMessages: [],
      sentessages: [],
      receivedMessages: [],
      visible: false,
      sentSupportSystemMessages: [],
      copySentSupportSystemMessages: [],
      receivedSupportSystemMessages: [],
      copyReceivedSupportSystemMessages: [],
      searchSystemMessagesColumns: [],
    };
    this.confirm = Modal.confirm;
  }

  filterMessages(obj) {
    this.setState(obj, this.filter);
  }

  removeColumns = ({ user }, columns) => {
    if (user.type === ADMIN) {
      columns.splice(3, 2);
    } else if (user.type === SDEALER) {
      columns.splice(2, 2);
    } else if (user.type === DEALER) {
      columns.splice(4, 1);
    }
    return columns;
  };

  filter = () => {
    let filter = this.state.filter;
    let searchText = this.state.searchText;
    let filteredSystemMessages = [];

    switch (filter) {
      case 'sent':
        if (this.props.dealerList.length > 0) {
          filteredSystemMessages = checkIsArray(this.state.sentMessages).map((item) => {
            let sender = '';
            if (this.props.user.type === ADMIN) {
              let dealer = item.sender_user_type === ADMIN ? ADMIN : this.props.dealerList.find(dealer => dealer.dealer_id === item.sender_id);
              sender = item.sender_user_type === ADMIN ? ADMIN : dealer.dealer_name;
              sender = sender.charAt(0).toUpperCase() + sender.slice(1);
            }
            return {
              id: item._id,
              key: item._id,
              rowKey: item._id,
              type: 'Sent',
              receiver_ids: item.receiver_ids,
              sender_user_type: item.sender_user_type,
              sender: sender,
              subject: checkValue(item.subject),
              message: checkValue(item.message),
              createdAt: item.createdAt ? getDateFromTimestamp(item.createdAt) : "N/A",
              createdTime: getOnlyTimeFromTimestamp(item.createdAt)
            };
          });
        }
        break;
      case 'received':
        filteredSystemMessages = checkIsArray(this.state.receivedMessages).map((item) => {
          let sender = item.system_message.sender_user_type.charAt(0).toUpperCase() + item.system_message.sender_user_type.slice(1);
          return {
            id: item.system_message._id,
            key: item.system_message._id,
            rowKey: item.system_message._id,
            type: 'Received',
            sender_user_type: item.sender_user_type,
            sender: sender,
            subject: checkValue(item.system_message.subject),
            message: checkValue(item.system_message.message),
            createdAt: getDateFromTimestamp(item.system_message.createdAt),
            createdTime: getOnlyTimeFromTimestamp(item.system_message.createdAt)
          };
        });
        break;
      default:
        let sent = [];
        if (this.props.dealerList.length > 0) {
          sent = checkIsArray(this.state.sentMessages).map((item) => {
            let sender = '';
            if (this.props.user.type === ADMIN) {
              let dealer = item.sender_user_type === ADMIN ? ADMIN : this.props.dealerList.find(dealer => dealer.dealer_id === item.sender_id);
              sender = item.sender_user_type === ADMIN ? ADMIN : dealer.dealer_name;
              sender = sender.charAt(0).toUpperCase() + sender.slice(1);
            }
            return {
              id: item._id,
              key: item._id,
              rowKey: item._id,
              type: 'Sent',
              receiver_ids: item.receiver_ids,
              sender_user_type: item.sender_user_type,
              sender: sender,
              subject: checkValue(item.subject),
              message: checkValue(item.message),
              createdAt: item.createdAt ? getDateFromTimestamp(item.createdAt) : "N/A",
              createdTime: getOnlyTimeFromTimestamp(item.createdAt)
            };
          });
        }
        let received = checkIsArray(this.state.receivedMessages).map((item) => {
          let sender = item.system_message.sender_user_type.charAt(0).toUpperCase() + item.system_message.sender_user_type.slice(1);
          return {
            id: item.system_message._id,
            key: item.system_message._id,
            rowKey: item.system_message._id,
            type: 'Received',
            sender_user_type: item.sender_user_type,
            sender: sender,
            subject: checkValue(item.system_message.subject),
            message: checkValue(item.system_message.message),
            createdAt: getDateFromTimestamp(item.system_message.createdAt),
            createdTime: getOnlyTimeFromTimestamp(item.system_message.createdAt)
          };
        });
        filteredSystemMessages = [...sent, ...received];
        break;
    }

    let filteredMessages = checkIsArray(filteredSystemMessages).filter(message => {
      if (message.subject.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        return message;
      } else if (message.createdAt.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        return message;
      } else if (message.createdTime.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
        return message;
      }

      if (this.props.user.type === DEALER) {
        if (message.type.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
          return message;
        }
      }
    });

    this.setState({ filteredMessages: filteredMessages });
  }

  componentDidMount() {
    let searchSystemMessagesColumnsArray = [];
    this.props.getAllDealers();
    if (this.props.user.type === SDEALER) {
      searchSystemMessagesColumnsArray = ['sender', 'subject', 'createdAt', 'createdTime'];
      this.props.getReceivedSupportSystemMessages();
    } else if (this.props.user.type === ADMIN) {
      searchSystemMessagesColumnsArray = ['subject', 'createdAt', 'createdTime'];
      this.props.getSupportSystemMessages();
    } else {
      searchSystemMessagesColumnsArray = ['sender', 'type', 'subject', 'createdAt', 'createdTime'];
      this.props.getSupportSystemMessages();
      this.props.getReceivedSupportSystemMessages();
    }

    this.setState({ searchSystemMessagesColumns: searchSystemMessagesColumnsArray })
  }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   let receivedSupportSystemMessagesData = [];
  //   let sentSupportSystemMessagesData     = [];
  //
  //   if (this.props.receivedSupportSystemMessages.length > 0 && prevProps.receivedSupportSystemMessages !== this.props.receivedSupportSystemMessages){
  //     let data;
  //     this.props.receivedSupportSystemMessages.map((item) => {
  //       let sender = item.system_message.sender_user_type.charAt(0).toUpperCase() + item.system_message.sender_user_type.slice(1);
  //       data = {
  //         id: item.system_message._id,
  //         key: item.system_message._id,
  //         rowKey: item.system_message._id,
  //         type: 'Received',
  //         sender: sender,
  //         subject: checkValue(item.system_message.subject),
  //         message: checkValue(item.system_message.message),
  //         createdAt: getDateFromTimestamp(item.system_message.createdAt),
  //         createdTime: getOnlyTimeFromTimestamp(item.system_message.createdAt),
  //       };
  //       receivedSupportSystemMessagesData.push(data)
  //     });
  //     this.setState({
  //       sentMessages: this.props.sentSupportSystemMessages,
  //       receivedMessages: this.props.receivedSupportSystemMessages,
  //       receivedSupportSystemMessages: receivedSupportSystemMessagesData,
  //       copyReceivedSupportSystemMessages: receivedSupportSystemMessagesData,
  //     });
  //   }
  //
  //   if ((this.props.sentSupportSystemMessages.length > 0 && prevProps.sentSupportSystemMessages !== this.props.sentSupportSystemMessages) || (this.props.dealerList.length > 0 && prevProps.dealerList !== this.props.dealerList)){
  //
  //     if (this.props.dealerList.length > 0 ){
  //       let data;
  //       let sender = '';
  //       this.props.sentSupportSystemMessages.map((item) => {
  //
  //         if (this.props.user.type === ADMIN){
  //           let dealer  = item.sender_user_type === ADMIN ? ADMIN : this.props.dealerList.find(dealer => dealer.dealer_id === item.sender_id) ;
  //           sender      = item.sender_user_type === ADMIN ? ADMIN : dealer.dealer_name;
  //           sender      = sender.charAt(0).toUpperCase() + sender.slice(1);
  //         }
  //
  //         data = {
  //           id: item._id,
  //           key: item._id,
  //           rowKey: item._id,
  //           type: 'Sent',
  //           receiver_ids: item.receiver_ids,
  //           sender: sender,
  //           subject: checkValue(item.subject),
  //           message: checkValue(item.message),
  //           createdAt: item.createdAt ? getDateFromTimestamp(item.createdAt) : "N/A",
  //           createdTime: getOnlyTimeFromTimestamp(item.createdAt),
  //         };
  //         sentSupportSystemMessagesData.push(data)
  //       });
  //       this.setState({
  //         sentSupportSystemMessages: sentSupportSystemMessagesData,
  //         copySentSupportSystemMessages: sentSupportSystemMessagesData,
  //       });
  //     }
  //
  //   }
  // }

  componentWillReceiveProps(prevProps) {
    this.setState({ sentMessages: prevProps.sentSupportSystemMessages, receivedMessages: prevProps.receivedSupportSystemMessages }, this.filter);
  }

  componentWillUnmount() {
    if (this.props.resetCurrentSystemMessageId) {
      this.props.resetCurrentSystemMessageId();
    }
  }

  handleSendMsgButton = (visible) => {
    this.setState({ visible })
  };

  render() {
    return (
      <div>
        {
          <div>

            <ListSystemMessages
              filteredMessage={this.state.filteredMessages}
              updateSupportSystemMessageNotification={this.props.updateSupportSystemMessageNotification}
              columns={this.state.columns}
              dealerList={this.props.dealerList}
              user={this.props.user}
              translation={this.props.translation}
              currentMessage={this.props.currentMessage}
              systemMessagesSearchValue={this.props.systemMessagesSearchValue}
              resetCurrentSystemMessageId={this.props.resetCurrentSystemMessageId}
              setCurrentSystemMessageId={this.props.setCurrentSystemMessageId}
            />

          </div>
        }
        {/* Send Message modal */}
        <Modal
          title={convertToLang(this.props.translation[""], "Send Message")}
          width={"700px"}
          maskClosable={false}
          visible={this.state.visible}
          onOk={() => this.setState({ visible: false })}
          onCancel={() => this.setState({ visible: false })}
          footer={false}
        >
          <SendMessage
            handleCancelSendMsg={this.handleSendMsgButton}
            getAllDealers={this.props.getAllDealers}
            dealerList={this.props.dealerList}
            translation={this.props.translation}
            generateSupportSystemMessages={this.props.generateSupportSystemMessages}
          />

        </Modal>

      </div>
    )
  }

}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
    generateSupportSystemMessages: generateSupportSystemMessages,
    getSupportSystemMessages: getSupportSystemMessages,
    getReceivedSupportSystemMessages: getReceivedSupportSystemMessages,
    updateSupportSystemMessageNotification: updateSupportSystemMessageNotification,
    resetCurrentSystemMessageId: resetCurrentSystemMessageId,
    setCurrentSystemMessageId: setCurrentSystemMessageId,
  }, dispatch);
}

const mapStateToProps = ({ account, auth, settings, dealers, SupportSystemMessages, sidebar }) => {
  return {
    isloading: account.isloading,
    user: auth.authUser,
    dealerList: dealers.dealers,
    translation: settings.translation,
    currentMessage: sidebar.currentMessageId,
    sentSupportSystemMessages: SupportSystemMessages.supportSystemMessages,
    receivedSupportSystemMessages: SupportSystemMessages.receivedSupportSystemMessages,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(SystemMessages);
