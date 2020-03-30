import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Icon, Modal, Avatar, Row, Col, Table } from "antd";
import CircularProgress from "components/CircularProgress";
import AppFilter from "../../components/AppFilter";
import { checkValue, convertToLang, getColor, componentSearch, checkTimezoneValue, checkIsArray } from '../utils/commonUtils'
import { BASE_URL } from '../../constants/Application';
import ListMsgs from './components/ListMsgs';
import SendMsgForm from './components/SendMsgForm';

import { getAllDealers } from "../../appRedux/actions/Dealers";
import { getUserList } from "../../appRedux/actions/Users";
import {
    getBulkDevicesList,
    setSelectedBulkDevices,
    sendBulkMsg,
    updateBulkMsg,
    closeResponseModal,
    getBulkMsgsList,
    deleteBulkMsg
} from "../../appRedux/actions/BulkDevices";

import { ACTION, Alert_Delete_APK, SEARCH, DEVICE_UNLINKED, DEVICE_PRE_ACTIVATION } from "../../constants/Constants";
import { Button_Save, Button_Yes, Button_No, Button_Ok } from "../../constants/ButtonConstants";
import { deviceMsgsColumns } from "../utils/columnsUtils";
import { Tab_Active, Tab_All, Tab_Disabled } from "../../constants/TabConstants";
import { Required_Fields } from '../../constants/DeviceConstants';

var status = true;
var coppyApks = [];
var domainStatus = true;
var copyDomainList = [];

class DeviceMessages extends Component {

    constructor(props) {
        super(props);
        var columns = deviceMsgsColumns(props.translation, this.handleSearch);

        this.state = {
            sorterKey: '',
            sortOrder: 'ascend',
            apk_list: [],
            bulkMsgs: [],
            uploadApkModal: false,
            showUploadModal: false,
            showUploadData: {},
            columns: columns,
            visible: false,
            bulkResponseModal: false,
            editRecord: null,
            editModal: false
        }
        this.confirm = Modal.confirm;
    }

    handleTableChange = (pagination, query, sorter) => {
        let { columns } = this.state;

        checkIsArray(columns).forEach(column => {
            // if (column.children) {
            if (Object.keys(sorter).length > 0) {
                if (column.dataIndex == sorter.field) {
                    if (this.state.sorterKey == sorter.field) {
                        column['sortOrder'] = sorter.order;
                    } else {
                        column['sortOrder'] = "ascend";
                    }
                } else {
                    column['sortOrder'] = "";
                }
                this.setState({ sorterKey: sorter.field });
            } else {
                if (this.state.sorterKey == column.dataIndex) column['sortOrder'] = "ascend";
            }
            // }
        })
        this.setState({
            columns: columns
        });
    }

