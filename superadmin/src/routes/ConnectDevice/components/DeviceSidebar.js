import React, { Component } from 'react'
import styles from './AppList';
import { Card, Table, Icon } from "antd";
import { getStatus, getColor, checkValue, titleCase } from '../../../routes/utils/commonUtils'
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
    USER_ID
} from '../../../constants/DeviceConstants';

let make_red = 'captilize';

export default class DeviceSidebar extends Component {
    // constructor(props){
    //     super(props);
    // }
    // componentDidMount(){

    // }    

    renderDetailsData(device_details) {

        //  let status = getStatus(device_details.status, device_details.account_status, device_details.unlink_status, device_details.device_status, device_details.activation_status);
        let color = getColor(device_details.finalStatus)


        // let device_status = 'Active';

        // if ((device_details.status === 'expired')) {
        //     device_status = 'Expired';
        //     make_red = 'make_red captilize'
        // } else if (device_details.account_status === 'suspended') {
        //     device_status = 'Suspended';
        //     make_red = 'make_red captilize'
        // } else if (device_details.unlink_status == 1) {
        //     device_status = 'Unlinked';
        //     make_red = 'make_red captilize'
        // } else {
        //     device_status = 'Active';
        //     make_red = 'captilize'
        // }

        return [
            // {
            //     key: 300,
            //     name: (<a href="javascript:void(0)" >{titleCase(USER_ID)}:</a>),
            //     value: checkValue(device_details.user_id)
            // },
            {
                key: 10,
                name: (<a href="javascript:void(0)" >{titleCase(DEVICE_STATUS)}:</a>),
                value: <span style={color}>{checkValue(device_details.finalStatus)}</span>,
            },
            {
                key: 171,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_MODE)}:</a>),
                value: device_details.online ? (device_details.online == "On") ? (<span style={{ color: "green" }}>Online</span>) : (<span style={{ color: "red" }}>Offline</span>) : "N/A"
            },
            {
                key: 102,
                name: (<a href="javascript:void(0)" >{titleCase(DEVICE_FLAGGED)}:</a>),
                value: (device_details.flagged === '') ? "Not Flagged" : device_details.flagged
            },
            {
                key: 1,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_NAME)}:</a>),
                value: (<span className="captilize">{checkValue(device_details.name)}</span>)
            },
            {
                key: 2,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_ACCOUNT_EMAIL)}:</a>),
                value: checkValue(device_details.account_email)
            },

            {
                key: 3,
                name: (<a href="javascript:void(0)">PGP Email:</a>),
                value: checkValue(device_details.pgp_email)
            },
            {
                key: 812,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_ACTIVATION_CODE)}:</a>),
                value: checkValue(device_details.activation_code)
            },
            {
                key: 4,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_CHAT_ID)}:</a>),
                value: checkValue(device_details.chat_id)
            },
            {
                key: 5,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_CLIENT_ID)}:</a>),
                value: checkValue(device_details.client_id)
            },
            {
                key: 6,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_DEALER_ID)}:</a>),
                value: checkValue(device_details.dealer_id)
            },
            {
                key: 7,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_DEALER_NAME)}:</a>),
                value: (<span className="captilize">{checkValue(device_details.dealer_name)}</span>)
            },
            {
                key: 8,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_DEALER_PIN)}:</a>),
                value: checkValue(device_details.link_code)
            },
            {
                key: 9,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_MAC_ADDRESS)}:</a>),
                value: checkValue(device_details.mac_address)
            },
            {
                key: 12,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_SIM_ID)}:</a>),
                value: checkValue(device_details.sim_id)
            },

            {
                key: 13,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_IMEI_1)}:</a>),
                value: checkValue(device_details.imei)
            },
            {
                key: 14,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_SIM_1)}:</a>),
                value: checkValue(device_details.simno)
            },
            {
                key: 15,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_IMEI_2)}:</a>),
                value: checkValue(device_details.imei2)
            },
            {
                key: 16,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_SIM_2)}:</a>),
                value: checkValue(device_details.simno2)
            },

            {
                key: 111,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_SERIAL_NUMBER)}:</a>),
                value: checkValue(device_details.serial_number)
            },
            {
                key: 11,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_MODEL)}:</a>),
                value: checkValue(device_details.model)
            },
            {
                key: 17,
                name: (<a href="javascript:void(0)">IP Address:</a>),
                value: checkValue(device_details.ip_address)
            },

            {
                key: 172,
                name: (<a href="javascript:void(0)">S-Dealer:</a>),
                value: checkValue(device_details.s_dealer)
            },
            {
                key: 173,
                name: (<a href="javascript:void(0)">S-Dealer Name:</a>),
                value: checkValue(device_details.s_dealer_name)
            },
            {
                key: 18,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_START_DATE)}:</a>),
                value: checkValue(device_details.start_date)
            },
            {
                key: 19,
                name: (<a href="javascript:void(0)">{titleCase(DEVICE_EXPIRY_DATE)}:</a>),
                value: checkValue(device_details.expiry_date)
            }
        ]
    }

    renderDetailsColumns(device_details) {
        return [
            {
                title: <div>
                    <p style={{ margin: "8px 0" }}>Device ID:</p>
                    <p style={{ margin: "8px 0" }}>User ID:</p>
                </div>,
                dataIndex: 'name',
                className: "device_info",
                width: 110,
            }, {
                key: 0,
                title: (
                    <div>
                        <a className="ref-btn" onClick={() => {
                            this.props.refreshDevice(device_details.device_id)
                        }}>
                            <Icon type="sync" spin className="loading_icon" />
                            <Icon type="reload" /> Refresh</a>
                        <div>
                            <p style={{ margin: "8px 0" }}>{device_details.device_id}</p>
                        </div>
                        <p style={{ margin: "8px 0" }}>{checkValue(device_details.user_id)}</p>
                    </div>
                ),
                dataIndex: 'value',
                className: "device_value",
                width: "auto",
            }
        ]
    }

    render() {
        // console.log('device detail', this.props.device_details)
        return (
            <Card>
                <Table
                    columns={
                        this.renderDetailsColumns(this.props.device_details)
                    }
                    dataSource={
                        this.renderDetailsData(this.props.device_details)
                    }
                    scroll={{ y: 546 }}
                    pagination={false}
                />
            </Card>
        )
    }
}
