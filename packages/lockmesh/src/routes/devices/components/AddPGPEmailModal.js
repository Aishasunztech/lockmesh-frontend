import React, { Component } from 'react'
import { Modal, message, Form, Select, Input, Button, Icon, Divider } from 'antd';

import { convertToLang } from '../../utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Add_User } from '../../../constants/ButtonConstants';
import Axios from 'axios';
import { BASE_URL } from '../../../constants/Application';
import RestService from '../../../appRedux/services/RestServices';

class AddPGPEmailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            titleText: '',
            domainList: [],
            previewMail: '',
            randomUserNameLoading: false,
            username: '',
            domain: '',
            randomUsername: ''
        }
    }

    showModal = (titleText = convertToLang(this.props.translation[''], "Add PGP Email")) => {
        // console.log(user);
        this.setState({
            visible: true,
            titleText: titleText,
        });
        this.props.getDomains(false);

    }

    handleCancel = () => {
        this.props.form.resetFields()
        this.setState({
            // domainList: [],
            previewMail: '',
            randomUserNameLoading: false,
            username: '',
            domain: '',
            randomUsername: '',
            visible: false
        });
    }

    componentDidMount() {
        this.setState({
            domainList: this.props.domainList
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.domainList.length !== nextProps.domainList.length) {
            this.setState({
                domainList: nextProps.domainList
            })
        }
    }

    renderDomainOptions = () => {
        return this.state.domainList.map((domain) => {
            return <Select.Option key={domain.id} value={domain.name}>{domain.name}</Select.Option>
        })

    }
    checkUsername = (rule, value, callback) => {
        if (!value || !value.length) {
            let previewMail = ''
            if (this.state.domain) {
                previewMail = '@' + this.state.domain
            }
            this.props.form.setFieldsValue({ 'username': "" })
            this.props.form.setFieldsValue({ 'pgp_email': previewMail })
            callback();
        }
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value + '@gmail.com')) {
            // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value + '@gmail.com')) {
            callback();
            let previewMail = value + '@' + this.state.domain
            // console.log(previewMail);
            this.setState({
                username: value,
                previewMail: previewMail
            })
            this.props.form.setFieldsValue({ 'username': value })
            this.props.form.setFieldsValue({ 'pgp_email': previewMail })
        } else {
            callback('Please insert a valid Username.');
            // console.log(value);
        }
    }

    changeDomain = (value) => {

        // console.log(value);

        let previewMail = this.state.username + '@' + value
        this.setState({
            domain: value,
            previewMail: previewMail
        })
        this.props.form.setFieldsValue({ 'domain': value })
        this.props.form.setFieldsValue({ 'pgp_email': previewMail })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                generatePgp(this, values);
            }
        });
    }

    generateRandomUsername() {
        this.setState({
            randomUserNameLoading: true
        })
        let _this = this
        RestService.generateRandomUsername().then(function (response) {
            if (response.data.status) {
                let previewMail = response.data.username + '@' + _this.state.domain
                _this.setState({
                    randomUserNameLoading: false,
                    username: response.data.username,
                    previewMail: previewMail,
                    randomUsername: response.data.username,
                })
                _this.props.form.setFieldsValue({ 'username': response.data.username })
                _this.props.form.setFieldsValue({ 'pgp_email': previewMail })
            } else {
                _this.setState({
                    randomUserNameLoading: false
                })
            }
        })
    }
    checkUniquePgpEmail = (rule, value, callback) => {
        console.log("Hello there");
        // if (this.state.randomUsername !== this.state.username && this.state.domain) {
        //     RestService.checkUniquePgpEmail(value).then(function (response) {
        //         if (response.data.status) {
        //             if (response.data.available) {
        //                 callback()
        //             } else {
        //                 callback("ERROR: Username not available")
        //             }
        //         } else {
        //             callback(response.data.msg)
        //         }
        //     })
        // } else {
        //     callback()
        // }
    }

    render() {
        const { visible, loading } = this.state;
        const formItemLayout = {
        };
        // const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        // const usernameError = isFieldTouched('username') && getFieldError('username');

        return (

            <Modal
                visible={visible}
                title={this.state.titleText}
                maskClosable={false}
                destroyOnClose={true}
                onCancel={this.handleCancel}
                footer={[
                    <Button
                        key="back"
                        onClick={this.handleCancel}
                    >
                        Close
                        {/* {convertToLang(this.props.translation[Button_Cancel], "Cancel")} */}
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={this.handleSubmit}
                    >
                        {convertToLang(this.props.translation[''], "Create Email")}
                    </Button>,
                ]}
                className="edit_form"
                cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
            >

                <Form
                    {
                    ...formItemLayout
                    }
                >
                    <Form.Item
                        label="Username"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    // validateStatus={usernameError ? 'error' : ''} 
                    // help={usernameError || ''}
                    >
                        {this.props.form.getFieldDecorator('username', {
                            initialValue: this.state.username,
                            rules: [{
                                required: true, message: 'Please enter a username.',
                            },
                            {
                                validator: this.checkUsername,
                            }
                            ],
                        })(
                            <Input
                                style={{ width: '60%' }}
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username"
                            />,
                        )}

                        <Button
                            className="add_user_btn"
                            type="primary"
                            style={{ width: "35%", marginLeft: 10 }}
                            onClick={() => this.generateRandomUsername()}
                            loading={this.state.randomUserNameLoading}
                        >
                            {convertToLang(this.props.translation[""], "Random")}
                        </Button>
                    </Form.Item>
                    <Form.Item
                        label="Select Domain"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('domain', {
                            initialValue: this.state.domain,
                            rules: [{
                                required: true,
                                message: 'Please select a domain!'
                            }],
                        })(
                            <Select placeholder="Please select a domain" onChange={this.changeDomain}>
                                {this.renderDomainOptions()}
                            </Select>,
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Preview"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('pgp_email', {
                            initialValue: this.state.previewMail,
                            rules: [
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email.'
                                },
                                // {
                                //     validator: this.checkUniquePgpEmail
                                // }
                            ],
                            // trigger: this.checkUniquePgpEmail
                        })(
                            <Input disabled />
                        )}
                    </Form.Item>

                </Form>
            </Modal>

        )

    }
}

