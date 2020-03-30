import React, { Component } from 'react';
import { Modal, message } from 'antd';
import EditForm from './editForm';
let editDevice;
export default class EditDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1
        }
    }

    showModal = (device, func) => {
        // console.log('device Detail', device)
        // alert('its working')
        editDevice = func;
        this.setState({

            device: device,
            visible: true,
            func: func,

        });

    }


    handleSubmit = (e) => {
        e.preventDefault();
        let formData = {
            'device_id': this.state.device_id,
            'sim_id': this.state.sim_id,
            'chat_id': this.state.chat_id,
            'pgp_email': this.state.pgp_email,
            's_dealer': this.state.s_dealer,
            'expiry_date': this.state.expiry_date,
            'start_date': this.state.start_date,
            'account_email': this.state.email,
            'name': this.state.name,
            'model': this.state.model,
            'sttatus': this.state.status,
            'client_id': this.state.client_id,
        }
    }

    handleCancel = () => {
        this.refs.editForm.getWrappedInstance().resetFields();
        this.setState({
            visible: false

        });
    }
    render() {
        const { visible, loading } = this.state;

        return (
            <div>

                <Modal
                    width="600px"
                    visible={visible}
                    maskClosable={false}
                    title="Edit Device"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                    maskClosable={false}
                >

                    <EditForm
                        ref='editForm'
                        device={this.state.device}
                        hideModal={this.handleCancel}
                        editDeviceFunc={this.state.func}
                        handleCancel={this.handleCancel}
                    />

                </Modal>
            </div>
        )

    }
}