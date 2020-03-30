import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Table, Button, Divider, Icon, Modal } from 'antd';
import PasswordForm from './PasswordForm';

export default class LockModal extends Component {
    // console.log('object,', props.actionType)
    constructor(props) {
        super(props)
        this.state = {
            lockModalVisible: false,
        }
    }

    toggleLockModal = () => {
        // alert('2')
        this.setState({ lockModalVisible: !this.state.lockModalVisible })
    }

    render() {
        console.log(this.state.lockModalVisible)
        return (
            <Modal
                // closable={false}
                maskClosable={false}
                style={{ top: 20 }}
                width="330px"
                className="push_app"
                title=""
                visible={this.state.lockModalVisible}
                footer={false}
                onOk={() => {
                }}
                onCancel={() => {
                    this.toggleLockModal()
                    // this.props.showPwdConfirmModal(false)
                    this.refs.pswdForm.resetFields()
                }
                }
            >
                <PasswordForm
                    verifyPassword={this.props.verifyPassword}
                    toggleLockModal={this.toggleLockModal}
                    ref='pswdForm'
                    // translation={this.props.translation}
                />
            </Modal >
        )
    }
}