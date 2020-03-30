import React, { Component, } from 'react'

import {
    Button, Modal, Tabs, Row, Col, Divider
} from "antd";

import ItemsTab from "../../../components/ItemsTab/index";

import PackagePricingForm from './components/PackagePricingForm';
import { sim, chat, pgp, vpn, pkg_features, sim2, ADMIN } from '../../../constants/Constants';
import {
    Tab_SET_ID_PRICES,
    Tab_SET_PACKAGES_PRICES,
} from '../../../constants/TabConstants';
import {
    Button_SET_PRICE,
    Button_Save
} from '../../../constants/ButtonConstants'
import { convertToLang, checkIsArray } from '../../utils/commonUtils';


const { TabPane } = Tabs;
export default class PricingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            innerTab: sim,
            [sim]: {},
            [sim2]: {},
            [chat]: {},
            [pgp]: {},
            [vpn]: {},
            pkg_features: JSON.parse(JSON.stringify(pkg_features)),
            outerTab: props.auth.type !== "admin" ? "2" : "1",
            pkgName: '',
            pkgTerms: '1 month',
            pkgPrice: 0,
            submitAvailable: true,
            pricesFormErrors: [],
            packageFormErrors: ['pkgName', 'pkgPrice', 'pkg_features'],
        }
    }

    componentDidMount() {

    }

    onTabChange = () => {

    }


    restrictPackageSubmit = (available, item) => {
        if (!available) {
            if (!this.state.packageFormErrors.includes(item)) {
                this.state.packageFormErrors.push(item)
            }
        } else {
            let index = this.state.packageFormErrors.indexOf(item);
            if (index > -1) {
                this.state.packageFormErrors.splice(index, 1)
            }
        }
        this.setState({
            packageFormErrors: this.state.packageFormErrors
        })
    }

    handleSubmit = () => {

        if (this.state.outerTab === '1') {
            let data = this.props.prices;
            let errors = 0;
            for (let key in data) {
                checkIsArray(Object.values(data[key])).map(value => {

                    if (value < 1) {
                        errors++;
                    }
                })
                if (checkIsArray(Object.values(data[key])).length < 4) {
                    errors++;
                }
            }
            //

            if (errors === 0) {
                this.props.saveIDPrices({ data: data, dealer_id: this.props.dealer_id })
                this.props.showPricingModal(false);
                this.setState({
                    [sim]: {},
                    [chat]: {},
                    [pgp]: {},
                    [vpn]: {},
                    innerTab: sim,
                    outerTab: '1',
                    submitAvailable: true
                })
            }
        } else if (this.state.outerTab === '2') {

            var isnum = /^\d+$/.test(this.state.pkgPrice);
            //
            if (this.state.packageFormErrors && (!this.state.packageFormErrors.length || (this.state.packageFormErrors[0] === "pkgPrice" && this.state.pkgTerms === "trial")) && isnum && (this.state.pkgPrice > 0 || this.state.pkgTerms === "trial") && this.state.pkg_features && this.state.pkgName && this.state.pkgTerms && this.state.pkgName !== '' && this.state.pkgTerms !== '') {
                let pkgName = this.state.pkgName;
                let pkgTerm = this.state.pkgTerms;
                let pkgPrice = this.state.pkgPrice;
                let pkgFeatures = this.state.pkg_features;
                let dealer_id = this.props.dealer_id;
                let retail_price = this.state.retail_price

                let data = {
                    pkgName: pkgName,
                    pkgTerm: pkgTerm,
                    pkgPrice: pkgTerm === "trial" ? 0 : pkgPrice,
                    pkgFeatures: pkgFeatures,
                    dealer_id: dealer_id,
                    retail_price: retail_price
                }
                showConfirm(this, data)
            }
        }
    }

    setPkgDetail = (value, field, is_pkg_feature = false) => {
        if (is_pkg_feature) {
            this.state.pkg_features[field] = value;
            // let arr = Object.values(this.state.pkg_features);
            //
            // arr.filter(item => item !== false)


            if (!value) {
                let arr = Object.values(this.state.pkg_features);


                if (!arr.includes(true)) {
                    //
                    this.restrictPackageSubmit(false, 'pkg_features');

                } else {
                    this.restrictPackageSubmit(true, 'pkg_features')
                }


            } else {
                this.restrictPackageSubmit(true, 'pkg_features')
            }

        } else {
            if (field === "pkgTerms" && value === 'trial') {
                this.setState({ pkgPrice: 0, [field]: value })
            } else {
                this.setState({
                    [field]: value
                })
            }
        }
    }

    restrictSubmit = (available, item) => {

        if (!available) {
            if (!this.state.pricesFormErrors.includes(item)) {
                this.state.pricesFormErrors.push(item)
            }
        } else {
            let index = this.state.pricesFormErrors.indexOf(item);
            if (index > -1) {
                this.state.pricesFormErrors.splice(index, 1)
            }
        }
        this.setState({
            pricesFormErrors: this.state.pricesFormErrors,
            submitAvailable: this.state.pricesFormErrors.length ? false : true
        })
    }

    setPrice = (price, field, price_for) => {

        if (price >= 0 || price == '') {
            this.state[price_for][field] = price
        }
    }

    innerTabChanged = (e) => {
        this.setState({
            innerTab: e,
        })
    }

    render() {
        //
        //
        //
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title={<div>{convertToLang(this.props.translation[Button_SET_PRICE], "Set Price")}</div>}
                visible={this.props.pricing_modal}
                onOk={() => { this.handleSubmit() }}
                okText={convertToLang(this.props.translation[Button_Save], "Save")}
                okButtonProps={{ disabled: this.state.outerTab == '1' ? (!this.props.isPriceChanged || !this.state.submitAvailable) ? true : false : this.state.packageFormErrors && this.state.packageFormErrors.length ? (this.state.packageFormErrors[0] === "pkgPrice" && this.state.pkgTerms === "trial") ? false : true : false }}
                // okButtonProps={{ disabled: this.state.outerTab == '1' ? (!this.props.isPriceChanged || !this.state.submitAvailable) ? true : false : this.state.packageFormErrors && this.state.packageFormErrors.length ? true : false }}
                onCancel={() => {
                    this.props.showPricingModal(false);
                    this.props.resetPrice();
                    this.setState({
                        // outerTab: this.props.auth.type !== "admin" ? "2" : 1,
                        pkgPrice: 0,
                        pkg_features: JSON.parse(JSON.stringify(pkg_features)),
                        pkgTerms: '1 month',
                        pkgName: '',
                        submitAvailable: true,
                        packageFormErrors: ['pkgName', 'pkgPrice', 'pkg_features']
                    })
                }}
                // footer={null}
                width='650px'
                className="set_price_modal"
            >
                <Tabs
                    className="set_price"
                    type="card"
                    onChange={(e) => this.setState({ outerTab: e })}
                >
                    {(this.props.auth.type === ADMIN) ?
                        <TabPane tab={convertToLang(this.props.translation[Tab_SET_ID_PRICES], "Set ID Prices")} key="1">
                            <ItemsTab
                                innerTabChanged={this.innerTabChanged}
                                setPrice={this.props.setPrice}
                                prices={this.props.prices}
                                translation={this.props.translation}
                                restrictSubmit={this.restrictSubmit}
                                submitAvailable={this.state.submitAvailable}
                                pricesFormErrors={this.state.pricesFormErrors}
                                user={this.props.auth}
                            />
                        </TabPane>
                        : null
                    }
                    <TabPane tab={convertToLang(this.props.translation[Tab_SET_PACKAGES_PRICES], "Set Packages Price")} key="2">
                        <PackagePricingForm
                            showPricingModal={this.props.showPricingModal}
                            setPkgDetail={this.setPkgDetail}
                            wrappedComponentRef={(form) => this.form = form}
                            translation={this.props.translation}
                            restrictPackageSubmit={this.restrictPackageSubmit}
                            user={this.props.auth}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        )
    }
}

