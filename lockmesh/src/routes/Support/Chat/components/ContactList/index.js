import React from "react";
import UserCell from "./UserCell/index";
import { checkIsArray } from "../../../../utils/commonUtils";

const ContactList = ({ onSelectUser, selectedSectionId, contactList }) => {
  return (
    <div className="gx-chat-user">
      {checkIsArray(contactList).map((user, index) =>
        <UserCell key={index} user={user} selectedSectionId={selectedSectionId} onSelectUser={onSelectUser} />
      )}
    </div>
  )
};

export default ContactList;
