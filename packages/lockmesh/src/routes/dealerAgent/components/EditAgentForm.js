import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Switch, Select, InputNumber } from 'antd';
import { checkValue, convertToLang } from '../../utils/commonUtils'

import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, User_Name_require, Only_alpha_numeric, Not_valid_Email, Email, Name, Required_Email
} from '../../../constants/Constants';
import { Button_Cancel, Button_submit } from '../../../constants/ButtonConstants';
import { Required_Fields } from '../../../constants/DeviceConstants';


class EditAgentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log(err,'form', values.name);
            if (values.name === '') {
                this.setState({
                    validateStatus: 'error',
                    help: convertToLang(this.props.translation['user.name.is.required'], "Username is Required")
                })
            }
            if (!err) {


                if (/[^A-Za-z \d]/.test(values.name)) {
                    this.setState({
                        validateStatus: 'error',
                        help: convertToLang(this.props.translation['user.name.is.required'], "Username is Required")
                    })
                } else {

                    this.props.updateAgent(values);
                    // this.props.handleCancel();
                    this.props.showEditModal(false);
                    // this.handleReset();

                }
            }

        });
    }

    handleNameValidation = (event) => {
        var fieldvalue = event.target.value;

        if (fieldvalue === '') {
            this.setState({
                validateStatus: 'error',
                help: convertToLang(this.props.translation['user.name.is.required'], "Username is required")
            })
        }

        if (/[^A-Za-z \d]/.test(fieldvalue)) {
            this.setState({
                validateStatus: 'error',
                help: convertToLang(this.props.translation[Only_alpha_numeric], "Please insert only alphabets and numbers")
            })
        } else {
            this.setState({
                validateStatus: 'success',
                help: null,
            })
        }
    }

    handleCancel = () => {
        this.props.showEditModal(false);
    }

    render() {

        return (
            <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>

                {(this.props.agent) ? <Form.Item>
                    {this.props.form.getFieldDecorator('agent_id', {
                        initialValue: this.props.agent.id,
                    })(
                        <Input type='hidden' />
                    )}
                </Form.Item> : null}

                <Form.Item

                    label={convertToLang(this.props.translation['user.name'], "Username")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    validateStatus={this.state.validateStatus}
                    help={this.state.help}
                >
                    {this.props.form.getFieldDecorator('name', {
                        initialValue: this.props.agent ? this.props.agent.name : '',
                        rules: [
                            {
                                required: true,
                                message: convertToLang(this.props.translation[User_Name_require], "Username is Required"),
                            }
                        ],
                    })(
                        <Input onChange={(e) => this.handleNameValidation(e)} />
                    )}
                </Form.Item>
                <Form.Item
                    label={convertToLang(this.props.translation[Email], "Email")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('email', {
                        initialValue: this.props.agent ? this.props.agent.email : '',
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
                <Form.Item
                    label={convertToLang(this.props.translation['admin'], "ADMIN")}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('type', {
                        initialValue: (this.props.agent.type === "admin") ? true : false
                    })(
                        <Switch
                            // defaultChecked 
                            // onChange={onChange}
                            defaultChecked={(this.props.agent.type === "admin") ? true : false}
                        />
                    )}
                </Form.Item>
                <Form.Item className="edit_ftr_btn"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button
                        key="back"
                        type="button"
                        onClick={this.handleCancel}
                    >
                        {convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                    </Button>
                    <Button type="primary" htmlType="submit"> {convertToLang(this.props.translation[Button_submit], "Submit")} </Button>
                </Form.Item>
            </Form>
        )

    }
}

const wrappedEditAgentForm = Form.create()(EditAgentForm);
export default wrappedEditAgentForm;