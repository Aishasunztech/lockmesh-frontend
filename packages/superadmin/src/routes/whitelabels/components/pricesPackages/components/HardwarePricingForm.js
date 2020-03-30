import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button, Select,
} from "antd";
import styles from '../../../whitelabels.css';
import RestService from '../../../../../appRedux/services/RestServices';
import { one_month, three_month, six_month, twelve_month, sim, chat, pgp, vpn, sim2 } from '../../../../../constants/Constants';

class HardwarePricingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hardwarePrice: 0,
            help: '',
            validateStatus: 'success',
            hardwareName: ""
        }
    }


    setValue = (fieldName, e) => {
        // let value = e.target.value;
        let value = ''
        if (fieldName) {
            value = e
            if (fieldName == 'hardwarePrice') {
                value = +value;
                value = value.toString();
                var isnum = /^\d+$/.test(value);
                if (!isnum || e <= 0) {
                    this.props.restrictHardwareSubmit(false, fieldName)
                    this.setState({
                        validateStatus: 'error',
                        help: value === '' ? 'Please Input Package Price' : 'Price must be in Numbers and greater than zero',
                        [fieldName]: e
                    })
                } else {
                    this.props.restrictHardwareSubmit(true, fieldName)
                    this.setState({
                        validateStatus: 'success',
                        help: '',
                        [fieldName]: e
                    })
                }

            } else {
                this.props.restrictHardwareSubmit(true, fieldName)
                this.setState({
                    [fieldName]: value
                })
            }
            this.props.setHardwareDetail(e, fieldName);
        }
    }


    HardwareNameChange = async (rule, value, callback) => {
        let response = true
        console.log(value);
        response = await RestService.checkHardwareName(value).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    return true
                }
                else {
                    return false
                }
            }
        });

        if (response) {
            this.props.restrictHardwareSubmit(true, 'hardwareName')
            callback()
        } else {
            this.props.restrictHardwareSubmit(false, 'hardwareName')
            callback("Hardware name already taken please use another name.")
        }
        if (value == '') {
            this.props.restrictHardwareSubmit(false, 'hardwareName')
        }
    }

    componentDidMount() {
        // 
        this.setState({
            hardwarePrice: 0,
            sim: false,
            sim_id2: false,
            chat: false,
            pgp: false,
            vpn: false
        })
    }
    // resetState = ()=>{

    // }

    render() {

        const formItemLayout = {
            labelCol: {
                xs: { span: 24, offset: 2 },
                sm: { span: 10, offset: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const { Option } = Select;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={13}>
                        <Form.Item label="Hardware Name"
                            labelCol={{ span: 11 }}
                            wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('hardwareName', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input Hardware Name!',
                                    },
                                    {
                                        validator: this.HardwareNameChange,
                                    }
                                ],
                            })(<Input placeholder="Hardware Name" onChange={(e => this.setValue('hardwareName', e.target.value))} />)}
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}>Set</Button> */}
                    </Col>
                    <Col span={6}>
                        <h4 className='priceText'>{this.state.hardwareName}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label="Hardware Price" labelCol={{ span: 11 }}
                            validateStatus={this.state.validateStatus}
                            help={this.state.help}
                            wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('hardwarePrice', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please Input Hardware Price',
                                    }
                                ],
                            })(<Input placeholder="Hardware Price" onChange={(e => this.setValue('hardwarePrice', e.target.value))} type='number' min={1} />)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        {/* <Button type="primary" onClick={() => this.setPrice('hardwarePrice')} >Set</Button> */}
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: {this.state.hardwarePrice} Credits</h4>
                    </Col>
                </Row>
            </Form>
        )
    }
}

HardwarePricingForm = Form.create()(HardwarePricingForm);

export default HardwarePricingForm;