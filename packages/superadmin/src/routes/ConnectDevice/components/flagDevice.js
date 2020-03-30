import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form } from 'antd';
// import EditForm from './editForm';
// let editDevice;
export default class FlagDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1
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
        this.state.refreshDevice(this.state.device.device_id)
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
                    title="Flag Device"
                    onOk={this.handleOk}
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
                                <Radio.Button value="Stolen">Stolen</Radio.Button>
                                <Radio.Button value="Lost">Lost</Radio.Button>
                                <Radio.Button value="Defective">Defective</Radio.Button>
                                <Radio.Button value="Other">Other</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item className="edit_ftr_1"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <div className="text-right">
                                <Button key="back" type="button" onClick={this.handleCancel}>Cancel</Button>
                                <Button type="primary" htmlType="submit">Submit</Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )

    }
}