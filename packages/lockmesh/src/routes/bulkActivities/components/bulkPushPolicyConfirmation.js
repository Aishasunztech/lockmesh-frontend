import { Modal, Button } from 'antd';

import React, { Component } from 'react'
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { DO_YOU_WANT_TO_APPLY } from '../../../constants/DeviceConstants';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';

export default class BulkPushPolicy extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm
    }

    handleBulkPolicy = (devices, dealers, users, selectedPolicy) => {

        let device_ids = [];
        let dealer_ids = [];
        let user_ids = [];

        checkIsArray(devices).forEach((item) => {
            if (item.usr_device_id) {
                device_ids.push({ device_id: item.device_id, usrAccId: item.id, usr_device_id: item.usr_device_id });
            }
        });
        checkIsArray(dealers).forEach((item) => {
            dealer_ids.push(item.key);
        });
        checkIsArray(users).forEach((item) => {
            user_ids.push(item.key);
        });

        let data = {
            selectedDevices: device_ids,
            dealer_ids,
            user_ids,
            policyId: selectedPolicy.id
        }

        if (selectedPolicy && selectedPolicy.policy_name) {

            this.confirm({
                // title: `${convertToLang(this.props.translation[DO_YOU_WANT_TO_APPLY], "Do you want to apply")} # ${selectedPolicy.policy_name} ${convertToLang(this.props.translation[""], "policy on these devices ")} ${devices.map(item => ` ${item.device_id}`)} ?`,
                title: `${convertToLang(this.props.translation[DO_YOU_WANT_TO_APPLY], "Do you want to apply")} # ${selectedPolicy.policy_name} ${convertToLang(this.props.translation[""], "policy on selected devices")} ?`,
                content: '',
                okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
                cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
                onOk: () => {
                    this.props.bulkApplyPolicy(data);
                },
                onCancel() { },
            });
        } else {
            Modal.error({
                title: 'Policy not selected to push on your selected devices. Please select policy to performe an action.',
            });
        }
    }

    render() {
        return (null);
    }
}
