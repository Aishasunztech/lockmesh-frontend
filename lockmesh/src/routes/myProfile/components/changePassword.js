import React, { Component } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { Button_submit, Button_Cancel } from '../../../constants/ButtonConstants';
import { convertToLang } from '../../utils/commonUtils';
import { ENTER_NEW_PASSWORD, ENTER_CURRENT_PASSWORD, CONFIRM_NEW_PASSWORD, CURRENT_PASSWORD, CONFIRM_PASSWORD, NEW_PASSWORD } from '../../../constants/Constants';
import { CHANGE_PASSWORD } from '../../../constants/ActionTypes';
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
            curntpwd: '',
            newpwd: '',

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
        if (this.state.newPassword && this.state.newPassword.length >= 6) {
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
                    title={convertToLang(this.props.translation[CHANGE_PASSWORD], "Change Password")}
                    onOk={this.handleOk}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleSubmit} disabled={(this.state.newPassword && this.state.newPassword.length >= 6) ? false : true}>
                            {convertToLang(this.props.translation[Button_submit], "Submit")}
                        </Button>,
                    ]}
                >

                    <Form >

                        <Form.Item
                            label={convertToLang(this.props.translation[CURRENT_PASSWORD], "Current Password ")}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 12 }}
                        >

                            <Input.Password type='password' autoComplete="new-password" value={this.state.curntpwd} onChange={(event) => this.setState({ curntpwd: event.target.value })} placeholder={convertToLang(this.props.translation[ENTER_CURRENT_PASSWORD], "Enter Current Password")} />

                        </Form.Item>

                        <Form.Item
                            label={convertToLang(this.props.translation[NEW_PASSWORD], "New Password ")}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 12 }}
                            validateStatus={this.state.status}
                            help={this.state.help}

                        >
                            <Input.Password type='password' autoComplete="new-password" placeholder={convertToLang(this.props.translation[ENTER_NEW_PASSWORD], "Enter New Password")} value={this.state.newPassword} onChange={(event) => this.setState({ newPassword: event.target.value })} />

                        </Form.Item>

                        <Form.Item
                            label={convertToLang(this.props.translation[CONFIRM_PASSWORD], "Confirm Password ")}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 12 }}
                            validateStatus={this.state.status}
                            help={this.state.help}

                        >
                            <Input.Password type='password' autoComplete="new-password" placeholder={convertToLang(this.props.translation[CONFIRM_NEW_PASSWORD], "Confirm New Password")} value={this.state.confirmPassword} onChange={(event) => this.setState({ confirmPassword: event.target.value })} />

                        </Form.Item>

                    </Form>
                </Modal>
            </div>
        )
    }
}