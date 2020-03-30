import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';


export default class BulkSuspendDevices extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleSuspendDevice = (devices, dealers, users) => {

        let device_ids = [];
        let dealer_ids = [];
        let user_ids = [];

        checkIsArray(devices).forEach((item) => {
            device_ids.push(item.usr_device_id);
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

        // const title = `${convertToLang(this.props.translation["Are you sure, you want to suspend these devices "], "Are you sure, you want to suspend these devices ")}  ${devices.map(item => ` ${item.device_id}`)} ?`;
        const title = `${convertToLang(this.props.translation["Are you sure, you want to suspend these devices "], "Are you sure, you want to suspend selected devices")} ?`;
        this.confirm({
            title: title,
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                this.props.suspendDevice(data);
            }),
            onCancel() { },
        });

    }

    render() {
        return (null);
    }

}
