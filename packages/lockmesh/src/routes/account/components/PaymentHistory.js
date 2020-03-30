import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs, Col, Input, Form, Row, DatePicker, Select } from "antd";
import moment from 'moment';
import {
  DEVICE_PRE_ACTIVATION
} from "../../../constants/Constants";
import {convertToLang, formatMoney, generateExcel, generatePDF, checkIsArray} from "../../utils/commonUtils";
import {bindActionCreators} from "redux";
import {
  getLatestPaymentHistory
} from "../../../appRedux/actions";
import {connect} from "react-redux";
import AppFilter from "../../../components/AppFilter";

class PaymentHistory extends Component {
  constructor(props) {
    super(props);
    this.columns = [
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
  }

  componentDidMount() {
    this.props.getLatestPaymentHistory({type: 'credits'})
  };


  renderList = (list) => {
    // if (list) {

      return checkIsArray(list).map((item, index) => {
        return {
          rowKey: item.id,
          key: ++index,
          transaction_no: item.id,
          created_at: item.created_at,
          payment_method: JSON.parse(item.transection_data).request_type,
          amount: "$ " +formatMoney(item.credits),
          total_credits: item.credits,
        }
      });
    // }
  };


  render() {
    return (
      <div>
        <AppFilter
          pageHeading={convertToLang(this.props.translation[''], "PAYMENT HISTORY (CREDITS)")}
        />
        <Row>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Card style={{ height: '500px', overflow: 'overlay'}}>
              <Fragment>
                <Table
                  columns={this.columns}
                  dataSource={this.renderList(this.props.paymentHistory)}
                  bordered
                  pagination={false}
                />
              </Fragment>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}




var mapStateToProps = ({ settings, account }) => {
  return {
    translation: settings.translation,
    paymentHistory: account.paymentHistory
  };
};

// export default Account;
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getLatestPaymentHistory: getLatestPaymentHistory
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentHistory);