function showConfirm(_this, data) {
    Modal.confirm({
        title: 'Save Package ?',
        cancelText: 'Cancel',
        okText: 'Save',
        content: <div>
            <Row>
                <Divider />
                <Col span={12}><p>Package Name</p>
                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                </Col>
                <Col span={12}>
                    <p >{_this.state.pkgName}</p>
                </Col>


                <Col span={12}><p>Package Term</p>
                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                </Col>
                <Col span={12}>
                    <p >{_this.state.pkgTerms}</p>
                </Col>


                <Col span={12}><p>Package Price</p>
                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                </Col>
                <Col span={12}>
                    <p >{_this.state.pkgPrice}</p>
                </Col>


                <Col span={12}><p>Sim id</p>
                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                </Col>
                <Col span={12}>
                    <p >{_this.state.pkg_features.sim_id ? 'yes' : 'No'}</p>
                </Col>
                <Col span={12}><p>Sim id 2</p>
                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                </Col>
                <Col span={12}>
                    <p >{_this.state.pkg_features.sim_id2 ? 'yes' : 'No'}</p>
                </Col>


                <Col span={12}><p>Chat id</p>
                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                </Col>
                <Col span={12}>
                    <p >{_this.state.pkg_features.chat_id ? 'yes' : 'No'}</p>
                </Col>

                <Col span={12}><p>Pgp Email</p>
                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                </Col>
                <Col span={12}>
                    <p >{_this.state.pkg_features.pgp_email ? 'yes' : 'No'}</p>
                </Col>

                <Col span={12}><p>Vpn</p>
                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                </Col>
                <Col span={12}>
                    <p >{_this.state.pkg_features.vpn ? 'yes' : 'No'}</p>
                </Col>
            </Row>
        </div>,
        onOk() {
            //
            _this.props.setPackage(data);
            _this.props.showPricingModal(false);
            _this.setState({
                pkgPrice: 0,
                pkg_features: JSON.parse(JSON.stringify(pkg_features)),
                pkgTerms: '1 month',
                pkgName: '',
                outerTab: '1',
                packageFormErrors: ['pkgName', 'pkgPrice', 'pkg_features']
            })
        },
        onCancel() {

        },
    });
}
