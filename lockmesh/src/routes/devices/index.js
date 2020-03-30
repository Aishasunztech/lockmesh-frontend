// Libraries
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Highlighter from 'react-highlight-words';
import { Input, Button, Icon, Select, Modal } from "antd";

import { bindActionCreators } from "redux";

// Components
import AppFilter from '../../components/AppFilter';
import DevicesList from './components/DevicesList';
import CircularProgress from "components/CircularProgress/index";
import AddDevice from './components/AddDevice';
import ShowMsg from './components/ShowMsg';

// Actions
import {
    getDevicesList,
    suspendDevice,
    activateDevice,
    editDevice,
    rejectDevice,
    addDevice,
    preActiveDevice,
    deleteUnlinkDevice,
    getSimIDs,
    getChatIDs,
    getPGPEmails,
    resetProductAddProps,
    relinkDevice,
    unflagged,
    unlinkDevice,
    transferDeviceProfile,
    getDropdown,
    postDropdown
} from "../../appRedux/actions";

// Helpers
import {
    getStatus,
    componentSearch,
    titleCase,
    dealerColsWithSearch,
    convertToLang,
    checkValue,
    handleMultipleSearch,
    filterData_RelatedToMultipleSearch,
    checkIsArray
} from '../utils/commonUtils';

import { devicesColumns } from '../utils/columnsUtils';

// Constants
import {
    DEVICE_ACTIVATED,
    DEVICE_EXPIRED,
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_SUSPENDED,
    DEVICE_UNLINKED,
    ADMIN,
    DEVICE_TRIAL,
    DEVICE_TRANSFERED,
    DEVICE_FLAGGED,
    DEALER,

} from '../../constants/Constants'

import {
    Devices_Top_Bar,
    Appfilter_SelectAll,
    Appfilter_ShowDevices,
    Appfilter_SearchDevices,
    Dealer_Top_Bar,
    Appfilter_ShowDealer,
    Appfilter_SearchDealer,
    DEVICE_PAGE_HEADING,
} from '../../constants/AppFilterConstants';

import {
    Button_Add_Device, Button_Yes, Button_No
} from '../../constants/ButtonConstants'

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
} from '../../constants/TabConstants';

import {
    DEVICE_REMAINING_DAYS,
} from '../../constants/DeviceConstants';


import { Sidebar_devices, Sidebar_users_devices } from "../../constants/SidebarConstants";
const confirm = Modal.confirm

var copyDevices = [];
var status = true;
var selectOptionsStatus = true;

class Devices extends Component {
    constructor(props) {
        super(props);
        var columns = devicesColumns(props.translation, this.handleSearch);

        this.state = {
            sorterKey: '',
            sortOrder: 'ascend',
            columns: columns,
            searchText: '',
            devices: [],
            tabselect: '4',
            allDevices: this.props.devices,
            activeDevices: [],
            expireDevices: [],
            suspendDevices: [],
            trialDevices: [],
            preActiveDevices: [],
            pendingDevices: [],
            unlinkedDevices: [],
            filteredDevices: [],
            flaggedDevices: [],
            transferredDevices: [],
            copy_status: true,
            translation: {},
            SearchValues: [],
            globalSearchedValue: "",
            selectedOptions: [],
        }
        this.copyDevices = [];

        this.handleCheckChange = this.handleCheckChange.bind(this)
        // this.filterDevices = this.filterDevices.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleTableChange = (pagination, query, sorter) => {
        let { columns } = this.state;

        checkIsArray(columns).forEach(column => {
            if (column.children) {
                if (Object.keys(sorter).length > 0) {
                    if (column.dataIndex == sorter.field) {
                        if (this.state.sorterKey == sorter.field) {
                            column.children[0]['sortOrder'] = sorter.order;
                        } else {
                            column.children[0]['sortOrder'] = "ascend";
                        }
                    } else {
                        column.children[0]['sortOrder'] = "";
                    }
                    this.setState({ sorterKey: sorter.field });
                } else {
                    if (this.state.sorterKey == column.dataIndex) column.children[0]['sortOrder'] = "ascend";
                }
            }
        })
        this.setState({
            columns: columns
        });
    }

    deleteAllUnlinked = () => {
        alert('Its working')
    }

    // transferDeviceProfile = (obj) => {
    //     // 
    //     let _this = this;
    //     Modal.confirm({
    //         content: `Are you sure you want to Transfer, from ${obj.flagged_device.device_id} to ${obj.reqDevice.device_id} ?`, //convertToLang(_this.props.translation[ARE_YOU_SURE_YOU_WANT_TRANSFER_THE_DEVICE], "Are You Sure, You want to Transfer this Device"),
    //         onOk() {
    //             // 
    //             _this.props.transferDeviceProfile(obj);
    //         },
    //         onCancel() { },
    //         okText: convertToLang(this.props.translation[Button_Yes], 'Yes'),
    //         cancelText: convertToLang(this.props.translation[Button_No], 'No'),
    //     });
    // }

