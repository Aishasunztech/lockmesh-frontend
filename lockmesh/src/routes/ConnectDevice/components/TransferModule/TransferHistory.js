import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Modal, message, Input, Table, Switch, Avatar, Button, Card, Row, Col, Select, Spin, Form } from 'antd';
import { componentSearch, getFormattedDate, convertToLang, checkValue, checkIsArray } from '../../../utils/commonUtils';
import Moment from 'react-moment';
import { SECURE_SETTING, DATE, PROFILE_NAME, SEARCH, ADMIN } from '../../../../constants/Constants';
import { BASE_URL } from '../../../../constants/Application';
import { PREVIOUSLY_USED_SIMS, ICC_ID, USER_ID, USER_ID_IS_REQUIRED, SELECT_USER_ID } from '../../../../constants/DeviceConstants';
import { Button_Add_User, Button_Ok, Button_Cancel, Button_submit } from '../../../../constants/ButtonConstants';
import {
    addUser,
    getUserList,
    getDeaerUsers
} from "../../../../appRedux/actions/Users";
import { getNewDevicesList } from "../../../../appRedux/actions/Common";

import {
    transferUser,
    transferHistory
} from "../../../../appRedux/actions/ConnectDevice";
import AddUser from '../../../users/components/AddUser';


var copyTransfer = [];
var status = true;
class TransferHistory extends Component {

    constructor(props) {
        super(props);
        var columns = [
            {
                title: "#",
                dataIndex: 'counter',
                align: 'center',
                className: 'row',
                render: (text, record, index) => ++index,
            },
            {
                title: "ACTION",
                dataIndex: 'action',
                align: 'center',
                className: 'row',
            },
            {
                title: <div>TRANSFERED FROM <br />(<small>DEVICE ID</small>)</div>,
                align: "center",
                dataIndex: 'transfered_from',
                key: "transfered_from",
                className: '',
                // sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: <div>TRANSFERED TO <br />(<small>DEVICE ID</small>)</div>,
                align: "center",
                dataIndex: 'transfered_to',
                key: "transfered_to",
                className: '',
                // sorter: (a, b) => { return a.transfered_to.localeCompare(b.transfered_to) },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: <div>TRANSFERED FROM <br />(<small>USER ID</small>)</div>,
                align: "center",
                dataIndex: 'user_transfered_from',
                key: "user_transfered_from",
                className: '',
                // sorter: (a, b) => { return a.user_transfered_from.localeCompare(b.user_transfered_from) },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: <div>TRANSFERED TO <br />(<small>USER ID</small>)</div>,
                align: "center",
                dataIndex: 'user_transfered_to',
                key: "user_transfered_to",
                className: '',
                // sorter: (a, b) => { return a.user_id.localeCompare(b.user_id) },
                // sortDirections: ['ascend', 'descend'],
            },

            {
                title: convertToLang(this.props.translation[DATE], "DATE"),
                align: "center",
                dataIndex: 'created_at',
                key: "created_at",
                className: '',
                sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: 'descend'
            },
        ]

        this.state = {
            visible: props.visible,
            visibleUser: false,
            HistoryList: props.transferHistoryList,
            expandedRowKeys: [],
            columns: columns,
            flagged: "Not flagged",
            // device_id: null,
            addNewUserModal: false,
            addNewUserValue: "",
            user_id: props.device.user_id,
        }
        // this.showModal = this.showModal.bind(this);
    }

    // showModal = (flagged, device_id) => {
    //     this.setState({
    //         visible: true,
    //         flagged,
    //         device_id,
    //         // HistoryList: this.props.transferHistoryList

    //     });
    // }

    handleUserChange = (e) => {
        // console.log(e)
        this.setState({ addNewUserValue: e });
    }

