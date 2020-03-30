import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';

export default class BulkActivateDevices extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm
    }

    handleActivateDevice = (devices, dealers, users) => {

        let device_ids = [];
        let dealer_ids = [];
        let user_ids = [];

        checkIsArray(devices).forEach((item) => {
            if (item.usr_device_id) {
                device_ids.push(item.usr_device_id);
            }
        });
        checkIsArray(dealers).forEach((item) => {
            dealer_ids.push(item.key);
        });
        checkIsArray(users).forEach((item) => {
            user_ids.push(item.key);
        });

        let data = {
            device_ids,
            dealer_ids,
            user_ids
        }

        this.confirm({
            // title: `${convertToLang(this.props.translation[""], "Would you like to unsuspend these Device ")} ${devices.map(item => ` ${item.device_id}`)}?`,
            title: `${convertToLang(this.props.translation[""], "Would you like to unsuspend Devices")} ?`,
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: () => {
                this.props.bulkActivateDevice(data);
            },
            onCancel() { },
        });
    }

    render() {
        return (null);
    }

}
