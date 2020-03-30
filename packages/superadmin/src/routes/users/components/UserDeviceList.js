import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Spin, Input, Card, Select } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AppFilter from "../../../components/AppFilter";
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
    DEVICE_S_DEALER_NAME
} from '../../../constants/DeviceConstants';
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
import { getStatus, componentSearch, titleCase, checkValue, getColor } from '../../utils/commonUtils';
// import styles from './user.css';

var coppyDevices = [];
var status = true;
const Search = Input.Search;

// export default 
class UserDeviceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            devicesList: this.props.record.devicesList ? this.props.record.devicesList : [],
            permissions: [],
            pagination: 10

        }
        this.listdeviceCols = [
            {
                // title: (this.state.tabselect === "5") ? <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>:'',
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
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_ACTIVATION_CODE)}
                    />
                ),
                dataIndex: 'activation_code',
                className: '',
                children: [
                    {
                        title: DEVICE_ACTIVATION_CODE,
                        align: "center",
                        dataIndex: 'activation_code',
                        className: '',
                        sorter: (a, b) => { return a.activation_code - b.activation_code },
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
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_DEALER_PIN)}
                    />
                ),
                dataIndex: 'dealer_pin',
                className: '',
                children: [
                    {
                        title: DEVICE_DEALER_PIN,
                        align: "center",
                        dataIndex: 'dealer_pin',
                        key: 'dealer_pin',
                        className: '',
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
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_ID)}
                    />
                ),
                dataIndex: 'device_id',
                className: '',
                children: [
                    {
                        title: DEVICE_ID,
                        align: "center",
                        dataIndex: 'device_id',
                        key: "device_id",
                        className: '',
                        sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ],
            },
            {
                title: (
                    <Input.Search
                        name="status"
                        key="status"
                        id="status"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_STATUS)}
                    />
                ),
                dataIndex: 'status',
                className: '',

                children: [
                    {
                        title: DEVICE_STATUS,
                        align: "center",
                        className: '',
                        dataIndex: 'status',
                        key: 'status',
                        sorter: (a, b) => { console.log('done', a.status); return a.status.props.children[1].localeCompare(b.status.props.children[1]) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            }, {
                title: (
                    <Input.Search
                        name="expiry_date"
                        key="expiry_date"
                        id="expiry_date"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_EXPIRY_DATE)}
                    />
                ),
                dataIndex: 'expiry_date',
                className: '',
                children: [
                    {
                        title: DEVICE_EXPIRY_DATE,
                        align: "center",
                        className: '',
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
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_PGP_EMAIL)}
                    />
                ),
                dataIndex: 'pgp_email',
                className: '',
                children: [
                    {
                        title: DEVICE_PGP_EMAIL,
                        align: "center",
                        dataIndex: 'pgp_email',
                        className: '',
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
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_CHAT_ID)}
                    />
                ),
                dataIndex: 'chat_id',
                className: '',
                children: [
                    {
                        title: DEVICE_CHAT_ID,
                        align: "center",
                        dataIndex: 'chat_id',
                        key: 'chat_id',
                        className: '',
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
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_SIM_ID)}
                    />
                ),
                dataIndex: 'sim_id',
                className: '',
                children: [
                    {
                        title: DEVICE_SIM_ID,
                        align: "center",
                        dataIndex: 'sim_id',
                        key: 'sim_id',
                        className: '',
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
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_IMEI_1)}
                        onKeyUp={this.handleSearch}
                    />
                ),
                dataIndex: 'imei_1',
                className: '',
                children: [
                    {
                        title: DEVICE_IMEI_1,
                        align: "center",
                        className: '',
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
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_IMEI_2)}
                        onKeyUp={this.handleSearch}
                    />
                ),
                dataIndex: 'imei_2',
                className: '',
                children: [
                    {
                        title: DEVICE_IMEI_2,
                        align: "center",
                        dataIndex: 'imei_2',
                        key: 'imei_2',
                        className: '',
                        sorter: (a, b) => { return a.imei_2.localeCompare(b.imei_2) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
        ]
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.user_id !== nextProps.record.user_id) {
            this.setState({
                devicesList: this.props.record.devicesList,
            })
        } else if (this.props.record.devicesList.length !== nextProps.record.devicesList.length) {
            this.setState({
                devicesList: this.props.record.devicesList,
            })
        }
    }
    searchField = (originalData, fieldName, value) => {
        let demoData = [];

        if (value.length) {
            originalData.forEach((data) => {
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] != null) {
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
            originalData.forEach((data) => {
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
            coppyDevices.forEach((device) => {
                // console.log("device", device);

                if (device[e.target.name] !== undefined) {
                    if ((typeof device[e.target.name]) === 'string') {
                        // console.log("lsdjfls", device[e.target.name])
                        if (device[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDevices.push(device);
                        }
                    } else if (device[e.target.name] != null) {
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
        return list.map((device, index) => {
            var status = device.finalStatus;
            const button_type = (status === DEVICE_ACTIVATED || status === DEVICE_TRIAL) ? "danger" : "dashed";
            let color = getColor(status);
            var style = { margin: '0', width: '60px' }
            var text = "EDIT";
            if ((status === DEVICE_PENDING_ACTIVATION) || (status === DEVICE_UNLINKED)) {
                style = { margin: '0 8px 0 0', width: '60px', display: 'none' }
                text = "Activate";
            }
            let ConnectBtn = <Button type="default" size="small" style={style}><Link to={`connect-device/${btoa(device.device_id)}`.trim()}> CONNECT</Link></Button>
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
                device_id: ((status != DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : "N/A",
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
        // console.log('dealer state', this.state.pagination);
        return (
            <Fragment>
                <Card>
                    <Row>
                        <Col span={6}>
                            <div style={{ display: "none" }}>Dummy</div>
                        </Col>
                        <Col span={6}>
                            <div style={{ display: "none" }}>Dummy</div>
                        </Col>
                        <Col span={6}>
                            <div className="search_heading">
                                <Search
                                    placeholder='Search Device'
                                    onChange={e => this.handleComponentSearch(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="pagination1">
                                <Select
                                    value={this.state.pagination}
                                    //  defaultValue={this.state.DisplayPages}
                                    style={{ width: '100%' }}
                                    // onSelect={value => this.setState({DisplayPages:value})}
                                    onChange={value => this.handlePagination(value)}
                                >
                                    <Select.Option value="10" >10</Select.Option>
                                    <Select.Option value="20">20</Select.Option>
                                    <Select.Option value="30">30</Select.Option>
                                    <Select.Option value="50">50</Select.Option>
                                    <Select.Option value="100">100</Select.Option>
                                </Select>
                            </div>
                        </Col>
                    </Row>


                    <Table
                        columns={this.listdeviceCols}
                        dataSource={this.renderDevices(this.state.devicesList)}

                        pagination={{ pageSize: Number(this.state.pagination), size: "midddle" }}
                    />
                </Card>
            </Fragment >
        )
    }
}
export default UserDeviceList