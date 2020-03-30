import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { message, Input, Modal, Button, Popover, Icon } from "antd";
import AppFilter from '../../components/AppFilter';
import UserList from "./components/UserList";
import { getStatus, componentSearch, titleCase } from '../utils/commonUtils';


import {
    ADMIN,
} from '../../constants/Constants'
import {
    USER_ID
} from '../../constants/DeviceConstants';

import {
    addUser,
    editUser,
    getUserList,
    deleteUser,
    undoDeleteUser
} from "../../appRedux/actions/Users";

import {
    postPagination,
    getPagination

} from "../../appRedux/actions/Common";
import AddUser from './components/AddUser';
var coppyUsers = [];
var status = true;
const question_txt = (
    <div>
        <p>Press <a style={{ fontSize: 14 }}><Icon type="caret-right" /> </a> to View Devices<br></br> list of this User</p>
    </div>
);
class Users extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'ACTION',
                align: "center",
                dataIndex: 'action',
                key: "action",
            },
            {
                title: (
                    <Input.Search
                        name="user_id"
                        key="user_id"
                        id="user_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(USER_ID)}
                    />
                ),
                dataIndex: 'user_id',
                className: '',
                children: [
                    {
                        title: USER_ID,
                        dataIndex: 'user_id',
                        align: "center",
                        key: 'user_id',
                        className: '',
                        sorter: (a, b) => { return a.user_id.toString().localeCompare(b.user_id.toString()) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ],
            },
            {
                title: (
                    <span>
                        DEVICES
                    <Popover placement="top" content={question_txt}>
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover>
                    </span>),
                dataIndex: 'devices',
                key: 'devices',
                className: 'row',
                sorter: (a, b) => { return a.devices - b.devices },
                sortDirections: [],
                sortOrder: 'descend'
            },
            {
                title: (
                    <Input.Search
                        name="user_name"
                        key="user_name"
                        id="user_name"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder="Name"
                    />
                ),
                dataIndex: 'user_name',
                className: 'row',
                children: [{
                    title: 'NAME',
                    dataIndex: 'user_name',
                    align: "center",
                    key: 'user_name',
                    className: '',
                    sorter: (a, b) => { return a.user_name.localeCompare(b.user_name.toString()) },
                    sortDirections: ['ascend', 'descend'],
                }]
            },
            {
                title: (
                    <Input.Search
                        name="email"
                        key="email"
                        id="email"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder="Email"
                    />
                ),
                dataIndex: 'email',
                className: 'row',
                children: [{
                    title: 'EMAIL',
                    dataIndex: 'email',
                    align: "center",
                    key: 'email',
                    className: '',
                    sorter: (a, b) => { return a.email.localeCompare(b.email.toString()) },
                    sortDirections: ['ascend', 'descend'],
                }]
            },
            {
                title: 'TOKENS',
                align: "center",
                dataIndex: 'tokens',
                key: "tokens",
            },
        ];
        this.state = {
            users: []
        }

    }

    componentDidMount() {
        this.props.getUserList();
        this.props.getPagination('users');
        this.setState({
            users: this.props.users_list
        })
        // this.props.getApkList();
        // this.props.getDefaultApps();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.users_list !== this.props.users_list) {
            this.setState({
                defaultPagingValue: this.props.DisplayPages,
                users: nextProps.users_list
            })
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            // console.log('this.props ', this.props.DisplayPages);
            this.setState({
                defaultPagingValue: this.props.DisplayPages,
            })
        }
    }


    handleComponentSearch = (value) => {
        //    console.log('values sr', value)   
        try {
            if (value.length) {

                // console.log('length')

                if (status) {
                    // console.log('status')
                    coppyUsers = this.state.users;
                    status = false;
                }
                // console.log(this.state.users,'coppy de', coppyDevices)
                let foundUsers = componentSearch(coppyUsers, value);
                // console.log('found devics', foundUsers)
                if (foundUsers.length) {
                    this.setState({
                        users: foundUsers,
                    })
                } else {
                    this.setState({
                        users: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    users: coppyUsers,
                })
            }
        } catch (error) {
            // alert("hello");
        }
    }

    handlePagination = (value) => {
        this.refs.userList.handlePagination(value);
        this.props.postPagination(value, 'users');
    }
    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }
    handleSearch = (e) => {
        // console.log('============ check search value ========')
        // console.log(e.target.name , e.target.value);

        let demoUsers = [];
        if (status) {
            coppyUsers = this.state.users;
            status = false;
        }
        //   console.log("devices", coppyDevices);

        if (e.target.value.length) {
            // console.log("keyname", e.target.name);
            // console.log("value", e.target.value);
            // console.log(this.state.devices);
            coppyUsers.forEach((user) => {
                //  console.log("user", user[e.target.name] !== undefined);

                if (user[e.target.name] !== undefined) {
                    if ((typeof user[e.target.name]) === 'string') {
                        // console.log("string check", user[e.target.name])
                        if (user[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoUsers.push(user);
                        }
                    } else if (user[e.target.name] != null) {
                        // console.log("else null check", user[e.target.name])
                        if (user[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoUsers.push(user);
                        }
                    } else {
                        // demoUsers.push(user);
                    }
                } else {
                    demoUsers.push(user);
                }
            });
            //  console.log("searched value", demoUsers);
            this.setState({
                users: demoUsers
            })
        } else {
            this.setState({
                users: coppyUsers
            })
        }
    }

    render() {
        // console.log(this.props.location);
        return (
            <Fragment>
                <AppFilter
                    searchPlaceholder="Search User"
                    defaultPagingValue={this.state.defaultPagingValue}
                    addButtonText={"Add User"}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    isAddButton={this.props.user.type !== ADMIN}
                    // AddPolicyModel={true}
                    handleUserModal={this.handleUserModal}
                    handleCheckChange={this.handleCheckChange}
                    handlePagination={this.handlePagination}
                    handleComponentSearch={this.handleComponentSearch}
                />
                <AddUser ref="add_user" />
                <UserList
                    editUser={this.props.editUser}
                    deleteUser={this.props.deleteUser}
                    undoDeleteUser={this.props.undoDeleteUser}
                    location={this.props.location}
                    columns={this.columns}
                    users={this.state.users}
                    pagination={this.props.DisplayPages}
                    ref="userList"
                />
                {/* <UserList/> */}
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addUser: addUser,
        editUser: editUser,
        deleteUser: deleteUser,
        undoDeleteUser: undoDeleteUser,
        getUserList: getUserList,
        postPagination: postPagination,
        getPagination: getPagination
    }, dispatch);
}
var mapStateToProps = ({ auth, users, devices }) => {
    // console.log(users.users_list);
    return {
        user: auth.authUser,
        users_list: users.users_list,
        DisplayPages: devices.DisplayPages,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);