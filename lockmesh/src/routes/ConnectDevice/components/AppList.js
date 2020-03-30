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
import { POLICY_APP_NAME } from '../../../constants/PolicyConstants';
import { Guest, ENCRYPTED, ENABLE, Show_Hide } from '../../../constants/TabConstants';
import { convertToLang, checkIsArray } from '../../utils/commonUtils';
import { Button_LoadProfile, Button_On, Button_Off } from '../../../constants/ButtonConstants';
import { appsColumns } from '../../utils/columnsUtils';
import { APK_APP_NAME } from '../../../constants/ApkConstants';


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

        this.appsColumns = appsColumns(props.translation);
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

        if (this.props.translation != nextProps.translation) {
            this.appsColumns = appsColumns(nextProps.translation);
        }
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

        let appList = [];

        checkIsArray(this.state.app_list).map(app => {
            // console.log(app);
            if (!app.extension && app.visible) {
                appList.push(
                    {
                        key: app.app_id,
                        app_name:
                            <Fragment>
                                <Avatar
                                    size={"small"}
                                    src={`${BASE_URL}users/getFile/${app.icon}`}
                                // style={{ width: "30px", height: "30px" }} 
                                />
                                <br />
                                <div className="line_break2">{app.label}</div>
                            </Fragment>,
                        guest: (this.props.isHistory === true) ?
                            (app.guest === 1 || app.guest === true) ?
                                (<span style={{ color: "green" }}>{convertToLang(this.props.translation[Button_On], "On")}</span>) :
                                (<span style={{ color: "red" }}>{convertToLang(this.props.translation[Button_Off], "Off")}</span>) :
                            <Switch
                                size="small"
                                ref={`guest_${app.app_id}`}
                                name={`guest_${app.app_id}`}
                                value={app.guest}
                                disabled={this.props.disable ? true : false}
                                checked={(app.guest === true || app.guest === 1) ? true : false}
                                onClick={(e) => {
                                    this.handleChecked(e, "guest", app.app_id);
                                }}
                            />,
                        encrypted: app.default_app === 1 ? '' : (this.props.isHistory === true) ?
                            (app.encrypted === 1 || app.encrypted === true) ?
                                (<span style={{ color: "green" }}>{convertToLang(this.props.translation[Button_On], "On")}</span>) :
                                (<span style={{ color: "red" }}>{convertToLang(this.props.translation[Button_Off], "Off")}</span>) :
                            <Switch
                                size="small"
                                ref={`encrypted_${app.app_id}`}
                                name={`encrypted_${app.app_id}`}
                                disabled={this.props.disable ? true : false}
                                value={app.encrypted}
                                checked={(app.encrypted === true || app.encrypted === 1) ? true : false}
                                onClick={(e) => {
                                    // console.log("encrypted", e);
                                    this.handleChecked(e, "encrypted", app.app_id);
                                }}
                            />,
                        enable: app.default_app === 1 ? '' : (this.props.isHistory === true) ?
                            (app.enable === 1 || app.enable === true) ?
                                (<span style={{ color: "green" }}>{convertToLang(this.props.translation[Button_On], "On")}</span>) :
                                (<span style={{ color: "red" }}>{convertToLang(this.props.translation[Button_Off], "Off")}</span>) :
                            <Switch
                                size="small"
                                ref={`enable_${app.app_id}`}
                                name={`enable_${app.app_id}`}
                                value={app.enable}
                                disabled={this.props.disable ? true : false}
                                checked={((app.enable === true) || (app.enable === 1)) ? true : false}
                                onClick={(e) => {
                                    this.handleChecked(e, "enable", app.app_id);
                                }}
                            />
                    }
                );
            }
        });
        return appList;
    }

    render() {
        if (this.props.type === "guest") {
            this.appsColumns = [
                {
                    title: convertToLang(this.props.translation[APK_APP_NAME], "APP NAME"),
                    dataIndex: 'app_name',
                    key: '1',
                    render: text => <a style={{ fontSize: 12 }}>{text}</a>,
                }, {
                    title: convertToLang(this.props.translation[Show_Hide], "SHOW/HIDE"),
                    dataIndex: 'guest',
                    key: '2',
                }, {
                    title: convertToLang(this.props.translation[ENABLE], "ENABLE"),
                    dataIndex: 'enable',
                    key: '4',
                }
            ]
        } else if (this.props.type === "encrypted") {
            this.appsColumns = [
                {
                    title: convertToLang(this.props.translation[APK_APP_NAME], "APP NAME"),
                    dataIndex: 'app_name',
                    key: '1',
                    render: text => <a style={{ fontSize: 12 }}>{text}</a>,
                }, {
                    title: convertToLang(this.props.translation[Show_Hide], "SHOW/HIDE"),
                    dataIndex: 'encrypted',
                    key: '3',
                }, {
                    title: convertToLang(this.props.translation[ENABLE], "ENABLE"),
                    dataIndex: 'enable',
                    key: '4',
                }
            ]
        }
        return (
            <div>
                {
                    this.props.isHistory ? null : (
                        <AppDropdown
                            type={this.props.type}
                            checked_app_id={this.props.checked_app_id}
                            enableAll={this.state.enableAll}
                            encryptedAll={this.state.encryptedAll}
                            guestAll={this.state.guestAll} handleCheckedAll={this.handleCheckedAll}
                            translation={this.props.translation}
                        />
                    )
                }
                <Table
                    style={{ margin: 0, padding: 0 }}
                    size='small'
                    // scroll={this.props.isHistory ? {} : { y: 370 }}
                    bordered={false}
                    columns={this.appsColumns}
                    bodyStyle={{ height: 400, overflow: "overlay" }}
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


var mapStateToProps = ({ device_details, settings }, ownProps) => {
    if (ownProps.isHistory !== undefined && ownProps.isHistory === true) {
        return {
            app_list: ownProps.app_list,
            isHistory: ownProps.isHistory
        }
    } else {
        return {
            translation: settings.translation,
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