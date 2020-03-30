import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import { Markup } from 'interweave';


export default class BulkPushApps extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleBulkPushApps = (devices, dealers, users) => {
        let selectedDevices = [];
        let dealer_ids = [];
        let user_ids = [];

        checkIsArray(devices).forEach((item) => {
            if (item.device_id) {
                selectedDevices.push({ device_id: item.device_id, usrAccId: item.id, usr_device_id: item.usr_device_id });
            }
        });
        checkIsArray(dealers).forEach((item) => {
            dealer_ids.push(item.key);
        });
        checkIsArray(users).forEach((item) => {
            user_ids.push(item.key);
        });

        let data = {
            apps: this.props.selectedPushAppsList,
            selectedDevices,
            dealer_ids,
            user_ids
        }

        if (this.props.selectedPushAppsList && this.props.selectedPushAppsList.length) {
            const title =
                <Markup content={`${convertToLang(this.props.translation[""], `Are you sure, you want to push (${checkIsArray(this.props.selectedPushAppsList).map(item => ` ${item.apk_name}`)}) apps into selected devices`)} ?`} ></Markup>
                // <Markup content={`${convertToLang(this.props.translation[""], `Are you sure, you want to push (${this.props.selectedPushAppsList.map(item => ` ${item.apk_name}`)}) apps into these devices `)} ${selectedDevices.map(item => ` ${item.device_id}`)} ?`} ></Markup>
            // `${convertToLang(this.props.translation[""], `Are you sure, you want to push ${this.props.selectedPushAppsList ? <div style={{textDecoration: 'underline'}}>{this.props.selectedPushAppsList.map(item => ` ${item.apk_name}`)}</div> : "selected"} apps into these devices `)} ${selectedDevices.map(item => ` ${item.device_id}`)} ?`;

            this.confirm({
                title: title,
                content: '',
                okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
                cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
                onOk: (() => {
                    return this.props.applyPushApps(data);
                }),
                onCancel() { },
            });
        } else {

            Modal.error({
                title: 'Apps not selected to push on your selected devices. Please select apps to performe an action.',
              });

        }
    }

    render() {
        return (null);
    }

}
