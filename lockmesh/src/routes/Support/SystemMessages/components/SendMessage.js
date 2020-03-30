import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber, Row, Col, Tag, Calendar, DatePicker, TimePicker, Modal } from 'antd';
import { checkValue, convertToLang, checkIsArray } from '../../../utils/commonUtils'
import { Button_Cancel, Button_submit } from '../../../../constants/ButtonConstants';
import { Required_Fields } from '../../../../constants/DeviceConstants';
import moment from 'moment';
const { TextArea } = Input;


class SendMessage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      selectedDealers: [],
      dealerList: [],
      allDealers: [],
      selectedAction: 'NONE',
      selected_dateTime: null,
      selected_Time: '',
      isNowSet: false,
      repeat_duration: 'NONE',
      timer: '',
      monthDate: 0,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {

      let dealerData = [];
      dealerData = checkIsArray(this.props.dealerList).filter(dealer => this.state.selectedDealers.find(item => item.key === dealer.dealer_id));

      if (!err) {
        values.receivers = dealerData;
        values.subject = btoa(values.subject);
        values.message = btoa(values.message);
        this.props.generateSupportSystemMessages(values);
        this.handleCancel();
      }
    });
  };


  componentDidMount() {

    if (this.props.dealerList.length > 0) {
      let allDealers = checkIsArray(this.props.dealerList).map((item) => {
        return ({ key: item.dealer_id, id: item.dealer_id, label: item.dealer_name, email: item.email })
      });

      this.setState({
        dealerList: this.props.dealerList,
        allDealers: allDealers,
      })
    }


  }

  handleDeselect = (e, dealerOrUser = '') => {

    if (dealerOrUser == "dealers") {
      let updateDealers = checkIsArray(this.state.selectedDealers).filter(item => item.key != e.key);
      this.state.selectedDealers = updateDealers;
      this.state.checkAllSelectedDealers = false;
    }
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({ repeat_duration: 'NONE' })
  };


  handleCancel = () => {
    this.handleReset();
    this.props.handleCancelSendMsg(false);
    this.setState({
      selectedDealers: []
    })
  };

  handleChange = (e) => {
    this.setState({ type: e.target.value });
  };

  handleChangeDealer = (values, option) => {

    let checkAllDealers = this.state.checkAllSelectedDealers;
    let selectAll = checkIsArray(values).filter(e => e.key === "all");
    let selectedDealers = [];

    if (selectAll.length > 0) {
      checkAllDealers = !this.state.checkAllSelectedDealers;
      if (this.state.checkAllSelectedDealers) {
        selectedDealers = [];
      } else {
        selectedDealers = this.state.allDealers
      }
    }
    else if (values.length === this.props.dealerList.length) {
      selectedDealers = this.state.allDealers;
      checkAllDealers = true;
    }
    else {
      selectedDealers = checkIsArray(values).filter(e => e.key !== "all");
    }


    let data = {
      dealers: selectedDealers
    };


    this.setState({
      selectedDealers,
      checkAllSelectedDealers: checkAllDealers,
    });

  };

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };

  disabledDate = (current) => {
    return current && current < moment().endOf('day');
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>

          <Row gutter={24} className="mt-4">
            <Col className="col-md-12 col-sm-12 col-xs-12">
              <Form.Item
                label={convertToLang(this.props.translation[""], "Select dealer/sdealers")}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                {this.props.form.getFieldDecorator('dealers', {
                  rules: [
                    {
                      required: true, message: convertToLang(this.props.translation[""], "Dealer/SDealer is required"),
                    }
                  ],
                })(
                  <Select
                    value={this.state.selectedDealers}
                    mode="multiple"
                    labelInValue
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    maxTagCount={this.state.checkAllSelectedDealers ? 0 : 2}
                    maxTagTextLength={10}
                    maxTagPlaceholder={this.state.checkAllSelectedDealers ? "All Selected" : `${this.state.selectedDealers.length - 2} more`}
                    style={{ width: '100%' }}
                    placeholder={convertToLang(this.props.translation[""], "Select dealer/sdealers")}
                    onChange={this.handleChangeDealer}
                    onDeselect={(e) => this.handleDeselect(e, "dealers")}

                  >
                    {(this.state.allDealers && this.state.allDealers.length > 0) ?
                      <Select.Option key="allDealers" value="all">Select All</Select.Option>
                      : <Select.Option key="" value="">Dealers not found</Select.Option>
                    }
                    {checkIsArray(this.state.allDealers).map(item => <Select.Option key={item.key} value={item.key} >{item.label}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          {(this.state.selectedDealers && this.state.selectedDealers.length && !this.state.checkAllSelectedDealers) ?
            <div><h5>Dealers/S-Dealers Selected: <span className="font_26">{checkIsArray(this.state.selectedDealers).map((item, index) => <Tag key={index}>{item.label}</Tag>)}</span></h5></div>
            : null}

          <Row gutter={24} className="mt-4">
            <Col className="col-md-12 col-sm-12 col-xs-12">
              <Form.Item
                label={convertToLang(this.props.translation[""], "Subject")}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                {this.props.form.getFieldDecorator('subject', {
                  initialValue: '',
                  rules: [
                    {
                      required: true, message: convertToLang(this.props.translation[""], "Subject is required"),
                    }
                  ],
                })(
                  <Input
                    placeholder="Subject"
                  />
                )}
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={24} className="mt-4">
            <Col className="col-md-12 col-sm-12 col-xs-12">
              <Form.Item
                label={convertToLang(this.props.translation[""], "Message")}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                {this.props.form.getFieldDecorator('message', {
                  initialValue: '',
                  rules: [
                    {
                      required: true, message: convertToLang(this.props.translation[""], "Message is required"),
                    }
                  ],
                })(
                  <TextArea
                    autosize={{ minRows: 3, maxRows: 5 }}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>


          <Form.Item className="edit_ftr_btn"
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 24, offset: 0 },
            }}
          >
            <Button type="button" onClick={this.handleCancel}> {convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>
            <Button type="primary" htmlType="submit"> {convertToLang(this.props.translation[""], "Send")} </Button>
          </Form.Item>

        </Form>
      </div>
    )

  }
}

const WrappedAddDeviceForm = Form.create()(SendMessage);
export default WrappedAddDeviceForm;
