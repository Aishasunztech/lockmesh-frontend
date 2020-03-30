import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button, Select, Table
} from "antd";
import styles from '../../../whitelabels.css';
import RestService from '../../../../../appRedux/services/RestServices';
import { one_month, three_month, six_month, twelve_month, sim, chat, pgp, vpn } from '../../../../../constants/Constants';

class PriceList extends Component {
    constructor(props) {
        super(props)
        this.columns = [
            {

                dataIndex: 'price_term',
                className: '',
                title: 'PRICE TERM',
                align: "center",
                key: 'price_term',
                sorter: (a, b) => { return a.price_term.localeCompare(b.price_term) },

                sortDirections: ['ascend', 'descend'],

            },
            {
                title: 'UNIT PRICE',
                dataIndex: 'unit_price',
                className: '',
                align: "center",
                className: '',
                key: 'unit_price',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.unit_price - b.unit_price },

                sortDirections: ['ascend', 'descend'],
            }
        ];
        this.state = {
            pkgPrice: 0,
            sim: false,
            chat: false,
            pgp: false,
            vpn: false
        }
    }


    render() {
        // console.log(this.props.data, 'price list props',  this.props.tabSelected)

        const data = [
            {
                key: '1',
                price_term: one_month,
                unit_price: this.props.data ? this.props.data[one_month] ? this.props.data[one_month] : 0 : 0
            },
            {
                key: '2',
                price_term: three_month,
                unit_price: this.props.data ? this.props.data[three_month] ? this.props.data[three_month] : 0 : 0
            },
            {
                key: '3',
                price_term: six_month,
                unit_price: this.props.data ? this.props.data[six_month] ? this.props.data[six_month] : 0 : 0
            },
            {
                key: '4',
                price_term: twelve_month,
                unit_price: this.props.data ? this.props.data[twelve_month] ? this.props.data[twelve_month] : 0 : 0
            },
        ];

        return (
            <Table
                columns={this.columns}
                dataSource={data}
                bordered
                pagination={false}

            />
        )
    }
}


export default PriceList;