import React, { Component, Fragment } from 'react'
import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table, Select, Divider, InputNumber } from "antd";
import RestService from '../../../appRedux/services/RestServices';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

import CreditCardForm from './CreditCardForm'
import BitCoinForm from './BitCoinForm';

import { PUSH_APPS } from '../../../constants/ActionTypes';
import { convertToLang } from '../../utils/commonUtils';
import { Button_Cancel, Button_Confirm } from '../../../constants/ButtonConstants';
import { PUSH_APP_TEXT, WARNING } from '../../../constants/Constants';
import { Required_Fields } from '../../../constants/DeviceConstants';
// import 'react-credit-cards/lib/styles.scss';

const confirm = Modal.confirm;

let expiryInput = ''

class PurchaseCredit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            credits: 0,
            currency: 'USD',
            currency_price: '',
            total: '',
            method: "",
            currency_unit_price: 1,
            creditCard_model: false,
            creditInfo: {},
            bitCoinModal: false
        }
    }

    onChange = (e, field) => {
        // console.log(e);
        if (field === 'credits') {
            if (this.state.currency === 'USD') {
                this.setState({
                    credits: e,
                    currency_price: e
                })
            } else {
                this.setState({
                    credits: e,
                    currency_price: e * this.state.currency_unit_price
                })
            }
        } else {
            if (e === 'usd') {
                this.setState({
                    currency: 'usd',
                    currency_price: this.state.credits,
                    currency_unit_price: 1,
                })
            } else {
                RestService.exchangeCurrency(e).then((response) => {
                    if (response.data.status) {
                        if (this.state.credits > 0) {
                            this.setState({
                                currency: e,
                                currency_unit_price: response.data.currency_unit,
                                currency_price: this.state.credits * response.data.currency_unit
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
        }
    }
    cancelPurchaseModal = () => {
        this.props.showPurchaseModal(false)
        this.props.form.resetFields();
        this.setState({
            credits: '',
            currency: '',
            currency_price: '',
            total: '',
            method: "",
            currency_unit_price: 1,
            creditInfo: {}
        })
    }

    cancelCreditCardModal = () => {
        this.setState({
            creditCard_model: false
        })
    }

    showBitCoinModal = (visible) => {
        this.setState({
            bitCoinModal: visible
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log('form', values);
            if (!err) {
                if (values.method === 'CASH') {

                    showConfirm(this, <span>Are you sure you want to request for <strong> "{values.credits} Credits"</strong> on <strong>"CASH"</strong> ?'</span>, values)
                } else if (values.method === 'BTC') {
                    this.setState({
                        bitCoinModal: true,
                        creditInfo: values
                    })
                } else if (values.method === 'CREDIT') {
                    // console.log('asjdhask');
                    this.setState({
                        creditCard_model: true,
                        creditInfo: values
                    })
                }
            }
        });
    }





    render() {
        // console.log(this.state);
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <Fragment>
                <CreditCardForm
                    translation={this.props.translation}
                    creditCard_model={this.state.creditCard_model}
                    cancelCreditCardModal={this.cancelCreditCardModal}
                    cancelPurchaseModal={this.cancelPurchaseModal}
                    creditInfo={this.state.creditInfo}
                    purchaseCreditsFromCC={this.props.purchaseCreditsFromCC}
                />
                <BitCoinForm
                    translation={this.props.translation}
                    bitCoinModal={this.state.bitCoinModal}
                    showBitCoinModal={this.showBitCoinModal}
                    creditInfo={this.state.creditInfo}
                />
                <Modal
                    // closable={false}
                    ref="purchaseCredit"
                    maskClosable={false}
                    style={{ top: 50 }}
                    width="600px"
                    className="push_app"
                    title="Purchase Credits"
                    visible={this.props.purchase_modal}
                    footer={false}
                    onOk={() => {
                    }}
                    onCancel={(e) => {
                        this.cancelPurchaseModal()
                    }}
                    // okText="Push Apps"
                    okText={convertToLang(this.props.translation[PUSH_APP_TEXT], "PUSH APP")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <div>
                        <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                            <p className="mb-4">(*)- {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                            < Form.Item
                                style={{ marginBottom: 0 }}
                                label="Credits"
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                {this.props.form.getFieldDecorator('credits', {
                                    rules: [{
                                        required: true, message: 'No. of credits required !',
                                    },
                                    ],
                                })(

                                    <InputNumber onChange={(e) => { this.onChange(e, 'credits') }} style={{ width: '100%' }} min={1} />
                                )}
                            </Form.Item>
                            <Form.Item
                                label="CURRENCY"
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                                showSearch
                            >
                                {this.props.form.getFieldDecorator('currency', {
                                    initialValue: "USD",
                                    rules: [{
                                        required: true, message: 'Please select a currency!',
                                    }],
                                })(
                                    <Select
                                        // value={this.state.DisplayPages}
                                        showSearch
                                        placeholder="Select Currency"
                                        optionFilterProp="children"
                                        onChange={(e) => { this.onChange(e, 'currency') }}
                                        // onChange={handleChange}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    // defaultValue="usd"
                                    >
                                        {/* <Select.Option value="">Select Currency</Select.Option> */}
                                        <Select.Option value="USD">USD</Select.Option>
                                        <Select.Option value="CAD">CAD</Select.Option>
                                        <Select.Option value="EUR">EUR</Select.Option>
                                        <Select.Option value="VND">VND</Select.Option>
                                        <Select.Option value="CNY">CNY</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                label="CURRENCY PRICE"
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                {this.props.form.getFieldDecorator('currency_price', {
                                    initialValue: this.state.currency_price
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                            {/* <Form.Item
                                label="PROMO CODE"
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                {this.props.form.getFieldDecorator('promo_code', {
                                    initialValue: '',
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item> */}
                            <Form.Item
                                label="PAYMENT METHOD"
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                                showSearch
                            >
                                {this.props.form.getFieldDecorator('method', {
                                    initialValue: this.state.method,
                                    rules: [{
                                        required: true, message: 'Please select a payment method.',
                                    }],
                                })(
                                    <Select
                                        showSearch
                                        placeholder="Select Payment Method"
                                        optionFilterProp="children"
                                        // onChange={handleChange}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

                                    >
                                        <Select.Option value="">Select Payment Method</Select.Option>
                                        <Select.Option value="CASH">CASH</Select.Option>
                                        {/* <Select.Option value="BTC">BITCOIN</Select.Option> */}
                                        <Select.Option value="CREDIT">CREDIT CARD</Select.Option>
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item
                                label="TOTAL PRICE IN $(USD) "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                {this.props.form.getFieldDecorator('total', {
                                    initialValue: this.state.credits
                                })(
                                    <Input disabled />
                                )}
                            </Form.Item>
                            <Form.Item className="edit_ftr_btn11"
                                wrapperCol={{
                                    xs: { span: 24, offset: 0 },
                                    sm: { span: 24, offset: 0 },
                                }}
                            >
                                <Button key="back" type="button" onClick={(e) => { this.cancelPurchaseModal(); }} >Cancel</Button>
                                <Button type="primary" htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal >
            </Fragment>
        )
    }
}

PurchaseCredit = Form.create()(PurchaseCredit);
export default PurchaseCredit;


function showConfirm(_this, msg, values) {
    console.log(_this, msg, values);
    confirm({
        title: convertToLang(_this.props.translation[WARNING], "WARNING!"),
        content: msg,
        // okText: "Confirm",
        okText: convertToLang(_this.props.translation[Button_Confirm], "Confirm"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onOk() {
            _this.props.purchaseCredits(values)
            _this.cancelPurchaseModal()
        },
        onCancel() { },
    });
}