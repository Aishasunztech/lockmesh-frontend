import React, { Fragment } from 'react'
import { Avatar, Table, Switch } from "antd";
import { BASE_URL } from '../../../constants/Application';

const DealerApps = (props) => {
    let columns = [
        {
            title: 'APK',
            dataIndex: 'apk',
            key: 'apk',
        },
        {
            title: 'APP NAME',
            dataIndex: 'apk_name',
            width: "100",
            key: 'apk_name',
            sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },

            sortDirections: ['ascend', 'descend'],
            // sortOrder:"ascend",
            defaultSortOrder: "ascend"
        },
        {
            title: 'APP LOGO',
            dataIndex: 'apk_logo',
            key: 'apk_logo',
        },
        {
            title: 'GUEST',
            dataIndex: 'guest',
            key: 'guest'
        },
        {
            title: 'ENCRYPTED',
            dataIndex: 'encrypted',
            key: 'encrypted'
        },
        {
            title: 'ENABLE',
            dataIndex: 'enable',
            key: 'enable'
        },
    ];
    const renderApps = (apk_list, isSwitchable, selectedApps) => {
        // console.log(selectedApps);
        return apk_list.map((app) => {

            let isAvailable = (selectedApps.length) ? selectedApps.find(el => (el.apk_id === app.apk_id) ? true : false) : false;
            // let isAvailable = false;
            // console.log('isAvailable', isAvailable);
            return {
                key: app.apk_id,
                apk_id: app.apk_id,
                package_name: app.package_name,
                version_name: app.version_name,
                apk_status: (app.apk_status === "On") ? true : false,
                apk: app.apk ? app.apk : 'N/A',
                apk_name: app.apk_name ? app.apk_name : 'N/A',
                apk_logo: (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />),
                guest: ((isSwitchable) ?
                    <Switch

                        disabled={!isAvailable}
                        size={"small"}
                        onClick={(e) => {
                            props.handleChecked(e, "guest", app.apk_id);
                        }}
                    /> : (app.guest === true) ? 'On' : 'Off'),
                encrypted: ((isSwitchable) ?
                    <Switch
                        disabled={!isAvailable}
                        size={"small"}
                        onClick={(e) => {
                            props.handleChecked(e, "encrypted", app.apk_id);
                        }}
                    /> : (app.encrypted === true) ? 'On' : 'Off'),
                enable: ((isSwitchable) ?
                    <Switch
                        disabled={!isAvailable}
                        size={"small"}
                        onClick={(e) => {
                            props.handleChecked(e, "enable", app.apk_id);
                        }}
                    /> : (app.enable === true) ? 'On' : 'Off'),
            }
        });
    }
    const rowSelection = {
        // selectedDealers,
        onChange: props.onSelectChange,
        selectionColumnIndex: 1,
        selectedRowKeys: props.selectedAppKeys,

    };
    if (props.type == 'pull') {
        columns = [

            {
                title: 'APK',
                dataIndex: 'apk',
                key: 'apk',
            },
            {
                title: 'APP NAME',
                dataIndex: 'apk_name',
                width: "100",
                key: 'apk_name',
                sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },

                sortDirections: ['ascend', 'descend'],
                // sortOrder:"ascend",
                defaultSortOrder: "ascend"
            },
            {
                title: 'APP LOGO',
                dataIndex: 'apk_logo',
                key: 'apk_logo',
            },
        ];
    }
    return (
        <Fragment>
            <Table
                scroll={{ x: 500 }}
                bordered
                rowSelection={(props.isSwitchable) ? rowSelection : null}
                columns={columns}
                dataSource={renderApps(props.apk_list, props.isSwitchable, props.selectedApps)}
            />
        </Fragment>
    )

}

export default DealerApps;
