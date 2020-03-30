import React, { Component, Fragment } from 'react'
import {
    Form, Input, Row, Col, Button, Select,
} from "antd";
import { convertToLang } from '../../../utils/commonUtils';
import {
    PACKAGE_PRICE,
} from "../../../../constants/AccountConstants";
import {
    Button_SET, Button_Cancel, Button_submit, Button_Save,
} from '../../../../constants/ButtonConstants'
import { ADMIN, SDEALER } from '../../../../constants/Constants';

class ModifyPriceForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pkgPrice: 0,
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log(this.props.package.id);
                if (this.props.item.id) {
                    this.props.modifyItemPrice(this.props.item.id, values.price, values.retail_price, this.props.isModify, this.props.type);
                    this.props.handleCancel()
                }
            }

        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        // console.log(this.props.item);
        return (
            <Form onSubmit={this.handleSubmit} >
                <Form.Item label={convertToLang(this.props.translation[""], "PRICE")} labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}>
                    {getFieldDecorator('price', {
                        initialValue: (this.props.type === 'package') ? this.props.item.pkg_price : this.props.item.hardware_price,
                        rules: [
                            {
                                required: true,
                                message: 'Please Input Price',
                            },
                            {
                              validator: async (rule, value) => {
                                if(this.props.type === 'package'){
                                  if(value < this.props.item.costPrice){
                                    throw new Error(`cost price is ${this.props.item.costPrice}. please enter a value greater then cost price`)
                                  }
                                }
                                return true;
                              }
                            }
                        ]
                    })(<Input type='number' min={0} disabled={this.props.user.type === SDEALER} />)}

                </Form.Item>
                {(this.props.user.type !== ADMIN) ?
                    <Form.Item label={convertToLang(this.props.translation[""], "RETAIL PRICE")} labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}>
                        {getFieldDecorator('retail_price', {
                            initialValue: this.props.item.retail_price,
                            rules: [
                                {
                                    required: true,
                                    message: 'Please Input Price',
                                },
                                {
                                  validator: async (rule, value) => {
                                    if(this.props.type === 'package'){
                                      if(value < this.props.item.costPrice){
                                        throw new Error(`cost price is ${this.props.item.costPrice}. please enter a value greater then cost price`)
                                      }
                                    }
                                    return true;
                                  }
                                }
                            ],
                        })(<Input type='number' min={0} />)}

                    </Form.Item>
                    : null}
                <Form.Item className="edit_ftr_btn"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button key="back" type="button" onClick={this.props.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                    <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_Save], "Save")}</Button>
                </Form.Item>

            </Form >
        )
    }
}

ModifyPriceForm = Form.create()(ModifyPriceForm);

export default ModifyPriceForm;
