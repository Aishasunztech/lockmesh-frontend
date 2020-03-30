import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Table, Card, Input } from 'antd';
import {
    getPrices, resetPrice, setPackage,
    saveIDPrices, setPrice, getPackages
} from '../../../../appRedux/actions/WhiteLabels';
import { sim, chat, pgp, vpn } from '../../../../constants/Constants';
import AppFilter from '../../../../components/AppFilter/index';
import PricesList from './components/pricesList';
import {
    TAB_SIM_ID,
    TAB_CHAT_ID,
    TAB_PGP_EMAIL,
    TAB_VPN
} from '../../../../constants/LabelConstants';
import { isArray } from "util";
import WhiteLabelPricing from './WhiteLabelPricing';
let packagesCopy = [];
class Prices extends Component {
    constructor(props) {
        super(props)
       
        this.state = {
            packages: [],
            copyStatus: true
        }
    }

    handleSearch = (e) => {

        let dumyPackages = [];
        if (this.state.copyStatus) {
            packagesCopy = this.state.packages;
            this.state.copyStatus = false;
        }

        if (e.target.value.length && this.state.packagesCopy) {

            packagesCopy.forEach((dealer) => {
                if (dealer[e.target.name] !== undefined) {
                    if ((typeof dealer[e.target.name]) === 'string') {
                        if (dealer[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            dumyPackages.push(dealer);
                        }
                    } else if (dealer[e.target.name] != null) {
                        if (dealer[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            dumyPackages.push(dealer);
                        }
                        if (isArray(dealer[e.target.name])) {
                            // console.log('is it working', e.target.name)
                            if (dealer[e.target.name][0]['total'].includes(e.target.value)) {
                                dumyPackages.push(dealer);
                            }
                        }
                    } else {
                        // demoDevices.push(device);
                    }
                } else {
                    dumyPackages.push(dealer);
                }
            });
            // console.log("searched value", demoDealers);
            this.setState({
                dealers: dumyPackages
            })
        } else {
            this.setState({
                dealers: packagesCopy
            })
        }
    }

    componentDidMount() {
        console.log(this.props.id, 'id is')
        this.props.getPrices(this.props.id);
        this.props.getPackages(this.props.id)
        this.setState({
            prices: this.props.prices,
            innerTabData: this.props.prices ? this.props.prices[sim] : {},
            packages: this.props.packages,
            packagesCopy: this.props.packages
        })
    }

    componentDidUpdate(prevProps) {
        console.log('did update', this.props.packages)
        if (this.props !== prevProps) {
            this.setState({
                prices: this.props.prices,
                packages: this.props.packages,
                packagesCopy: this.props.packages
                // innerTabData: this.props.prices ? this.props.prices[this.state.tabSelected] : {},
            })
        }
    }

    renderList = () => {
        console.log(this.state.packages, 'ddddddddddddddddddddddddddddddddddddd')
        if (this.state.packages) {
            return this.state.packages.map((item, index) => {
                return {
                    key: item.id,
                    sr: ++index,
                    pkg_name: item.pkg_name,
                    pkg_price: "$" + item.pkg_price,
                    pkg_term: item.pkg_term,
                    pkg_expiry: item.pkg_expiry,
                    pkg_features: item.pkg_features
                }
            })
        }
        // console.log(this.props.packages, 'packages are')
    }

    render() {
        console.log(this.state.packages, 'prices are')
        return (
            <Table
                columns={this.columns}
                dataSource={this.renderList()}
                bordered
                pagination={false}
                // expandIconColumnIndex={3}
                // expandIconAsCell={false}

                expandedRowRender={record => <p style={{ margin: 0 }}>sdfsdfadfasdasdf</p>}
            />

        )
    }
}


