import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import {
  DEVICE_PRE_ACTIVATION
} from "../../../../constants/Constants";
import styles from '../reporting.css'
import { convertToLang, generateExcel, generatePDF, checkIsArray } from "../../../utils/commonUtils";
var fileName = 'payment_history_' + new Date().getTime()
var columns;
var rows;


class PaymentHistory extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: "#",
        dataIndex: 'count',
        key: 'count',
        align: "center",
        render: (text, record, index) => ++index,
        // sorter: (a, b) => { return a.count - b.count },
        // sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "DEALER PIN"),
        align: "center",
        className: '',
        dataIndex: 'dealer_pin',
        key: 'dealer_pin',
        sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "DEVICE ID"),
        align: "center",
        className: '',
        dataIndex: 'device_id',
        key: 'device_id',
        sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "TYPE"),
        align: "center",
        className: '',
        dataIndex: 'type',
        key: 'type',
        sorter: (a, b) => { return a.type.localeCompare(b.type) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "TRANSACTION TYPE"),
        align: "center",
        className: '',
        dataIndex: 'transection_type',
        key: 'transection_type',
        sorter: (a, b) => { return a.transection_type.localeCompare(b.transection_type) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: (
          <span>{convertToLang(props.translation[''], "CREDITS")}</span>
        ),
        align: 'center',
        dataIndex: 'credits',
        key: 'credits',
        className: 'row ',
        sorter: (a, b) => { return a.credits - b.credits },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: (
          <span>{convertToLang(props.translation[''], "STATUS")}</span>
        ),
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        className: 'row ',
        sorter: (a, b) => { return a.status.localeCompare(b.status) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "TRANSACTION DATE"),
        align: "center",
        className: '',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
        sortDirections: ['ascend', 'descend'],
      },
    ];

    this.state = {
      reportCard: false,
      reportFormData: {},
      deviceList: props.devices,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.state.reportFormData = values;
      this.props.generatePaymentHistoryReport(values)
    });
  };

  componentWillReceiveProps(nextProps) {
    // console.log("nextProps.devices ", nextProps.devices)
    if (nextProps.devices !== this.props.devices) {
      this.setState({
        deviceList: nextProps.devices
      })
    }
  }

  componentDidMount() {

  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.paymentHistoryReport !== prevProps.paymentHistoryReport) {
      this.setState({
        reportCard: true
      })

      columns = [
        { title: '#', dataKey: "count" },
        { title: convertToLang(this.props.translation[''], "DEALER PIN"), dataKey: "dealer_pin" },
        { title: convertToLang(this.props.translation[''], "DEVICE ID"), dataKey: "device_id" },
        { title: convertToLang(this.props.translation[''], "PRODUCT TYPE"), dataKey: "type" },
        { title: convertToLang(this.props.translation[''], "TRANSACTION TYPE"), dataKey: "transection_type" },
        { title: convertToLang(this.props.translation[''], "CREDITS"), dataKey: "credits" },
        { title: convertToLang(this.props.translation[''], "STATUS"), dataKey: "status" },
        { title: convertToLang(this.props.translation[''], "TRANSACTION DATE"), dataKey: "created_at" },
      ];

      rows = checkIsArray(this.props.paymentHistoryReport).map((item, index) => {
        return {
          count: ++index,
          dealer_pin: item.dealer_pin,
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
    // if (list) {
      return checkIsArray(list).map((item, index) => {
        return {
          rowKey: index,
          key: item.id,
          count: ++index,
          dealer_pin: item.dealer_pin,
          credits: item.credits,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          status: item.status,
          type: item.type,
          transection_type: item.transection_type,
          created_at: item.created_at
        }
      })
    // }
  };

  handleDealerChange = (e) => {
    let devices = [];
    if (e == '') {
      devices = this.props.devices
    } else {
      devices = checkIsArray(this.props.devices).filter(device => device.dealer_id == e);
      // console.log("handleDealerChange ", devices);
    }
    this.setState({
      deviceList: devices
    })
  }


  render() {
    return (
      <Row>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <Card bordered={false} style={{ height: '520px', overflow: 'scroll' }}>
            <Form onSubmit={this.handleSubmit} autoComplete="new-password">

              <Form.Item
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
              >
              </Form.Item>

              {(this.props.user.type === 'sdealer') ?

                <Form.Item style={{ marginBottom: 0 }}
                >
                  {this.props.form.getFieldDecorator('dealer', {
                    initialValue: this.props.user.dealerId,
                  })(

                    <Input type='hidden' disabled />
                  )}
                </Form.Item>

                : <Form.Item
                  label="Dealer/Sdealer"
                  labelCol={{ span: 10 }}
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
                      <Select.Option value={this.props.user.dealerId}>My Report</Select.Option>
                      {checkIsArray(this.props.dealerList).map((dealer, index) => {
                        return (<Select.Option key={dealer.dealer_id} value={dealer.dealer_id}>{dealer.dealer_name} ({dealer.link_code})</Select.Option>)
                      })}
                    </Select>
                  )}
                </Form.Item>
              }

              <Form.Item
                label="Devices"
                labelCol={{ span: 10 }}
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
                    {checkIsArray(this.state.deviceList).map((device, index) => {
                      return (<Select.Option key={device.device_id} value={device.device_id}>{device.device_id}</Select.Option>)
                    })}
                  </Select>
                )}
              </Form.Item>

              <Form.Item
                label="Product Type"
                labelCol={{ span: 10 }}
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
                labelCol={{ span: 10 }}
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
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
              >
                {this.props.form.getFieldDecorator('from', {
                  rules: [
                    {
                      required: false
                    }],
                })(
                  <DatePicker
                    format="DD-MM-YYYY"
                    disabledDate={this.disabledDate}
                  />
                )}
              </Form.Item>

              <Form.Item
                label="TO (DATE)"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
              >
                {this.props.form.getFieldDecorator('to', {
                  initialValue: moment(),
                  rules: [
                    {
                      required: false
                    }],
                })(
                  <DatePicker
                    format="DD-MM-YYYY"
                    onChange={this.saveExpiryDate}
                    disabledDate={this.disabledDate}

                  />
                )}
              </Form.Item>
              <Form.Item className="edit_ftr_btn"
                wrapperCol={{
                  xs: { span: 24, offset: 0 },
                }}
              >
                <Button key="back" type="button" onClick={this.handleReset}>CANCEL</Button>
                <Button type="primary" htmlType="submit">GENERATE</Button>
              </Form.Item>
            </Form>

          </Card>

        </Col>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <Card bordered={false} style={{ height: '520px', overflow: 'scroll' }}>
            {(this.state.reportCard) ?
              <Fragment>
                <Row>
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <h3>Payment History Report</h3>
                  </Col>
                  <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                    <div className="pull-right">
                      <Button className="mb-8" type="dotted" icon="download" size="small" onClick={() => { generatePDF(columns, rows, 'Payment History Report', fileName, this.state.reportFormData) }}>Download PDF</Button>
                      <Button className="mb-8" type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName) }}>Download Excel</Button>
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
