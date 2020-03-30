import React, { Component, Fragment } from 'react'
import { Table, Divider, Badge, } from "antd";
import { APPLICATION_PERMISION, SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, MANAGE_PASSWORDS } from '../../../constants/Constants';

// import AppList from "./AppList";

export default class TableHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appColumns: [],
            applist: [],
            extensions: [],
            controls: {}
        }

        this.appsColumns = [
            {
                title: 'APP NAME',
                dataIndex: 'label',
                key: '1',
                render: text => <a href="javascript:;" style={{ fontSize: 12 }}>{text}</a>,
            }, {
                title: 'GUEST',
                dataIndex: 'guest',
                key: '2',
            }, {
                title: 'ENCRYPTED',
                dataIndex: 'encrypted',
                key: '3',
            }, {
                title: 'ENABLE',
                dataIndex: 'enable',
                key: '4',
            }
        ];
        this.extensionColumns = [
            {
                title: 'Extension NAME',
                dataIndex: 'label',
                key: '1',
                render: text => <a href="javascript:;" style={{ fontSize: 12 }}> {text}</ a>,
            }, {
                title: 'GUEST',
                dataIndex: 'guest',
                key: '2',
            }, {
                title: 'ENCRYPTED',
                dataIndex: 'encrypted',
                key: '3',
            }
        ];
        this.controlColumns = [
            {
                title: 'PERMISSION NAME',
                dataIndex: 'label',
                key: '1',
                render: text => <a href="javascript:;" style={{ fontSize: 12 }}>{text}</a>,
            }, {
                title: 'STATUS',
                dataIndex: 'status',
                key: '2',
            }
        ];
    }

    cotrolsValues = () => {
        console.log(this.state.controls);
        if (Object.entries(this.state.controls).length > 0 && this.state.controls.constructor === Object) {
            return (
                [
                    {
                        label: 'Wifi',
                        status: this.state.controls.controls.wifi_status ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    },
                    {
                        label: 'Bluetooth',
                        status: this.state.controls.controls.bluetooth_status ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    },
                    {
                        label: 'Hotspot',
                        status: this.state.controls.controls.hotspot_status ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    },
                    {
                        label: 'Screenshots',
                        status: this.state.controls.controls.screenshot_status ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    },
                    {
                        label: 'Block Calls',
                        status: this.state.controls.controls.call_status ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    }
                ]

            )
        }

    }

    filterAppList = () => {
        let data = this.props.app_list;
        let applist = [];
        if (this.props.show_all_apps) {
            this.setState({ applist: data })
        } else {
            for (let obj of data) {
                if (obj.isChanged !== undefined && obj.isChanged === true) {
                    // if(applist.includes(obj)){

                    // }else{
                    applist.push(obj);

                    // }
                }
            }
            this.setState({ applist: applist })
        }

    }



    filterExtensions = () => {
        let data = this.props.extensions;
        let extensions = [];
        if (this.props.show_all_apps) {
            this.setState({ extensions: data })
        } else {
            if (data.length) {
                for (let obj of data) {
                    if (obj.uniqueName == this.props.extensionUniqueName) {
                        for (let item of obj.subExtension) {
                            if (item.isChanged !== undefined && item.isChanged === true) {
                                extensions.push(item);
                            }
                        }
                    }
                }
                this.setState({ extensions: extensions })
            }
        }

    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                controls: this.props.controls
            })
            this.filterAppList()
            this.filterExtensions()
        }
    }

    componentDidMount() {
        this.setState({ controls: this.props.controls })
        this.filterAppList();
        this.filterExtensions();
    }

    renderData = (datalist) => {

        if (datalist.length > 0) {
            return (
                datalist.map((item, index) => {
                    return {
                        key: item.app_id,
                        label: item.label,
                        guest: (item.guest == 1 || item.guest === true) ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>,
                        encrypted: (item.encrypted == 1 || item.encrypted) === true ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>,
                        enable: (item.enable == 1 || item.enable === true) ? <span style={{ color: "green", fontSize: 13, fontWeight: "500" }}>ON</span> : <span style={{ color: "red", fontSize: 13, fontWeight: "500" }}>OFF</span>
                    }
                })
            )
        }
    }

    render() {
        // console.log(this.props.extensions, 'data li s t of exte')
        return (
            <div>
                {/* {
                    this.state.applist.length ? */}

                <div>
                    <Divider >{APPLICATION_PERMISION} </Divider>
                    <Table
                        style={{ margin: 0, padding: 0 }}
                        size='default'
                        bordered={false}
                        columns={this.appsColumns}
                        align='center'
                        dataSource={this.renderData(this.state.applist)}
                        pagination={false}

                    />
                </div>
                {/* : false}
                 { */}
                {/* this.state.extensions.length ? */}
                <div>
                    <Divider> {SECURE_SETTING_PERMISSION}</Divider>

                    <Table
                        style={{ margin: 0, padding: 0 }}
                        size='default'
                        bordered={false}
                        columns={this.extensionColumns}
                        align='center'
                        dataSource={this.renderData(this.state.extensions)}
                        pagination={false}

                    /></div>
                {/* : false} */}

                <div>
                    <Divider> {SYSTEM_PERMISSION}</Divider>

                    <Table
                        style={{ margin: 0, padding: 0 }}
                        size='default'
                        bordered={false}
                        columns={this.controlColumns}
                        align='center'
                        dataSource={this.cotrolsValues()}
                        pagination={false}

                    />

                </div>

                <Divider> {MANAGE_PASSWORDS} </Divider>
                {
                    this.props.isAdminPwd ? <div> <Badge status="success" text='Admin Password is changed' /> </div> : false
                }{
                    this.props.isEncryptedPwd ? <div><Badge status="error" text='Encrypted Password is changed' /> </div> : false
                }{
                    this.props.isGuestPwd ? <div><Badge status="processing" text='Guest Password is changed' /></div> : false
                }{
                    this.props.isDuressPwd ? <div><Badge status="warning" text='Duress Password is changed' /></div> : false
                }

            </div>
        )
    }
}
