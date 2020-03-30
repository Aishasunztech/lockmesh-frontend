import React, { Component } from 'react';
import { Modal, message } from 'antd';
import AddSimForm from './AddSimForm';
import { convertToLang } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Add_User } from '../../../constants/ButtonConstants';

export default class AddSim extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            handleSubmit: null,
            titleText: ''
        }
    }



    showModal = () => {
        // console.log(user);
        this.setState({
            visible: true,
        });

    }

    handleCancel = () => {
        this.refs.add_sim_form.getWrappedInstance().resetFields();
        this.setState({ visible: false });
    }

    render() {
        const { visible, loading } = this.state;
        // console.log(this.props.);
        return (
            <div>
                <Modal
                    visible={visible}
                    title={this.state.titleText}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                    destroyOnClose={true}
                    okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <AddSimForm
                        handleCancel={this.handleCancel}
                        ref='add_sim_form'
                        translation={this.props.translation}
                        wrappedComponentRef={(form) => this.addSimForm = form}
                        history={this.props.history}

                    />
                </Modal>
            </div>
        )

    }
}
