import { Modal, Button } from 'antd';

import React, { Component } from 'react'
import { convertToLang } from '../../utils/commonUtils';
import { ARE_YOU_SURE_YOU_WANT_ACTIVATE_THE_DEVICE } from '../../../constants/DeviceConstants';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';

export default class ActivateDevice extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm
    }

    handleActivateDevice = (device, refresh) => {

        this.confirm({
            title: convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_ACTIVATE_THE_DEVICE], "Would you like to unsuspend this Device "),
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText:  convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: () => {

                this.props.activateDevice(device);
                if (window.location.pathname.split("/").pop() !== 'devices') {
                    // refresh(device.device_id);
                }
            },
            onCancel() { },
        });
    }

    render() {
        return (null);
    }

}
