import React, { Fragment, Component } from 'react'
import { Avatar, Table, Switch } from "antd";
import { BASE_URL } from '../../../constants/Application';
import { APK } from '../../../constants/ApkConstants';
import { POLICY_APP_NAME } from '../../../constants/PolicyConstants';
import { Guest, ENCRYPTED, ENABLE } from '../../../constants/TabConstants';
import { convertToLang, checkIsArray } from '../../utils/commonUtils';


const renderApps = (apk_list) => {
    let app_list = []
    checkIsArray(apk_list).map((app) => {
        if (app.system_app !== 1 && app.system_app !== true && app.package_name) {
            app_list.push( {
                key: (app.app_id) ? app.app_id : 'N/A',
                app_id: (app.app_id) ? app.app_id : 'N/A',
                package_name: app.package_name,
                label: (app.label) ? app.label : 'N/A',
                icon: (typeof (app.icon) === String || typeof (app.icon) === 'string') ? (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.icon} />) : app.icon,
            });

        }

    });

    return app_list
}

const PullApps = (props) => {
    let columns = [
        {
            title: convertToLang(props.translation['APP LOGO'], "APP LOGO"),
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title: convertToLang(props.translation[POLICY_APP_NAME], "APP NAME"),
            dataIndex: 'label',
            width: "100",
            key: 'label',
            sorter: (a, b) => { return a.label.localeCompare(b.label) },

            sortDirections: ['ascend', 'descend'],
            // sortOrder:"ascend",
            defaultSortOrder: "ascend"
        },
    ];


    const rowSelection = {
        onChange: props.onPullAppsSelection,
        selectionColumnIndex: 1,
        selectedRowKeys: props.selectedPullAppKeys,

    };

    return (
        <Fragment>
            <Table
                className="push_apps"
                pagination={false}
                scroll={{ x: 500 }}
                bordered
                columns={columns}
                rowSelection={(props.isSwitchable) ? rowSelection : null}
                dataSource={renderApps(props.app_list)}
            />
        </Fragment>
    )

}

export default PullApps;
