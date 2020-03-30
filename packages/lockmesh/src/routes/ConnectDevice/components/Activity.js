import React, { Component, Fragment } from 'react';
import { Modal, message, Input, Table, Switch, Avatar, Card } from 'antd';
import { componentSearch, getFormattedDate, convertToLang, checkValue, checkIsArray } from '../../utils/commonUtils';
import Moment from 'react-moment';
import { SECURE_SETTING, DATE, PROFILE_NAME } from '../../../constants/Constants';
import DeviceSettings from './DeviceSettings';
import { BASE_URL } from '../../../constants/Application';
import styles from './Applist.css';
import { POLICY_APP_NAME, POLICY_NAME, ACTIVITY } from '../../../constants/PolicyConstants';
import { Guest, ENCRYPTED, ENABLE } from '../../../constants/TabConstants';
import { DEVICE_IMEI_1, DEVICE_IMEI_2, ACTIVITIES, DEVICE_ID } from '../../../constants/DeviceConstants';
import CustomScrollbars from '../../../util/CustomScrollbars';

var coppyActivities = [];
var status = true;
export default class Activity extends Component {

    constructor(props) {
        super(props);
        this.appsColumns = [
            {
                title: convertToLang(props.translation[POLICY_APP_NAME], "APP NAME"),
                dataIndex: 'app_name',
                key: '1',
                render: text => <a >{text}</a>,
            }, {
                title: convertToLang(props.translation[Guest], "GUEST"),
                dataIndex: 'guest',
                key: '2',
            }, {
                title: convertToLang(props.translation[ENCRYPTED], "ENCRYPTED"),
                dataIndex: 'encrypted',
                key: '3',
            }, {
                title: convertToLang(props.translation[ENABLE], "ENABLE"),
                dataIndex: 'enable',
                key: '4',
            }
        ];
        this.pullAppsColumns = [
            {
                title: convertToLang(props.translation[POLICY_APP_NAME], "APP NAME"),
                dataIndex: 'app_name',
                key: '1',
                render: text => <a >{text}</a>,
            }
        ];
        this.policyColumns = [
            {
                title: convertToLang(props.translation[POLICY_NAME], "POLICY NAME"),
                dataIndex: 'policy_name',
                key: '1',
                render: text => <a >{text}</a>,
            }
        ];

        this.imeiColumns = [
            {
                title: convertToLang(props.translation[DEVICE_IMEI_1], "IMEI1"),
                dataIndex: 'imei1',
                key: '1',
                render: text => <a >{text}</a>,
            },
            {
                title: convertToLang(props.translation[DEVICE_IMEI_2], "IMEI2"),
                dataIndex: 'imei2',
                key: '2',
                render: text => <a >{text}</a>,
            },
        ];
        this.state = {
            visible: false,
            activities: this.props.activities,
            expandedRowKeys: [],
            device: {}
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
            activities: this.props.activities

        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }
    // handlePagination = (value) => {
    //     this.setState({
    //         pagination: value
    //     })
    // }

    handleComponentSearch = (e) => {
        try {
            let value = e.target.value;
            // console.log(status,'searched value', e.target.value)
            if (value.length) {
                // console.log(status,'searched value', value)
                if (status) {
                    // console.log('status')
                    coppyActivities = this.state.activities;
                    status = false;
                }
                // console.log(this.state.users,'coppy de', coppyDevices)
                let foundActivities = componentSearch(coppyActivities, value);
                //  console.log('found devics', foundImeis)
                if (foundActivities.length) {

                    this.setState({
                        activities: foundActivities,
                    })
                } else {

                    this.setState({
                        activities: [],
                    })
                }
            } else {
                status = true;
                this.setState({
                    activities: coppyActivities,
                })
            }

        } catch (error) {
            console.log('error')
            // alert("hello");
        }
    }


    renderApps = (apps) => {

        return checkIsArray(apps).map(app => {
            console.log(app, `${BASE_URL}users/getFile/${(app.logo) ? `${app.logo}` : `icon_${app.package_name}${app.label}`}`);
            return ({
                key: app.apk_id,
                app_name:
                    <Fragment>
                        <Avatar
                            size={"small"}
                            src={`${BASE_URL}users/getFile/${(app.logo) ? `${app.logo}` : `icon_${app.package_name}${app.label}`}`}
                        // style={{ width: "30px", height: "30px" }} 
                        />
                        <br />
                        <div className="line_break1">{app.apk_name}</div>
                    </Fragment>,
                guest:
                    <Switch
                        size="small"
                        value={app.guest}
                        disabled
                        checked={(app.guest === true || app.guest === 1) ? true : false}

                    />,
                encrypted:
                    <Switch
                        size="small"
                        disabled
                        value={app.encrypted}
                        checked={(app.encrypted === true || app.encrypted === 1) ? true : false}
                    />,
                enable:
                    <Switch
                        size="small"
                        value={app.enable}
                        disabled
                        checked={((app.enable === true) || (app.enable === 1)) ? true : false}
                    />
            });
        });
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

    renderPasswords = (record) => {
        if (record.data.passwords) {
            let passwords = JSON.parse(record.data.passwords);
            for (let key of Object.keys(passwords)) {
                if (passwords[key] !== null && passwords[key] !== 'null' && passwords[key]) {
                    return key.replace(/_/g, ' ').toUpperCase();
                }
            }
        }

    }

    renderList = () => {
        let data = this.state.activities;
        // if (data.length) {
            return checkIsArray(data).map((row, index) => {
                // console.log(row.data);
                return {
                    key: index,
                    action_name: row.action_name.toUpperCase() === 'PASSWORD' ? 'PASSWORD CHANGED' : row.action_name.toUpperCase(),
                    created_at: getFormattedDate(row.created_at),
                    action_by: checkValue(row.action_by),
                    // action_by: (<span className="captilize">{(this.props.auth.authUser.type === ADMIN && row.dealer_id) ? <Link
                    //     to={`/connect-dealer/${btoa(row.dealer_id.toString())}`.trim()}
                    // >
                    //     {checkValue(row.action_by)}</Link> : <a >{checkValue(row.action_by)}</a>}</span>),
                    data: row.data
                }
            })
        // }
    }
    render() {

        // console.log(this.state.activities[16], 'activities to')

        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    maskClosable={false}
                    visible={visible}
                    title=
                    {
                        <div className="pp_popup">
                            <span> {convertToLang(this.props.translation[ACTIVITIES], "Activities")}</span>
                            <Input.Search
                                name="search"
                                key="search"
                                id="search"
                                className="search_heading1"
                                // className="search_heading1"
                                onKeyUp={
                                    (e) => {
                                        this.handleComponentSearch(e)
                                    }
                                }
                                placeholder="Search"
                            />
                            <br />
                            <span>
                                {convertToLang(this.props.translation[DEVICE_ID], "DEVICE ID: ")}
                                {(this.props.device.id) ? this.props.device.device_id : ''}
                            </span>
                        </div>}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="activities"
                >
                    <Card className='fix_card fix_card_activities'>
                        <hr className="fix_header_border" style={{ top: "17px" }} />
                        <CustomScrollbars className="gx-popover-scroll ">
                            <Table
                                columns={[
                                    {
                                        title: convertToLang(this.props.translation[ACTIVITY], "ACTIVITY"),
                                        align: "center",
                                        dataIndex: 'action_name',
                                        key: "action_name",
                                        className: '',
                                        sorter: (a, b) => { return a.action_name.localeCompare(b.action_name) },
                                        sortDirections: ['ascend', 'descend'],
                                    },
                                    {
                                        title: convertToLang(this.props.translation[""], "ACTION BY"),
                                        align: "center",
                                        dataIndex: 'action_by',
                                        key: "action_by",
                                        className: '',
                                        sorter: (a, b) => { return a.action_by.localeCompare(b.action_by) },
                                        sortDirections: ['ascend', 'descend'],

                                    },
                                    {
                                        title: convertToLang(this.props.translation[DATE], "DATE"),
                                        align: "center",
                                        dataIndex: 'created_at',
                                        key: "created_at",
                                        className: '',
                                        sorter: (a, b) => { return new Date(a.created_at) - new Date(b.created_at) },
                                        sortDirections: ['ascend', 'descend'],
                                        defaultSortOrder: 'descend'

                                    },
                                ]}
                                bordered
                                rowClassName={(record, index) =>
                                    this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''
                                    // console.log(this.state.expandedRowKeys,'row is', record.key , 'check' , this.state.expandedRowKeys.includes(record.key))
                                    //  this.state.expandedRowKeys.includes(index) ? 'exp_row' : ''
                                }
                                onExpand={this.onExpandRow}
                                dataSource={this.renderList()}
                                expandedRowRender={record => {
                                    // console.log('recored', record)
                                    if (record.action_name === 'APPS PUSHED') {
                                        return (
                                            <Table
                                                style={{ margin: 0, padding: 0 }}
                                                size='middle'
                                                bordered={false}
                                                columns={this.appsColumns}
                                                align='center'
                                                dataSource={
                                                    this.renderApps(JSON.parse(record.data.push_apps))
                                                }
                                                pagination={false}
                                            />
                                        )
                                    } else if (record.action_name === 'APPS PULLED') {
                                        return (
                                            <Table
                                                style={{ margin: 0, padding: 0 }}
                                                size='middle'
                                                bordered={false}
                                                columns={this.pullAppsColumns}
                                                align='center'
                                                dataSource={
                                                    this.renderApps(JSON.parse(record.data.pull_apps))
                                                }
                                                pagination={false}
                                            />
                                        )
                                    } else if (record.action_name === 'IMEI CHANGED') {
                                        // console.log(record.data, 'expanded row is the')
                                        return (
                                            <Table
                                                style={{ margin: 0, padding: 0 }}
                                                size='middle'
                                                bordered={false}
                                                columns={this.imeiColumns}
                                                align='center'
                                                dataSource={
                                                    [
                                                        {
                                                            key: record.data.id,
                                                            imei1: JSON.parse(record.data.imei).imei1,
                                                            imei2: JSON.parse(record.data.imei).imei2

                                                        }
                                                    ]
                                                }
                                                pagination={false}
                                            />
                                        )
                                    } else if (record.action_name === 'POLICY APPLIED') {
                                        return (
                                            <Table
                                                style={{ margin: 0, padding: 0 }}
                                                size='middle'
                                                bordered={false}
                                                columns={this.policyColumns}
                                                align='center'
                                                dataSource={[
                                                    {
                                                        key: record.data.id,
                                                        policy_name: '#' + record.data.policy_name
                                                    }
                                                ]
                                                }
                                                pagination={false}
                                            />
                                        )
                                    } else if (record.action_name === 'PROFILE APPLIED') {
                                        return (
                                            <Table
                                                style={{ margin: 0, padding: 0 }}
                                                size='middle'
                                                bordered={false}
                                                columns={[{
                                                    title: convertToLang(this.props.translation[PROFILE_NAME], "PROFILE NAME"),
                                                    dataIndex: 'profile_name',
                                                    key: '1',
                                                    render: text => <a >{text}</a>,
                                                }]}
                                                align='center'
                                                dataSource={[
                                                    {
                                                        key: record.data.id,
                                                        profile_name: record.data.profile_name
                                                    }
                                                ]
                                                }
                                                pagination={false}
                                            />
                                        )
                                    } else if (record.action_name === 'SETTING CHANGED') {
                                        let controls = JSON.parse(record.data.controls)

                                        let passwords = JSON.parse(record.data.passwords)
                                        return (
                                            <DeviceSettings
                                                app_list={JSON.parse(record.data.app_list)}
                                                extensions={JSON.parse(record.data.permissions)}
                                                extensionUniqueName={SECURE_SETTING}
                                                isAdminPwd={passwords.admin_password !== null && passwords.admin_password !== 'null' ? true : false}
                                                isDuressPwd={passwords.duress_password !== null && passwords.duress_password !== 'null' ? true : false}
                                                isEncryptedPwd={passwords.encrypted_password !== null && passwords.encrypted_password !== 'null' ? true : false}
                                                isGuestPwd={passwords.guest_password !== null && passwords.guest_password !== 'null' ? true : false}
                                                controls={controls}
                                                show_all_apps={true}
                                                show_unchanged={true}
                                                translation={this.props.translation}
                                                showChangedControls={true}
                                                auth={{ authUser: this.props.auth }}

                                            />
                                        )

                                    } else if (record.action_name === 'PASSWORD CHANGED') {
                                        // console.log( 'password recoerd i sthe ', JSON.parse(record.data.passwords));

                                        return (
                                            <div>
                                                <p style={{ margin: 'auto' }} >{this.renderPasswords(record)} is Changed</p>
                                            </div>
                                        )
                                    }

                                }}
                                // scroll={{ y: 350 }}
                                pagination={false}
                            />
                        </CustomScrollbars>
                    </Card>
                </Modal>

            </div>
        )
    }
}
