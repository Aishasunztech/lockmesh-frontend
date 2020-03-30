import React from "react";
import {Avatar} from "antd";

const UserCell = ({onSelectUser, selectedSectionId, user}) => {

  return (
    <div className={`gx-chat-user-item ${selectedSectionId === user.id ? 'active' : ''}`} onClick={() => {
      onSelectUser(user, 'user');
    }}>
      <div className="gx-chat-user-row">
        <div className="gx-chat-avatar">
          <div className="gx-status-pos">
            <Avatar src='/static/media/profile-image.c9452584.png' className="gx-size-40" alt="Abbott"/>
          </div>
        </div>
        <div className="gx-chat-contact-col">
          <div className="h4 gx-name">{user.dealer_name} {user.link_code !== '' ? `(${user.link_code})` : ''}</div>
          {/*<div className="gx-chat-info-des gx-text-truncate">{user.link_code}</div>*/}
        </div>
      </div>
    </div>
  )
};

export default UserCell;