    filterList = (type, devices) => {
        let dumyDevices = [];

        if (type === DEVICE_FLAGGED) {
            // 
            checkIsArray(devices).filter(function (device) {
                if (device.finalStatus !== DEVICE_UNLINKED) {
                    // let deviceStatus = getStatus(device.status, device.account_status, device.unlink_status, device.device_status, device.activation_status);
                    let deviceStatus = device.flagged;
                    // 
                    if ((deviceStatus === 'Defective' || deviceStatus === 'Lost' || deviceStatus === 'Stolen' || deviceStatus === 'Other') && (device.finalStatus === "Flagged")) {
                        dumyDevices.push(device);
                    }
                }
            });
        } else {
            checkIsArray(devices).filter(function (device) {
                // let deviceStatus = getStatus(device.status, device.account_status, device.unlink_status, device.device_status, device.activation_status);
                let deviceStatus = device.finalStatus;
                if (deviceStatus === type) {
                    dumyDevices.push(device);
                }
            });
        }


        return dumyDevices;
    }

    handleChange(value) {
        // this.handleCheckChange(this.props.selectedOptions)
        // 

        // let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex === 'validity');
        let indxAction = this.state.columns.findIndex(k => k.dataIndex === 'action');
        if (value === DEVICE_UNLINKED && this.props.user.type === ADMIN) {
            //  indx = this.state.columns.findIndex(k => k.dataIndex =='action');
            if (indxAction >= 0) {
                this.state.columns.splice(indxAction, 1)

                // let indexTransfered = this.state.columns.findIndex(k => k.dataIndex === 'transfered_to');

                // if (indexTransfered >= 0 && indexTransfered !== undefined) {
                //     this.state.columns[indexTransfered].className = 'hide';
                //     this.state.columns[indexTransfered].children[0].className = 'hide';
                // }
            }
            //    

        } else {
            if (indxAction < 0) {
                this.state.columns.splice(1, 0, {
                    title: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >DELETE SELECTED</Button>,
                    dataIndex: 'action',
                    align: 'center',
                    className: 'row',
                    width: 800,

                })
            }
        }
        let activationCodeIndex = this.state.columns.findIndex(i => i.dataIndex === 'activation_code');
        let indexFlagged = this.state.columns.findIndex(k => k.dataIndex === 'flagged');
        if (value === DEVICE_UNLINKED && (this.props.user.type !== ADMIN)) {
            this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >DELETE SELECTED</Button>;
        }
        else if (value === DEVICE_PRE_ACTIVATION) {
            let isCheckedColumn = this.props.selectedOptions.findIndex((item) => { return item.key === "validity" });
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex === 'validity');
            // 
            if (indxAction >= 0) {
                // this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllPreActivedDevice('pre-active')} >DELETE SELECTED</Button>
            }
            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined && isCheckedColumn !== -1) {
                this.state.columns[indxRemainingDays].className = '';
                this.state.columns[indxRemainingDays].children[0].className = '';
            }
            else {
                this.state.columns[indxRemainingDays].className = 'hide';
                this.state.columns[indxRemainingDays].children[0].className = 'hide';
            }
            let activationCodeIndex = this.state.columns.findIndex(i => i.dataIndex === 'activation_code');
            if (activationCodeIndex >= 0) {
                this.state.columns.splice(2, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
            let indexFlagged = this.state.columns.findIndex(k => k.dataIndex === 'flagged');
            if (indexFlagged >= 0) {
                this.state.columns.splice(7, 0, this.state.columns.splice(indexFlagged, 1)[0]);
            }
        }
        else if (value === DEVICE_FLAGGED) {
            let indexFlagged = this.state.columns.findIndex(k => k.dataIndex === 'flagged');
            this.state.columns[1]['title'] = 'ACTION';

            if (indexFlagged > -1) {
                this.state.columns.splice(2, 0, this.state.columns.splice(indexFlagged, 1)[0]);
            }
            let activationCodeIndex = this.state.columns.findIndex(i => i.dataIndex === 'activation_code');
            if (activationCodeIndex >= 0) {
                this.state.columns.splice(11, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }

        } else {
            this.state.columns[1]['title'] = 'ACTION';

            let isCheckedColumn = this.props.selectedOptions.findIndex((item) => { return item.key === "validity" });
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex === 'validity');
            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined && isCheckedColumn !== -1) {
                this.state.columns[indxRemainingDays].className = 'hide';
                this.state.columns[indxRemainingDays].children[0].className = 'hide';
            }

            // if (indexTransfered > -1) {
            let indexTransfered = this.state.columns.findIndex(k => k.dataIndex === 'transfered_to');
            if (value === DEVICE_TRANSFERED) {
                isCheckedColumn = this.props.selectedOptions.findIndex((item) => { return item.key === "transfered_to" }); // item.key === "transfered_to"
                if (indexTransfered >= 0 && indexTransfered !== undefined && isCheckedColumn !== -1) {
                    this.state.columns[indexTransfered].className = '';
                    this.state.columns[indexTransfered].children[0].className = '';
                }
            }
            // else {
            //     this.state.columns[indexTransfered].className = 'hide';
            //     this.state.columns[indexTransfered].children[0].className = 'hide';
            // }
            // }

            // let indexTransfered = this.state.columns.findIndex(k => k.dataIndex === 'transfered_to');

            if (value === '8' || value === '1') {
                if (indexTransfered >= 0 && indexTransfered !== undefined && isCheckedColumn !== -1) {
                    this.state.columns[indexTransfered].className = '';
                    this.state.columns[indexTransfered].children[0].className = '';
                }
            } else {
                this.state.columns[indexTransfered].className = 'hide';
                this.state.columns[indexTransfered].children[0].className = 'hide';
            }

            if (activationCodeIndex >= 0) {
                this.state.columns.splice(11, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
            let indexFlagged = this.state.columns.findIndex(k => k.dataIndex === 'flagged');
            // this.state.columns[indexTransfered]['title'] = '';
            if (indexFlagged >= 0) {
                this.state.columns.splice(7, 0, this.state.columns.splice(indexFlagged, 1)[0]);
            }
            // if (value === DEVICE_PRE_ACTIVATION && this.props.user.type === ADMIN) {
            //     let actionIndex = this.state.columns.findIndex(i => i.dataIndex === 'action');
            //     if (actionIndex >= 0) {
            //         this.state.columns[actionIndex].className = 'hide';
            //     }
            // }
        }

        let devices = [];
        switch (value) {
            case DEVICE_ACTIVATED:
                devices = this.state.activeDevices;
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '4',
                    copy_status: true
                })

                break;
            case DEVICE_TRIAL:
                devices = this.state.trialDevices;
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '9',
                    copy_status: true
                })

                break;
            case DEVICE_SUSPENDED:
                devices = this.state.suspendDevices;
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '7',
                    copy_status: true
                })
                break;
            case DEVICE_TRANSFERED:
                // devices = this.state.transferredDevices;
                devices = this.filterList(DEVICE_TRANSFERED, this.props.devices);
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '8',
                    copy_status: true
                })
                break;
            case DEVICE_FLAGGED:
                // devices = this.state.flaggedDevices;
                devices = this.filterList(DEVICE_FLAGGED, this.props.devices);
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '10',
                    copy_status: true
                })
                break;
            case DEVICE_EXPIRED:
                devices = this.state.expireDevices;
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '6',
                    copy_status: true
                })
                break;
            case 'all':
                devices = this.state.allDevices;
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '1',
                    copy_status: true
                })
                break;
            case DEVICE_UNLINKED:
                // devices = this.state.unlinkedDevices;
                devices = this.filterList(DEVICE_UNLINKED, this.props.devices);
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '5',
                    copy_status: true
                })
                break;
            case DEVICE_PENDING_ACTIVATION:
                // alert(value);
                devices = this.state.pendingDevices;
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '2',
                    copy_status: true
                })
                break;
            case DEVICE_PRE_ACTIVATION:
                devices = this.state.preActiveDevices;
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '3',
                    copy_status: true
                })
                break;
            default:
                devices = this.state.allDevices;
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices,
                    filteredDevices: devices,
                    tabselect: '1'
                })
                break;
        }

    }

    /**
 * @description TO BE FIXED
 */

    handleChangetab = (value) => {
        // console.log("tab value: ", value);
        // this.handleCheckChange(this.props.selectedOptions);
        // 
        // 
        // let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
        let indxAction = this.state.columns.findIndex(k => k.dataIndex == 'action');
        // if (value == '5' && this.props.user.type == ADMIN) {
        if (value === '5') {
            //  indx = this.state.columns.findIndex(k => k.dataIndex =='action');
            if (indxAction >= 0) { this.state.columns.splice(indxAction, 1) }
            //    

        } else {
            if (indxAction < 0) {
                this.state.columns.splice(1, 0, {
                    // title: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >DELETE SELECTED</Button>,
                    title: 'ACTION',
                    dataIndex: 'action',
                    align: 'center',
                    className: 'row',
                    width: 800,

                })
            } else {
                this.state.columns[indxAction]['title'] = 'ACTION'
            }
        }
        let activationCodeIndex = this.state.columns.findIndex(i => i.dataIndex === 'activation_code');

        // if (value === '5' && (this.props.user.type !== ADMIN)) {
        //     this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >DELETE SELECTED</Button>;
        // }
        // else 
        if (value === '2' && (this.props.user.type === ADMIN)) {
            this.state.columns.splice(indxAction, 1)
        }
        else if (value === '3') {
            let isCheckedColumn = this.props.selectedOptions.findIndex((item) => { return item.key === "validity" });
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex === 'validity');
            // if (indxAction >= 0 && (this.props.user.type !== ADMIN)) {
            if (indxAction >= 0 && (this.props.user.type !== ADMIN)) {
                this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllPreActivedDevice('pre-active')} >DELETE SELECTED</Button>
            }
            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined && isCheckedColumn !== -1) { //  && isCheckedColumn !== -1
                this.state.columns[indxRemainingDays].className = '';
                this.state.columns[indxRemainingDays].children[0].className = '';
            }
            else {
                this.state.columns[indxRemainingDays].className = 'hide';
                this.state.columns[indxRemainingDays].children[0].className = 'hide';
            }
            // let activationCodeIndex = this.state.columns.findIndex(i => i.dataIndex === 'activation_code');
            if (activationCodeIndex >= 0) {
                this.state.columns.splice(2, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
            let indexFlagged = this.state.columns.findIndex(k => k.dataIndex === 'flagged');
            if (indexFlagged >= 0) {
                this.state.columns.splice(7, 0, this.state.columns.splice(indexFlagged, 1)[0]);
            }
        }
        else if (value === '10') {
            let indexFlagged = this.state.columns.findIndex(k => k.dataIndex === 'flagged');


            if (indexFlagged > -1) {
                this.state.columns.splice(2, 0, this.state.columns.splice(indexFlagged, 1)[0]);
            }
            // let activationCodeIndex = this.state.columns.findIndex(i => i.dataIndex === 'activation_code');
            if (activationCodeIndex >= 0) {
                this.state.columns.splice(11, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }

        } else {
            // this.state.columns[1]['title'] = 'ACTION';
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex === 'validity');
            if (value === '1') {
                // check column from dropdown, checked or not
                let isCheckedColumn = this.props.selectedOptions.findIndex((item) => { return item.key === "validity" });

                if (indxRemainingDays >= 0 && indxRemainingDays !== undefined && isCheckedColumn !== -1) {
                    this.state.columns[indxRemainingDays].className = '';
                    this.state.columns[indxRemainingDays].children[0].className = '';
                }
            } else {
                this.state.columns[indxRemainingDays].className = 'hide';
                this.state.columns[indxRemainingDays].children[0].className = 'hide';
            }


            let indexTransfered = this.state.columns.findIndex(k => k.dataIndex === 'transfered_to');
            let isCheckedColumn = this.props.selectedOptions.findIndex((item) => { return item.key === "transfered_to" }); // item.key === "transfered_to"
            // 

            if (value === '8' || value === '1') {
                if (indexTransfered >= 0 && indexTransfered !== undefined && isCheckedColumn !== -1) {
                    this.state.columns[indexTransfered].className = '';
                    this.state.columns[indexTransfered].children[0].className = '';
                }
            } else {
                this.state.columns[indexTransfered].className = 'hide';
                this.state.columns[indexTransfered].children[0].className = 'hide';
            }

            if (value === '1') {
                if (activationCodeIndex >= 0) {
                    this.state.columns.splice(11, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
                }
            }
            let indexFlagged = this.state.columns.findIndex(k => k.dataIndex === 'flagged');
            if (indexFlagged >= 0) {
                this.state.columns.splice(7, 0, this.state.columns.splice(indexFlagged, 1)[0]);
            }
        }

        var devices = [];
        switch (value) {
            case '4':
                devices = this.filterList(DEVICE_ACTIVATED, this.props.devices);
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    tabselect: '4',
                    filteredDevices: devices,
                    copy_status: true
                })
                break;
            case '9':
                devices = this.filterList(DEVICE_TRIAL, this.props.devices)
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '9',
                    copy_status: true
                })
                break;
            case '7':
                devices = this.filterList(DEVICE_SUSPENDED, this.props.devices);
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '7',
                    copy_status: true
                })
                break;
            case '6':
                devices = this.filterList(DEVICE_EXPIRED, this.props.devices)
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '6',
                    copy_status: true
                })
                break;
            case '1':
                devices = this.props.devices;
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '1',
                    copy_status: true
                })
                break;
            case "5":
                devices = this.filterList(DEVICE_UNLINKED, this.props.devices);
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '5',
                    copy_status: true
                })
                break;
            case "2":
                devices = this.filterList(DEVICE_PENDING_ACTIVATION, this.props.devices)
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '2',
                    copy_status: true
                })
                break;
            case "3":
                devices = this.filterList(DEVICE_PRE_ACTIVATION, this.props.devices)
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '3',
                    copy_status: true
                })
                break;
            case "8":
                devices = this.filterList(DEVICE_TRANSFERED, this.props.devices);
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '8',
                    copy_status: true
                })
                break;
            case "10":
                devices = this.filterList(DEVICE_FLAGGED, this.props.devices);
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: this.handleSearchOnTabChange(devices),
                    filteredDevices: devices,
                    tabselect: '10',
                    copy_status: true
                })
                break;
            default:
                devices = this.props.devices;
                devices = (this.state.globalSearchedValue === "") ? devices : this.handleGlobalSearch(devices);
                this.setState({
                    devices: devices,
                    filteredDevices: devices,
                    tabselect: '1',
                    copy_status: true
                })
                break;
        }
    }

    handleGlobalSearch(devices) {
        // 
        if (devices.length) {
            if (this.state.globalSearchedValue !== "") {
                status = true
                let foundDevices = componentSearch(devices, this.state.globalSearchedValue);
                if (foundDevices.length) {
                    devices = foundDevices
                } else {
                    devices = []
                }
            }
        }
        return devices
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
        // 
        let dumydata = this.state.columns;

        // 
        if (values.length) {
            this.state.columns.map((column, index) => {


                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                    if (dumydata[index].children) {
                        dumydata[index].children[0].className = 'hide';
                    }
                    // dumydata[]
                }
                // 
                values.map((value) => {
                    if (column.className !== 'row') {
                        if (column.dataIndex === value.key) {
                            if (this.state.tabselect !== '3' && this.state.tabselect !== '8') {
                                if (column.dataIndex !== 'validity' && column.dataIndex !== 'transfered_to') {
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
            // console.log("this.props.user ", this.props.user);
            if (this.props.user.type === ADMIN) {
                dumydata = checkIsArray(dumydata).filter(item => item.dataIndex !== 'activation_code');
            }
            this.setState({ columns: dumydata, selectedOptions: values });
        } else {

            const newState = this.state.columns.map((column) => {
                if (column.className === 'row') {
                    return column;
                } else {
                    column.children[0].className = 'hide';
                    return ({ ...column, className: 'hide' })
                }
            });

            this.setState({ columns: newState, selectedOptions: values });
        }
        // 
        this.props.postDropdown(values, 'devices');
        // this.props.getDropdown('devices');
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            let devicesList = []
            switch (this.state.tabselect) {
                case '4':
                    devicesList = this.filterList(DEVICE_ACTIVATED, this.props.devices);
                    break;
                case '9':
                    devicesList = this.filterList(DEVICE_TRIAL, this.props.devices);
                    break;
                case '7':
                    devicesList = this.filterList(DEVICE_SUSPENDED, this.props.devices);
                    break;
                case '6':
                    devicesList = this.filterList(DEVICE_EXPIRED, this.props.devices)
                    break;
                case '1':
                    devicesList = this.props.devices;
                    break;
                case "5":
                    devicesList = this.filterList(DEVICE_UNLINKED, this.props.devices)
                    break;
                case "2":
                    devicesList = this.filterList(DEVICE_PENDING_ACTIVATION, this.props.devices)
                    break;
                case "3":
                    devicesList = this.filterList(DEVICE_PRE_ACTIVATION, this.props.devices)
                    break;
                case "8":
                    // devicesList = this.state.transferredDevices
                    devicesList = this.filterList(DEVICE_TRANSFERED, this.props.devices);

                case "10":
                    // devicesList = this.state.flaggedDevices
                    devicesList = this.filterList(DEVICE_FLAGGED, this.props.devices);
                    break;
                default:
                    devicesList = this.filterList(DEVICE_ACTIVATED, this.props.devices);
                    break;
            }
            this.setState({
                translation: this.props.translation,
                devices: devicesList,
                columns: this.state.columns,
                defaultPagingValue: this.props.DisplayPages,
                selectedOptions: this.props.selectedOptions,
                allDevices: this.props.devices,
                activeDevices: this.filterList(DEVICE_ACTIVATED, this.props.devices),
                expireDevices: this.filterList(DEVICE_EXPIRED, this.props.devices),
                suspendDevices: this.filterList(DEVICE_SUSPENDED, this.props.devices),
                trialDevices: this.filterList(DEVICE_TRIAL, this.props.devices),
                preActiveDevices: this.filterList(DEVICE_PRE_ACTIVATION, this.props.devices),
                pendingDevices: this.filterList(DEVICE_PENDING_ACTIVATION, this.props.devices),
                unlinkedDevices: this.filterList(DEVICE_UNLINKED, this.props.devices),
                flaggedDevices: this.filterList(DEVICE_FLAGGED, this.props.devices),
                transferredDevices: this.filterList(DEVICE_TRANSFERED, this.props.devices),
            })
            this.handleChangetab(this.state.tabselect);
        }

        if (this.props.translation !== prevProps.translation) {
            this.setState({
                columns: devicesColumns(this.props.translation, this.handleSearch)
            })
        }

        if (this.props.selectedOptions !== prevProps.selectedOptions) {
            this.handleCheckChange(this.props.selectedOptions)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.translation !== nextProps.translation) {
            this.setState({
                translation: nextProps.translation
            })
        }

        // if (this.props.selectedOptions !== nextProps.selectedOptions) {
        //     this.handleCheckChange(nextProps.selectedOptions);
        //     this.setState({
        //         selectedOptions: nextProps.selectedOptions
        //     })
        // }
    }

    handlePagination = (value) => {
        //  alert(value);
        //  
        this.refs.devcieList.handlePagination(value);
        // this.props.postPagination(value, 'devices');
    }

    componentDidMount() {
        this.props.getDevicesList();
        this.props.getDropdown('devices');
        // this.props.getPagination('devices');
    }


    handleComponentSearch = (value) => {
        try {
            switch (this.state.tabselect) {
                case '4':
                    copyDevices = this.state.activeDevices
                    break;
                case '9':
                    copyDevices = this.state.trialDevices
                    break;
                case '7':
                    copyDevices = this.state.suspendDevices
                    break;
                case '6':
                    copyDevices = this.state.expireDevices
                    break;
                case '1':
                    copyDevices = this.state.allDevices;

                    break;
                case "5":
                    copyDevices = this.state.unlinkedDevices
                    break;
                case "2":
                    copyDevices = this.state.pendingDevices
                    break;
                case "3":
                    copyDevices = this.state.preActiveDevices
                    break;
                case "8":
                    copyDevices = this.state.transferredDevices
                    break;
                case "10":
                    copyDevices = this.state.flaggedDevices
                    break;
                default:
                    copyDevices = this.state.allDevices
                    break;
            }
            if (value.length) {

                // 
                let foundDevices = componentSearch(copyDevices, value);
                if (foundDevices.length) {
                    this.setState({
                        devices: foundDevices,
                        globalSearchedValue: value
                    })
                } else {
                    this.setState({
                        devices: [],
                        globalSearchedValue: value
                    })
                }
            } else {
                status = true;

                this.setState({
                    devices: copyDevices,
                    globalSearchedValue: ""
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
                placeholder={convertToLang(this.props.translation[Appfilter_ShowDevices], "Show Devices")}
                optionFilterProp="children"
                style={{ width: '100%' }}
                // filterOption={(input, option) => {
                //     return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                // }}
                onChange={this.handleChange}
            >

                <Select.Option value="all"> {convertToLang(this.props.translation[Tab_All], "All")} </Select.Option>
                <Select.Option value={DEVICE_ACTIVATED}> {convertToLang(this.props.translation[Tab_Active], "Active")}  </Select.Option>
                <Select.Option value={DEVICE_EXPIRED}> {convertToLang(this.props.translation[Tab_Expired], "Expired")} </Select.Option>
                <Select.Option value={DEVICE_TRIAL}> {convertToLang(this.props.translation[Tab_Trial], "Trial")}  </Select.Option>
                <Select.Option value={DEVICE_SUSPENDED}> {convertToLang(this.props.translation[Tab_Suspended], "Suspended")} </Select.Option>
                <Select.Option value={DEVICE_PRE_ACTIVATION}> {convertToLang(this.props.translation[Tab_PreActivated], "PreActivated")}  </Select.Option>
                <Select.Option value={DEVICE_PENDING_ACTIVATION}> {convertToLang(this.props.translation[Tab_PendingActivation], "PendingActivation")} </Select.Option>
                <Select.Option value={DEVICE_TRANSFERED}> {convertToLang(this.props.translation[Tab_Transfer], "Transfer")} </Select.Option>
                <Select.Option value={DEVICE_FLAGGED}> {convertToLang(this.props.translation[Tab_Flagged], "Flagged")} </Select.Option>
                <Select.Option value={DEVICE_UNLINKED}> {convertToLang(this.props.translation[Tab_Unlinked], "Unlinked")} </Select.Option>

            </Select>
        );
    }

    handleDeviceModal = (visible) => {
        let device = {};
        if (this.props.user.account_balance_status === 'suspended') {
            showSupendAccountWarning(this)
        } else {
            this.refs.add_device.showModal(device, (device) => {
                this.props.preActiveDevice(device);
            }, true);
        }
    }


    refreshComponent = () => {
        this.props.history.push('/devices');
    }
    convertedSelectedOptions = () => {
        if (this.props.selectedOption) {
            return this.props.selectedOption.map((item => {

            }))

        } else {
            return []
        }
    }


    render() {

        // 
        let type = this.props.user.type
        let styleType = {};
        if (type === ADMIN) {
            styleType = "devices_fix_card_admin"
        } else {
            styleType = "devices_fix_card_dealer"
        }
        // 
        return (
            <Fragment>
                {/* <Button type="danger" size="small" onClick={() => dealerColsWithSearch()}>Testing</Button> */}
                {
                    this.props.isloading ? <CircularProgress /> :
                        <Fragment>
                            <AppFilter

                                // provide page heading if you need
                                pageHeading={convertToLang(this.props.translation[Sidebar_users_devices], "Users & Devices")}

                                // column selection Dropdown props
                                handleFilterOptions={this.handleFilterOptions}
                                selectedOptions={this.props.selectedOptions}
                                options={this.props.options}
                                handleCheckChange={this.handleCheckChange}

                                // Searching
                                searchPlaceholder={convertToLang(this.props.translation[Appfilter_SearchDevices], "Search Devices")}
                                handleComponentSearch={this.handleComponentSearch}

                                // Pagination
                                defaultPagingValue={this.state.defaultPagingValue}
                                handlePagination={this.handlePagination}

                                // Add Button
                                AddDeviceModal={true}
                                addButtonText={convertToLang(this.props.translation[Button_Add_Device], "Add Device")}
                                isAddButton={this.props.user.type !== ADMIN}
                                disableAddButton={this.props.user.type === ADMIN}
                                // toLink="add-device"
                                handleDeviceModal={this.handleDeviceModal}
                                handleUserModal={this.handleUserModal}
                                locale={this.props.locale}
                                translation={this.state.translation}
                            />
                            <DevicesList
                                transferDeviceProfile={this.props.transferDeviceProfile}
                                onChangeTableSorting={this.handleTableChange}
                                devices={this.state.devices}
                                allDevices={this.state.allDevices}
                                activeDevices={this.state.activeDevices}
                                expireDevices={this.state.expireDevices}
                                suspendDevices={this.state.suspendDevices}
                                preActiveDevices={this.state.preActiveDevices}
                                pendingDevices={this.state.pendingDevices}
                                unlinkedDevices={this.state.unlinkedDevices}
                                flaggedDevices={this.state.flaggedDevices}
                                transferredDevices={this.state.transferredDevices}
                                trialDevices={this.state.trialDevices}
                                suspendDevice={this.props.suspendDevice}
                                activateDevice={this.props.activateDevice}
                                columns={this.state.columns}
                                rejectDevice={this.rejectDevice}
                                selectedOptions={this.props.selectedOptions}
                                ref="devcieList"
                                pagination={this.props.DisplayPages}
                                addDevice={this.props.addDevice}
                                editDevice={this.props.editDevice}
                                handleChange={this.handleChange}
                                tabselect={this.state.tabselect}
                                handleChangetab={this.handleChangetab}
                                handlePagination={this.handlePagination}
                                deleteUnlinkDevice={this.props.deleteUnlinkDevice}
                                user={this.props.user}
                                refreshComponent={this.refreshComponent}
                                history={this.props.history}
                                unflagged={this.props.unflagged}
                                translation={this.state.translation}
                                unlinkDevice={this.props.unlinkDevice}
                                styleType={styleType}
                                getSimIDs={this.props.getSimIDs}
                                getChatIDs={this.props.getChatIDs}
                                getPgpEmails={this.props.getPgpEmails}
                                resetProductAddProps={this.props.resetProductAddProps}
                                relinkDevice={this.props.relinkDevice}

                            />

                            <ShowMsg
                                msg={this.props.msg}
                                showMsg={this.props.showMsg}
                            />
                            <AddDevice ref="add_device" translation={this.state.translation} resetProductAddProps={this.props.resetProductAddProps} />
                        </Fragment>
                }
            </Fragment>
        );

    }


    handleSearch = (e) => {

        this.state.SearchValues[e.target.name] = { key: e.target.name, value: e.target.value };
        // 
        let response = handleMultipleSearch(e, this.state.copy_status, copyDevices, this.state.SearchValues, this.state.filteredDevices)

        // 
        this.setState({
            devices: response.demoData,
            SearchValues: response.SearchValues
        });
        this.state.copy_status = response.copy_status;
        copyDevices = response.copyRequireSearchData;


        // let demoDevices = [];
        // let demoSearchValues = this.state.SearchValues;
        // if (this.state.copy_status) {
        //     copyDevices = this.state.filteredDevices;
        //     this.state.copy_status = false;
        // }

        // let targetName = e.target.name;
        // let targetValue = e.target.value;

        // if (targetValue.length || Object.keys(demoSearchValues).length) {
        //     demoSearchValues[targetName] = { key: targetName, value: targetValue };
        //     this.state.SearchValues[targetName] = { key: targetName, value: targetValue };

        //     copyDevices.forEach((device) => {
        //         // 
        //         if ((typeof device[targetName]) === 'string' && device[targetName] !== null && device[targetName] !== undefined) {

        //             let searchColsAre = Object.keys(demoSearchValues).length;
        //             let searchDevices = 0;

        //             if (searchColsAre > 0) {
        //                 Object.values(demoSearchValues).forEach((data) => {

        //                     if (data.value == "") {
        //                         searchDevices++;
        //                     } else if (device[data.key]) {
        //                         if (device[data.key].toUpperCase().includes(data.value.toUpperCase())) {
        //                             searchDevices++;
        //                         }
        //                     }
        //                 })

        //                 if (searchColsAre === searchDevices) {
        //                     demoDevices.push(device);
        //                 }
        //             }
        //             else {
        //                 if (device[targetName].toUpperCase().includes(targetValue.toUpperCase())) {
        //                     demoDevices.push(device);
        //                 }
        //             }
        //         }
        //     });
        //     this.setState({
        //         devices: demoDevices,
        //         SearchValues: demoSearchValues
        //     })
        // } else {
        //     this.setState({
        //         devices: copyDevices,
        //         SearchValues: demoSearchValues
        //     })
        // }
    }


    handleSearchOnTabChange = (devices) => {

        let response = filterData_RelatedToMultipleSearch(devices, this.state.SearchValues);
        return response;

        // let searchedDevices = [];
        // let searchData = Object.values(this.state.SearchValues);
        // let searchColsAre = Object.keys(this.state.SearchValues).length;

        // if (searchColsAre) {
        //     devices.forEach((device) => {
        //         let searchDevices = 0;

        //         for (let search of searchData) {
        //             // 
        //             // 
        //             if (search.value == "") {
        //                 searchDevices++;
        //             } else if (device[search.key].toUpperCase().includes(search.value.toUpperCase())) {
        //                 searchDevices++;
        //             }

        //         }
        //         if (searchColsAre === searchDevices) {
        //             searchedDevices.push(device);
        //         }

        //     });
        //     return searchedDevices;
        // } else {
        //     return devices;
        // }
    }


}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDevicesList: getDevicesList,
        suspendDevice: suspendDevice,
        activateDevice: activateDevice,
        editDevice: editDevice,
        getDropdown: getDropdown,
        postDropdown: postDropdown,
        rejectDevice: rejectDevice,
        addDevice: addDevice,
        preActiveDevice: preActiveDevice,
        // postPagination: postPagination,
        // getPagination: getPagination,
        deleteUnlinkDevice: deleteUnlinkDevice,
        unflagged: unflagged,
        unlinkDevice: unlinkDevice,
        getSimIDs: getSimIDs,
        getChatIDs: getChatIDs,
        getPgpEmails: getPGPEmails,
        transferDeviceProfile: transferDeviceProfile,
        resetProductAddProps: resetProductAddProps,
        relinkDevice

    }, dispatch);
}

var mapStateToProps = ({ devices, auth, settings }) => {
    return {
        devices: devices.devices,
        msg: devices.msg,
        showMsg: devices.showMsg,
        options: settings.deviceOptions,
        isloading: devices.isloading,
        selectedOptions: devices.selectedOptions,
        DisplayPages: devices.DisplayPages,
        user: auth.authUser,
        socket: auth.socket,
        locale: settings.locale,
        translation: settings.translation
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Devices)


function showSupendAccountWarning(_this) {
    confirm({
        title: "Your account is past due, please make a payment of past due to bring your account up to date to use the ADD DEVICE feature.",
        okText: "PURCHASE CREDITS",
        onOk() {
            _this.props.history.push('/account')
        },
        onCancel() {

        },

    })
}