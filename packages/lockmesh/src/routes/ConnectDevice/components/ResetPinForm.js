import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form, Input } from 'antd';
import { PANEL_PASSWORD_MODAL, PLEASE_INPUT_YOUR_PASSWORD, ENTER_PASSWORD } from '../../../constants/DeviceConstants';
import { convertToLang } from '../../utils/commonUtils';
import { Markup } from 'interweave';
import { Button_submit } from '../../../constants/ButtonConstants';


class ResetPinForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmDirty: false,
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('pin')) {
      callback('Two pin that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.resetChatPin(values)
      }
    });
    this.props.form.resetFields();
    this.props.handleCancel(false);
  };

  render() {
    const { visible, loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} autoComplete="new-password" className="text-center wipe_content">
        <Form.Item>
          {getFieldDecorator('chat_id', {
            initialValue: this.props.chatId,
          })(<Input hidden />)}
        </Form.Item>

        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 24, offset: 0 },
          }}
        >
          <Markup content={convertToLang(this.props.translation[PANEL_PASSWORD_MODAL],
            "<h4>RESET PIN</h4>")} />
        </Form.Item>

        <Form.Item label="Pin"
                   wrapperCol={{
                     xs: { span: 24, offset: 0 },
                     sm: { span: 24, offset: 0 },
                   }}
        >
          {getFieldDecorator('pin', {
            rules: [
              {
                required: true,
                message: 'Please input your Pin!',
              },
              { min: 4, message: 'Pin must be minimum 4 characters.' },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>

        <Form.Item label="Confirm Pin"
                   wrapperCol={{
                     xs: { span: 24, offset: 0 },
                     sm: { span: 24, offset: 0 },
                   }}
        >
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm Pin!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
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
const WrappedForm = Form.create()(ResetPinForm)
export default WrappedForm
