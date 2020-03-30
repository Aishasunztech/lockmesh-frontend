import React, { Component, Fragment } from 'react';
import { Modal, Input } from "antd";
import { componentSearch, convertToLang, checkIsArray } from '../../utils/commonUtils';
import DealerApps from "./DealerApps";
import PullApps from './PullApps';

import {
    PUSH_APP_TEXT, PULL_APPS_TEXT, SELECTED_APPS, SELECT_APPS, SEARCH_APPS
} from "../../../constants/Constants";


import { PUSH_APPS, PULL_APPS, POLICY, PROFILE } from "../../../constants/ActionTypes"
import { Button_Cancel, Button_Back } from '../../../constants/ButtonConstants';

const confirm = Modal.confirm;
var coppyList = [];
var status = true;

const PushAppsModal = (props) => {
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
                </div>}
            visible={props.pushAppsModal}
            onOk={() => {
                if (props.selectedPushAppKeys.length) {
                    props.showPushAppsModal(false);
                    props.showSelectedPushAppsModal(true);
                }
            }}
            okButtonProps={{ disabled: !props.isSelectPushApps }}
            onCancel={() => { props.showPushAppsModal(false); }} // props.resetSeletedRows()
            okText={convertToLang(props.translation[PUSH_APP_TEXT], "SELECT APPS")}
            cancelText={convertToLang(props.translation[Button_Cancel], "Cancel")}
        >
            <div>
                {/* <ExtensionDropdown
                    checked_app_id={null}
                    encryptedAll={props.encryptedAllPushApps}
                    guestAll={props.guestAllPushApps}
                    enableAll={props.enableAllPushApps}
                    handleCheckedAllPushApps={props.handleCheckedAllPushApps}
                    translation={props.translation}
                    isPushAppsModal={true}
                /> */}
                <DealerApps
                    apk_list={props.apk_list}
                    pushApps={props.pushApps}
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
                </div>
            }
            visible={props.selectedAppsModal}
            onOk={() => {
                props.applyPushApps(props.apk_list);
                props.showSelectedPushAppsModal(false);
                props.showPushAppsModal(false)
                props.showPullAppsModal(false)
                // props.resetSeletedRows()
            }}
            onCancel={() => {
                props.actionType == PUSH_APPS ? props.showPushAppsModal(true) : props.showPullAppsModal(true);
                props.showSelectedPushAppsModal(false);
            }}
            cancelText={convertToLang(props.translation[Button_Back], "Back")}
            okText={convertToLang(props.translation[PUSH_APP_TEXT], "ADD APPS")}
            destroyOnClose={true}
        >
            <DealerApps
                apk_list={props.apk_list}
                isSwitchable={false}
                selectedApps={props.selectedPushApps}
                type='push'
                disabledSwitch={true}
                translation={props.translation}
            />
        </Modal>
    )
}

const PullAppsModal = (props) => {

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
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[SEARCH_APPS], "Search Apps")}
                    />
                </div>
            }
            visible={props.pullAppsModal}
            onOk={() => {
                if (props.selectedPullAppKeys && props.selectedPullAppKeys.length) {
                    props.showPullAppsModal(false);
                    props.showSelectedPullAppsModal(true);
                }
            }}
            onCancel={() => { props.showPullAppsModal(false); }} // props.resetSeletedRows();
            // okText="Pull Apps"
            okButtonProps={{ disabled: !props.isSelectPullApps }}
            okText={convertToLang(props.translation[PULL_APPS_TEXT], "SELECT APPS")}
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
            title={<div>{convertToLang(props.translation[SELECTED_APPS], "Selected Apps ")}
            </div>}
            visible={props.selectedPullAppsModal}
            onOk={() => {
                props.applyPullApps(props.app_list);
                props.showSelectedPullAppsModal(false);
                props.showPushAppsModal(false)
                props.showPullAppsModal(false)
                // props.resetSeletedRows()
            }}
            onCancel={() => {
                props.showPullAppsModal(true);
                props.showSelectedPullAppsModal(false);
            }}
            cancelText={convertToLang(props.translation[Button_Back], "Back")}
            okText={convertToLang(props.translation[PULL_APPS_TEXT], "ADD APPS")}
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


export default class PushPullApps extends Component {
    constructor(props) {
        super(props);

        this.state = {
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

            selectedPushAppsModal: false,
            selectedPushAppKeys: [],
            pushApps: [],
            selectedPushApps: [],

            selectedPullAppsModal: false,
            selectedPullAppKeys: [],
            pullApps: [],
            selectedPullApps: [],

            activities: [],

            policyId: '',
            showChangesModal: false,
            applyPolicyConfirm: false,
            isSaveProfileBtn: false,
            transferHistoryModal: false,
            DEVICE_TRANSFERED_DONE: 'not transfer',

        }
        this.otpModalRef = React.createRef();
    }

    onPushAppsSelection = (selectedRowKeys, selectedRows) => {
        let allSelectedApps = this.state.selectedPushApps;
        let data = [];

        checkIsArray(selectedRows).forEach(el => {
            let index = allSelectedApps.findIndex(item => item.key == el.key)
            if (index !== -1) {
                data.push(allSelectedApps[index])
            } else {
                el.enable = false;
                el.guest = false;
                el.encrypted = false;
                data.push(el);
            }
        })

        this.setState({
            selectedPushApps: data,
            selectedPushAppKeys: selectedRowKeys
        })

    }

