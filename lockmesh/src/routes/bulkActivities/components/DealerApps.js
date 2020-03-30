import React, { Fragment } from 'react'
import { Avatar, Table, Switch } from "antd";
import { BASE_URL } from '../../../constants/Application';
import { APK } from '../../../constants/ApkConstants';
import { POLICY_APP_NAME } from '../../../constants/PolicyConstants';
import { Guest, ENCRYPTED, ENABLE } from '../../../constants/TabConstants';
import { convertToLang, checkIsArray } from '../../utils/commonUtils';


const renderApps = (props, apk_list, isSwitchable, selectedAppKeys) => {
    let apps = [];
    if (props.app_list) {
        checkIsArray(apk_list).forEach(apk => {
            let index = props.app_list.findIndex((app) => app.package_name === apk.package_name);
            if (index === -1) {
                apps.push(apk);
            }
        });
    } else {
        apps = apk_list;
    }

    return checkIsArray(apps).map((app) => {
        if (props.selectedApps) {
            checkIsArray(props.selectedApps).forEach(apk => {
                if (app.apk_id === apk.apk_id) {
                    app.guest = apk.guest;
                    app.encrypted = apk.encrypted;
                    app.enable = apk.enable;
                }
            });
        }

        let isAvailable = selectedAppKeys !== undefined ? (selectedAppKeys.length) ? selectedAppKeys.find(el => (el === app.apk_id) ? true : false) : false : false;
        return {
            key: (app.apk_id) ? app.apk_id : 'N/A',
            apk_id: (app.apk_id) ? app.apk_id : 'N/A',
            package_name: app.package_name,
            version_name: app.version_name,
            apk: app.apk ? app.apk : 'N/A',
            apk_name: app.apk_name ? app.apk_name : 'N/A',
            apk_logo: (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.icon} />),
            guest: ((isSwitchable || props.disabledSwitch) ?
                <Switch
                    checked={app.guest === true || app.guest === 1 ? true : false}
                    disabled={!isAvailable}
                    size={"small"}
                    onClick={(e) => {
                        props.handleChecked(e, "guest", app.apk_id);
                    }}
                /> : (app.guest === true) ? 'On' : 'Off'),
            encrypted: ((isSwitchable || props.disabledSwitch) ?
                <Switch
                    checked={app.encrypted === true || app.encrypted === 1 ? true : false}
                    disabled={!isAvailable}
                    size={"small"}
                    onClick={(e) => {
                        props.handleChecked(e, "encrypted", app.apk_id);
                    }}
                /> : (app.encrypted === true) ? 'On' : 'Off'),
            enable: ((isSwitchable || props.disabledSwitch) ?
                <Switch
                    checked={app.enable === true || app.enable === 1 ? true : false}
                    disabled={!isAvailable}
                    size={"small"}
                    onClick={(e) => {
                        props.handleChecked(e, "enable", app.apk_id);
                    }}
                /> : (app.enable === true) ? 'On' : 'Off'),
        }
    });
}

const DealerApps = (props) => {
    let columns = [
        {
            title: convertToLang(props.translation[APK], "APK"),
            dataIndex: 'apk',
            key: 'apk',
        },
        {
            title: convertToLang(props.translation[POLICY_APP_NAME], "APP NAME"),
            dataIndex: 'apk_name',
            width: "100",
            key: 'apk_name',
            sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },

            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: "ascend"
        },
        {
            title: convertToLang(props.translation[Guest], "GUEST"),
            dataIndex: 'guest',
            key: 'guest'
        },
        {
            title: convertToLang(props.translation[ENCRYPTED], "ENCRYPTED"),
            dataIndex: 'encrypted',
            key: 'encrypted'
        },
        {
            title: convertToLang(props.translation[ENABLE], "ENABLE"),
            dataIndex: 'enable',
            key: 'enable'
        },
    ];

    const rowSelection = {
        onChange: props.onPushAppsSelection,
        selectionColumnIndex: 1,
        selectedRowKeys: props.selectedAppKeys,

    };

    return (
        <Fragment>
            <Table
                className="push_apps"
                pagination={false}
                scroll={{ x: 500 }}
                bordered
                rowSelection={(props.isSwitchable) ? rowSelection : null}
                columns={columns}
                dataSource={renderApps(props, props.apk_list, props.isSwitchable, props.selectedAppKeys)}
            />
        </Fragment>
    )

}

export default DealerApps;
