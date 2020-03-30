import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import styles from '../reporting.css'
import { convertToLang, generatePDF, generateExcel, formatMoney, getDateFromTimestamp, checkIsArray } from "../../../utils/commonUtils";
import {
  DEVICE_PRE_ACTIVATION
} from "../../../../constants/Constants";

import {
  BASE_URL
} from "../../../../constants/Application";
var columns;
var rows;
var fileName = 'sales_' + new Date().getTime()

class Sales extends Component {
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
        title: convertToLang(props.translation[''], "DEVICE ID"),
        align: "center",
        className: '',
        dataIndex: 'device_id',
        key: 'device_id',
        sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "DEALER ID"),
        align: "center",
        className: '',
        dataIndex: 'dealer_pin',
        key: 'dealer_pin',
        sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
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
        title: convertToLang(props.translation[''], "NAME"),
        align: "center",
        className: '',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => { return a.name.localeCompare(b.name) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "COST PRICE (CREDITS)"),
        align: "center",
        className: '',
        dataIndex: 'cost_price',
        key: 'cost_price',
        sorter: (a, b) => { return a.cost_price - b.cost_price },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "SALE PRICE (CREDITS)"),
        align: "center",
        className: '',
        dataIndex: 'sale_price',
        key: 'sale_price',
        sorter: (a, b) => { return a.sale_price - b.sale_price },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: convertToLang(props.translation[''], "PROFIT/LOSS (CREDITS)"),
        align: "center",
        className: '',
        dataIndex: 'profit_loss',
        key: 'profit_loss',
        sorter: (a, b) => { return a.profit_loss - b.profit_loss },
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
        defaultSortOrder: 'descend'
      },
    ];

    this.saleInfoColumn = [
      {
        title: '',
        dataIndex: 'key',
        key: 'key',
      },

      {
        title: '',
        dataIndex: 'value',
        key: 'value',
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
      this.props.generateSalesReport(values)
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.devices !== this.props.devices) {
      this.setState({
        deviceList: nextProps.devices
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.salesReport !== prevProps.salesReport) {
      this.setState({
        reportCard: true
      });

      rows = checkIsArray(this.props.salesReport).map((item, index) => {
        return {
          'key': index,
          'count': ++index,
          'device_id': item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          'dealer_pin': item.dealer_pin ? item.dealer_pin : 'N/A',
          'type': item.type ? item.type : 'N/A',
          'name': item.name ? item.name : 'N/A',
          'cost_price': item.cost_price ? item.cost_price : 0,
          'sale_price': item.sale_price ? item.sale_price : 0,
          'profit_loss': item.profit_loss ? item.profit_loss : 0,
        }
      });

      columns = [
        {
          title: '#', dataKey: 'count',
        },

        {
          title: convertToLang(this.props.translation[''], "DEVICE ID"), dataKey: 'device_id',
        },

        { title: convertToLang(this.props.translation[''], "DEALER ID"), dataKey: 'dealer_pin' },

        {
          title: convertToLang(this.props.translation[''], "TYPE"), dataKey: 'type',
        },

        {
          title: convertToLang(this.props.translation[''], "NAME"), dataKey: 'name',
        },

        {
          title: convertToLang(this.props.translation[''], "COST PRICE (CREDITS)"), dataKey: 'cost_price',
        },

        {
          title: convertToLang(this.props.translation[''], "SALE PRICE (CREDITS)"), dataKey: 'sale_price',
        },

        {
          title: convertToLang(this.props.translation[''], "PROFIT/LOSS (CREDITS)"), dataKey: 'profit_loss',
        },

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
          'device_id': item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          'dealer_pin': item.dealer_pin ? item.dealer_pin : 'N/A',
          'type': item.type ? item.type : 'N/A',
          'name': item.name ? item.name : 'N/A',
          'cost_price': item.cost_price ? item.cost_price : 0,
          'sale_price': item.sale_price ? item.sale_price : 0,
          'profit_loss': item.profit_loss ? item.profit_loss : 0,
          'created_at': item.created_at ? getDateFromTimestamp(item.created_at) : 'N/A',
        })
      });
    // }
    return data;
  };

  renderSaleInfo = () => {
    return [

      {
        key: <h6 className="weight_600 p-5"> Total Cost</h6>,
        value: <h6 className="weight_600 p-5"> {this.props.saleInfo.totalCost}</h6>,
      },
      {
        key: <h6 className="weight_600 p-5"> Total Sale</h6>,
        value: <h6 className="weight_600 p-5"> {this.props.saleInfo.totalSale}</h6>,
      },
      {
        key: <h6 className="weight_600 p-5"> Profit/Loss</h6>,
        value: <h6 className="weight_600 p-5"> {this.props.saleInfo.totalProfitLoss}</h6>,
      },
    ];
  };

  saleInfoTitle = () => {
    return <h4 className="credit_modal_heading weight_600">{convertToLang(this.props.translation[""], "SALE INFO")}</h4>
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
          <Card bordered={false} style={{ height: '520px', overflow: 'scroll' }}>
            <Form onSubmit={this.handleSubmit} autoComplete="new-password">

              <Form.Item
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
              >
              </Form.Item>

              <Form.Item
                label="Product Type"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                width='100%'
              >
                {this.props.form.getFieldDecorator('product_type', {
                  initialValue: 'ALL',
                  rules: [
                    {
                      required: false
                    },
                  ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Select.Option value='ALL'>ALL</Select.Option>
                    <Select.Option value='PACKAGES'>PACKAGES</Select.Option>
                    {/*<Select.Option value='PRODUCTS'>PRODUCTS</Select.Option>*/}
                    <Select.Option value='HARDWARES'>HARDWARE</Select.Option>
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
                  <Col xs={14} sm={14} md={14} lg={14} xl={14}>
                    <h3>Sales Report</h3>
                  </Col>
                  <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                    <div className="pull-right">
                      <Button className="mb-8" type="dotted" icon="download" size="small" onClick={() => { this.state.reportFormData.saleInfo = this.props.saleInfo; generatePDF(columns, rows, 'Sales Report', fileName, this.state.reportFormData) }}>Download PDF</Button>
                      <Button className="mb-8" type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName) }}>Download Excel</Button>
                    </div>
                  </Col>
                </Row>

                <Table
                  className="sale_info_table"
                  dataSource={this.renderSaleInfo()}
                  columns={this.saleInfoColumn}
                  pagination={false}
                  showHeader={false}
                  title={this.saleInfoTitle}
                  bordered
                />

                <Table
                  columns={this.columns}
                  dataSource={this.renderList(this.props.salesReport)}
                  bordered
                  scroll={{ x: true}}
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

const WrappedAddDeviceForm = Form.create()(Sales);
export default WrappedAddDeviceForm;
