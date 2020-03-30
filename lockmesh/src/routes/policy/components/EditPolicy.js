import React, { Component, Fragment } from 'react'
import { Button, Avatar, Input, Modal, Form, Icon, Col, Row, Table, Switch, Tabs } from "antd";
import AppList from "./AppList";
import {
    SECURE_SETTING_PERMISSION,
    SYSTEM_PERMISSION,
    APPLICATION_PERMISION,
    SYSTEM_CONTROLS_UNIQUE,
    SECURE_SETTING,
    Main_SETTINGS,
    POLICY_DETAILS,
    APPS
} from '../../../constants/Constants';

import styles from './policy.css';
import RestService from '../../../appRedux/services/RestServices'
import { BASE_URL } from '../../../constants/Application';
import {
    POLICY_SAVE_CONFIRMATION,
    PLEASE_INPUT_POLICY_NAME,
    POLICY_APP_NAME,
    POLICY_NOTE,
    POLICY_COMMAND,
    NAME
} from '../../../constants/PolicyConstants';
import { Button_Save, Button_Cancel, Button_AddApps, Button_Add } from '../../../constants/ButtonConstants';
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { Tab_POLICY_SELECTED_APPS, Guest, ENCRYPTED, ENABLE, Tab_SECURE_SETTING } from '../../../constants/TabConstants';
import { SPA_APPS } from '../../../constants/AppConstants';

const TabPane = Tabs.TabPane;
const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a >{text}</a>,
}, {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
}];
const data = [
    {
        name: "Wifi",
        action: (<Switch size="small"></Switch>),
        key: 1,
    },
    {
        name: "Bluetooth",
        action: (<Switch size="small"></Switch>),
        key: 2,
    },
    {
        name: "Screenshot",
        action: (<Switch size="small"></Switch>),
        key: 3,
    },
    {
        name: "Location",
        action: (<Switch size="small"></Switch>),
        key: 4,
    },
    {
        name: "Hotspot",
        action: (<Switch size="small"></Switch>),
        key: 4,
    }
];

class EditPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            dealerApps: [],
            pushApps: [],
            steps: [],
            first: true,
            tabSelected: '1',
            allExtensions: [],
            systemPermissions: [],
            policy_name: '',
            command: '',
            command_name: '',
            isCommand: 'success',
            isPolicy_name: 'success',
            policy_name_error: '',
            command_error: '',
            pushAppsIds: [],
            appPermissionsIds: [],
            main_system_control: {},
            main_extension: {},

            guestAlldealerApps: false,
            encryptedAlldealerApps: false,
            enableAlldealerApps: false,

            guestAllappPermissions: false,
            encryptedAllappPermissions: false,
            enableAllappPermissions: false,

            guestAllallExtensions: false,
            encryptedAllallExtensions: false,
            enableAllallExtensions: false,

            editAblePolicy:
            {
                push_apps: [],
                app_list: [],
                secure_apps: []
            },

            addPushAppModal: false,

            selectedRowKeysApps: [],
            selectedRowKeysPermissios: [],
            addDataOf: 'push_apps'

        };

        this.appsColumns = [
            {
                title: convertToLang(props.translation[POLICY_APP_NAME], "APP NAME"),
                dataIndex: 'app_name',
                key: '1',
                render: text => <a >{text}</a>,
            }]
    }

    handleCheckApp = (value, key, id, arrayOf, main = '') => {
        // console.log('iiiiiiiiiiiiiiiiiiiiiiiiiii');

        if (main === 'main') {
            if (this.state.main_extension) {
                this.state.main_extension[key] = value
            }
            this.setState({
                main_extension: this.state.main_extension
            })
        } else {
            this.props.handleCheckAppPolicy(value, key, id, arrayOf, SECURE_SETTING)
        }

        // console.log(value, key, id, arrayOf, 'data is');
    }

    handleCheckAllAppPolicy = (value, key, arrayOf) => {
        this.props.handleCheckAllAppPolicy(value, key, arrayOf, SECURE_SETTING)
    }

    componentDidMount() {

        if (this.props.editAblePolicy.length) {
            let editAblePolicy = this.props.editAblePolicy.find(item => item.id === this.props.editAblePolicyId)
            // console.log("push_apps:", this.props.push_apps)
            // console.log("apps in policy:", editAblePolicy.push_apps)
            // showing updated Policy Push Apps
            // this.props.apk_list

            checkIsArray(this.props.push_apps).map((apk) => {
                let index = editAblePolicy.push_apps.findIndex(app => app.apk_id === apk.apk_id)
                if (index && index !== -1) {

                    editAblePolicy.push_apps[index].apk = apk.apk;
                    editAblePolicy.push_apps[index].apk_name = apk.apk_name;
                    editAblePolicy.push_apps[index].logo = apk.logo;
                    editAblePolicy.push_apps[index].package_name = apk.package_name;
                    editAblePolicy.push_apps[index].version_name = apk.version_name;
                }
            })


            let main_system_control = {};
            let main_extension = {};

            if (editAblePolicy.app_list) {
                if (editAblePolicy.app_list.length) {
                    main_system_control = editAblePolicy.app_list.find(item => item.uniqueName === Main_SETTINGS);
                    main_extension = editAblePolicy.app_list.find(item => item.uniqueName === SECURE_SETTING);

                    // console.log('1223', editAblePolicy.app_list)

                    let seccure_index = editAblePolicy.app_list.findIndex(item => item.uniqueName === SECURE_SETTING);
                    // console.log(seccure_index, 'sdfdsfa')
                    if (seccure_index > -1) {
                        editAblePolicy.app_list.splice(seccure_index, 1)
                    }
                    let systemcontrols_index = editAblePolicy.app_list.findIndex(item => item.uniqueName === Main_SETTINGS);
                    // console.log('system_index', systemcontrols_index)
                    if (systemcontrols_index > -1) {
                        editAblePolicy.app_list.splice(systemcontrols_index, 1)
                    }

                    // console.log('object,', editAblePolicy.app_list)
                }
            }

            // console.log(main_system_control, 'eidtable', main_extension)
            if (editAblePolicy) {
                this.setState({
                    editAblePolicy: editAblePolicy,
                    current: 0,
                    command: editAblePolicy.policy_note,
                    policy_name: editAblePolicy.policy_name,
                    command_name: '#' + editAblePolicy.policy_name.replace(/ /g, '_'),
                    main_system_control: main_system_control,
                    main_extension: main_extension

                });
            }
        }
    }


    componentDidUpdate(prevProps) {
        // console.log('edit able changed', this.props.editAblePolicy);
        if (this.props !== prevProps) {

            if (this.props.editAblePolicy.length) {
                let editAblePolicy = this.props.editAblePolicy.find(item => item.id === this.props.editAblePolicyId)

                checkIsArray(this.props.push_apps).map((apk) => {
                    let index = editAblePolicy.push_apps.findIndex(app => app.apk_id === apk.apk_id)
                    if (index && index !== -1) {

                        editAblePolicy.push_apps[index].apk = apk.apk;
                        editAblePolicy.push_apps[index].apk_name = apk.apk_name;
                        editAblePolicy.push_apps[index].logo = apk.logo;
                        editAblePolicy.push_apps[index].package_name = apk.package_name;
                        editAblePolicy.push_apps[index].version_name = apk.version_name;
                    }
                })

                if (this.state.main_extension === undefined && this.state.main_extension === {}) {
                    let main_extension = {};
                    let main_system_control = {};
                    if (editAblePolicy.app_list.length) {

                        main_system_control = editAblePolicy.app_list.find(item => item.uniqueName === Main_SETTINGS);
                        main_extension = editAblePolicy.app_list.find(item => item.uniqueName === SECURE_SETTING);

                        let seccure_index = editAblePolicy.app_list.findIndex(item => item.uniqueName === SECURE_SETTING);
                        // console.log(seccure_index, 'sdfdsfa')
                        if (seccure_index > -1) {
                            editAblePolicy.app_list.splice(seccure_index, 1)
                        }
                        let systemcontrols_index = editAblePolicy.app_list.findIndex(item => item.uniqueName === Main_SETTINGS);
                        if (systemcontrols_index > -1) {
                            editAblePolicy.app_list.splice(systemcontrols_index, 1)
                        }
                        console.log('compoent did update', systemcontrols_index)
                    }

                    this.setState({
                        editAblePolicy: editAblePolicy,
                        command: editAblePolicy.policy_note,
                        policy_name: editAblePolicy.policy_name,
                        command_name: '#' + editAblePolicy.policy_name.replace(/ /g, '_'),
                        main_system_control: main_system_control,
                        main_extension: main_extension,
                        first: false
                    });
                } else {

                    let seccure_index = editAblePolicy.app_list.findIndex(item => item.uniqueName === SECURE_SETTING);
                    // console.log(seccure_index, 'sdfdsfa')
                    if (seccure_index > -1) {
                        editAblePolicy.app_list.splice(seccure_index, 1)
                    }
                    let systemcontrols_index = editAblePolicy.app_list.findIndex(item => item.uniqueName === Main_SETTINGS);
                    if (systemcontrols_index > -1) {
                        editAblePolicy.app_list.splice(systemcontrols_index, 1)
                    }

                    if (editAblePolicy) {
                        this.setState({
                            editAblePolicy: editAblePolicy,
                            command: editAblePolicy.policy_note,
                            policy_name: editAblePolicy.policy_name,
                            command_name: '#' + editAblePolicy.policy_name.replace(/ /g, '_'),
                        });
                    }
                }

            }
        }
    }


    handleChecked = (value, key) => {
        if (this.state.main_system_control) {
            this.state.main_system_control[key] = value
        }
        this.setState({
            main_system_control: this.state.main_system_control
        })
    }

    handleChecked2 = (value, key) => {
        if (this.state.main_extension) {
            this.state.main_extension[key] = value
        }
        this.setState({
            main_extension: this.state.main_extension
        })
    }


    renderApp = (data) => {
        // console.log('data is', data)
        if (data.length) {
            let featuredApps = []
            let apps = []
            let allApks = []
            checkIsArray(data).map((item, index) => {
                if (item.package_name === 'com.armorSec.android' || item.package_name === 'ca.unlimitedwireless.mailpgp' || item.package_name === 'com.rim.mobilefusion.client') {
                    featuredApps.push(item);
                    // allApks.splice(index, 1)
                } else {
                    apps.push(item)
                }
            })

            allApks = [...featuredApps, ...apps]
            return checkIsArray(allApks).map(app => {
                let app_id = (app.apk_id !== undefined) ? app.apk_id : app.id;
                let label = (app.apk_name !== undefined) ? app.apk_name : app.label;
                let icon = (app.logo !== undefined) ? app.logo : app.icon;

                return ({
                    key: app_id,
                    app_name:
                        <Fragment>
                            <Avatar src={`${BASE_URL}users/getFile/${icon}`} style={{ width: "30px", height: "30px" }} />

                            <div className="line_break2">{label}</div>
                        </Fragment>
                });
            })
        } else {
            return [];
        }

    }


    renderSystemPermissions = () => {

        const { controls } = this.state.editAblePolicy;

        // if (controls) {
        return checkIsArray(controls).map(control => {
            return {
                rowKey: control.setting_name,
                name: control.setting_name,
                action: (
                    <Switch
                        checked={(control.setting_status === 1 || control.setting_status === true) ? true : false}
                        onClick={(e) => {
                            return this.props.handleEditPolicy(e, control.setting_name, '', 'controls', this.state.editAblePolicy.id)
                        }}
                        size="small"
                    />
                )
            }
        })
        // }

    }

    SavePolicyChanges = () => {

        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log(values, 'fomr values')
            if (!err) {
                // console.log(this.state.editAblePolicy.app_list, 'policy while editing');
                let dupmVar = JSON.parse(JSON.stringify(this.state.editAblePolicy));
                dupmVar.policy_note = values.command;
                dupmVar.policy_name = values.policy_name;

                if (this.state.main_extension !== null && this.state.main_extension !== '' && this.state.main_extension !== {} && this.state.main_extension !== undefined && this.state.main_extension !== "undefined") {
                    dupmVar.app_list.push(this.state.main_extension);
                    // console.log('if is called 1')
                }

                if (this.state.main_system_control !== null && this.state.main_system_control !== '' && this.state.main_extension !== {} && this.state.main_extension !== undefined && this.state.main_extension !== "undefined") {
                    dupmVar.app_list.push(this.state.main_system_control);
                    // console.log('if is called 2')
                }

                if (dupmVar.app_list.length) {
                    let indexforDel = dupmVar.app_list.findIndex(item => item === undefined || item === "undefined" || item === '' || item === null || item === {})
                    if (indexforDel > -1) {
                        dupmVar.app_list.splice(indexforDel, 1)
                    }
                }

                // this.state.editAblePolicy.policy_name = values.policy_name;

                // console.log("from data ois", dupmVar)

                Modal.confirm({
                    title: convertToLang(this.props.translation[POLICY_SAVE_CONFIRMATION], "Are You Sure, You Want to Save Changes"),
                    onOk: () => {
                        this.props.SavePolicyChanges(dupmVar);
                        this.props.editPolicyModalHide();
                        this.props.form.resetFields();
                        this.props.getPolicies();
                        this.props.handleAppGotted(true);
                        this.setState({ tabSelected: '1' });

                    },
                    okText: convertToLang(this.props.translation[Button_Save], "Save"),
                    cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
                });
            }
        })
    }

    onSelectChange = selectedRowKeys => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys: selectedRowKeys });
    }


    reset_steps = () => {
        this.setState({ tabSelected: '1' })
        this.props.form.resetFields()
    }

    onCancel = () => {
        this.props.onCancel();
    }

    hideAddPushAppModal = () => {
        this.setState({
            addPushAppModal: false,
            selectedRowKeys: [],
        })
    }

    addApps = (dataType) => {
        this.setState({
            addPushAppModal: true,
            addDataOf: dataType
        })
    }

    addItems = () => {
        if (this.state.selectedRowKeys.length) {
            this.props.addAppsToPolicies(this.state.selectedRowKeys, this.props.editAblePolicyId, this.state.addDataOf)
            this.hideAddPushAppModal()
        }
    }

    callback = (activeKey) => {
        this.setState({ tabSelected: activeKey })
    }

    policyNameChange = async (rule, value, callback) => {
        let response = true
        if (/[^A-Za-z \d]/.test(value)) {
            callback("Please insert only alphabets and numbers.")
        }
        else {
            let substring = value.substring(0, 1);

            if (substring === ' ') {
                callback("Policy name cannot start with blank space.")
            } else {
                if (value && value.length) {
                    response = await RestService.checkPolicyName(value, this.props.editAblePolicyId).then((response) => {
                        if (RestService.checkAuth(response.data)) {
                            if (response.data.status) {
                                return true
                            }
                            else {
                                return false
                            }
                        }
                    });
                    if (response) {
                        callback()
                        this.props.form.setFieldsValue({
                            // policy_name: value,
                            // isPolicy_name: 'success',
                            command_name: '#' + value.replace(/ /g, '_'),
                            // policy_name_error: ''
                        })
                    } else {
                        callback("Policy name already taken please use another name.")
                    }
                }
            }
        }

    }

    filterAddedApps = (apps) => {
        // console.log(this.state.editAblePolicy.push_apps, 'apps =======> ', apps);

        let pushedApps = [];
        if (this.state.editAblePolicy && this.state.editAblePolicy.push_apps) {
            checkIsArray(apps).forEach(app => {
                let index = this.state.editAblePolicy.push_apps.findIndex(item => item.apk_id === app.apk_id);
                // console.log("index ", index);
                if (index === -1) {
                    pushedApps.push(app)
                }
            });
        } else {
            pushedApps = apps;
        }

        // console.log("pushedApps =====> ", pushedApps);
        return pushedApps;
    }

    render() {
        const { current } = this.state;

        const { selectedRows, selectedRowKeys } = this.state;
        const { getFieldDecorator } = this.props.form;
        let rowSelection = {
            selectedRowKeys,
            selectedRows,
            onChange: this.onSelectChange,
        };

        // console.log("this.state.editAblePolicy.app_list ", this.state.editAblePolicy.app_list)
        return (
            <Fragment>
                <div className="policy_steps">
                    <Tabs tabPosition="left" size="small" type="card" activeKey={this.state.tabSelected} onChange={this.callback}>
                        <TabPane tab={convertToLang(this.props.translation[APPS], "APPS")} key="1">
                            <AppList
                                apk_list={this.state.editAblePolicy.push_apps}
                                dataLength={this.state.editAblePolicy.push_apps.length}
                                handleCheckApp={this.handleCheckApp}
                                handleEditPolicy={this.props.handleEditPolicy}
                                handleCheckAll={this.props.handleCheckAll}
                                guestAll={this.props.guestAlldealerApps}
                                encryptedAll={this.props.encryptedAlldealerApps}
                                enableAll={this.props.enableAlldealerApps}
                                removeAppsFromPolicies={this.props.removeAppsFromPolicies}
                                addAppsButton={true}
                                isCheckAllButtons={true}
                                pageType={'appPermissions'}
                                addApps={this.addApps}
                                apps='dealerApps'
                                isSwitch={true}
                                edit={true}
                                rowId={this.state.editAblePolicy.id}
                                isCheckbox={false}
                                pageType={'dealerApps'}
                                translation={this.props.translation}
                            />

                        </TabPane>
                        <TabPane tab={convertToLang(this.props.translation[APPLICATION_PERMISION], "Application Permission")} key="2">
                            <AppList
                                dataLength={this.state.editAblePolicy.app_list.length}
                                apk_list={checkIsArray(this.state.editAblePolicy.app_list).filter(item => item.uniqueName !== "com.android.settingsSettings")}
                                handleEditPolicy={this.props.handleEditPolicy}
                                handleCheckAll={this.props.handleCheckAll}
                                removeAppsFromPolicies={this.props.removeAppsFromPolicies}
                                handleCheckApp={this.handleCheckApp}
                                appPermissions='appPermissions'
                                pageType={'appPermissions'}
                                // addAppsButton={true}
                                isCheckAllButtons={true}
                                addApps={this.addApps}
                                guestAll={this.props.guestAllappPermissions}
                                encryptedAll={this.props.encryptedAllappPermissions}
                                enableAll={this.props.enableAllappPermissions}
                                isSwitch={true}
                                edit={true}
                                rowId={this.state.editAblePolicy.id}
                                translation={this.props.translation}
                            />

                        </TabPane>
                        <TabPane tab={convertToLang(this.props.translation[Tab_SECURE_SETTING], "SECURE SETTINGS")} key="3">
                            {this.state.main_extension !== undefined ?
                                <div>
                                    <Row>
                                        <Col span={6} className="">
                                        </Col>
                                        <Col span={3} className="">
                                            <Avatar src={`${BASE_URL}users/getFile/${this.state.main_extension.icon}`} style={{ width: "30px", height: "30px" }} />
                                            {/* <img src={require("assets/images/secure_setting.png")} /> */}
                                        </Col>
                                        <Col span={15} className="pl-0">
                                            <h5 style={{ marginTop: '9px' }}>{convertToLang(this.props.translation[SECURE_SETTING_PERMISSION], "Secure Settings Permission")}</h5>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={8} className="text-center">
                                            <span>{convertToLang(this.props.translation[Guest], "Guest:")} </span>
                                            <Switch
                                                size="small"
                                                checked={(this.state.main_extension.guest === true || this.state.main_extension.guest === 1) ? true : false}

                                                onClick={(e) => {
                                                    this.handleChecked2(e, "guest", '', 'main');
                                                }}
                                            />
                                        </Col>
                                        <Col span={8} className="text-center">
                                            <span>{convertToLang(this.props.translation[ENCRYPTED], "Encrypted:")} </span>
                                            <Switch
                                                size="small"

                                                checked={(this.state.main_extension.encrypted === true || this.state.main_extension.encrypted === 1) ? true : false}
                                                onClick={(e) => {
                                                    // console.log("encrypted", e);
                                                    this.handleChecked2(e, "encrypted", '', 'main');
                                                }}
                                            />
                                        </Col>
                                        <Col span={8} className="text-center">
                                            <span>{convertToLang(this.props.translation[ENABLE], "Enable:")} </span>
                                            <Switch
                                                size="small"
                                                checked={(this.state.main_extension.enable === true || this.state.main_extension.enable === 1) ? true : false}
                                                onClick={(e) => {
                                                    // console.log("encrypted", e);
                                                    this.handleChecked2(e, "enable", '', 'main');
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </div> : null}
                            <AppList
                                dataLength={this.state.editAblePolicy.secure_apps.length}
                                allExtensions={this.state.editAblePolicy.secure_apps}
                                handleEditPolicy={this.props.handleEditPolicy}
                                handleCheckAll={this.props.handleCheckAll}
                                handleCheckApp={this.handleCheckApp}

                                EditmainExtension={this.state.main_extension}
                                secureSettings='allExtensions'
                                pageType={'allExtensions'}
                                guestAll={this.props.guestAllallExtensions}
                                encryptedAll={this.props.encryptedAllallExtensions}
                                enableAll={this.props.enableAllallExtension}
                                isCheckAllButtons={true}

                                isSwitch={true}
                                edit={true}
                                rowId={this.state.editAblePolicy.id}
                                translation={this.props.translation}
                            />
                        </TabPane>
                        <TabPane tab={convertToLang(this.props.translation[SYSTEM_PERMISSION], "SYSTEM PERMISSION")} key="4">
                            <div>
                                {/* {
                                    this.state.main_system_control !== undefined ?
                                        <div>
                                            <Row>
                                                <Col span={6} className="">
                                                </Col>
                                                <Col span={3} className="">
                                                    <Avatar src={`${BASE_URL}users/getFile/${this.state.main_system_control.icon}`} style={{ width: "30px", height: "30px" }} />

                                                </Col>
                                                <Col span={15} className="pl-0">
                                                    <h5 style={{ marginTop: '9px' }}>Android Settings Permission</h5>
                                                </Col>
                                            </Row>
                                            <Row className="mb-8">
                                                <Col span={8} className="text-center">
                                                    <span>Guest: </span>
                                                    <Switch
                                                        size="small"
                                                        checked={(this.state.main_system_control.guest === true || this.state.main_system_control.guest === 1) ? true : false}
                                                        onClick={(e) => {
                                                            this.handleChecked(e, "guest", '', 'main');
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={8} className="text-center">
                                                    <span>Encrypted: </span>
                                                    <Switch
                                                        size="small"
                                                        checked={(this.state.main_system_control.encrypted === true || this.state.main_system_control.encrypted === 1) ? true : false}
                                                        onClick={(e) => {
                                                            this.handleChecked(e, "encrypted", '', 'main');
                                                        }}
                                                    />
                                                </Col>
                                                <Col span={8} className="text-center">
                                                    <span>Enable: </span>
                                                    <Switch
                                                        size="small"
                                                        checked={(this.state.main_system_control.enable === true || this.state.main_system_control.enable === 1) ? true : false}
                                                        onClick={(e) => {
                                                            this.handleChecked(e, "enable", '', 'main');
                                                        }}
                                                    />

                                                </Col>
                                            </Row>
                                        </div>
                                        : null
                                } */}
                                <Table
                                    pagination={false}
                                    dataSource={this.renderSystemPermissions()}
                                    bordered
                                    columns={columns}
                                    className="add-policy-modal-content">
                                </Table>
                            </div>

                        </TabPane>
                        <TabPane tab={convertToLang(this.props.translation[POLICY_DETAILS], "POLICY DETAILS")} key="5">
                            <Form className="login-form">
                                <Form.Item
                                // validateStatus={this.state.isPolicy_name}
                                // help={this.state.policy_name_error}
                                >
                                    <span className="h3 upper_case">{convertToLang(this.props.translation[NAME], "Name")}</span>
                                    {getFieldDecorator('policy_name', {
                                        initialValue: this.state.policy_name,
                                        rules: [{
                                            required: true, message: convertToLang(this.props.translation[PLEASE_INPUT_POLICY_NAME], "Please Input Policy Name"),
                                        },
                                        {
                                            validator: this.policyNameChange,
                                        }
                                        ],

                                    })(
                                        <Input placeholder={convertToLang(this.props.translation[NAME], "NAME")} className="pol_inp" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <span className="h3">{convertToLang(this.props.translation[POLICY_COMMAND], "Policy Command")}</span>
                                    {getFieldDecorator('command_name', {
                                        initialValue: '#' + this.state.policy_name.replace(/ /g, '_'),

                                    })(
                                        <Input disabled className="pol_inp" />
                                    )}
                                </Form.Item>
                                <Form.Item

                                >
                                    <span className="h3">{convertToLang(this.props.translation[POLICY_NOTE], "Policy Note")}</span>
                                    {getFieldDecorator('command', {
                                        initialValue: this.state.command,

                                        rules: [{
                                            required: true, message: convertToLang(this.props.translation[PLEASE_INPUT_POLICY_NAME], "Please Input Policy Name"),
                                        }],

                                    })(
                                        <Input.TextArea placeholder={convertToLang(this.props.translation[POLICY_NOTE], "Policy Note")} className="ant-input"></Input.TextArea>
                                    )}
                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>
                    <div className="text-center">
                        <Button className="mt-10" onClick={() => this.onCancel()}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                        <Button className="mt-10" type="primary" onClick={() => this.SavePolicyChanges(this.state.policy_name, this.state.command)}>{convertToLang(this.props.translation[Button_Save], "Save")}</Button>
                    </div>


                    <Modal
                        title={convertToLang(this.props.translation[Button_AddApps], "Add Apps")}
                        visible={this.state.addPushAppModal}
                        onOk={this.addItems}
                        onCancel={this.hideAddPushAppModal}
                        okText={convertToLang(this.props.translation[Button_Add], "Add")}
                        cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                        width="400px"
                    >
                        <Table
                            className="exp_policy"
                            style={{ margin: 0, padding: 0 }}
                            rowSelection={rowSelection}
                            scroll={this.props.isHistory ? {} : {}}
                            columns={this.appsColumns}
                            align='center'
                            dataSource={
                                this.renderApp(this.state.addDataOf === 'push_apps' ? this.filterAddedApps(this.props.push_apps) : this.props.appPermissions)
                            }
                            pagination={false}
                            bordered
                        />

                    </Modal>
                </div>
            </Fragment >
        );
    }
}

const WrappedEditPolicyForm = Form.create({ name: 'Edit Policy' })(EditPolicy);

export default WrappedEditPolicyForm;
