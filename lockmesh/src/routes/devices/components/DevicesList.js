import React, { Component, Fragment } from 'react'
import { Table, Button, Card, Tag, Form, Input, Popconfirm, Empty, Icon, Tabs, Modal } from "antd";
import { Redirect } from 'react-router-dom';
import styles from './devices.css'
import CustomScrollbars from "../../../util/CustomScrollbars";
// import styles1 from './devices_fixheader.css'
import { Link } from "react-router-dom";
import SuspendDevice from './SuspendDevice';
import ActivateDevcie from './ActivateDevice';
import { getStatus, getColor, checkValue, getSortOrder, checkRemainDays, convertToLang, checkRemainTermDays, convertTimezoneValue, getDevicesListActionBtns, checkIsArray } from '../../utils/commonUtils'
import EditDevice from './editDevice';
import AddDevice from './AddDevice';

// import moment from 'moment';
import moment from 'moment-timezone';
import {
    DEVICE_ACTIVATED,
    DEVICE_EXPIRED,
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_SUSPENDED,
    DEVICE_UNLINKED,
    DEVICE_TRIAL,
    ADMIN,
    Name,
    Value,
    ALERT_TO_SURE_DELETE_ALL_DEVICES,
    DEALER,
    ACTION,
    WARNING
} from '../../../constants/Constants'
import {
    Button_Modify,
    Button_Delete,
    Button_Activate,
    Button_Connect,
    Button_Yes,
    Button_Ok,
    Button_Cancel,
    Button_Suspend,
    Button_Unsuspend,
    Button_Edit,
    Button_passwordreset,
    Button_submit,
    Button_Flag,
    Button_UNFLAG,
    Button_No,
    Button_ACCEPT,
    Button_Decline,
    Button_Transfer,
    Button_Confirm,
} from '../../../constants/ButtonConstants';

import {
    Tab_All,
    Tab_Active,
    Tab_Expired,
    Tab_Trial,
    Tab_Suspended,
    Tab_PreActivated,
    Tab_PendingActivation,
    Tab_Transfer,
    Tab_Unlinked,
    Tab_Flagged,
    Tab_ComingSoon,
    Tab_Archived,
} from '../../../constants/TabConstants';

import { isNull } from 'util';
import { unlink } from 'fs';
import { ARE_YOU_SURE_YOU_WANT_DELETE_THE_DEVICE, DO_YOU_REALLY_WANT_TO_UNFLAG_THE_DEVICE, ARE_YOU_SURE_YOU_WANT_UNLINK_THE_DEVICE, DEVICE_ID, DEVICE_SERIAL_NUMBER, DEVICE_SIM_1, DEVICE_IMEI_1, DEVICE_SIM_2, DEVICE_IMEI_2 } from '../../../constants/DeviceConstants';
import { TIMESTAMP_FORMAT, DATE_FORMAT } from '../../../constants/Application';

const TabPane = Tabs.TabPane;

function showConfirm(_this, msg, action, request) {
    confirm({
        title: convertToLang(_this.props.translation[WARNING], "WARNING!"),
        content: msg,
        okText: convertToLang(_this.props.translation[Button_Confirm], "Confirm"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onOk() {
            action(request);
        },
        onCancel() {


        },
    });
}
class DevicesList extends Component {

    constructor(props) {
        super(props);
        this.confirm = Modal.confirm;

        const flaggedDevicesColumns = [
            { title: convertToLang(props.translation[ACTION], "Action"), dataIndex: 'action', key: 'action', align: "center" },
            { title: convertToLang(props.translation[DEVICE_ID], "DEVICE ID"), dataIndex: 'device_id', key: 'device_id', align: "center" },
            { title: convertToLang(props.translation[DEVICE_SERIAL_NUMBER], "SERIAL NUMBER"), dataIndex: 'serial_number', key: 'serial_number', align: "center" },
            { title: convertToLang(props.translation[DEVICE_SIM_1], "SIM 1"), dataIndex: 'sim_1', key: 'sim_1', align: "center" },
            { title: convertToLang(props.translation[DEVICE_IMEI_1], "IMEI 1"), dataIndex: 'imei_1', key: 'imei_1', align: "center" },
            { title: convertToLang(props.translation[DEVICE_SIM_2], "SIM 2"), dataIndex: 'sim_2', key: 'sim_2', align: "center" },
            { title: convertToLang(props.translation[DEVICE_IMEI_2], "IMEI 2"), dataIndex: 'imei_2', key: 'imei_2', align: "center" },
        ];

        this.state = {
            flaggedDevicesColumns: flaggedDevicesColumns,
            searchText: '',
            showMsg: false,
            editing: false,
            msg: "",
            columns: [],
            devices: [],
            pagination: this.props.pagination,
            selectedRows: [],
            selectedRowKeys: [],
            self: this,
            redirect: false,
            user_id: '',
            expandedRowKeys: [],
            dealer_id: '',
            goToPage: '/dealer/dealer',
            flaggedDevicesModal: false,
            requestDevice: ''
        };
        this.renderList = this.renderList.bind(this);
        this.sideScroll = this.sideScroll.bind(this);
    }

    customExpandIcon(props) {
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /></a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }

    deleteUnlinkedDevice = (action, device) => {
        let arr = [];
        arr.push(device);
        let title = convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_DELETE_THE_DEVICE], "Are you sure, you want to delete the device");
        this.confirmDelete(action, arr, title);
    }
    handleUserId = (user_id) => {
        if (user_id !== 'null' && user_id !== null) {
            this.setState({
                redirect: true,
                user_id: user_id
            })
        }
    }
    goToDealer = (dealer) => {

        if (this.props.user.type === ADMIN) {
            this.props.history.push(`/connect-dealer/${btoa(dealer.dealer_id.toString())}`.trim())
        } else {
            if (dealer.dealer_id !== 'null' && dealer.dealer_id !== null) {
                if (dealer.connected_dealer === 0 || dealer.connected_dealer === '' || dealer.connected_dealer === null) {
                    this.setState({
                        redirect: true,
                        dealer_id: dealer.dealer_id,
                        goToPage: '/dealer/dealer'
                    })
                } else {
                    this.setState({
                        redirect: true,
                        dealer_id: dealer.dealer_id,
                        goToPage: '/dealer/sdealer'
                    })
                }

            }
        }
    }

    showFlaggedDevices = (device) => {
        this.setState({ flaggedDevicesModal: true, requestDevice: device })
    }

    handleTransfer = (flagDevice) => {
        this.props.transferDeviceProfile({ flagged_device: flagDevice, reqDevice: this.state.requestDevice });
        this.setState({ flaggedDevicesModal: false })
    }



    renderFlaggedList(list) {

        return list.map((device) => {
            let transferButton = <Button type="default" size="small" style={{ margin: '0 8px 0 8px', textTransform: "uppercase" }} onClick={() => this.handleTransfer(device)}>{convertToLang(this.props.translation[Button_Transfer], "TRANSFER")}</Button>

            return {
                key: device.device_id ? `${device.device_id}` : "N/A",
                action: transferButton,
                device_id: device.device_id ? `${device.device_id}` : "N/A",
                imei_1: device.imei ? `${device.imei}` : "N/A",
                sim_1: device.simno ? `${device.simno}` : "N/A",
                imei_2: device.imei2 ? `${device.imei2}` : "N/A",
                sim_2: device.simno2 ? `${device.simno2}` : "N/A",
                serial_number: device.serial_number ? `${device.serial_number}` : "N/A",
            }
        });

    }

    relinkDevice(device) {
        showConfirm(this, convertToLang(this.props.translation[""], "Are you sure you want to relink device with existing services on device ?"), this.props.relinkDevice, device.id)
    }
    rejectRelinkDevice(device) {
        showConfirm(this, convertToLang(this.props.translation[""], "Are you sure you want to reject relink request ? This device will not get previous services if rejected."), this.props.rejectDevice, device)
    }

    // renderList
    renderList(list) {
        // console.log("devices list: ", list);
        return list.map((device, index) => {
            var status = device.finalStatus;
            const button_type = (status === DEVICE_ACTIVATED || status === DEVICE_TRIAL) ? "danger" : "dashed";
            let color = getColor(status);
            var style = { margin: '0', width: 'auto', textTransform: 'uppercase' }
            var text = convertToLang(this.props.translation[Button_Edit], "EDIT");

            if ((status === DEVICE_PENDING_ACTIVATION) || (status === DEVICE_UNLINKED)) {
                style = { margin: '0 8px 0 0', width: 'auto', display: 'none', textTransform: 'uppercase' }
                text = "ACTIVATE";
            }
            let transferButton = <Button type="default" size="small" style={{ margin: '0 8px 0 8px', textTransform: "uppercase" }} onClick={() => this.showFlaggedDevices(device)}>{convertToLang(this.props.translation[Button_Transfer], "TRANSFER")}</Button>
            let SuspendBtn = <Button type={button_type} size="small" style={style} onClick={() => this.handleSuspendDevice(device)}> {convertToLang(this.props.translation[Button_Suspend], "SUSPEND")}</Button>;
            let ActiveBtn = <Button type={button_type} size="small" style={style} onClick={() => this.handleActivateDevice(device)}> {convertToLang(this.props.translation[Button_Unsuspend], "UN-SUSPEND")}</Button>;
            let DeleteBtn = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px ', textTransform: 'uppercase' }} onClick={() => this.deleteUnlinkedDevice('unlink', device)} >{convertToLang(this.props.translation[Button_Delete], "DELETE")}</Button>
            let ConnectBtn = <Link to={`connect-device/${btoa(device.device_id)}`.trim()}><Button type="default" size="small" style={style}>  {convertToLang(this.props.translation[Button_Connect], "CONNECT")}</Button></Link>
            let EditBtn = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.refs.edit_device.showModal(device, this.props.editDevice); this.props.resetProductAddProps() }} >{text}</Button>
            let AcceptBtn = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.refs.add_device.showModal(device, this.props.addDevice); this.props.resetProductAddProps() }}> {convertToLang(this.props.translation[Button_ACCEPT], "ACCEPT")} </Button>;
            let DeclineBtn = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.handleRejectDevice(device) }}>{convertToLang(this.props.translation[Button_Decline], "DECLINE")}</Button>
            let relinkBtn = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.relinkDevice(device) }}> {convertToLang(this.props.translation[Button_ACCEPT], "REJECT REQUEST")} </Button>;
            let rejectRelinkBtn = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.rejectRelinkDevice(device) }}>{convertToLang(this.props.translation[Button_Decline], "RELINK WITH SERVICES")}</Button>
            let DeleteBtnPreActive = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => this.deleteUnlinkedDevice('pre-active', device)}>{convertToLang(this.props.translation[Button_Delete], "DELETE")} </Button>
            let Unflagbtn = <Button
                type="defualt"
                size="small"
                style={{ margin: '0 8px 0 0', color: "#fff", background: "#000", textTransform: 'uppercase' }}
                onClick={() => { (status == "Transfered") ? this.props.unlinkConfirm(device, true) : this.props.unflagConfirm(device) }}
            >{convertToLang(this.props.translation[Button_UNFLAG], "UNFLAG")} </Button>;

            let allButtons = {
                transferButton,
                SuspendBtn,
                ActiveBtn,
                DeleteBtn,
                ConnectBtn,
                EditBtn,
                AcceptBtn,
                DeclineBtn,
                DeleteBtnPreActive,
                Unflagbtn,
                rejectRelinkBtn,
                relinkBtn
            }

            let actionBtns = getDevicesListActionBtns(this.props.user, device, status, allButtons);
            return {
                rowKey: index,
                key: status == DEVICE_UNLINKED ? `${device.user_acc_id} ${device.created_at} ${index}` : device.id,
                // counter: ++index,
                action: actionBtns,
                status: (<span style={color} > {status}</span>),
                lastOnline: convertTimezoneValue(this.props.user.timezone, device.lastOnline),
                flagged: device.flagged,
                type: checkValue(device.type),
                version: checkValue(device.version),
                firmware_info: checkValue(device.firmware_info),
                device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : "N/A",
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
                sim_id2: checkValue(device.sim_id2),
                imei_1: checkValue(device.imei),
                sim_1: checkValue(device.simno),
                imei_2: checkValue(device.imei2),
                sim_2: checkValue(device.simno2),
                serial_number: checkValue(device.serial_number),
                model: checkValue(device.model),
                dealer_name: (this.props.user.type === ADMIN) ? <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a> : <a >{checkValue(device.dealer_name)}</a>,
                online: device.online === 'online' ? (<span style={{ color: "green" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>) : (<span style={{ color: "red" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>),
                s_dealer: device.prnt_dlr_id ? device.prnt_dlr_id : 'N/A', // checkValue(device.prnt_dlr_id), // checkValue(device.s_dealer), 
                s_dealer_name: device.prnt_dlr_name ? device.prnt_dlr_name : 'N/A', // checkValue(device.prnt_dlr_name), // checkValue(device.s_dealer_name),
                remainTermDays: (Number(device.remainTermDays) > 0) ? device.remainTermDays : 0,
                start_date: (status !== DEVICE_PRE_ACTIVATION) ? convertTimezoneValue(this.props.user.timezone, device.start_date, false, DATE_FORMAT) : "N/A",
                expiry_date: (status !== DEVICE_PRE_ACTIVATION) ? convertTimezoneValue(this.props.user.timezone, device.expiry_date, false, DATE_FORMAT) : "N/A",
            }
        });
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {

            this.setState({
                devices: this.props.devices,
                columns: this.props.columns,

            })
        }
        // console.log('did update', )
    }

    deleteAllUnlinkedDevice = (type) => {
        if (this.state.selectedRowKeys.length) {
            let title = convertToLang(this.props.translation[ALERT_TO_SURE_DELETE_ALL_DEVICES], " Are you sure, you want to delete All these devices");
            let arr = [];
            // console.log('delete the device', this.state.selectedRowKeys);
            for (let id of this.state.selectedRowKeys) {
                if (type !== 'unlink') {
                    for (let device of this.props.preActiveDevices) {
                        if (id === device.id) {
                            arr.push(device)
                        }
                    }
                } else {
                    for (let device of this.props.unlinkedDevices) {
                        let user_acc_id = id.split(' ')
                        // console.log(user_acc_id[0], device.user_acc_id);
                        if (user_acc_id[0] == device.user_acc_id) {

                            arr.push(device)
                        }
                    }
                }
            }
            // console.log('object of ', arr);
            this.confirmDelete(type, arr, title);
        } else {
            if (type === 'unlink') {
                Modal.error({
                    title: 'There is no unlink device selected to remove',
                    content: 'Please Select a device to perform this action.',
                });
            } else if (type === 'pre-active') {
                Modal.error({
                    title: 'There is no pre-active device selected to remove',
                    content: 'Please Select a device to perform this action.',
                });
            }
        }
        //  console.log('DELETE ALL 1', this.state.selectedRows);

    }

    confirmDelete = (action, devices, title) => {

        // console.log(action);
        // console.log(devices);
        this.confirm({
            title: title,
            content: '',
            okText: convertToLang(this.props.translation[Button_Yes], 'Yes'),
            cancelText: convertToLang(this.props.translation[Button_No], 'No'),
            onOk: (() => {

                this.props.deleteUnlinkDevice(action, devices);
                //    this.props.resetTabSelected()
                // this.props.refreshComponent();
                // console.log('this.refs.tablelist.props.rowSelection', this.refs.tablelist.props.rowSelection)
                this.resetSelectedRows();
                if (this.refs.tablelist.props.rowSelection !== null) {
                    this.refs.tablelist.props.rowSelection.selectedRowKeys = []
                }
            }),
            onCancel() { },
        });
    }


    handlePagination = (value) => {
        // alert('sub child');
        // console.log(value)
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    resetSelectedRows = () => {
        // console.log('table ref', this.refs.tablelist)
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
    }

    onExpandRow = (expanded, record) => {
        // console.log(expanded, 'data is expanded', record);
        if (expanded) {
            if (!this.state.expandedRowKeys.includes(record.key)) {
                this.state.expandedRowKeys.push(record.key);
                this.setState({ expandedRowKeys: this.state.expandedRowKeys })
            }
        } else if (!expanded) {
            if (this.state.expandedRowKeys.includes(record.key)) {
                let list = checkIsArray(this.state.expandedRowKeys).filter(item => item !== record.key)
                this.setState({ expandedRowKeys: list })
            }
        }
    }


    scrollBack = () => {
        let element = document.getElementById('scrolltablelist');
        console.log(element.scrollLeft)
        element.scrollLeft += 100;
        console.log(element.scrollLeft)
        // var element = this.refs.tablelist; //document.getElementsByClassName("scrolltablelist");
        // console.log(element)
        // this.sideScroll(element, 'left', 25, 100, 10);
    }

    scrollNext = () => {
        console.log('hi scroll next')
        var element = this.refs.tablelist; // document.getElementsByClassName("scrolltablelist");  // ant-table-body   scrolltablelist  ant-table-scroll
        this.sideScroll(element, 'right', 25, 100, 10);
    }

    sideScroll(element, direction, speed, distance, step) {
        console.log('hi sideScroll function')
        // element.props.scroll.x=15;
        // element.props.style.scrollMargin="100px";
        console.log('element is: ', element.props);
        // console.log('direction is: ', direction);
        // console.log('speed is: ', speed);
        // console.log('distance is: ', distance);
        // console.log('step is: ', step)

        var scrollAmount = 0;
        // var slideTimer = setInterval(function () {
        //     if (direction === 'left') {
        //         element.scrollLeft -= step;
        //     } else {
        //         element.scrollLeft += step;
        //     }
        //     scrollAmount += step;
        //     if (scrollAmount >= distance) {
        //         window.clearInterval(slideTimer);
        //     }
        // }, speed);
    }

    render() {

        const { activateDevice, suspendDevice } = this.props;
        const { redirect } = this.state
        if (redirect && this.state.user_id !== '') {
            return <Redirect to={{
                pathname: '/users',
                state: { id: this.state.user_id }
            }} />
        }

        if (redirect && this.state.dealer_id !== '') {
            return <Redirect to={{
                pathname: this.state.goToPage,
                state: { id: this.state.dealer_id }
            }} />
        }

        let rowSelection;
        // if (this.props.tabselect === '5' && this.props.user.type !== ADMIN) {
        //     rowSelection = {
        //         onChange: (selectedRowKeys, selectedRows) => {
        //             this.setState({ selectedRows: selectedRows, selectedRowKeys: selectedRowKeys })
        //             // console.log(`selectedRowKeys 5: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //         },
        //         getCheckboxProps: record => ({
        //             disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //             name: record.name,
        //         }),
        //         //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
        //     };
        // }
        // else 
        if (this.props.tabselect === '3' && this.props.user.type !== ADMIN) {
            rowSelection = {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectedRows: selectedRows, selectedRowKeys: selectedRowKeys })
                    // console.log(`selectedRowKeys 3: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

                    //  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                },
                getCheckboxProps: record => ({
                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    name: record.name,
                }),
                selectedRowKeys: this.state.selectedRowKeys,
                //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
            };

        } else {
            // console.log('asdkjadl')
            rowSelection = null
        }

        // console.log(this.refs.tablelist, 'table rof');
        return (
            <div className="dev_table">
                <ActivateDevcie ref="activate"
                    activateDevice={activateDevice}
                    translation={this.props.translation}
                />
                <SuspendDevice ref="suspend"
                    suspendDevice={suspendDevice}
                    translation={this.props.translation}
                />
                <Card className={`fix_card ${this.props.styleType}`}>
                    <hr className="fix_header_border" style={{ top: "56px" }} />
                    <CustomScrollbars className="gx-popover-scroll ">
                        <Table
                            // id="test"
                            id='scrolltablelist'
                            ref='tablelist'
                            className={"devices "}
                            rowSelection={rowSelection}
                            rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''}
                            size="middle"
                            bordered
                            columns={this.state.columns}
                            onChange={this.props.onChangeTableSorting}
                            dataSource={this.renderList(this.props.devices)}
                            pagination={
                                false
                                // pageSize: Number(this.state.pagination),
                                //size: "midddle",
                            }
                            // useFixedHeader={true}
                            onExpand={this.onExpandRow}
                            expandIcon={(props) => this.customExpandIcon(props)}
                            expandedRowRender={(record) => {
                                // console.log('record is', record)
                                let showRecord = [];
                                let showRecord2 = [];

                                this.props.columns.map((column, index) => {
                                    // console.log(column.dataIndex, ' test column: ', column);
                                    if (column.className === "row") {
                                    } else if (column.className === "hide") {
                                        let title = column.children[0].title;
                                        let dataIndex = column.dataIndex;
                                        if (dataIndex === "sim_id" || dataIndex === "imei_1" || dataIndex === "sim_1" || dataIndex === "imei_2" || dataIndex === "sim_2") {
                                            showRecord2.push({
                                                name: title,
                                                values: record[column.dataIndex],
                                                rowKey: title
                                            });
                                        } else {
                                            // if (dataIndex === "status" || dataIndex === "dealer_name" || dataIndex === "s_dealer_name") {
                                            //     if (record[column.dataIndex][0]) {
                                            //         showRecord.push({
                                            //             name: title,
                                            //             values: record[column.dataIndex][0].toUpperCase() + record[column.dataIndex].substring(1, record[column.dataIndex].length).toLowerCase(),
                                            //             rowKey: title
                                            //         });
                                            //     }

                                            // } else {

                                            showRecord.push({
                                                name: title,
                                                values: record[column.dataIndex],
                                                rowKey: title
                                            });
                                            // }
                                        }
                                    }
                                });
                                // console.log("cols",this.props.columns);
                                // console.log("toShow", record);
                                // if (record.batchData.length) {
                                //     return(
                                //     <Table
                                //         ref='tablelist'
                                //         className="devices"
                                //         rowSelection={rowSelection}
                                //         rowClassName={() => 'editable-row'}
                                //         size="middle"
                                //         bordered
                                //         columns={this.state.columns}
                                //         dataSource={this.renderList(record.batchData)}
                                //         // pagination={{
                                //         //     pageSize: Number(this.state.pagination),
                                //         //     size: "midddle",
                                //         //     // showSizeChanger:true 
                                //         // }}

                                //         scroll={{
                                //             x: 500,
                                //             // y: 600 
                                //         }}

                                //         expandIcon={(props) => this.customExpandIcon(props)}
                                //         expandedRowRender={(record) => {
                                //             let showRecord = [];
                                //             let showRecord2 = [];

                                //             this.props.columns.map((column, index) => {
                                //                 if (column.className === "row") {
                                //                 } else if (column.className === "hide") {
                                //                     let title = column.children[0].title;
                                //                     if (title === "SIM ID" || title === "IMEI 1" || title === "SIM 1" || title === "IMEI 2" || title === "SIM 2") {
                                //                         showRecord2.push({
                                //                             name: title,
                                //                             values: record[column.dataIndex],
                                //                             rowKey: title
                                //                         });
                                //                     } else {
                                //                         if (title === "STATUS" || title === "DEALER NAME" || title === "S-DEALER Name") {
                                //                             if (record[column.dataIndex][0]) {
                                //                                 showRecord.push({
                                //                                     name: title,
                                //                                     values: record[column.dataIndex][0].toUpperCase() + record[column.dataIndex].substring(1, record[column.dataIndex].length).toLowerCase(),
                                //                                     rowKey: title
                                //                                 });
                                //                             }

                                //                         } else {

                                //                             showRecord.push({
                                //                                 name: title,
                                //                                 values: record[column.dataIndex],
                                //                                 rowKey: title
                                //                             });
                                //                         }
                                //                     }
                                //                 }
                                //             });

                                //             return (
                                //                 <Fragment>
                                //                     <div className="col-md-4 expand_table">
                                //                         <Table
                                //                             pagination={false}
                                //                             columns={
                                //                                 [
                                //                                     {
                                //                                         title: convertToLang(this.props.translation[Name],"Name"),
                                //                                         dataIndex: 'name',
                                //                                         key: "name",
                                //                                         align: "center",
                                //                                         className: "bold"
                                //                                     }, {
                                //                                         title: convertToLang(this.props.translation[Value],"Value"),
                                //                                         dataIndex: "values",
                                //                                         key: "value",
                                //                                         align: "center"
                                //                                     }
                                //                                 ]
                                //                             }
                                //                             dataSource={showRecord}
                                //                         />
                                //                     </div>
                                //                     <div className="col-md-4 expand_table">
                                //                         <Table
                                //                             pagination={false}
                                //                             columns={
                                //                                 [
                                //                                     {
                                //                                         title: convertToLang(this.props.translation[Name],"Name"),
                                //                                         dataIndex: 'name',
                                //                                         key: "name",
                                //                                         align: "center",
                                //                                         className: "bold"
                                //                                     }, {
                                //                                         title: convertToLang(this.props.translation[Value],"Value"),
                                //                                         dataIndex: "values",
                                //                                         key: "value",
                                //                                         align: "center"
                                //                                     }
                                //                                 ]
                                //                             }
                                //                             dataSource={showRecord2}
                                //                         />
                                //                     </div>
                                //                 </Fragment>)
                                //     }} /> )
                                //         }else{
                                return (
                                    <Fragment>
                                        <div className="col-md-4 expand_table">
                                            <Table
                                                className="innerDevicesNameValue"
                                                pagination={false}
                                                columns={
                                                    [
                                                        {
                                                            title: convertToLang(this.props.translation[Name], "Name"),
                                                            dataIndex: 'name',
                                                            key: "name",
                                                            align: "center",
                                                            className: "bold"
                                                        }, {
                                                            title: convertToLang(this.props.translation[Value], "Value"),
                                                            dataIndex: "values",
                                                            key: "value",
                                                            align: "center"
                                                        }
                                                    ]
                                                }
                                                dataSource={showRecord}
                                            />
                                        </div>
                                        <div className="col-md-4 expand_table">
                                            <Table
                                                className="innerDevicesNameValue"
                                                pagination={false}
                                                columns={
                                                    [
                                                        {
                                                            title: convertToLang(this.props.translation[Name], "Name"),
                                                            dataIndex: 'name',
                                                            key: "name",
                                                            align: "center",
                                                            className: "bold"
                                                        }, {
                                                            title: convertToLang(this.props.translation[Value], "Value"),
                                                            dataIndex: "values",
                                                            key: "value",
                                                            align: "center"
                                                        }
                                                    ]
                                                }
                                                dataSource={showRecord2}
                                            />
                                        </div>
                                    </Fragment>)
                                // }

                            }
                            }
                        />
                        {/* <Button onClick={this.scrollBack} style={{ display: 'none' }} > Previous</Button>
                    <Button onClick={this.scrollNext} style={{ display: 'none' }} > Next</Button> */}
                    </CustomScrollbars>
                </Card>

                <EditDevice ref='edit_device'
                    translation={this.props.translation}
                    getSimIDs={this.props.getSimIDs}
                    getChatIDs={this.props.getChatIDs}
                    getPgpEmails={this.props.getPgpEmails}
                    history={this.props.history}
                    resetProductAddProps={this.props.resetProductAddProps}
                />
                <AddDevice ref="add_device"
                    translation={this.props.translation}
                    history={this.props.history}
                />

                <Modal
                    width={1000}
                    maskClosable={false}
                    visible={this.state.flaggedDevicesModal}
                    onCancel={() => this.setState({ flaggedDevicesModal: false })}
                    footer={null}
                // onOk={this.handleTransfer}
                // okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                // cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <Fragment>
                        <h1>{convertToLang(this.props.translation["FLAGGED DEVICES"], "FLAGGED DEVICES")}</h1>
                        <Table
                            bordered
                            columns={this.state.flaggedDevicesColumns}
                            style={{ marginTop: 20 }}
                            dataSource={this.renderFlaggedList(this.props.flaggedDevices)}
                            // dataSource={[]}
                            pagination={false}
                        // scroll={{ x: true }}
                        />
                    </Fragment>

                </Modal>
            </div >

        )
    }

    handleSuspendDevice = (device) => {
        this.refs.suspend.handleSuspendDevice(device);
    }

    handleActivateDevice = (device) => {
        this.refs.activate.handleActivateDevice(device);
    }

    handleRejectDevice = (device) => {

        this.props.rejectDevice(device)
    }
    addDevice = (device) => {
        // console.log(device);
        // this.props.addDevice(device);
    }

}

