import React, { Component, Fragment } from 'react'
import { Button, Form, Input, Modal } from "antd";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
    submitPassword
} from "../../../appRedux/actions/ConnectDevice"
import styles from "./password.css";
import { convertToLang } from '../../utils/commonUtils';
import { ONLY_NUMBER_ARE_ALLOWED, PASSWORDS_ARE_INCONSISTENT, PLEASE_INPUT_YOUR_PASSWORD, Password_TEXT, PLEASE_CONFIRM_YOUR_PASSWORD, PASSWORD_AGAIN, SET_PASSWORD } from '../../../constants/DeviceConstants';
import { DURESS_PASSWORD, ENCRYPTED_PASSWORD } from '../../../constants/Constants';
import { Button_passwordreset } from '../../../constants/ButtonConstants';
import { GUEST_PASSWORD } from '../../../constants/ActionTypes';

const confirm = Modal.confirm

class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pwdType: '',
            setPasswordFor: ''
        }
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
            },
            style: {
                marginTop: "8px"
            }
        };
    }
    componentDidMount() {
        this.setState({
            pwdType: this.props.pwdType,
            setPasswordFor: this.props.pwdType === ENCRYPTED_PASSWORD ? "ENCRYPTED PASSWORD" : (this.props.pwdType === GUEST_PASSWORD) ? "GUEST PASSWORD" : (this.props.pwdType === DURESS_PASSWORD) ? "RESET DURESS PASSWORD" : "ADMIN PANEL CODE"
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                pwdType: this.props.pwdType,
                setPasswordFor: this.props.pwdType === ENCRYPTED_PASSWORD ? "ENCRYPTED PASSWORD" : (this.props.pwdType === GUEST_PASSWORD) ? "GUEST PASSWORD" : (this.props.pwdType === DURESS_PASSWORD) ? "RESET DURESS PASSWORD" : "ADMIN PANEL CODE"

            });
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {

            if (!err) {
                // let _this = this
                // let setPasswordFor = _this.state.pwdType === ENCRYPTED_PASSWORD ? "ENCRYPTED PASSWORD" : (_this.state.pwdType === GUEST_PASSWORD) ? "GUEST PASSWORD" : "ADMIN PANEL CODE"
                showConfirm(this, values)
            }
        });
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if ((value !== undefined) && value.length > 0 && !(/^[0-9]*$/.test(value))) { // !Number(value)){
            // form.validateFields(['pwd'], {force:true});
            callback(convertToLang(this.props.translation[ONLY_NUMBER_ARE_ALLOWED], "Only Number are allowed"));
        }

        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });

        }
        callback();
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if ((value !== undefined) && value.length > 0 && !(/^[0-9]*$/.test(value))) {
            // form.validateFields(['pwd'], {force:true});
            callback(convertToLang(this.props.translation[ONLY_NUMBER_ARE_ALLOWED], "Only Number are allowed"));
        }
        if (value && value !== form.getFieldValue('pwd')) {
            callback(convertToLang(this.props.translation[PASSWORDS_ARE_INCONSISTENT], "Passwords are inconsistent!"));
        } else {
            callback();
        }
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    render() {
        return (
            <div style={{ textAlign: "center", marginTop: '40px' }}>
                <h3>{this.state.setPasswordFor}</h3>
                <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="new-password">
                    {(this.state.pwdType !== DURESS_PASSWORD) ?
                        <Fragment>
                            <Form.Item {...this.formItemLayout}>
                                {
                                    this.props.form.getFieldDecorator('pwd', {
                                        rules: [
                                            {
                                                required: true, message: convertToLang(this.props.translation[PLEASE_INPUT_YOUR_PASSWORD], "Please input your password!"),
                                            }, {
                                                validator: this.validateToNextPassword,
                                            }
                                        ],
                                    })(

                                        <Input.Password placeholder={convertToLang(this.props.translation[Password_TEXT], "Password")} type="password" pattern="^[0-9]*$" style={{ width: '100%' }} />
                                    )
                                }
                            </Form.Item>

                            <Form.Item {...this.formItemLayout} className="pwdinput" >
                                {
                                    this.props.form.getFieldDecorator('confirm', {
                                        rules: [
                                            {
                                                required: true, message: convertToLang(this.props.translation[PLEASE_CONFIRM_YOUR_PASSWORD], "Please confirm your password!"),
                                            }, {
                                                validator: this.compareToFirstPassword,
                                            }
                                        ],
                                    })(
                                        <Input.Password type="password" pattern="^[0-9]*$" placeholder={convertToLang(this.props.translation[PASSWORD_AGAIN], "Password Again")} onBlur={this.handleConfirmBlur} style={{ width: '100%' }} />
                                    )
                                }
                            </Form.Item>
                            <Form.Item {...this.formItemLayout} className="pwdinput">
                                <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}> {convertToLang(this.props.translation[SET_PASSWORD], "Set Password")}</Button>
                            </Form.Item>
                        </Fragment>
                        :
                        <Form.Item {...this.formItemLayout} className="pwdinput">
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}> {convertToLang(this.props.translation[""], "Reset Duress Password")}</Button>
                        </Form.Item>

                    }


                </Form>
            </div>
        )
    }
}

function showConfirm (_this,values){
    confirm({
        title: (_this.state.pwdType === DURESS_PASSWORD) ? "Do you really want to RESET DURESS PASSWORD ? " : "Do you really want to change your " + _this.state.setPasswordFor + " ?",
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
            _this.props.form.resetFields();
            if (_this.state.pwdType === DURESS_PASSWORD) {
                console.log(_this.props.device_details, ' kj')
                _this.props.submitPassword({ pwd: 'clear', confirm: 'clear' }, _this.state.pwdType, _this.props.device_details.device_id, _this.props.device_details.id);
            } else {
                _this.props.submitPassword(values, _this.state.pwdType,  _this.props.device_details.device_id, _this.props.device_details.id);
            }
        }
    })
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        submitPassword: submitPassword
    }, dispatch);
}

var mapStateToProps = ({ device_details, settings }) => {

    return {
        translation: settings.translation
    };
}

const wrappedPasswordForm = Form.create()(Password)
export default connect(mapStateToProps, mapDispatchToProps)(wrappedPasswordForm);