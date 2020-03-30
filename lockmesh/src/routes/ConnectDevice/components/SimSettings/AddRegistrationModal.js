import React, { Component } from 'react';
import { Modal, message, Spin } from 'antd';
import AddRegistrationForm from './AddRegistrationForm';
import EditRegistrationForm from './EditRegistrationForm';
import { ADD_SIM_REGISTRATION } from '../../../../constants/DeviceConstants';
import { convertToLang } from '../../../utils/commonUtils';





export default class RegisterSimModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            device: null,
            preActive: false
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleCancel = () => {
        // this.refs.add_sim_reg_form.resetFields();
        this.setState({ visible: false });
    }

    handleSubmitReg = (values) => {
        this.props.simRegister(values);
    }

    render() {
        const { visible } = this.state;
        let { simloading } = this.props;
        // console.log("simloading ", simloading)
        if (simloading) {
            let _this = this;
            setTimeout(
                function () {
                    _this.props.endLoading();
                    // console.log("call time out function")
                }
                , 10000)
        }
        return (
            <div>
                <Modal
                    maskClosable={false}
                    title={convertToLang(this.props.translation[ADD_SIM_REGISTRATION], "Add Sim Registration")}
                    // title={(this.props.unRegSims.length) ? "Add Un-Register Sim" : convertToLang(this.props.translation[ADD_SIM_REGISTRATION], "Add Sim Registration")}
                    visible={visible}
                    footer={null}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >

                    {(!this.props.simloading) ?
                        (this.props.unRegSims.length) ?
                            this.props.unRegSims.map((sim, index) => {
                                return (
                                    <EditRegistrationForm
                                        AddSimHandler={this.handleSubmitReg}
                                        handleCancel={this.handleCancel}
                                        editSim={sim}
                                        unRegSims={this.props.unRegSims}
                                        indexUnr={index}
                                        translation={this.props.translation}
                                        deviceID={this.props.deviceID}
                                        device={this.props.device}
                                        total_dvc={this.props.total_dvc}
                                    />
                                )
                            })

                            : <div style={{ textAlign: "center" }}><hr /><h4>Un-Register sims not found! </h4></div>
                        : <div style={{ textAlign: "center" }}><hr /><h4>Loading Un-Register Sims ... </h4><Spin /></div>
                    }

                    <AddRegistrationForm
                        AddSimHandler={this.handleSubmitReg}
                        handleCancel={this.handleCancel}
                        translation={this.props.translation}
                        deviceID={this.props.deviceID}
                        device={this.props.device}
                        total_dvc={this.props.total_dvc}
                        ref="add_sim_reg_form"
                    />

                </Modal >
            </div>
        )
    }
}
