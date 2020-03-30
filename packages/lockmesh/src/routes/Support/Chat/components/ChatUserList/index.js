import React, { Component } from "react";
import { connect } from 'react-redux';
import UserCell from "./UserCell/index";
import { checkIsArray } from "../../../../utils/commonUtils";

class ChatUserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typing: props.typing
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        typing: this.props.typing
      });
    }
  }

  render() {
    const { chatUsers, selectedSectionId, onSelectUser, notifications, messages } = this.props;
    return (
      <div className="gx-chat-user">
        {checkIsArray(chatUsers).map((chat, index) => {
          let noOfReceivedMessages = 0;
          checkIsArray(notifications).map(noti => {
            if (noti.sender === chat.user.dealer_id) {
              noOfReceivedMessages = noti.noOfUnreadMessages;
            }
          });
          let msgs = checkIsArray(messages).filter(msg => msg.conversation_id === chat._id);
          return <UserCell key={index} noOfReceivedMessages={noOfReceivedMessages} msgs={msgs} chat={chat} conversation={chat._id} typing={this.state.typing}
            selectedSectionId={selectedSectionId} onSelectUser={onSelectUser} />
        }
        )}
      </div>
    )
  }
};

const mapStateToProps = ({ SupportLiveChat, sidebar }) => {
  const { typingConversations, supportLiveChatMessages } = SupportLiveChat;
  const { supportChatNotifications } = sidebar;
  return {
    typing: typingConversations,
    notifications: supportChatNotifications,
    messages: supportLiveChatMessages
  }
}

export default connect(mapStateToProps)(ChatUserList);
