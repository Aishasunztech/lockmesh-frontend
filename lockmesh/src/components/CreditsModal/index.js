import React, { Component, Fragment } from 'react';
import { Modal, Table, Button, Row, Col, Select, Card, Tabs } from 'antd';
import { Link } from "react-router-dom";
import ReactResizeDetector from 'react-resize-detector';
import PurchaseCredit from "../../routes/account/components/PurchaseCredit";
import AddDeviceModal from '../../routes/devices/components/AddDevice';
import {
  ADMIN,
  ACTION,
  CREDITS,
  CREDITS_CASH_REQUESTS,
  ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST,
  ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST,
  WARNING,
  DEVICE_UNLINKED,
  DEVICE_PRE_ACTIVATION
} from '../../constants/Constants';
import { convertToLang, generateExcel, formatMoney, checkIsArray } from '../../routes/utils/commonUtils';
import {
  Button_Ok,
  Button_Cancel,
  Button_Confirm,
  Button_Decline,
  Button_ACCEPT,
  Button_Transfer,
  Button_DOWNLOAD
} from '../../constants/ButtonConstants';
import { DEVICE_ID, DEVICE_SERIAL_NUMBER, DEVICE_IMEI_1, DEVICE_SIM_2, DEVICE_IMEI_2, DEVICE_REQUESTS, DEVICE_SIM_1 } from '../../constants/DeviceConstants';
import { DEALER_NAME } from '../../constants/DealerConstants';
import { Markup } from "interweave";
import { DT_MODAL_BODY_7 } from "../../constants/AppConstants";
import { BASE_URL } from "../../constants/Application";
import { bindActionCreators } from "redux";
import {
  purchaseCredits, purchaseCreditsFromCC
} from "../../appRedux/actions";
import { connect } from "react-redux";
import RestService from "../../appRedux/services/RestServices";
import styles from './creditModal.css'
const confirm = Modal.confirm;
let paymentHistoryColumns;
let account_status_paragraph = '';

const { TabPane } = Tabs;
class CreditIcon extends Component {

