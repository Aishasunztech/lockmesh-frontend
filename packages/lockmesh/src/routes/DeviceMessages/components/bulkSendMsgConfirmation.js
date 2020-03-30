import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';


export default class BulkSendMsg extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleBulkSendMsg = (data, dealerTZ) => {
        let selectedDevices = [];
        let dealer_ids = [];
        let user_ids = [];

        checkIsArray(data.devices).forEach((item) => {
            if (item.device_id) {
                selectedDevices.push({ device_id: item.device_id, usrAccId: item.id, usr_device_id: item.usr_device_id });
            }
        });
        checkIsArray(data.dealers).forEach((item) => {
            dealer_ids.push(item.key);
        });
        checkIsArray(data.users).forEach((item) => {
            user_ids.push(item.key);
        });

        let saveData = {
            devices: selectedDevices,
            dealer_ids,
            user_ids,
            msg: data.msg,
            timer: data.timer,
            repeat: data.repeat,
            dateTime: data.dateTime,
            weekDay: data.weekDay, // 1 - 7
            monthDate: data.monthDate,// 1 - 31
            monthName: data.monthName, // for 12 months
            time: data.time
        }

        this.confirm({
            // title: `${convertToLang(this.props.translation[""], "Are you sure, you want to send message on these selected devices ")} ${selectedDevices.map(item => ` ${item.device_id}`)} ?`,
            title: `${convertToLang(this.props.translation[""], "Are you sure, you want to send message on selected devices")} ?`,
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                this.props.sendMsgOnDevices(saveData, dealerTZ);
                this.props.handleCancel();
            }),
            onCancel() { },
        });

    }

    render() {
        return (null);
    }

}
