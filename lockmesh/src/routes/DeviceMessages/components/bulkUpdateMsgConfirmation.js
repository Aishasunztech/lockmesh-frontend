import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';


export default class BulkUpdateMsg extends Component {

    constructor(props) {
        super(props)
        this.confirm = Modal.confirm;
    }

    handleBulkUpdateMsg = (data, devices, dealerTZ) => {

        this.confirm({
            title: `${convertToLang(this.props.translation[""], "Are you sure, you want to update bulk message setting ?")}`,
            content: '',
            okText: convertToLang(this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                this.props.updateBulkMsgAction(data, devices, dealerTZ);
                this.props.handleCancel();
            }),
            onCancel() { },
        });

    }

    render() {
        return (null);
    }

}
