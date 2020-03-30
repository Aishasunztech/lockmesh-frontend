import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber } from 'antd';
import { checkValue, convertToLang } from '../../utils/commonUtils'

import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, User_Name_require, Only_alpha_numeric, Not_valid_Email, Email, Name, Required_Email
} from '../../../constants/Constants';
import { Button_Cancel, Button_submit } from '../../../constants/ButtonConstants';
import { Required_Fields } from '../../../constants/DeviceConstants';


class AddUserForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log(err,'form', values.name);
            if(values.name === ''){
                this.setState({
                    validateStatus: 'error',
                    help: convertToLang(this.props.translation[User_Name_require], "Name is Required")
                })
            }
            if (!err) {

               
            if (/[^A-Za-z \d]/.test( values.name)) {
                this.setState({
                    validateStatus: 'error',
                    help: convertToLang(this.props.translation[User_Name_require], "Name is Required")
                })
            } else {
                this.props.AddUserHandler(values);
                this.props.handleCancel();
                this.handleReset();

            }
        }

        });
    }
    handleNameValidation = (event) => {
        var fieldvalue = event.target.value;

        // console.log('rest ', /[^A-Za-z \d]/.test(fieldvalue));
        // console.log('vlaue', fieldvalue)

        if(fieldvalue === ''){
            this.setState({
                validateStatus: 'error',
                help: convertToLang(this.props.translation[User_Name_require], "Name is Required")
            })
        }
        if (/[^A-Za-z \d]/.test(fieldvalue)) {
            this.setState({
                validateStatus: 'error',
                help: convertToLang(this.props.translation[Only_alpha_numeric], "Please insert only alphabets and numbers")
            })
        }
        else {
            this.setState({
                validateStatus: 'success',
                help: null,
            })
        }
    }


    componentDidMount() {
    }
    handleReset = () => {
        this.props.form.resetFields();
    }


    handleCancel = () => {
        this.handleReset();
        this.props.handleCancel();
    }
    handleChange = (e) => {
        this.setState({ type: e.target.value });
    }

    render() {
        //   console.log('props of coming', this.props.device);
        //  alert(this.props.device.device_id);
        const { visible, loading } = this.state;
        // console.log(this.state.type);
        return (
            <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>
                {(this.props.user) ? <Form.Item>
                    {this.props.form.getFieldDecorator('user_id', {
                        initialValue: this.props.user.user_id,
                    })(
                        <Input type='hidden' />
                    )}
                </Form.Item> : null}
                <Form.Item

                    label= {convertToLang(this.props.translation[Name], "Name")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    validateStatus={this.state.validateStatus}
                    help={this.state.help}
                >
                    {this.props.form.getFieldDecorator('name', {
                        initialValue: this.props.user ? this.props.user.user_name : '',
                        rules: [
                            {
                                required: true, message: convertToLang(this.props.translation[User_Name_require], "Name is Required"),
                            }
                        ],
                    })(
                        <Input onChange={(e) => this.handleNameValidation(e)} />
                    )}
                </Form.Item>
                <Form.Item

                    label= {convertToLang(this.props.translation[Email], "Email")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('email', {
                        initialValue: this.props.user ? this.props.user.email : '',
                        rules: [{
                            type: 'email', message: convertToLang(this.props.translation[Not_valid_Email], "The input is not valid E-mail!"),
                        },
                        {
                            required: true, message: convertToLang(this.props.translation[Required_Email], "Email is Required!"),
                        }],
                    })(
                        <Input onChange={(e) => this.check} />
                    )}
                </Form.Item>
                <Form.Item className="edit_ftr_btn"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button key="back" type="button" onClick={this.handleCancel}> {convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>
                    <Button type="primary" htmlType="submit"> {convertToLang(this.props.translation[Button_submit], "Submit")} </Button>
                </Form.Item>

            </Form>
        )

    }
}

const WrappedAddDeviceForm = Form.create()(AddUserForm);
export default WrappedAddDeviceForm;