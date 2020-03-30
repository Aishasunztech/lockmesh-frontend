import React, { Component, Fragment } from 'react';
import { Modal, message, Col, Row, Table, Switch } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import { convertToLang } from '../../utils/commonUtils';
import { DUMY_TRANS_ID } from '../../../constants/LabelConstants';
import { inventorySales, refundServiceColumns } from '../../utils/columnsUtils';
import moment from 'moment';
import { APP_TITLE } from '../../../constants/Application';



class Invoice extends Component {

    constructor(props) {
        super(props);

        const invoiceColumns = inventorySales(props.translation);
        const refundServicesColumns = refundServiceColumns(props.translation);

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
        console.log(applyServicesValue);

        let total;
        let discount = Math.ceil(Number(this.props.subTotal) * 0.03);
        let balanceDue = this.props.subTotal;
        let paid = 0;
        let expiry_date;
        // console.log(this.props.serviceData, renewService, applyServicesValue);
        if (deviceAction === "Edit") {
            total = this.props.total;
            paid = total;
            if (this.props.invoiceType === "pay_now") {
                paid = balanceDue = total = total - discount;
            } else {
                if (!renewService && applyServicesValue !== 'extend') {
                    balanceDue = this.props.subTotal - this.props.creditsToRefund
                    total = this.props.subTotal - this.props.creditsToRefund
                }
            }
            // if (applyServicesValue == 'change') {
            //     expiry_date = 
            // } else {

            // }
        } else {
            if (this.props.invoiceType === "pay_now") {
                total = this.props.subTotal - discount;
                balanceDue = total;
                paid = total;
            } else {
                total = this.props.subTotal;
            }
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
                        <Col span={6}>User ID:</Col>
                        <Col span={6}>{this.props.user_id}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Balance Due:</Col>
                        <Col span={6}>{balanceDue} Credits</Col>
                        <Col span={6}>Dealer PIN:</Col>
                        <Col span={6}>{user.dealer_pin}</Col>
                    </Row>
                    <Row>
                        <Col span={12} />
                        <Col span={6}>Device ID:</Col>
                        <Col span={6}>{(this.props.deviceAction === "Add") ? "Pre-Activation" : ((this.props.device_id) ? this.props.device_id : "ABCD123456")}</Col>
                    </Row>
                </div>

                <Fragment>
                    {(deviceAction === "Edit") ?
                        (renewService || applyServicesValue === 'extend') ? null :
                            <div style={{ marginTop: 40 }}>
                                <h4>REFUND APPLIED ON EXISTING SERVICE</h4>
                                <Table
                                    size="middle"
                                    columns={this.state.refundServicesColumns}
                                    dataSource={this.props.refundServiceRenderList(this.props.currentPakages, this.props.serviceRemainingDays, this.props.creditsToRefund, this.props.prevService_totalDays)}
                                    pagination={false}
                                />
                                <br />
                                <div style={{ textAlign: 'right' }}>
                                    <Row style={{ fontWeight: 'bold' }}>
                                        <Col span={10} />
                                        <Col span={10}>TOTAL REFUND CREDITS: </Col>
                                        <Col span={4}> -{this.props.creditsToRefund} Credits</Col>
                                    </Row>
                                </div>
                            </div >
                        : null}

                    <div style={{ marginTop: 20 }}>
                        {(deviceAction === "Edit") ?
                            (renewService) ? <h4><b>RENEW SERVICES</b></h4> :
                                <h4><b>NEW SERVICES</b></h4>
                            : null}
                        <Table
                            // width='850px'
                            size="middle"
                            columns={this.state.invoiceColumns}
                            dataSource={this.props.renderInvoiceList(this.props.PkgSelectedRows, this.props.proSelectedRows, this.props.hardwares ? this.props.hardwares : [], this.props.term, this.props.duplicate)}
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
                    {(deviceAction === "Edit") ?
                        (renewService || applyServicesValue === 'extend') ? null :
                            <Row>
                                <Col span={12} />
                                <Col span={8}>REFUND : </Col>
                                <Col span={4}> -{this.props.creditsToRefund} Credits</Col>
                            </Row>
                        : null}
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