    // delete
    handleConfirmDelete = (appId, appObject) => {
        this.confirm({
            title: convertToLang(this.props.translation[Alert_Delete_APK], "Are you sure, you want to delete the Apk ?"),
            content: <Fragment>
                <Avatar size="small" src={BASE_URL + "users/getFile/" + appObject.logo} />
                {` ${appObject.apk_name} - ${appObject.size}`}
            </Fragment>,
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk: () => {
                this.props.deleteApk(appId);
                return new Promise((resolve, reject) => {
                    setTimeout((5 > 0.5 ? resolve : reject));
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.bulkMsgs !== nextProps.bulkMsgs) {
            this.setState({
                bulkMsgs: nextProps.bulkMsgs,
            })
        }
    }

    handleComponentSearch = (value) => {
        try {
            if (value.length) {

                if (status) {
                    coppyApks = this.state.bulkMsgs;
                    status = false;
                }
                let foundApks = componentSearch(coppyApks, value);
                if (foundApks.length) {
                    this.setState({
                        bulkMsgs: foundApks,
                    })
                } else {
                    this.setState({
                        bulkMsgs: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    bulkMsgs: coppyApks,
                })
            }
        } catch (error) {
            // alert("hello");
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                bulkMsgs: this.props.bulkMsgs
            })
        }
        if (this.props.bulkResponseModal !== prevProps.bulkResponseModal) {
            this.setState({
                bulkResponseModal: this.props.bulkResponseModal
            })
        }
    }

    handleCancelResponseModal = () => {
        this.setState({
            bulkResponseModal: false
        })
        this.props.closeResponseModal();
    }
    componentDidMount() {
        // this.props.getDomains();
        let dealerTZ = checkTimezoneValue(this.props.user.timezone, false);
        // console.log("dealerTZ ", dealerTZ);
        this.props.getBulkMsgsList(dealerTZ);
        this.props.getAllDealers();
        this.props.getUserList();

    }

    handleUploadApkModal = (visible) => {
        this.setState({
            uploadApkModal: visible
        });
        this.props.resetUploadForm(false)
    }
    hideUploadApkModal = () => {
        this.setState({
            uploadApkModal: false
        });
        this.props.resetUploadForm(true)
    }

    handleSendMsgButton = (visible) => {
        this.setState({ visible })
    }

    render() {
        const {
            response_modal_action,
            failed_device_ids,
            expire_device_ids,
            queue_device_ids,
            pushed_device_ids,
        } = this.props;

        let failedTitle = 'N/A';
        let offlineTitle = 'N/A';
        let onlineTitle = 'N/A';

        if (response_modal_action === "msg") {
            failedTitle = "Failed to Pull apps from these Devices";
            offlineTitle = "(Apps will be Pulled soon from these devices. Action will be performed when devices back online)"
            onlineTitle = "Apps will be Pulled soon from these Devices";
        }
        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress /> :
                        <div>
                            <AppFilter
                                translation={this.props.translation}
                                // defaultPagingValue={this.props.DisplayPages}
                                isAddButton={true}
                                handleSendMsgModal={true}
                                handleSendMsgButton={this.handleSendMsgButton}
                                pageHeading={convertToLang(this.props.translation[""], "Send Message to Devices")}
                                addButtonText={convertToLang(this.props.translation[""], "Send New Message")}
                            />

                            <ListMsgs
                                // onChangeTableSorting={this.handleTableChange}
                                bulkMsgs={this.state.bulkMsgs}
                                deleteBulkMsg={this.props.deleteBulkMsg}
                                handleConfirmDelete={this.handleConfirmDelete}
                                columns={this.state.columns}
                                getApkList={this.props.getApkList}
                                user={this.props.user}
                                ref="list_msgs"
                                translation={this.props.translation}
                                renderDevicesList={this.renderDevicesList}
                                // showEditModal={this.showEditModal}

                                updateBulkMsgAction={this.props.updateBulkMsg}
                            />
                        </div>
                }
                {/* Send Message modal */}
                <Modal
                    title=
                    {
                        < Row >
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                <h3 className="mb-0">
                                    {convertToLang(this.props.translation[""], "Send Message to Selected Devcies")}
                                </h3>
                            </Col>
                            <Col xs={10} sm={10} md={10} lg={10} xl={10} className="text-right">
                                <p className="mb-0 require_f">(*)- {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                            </Col>
                        </Row>
                    }
                    width={"700px"}
                    maskClosable={false}
                    bodyStyle={{ height: '460px', overflow: 'overlay' }}
                    visible={this.state.visible}
                    onOk={() => this.setState({ visible: false })}
                    onCancel={() => this.setState({ visible: false })}
                    footer={false}
                    className="s_m_form"
                >
                    <SendMsgForm
                        setSelectedBulkDevices={this.props.setSelectedBulkDevices}
                        sendMsgOnDevices={this.props.sendBulkMsg}
                        handleCancelSendMsg={this.handleSendMsgButton}
                        user={this.props.user}
                        ref='send_msg_form'
                        users_list={this.props.users_list}
                        dealerList={this.props.dealerList}
                        devices={this.props.devices}
                        selectedDevices={this.props.selectedDevices ? this.props.selectedDevices : []}
                        getBulkDevicesList={this.props.getBulkDevicesList}
                        getAllDealers={this.props.getAllDealers}
                        getUserList={this.props.getUserList}
                        // renderList={this.renderDevicesList}
                        translation={this.props.translation}
                    />

                </Modal>


                {/* Responses handle through modal */}
                <Modal
                    maskClosable={false}
                    title={<div><Icon type="question-circle" className='warning' /><span> WARNING! </span></div>}
                    visible={this.state.bulkResponseModal}
                    onCancel={this.handleCancelResponseModal}
                    footer={false}
                >
                    {failed_device_ids && failed_device_ids.length ?
                        <Fragment>
                            <h2>{failedTitle}</h2>
                            <Table
                                bordered
                                size="middle"
                                pagination={false}
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.failed_device_ids)}
                            />
                            <span className="warning_hr">
                                <hr />
                            </span>
                        </Fragment>
                        : null}

                    {expire_device_ids && expire_device_ids.length ?
                        <Fragment>
                            <h2>{`Already Expired Devices`}</h2>
                            <Table
                                bordered
                                size="middle"
                                pagination={false}
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.expire_device_ids)}
                            />
                            <span className="warning_hr">
                                <hr />
                            </span>
                        </Fragment>
                        : null}

