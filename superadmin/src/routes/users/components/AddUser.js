import React, { Component } from 'react';
import { Modal, message } from 'antd';
import AddUserForm from './AdduserForm';

export default class AddUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            handleSubmit: null,
            user: null,
            titleText: ''
        }
    }



    showModal = (handleSubmit, user = null, titleText = 'Add User') => {
        // console.log(user);
        this.setState({
            visible: true,
            handleSubmit: handleSubmit,
            user: user,
            titleText: titleText,
        });

    }
    handleCancel = () => {
        this.refs.add_user_form.resetFields();
        this.setState({ visible: false });
    }
    render() {
        const { visible, loading } = this.state;
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
                >
                    <AddUserForm
                        AddUserHandler={this.state.handleSubmit}
                        handleCancel={this.handleCancel}
                        user={this.state.user}
                        ref='add_user_form'
                    />
                </Modal>
            </div>
        )

    }
}
