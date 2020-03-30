import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import styles from '../reporting.css'
import { generatePDF, generateExcel } from "../../../utils/commonUtils";
import {
  DEVICE_PRE_ACTIVATION, sim
} from "../../../../constants/Constants";

import {
  BASE_URL
} from "../../../../constants/Application";
var columns;
var rows;
var fileName = 'invoice_' + new Date().getTime()
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
      },

      {
        title: "INVOICE ID",
        align: "center",
        className: '',
        dataIndex: 'invoice_id',
        key: 'invoice_id',
      },

      {
        title: "DEVICE ID",
        align: "center",
        className: '',
        dataIndex: 'device_id',
        key: 'device_id',
      },

      {
        title: "DEALER ID",
        align: "center",
        className: '',
        dataIndex: 'dealer_id',
        key: 'dealer_id',
      },

      {
        title: "USER PAYMENT STATUS",
        align: "center",
        className: '',
        dataIndex: 'end_user_payment_status',
        key: 'end_user_payment_status',
      },

      {
        title: "GENERATED AT",
        align: "center",
        className: '',
        dataIndex: 'created_at',
        key: 'created_at',
      },

      {
        title: "ACTION",
        align: "center",
        className: '',
        dataIndex: 'file_name',
        key: 'file_name',
      },
    ];

    this.state = {
      reportCard: false,
      isLabel: false,
      label: null,
      deviceList: props.deviceList,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.generateInvoiceReport(values)
    });
  };

  componentDidMount() {

  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.deviceList !== this.props.deviceList) {
      this.setState({
        deviceList: nextProps.deviceList
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.invoiceReport !== prevProps.invoiceReport) {
      this.setState({
        reportCard: true,
        productType: this.props.productType
      })

      rows = this.props.invoiceReport.map((item, index) => {
        return {
          count: ++index,
          invoice_id: item.inv_no ? item.inv_no : 'N/A',
          device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          dealer_id: item.dealer_id ? item.dealer_id : 'N/A',
          created_at: item.created_at ? item.created_at : 'N/A',
          end_user_payment_status: item.end_user_payment_status ? item.end_user_payment_status : 'N/A',
        }
      });

      columns = [
        { title: '#', dataKey: "count" },
        { title: "INVOICE ID", dataKey: "invoice_id" },
        { title: "DEVICE ID", dataKey: "device_id" },
        { title: "USER PAYMENT STATUS", dataKey: "end_user_payment_status" },
        { title: "GENERATED AT", dataKey: "created_at" },
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
    if (list) {
      list.map((item, index) => {

        // let link = `${(this.state.label)? this.state.label.api_url: BASE_URL}/users/getFile/${item.file_name}`;
        let link = `${(this.state.label) ? this.state.label.api_url : BASE_URL}/users/getFile/${item.file_name}`;
        // console.log(link);
        data.push({
          'key': index,
          'count': ++index,
          'invoice_id': item.inv_no ? item.inv_no : 'N/A',
          'device_id': item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          'dealer_id': item.dealer_id ? item.dealer_id : 'N/A',
          'created_at': item.created_at ? item.created_at : 'N/A',
          'end_user_payment_status': item.end_user_payment_status ? item.end_user_payment_status : 'N/A',
          // (this.state.label) ? this.state.label.api_url:  + 'users/getFile/' + item.file_name
          'file_name': <a href={link} target="_blank" download><Button type="primary" size="small">Download</Button></a>,
        })
      });
    }
    return data;
  };

  createPDF = () => {
    var columns = [
      { title: '#', dataKey: "count" },
      { title: "INVOICE ID", dataKey: "invoice_id" },
      { title: "DEVICE ID", dataKey: "device_id" },
      { title: "USER PAYMENT STATUS", dataKey: "end_user_payment_status" },
      { title: "GENERATED AT", dataKey: "created_at" },
    ];

    var rows = this.props.invoiceReport.map((item, index) => {
      return {
        count: ++index,
        invoice_id: item.inv_no ? item.inv_no : 'N/A',
        device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
        dealer_id: item.dealer_id ? item.dealer_id : 'N/A',
        created_at: item.created_at ? item.created_at : 'N/A',
        end_user_payment_status: item.end_user_payment_status ? item.end_user_payment_status : 'N/A',
      }
    });

    let fileName = 'invoice_' + new Date().getTime()
    generatePDF(columns, rows, 'Invoice Report', fileName);
  }

  handleLabelChange = (e) => {
    if (e == '') {
      this.setState({
        isLabel: false,
        label: null
      })

    } else {
      let label = this.props.whiteLabels.find((whiteLabel) => whiteLabel.id === e);
      this.props.getDealerList(e)
      this.props.getDeviceList(e);
      this.setState({
        isLabel: true,
        label: label
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
    console.log(this.props.whiteLabels);

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
                        {/* <Select.Option value={this.props.user.dealerId}>My Report</Select.Option> */}
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
                    label="Payment Status"
                    labelCol={{ span: 8 }}
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
                        <Select.Option value='PGP'>UNPAID</Select.Option>
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
                    <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>GENERATE</Button>
                  </Form.Item>
                </Fragment>
                : null
              }
            </Form>

          </Card>

        </Col>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <Card style={{ height: '600px', overflow: 'scroll' }}>
            {(this.state.reportCard) ?
              <Fragment>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <h3>Invoice Report</h3>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="pull-right">
                      <Button type="dotted" icon="download" size="small" onClick={() => { generatePDF(columns, rows, 'Invoice Report', fileName) }}>Download PDF</Button>
                      <Button type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName) }}>Download Excel</Button>
                    </div>
                  </Col>
                </Row>
                <Table
                  columns={this.columns}
                  dataSource={this.renderList(this.props.invoiceReport)}
                  bordered
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

const WrappedAddDeviceForm = Form.create()(Invoice);
export default WrappedAddDeviceForm;
