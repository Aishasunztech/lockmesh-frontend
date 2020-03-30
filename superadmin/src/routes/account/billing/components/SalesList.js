import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs } from "antd";
import { checkValue } from '../../../utils/commonUtils';
import styles from '../billing.css'
import { ADMIN } from '../../../../constants/Constants';

// import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

let data = [];
const confirm = Modal.confirm;
export default class SalesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            columns: [],
            pagination: 10,
            tabselect: '1'
        };
        this.renderList = this.renderList.bind(this);
    }

    handlePagination = (value) => {
        // console.log(value)
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {
            this.setState({
                columns: this.props.columns
            })
        }
    }

    renderList(list) {
        data = [];
        list.map((item, index) => {
            // console.log(item);
            data.push({
                'row_key': `${index}Key`,
                'count': ++index,
                'action': <Button type='primary' size="small">OPEN</Button>,
                'label': checkValue(item.label),
                'name': checkValue(item.dealer_name),
                'account_type': checkValue(item.account_type),
                'dealer_pin': (item.dealer_name === ADMIN) ? "N/A" : checkValue(item.dealer_pin),
                'credits_purchased': checkValue(item.credits),
                'inv_no': checkValue(item.inv_no),
                'status': checkValue(item.status),
                'order_date': checkValue(item.order_date),
                'paid_date': checkValue(item.paid_date),
                'pay_type': checkValue(item.pay_type),
                'accepted_by': checkValue(item.accepted_by),
            })
        });
        return (data);
    }
    render() {
        return (
            <div>
                {/* <Tabs defaultActiveKey="1" type='card' className="dev_tabs" activeKey={this.state.tabselect} onChange={this.handleChangeTab}>
                    <TabPane tab="PRODUCT SALES" key="1" />
                    <TabPane tab="HARDWARE SALES" key="2" />
                    <TabPane tab="PACKAGE SALES" key="3" />
                </Tabs> */}
                <Table
                    size="middle"
                    className='devices'
                    bordered
                    scroll={{ x: 300 }}
                    columns={this.state.columns}
                    rowKey='row_key'
                    align='center'
                    pagination={{ pageSize: this.state.pagination, size: "midddle" }}
                    dataSource={this.renderList(this.props.salesList)}
                />
            </div>
        )
    }
}
