import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Highlighter from 'react-highlight-words';
import { Input, Button, Icon, Select, Modal, DatePicker, Form } from "antd";
import moment from 'moment';
import { bindActionCreators } from "redux";

import {
    getWhiteLabels,
    // saveOfflineDevice,
    getOfflineDevices,
    // suspendDevice,
    // activateDevice,
    statusDevice,
    editDevice,
} from "../../appRedux/actions";

import {
    DEVICE_ACTIVATED,
    DEVICE_EXPIRED,
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_SUSPENDED,
    DEVICE_DELETE,
    DEVICE_UNLINKED,
    ADMIN,
    DEVICE_TRIAL
} from '../../constants/Constants'

import {
    OFFLINE_ID,
    DEVICE_ID,
    DEVICE_REMAINING_DAYS,
    DEVICE_STATUS,
    DEVICE_MAC_ADDRESS,
    DEVICE_SERIAL_NUMBER,
    DEVICE_START_DATE,
    DEVICE_EXPIRY_DATE,
    WHITE_LABEL,
} from '../../constants/DeviceConstants';
import { LABEL } from '../../constants/LabelConstants';

import {
    getDropdown,
    postDropdown,
    postPagination,
    getPagination
} from '../../appRedux/actions/Common';


import AppFilter from '../../components/AppFilter';

import DevicesTabs from './components/DevicesTabs';

import ShowMsg from './components/ShowMsg';

import { getStatus, componentSearch, titleCase, dealerColsWithSearch } from '../utils/commonUtils';

import CircularProgress from "components/CircularProgress/index";

const { RangePicker, MonthPicker } = DatePicker
var copyDevices = [];
var status = true;