export default Form.create({ name: 'addPGPEmail' })(AddPGPEmailModal);


function generatePgp(_this, values) {
    let pgp_email = values.username + '@' + values.domain
    RestService.checkUniquePgpEmail(pgp_email).then(function (response) {
        if (response.data.status) {
            if (response.data.available) {
                let domain_data = _this.state.domainList.find((item) => item.name == values.domain)
                let payload = {
                    type: 'pgp_email',
                    auto_generated: false,
                    product_data: {
                        domain: values.domain,
                        username: '',
                        domain_id: domain_data.id
                    }
                };

                // if (!values.username) {
                //     payload.auto_generated = true
                // } else {
                payload.product_data.username = values.username
                payload.user_acc_id = _this.props.device ? _this.props.device.id : null
                payload.dealer_id = _this.props.device ? _this.props.device.dealer_id : null
                // }
                _this.props.addProduct(payload);
                _this.props.form.resetFields()
                _this.setState({
                    visible: false,
                    titleText: '',
                    previewMail: '',
                    randomUserNameLoading: false,
                    username: '',
                    domain: '',
                    randomUsername: ''
                })
            }
            else {
                _this.props.form.setFields({
                    pgp_email: {
                        value: values.pgp_email,
                        errors: [new Error('Pgp email not available.')],
                    },
                });
            }
        } else {
            _this.props.form.setFields({
                pgp_email: {
                    value: values.pgp_email,
                    errors: [new Error(response.data.msg)],
                },
            });
        }
    })
}