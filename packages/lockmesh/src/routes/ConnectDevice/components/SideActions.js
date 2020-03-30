import React, { Component, Fragment } from 'react';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, Button, message, Icon, Modal, Input, Tooltip, Progress, Select, Tabs, AutoComplete } from "antd";
import TableHistory from "./TableHistory";
import SuspendDevice from '../../devices/components/SuspendDevice';
import ActivateDevcie from '../../devices/components/ActivateDevice';
import { componentSearch, convertToLang, checkIsArray } from '../../utils/commonUtils';
import EditDevice from '../../devices/components/editDevice';
import FlagDevice from '../../ConnectDevice/components/flagDevice';
import WipeDevice from '../../ConnectDevice/components/wipeDevice';
import ImeiView from '../../ConnectDevice/components/ImeiView';
import DealerApps from "./DealerApps";
import PasswordForm from './PasswordForm';
import DeviceSettings from './DeviceSettings';
import Activity from './Activity';
import SimSettings from './SimSettings/index';
import PullApps from './PullApps';
import SimHistory from './SimSettings/SimHistory';
import NewDevice from '../../../components/NewDevices';
import ExtensionDropdown from './ExtensionDropdown';
import { resetProductAddProps } from '../../../appRedux/actions';
import {
    showHistoryModal,
    showSaveProfileModal,
    saveProfile,
    savePolicy,
    hanldeProfileInput,
    transferDeviceProfile,
    getDealerApps,
    loadDeviceProfile,
    showPushAppsModal,
    showPullAppsModal,
    applyPushApps,
    applyPullApps,
    writeImei,
    getActivities,
    hidePolicyConfirm,
    applyPolicy,
    applySetting,
    getProfiles,
    wipe,
    simHistory,
    handleChecked,
    resetPushApps,
    handleCheckedAllPushApps,
    transferHistory,
    getDeviceListConnectDevice,
    getDeviceBillingHistory
} from "../../../appRedux/actions/ConnectDevice";

import { getNewDevicesList } from "../../../appRedux/actions/Common";
import {
    rejectDevice,
    addDevice,
    getSimIDs,
    getChatIDs,
    getPGPEmails
} from '../../../appRedux/actions/Devices';
import {
    getNewCashRequests,
    getUserCredit,
    rejectRequest,
    acceptRequest
} from "../../../appRedux/actions/SideBar";


import {
    ADMIN, DEALER, SDEALER, SECURE_SETTING, PUSH_APP, PUSH_APP_TEXT, PULL_APPS_TEXT, PUSH, PULL, Profile_Info, SAVE_PROFILE_TEXT, PUSH_APPS_TEXT, SELECTED_APPS, SELECT_APPS, PROCEED_WITH_WIPING_THE_DEVICE, Name, SEARCH_APPS, WARNING
} from "../../../constants/Constants";


import { PUSH_APPS, PULL_APPS, POLICY, PROFILE } from "../../../constants/ActionTypes"
import {
    Button_Push, Button_LoadProfile, Button_LoadPolicy, Button_IMEI, Button_Pull, Button_SaveProfile,
    Button_Activity, Button_SIM, Button_Transfer, Button_WipeDevice, Button_Unlink, Button_Edit, Button_Suspend,
    Button_Unsuspend, Button_Flag, Button_UNFLAG, Button_Save, Button_Cancel, Button_Ok, Button_Apply, Button_Back,
    Button_Yes, Button_No
} from '../../../constants/ButtonConstants';
import {
    DEVICE_ID,
    SETTINGS_TO_BE_SENT_TO_DEVICE,
    ARE_YOU_SURE_YOU_WANT_TRANSFER_THE_DEVICE,
    WIPE_DEVICE_DESCRIPTION,
    DO_YOU_REALLY_WANT_TO_UNFLAG_THE_DEVICE,
    DO_YOU_WANT_TO_APPLY,
    POLICY_ON_DEVICE,
    ENTER,
    DO_YOU_REALLY_WANT_TO_WIPE_THE_DEVICE,
    ARE_YOU_SURE_YOU_WANT_UNLINK_THE_DEVICE,
    SIM_SETTINGS,
    SIM_HISTORY,
} from "../../../constants/DeviceConstants";

import TransferHistory from './TransferModule/TransferHistory'
import Services from './Services';
import DeviceBillingHistory from './DeviceBillingHistory';
import { generateGraceDaysReport } from "../../../appRedux/actions";

const confirm = Modal.confirm;
var coppyList = [];
var coppyAppList = [];
var status = true;
var appStatus = true;

const { Option } = Select;

class PasswordModal extends Component {
    render() {
        return (
            <Modal
                // closable={false}
                maskClosable={false}
                style={{ top: 20 }}
                width="330px"
                className="push_app"
                title=""
                visible={this.props.pwdConfirmModal}
                footer={false}
                onOk={() => {
                }}
                onCancel={() => {
                    this.props.showPwdConfirmModal(false, this.props.actionType)
                    this.refs.pswdForm.resetFields()
                }
                }
                okText={convertToLang(this.props.translation[PUSH_APPS_TEXT], "Push Apps")}
                cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
            >
                <PasswordForm
                    checkPass={this.props.checkPass}
                    actionType={this.props.actionType}
                    handleCancel={this.props.showPwdConfirmModal}
                    translation={this.props.translation}
                    ref='pswdForm'
                />
            </Modal >
        )
    }
}

const PushAppsModal = (props) => {
    // console.log('push app modal', props)
    return (
        <Modal
            maskClosable={false}
            destroyOnClose={true}
            style={{ top: 20 }}
            width="780px"
            title={
                <div className="pp_popup">{convertToLang(props.translation[SELECT_APPS], "Select Apps ")}
                    <Input.Search
                        name="push_apps"
                        key="push_apps"
                        id="push_apps"
                        className="search_heading1"
                        onKeyUp={
                            (e) => {
                                props.handleComponentSearch(e.target.value, 'push_apps')
                            }
                        }
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[SEARCH_APPS], "Search Apps")}
                    />
                    <br />{`${convertToLang(props.translation[DEVICE_ID], "DEVICE ID")}:`}  {props.device.device_id}
                </div>}
            visible={props.pushAppsModal}
            onOk={() => {
                if (props.selectedPushAppKeys.length) {
                    props.showPushAppsModal(false);
                    props.showSelectedPushAppsModal(true);
                }
            }}
            okButtonProps={{ disabled: !props.isSelectPushApps }}
            onCancel={() => { props.showPushAppsModal(false, 'clear'); props.resetSelectedRows(); props.resetPushApps() }}
            okText={convertToLang(props.translation[PUSH_APP_TEXT], "PUSH APP")}
            cancelText={convertToLang(props.translation[Button_Cancel], "Cancel")}
        ><div>
                <ExtensionDropdown
                    checked_app_id={null}
                    encryptedAll={props.encryptedAllPushApps}
                    guestAll={props.guestAllPushApps}
                    enableAll={props.enableAllPushApps}
                    handleCheckedAllPushApps={props.handleCheckedAllPushApps}
                    translation={props.translation}
                    isPushAppsModal={true}
                />
                <DealerApps
                    apk_list={props.apk_list}
                    app_list={props.app_list}
                    onPushAppsSelection={props.onPushAppsSelection}
                    isSwitchable={true}
                    selectedApps={props.selectedPushApps}
                    selectedAppKeys={props.selectedPushAppKeys}
                    handleChecked={props.handleChecked}
                    translation={props.translation}
                // disabledSwitch = {false}
                />
            </div>
        </Modal>
    )
}

