import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    handleCheckApp,
    handleCheckAll
} from "../../../appRedux/actions/ConnectDevice";

import { BASE_URL } from '../../../constants/Application';

import { Table, Switch, Avatar } from "antd";
import AppDropdown from "./AppDropdown";


class AppList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            guestAll: false,
            encryptedAll: false,
            enableAll: false,
            app_list: [],
            rerender: false,
            app_list_count: 0,
        }

        this.appsColumns = [
            {
                title: 'APP NAME',
                dataIndex: 'app_name',
                key: '1',
                render: text => <a href="javascript:;">{text}</a>,
            }, {
                title: 'GUEST',
                dataIndex: 'guest',
                key: '2',
            }, {
                title: 'ENCRYPTED',
                dataIndex: 'encrypted',
                key: '3',
            }, {
                title: 'ENABLE',
                dataIndex: 'enable',
                key: '4',
            }
        ];
    }

    componentDidMount() {

        this.setState({
            app_list: this.props.app_list,
            app_list_count: this.props.length,
            guestAll: this.props.guestAll,
            encryptedAll: this.props.encryptedAll,
            enableAll: this.props.enableAll
        });
    }
    componentWillReceiveProps(nextProps) {
        // console.log("app list, nextProps", nextProps);
        // alert("componentWillReceiveProps");
        this.setState({
            app_list: nextProps.app_list,
            // app_list_count: this.props.length,
            guestAll: nextProps.guestAll,
            encryptedAll: nextProps.encryptedAll,
            enableAll: nextProps.enableAll
        })
    }

    handleCheckedAll = (key, value) => {

        if (key === "guestAll") {
            this.checkAll(key, 'guest', value);
        } else if (key === "encryptedAll") {
            this.checkAll(key, 'encrypted', value);
        } else if (key === "enableAll") {
            this.checkAll(key, 'enable', value);
        }
    }

    handleChecked = (e, key, app_id) => {
        this.props.handleCheckApp(e, key, app_id);

    }

    checkAll = (keyAll, key, value) => {
        this.props.handleCheckAll(keyAll, key, value);
    }

    renderApps = () => {

        return this.state.app_list.map(app => {
            // console.log(app.app_id);
            return ({
                key: app.app_id,
                app_name:
                    <Fragment>
                        <Avatar
                            size={"small"}
                            src={`${BASE_URL}users/getFile/${app.icon}`}
                        // style={{ width: "30px", height: "30px" }} 
                        />
                        <br />
                        <div className="line_break1">{app.label}</div>
                    </Fragment>,
                guest: (this.props.isHistory === true) ?
                    (app.guest === 1 || app.guest === true) ?
                        (<span style={{ color: "green" }}>On</span>) :
                        (<span style={{ color: "red" }}>Off</span>) :
                    <Switch
                        size="small"
                        ref={`guest_${app.app_id}`}
                        name={`guest_${app.app_id}`}
                        value={app.guest}
                        checked={(app.guest === true || app.guest === 1) ? true : false}
                        onClick={(e) => {
                            this.handleChecked(e, "guest", app.app_id);
                        }}
                    />,
                encrypted: app.default_app == 1 ? '' : (this.props.isHistory === true) ?
                    (app.encrypted === 1 || app.encrypted === true) ?
                        (<span style={{ color: "green" }}>On</span>) :
                        (<span style={{ color: "red" }}>Off</span>) :
                    <Switch
                        size="small"
                        ref={`encrypted_${app.app_id}`}
                        name={`encrypted_${app.app_id}`}
                        value={app.encrypted}
                        checked={(app.encrypted === true || app.encrypted === 1) ? true : false}
                        onClick={(e) => {
                            // console.log("encrypted", e);
                            this.handleChecked(e, "encrypted", app.app_id);
                        }}
                    />,
                enable: app.default_app == 1 ? '' : (this.props.isHistory === true) ?
                    (app.enable === 1 || app.enable === true) ?
                        (<span style={{ color: "green" }}>On</span>) :
                        (<span style={{ color: "red" }}>On</span>) :
                    <Switch
                        size="small"
                        ref={`enable_${app.app_id}`}
                        name={`enable_${app.app_id}`}
                        value={app.enable}
                        checked={((app.enable === true) || (app.enable === 1)) ? true : false}
                        onClick={(e) => {
                            this.handleChecked(e, "enable", app.app_id);
                        }}
                    />
            });
        });
    }

    render() {
        return (
            <div>
                {
                    this.props.isHistory ? null : (
                        <AppDropdown
                            checked_app_id={this.props.checked_app_id}
                            enableAll={this.state.enableAll}
                            encryptedAll={this.state.encryptedAll}
                            guestAll={this.state.guestAll} handleCheckedAll={this.handleCheckedAll}
                        />
                    )
                }
                <Table
                    style={{ margin: 0, padding: 0 }}
                    size='small'
                    scroll={this.props.isHistory ? {} : { y: 360 }}
                    bordered={false}
                    columns={this.appsColumns}
                    align='center'
                    dataSource={
                        this.renderApps()
                    }
                    pagination={false}
                />

            </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // showHistoryModal: showHistoryModal
        handleCheckApp: handleCheckApp,
        handleCheckAll: handleCheckAll
    }, dispatch);
}


var mapStateToProps = ({ device_details }, ownProps) => {
    // console.log(device_details.app_list, "applist ownprops", ownProps);
    if (ownProps.isHistory !== undefined && ownProps.isHistory === true) {
        return {
            app_list: ownProps.app_list,
            isHistory: ownProps.isHistory
        }
    } else {
        return {
            app_list: device_details.app_list,
            undoApps: device_details.undoApps,
            redoApps: device_details.redoApps,
            checked_app_id: device_details.checked_app_id,
            guestAll: device_details.guestAll,
            encryptedAll: device_details.encryptedAll,
            enableAll: device_details.enableAll
        };
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppList);