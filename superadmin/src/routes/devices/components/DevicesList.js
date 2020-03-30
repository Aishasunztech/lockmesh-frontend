import React, { Component, Fragment } from 'react'
import { Table, Button, Card, Tag, Form, Input, Popconfirm, Empty, Icon } from "antd";
import styles from './devices.css'
import { Link } from "react-router-dom";
import SuspendDevice from './SuspendDevice';
import ActivateDevcie from './ActivateDevice';
import StatusDevice from './StatusDevice';
import { getStatus, getColor, checkValue, titleCase, getSortOrder, checkRemainDays, getFormattedDate } from '../../utils/commonUtils'
import EditDevice from './editDevice';
import moment from 'moment';
import { Tabs, Modal } from 'antd';

import {
    DEVICE_ACTIVATED,
    DEVICE_EXPIRED,
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_SUSPENDED,
    DEVICE_UNLINKED,
    DEVICE_EXTEND,
    DEVICE_TRIAL,
    ADMIN
} from '../../../constants/Constants'
import { Redirect } from 'react-router-dom';
import { isNull } from 'util';
import { unlink } from 'fs';

class DevicesList extends Component {

    constructor(props) {
        super(props);
        this.confirm = Modal.confirm;

        this.state = {
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
            user_id: ''
        };
        this.renderList = this.renderList.bind(this);
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
        let title = ' Are you sure, you want to delete the device';
        this.confirmDelete(action, arr, title);
    }
    handleUserId = (user_id) => {
        if (user_id != 'null' && user_id != null) {
            this.setState({
                redirect: true,
                user_id: user_id
            })
        }
    }
    // renderList
    renderList(list) {
        // console.log('list of dec', list)
        return list.map((device, index) => {

            var status = device.finalStatus;
            // const button_type = (status === DEVICE_ACTIVATED || status === DEVICE_TRIAL) ? "danger" : "dashed";

            // const flagged = device.flagged;
            // console.log("not avail", status);
            // var order = getSortOrder(status)
            let color = getColor(status);
            var style = { margin: '0', width: '60px' }
            var text = "EDIT";
            // var icon = "edit";

            // if ((status === 'pending activation') || (device.unlink_status === 1)) {
            if ((status === DEVICE_PENDING_ACTIVATION) || (status === DEVICE_UNLINKED)) {
                // console.log('device name', device.name, 'status', device.unlink_status)
                style = { margin: '0 8px 0 0', width: '60px', display: 'none' }
                text = "ACTIVATE";
                // icon = 'add'
            }
            let tabSelected = this.props.tabselect;
            let StatusBtn;
            // console.log('tabselect ', tabSelected)

            let ActiveBtn = <Button size="small" onClick={() => this.handleStatusDevice(device, DEVICE_ACTIVATED)}> <span style={{ color: "green" }}>ACTIVE</span></Button>;
            let SuspendBtn = <Button type="danger" size="small" onClick={() => this.handleStatusDevice(device, DEVICE_SUSPENDED)} >SUSPEND</Button>;
            let ExtendBtn = <Button size="small" onClick={() => this.props.showDateModal(device, DEVICE_EXTEND)}><span style={{ color: "orange" }}> EXTEND </span> </Button>;

            // if (tabSelected == '7') { // suspend
            //     StatusBtn = ActiveBtn;
            // } else if (tabSelected == '6') { // expire
            //     StatusBtn = ExtendBtn;
            // } else if (tabSelected == '1' || tabSelected == '4') { //1: All, 4: active 
            //     StatusBtn = <Fragment>{SuspendBtn} {ExtendBtn}</Fragment>
            // } else {
            //     StatusBtn = "";
            // }

            if (status == DEVICE_SUSPENDED) { // 7:suspend
                StatusBtn = ActiveBtn;
            } else if (status == DEVICE_EXPIRED) { // 6:expire
                StatusBtn = ExtendBtn;
            } else if (status == DEVICE_ACTIVATED) { //1: All, 4: active 
                StatusBtn = <Fragment>{SuspendBtn} {ExtendBtn}</Fragment>
            } else {
                StatusBtn = "";
            }



            return {
                // sortOrder: <span style={{ display: 'none' }}>{order}</span>,
                // sortOrder: (<span id="order">{order}</span>),
                // sortOrder: {order},
                rowKey: index,
                // key: device.device_id ? `${device.device_id}` : device.usr_device_id,
                key: status == DEVICE_UNLINKED ? `${device.user_acc_id}` : device.id,
                counter: ++index,
                action: (StatusBtn),
                offline_id: checkValue(device.fl_dvc_id),
                status: (<span style={color} > {titleCase(status)}</span>),
                flagged: (device.flagged !== '') ? device.flagged : 'Not Flagged',
                device_id: checkValue(device.wl_dvc_id),
                // device_id: ((status != DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : (device.validity) ? (this.props.tabselect == '3') ? `${device.validity}` : "N/A" : "N/A",
                user_id: <a onClick={() => { this.handleUserId(device.user_id) }}>{checkValue(device.user_id)}</a>,
                validity: checkValue(device.validity),
                name: checkValue(device.name),
                account_email: checkValue(device.account_email),
                pgp_email: checkValue(device.pgp_email),
                activation_code: checkValue(device.activation_code),
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
                label: checkValue(device.whitelabel),
                model: checkValue(device.model),
                start_date: checkValue(moment(device.start_date).format('DD-MM-YY')),
                expiry_date: checkValue(moment(device.expiry_date).format('DD-MM-YY')),
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
        console.log(this.state.selectedRows, 'selected keys', this.state.selectedRowKeys)
        console.log(type);
        if (this.state.selectedRowKeys.length) {
            let title = ' Are you sure, you want to delete All these devices';
            let arr = [];
            // console.log('delete the device', this.state.selectedRowKeys);
            for (let id of this.state.selectedRowKeys) {
                for (let device of this.props.devices) {
                    if (type != 'unlink') {
                        if (id == device.id) {
                            arr.push(device)
                        }
                    }
                    else {
                        if (id == device.user_acc_id) {
                            arr.push(device)
                        }
                    }
                }
            }
            // console.log('object of ', arr);
            this.confirmDelete(type, arr, title);
        }
        //  console.log('DELETE ALL 1', this.state.selectedRows);

    }

    confirmDelete = (action, devices, title) => {

        // console.log(action);
        // console.log(devices);
        this.confirm({
            title: title,
            content: '',
            onOk: (() => {

                this.props.deleteUnlinkDevice(action, devices);
                //    this.props.resetTabSelected()
                // this.props.refreshComponent();
                // console.log('this.refs.tablelist.props.rowSelection', this.refs.tablelist.props.rowSelection)
                this.resetSeletedRows();
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

    resetSeletedRows = () => {
        // console.log('table ref', this.refs.tablelist)
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
    }

    // componentWillReceiveProps() {
    //     this.setState({
    //         devices: this.props.devices,
    //         columns: this.props.columns
    //     })

    // }

    render() {

        // console.log(this.state.selectedRows, 'selected keys', this.state.selectedRowKeys)

        const { activateDevice, suspendDevice, statusDevice } = this.props;
        const { redirect } = this.state
        if (redirect) {
            return <Redirect to={{
                pathname: '/users',
                state: { id: this.state.user_id }
            }} />
        }

        let rowSelection;
        if (this.props.tabselect == '5' && this.props.user.type !== ADMIN) {
            rowSelection = {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectedRows: selectedRows, selectedRowKeys: selectedRowKeys })
                    // console.log(`selectedRowKeys 5: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                },
                getCheckboxProps: record => ({
                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    name: record.name,
                }),
                //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
            };
        }
        else if (this.props.tabselect == '3') {
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

        // console.log(rowSelection);
        return (
            <div className="dev_table">
                {/* <ActivateDevcie ref="activate"
                    activateDevice={activateDevice} />
                <SuspendDevice ref="suspend"
                    suspendDevice={suspendDevice} /> */}
                <StatusDevice ref="deviceStatusUpdate"
                    statusDevice={statusDevice} />

                <Card>

                    <Table
                        ref='tablelist'
                        className="devices"
                        // rowSelection={rowSelection}
                        rowClassName={() => 'editable-row'}
                        size="middle"
                        bordered
                        columns={this.state.columns}
                        dataSource={this.renderList(this.props.devices)}
                        pagination={{
                            pageSize: Number(this.state.pagination),
                            size: "midddle",
                            // showSizeChanger:true 
                        }}

                        scroll={{
                            x: 500,
                            // y: 600 
                        }}
                    />
                </Card>

                <EditDevice ref='edit_device'

                />

            </div>

        )
    }

    handleSuspendDevice = (device, requireStatus) => {
        this.refs.suspend.handleSuspendDevice(device, requireStatus);
    }

    handleActivateDevice = (device) => {
        this.refs.activate.handleActivateDevice(device);
    }

    handleStatusDevice = (device, requireStatus) => {
        this.refs.deviceStatusUpdate.handleStatusDevice(device, requireStatus);
    }

    handleRejectDevice = (device) => {

        this.props.rejectDevice(device)
    }
    addDevice = (device) => {
        // console.log(device);
        // this.props.addDevice(device);
    }

}

export default DevicesList



