import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Spin, Input, Card, Select } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AppFilter from "../../../components/AppFilter";
// import styles from './users_fixheader.css'
// import {
//     DEVICE_ID,
//     DEVICE_REMAINING_DAYS,
//     DEVICE_FLAGGED,
//     DEVICE_STATUS,
//     DEVICE_MODE,
//     DEVICE_NAME,
//     DEVICE_ACTIVATION_CODE,
//     DEVICE_ACCOUNT_EMAIL,
//     DEVICE_PGP_EMAIL,
//     DEVICE_CHAT_ID,
//     DEVICE_CLIENT_ID,
//     DEVICE_DEALER_ID,
//     DEVICE_DEALER_PIN,
//     DEVICE_MAC_ADDRESS,
//     DEVICE_SIM_ID,
//     DEVICE_IMEI_1,
//     DEVICE_SIM_1,
//     DEVICE_IMEI_2,
//     DEVICE_SIM_2,
//     DEVICE_SERIAL_NUMBER,
//     DEVICE_MODEL,
//     DEVICE_START_DATE,
//     DEVICE_EXPIRY_DATE,
//     DEVICE_DEALER_NAME,
//     DEVICE_S_DEALER,
//     DEVICE_S_DEALER_NAME
// } from '../../../constants/DeviceConstants';
import {
    DEVICE_ACTIVATED,
    DEVICE_EXPIRED,
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_SUSPENDED,
    DEVICE_UNLINKED,
    DEVICE_TRIAL,
    ADMIN
} from '../../../constants/Constants'
import { getStatus, componentSearch, titleCase, checkValue, getColor, convertToLang, checkIsArray } from '../../utils/commonUtils';
import { userDevicesListColumns } from '../../utils/columnsUtils';
import { Button_Connect } from '../../../constants/ButtonConstants';
import { Appfilter_SearchDevices } from '../../../constants/AppFilterConstants';
// import styles from './user.css';

var coppyDevices = [];
var status = true;
const Search = Input.Search;

// export default 
class UserDeviceList extends Component {
    constructor(props) {
        super(props);
        var listdeviceCols = userDevicesListColumns(props.translation, this.handleSearch)

        this.state = {
            sorterKey: '',
            sortOrder: 'ascend',
            listdeviceCols: listdeviceCols,
            devicesList: this.props.record.devicesList ? this.props.record.devicesList : [],
            permissions: [],
            pagination: 10

        }

    }

    // handleTableChange = (pagination, query, sorter) => {
    //     // console.log('check sorter func: ', sorter)
    //     const sortOrder = sorter.order || "ascend";
    //     this.listdeviceCols = userDevicesListColumns(sortOrder, this.props.translation, this.handleSearch)
    // };

