import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button
} from "antd";

import { one_month, three_month, six_month, twelve_month } from '../../../../constants/Constants';

import {
    Button_SET,
} from '../../../../constants/ButtonConstants'
import {
    PRICE,
} from '../../../../constants/AccountConstants'
import { convertToLang } from '../../../utils/commonUtils';

class PricingForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            one_month: 0,
            three_month: 0,
            six_month: 0,
            twelve_month: 0
        }
    }
    setPrice = (fieldName, value) => {
        if (fieldName) {
            // let value = this.props.form.getFieldValue(fieldName)
            var isnum = /^\d+$/.test(value);

            if ((fieldName && this.props.price_for) && (isnum || value == '')) {
                this.props.setPrice(fieldName, value, this.props.price_for);
                if (this.props.pricesFormErrors && this.props.pricesFormErrors.length) {
                    this.props.restrictSubmit(true, `${fieldName + this.props.innerTab}`)
                }
            }else{
                this.props.restrictSubmit(false, `${fieldName + this.props.innerTab}`)
            }
        }
    }

    checkPrice = async (rule, value, callback) => {

        let field = rule.field;
        var isnum = /^\d+$/.test(value);

        if (isnum && value > 0 ) {
            callback()
            if (this.props.pricesFormErrors && this.props.pricesFormErrors.length) {
                this.props.restrictSubmit(true, `${field + this.props.innerTab}`)
            }
        } else {
            callback("Price must be in Numbers and greater than zero")
            this.props.restrictSubmit(false, `${field + this.props.innerTab}`)
        }
    }

    componentDidUpdate(prevProps) {
        // console.log(this.props.innerTab, 'llllllllll', prevProps.innerTab)
        if (this.props.innerTab !== prevProps.innerTab) {
            this.props.form.resetFields();
            this.props.form.validateFields();
        }
    }

    render() {
        // console.log(this.props.innerTabData, 'props are for inner tab data')

        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={17}>
                        <Form.Item label={convertToLang(this.props.translation[one_month], "1 month")}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('1 month', {
                                initialValue: this.props.innerTabData ? this.props.innerTabData['1 month'] ? this.props.innerTabData['1 month'] : '0' : '0',
                                rules: [
                                    {
                                        min: 1
                                    }, {
                                        validator: this.checkPrice,
                                    }
                                ],
                            })(<Input type='number' onChange={e => this.setPrice('1 month', e.target.value)} min={1} />)}

                        </Form.Item>
                    </Col>
                   
                    <Col span={7}>
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], "PRICE")} : ${this.props.innerTabData ? this.props.innerTabData['1 month'] ? this.props.innerTabData['1 month'] : 0 : 0}</h4>
                    </Col>
                </Row>

                <Row>
                    <Col span={17}>
                        <Form.Item label={convertToLang(this.props.translation[three_month], "3 month")} labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('3 month', {
                                initialValue: this.props.innerTabData ? this.props.innerTabData['3 month'] ? this.props.innerTabData['3 month'] : '0' : '0',
                                rules: [
                                    {
                                        min: 1
                                    }, {
                                        validator: this.checkPrice,
                                    }
                                ],
                            })(<Input type='number' onChange={e => this.setPrice('3 month', e.target.value)} min={1} />)}


                        </Form.Item>
                    </Col>
                  
                    <Col span={7}>
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], "PRICE")} : ${this.props.innerTabData ? this.props.innerTabData['3 month'] ? this.props.innerTabData['3 month'] : 0 : 0}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={17}>
                        <Form.Item label={convertToLang(this.props.translation[six_month], "6 month")} labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('6 month', {
                                initialValue: this.props.innerTabData ? this.props.innerTabData['6 month'] ? this.props.innerTabData['6 month'] : '0' : '0',                                
                                rules: [
                                    {
                                        min: 1
                                    }, {
                                        validator: this.checkPrice,
                                    }
                                ],
                            })(<Input type='number' onChange={e => this.setPrice('6 month', e.target.value)} min={1} />)}


                        </Form.Item>
                    </Col>
                   
                    <Col span={7}>
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], "PRICE")} : ${this.props.innerTabData ? this.props.innerTabData['6 month'] ? this.props.innerTabData['6 month'] : 0 : 0}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={17}>
                        <Form.Item label={convertToLang(this.props.translation[twelve_month], "12 month")} labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('12 month', {
                                initialValue: this.props.innerTabData ? this.props.innerTabData['12 month'] ? this.props.innerTabData['12 month'] : '0' : '0',
                                
                                rules: [
                                    {
                                        min: 1
                                    }, {
                                        validator: this.checkPrice,
                                    }
                                ],
                            })(<Input type='number' onChange={e => this.setPrice('12 month', e.target.value)} min={1} />)}

                        </Form.Item>
                    </Col>
                    
                    <Col span={7}>
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], "PRICE")} : ${this.props.innerTabData ? this.props.innerTabData["12 month"] ? this.props.innerTabData['12 month'] : 0 : 0}</h4>
                    </Col>
                </Row>

            </Form>
        )
    }
}

PricingForm = Form.create()(PricingForm);

export default PricingForm