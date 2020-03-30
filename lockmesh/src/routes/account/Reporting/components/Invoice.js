import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import styles from '../reporting.css'
import { convertToLang, generatePDF, generateExcel, getDateFromTimestamp, checkIsArray } from "../../../utils/commonUtils";
import {
  DEVICE_PRE_ACTIVATION, DEVICE_UNLINKED
} from "../../../../constants/Constants";

import {
  BASE_URL
} from "../../../../constants/Application";
import { PRE_ACTIVATE_DEVICE } from "../../../../constants/ActionTypes";
var columns;
var rows;
var fileName = 'invoice_' + new Date().getTime();
class Invoice extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '#',
        dataIndex: 'count',
        align: 'center',
        className: 'row',
        width: 50,
        sorter: (a, b) => { return a.count - b.count },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "INVOICE ID"),
        align: "center",
        className: '',
        dataIndex: 'invoice_id',
        key: 'invoice_id',
        sorter: (a, b) => { return a.invoice_id.localeCompare(b.invoice_id) },
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
        title: convertToLang(props.translation[''], "DEALER PIN"),
        align: "center",
        className: '',
        dataIndex: 'dealer_pin',
        key: 'dealer_pin',
        sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "USER PAYMENT STATUS"),
        align: "center",
        className: '',
        dataIndex: 'end_user_payment_status',
        key: 'end_user_payment_status',
        sorter: (a, b) => { return a.end_user_payment_status.localeCompare(b.end_user_payment_status) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "GENERATED AT"),
        align: "center",
        className: '',
        dataIndex: 'created_at',
        key: 'created_at',
        sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "ACTION"),
        align: "center",
        className: '',
        dataIndex: 'file_name',
        key: 'file_name',
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

      values.dealerObject = this.props.dealerList.find((dealer, index) => dealer.dealer_id === values.dealer);
      if (!values.dealerObject && values.dealer) {
        values.dealerObject = { link_code: this.props.user.dealer_pin };
      }
      this.state.reportFormData = values;
      this.props.generateInvoiceReport(values)
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
    if (this.props.invoiceReport !== prevProps.invoiceReport) {
      this.setState({
        reportCard: true,
        productType: this.props.productType
      })

      rows = checkIsArray(this.props.invoiceReport).map((item, index) => {
        return {
          count: ++index,
          invoice_id: item.inv_no ? item.inv_no : 'N/A',
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          dealer_pin: item.dealer_pin ? item.dealer_pin : 'N/A',
          created_at: item.created_at ? getDateFromTimestamp(item.created_at) : 'N/A',
          end_user_payment_status: item.end_user_payment_status ? item.end_user_payment_status : 'N/A',
        }
      });

      columns = [
        { title: '#', dataKey: "count" },
        { title: convertToLang(this.props.translation[''], "INVOICE ID"), dataKey: "invoice_id" },
        { title: convertToLang(this.props.translation[''], "DEVICE ID"), dataKey: "device_id" },
        { title: convertToLang(this.props.translation[''], "USER PAYMENT STATUS"), dataKey: "end_user_payment_status" },
        { title: convertToLang(this.props.translation[''], "GENERATED AT"), dataKey: "created_at" },
      ];
    }
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderList = (list) => {

    let data = [];
    // if (list) {
      checkIsArray(list).map((item, index) => {
        data.push({
          'key': index,
          'count': ++index,
          'invoice_id': item.inv_no ? item.inv_no : 'N/A',
          'device_id': item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          'dealer_pin': item.dealer_pin ? item.dealer_pin : 'N/A',
          'created_at': item.created_at ? getDateFromTimestamp(item.created_at) : 'N/A',
          'end_user_payment_status': item.end_user_payment_status ? item.end_user_payment_status : 'N/A',
          'file_name': <a href={BASE_URL + 'users/getFile/' + item.file_name} target="_blank" download><Button type="primary" size="small">Download</Button></a>,
        })
      });
    // }
    return data;
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
                      <Select.Option value={this.props.user.dealerId} key={this.props.user.dealerId}>My Report</Select.Option>
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
                label="Payment Status"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('payment_status', {
                  initialValue: '',
                  rules: [
                    {
                      required: false
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option value=''>ALL</Select.Option>
                    <Select.Option value='PAID'>PAID</Select.Option>
                    <Select.Option value='UNPAID'>UNPAID</Select.Option>
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
                <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>GENERATE</Button>
              </Form.Item>
            </Form>

          </Card>

        </Col>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <Card bordered={false} style={{ height: '520px', overflow: 'scroll' }}>
            {(this.state.reportCard) ?
              <Fragment>
                <Row>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <h3>Invoice Report</h3>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Button className="mb-8" type="dotted" icon="download" size="small" onClick={() => { generatePDF(columns, rows, 'Invoice Report', fileName, this.state.reportFormData) }}>Download PDF</Button>
                    <Button className="mb-8" type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName) }}>Download Excel</Button>
                  </Col>
                </Row>
                <Table
                  columns={this.columns}
                  dataSource={this.renderList(this.props.invoiceReport)}
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

const WrappedAddDeviceForm = Form.create()(Invoice);
export default WrappedAddDeviceForm;
