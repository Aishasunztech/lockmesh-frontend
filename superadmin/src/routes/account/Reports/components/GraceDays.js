import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import {
  DEVICE_PRE_ACTIVATION
} from "../../../../constants/Constants";
import styles from '../reporting.css'
import { generateExcel, generatePDF, getDateFromTimestamp } from "../../../utils/commonUtils";
var fileName = 'grace_days_' + new Date().getTime();
var columns;
var rows;


class PaymentHistory extends Component {
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
        title: "DEVICE ID",
        align: "center",
        className: '',
        dataIndex: 'device_id',
        key: 'device_id',
        sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: "DEALER PIN",
        align: "center",
        className: '',
        dataIndex: 'dealer_pin',
        key: 'dealer_pin',
        sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: "GRACE DAYS",
        align: "center",
        className: '',
        dataIndex: 'grace_days',
        key: 'grace_days',
        sorter: (a, b) => { return a.grace_days - b.grace_days },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: "FROM",
        align: "center",
        className: '',
        dataIndex: 'from_date',
        key: 'from_date',
        sorter: (a, b) => { return a.from_date.localeCompare(b.from_date) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: "TO",
        align: "center",
        className: '',
        dataIndex: 'to_date',
        key: 'to_date',
        sorter: (a, b) => { return a.to_date.localeCompare(b.to_date) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: "CREATED AT",
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
      isLabel: false,
      reportFormData: '',
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
      this.props.generateGraceDaysReport(values)
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
    if (this.props.graceDaysReport !== prevProps.graceDaysReport) {
      this.setState({
        reportCard: true
      });

      columns = [
        { title: '#', dataKey: "count" },
        { title: "DEVICE ID", dataKey: "device_id" },
        { title: "DEALER PIN", dataKey: "dealer_pin" },
        { title: "DAYS", dataKey: "grace_days" },
        { title: "FROM DATE", dataKey: "from_date" },
        { title: "TO DATE", dataKey: "to_date" },
        { title: "CREATED AT", dataKey: "created_at" },
      ];

      rows = this.props.graceDaysReport.map((item, index) => {
        return {
          count: ++index,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          dealer_pin: item.dealer_pin ? item.dealer_pin : 'N/A',
          grace_days: item.grace_days ? item.grace_days : 'N/A',
          from_date: item.from_date ? getDateFromTimestamp(item.from_date) : 'N/A',
          to_date: item.to_date ? getDateFromTimestamp(item.to_date) : 'N/A',
          created_at: item.created_at ? getDateFromTimestamp(item.created_at) : 'N/A',
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
          count: ++index,
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          dealer_pin: item.dealer_pin ? item.dealer_pin : 'N/A',
          grace_days: item.grace_days ? item.grace_days : 'N/A',
          from_date: item.from_date ? getDateFromTimestamp(item.from_date) : 'N/A',
          to_date: item.to_date ? getDateFromTimestamp(item.to_date) : 'N/A',
          created_at: item.created_at ? getDateFromTimestamp(item.created_at) : 'N/A',
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
      this.props.getDealerList(e);
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
  };

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
                    <h3>Grace Days Report</h3>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="pull-right">
                      <Button type="dotted" icon="download" size="small" onClick={() => { generatePDF(columns, rows, 'Grace Days Report', fileName, this.state.reportFormData) }}>Download PDF</Button>
                      <Button type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName) }}>Download Excel</Button>
                    </div>
                  </Col>
                </Row>
                <Table
                  columns={this.columns}
                  dataSource={this.renderList(this.props.graceDaysReport)}
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
