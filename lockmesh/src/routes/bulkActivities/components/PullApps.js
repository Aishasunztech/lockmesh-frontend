import React, { Fragment, Component } from 'react'
import { Avatar, Table } from "antd";
import { BASE_URL } from '../../../constants/Application';
import { POLICY_APP_NAME } from '../../../constants/PolicyConstants';
import { convertToLang, checkIsArray } from '../../utils/commonUtils';


const renderApps = (apk_list, selectedApps = false) => {
    let app_list = []

    if (selectedApps) {
        checkIsArray(apk_list).map((app) => {
            if (app.system_app !== 1) {
                app_list.push({
                    key: (app.app_id) ? app.app_id : 'N/A',
                    app_id: (app.app_id) ? app.app_id : 'N/A',
                    package_name: app.package_name,
                    label: (app.label) ? app.label : 'N/A',
                    icon: (typeof (app.icon) === String || typeof (app.icon) === 'string') ? (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.icon} />) : app.icon,
                });
            }
        });
    } else {
        checkIsArray(apk_list).map((app) => {
            if (app.system_app !== 1) {
                app_list.push({
                    key: (app.apk_id) ? app.apk_id : 'N/A',
                    app_id: (app.apk_id) ? app.apk_id : 'N/A',
                    package_name: app.package_name,
                    label: (app.apk_name) ? app.apk_name : 'N/A',
                    icon: (typeof (app.logo) === String || typeof (app.logo) === 'string') ? (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />) : app.logo,
                });
            }
        });
    }

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
                dataSource={renderApps(props.app_list, props.isSwitchable ? false : true)}
            />
        </Fragment>
    )

}

export default PullApps;
