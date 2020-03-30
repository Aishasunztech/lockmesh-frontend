import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang } from '../../utils/commonUtils';
import { ARE_YOU_SURE_YOU_WANT_ACTIVATE_THE_DEVICE, ARE_YOU_SURE_YOU_WANT_SUSPEND_THE_DEVICE } from '../../../constants/DeviceConstants';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';


export default class SuspendDevice extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleSuspendDevice = (device, refresh) => {
        // console.log('device', device)
        const title = (device.account_status === "suspended") ? convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_SUSPEND_THE_DEVICE], "Are you sure, you want to suspend the device ") + device.device_id + " ?" : convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_SUSPEND_THE_DEVICE], "Are you sure, you want to suspend the device ") + device.device_id + "?";
        this.confirm({
            title: title,
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText:  convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                this.props.suspendDevice(device);
                if (window.location.pathname.split("/").pop() !== 'devices') {
                    // refresh(device.device_id);
                }
            }),
            onCancel() { },
        });
    }

    render() {
        return (null);
    }

}
