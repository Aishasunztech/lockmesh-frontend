import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, Modal, Button, message, Table, Icon, Switch } from "antd";
import update from 'react-addons-update';
import CustomScrollbars from "../../../util/CustomScrollbars";
import PolicyInfo from './PolicyInfo';
import { flagged } from '../../../appRedux/actions/ConnectDevice';
import { ADMIN } from '../../../constants/Constants';
import { convertToLang, getFormattedDate, convertTimezoneValue, checkIsArray } from '../../utils/commonUtils';
import styles from './policy.css';
import { Button_Save, Button_Yes, Button_No, Button_Edit, Button_Delete, Button_Save_Changes, Button_Cancel } from '../../../constants/ButtonConstants';
import { POLICY } from '../../../constants/ActionTypes';
import { POLICY_SAVE_CONFIRMATION, POLICY_DELETE_CONFIRMATION, POLICY_CHANGE_DEFAULT_CONFIRMATION, EXPAND, POLICY_EXPAND } from '../../../constants/PolicyConstants';
import { Tab_All } from '../../../constants/TabConstants';
// import moment from 'moment';
import moment from 'moment-timezone';
import scrollIntoView from 'scroll-into-view';
import { TIMESTAMP_FORMAT } from '../../../constants/Application';

const confirm = Modal.confirm;
const warning = Modal.warning;

