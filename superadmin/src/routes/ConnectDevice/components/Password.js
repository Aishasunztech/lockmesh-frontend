import React, { Component } from 'react'
import { Button, Form, Input } from "antd";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { 
    submitPassword
} from "../../../appRedux/actions/ConnectDevice"
import styles from "./password.css";


class Password extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pwdType: ''
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
            style:{
                marginTop:"8px"
            }
        };
    }
    componentDidMount() {
        this.setState({
            pwdType: this.props.pwdType
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                pwdType: this.props.pwdType
            });
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
    
            if (!err) {
                this.props.submitPassword(values, this.state.pwdType);
            }
        });
    }
    
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if((value!==undefined) && value.length>0 && !Number(value)){
            // form.validateFields(['pwd'], {force:true});
            callback("Only Number are allowed");
        }

        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
            
        }
        callback();
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if((value!==undefined) && value.length>0 && !Number(value)){
            // form.validateFields(['pwd'], {force:true});
            callback("Only Number are allowed");
        }
        if (value && value !== form.getFieldValue('pwd')) {
            callback('passwords are inconsistent!');
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
            <Form onSubmit={this.handleSubmit} className="login-form" autoComplete="new-password">
                <Form.Item {...this.formItemLayout}>
                    {
                        this.props.form.getFieldDecorator('pwd', {
                            rules: [
                                {
                                    required: true, message: 'Please input your password!',
                                }, {
                                    validator: this.validateToNextPassword,
                                }
                            ],
                        })(

                            <Input.Password placeholder="Password" type="password" style={{ width: '100%' }} />
                        )
                    }
                </Form.Item>

                <Form.Item {...this.formItemLayout} className="pwdinput" >
                    {
                        this.props.form.getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true, message: 'Please confirm your password!',
                                }, {
                                    validator: this.compareToFirstPassword,
                                }
                            ],
                        })(
                            <Input.Password type="password" placeholder="Password Again" onBlur={this.handleConfirmBlur} style={{ width: '100%' }} />
                        )
                    }
                </Form.Item>

                <Form.Item {...this.formItemLayout} className="pwdinput">
                    <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>Set Password</Button>
                </Form.Item>
            </Form>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        submitPassword: submitPassword
    }, dispatch);
}
var mapStateToProps = ({ device_details }) => {

    return {

    };
}

const wrappedPasswordForm = Form.create()(Password)
export default connect(mapStateToProps, mapDispatchToProps)(wrappedPasswordForm);