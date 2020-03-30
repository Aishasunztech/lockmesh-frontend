import { Modal } from 'antd';

import React, { Component } from 'react'

export default class StatusDevice extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm
    }

    handleStatusDevice = (device, requireStatus, refresh) => {

        this.confirm({
            title: `Are you sure, you want to ${requireStatus} the device?`,
            content: '',
            onOk: () => {

                this.props.statusDevice(device, requireStatus);
                if (window.location.pathname.split("/").pop() !== 'devices') {
                    refresh(device.fl_dvc_id);
                }
            },
            onCancel() { },
        });
    }

    render() {
        return (null);
    }

}