class PolicyList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expandedRowKeys: [],
            expandTabSelected: [],
            expandedByCustom: [],
            pagination: this.props.pagination,
            savePolicyButton: false

        }
    }

    expandRow = (rowId, btnof, expandedByCustom = false) => {

        if (this.state.expandedRowKeys.includes(rowId)) {
            var index = this.state.expandedRowKeys.indexOf(rowId);
            if (index !== -1) this.state.expandedRowKeys.splice(index, 1);
            this.setState({
                expandedRowKeys: this.state.expandedRowKeys,

            })
        }
        else {
            this.state.expandedRowKeys.push(rowId);

            const newItems = [...this.state.expandTabSelected];
            newItems[rowId] = (btnof === 'info' || btnof === 'edit') ? '1' : '6';
            if (btnof === 'edit') {
                this.setState({
                    expandedRowKeys: this.state.expandedRowKeys,
                    expandTabSelected: newItems,
                    isSwitch: btnof === 'edit' ? true : false,
                    [rowId]: rowId,
                    savePolicyButton: true
                })
            } else {
                this.setState({
                    expandedRowKeys: this.state.expandedRowKeys,
                    expandTabSelected: newItems,
                    [rowId]: null,
                    // isSwitch: btnof === 'edit' ? true : false,
                    savePolicyButton: false

                })
            }
        }
    }

    handleScroll = () => {
        if (this.props.location.state) {
            scrollIntoView(document.querySelector('.exp_row'), {
                align: {
                    top: 0,
                    left: 0
                },
            });
        }
    }


    SavePolicyChanges = (record) => {

        Modal.confirm({
            title: convertToLang(this.props.translation[POLICY_SAVE_CONFIRMATION], "Are You Sure, You Want to Save Changes"),
            onOk: () => {
                this.props.SavePolicyChanges(record);
            },
            // content: 'Bla bla ...',
            okText: convertToLang(this.props.translation[Button_Save], "Save"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
        });
    }


    deletePolicy = (id, policies) => {
        let _this = this

        if (policies && policies.length) {
            Modal.error({
                title: `This Policy Can't be deleted`,
                content: (
                    <Fragment>
                        This policy is used in permissions
                    </Fragment>
                ),
            });
        } else {
            confirm({
                title: convertToLang(_this.props.translation[POLICY_DELETE_CONFIRMATION], "Do you want to delete this Policy?"),
                onOk() {
                    _this.props.handlePolicyStatus(1, 'delete_status', id, _this.props.translation)
                },
                onCancel() { },
                okText: convertToLang(_this.props.translation[Button_Yes], "Yes"),
                cancelText: convertToLang(_this.props.translation[Button_No], "No")

            });
        }
    }

    renderList(list) {

        return checkIsArray(list).map((policy, index) => {
            // console.log("policy ", policy)
            return {
                key: policy.id,
                rowKey: policy.id,
                isChangedPolicy: policy.isChangedPolicy ? policy.isChangedPolicy : false,
                id: policy.id,
                statusAll: policy.statusAll,
                action:
                    (policy.dealer_id === this.props.user.id || this.props.user.type === ADMIN) ?
                        (
                            <Fragment>
                                <Button
                                    style={{ marginRight: 7, marginLeft: 7, textTransform: "uppercase" }}
                                    type="primary"
                                    size="small"
                                    onClick={() => {
                                        // this.expandRow(index, 'edit', true) 
                                        this.props.checktogglebuttons(policy)
                                        this.props.editPolicyModal(policy)
                                    }}
                                >
                                    {convertToLang(this.props.translation[Button_Edit], "EDIT")}
                                </Button>
                                <Button
                                    style={{ marginRight: 7, textTransform: "uppercase" }}
                                    type="danger"
                                    size="small"
                                    onClick={() => { this.deletePolicy(policy.id, policy.dealer_permission) }}
                                >
                                    {convertToLang(this.props.translation[Button_Delete], "DELETE")}
                                </Button>
                            </Fragment>
                        ) : null
                ,
                policy_info: (
                    <Fragment>
                        <a onClick={() =>
                            this.expandRow(policy.id, 'info', true)
                        }>
                            <Icon type="arrow-down" style={{ fontSize: 15 }} />
                        </a>
                        <span className="exp_txt">{convertToLang(this.props.translation[POLICY_EXPAND], "Expand")}</span>
                    </Fragment>
                )
                ,
                permission: <span style={{ fontSize: 15, fontWeight: 400 }}>
                    {/* {(policy.permission_count == 'All') ? convertToLang(this.props.translation[Tab_All], "All") : policy.permission_count} */}
                    {(policy.permission_count === "All" || (this.props.totalDealers === policy.permission_count && policy.permission_count !== 0)) ? convertToLang(this.props.translation[Tab_All], "All") : policy.permission_count}
                </span>,
                permissions: (policy.dealer_permission !== undefined || policy.dealer_permission !== null) ? policy.dealer_permission : [],
                policy_status: (
                    <Switch
                        size='small'
                        checked={policy.status === 1 || policy.status === true ? true : false}
                        onChange={(e) => { this.props.handlePolicyStatus(e, 'status', policy.id, this.props.translation) }}
                        disabled={(policy.dealer_id === this.props.user.id || this.props.user.type === ADMIN) ? false : true}
                    />
                ),
                policy_note: (policy.policy_note) ? `${policy.policy_note}` : "N/A",
                policy_command: (policy.command_name) ? `${policy.command_name}` : "N/A",
                policy_name: (policy.policy_name) ? `${policy.policy_name}` : "N/A",
                push_apps: policy.push_apps,
                app_list: policy.app_list,
                controls: policy.controls,
                secure_apps: policy.secure_apps,
                policy_size: policy.policy_size,
                default_policy: (
                    <Switch
                        size='small'
                        checked={policy.is_default}
                        onChange={(e) => { this.handleDefaultChange(e, policy.id) }}
                        disabled={(policy.status === 1 || policy.status === true) ? false : true}
                    />
                ),
                created_by: policy.created_by,
                created_date: convertTimezoneValue(this.props.user.timezone, policy.created_date),
                last_edited: convertTimezoneValue(this.props.user.timezone, policy.last_edited),
                // created_date: (policy.created_date && policy.created_date != "N/A") ? moment(policy.created_date).tz(convertTimezoneValue(this.props.user.timezone)).format("YYYY-MM-DD HH:mm:ss") : 'N/A',
                // last_edited: (policy.last_edited && policy.last_edited != "N/A") ? moment(policy.last_edited).tz(convertTimezoneValue(this.props.user.timezone)).format("YYYY-MM-DD HH:mm:ss") : 'N/A',
                // created_date: moment(policy.created_date).format("YYYY/MM/DD hh:mm:ss"),
                // last_edited: policy.last_edited ? moment(policy.last_edited).format("YYYY/MM/DD hh:mm:ss") : "N/A",
            }
        });

    }

    handleDefaultChange(e, policy_id) {

        let _this = this
        confirm({
            title: convertToLang(this.props.translation[POLICY_CHANGE_DEFAULT_CONFIRMATION], "Do you want to change your default Policy?"),
            onOk() {
                _this.props.defaultPolicyChange(e, policy_id)
            },
            onCancel() { },
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No")

        });
    }

    customExpandIcon(props) {
        // console.log(props);
        if (props.expanded) {
            // if (this.state.expandedByCustom[props.record.rowKey]) {
            if (!this.state.expandedRowKeys.includes(props.record.rowKey)) {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>
            } else {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-down" /></a>
            }
        } else {

            // if (this.state.expandedByCustom[props.record.rowKey]) {
            if (!this.state.expandedRowKeys.includes(props.record.rowKey)) {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>
            } else {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>

            }
        }
    }

    handlePagination = (value) => {
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    componentDidMount() {
        checkIsArray(this.props.policies).map((policy, index) => {
            this.state.expandTabSelected[index] = '1';
            // this.state.expandedByCustom[index] = false;
        });

        if (this.props.location.state && this.props.location.state.id) {
            const newItems = [...this.state.expandTabSelected];
            newItems[this.props.location.state.id] = '1';
            this.setState({
                expandedRowKeys: this.props.location.state.id ? [this.props.location.state.id] : [],
                expandTabSelected: newItems,
            })
        }
    }

    componentWillReceiveProps(preProps) {
        if (preProps.policies.length !== this.props.policies.length) {
            checkIsArray(this.props.policies).map((policy, index) => {
                this.state.expandTabSelected[index] = '1';
                // this.state.expandedByCustom[index] = false
            });
        }
    }

    render() {
        this.handleScroll()
        if (this.props.user.type === ADMIN) {
            let index = this.props.columns.findIndex(k => k.dataIndex === 'default_policy');
            this.props.columns[index].className = 'hide';
            // this.props.columns[index].children[0].className = 'hide';
        }
        return (
            <Fragment>
                <Card className="fix_card policy_fix_card">
                    <hr className="fix_header_border" style={{ top: "57px" }} />
                    <CustomScrollbars className="gx-popover-scroll">
                        <Table
                            className="devices policy_expand"
                            rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.id) ? 'exp_row' : ''}
                            size="default"
                            bordered
                            rowKey={record => record.id}
                            expandIcon={(props) => this.customExpandIcon(props)}
                            // onExpand={this.onExpandRow}
                            expandedRowRender={(record, index, indent, expanded) => {
                                // console.log("record ", record)
                                return (
                                    <div>
                                        {/* Save Policy Button */}
                                        {/* {
                                            this.state.savePolicyButton ?
                                                <Button onClick={() => this.SavePolicyChanges(record)}> {convertToLang(this.props.translation[Button_Save_Changes], "Save Changes")} </Button>
                                                : false
                                        } */}

                                        <PolicyInfo
                                            key={record.id}
                                            push_apps={this.props.push_apps}
                                            selected={this.state.expandTabSelected[record.rowKey]}
                                            policy={record}
                                            isSwitch={this.state.isSwitch && this.state[record.rowKey] == record.rowKey ? true : false}
                                            rowId={record.id}
                                            handleEditPolicy={this.props.handleEditPolicy}
                                            handleCheckAll={this.props.handleCheckAll}
                                            // edit={true}
                                            guestAlldealerApps={this.props.guestAlldealerApps}
                                            encryptedAlldealerApps={this.props.encryptedAlldealerApps}
                                            enableAlldealerApps={this.props.enableAlldealerApps}
                                            guestAllappPermissions={this.props.guestAllappPermissions}
                                            encryptedAllappPermissions={this.props.encryptedAllappPermissions}
                                            enableAllappPermissions={this.props.enableAllappPermissions}
                                            guestAllallExtensions={this.props.guestAllallExtensions}
                                            encryptedAllallExtensions={this.props.encryptedAllallExtensions}
                                            enableAllallExtensions={this.props.enableAllallExtension}
                                            handleAppGotted={this.props.handleAppGotted}
                                            appsGotted={this.props.appsGotted}
                                            savePermission={this.props.savePermission}
                                            translation={this.props.translation}
                                        />
                                    </div>
                                )
                            }}
                            // expandIconColumnIndex={1}         
                            expandIconColumnIndex={3}
                            expandedRowKeys={this.state.expandedRowKeys}
                            expandIconAsCell={false}
                            columns={this.props.columns}
                            onChange={this.props.onChangeTableSorting}
                            dataSource={this.renderList(this.props.policies)}
                            pagination={false
                                // { pageSize: this.state.pagination, size: "midddle" }
                            }
                            // rowKey="policy_list"
                            ref='policy_table'
                        />
                    </CustomScrollbars>
                </Card>

            </Fragment>
        )
    }
}

export default PolicyList;