                    {queue_device_ids && queue_device_ids.length ?
                        <Fragment>
                            <h2>Offline Devices</h2>
                            <p><small>{offlineTitle}</small></p>
                            <Table
                                bordered
                                size="middle"
                                pagination={false}
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.queue_device_ids)}
                            />
                            <span className="warning_hr">
                                <hr />
                            </span>
                        </Fragment>
                        : null}

                    {pushed_device_ids && pushed_device_ids.length ?
                        <Fragment>
                            <h2>{onlineTitle}</h2>
                            <Table
                                size="middle"
                                pagination={false}
                                bordered
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.pushed_device_ids)}
                            />
                        </Fragment>
                        : null}

                    {/* Display this table if no any device exist there */}
                    {!failed_device_ids.length && !expire_device_ids.length && !queue_device_ids.length && !pushed_device_ids.length ?
                        <Fragment>
                            <h2>{"N/A"}</h2>
                            <Table
                                size="middle"
                                pagination={false}
                                bordered
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={[]}
                            />
                        </Fragment>
                        : null}
                </Modal>
            </div >
        )
    }

    renderResponseList(list) {
        return list.map(item => {
            return {
                device_id: item
            }
        })
    }

    renderDevicesList(list) {
        // console.log('renderList ', list)
        return list.map((device, index) => {

            var status = device.finalStatus;
            // console.log("status ", status)
            let color = getColor(status);

            return {
                rowKey: device.id,
                // key: device.device_id ? `${device.device_id}` : device.usr_device_id,
                key: status == DEVICE_UNLINKED ? `${device.user_acc_id} ${device.created_at} ` : device.id,
                status: (<span style={color} > {status}</span>),
                lastOnline: checkValue(device.lastOnline),
                flagged: device.flagged,
                type: checkValue(device.type),
                version: checkValue(device.version),
                device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : "N/A",
                // device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : (device.validity) ? (this.props.tabselect == '3') ? `${device.validity}` : "N/A" : "N/A",
                user_id: <a onClick={() => { this.handleUserId(device.user_id) }}>{checkValue(device.user_id)}</a>,
                validity: checkValue(device.validity),
                transfered_to: checkValue((device.finalStatus == "Transfered") ? device.transfered_to : null),
                name: checkValue(device.name),
                activation_code: checkValue(device.activation_code),
                account_email: checkValue(device.account_email),
                pgp_email: checkValue(device.pgp_email),
                chat_id: checkValue(device.chat_id),
                client_id: checkValue(device.client_id),
                dealer_id: checkValue(device.dealer_id),
                dealer_pin: checkValue(device.link_code),
                mac_address: checkValue(device.mac_address),
                sim_id: checkValue(device.sim_id),
                imei_1: checkValue(device.imei),
                sim_1: checkValue(device.simno),
                imei_2: checkValue(device.imei2),
                sim_2: checkValue(device.simno2),
                serial_number: checkValue(device.serial_number),
                model: checkValue(device.model),
                // start_date: device.start_date ? `${new Date(device.start_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
                // expiry_date: device.expiry_date ? `${new Date(device.expiry_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
                dealer_name: <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a>,
                // dealer_name: (this.props.user.type === ADMIN) ? <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a> : <a >{checkValue(device.dealer_name)}</a>,
                online: device.online === 'online' ? (<span style={{ color: "green" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>) : (<span style={{ color: "red" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>),
                s_dealer: checkValue(device.s_dealer),
                s_dealer_name: checkValue(device.s_dealer_name),
                remainTermDays: device.remainTermDays,
                start_date: checkValue(device.start_date),
                expiry_date: checkValue(device.expiry_date),
            }
        });
    }

    handleSearch = (e) => {
        let fieldName = e.target.name;
        let fieldValue = e.target.value;

        let searchedData = this.searchField(this.props.bulkMsgs, fieldName, fieldValue);
        this.setState({
            bulkMsgs: searchedData
        });

    }

    searchField = (originalData, fieldName, value) => {
        let demoData = [];
        if (value.length) {
            checkIsArray(originalData).forEach((data) => {
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] != null) {
                        if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    }
                } else {
                    demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getBulkDevicesList: getBulkDevicesList,
        setSelectedBulkDevices: setSelectedBulkDevices,
        sendBulkMsg: sendBulkMsg,
        updateBulkMsg: updateBulkMsg,
        getAllDealers: getAllDealers,
        getUserList: getUserList,
        closeResponseModal: closeResponseModal,
        getBulkMsgsList: getBulkMsgsList,
        deleteBulkMsg: deleteBulkMsg
    }, dispatch);
}

const mapStateToProps = ({ account, auth, settings, dealers, bulkDevices }) => {
    return {
        isloading: account.isloading,
        user: auth.authUser,
        users_list: bulkDevices.usersOfDealers,
        dealerList: dealers.dealers,
        devices: bulkDevices.bulkDevices,
        selectedDevices: bulkDevices.selectedDevices,
        translation: settings.translation,
        bulkResponseModal: bulkDevices.bulkResponseModal,
        failed_device_ids: bulkDevices.failed_device_ids,
        queue_device_ids: bulkDevices.queue_device_ids,
        pushed_device_ids: bulkDevices.pushed_device_ids,
        response_modal_action: bulkDevices.response_modal_action,
        expire_device_ids: bulkDevices.expire_device_ids,
        bulkMsgs: bulkDevices.bulkMsgs
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceMessages);