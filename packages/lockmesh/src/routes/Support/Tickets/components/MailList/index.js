import React from "react";
import CustomScrollbars from 'util/CustomScrollbars'

import MailListItem from "./MailListItem";
import { checkIsArray } from "../../../../utils/commonUtils";

const MailList = ({ supportTickets, onMailSelect, onMailChecked, user }) => {

  return (
    <div className="gx-module-list gx-mail-list">
      <CustomScrollbars className="gx-module-content-scroll">
        {checkIsArray(supportTickets).map(
            (supportTicket, index) => {
              return
              (
                <MailListItem
                  key={supportTicket._id}
                  supportTicket={supportTicket}
                  onMailSelect={onMailSelect}
                  onMailChecked={onMailChecked}
                  user={user}
                />
              )
            }
          )
        }

      </CustomScrollbars>
    </div>
  )
};

export default MailList;
