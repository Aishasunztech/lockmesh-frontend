import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import {
  DEVICE_PRE_ACTIVATION
} from "../../../../constants/Constants";
import styles from '../reporting.css'
import { generateExcel, generatePDF } from "../../../utils/commonUtils";
var fileName = 'payment_history_' + new Date().getTime()
var columns;
var rows;


class PaymentHistory extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: "Sr.#",
        dataIndex: 'sr',
        key: 'sr',
        align: "center",
        render: (text, record, index) => ++index,
      },

      {
        title: "DEALER ID",
        align: "center",
        className: '',
        dataIndex: 'user_id',
        key: 'user_id',
      },

      {
        title: "DEVICE ID",
        align: "center",
        className: '',
        dataIndex: 'device_id',
        key: 'device_id',
      },

      {
        title: "TYPE",
        align: "center",
        className: '',
        dataIndex: 'type',
        key: 'type',
      },

      {
        title: "TRANSACTION TYPE",
        align: "center",
        className: '',
        dataIndex: 'transection_type',
        key: 'transection_type',
      },

      {
        title: (
          <span>CREDITS</span>
        ),
        align: 'center',
        dataIndex: 'credits',
        key: 'credits',
        className: 'row '
      },

      {
        title: (
          <span>STATUS</span>
        ),
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        className: 'row '
      },

      {
        title: "TRANSACTION DATE",
        align: "center",
        className: '',
        dataIndex: 'created_at',
        key: 'created_at',
      },
    ];

    this.state = {
      reportCard: false,
      isLabel: false,
      deviceList: props.deviceList,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.dealerObject = this.props.dealerList.find((dealer, index) => dealer.dealer_id === values.dealer);
      if (!values.dealerObject && values.dealer) {
        values.dealerObject = { link_code: this.props.user.dealer_pin };
      }
      this.state.reportFormData = values;
      this.props.generatePaymentHistoryReport(values)
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.deviceList !== this.props.deviceList) {
      this.setState({
        deviceList: nextProps.deviceList
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.paymentHistoryReport !== prevProps.paymentHistoryReport) {
      this.setState({
        reportCard: true
      })

      columns = [
        { title: '#', dataKey: "count" },
        { title: "DEALER ID", dataKey: "user_id" },
        { title: "DEVICE ID", dataKey: "device_id" },
        { title: "PRODUCT TYPE", dataKey: "type" },
        { title: "TRANSACTION TYPE", dataKey: "transection_type" },
        { title: "CREDITS", dataKey: "credits" },
        { title: "STATUS", dataKey: "status" },
        { title: "TRANSACTION DATE", dataKey: "created_at" },
      ];

      rows = this.props.paymentHistoryReport.map((item, index) => {
        return {
          count: ++index,
          user_id: item.user_id,
          credits: item.credits,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          status: item.status,
          type: item.type,
          transection_type: item.transection_type,
          created_at: item.created_at
        }
      });
    }
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderList = (list) => {
    if (list) {
      return list.map((item, index) => {
        return {
          rowKey: index,
          key: item.id,
          sr: ++index,
          user_id: item.user_id,
          credits: item.credits,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          status: item.status,
          type: item.type,
          transection_type: item.transection_type,
          created_at: item.created_at
        }
      })
    }
  };

  handleLabelChange = (e) => {
    if (e == '') {
      this.setState({
        isLabel: false
      })

    } else {
      this.props.getDealerList(e)
      this.props.getDeviceList(e);
      this.setState({
        isLabel: true
      })
    }
  }

  handleDealerChange = (e) => {
    let devices = [];

    if (e == '') {
      devices = this.props.deviceList;
    } else {
      devices = this.props.deviceList.filter(device => device.dealer_id == e);
    }
    this.setState({
      deviceList: devices
    })
  }

  render() {
    return (
      <Row>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <Card style={{ height: '600px', paddingTop: '40px' }}>
            <Form onSubmit={this.handleSubmit} autoComplete="new-password">

              <Form.Item
                label="Label"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
              >
                {this.props.form.getFieldDecorator('label', {
                  initialValue: '',
                  rules: [{
                    required: true, message: 'label is Required !',
                  }],
                })(
                  <Select
                    onChange={(e) => this.handleLabelChange(e)}
                    style={{ width: '100%' }}
                  >

                    <Select.Option value=''>SELECT LABEL</Select.Option>
                    {this.props.whiteLabels.map((label, index) => {
                      return (<Select.Option key={index} value={label.id}>{label.name}</Select.Option>)
                    })}
                  </Select>
                )}

              </Form.Item>

              {(this.state.isLabel) ?
                <Fragment>

                  <Form.Item
                    label="Dealer/Sdealer"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    width='100%'
                  >
                    {this.props.form.getFieldDecorator('dealer', {
                      initialValue: '',
                      rules: [
                        {
                          required: false,
                        },
                      ],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        onChange={(e) => this.handleDealerChange(e)}
                      >
                        <Select.Option value=''>ALL</Select.Option>
                        {this.props.dealerList.map((dealer, index) => {
                          return (<Select.Option key={dealer.dealer_id} value={dealer.dealer_id}>{dealer.dealer_name} ({dealer.link_code})</Select.Option>)
                        })}
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item
                    label="Devices"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    width='100%'
                  >
                    {this.props.form.getFieldDecorator('device', {
                      initialValue: '',
                      rules: [
                        {
                          required: false,
                        },
                      ],
                    })(
                      <Select style={{ width: '100%' }}>
                        <Select.Option value=''>ALL</Select.Option>
                        <Select.Option value={DEVICE_PRE_ACTIVATION}>{DEVICE_PRE_ACTIVATION}</Select.Option>
                        {this.state.deviceList.map((device, index) => {
                          return (<Select.Option key={device.device_id} value={device.device_id}>{device.device_id}</Select.Option>)
                        })}
                      </Select>
                    )}
                  </Form.Item>


                  <Form.Item
                    label="Product Type"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    width='100%'
                  >
                    {this.props.form.getFieldDecorator('type', {
                      initialValue: '',
                      rules: [
                        {
                          required: false
                        },
                      ],
                    })(
                      <Select style={{ width: '100%' }}>
                        <Select.Option value=''>ALL</Select.Option>
                        <Select.Option value='hardwares'>HARDWARES</Select.Option>
                        <Select.Option value='services'>SERVICES</Select.Option>
                        <Select.Option value='credits'>CREDITS</Select.Option>
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item
                    label="Transaction Type"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    width='100%'
                  >
                    {this.props.form.getFieldDecorator('transaction_type', {
                      initialValue: '',
                      rules: [
                        {
                          required: false
                        },
                      ],
                    })(
                      <Select style={{ width: '100%' }}>
                        <Select.Option value=''>ALL</Select.Option>
                        <Select.Option value='debit'>DEBIT</Select.Option>
                        <Select.Option value='credit'>CREDIT</Select.Option>
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item
                    label="FROM (DATE) "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                  >
                    {this.props.form.getFieldDecorator('from', {
                      rules: [
                        {
                          required: false
                        }],
                    })(
                      <DatePicker
                        style={{ width: "100%" }}
                        format="DD-MM-YYYY"
                        disabledDate={this.disabledDate}
                      />
                    )}
                  </Form.Item>

                  <Form.Item
                    label="TO (DATE)"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                  >
                    {this.props.form.getFieldDecorator('to', {
                      rules: [
                        {
                          required: false
                        }],
                    })(
                      <DatePicker
                        style={{ width: "100%" }}
                        format="DD-MM-YYYY"
                        onChange={this.saveExpiryDate}
                        disabledDate={this.disabledDate}

                      />
                    )}
                  </Form.Item>
                  <Form.Item className="edit_ftr_btn"
                             wrapperCol={{
                               xs: { span: 22, offset: 0 },
                             }}
                  >
                    <Button key="back" type="button" onClick={this.handleReset}>CANCEL</Button>
                    <Button type="primary" htmlType="submit">GENERATE</Button>
                  </Form.Item>
                </Fragment>
                : null
              }
            </Form>

          </Card>

        </Col>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <Card style={{ height: '500px', overflow: 'overlay' }}>
            {(this.state.reportCard) ?
              <Fragment>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3>Payment History Report</h3>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="pull-right">
                      <Button type="dotted" icon="download" size="small" onClick={() => { generatePDF(columns, rows, 'Payment History Report', fileName, this.state.reportFormData) }}>Download PDF</Button>
                      <Button type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName) }}>Download Excel</Button>
                    </div>
                  </Col>
                </Row>
                <Table
                  columns={this.columns}
                  dataSource={this.renderList(this.props.paymentHistoryReport)}
                  bordered
                  pagination={false}
                  scroll={{ x: true }}
                />
              </Fragment>
              : null}
          </Card>
        </Col>
      </Row>
    )
  }
}

const WrappedAddDeviceForm = Form.create()(PaymentHistory);
export default WrappedAddDeviceForm;
