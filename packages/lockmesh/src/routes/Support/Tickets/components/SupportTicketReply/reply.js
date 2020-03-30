import React, { Component } from 'react';

class Reply extends Component {
  constructor(props){
    super(props);
    this.state = {
      description: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(){
    if(this.state.description !== '' && this.state.description.trim().length !== ''){
      let description = this.state.description;
      let replyObject = {
        description: btoa(description),
        user: this.props.user,
        ticket_id: this.props.supportTicket._id
      }

      this.props.supportTicketReply(replyObject);
      this.refs.ticket.value = '';
      this.setState({description: ''});
    }
  }

  handleKeyDown(e){
    this.setState({description: e.target.value});
  }

  doIfKeyCode(e, keys=[], cb=null){
    if(!Array.isArray(keys)){
      return;
    }
    if(keys.includes(e.keyCode) && typeof cb === 'function'){
      cb();
    }
    return;
  };

  render(){
    return (
      <div className="gx-chat-main-footer">
        <div className="gx-flex-row gx-align-items-center" style={{maxHeight: 100}}>
          <div className="gx-col">
            <div className="gx-form-group">
              <textarea
                ref="ticket"
                rows={5}
                className="gx-border-0 ant-input"
                placeholder="Description"
                onKeyUp={(e) => this.handleKeyDown(e)}
              />
            </div>
          </div>
          <i className="button-ticket-reply-send gx-icon-btn icon icon-sent" tabIndex="0" onKeyDown={(e) => this.doIfKeyCode(e, [32, 13], this.handleSubmit)} onClick={this.handleSubmit}/>
        </div>
      </div>
    );
  }
}


export default Reply;
