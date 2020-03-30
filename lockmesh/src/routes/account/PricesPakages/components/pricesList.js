import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button, Select, Table
} from "antd";
import styles from '../pricesPakages.css';
import RestService from '../../../../appRedux/services/RestServices';
import {
    PRICE_TERM,
    UNIT_PRICE,
} from "../../../../constants/AccountConstants";

import { one_month, three_month, six_month, twelve_month, sim, chat, pgp, vpn } from '../../../../constants/Constants';
import { convertToLang } from '../../../utils/commonUtils';

class PriceList extends Component {
    constructor(props) {
        super(props)
        this.columns = [
            {
                dataIndex: 'price_term',
                className: '',
                title: convertToLang(this.props.translation[PRICE_TERM], "PRICE TERM"),
                align: "center",
                key: 'price_term',
                sorter: (a, b) => { return a.price_term.localeCompare(b.price_term) },

                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[UNIT_PRICE], "UNIT PRICE"),
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
                price_term: convertToLang(this.props.translation[one_month], "1 month"),
                unit_price: this.props.data ? this.props.data['1 month'] ? this.props.data['1 month'] : 0 : 0
            },
            {
                key: '2',
                price_term: convertToLang(this.props.translation[three_month], "3 month"),
                unit_price: this.props.data ? this.props.data['3 month'] ? this.props.data['3 month'] : 0 : 0
            },
            {
                key: '3',
                price_term: convertToLang(this.props.translation[six_month], "6 month"),
                unit_price: this.props.data ? this.props.data['6 month'] ? this.props.data['6 month'] : 0 : 0
            },
            {
                key: '4',
                price_term: convertToLang(this.props.translation[twelve_month], "12 month"),
                unit_price: this.props.data ? this.props.data['12 month'] ? this.props.data['12 month'] : 0 : 0
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