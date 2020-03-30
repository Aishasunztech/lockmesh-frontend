import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Button, Form, Input, Select, InputNumber, Spin } from 'antd';
import { checkValue } from '../../utils/commonUtils'

import { getSimIDs, getChatIDs, getPGPEmails } from "../../../appRedux/actions/Devices";
import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, ADMIN
} from '../../../constants/Constants';
import AddUser from '../../users/components/AddUser';
import {
    addUser,
    getUserList
} from "../../../appRedux/actions/Users";

class EditDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            addNewUserModal: false,
            isloading: false,
            addNewUserValue: "",
        }
    }
    handleUserChange = (e) => {
        // console.log(e)
        this.setState({ addNewUserValue: e });
    }

    handleSubmit = (e) => {
        // alert('submit', this.props.editDeviceFunc);
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log("Device List", values)
                values.prevPGP = this.props.device.pgp_email;
                values.finalStatus = this.props.device.finalStatus;
                // console.log("Device Details ", values)
                this.props.editDeviceFunc(values);
                this.props.hideModal();
                this.handleReset();
                // console.log('Received values of form: ', values);
            }
        });

    }
    componentDidMount() {
        this.props.getSimIDs();
        this.props.getChatIDs();
        this.props.getPGPEmails();
        this.props.getUserList();
        // this.setState({
        //     addNewUserModal: false
        // })

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isloading) {
            this.setState({ addNewUserModal: true })
        }
        this.setState({ isloading: nextProps.isloading })
        if (this.props !== nextProps) {
            // nextProps.getSimIDs();
        }
    }
    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }
    handleReset = () => {
        this.props.form.resetFields();
    }

    get_current_date = () => {

        let day = new Date().getDay(); //Current Date
        let month = new Date().getMonth() + 1; //Current Month
        let year = new Date().getFullYear();

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = '0' + month;
        }

        var current_date = year + '/' + month + '/' + day;
        // console.log('date', current_date);
        return current_date;
    }

    handleCancelForm = () => {
        this.setState({
            visible: false,
            addNewUserModal: false,
            addNewUserValue: ''
        });
    }

    createdDate = () => {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    }

    render() {
        // console.log('props of coming', this.props.device);
        const { visible, loading, isloading, addNewUserValue } = this.state;
        const { users_list } = this.props;
        var lastObject = users_list[0]
        // console.log(this.props.user);

        return (
            <div>

                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p className="mb-4">(*)- Required Fields</p>
                    <Form.Item
                        label={(this.props.device.finalStatus !== DEVICE_PRE_ACTIVATION) ? "Device ID " : null}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('device_id', {
                            initialValue: this.props.device.device_id,
                        })(

                            <Input type={(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? 'hidden' : ''} disabled />
                        )}
                    </Form.Item>

                    {(isloading ?

                        <div className="addUserSpin">
                            <Spin />
                        </div>
                        :
                        <Fragment>
                            <Form.Item
                                label="USER ID"
                                labelCol={{ span: 8, xs: 24, md: 8, sm: 24 }}
                                wrapperCol={{ span: 10 }}
                            >


                                {this.props.form.getFieldDecorator('user_id', {
                                    initialValue: this.props.new ? "" : this.state.addNewUserModal ? lastObject.user_id : this.props.device.user_id,
                                    rules: [{
                                        required: true, message: 'User ID is Required !',
                                    }]
                                })(
                                    <Select
                                        className="pos_rel"
                                        setFieldsValue={this.state.addNewUserModal ? lastObject.user_id : addNewUserValue}
                                        showSearch
                                        placeholder="Select User ID"
                                        optionFilterProp="children"
                                        onChange={this.handleUserChange}
                                        filterOption={
                                            (input, option) => {
                                                // console.log("searching: ",input," from:", option.props);
                                                // return null;
                                                return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)
                                            }
                                        }
                                    >
                                        <Select.Option value="">Select User ID</Select.Option>
                                        {users_list.map((item, index) => {
                                            return (<Select.Option key={index} value={item.user_id}>{`${item.user_id} (${item.user_name})`}</Select.Option>)
                                        })}
                                    </Select>


                                    // {/* <Button
                                    //     type="primary"
                                    //     style={{ width: '100%' }}
                                    //     onClick={() => this.handleUserModal()}
                                    // >
                                    //     Add User
                                    // </Button> */}
                                )}
                                {(this.props.user.type === ADMIN) ? null :
                                    <Button
                                        className="add_user_btn"
                                        type="primary"
                                        onClick={() => this.handleUserModal()}
                                    >
                                        Add User
                                     </Button>
                                }

                            </Form.Item>

                        </Fragment>
                    )}
                    < Form.Item style={{ marginBottom: 0 }}
                    >
                        {this.props.form.getFieldDecorator('dealer_id', {
                            initialValue: this.props.device.dealer_id,
                        })(

                            <Input type='hidden' disabled />
                        )}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}
                    >
                        {this.props.form.getFieldDecorator('usr_device_id', {
                            initialValue: this.props.new ? "" : this.props.device.usr_device_id,
                        })(

                            <Input type='hidden' disabled />
                        )}
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}
                    >
                        {this.props.form.getFieldDecorator('usr_acc_id', {
                            initialValue: this.props.new ? "" : this.props.device.id,
                        })(

                            <Input type='hidden' disabled />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="PGP Email "
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        showSearch
                    >
                        {this.props.form.getFieldDecorator('pgp_email', {
                            initialValue: this.props.device.pgp_email,
                            rules: [{
                                type: 'email', message: 'The input is not valid E-mail!',
                            }],
                        })(
                            <Select
                                showSearch
                                placeholder="Select PGP Emails"
                                optionFilterProp="children"
                                // onChange={handleChange}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value="">Select PGP Email</Select.Option>
                                {this.props.pgp_emails.map((pgp_email) => {
                                    return (<Select.Option key={pgp_email.id} value={pgp_email.pgp_email}>{pgp_email.pgp_email}</Select.Option>)
                                })}
                            </Select>
                            // <Input disabled />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="Client ID "
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('client_id', {

                            initialValue: checkValue(this.props.device.client_id),
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="Chat ID"
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        showSearch
                    >
                        {this.props.form.getFieldDecorator('chat_id', {
                            initialValue: this.props.device.chat_id,
                        })(
                            // <Input />
                            <Select
                                showSearch
                                placeholder="Select Chat ID"
                                optionFilterProp="children"
                                // onChange={handleChange}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value="">Select Chat ID</Select.Option>
                                {this.props.chat_ids.map((chat_id, index) => {
                                    return (<Select.Option key={index} value={chat_id.chat_id}>{chat_id.chat_id}</Select.Option>)
                                })}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Sim ID "
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        showSearch
                    >
                        {this.props.form.getFieldDecorator('sim_id', {
                            initialValue: this.props.device.sim_id,
                        })(
                            <Select
                                showSearch
                                placeholder="Select Sim ID"
                                optionFilterProp="children"
                                // onChange={handleChange}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value="">Select Sim ID</Select.Option>
                                {this.props.sim_ids.map((sim_id, index) => {
                                    return (<Select.Option key={index} value={sim_id.sim_id}>{sim_id.sim_id}</Select.Option>)
                                })}
                            </Select>,
                        )}
                    </Form.Item>
                    {(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? null :
                        <Form.Item
                            label="Model"
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('model', {
                                initialValue: checkValue(this.props.device.model),
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    }
                    <Form.Item
                        label="Start Date "
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('start_date', {
                            initialValue: (this.props.device.start_date) ? this.props.device.start_date : this.createdDate()
                        })(

                            <Input disabled />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="Expiry Date "
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('expiry_date', {
                            initialValue: this.props.device.expiry_date,
                            rules: [{
                                required: true, message: 'Expiry Date is Required !',
                            }],
                        })(
                            <Select
                                style={{ width: '100%' }}
                            >
                                {(this.props.device.finalStatus === DEVICE_TRIAL || this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? <Select.Option value={0}>Trial (7 days)</Select.Option> : null}
                                {(this.props.device.finalStatus !== DEVICE_TRIAL) ? <Select.Option value={1}>1 Month</Select.Option> : null}
                                {(this.props.device.finalStatus !== DEVICE_TRIAL) ? <Select.Option value={3}>3 Months</Select.Option> : null}
                                {(this.props.device.finalStatus !== DEVICE_TRIAL) ? <Select.Option value={6}>6 Months</Select.Option> : null}
                                {(this.props.device.finalStatus !== DEVICE_TRIAL) ? <Select.Option value={12}>12 Months</Select.Option> : null}
                            </Select>
                        )}

                    </Form.Item>

                    {(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ?
                        <Fragment>

                            <Form.Item
                                label="NOTE"
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                {this.props.form.getFieldDecorator('note', {
                                    initialValue: this.props.device.note,
                                })(
                                    <Input />
                                )}

                            </Form.Item>
                            <Form.Item
                                label="VALID FOR(DAYS)"
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                {this.props.form.getFieldDecorator('validity', {
                                    initialValue: this.props.device.validity,
                                    rules: [{
                                        required: true, message: 'Valid days required',
                                    }],
                                })(
                                    <InputNumber min={1} />
                                )}

                            </Form.Item>

                        </Fragment>
                        :
                        <Fragment>
                            {/* <Form.Item
                                label="Dealer Pin "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                <Input value={this.props.device.link_code} disabled />

                            </Form.Item>

                            <Form.Item
                                label="IMEI 1 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >

                                <Input type='text' value={this.props.device.imei} disabled />

                            </Form.Item>
                            <Form.Item
                                label="SIM 1 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                <Input value={this.props.device.simno} disabled />

                            </Form.Item>
                            <Form.Item
                                label="IMEI 2 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >

                                <Input value={this.props.device.imei2} disabled />

                            </Form.Item>
                            <Form.Item
                                label="SIM 2 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                <Input value={this.props.device.simno2} disabled />

                            </Form.Item> */}
                        </Fragment>

                    }

                    <Form.Item className="edit_ftr_btn11"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button key="back" type="button" onClick={() => { this.props.handleCancel(); this.handleCancelForm() }} >Cancel</Button>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>

                </Form>
                <AddUser ref="add_user" />
            </div >

        )

    }
}

const WrappedEditDeviceForm = Form.create({ name: 'register' })(EditDevice);
// export default WrappedRegistrationForm;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getDeviceDetails: getDeviceDetails,
        // importCSV: importCSV
        getSimIDs: getSimIDs,
        getChatIDs: getChatIDs,
        getPGPEmails: getPGPEmails,
        getUserList: getUserList,
        addUser: addUser,
    }, dispatch);
}
var mapStateToProps = ({ routing, devices, users, auth }) => {
    // console.log("sdfsaf", devices);

    return {
        user: auth.authUser,
        routing: routing,
        sim_ids: devices.sim_ids,
        chat_ids: devices.chat_ids,
        pgp_emails: devices.pgp_emails,
        users_list: users.users_list,
        isloading: users.addUserFlag
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(WrappedEditDeviceForm);