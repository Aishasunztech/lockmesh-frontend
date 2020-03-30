import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';


export default class BulkUnlink extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleBulkUnlink = (devices, dealers, users) => {
        let selectedDevices = [];
        let dealer_ids = [];
        let user_ids = [];

        checkIsArray(devices).forEach((item) => {
            selectedDevices.push({ device_id: item.device_id, usrAccId: item.id, usr_device_id: item.usr_device_id });
        });
        checkIsArray(dealers).forEach((item) => {
            dealer_ids.push(item.key);
        });
        checkIsArray(users).forEach((item) => {
            user_ids.push(item.key);
        });

        let data = {
            selectedDevices: JSON.stringify(devices),
            dealer_ids,
            user_ids
        }

        // const title = `${convertToLang(this.props.translation[""], "Are you sure, you want to unlink these selected devices ")} ${selectedDevices.map(item => ` ${item.device_id}`)} ?`;
        const title = `${convertToLang(this.props.translation[""], "Are you sure, you want to unlink selected devices")} ?`;
        this.confirm({
            title: title,
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                this.props.unlinkBulkDevices(data);
            }),
            onCancel() { },
        });

    }

    render() {
        return (null);
    }

}
