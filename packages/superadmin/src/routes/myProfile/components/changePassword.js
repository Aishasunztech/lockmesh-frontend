import React, { Component } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
// import { BASE_URL } from "../../../constants/Application";
let token = localStorage.getItem('token');
let logo = '';
let apk = '';
let form_data = '';
let edit_func = '';
export default class ChangePassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            curntpwd:'',
            newpwd:'',

        }
    }
    

    showModal = (profile, func) => {
        // console.log('profile', this.props.profile);
        // edit_func=func;
        //  logo = app.logo;
        //  apk = app.apk;
        this.setState({
            visible: true,
            // email: profile.dealer_email,
            // dealer_id: profile.dealer_id,

        });
    }

    handleSubmit = (e) => {

        e.preventDefault();
        // console.log(this.state.newPassword);
        if (this.state.newPassword.length >= 6) {
            if ((this.state.newPassword !== this.state.confirmPassword) || (this.state.newPassword === '')) {
                this.setState({
                    status: 'error',
                    help: "Password doesn't match"
                })
            }
            else {

                this.setState({
                    status: 'success',
                    help: "",
                })
                form_data = {
                    'dealer_id': this.props.profile.dealerId,
                    'dealer_email': this.props.profile.email,
                    'newpwd': this.state.newPassword,
                    'curntpwd': this.state.curntpwd
                };
                this.props.func(form_data);

                this.handleCancel();
                // this.success();
            }
        }
        else {
            this.setState({
                status: 'error',
                help: " Atleast 6 Characters required !",
            })
        }
    }


    handleCancel = () => {
        this.setState({
            visible: false,
            newPassword: '',
            confirmPassword: '',
            curntpwd: ''
        });
    }

    render() {

        const { visible, loading } = this.state;
        const number = this.state.number;
        const tips = 'A prime is a natural number greater than ';

        return (
            <div>
                <Modal
                    visible={visible}
                    title="Change Password"
                    onOk={this.handleOk}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit}>
                            Submit
                        </Button>,
                    ]}
                >

                    <Form >

                        <Form.Item
                            label="Current Password "
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 12 }}
                        >

                            <Input type='password' autoComplete="new-password" value={this.state.curntpwd} onChange={(event) => this.setState({ curntpwd: event.target.value })} placeholder="Enter Current Password" />

                        </Form.Item>

                        <Form.Item
                            label="New Password "
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 12 }}
                            validateStatus={this.state.status}
                            help={this.state.help}

                        >
                            <Input type='password' autoComplete="new-password" placeholder="Enter New Password" value={this.state.newPassword} onChange={(event) => this.setState({ newPassword: event.target.value })} />

                        </Form.Item>

                        <Form.Item
                            label="Confirm Password "
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 12 }}
                            validateStatus={this.state.status}
                            help={this.state.help}

                        >
                            <Input type='password' autoComplete="new-password" placeholder="Confirm New Password" value={this.state.confirmPassword} onChange={(event) => this.setState({ confirmPassword: event.target.value })} />

                        </Form.Item>

                    </Form>
                </Modal>
            </div>
        )
    }
}