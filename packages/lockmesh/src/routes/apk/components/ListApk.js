// Libraries
import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Tabs, Row, Col, Tag } from "antd";
import { Link } from 'react-router-dom';
import moment from 'moment';

// Components
import EditApk from './EditApk';
import UpdateFeatureApk from './UpdateFeatureApk';
import Permissions from '../../utils/Components/Permissions';

// Helpers
import {
    convertToLang, convertTimezoneValue, checkIsArray
} from '../../utils/commonUtils';
import CustomScrollbars from "../../../util/CustomScrollbars";

// Styles
import styles from './app.css';

// Constants
import { BASE_URL, DATE_FORMAT, TIMESTAMP_FORMAT } from '../../../constants/Application';
import { Button_Edit, Button_Delete } from '../../../constants/ButtonConstants';
import { ADMIN } from '../../../constants/Constants';
import { Tab_All } from '../../../constants/TabConstants';
import { FEATURED_APK_PACKAGES } from '../../../constants/ApkConstants'

const TabPane = Tabs.TabPane;

export default class ListApk extends Component {
    state = { visible: false }

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            columns: [],
            pagination: this.props.pagination,
            expandedRowKeys: [],
            selectedTab: '1'

        };

    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }


    handlePagination = (value) => {

        var x = Number(value)
        // console.log(value)
        this.setState({
            pagination: x,
        });

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {
            // console.log(this.props.columns);
            this.setState({
                columns: this.props.columns
            })
        }
    }

    handleCheckChange = (values) => {

        let dumydata = this.state.columns;
        // console.log('values', values);

        if (values.length) {

            checkIsArray(this.state.columns).map((column, index) => {

                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                }

                checkIsArray(values).map((value) => {
                    if (column.title === value) {
                        dumydata[index].className = '';
                    }
                });

            });

            this.setState({ columns: dumydata });

        } else {
            const newState = checkIsArray(this.state.columns).map((column) => {
                if (column.className === 'row') {
                    return column;
                } else {
                    return ({ ...column, className: 'hide' })
                }
            });

            this.setState({
                columns: newState,
            });
        }

    }

    // renderList
    renderList = (list) => {
        let apkList = [];
        let data
        checkIsArray(list).map((app) => {
            if (!FEATURED_APK_PACKAGES.includes(app.package_name)) {
                let usedBy = [];
                if (app.policies && app.policies.length) {
                    usedBy.push(<Tag color="green" key="Policies">
                        Policies
                    </Tag>)
                }

                if (app.permission_count != 0) {
                    usedBy.push(<Tag color="green" key="Permissions">Permissions</Tag>)
                }

                if (!usedBy.length) {
                    usedBy.push(<Tag key="Not Used">Not Used</Tag>)
                }

                data = {
                    rowKey: app.apk_id,
                    id: app.apk_id,
                    statusAll: app.statusAll,
                    action: (
                        <div data-column="ACTION" style={{ display: "inline-flex" }}>
                            <Fragment>
                                {/* EDIT APK BUTTON */}
                                <Button type="primary" size="small" style={{ margin: '0px 8px 0 0px', textTransform: "uppercase" }}
                                    onClick={(e) => { this.refs.editApk.showModal(app, this.props.editApk) }} >
                                    {convertToLang(this.props.translation[Button_Edit], "EDIT")}
                                </Button>

                                {/* DELETE APK BUTTON */}
                                {/* {((!app.policies || app.policies.length === 0) && app.permission_count == 0) ? */}
                                <Button
                                    type="danger"
                                    className="mob_m_t"
                                    size="small"
                                    style={{ textTransform: "uppercase" }}
                                    onClick={(e) => {
                                        this.props.handleConfirmDelete(app.apk_id, app, usedBy);
                                    }}
                                >
                                    {convertToLang(this.props.translation[Button_Delete], "DELETE")}
                                </Button>
                                {/* : null} */}

                            </Fragment>
                        </div>
                    ),
                    permission: (
                        <div data-column="PERMISSION" style={{ fontSize: 15, fontWeight: 400, display: "inline-block" }}>
                            {/* {app.permission_count} */}
                            {(app.permission_count === "All" || (this.props.totalDealers === app.permission_count && app.permission_count !== 0)) ? convertToLang(this.props.translation[Tab_All], "All") : app.permission_count}
                        </div>
                    ),
                    permissions: app.permissions,
                    apk_status: (
                        <div data-column="SHOW ON DEVICE1">
                            <Switch size="small" checked={(app.apk_status === "On") ? true : false} onChange={(e) => {
                                this.props.handleStatusChange(e, app.apk_id);
                            }} />
                        </div>
                    ),
                    apk: (
                        <div data-column="SHOW ON DEVICE2">
                            {app.apk ? app.apk : 'N/A'}
                        </div>
                    ),
                    apk_name: app.apk_name ? app.apk_name : 'N/A',
                    apk_logo: (
                        <div data-column="APK LOGO">
                            <Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />
                        </div>),
                    apk_size: (
                        <div data-column="APP SIZE">
                            {app.size ? app.size : 'N/A'}
                        </div>
                    ),
                    label: app.label,
                    package_name: app.package_name,
                    version: app.version,
                    used_by: <Fragment>{usedBy}</Fragment>,
                    policies: (app.policies === undefined || app.policies === null) ? [] : app.policies,
                    created_at: convertTimezoneValue(this.props.user.timezone, app.created_at),
                    updated_at: convertTimezoneValue(this.props.user.timezone, app.updated_at),
                    // created_at: (app.created_at && app.created_at != "N/A") ? moment(app.created_at).tz(convertTimezoneValue(this.props.user.timezone)).format("YYYY-MM-DD HH:mm:ss") : 'N/A',
                    // updated_at: (app.updated_at && app.updated_at != "N/A") ? moment(app.updated_at).tz(convertTimezoneValue(this.props.user.timezone)).format("YYYY-MM-DD HH:mm:ss") : 'N/A',
                    // created_at: app.created_at,
                    // updated_at: app.updated_at
                }
                apkList.push(data)


            }
        });
        return apkList
    }

    renderFeaturedList(list) {
        let featureApk = []
        checkIsArray(list).map((app) => {
            if (FEATURED_APK_PACKAGES.includes(app.package_name)) {
                let data = {
                    rowKey: app.apk_id,
                    id: app.apk_id,
                    statusAll: app.statusAll,
                    permission: <span style={{ fontSize: 15, fontWeight: 400, display: "inline-block" }}>
                        {/* {app.permission_count} */}
                        {(app.permission_count === "All" || this.props.totalDealers === app.permission_count) ? convertToLang(this.props.translation[Tab_All], "All") : app.permission_count}
                    </span>,
                    permissions: app.permissions,
                    apk_name: app.apk_name,
                    apk_logo: (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />),
                    apk_version: app.version,
                    apk_size: app.size ? app.size : "N/A",
                    updated_date: convertTimezoneValue(this.props.user.timezone, app.updated_at),
                    // 'updated_date': app.updated_at,
                    package_name: app.package_name,
                    policies: (app.policies === undefined || app.policies === null) ? [] : app.policies,
                }
                featureApk.push(data)
            }
        });
        // console.log("featured APP", featureApk);
        return featureApk
    }

    updateFeaturedApk = (type) => {
        // console.log(type);
        let appDetails = {};
        switch (type) {
            case "SMAIL": {
                checkIsArray(this.props.apk_list).map((app) => {
                    if (app.package_name === 'com.android.smail') {
                        appDetails = app
                    }
                });
                break;
            }
            case "SCHAT": {
                checkIsArray(this.props.apk_list).map((app) => {
                    if (app.package_name === 'com.schat.android') {
                        appDetails = app
                    }
                });
                break;
            }
            case "SVPN": {
                checkIsArray(this.props.apk_list).map((app) => {
                    if (app.package_name === 'com.secure.vpn') {
                        appDetails = app
                    }
                });
                break;
            }
            case "SVAULT": {
                checkIsArray(this.props.apk_list).map((app) => {
                    if (app.package_name === 'com.secure.svault') {
                        appDetails = app
                    }
                });
                break;
            }
            case "D2D": {
                checkIsArray(this.props.apk_list).map((app) => {
                    if (app.package_name === 'com.secure.d2d') {
                        appDetails = app
                    }
                });
                break;
            }
            default:
                break;
        }
        if (appDetails.apk) {
            this.refs.updateFeatureApk.showModal(appDetails, this.props.editApk, type, false)
        } else {
            this.refs.updateFeatureApk.showModal(appDetails, this.props.addApk, type, true)
        }
    }

    onSelectChange = (selectedRowKeys) => {
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

    onExpandRow = (expanded, record) => {
        // console.log(expanded, 'data is expanded', record);
        if (expanded) {
            if (!this.state.expandedRowKeys.includes(record.rowKey)) {
                this.state.expandedRowKeys.push(record.rowKey);
                this.setState({ expandedRowKeys: this.state.expandedRowKeys })
            }
        } else if (!expanded) {
            if (this.state.expandedRowKeys.includes(record.rowKey)) {
                let list = checkIsArray(this.state.expandedRowKeys).filter(item => item !== record.rowKey)
                this.setState({ expandedRowKeys: list })
            }
        }
    }

    renderPolicies = (record) => {
        console.log(record, 'all policies');

        if (record.policies !== undefined && record.policies !== null) {
            return checkIsArray(record.policies).map((policy, index) => {
                return {
                    key: index,
                    id: policy.id,
                    policy_name: <Link to={{
                        pathname: '/policy',
                        state: {
                            id: policy.policy_id
                        }
                    }}>{policy.policy_name}</Link>,
                    policy_command: policy.command_name

                }
            })
        } else {
            return [];
        }
    }

    handleTabChange = (e) => {
        this.setState({
            selectedTab: e
        })

    }

    render() {
        let type = this.props.user.type
        let styleType = {};
        let styleType1 = {};
        if (type === ADMIN) {
            styleType = "apk_fix_card_admin"
            styleType1 = "feat_apk_fix_card_admin"
        } else {
            styleType = "apk_fix_card_dealer"
            styleType1 = "feat_apk_fix_card_dealer"
        }
        return (
            <Fragment>
                <Tabs
                    type="card"
                    className="dev_tabs"
                    activeKey={this.state.selectedTab}
                    onChange={this.handleTabChange}
                >
                    <TabPane tab={<span className="green">{convertToLang(this.props.translation["FEATURED APPS"], "FEATURED APPS")}</span>} key="1" >
                    </TabPane>
                    <TabPane tab={<span className="green">{convertToLang(this.props.translation["OTHER APPS"], "OTHER APPS")}</span>} key="4" forceRender={true}>
                    </TabPane>
                </Tabs>
                {(this.state.selectedTab == '1') ?
                    <div className="feat_btns">
                        <Row>
                            <Col xs={24} sm={24} md={4} lg={4} xl={4} className="ver0tical_center">
                                <h2 className="mb-0">{convertToLang(this.props.translation["FEATURED APPS"], "FEATURED APPS")}</h2>
                            </Col>
                            {(this.props.user.type === ADMIN) ?
                                <Fragment>

                                    <Col xs={12} sm={12} md={4} lg={4} xl={4} className="m_mt-16 b_p-8">
                                        <Button
                                            type="primary"
                                            style={{ width: '100%', padding: "0" }}
                                            onClick={() => { this.updateFeaturedApk('SMAIL') }}
                                        >
                                            UPDATE SMAIL</Button>
                                    </Col>

                                    <Col xs={12} sm={12} md={4} lg={4} xl={4} className="m_mt-16 b_p-8">
                                        <Button
                                            type="primary"
                                            style={{ width: '100%', padding: "0" }}
                                            onClick={() => { this.updateFeaturedApk('SCHAT') }}
                                        >
                                            UPDATE SCHAT</Button>
                                    </Col>

                                    <Col xs={12} sm={12} md={4} lg={4} xl={4} className="m_mt-16 b_p-8">
                                        <Button
                                            type="primary"
                                            style={{ width: '100%', padding: "0" }}
                                            onClick={() => { this.updateFeaturedApk('D2D') }}
                                        >
                                            UPDATE D2D</Button>
                                    </Col>

                                    <Col xs={12} sm={12} md={4} lg={4} xl={4} className="m_mt-16 b_p-8">
                                        <Button
                                            type="primary"
                                            style={{ width: '100%', padding: "0" }}
                                            onClick={() => { this.updateFeaturedApk('SVAULT') }}
                                        >
                                            UPDATE SVAULT</Button>
                                    </Col>

                                    <Col xs={12} sm={12} md={4} lg={4} xl={4} className="m_mt-16 b_p-8">
                                        <Button
                                            type="primary"
                                            style={{ width: '100%', padding: "0" }}
                                            onClick={() => { this.updateFeaturedApk('SVPN') }}
                                        >
                                            UPDATE SVPN</Button>
                                    </Col>
                                </Fragment>
                                : null}
                        </Row>
                        <Card className={`fix_card ${styleType1}`}>
                            <CustomScrollbars className="gx-popover-scroll ">
                                <Table
                                    className="gx-table-responsive apklist_table"
                                    rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.rowKey) ? 'exp_row' : ''}
                                    expandIcon={(props) => this.customExpandIcon(props)}
                                    expandedRowRender={(record) => {
                                        console.log('record is: ', record);
                                        return (
                                            // <Permissions className="exp_row22" record={record} translation={this.props.translation} />
                                            <Fragment>
                                                <Tabs
                                                    className="exp_tabs_policy"
                                                    type="card"
                                                >
                                                    <Tabs.TabPane tab={convertToLang(this.props.translation['PERMISSIONS'], "PERMISSIONS")} key="1">
                                                        <Permissions
                                                            className="exp_row22"
                                                            record={record}
                                                            permissionType="apk"
                                                            savePermissionAction={this.props.savePermission}
                                                            translation={this.props.translation}
                                                        />
                                                    </Tabs.TabPane>
                                                    {(this.props.user.type === ADMIN) ?
                                                        <Tabs.TabPane tab={convertToLang(this.props.translation['POLICIES'], "POLICIES")} key="2">
                                                            <Table
                                                                columns={[
                                                                    {
                                                                        title: "#",
                                                                        dataIndex: 'counter',
                                                                        align: 'center',
                                                                        className: 'row',
                                                                        render: (text, record, index) => ++index,
                                                                    },
                                                                    {
                                                                        key: "policy_name",
                                                                        dataIndex: "policy_name",
                                                                        title: 'Policy Name'
                                                                    },
                                                                    {
                                                                        key: "policy_command",
                                                                        dataIndex: "policy_command",
                                                                        title: 'Policy Command'
                                                                    }
                                                                ]}
                                                                dataSource={this.renderPolicies(record)}
                                                            />
                                                        </Tabs.TabPane>
                                                        : null
                                                    }
                                                </Tabs>
                                            </Fragment>
                                            /*<Fragment>
                                                <Tabs
                                                    className="exp_tabs_policy"
                                                    type="card"
                                                >
                                                    <Tabs.TabPane tab={convertToLang(this.props.translation['PERMISSIONS'], "PERMISSIONS")} key="1">
                                                        <Permissions className="exp_row22" record={record} translation={this.props.translation} />
                                                    </Tabs.TabPane>
                                                    <Tabs.TabPane tab={convertToLang(this.props.translation['POLICIES'], "POLICIES")} key="2">
            
                                        </Tabs.TabPane>
                                                </Tabs>
                                            </Fragment>*/
                                        );
                                    }}
                                    onExpand={this.onExpandRow}
                                    expandIconColumnIndex={0}
                                    expandIconAsCell={false}
                                    size="small"
                                    bordered
                                    // scroll={{ x: true }}
                                    columns={this.props.featureApkcolumns}
                                    dataSource={this.renderFeaturedList(this.props.apk_list)}
                                    onChange={this.props.onChangeTableSorting}
                                    pagination={false
                                        //{ pageSize: Number(this.state.pagination) }
                                    }
                                    // scroll={{ x: 10 }}
                                    rowKey="apk_id"
                                />
                            </CustomScrollbars>
                            <UpdateFeatureApk ref='updateFeatureApk' getApkList={this.props.getApkList} />
                        </Card>
                    </div> :
                    <Card className={`fix_card ${styleType}`}>
                        <hr className="fix_header_border" style={{ top: "63px" }} />
                        <CustomScrollbars className="gx-popover-scroll ">
                            <Table
                                className="gx-table-responsive apklist_table"
                                // rowSelection={rowSelection}
                                // expandableRowIcon={<Icon type="right" />}
                                // collapsedRowIcon={<Icon type="down" />}
                                rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.rowKey) ? 'exp_row' : ''}
                                expandIcon={(props) => this.customExpandIcon(props)}
                                expandedRowRender={(record) => {
                                    return (

                                        <Fragment>
                                            <Tabs
                                                className="exp_tabs_policy"
                                                type="card"
                                            >
                                                <Tabs.TabPane tab={convertToLang(this.props.translation['PERMISSIONS'], "PERMISSIONS")} key="1">
                                                    <Permissions
                                                        className="exp_row22"
                                                        record={record}
                                                        permissionType="apk"
                                                        savePermissionAction={this.props.savePermission}
                                                        translation={this.props.translation}
                                                    />
                                                </Tabs.TabPane>
                                                {(this.props.user.type === ADMIN) ?
                                                    <Tabs.TabPane tab={convertToLang(this.props.translation['POLICIES'], "POLICIES")} key="2">
                                                        <Table
                                                            columns={[
                                                                {
                                                                    title: "#",
                                                                    dataIndex: 'counter',
                                                                    align: 'center',
                                                                    className: 'row',
                                                                    render: (text, record, index) => ++index,
                                                                },
                                                                {
                                                                    key: "policy_name",
                                                                    dataIndex: "policy_name",
                                                                    title: 'Policy Name'
                                                                },
                                                                {
                                                                    key: "policy_command",
                                                                    dataIndex: "policy_command",
                                                                    title: 'Policy Command'
                                                                }
                                                            ]}
                                                            dataSource={this.renderPolicies(record)}
                                                        />
                                                    </Tabs.TabPane>
                                                    : null
                                                }
                                            </Tabs>
                                        </Fragment>
                                    );

                                }}
                                onExpand={this.onExpandRow}
                                expandIconColumnIndex={2}
                                expandIconAsCell={false}
                                size="midddle"
                                bordered
                                columns={this.state.columns}
                                dataSource={this.renderList(this.props.apk_list)}
                                onChange={this.props.onChangeTableSorting}
                                pagination={false
                                    //{ pageSize: Number(this.state.pagination) }
                                }
                                // scroll={{ x: true }}
                                rowKey="apk_id"
                            />
                        </CustomScrollbars>
                        <EditApk ref='editApk' getApkList={this.props.getApkList} />

                    </Card>
                }

            </Fragment >
        )
    }
}