  constructor(props) {
    super(props);

    this.state = {
      paymentHistoryColumns: paymentHistoryColumns,
      visible: false,
      currency: 'USD',
      currency_price: this.props.user_credit,
      currency_unit_price: 1,
      purchase_modal: false,
      tabPosition: window.screen.width > 576 ? "left" : "top"
    };

    this.paymentHistoryColumns = [
      {
        title: "Transaction #",
        dataIndex: 'transaction_no',
        align: "center",
        key: 'transaction_no',
      },

      {
        title: convertToLang(props.translation[''], "TRANSACTION DATE"),
        align: "center",
        dataIndex: 'created_at',
        key: 'created_at',
      },

      {
        title: convertToLang(props.translation[''], "PAYMENT METHOD"),
        align: "center",
        dataIndex: 'payment_method',
        key: 'payment_method',
      },

      {
        title: convertToLang(props.translation[''], "AMOUNT (USD)"),
        align: "center",
        dataIndex: 'amount',
        key: 'amount',
      },

      {
        title: convertToLang(props.translation[''], "TOTAL CREDITS"),
        align: "center",
        dataIndex: 'total_credits',
        key: 'total_credits',
      },

    ];


    this.a_s_columns = [
      {
        title: 'RESTRICTED',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '21+ days Overdue',
        dataIndex: 'value',
        key: 'value',
      },
    ];


    this.cr_blnc_columns = [
      {
        dataIndex: 'title',
        key: 'title',
      },
      {
        dataIndex: 'data',
        key: 'data',
      },
    ];

    this.overdue_columns = [
      {
        title: "",
        dataIndex: 'status',
        key: 'status',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.className = "bg_red border-left"
          }
          if (index === 1) {
            obj.props.rowSpan = 2;
            obj.props.className = "bg_yellow border-left"
          }
          if (index === 2) {
            obj.props.rowSpan = 0;
            obj.props.className = "bg_yellow"
          }
          if (index === 3) {
            obj.props.className = "border-bottom"
          }
          return obj;
        },
      },
      {
        title: <h4 className="weight_600">Overdue (days)</h4>,
        dataIndex: 'overdue',
        key: 'overdue',
      },
      {
        title: <h4 className="weight_600">Amount (credits)</h4>,
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: <h4 className="weight_600"># Invoices past due</h4>,
        dataIndex: 'invoices',
        key: 'invoices',
      },
    ];
  }

  showPurchaseModal = (e, visible) => {
    this.setState({
      purchase_modal: visible
    })
  };

  showModal = () => {
    this.setState({
      visible: true,
      currency: 'USD',
      currency_price: this.props.user_credit,
      currency_unit_price: 1,
    });
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  ac_st_title = () => {
    let class_name = (this.props.account_balance_status == 'active') ?
      "bg_green" : (this.props.account_balance_status === 'restricted') ?
        "bg_yellow" :
        "bg_red"
    return <div>
      <Row gutter="16">
        <Col span={12} className="credit_modal_heading bg_brown">
          <h4 className="mb-0 weight_600"> {convertToLang(this.props.translation[""], "Account Status")} </h4>
        </Col>
        <Col span={12} className={"credit_modal_heading " + class_name}>
          <h4 className=" weight_600 mb-0">
            {convertToLang(this.props.translation[""], (this.props.account_balance_status == 'active') ?
              <span className="">ACTIVE</span> : (this.props.account_balance_status === 'restricted') ?
                <span> Restriction Level 1</span> :
                <span className="color_white" > Restriction Level 2</span>)
            }</h4>
        </Col>
      </Row>
    </div>
  };

  cr_blnc_title = () => {
    return <h4 className="credit_modal_heading weight_600">{convertToLang(this.props.translation[""], "CURRENT BALANCE (Credits)")}</h4>
  };

  overdue_title = () => {
    return <div className="credit_modal_heading">
      <h4 className="weight_600 mb-0">{convertToLang(this.props.translation[""], "OVERDUE")}
        <Link to={'/account/payment-overdue-history'}>
          {/* <Button type="default" size="small" className="full_list_btn" onClick={() => this.handleCancel()}>Full List</Button> */}
        </Link>
      </h4>
    </div>
  };

  pay_history_title = () => {
    return <div className="credit_modal_heading">
      <h4 className="weight_600 mb-0">{convertToLang(this.props.translation[""], "PAYMENT HISTORY")}
        <Link to={'/account/credits-payment-history'}>
          {/* <Button type="default" size="small" className="full_list_btn" onClick={() => this.handleCancel()}>Full List</Button> */}
        </Link>
      </h4>
    </div>
  };

  renderPaymentHistoryList = (list) => {

    // if (list) {
    return checkIsArray(list).map((item, index) => {
      return {
        rowKey: item.id,
        key: ++index,
        transaction_no: item.id,
        created_at: item.created_at,
        payment_method: JSON.parse(item.transection_data).request_type,
        amount: "$ " + formatMoney(item.credits),
        total_credits: item.credits,
      }
    })
    // }
  };

  renderOverData = () => {
    return [
      {
        status: <span className="p-5 weight_600 black"> Restriction Level 2</span>,
        overdue: <span className="weight_600 p-5"> 60+</span>,
        amount: <span className="weight_600 p-5"> {(this.props.overdueDetails._60toOnward_dues) ? '-' + this.props.overdueDetails._60toOnward_dues : 0}</span>,
        invoices: <Button size="small" className="invo_btn">{this.props.overdueDetails._60toOnward}</Button>
      },
      {
        status: <span className="p-5 weight_600"> Restriction Level 1</span>,
        overdue: <span className="weight_600 p-5"> 30+</span>,
        amount: <span className="weight_600 p-5"> {(this.props.overdueDetails._30to60_dues) ? '-' + this.props.overdueDetails._30to60_dues : 0}</span>,
        invoices: <Button size="small" className="invo_btn"> {this.props.overdueDetails._30to60}</Button>
      },
      {
        overdue: <span className="weight_600 p-5"> 21+</span>,
        amount: <span className="weight_600 p-5"> {(this.props.overdueDetails._21to30_dues)}</span>,
        invoices: <Button size="small" className="invo_btn">{this.props.overdueDetails._21to30}</Button>
      },
      {
        overdue: <span className="weight_600 p-5"> 0-21</span>,
        amount: <span className="weight_600 p-5"> {(this.props.overdueDetails._0to21_dues) ? '-' + this.props.overdueDetails._0to21_dues : 0}</span>,
        invoices: <Button size="small" className="invo_btn">{this.props.overdueDetails._0to21}</Button>
      },
    ];
  };

  renderAccountStatus = () => {
    let statusBGC, statusDays;
    let textColor = ''
    if (this.props.account_balance_status_by === 'due_credits' && this.props.account_balance_status !== 'active') {
      if (this.props.account_balance_status === 'restricted' && this.props.overdueDetails._30to60 > 0) {
        statusBGC = 'bg_yellow';
        statusDays = '31+ days Overdue';
        account_status_paragraph = "Your account is restricted. You May not use PAY LATER feature. Please pay invoices 31+ days overdue";
      } else if (this.props.account_balance_status === 'restricted') {
        statusBGC = 'bg_yellow';
        statusDays = '21+ days Overdue';
        account_status_paragraph = "Your account is restricted. You May not use PAY LATER feature. Please pay invoices 21+ days overdue";
      } else if (this.props.account_balance_status === 'suspended') {
        statusBGC = 'bg_red bg_white';
        statusDays = '60+ days Overdue';
        account_status_paragraph = "Your account is restricted. You May not add new Devices. Please pay invoices 60+ days overdue";
      } else {
        statusBGC = 'bg_green';
        statusDays = 'No Restriction';
      }
    } else if (this.props.account_balance_status_by === 'admin' && this.props.account_balance_status !== 'active') {
      if (this.props.account_balance_status === 'restricted') {
        statusBGC = 'bg_yellow';
        statusDays = 'admin';
        account_status_paragraph = "Account restricted by Admin.You May not use PAY LATER feature until its restored."
      } else if (this.props.account_balance_status === 'suspended') {
        statusBGC = 'bg_red color_white';

        statusDays = 'admin';
        account_status_paragraph = "Account restricted by Admin.You May not add new Devices until its restored."
      } else {
        statusBGC = 'bg_green';
        statusDays = 'admin';
      }
    } else {
      statusBGC = 'bg_green';
      statusDays = 'No Restriction';
      account_status_paragraph = "No Restriction"
      return [
        {
          name: <h5 className={'ac_st_info'} >INFO</h5>,
          value: <h5 className={"mb-0 p-8 bg_brown " + statusBGC} >{account_status_paragraph} </h5>,
        }
      ];
    }

    return [

      {
        name: <h5 className={'restricted_by bg_brown'} >Restricted By</h5>,
        value: <h5 className={"weight_600 mb-0 p-8 " + statusBGC} >{statusDays} </h5>
      },
      {
        name: <h5 className={'p-8 mb-0 text-uppercase'}>INFO</h5>,
        value: <h5 className={"mb-0 p-8 white_normal line-height-20 " + statusBGC}>{account_status_paragraph} </h5>,
      }
    ];
  };

  renderCreditBalance = () => {
    return [

      {
        title: <h4 className="weight_600 bg_light_yellow p-5">TOTAL</h4>,
        data: <h4 className="weight_600 bg_light_yellow p-5"> {this.props.user_credit} </h4>,

      },

      {
        title: <h6 className="weight_600 p-5"> CURRENCY</h6>,
        data: <Select defaultValue="USD" onChange={(e) => { this.onChangeCurrency(e, 'currency') }}
        >
          <Select.Option value="USD">USD</Select.Option>
          <Select.Option value="CAD">CAD</Select.Option>
          <Select.Option value="EUR">EUR</Select.Option>
          <Select.Option value="VND">VND</Select.Option>
          <Select.Option value="CNY">CNY</Select.Option>
        </Select>,

      },
      {
        title: <h6 className="weight_600 p-5"> {this.state.currency.toUpperCase() + ' (EQUIVALENT)'}</h6>,
        data: <h6 className="weight_600 p-5"> {formatMoney(this.state.currency_price)}</h6>,

      },

      {
        title: <span className="p-8"></span>,
        data: <span className="p-8"></span>,
      },
      {
        name1: <h5 className="weight_600">PURCHASE CREDITS</h5>,
        data: <Button type="default" size="small" className="buy_btn_invo" onClick={(e) => { this.showPurchaseModal(e, true); }}>
          BUY
        </Button>,

      }
    ];
  };

  onChangeCurrency = (e, field) => {

    if (e === 'USD') {
      this.setState({
        currency: 'USD',
        currency_price: this.props.user_credit,
        currency_unit_price: 1,
      })
    } else {
      RestService.exchangeCurrency(e).then((response) => {
        if (response.data.status) {
          if (this.props.user_credit !== 0) {
            this.setState({
              currency: e,
              currency_unit_price: response.data.currency_unit,
              currency_price: this.props.user_credit * response.data.currency_unit
            })
          } else {
            this.setState({
              currency: e,
              currency_unit_price: response.data.currency_unit,
            })
          }
        }
      })
    }
  };

  resetTabPostion = () => {
    // console.log("TESTING");
    let tabPosition = 'left'
    if (window.screen.width < 576) {
      tabPosition = 'top'
    }
    this.setState({
      tabPosition: tabPosition
    })
  }

  render() {

    return (

      <div >
        <ReactResizeDetector handleWidth handleHeight onResize={this.resetTabPostion} />
        <PurchaseCredit
          showPurchaseModal={this.showPurchaseModal}
          purchase_modal={this.state.purchase_modal}
          purchaseCredits={this.props.purchaseCredits}
          purchaseCreditsFromCC={this.props.purchaseCreditsFromCC}
          translation={this.props.translation}

        />
        {/* <Modal
          // width={'55%'}
          maskClosable={false}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
          footer={false}
          className="credit_popup"
        > */}
        <Fragment>
          <Card>
            <Tabs defaultActiveKey="1" tabPosition={this.state.tabPosition} type="card">
              <TabPane tab="Overview" key="1">
                <Row>
                  <Col xs={24} sm={24} md={2} lg={2} xl={4}>
                  </Col>
                  <Col xs={24} sm={24} md={10} lg={10} xl={10} className="mb-16">
                    <Table
                      className="ac_status_table"
                      dataSource={this.renderAccountStatus()}
                      columns={this.a_s_columns}
                      pagination={false}
                      title={this.ac_st_title}
                      bordered
                      showHeader={false}
                      scroll={{ x: true }}
                    />
                    {/* <h6 className="mt-6"> {account_status_paragraph}</h6> */}
                  </Col>
                  {/* <Col xs={24} sm={24} md={1} lg={1} xl={1}>
                  </Col> */}
                  <Col xs={24} sm={24} md={10} lg={10} xl={6}>
                    <Table
                      className="current_bl_table"
                      dataSource={this.renderCreditBalance()}
                      columns={this.cr_blnc_columns}
                      pagination={false}
                      title={this.cr_blnc_title}
                      bordered
                      scroll={{ x: true }}
                    />
                  </Col>
                </Row>
                <div>
                  <Row>
                    <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                      <Table
                        className="overdue_table"
                        dataSource={this.renderOverData()}
                        columns={this.overdue_columns}
                        pagination={false}
                        title={this.overdue_title}
                        bordered
                        size="small"
                        scroll={{ x: true }}
                      />
                    </Col>
                  </Row>
                </div>
                <div>
                  <Row>
                    <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                      <Table
                        className="pay_history"
                        columns={this.paymentHistoryColumns}
                        dataSource={this.renderPaymentHistoryList(this.props.latestPaymentTransaction)}
                        bordered
                        title={this.pay_history_title}
                        pagination={false}
                        scroll={{ x: true }}
                      />
                    </Col>
                  </Row>
                </div>
              </TabPane>
              <TabPane tab="Payment History" key="2">
                <div>
                  <Row>
                    <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                      <Table
                        className="pay_history"
                        columns={this.paymentHistoryColumns}
                        dataSource={this.renderPaymentHistoryList(this.props.latestPaymentTransaction)}
                        bordered
                        title={this.pay_history_title}
                        pagination={false}
                        scroll={{ x: true }}
                      />
                    </Col>
                  </Row>
                </div>
              </TabPane>
              <TabPane tab="Overdue" key="3">
                <div>
                  <Row>
                    <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                    </Col>
                    <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                      <Table
                        className="overdue_table"
                        dataSource={this.renderOverData()}
                        columns={this.overdue_columns}
                        pagination={false}
                        title={this.overdue_title}
                        bordered
                        size="small"
                        scroll={{ x: true }}
                      />
                    </Col>
                  </Row>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Fragment>
        {/* </Modal> */}
      </div >
    )
  }
}

// export default Account;
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    purchaseCredits: purchaseCredits,
    purchaseCreditsFromCC: purchaseCreditsFromCC
  }, dispatch);
}

var mapStateToProps = ({ account, devices, settings, auth }) => {
  return {
    msg: account.msg,
    showMsg: account.showMsg,
    newData: account.newData,
    backUpModal: account.backUpModal,
    translation: settings.translation,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(CreditIcon);
