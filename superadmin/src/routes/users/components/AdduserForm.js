import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, InputNumber } from 'antd';
import { checkValue } from '../../utils/commonUtils'

import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION
} from '../../../constants/Constants';


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
            // console.log('form', values);
            if (!err) {
                this.props.AddUserHandler(values);
                this.props.handleCancel();
                this.handleReset();
            }
        });
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
                <p>(*)- Required Fields</p>
                {(this.props.user) ? <Form.Item>
                    {this.props.form.getFieldDecorator('user_id', {
                        initialValue: this.props.user.user_id,
                    })(
                        <Input type='hidden' />
                    )}
                </Form.Item> : null}
                <Form.Item

                    label="Name"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('name', {
                        initialValue: this.props.user ? this.props.user.user_name : '',
                        rules: [
                            {
                                required: true, message: 'Name is Required !',
                            }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item

                    label="Email "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('email', {
                        initialValue: this.props.user ? this.props.user.email : '',
                        rules: [{
                            type: 'email', message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true, message: 'Email is Required !',
                        }],
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item className="edit_ftr_btn"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button key="back" type="button" onClick={this.handleCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>

            </Form>
        )

    }
}

const WrappedAddDeviceForm = Form.create()(AddUserForm);
export default WrappedAddDeviceForm;