class Devices extends Component {
    constructor(props) {
        super(props);
        const columns = [
            {
                title: '#',
                dataIndex: 'counter',
                align: 'center',
                className: 'row',
                width: 800,
            },
            {
                dataIndex: 'action',
                align: 'center',
                className: 'row',
                width: 800,
            },

            {
                title: (
                    <Input.Search
                        name="fl_dvc_id"
                        key="offline_id"
                        id="offline_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(OFFLINE_ID)}
                    />
                ),
                dataIndex: 'offline_id',
                className: '',
                children: [
                    {
                        title: OFFLINE_ID,
                        align: "center",
                        dataIndex: 'offline_id',
                        key: "offline_id",
                        className: '',
                        sorter: (a, b) => { return a.offline_id.localeCompare(b.offline_id) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ],
            },
            {
                title: (
                    <Input.Search
                        name="fl_dvc_id"
                        key="device_id"
                        id="device_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_ID)}
                    />
                ),
                dataIndex: 'device_id',
                className: '',
                children: [
                    {
                        title: DEVICE_ID,
                        align: "center",
                        dataIndex: 'device_id',
                        key: "device_id",
                        className: '',
                        sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ],
            },
            {
                title: (
                    <Input.Search
                        name="status"
                        key="status"
                        id="status"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_STATUS)}
                    />
                ),
                dataIndex: 'status',
                className: '',

                children: [
                    {
                        title: DEVICE_STATUS,
                        align: "center",
                        className: '',
                        dataIndex: 'status',
                        key: 'status',
                        sorter: (a, b) => { console.log('done', a.status); return a.status.props.children[1].localeCompare(b.status.props.children[1]) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="start_date"
                        key="start_date"
                        id="start_date"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_START_DATE)}
                    />
                ),
                dataIndex: 'start_date',
                className: '',
                children: [
                    {
                        title: DEVICE_START_DATE,
                        align: "center",
                        className: '',
                        dataIndex: 'start_date',
                        key: 'start_date',
                        sorter: (a, b) => { return a.start_date.localeCompare(b.start_date) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="expiry_date"
                        key="expiry_date"
                        id="expiry_date"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_EXPIRY_DATE)}
                    />
                ),
                dataIndex: 'expiry_date',
                className: '',
                children: [
                    {
                        title: DEVICE_EXPIRY_DATE,
                        align: "center",
                        className: '',
                        dataIndex: 'expiry_date',
                        key: 'expiry_date',
                        sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },

            {
                title: (
                    <Input.Search
                        name="mac_address"
                        key="mac_address"
                        id="mac_address"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_MAC_ADDRESS)}
                    />
                ),
                dataIndex: 'mac_address',
                className: '',
                children: [
                    {
                        title: DEVICE_MAC_ADDRESS,
                        align: "center",
                        className: '',
                        dataIndex: 'mac_address',
                        key: 'mac_address',
                        sorter: (a, b) => { return a.mac_address.localeCompare(b.mac_address) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="serial_number"
                        key="serial_number"
                        id="serial_number"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_SERIAL_NUMBER)}
                    />
                ),
                dataIndex: 'serial_number',
                className: '',
                children: [
                    {
                        title: DEVICE_SERIAL_NUMBER,
                        align: "center",
                        dataIndex: 'serial_number',
                        key: 'serial_number',
                        className: '',
                        sorter: (a, b) => { return a.serial_number.localeCompare(b.serial_number) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="name"
                        key="label"
                        id="label"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(LABEL)}
                    />
                ),
                dataIndex: 'label',
                className: '',

                children: [
                    {
                        title: LABEL,
                        align: "center",
                        className: '',
                        dataIndex: 'label',
                        key: 'label',
                        sorter: (a, b) => { return a.label.props.children[1].localeCompare(b.label.props.children[1]) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },


        ];

        this.state = {
            columns: columns,
            searchText: '',
            devices: [],
            tabselect: '1SK',
            visible: false,
            mode: 'time',
            extendExpiryDevice: '',
            requireStatus: '',
            expiry_date: '',
            totalAllDevices: [],
            totalActiveDevices: [],
            totalExpireDevices: [],
            totalSuspendDevices: [],
            totalArchiveDevices: [],
            whiteLables: []
        }
        this.copyDevices = [];

        this.handleCheckChange = this.handleCheckChange.bind(this)
        // this.filterDevices = this.filterDevices.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    saveExpiryDate = (date) => {
        let { _d } = date;
        this.setState({
            expiry_date: _d
        })
    }

    // range(start, end) {
    //     const result = [];
    //     for (let i = start; i < end; i++) {
    //         result.push(i);
    //     }
    //     return result;
    // }

    // disabledDateTime = () => {
    //     return {
    //         disabledHours: () => this.range(0, 24).splice(4, 20),
    //         disabledMinutes: () => this.range(30, 60),
    //         disabledSeconds: () => [55, 56],
    //     };
    // }

    disabledDate = (current) => {
        // console.log('current is: ', current)
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }

    onChangeRangeDate = (dates, dateStrings) => {
        // console.log('From: ', dates[0], ', to: ', dates[1]);
        // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    }

    showDateModal = (device, requireStatus) => {
        console.log('show data modal and required status is', requireStatus)
        this.setState({
            visible: true,
            extendExpiryDevice: device,
            requireStatus
        });
    };

    handleOk = e => {
        this.state.extendExpiryDevice.expiry_date = this.state.expiry_date;
        // console.log(this.state.extendExpiryDevice, 'handleOk and required status is', this.state.requireStatus)
        // console.log(e);
        this.setState({
            visible: false,
        });
        this.props.statusDevice(this.state.extendExpiryDevice, this.state.requireStatus);
    };

    handleCancel = e => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    };

    deleteAllUnlinked = () => {
        alert('Its working')
    }

    filterList = (type, devices) => {
        let dumyDevices = [];
        devices.filter(function (device) {
            let deviceStatus = device.finalStatus;
            if (deviceStatus === type) {
                dumyDevices.push(device);
            }
        });

        return dumyDevices;
    }

    handleChange(value) {

        let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
        let indxAction = this.state.columns.findIndex(k => k.dataIndex == 'action');
        if (value == DEVICE_UNLINKED && this.props.user.type == ADMIN) {
            //  indx = this.state.columns.findIndex(k => k.dataIndex =='action');
            if (indxAction >= 0) { this.state.columns.splice(indxAction, 1) }
            //    console.log('CLGGGG', this.state.columns)

        } else {
            if (indxAction < 0) {
                this.state.columns.splice(1, 0, {
                    // title: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>,
                    dataIndex: 'action',
                    align: 'center',
                    className: 'row',
                    width: 800,

                })
            }
        }
        let activationCodeIndex = this.state.columns.findIndex(i => i.dataIndex == 'activation_code');
        if (value == DEVICE_UNLINKED && (this.props.user.type != ADMIN)) {
            // console.log('tab 5', this.state.columns);
            // this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>;
        }
        else if (value == DEVICE_PRE_ACTIVATION) {
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
            // console.log('index of 3 tab', indxRemainingDays)
            if (indxAction >= 0) {
                // this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllPreActivedDevice('pre-active')} >Delete Selected</Button>
            }
            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined) {
                this.state.columns[indxRemainingDays].className = '';
                this.state.columns[indxRemainingDays].children[0].className = '';
            }
            if (activationCodeIndex >= 0) {
                this.state.columns.splice(2, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
        }
        else {
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
            this.state.columns[1]['title'] = '';

            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined) {
                this.state.columns[indxRemainingDays].className = 'hide';
                this.state.columns[indxRemainingDays].children[0].className = 'hide';
            }

            if (activationCodeIndex >= 0) {
                this.state.columns.splice(11, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
        }

        switch (value) {
            case DEVICE_ACTIVATED:
                this.setState({
                    devices: this.filterList(DEVICE_ACTIVATED, this.props.devices),
                    column: this.columns,
                    tabselect: '4'
                })

                break;
            case DEVICE_TRIAL:
                this.setState({
                    devices: this.filterList(DEVICE_TRIAL, this.props.devices),
                    column: this.columns,
                    tabselect: '9'
                })

                break;
            case DEVICE_SUSPENDED:
                this.setState({
                    devices: this.filterList(DEVICE_SUSPENDED, this.props.devices),
                    column: this.columns,
                    tabselect: '7'
                })
                break;
            case DEVICE_EXPIRED:
                this.setState({
                    devices: this.filterList(DEVICE_EXPIRED, this.props.devices),
                    column: this.columns,
                    tabselect: '6'
                })
                break;
            case 'all':
                this.setState({
                    devices: this.props.devices,
                    column: this.columns,
                    tabselect: '1'
                })
                break;
            case DEVICE_UNLINKED:
                this.setState({
                    devices: this.filterList(DEVICE_UNLINKED, this.props.devices),
                    column: this.columns,
                    tabselect: '5'
                })
                break;
            case DEVICE_PENDING_ACTIVATION:
                // alert(value);
                this.setState({
                    devices: this.filterList(DEVICE_PENDING_ACTIVATION, this.props.devices),
                    column: this.columns,
                    tabselect: '2'
                })
                break;
            case DEVICE_PRE_ACTIVATION:
                this.setState({
                    devices: this.filterList(DEVICE_PRE_ACTIVATION, this.props.devices),
                    column: this.columns,
                    tabselect: '3'
                })
                break;
            default:
                this.setState({
                    devices: this.props.devices,
                    column: this.columns,
                    tabselect: '1'
                })
                break;
        }

    }

    handleChangeLabelTab = (key) => {
        console.log('handleChangeLabelTab key is: ', key);

        console.log('first devices will be: ', this.state.totalAllDevices);

        let filteredDevices = this.state.totalAllDevices.filter(e => e.whitelabel_id == key);

        // console.log('devices will be: ', filteredDevices);
        if (filteredDevices.length) {
            this.setState({
                devices: filteredDevices,
                column: this.state.columns,
                tabselect: key,
            })
        } else {
            this.handleChangetab(key);
        }



    }

    handleChangetab = (value) => {
        // console.log('Tab key is: ', value);
        // console.log('white label are: ', this.state.whiteLables);

        // let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
        let indxAction = this.state.columns.findIndex(k => k.dataIndex == 'action');
        if (value == '5' && this.props.user.type == ADMIN) {
            //  indx = this.state.columns.findIndex(k => k.dataIndex =='action');
            if (indxAction >= 0) { this.state.columns.splice(indxAction, 1) }
            //    console.log('CLGGGG', this.state.columns)

        } else {
            if (indxAction < 0) {
                this.state.columns.splice(1, 0, {
                    title: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>,
                    dataIndex: 'action',
                    align: 'center',
                    className: 'row',
                    width: 800,

                })
            }
        }
        let activationCodeIndex = this.state.columns.findIndex(i => i.dataIndex == 'activation_code');


        if (value == '5' && (this.props.user.type != ADMIN)) {
            // console.log('tab 5', this.state.columns);
            // this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>;
        }
        else if (value == '3') {
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
            // console.log('index of 3 tab', indxRemainingDays)
            if (indxAction >= 0) {
                this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllPreActivedDevice('pre-active')} >Delete Selected</Button>
            }
            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined) {
                this.state.columns[indxRemainingDays].className = '';
                this.state.columns[indxRemainingDays].children[0].className = '';
            }
            if (activationCodeIndex >= 0) {
                this.state.columns.splice(2, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
        }
        else {
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
            this.state.columns[1]['title'] = '';

            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined) {
                this.state.columns[indxRemainingDays].className = 'hide';
                this.state.columns[indxRemainingDays].children[0].className = 'hide';
            }
            if (activationCodeIndex >= 0) {
                this.state.columns.splice(11, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
        }



        var devices = [];
        switch (value) {
            case '4SK':
                devices = this.filterList(DEVICE_ACTIVATED, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '4SK',
                })
                break;
            case '9':
                devices = this.filterList(DEVICE_TRIAL, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '9',
                })
                break;
            case '7SK':
                devices = this.filterList(DEVICE_SUSPENDED, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '7SK',
                })
                break;
            case '6SK':
                devices = this.filterList(DEVICE_EXPIRED, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '6SK',
                })
                break;
            case '1SK':
                this.setState({
                    devices: this.props.devices,
                    column: this.state.columns,
                    tabselect: '1SK',
                })
                break;
            case "5SK":
                devices = this.filterList(DEVICE_UNLINKED, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '5SK'
                })
                break;
            case "2":
                devices = this.filterList(DEVICE_PENDING_ACTIVATION, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '2'
                })
                break;
            case "3":
                devices = this.filterList(DEVICE_PRE_ACTIVATION, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '3'
                })
                break;
            case "8":
                this.setState({
                    devices: [],
                    column: this.state.columns,
                    tabselect: '8'
                })
                break;
            // for (let i = 0; i < array.length; i++) {
            //     const element = array[i];

            // }
            default:
                this.setState({
                    devices: this.props.devices,
                    column: this.state.columns,
                    tabselect: '1SK'
                })
                break;
        }
    }


    updateColumn(column, type) {
        if (type === 'hide') {
            column.children[0].className = 'hide';
            return { ...column, className: 'hide' };
        } else if (type === 'show') {
            column.children[0].className = '';
            return { ...column, className: '' };
        }
    }


    handleCheckChange(values) {

        let dumydata = this.state.columns;

        // console.log("dumyData", dumydata);
        if (values.length) {
            this.state.columns.map((column, index) => {


                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                    dumydata[index].children[0].className = 'hide';
                    // dumydata[]
                }
                // console.log(this.state.tabselect)
                values.map((value) => {
                    if (column.className !== 'row') {
                        if (column.children[0].title === value) {
                            if (this.state.tabselect !== '3') {
                                if (column.children[0].title !== 'REMAINING DAYS') {
                                    dumydata[index].className = '';
                                    dumydata[index].children[0].className = '';
                                }
                            }
                            else {
                                dumydata[index].className = '';
                                dumydata[index].children[0].className = '';
                            }
                        }
                    }

                });
            });

            this.setState({ columns: dumydata });
        } else {

            const newState = this.state.columns.map((column) => {
                if (column.className === 'row') {
                    return column;
                } else {
                    column.children[0].className = 'hide';
                    return ({ ...column, className: 'hide' })
                }
            });

            this.setState({ columns: newState });
        }
        this.props.postDropdown(values, 'devices');

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.whiteLabels.length) {
            // console.log(nextProps.whiteLabels);
            this.setState({
                whiteLables: nextProps.whiteLabels
            })
        }
    }

    componentDidUpdate(prevProps) {

        // console.log('updated');
        if (this.props !== prevProps) {
            // console.log('this.props ', this.props.DisplayPages);
            this.setState({
                devices: this.props.devices,
                columns: this.state.columns,
                defaultPagingValue: this.props.DisplayPages,
                selectedOptions: this.props.selectedOptions,
                totalAllDevices: this.props.devices,
                totalActiveDevices: this.filterList(DEVICE_ACTIVATED, this.props.devices),
                totalExpireDevices: this.filterList(DEVICE_EXPIRED, this.props.devices),
                totalSuspendDevices: this.filterList(DEVICE_SUSPENDED, this.props.devices),
                totalArchiveDevices: this.filterList(DEVICE_DELETE, this.props.devices),
            })
            // this.copyDevices = this.props.devices;
            // this.handleChangetab(this.state.tabselect);
            this.handleChangeLabelTab(this.state.tabselect);
        }
    }

    handlePagination = (value) => {
        //  alert(value);
        //  console.log('pagination value of ', value)
        this.refs.devcieList.handlePagination(value);
        this.props.postPagination(value, 'devices');
    }
    componentDidMount() {
        this.props.getOfflineDevices();
        // this.props.getDropdown('devices');
        // this.props.getPagination('devices');
        this.props.getWhiteLabels();
    }


    handleComponentSearch = (value) => {
        try {
            if (value.length) {

                if (status) {
                    copyDevices = this.state.devices;
                    status = false;
                }
                let foundDevices = componentSearch(copyDevices, value);
                if (foundDevices.length) {
                    this.setState({
                        devices: foundDevices,
                    })
                } else {
                    this.setState({
                        devices: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    devices: copyDevices,
                })
            }
        } catch (error) {
            // alert("hello");
        }
    }

    rejectDevice = (device) => {
        this.props.rejectDevice(device);
    }
    handleFilterOptions = () => {
        return (
            <Select
                showSearch
                placeholder="Show Devices"
                optionFilterProp="children"
                style={{ width: '100%' }}
                filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onChange={this.handleChange}
            >

                <Select.Option value="all">All</Select.Option>
                <Select.Option value={DEVICE_ACTIVATED}>Active</Select.Option>
                <Select.Option value={DEVICE_EXPIRED}>Expired</Select.Option>
                <Select.Option value={DEVICE_SUSPENDED}>Suspended</Select.Option>
                <Select.Option value={DEVICE_UNLINKED}>Archived</Select.Option>

            </Select>
        );
    }

    handleDeviceModal = (visible) => {
        let device = {};
        this.refs.add_device.showModal(device, (device) => {
            this.props.preActiveDevice(device);
        }, true);
    }

    refreshComponent = () => {
        this.props.history.push('/devices');
    }

    handleSearch = (e) => {
        // console.log('============ check search value ========')
        // console.log(e.target.name , e.target.value);

        let demoDevices = [];
        if (status) {
            copyDevices = this.state.devices;
            status = false;
        }
        //   console.log("devices", copyDevices);

        if (e.target.value.length) {
            // console.log("keyname", e.target.name);
            // console.log("value", e.target.value);
            // console.log(this.state.devices);
            copyDevices.forEach((device) => {
                //  console.log("device", device[e.target.name] !== undefined);

                if (device[e.target.name] !== undefined) {
                    if ((typeof device[e.target.name]) === 'string') {
                        // console.log("string check", device[e.target.name])
                        if (device[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDevices.push(device);
                        }
                    } else if (device[e.target.name] != null) {
                        // console.log("else null check", device[e.target.name])
                        if (device[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDevices.push(device);
                        }
                    } else {
                        // demoDevices.push(device);
                    }
                } else {
                    demoDevices.push(device);
                }
            });
            //  console.log("searched value", demoDevices);
            this.setState({
                devices: demoDevices
            })
        } else {
            this.setState({
                devices: copyDevices
            })
        }
    }

    render() {
        // console.log('new devices are:: ', this.props.devices);

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <Fragment>
                {
                    this.props.isloading ? <CircularProgress /> :
                        <Fragment>

                            {/* <AppFilter
                                handleFilterOptions={this.handleFilterOptions}
                                selectedOptions={this.props.selectedOptions}
                                searchPlaceholder="Search Device"
                                defaultPagingValue={this.state.defaultPagingValue}
                                addButtonText="Add Device"
                                options={this.props.options}
                                isAddButton={this.props.user.type !== ADMIN}
                                AddDeviceModal={true}
                                disableAddButton={this.props.user.type === ADMIN}
                                // toLink="add-device"
                                handleDeviceModal={this.handleDeviceModal}
                                handleUserModal={this.handleUserModal}
                                handleCheckChange={this.handleCheckChange}
                                handlePagination={this.handlePagination}
                                handleComponentSearch={this.handleComponentSearch}
                            /> */}

                            <DevicesTabs
                                whiteLables={this.state.whiteLables}
                                totalAllDevices={this.state.totalAllDevices.length}
                                totalActiveDevices={this.state.totalActiveDevices.length}
                                totalExpireDevices={this.state.totalExpireDevices.length}
                                totalSuspendDevices={this.state.totalSuspendDevices.length}
                                totalArchiveDevices={this.state.totalArchiveDevices.length}
                                devices={this.state.devices}
                                // suspendDevice={this.props.suspendDevice}
                                // activateDevice={this.props.activateDevice}
                                statusDevice={this.props.statusDevice}
                                columns={this.state.columns}
                                selectedOptions={this.props.selectedOptions}
                                ref="devcieList"
                                pagination={this.props.DisplayPages}
                                editDevice={this.props.editDevice}
                                handleChange={this.handleChange}
                                tabselect={this.state.tabselect}
                                handleChangetab={this.handleChangetab}
                                handleChangeLabelTab={this.handleChangeLabelTab}
                                handlePagination={this.handlePagination}
                                deleteUnlinkDevice={this.props.deleteUnlinkDevice}
                                user={this.props.user}
                                refreshComponent={this.refreshComponent}
                                history={this.props.history}
                                showDateModal={this.showDateModal}
                            />
                            <ShowMsg
                                msg={this.props.msg}
                                showMsg={this.props.showMsg}
                            />
                        </Fragment>
                }
                <Modal
                    title="Extend expiry date"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    okText="Save"
                    onCancel={this.handleCancel}
                >
                    <div style={{ maringLeft: 20 }}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <Form.Item label="Start Date">
                                <DatePicker
                                    format="DD-MM-YYYY"
                                    defaultValue={moment(this.state.extendExpiryDevice.start_date)}
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item label="End Date">

                                <DatePicker
                                    format="DD-MM-YYYY"
                                    defaultValue={moment(this.state.extendExpiryDevice.expiry_date)}
                                    onChange={this.saveExpiryDate}
                                    disabledDate={this.disabledDate}
                                />
                            </Form.Item>

                        </Form>
                    </div>

                    {/* <RangePicker
                        format="YYYY-MM-DD"
                        defaultValue={[moment(this.state.start_date), moment(this.state.expiry_date)]}
                        disabledDate={this.disabledDate}
                        onChange={this.onChangeRangeDate}
                        // disabledTime={this.disabledRangeTime}
                    /> */}
                </Modal>
            </Fragment>
        );

    }


}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getOfflineDevices: getOfflineDevices,
        // saveOfflineDevice: saveOfflineDevice,
        // suspendDevice: suspendDevice,
        // activateDevice: activateDevice,
        statusDevice: statusDevice,
        editDevice: editDevice,
        getDropdown: getDropdown,
        postDropdown: postDropdown,
        postPagination: postPagination,
        getPagination: getPagination,
        getWhiteLabels: getWhiteLabels,
    }, dispatch);
}

var mapStateToProps = ({ devices, auth, sidebarMenu }) => {
    // console.log('devices AUTH', auth);
    //   console.log(devices.options,'devices OPTION', devices.selectedOptions);
    return {
        whiteLabels: sidebarMenu.whiteLabels,
        devices: devices.devices,
        msg: devices.msg,
        showMsg: devices.showMsg,
        options: devices.options,
        isloading: devices.isloading,
        selectedOptions: devices.selectedOptions,
        DisplayPages: devices.DisplayPages,
        user: auth.authUser,
        socket: auth.socket
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Devices)