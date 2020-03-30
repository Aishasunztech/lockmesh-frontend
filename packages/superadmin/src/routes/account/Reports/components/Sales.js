import React, {Component, Fragment} from 'react'
import {Button, Card, Col, DatePicker, Form, Row, Select, Table} from "antd";
import moment from 'moment';
import {generateExcel, generatePDF, getDateFromTimestamp} from "../../../utils/commonUtils";
import {DEVICE_PRE_ACTIVATION} from "../../../../constants/Constants";

var columns;
var rows;
var fileName = 'sales_' + new Date().getTime();
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
        render: (text, record, index) => ++index,
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
        title: "DEALER ID",
        align: "center",
        className: '',
        dataIndex: 'dealer_pin',
        key: 'dealer_pin',
        sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: "TYPE",
        align: "center",
        className: '',
        dataIndex: 'type',
        key: 'type',
        sorter: (a, b) => { return a.type.localeCompare(b.type) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: "NAME",
        align: "center",
        className: '',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => { return a.name.localeCompare(b.name) },
        sortDirections: ['ascend', 'descend'],
      },

      {
        title: "SALE PRICE (CREDITS)",
        align: "center",
        className: '',
        dataIndex: 'sale_price',
        key: 'sale_price',
        sorter: (a, b) => { return a.sale_price - b.sale_price },
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
      isLabel: false,
      dealer: null,
      totalCreditSale: null,
      totalHardwareSale: null,
      totalPackageSale: null,
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
      this.props.generateSalesReport(values)
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.salesReport !== prevProps.salesReport) {
      this.setState({
        reportCard: true
      });

      rows = this.props.salesReport.map((item, index) => {
        return {
          'key': index,
          'count': ++index,
          'device_id': item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
          'dealer_pin': item.dealer_pin ? item.dealer_pin : 'N/A',
          'type': item.type ? item.type : 'N/A',
          'name': item.name ? item.name : 'N/A',
          'sale_price': item.cost_price ? item.cost_price : 0,
        }
      });

      columns = [
        {
          title: '#', dataKey: 'count',
        },

        {
          title: "DEVICE ID", dataKey: 'device_id',
        },

        { title: "DEALER ID", dataKey: 'dealer_pin' },

        {
          title: "TYPE", dataKey: 'type',
        },

        {
          title: "NAME", dataKey: 'name',
        },

        {
          title: "SALE PRICE (CREDITS)", dataKey: 'sale_price',
        },
      ];
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deviceList !== this.props.deviceList) {
      this.setState({
        deviceList: nextProps.deviceList
      })
    }
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  disabledDate = (current) => {
    return current && current > moment().endOf('day');
  };

  renderList = (list, saList) => {

    let data                = [];
    let lastIndex           = 0;

    list.map((item, index) => {
      lastIndex = index;
      data.push({
        key: ++index,
        count: ++index,
        device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
        dealer_pin: item.dealer_pin ? item.dealer_pin : 'N/A',
        type: item.type ? item.type : 'N/A',
        name: item.name ? item.name : 'N/A',
        sale_price: item.cost_price ? item.cost_price : 0, // cost price of admin is sale price of super admin
        created_at: item.created_at ? getDateFromTimestamp(item.created_at) : 'N/A',
      })
    });

    return data;
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
  };

  renderSaleInfo = () => {
    let totalCreditSale     = 0;
    let totalHardwareSale   = 0;
    let totalPackageSale    = 0;
    let totalSale    = 0;

    this.props.salesReport.map((item, index) => {
      if (item.type === 'Package'){
        totalPackageSale += item.cost_price;
      }else if(item.type === 'Hardware'){
        totalHardwareSale += item.cost_price;
      }else if(item.type === 'Credits'){
        totalCreditSale += item.cost_price;
      }
      totalSale += item.cost_price;
    });

    return [

      {
        key: <h6 className="weight_600 mb-0 p-5"> Package Sale</h6>,
        value: <h6 className="weight_600 mb-0 p-5"> {totalPackageSale}</h6>,
      },
      {
        key: <h6 className="weight_600 mb-0 p-5"> Hardware Sale</h6>,
        value: <h6 className="weight_600 mb-0 p-5"> {totalHardwareSale}</h6>,
      },
      {
        key: <h6 className="weight_600 mb-0 p-5"> Credits Sale</h6>,
        value: <h6 className="weight_600 mb-0 p-5"> {totalCreditSale}</h6>,
      },
      {
        key: <h6 className="weight_600 mb-0 p-5"> Total Sale</h6>,
        value: <h6 className="weight_600 mb-0 p-5"> {totalSale}</h6>,
      },
    ];
  };

  saleInfoTitle = () => {
    return <h4 className="saleTable weight_600">{"SALE INFO"}</h4>
  };

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
                    label="Product Type"
                    labelCol={{ span: 8 }}
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
                        <Select.Option value='HARDWARES'>HARDWARES</Select.Option>
                        <Select.Option value='CREDITS'>CREDITS</Select.Option>
                      </Select>
                    )}
                  </Form.Item>

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
                    <h3>Sales Report</h3>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="pull-right">
                      <Button type="dotted" icon="download" size="small" onClick={() => { generatePDF(columns, rows, 'Sales Report', fileName, this.state.reportFormData) }}>Download PDF</Button>
                      <Button type="primary" icon="download" size="small" onClick={() => { generateExcel(rows, fileName) }}>Download Excel</Button>
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
