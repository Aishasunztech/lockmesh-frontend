import { Modal } from 'antd';

import React, { Component } from 'react'
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel } from '../../../constants/ButtonConstants';
import PasswordForm from './PasswordForm';

class WipePasswordModal extends Component {
    render() {
        return (
            <Modal
                maskClosable={false}
                style={{ top: 20 }}
                width="330px"
                className="push_app"
                title=""
                visible={this.props.pwdConfirmModal}
                footer={false}
                onOk={() => {
                }}
                onCancel={() => {
                    this.props.showWipePwdConfirmModal(false)
                    this.refs.pswdForm.resetFields()
                }
                }
            >
                <PasswordForm
                    checkPass={this.props.checkPass}
                    setWipePass={this.props.setWipePass}
                    actionType='back_up'
                    handleCancel={this.props.showWipePwdConfirmModal}
                    ref='pswdForm'
                    wipeBulkDevices={this.props.wipeBulkDevices}
                    wipeData={this.props.wipeData}
                    translation={this.props.translation}
                    wipePassMsg={this.props.wipePassMsg}
                    pwdConfirmModal={this.props.pwdConfirmModal}
                />
            </Modal >
        )
    }
}

class BulkWipe extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pwdConfirmModal: false,
            bulkWipePassModal: false,
            wipe_data: ''
        }
        this.confirm = Modal.confirm;
    }

    componentDidUpdate(prevProps) {
        if (this.props.bulkWipePassModal !== prevProps.bulkWipePassModal) {
            this.setState({ bulkWipePassModal: this.props.bulkWipePassModal })
        }
    }

    handleBulkWipe = (devices, dealers, users) => {
        let selectedDevices = [];
        let dealer_ids = [];
        let user_ids = [];

        checkIsArray(devices).forEach((item) => {
            selectedDevices.push(item.usr_device_id);
        });
        checkIsArray(dealers).forEach((item) => {
            dealer_ids.push(item.key);
        });
        checkIsArray(users).forEach((item) => {
            user_ids.push(item.key);
        });

        let data = {
            selectedDevices,
            dealer_ids,
            user_ids
        }

        // const title = `${convertToLang(this.props.translation[""], "Are you sure, you want to wipe these selected devices ")} ${devices.map(item => ` ${item.device_id}`)} ?`;
        const title = `${convertToLang(this.props.translation[""], "Are you sure, you want to wipe selected devices")} ?`;
        let _this = this;
        this.confirm({
            title: title,
            content: '',
            okText: convertToLang(_this.props.translation[Button_Ok], "Ok"),
            cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
            onOk: (() => {
                _this.props.handleWipePwdConfirmModal(true);
                _this.setState({ wipe_data: data })
            }),
            onCancel() { },
        });

    }

    setWipePass = (value) => {
        // console.log("wipe pass: ", value);
        this.setState({ wipePass: value });
    }

    render() {
        return (
            <div>
                <WipePasswordModal
                    translation={this.props.translation}
                    pwdConfirmModal={this.state.bulkWipePassModal}
                    showWipePwdConfirmModal={this.props.handleWipePwdConfirmModal}
                    setWipePass={this.setWipePass}
                    wipeBulkDevices={this.props.wipeBulkDevices}
                    wipeData={this.state.wipe_data}
                    translation={this.props.translation}
                    wipePassMsg={this.props.wipePassMsg}
                />
            </div>
        )
    }

}

export default BulkWipe;