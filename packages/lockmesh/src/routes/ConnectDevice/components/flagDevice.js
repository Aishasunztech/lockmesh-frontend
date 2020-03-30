import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form } from 'antd';
import { FLAG_DEVICE, DEVICE_ID, STOLEN, LOST, DEFECTIVE, OTHER } from '../../../constants/DeviceConstants';
import { Button_Cancel, Button_Ok, Button_submit } from '../../../constants/ButtonConstants';
import { convertToLang } from '../../utils/commonUtils';
// import EditForm from './editForm';
// let editDevice;
export default class FlagDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            device: {}
        }
    }
    showModel = (device, func, refreshDevice) => {
        // console.log('device Detail', device)
        // alert('its working')
        // editDevice = func;
        this.setState({

            device: device,
            visible: true,
            func: func,
            refreshDevice: refreshDevice

        });

    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.state.func(this.state.device.usr_device_id, this.refs.option.state.value);
        this.setState({ visible: false });
        // this.state.refreshDevice(this.state.device.device_id)
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { visible, loading } = this.state;
        // console.log("Comming ", this.props);
        return (
            <div>
                <Modal
                    maskClosable={false}
                    visible={visible}
                    destroyOnClose={true}
                    title={<div>{convertToLang(this.props.translation[FLAG_DEVICE], "Flag Device")} <br /> {convertToLang(this.props.translation[DEVICE_ID], "DEVICE ID")}: {this.state.device.device_id}</div>}
                    onOk={this.handleOk}
                    okText= {convertToLang(this.props.translation[Button_Ok], "Ok")}
                    cancelText= {convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="flag_device"
                >
                    <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                        <Form.Item className="edit_ftr_1 border_btm"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <Radio.Group ref='option' defaultValue="Stolen" buttonStyle="solid">
                                <Radio.Button value="Stolen">{convertToLang(this.props.translation[STOLEN], "Stolen")}</Radio.Button>
                                <Radio.Button value="Lost">{convertToLang(this.props.translation[LOST], "Lost")}</Radio.Button>
                                <Radio.Button value="Defective">{convertToLang(this.props.translation[DEFECTIVE], "Defective")}</Radio.Button>
                                <Radio.Button value="Other">{convertToLang(this.props.translation[OTHER], "Other")}</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item className="edit_ftr_1"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <div className="text-right">
                                <Button key="back" type="button" onClick={this.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                                <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_submit], "Submit")}</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )

    }
}