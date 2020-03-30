import React, { Component } from 'react';
import { Button, Form, Input } from 'antd';
import { PANEL_PASSWORD_MODAL, PLEASE_INPUT_YOUR_PASSWORD, ENTER_PASSWORD } from '../../../constants/DeviceConstants';
import { convertToLang } from '../../utils/commonUtils';
import { Markup } from 'interweave';
import { Button_submit } from '../../../constants/ButtonConstants';


class PassworForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.wipeBulkDevices({ ...this.props.wipeData, wipePassword: values.pass });
            }
        });
        this.props.form.resetFields()
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit} autoComplete="new-password" className="text-center wipe_content">
                <Form.Item
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Markup content={convertToLang(this.props.translation[PANEL_PASSWORD_MODAL],
                        "<h4>PANEL PASSWORD <br />REQUIRED FOR<br /> THIS ACTION</h4>")} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                    help={this.props.wipePassMsg ? this.props.wipePassMsg : ""}
                    validateStatus={this.props.wipePassMsg ? "error" : ""}
                >
                    {
                        this.props.form.getFieldDecorator('pass', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true, message: convertToLang(this.props.translation[PLEASE_INPUT_YOUR_PASSWORD], "Please input your password!"),
                                }
                            ],
                        })(
                            <Input.Password className="password_field" type='password' required placeholder={convertToLang(this.props.translation[ENTER_PASSWORD], "Enter Password")} autoComplete='password' />
                        )
                    }
                </Form.Item>
                <Form.Item className="edit_ftr_btn1"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_submit], "Submit")}</Button>
                </Form.Item>
            </Form>
        )
    }
}
const WrappedForm = Form.create()(PassworForm)
export default WrappedForm