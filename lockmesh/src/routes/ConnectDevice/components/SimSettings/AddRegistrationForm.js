import React, { Component, Fragment } from 'react';
import { Col, Row, Switch, Button, Form, Input, Select, InputNumber } from 'antd';
import { checkValue, convertToLang } from '../../../utils/commonUtils'

import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, User_Name_require, Only_alpha_numeric, Not_valid_Email, Email, Name, Required_Email
} from '../../../../constants/Constants';
import { Button_Cancel, Button_submit, Button_Add } from '../../../../constants/ButtonConstants';
import { Required_Fields, DEVICE_SIM_ID, DEVICE_Select_SIM_ID, ONLY_NUMBER_ARE_ALLOWED, ICC_ID_20_LONG, ICC_ID, ICC_ID_IS_REQUIRED, NOTE } from '../../../../constants/DeviceConstants';
import { Guest, ENCRYPT } from '../../../../constants/TabConstants';


class RegisterSimForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            help: '',
            iccidHelp: '',
            visible: false,
            guest: true,
            encrypt: true,
            validateStatus: ''
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log('iccid is: ', values['iccid'])
            // let checkICCID = this.isValidLuhn(values['iccid'])

            values['guest'] = this.state.guest ? 1 : 0;
            values['encrypt'] = this.state.encrypt ? 1 : 0;
            values['data_limit'] = "";
            values['device_id'] = this.props.deviceID;

            if (!err) {
                this.props.AddSimHandler(values);
                this.props.handleCancel();
                this.handleReset();
            }
        });
    }

    // isValidLuhn = (number) => {
    //     // validate luhn checksum
    //     settype(number, 'string');
    //     var sumTable = [
    //         [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    //         [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
    //     ];
    //     var sum = 0;
    //     var flip = 0;
    //     var i;
    //     for (i = strlen(number) - 1; i >= 0; i--) {
    //         sum += sumTable[flip++ & 0x1][number[i]];
    //     }
    //     return sum % 10 === 0;
    // }

    handleICCIDValidation = (rule, value, callback) => {
        if ((value !== undefined) && value.length > 0) {
            // if (Number(value)) {
            if (/^[a-zA-Z0-9]+$/.test(value)) {
                if (value.length != 20 && value.length != 19) callback(`${convertToLang(this.props.translation[ICC_ID_20_LONG], "ICC ID should be 19 or 20 digits long")}  :(${value.length})`);

            } else {
                callback(convertToLang(this.props.translation[Only_alpha_numeric], "Please insert only alphabets and numbers"));
            }
        }
        callback();
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

    handleCancel = () => {
        this.handleReset();
        this.props.handleCancel();
    }

    render() {
        
        var deviceSimIds = [];
        deviceSimIds[0] = this.props.device.sim_id;
        // console.log(deviceSimIds)
        if (deviceSimIds[0] === undefined || deviceSimIds[0] === 'undefined' || deviceSimIds[0] === "N/A" || deviceSimIds[0] === '' || deviceSimIds[0] === null) {
            deviceSimIds = []
        }
        // console.log(deviceSimIds);
        return (
            <div>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>

                    <Form.Item
                        label={convertToLang(this.props.translation[ICC_ID], "ICC-ID")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('iccid', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: convertToLang(this.props.translation[ICC_ID_IS_REQUIRED], "ICC-ID is Required"),
                                },
                                {
                                    validator: this.handleICCIDValidation,
                                }
                            ],
                        })(
                            <Input />
                        )}
                    </Form.Item>

                    <Form.Item
                        label={convertToLang(this.props.translation[Name], "Name")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('name', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: convertToLang(this.props.translation[User_Name_require], "Name is Required"),
                                }
                            ],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[DEVICE_SIM_ID], "SIM ID")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('sim_id', {
                            initialValue: '',
                        })(
                            <Select
                                placeholder={convertToLang(this.props.translation[DEVICE_Select_SIM_ID], "SIM ID")}
                                optionFilterProp="children"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value="">{convertToLang(this.props.translation[DEVICE_Select_SIM_ID], "Select SIM ID")}</Select.Option>
                                {deviceSimIds.map((sim_id, index) => {
                                    return (<Select.Option key={index} value={sim_id}>{sim_id}</Select.Option>)
                                })}
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[NOTE], "Note")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('note', {
                            initialValue: this.props.user ? this.props.user.email : '',
                        })(
                            <Input onChange={(e) => this.check} />
                        )}
                    </Form.Item>

                    <Row className="">
                        {/* <Row className="sec_head"> */}
                        <Col span={6} />
                        {/* <Col span={6}></Col> */}
                        <Col span={9}>
                            <span>{convertToLang(this.props.translation[Guest], "Guest")} </span> <Switch defaultChecked={this.state.guest} onClick={(e) => {
                                this.setState({
                                    guest: !this.state.guest
                                })
                            }}
                                size="small"
                            />
                        </Col>
                        <Col span={9}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch defaultChecked={this.state.encrypt} onClick={(e) => {
                                this.setState({
                                    encrypt: !this.state.encrypt
                                })
                            }}
                                size="small"
                            />
                        </Col>
                        {/* <Col span={3} /> */}
                    </Row>

                    <Form.Item className="edit_ftr_btn"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button key="back" type="button" onClick={this.handleCancel}> {convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>
                        <Button type="primary" htmlType="submit"> {convertToLang(this.props.translation["Add Manual"], "Add Manual")} </Button>
                    </Form.Item>
                </Form>

            </div>
        )
    }
}

const WrappedRegisterSimForm = Form.create()(RegisterSimForm);
export default WrappedRegisterSimForm;