    onPullAppsSelection = (selectedRowKeys, selectedRows) => {

        this.setState({
            selectedPullApps: selectedRows,
            selectedPullAppKeys: selectedRowKeys
        })
    }

    handleChecked = (e, key, app_id) => {
        checkIsArray(this.state.selectedPushApps).map((el) => {
            if (el.apk_id === app_id) {
                el[key] = e;
            }
        })
        this.setState({
            selectedPushApps: this.state.selectedPushApps
        })
    }

    resetSeletedRows = () => {
        this.setState({
            selectedPushAppKeys: [],
            selectedPullAppKeys: [],
            selectedPushApps: [],
            selectedPullApps: [],
            apk_list: this.props.apk_list
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
            pushApps: dumyList
        })
    }

    showSelectedPullAppsModal = (visible) => {

        let dumyList = [];
        if (this.state.selectedPullAppKeys.length && this.state.selectedPullApps.length) {
            for (let app of this.state.selectedPullApps) {
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

    handleComponentSearch = (value, labelApps) => {
        try {
            if (value.length) {
                if (status) {
                    coppyList = this.state.apk_list;
                    status = false;
                }
                let foundList = componentSearch(coppyList, value);
                if (foundList.length) {
                    this.setState({
                        apk_list: foundList,
                    })
                } else {
                    this.setState({
                        apk_list: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    apk_list: coppyList,
                })
            }
        } catch (error) {
        }
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            apk_list: nextProps.apk_list
        })
    }

    applyPushApps = (apps) => {
        this.props.setBulkPushApps(this.state.pushApps);
        this.setState({ selectedApps: [], selectedAppKeys: [], })
    }


    applyPullApps = () => {
        this.props.setBulkPullApps(this.state.pullApps);
        this.setState({ selectedApps: [], selectedAppKeys: [], })
    }

    render() {
        return (
            <div>
                <PushAppsModal
                    isSelectPushApps={this.state.selectedPushApps && this.state.selectedPushApps.length ? true : false}
                    pushAppsModal={this.props.pushAppsModal}
                    showPushAppsModal={this.props.showPushAppsModal}
                    handleComponentSearch={this.handleComponentSearch}
                    apk_list={this.state.apk_list}

                    // app list props is added because push apps will not show installed apps again to push
                    app_list={this.props.app_list}
                    onPushAppsSelection={this.onPushAppsSelection}
                    selectedPushAppKeys={this.state.selectedPushAppKeys}
                    showSelectedPushAppsModal={this.showSelectedPushAppsModal}
                    resetSeletedRows={this.resetSeletedRows}
                    selectedPushApps={this.state.selectedPushApps}
                    handleChecked={this.handleChecked}
                    device={this.props.device}
                    translation={this.props.translation}

                    guestAllPushApps={this.props.guestAllPushApps}
                    enableAllPushApps={this.props.enableAllPushApps}
                    encryptedAllPushApps={this.props.encryptedAllPushApps}
                    handleCheckedAllPushApps={this.props.handleCheckedAllPushApps}
                />

                <PullAppsModal
                    isSelectPullApps={this.state.selectedPullApps && this.state.selectedPullApps.length ? true : false}
                    pullAppsModal={this.props.pullAppsModal}
                    showPullAppsModal={this.props.showPullAppsModal}
                    handleComponentSearch={this.handleComponentSearch}
                    app_list={this.state.apk_list}
                    onPullAppsSelection={this.onPullAppsSelection}
                    showSelectedPullAppsModal={this.showSelectedPullAppsModal}
                    selectedPullApps={this.state.selectedPullApps}
                    selectedPullAppKeys={this.state.selectedPullAppKeys}
                    resetSeletedRows={this.resetSeletedRows}
                    onCancelModel={this.onCancelModel}
                    device={this.props.device}
                    translation={this.props.translation}
                />



                <SelectedPushApps
                    selectedAppsModal={this.state.selectedPushAppsModal}
                    showSelectedPushAppsModal={this.showSelectedPushAppsModal}
                    apk_list={this.state.pushApps}
                    selectedPushApps={this.state.selectedPushApps}
                    resetSeletedRows={this.resetSeletedRows}
                    applyPushApps={this.applyPushApps}
                    actionType={this.state.actionType}
                    showPushAppsModal={this.props.showPushAppsModal}
                    showPullAppsModal={this.props.showPullAppsModal}
                    device={this.props.device}
                    translation={this.props.translation}
                />

                <SelectedPullApps
                    selectedPullAppsModal={this.state.selectedPullAppsModal}
                    showSelectedPullAppsModal={this.showSelectedPullAppsModal}
                    app_list={this.state.pullApps}
                    selectedPullApps={this.state.selectedPullApps}
                    resetSeletedRows={this.resetSeletedRows}
                    applyPullApps={this.applyPullApps}
                    actionType={this.state.actionType}
                    showPushAppsModal={this.props.showPushAppsModal}
                    showPullAppsModal={this.props.showPullAppsModal}
                    device={this.props.device}
                    translation={this.props.translation}
                />
            </div>
        )
    }
}