import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment, { now } from 'moment';
import {
  DEVICE_PRE_ACTIVATION
} from "../../../../constants/Constants";
import styles from '../reporting.css'
import { convertToLang, generatePDF, generateExcel, getDateFromTimestamp, checkIsArray } from "../../../utils/commonUtils";
let fileName = 'hardware_report_' + new Date().getTime();
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
        sorter: (a, b) => { return a.count - b.count },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "HARDWARE"),
        align: "center",
        className: '',
        dataIndex: 'hardware',
        key: 'hardware',
        sorter: (a, b) => { return a.hardware.localeCompare(b.hardware) },
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
        title: convertToLang(props.translation[''], "DEVICE ID"),
        align: "center",
        className: '',
        dataIndex: 'device_id',
        key: 'device_id',
        sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "CREATED AT"),
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
      values.dealerObject = this.props.dealerList.find((dealer, index) => dealer.dealer_id === values.dealer);
      this.state.reportFormData = values;
      this.props.generateHardwareReport(values)
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
    if (this.props.hardwareReport !== prevProps.hardwareReport) {
      this.setState({
        reportCard: true
      });

      columns = [
        { title: '#', dataKey: "count" },
        { title: convertToLang(this.props.translation[''], "HARDWARE"), dataKey: "hardware" },
        { title: convertToLang(this.props.translation[''], "DEALER PIN"), dataKey: "dealer_pin" },
        { title: convertToLang(this.props.translation[''], "DEVICE ID"), dataKey: "device_id" },
        { title: convertToLang(this.props.translation[''], "CREATED AT"), dataKey: "created_at" },
      ];

      rows = checkIsArray(this.props.hardwareReport).map((item, index) => {
        return {
          count: ++index,
          dealer_pin: item.dealer_pin,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          hardware: item.hardware_name,
          created_at: getDateFromTimestamp(item.created_at)
        }
      })

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
      let data = [];
      let counter = 1;
      checkIsArray(list).map((item, index) => {
        let hardware = JSON.parse(item.hardware_data);
        data.push({
          rowKey: counter++,
          key: counter++,
          count: ++index,
          dealer_pin: item.dealer_pin,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          hardware: hardware.hardware_name,
          created_at: getDateFromTimestamp(item.created_at)
        })
      });
      return data;
    // }
  };

  handleDealerChange = (e) => {
    let devices = [];
    if (e == '') {
      devices = this.props.devices
    } else {
      devices = checkIsArray(this.props.devices).filter(device => device.dealer_id == e);
    }
    this.setState({
      deviceList: devices
    })
  }

  render() {
    return (
      <Row>
        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <Card bordered={false} style={{ height: '520px', overflow: 'scroll' }} >
            <Form onSubmit={this.handleSubmit} autoComplete="new-password">

              <Form.Item
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
              >
              </Form.Item>

              <Form.Item
                label="Hardware"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('hardware', {
                  initialValue: '',
                  rules: [
                    {
                      required: false
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option value=''>ALL</Select.Option>
                    {checkIsArray(this.props.hardwares).map((hardware, index) => {
                      return (<Select.Option key={hardware.hardware_name} value={hardware.hardware_name}>{hardware.hardware_name}</Select.Option>)
                    })}
                  </Select>
                )}
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
                      required: false,
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
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <h3>Hardware Inventory Report</h3>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Button className="mb-8" type="dotted" icon="download" size="small" onClick={() => { generatePDF(columns, rows, 'Hardware Report', fileName, this.state.reportFormData); }}>Download PDF</Button>
                    <Button className="mb-8" type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName) }}>Download Excel</Button>
                  </Col>
                </Row>
                <Table
                  columns={this.columns}
                  dataSource={this.renderList(this.props.hardwareReport)}
                  bordered
                  scroll={{ x: true }}
                  pagination={false}

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
