import React, { Component } from 'react'
import { Button, Form, Icon, Input, message } from "antd";
import { Redirect, Route } from "react-router-dom";
import CircularProgress from "components/CircularProgress/index";
import { connect } from "react-redux";

import {
    hideMessage,
    verifyCode,
    showAuthLoader,
    goToLogin
} from "../appRedux/actions/Auth";

import { APP_TITLE } from "../constants/Application";

class VerifyAuthCode extends Component {
    componentWillReceiveProps(nextProps) {
    }

    componentDidUpdate(prevProps) {
        const { authUser } = this.props;


        if (authUser.id != null && authUser.email != null && authUser.token != null && authUser.type != null) {
            this.props.history.push('/devices');
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, user) => {
            if (!err) {
                this.props.showAuthLoader();
                this.props.verifyCode(user);
            }
        });
    }
    validateVerificationCode = (e) => {
        e.preventDefault();
        // console.log("value", e.target.value);

    }
    goToLogin = () => {
        this.props.goToLogin();
    }
    render() {
        return (
            <div className="gx-app-login-wrap">
                <div className="gx-app-login-container">
                    <div className="gx-app-login-main-content">
                        <div className="gx-app-logo-content">
                            <div className="gx-app-logo-content-bg">
                                {/* <img src="https://via.placeholder.com/272x395" alt='Neature'/> */}
                            </div>
                            <div className="gx-app-logo-wid">

                            </div>
                            <div className="gx-app-logo">
                                <p className="mb-0" style={{ fontSize: 18 }}><Icon type='lock' /> {APP_TITLE}</p>
                                {/* <img alt="example" src={require("assets/images/logo.png")}/> */}
                            </div>
                        </div>
                        <div className="gx-app-login-content">
                            <Form onSubmit={this.handleSubmit} className="gx-signin-form gx-form-row0">

                                <Form.Item>
                                    {this.props.form.getFieldDecorator('verify_code', {
                                        initialValue: "",
                                        rules: [
                                            { required: true, message: 'Please Enter Verification Code to Proceed' },
                                            { min: 6, message: 'Verification Code must be in 6 digits' }
                                        ],
                                    })(
                                        <Input type="number" required placeholder="Verification Code" onChange={this.validateVerificationCode} />
                                    )}
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" className="gx-mb-0" htmlType="submit">
                                        Verify
                                    </Button>
                                    <Button type="primary" className="gx-mb-0" disabled onClick={() => { this.goToLogin() }}>
                                        Sign in
                                    </Button>
                                </Form.Item>

                            </Form>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
const wrappedNormalVerifyForm = Form.create()(VerifyAuthCode);

const mapStateToProps = ({ auth }) => {
    // console.log(auth);

    const { loader, alertMessage, showMessage, authUser, initURL } = auth;
    return { loader, alertMessage, showMessage, authUser, initURL }
};

export default connect(mapStateToProps, {
    verifyCode,
    goToLogin,
    showAuthLoader
})(wrappedNormalVerifyForm);