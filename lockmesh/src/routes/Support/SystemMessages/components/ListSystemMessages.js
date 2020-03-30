import React, { Component, Fragment } from 'react'
import moment from 'moment';
import { Table, Button, Icon, Card, Modal } from "antd";
import {
  checkValue,
  convertToLang,
  componentSearchSystemMessages,
  checkIsArray
} from '../../../utils/commonUtils';
import ReadMoreAndLess from 'react-read-more-less';
import { supportSystemMessagesReceiversColumns } from '../../../utils/columnsUtils';
import ViewMessage from './ViewMessage'

let list = [];
let systemMessagesCopy = [];
let status = true;
export default class ListSystemMessages extends Component {

  constructor(props) {
    super(props);
    let receiversColumns = supportSystemMessagesReceiversColumns(props.translation, this.handleSearch);
    let currentMessage = props.currentMessage !== null ? props.currentMessage : null;
    let viewMessage = currentMessage !== null ? true : false;
    this.state = {
      receiversColumns: receiversColumns,
      columns: [],
      expandedRowKeys: [],
      visible: false,
      messageObject: currentMessage,
      viewMessage: viewMessage,
      systemMessages: props.filteredMessage
    };

    this.renderList = this.renderList.bind(this);
    this.confirm = Modal.confirm;
  }

  handleOk = (e) => {
    this.setState({
      viewMessage: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      viewMessage: false
    });
    this.props.resetCurrentSystemMessageId();
  };

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

    if (this.props !== prevProps) {

      if (this.props.currentMessage) {
        let currentMessage = this.props.currentMessage !== null ? this.props.currentMessage : null;
        let viewMessage = currentMessage !== null ? true : false;

        this.setState({ messageObject: currentMessage, viewMessage: viewMessage });
      }

      this.setState({ columns: this.props.columns, systemMessages: this.props.filteredMessage });
    }

    if (this.state.viewMessage && this.props.user.type !== this.state.messageObject.sender_user_type && this.state.messageObject.type === 'Received') {
      this.props.updateSupportSystemMessageNotification({ systemMessageId: [this.state.messageObject.id] })
    }
  }

  componentWillReceiveProps(props) {
    let currentMessage = props.currentMessage !== null ? props.currentMessage : null;
    let viewMessage = currentMessage !== null ? true : false;

    this.setState({ messageObject: currentMessage, viewMessage: viewMessage });
  }

  handleMessageModal = (data) => {
    this.props.setCurrentSystemMessageId(data);
  };

  renderList() {

    let data;
    let renderList = [];

    if (this.state.systemMessages.length > 0) {

      checkIsArray(this.state.systemMessages).map((item) => {
        data = {
          key: item.id,
          id: item.id,
          receiver_ids: item.receiver_ids,
          receivers: item.type === 'Sent' ? item.receiver_ids.length : '--',
          type: item.type,
          sender_user_type: item.sender_user_type,
          sender: item.sender === "" ? "--" : item.sender,
          subjectOriginal: (checkValue(item.subject)),
          subject: (
            <ReadMoreAndLess
              className="read-more-content"
              charLimit={100}
              readMoreText=" Read more"
              readLessText=" Read less"
            >
              {checkValue(item.subject)}
            </ReadMoreAndLess>
          ), // checkValue(item.subject),
          createdAt: item.createdAt,
          createdTime: item.createdTime,
          action: (
            <div data-column="ACTION" style={{ display: "inline-flex" }}>
              <Fragment>
                <Fragment><Button type="primary" size="small" onClick={() => this.handleMessageModal(JSON.parse(JSON.stringify(item)))}>VIEW MESSAGE</Button></Fragment>
              </Fragment>
            </div>
          ),

        };

        renderList.push(data)
      });

      renderList.sort((a, b) => moment(b.createdAt + " " + b.createdTime).format("DD-MM-YYYY HH:mm").localeCompare(moment(a.createdAt + " " + a.createdTime).format("DD-MM-YYYY HH:mm")));

    }
    return renderList

  }

  renderReceiversList(list) {
    let receiversData = [];
    let data;

    let dealerData = [];
    dealerData = checkIsArray(this.props.dealerList).filter(dealer => list.includes(dealer.dealer_id));
    checkIsArray(dealerData).map((item, index) => {
      data = {
        key: item.dealer_id,
        counter: ++index,
        name: item.dealer_name ? item.dealer_name : "N/A",
        link_code: item.link_code ? item.link_code : "N/A",
      };
      receiversData.push(data)
    });

    return receiversData
  }

  customExpandIcon(props) {
    if (props.expanded) {
      return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
        props.onExpand(props.record, e);
      }}><Icon type="caret-down" /></a>
    } else {

      return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
        props.onExpand(props.record, e);
      }}><Icon type="caret-right" /></a>
    }
  }

  onExpandRow = (expanded, record) => {
    if (expanded) {
      if (!this.state.expandedRowKeys.includes(record.key)) {
        this.state.expandedRowKeys.push(record.key);
        this.setState({ expandedRowKeys: this.state.expandedRowKeys })
      }
    } else if (!expanded) {
      if (this.state.expandedRowKeys.includes(record.key)) {
        let list = checkIsArray(this.state.expandedRowKeys).filter(item => item !== record.key);
        this.setState({ expandedRowKeys: list })
      }
    }
  };

  render() {
    return (
      <Fragment>
        <Table
          className="gx-table-responsive msgList"
          rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''}
          expandIcon={(props) => props.record.receivers === '--' ? "" : this.customExpandIcon(props)}
          expandedRowRender={(record) => {
            let expandedTable;
            if (record.receivers === '--') {
              expandedTable = "";
            } else {
              expandedTable = <Table
                style={{ margin: 10 }}
                size="middle"
                bordered
                columns={this.state.receiversColumns}
                dataSource={this.renderReceiversList(record.receiver_ids)}
                pagination={false}
                scroll={{ x: true }}
              />;
            }
            return (
              <Fragment>
                {expandedTable}

              </Fragment>
            );
          }}
          onExpand={this.onExpandRow}
          expandIconColumnIndex={2}
          expandIconAsCell={false}
          size="midddle"
          bordered
          columns={this.state.columns}
          dataSource={this.renderList()}
          pagination={false
          }
          scroll={{ x: true }}
          rowKey="key"
        />

        <Modal
          title={convertToLang(this.props.translation[""], "View Message")}
          width={"700px"}
          maskClosable={false}
          visible={this.state.viewMessage}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
          footer={false}
        >
          <ViewMessage
            messageObject={this.state.messageObject}
            translation={this.props.translation}
          />

        </Modal>

      </Fragment>
    )
  }
}
