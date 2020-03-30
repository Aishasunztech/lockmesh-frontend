import { Modal } from 'antd';

import React, { Component } from 'react'

export default class SuspendDevice extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleSuspendDevice = (device, refresh) => {
        // console.log('device', device)
        const title = (device.account_status === "suspended") ? "Are you sure, you want to activate the device?" : "Are you sure, you want to suspend the device?";
        this.confirm({
            title: title,
            content: '',
            onOk: (() => {
                this.props.suspendDevice(device);
                if (window.location.pathname.split("/").pop() !== 'devices') {
                    refresh(device.device_id);
                }
            }),
            onCancel() { },
        });
    }

    render() {
        return (null);
    }

}