    componentDidMount() {
        this.props.getNewDevicesList();
        // this.props.getUserList();
        // this.props.getDeaerUsers(this.props.device.dealer_id);
        // if (this.props.device.device_id) {
            // console.log("this.props.device.device_id ", this.props.device.device_id)
            // this.props.transferHistory(this.props.device.device_id);
        // }
        this.setState({
            user_id: this.props.device.user_id
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isloading) {
            this.setState({ addNewUserModal: true })
        }
        this.setState({ isloading: nextProps.isloading })
        if (this.props !== nextProps) {
            // nextProps.getSimIDs();
        }
        if (this.props.visible != nextProps.visible) {
            this.setState({ visible: nextProps.visible })
        }

        if (this.props.getHistory != nextProps.getHistory) {
            nextProps.transferHistory(nextProps.device.device_id);
        }

        if (this.props.transferHistoryList != nextProps.transferHistoryList) {
            this.setState({
                HistoryList: nextProps.transferHistoryList
            })
        }

        // if (JSON.stringify(this.props.users_list) !== JSON.stringify(nextProps.users_list)) {
        //     this.setState({
        //         addNewUserValue: true
        //     })
        // }
    }

    handleCancel = () => {
        this.setState({ visible: false });
        this.props.handleTransferHistoryModal(false)
    }

    handleCancelUser = () => {
        this.setState({
            visibleUser: false,
            addNewUserModal: false,
            addNewUserValue: ''
        });
    }

    handleComponentSearch = (e) => {
        try {
            let value = e.target.value;
            if (value.length) {
                if (status) {
                    copyTransfer = this.state.HistoryList;
                    status = false;
                }
                let foundRecords = componentSearch(copyTransfer, value);
                if (foundRecords.length) {
                    this.setState({
                        HistoryList: foundRecords,
                    })
                } else {
                    this.setState({
                        HistoryList: [],
                    })
                }
            } else {
                status = true;
                this.setState({
                    HistoryList: copyTransfer,
                })
            }

        } catch (error) {
            console.log('error')
        }
    }

    renderList = () => {
        let data = this.state.HistoryList;
        if (data.length) {
            return data.map((row, index) => {
                // console.log(row);
                if (row.action === "Device Transfered") {
                    row.user_transfered_from = null;
                    row.user_transfered_to = null;
                } else if (row.action === "User Transfered") {
                    row.transfered_from = null;
                    row.transfered_to = null;
                }
                return {
                    key: index,
                    action: row.action,
                    transfered_from: checkValue(row.transfered_from),
                    transfered_to: checkValue(row.transfered_to),
                    user_transfered_from: checkValue(row.user_transfered_from),
                    user_transfered_to: checkValue(row.user_transfered_to),
                    created_at: checkValue(getFormattedDate(row.created_at)),
                }
            })
        }
    }

    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log("User detail", values)
                // console.log('this.props.device.user_id is: ', this.state.user_id)
                if (values.user_id !== this.state.user_id) {
                    // console.log('done')
                    this.props.transferUser({
                        NewUser: values.user_id,
                        OldUsr_device_id: this.props.device.usr_device_id,
                        OldUser: this.state.user_id
                    });
                    this.setState({
                        user_id: values.user_id
                    })
                }
                this.handleCancelUser();
                // this.handleReset();
            }
        });

    }

    checkDeviceStatus = (transfer = "Device") => {
        this.props.getNewDevicesList();
        this.props.getDeaerUsers(this.props.device.dealer_id);

        let filtered = checkIsArray(this.props.transferHistoryList).filter(e => e.action == "Device Transfered");
        let THIS_DEVICE_TRANSFERED_TO = (filtered[filtered.length - 1]) ? `to ${filtered[filtered.length - 1].transfered_to}` : "";

        if (this.props.device.finalStatus == "Transfered") {
            Modal.error({ title: `This Device Account Transfered ${THIS_DEVICE_TRANSFERED_TO}` });
        } else if (transfer === "User") {
            // if (this.props.device.finalStatus !== "Flagged") {
            //     Modal.error({ title: 'Plaese Flag the device first to Transfer' });
            // } else {
            this.setState({ visibleUser: true });
            // }
        } else if (this.props.user.type === ADMIN && transfer === "Device") {
            Modal.error({ title: 'Sorry, Not Allowed for Admin to Transfer the Dealer Device.' });
        } else if (this.props.flagged === "Unflag") {
            this.props.handleTransfer(this.props.device.device_id);
        } else {
            Modal.error({ title: 'Plaese Flag the Device first to Transfer' });
        }
    }

    render() {
        const { visible, visibleUser, addNewUserModal, addNewUserValue } = this.state;
        let { isloading, users_list, device, flagged } = this.props;
        var lastObject = users_list[0];

        // console.log("transfer history page device dealer_id is: ", this.props.device.dealer_id)
        // console.log("addNewUserValue ", addNewUserValue, "lastObject ", lastObject ? lastObject.user_id : "ff", "this.props.device.user_id ", this.props.device.user_id, "this.state.user_id ", this.state.user_id)
        // console.log('users_list ', users_list[0]);
        // console.log('this.props.device.user_id ', this.props.device)
        // if (this.props.user.type === ADMIN) {
        //     users_list = users_list.filter(e => e.dealer_id === this.props.device.dealer_id)
        // }

        var submitBtnDisable = true;

        if (lastObject && lastObject.isChanged) {
            submitBtnDisable = false;
        }
        else if (addNewUserValue) {
            if (addNewUserValue === this.props.device.user_id) {
                submitBtnDisable = true;
            }
            else {
                submitBtnDisable = false;
            }
        }

        // (addNewUserValue) ? ((this.props.device.user_id == addNewUserValue) ? true : false) : ((this.state.user_id == this.props.device.user_id) ? false : true)

        return (
            <div>
                <Modal
                    width='850px'
                    maskClosable={false}
                    visible={visible}
                    title="What you want to Transfer Device or User?" // "What you want to transfer, User or Device?"
                    onCancel={this.handleCancel}
                    footer={null}
                >

                    <Card>
                        <Row gutter={16} type="flex" justify="center" align="top">
                            <Col span={8} className="gutter-row" justify="center" >
                                <Button
                                    onClick={() => this.checkDeviceStatus("Device")}
                                    // disabled={(this.props.user.type === ADMIN) ? true : false}
                                >
                                    DEVICE TRANSFER
                                </Button>
                            </Col>
                            <Col span={8} className="gutter-row" style={{ textAlign: 'center', marginTop: '5px' }}><h3>-OR-</h3></Col>
                            <Col span={8} className="gutter-row" justify="center" >
                                <Button onClick={() => this.checkDeviceStatus("User")} style={{ float: 'right' }} >USER TRANSFER</Button>
                            </Col>
                        </Row>
                    </Card>


                    <br /><br />
                    <h2>TRANSFER HISTORY</h2>
                    <Input.Search
                        name="search"
                        key="search"
                        id="search"
                        onKeyUp={
                            (e) => {
                                this.handleComponentSearch(e)
                            }
                        }
                        placeholder={convertToLang(this.props.translation[SEARCH], "Search")}
                    />

                    <Table
                        columns={this.state.columns}
                        bordered
                        dataSource={this.renderList()}
                        pagination={false}
                    />

                </Modal>


                {/************************** USER MODAL ***************************/}
                <Modal
                    // width='850px'
                    maskClosable={false}
                    visible={visibleUser}
                    title="USER TRANSFER"
                    onCancel={this.handleCancelUser}
                    footer={null}
                // okText={convertToLang(this.props.translation[Button_Ok], Button_Ok)}
                // cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
                >

                    <Form onSubmit={this.handleSubmit}>
                        {(isloading ?

                            <div className="addUserSpin">
                                <Spin />
                            </div>
                            :
                            <Fragment>
                                <Form.Item
                                    label={convertToLang(this.props.translation[USER_ID], "USER ID")}
                                    labelCol={{ span: 8, xs: 24, md: 8, sm: 24 }}
                                    wrapperCol={{ span: 14, md: 14, xs: 24 }}
                                >
                                    {this.props.form.getFieldDecorator('user_id', {
                                        initialValue: addNewUserModal && lastObject ? lastObject.user_id : this.props.device.user_id,
                                        rules: [{
                                            required: true, message: convertToLang(this.props.translation[USER_ID_IS_REQUIRED], "User ID is Required !"),
                                        }]
                                    })(
                                        <Select
                                            className="pos_rel"
                                            setFieldsValue={addNewUserModal && lastObject ? lastObject.user_id : addNewUserValue}
                                            showSearch
                                            placeholder={convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}
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
                                            <Select.Option value="">{convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}</Select.Option>
                                            {users_list ?
                                                users_list.map((item, index) => {
                                                    return (<Select.Option key={index} value={item.user_id}>{`${item.user_id} (${item.user_name})`}</Select.Option>)
                                                })
                                                : null}
                                        </Select>

                                    )}
                                    {(this.props.user.type === ADMIN) ? null :
                                        <Button
                                            className="add_user_btn"
                                            type="primary"
                                            onClick={this.handleUserModal}
                                        >
                                            {convertToLang(this.props.translation[Button_Add_User], "Add User")}
                                        </Button>
                                    }

                                </Form.Item>

                            </Fragment>
                        )}
                        <Form.Item className="edit_ftr_btn11"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <Button key="back" type="button" onClick={() => { this.handleCancelUser() }} > {convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                            <Button type="primary"
                                disabled={submitBtnDisable}
                                // disabled={(addNewUserValue) ? ((this.props.device.user_id == addNewUserValue) ? true : false) : ((this.state.user_id == this.props.device.user_id) ? false : true)}
                                htmlType="submit">{convertToLang(this.props.translation[Button_submit], "Submit")}</Button>
                        </Form.Item>
                    </Form>
                    <AddUser ref="add_user" translation={this.props.translation} />
                </Modal>

            </div>
        )
    }
}

const WrappedUserList = Form.create({ name: 'transfer-user' })(TransferHistory);

var mapStateToProps = ({ users, settings, device_details }) => {
    // console.log('transferHistoryList users.dealer_users', device_details.transferHistoryList)

    return {
        transferHistoryList: device_details.transferHistoryList,
        getHistory: device_details.getHistory,
        users_list: users.dealer_users,
        isloading: users.addUserFlag,
        translation: settings.translation
    };
}

export default connect(mapStateToProps, { getDeaerUsers, getUserList, addUser, transferUser, transferHistory, getNewDevicesList }, null, { withRef: true })(WrappedUserList);