const confirm = Modal.confirm;

export default class Tab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            devices: this.props.devices,
            tabselect: this.props.tabselect,
            selectedOptions: this.props.selectedOptions
        }
    }

    callback = (key) => {
        this.props.handleChangetab(key);
    }

    deleteAllUnlinkedDevice = (type) => {
        this.refs.devciesList.deleteAllUnlinkedDevice(type)
    }
    deleteAllPreActivedDevice = (type) => {

        this.refs.devciesList.deleteAllUnlinkedDevice(type)
    }

    handlePagination = (value) => {
        this.refs.devciesList.handlePagination(value);
    }

    unflagConfirm = (device) => {
        let _this = this;
        confirm({
            title: convertToLang(_this.props.translation[DO_YOU_REALLY_WANT_TO_UNFLAG_THE_DEVICE], 'Do you really want to unflag the device ') + device.device_id,
            okText: convertToLang(_this.props.translation[Button_Yes], 'Yes'),
            cancelText: convertToLang(_this.props.translation[Button_No], 'No'),
            onOk() {
                _this.props.unflagged(device.usr_device_id)
                // _this.props.activateDevice(device)
                // console.log('OK');
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    unlinkConfirm = (device, transfered = false) => {
        let _this = this;
        confirm({
            title: convertToLang(_this.props.translation[""], "Do you really want to unlink the transfered device ") + device.device_id,
            okText: convertToLang(_this.props.translation[Button_Yes], 'Yes'),
            cancelText: convertToLang(_this.props.translation[Button_No], 'No'),
            onOk() {
                // console.log('unlinkConfirm ', device);
                _this.props.unlinkDevice(device, transfered)
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {
            this.setState({
                devices: this.props.devices,
                columns: this.props.columns,
                tabselect: this.props.tabselect,
                selectedOptions: this.props.selectedOptions
            })
        }
    }

    render() {
        // console.log('columsns', this.state.devices)
        const { translation } = this.props;
        return (
            <Fragment>
                <div>
                    <Tabs type="card" className="dev_tabs" activeKey={this.state.tabselect} onChange={this.callback}>
                        <TabPane tab={<span className="green">{convertToLang(translation[Tab_All], "All")} ({this.props.allDevices.length})</span>} key="1" >
                        </TabPane>
                        <TabPane tab={<span className="green">{convertToLang(translation[Tab_Active], "Active")} ({this.props.activeDevices.length})</span>} key="4" forceRender={true}>
                        </TabPane>
                        <TabPane tab={<span className="red">{convertToLang(translation[Tab_Expired], "Expired")} ({this.props.expireDevices.length})</span>} key="6" forceRender={true}>
                        </TabPane>
                        <TabPane tab={<span className="green">{convertToLang(translation[Tab_Trial], "Trial")} ({this.props.trialDevices.length})</span>} key="9" forceRender={true}>
                        </TabPane>
                        <TabPane tab={<span className="yellow">{convertToLang(translation[Tab_Suspended], "Suspended")} ({this.props.suspendDevices.length})</span>} key="7" forceRender={true}>
                        </TabPane>
                        <TabPane tab={<span className="blue">{convertToLang(translation[Tab_PreActivated], "Pre-Activated")}  ({this.props.preActiveDevices.length})</span>} key="3" forceRender={true}>
                        </TabPane>
                        <TabPane tab={<span className="gray">{convertToLang(translation[Tab_PendingActivation], "Pending Activation")}  ({this.props.pendingDevices.length})</span>} key="2" forceRender={true}>
                        </TabPane>
                        <TabPane tab={<span className="purple">{convertToLang(translation[Tab_Transfer], "Transfer")} ({this.props.transferredDevices.length})</span>} key="8" forceRender={true}>
                            <h2 className="coming_s">{convertToLang(translation[Tab_ComingSoon], "ComingSoon")}</h2>
                        </TabPane>
                        <TabPane tab={<span className="orange">{convertToLang(translation[Tab_Unlinked], "Unlinked")} ({this.props.unlinkedDevices.length})</span>} key="5" forceRender={true}>
                        </TabPane>
                        <TabPane tab={<span className="black">{convertToLang(translation[Tab_Flagged], "Flagged")}({this.props.flaggedDevices.length})</span>} key="10" forceRender={true}>
                        </TabPane>

                    </Tabs>
                    <DevicesList
                        transferDeviceProfile={this.props.transferDeviceProfile}
                        styleType={this.props.styleType}
                        devices={this.state.devices}
                        allDevices={this.props.allDevices}
                        activeDevices={this.props.activeDevices}
                        expireDevices={this.props.expireDevices}
                        suspendDevices={this.props.suspendDevices}
                        preActiveDevices={this.props.preActiveDevices}
                        pendingDevices={this.props.pendingDevices}
                        unlinkedDevices={this.props.unlinkedDevices}
                        flaggedDevices={this.props.flaggedDevices}
                        transferredDevices={this.props.transferredDevices}
                        trialDevices={this.props.trialDevices}
                        suspendDevice={this.props.suspendDevice}
                        activateDevice={this.props.activateDevice}
                        columns={this.props.columns}
                        rejectDevice={this.props.rejectDevice}
                        selectedOptions={this.state.selectedOptions}
                        ref="devciesList"
                        pagination={this.props.pagination}
                        addDevice={this.props.addDevice}
                        editDevice={this.props.editDevice}
                        tabselect={this.state.tabselect}
                        deleteUnlinkDevice={this.props.deleteUnlinkDevice}
                        resetTabSelected={this.resetTabSelected}
                        user={this.props.user}
                        unflagConfirm={this.unflagConfirm}
                        unlinkConfirm={this.unlinkConfirm}
                        history={this.props.history}
                        translation={this.props.translation}
                        onChangeTableSorting={this.props.onChangeTableSorting}
                        unlinkDevice={this.props.unlinkDevice}
                        getSimIDs={this.props.getSimIDs}
                        getChatIDs={this.props.getChatIDs}
                        getPgpEmails={this.props.getPgpEmails}
                        resetProductAddProps={this.props.resetProductAddProps}
                        relinkDevice={this.props.relinkDevice}



                    />
                </div>
            </Fragment>
        )
    }
}



