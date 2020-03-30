// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select } from "antd";

// Components
// import EditDealer from '../../dealers/components/editDealer';

// Helpers
import { convertToLang, formatMoney, removeColumns, checkIsArray } from '../../utils/commonUtils'

export default class DealerOverDuePayments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dealer_id: null,
            paymentHistory: [],
            paymentHistoryColumns: [
                {
                    title: "Transaction #",
                    dataIndex: 'transaction_no',
                    align: "center",
                    key: 'transaction_no',
                },

                {
                    title: convertToLang(props.translation[''], "TRANSACTION DATE"),
                    align: "center",
                    dataIndex: 'created_at',
                    key: 'created_at',
                },

                {
                    title: convertToLang(props.translation[''], "DUE CREDITS (USD)"),
                    align: "center",
                    dataIndex: 'due_credits',
                    key: 'due_credits',
                },

                {
                    title: convertToLang(props.translation[''], "PAID CREDITS"),
                    align: "center",
                    dataIndex: 'paid_credits',
                    key: 'paid_credits',
                },
                {
                    title: convertToLang(props.translation[''], "TOTAL CREDITS"),
                    align: "center",
                    dataIndex: 'total_credits',
                    key: 'total_credits',
                }
            ]

        }

    }

    showModal = (dealer, paymentHistory) => {
        let { paymentHistoryColumns } = this.state;


        this.setState({
            visible: true,
            dealer_id: dealer.dealer_id,
            // paymentHistoryColumns: paymentHistoryColumns,
            paymentHistory: paymentHistory
        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    renderPaymentHistoryList = (list) => {

        // if (list) {
            return checkIsArray(list).map((item, index) => {
                return {
                    rowKey: item.id,
                    key: ++index,
                    transaction_no: item.id,
                    created_at: item.created_at,
                    payment_method: item.transection_type,
                    due_credits: "$ " + formatMoney(item.due_credits),
                    paid_credits: "$ " + formatMoney(item.paid_credits),
                    total_credits: "$ " + formatMoney(item.credits),
                }
            })
        // }
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
                    footer={[
                        <Button
                            key="back"
                            onClick={this.handleCancel}
                        >
                            Close
                        </Button>,

                    ]}
                >
                    <Table
                        className="pay_history"
                        columns={this.state.paymentHistoryColumns}
                        dataSource={this.renderPaymentHistoryList(this.state.paymentHistory)}
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
