import React, { Component } from 'react';
import { Modal, message, Radio, Button, Form, Input } from 'antd';
import PassworForm from './PasswordForm';
// import EditForm from './editForm';
// let editDevice;
export default class WipeDevice extends Component {

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
    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    width="330px"
                    maskClosable={false}
                    visible={visible}
                    title=""
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="wipe_device"
                >

                    <PassworForm
                        device={this.props.device}
                        authUser={this.props.authUser}
                        checkPass={this.props.checkPass}
                        handleCancel={this.handleCancel}
                        actionType = "WIPE_DEVICE"
                    />
                </Modal>
            </div>
        )
    }
}
