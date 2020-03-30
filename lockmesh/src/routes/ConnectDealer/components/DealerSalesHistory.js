// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select } from "antd";

// Components
// import EditDealer from '../../dealers/components/editDealer';

// Helpers
import { convertToLang, formatMoney, getDateFromTimestamp, checkIsArray } from '../../utils/commonUtils'
import { DEVICE_PRE_ACTIVATION } from "../../../constants/Constants";

export default class DealerSalesHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dealer_id: null,
            salesHistory: []
        }
        this.dealerSalesColumns = [
            {
                title: '#',
                dataIndex: 'count',
                align: 'center',
                className: 'row',
                width: 50,
                sorter: (a, b) => { return a.count - b.count },
                sortDirections: ['ascend', 'descend'],
            },

            {
                title: convertToLang(props.translation[''], "DEVICE ID"),
                align: "center",
                className: '',
                dataIndex: 'device_id',
                key: 'device_id',
                sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
                sortDirections: ['ascend', 'descend'],
            },

            {
                title: convertToLang(props.translation[''], "DEALER ID"),
                align: "center",
                className: '',
                dataIndex: 'dealer_pin',
                key: 'dealer_pin',
                sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
                sortDirections: ['ascend', 'descend'],
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
                title: convertToLang(props.translation[''], "NAME"),
                align: "center",
                className: '',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => { return a.name.localeCompare(b.name) },
                sortDirections: ['ascend', 'descend'],
            },

            {
                title: convertToLang(props.translation[''], "COST PRICE (CREDITS)"),
                align: "center",
                className: '',
                dataIndex: 'cost_price',
                key: 'cost_price',
                sorter: (a, b) => { return a.cost_price - b.cost_price },
                sortDirections: ['ascend', 'descend'],
            },

            {
                title: convertToLang(props.translation[''], "SALE PRICE (CREDITS)"),
                align: "center",
                className: '',
                dataIndex: 'sale_price',
                key: 'sale_price',
                sorter: (a, b) => { return a.sale_price - b.sale_price },
                sortDirections: ['ascend', 'descend'],
            },

            {
                title: convertToLang(props.translation[''], "PROFIT/LOSS (CREDITS)"),
                align: "center",
                className: '',
                dataIndex: 'profit_loss',
                key: 'profit_loss',
                sorter: (a, b) => { return a.profit_loss - b.profit_loss },
                sortDirections: ['ascend', 'descend'],
            },

            {
                title: convertToLang(props.translation[''], "CREATED AT"),
                align: "center",
                className: '',
                dataIndex: 'created_at',
                key: 'created_at',
                sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: 'descend'
            },

        ];
    }

    showModal = (dealer, callback) => {
        this.setState({
            visible: true,
            dealer_id: dealer.dealer_id,
        });
        callback(dealer.dealer_id)
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.salesHistory.length !== nextProps.salesHistory.length) {
            this.setState({
                salesHistory: nextProps.salesHistory
            })
        }
    }
    renderSalesHistoryList = (list) => {

        let data = [];
        if (list) {
            checkIsArray(list).map((item, index) => {
                data.push({
                    key: index,
                    count: ++index,
                    device_id: item.device_id ? item.device_id : DEVICE_PRE_ACTIVATION,
                    dealer_pin: item.dealer_pin ? item.dealer_pin : 'N/A',
                    type: item.type ? item.type : 'N/A',
                    name: item.name ? item.name : 'N/A',
                    cost_price: item.cost_price ? item.cost_price : 0,
                    sale_price: item.sale_price ? item.sale_price : 0,
                    profit_loss: item.profit_loss ? item.profit_loss : 0,
                    created_at: item.created_at ? getDateFromTimestamp(item.created_at) : 'N/A',
                })
            });
        }
        return data;
    };
    render() {
        const { visible } = this.state;
        return (
            <Fragment>
                <Modal
                    visible={visible}
                    title={""}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    // width="200"
                    width= {"70%"}
                    footer={[
                        <Button
                            key="back"
                            onClick={this.handleCancel}
                        >
                            Close
                            {/* {convertToLang(this.props.translation[Button_Cancel], "Cancel")} */}
                        </Button>,
                        // <Button
                        //     key="submit"
                        //     type="primary"
                        //     onClick={this.handleSubmit}
                        // >
                        //     {convertToLang(this.props.translation[Button_submit], "Submit")}
                        // </Button>,
                    ]}
                >
                    <Table
                        className="pay_history"
                        columns={this.dealerSalesColumns}
                        dataSource={this.renderSalesHistoryList(this.state.salesHistory)}
                        bordered
                        title={this.pay_history_title}
                        pagination={false}
                        scroll={{ x: true }}
                    />
                </Modal>
            </Fragment >
        )
    }

}
