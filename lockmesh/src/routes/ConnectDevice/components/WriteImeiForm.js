import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form, Input, Icon } from 'antd';
import { convertToLang } from '../../utils/commonUtils';
import {
} from "../../../constants/ActionTypes"
import { IMEI_NUMBER_MUST_BE_15_DIGITS_LONG, IMEI_NUMBER_REQUIRED, Enter_IMEI_Number } from '../../../constants/DeviceConstants';
const confirm = Modal.confirm;
const Search = Input.Search;
class WriteImeiForm extends Component {

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
            // console.log('form', values);
            if (!err) {
                showConfirm(this, this.props.device, this.props.type, values)
            }
        });
    }

    render() {
        const { visible, loading } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} >
                <Form.Item
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    {getFieldDecorator('imei', {
                        initialValue: '',
                        rules: [{
                            required: true, message: convertToLang(this.props.translation[IMEI_NUMBER_REQUIRED], "IMEI number required"),
                        },
                        {
                            len: 15, message: convertToLang(this.props.translation[IMEI_NUMBER_MUST_BE_15_DIGITS_LONG], "IMEI Number must be 15 digits long"),
                        }
                        ],
                    })(
                        <Search
                            type="Number"
                            placeholder={convertToLang(this.props.translation[Enter_IMEI_Number], "Enter IMEI Number")}
                            enterButton={<a onClick={this.handleSubmit} type="primary">{this.props.buttonText}</a>}
                        />
                    )}
                </Form.Item>
            </Form>
        )
    }
}
const WrappedForm = Form.create()(WriteImeiForm)
export default WrappedForm
function showConfirm(_this, device, type, values) {
    confirm({
        title: "Write " + values.imei + " to " + type + " on Device ? ",
        onOk() {
            _this.props.writeImei(device.device_id, device.id, type, values.imei, device)
            _this.props.form.resetFields();
            _this.props.getActivities(device.device_id)
        },
        onCancel() {
        },
    });
}