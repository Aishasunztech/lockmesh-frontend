import React, { Component } from 'react'
import { Table, Button } from "antd";

import AppList from "./AppList";
import DeviceSettings from './DeviceSettings';

import {
    SECURE_SETTING,
    POLICY
    // , 
    // SYSTEM_CONTROLS, NOT_AVAILABLE, MANAGE_PASSWORD, MAIN_MENU, APPS,
} from '../../../constants/Constants';


// applyProfile = (app_list) => {
//     this.props.loadDeviceProfile(app_list);
//     this.props.showHistoryModal(false, '');
// }

const renderList = (histories, type, callback) => {
    return histories.map((history) => {
        // console.log("list", history.app_list);

        return ({
            key: history.id,
            history_date: (type === "history") ? history.created_at : (type === POLICY) ? history.policy_name : (type === "profile") ? history.profile_name : null,
            action: (
                <Button
                    size="small"
                    className="mb-0"
                    onClick={() => {
                        if (type === POLICY) {
                            callback(history.id, history.policy_name);
                        }
                        // this.applyProfile(history.app_list)
                    }}
                > Apply
                </Button>
            ),
            app_list: history.app_list,
            controls: history.controls,
            secure_apps: history.secure_apps
        })
    })
}

const renderColumn = (type) => {
    // if(type === "history"){

    // } else {

    // }
    return [
        {
            title: (type === "history") ? 'History Date' : `${type} Name`,
            dataIndex: 'history_date',
            key: '1',
            align: "center"
        },
        {
            title: "Action",
            dataIndex: 'action',
            key: '2',
            align: "center"
        }
    ]
}

const TableHistory = (props) => {
    // console.log("props", props);

    return (
        <Table
            style={{ margin: 0, padding: 0 }}
            size='default'
            bordered
            columns={renderColumn(props.type)}
            align='center'
            dataSource={renderList(props.histories, props.type, props.applyHistory)}
            pagination={false}
            expandedRowRender={record => {
                // console.log("record", record);

                let app_list = (record.app_list !== undefined && record.app_list !== null && record.app_list !== '') ? record.app_list : [];
                let extensions = (record.secure_apps !== undefined && record.secure_apps != null && record.secure_apps != '') ? record.secure_apps : [];

                let controls = (record.controls !== undefined && record.controls !== null && record.controls !== '') ? (Object.entries(record.controls).length > 0 && record.controls.constructor === Object) ? record.controls : [] : [];
                // console.log("app_list: ", app_list);
                // console.log("extensions: ", extensions);
                // console.log("controls: ", controls);

                return (
                    <DeviceSettings
                        app_list={app_list}
                        extensions={extensions}
                        extensionUniqueName={SECURE_SETTING}
                        // isAdminPwd={this.props.isAdminPwd}
                        // isDuressPwd={this.props.isDuressPwd}
                        // isEncryptedPwd={this.props.isEncryptedPwd}
                        // isGuestPwd={this.props.isGuestPwd}
                        show_all_apps={true}
                        controls={{ controls }}
                    />
                );
            }}
        />
    )

}

export default TableHistory;