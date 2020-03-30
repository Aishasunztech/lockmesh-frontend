import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Modal, message, Input, Table, Switch, Avatar, Button, Card, Row, Col, Select, Spin, Form } from 'antd';
import { componentSearch, getFormattedDate, convertToLang, checkValue, checkIsArray } from '../../utils/commonUtils';
import moment from 'moment';
import {
    getDeviceBillingHistory
} from "../../../appRedux/actions/ConnectDevice";

class DeviceBillingDetails extends Component {

    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "#",
                dataIndex: 'count',
                key: 'count',
                align: "center",
                render: (text, record, index) => ++index,
                // sorter: (a, b) => { return a.count - b.count },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(props.translation[''], "TYPE"),
                align: "center",
                className: '',
                dataIndex: 'type',
                key: 'type',
                sorter: (a, b) => { return a.type.localeCompare(b.type) },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(props.translation[''], "TRANSACTION TYPE"),
                align: "center",
                className: '',
                dataIndex: 'transection_type',
                key: 'transection_type',
                sorter: (a, b) => { return a.transection_type.localeCompare(b.transection_type) },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: (
                    <span>{convertToLang(props.translation[''], "CREDITS")}</span>
                ),
                align: 'center',
                dataIndex: 'credits',
                key: 'credits',
                className: 'row ',
                sorter: (a, b) => { return a.credits - b.credits },
                sortDirections: ['ascend', 'descend'],
            },

            {
                title: (
                    <span>{convertToLang(props.translation[''], "STATUS")}</span>
                ),
                align: 'center',
                dataIndex: 'status',
                key: 'status',
                className: 'row ',
                sorter: (a, b) => { return a.status.localeCompare(b.status) },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(props.translation[''], "TRANSACTION DATE"),
                align: "center",
                className: '',
                dataIndex: 'created_at',
                key: 'created_at',
                sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
                sortDirections: ['ascend', 'descend'],
            },
        ];

        this.state = {
            billingHistoryList: props.billingHistoryList,
            columns: this.columns,
        }
    }


    componentWillReceiveProps(nextProps) {
    }

    handleCancel = () => {
        this.setState({ visible: false });
        this.props.handleServicesModal(false)
    }
    renderList = () => {
        let data = this.props.device_billing_history // console.log
        // if (data && data.length) {
            return checkIsArray(data).map((row, index) => {
                // console.log(row);

                // if (row.type === "PACKAGE") {
                return {
                    key: index,
                    count: index,
                    type: checkValue(row.type),
                    transection_type: checkValue(row.transection_type),
                    credits: checkValue(row.credits),
                    status: checkValue(row.status),
                    created_at: checkValue(moment(row.created_at).format("YYYY/MM/DD")),
                }
                // }
                // else if (row.type === "PRODUCT") {
                //     return {
                //         key: index,
                //         type: checkValue(row.type),
                //         name: checkValue(row.price_for),
                //         term: checkValue(row.price_term),
                //         start_date: checkValue(moment(row.start_date).format("YYYY/MM/DD")),
                //         expiry_date: checkValue(moment(row.service_expiry_date).format("YYYY/MM/DD")),
                //     }
                // }

            })
        // } else {
        //     return []
        // }
    }


    render() {
        return (
            <div>
                <h2 style={{ textAlign: 'center' }}>BILLING DETAILS</h2>
                <Table
                    columns={this.state.columns}
                    bordered
                    dataSource={this.renderList()}
                    pagination={false}
                />
            </div>
        )
    }
}

const WrappedUserList = Form.create()(DeviceBillingDetails);

export default WrappedUserList;
