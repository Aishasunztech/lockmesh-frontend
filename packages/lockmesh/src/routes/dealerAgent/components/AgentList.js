import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Table, Button, Card, Tabs, Modal, Icon, Tag, Form, Input, Popconfirm, Empty, Switch } from "antd";


import CustomScrollbars from "../../../util/CustomScrollbars";

import {
    // getStatus, 
    getColor,
    checkValue,
    getSortOrder,
    // checkRemainDays, 
    convertToLang,
    convertTimezoneValue,
    checkIsArray
} from '../../utils/commonUtils'
import { Button_Yes, Button_No } from '../../../constants/ButtonConstants';
import { DEALER, ADMIN } from '../../../constants/Constants';
import { TIMESTAMP_FORMAT } from '../../../constants/Application';



const confirm = Modal.confirm;

export default class DevicesList extends Component {


    // componentDidUpdate(prevProps) {

    // }

    // renderList
    renderList() {

        return this.props.dealerAgents.map((agent, index) => {

            return {
                rowKey: index,
                key: agent.id,
                action: (<Fragment>
                    <Button
                        size="small"
                        className="mb-0"
                        // disabled
                        type="primary"
                        onClick={(e) => this.props.showEditModal(true, agent)}
                    >
                        {convertToLang(this.props.translation['EDIT'], "EDIT")}
                    </Button>
                    <Button
                        size="small"
                        className="mb-0"
                        type="danger"
                        onClick={(e) => this.props.handleDeleteAgent(agent.id)}
                    >
                        {convertToLang(this.props.translation['DELETE'], "DELETE")}
                    </Button>
                    <Button
                        size="small"
                        className="mb-0"
                        type="dashed"
                        disabled
                    >
                        {convertToLang(this.props.translation['LOGS'], "LOGS")}
                    </Button>
                    <Button
                        size="small"
                        className="mb-0"
                        type="ghost"
                        onClick={(e) => this.props.handleResetPwd(agent.id)}
                    >
                        {convertToLang(this.props.translation['PASS RESET'], "PASS RESET")}
                    </Button>
                </Fragment>),
                name: checkValue(agent.name),
                staff_id: checkValue(agent.staff_id),
                type: checkValue(agent.type),
                status: (
                    <Switch
                        onChange={(e) => this.props.agentStatusHandler(e, agent)}
                        defaultChecked={(agent.status === 1) ? true : false}
                        size={'small'}
                    />
                ),
                email: checkValue(agent.email),
                created_at: convertTimezoneValue(this.props.user.timezone, agent.created_at),
                // created_at: checkValue(agent.created_at),
            }
        });
    }


    confirmDelete = (action, devices, title) => {

        // console.log(action);
        // console.log(devices);
        this.confirm({
            title: title,
            content: '',
            okText: convertToLang(this.props.translation[Button_Yes], 'Yes'),
            cancelText: convertToLang(this.props.translation[Button_No], 'No'),
            onOk: (() => {

                // this.props.deleteUnlinkDevice(action, devices);
                //    this.props.resetTabSelected()
                // this.props.refreshComponent();
                // console.log('this.refs.tablelist.props.rowSelection', this.refs.tablelist.props.rowSelection)

                // this.resetSelectedRows();
                // if (this.refs.tablelist.props.rowSelection !== null) {
                //     this.refs.tablelist.props.rowSelection.selectedRowKeys = []
                // }
            }),
            onCancel() { },
        });
    }


    handlePagination = (value) => {
        // alert('sub child');
        // console.log(value)
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    resetSelectedRows = () => {
        // console.log('table ref', this.refs.tablelist)
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
    }

    onExpandRow = (expanded, record) => {
        // console.log(expanded, 'data is expanded', record);
        if (expanded) {
            if (!this.state.expandedRowKeys.includes(record.key)) {
                this.state.expandedRowKeys.push(record.key);
                this.setState({ expandedRowKeys: this.state.expandedRowKeys })
            }
        } else if (!expanded) {
            if (this.state.expandedRowKeys.includes(record.key)) {
                let list = checkIsArray(this.state.expandedRowKeys).filter(item => item !== record.key)
                this.setState({ expandedRowKeys: list })
            }
        }
    }

    render() {
        let type = this.props.user.type
        let styleType = "";
        if (type === ADMIN) {
            styleType = "agents_fix_card_admin"
        } else {
            styleType = "agents_fix_card_dealer"
        }
        return (
            <div className="">
                <Card className={`fix_card agents_fix_card ${styleType}`}>
                    <hr className="fix_header_border" style={{ top: "56px" }} />
                    <CustomScrollbars className="gx-popover-scroll ">
                        <Table
                            style={{
                                // whiteSpace: 'nowrap'
                                // scrollMargin:"100px"
                                // scrollMarginLeft: "1000px"
                            }}

                            id='scrolltablelist'
                            ref='tablelist'
                            className={"devices"}
                            // rowSelection={rowSelection}
                            // rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''}

                            size="middle"
                            bordered
                            columns={this.props.columns}
                            onChange={this.props.onChangeTableSorting}
                            dataSource={this.renderList()}
                            pagination={
                                false
                                // pageSize: Number(this.state.pagination),
                                //size: "midddle",
                            }
                        // useFixedHeader={true}
                        // onExpand={this.onExpandRow}
                        // expandIcon={(props) => this.customExpandIcon(props)}
                        />

                    </CustomScrollbars>
                </Card>

            </div>

        )
    }
}