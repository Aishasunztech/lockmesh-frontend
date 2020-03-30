import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';


export default class BulkPullApps extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleBulkPullApps = (devices, dealers, users) => {
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
            apps: this.props.selectedPullAppsList,
            selectedDevices,
            dealer_ids,
            user_ids
        }

        if (this.props.selectedPullAppsList && this.props.selectedPullAppsList.length) {

            // const title = `${convertToLang(this.props.translation[""], `Are you sure, you want to pull (${this.props.selectedPullAppsList.map(item => ` ${item.apk_name}`)}) apps from these devices: `)} ${selectedDevices.map(item => ` ${item.device_id}`)} ?`;
            const title = `${convertToLang(this.props.translation[""], `Are you sure, you want to pull (${checkIsArray(this.props.selectedPullAppsList).map(item => ` ${item.apk_name}`)}) apps from selected devices`)} ?`;
            this.confirm({
                title: title,
                content: '',
                okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
                cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
                onOk: (() => {
                    this.props.applyPullApps(data);
                }),
                onCancel() { },
            });
        } else {

            Modal.error({
                title: 'Apps not selected to pull on your selected devices. Please select apps to performe an action.',
            });

        }
    }

    render() {
        return (null);
    }

}