    handleTableChange = (pagination, query, sorter) => {
        console.log('check sorter func: ', sorter)
        let columns = this.state.listdeviceCols;

        checkIsArray(columns).forEach(column => {
            if (column.children) {
                if (Object.keys(sorter).length > 0) {
                    if (column.dataIndex == sorter.field) {
                        if (this.state.sorterKey == sorter.field) {
                            column.children[0]['sortOrder'] = sorter.order;
                        } else {
                            column.children[0]['sortOrder'] = "ascend";
                        }
                    } else {
                        column.children[0]['sortOrder'] = "";
                    }
                    this.setState({ sorterKey: sorter.field });
                } else {
                    if (this.state.sorterKey == column.dataIndex) column.children[0]['sortOrder'] = "ascend";
                }
            }
        })
        this.setState({
            listdeviceCols: columns
        });
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        // console.log('will receive props', nextProps);
        if (this.props.record.user_id !== nextProps.record.user_id) {
            this.setState({
                devicesList: nextProps.record.devicesList,
            })
        } else if (this.props.record.devicesList.length !== nextProps.record.devicesList.length) {

            this.setState({
                devicesList: nextProps.record.devicesList,
            })
        }

        if (this.props.translation !== nextProps.translation) {
            this.setState({
                listdeviceCols: userDevicesListColumns(nextProps.translation, this.handleSearch)
            })
        }
    }
    searchField = (originalData, fieldName, value) => {
        let demoData = [];

        if (value.length) {
            checkIsArray(originalData).forEach((data) => {
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] !== null) {
                        if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    }
                    // else {
                    //     // demoDevices.push(device);
                    // }
                } else {
                    demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }

    searchAllFields = (originalData, value) => {
        let demoData = [];

        if (value.length) {
            checkIsArray(originalData).forEach((data) => {
                if (
                    data['dealer_id'].toString().toUpperCase().includes(value.toUpperCase())
                ) {
                    demoData.push(data);
                }
                else if (data['link_code'].toString().toUpperCase().includes(value.toUpperCase())) {
                    demoData.push(data);
                }
                else if (data['dealer_name'].toString().toUpperCase().includes(value.toUpperCase())) {
                    demoData.push(data);

                }
                else if (data['dealer_email'].toString().toUpperCase().includes(value.toUpperCase())) {
                    demoData.push(data);
                } else {
                    // demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }


    handlePagination = (value) => {
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }






    handleSearch = (e) => {

        let demoDevices = [];
        if (status) {
            coppyDevices = this.state.devicesList;
            status = false;
        }
        //  console.log("devices", coppyDevices);

        if (e.target.value.length) {
            // console.log("keyname", e.target.name);
            // console.log("value", e.target.value);
            // console.log(this.state.devices);
            checkIsArray(coppyDevices).forEach((device) => {
                // console.log("device", device);

                if (device[e.target.name] !== undefined) {
                    if ((typeof device[e.target.name]) === 'string') {
                        // console.log("lsdjfls", device[e.target.name])
                        if (device[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDevices.push(device);
                        }
                    } else if (device[e.target.name] !== null) {
                        // console.log("else lsdjfls", device[e.target.name])
                        if (device[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDevices.push(device);
                        }
                    } else {
                        // demoDevices.push(device);
                    }
                } else {
                    demoDevices.push(device);
                }
            });
            // console.log("searched value", demoDevices);
            this.setState({
                devicesList: demoDevices
            })
        } else {
            this.setState({
                devicesList: coppyDevices
            })
        }
    }

    renderDevices(list) {
        return checkIsArray(list).map((device, index) => {
            var status = device.finalStatus;
            const button_type = (status === DEVICE_ACTIVATED || status === DEVICE_TRIAL) ? "danger" : "dashed";
            let color = getColor(status);
            var style = { margin: '0', width: '60px' }
            var text = "EDIT";
            if ((status === DEVICE_PENDING_ACTIVATION) || (status === DEVICE_UNLINKED)) {
                style = { margin: '0 8px 0 0', width: '60px', display: 'none' }
                text = "Activate";
            }
            let ConnectBtn = <Link to={`/connect-device/${btoa(device.device_id)}`.trim()}><Button type="default" size="small" style={style}> {convertToLang(this.props.translation[Button_Connect], "CONNECT")}</Button></Link>
            // console.log(device.usr_device_id);
            return {
                rowKey: index,
                key: device.device_id ? `${device.device_id}` : device.usr_device_id,
                counter: ++index,
                action: ((status === DEVICE_ACTIVATED || status === DEVICE_TRIAL || status === DEVICE_SUSPENDED) ?
                    (<Fragment>{ConnectBtn}</Fragment>) : false


                ),
                activation_code: checkValue(device.activation_code),
                dealer_pin: checkValue(device.link_code),
                status: (<span style={color} > {status}</span >),
                device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : "N/A",
                pgp_email: checkValue(device.pgp_email),
                chat_id: checkValue(device.chat_id),
                sim_id: checkValue(device.sim_id),
                imei_1: checkValue(device.imei),
                imei_2: checkValue(device.imei2),
                expiry_date: checkValue(device.expiry_date),
            }
        });
    }
    handleComponentSearch = (value) => {
        try {
            if (value.length) {

                if (status) {
                    coppyDevices = this.state.devicesList;
                    status = false;
                }
                let foundDevices = componentSearch(coppyDevices, value);
                if (foundDevices.length) {
                    this.setState({
                        devicesList: foundDevices,
                    })
                } else {
                    this.setState({
                        devicesList: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    devicesList: coppyDevices,
                })
            }
        } catch (error) {
            // alert("hello");
        }
    }


    render() {
        // console.log('dealer state', this.state.devicesList);
        return (
            <Fragment>
                <Card className="expand_row_card">
                    <Row>
                        <Col span={6} >
                            <div className="search_heading pl-16">
                                <Search
                                    placeholder={convertToLang(this.props.translation[Appfilter_SearchDevices], "Search Devices")}
                                    onChange={e => this.handleComponentSearch(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </Col>
                        <Col span={6}>
                            <div style={{ display: "none" }}>Dummy</div>
                        </Col>
                        <Col span={6}>
                            <div style={{ display: "none" }}>Dummy</div>
                        </Col>
                        <Col span={6}>
                            <div style={{ display: "none" }}>Dummy</div>
                        </Col>

                    </Row>
                    <div className="expand_row">
                        <Table
                            columns={this.state.listdeviceCols}
                            onChange={this.handleTableChange}
                            dataSource={this.renderDevices(this.state.devicesList)}
                            pagination={false
                                //{ pageSize: Number(this.state.pagination), size: "midddle" }
                            }
                        />
                    </div>
                </Card>
            </Fragment>
        )
    }
}
export default UserDeviceList