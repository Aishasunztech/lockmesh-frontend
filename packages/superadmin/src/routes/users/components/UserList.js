import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Table, Icon, Switch, Modal } from "antd";
import UserDeviceList from './UserDeviceList'
import AddUser from './AddUser';

const confirm = Modal.confirm

class UserList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            pagination: this.props.pagination,
            users: []

        }
    }
    handlePagination = (value) => {
        // alert('sub child');
        // console.log(value)
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }
    renderList(list) {
        let user_list = list.filter((data) => {
            // if (data.type === "policy") {
            return data
            // }
        })
        return user_list.map((user, index) => {
            // this.state.expandTabSelected[index]='1';
            // this.state.expandedByCustom[index]=false;
            return {
                key: `${user.user_id}`,
                rowKey: `${user.user_id}`,
                action:
                    (<Fragment>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => this.refs.edit_user.showModal(this.props.editUser, user, 'Edit User')}
                        > EDIT </Button>
                        {(user.devicesList.length === 0) ?
                            (user.del_status == 0) ?
                                <Button
                                    type="danger"
                                    size="small"
                                    onClick={() => showConfirm(this.props.deleteUser, user.user_id, "Do you want to DELETE user ", 'DELETE USER')}
                                > DELETE </Button>
                                : <Button
                                    type="dashed"
                                    size="small"
                                    onClick={() => showConfirm(this.props.undoDeleteUser, user.user_id, "Do you want to UNDO user ", 'UNDO')}
                                >UNDO </Button>
                            : null
                        }
                    </Fragment >)
                ,
                user_id: user.user_id,
                devices: (user.devicesList) ? user.devicesList.length : 0,
                devicesList: user.devicesList,
                user_name: user.user_name,
                email: user.email,
                token: user.email,
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
            users: this.props.users
        })
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {
            this.setState({
                columns: this.props.columns,
                users: this.props.users
            })
        }
    }
    render() {
        // console.log(this.state.pagination)
        return (
            <Fragment>
                <Card>
                    <Table
                        className="devices"
                        size="middle"
                        bordered
                        scroll={{
                            x: 500,
                        }}
                        expandIcon={(props) => this.customExpandIcon(props)}
                        expandedRowRender={(record) => {
                            // console.log("table row", record);
                            return (
                                <UserDeviceList
                                    record={record} />
                            );
                        }}
                        expandIconColumnIndex={2}
                        expandIconAsCell={false}
                        defaultExpandedRowKeys={(this.props.location.state) ? [this.props.location.state.id] : []}
                        columns={this.state.columns}
                        dataSource={this.renderList(this.state.users)}
                        pagination={{ pageSize: this.state.pagination, size: "midddle" }}
                        ref='user_table'
                    />
                </Card>
                <AddUser ref='edit_user' />
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
        onOk() {
            action(user_id)
        },
        onCancel() { },
    })
}

