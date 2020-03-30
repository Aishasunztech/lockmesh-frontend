// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select, Radio, Form } from "antd";
import { Markup } from "interweave";

// Components
// import EditDealer from '../../dealers/components/editDealer';

// Helpers
import { convertToLang, formatMoney } from '../../utils/commonUtils'
// import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
// import { getDealerDetails, editDealer } from '../../appRedux/actions'
// import RestService from "../../appRedux/services/RestServices";

// Constants
import {
    Button_Ok,
    Button_Cancel,
    Button_submit,
} from '../../../constants/ButtonConstants';


// user defined
const confirm = Modal.confirm;

let func;
class RestrictDealerAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dealer: null,
            paymentHistory: []
        }

    }

    showModal = (dealer, callback) => {
        this.setState({
            visible: true,
            dealer: dealer,
        });

        func = callback;
        // callback(dealer.dealer_id)
    }
    handleCancel = () => {
        this.props.form.resetFields()
        this.setState({ visible: false });
    }

    onSelectOption = (e) => {

    }

    handleSubmit = (e) => {
        let _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            /**
             * @author Usman Hafeez
             * @description added confirmation in change account status
             */
            confirm({
                title: <Markup content={`Do you wish to Restrict Dealer Account?`} />,
                onOk() {
                    func(_this.state.dealer.dealer_id, values.dealerStatus)
                    _this.setState({
                        visible: false
                    })
                    // return new Promise((resolve, reject) => {
                    //     setTimeout(Math.random() > 0.5 ? resolve : reject);


                    // }).catch(() => console.log('Oops errors!'));
                },
                okText: convertToLang(_this.props.translation[Button_Ok], "Ok"),
                cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
                onCancel() {
                    // _this.setState({
                    //     visible: false
                    // })
                },
            });

        });
    }

    render() {
        const { visible } = this.state;
        if (!this.state.dealer) {
            return null;
        }
        const {dealer} = this.state;
        return (
            <Fragment>
                <Modal
                    visible={visible}
                    title={`Restrict Account for Dealer ${dealer.dealer_name}`}
                    // title={`Restrict Account for Dealer ${dealer_name}`}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button
                            key="back"
                            onClick={this.handleCancel}
                        >
                            Close
                            {/* {convertToLang(this.props.translation[Button_Cancel], "Cancel")} */}
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.handleSubmit}
                        >
                            {convertToLang(this.props.translation[Button_submit], "Submit")}
                        </Button>,
                    ]}
                >
                    <Form
                        // onSubmit={this.handleSubmit} 
                        autoComplete="new-password"
                    >
                        <Form.Item
                            // labelCol={{ span: 8 }}
                            wrapperCol={{ span: 24 }}
                            className="l_h_20"
                        >
                            {this.props.form.getFieldDecorator('dealerStatus', {
                                initialValue: (dealer.account_balance_status)? dealer.account_balance_status: 'active',
                            })(
                                <Radio.Group
                                    onChange={this.onSelectOption}
                                    initialValue="restricted"
                                    className="restrict_level"
                                >
                                    <Row>
                                        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                                            <h4 className="mb-0">Activate Dealer Account Balance</h4>
                                        </Col>
                                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                            <Radio value="active" className="green">Active</Radio>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                                            <h4 className="mb-0">Restrict ability to PAY LATER </h4>
                                        </Col>
                                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                            <Radio value="restricted" className="yellow">Level 1</Radio>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                                            <h4 className="mb-0">Restrict ability to Add New Devices</h4>
                                        </Col>
                                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                            <Radio value="suspended" className="red" style={{color: 'white'}}>Level 2</Radio>
                                        </Col>
                                    </Row>
                                    {/* <Radio value="active">Active</Radio> */}
                                </Radio.Group>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </Fragment >
        )
    }

}

export default Form.create({ name: 'restrictDealerAction' })(RestrictDealerAccount);