const SelectedPushApps = (props) => {

    return (
        <Modal
            maskClosable={false}
            style={{ top: 20 }}
            width="650px"
            title={
                <div>
                    {convertToLang(props.translation[SELECTED_APPS], "Selected Apps ")}
                    <br />
                    {convertToLang(props.translation[DEVICE_ID], "DEVICE ID: ")}
                    {props.device.device_id}
                </div>
            }
            visible={props.selectedAppsModal}
            onOk={() => {
                let data = [];
                for (let app of props.apk_list) {
                    let isAvailable = props.selectedAppKeys !== undefined ? (props.selectedAppKeys.length) ? props.selectedAppKeys.find(el => (el === app.apk_id) ? true : false) : false : false;
                    if (isAvailable) {
                        data.push(app);
                    }
                }

                // console.log(props.apk_list, 'submited', data)

                props.applyPushApps(data);
                props.showSelectedPushAppsModal(false);
                props.hidePushAppsModal(false)
                props.showPullAppsModal(false)
                props.resetSelectedRows()
                props.resetPushApps()
            }}
            // onCancel={() => { props.showSelectedAppsModal(false); props.resetSelectedRows() }}
            onCancel={() => {
                props.actionType == PUSH_APPS ? props.showPushAppsModal(true) : props.showPullAppsModal(true);
                props.showSelectedPushAppsModal(false);
            }}
            // cancelText='Back'
            cancelText={convertToLang(props.translation[Button_Back], "Back")}
            okText={convertToLang(props.translation[PUSH_APP_TEXT], "PUSH APP")}
            destroyOnClose={true}
        >
            <DealerApps
                apk_list={props.apk_list}
                isSwitchable={false}
                selectedAppKeys={props.selectedAppKeys}
                selectedApps={props.selectedPushApps}
                type='push'
                // buttonText={props.actionType == PUSH_APPS ? convertToLang(props.translation[PUSH], PUSH) : convertToLang(props.translation[PULL], PULL)}
                disabledSwitch={true}
                translation={props.translation}
                onlyShowSelected={props.onlyShowSelected}
            />
        </Modal>
    )
}

const PullAppsModal = (props) => {
    // onPullAppsSelection

    return (
        <Modal
            maskClosable={false}
            destroyOnClose={true}
            style={{ top: 20 }}
            width="650px"
            title={
                <div className="pp_popup">{convertToLang(props.translation[SELECT_APPS], "Select Apps")}
                    <Input.Search
                        name="pull_apps"
                        key="pull_apps"
                        id="pull_apps"
                        className="search_heading1"
                        onKeyUp={
                            (e) => {
                                props.handleComponentPullSearch(e.target.value, props.app_list)
                            }
                        }
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[SEARCH_APPS], "Search Apps")}
                    />
                    <br />
                    {`${convertToLang(props.translation[DEVICE_ID], "DEVICE ID")}:`} {props.device.device_id}
                </div>
            }
            visible={props.pullAppsModal}
            onOk={() => {
                if (props.selectedPullAppKeys && props.selectedPullAppKeys.length) {
                    props.showPullAppsModal(false);
                    props.showSelectedPullAppsModal(true);
                }
            }}
            onCancel={() => { props.showPullAppsModal(false); props.resetSelectedRows(); }}
            // okText="Pull Apps"
            okButtonProps={{ disabled: !props.isSelectPullApps }}
            okText={convertToLang(props.translation[PULL_APPS_TEXT], "PULL APP")}
            cancelText={convertToLang(props.translation[Button_Cancel], "Cancel")}
        >
            <PullApps
                app_list={props.app_list}
                onPullAppsSelection={props.onPullAppsSelection}
                isSwitchable={true}
                selectedPullApps={props.selectedPullApps}
                selectedPullAppKeys={props.selectedPullAppKeys}
                translation={props.translation}

            />
        </Modal>
    )

}


const SelectedPullApps = (props) => {
    return (
        <Modal
            maskClosable={false}
            style={{ top: 20 }}
            width="650px"
            title={<div>{convertToLang(props.translation[SELECTED_APPS], "Selected Apps ")} <br /> {convertToLang(props.translation[DEVICE_ID], "DEVICE ID: ")} {props.device.device_id} </div>}
            visible={props.selectedPullAppsModal}
            onOk={() => {
                props.applyPullApps(props.app_list);
                props.showSelectedPullAppsModal(false);
                props.showPushAppsModal(false)
                props.showPullAppsModal(false)
                props.resetSelectedRows()
            }}
            onCancel={() => {
                props.showPullAppsModal(true);
                props.showSelectedPullAppsModal(false);
            }}
            // cancelText='Back'
            cancelText={convertToLang(props.translation[Button_Back], "Back")}
            okText={convertToLang(props.translation[PULL_APPS_TEXT], "PULL APPS")}
            destroyOnClose={true}
        >
            <PullApps
                app_list={props.app_list}

                isSwitchable={false}
                selectedPullApps={props.selectedPullApps}
                type='pull'
                translation={props.translation}

            />
        </Modal>
    )
}

