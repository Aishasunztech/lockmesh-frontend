import React from "react";
import { Button } from 'antd';
import SupportTicketReply from '../SupportTicketReply/index'
import Reply from '../SupportTicketReply/reply';
import CustomScrollbars from 'util/CustomScrollbars'
import { getDateFromTimestamp, getFormattedDate, checkIsArray } from "../../../../utils/commonUtils";
class TicketDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      replyTicket: false
    };
    this.replyRef = React.createRef();
  }

  handleRequestClose = () => {
    this.setState({
      replyTicket: false,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  addReply = () => {
    this.setState({ replyTicket: true });
  }

  render() {
    const { supportTicket, onCloseTicket, closeSupportTicketStatus, user, updateState } = this.props;

    return (
      <div className="gx-module-detail gx-mail-detail">
        <CustomScrollbars className={"text-area-height" + (supportTicket.status === 'open' && closeSupportTicketStatus === false ? "" : " no-reply")}>
          <div className="gx-mail-detail-inner">
            <div className="gx-mail-header">
              <div className="gx-mail-header-content gx-col gx-pl-0">
                <div className="gx-subject font15">
                  <span className="display-float right10"><i className="icon icon-arrow-left gx-icon-btn" onClick={() => {
                    updateState({ currentMail: null });
                    this.props.updateOnTicketPage(false);
                    this.props.resetCurrentTicketId();
                    this.props.resetCurrentSupportTicketId();
                  }} />
                  </span>
                  <span className="display-float word-break">Subject: {supportTicket.subject}<br />
                    Ticket Id: ({supportTicket.ticketId})</span>
                </div>
                {/*<div className="top10">*/}
                <div className="float-left" >
                  {/*{supportTicket.status === 'open' && closeSupportTicketStatus === false?*/}
                  {/*<Button type="primary" size="small" onClick={() => {*/}
                  {/*this.addReply();*/}
                  {/*}}>Reply</Button>*/}
                  {/*: ''*/}
                  {/*}*/}

                  {supportTicket.status === 'open' && closeSupportTicketStatus === false ?
                    <Button type="danger" size="small" onClick={() => {
                      onCloseTicket(supportTicket);
                    }}>Close Ticket</Button>
                    : ''
                  }
                </div>
                {/*</div>*/}

              </div>

              {/*<div className="gx-mail-header-actions">*/}

              {/*<div onClick={() => {*/}
              {/*this.addReply();*/}
              {/*}}>*/}
              {/*{supportTicket.status === 'open' && closeSupportTicketStatus === false?*/}
              {/*<Button type="primary" size="small">Add Reply</Button>*/}
              {/*: ''*/}
              {/*}*/}
              {/*</div>*/}
              {/*</div>*/}
              {/*<div className="gx-mail-header-actions">*/}

              {/*<div onClick={() => {*/}
              {/*onCloseTicket(supportTicket);*/}
              {/*}}>*/}
              {/*{supportTicket.status === 'open' && closeSupportTicketStatus === false?*/}
              {/*<Button type="danger" size="small">Close This Ticket</Button>*/}
              {/*: ''*/}
              {/*}*/}
              {/*</div>*/}
              {/*</div>*/}
            </div>

            {/*<hr/>*/}

            <p className="font16 justify top15">
              <strong>Description:</strong><br />

              {supportTicket.description}
            </p>

            {(this.props.supportTicketReplies.length > 0) ?
              <div>
                <h2>Replies ({this.props.supportTicketReplies.length})</h2>
                {checkIsArray(this.props.supportTicketReplies).map((reply, index) => {
                  return (<div className="gx-module-list-item gx-mail-cell" key={index}>
                    <div className="gx-mail-list-info" style={{ maxWidth: '100%' }}>
                      <div className="gx-module-list-content">
                        <div className="gx-mail-user-des">
                          <span className="gx-sender-name">{(reply.user_type === 'admin') ? 'Admin' : reply.user.dealer_name + ' (' + reply.user.link_code + ')'}</span>
                          <div className="gx-time">{getFormattedDate(reply.createdAt)}</div>
                        </div>
                        <div className="gx-message">
                          <p style={{ textAlign: 'justify' }}>{checkIsArray(reply.description.split("\n")).map((i, k) => <span key={k}>{i}<br /></span>)}</p>
                        </div>
                      </div>
                    </div>
                  </div>)
                })}
              </div>
              : ''}
          </div>

        </CustomScrollbars>

        {supportTicket.status === 'open' && closeSupportTicketStatus === false ?
          <Reply user={this.props.user} supportTicketReply={this.props.supportTicketReply} supportTicket={this.props.supportTicket} />
          : ''
        }


      </div>
    );
  }
}

export default TicketDetail;
