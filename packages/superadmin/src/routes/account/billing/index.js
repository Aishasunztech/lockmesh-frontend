
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Button, Row, Col, Select, Input, Checkbox, Icon, Tabs, Table, InputNumber, Form } from "antd";
// import {getDevicesList} from '../../appRedux/actions/Devices';
// import EditDealer from './components/editDealer';
import CircularProgress from "components/CircularProgress/index";
import SalesList from "./components/SalesList";
import Reports from "./components/Reports";
import styles from './billing.css'
import {
    getSalesList,
    getDealerList
} from '../../../appRedux/actions/';
import { Redirect } from 'react-router-dom';

import { componentSearch, getDealerStatus, titleCase } from '../../utils/commonUtils';

import {
    LABEL,
    LABEL_DATA_SIM_ID,
    LABEL_DATA_CREATED_AT,
} from '../../../constants/LabelConstants';
import { DEALER_PIN } from "../../../constants/DealerConstants";
import { ACTION, NAME, ACCOUNT_TYPE, CREDITS_PURCHASED, INV_NO, STATUS, ORDER_DATE, PAID_DATE, PAY_TYPE, ACCEPTED_BY } from "../../../constants/BillingConstants";

const TabPane = Tabs.TabPane;

var copyInnerContent = [];
var status = true;
class Billing extends Component {

