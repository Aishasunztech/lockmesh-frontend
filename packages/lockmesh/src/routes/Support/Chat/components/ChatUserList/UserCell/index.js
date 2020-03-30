import React from "react";
import {Avatar, Button, Icon, Modal, Badge} from "antd";

const UserCell = ({ chat, conversation, selectedSectionId, onSelectUser, typing, noOfReceivedMessages, msgs }) => {
  let isTyping = typing.some(conv => conv === conversation);
  return (
    <div className={`gx-chat-user-item ${chat.hasOwnProperty('user') && chat.user.hasOwnProperty('dealer_id') && selectedSectionId === chat.user.dealer_id ? 'active' : ''}`} onClick={() => {
        onSelectUser(chat, 'chat');
    }}>
      <Badge count={noOfReceivedMessages}>
        <div className="gx-chat-user-row">
          <div className="gx-chat-avatar">
            <div className="gx-status-pos">
              <Avatar src='/static/media/profile-image.c9452584.png' className="gx-size-40" alt={chat.user.dealer_name}/>
            </div>
          </div>

          <div className="gx-chat-info">
            <span className="gx-name h4">{chat.user.dealer_name} {chat.user.link_code !== '' ? `(${chat.user.link_code})`: ''}</span>
            {/*<div className="gx-chat-info-des gx-text-truncate">{chat.user.link_code}</div>*/}
            <small className="gx-chat-info-des gx-text-truncate">{isTyping ? 'is typing...' : ''}</small>
          </div>

          {/*{chat.unreadMessage > 0 ? <div className="gx-chat-date">*/}
          {/*  <div className="gx-bg-primary gx-rounded-circle gx-badge gx-text-white">{chat.unreadMessage}</div>*/}
          {/*</div> : null}*/}
        </div>
      </Badge>
    </div>
  );
}

export default UserCell;
