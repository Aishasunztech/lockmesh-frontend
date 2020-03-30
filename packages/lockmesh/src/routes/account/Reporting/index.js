import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Checkbox, Icon, Tabs, Table } from "antd";
import Invoice from "./components/Invoice";
import ProductInventory  from './components/ProductInventory';
import HardwareInventory  from './components/HardwareInventory';
import PaymentHistory from './components/PaymentHistory';
import Sales from './components/Sales';
import GraceDays from './components/GraceDays';
import AppFilter from '../../../components/AppFilter';
import { convertToLang } from "../../utils/commonUtils";
import {
  getAllDealers,
  generateSalesReport,
  generateProductReport,
  generateInvoiceReport,
  generatePaymentHistoryReport,
  generateHardwareReport,
  generateGraceDaysReport,
  getHardwares, getDevicesForReport
} from '../../../appRedux/actions/';
import styles from './reporting.css'

const TabPane = Tabs.TabPane;

class Reporting extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      tabselect: '1',
      innerTabSelect: '1',
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  componentDidMount() {
    this.props.getDealerList();
    this.props.getHardwaresList();
    this.props.getDevicesForReport();
  }

  componentWillReceiveProps(nextProps) {
  }

  handleChangeTab = (value) => {
    this.setState({
      tabselect: value
    })
  };


  render() {
    const Search = Input.Search;
    return (

      <div>
        <AppFilter
          pageHeading={convertToLang(this.props.translation[''], "REPORTS")}
        />
        {

          <div>
            <Tabs defaultActiveKey="1" type='card' className="dev_tabs reports_tab" activeKey={this.state.tabselect} onChange={this.handleChangeTab}>
              <TabPane tab="PRODUCT INVENTORY" key="1">
                <ProductInventory
                  dealerList={this.props.dealerList}
                  translation={this.props.translation}
                  productReport={this.props.productReport}
                  productType={this.props.productType}
                  generateProductReport={this.props.generateProductReport}
                  user={this.props.user}
                  devices={this.props.devices}
                />
              </TabPane>

              <TabPane tab="HARDWARE INVENTORY" key="2">
                <HardwareInventory
                  dealerList={this.props.dealerList}
                  hardwares={this.props.hardwares}
                  translation={this.props.translation}
                  generateHardwareReport={this.props.generateHardwareReport}
                  hardwareReport={this.props.hardwareReport}
                  user={this.props.user}
                  devices={this.props.devices}
                />
              </TabPane>

              <TabPane tab="PAYMENT HISTORY" key="3">
                <PaymentHistory
                  dealerList={this.props.dealerList}
                  translation={this.props.translation}
                  generatePaymentHistoryReport={this.props.generatePaymentHistoryReport}
                  paymentHistoryReport={this.props.paymentHistoryReport}
                  user={this.props.user}
                  devices={this.props.devices}
                />
              </TabPane>

              <TabPane tab="INVOICES" key="4">
                <Invoice
                  dealerList={this.props.dealerList}
                  translation={this.props.translation}
                  generateInvoiceReport={this.props.generateInvoiceReport}
                  invoiceReport={this.props.invoiceReport}
                  user={this.props.user}
                  devices={this.props.devices}
                />
              </TabPane>

              <TabPane tab="SALES" key="5">
                <Sales
                  dealerList={this.props.dealerList}
                  translation={this.props.translation}
                  generateSalesReport={this.props.generateSalesReport}
                  salesReport={this.props.salesReport}
                  saleInfo={this.props.saleInfo}
                  user={this.props.user}
                  devices={this.props.devices}
                />
              </TabPane>

              {(this.props.user.type === 'admin') ?
                <TabPane tab="GRACE DAYS" key="6">
                  <GraceDays
                    dealerList={this.props.dealerList}
                    translation={this.props.translation}
                    generateGraceDaysReport={this.props.generateGraceDaysReport}
                    graceDaysReportReport={this.props.graceDaysReportReport}
                    user={this.props.user}
                    devices={this.props.devices}
                  />
                </TabPane>
                : '' }
            </Tabs>
          </div>
        }
      </div>
    );
  }
}



var mapStateToProps = ({ dealers, settings, reporting  , auth, account, devices}) => {

  return {
    user: auth.authUser,
    devices: devices.devicesForReport,
    dealerList: dealers.dealers,
    hardwares: account.hardwares,
    productReport: reporting.productData,
    hardwareReport: reporting.hardwareData,
    invoiceReport: reporting.invoiceData,
    salesReport: reporting.salesData,
    graceDaysReportReport: reporting.graceDaysReportData,
    saleInfo: reporting.saleInfo,
    paymentHistoryReport: reporting.paymentHistoryData,
    productType: reporting.productType,
    translation: settings.translation,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDealerList: getAllDealers,
    getDevicesForReport: getDevicesForReport,
    generateProductReport: generateProductReport,
    generateInvoiceReport: generateInvoiceReport,
    generatePaymentHistoryReport: generatePaymentHistoryReport,
    generateHardwareReport: generateHardwareReport,
    generateSalesReport: generateSalesReport,
    generateGraceDaysReport: generateGraceDaysReport,
    getHardwaresList: getHardwares,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(Reporting)