    constructor(props) {
        super(props);

        const salesColumns = [
            {
                title: '#',
                dataIndex: 'count',
                align: 'center',
                className: 'row',
                width: 50,
            },
            {
                title: ACTION,
                dataIndex: 'action',
                align: 'center',
                className: 'row',
                width: 100,
            },
            {
                title: (
                    <Input.Search
                        name="name"
                        key="name"
                        id="name"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(NAME)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'name',
                className: '',
                children: [
                    {
                        title: NAME,
                        dataIndex: 'name',
                        key: 'name',
                        align: 'center',
                        sorter: (a, b) => { return a.name.localeCompare(b.name) },
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="dealer_pin"
                        key="dealer_pin"
                        id="dealer_pin"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(DEALER_PIN)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'dealer_pin',
                className: '',
                children: [
                    {
                        title: DEALER_PIN,
                        dataIndex: 'dealer_pin',
                        key: 'dealer_pin',
                        align: 'center',
                        sorter: (a, b) => a.dealer_pin - b.dealer_pin,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="account_type"
                        key="account_type"
                        id="account_type"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(ACCOUNT_TYPE)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'account_type',
                className: '',
                children: [
                    {
                        title: ACCOUNT_TYPE,
                        dataIndex: 'account_type',
                        key: 'account_type',
                        align: 'center',
                        sorter: (a, b) => { return a.account_type.localeCompare(b.account_type) },
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="label"
                        key="label"
                        id="label"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(LABEL)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'label',
                className: '',
                children: [
                    {
                        title: LABEL,
                        dataIndex: 'label',
                        key: 'label',
                        align: 'center',
                        sorter: (a, b) => { return a.label.localeCompare(b.label) },
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="credits_purchased"
                        key="credits_purchased"
                        id="credits_purchased"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(CREDITS_PURCHASED)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'credits_purchased',
                className: '',
                children: [
                    {
                        title: CREDITS_PURCHASED,
                        dataIndex: 'credits_purchased',
                        key: 'credits_purchased',
                        align: 'center',
                        sorter: (a, b) => a.credits_purchased - b.credits_purchased,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="inv_no"
                        key="inv_no"
                        id="inv_no"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(INV_NO)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'inv_no',
                className: '',
                children: [
                    {
                        title: INV_NO,
                        dataIndex: 'inv_no',
                        key: 'inv_no',
                        align: 'center',
                        sorter: (a, b) => { return a.inv_no.localeCompare(b.inv_no) },
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="status"
                        key="status"
                        id="status"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(STATUS)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'status',
                className: '',
                children: [
                    {
                        title: STATUS,
                        dataIndex: 'status',
                        key: 'status',
                        align: 'center',
                        sorter: (a, b) => { return a.status.localeCompare(b.status) },
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="order_date"
                        key="order_date"
                        id="order_date"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(ORDER_DATE)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'order_date',
                className: '',
                children: [
                    {
                        title: ORDER_DATE,
                        dataIndex: 'order_date',
                        key: 'order_date',
                        align: 'center',
                        sorter: (a, b) => a.order_date - b.order_date,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="paid_date"
                        key="paid_date"
                        id="paid_date"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(PAID_DATE)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'paid_date',
                className: '',
                children: [
                    {
                        title: PAID_DATE,
                        dataIndex: 'paid_date',
                        key: 'paid_date',
                        align: 'center',
                        sorter: (a, b) => a.paid_date - b.paid_date,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="pay_type"
                        key="pay_type"
                        id="pay_type"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(PAY_TYPE)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'pay_type',
                className: '',
                children: [
                    {
                        title: PAY_TYPE,
                        dataIndex: 'pay_type',
                        key: 'pay_type',
                        align: 'center',
                        sorter: (a, b) => a.pay_type - b.pay_type,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="accepted_by"
                        key="accepted_by"
                        id="accepted_by"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(ACCEPTED_BY)}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'accepted_by',
                className: '',
                children: [
                    {
                        title: ACCEPTED_BY,
                        dataIndex: 'accepted_by',
                        key: 'accepted_by',
                        align: 'center',
                        sorter: (a, b) => a.accepted_by - b.accepted_by,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
        ]

        this.state = {
            loading: false,
            visible: false,
            pagination: 10,
            tabselect: '1',
            innerTabSelect: '1',
            salesColumns: salesColumns
        };
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    componentDidMount() {
        this.props.getSalesList()
        // this.props.getWhiteLabels()
    }




    componentWillReceiveProps(nextProps) {
    }

    handleComponentSearch = (value) => {
        try {
            if (value.length) {
                if (status) {
                    copyInnerContent = this.state.innerContent;
                    status = false;
                }
                let founddealers = componentSearch(copyInnerContent, value);
                // console.log("found dealers", founddealers);
                if (founddealers.length) {
                    this.setState({
                        innerContent: founddealers,
                    })
                } else {
                    this.setState({
                        innerContent: []
                    })
                }
            } else {
                status = true;
                this.setState({
                    innerContent: copyInnerContent,
                })
            }
        } catch (error) {
            // alert(error);
        }
    }


    handlePagination = (value) => {
        this.refs.dealerList.handlePagination(value);
        this.props.postPagination(value, this.state.dealer_type);
    }

    handleChangetab = (value) => {
        this.setState({
            tabselect: value
        })


    }


    render() {
        // console.log(this.state.columns, window.location.pathname.split("/").pop(), this.state.options)
        const Search = Input.Search;
        if (this.props.location.state) {
            return (

                <div>
                    {
                        this.props.isloading ? <CircularProgress /> :

                            <div style={{ marginTop: 50 }}>
                                <Tabs defaultActiveKey="1" type='card' className="dev_tabs" activeKey={this.state.tabselect} onChange={this.handleChangetab}>
                                    <TabPane tab="SALES" key="1" >
                                        <SalesList
                                            salesList={this.props.salesList}
                                            columns={this.state.salesColumns}
                                        />
                                    </TabPane>
                                    {/* <TabPane tab="INVENTORY" key="2" >
                                    </TabPane> */}
                                    {/* <TabPane tab="REPORTS" key="3" >
                                        <Reports
                                            whiteLabels={this.props.whiteLabels}
                                            dealerList={this.props.dealerList}
                                            getDealerList={this.props.getDealerList}
                                        />
                                    </TabPane>
                                    <TabPane tab="PROFIT AND LOSS" key="4" >
                                        <Reports
                                            whiteLabels={this.props.whiteLabels}
                                            dealerList={this.props.dealerList}
                                            getDealerList={this.props.getDealerList}
                                        />
                                    </TabPane> */}
                                </Tabs>


                            </div>
                    }
                </div>
            );
        } else {
            return (
                <Redirect to={{
                    pathname: '/account',
                }} />
            )
        }
    }

    handleSearch = (e) => {
        // console.log('hi search val is: ', e.target.value);
        // console.log('hi inner content val is: ', this.state.innerContent);

        let demoItems = [];
        if (status) {
            copyInnerContent = this.state.innerContent;
            status = false;
        }
        // console.log("devices", copyInnerContent);

        if (e.target.value.length) {
            copyInnerContent.forEach((item) => {

                if (item[e.target.name] !== undefined) {
                    if ((typeof item[e.target.name]) === 'string') {
                        if (item[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoItems.push(item);
                        }
                    } else if (item[e.target.name] != null) {
                        if (item[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoItems.push(item);
                        }
                    } else {
                        // demoDevices.push(device);
                    }
                } else {
                    demoItems.push(item);
                }
            });
            // console.log("searched value", demoItems);
            this.setState({
                innerContent: demoItems
            })
        } else {
            this.setState({
                innerContent: copyInnerContent
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
            }
        });
    }
}


var mapStateToProps = ({ account, sidebarMenu }) => {
    console.log(account.dealerList);
    return {
        salesList: account.salesList,
        whiteLabels: sidebarMenu.whiteLabels,
        dealerList: account.dealerList
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSalesList,
        getDealerList,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Billing)