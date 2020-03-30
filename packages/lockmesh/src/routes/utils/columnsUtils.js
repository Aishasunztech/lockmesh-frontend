import React from "react";
import { Input, Button, Icon, Select, Popover } from "antd";
import { titleCase, convertToLang, checkIsArray } from './commonUtils';
import { Markup } from 'interweave';
import {
    DEVICE_ID,
    DEVICE_REMAINING_DAYS,
    DEVICE_FLAGGED,
    DEVICE_STATUS,
    DEVICE_MODE,
    DEVICE_NAME,
    DEVICE_ACTIVATION_CODE,
    DEVICE_ACCOUNT_EMAIL,
    DEVICE_PGP_EMAIL,
    DEVICE_CHAT_ID,
    DEVICE_CLIENT_ID,
    DEVICE_DEALER_ID,
    DEVICE_DEALER_PIN,
    DEVICE_MAC_ADDRESS,
    DEVICE_SIM_ID,
    DEVICE_IMEI_1,
    DEVICE_SIM_1,
    DEVICE_IMEI_2,
    DEVICE_SIM_2,
    DEVICE_SERIAL_NUMBER,
    DEVICE_MODEL,
    DEVICE_START_DATE,
    DEVICE_EXPIRY_DATE,
    DEVICE_DEALER_NAME,
    DEVICE_S_DEALER,
    DEVICE_S_DEALER_NAME,
    USER_ID,
    DEVICE_TYPE,
    DEVICE_VERSION,
    REMAINING_TERM_DAYS,
    DEVICE_FIRMWAREINFO,
    DEVICE_PARENT_NAME,
    DEVICE_PARENT_ID
} from '../../constants/DeviceConstants';
import {
    // DEVICE_ID,
    // USER_ID,
    DEVICES,
    USER_NAME,
    USER_EMAIL,
    USER_DATE_REGISTERED,
    USER_TOKEN
} from '../../constants/UserConstants';

import {
    DEALER_ID,
    DEALER_NAME,
    DEALER_EMAIL,
    DEALER_PIN,
    // DEALER_DEVICES,
    DEALER_TOKENS,
    // DEALER_ACTION,
    Parent_Dealer,
    Parent_Dealer_ID,
    DEALER_ACTION,
    DEALER_DEVICES
} from '../../constants/DealerConstants';

// Mobile view
import {
    DEVICE_ACTIVATED, GUEST_PASSWORD, ENCRYPTED_PASSWORD, DURESS_PASSWORD, ADMIN_PASSWORD,
    SECURE_SETTING, SYSTEM_CONTROLS, NOT_AVAILABLE, MANAGE_PASSWORD, MAIN_MENU, APPS,
    APPLICATION_PERMISION, SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, MANAGE_PASSWORDS,
    Main_SETTINGS,
    SET_GUEST_PASSWORD,
    SET_ENCRYPTED_PASSWORD,
    SET_DURESS_PASSWORD,
    CHANGE_ADMIN_PANEL_CODE,
    PERMISSION_NAME,
    ACTION,
    RESET_DURESS_PASSWORD
} from '../../constants/Constants';

import {
    Guest,
    ENCRYPTED,
    ENABLE,
    EXTENSION_NAME,
    ADMIN_PASSWORD_IS_CHANGED,
    ENCRYPTED_PASSWORD_IS_CHANGED,
    GUEST_PASSWORD_IS_CHANGED,
    DURESS_PASSWORD_IS_CHANGED
} from '../../constants/TabConstants';
import {
    APK_APP_NAME,
    APK_PERMISSION,
    APK_SHOW_ON_DEVICE,
    APK, APK_APP_LOGO,
    APK_SIZE,
    USER_DEVICES_HELPING_TEXT,
    APK_PERMISSION_HELPING_TEXT,
    SHOW_ON_DEVCIE_HELPING_TEXT
} from "../../constants/ApkConstants";
import {
    POLICY_ACTION,
    POLICY_INFO,
    POLICY_PERMISSIONS,
    POLICY_STATUS, POLICY_NAME,
    POLICY_APP_NAME, POLICY_COMMAND,
    POLICY_NOTE,
    POLICY_DEFAULT,
    POLICY_PERMISSION_HELPING_TEXT,
    POLICY_STATUS_HELPING_TEXT,
    POLICY_SIZE
} from "../../constants/PolicyConstants";
import { DUMY_TRANS_ID } from "../../constants/LabelConstants";
import { PACKAGE_TERM } from "../../constants/AccountConstants";



/////////////////////////////////////////
// **************************************
// ******* devicesColumns
// ******* usersColumns
// ******* userDevicesListColumns
// ******* dealerColumns
// ******* sDealerColumns
// ******* dealerColsWithSearch
// ******* mobileMainMenu
// ******* mobileManagePasswords
// ******* appsColumns
// ******* extensionColumns
// ******* controlColumns
// ******* policyColumns
// ******* apkColumns
// **************************************
/////////////////////////////////////////

export function devicesColumns(translation, handleSearch) {

    return ([
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[ACTION], "ACTION"),
            dataIndex: 'action',
            align: 'center',
            className: 'row',
            key: "action",
        },
        {
            title: (
                <Input.Search
                    name="device_id"
                    key="device_id"
                    id="device_id"
                    className="search_heading device_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_ID], "DEVICE ID")}
                />
            ),

            dataIndex: 'device_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ID], "DEVICE ID"),
                    align: "center",
                    dataIndex: 'device_id',
                    key: "device_id",
                    sorter: (a, b) => {
                        let list = a.device_id.localeCompare(b.device_id);
                        return list
                    },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="user_id"
                    key="user_id"
                    id="user_id"
                    className="search_heading user_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_ID], "USER ID")}
                />
            ),
            dataIndex: 'user_id',
            children: [
                {
                    title: convertToLang(translation[USER_ID], "USER ID"),
                    align: "center",
                    dataIndex: 'user_id',
                    key: "user_id",
                    sorter: (a, b) => {
                        return a.user_id.props.children.localeCompare(b.user_id.props.children)
                    },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="finalStatus"
                    key="status"
                    id="status"
                    className="search_heading status_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_STATUS], "STATUS")}
                />
            ),
            dataIndex: 'status',
            children: [
                {
                    title: convertToLang(translation[DEVICE_STATUS], "STATUS"),
                    align: "center",
                    dataIndex: 'status',
                    key: 'status',
                    sorter: (a, b) => { return a.status.props.children[1].localeCompare(b.status.props.children[1]) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="lastOnline"
                    key="lastOnline"
                    id="lastOnline"
                    className="search_heading status_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation["Last Online"], "Last Online")}
                />
            ),
            dataIndex: 'lastOnline',
            children: [
                {
                    title: convertToLang(translation["Last Online"], "Last Online"),
                    align: "center",
                    dataIndex: 'lastOnline',
                    key: 'lastOnline',
                    sorter: (a, b) => { return a.lastOnline.localeCompare(b.lastOnline) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="online"
                    key="online"
                    id="online"
                    className="search_heading online_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_MODE], "MODE")}
                />
            ),
            dataIndex: 'online',
            children: [
                {
                    title: convertToLang(translation[DEVICE_MODE], "MODE"),
                    align: "center",
                    dataIndex: 'online',
                    key: 'online',
                    sorter: (a, b) => { return a.online.props.children[1].localeCompare(b.online.props.children[1]) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="type"
                    key="type"
                    id="type"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_TYPE], "TYPE")}
                />
            ),
            dataIndex: 'type',
            children: [
                {
                    title: convertToLang(translation[DEVICE_TYPE], "TYPE"),
                    align: "center",
                    dataIndex: 'type',
                    key: 'type',
                    sorter: (a, b) => { return a.type.localeCompare(b.type) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="version"
                    key="version"
                    id="version"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_VERSION], "VERSION")}
                />
            ),
            dataIndex: 'version',
            children: [
                {
                    title: convertToLang(translation[DEVICE_VERSION], "VERSION"),
                    align: "center",
                    dataIndex: 'version',
                    key: 'version',
                    sorter: (a, b) => { return a.version.localeCompare(b.version) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="firmware_info"
                    key="firmware_info"
                    id="firmware_info"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_FIRMWAREINFO], "FIRMWARE INFO")}
                />
            ),
            dataIndex: 'firmware_info',
            children: [
                {
                    title: convertToLang(translation[DEVICE_FIRMWAREINFO], "FIRMWARE INFO"),
                    align: "center",
                    dataIndex: 'firmware_info',
                    key: 'firmware_info',
                    sorter: (a, b) => { return a.firmware_info.localeCompare(b.firmware_info) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="validity"
                    key="validity"
                    id="validity"
                    className="search_heading remaning_days_w"
                    onChange={handleSearch}
                    onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_REMAINING_DAYS], "REMAINING DAYS")}
                />
            ),
            dataIndex: 'validity',
            className: 'hide',
            children: [
                {
                    title: convertToLang(translation[DEVICE_REMAINING_DAYS], "REMAINING DAYS"),
                    align: "center",
                    dataIndex: 'validity',
                    key: "validity",
                    className: 'hide',
                    sorter: (a, b) => { return a.validity - b.validity },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="flagged"
                    key="flagged"
                    id="flagged"
                    className="search_heading flagged_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_FLAGGED], "FLAGGED")}
                />
            ),
            dataIndex: 'flagged',
            children: [
                {
                    title: convertToLang(translation[DEVICE_FLAGGED], "FLAGGED"),
                    align: "center",
                    dataIndex: 'flagged',
                    key: 'flagged',
                    sorter: (a, b) => { return a.flagged.localeCompare(b.flagged) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="transfered_to"
                    key="transfered_to"
                    id="transfered_to"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder="TRANSFERED TO"
                />
            ),
            dataIndex: 'transfered_to',
            className: 'hide',
            children: [
                {
                    title: "TRANSFERED TO",
                    align: "center",
                    dataIndex: 'transfered_to',
                    className: 'hide',
                    key: "transfered_to",
                    sorter: (a, b) => {
                        return a.transfered_to.localeCompare(b.transfered_to)
                    },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="name"
                    key="name"
                    id="name"
                    className="search_heading name_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_NAME], "NAME")}
                />
            ),
            dataIndex: 'name',
            children: [
                {
                    title: convertToLang(translation[DEVICE_NAME], "NAME"),
                    align: "center",
                    dataIndex: 'name',
                    key: 'name',
                    sorter: (a, b) => { return a.name.localeCompare(b.name) },
                    sortDirections: ['ascend', 'descend'],
                    editable: true,
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="account_email"
                    key="account_email"
                    id="account_email"
                    className="search_heading account_email_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_ACCOUNT_EMAIL], "ACCOUNT EMAIL")}
                />
            ),
            dataIndex: 'account_email',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ACCOUNT_EMAIL], "ACCOUNT EMAIL"),
                    align: "center",
                    dataIndex: 'account_email',
                    key: 'account_email',
                    sorter: (a, b) => { return a.account_email.localeCompare(b.account_email) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="activation_code"
                    key="activation_code"
                    id="activation_code"
                    className="search_heading activation_code_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_ACTIVATION_CODE], "ACTIVATION CODE")}
                />
            ),
            dataIndex: 'activation_code',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ACTIVATION_CODE], "ACTIVATION CODE"),
                    align: "center",
                    dataIndex: 'activation_code',
                    sorter: (a, b) => { return a.activation_code - b.activation_code },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        // {
        //     title: (
        //         <Input.Search
        //             name="client_id"
        //             key="client_id"
        //             id="client_id"
        //             className="search_heading client_id_w"
        //             onChange={handleSearch}
        //             autoComplete="new-password"
        //             placeholder={convertToLang(translation[DEVICE_CLIENT_ID], "CLIENT ID")}
        //         />
        //     ),
        //     dataIndex: 'client_id',
        //     children: [
        //         {
        //             title: convertToLang(translation[DEVICE_CLIENT_ID], "CLIENT ID"),
        //             align: "center",
        //             dataIndex: 'client_id',
        //             key: 'client_id',
        //             sorter: (a, b) => { return a.client_id.localeCompare(b.client_id) },
        //             sortDirections: ['ascend', 'descend'],
        //         }
        //     ]
        // },
        {
            title: (
                <Input.Search
                    name="pgp_email"
                    key="pgp_email"
                    id="pgp_email"
                    className="search_heading pgp_email_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL")}
                />
            ),
            dataIndex: 'pgp_email',
            children: [
                {
                    title: convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL"),
                    align: "center",
                    dataIndex: 'pgp_email',
                    sorter: (a, b) => { return a.pgp_email.localeCompare(b.pgp_email) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="sim_id"
                    key="sim_id"
                    id="sim_id"
                    className="search_heading sim_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SIM_ID], "SIM ID")}
                />
            ),
            dataIndex: 'sim_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_ID], "SIM ID"),
                    align: "center",
                    dataIndex: 'sim_id',
                    key: 'sim_id',
                    sorter: (a, b) => { return a.sim_id.localeCompare(b.sim_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="sim_id2"
                    key="sim_id2"
                    id="sim_id2"
                    className="search_heading sim_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "SIM ID 2")}
                />
            ),
            dataIndex: 'sim_id2',
            children: [
                {
                    title: convertToLang(translation[""], "SIM ID 2"),
                    align: "center",
                    dataIndex: 'sim_id2',
                    key: 'sim_id2',
                    sorter: (a, b) => { return a.sim_id2.localeCompare(b.sim_id2) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="chat_id"
                    key="chat_id"
                    id="chat_id"
                    className="search_heading chat_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID")}
                />
            ),
            dataIndex: 'chat_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID"),
                    align: "center",
                    dataIndex: 'chat_id',
                    key: 'chat_id',
                    sorter: (a, b) => { return a.chat_id.localeCompare(b.chat_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="dealer_id"
                    key="dealer_id"
                    id="dealer_id"
                    className="search_heading dealer_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_DEALER_ID], "DEALER ID")}
                />
            ),
            dataIndex: 'dealer_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_DEALER_ID], "DEALER ID"),
                    align: "center",
                    dataIndex: 'dealer_id',
                    key: 'dealer_id',
                    sorter: (a, b) => { return a.dealer_id - b.dealer_id },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="dealer_name"
                    key="dealer_name"
                    id="dealer_name"
                    className="search_heading dealer_name_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_DEALER_NAME], "DEALER NAME")}
                />
            ),
            dataIndex: 'dealer_name',
            children: [
                {
                    title: convertToLang(translation[DEVICE_DEALER_NAME], "DEALER NAME"),
                    align: "center",
                    dataIndex: 'dealer_name',
                    key: 'dealer_name',
                    sorter: (a, b) => { return a.dealer_name.props.children.localeCompare(b.dealer_name.props.children) },
                    sortDirections: ['ascend', 'descend'],


                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="link_code"
                    key="link_code"
                    id="link_code"
                    className="search_heading dealer_pin_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_DEALER_PIN], "DEALER PIN")}
                />
            ),
            dataIndex: 'dealer_pin',
            children: [
                {
                    title: convertToLang(translation[DEVICE_DEALER_PIN], "DEALER PIN"),
                    align: "center",
                    dataIndex: 'dealer_pin',
                    key: 'dealer_pin',
                    sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="s_dealer"
                    key="s_dealer"
                    id="s_dealer"
                    className="search_heading s_dealer_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_PARENT_ID], "PARENT DEALER ID")}
                />
            ),
            dataIndex: 's_dealer',
            children: [
                {
                    title: convertToLang(translation[DEVICE_PARENT_ID], "PARENT DEALER ID"),
                    align: "center",
                    dataIndex: 's_dealer',
                    key: 's_dealer',
                    sorter: (a, b) => { return a.s_dealer.localeCompare(b.s_dealer) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="s_dealer_name"
                    key="s_dealer_name"
                    id="s_dealer_name"
                    className="search_heading s_dealer_name_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_PARENT_NAME], "PARENT DEALER NAME")}
                />
            ),
            dataIndex: 's_dealer_name',
            children: [
                {
                    title: convertToLang(translation[DEVICE_PARENT_NAME], "PARENT DEALER NAME"),
                    align: "center",
                    dataIndex: 's_dealer_name',
                    key: 's_dealer_name',
                    sorter: (a, b) => { return a.s_dealer_name.localeCompare(b.s_dealer_name) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="mac_address"
                    key="mac_address"
                    id="mac_address"
                    className="search_heading mac_address_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_MAC_ADDRESS], "MAC ADDRESS")}
                />
            ),
            dataIndex: 'mac_address',
            children: [
                {
                    title: convertToLang(translation[DEVICE_MAC_ADDRESS], "MAC ADDRESS"),
                    align: "center",
                    dataIndex: 'mac_address',
                    key: 'mac_address',
                    sorter: (a, b) => { return a.mac_address.localeCompare(b.mac_address) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="imei"
                    key="imei"
                    id="imei"
                    className="search_heading imei_1_w"
                    autoComplete="new-password"
                    onChange={handleSearch}
                    placeholder={convertToLang(translation[DEVICE_IMEI_1], "IMEI 1")}
                />
            ),
            dataIndex: 'imei_1',
            children: [
                {
                    title: convertToLang(translation[DEVICE_IMEI_1], "IMEI 1"),
                    align: "center",
                    dataIndex: 'imei_1',
                    key: 'imei_1',
                    sorter: (a, b) => { return a.imei_1.localeCompare(b.imei_1) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="simno"
                    key="simno"
                    id="simno"
                    className="search_heading sim_1_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SIM_1], "SIM 1")}
                />
            ),
            dataIndex: 'sim_1',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_1], "SIM 1"),
                    align: "center",
                    dataIndex: 'sim_1',
                    key: 'sim_1',
                    sorter: (a, b) => { return a.sim_1.localeCompare(b.sim_1) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="imei2"
                    key="imei2"
                    id="imei2"
                    className="search_heading imei_2_w"
                    autoComplete="new-password"
                    onChange={handleSearch}
                    placeholder={convertToLang(translation[DEVICE_IMEI_2], "IMEI 2")}
                />
            ),
            dataIndex: 'imei_2',
            children: [
                {
                    title: convertToLang(translation[DEVICE_IMEI_2], "IMEI 2"),
                    align: "center",
                    dataIndex: 'imei_2',
                    key: 'imei_2',
                    sorter: (a, b) => { return a.imei_2.localeCompare(b.imei_2) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="simno2"
                    key="simno2"
                    id="simno2"
                    className="search_heading sim_2_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SIM_2], "SIM 2")}
                />
            ),
            dataIndex: 'sim_2',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_2], "SIM 2"),
                    align: "center",
                    dataIndex: 'sim_2',
                    key: 'sim_2',
                    sorter: (a, b) => { return a.sim_2.localeCompare(b.sim_2) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="serial_number"
                    key="serial_number"
                    id="serial_number"
                    className="search_heading serial_number_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SERIAL_NUMBER], "SERIAL NUMBER")}
                />
            ),
            dataIndex: 'serial_number',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SERIAL_NUMBER], "SERIAL NUMBER"),
                    align: "center",
                    dataIndex: 'serial_number',
                    key: 'serial_number',
                    sorter: (a, b) => { return a.serial_number.localeCompare(b.serial_number) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="model"
                    key="model"
                    id="model"
                    className="search_heading model_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_MODEL], "MODEL")}
                />
            ),
            dataIndex: 'model',
            children: [
                {
                    title: convertToLang(translation[DEVICE_MODEL], "MODEL"),
                    align: "center",
                    dataIndex: 'model',
                    key: 'model',
                    sorter: (a, b) => { return a.model.localeCompare(b.model) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="remainTermDays"
                    key="remainTermDays"
                    id="remainTermDays"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[REMAINING_TERM_DAYS], "REMAINING TERM DAYS")}
                />
            ),
            dataIndex: 'remainTermDays',
            children: [
                {
                    title: convertToLang(translation[REMAINING_TERM_DAYS], "REMAINING TERM DAYS"),
                    align: "center",
                    dataIndex: 'remainTermDays',
                    key: 'remainTermDays',
                    sorter: (a, b) => { return a.remainTermDays - b.remainTermDays },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="start_date"
                    key="start_date"
                    id="start_date"
                    className="search_heading start_date_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_START_DATE], "START DATE")}
                />
            ),
            dataIndex: 'start_date',
            children: [
                {
                    title: convertToLang(translation[DEVICE_START_DATE], "START DATE"),
                    align: "center",
                    dataIndex: 'start_date',
                    key: 'start_date',
                    sorter: (a, b) => { return a.start_date.localeCompare(b.start_date) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="expiry_date"
                    key="expiry_date"
                    id="expiry_date"
                    className="search_heading expiry_date_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE")}
                />
            ),
            dataIndex: 'expiry_date',
            children: [
                {
                    title: convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE"),
                    align: "center",
                    dataIndex: 'expiry_date',
                    key: 'expiry_date',
                    sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
    ]);
}


export function usersColumns(translation, handleSearch) {
    return ([
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[ACTION], "ACTION"),
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
                    className="search_heading user_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_ID], "USER ID")}
                />
            ),
            dataIndex: 'user_id',
            children: [
                {
                    title: convertToLang(translation[USER_ID], "USER ID"),
                    align: "center",
                    dataIndex: 'user_id',
                    key: "user_id",
                    sorter: (a, b) => {
                        // console.log(a, 'user is is')
                        return a.user_id.localeCompare(b.user_id)
                    },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <div>
                    <Input.Search
                        name="devicesList"
                        key="device_id"
                        id="device_id"
                        className="search_heading device_id_w"
                        autoComplete="new-password"
                        onChange={handleSearch}
                        placeholder={convertToLang(translation[""], "DEVICES")}
                    />
                </div>
            ),
            dataIndex: 'devices',
            className: 'row',
            children: [
                {
                    title: (
                        <span>
                            {convertToLang(translation[""], "DEVICES")}
                            <Popover placement="top" content={(<Markup content={convertToLang(translation[USER_DEVICES_HELPING_TEXT],
                                `   <p>Press <a style="font-size: 20px;vertical-align: sub;margin-left: 4px;">
                                <i className="fa fa-caret-right" aria-hidden="true"></i>
                                </a> to View Devices<br/> list of this User</p>`)} />)}>
                                <span className="helping_txt"><Icon type="info-circle" /></span>
                            </Popover>
                        </span>
                    ),
                    align: "center",
                    dataIndex: 'devices',
                    key: "devices",
                    className: 'row device_id_w_td',
                    onFilter: (value, record) => record.devices.indexOf(value) === 0,
                    sorter: (a, b) => { return a.devices - b.devices },
                    // sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="user_name"
                    key="user_name"
                    id="user_name"
                    className="search_heading user_name_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_NAME], "NAME")}
                />
            ),
            dataIndex: 'user_name',
            className: 'row',
            children: [{
                title: convertToLang(translation[USER_NAME], "NAME"),
                dataIndex: 'user_name',
                align: "center",
                key: 'user_name',
                sorter: (a, b) => { return a.user_name.localeCompare(b.user_name) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
        {
            title: (
                <Input.Search
                    name="email"
                    key="email"
                    id="email"
                    className="search_heading email_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_EMAIL], "EMAIL")}
                />
            ),
            dataIndex: 'email',
            className: 'row',
            children: [{
                title: convertToLang(translation[USER_EMAIL], "EMAIL"),
                dataIndex: 'email',
                align: "center",
                key: 'email',
                sorter: (a, b) => { return a.email.localeCompare(b.email.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
        // {
        //     title: convertToLang(translation[USER_TOKEN], "USER TOKEN"),
        //     align: "center",
        //     dataIndex: 'tokens',
        //     key: "tokens",
        //     className: "token_w",
        // },
        {
            title: (
                <Input.Search
                    name="created_at"
                    key="created_at"
                    id="created_at"
                    className="search_heading created_at_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_DATE_REGISTERED], "DATE REGISTERED")}
                />
            ),
            dataIndex: 'created_at',
            className: 'row',
            children: [{
                title: convertToLang(translation[USER_DATE_REGISTERED], "DATE REGISTERED"),
                dataIndex: 'created_at',
                align: "center",
                key: 'created_at',
                sorter: (a, b) => { return a.created_at.localeCompare(b.created_at.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
    ]);
}
export function StandAloneSimsColumns(translation, handleSearch) {
    return ([
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[ACTION], "ACTION"),
            align: "center",
            dataIndex: 'action',
            key: "action",
        },
        {
            title: (
                <Input.Search
                    name="device_id"
                    key="device_id"
                    id="device_id"
                    className="search_heading email_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "DEVICE ID")}
                />
            ),
            dataIndex: 'device_id',
            className: 'row',
            children: [{
                title: convertToLang(translation[""], "DEVICE ID"),
                dataIndex: 'device_id',
                align: "center",
                key: 'device_id',
                sorter: (a, b) => { return a.device_id.localeCompare(b.device_id.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
        {
            title: (
                <Input.Search
                    name="status"
                    key="status"
                    id="status"
                    className="search_heading user_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "STATUS")}
                />
            ),
            dataIndex: 'status',
            children: [
                {
                    title: convertToLang(translation[""], "STATUS"),
                    align: "center",
                    dataIndex: 'status',
                    key: "status",
                    sorter: (a, b) => {
                        // console.log(a, 'user is is')
                        return a.status.localeCompare(b.status)
                    },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="sim_iccid"
                    key="sim_iccid"
                    id="sim_iccid"
                    className="search_heading user_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "SIM ICCID")}
                />
            ),
            dataIndex: 'sim_iccid',
            children: [
                {
                    title: convertToLang(translation[""], "SIM ICCID"),
                    align: "center",
                    dataIndex: 'sim_iccid',
                    key: "sim_iccid",
                    sorter: (a, b) => {
                        // console.log(a, 'user is is')
                        return a.sim_iccid.localeCompare(b.sim_iccid)
                    },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },

        {
            title: (
                <Input.Search
                    name="term"
                    key="term"
                    id="term"
                    className="search_heading email_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "TERM")}
                />
            ),
            dataIndex: 'term',
            className: 'row',
            children: [{
                title: convertToLang(translation[""], "TERM"),
                dataIndex: 'term',
                align: "center",
                key: 'term',
                sorter: (a, b) => { return a.term.localeCompare(b.term.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
        {
            title: (
                <Input.Search
                    name="start_date"
                    key="start_date"
                    id="start_date"
                    className="search_heading email_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "START DATE")}
                />
            ),
            dataIndex: 'start_date',
            className: 'row',
            children: [{
                title: convertToLang(translation[""], "START DATE"),
                dataIndex: 'start_date',
                align: "center",
                key: 'start_date',
                sorter: (a, b) => { return a.start_date.localeCompare(b.start_date.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
        {
            title: (
                <Input.Search
                    name="expiry_date"
                    key="expiry_date"
                    id="expiry_date"
                    className="search_heading email_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "EXPIRY DATE")}
                />
            ),
            dataIndex: 'expiry_date',
            className: 'row',
            children: [{
                title: convertToLang(translation[""], "EXPIRY DATE"),
                dataIndex: 'expiry_date',
                align: "center",
                key: 'expiry_date',
                sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
        {
            title: (
                <Input.Search
                    name="created_at"
                    key="created_at"
                    id="created_at"
                    className="search_heading created_at_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_DATE_REGISTERED], "DATE REGISTERED")}
                />
            ),
            dataIndex: 'created_at',
            className: 'row',
            children: [{
                title: convertToLang(translation[USER_DATE_REGISTERED], "DATE REGISTERED"),
                dataIndex: 'created_at',
                align: "center",
                key: 'created_at',
                sorter: (a, b) => { return a.created_at.localeCompare(b.created_at.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
    ]);
}

export function userDevicesListColumns(translation, handleSearch) {
    return ([
        {
            title: '#',
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            // title: (this.state.tabselect === "5") ? <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>:'',
            title: convertToLang(translation[ACTION], "ACTION"),
            dataIndex: 'action',
            align: 'center',
            className: 'row',
            width: 800,
            key: "action"
        },
        {
            title: (
                <Input.Search
                    name="activation_code"
                    key="activation_code"
                    id="activation_code"
                    className="search_heading activation_code_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_ACTIVATION_CODE], "ACTIVATION CODE"))}
                />
            ),
            dataIndex: 'activation_code',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ACTIVATION_CODE], "ACTIVATION CODE"),
                    align: "center",
                    dataIndex: 'activation_code',
                    sorter: (a, b) => { return a.activation_code.localeCompare(b.activation_code) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="link_code"
                    key="link_code"
                    id="link_code"
                    className="search_heading link_code_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_DEALER_PIN], "DEALER PIN"))}
                />
            ),
            dataIndex: 'dealer_pin',
            children: [
                {
                    title: convertToLang(translation[DEVICE_DEALER_PIN], "DEALER PIN"),
                    align: "center",
                    dataIndex: 'dealer_pin',
                    key: 'dealer_pin',
                    sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="device_id"
                    key="device_id"
                    id="device_id"
                    className="search_heading device_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_ID], "DEVICE ID"))}
                />
            ),
            dataIndex: 'device_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ID], "DEVICE ID"),
                    align: "center",
                    dataIndex: 'device_id',
                    key: "device_id",
                    sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="finalStatus"
                    key="status"
                    id="status"
                    className="search_heading status_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_STATUS], "STATUS"))}
                />
            ),
            dataIndex: 'status',

            children: [
                {
                    title: convertToLang(translation[DEVICE_STATUS], "STATUS"),
                    align: "center",
                    dataIndex: 'status',
                    key: 'status',
                    sorter: (a, b) => { return a.status.props.children[1].localeCompare(b.status.props.children[1]) },

                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="expiry_date"
                    key="expiry_date"
                    id="expiry_date"
                    className="search_heading expiry_date_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE"))}
                />
            ),
            dataIndex: 'expiry_date',
            children: [
                {
                    title: convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE"),
                    align: "center",
                    dataIndex: 'expiry_date',
                    key: 'expiry_date',
                    sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="pgp_email"
                    key="pgp_email"
                    id="pgp_email"
                    className="search_heading pgp_email_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL"))}
                />
            ),
            dataIndex: 'pgp_email',
            children: [
                {
                    title: convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL"),
                    align: "center",
                    dataIndex: 'pgp_email',
                    sorter: (a, b) => { return a.pgp_email.localeCompare(b.pgp_email) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="chat_id"
                    key="chat_id"
                    id="chat_id"
                    className="search_heading chat_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID"))}
                />
            ),
            dataIndex: 'chat_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID"),
                    align: "center",
                    dataIndex: 'chat_id',
                    key: 'chat_id',
                    sorter: (a, b) => { return a.chat_id.localeCompare(b.chat_id) },

                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="sim_id"
                    key="sim_id"
                    id="sim_id"
                    className="search_heading sim_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_SIM_ID], "SIM ID"))}
                />
            ),
            dataIndex: 'sim_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_ID], "SIM ID"),
                    align: "center",
                    dataIndex: 'sim_id',
                    key: 'sim_id',
                    sorter: (a, b) => { return a.sim_id.localeCompare(b.sim_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="imei"
                    key="imei"
                    id="imei"
                    className="search_heading imei_w"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_IMEI_1], "IMEI 1"))}
                    onChange={handleSearch}
                />
            ),
            dataIndex: 'imei_1',
            children: [
                {
                    title: convertToLang(translation[DEVICE_IMEI_1], "IMEI 1"),
                    align: "center",
                    dataIndex: 'imei_1',
                    key: 'imei_1',
                    sorter: (a, b) => { return a.imei_1.localeCompare(b.imei_1) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="imei2"
                    key="imei2"
                    id="imei2"
                    className="search_heading imei2_w"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_IMEI_2], "IMEI 2"))}
                    onChange={handleSearch}
                />
            ),
            dataIndex: 'imei_2',
            children: [
                {
                    title: convertToLang(translation[DEVICE_IMEI_2], "IMEI 2"),
                    align: "center",
                    dataIndex: 'imei_2',
                    key: 'imei_2',
                    sorter: (a, b) => { return a.imei_2.localeCompare(b.imei_2) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
    ]);
}

export function supportSystemMessagesReceiversColumns(translation, handleSearch) {
    return ([
        {
            title: '#',
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[""], "NAME"),
            align: "center",
            dataIndex: 'name',
            sorter: (a, b) => { return a.name.localeCompare(b.name) },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: convertToLang(translation[DEVICE_DEALER_PIN], "DEALER PIN"),
            align: "center",
            dataIndex: 'link_code',
            key: 'link_code',
            sorter: (a, b) => { return a.link_code - b.link_code },
            sortDirections: ['ascend', 'descend'],

        },
    ]);
}


export function bulkDeviceHistoryColumns(translation) {
    return ([
        {
            title: '#',
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[DEVICE_ACTIVATION_CODE], "ACTIVATION CODE"),
            align: "center",
            dataIndex: 'activation_code',
            sorter: (a, b) => { return a.activation_code.localeCompare(b.activation_code) },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: convertToLang(translation[DEVICE_DEALER_PIN], "DEALER PIN"),
            align: "center",
            dataIndex: 'dealer_pin',
            key: 'dealer_pin',
            sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: convertToLang(translation[DEVICE_ID], "DEVICE ID"),
            align: "center",
            dataIndex: 'device_id',
            key: "device_id",
            sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
            sortDirections: ['ascend', 'descend'],

        },
        // {
        //     title: convertToLang(translation[DEVICE_STATUS], "STATUS"),
        //     align: "center",
        //     dataIndex: 'status',
        //     key: 'status',
        //     sorter: (a, b) => { return a.status.props.children[1].localeCompare(b.status.props.children[1]) },

        //     sortDirections: ['ascend', 'descend'],

        // },
        {
            title: convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE"),
            align: "center",
            dataIndex: 'expiry_date',
            key: 'expiry_date',
            sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL"),
            align: "center",
            dataIndex: 'pgp_email',
            sorter: (a, b) => { return a.pgp_email.localeCompare(b.pgp_email) },
            sortDirections: ['ascend', 'descend'],
        }, {
            title: convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID"),
            align: "center",
            dataIndex: 'chat_id',
            key: 'chat_id',
            sorter: (a, b) => { return a.chat_id.localeCompare(b.chat_id) },

            sortDirections: ['ascend', 'descend'],
        }, {
            title: convertToLang(translation[DEVICE_SIM_ID], "SIM ID"),
            align: "center",
            dataIndex: 'sim_id',
            key: 'sim_id',
            sorter: (a, b) => { return a.sim_id.localeCompare(b.sim_id) },
            sortDirections: ['ascend', 'descend'],
        }, {
            title: convertToLang(translation[DEVICE_IMEI_1], "IMEI 1"),
            align: "center",
            dataIndex: 'imei_1',
            key: 'imei_1',
            sorter: (a, b) => { return a.imei_1.localeCompare(b.imei_1) },
            sortDirections: ['ascend', 'descend'],

        }, {

            title: convertToLang(translation[DEVICE_IMEI_2], "IMEI 2"),
            align: "center",
            dataIndex: 'imei_2',
            key: 'imei_2',
            sorter: (a, b) => { return a.imei_2.localeCompare(b.imei_2) },
            sortDirections: ['ascend', 'descend'],
        },
    ]);
}


export function dealerColumns(translation, handleSearch) {
    return ([
        {
            title: '#',
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: 'ACTION',
            dataIndex: 'accounts',
            align: 'center',
            className: 'row',
        },
        {
            title: (
                <Input.Search
                    name="devicesList"
                    key="connected_devices"
                    id="connected_devices"
                    className="search_heading"
                    autoComplete="new-password"
                    onChange={handleSearch}
                    placeholder={convertToLang(translation[DEALER_DEVICES], "DEVICES")}

                />
            ),
            dataIndex: 'connected_devices',
            className: '',
            children: [
                {
                    title: convertToLang(translation[DEALER_DEVICES], "DEVICES"),
                    dataIndex: 'connected_devices',
                    key: 'connected_devices',
                    sorter: (a, b) => { return a.connected_devices - b.connected_devices },
                    align: 'center',
                    sortDirections: ['ascend', 'descend'],
                    className: '',
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="dealer_id"
                    key="dealer_id"
                    id="dealer_id"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEALER_ID], "DEALER ID")}
                    onChange={handleSearch}

                />
            ),
            dataIndex: 'dealer_id',
            className: '',
            children: [
                {
                    title: convertToLang(translation[DEALER_ID], "DEALER ID"),
                    dataIndex: 'dealer_id',
                    key: 'dealer_id',
                    align: 'center',
                    sorter: (a, b) => a.dealer_id - b.dealer_id,
                    sortDirections: ['ascend', 'descend'],
                    className: '',
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="link_code"
                    key="link_code"
                    id="link_code"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEALER_PIN], "DEALER PIN")}
                    onChange={handleSearch}

                />
            ),
            dataIndex: 'link_code',
            className: '',
            children: [
                {
                    title: convertToLang(translation[DEALER_PIN], "DEALER PIN"),
                    dataIndex: 'link_code',
                    key: 'link_code',
                    sorter: (a, b) => { return a.link_code.localeCompare(b.link_code) },
                    align: 'center',
                    sortDirections: ['ascend', 'descend'],
                    className: '',
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="dealer_name"
                    key="dealer_name"
                    id="dealer_name"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEALER_NAME], "DEALER NAME")}
                    onChange={handleSearch}

                />
            ),
            dataIndex: 'dealer_name',
            className: '',
            children: [
                {
                    title: convertToLang(translation[DEALER_NAME], "DEALER NAME"),
                    dataIndex: 'dealer_name',
                    key: 'dealer_name',
                    sorter: (a, b) => { return a.dealer_name.localeCompare(b.dealer_name) },
                    align: 'center',
                    sortDirections: ['ascend', 'descend'],
                    className: '',
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="dealer_email"
                    key="dealer_email"
                    id="dealer_email"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEALER_EMAIL], "DEALER EMAIL")}
                    onChange={handleSearch}

                />
            ),
            dataIndex: 'dealer_email',
            className: '',
            children: [
                {
                    title: convertToLang(translation[DEALER_EMAIL], "DEALER EMAIL"),
                    dataIndex: 'dealer_email',
                    key: 'dealer_email',
                    // sorter: (a, b) => {
                    //     console.log(a);
                    //     // console.log(b);
                    //     return a.dealer_email.length;
                    // },
                    sorter: (a, b) => { return a.dealer_email.localeCompare(b.dealer_email) },

                    align: 'center',
                    sortDirections: ['ascend', 'descend'],
                    className: '',
                }
            ]
        },


        {
            title: (
                <Input.Search
                    name="dealer_credits"
                    key="dealer_credits"
                    id="dealer_credits"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "CREDITS")}
                    onChange={handleSearch}

                />
            ),
            dataIndex: 'dealer_credits',
            className: '',
            children: [
                {
                    title: convertToLang(translation[""], "CREDITS"),
                    dataIndex: 'dealer_credits',
                    key: 'dealer_credits',
                    // sorter: (a, b) => {
                    //     console.log(a);
                    //     // console.log(b);
                    //     return a.dealer_credits.length;
                    // },
                    sorter: (a, b) => { return a.dealer_credits - b.dealer_credits },

                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="last_login"
                    key="last_login"
                    id="last_login"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={convertToLang(translation['LAST LOGIN'], "LAST LOGIN")}
                    onChange={handleSearch}

                />
            ),
            dataIndex: 'last_login',
            className: '',
            children: [
                {
                    title: convertToLang(translation['LAST LOGIN'], "LAST LOGIN"),
                    dataIndex: 'last_login',
                    key: 'last_login',
                    align: 'center',
                    sorter: (a, b) => a.last_login - b.last_login,
                    sortDirections: ['ascend', 'descend'],
                    className: '',
                }
            ]
        }

    ]);
}

export function sDealerColumns(translation, handleSearch) {
    return ([
        {
            title: (
                <Input.Search
                    name="parent_dealer"
                    key="parent_dealer"
                    id="parent_dealer"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[Parent_Dealer], "PARENT DEALER")}
                    onChange={handleSearch}
                />
            ),
            dataIndex: 'parent_dealer',
            className: '',
            children: [
                {
                    title: convertToLang(translation[Parent_Dealer], "PARENT DEALER"),
                    dataIndex: 'parent_dealer',
                    key: 'parent_dealer',
                    className: '',
                    // sorter: (a, b) => {
                    //     console.log(a);
                    //     // console.log(b);
                    //     return a.parent_dealer.length;
                    // },
                    sorter: (a, b) => { return a.parent_dealer.localeCompare(b.parent_dealer) },

                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="parent_dealer_id"
                    key="parent_dealer_id"
                    id="parent_dealer_id"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[Parent_Dealer_ID], "Parent Dealer ID")}
                    onChange={handleSearch}
                />
            ),
            dataIndex: 'parent_dealer_id',
            className: '',
            children: [
                {
                    title: convertToLang(translation[Parent_Dealer_ID], "Parent Dealer ID"),
                    dataIndex: 'parent_dealer_id',
                    key: 'parent_dealer_id',
                    className: '',
                    sorter: (a, b) => { return a.parent_dealer_id - b.parent_dealer_id },

                }
            ]
        }
    ]);
}


export function dealerColsWithSearch(translation, searchBar = false, callBack = null) {

    var searchInput = [
        {
            title: (
                <Input.Search
                    name="dealer_id"
                    key="dealer_id"
                    id="dealer_id"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEALER_ID], "DEALER ID"))}
                    onChange={
                        (e) => {
                            callBack(e)
                        }
                    }

                />
            ),
            dataIndex: 'dealer_id',
            className: '',
            children: []
        },
        {
            title: (
                <Input.Search
                    name="link_code"
                    key="link_code"
                    id="link_code"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEALER_PIN], "DEALER PIN"))}
                    onChange={
                        (e) => {
                            callBack(e)
                        }
                    }

                />
            ),
            dataIndex: 'link_code',
            className: '',
            children: []
        },
        {
            title: (
                <Input.Search
                    name="dealer_name"
                    key="dealer_name"
                    id="dealer_name"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEALER_NAME], "DEALER NAME"))}
                    onChange={
                        (e) => {
                            callBack(e)
                        }
                    }

                />
            ),
            dataIndex: 'dealer_name',
            className: '',
            children: []
        },
        {
            title: (
                <Input.Search
                    name="dealer_email"
                    key="dealer_email"
                    id="dealer_email"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEALER_EMAIL], "DEALER EMAIL"))}
                    onChange={
                        (e) => {
                            callBack(e)
                        }
                    }

                />
            ),
            dataIndex: 'dealer_email',
            className: '',
            children: []
        },
    ]


    var child = [
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: '',
            key: 'counter',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[DEALER_ACTION], "ACTION"),
            dataIndex: 'action',
            key: 'action',
            className: '',
        },
        {
            title: convertToLang(translation[DEALER_ID], "DEALER ID"),
            dataIndex: 'dealer_id',
            key: 'dealer_id',
            sorter: (a, b) => a.dealer_id - b.dealer_id,
            sortDirections: ['ascend', 'descend'],
            className: '',
        },
        {
            title: convertToLang(translation[DEALER_PIN], "DEALER PIN"),
            dataIndex: 'link_code',
            key: 'link_code',
            sorter: (a, b) => {
                if (a.link_code.props) {
                    return a.link_code.props.children.localeCompare(b.link_code.props.children)
                } else {
                    return a.link_code.localeCompare(b.link_code)
                }
            },
            sortDirections: ['ascend', 'descend'],
            className: '',
        },
        {
            title: convertToLang(translation[DEALER_NAME], "DEALER NAME"),
            dataIndex: 'dealer_name',
            key: 'dealer_name',
            sorter: (a, b) => { return a.dealer_name.props.children.localeCompare(b.dealer_name.props.children) },
            sortDirections: ['ascend', 'descend'],
            className: '',
        },
        {
            title: convertToLang(translation[DEALER_EMAIL], "DEALER EMAIL"),
            dataIndex: 'dealer_email',
            key: 'dealer_email',
            sorter: (a, b) => {
                if (a.dealer_email.props) {
                    return a.dealer_email.props.children.localeCompare(b.dealer_email.props.children)
                } else {
                    return a.dealer_email.localeCompare(b.dealer_email)
                }
            },
            sortDirections: ['ascend', 'descend'],
            className: '',
        },
        {
            title: convertToLang(translation["permission_by"], "PERMISSION BY"),
            dataIndex: 'permission_by',
            key: 'permission_by',
            name: 'permission_by',
            // sorter: (a, b) => {
            //     if (a.permission_by.props) {
            //         return a.permission_by.props.children.localeCompare(b.permission_by.props.children)
            //     } else {
            //         return a.permission_by.localeCompare(b.permission_by)
            //     }
            // },
            // sortDirections: ['ascend', 'descend'],
            className: '',
        }

    ];

    if (searchBar) {
        var result = checkIsArray(searchInput).map((item, index) => {
            let flag = true;
            for (var i in child) {
                if (child[i].dataIndex == item.dataIndex) {
                    item.children = [child[i]];
                    flag = false;
                    return item;
                }
            }
            if (flag == true) {
                return item;
            }
        })
        return result;
    } else {
        return child;
    }
}


export function mobileMainMenu(translation) {
    return (
        [
            {
                pageName: APPS,
                value: convertToLang(translation[APPLICATION_PERMISION], "Application Permission")
            },
            {
                pageName: SECURE_SETTING,
                value: convertToLang(translation[SECURE_SETTING_PERMISSION], "Secure Settings Permission")
            },
            {
                pageName: SYSTEM_CONTROLS,
                value: convertToLang(translation[SYSTEM_PERMISSION], "System Permission")
            },

            {
                pageName: MANAGE_PASSWORD,
                value: convertToLang(translation[MANAGE_PASSWORDS], "Manage Password")
            },

        ]
    );
}

export function mobileManagePasswords(translation) {
    return ([

        {
            pageName: GUEST_PASSWORD,
            value: convertToLang(translation[SET_GUEST_PASSWORD], "Set Guest Password")
        },
        {
            pageName: ENCRYPTED_PASSWORD,
            value: convertToLang(translation[SET_ENCRYPTED_PASSWORD], "Set Encrypted Password")
        },
        {
            pageName: DURESS_PASSWORD,
            value: convertToLang(translation[RESET_DURESS_PASSWORD], "Reset Duress Password")
        },

        {
            pageName: ADMIN_PASSWORD,
            value: convertToLang(translation[CHANGE_ADMIN_PANEL_CODE], "Change Admin Panel Code")
        },
    ]);
}
// Devie Settings
export function appsColumns(translation) {
    return ([
        {
            title: convertToLang(translation[APK_APP_NAME], "APP NAME"),
            dataIndex: 'app_name',
            key: '1',
            render: text => <a style={{ fontSize: 12 }}>{text}</a>,
        }, {
            title: convertToLang(translation[Guest], "Guest"),
            dataIndex: 'guest',
            key: '2',
        }, {
            title: convertToLang(translation[ENCRYPTED], "ENCRYPTED"),
            dataIndex: 'encrypted',
            key: '3',
        }, {
            title: convertToLang(translation[ENABLE], "ENABLE"),
            dataIndex: 'enable',
            key: '4',
        }
    ]);
}

export function extensionColumns(translation) {
    return ([
        {
            title: convertToLang(translation[EXTENSION_NAME], "EXTENSION NAME"),
            dataIndex: 'label',
            key: '1',
            render: text => <a style={{ fontSize: 12 }}> {text}</ a>,
        }, {
            title: convertToLang(translation[Guest], "Guest"),
            dataIndex: 'guest',
            key: '2',
        }, {
            title: convertToLang(translation[ENCRYPTED], "ENCRYPTED"),
            dataIndex: 'encrypted',
            key: '3',
        }
    ]);
}

export function controlColumns(translation) {
    return ([
        {
            title: convertToLang(translation[PERMISSION_NAME], "PERMISSION NAME"),
            dataIndex: 'label',
            key: '1',
            render: text => <a style={{ fontSize: 12 }}>{text}</a>,
        }, {
            title: convertToLang(translation[DEVICE_STATUS], "STATUS"),
            dataIndex: 'status',
            key: '2',
        }
    ]);
}

export function policyColumns(translation, handleSearch) {
    return ([
        //     title: 'ACTIONS',
        //     dataIndex: 'action',
        //     align: 'center',
        //     className: 'row',
        //     width: 800,
        // },
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[POLICY_ACTION], "ACTION"),
            align: "center",
            dataIndex: 'action',
            key: "action",
        },
        {
            title: (
                <span>
                    {convertToLang(translation[POLICY_INFO], "POLICY INFO")}
                    {/* <Popover placement="top" content='dumy'>
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                </span>),
            dataIndex: 'policy_info',
            key: 'policy_info',
            className: 'row'
        },
        {
            title: (
                <span>
                    {convertToLang(translation[POLICY_PERMISSIONS], "PERMISSIONS")}
                    <Popover placement="top" content={
                        (<Markup content={convertToLang(translation[POLICY_PERMISSION_HELPING_TEXT],
                            `<span>Add dealers who are allowed <br/> to use this Policy</span>`)} />
                        )
                    }>
                        <span className="helping_txt"><Icon type="info-circle" /></span>
                    </Popover>
                </span>
            ),
            dataIndex: 'permission',
            key: 'permission',
            className: 'row '
        },
        {
            title: (
                <span>
                    {convertToLang(translation[POLICY_STATUS], "STATUS")}
                    <Popover placement="top" content={
                        (<Markup content={convertToLang(translation[POLICY_STATUS_HELPING_TEXT],
                            `<span>Enable or Disable this policy using <br/> the toggle below.  When disabled,  <br />it cannot be pushed to devices</span>`)} />
                        )
                    }>
                        <span className="helping_txt"><Icon type="info-circle" /></span>
                    </Popover>
                </span>
            ),
            dataIndex: 'policy_status',
            key: 'policy_status',
        },
        {
            title: (
                <Input.Search
                    name="policy_name"
                    key="policy_name"
                    id="policy_name"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[POLICY_NAME], "POLICY NAME")}
                />
            ),
            dataIndex: 'policy_name',
            className: '',
            children: [
                {
                    title: convertToLang(translation[POLICY_NAME], "POLICY NAME"),
                    align: "center",
                    dataIndex: 'policy_name',
                    key: "policy_name",
                    className: '',
                    sorter: (a, b) => { return a.policy_name.localeCompare(b.policy_name) },
                }
            ],
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: (
                <Input.Search
                    name="command_name"
                    key="command_name"
                    id="command_name"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[POLICY_COMMAND], "POLICY COMMAND")}
                />
            ),
            dataIndex: 'policy_command',
            className: '',
            children: [
                {
                    title: convertToLang(translation[POLICY_COMMAND], "POLICY COMMAND"),
                    align: "center",
                    className: '',
                    dataIndex: 'policy_command',
                    key: 'policy_command',
                    sorter: (a, b) => { return a.policy_command.localeCompare(b.policy_command) },

                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="policy_note"
                    key="policy_note"
                    id="policy_note"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[POLICY_NOTE], "POLICY NOTE")}
                />
            ),
            dataIndex: 'policy_note',
            className: '',
            children: [
                {
                    title: convertToLang(translation[POLICY_NOTE], "POLICY NOTE"),
                    align: "center",
                    className: '',
                    dataIndex: 'policy_note',
                    key: 'policy_note',
                    sorter: (a, b) => { return a.policy_note.localeCompare(b.policy_note) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: convertToLang(translation[POLICY_SIZE], "POLICY SIZE"),
            dataIndex: 'policy_size',
            key: 'policy_size',
        },
        {
            title: convertToLang(translation[POLICY_DEFAULT], "DEFAULT"),
            dataIndex: 'default_policy',
            key: 'default_policy',
        },
        {
            title: (
                <Input.Search
                    name="created_by"
                    key="created_by"
                    id="created_by"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "CREATED BY")}
                />
            ),
            dataIndex: 'created_by',
            className: '',
            children: [
                {
                    title: convertToLang(translation[""], "CREATED BY"),
                    align: "center",
                    className: '',
                    dataIndex: 'created_by',
                    key: 'created_by',
                    // ...this.getColumnSearchProps('status'),
                    sorter: (a, b) => { return a.created_by.localeCompare(b.created_by) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="created_date"
                    key="created_date"
                    id="created_date"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "CREATED DATE")}
                />
            ),
            dataIndex: 'created_date',
            className: '',
            children: [
                {
                    title: convertToLang(translation[""], "CREATED DATE"),
                    align: "center",
                    className: '',
                    dataIndex: 'created_date',
                    key: 'created_date',
                    // ...this.getColumnSearchProps('status'),
                    sorter: (a, b) => { return a.created_date.localeCompare(b.created_date) },

                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="last_edited"
                    key="last_edited"
                    id="last_edited"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[""], "LAST EDIT")}
                />
            ),
            dataIndex: 'last_edited',
            className: '',
            children: [
                {
                    title: convertToLang(translation[""], "LAST EDIT"),
                    align: "center",
                    className: '',
                    dataIndex: 'last_edited',
                    key: 'last_edited',
                    // ...this.getColumnSearchProps('status'),
                    sorter: (a, b) => { return a.last_edited.localeCompare(b.last_edited) },

                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
    ]
    )
};

export function apkColumns(translation) {
    return ([
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[ACTION], "ACTION"),
            dataIndex: 'action',
            key: 'action',
            className: 'row m-0'
        },

        {
            title: (
                <span>
                    {convertToLang(translation[APK_PERMISSION], "PERMISSION")}
                    <Popover placement="top" content={(<Markup content={convertToLang(translation[APK_PERMISSION_HELPING_TEXT],
                        `   <p>Press <a style="font-size: 20px;vertical-align: sub;margin-left: 4px;">
                            <i className="fa fa-caret-right" aria-hidden="true"></i>
                            </a> to Add, remove or View
                            <br/> the Dealers who have permission
                            <br/>to use this App</p>`)} />)}>
                        <span className="helping_txt"><Icon type="info-circle" /></span>
                    </Popover>
                </span>),
            dataIndex: 'permission',
            key: 'permission',
            // className: ''
        },
        {
            title: convertToLang(translation[""], "USED BY"),
            dataIndex: 'used_by',
            key: 'used_by',
        },
        {
            title:
                <span>
                    {convertToLang(translation[APK_SHOW_ON_DEVICE], "SHOW ON DEVICE3")}
                    <Popover placement="top"
                        content={(<Markup content={convertToLang(translation[SHOW_ON_DEVCIE_HELPING_TEXT],
                            `<p>Shows app in <b>Install Apps</b> <br />menu on Devices`)} />)}>
                        <span className="helping_txt"><Icon type="info-circle" /></span>
                    </Popover>
                </span>,
            // title: 'SHOW ON DEVICE',
            dataIndex: 'apk_status',
            key: 'apk_status',
            // className: ''
        },
        {
            title: convertToLang(translation[""], "VERSION"),
            dataIndex: 'version',
            key: 'version',
        },
        {
            title: convertToLang(translation[APK_APP_NAME], "APP NAME"),
            dataIndex: 'apk_name',
            width: "100",
            key: 'apk_name',
            sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: "ascend",
            // className: ''
        },
        {
            title: convertToLang(translation[APK_APP_LOGO], "APP LOGO"),
            dataIndex: 'apk_logo',
            key: 'apk_logo',
            // className: ''
        },
        {
            title: convertToLang(translation[APK_SIZE], "APP SIZE"),
            dataIndex: 'apk_size',
            key: 'apk_size',
            // className: ''
        },

        {
            title: convertToLang(translation[""], "LABEL"),
            dataIndex: 'label',
            key: 'label',
        },
        {
            title: convertToLang(translation[""], "PACKAGE NAME"),
            dataIndex: 'package_name',
            key: 'package_name',
        },
        {
            title: convertToLang(translation[APK], "APK"),
            dataIndex: 'apk',
            key: 'apk',
            // className: ''
        },

        {
            title: convertToLang(translation[""], "LAST UPLOADED"),
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: convertToLang(translation[""], "LAST UPDATED"),
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
    ])
}
export function featureApkColumns(translation) {
    return ([
        {
            title: (
                <span>
                    {convertToLang(translation[APK_PERMISSION], "PERMISSION")}
                    <Popover placement="top" content={(<Markup content={convertToLang(translation[APK_PERMISSION_HELPING_TEXT],
                        `   <p>Press <a style="font-size: 20px;vertical-align: sub;margin-left: 4px;">
                            <i className="fa fa-caret-right" aria-hidden="true"></i>
                            </a> to Add, remove or View
                            <br/> the Dealers who have permission
                            <br/>to use this App</p>`)} />)}>
                        <span className="helping_txt"><Icon type="info-circle" /></span>
                    </Popover>
                </span>),
            dataIndex: 'permission',
            key: 'permission',
            className: ''
        },
        {
            title: convertToLang(translation[APK_APP_NAME], "APP NAME"),
            dataIndex: 'apk_name',
            width: "100",
            key: 'apk_name',
            sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: "ascend"
        },
        {
            title: convertToLang(translation[APK_APP_LOGO], "APP LOGO"),
            dataIndex: 'apk_logo',
            key: 'apk_logo',
        },
        {
            title: convertToLang(translation[APK_SIZE], "APP SIZE"),
            dataIndex: 'apk_size',
            key: 'apk_size',
        },
        {
            title: convertToLang(translation[''], "PACKAGE NAME"),
            dataIndex: 'package_name',
            width: "100",
            key: 'package_name',
            sorter: (a, b) => { return a.package_name.localeCompare(b.package_name) },
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: "ascend"
        },
        {
            title: convertToLang(translation["APP VERSION"], "APP VERSION"),
            dataIndex: 'apk_version',
            key: 'apk_version',
        },
        {
            title: convertToLang(translation["UPDATED DATE"], "LAST UPDATED"),
            dataIndex: 'updated_date',
            key: 'updated_date',
        },
    ])
}

export function dealerAgentColumns(translation, handleSearch) {
    return ([
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        // action
        {
            title: convertToLang(translation[ACTION], "ACTION"),
            align: "center",
            dataIndex: 'action',
            key: "action",
        },
        // username
        {
            title: (
                <div>
                    <Input.Search
                        name="name"
                        key="name"
                        id="name"
                        className="search_heading device_id_w"
                        autoComplete="new-password"
                        onChange={handleSearch}
                        placeholder={convertToLang(translation['USERNAME'], "USERNAME")}
                    />
                </div>
            ),
            dataIndex: 'name',
            className: 'row',
            children: [
                {
                    title: convertToLang(translation['USERNAME'], "USERNAME"),
                    align: "center",
                    dataIndex: 'name',
                    key: "name",
                    className: 'row device_id_w_td',
                    onFilter: (value, record) => record.devices.indexOf(value) === 0,
                    sorter: (a, b) => { return a.name.localeCompare(b.name) },
                    // sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        // staff_id
        {
            title: (
                <Input.Search
                    name="staff_id"
                    key="staff_id"
                    id="staff_id"
                    className="search_heading user_id_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation["STAFF ID"], "STAFF ID")}
                />
            ),
            dataIndex: 'staff_id',
            children: [
                {
                    title: convertToLang(translation["STAFF ID"], "STAFF ID"),
                    align: "center",
                    dataIndex: 'staff_id',
                    key: "staff_id",
                    sorter: (a, b) => {
                        // console.log(a, 'user is is')
                        return a.staff_id.localeCompare(b.staff_id)
                    },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },

        // permission
        {
            title: (
                <Input.Search
                    name="type"
                    key="type"
                    id="type"
                    className="search_heading user_name_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation["PERMISSION"], "PERMISSION")}
                />
            ),
            dataIndex: 'type',
            className: 'row',
            children: [{
                title: convertToLang(translation["PERMISSION"], "PERMISSION"),
                dataIndex: 'type',
                align: "center",
                key: 'type',
                sorter: (a, b) => { return a.type.localeCompare(b.type) },
                sortDirections: ['ascend', 'descend'],
            }]
        },

        // status
        {
            title: convertToLang(translation['STATUS'], "STATUS"),
            dataIndex: 'status',
            className: 'row',
            key: 'status',
            // align: "center",
        },

        // email
        {
            title: (
                <Input.Search
                    name="email"
                    key="email"
                    id="email"
                    className="search_heading email_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_EMAIL], "EMAIL")}
                />
            ),
            dataIndex: 'email',
            className: 'row',
            children: [{
                title: convertToLang(translation[USER_EMAIL], "EMAIL"),
                dataIndex: 'email',
                align: "center",
                key: 'email',
                sorter: (a, b) => { return a.email.localeCompare(b.email.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
        {
            title: (
                <Input.Search
                    name="created_at"
                    key="created_at"
                    id="created_at"
                    className="search_heading created_at_w"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation['DATE.CREATED'], "DATE CREATED")}
                />
            ),
            dataIndex: 'created_at',
            className: 'row',
            children: [{
                title: convertToLang(translation['DATE.CREATED'], "DATE CREATED"),
                dataIndex: 'created_at',
                align: "center",
                key: 'created_at',
                sorter: (a, b) => { return a.created_at.localeCompare(b.created_at.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },

        {
            title: convertToLang(translation["SUPPORT.CALLS"], "SUPPORT CALLS"),
            align: "center",
            dataIndex: 'support_calls',
            key: "support_calls",
            className: "token_w",
        },
    ]);
}

export function bulkDevicesColumns(translation, handleSearch) {

    return ([
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },

        {
            title: (
                <Input.Search
                    name="device_id"
                    key="device_id"
                    id="device_id"
                    className="search_heading device_id_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_ID], "DEVICE ID")}
                />
            ),

            dataIndex: 'device_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ID], "DEVICE ID"),
                    align: "center",
                    dataIndex: 'device_id',
                    key: "device_id",
                    sorter: (a, b) => {
                        let list = a.device_id.localeCompare(b.device_id);

                        return list
                    }, //
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        }, {
            title: (
                <Input.Search
                    name="user_id"
                    key="user_id"
                    id="user_id"
                    className="search_heading user_id_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_ID], "USER ID")}
                // onBlur={(e) => { e.target.value = '' }}
                />
            ),
            dataIndex: 'user_id',
            children: [
                {
                    title: convertToLang(translation[USER_ID], "USER ID"),
                    align: "center",
                    dataIndex: 'user_id',
                    key: "user_id",
                    sorter: (a, b) => {
                        return a.user_id.props.children.localeCompare(b.user_id.props.children)
                    },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },

        {
            title: (
                <Input.Search
                    name="lastOnline"
                    key="lastOnline"
                    id="lastOnline"
                    className="search_heading status_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation["Last Online"], "Last Online")}
                // onBlur={(e) => { e.target.value = '' }}
                />
            ),
            dataIndex: 'lastOnline',
            children: [
                {
                    title: convertToLang(translation["Last Online"], "Last Online"),
                    align: "center",
                    dataIndex: 'lastOnline',
                    key: 'lastOnline',
                    sorter: (a, b) => { return a.lastOnline.props.children[1].localeCompare(b.lastOnline.props.children[1]) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="online"
                    key="online"
                    id="online"
                    className="search_heading online_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_MODE], "MODE")}
                />
            ),
            dataIndex: 'online',
            children: [
                {
                    title: convertToLang(translation[DEVICE_MODE], "MODE"),
                    align: "center",
                    dataIndex: 'online',
                    key: 'online',
                    sorter: (a, b) => { return a.online.props.children[1].localeCompare(b.online.props.children[1]) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="type"
                    key="type"
                    id="type"
                    className="search_heading"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_TYPE], "TYPE")}
                />
            ),
            dataIndex: 'type',
            children: [
                {
                    title: convertToLang(translation[DEVICE_TYPE], "TYPE"),
                    align: "center",
                    dataIndex: 'type',
                    key: 'type',
                    sorter: (a, b) => { return a.type.localeCompare(b.type) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="version"
                    key="version"
                    id="version"
                    className="search_heading"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_VERSION], "VERSION")}
                />
            ),
            dataIndex: 'version',
            children: [
                {
                    title: convertToLang(translation[DEVICE_VERSION], "VERSION"),
                    align: "center",
                    dataIndex: 'version',
                    key: 'version',
                    sorter: (a, b) => { return a.version.localeCompare(b.version) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="name"
                    key="name"
                    id="name"
                    className="search_heading name_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_NAME], "NAME")}
                />
            ),
            dataIndex: 'name',
            children: [
                {
                    title: convertToLang(translation[DEVICE_NAME], "NAME"),
                    align: "center",
                    dataIndex: 'name',
                    key: 'name',
                    sorter: (a, b) => { return a.name.localeCompare(b.name) },
                    sortDirections: ['ascend', 'descend'],
                    editable: true,

                }
            ]


        },
        {
            title: (
                <Input.Search
                    name="account_email"
                    key="account_email"
                    id="account_email"
                    className="search_heading account_email_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_ACCOUNT_EMAIL], "ACCOUNT EMAIL")}
                />
            ),
            dataIndex: 'account_email',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ACCOUNT_EMAIL], "ACCOUNT EMAIL"),
                    align: "center",
                    dataIndex: 'account_email',
                    key: 'account_email',
                    sorter: (a, b) => { return a.account_email.localeCompare(b.account_email) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="client_id"
                    key="client_id"
                    id="client_id"
                    className="search_heading client_id_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_CLIENT_ID], "CLIENT ID")}
                />
            ),
            dataIndex: 'client_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_CLIENT_ID], "CLIENT ID"),
                    align: "center",
                    dataIndex: 'client_id',
                    key: 'client_id',
                    sorter: (a, b) => { return a.client_id.localeCompare(b.client_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="pgp_email"
                    key="pgp_email"
                    id="pgp_email"
                    className="search_heading pgp_email_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL")}
                />
            ),
            dataIndex: 'pgp_email',
            children: [
                {
                    title: convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL"),
                    align: "center",
                    dataIndex: 'pgp_email',
                    sorter: (a, b) => { return a.pgp_email.localeCompare(b.pgp_email) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="sim_id"
                    key="sim_id"
                    id="sim_id"
                    className="search_heading sim_id_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SIM_ID], "SIM ID")}
                />
            ),
            dataIndex: 'sim_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_ID], "SIM ID"),
                    align: "center",
                    dataIndex: 'sim_id',
                    key: 'sim_id',
                    sorter: (a, b) => { return a.sim_id.localeCompare(b.sim_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="chat_id"
                    key="chat_id"
                    id="chat_id"
                    className="search_heading chat_id_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID")}
                />
            ),
            dataIndex: 'chat_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID"),
                    align: "center",
                    dataIndex: 'chat_id',
                    key: 'chat_id',
                    sorter: (a, b) => { return a.chat_id.localeCompare(b.chat_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="dealer_id"
                    key="dealer_id"
                    id="dealer_id"
                    className="search_heading dealer_id_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_DEALER_ID], "DEALER ID")}
                />
            ),
            dataIndex: 'dealer_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_DEALER_ID], "DEALER ID"),
                    align: "center",
                    dataIndex: 'dealer_id',
                    key: 'dealer_id',
                    sorter: (a, b) => { return a.dealer_id - b.dealer_id },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="dealer_name"
                    key="dealer_name"
                    id="dealer_name"
                    className="search_heading dealer_name_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_DEALER_NAME], "DEALER NAME")}
                />
            ),
            dataIndex: 'dealer_name',
            children: [
                {
                    title: convertToLang(translation[DEVICE_DEALER_NAME], "DEALER NAME"),
                    align: "center",
                    dataIndex: 'dealer_name',
                    key: 'dealer_name',
                    sorter: (a, b) => { return a.dealer_name.props.children.localeCompare(b.dealer_name.props.children) },
                    sortDirections: ['ascend', 'descend'],


                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="mac_address"
                    key="mac_address"
                    id="mac_address"
                    className="search_heading mac_address_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_MAC_ADDRESS], "MAC ADDRESS")}
                />
            ),
            dataIndex: 'mac_address',
            children: [
                {
                    title: convertToLang(translation[DEVICE_MAC_ADDRESS], "MAC ADDRESS"),
                    align: "center",
                    dataIndex: 'mac_address',
                    key: 'mac_address',
                    sorter: (a, b) => { return a.mac_address.localeCompare(b.mac_address) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="imei"
                    key="imei"
                    id="imei"
                    className="search_heading imei_1_w"
                    autoComplete="new-password"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    placeholder={convertToLang(translation[DEVICE_IMEI_1], "IMEI 1")}
                />
            ),
            dataIndex: 'imei_1',
            children: [
                {
                    title: convertToLang(translation[DEVICE_IMEI_1], "IMEI 1"),
                    align: "center",
                    dataIndex: 'imei_1',
                    key: 'imei_1',
                    sorter: (a, b) => { return a.imei_1.localeCompare(b.imei_1) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="simno"
                    key="simno"
                    id="simno"
                    className="search_heading sim_1_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SIM_1], "SIM 1")}
                />
            ),
            dataIndex: 'sim_1',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_1], "SIM 1"),
                    align: "center",
                    dataIndex: 'sim_1',
                    key: 'sim_1',
                    sorter: (a, b) => { return a.sim_1.localeCompare(b.sim_1) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="imei2"
                    key="imei2"
                    id="imei2"
                    className="search_heading imei_2_w"
                    autoComplete="new-password"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    placeholder={convertToLang(translation[DEVICE_IMEI_2], "IMEI 2")}
                />
            ),
            dataIndex: 'imei_2',
            children: [
                {
                    title: convertToLang(translation[DEVICE_IMEI_2], "IMEI 2"),
                    align: "center",
                    dataIndex: 'imei_2',
                    key: 'imei_2',
                    sorter: (a, b) => { return a.imei_2.localeCompare(b.imei_2) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="simno2"
                    key="simno2"
                    id="simno2"
                    className="search_heading sim_2_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SIM_2], "SIM 2")}
                />
            ),
            dataIndex: 'sim_2',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_2], "SIM 2"),
                    align: "center",
                    dataIndex: 'sim_2',
                    key: 'sim_2',
                    sorter: (a, b) => { return a.sim_2.localeCompare(b.sim_2) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="serial_number"
                    key="serial_number"
                    id="serial_number"
                    className="search_heading serial_number_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SERIAL_NUMBER], "SERIAL NUMBER")}
                />
            ),
            dataIndex: 'serial_number',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SERIAL_NUMBER], "SERIAL NUMBER"),
                    align: "center",
                    dataIndex: 'serial_number',
                    key: 'serial_number',
                    sorter: (a, b) => { return a.serial_number.localeCompare(b.serial_number) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="model"
                    key="model"
                    id="model"
                    className="search_heading model_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_MODEL], "MODEL")}
                />
            ),
            dataIndex: 'model',
            children: [
                {
                    title: convertToLang(translation[DEVICE_MODEL], "MODEL"),
                    align: "center",
                    dataIndex: 'model',
                    key: 'model',
                    sorter: (a, b) => { return a.model.localeCompare(b.model) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="s_dealer"
                    key="s_dealer"
                    id="s_dealer"
                    className="search_heading s_dealer_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_S_DEALER], "S DEALER")}
                />
            ),
            dataIndex: 's_dealer',
            children: [
                {
                    title: convertToLang(translation[DEVICE_S_DEALER], "S DEALER"),
                    align: "center",
                    dataIndex: 's_dealer',
                    key: 's_dealer',
                    sorter: (a, b) => { return a.s_dealer.localeCompare(b.s_dealer) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="s_dealer_name"
                    key="s_dealer_name"
                    id="s_dealer_name"
                    className="search_heading s_dealer_name_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_S_DEALER_NAME], "S DEALER NAME")}
                />
            ),
            dataIndex: 's_dealer_name',
            children: [
                {
                    title: convertToLang(translation[DEVICE_S_DEALER_NAME], "S DEALER NAME"),
                    align: "center",
                    dataIndex: 's_dealer_name',
                    key: 's_dealer_name',
                    sorter: (a, b) => { return a.s_dealer_name.localeCompare(b.s_dealer_name) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="start_date"
                    key="start_date"
                    id="start_date"
                    className="search_heading start_date_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_START_DATE], "START DATE")}
                />
            ),
            dataIndex: 'start_date',
            children: [
                {
                    title: convertToLang(translation[DEVICE_START_DATE], "START DATE"),
                    align: "center",
                    dataIndex: 'start_date',
                    key: 'start_date',
                    sorter: (a, b) => { return a.start_date.localeCompare(b.start_date) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="expiry_date"
                    key="expiry_date"
                    id="expiry_date"
                    className="search_heading expiry_date_w"
                    onChange={handleSearch}
                    // onFocus={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE")}
                />
            ),
            dataIndex: 'expiry_date',
            children: [
                {
                    title: convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE"),
                    align: "center",
                    dataIndex: 'expiry_date',
                    key: 'expiry_date',
                    sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
    ]);
}


export function inventorySales(translation) {
    return (
        [
            {
                title: "#",
                dataIndex: 'counter',
                align: 'center',
                className: 'row',
                key: 'counter',
                render: (text, record, index) => ++index,
            },
            {
                dataIndex: 'item',
                className: '',
                title: convertToLang(translation["ITEM"], "ITEM"),
                align: "center",
                key: 'item',
                // sorter: (a, b) => { return a.item.localeCompare(b.item) },
                // sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(translation[DUMY_TRANS_ID], "DESCRIPTION"),
                dataIndex: 'description',
                className: '',
                align: "center",
                key: 'description',
                // ...this.getColumnSearchProps('status'),
                // sorter: (a, b) => { return a.description.localeCompare(b.description) },
                // sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(translation[DUMY_TRANS_ID], "SERVICE TERM"),
                dataIndex: 'term',
                className: '',
                align: "center",
                key: 'term',
                // ...this.getColumnSearchProps('status'),
                // sorter: (a, b) => { return a.term.localeCompare(b.term) },
                // sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(translation[DUMY_TRANS_ID], "UNIT PRICE (CREDITS)"),
                dataIndex: 'unit_price',
                className: '',
                align: "center",
                key: 'unit_price',
                // ...this.getColumnSearchProps('status'),
                // sorter: (a, b) => { return a.unit_price - b.unit_price },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(translation[DUMY_TRANS_ID], "QUANTITY"),
                dataIndex: 'quantity',
                className: '',
                align: "center",
                key: 'quantity',
                // ...this.getColumnSearchProps('status'),
                // sorter: (a, b) => { return a.quantity - b.quantity },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(translation[DUMY_TRANS_ID], "TOTAL"),
                dataIndex: 'line_total',
                align: "center",
                className: '',
                key: 'line_total',
                // ...this.getColumnSearchProps('status'),
                // sorter: (a, b) => { return a.line_total - b.line_total },
                // sortDirections: ['ascend', 'descend'],
            },
        ]
    );
}
export function refundServiceColumns(translation) {
    return (
        [
            {
                title: "#",
                dataIndex: 'counter',
                align: 'center',
                className: 'row',
                key: 'counter',
                render: (text, record, index) => ++index,
            },
            {
                dataIndex: 'item',
                className: '',
                title: convertToLang(translation["ITEM"], "ITEM"),
                align: "center",
                key: 'item',
                // sorter: (a, b) => { return a.item.localeCompare(b.item) },
                // sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(translation[DUMY_TRANS_ID], "DESCRPTION"),
                dataIndex: 'description',
                align: "center",
                className: '',
                key: 'description',
                // ...this.getColumnSearchProps('status'),
                // sorter: (a, b) => { return a.description.localeCompare(b.description) },
                // sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(translation[DUMY_TRANS_ID], "SERVICE TERM"),
                dataIndex: 'term',
                className: '',
                align: "center",
                key: 'term',
            },

            {
                title: convertToLang(translation[DUMY_TRANS_ID], "CREDIT TERM (DAYS)"),
                dataIndex: 'remaining_term',
                align: "center",
                className: '',
                key: 'remaining_term',
            },

            {
                title: convertToLang(translation[DUMY_TRANS_ID], "UNIT PRICE (CREDITS)"),
                dataIndex: 'unit_price',
                align: "center",
                className: '',
                key: 'unit_price',
                // ...this.getColumnSearchProps('status'),
                // sorter: (a, b) => { return a.unit_price - b.unit_price },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(translation[DUMY_TRANS_ID], "TOTAL"),
                dataIndex: 'line_total',
                className: '',
                align: "center",
                key: 'line_total',
                // ...this.getColumnSearchProps('status'),
                // sorter: (a, b) => { return a.line_total - b.line_total },
                // sortDirections: ['ascend', 'descend'],
            }
        ]
    );
}


export function appMarketColumns(translation, handleSearch, removeSMapps) {
    return (
        [
            // {
            // title: (
            //     <Input.Search
            //         name="app_name"
            //         key="app_name"
            //         id="app_name"
            //         className="search_heading"
            //         // onChange={handleSearch}
            //         autoComplete="new-password"
            //         // placeholder={titleCase(props.convertToLang(props.translation[""], "APP NAME"))}
            //         placeholder="Search here"
            //     />
            // ),
            // dataIndex: '',
            // children: [
            {
                title: '#',
                dataIndex: 'counter',
                align: 'center',
                className: 'row',
                render: (text, record, index) => ++index,
            },
            {
                title: <Button type="danger" size="small" onClick={() => removeSMapps("all", "guest")}>Remove All</Button>,
                dataIndex: 'removeAllGuest',
                align: 'center',
                className: '',
                // width: 50,
            },
            {
                title: <Button type="danger" size="small" onClick={() => removeSMapps("all", "encrypted")}>Remove All</Button>,
                dataIndex: 'removeAllEncrypted',
                align: 'center',
                className: '',
                // width: 50,
            },
            {
                title: "LOGO", // convertToLang(translation[ACTION], "ACTION"),
                dataIndex: 'logo',
                align: 'center',
                className: '',
                // width: 800,
                key: "logo"
            },
            {
                title: (
                    <Input.Search
                        name="app_name"
                        key="app_name"
                        id="app_name"
                        className="search_heading"
                        onChange={handleSearch}
                        autoComplete="new-password"
                        // placeholder={titleCase(props.convertToLang(props.translation[""], "APP NAME"))}
                        placeholder="Search here"
                    />
                ),
                align: 'center',
                dataIndex: 'app_name',
                children: [
                    {
                        title: "APP NAME",
                        dataIndex: 'app_name',
                        sorter: (a, b) => { return a.app_name.localeCompare(b.app_name) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]

            },
            {
                title: "",
                dataIndex: 'uninstall',
                align: 'center',
                className: '',
                // width: 800,
                key: "uninstall"
            },
            // ]
            // }
        ]
    )
}

export function domainColumns(translation, handleSearch, isModal = false) {
    let columns = [
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },

        {

            title: (
                <span>
                    {convertToLang(translation[APK_PERMISSION], "PERMISSION")}
                    <Popover placement="top" content={(<Markup content={convertToLang(translation[""],
                        `   <p>Press <a style="font-size: 20px;vertical-align: sub;margin-left: 4px;">
                                    <i className="fa fa-caret-right" aria-hidden="true"></i>
                                    </a> to Add, remove or View
                                    <br/> the Dealers who have permission
                                    <br/>to use this Domain</p>`)} />)}>
                        <span className="helping_txt"><Icon type="info-circle" /></span>
                    </Popover>
                </span>),
            dataIndex: 'permission',
            key: 'permission',
            // className: ''
            //     }
            // ]
        },

        {
            title: (
                <Input.Search
                    name="name"
                    key="name"
                    id="name"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    // placeholder={titleCase(props.convertToLang(props.translation[""], "APP NAME"))}
                    placeholder="DOMAIN NAME"
                />
            ),
            dataIndex: 'name',
            className: '',
            key: 'name',
            children: [
                {
                    title: convertToLang(translation[""], "DOMAIN NAME"),
                    dataIndex: 'name',
                    key: 'name',
                    // className: ''
                }
            ]

        },
    ];

    if (isModal) {
        let actionColumn = {

            title: 'ACTION',
            dataIndex: 'action',
            key: 'action',
            // className: ''
            //     }
            // ]
        };

        let permissionBy =  {
            title: (
                <Input.Search
                    name="permission_by"
                    key="permission_by"
                    id="permission_by"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder="PERMISSION BY"
                />
            ),
            children: [
                {
                    title: convertToLang(translation[""], "PERMISSION BY"),
                    dataIndex: 'permission_by',
                    key: 'permission_by',
                    name: 'permission_by'
                }
            ]
        };


        columns[1] = actionColumn;
        columns.push(permissionBy);
        // columns.splice(1, 1)
    }

    return columns;
}

export function addDomainModalColumns(translation, handleSearch) {
    let columns = [
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },

        {
            title: (
                <Input.Search
                    name="name"
                    key="name"
                    id="name"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    // placeholder={titleCase(props.convertToLang(props.translation[""], "APP NAME"))}
                    placeholder="DOMAIN NAME"
                />
            ),
            dataIndex: 'name',
            className: '',
            key: 'name',
            children: [
                {
                    title: convertToLang(translation[""], "DOMAIN NAME"),
                    dataIndex: 'name',
                    key: 'name',
                    // className: ''
                }
            ]

        },
    ];

    return columns;
}
export function deviceMsgsColumns(translation, handleSearch, isModal = false) {
    let columns = [
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: "ACTION",
            dataIndex: 'action',
            align: 'center',
            className: '',
        },

        {
            title: (
                <span>
                    {convertToLang(translation[""], "DEVICES")}
                    <Popover placement="top" content={(<Markup content={convertToLang(translation[""],
                        `   <p>Press <a style="font-size: 20px;vertical-align: sub;margin-left: 4px;">
                                    <i className="fa fa-caret-right" aria-hidden="true"></i>
                                    </a> to view devices list</p>`)} />)}>
                        <span className="helping_txt"><Icon type="info-circle" /></span>
                    </Popover>
                </span>),
            dataIndex: 'send_to',
            key: 'send_to',
        },



        {
            title: (
                <Input.Search
                    name="msg"
                    key="msg"
                    id="msg"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder="MESSAGE"
                    allowClear
                />
            ),
            dataIndex: 'msg',
            className: '',
            key: 'msg',
            children: [
                {
                    title: convertToLang(translation[""], "MESSAGE"),
                    dataIndex: 'msg',
                    key: 'msg',
                    sorter: (a, b) => { return a.msg.props.children.localeCompare(b.msg.props.children) },
                    sortDirections: ['ascend', 'descend'],
                    // className: ''
                }
            ]

        },
        {
            title: (
                <Input.Search
                    name="timer_status"
                    key="timer_status"
                    id="timer_status"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder="TIMER STATUS"
                    allowClear
                />
            ),
            dataIndex: 'timer_status',
            key: 'timer_status',
            className: '',
            children: [
                {
                    width: 120,
                    title: convertToLang(translation[""], "TIMER STATUS"),
                    dataIndex: 'timer_status',
                    key: 'timer_status',
                    sorter: (a, b) => { return a.timer_status.localeCompare(b.timer_status) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        // {
        //     title: (
        //         <Input.Search
        //             name="repeat"
        //             key="repeat"
        //             id="repeat"
        //             className="search_heading"
        //             onChange={handleSearch}
        //             autoComplete="new-password"
        //             placeholder="INTERVAL"
        //         />
        //     ),
        //     dataIndex: 'repeat',
        //     className: '',
        //     key: 'repeat',
        //     children: [
        //         {
        //             width: 100,
        //             title: convertToLang(translation[""], "INTERVAL"),
        //             dataIndex: 'repeat',
        //             key: 'repeat',
        //         }
        //     ]

        // },
        { // date/time
            title: (
                <Input.Search
                    name="date_time"
                    key="date_time"
                    id="date_time"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder="DATE/TIME"
                    allowClear
                />
            ),
            dataIndex: 'date_time',
            className: '',
            key: 'date_time',
            children: [
                {
                    width: 130,
                    title: convertToLang(translation[""], "DATE/TIME"),
                    dataIndex: 'date_time',
                    key: 'date_time',
                    sorter: (a, b) => { return a.date_time.localeCompare(b.date_time) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]

        },
        { // 1 - 7
            title: (
                <Input.Search
                    name="interval_description"
                    key="interval_description"
                    id="interval_description"
                    className="search_heading"
                    onChange={handleSearch}
                    autoComplete="new-password"
                    placeholder="INTERVAL DESCRIPTION"
                    allowClear
                />
            ),
            dataIndex: 'interval_description',
            className: '',
            key: 'interval_description',
            children: [
                {
                    // width: 130,
                    title: convertToLang(translation[""], "INTERVAL DESCRIPTION"),
                    dataIndex: 'interval_description',
                    key: 'interval_description',
                    sorter: (a, b) => { return a.interval_description.localeCompare(b.interval_description) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]

        },
        // { // 1 - 7
        //     title: (
        //         <Input.Search
        //             name="week_day"
        //             key="week_day"
        //             id="week_day"
        //             className="search_heading"
        //             onChange={handleSearch}
        //             autoComplete="new-password"
        //             placeholder="DAY"
        //         />
        //     ),
        //     dataIndex: 'week_day',
        //     className: '',
        //     key: 'week_day',
        //     children: [
        //         {
        //             width: 130,
        //             title: convertToLang(translation[""], "DAY"),
        //             dataIndex: 'week_day',
        //             key: 'week_day',
        //         }
        //     ]

        // },
        // { // 1 - 31
        //     title: (
        //         <Input.Search
        //             name="month_date"
        //             key="month_date"
        //             id="month_date"
        //             className="search_heading"
        //             onChange={handleSearch}
        //             autoComplete="new-password"
        //             placeholder="DATE"
        //         />
        //     ),
        //     dataIndex: 'month_date',
        //     className: '',
        //     key: 'month_date',
        //     children: [
        //         {
        //             width: 130,
        //             title: convertToLang(translation[""], "DATE"),
        //             dataIndex: 'month_date',
        //             key: 'month_date',
        //         }
        //     ]

        // },
        // { // for only 12 months
        //     title: (
        //         <Input.Search
        //             name="month_name"
        //             key="month_name"
        //             id="month_name"
        //             className="search_heading"
        //             onChange={handleSearch}
        //             autoComplete="new-password"
        //             placeholder="MONTH"
        //         />
        //     ),
        //     dataIndex: 'month_name',
        //     className: '',
        //     key: 'month_name',
        //     children: [
        //         {
        //             width: 130,
        //             title: convertToLang(translation[""], "MONTH"),
        //             dataIndex: 'month_name',
        //             key: 'month_name',
        //         }
        //     ]

        // },
    ];


    if (isModal) {
        columns.splice(1, 1)
    }

    return columns;
}

export function supportSystemMessage(translation, isModal = false) {
    let columns = [
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            width: 50,
            render: (text, record, index) => ++index,
        },
        {
            title: "ACTION",
            dataIndex: 'action',
            align: 'center',
            width: 100,
            className: '',
        },
        {
            title: "RECEIVER",
            dataIndex: 'receivers',
            className: '',
            key: 'receivers',
            width: 100,
        },

        {
            title: convertToLang(translation[""], "TYPE"),
            width: 100,
            dataIndex: 'type',
            key: 'type',
            sorter: (a, b) => { return a.type.localeCompare(b.type) },
            sortDirections: ['ascend', 'descend'],
        },

        {
            title: convertToLang(translation[""], "SENDER"),
            width: 100,
            dataIndex: 'sender',
            key: 'sender',
            sorter: (a, b) => { return a.sender.localeCompare(b.sender) },
            sortDirections: ['ascend', 'descend'],
        },

        {
            title: convertToLang(translation[""], "SUBJECT"),
            dataIndex: 'subject',
            width: 400,
            maxWidth: 400,
            key: 'subject',
            sorter: (a, b) => { return a.subjectOriginal.localeCompare(b.subject) },
            sortDirections: ['ascend', 'descend'],
        },

        {
            width: 100,
            title: convertToLang(translation[""], "DATE"),
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => { return a.createdAt.localeCompare(b.createdAt) },
            sortDirections: ['ascend', 'descend'],
        },

        {
            width: 100,
            title: convertToLang(translation[""], "TIME"),
            dataIndex: 'createdTime',
            key: 'createdTime',
            sorter: (a, b) => { return a.createdTime.localeCompare(b.createdTime) },
            sortDirections: ['ascend', 'descend'],
        }
    ];

    return columns;
}
