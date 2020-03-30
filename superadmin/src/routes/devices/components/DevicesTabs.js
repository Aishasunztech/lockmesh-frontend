import React, { Component, Fragment } from 'react'
import { Table, Button, Card, Tag, Form, Input, Popconfirm, Empty, Icon, Tabs, Modal } from "antd";

import DevicesList from "./DevicesList";


export default class DevicesTabs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            devices: this.props.devices,
            tabselect: this.props.tabselect,
            selectedOptions: this.props.selectedOptions,
        }
    }

    callback = (key) => {
        console.log('at calback fun key is: ', key);
        if(key == '1SK' || key == '4SK' || key == '5SK' || key == '6SK' || key == '7SK') {
            this.props.handleChangetab(key);
        } else {
            this.props.handleChangeLabelTab(key);            
        }
    }

    deleteAllUnlinkedDevice = (type) => {
        this.refs.devciesList.deleteAllUnlinkedDevice(type)
    }
    deleteAllPreActivedDevice = (type) => {

        this.refs.devciesList.deleteAllUnlinkedDevice(type)
    }

    handlePagination = (value) => {
        this.refs.devciesList.handlePagination(value);
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {

            this.setState({
                devices: this.props.devices,
                columns: this.props.columns,
                tabselect: this.props.tabselect,
                selectedOptions: this.props.selectedOptions
            })
            // this.refs.devciesList.handlePagination(this.state.tabselect);
        }
    }

    render() {
        return (
            <Fragment>
                <Tabs type='card' className="dev_tabs" activeKey={this.state.tabselect} onChange={this.callback}>
                    <Tabs.TabPane tab={<span>All ({this.props.totalAllDevices})</span>} key="1SK" />
                    <Tabs.TabPane tab={<span className="green">Active ({this.props.totalActiveDevices})</span>} key="4SK" forceRender={true} />
                    <Tabs.TabPane tab={<span className="red">Expired ({this.props.totalExpireDevices})</span>} key="6SK" forceRender={true} />
                    <Tabs.TabPane tab={<span className="yellow">Suspended ({this.props.totalSuspendDevices})</span>} key="7SK" forceRender={true} />
                    <Tabs.TabPane tab={<span className="orange">Archived ({this.props.totalArchiveDevices})</span>} key="5SK" forceRender={true} />
                    {this.props.whiteLables.map((item, index) => {
                        // console.log(item);
                        return (
                            <Tabs.TabPane tab={item.name} key={item.id.toString()} forceRender={true} />
                        )
                    })}
                </Tabs>
                
                <DevicesList
                    devices={this.state.devices}
                    suspendDevice={this.props.suspendDevice}
                    activateDevice={this.props.activateDevice}
                    statusDevice={this.props.statusDevice}
                    columns={this.props.columns}
                    rejectDevice={this.props.rejectDevice}
                    selectedOptions={this.state.selectedOptions}
                    ref="devciesList"
                    pagination={this.props.pagination}
                    editDevice={this.props.editDevice}
                    tabselect={this.state.tabselect}
                    deleteUnlinkDevice={this.props.deleteUnlinkDevice}
                    resetTabSelected={this.resetTabSelected}
                    user={this.props.user}
                    history={this.props.history}
                    showDateModal={this.props.showDateModal}
                />
            </Fragment>
        )
    }
}