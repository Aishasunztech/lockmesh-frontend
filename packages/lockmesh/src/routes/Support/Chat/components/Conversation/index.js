import React, { Component } from "react";

import ReceivedMessageCell from "./ReceivedMessageCell/index";
import SentMessageCell from "./SentMessageCell/index";
import { checkIsArray } from "../../../../utils/commonUtils";

class Conversation extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { conversationData, selectedUser, user } = this.props;
    return (
      <div className="gx-chat-main-content">
        {conversationData !== undefined && checkIsArray(conversationData).map((conversation, index) =>
          conversation.sender === user.dealerId ?
            <SentMessageCell key={index} conversation={conversation} /> :
            <ReceivedMessageCell key={index} conversation={conversation} user={selectedUser} />


        )}
      </div>
    )
  }

};

export default Conversation;
