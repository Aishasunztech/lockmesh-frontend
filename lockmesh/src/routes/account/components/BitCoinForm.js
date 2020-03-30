import React, { Component, Fragment } from 'react'
import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table, Select, Divider, InputNumber } from "antd";

import { convertToLang } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Confirm } from '../../../constants/ButtonConstants';
import {  WARNING } from '../../../constants/Constants';

const confirm = Modal.confirm;

class BitCoinForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: '',
            name: '',
            expiry: '',
            cvc: '',
            focused: 'number',
            expiryInput: '',
        }
    }
    cancelBitCoinModal = () => {
        this.props.showBitCoinModal(false)
        this.props.form.resetFields();
        
        this.setState({
            number: '',
            name: '',
            expiry: '',
            cvc: '',
            focused: 'number',
            expiryInput: '',
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(this.refs.purchaseCredit);
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log('form', values, this.props.creditInfo);
            if (!err) {
                // showConfirm(this, <span>Are you sure you want to purchase <strong> "{this.props.credits} Credits"</strong> from <strong>"CREDIT CARD"</strong> ?'</span>, values, this.props.creditInfo)
            }
        });
    }

    handleCardInputs = (e, field) => {

    }

    handleCardFocus = (field) => {
        this.setState({
            focused: field
        })
    }

    checkNumberLength = (rule, value, callback) => {
        // console.log("Check length");
        if (value.length === 16 || value.length === 19) {
            callback();
        } else {
            callback(' ');
        }
    }

    render() {
        return (
                <Modal
                    // closable={false}
                    maskClosable={false}
                    style={{ top: 50 }}
                    width="600px"
                    title="BitCoin Information"
                    visible={this.props.bitCoinModal}
                    footer={false}
                    okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                    onOk={() => {
                    }}
                    onCancel={(e) => {
                            this.cancelBitCoinModal()
                        }
                    }
                >
                    {/* <Form style={{ marginTop: 20 }} onSubmit={this.handleSubmit} autoComplete="new-password">
                        <Form.Item
                            style={{ marginBottom: 0 }}
                            label="CREDIT CARD NUMBER"
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('number', {
                                rules: [{
                                    required: true, message: ' ',
                                },
                                {
                                    validator: this.checkNumberLength,
                                }
                                ],
                            })(

                                <Input type='number' onChange={(e) => { this.handleCardInputs(e, 'number') }} onFocus={(e) => { this.handleCardFocus('number') }} style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="NAME"
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('name', {
                                initialValue: '',
                                rules: [{
                                    required: true, message: ' ',
                                },
                                ],
                            })(
                                <Input onChange={(e) => { this.handleCardInputs(e, 'name') }} onFocus={(e) => { this.handleCardFocus('name') }} />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="EXPIRY"
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('expiry', {
                                initialValue: this.state.expiryInput,
                                getValueFromEvent: this.getExpiry,
                                rules: [{
                                    required: true, message: ' ',
                                },
                                {
                                    len: 7, message: ' ',
                                }
                                ],
                            })(
                                <Input id='expiry' onChange={(e) => { this.handleCardInputs(e, 'expiry') }} onFocus={(e) => { this.handleCardFocus('expiry') }} />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="CVC"
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('cvc', {
                                initialValue: '',
                                rules: [{
                                    required: true, message: ' ',
                                },
                                {
                                    len: 4, message: ' ',
                                }
                                ],
                            })(
                                <Input type='number' onChange={(e) => { this.handleCardInputs(e, 'cvc') }} onFocus={(e) => { this.handleCardFocus('cvc') }} />
                            )}
                        </Form.Item>
                        <Form.Item className="edit_ftr_btn11"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <Button key="back" type="button" onClick={(e) => { this.cancelCreditCardModal() }} >Cancel</Button>
                            <Button type="primary" htmlType="submit">Check Out</Button>
                        </Form.Item>
                    </Form>
                 */}
                </Modal >
        )
    }
}



BitCoinForm = Form.create()(BitCoinForm);
export default BitCoinForm;


function showConfirm(_this, msg, values, creditInfo) {
    confirm({
        title: convertToLang(this.props.translation[WARNING], "WARNING!"),
        content: msg,
        // okText: "Confirm",
        okText:  convertToLang(this.props.translation[Button_Confirm], "Confirm"),
        cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
        onOk() {
            // _this.props.purchaseCreditsFromCC(values, creditInfo)
            // _this.props.cancelPurchaseModal()
            // _this.cancelCreditCardModal()
        },
        onCancel() {

        },
    });
}