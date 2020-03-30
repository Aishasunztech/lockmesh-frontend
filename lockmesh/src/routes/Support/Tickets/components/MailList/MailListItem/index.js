import React from "react";
import { Avatar, Checkbox, Row, Col } from "antd";
import { getDateFromTimestamp } from "../../../../../utils/commonUtils";

import statuses from "../../../data/statuses";
import categories from "../../../data/categories";
import priorities from "../../../data/priorities";
import { ADMIN } from "../../../../../../constants/Constants";

const MailListItem = ({ supportTicket, onMailSelect, onMailChecked, user }) => {

  return (
    <div className="gx-module-list-item gx-mail-cell">
      <div className="gx-mail-list-info" style={{ maxWidth: '100%', paddingLeft: 0 }} onClick={(e) => {
        let element = /excludeCheckBoxClickOnMainRow/.test(e.target.classList.value);
        let directParent = /excludeCheckBoxClickOnMainRow/.test(e.target.parentNode.classList.value);
        let directdirectParent = /excludeCheckBoxClickOnMainRow/.test(e.target.parentNode.parentNode.classList.value);
        if (element || directParent || directdirectParent) {
        } else {
          onMailSelect(supportTicket);
        }
      }}>
        <Row className="width_100">
          <div className="gx-module-list-content">
            <div className="gx-mail-user-des">
              <Col span="2">
                <div className="gx-module-list-icon excludeCheckBoxClickOnMainRow">
                  {(user.type === ADMIN && supportTicket.status === 'closed') ?
                    <Checkbox color="primary" className="gx-icon-btn selectCheckBox"

                      onClick={(event) => {
                        event.stopPropagation();
                        onMailChecked(supportTicket)
                      }}
                      value="SelectMail"
                    />
                    :
                    <Checkbox color="primary" className="gx-icon-btn selectCheckBox" disabled={true} style={{ visibility: 'hidden' }}

                      onClick={(event) => {
                        event.stopPropagation();
                        onMailChecked(supportTicket)
                      }}
                      value="SelectMail"
                    />
                  }
                </div>
              </Col>
              <Col span="3">
                <span className="gx-labels">{supportTicket.ticketId}</span>
              </Col>
              <Col span="4">
                <span className="gx-sender-name">{supportTicket.user.dealer_name}<br />({supportTicket.user.link_code})</span>
              </Col>
              <Col span="6">
                <span className="gx-d-inline-block gx-text-truncate gx-send-subject">{supportTicket.subject}</span>
              </Col>
              <Col span="2">
                <span className="gx-labels">
                  {checkIsArray(statuses).map((status, index) => {
                    return (supportTicket.status).includes(status.title) &&
                      <div key={index} className={`gx-badge gx-text-white gx-bg-${status.title === 'open' ? 'green' : 'red'} text-capitalize`}>{status.title}</div>
                  })}
                </span>
              </Col>
              <Col span="2">
                <span className="gx-labels">
                  {checkIsArray(categories).map((category, index) => {
                    return (supportTicket.category).includes(category.title) &&
                      <div key={index} className={`gx-badge gx-text-white gx-bg-blue text-capitalize`}>{category.title}</div>
                  })}
                </span>
              </Col>
              <Col span="2">
                <span className="gx-labels">
                  {checkIsArray(priorities).map((priority, index) => {
                    return (supportTicket.priority).includes(priority.title) &&
                      <div key={index} className={`gx-badge gx-text-white gx-bg-purple text-capitalize`}>{priority.title}</div>
                  })}
                </span>
              </Col>
              <Col span="3">
                <span className="gx-time">{getDateFromTimestamp(supportTicket.createdAt)}</span>
              </Col>
            </div>
            {/* <div className="gx-message">
            <p className="gx-text-truncate"> {supportTicket.description}</p>
          </div> */}
          </div>
        </Row>
      </div>

    </div>
  )
};

export default MailListItem;