class SideActions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            servicesModal: false,
            showSimModal: false,
            pullAppsModal: false,
            pushAppsModal: false,
            historyModal: false,
            saveProfileModal: false,
            pwdConfirmModal: false,
            historyType: "history",
            saveProfileType: '',
            profileName: '',
            policyName: '',
            disabled: false,
            actionType: PUSH_APPS,

            apk_list: [],
            app_list: [],

            selectedPushAppsModal: false,
            selectedPushAppKeys: [],
            pushApps: [],
            selectedPushApps: [],

            selectedPullAppsModal: false,
            selectedPullAppKeys: [],
            pullApps: [],
            selectedPullApps: [],

            activities: [],
            searchedValue: '',
            device_list: [],
            disabledSearchButton: true,

            policyId: '',
            showChangesModal: false,
            applyPolicyConfirm: false,
            isSaveProfileBtn: false,
            transferHistoryModal: false,
            changedCtrls: [],
            guestAllPushApps: props.guestAllPushApps,
            enableAllPushApps: props.enableAllPushApps,
            encryptedAllPushApps: props.encryptedAllPushApps,
            // DEVICE_TRANSFERED_DONE: 'not transfer',

            pushApkSeachText: ''
        }
        this.otpModalRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.device_id) {
            this.props.simHistory(this.props.device_id);
        }
        this.props.getNewDevicesList();
        this.props.getDeviceListConnectDevice()

        this.setState({
            historyModal: this.props.historyModal,
            applyPolicyConfirm: this.props.applyPolicyConfirm,
            saveProfileModal: this.props.saveProfileModal,
            historyType: this.props.historyType,
            saveProfileType: this.props.saveProfileType,
            profileName: this.props.profileName,
            activities: this.props.activities,
            changedCtrls: this.props.changedCtrls,
            isSaveProfileBtn: this.props.isSaveProfileBtn,
            apk_list: this.props.apk_list,
            app_list: this.props.app_list,

            // selectedApps: this.props.apk_list
        });


    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.apk_list, 'reciceve apk list', this.props.apk_list)
        if (this.props !== nextProps) {
            // console.log(nextProps.apk_list, 'reciceve apk list')
            this.setState({
                historyModal: nextProps.historyModal,
                applyPolicyConfirm: nextProps.applyPolicyConfirm,
                saveProfileModal: nextProps.saveProfileModal,
                historyType: nextProps.historyType,
                saveProfileType: nextProps.saveProfileType,
                profileName: nextProps.profileName,
                pullAppsModal: nextProps.pullAppsModal,
                activities: nextProps.activities,
                isSaveProfileBtn: nextProps.isSaveProfileBtn,
                apk_list: nextProps.apk_list,
                app_list: nextProps.app_list,
                dump_apks: JSON.parse(JSON.stringify(nextProps.apk_list)),
                guestAllPushApps: nextProps.guestAllPushApps,
                enableAllPushApps: nextProps.enableAllPushApps,
                encryptedAllPushApps: nextProps.encryptedAllPushApps
                // selectedApps: nextProps.apk_list
            })
        }

        if (this.props.pathname !== nextProps.pathname) {
            this.props.getNewDevicesList();
            // this.props.getNewCashRequests();
            // this.props.getUserCredit()
        }

        if (this.props.simDeleted != nextProps.simDeleted) {
            this.props.simHistory(this.props.device_id);
        }

        if (nextProps.applyPolicyConfirm) {
            showConfirmPolcy(this)
        }

        if (this.props.wipeDevieStatus != nextProps.wipeDevieStatus) {
            showConfirm1(nextProps, this.props.device, convertToLang(this.props.translation[DO_YOU_REALLY_WANT_TO_WIPE_THE_DEVICE], "Do you really want to Wipe the device ") + this.props.device.device_id + "?")
        }

        // console.log("will receive props: ", nextProps.apk_list, this.state.pushApkSeachText)
        if (nextProps.pushAppsModal) {
            this.handleComponentSearch(this.state.pushApkSeachText, 'push_apps');
        }
    }

    showHistoryModal = (visible, type) => {
        if (((type !== undefined) || type === "" || type === null) && visible === false) {
            this.props.showHistoryModal(visible);
        } else {
            this.props.showHistoryModal(visible, type);
        }
    }

    showSaveProfileModal = (visible, profileType = '') => {
        this.props.showSaveProfileModal(visible, profileType);
    }

    showPwdConfirmModal = (visible, actionType = PUSH_APPS) => {
        // alert('hello');
        this.setState({
            pwdConfirmModal: visible,
            actionType: actionType,
            selectedApps: JSON.parse(JSON.stringify(this.state.apk_list)),
        })
    }

    showSelectedPushAppsModal = (visible) => {
        let dumyList = [];
        if (this.state.selectedPushAppKeys.length && this.state.selectedPushApps.length) {

            for (let app of this.state.selectedPushApps) {
                if (this.state.selectedPushAppKeys.includes(app.apk_id)) {
                    dumyList.push(app)
                }
            }
        }
        this.setState({
            selectedPushAppsModal: visible,
            pushApps: dumyList,
            pushApkSeachText: ''
        })
    }

    showSelectedPullAppsModal = (visible) => {

        let dumyList = [];
        if (this.state.selectedPullAppKeys.length && this.state.selectedPullApps.length) {
            for (let app of this.state.selectedPullApps) {
                // console.log(app)
                if (this.state.selectedPullAppKeys.includes(app.app_id)) {
                    dumyList.push(app)
                }
            }
        }
        this.setState({
            selectedPullAppsModal: visible,
            pullApps: dumyList
        })
    }

    handleChange = (value) => {
        // console.log(`selected ${value}`);
    }

    onInputChange = (e) => {
        this.setState({
            profileName: e.target.value
        })

    }

    saveProfile = () => {

        if (this.state.saveProfileType === "profile" && this.state.profileName !== '') {
            // let exts = [];
            // if (this.props.extensions.length) {
            //     // console.log('saved profile will be', this.props.extensions);
            //     for (let extension of this.props.extensions) {
            //         if (extension.uniqueName === SECURE_SETTING) {
            //             exts = extension
            //             //   console.log(exts, 'sddsdsdsdsdsdsdsd')
            //         }
            //     }
            // }

            this.props.saveProfile(this.props.app_list, {
                adminPwd: this.props.adminPwd,
                guestPwd: this.props.guestPwd,
                encryptedPwd: this.props.encryptedPwd,
                duressPwd: this.props.duressPwd,
            }, this.state.profileName, this.props.usr_acc_id, this.props.controls, this.props.extensions);
        } else if (this.state.saveProfileType === "policy" && this.state.policyName !== '') {
            this.props.savePolicy(this.props.app_list,
                {
                    adminPwd: this.props.adminPwd,
                    guestPwd: this.props.guestPwd,
                    encryptedPwd: this.props.encryptedPwd,
                    duressPwd: this.props.duressPwd,
                }, this.state.saveProfileType, this.state.policyName, this.props.usr_acc_id);
        }
        this.showSaveProfileModal(false);
        this.props.getProfiles(this.props.device.device_id)
    }
    // transferDeviceProfile = (obj) => {
    //     // console.log('at transferDeviceProfile')
    //     let _this = this;
    //     confirm({ // Are You Sure, You want to Transfer Flagged Device to this Requested Device ?
    //         content: `Are you sure you want to Transfer, from ${obj.flagged_device.device_id} to ${obj.reqDevice.device_id} ?`, //convertToLang(_this.props.translation[ARE_YOU_SURE_YOU_WANT_TRANSFER_THE_DEVICE], "Are You Sure, You want to Transfer this Device"),
    //         onOk() {
    //             // console.log('OK');
    //             _this.props.transferDeviceProfile(obj);
    //             // {
    //             //     reqDevice: device,
    //             //     flagged_device: _this.props.device_details,
    //             // }
    //             // _this.setState({ DEVICE_TRANSFERED_DONE: new Date() })

    //         },
    //         onCancel() {
    //             // console.log('Cancel');
    //         },
    //         okText: convertToLang(this.props.translation[Button_Yes], 'Yes'),
    //         cancelText: convertToLang(this.props.translation[Button_No], 'No'),
    //     });
    // }

    handleSimModule = (e) => {
        e.preventDefault();
        // console.log('test sim module');

        this.setState({
            showSimModal: true
        })
    }

    handleComponentSearch = (value, label) => {
        try {
            let updatedApkList = this.props.apk_list;
            // console.log(value, 'value')
            if (value && value.length) {

                let foundList = componentSearch(updatedApkList, value);
                // console.log('found devics', foundList)
                if (foundList.length) {
                    updatedApkList = foundList;
                } else {
                    updatedApkList = [];
                }
            }
            this.setState({
                apk_list: updatedApkList,
                pushApkSeachText: value
            })
        } catch (error) {
        }
    }

    handleComponentPullSearch = (value, app_list) => {
        try {
            // console.log(value, 'value & label', label)
            // console.log('apk_list ', this.props.apk_list);
            // console.log('app_list ', app_list);
            if (value.length) {
                // console.log(value, 'value')
                if (appStatus) {
                    // console.log('status')
                    coppyAppList = app_list // renderApps(this.props.apk_list); // this.props.app_list;
                    appStatus = false;
                }
                // console.log(renderApps(this.props.apk_list), 'coppyAppList ::', coppyAppList)
                let foundList = componentSearch(coppyAppList, value);
                // console.log('found devics', foundList)
                if (foundList.length) {
                    this.setState({
                        app_list: foundList,
                    })
                } else {
                    this.setState({
                        app_list: []
                    })
                }
            } else {
                appStatus = true;

                this.setState({
                    app_list: coppyAppList,
                })
            }
        } catch (error) {
        }
    }


    showPushAppsModal = (visible) => {
        // console.log(this.state.apk_list, 'working')

        if (visible) {
            this.setState({
                pushAppsModal: visible,
                selectedApps: this.state.apk_list
            })
        } else {
            this.setState({
                // apk_list: JSON.parse(JSON.stringify(this.state.dump_apks)),
                pushAppsModal: visible,
                selectedApps: JSON.parse(JSON.stringify(this.state.dump_apks)),
            })
        }
    }

    showPullAppsModal = (visible) => {
        this.setState({
            pullAppsModal: visible,
        })
    }

    onCancelModel = () => {
        this.setState({
            selectedPushAppKeys: [],
            selectedPullAppKeys: [],
            pushApps: [],
            pullApps: []
        })
    }


    onPushAppsSelection = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedPushApps: selectedRows,
            selectedPushAppKeys: selectedRowKeys
        })

    }

    onPullAppsSelection = (selectedRowKeys, selectedRows) => {

        this.setState({
            selectedPullApps: selectedRows,
            selectedPullAppKeys: selectedRowKeys
        })
    }

    handleSimHistory = () => {
        this.refs.history_sim.showModal();
    }

    // handleChecked = (e, key, app_id) => {
    //     this.state.apk_list.map((el) => {
    //         if (el.apk_id === app_id) {
    //             el[key] = e;
    //         }
    //     })
    // }

    handleFlag(flagged) {

        // console.log('-----', this.props.device_details)
        // console.log('-----', this.props.device_details.finalStatus == "Transfered")
        // transfer_user_status
        if (this.props.device_details.finalStatus == "Transfered") {
            showConfirm(this.props.device, this.props.unlinkDevice, this, convertToLang(this.props.translation[""], "Do you really want to unlink the transfered device "), 'unlink', true)
        } else {
            if (flagged === 'Unflag') {
                showConfirm(this.props.device, this.props.unflagged, this, convertToLang(this.props.translation[DO_YOU_REALLY_WANT_TO_UNFLAG_THE_DEVICE], 'Do you really want to unflag the device '), 'flagged')
            } else {
                this.refs.flag_device.showModel(this.props.device, this.props.flagged, this.props.refreshDevice)
            }
        }
    }

    handleTransfer = () => {
        // console.log('hi');

        this.props.getNewDevicesList();
        this.refs.new_device.showModal(false);
    }


    applyHistory = (historyId, name = '', history) => {
        const historyType = this.state.historyType;
        if (historyType === 'history') {

        } else if (historyType === "profile") {
            showConfirmProfile(this, name, history)
            this.props.showHistoryModal(false);
        } else if (historyType === POLICY) {

            this.showPwdConfirmModal(true, POLICY)
            this.props.showHistoryModal(false);
            this.setState({
                policyId: historyId,
                policyName: name,
                historyModal: false
            })
        }
    }


    applyPushApps = (apps) => {
        this.props.applyPushApps(apps, this.props.device_id, this.props.usr_acc_id);
        this.setState({ selectedApps: [], selectedAppKeys: [], })
        this.props.resetPushApps();
        this.props.getActivities(this.props.device_id)
    }


    applyPullApps = () => {
        this.props.applyPullApps(this.state.pullApps, this.props.device_id, this.props.usr_acc_id);
        this.setState({ selectedApps: [], selectedAppKeys: [], })
        this.props.getActivities(this.props.device_id)
    }

    resetSelectedRows = () => {
        // console.log('table ref')
        this.setState({
            selectedPushAppKeys: [],
            selectedPullAppKeys: [],
            selectedPushApps: [],
            selectedPullApps: [],
            apk_list: this.props.apk_list
        })
    }

    handleTransferHistoryModal = (visible) => {
        if (this.props.device_details.device_id) {
            this.props.transferHistory(this.props.device_details.device_id);
        }
        this.setState({
            transferHistoryModal: visible,
        })
    }

    // transferHistoryModal = (flagged, device_id) => {
    //     console.log('hi', this.otpModalRef)
    //     // this.otpModalRef.showModal(flagged, device_id);
    //     this.setState({
    //         transferHistoryModal: true,
    //     })
    // }



    handleSearch = (value) => {
        let searchedDevices = [];
        // console.log("searchedValue: ",value)
        searchedDevices = checkIsArray(this.props.device_list).filter((device) => device.device_id.toLowerCase().includes(value.toLowerCase()));
        // console.log(searchedDevices);
        let index = this.props.device_list.findIndex((device) => device.device_id.toLowerCase() === value.toLowerCase());
        let states = {
            device_list: value ? searchedDevices : [],
            searchedValue: value
        }

        if (index === -1) {
            states.disabledSearchButton = true;
        } else {
            states.disabledSearchButton = false
        }

        this.setState({
            ...states
        });
    }

    showPushAppsModal_ = (visible) => {
        this.props.showPushAppsModal(visible);
        // this.props.resetPushApps();
        this.setState({
            pushAppsModal: visible,
            selectedApps: this.state.apk_list,
        })
    }

    handleServicesModal = (visible) => {
        // if (this.props.device_details.device_id && visible) {
        //     this.props.getServices(this.props.device_details.device_id);
        // }
        if (visible) {
            this.props.getDeviceBillingHistory(this.props.device_details.id, this.props.device_details.dealer_id)
        }
        console.log("this.props.device_details ", this.props.device_details);
        this.setState({
            servicesModal: visible,
        })
    }
    handleDeviceChange = (e) => {
        if (e) {
            let path = `${btoa(e)}`.trim()
            this.props.history.push(path)
        }
    }

    handleDeviceButtonClick = (e) => {
        if (this.state.searchedValue) {
            let path = `${btoa(this.state.searchedValue)}`.trim()
            this.props.history.push(path)
        }
    }
    render() {
        // console.log(this.state.app_list, 'device is: ', this.props.app_list)
        const device_status = (this.props.device.account_status === "suspended") ? "Unsuspend" : "suspended";
        const button_type = (device_status === "Unsuspend") ? "dashed" : "danger";
        const flaggedButtonText = (this.props.device.flagged !== 'Not flagged') ? convertToLang(this.props.translation[Button_UNFLAG], "UNFLAG") : convertToLang(this.props.translation[Button_Flag], "Flag");
        const flagged = ((this.props.device.flagged !== 'Not flagged') ? 'Unflag' : 'flag')
        const { device_list } = this.state;
        return (
            <div className="gutter-box bordered">
                <Card className="search_dev_id">
                    <Row gutter={16} type="flex" justify="center" align="top">
                        <Col span={24} className="gutter-row" justify="center" >
                            <h4 className="mb-6">Search Device ID</h4>
                            <AutoComplete
                                className="global-search"
                                size="large"
                                style={{ width: '100%' }}
                                dataSource={checkIsArray(device_list).map((item, index) => {
                                    return (<Option key={index} value={item.device_id}>{item.device_id + ' (' + item.finalStatus + ')'}</Option>)
                                })}
                                onSelect={this.handleDeviceChange}
                                onSearch={this.handleSearch}
                                placeholder={convertToLang(this.props.translation[""], "Select Device ID")}
                                optionLabelProp="text"
                            >
                                <Input
                                    suffix={
                                        <Button
                                            className="search-btn"
                                            style={{ marginRight: -12 }}
                                            size="large"
                                            type="primary"
                                            onClick={this.handleDeviceButtonClick}
                                            disabled={this.state.disabledSearchButton}

                                        >
                                            <Icon type="search" />
                                        </Button>
                                    }
                                />
                            </AutoComplete>

                        </Col>
                    </Row>
                </Card>
                <div className="gutter-example side_action">
                    <Card>
                        <Row gutter={16} type="flex" justify="center" align="top">
                            <Col
                                span={12}
                                className="gutter-row"
                                justify="center"
                            >
                                <Button
                                    type="default"
                                    placement="bottom"
                                    style={{ width: "100%", marginBottom: 16 }}
                                    onClick={() => this.showPwdConfirmModal(true, PUSH_APPS)}
                                    disabled={((this.props.authUser.type === ADMIN || this.props.authUser.type === DEALER) && this.props.device_details.finalStatus !== "Transfered") ? false : true}
                                >
                                    <Icon type="lock" className="lock_icon" />
                                    <Icon type='upload' />

                                    {/* <IntlMessages id="button.Push" /> */}
                                    {convertToLang(this.props.translation[Button_Push], "Push")}
                                </Button>
                                <Button
                                    // disabled
                                    type="primary"
                                    style={{ width: "100%", marginBottom: 16 }}
                                    onClick={() => this.showHistoryModal(true, "profile")}
                                    disabled={(this.props.device_details.finalStatus == "Transfered") ? true : false}
                                >
                                    <Icon type="select" />

                                    {/* <IntlMessages id="button.LoadProfile" /> */}
                                    {convertToLang(this.props.translation[Button_LoadProfile], "Load Profile")}
                                </Button>
                                <Button
                                    type="default"
                                    className="btn_break_line"
                                    onClick={() => this.showHistoryModal(true, "policy")}
                                    disabled={(this.props.device_details.finalStatus == "Transfered") ? true : false}
                                    style={{ width: "100%", marginBottom: 16, backgroundColor: '#009700', color: '#fff' }}
                                >
                                    <Icon type="lock" className="lock_icon" />

                                    {/* <IntlMessages id="button.  /> */}
                                    {convertToLang(this.props.translation[Button_LoadPolicy], "Load Policy")}
                                </Button>
                                <Button
                                    onClick={() => this.refs.imeiView.showModal(this.props.device)}
                                    type="default"
                                    style={{ width: "100%", marginBottom: 16, background: "#eed9c4", color: "#555", border: "1px solid #eab886" }}
                                    disabled={(this.props.device_details.finalStatus == "Transfered") ? true : false}
                                >
                                    {/* <Icon type="number" /> */}

                                    {/* <IntlMessages id="button.IMEI" /> */}
                                    {convertToLang(this.props.translation[Button_IMEI], "IMEI")}
                                </Button>
                            </Col>
                            <Col
                                span={12}
                                className="gutter-row"
                                justify="center"
                            >
                                {/* <Tooltip placement="bottom" title="Coming Soon"> */}
                                <Button
                                    type="default"
                                    style={{ width: "100%", marginBottom: 16 }}
                                    onClick={() => this.showPwdConfirmModal(true, PULL_APPS)}
                                    disabled={(this.props.authUser.type === ADMIN && this.props.device_details.finalStatus !== "Transfered") ? false : true}
                                >
                                    <Icon type="lock" className="lock_icon" />
                                    <Icon type='download' />

                                    {/* <IntlMessages id="button.Pull" /> */}
                                    {convertToLang(this.props.translation[Button_Pull], "Pull")}
                                </Button>
                                {/* </Tooltip> */}

                                {(this.props.authUser.type === ADMIN || this.props.authUser.type === DEALER) ?
                                    <Button
                                        type="primary "
                                        style={{ width: "100%", marginBottom: 15 }}
                                        disabled={(this.props.device_details.finalStatus == "Transfered") ? true : false}
                                        // disabled={this.state.isSaveProfileBtn ? false : true}
                                        onClick={() => {
                                            // if (this.state.isSaveProfileBtn) {
                                            this.showSaveProfileModal(true, 'profile')
                                            // }
                                            // else {
                                            //     Modal.warning({
                                            //         title: "Please Change some setting to save Profile"
                                            //     })
                                            // }
                                            // this.setState({ showChangesModal: true })
                                        }} >
                                        <Icon type="save" style={{ fontSize: "14px" }} />

                                        {/* <IntlMessages id="button.SaveProfile" /> */}
                                        {convertToLang(this.props.translation[Button_SaveProfile], "Save Profile")}
                                    </Button>
                                    : null}
                                <Button
                                    type="default"
                                    style={{ width: "100%", marginBottom: 16 }}
                                    onClick={() => this.refs.activity.showModal()}
                                >

                                    {/* <IntlMessages id="button.Activity" /> */}
                                    {convertToLang(this.props.translation[Button_Activity], "Activity")}
                                </Button>
                                {/* <Tooltip placement="left" title="Coming Soon"> */}
                                <Button
                                    type="default"
                                    style={{ width: "100%", marginBottom: 16, backgroundColor: '#FF861C', color: '#fff' }}
                                    onClick={this.handleSimModule}
                                    disabled={(this.props.device_details.finalStatus == "Transfered") ? true : false}
                                >
                                    <Icon type="file" />

                                    {/* <IntlMessages id="button.SIM" /> */}
                                    {convertToLang(this.props.translation[Button_SIM], "SIM")}
                                </Button>
                                {/* </Tooltip> */}
                            </Col>
                            <Button
                                type="default"
                                onClick={() => this.handleServicesModal(true)}
                                style={{ width: "46%", marginBottom: 16, }}
                            >
                                <Icon type="info-circle" />
                                {convertToLang(this.props.translation["Account Info"], "Account Info")}
                            </Button>

                            <Modal
                                title={convertToLang(this.props.translation["Account Info"], "Account Info")}
                                maskClosable={false}
                                width='850px'
                                style={{ top: 20 }}
                                visible={this.state.servicesModal}
                                onOk={() => this.handleServicesModal(false)}
                                onCancel={() => this.handleServicesModal(false)}
                                okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                                cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                            >

                                <Tabs type="card">
                                    <Tabs.TabPane tab={convertToLang(this.props.translation["Services History"], "Services History")} key="1" >
                                        <Services
                                            translation={this.props.translation}
                                            user={this.props.authUser}
                                            handleServicesModal={this.handleServicesModal}
                                            visible={this.state.servicesModal}
                                            services={this.props.device_details.services}
                                            extended_services={this.props.device_details.extended_services}
                                            user_acc_id={this.props.device_details.id}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={convertToLang(this.props.translation["Billing Details"], "Billing Details")} key="2" >
                                        <DeviceBillingHistory
                                            translation={this.props.translation}
                                            device_billing_history={this.props.device_billing_history}
                                        />
                                    </Tabs.TabPane>
                                </Tabs>
                            </Modal>
                        </Row>
                    </Card>
                    <Card>
                        <Row gutter={16} type="flex" justify="center" align="top">
                            <Col span={12} className="gutter-row" justify="center" >
                                <Button type="default"
                                    onClick={() => this.handleTransferHistoryModal(true)}
                                    style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }} ><Icon type="swap" />  {convertToLang(this.props.translation[Button_Transfer], "Transfer")}
                                </Button>
                                <Button type={button_type}
                                    onClick={() => (device_status === "Unsuspend") ? this.handleActivateDevice(this.props.device) : this.handleSuspendDevice(this.props.device, this)}
                                    style={{ width: "100%", marginBottom: 16, fontSize: "12px" }}
                                    disabled={(this.props.device.flagged !== 'Not flagged') ? 'disabled' : ''}
                                >
                                    {((this.props.device.account_status === '')) ? <div><Icon type="user-delete" /> {convertToLang(this.props.translation[Button_Suspend], "Suspend")} </div> : <div><Icon type="user-add" /> {convertToLang(this.props.translation[Button_Unsuspend], "Unsuspend")} </div>}
                                </Button>
                                <Button type="default" className="btn_break_line" style={{ width: "100%", marginBottom: 16, backgroundColor: '#f31517', color: '#fff' }} onClick={() => this.refs.wipe_device.showModel(this.props.device, this.props.wipe)}><Icon type="lock" className="lock_icon" />
                                    {convertToLang(this.props.translation[Button_WipeDevice], "WipeDevice")}
                                </Button>

                                <TransferHistory
                                    // ref={this.otpModalRef}
                                    translation={this.props.translation}
                                    transferHistoryList={this.props.transferHistoryList}
                                    handleTransfer={this.handleTransfer}
                                    user={this.props.authUser}
                                    handleTransferHistoryModal={this.handleTransferHistoryModal}
                                    visible={this.state.transferHistoryModal}
                                    device={this.props.device_details}
                                    flagged={flagged}
                                />

                                <NewDevice
                                    history={this.props.history}
                                    showSupport={false}
                                    ref='new_device'
                                    devices={this.props.devices}
                                    addDevice={this.props.addDevice}
                                    transferDeviceProfile={this.props.transferDeviceProfile}
                                    rejectDevice={this.props.rejectDevice}
                                    authUser={this.props.authUser}
                                    requests={this.props.requests}
                                    acceptRequest={this.props.acceptRequest}
                                    rejectRequest={this.props.rejectRequest}
                                    translation={this.props.translation}
                                    device_details={this.props.device_details}
                                />
                            </Col>
                            <Col className="gutter-row" justify="center" span={12} >
                                <Button
                                    style={{ width: "100%", marginBottom: 16, backgroundColor: '#1b1b1b', color: '#fff' }}
                                    onClick={() => this.handleFlag(flagged)}
                                >
                                    <Icon type="flag" />{flaggedButtonText}
                                </Button>
                                <Button
                                    onClick={() => showConfirm(this.props.device, this.props.unlinkDevice, this, convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_UNLINK_THE_DEVICE], "Do you really want to unlink the device "), 'unlink')}
                                    style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }} >
                                    <Icon type='disconnect' />
                                    {/* <IntlMessages id="button.Unlink" /> */}
                                    {convertToLang(this.props.translation[Button_Unlink], "Unlink")}</Button>
                                <Button
                                    onClick={() => this.refs.edit_device.showModal(this.props.device, this.props.editDevice)}
                                    style={{ width: "100%", marginBottom: 16, backgroundColor: '#FF861C', color: '#fff' }}
                                    disabled={(this.props.device_details.finalStatus == "Transfered") ? true : false} // this.props.device_details.transfer_user_status == '1'
                                >
                                    <Icon type='edit' />

                                    {/* <IntlMessages id="button.Edit" /> */}
                                    {convertToLang(this.props.translation[Button_Edit], "Edit")}
                                </Button>
                            </Col>
                            <Tooltip title="Coming Soon" placement="bottom" >
                                <Button
                                    type="default"
                                    style={{ width: "46%", marginBottom: 16, backgroundColor: '#f31517', color: '#fff' }}
                                >
                                    <Icon
                                        type="lock"
                                        className="lock_icon"
                                    />
                                    <Icon
                                        type="poweroff"
                                        style={{ color: 'yellow', fontSize: '16px', verticalAlign: 'text-top' }}
                                    />
                                </Button>
                            </Tooltip>
                        </Row>
                    </Card>
                </div>
                <Modal
                    title={<div>{(this.state.historyType == 'profile') ? convertToLang(this.props.translation[Button_LoadProfile], "Load Profile") : this.state.historyType}  <br /> {convertToLang(this.props.translation[DEVICE_ID], "DEVICE ID")}:  {this.props.device.device_id} </div>}
                    maskClosable={false}
                    style={{ top: 20 }}
                    visible={this.state.historyModal}
                    onOk={() => this.showHistoryModal(false, '')}
                    onCancel={() => this.showHistoryModal(false, '')}
                    className="load_policy_popup"
                    okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    {(this.state.historyType === "history") ?
                        <TableHistory
                            histories={this.props.histories}
                            type={this.state.historyType}
                            applyHistory={this.applyHistory}
                            translation={this.props.translation}
                            auth={this.props.authUser}
                        />
                        :
                        (this.state.historyType === "profile") ?

                            <TableHistory
                                histories={this.props.profiles}
                                type={this.state.historyType}
                                applyHistory={this.applyHistory}
                                translation={this.props.translation}
                                auth={this.props.authUser}
                            />
                            :
                            (this.state.historyType === "policy") ?
                                <TableHistory
                                    histories={this.props.policies}
                                    type={this.state.historyType}
                                    applyHistory={this.applyHistory}
                                    translation={this.props.translation}
                                    auth={this.props.authUser}
                                />
                                :
                                (this.state.historyType === undefined) ?
                                    <p>{this.state.historyType}</p> : null
                    }

                </Modal>

                <Modal
                    maskClosable={false}
                    title={convertToLang(this.props.translation[SETTINGS_TO_BE_SENT_TO_DEVICE], "Confirm new Settings to be sent to Device ")}
                    visible={this.state.showChangesModal}
                    onOk={() => {
                        this.showSaveProfileModal(true, 'profile')
                        this.setState({ showChangesModal: false })
                    }}
                    onCancel={() => this.setState({ showChangesModal: false })}
                    // okText='Apply'
                    okText={convertToLang(this.props.translation[Button_Apply], "Apply")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <DeviceSettings
                        app_list={this.props.app_list}
                        extensions={this.props.extensions}
                        extensionUniqueName={SECURE_SETTING}
                        isAdminPwd={this.props.isAdminPwd}
                        isDuressPwd={this.props.isDuressPwd}
                        isEncryptedPwd={this.props.isEncryptedPwd}
                        isGuestPwd={this.props.isGuestPwd}
                        controls={{ 'controls': this.state.changedCtrls }}
                        showChangedControls={true}
                        translation={this.props.translation}
                    />
                </Modal>

                {/* SIM MODULE */}
                <Modal
                    width='850px'
                    maskClosable={false}
                    title={<div>{convertToLang(this.props.translation[SIM_SETTINGS], "Sim Settings")} {<Fragment>
                        <Button
                            type="primary"
                            size="small"
                            onClick={this.handleSimHistory}
                        >
                            {convertToLang(this.props.translation[SIM_HISTORY], "History")}
                        </Button></Fragment>}
                    </div>}
                    visible={this.state.showSimModal}
                    onOk={() => this.setState({ showSimModal: false })}
                    onCancel={() => this.setState({ showSimModal: false })}
                    // footer={null}
                    okText={convertToLang(this.props.translation[Button_Ok], "OK")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <SimSettings
                        deviceID={this.props.device_id}
                        translation={this.props.translation}
                    />
                </Modal>

                <SimHistory
                    ref="history_sim"
                    translation={this.props.translation}
                    simHistoryList={this.props.simHistoryList}
                />



                {/* END SIM MODULE */}



                {/* SERVICES MODULE */}
                {/* <Modal
                    width='850px'
                    maskClosable={false}
                    title={convertToLang(this.props.translation["SIM_SETTINGS"], "SERVICES")}
                    visible={this.state.handleServicesModal}
                    onOk={() => this.setState({ handleServicesModal: false })}
                    onCancel={() => this.setState({ handleServicesModal: false })}
                    // footer={null}
                    okText={convertToLang(this.props.translation[Button_Ok], "OK")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <SimSettings
                        deviceID={this.props.device_id}
                        translation={this.props.translation}
                    />
                </Modal> */}
                {/* END SERVICES MODULE */}


                {/* title={this.state.profileType[0] + this.state.profileType.substring(1,this.state.profileType.length).toLowerCase()} */}
                <Modal
                    title={<div> {convertToLang(this.props.translation[SAVE_PROFILE_TEXT], "SAVE PROFILE")} <br /> {convertToLang(this.props.translation[DEVICE_ID], "DEVICE ID")}:  {this.props.device.device_id} </div>}
                    closable={false}
                    maskClosable={false}
                    style={{ top: 20 }}

                    visible={this.state.saveProfileModal}
                    onOk={() => {
                        this.setState({ profileName: '' })
                        this.saveProfile();
                    }}
                    onCancel={() => { this.setState({ profileName: '' }); this.showSaveProfileModal(false) }}
                    okText={convertToLang(this.props.translation[Button_Save], "Save")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <Input placeholder={`${convertToLang(this.props.translation[ENTER], "Enter")} ${(this.state.saveProfileType == 'profile') ? convertToLang(this.props.translation[PROFILE], "Profile") : (this.state.saveProfileType == 'policy') ? convertToLang(this.props.translation[POLICY], "Policy") : this.state.saveProfileType} ${convertToLang(this.props.translation[Name], "Name")}`} required onChange={(e) => { this.onInputChange(e) }} value={this.state.profileName} />
                </Modal>


                <PasswordModal
                    pwdConfirmModal={this.state.pwdConfirmModal}
                    showPwdConfirmModal={this.showPwdConfirmModal}
                    checkPass={this.props.checkPass}
                    actionType={this.state.actionType}
                    translation={this.props.translation}
                />


                <PushAppsModal
                    isSelectPushApps={this.state.selectedPushApps && this.state.selectedPushApps.length ? true : false}
                    pushAppsModal={this.props.pushAppsModal}
                    showPushAppsModal={this.showPushAppsModal_}
                    handleComponentSearch={this.handleComponentSearch}
                    apk_list={this.state.apk_list}
                    // app list props is added because push apps will not show installed apps again to push
                    app_list={this.props.app_list}
                    onPushAppsSelection={this.onPushAppsSelection}
                    selectedPushAppKeys={this.state.selectedPushAppKeys}
                    showSelectedPushAppsModal={this.showSelectedPushAppsModal}
                    resetSelectedRows={this.resetSelectedRows}
                    selectedPushApps={this.state.selectedPushApps}
                    handleChecked={this.props.handleChecked}
                    device={this.props.device}
                    translation={this.props.translation}
                    resetPushApps={this.props.resetPushApps}
                    handleCheckedAllPushApps={this.props.handleCheckedAllPushApps}
                    guestAllPushApps={this.state.guestAllPushApps}
                    enableAllPushApps={this.state.enableAllPushApps}
                    encryptedAllPushApps={this.state.encryptedAllPushApps}
                />

                <PullAppsModal
                    isSelectPullApps={this.state.selectedPullApps && this.state.selectedPullApps.length ? true : false}
                    pullAppsModal={this.state.pullAppsModal}
                    showPullAppsModal={this.props.showPullAppsModal}
                    handleComponentPullSearch={this.handleComponentPullSearch}
                    app_list={this.state.app_list}
                    onPullAppsSelection={this.onPullAppsSelection}
                    showSelectedPullAppsModal={this.showSelectedPullAppsModal}
                    selectedPullApps={this.state.selectedPullApps}
                    selectedPullAppKeys={this.state.selectedPullAppKeys}
                    resetSelectedRows={this.resetSelectedRows}
                    onCancelModel={this.onCancelModel}
                    device={this.props.device}
                    translation={this.props.translation}
                />



                <SelectedPushApps
                    selectedAppsModal={this.state.selectedPushAppsModal}
                    showSelectedPushAppsModal={this.showSelectedPushAppsModal}
                    selectedAppKeys={this.state.selectedPushAppKeys}
                    apk_list={this.props.apk_list}
                    selectedPushApps={this.state.selectedPushApps}
                    resetSelectedRows={this.resetSelectedRows}
                    applyPushApps={this.applyPushApps}
                    actionType={this.state.actionType}
                    showPushAppsModal={this.props.showPushAppsModal}
                    hidePushAppsModal={this.showPushAppsModal_}
                    showPullAppsModal={this.props.showPullAppsModal}
                    device={this.props.device}
                    translation={this.props.translation}
                    resetPushApps={this.props.resetPushApps}
                    onlyShowSelected={true}
                />

                <SelectedPullApps
                    selectedPullAppsModal={this.state.selectedPullAppsModal}
                    showSelectedPullAppsModal={this.showSelectedPullAppsModal}
                    app_list={this.state.pullApps}
                    selectedPullApps={this.state.selectedPullApps}
                    resetSelectedRows={this.resetSelectedRows}
                    applyPullApps={this.applyPullApps}
                    actionType={this.state.actionType}
                    showPushAppsModal={this.props.showPushAppsModal}
                    showPullAppsModal={this.props.showPullAppsModal}
                    device={this.props.device}
                    translation={this.props.translation}
                />
                <ActivateDevcie
                    ref="activate"
                    activateDevice={this.props.activateDevice}
                    translation={this.props.translation}
                />

                <SuspendDevice
                    ref="suspend"
                    suspendDevice={this.props.suspendDevice}
                    translation={this.props.translation}

                />

                <EditDevice
                    ref='edit_device'
                    translation={this.props.translation}
                    getSimIDs={this.props.getSimIDs}
                    getChatIDs={this.props.getChatIDs}
                    getPgpEmails={this.props.getPgpEmails}
                    resetProductAddProps={this.props.resetProductAddProps}
                />
                <WipeDevice
                    ref='wipe_device'
                    device={this.props.device}
                    authUser={this.props.authUser}
                    checkPass={this.props.checkPass}
                    translation={this.props.translation}
                />
                <FlagDevice
                    ref='flag_device'
                    device={this.props.device}
                    translation={this.props.translation}
                />
                <ImeiView
                    ref='imeiView'
                    device={this.props.device}
                    imei_list={this.props.imei_list}
                    writeImei={this.props.writeImei}
                    getActivities={this.props.getActivities}
                    translation={this.props.translation}
                />

                <Activity
                    ref='activity'
                    activities={this.state.activities}
                    device={this.props.device}
                    translation={this.props.translation}
                    auth={this.props.authUser}

                />
            </div >
        )
    }
    handleSuspendDevice = (device, _this) => {
        this.refs.suspend.handleSuspendDevice(device);

    }

    handleActivateDevice = (device) => {
        this.refs.activate.handleActivateDevice(device);

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        rejectDevice: rejectDevice,
        addDevice: addDevice,
        acceptRequest: acceptRequest,
        rejectRequest: rejectRequest,
        getNewDevicesList: getNewDevicesList,
        simHistory: simHistory,
        showHistoryModal: showHistoryModal,
        showSaveProfileModal: showSaveProfileModal,
        saveProfile: saveProfile,
        hanldeProfileInput: hanldeProfileInput,
        transferDeviceProfile: transferDeviceProfile,
        loadDeviceProfile: loadDeviceProfile,
        showPushAppsModal: showPushAppsModal,
        showPullAppsModal: showPullAppsModal,
        applyPushApps: applyPushApps,
        applyPullApps: applyPullApps,
        savePolicy: savePolicy,
        writeImei: writeImei,
        getActivities: getActivities,
        hidePolicyConfirm: hidePolicyConfirm,
        applyPolicy: applyPolicy,
        applySetting: applySetting,
        getProfiles: getProfiles,
        getSimIDs: getSimIDs,
        getChatIDs: getChatIDs,
        getPgpEmails: getPGPEmails,
        handleChecked: handleChecked,
        resetPushApps: resetPushApps,
        handleCheckedAllPushApps: handleCheckedAllPushApps,
        transferHistory: transferHistory,
        getDeviceListConnectDevice: getDeviceListConnectDevice,
        getDeviceBillingHistory: getDeviceBillingHistory,
        resetProductAddProps: resetProductAddProps
    }, dispatch);
}
var mapStateToProps = ({ device_details, auth, settings, devices, sidebar }, otherProps) => {
    // console.log(device_details.device_list, 'device_details')
    return {
        requests: sidebar.newRequests,
        devices: devices.newDevices,
        simDeleted: device_details.simDeleted,
        simHistoryList: device_details.simHistoryList,
        translation: settings.translation,
        pathname: settings.pathname,
        authUser: auth.authUser,
        historyModal: device_details.historyModal,
        applyPolicyConfirm: device_details.applyPolicyConfirm,
        saveProfileModal: device_details.saveProfileModal,
        historyType: device_details.historyType,
        pushAppsModal: device_details.pushAppsModal,
        pullAppsModal: device_details.pullAppsModal,
        saveProfileType: device_details.saveProfileType,
        profileName: device_details.profileName,
        policyName: device_details.policyName,
        app_list: device_details.app_list,
        guestPwd: device_details.guestPwd,
        guestCPwd: device_details.guestCPwd,
        encryptedPwd: device_details.encryptedPwd,
        encryptedCPwd: device_details.encryptedCPwd,
        duressPwd: device_details.duressPwd,
        duressCPwd: device_details.duressCPwd,
        adminPwd: device_details.adminPwd,
        adminCPwd: device_details.adminCPwd,
        device_id: device_details.device.device_id,
        device_details: device_details.device,
        usr_acc_id: device_details.device.id,
        apk_list: device_details.apk_list,
        controls: device_details.controls,
        changedCtrls: device_details.changedCtrls,
        extensions: device_details.extensions,
        activities: device_details.activities,
        isSaveProfileBtn: device_details.isSaveProfileBtn,
        // wipeDeviceID: device_details.wipeDeviceID,
        // wipeDevice: device_details.wipeDevice,
        wipeDevieStatus: device_details.wipeDevieStatus,
        guestAllPushApps: device_details.guestAllPushApps,
        enableAllPushApps: device_details.enableAllPushApps,
        encryptedAllPushApps: device_details.encryptedAllPushApps,
        device_list: device_details.device_list,
        device_billing_history: device_details.device_billing_history
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SideActions);
function showConfirm(device, action, _this, msg, type, transfered = false) {
    confirm({
        title: msg + device.device_id,
        onOk() {
            _this.setState({ disabled: true })
            // console.log('go back func', _this.props);
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject);
                if (type === 'wipe') {
                    action(device)
                }
                else if (type === 'unlink') {
                    // console.log('unlink check =========> ', device)
                    action(device, transfered);

                    _this.props.history.goBack();
                    _this.props.getDevicesList();
                }
                else if (type === 'flagged') {
                    action(device.usr_device_id)
                    // _this.props.activateDevice(device)
                }
                // if (type === 'unlink') {
                //     _this.props.history.goBack();
                //     _this.props.getDevicesList();
                // } else {
                //     // _this.props.refreshDevice(device.device_id);
                // }
                //  message.success('Action Done Susscefully ');

            }).catch(() => console.log(''));
        },
        okText: convertToLang(_this.props.translation[Button_Ok], "Ok"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onCancel() { },
    });
}
function showConfirmPolcy(_this) {
    confirm({
        title: convertToLang(_this.props.translation[DO_YOU_WANT_TO_APPLY], "Do you want to apply") + " # " + _this.state.policyName + convertToLang(_this.props.translation[POLICY_ON_DEVICE], " policy on device?"),
        onOk() {
            _this.props.applyPolicy(_this.props.device.device_id, _this.props.device.id, _this.state.policyId, _this.state.policyName);
        },
        okText: convertToLang(_this.props.translation[Button_Ok], "Ok"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onCancel() {
            _this.props.hidePolicyConfirm()
        },
    });
}
function showConfirmProfile(_this, name, profile) {
    confirm({
        title: convertToLang(_this.props.translation[DO_YOU_WANT_TO_APPLY], "Do you want to apply ") + name + convertToLang(_this.props.translation[POLICY_ON_DEVICE], " profile on device?"),
        onOk() {
            _this.props.applySetting(profile.app_list, profile.passwords, profile.secure_apps, profile.controls, _this.props.device.device_id, _this.props.device.id, 'profile', name)
            _this.props.refreshDevice(_this.props.device.device_id, true)
            _this.props.showHistoryModal(false);
        },
        okText: convertToLang(_this.props.translation[Button_Ok], "Ok"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onCancel() {
        },
    });
}

function showConfirm1(props, device, msg, buttonText = "") {
    confirm({
        title: convertToLang(props.translation[WARNING], "WARNING!"),
        content: msg,
        okText: buttonText,
        cancelText: convertToLang(props.translation[Button_Cancel], "Cancel"),
        onOk() {
            showConfirmWipe(props, device, convertToLang(props.translation[WIPE_DEVICE_DESCRIPTION], "This will permanently wipe the Device. You cannot undo this action. All data will be deleted from target device without any confirmation. There is no way to reverse this action."))
        },
        onCancel() { },
    });
}
function showConfirmWipe(props, device, msg) {
    confirm({
        title: convertToLang(props.translation[WARNING], "WARNING!"),
        content: msg,
        // okText: "PROCEED WITH WIPING THE DEVICE",
        okText: convertToLang(props.translation[PROCEED_WITH_WIPING_THE_DEVICE], "PROCEED WITH WIPING THE DEVICE"),
        cancelText: convertToLang(props.translation[Button_Cancel], "Cancel"),
        onOk() {
            // console.log(props.wipe)
            props.wipe(device)
        },
        onCancel() {

        },
    });
}
