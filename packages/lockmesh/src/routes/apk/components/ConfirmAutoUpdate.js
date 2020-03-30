import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form, Input } from 'antd';
import {
    PUSH_APPS,
    WIPE_DEVICE,
    PULL_APPS,
    POLICY
} from "../../../constants/ActionTypes"
const FormItem = Form.Item;
class PassworForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        // console.log(this.props.actionType, 'action type');
        this.props.form.validateFieldsAndScroll((err, values) => {
            //  console.log(this.props.actionType, 'action type');
            if (!err) {
                this.props.checkCredentials(values)

            }
        });
        this.props.form.resetFields()
        this.props.hideModel(false);
    }
    handleCancelForm = () => {
        this.props.form.resetFields()
    }

    render() {
        const { visible, loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="gx-signin-form gx-form-row0">
                <FormItem
                    label="Email"
                    labelCol={{ span: 8, xs: 24, sm: 8 }}
                    wrapperCol={{ span: 14, md: 14, xs: 24 }}
                >
                    {getFieldDecorator('email', {
                        initialValue: "",
                        rules: [{
                            required: true, type: 'email', message: "Doesn't seem to be a valid Email ID",
                        }],
                    })(
                        <Input placeholder="Email" />
                    )}
                </FormItem>
                <FormItem
                    label="Password"
                    labelCol={{ span: 8, xs: 24, sm: 8 }}
                    wrapperCol={{ span: 14, md: 14, xs: 24 }}
                >
                    {getFieldDecorator('pwd', {
                        initialValue: "",
                        rules: [{ required: true, message: 'You forgot to enter your password' }],
                    })(
                        <Input type="password" placeholder="Password" />
                    )}
                </FormItem>


                <Form.Item className="edit_ftr_btn11"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button key="back" type="button" onClick={() => { this.props.hideModel(false); this.handleCancelForm() }} >Cancel</Button>
                    <Button type="primary" htmlType="submit">Confirm</Button>
                </Form.Item>
            </Form >
        )
    }
}
const WrappedForm = Form.create()(PassworForm)
export default WrappedForm