import React, { Component, Fragment } from 'react'
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import scrollIntoView from 'scroll-into-view';
import { Card, Row, Col, List, Button, message, Table, Icon, Switch, Modal } from "antd";

import CustomScrollbars from "../../../util/CustomScrollbars";
import { getFormattedDate, convertToLang, getDateTimeOfClientTimeZone, convertTimezoneValue, checkIsArray } from '../../utils/commonUtils';

import UserDeviceList from './UserDeviceList'
import AddUser from './AddUser';
import {
    Button_Delete,
    Button_Edit,
    Button_Undo,
} from '../../../constants/ButtonConstants';
import moment from 'moment-timezone';
import { EDIT_USER, DELETE_USER, DO_YOU_WANT_TO_DELETE_USER, UNDO, DO_YOU_WANT_TO_UNDO_USER } from '../../../constants/UserConstants';
import { ADMIN } from '../../../constants/Constants';

import styles from './user.css';
import { TIMESTAMP_FORMAT } from '../../../constants/Application';
// import styles1 from './users_fixheader.css';

const confirm = Modal.confirm

class UserList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            pagination: this.props.pagination,
            users: [],
            expandedRowKeys: [],
            scrollStatus: true
        }
    }
    handlePagination = (value) => {
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    handleSearch2 = () => {
        // console.log('refs of all', this.refs)

    }

    renderList(list) {
        // console.log(list);

        let user_list = checkIsArray(list).filter((data) => {
            // if (data.type === "policy") {
            return data
            // }
        })
        return checkIsArray(user_list).map((user, index) => {
            // this.state.expandTabSelected[index]='1';
            // this.state.expandedByCustom[index]=false;
            return {
                key: `${user.user_id}`,
                rowKey: `${user.user_id}`,
                counter: ++index,
                action: (
                    <Fragment>
                        <div>
                            <Button
                                type="primary"
                                size="small"
                                style={{ textTransform: 'uppercase' }}
                                onClick={() => this.refs.edit_user.showModal(this.props.editUser, user, convertToLang(this.props.translation[EDIT_USER], "Edit User"))}
                            >
                                {convertToLang(this.props.translation[Button_Edit], "EDIT")}
                            </Button>
                            {(user.devicesList.length === 0) ?
                                (user.del_status == 0) ?
                                    <Button
                                        type="danger"
                                        size="small"
                                        style={{ textTransform: 'uppercase' }}
                                        onClick={() => showConfirm(this.props.deleteUser, user.user_id, convertToLang(this.props.translation[DO_YOU_WANT_TO_DELETE_USER], "Do you want to DELETE user "), 'DELETE USER')}
                                    >
                                        {convertToLang(this.props.translation[Button_Delete], "DELETE")}
                                    </Button>
                                    : <Button
                                        type="dashed"
                                        size="small"
                                        style={{ textTransform: 'uppercase' }}
                                        onClick={() => showConfirm(this.props.undoDeleteUser, user.user_id, convertToLang(this.props.translation[UNDO], "Do you want to UNDELETE user "), 'UNDO')}
                                    >
                                        {convertToLang(this.props.translation[Button_Undo], "UNDELETE")}
                                    </Button>
                                : null
                            }
                        </div>
                    </Fragment>
                )
                ,
                user_id: user.user_id,
                devices: (user.devicesList) ? user.devicesList.length : 0,
                devicesList: user.devicesList,
                user_name: user.user_name,
                email: user.email,
                tokens: 'N/A',
                created_at: convertTimezoneValue(this.props.user.timezone, user.created_at),
                // created_at: (user.created_at) ? moment(user.created_at).tz(convertTimezoneValue(this.props.user.timezone)).format("YYYY-MM-DD HH:mm:ss") : 'N/A',
                // created_at: getFormattedDate(user.created_at)
            }
        });

    }

    customExpandIcon(props) {
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /> </a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }
    componentDidMount() {
        this.setState({
            users: this.props.users,
            expandedRowKeys: this.props.expandedRowsKey
        });
        // this.handleScroll()
    }

    onExpandRow = (expanded, record) => {
        console.log(expanded, 'data is expanded', record);
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

    componentDidUpdate(prevProps) {

        if (JSON.stringify(this.props.expandedRowsKey) !== JSON.stringify(prevProps.expandedRowsKey)) {
            this.setState({
                expandedRowKeys: this.props.expandedRowsKey
            })
        }

        if (this.props !== prevProps) {

            // console.log('this.props.expandr', this.props)
            this.setState({
                columns: this.props.columns,
                users: this.props.users,
                // expandedRowKeys: this.props.expandedRowsKey
            })
        }
    }
    render() {
        // console.log("CONDITIONS", this.state.expandedRowKeys.length === 1 && this.state.expandedRowKeys[0] !== undefined && this.props.location.state !== undefined && this.state.expandedRowKeys[0] == this.props.location.state.id)

        if (this.state.expandedRowKeys.length === 1 && this.state.expandedRowKeys[0] !== undefined && this.props.location.state !== undefined && this.state.expandedRowKeys[0] == this.props.location.state.id) { //  && this.state.scrollStatus
            this.handleScroll();
        }

        let type = this.props.user.type
        let styleType = "";
        if (type === ADMIN) {
            styleType = "users_fix_card_admin"
        } else {
            styleType = "users_fix_card_dealer"
        }
        // console.log("render function this.state.expandedRowKeys: ", this.state.expandedRowKeys)
        return (
            <Fragment>
                <Card className={`fix_card ${styleType}`}>
                    <hr className="fix_header_border" style={{ top: "59px" }} />
                    <CustomScrollbars className="gx-popover-scroll">
                        <Table
                            className="users_list"
                            rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.rowKey) ? 'exp_row' : ''}
                            size="middle"
                            bordered
                            expandIcon={(props) => this.customExpandIcon(props)}
                            expandedRowRender={(record) => {
                                // console.log("table row", record);
                                return (
                                    <UserDeviceList
                                        ref='userDeviceList'
                                        record={record}
                                        translation={this.props.translation}
                                    />
                                );
                            }}
                            expandIconColumnIndex={3}
                            expandedRowKeys={this.state.expandedRowKeys}
                            onExpand={(expended, record) => this.onExpandRow(expended, record)}
                            expandIconAsCell={false}
                            defaultExpandedRowKeys={(this.props.location.state) ? [this.props.location.state.id] : []}
                            columns={this.state.columns}
                            onChange={this.props.onChangeTableSorting}
                            dataSource={this.renderList(this.state.users)}
                            pagination={false}
                            ref='user_table'
                            translation={this.props.translation}
                        />
                    </CustomScrollbars>
                </Card>
                <AddUser ref='edit_user' translation={this.props.translation} />
            </Fragment>
        )
    }
}

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({
//         // getPolicies: getPolicies,
//     }, dispatch);
// }

// var mapStateToProps = ({ policies }) => {
//     // console.log("policies", policies);
//     return {
//         // routing: routing,
//     };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(PolicyList);
export default UserList;


function showConfirm(action, user_id, msg, buttonText) {
    confirm({
        title: msg + user_id,
        okText: buttonText,
        // cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
        onOk() {
            action(user_id)
        },
        onCancel() { },
    })
}

