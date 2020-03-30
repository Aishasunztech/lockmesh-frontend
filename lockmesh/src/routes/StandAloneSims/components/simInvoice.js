import React, { Component, Fragment } from 'react';
import { Modal, message, Col, Row, Table, Switch } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { inventorySales, refundServiceColumns } from '../../utils/columnsUtils';
// import convertToLang from '../../utils/columnsUtils';
import moment from 'moment';
import { APP_TITLE } from '../../../constants/Application';
import { convertToLang } from '../../utils/commonUtils';
import { DUMY_TRANS_ID } from '../../../constants/LabelConstants';

class Invoice extends Component {

    constructor(props) {
        super(props);

        const invoiceColumns = inventorySales(props.translation);
        const refundServicesColumns = refundServiceColumns(props.translation);
        let data_plan_column = {
            title: convertToLang(props.translation[DUMY_TRANS_ID], "DATA LIMIT"),
            dataIndex: 'data_limit',
            className: '',
            align: "center",
            key: 'data_limit'
        }
        invoiceColumns.splice(2, 0, data_plan_column)
        this.state = {
            invoiceColumns: invoiceColumns,
            visible: false,
            refundServicesColumns: refundServicesColumns
        }
    }


    showModal = (visible) => {
        // console.log("invoice showModal ", visible);
        this.setState({
            visible: visible
        });
    }

    componentDidUpdate() {

    }

    componentWillReceiveProps(nextProps) {

    }

    handleOk = () => {
        console.log("handleOk for invoice")
    }

    handleCancel = () => {
        this.setState({ visible: false })
    }

    render() {
        const { user, deviceAction, renewService, applyServicesValue } = this.props;
        // console.log(applyServicesValue);

        let total;
        let discount = Math.ceil(Number(this.props.subTotal) * 0.03);
        let balanceDue = this.props.subTotal;
        let paid = 0;
        let expiry_date;
        let page_name = this.props.page_name ? this.props.page_name : ''
        // console.log(this.props.serviceData, renewService, applyServicesValue);
        if (this.props.invoiceType === "pay_now") {
            total = this.props.subTotal - discount;
            balanceDue = total;
            paid = total;
        } else {
            total = this.props.subTotal;
        }



        return (
            <div>
                <h1 style={{ textAlign: 'center' }}>MDM PANEL SERVICES</h1>
                <h4 style={{ textAlign: 'center' }}>FLAT/RM H 15/F  SIU KING BLDG 6 ON WAH ST <br /> NGAU TAU KOK KLN, HONG KONG</h4>
                <h2>INVOICE</h2>
                <div style={{
                    borderTop: "2px solid lightgray",
                    borderBottom: "2px solid lightgray",
                    paddingTop: "10px",
                    paddingBottom: "10px"
                }}>
                    <Row>
                        <Col span={6}>Invoice Number:</Col>
                        <Col span={6}>{this.props.invoiceID}</Col>
                        <Col span={6}>Dealer Name:</Col>
                        {/* <Col span={6}>{`${user.name.toUpperCase()} (${APP_TITLE})`}</Col> */}
                        <Col span={6}>{`${user.name.toUpperCase()} `}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Invoice Date:</Col>
                        <Col span={6}>{moment().format("YYYY/MM/DD")} </Col>
                        <Col span={6}>Dealer PIN:</Col>
                        <Col span={6}>{user.dealer_pin}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Balance Due:</Col>
                        <Col span={6}>{balanceDue} Credits</Col>
                        <Col span={6}>SIM ICCID:</Col>
                        <Col span={6}>{this.props.iccid}</Col>
                    </Row>
                </div>

                <Fragment>

                    <div style={{ marginTop: 20 }}>
                        <h4>SIM SERVICES</h4>
                        <Table
                            size="middle"
                            columns={this.state.invoiceColumns}
                            dataSource={this.props.renderInvoiceList(this.props.PkgSelectedRows, this.props.proSelectedRows)}
                            pagination={false}
                        />
                    </div >
                </Fragment>

                <div style={{ marginTop: 20, textAlign: 'right' }}>
                    <Row>
                        <Col span={16} />
                        <Col span={4}>Subtotal : </Col>
                        <Col span={4}>{this.props.subTotal} Credits</Col>
                    </Row>
                    {(this.props.invoiceType === "pay_now") ?
                        <Fragment>
                            {/* <Row>
                                <Col span={12} />
                                <Col span={8}>Discount % : </Col>
                                <Col span={4}> 5 % </Col>
                            </Row> */}
                            <Row>
                                <Col span={12} />
                                <Col span={8}>Discount 3% : </Col>
                                <Col span={4}> -{discount} Credits</Col>
                            </Row>
                        </Fragment>
                        : null}
                    <br />
                    <Row style={{ fontWeight: 'bold' }}>
                        <Col span={12} />
                        <Col span={8}>Total : </Col>
                        <Col span={4}>{total}&nbsp;Credits</Col>
                    </Row>
                    <Row style={{ fontWeight: 'bold' }}>
                        <Col span={14} />
                        <Col span={6}>Equivalent USD Price: </Col>
                        <Col span={4}>${balanceDue}.00</Col>
                    </Row>

                </div>
                <p style={{ textAlign: 'center', marginTop: 70 }}>Thank you for your business.</p>


            </div>
        )

    }

}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}
var mapStateToProps = ({ auth }) => {
    // console.log("invoice component ", auth.authUser);
    return {
        user: auth.authUser,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);
