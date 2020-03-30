import React, { Component, Fragment } from 'react';
import { Modal, message, Switch, Table, Input, Button, Form } from 'antd';
import { Required_Fields } from '../../../constants/DeviceConstants';
import { convertToLang } from '../../utils/commonUtils';
// import AddUserForm from './AdduserForm';

export default class AddSimPermission extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            handleSubmit: null,
            // user: null,
            // titleText: ''
        }
    }



    showModal = (handleSubmit) => {
        // console.log(user);
        this.setState({
            visible: true,
            handleSubmit: handleSubmit,
            // user: user,
            // titleText: titleText,
        });

    }
    handleCancel = () => {
        // this.refs.add_user_form.resetFields();
        this.setState({ visible: false });
    }
    render() {
        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    visible={visible}
                    title={"ADD SIM PERMISSIONS"}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                >
                    <WrappedAddDeviceForm />

                </Modal>
            </div>
        )

    }
}

class SimPermissionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log(err, 'form', values.name);
            if (values.name === '') {
                this.setState({
                    validateStatus: 'error',
                    help: 'Name is Required'
                })
            }
            if (!err) {


                if (/[^A-Za-z \d]/.test(values.name)) {
                    this.setState({
                        validateStatus: 'error',
                        help: 'Please insert only alphabets and numbers'
                    })
                } else {
                    this.props.AddUserHandler(values);
                    this.props.handleCancel();
                    this.handleReset();

                }
            }

        });
    }
    handleNameValidation = (event) => {
        var fieldvalue = event.target.value;

        // console.log('rest ', /[^A-Za-z \d]/.test(fieldvalue));
        // console.log('vlaue', fieldvalue)

        if (fieldvalue === '') {
            this.setState({
                validateStatus: 'error',
                help: 'Name is Required'
            })
        }
        if (/[^A-Za-z \d]/.test(fieldvalue)) {
            this.setState({
                validateStatus: 'error',
                help: 'Please insert only alphabets and numbers'
            })
        }
        else {
            this.setState({
                validateStatus: 'success',
                help: null,
            })
        }
    }


    componentDidMount() {
    }
    handleReset = () => {
        this.props.form.resetFields();
    }


    handleCancel = () => {
        this.handleReset();
        this.props.handleCancel();
    }
    handleChange = (e) => {
        this.setState({ type: e.target.value });
    }

    render() {
        //   console.log('props of coming', this.props.device);
        //  alert(this.props.device.device_id);
        const { visible, loading } = this.state;
        // console.log(this.state.type);
        return (
            <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                <p>(*)- {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                {(this.props.user) ? <Form.Item>
                    {this.props.form.getFieldDecorator('user_id', {
                        initialValue: this.props.user.user_id,
                    })(
                        <Input type='hidden' />
                    )}
                </Form.Item> : null}
                <Form.Item

                    label="Name"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    validateStatus={this.state.validateStatus}
                    help={this.state.help}
                >
                    {this.props.form.getFieldDecorator('name', {
                        initialValue: '',
                        rules: [
                            {
                                required: true, message: 'Name is Required !',
                            }
                        ],
                    })(
                        <Input onChange={(e) => this.handleNameValidation(e)} />
                    )}
                </Form.Item>
                <Form.Item

                    label="SET PERMISSIONS "
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                >
                    {this.props.form.getFieldDecorator('email', {
                        initialValue: '',
                    })(
                        <Fragment>
                            <label>Guest : </label>
                            <Switch
                                size={"small"}
                                onClick={(e) => {
                                    // props.handleChecked(e, "encrypted", app.apk_id);
                                }}
                            />
                            <label>Encrypted : </label>
                            <Switch
                                size={"small"}
                                onClick={(e) => {
                                    // props.handleChecked(e, "encrypted", app.apk_id);
                                }}
                            />
                            <label>Enable : </label>
                            <Switch
                                size={"small"}
                                onClick={(e) => {
                                    // props.handleChecked(e, "encrypted", app.apk_id);
                                }}
                            />
                        </Fragment>
                    )}
                </Form.Item>
                <Form.Item className="edit_ftr_btn"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button key="back" type="button" onClick={this.handleCancel}>Cancel</Button>
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>

            </Form>
        )

    }
}
const WrappedAddDeviceForm = Form.create()(SimPermissionForm);
