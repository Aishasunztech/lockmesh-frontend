import React, { Component } from 'react';
import { Modal, message } from 'antd';
import EditRegistrationForm from './EditRegistrationForm';
import { EDIT_REGISTERED_SIM } from '../../../../constants/DeviceConstants';
import { convertToLang } from '../../../utils/commonUtils';



export default class EditModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            device: null,
            preActive: false,
            editSim: ''
        }
    }


    showModal = (sim) => {
        this.setState({
            visible: true,
            editSim: sim
        });

    }

    handleCancel = () => {
        this.refs.edit_sim_reg_form.resetFields();
        this.setState({ visible: false });
    }

    handleSubmitReg = (values) => {
        // console.log('update data is: ', values)
        this.props.handleSimUpdate({ obj: values });
    }

    render() {
        const { visible } = this.state;
        return (
            <div>
                <Modal
                    maskClosable={false}
                    title={convertToLang(this.props.translation[EDIT_REGISTERED_SIM], "Edit Registered Sim")}
                    visible={visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <EditRegistrationForm
                        AddSimHandler={this.handleSubmitReg}
                        handleCancel={this.handleCancel}
                        editSim={this.state.editSim}
                        translation={this.props.translation}
                        deviceID={this.props.deviceID}
                        device={this.props.device}
                        total_dvc={this.props.total_dvc}
                        ref="edit_sim_reg_form"
                    />
                </Modal >
            </div >
        )
    }
}
