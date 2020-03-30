import React, { Component, Fragment } from 'react'

import {
    Button, Modal, Tabs, Col, Row, Divider
} from "antd";

import ItemsTab from "../../../../components/ItemsTab";

import PackagePricingForm from './components/PackagePricingForm';
import StandaloneSimForm from './components/StandaloneSimForm';
import HardwarePricingForm from './components/HardwarePricingForm';
import { sim, chat, pgp, vpn, pkg_features } from '../../../../constants/Constants';

const { TabPane } = Tabs;
export default class WhiteLabelPricing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            innerTab: sim,
            [sim]: {},
            [chat]: {},
            [pgp]: {},
            [vpn]: {},
            pkg_features: JSON.parse(JSON.stringify(pkg_features)),
            outerTab: '1',
            pkgName: '',
            hardwareName: '',
            pkgTerms: '1 month',
            data_limit: 0,
            pkgPrice: 0,
            hardwarePrice: 0,
            hardwareFormErrors: ["hardwarePrice", "hardwareName"],
            submitAvailable: true,
            pricesFormErrors: [],
            packageFormErrors: ['pkgName', 'pkgPrice', 'pkg_features'],
            package_type: 'services'
        }
    }

    componentDidMount() {

    }

    onTabChange = () => {

    }

    restrictSubmit = (available, item) => {
        // 
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

    handleSubmit = () => {

        // prices
        if (this.state.outerTab === '1') {
            let data = this.props.prices;
            let errors = 0;

            for (let key in data) {
                Object.values(data[key]).map(value => {
                    if (value < 1) {
                        errors++;
                    }
                })
                if (Object.values(data[key]).length < 4) {
                    errors++;
                }
            }
            // 

            if (errors === 0) {
                this.props.saveIDPrices({ data: data, whitelabel_id: this.props.whitelabel_id })
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

        }

        // packages
        else if (this.state.outerTab === '2' || this.state.outerTab === '4') {
            console.log("dasdasd");
            var isNum = /^\d+$/.test(this.state.pkgPrice);
            if (this.state.outerTab === '2') {
                if (
                    this.state.packageFormErrors &&
                    (
                        !this.state.packageFormErrors.length ||
                        (this.state.packageFormErrors[0] === "pkgPrice" && this.state.pkgTerms === "trial")
                    ) && isNum &&
                    (this.state.pkgPrice > 0 || this.state.pkgTerms === "trial") &&
                    this.state.pkg_features &&
                    this.state.pkgName &&
                    this.state.pkgTerms &&
                    this.state.pkgName !== '' &&
                    this.state.pkgTerms !== ''
                ) {
                    // 
                    let data = {
                        pkgName: this.state.pkgName,
                        pkgTerm: this.state.pkgTerms,
                        pkgPrice: this.state.pkgTerms === "trial" ? 0 : this.state.pkgPrice,
                        whitelabel_id: this.props.whitelabel_id,
                        package_type: this.state.package_type
                    }

                    if (this.state.data_limit) {
                        data.data_limit = this.state.data_limit;
                    } else {
                        data.pkgFeatures = this.state.pkg_features;
                    }
                    console.log(data);

                    showConfirm(this, data)
                }
            } else {
                let data = {
                    pkgName: this.state.pkgName,
                    pkgTerm: this.state.pkgTerms,
                    pkgPrice: this.state.pkgPrice,
                    whitelabel_id: this.props.whitelabel_id,
                    package_type: this.state.package_type,
                    data_limit: this.state.data_limit ? this.state.data_limit : 2000
                }
                console.log(data);
                showConfirm(this, data)
            }
        } else if (this.state.outerTab === '3') {
            if (this.state.hardwareFormErrors && !this.state.hardwareFormErrors.length && this.state.hardwarePrice > 0 && this.state.hardwareName && this.state.hardwareName != '') {
                // 
                let data = {
                    hardwareName: this.state.hardwareName,
                    hardwarePrice: this.state.hardwarePrice,
                    whitelabel_id: this.props.whitelabel_id
                }

                showHardwareConfirm(this, data)
            }
        }
    }

    setPkgDetail = (value, field, is_pkg_feature = false) => {
        if (is_pkg_feature) {
            this.state.pkg_features[field] = value;

            if (!value) {
                let arr = Object.values(this.state.pkg_features);
                if (!arr.includes(true)) {
                    this.restrictPackageSubmit(false, 'pkg_features');
                    // 
                } else {
                    this.restrictPackageSubmit(true, 'pkg_features')
                }
            } else {
                this.restrictPackageSubmit(true, 'pkg_features')
            }

        } else {
            // this.state[field] = value
            if (field === "pkgTerms" && value === 'trial') {
                this.setState({ pkgPrice: 0, [field]: value })
            } else {

                if (field === 'data_limit' || this.state.outerTab === '4') {
                    this.restrictPackageSubmit(true, 'pkg_features')
                }
                this.setState({
                    [field]: value
                })
            }
        }
    }

    setHardwareDetail = (value, field) => {

        this.state[field] = value
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

    restrictHardwareSubmit = (available, item) => {

        if (!available) {
            if (!this.state.hardwareFormErrors.includes(item)) {
                this.state.hardwareFormErrors.push(item)
            }
        } else {
            let index = this.state.hardwareFormErrors.indexOf(item);
            if (index > -1) {
                this.state.hardwareFormErrors.splice(index, 1)
            }
        }

        this.setState({
            hardwareFormErrors: this.state.hardwareFormErrors
        })
    }

    setPrice = (price, field, price_for) => {

        if (price >= 0 || price == '') {
            this.state[price_for][field] = price
        }
        // 
    }

    innerTabChanged = (e) => {
        this.setState({
            innerTab: e,
        })
    }

    packageTypeTabHandler = (e) => {

        this.setState({
            package_type: e
        })
    }
    render() {

        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title={<div>Set Prices<br></br><span>Label: {this.props.LabelName}</span></div>}
                visible={this.props.pricing_modal}
                onOk={this.handleSubmit}
                okText='Save'
                // okButtonProps={{ disabled: this.state.outerTab == '1' ? (!this.props.isPriceChanged || !this.state.submitAvailable) ? true : false : this.state.outerTab == '3' ? (this.state.hardwareFormErrors && this.state.hardwareFormErrors.length) ? true : false : this.state.packageFormErrors && this.state.packageFormErrors.length ? true : false }}
                okButtonProps={{ disabled: this.state.outerTab == '1' ? (!this.props.isPriceChanged || !this.state.submitAvailable) ? true : false : this.state.outerTab == '3' ? (this.state.hardwareFormErrors && this.state.hardwareFormErrors.length) ? true : false : this.state.packageFormErrors && this.state.packageFormErrors.length ? (this.state.packageFormErrors[0] === "pkgPrice" && this.state.pkgTerms === "trial") ? false : true : false }}
                onCancel={() => {
                    this.props.showPricingModal(false);
                    this.props.resetPrice();
                    this.setState({
                        outerTab: '1',
                        pkgPrice: 0,
                        pkg_features: JSON.parse(JSON.stringify(pkg_features)),
                        pkgTerm: '1 month',
                        pkgName: '',
                        submitAvailable: true,
                        packageFormErrors: ['pkgName', 'pkgPrice', 'pkg_features'],
                        hardwareFormErrors: ["hardwarePrice", "hardwareName"],
                        hardwareName: '',
                        hardwarePrice: 0
                    })
                }}
                // footer={null}
                width='650px'
            >
                <Tabs
                    // className="set_price"
                    type="card"
                    onChange={(e) => {
                        this.setState({
                            outerTab: e,
                            packageFormErrors: ['pkgName', 'pkgPrice', 'pkg_features'],
                            hardwareFormErrors: ["hardwarePrice", "hardwareName"],
                            pkgPrice: 0,
                            pkg_features: JSON.parse(JSON.stringify(pkg_features)),
                            pkgTerm: '1 month',
                            pkgName: '',
                        })
                        if (this.state.outerTab === '4') {
                            console.log(this.simForm);
                            this.simForm.handleCancel()
                        } else if (this.state.outerTab === '2') {
                            this.pkgForm.handleCancel()
                        }
                    }
                    }
                >
                    <TabPane tab="Set ID Prices" key="1">
                        <ItemsTab
                            innerTabChanged={this.innerTabChanged}
                            setPrice={this.props.setPrice}
                            prices={this.props.prices}
                            restrictSubmit={this.restrictSubmit}
                            submitAvailable={this.state.submitAvailable}
                            pricesFormErrors={this.state.pricesFormErrors}

                        />
                    </TabPane>
                    <TabPane tab="Packages Prices" key="2">
                        <PackagePricingForm
                            showPricingModal={this.props.showPricingModal}
                            setPkgDetail={this.setPkgDetail}
                            wrappedComponentRef={(pkgForm) => this.pkgForm = pkgForm}
                            restrictPackageSubmit={this.restrictPackageSubmit}
                            packageTypeTabHandler={this.packageTypeTabHandler}
                            ref="packageForm"
                        />

                    </TabPane>
                    <TabPane tab="Hardware Prices" key="3">
                        <HardwarePricingForm
                            showPricingModal={this.props.showPricingModal}
                            setHardwareDetail={this.setHardwareDetail}
                            wrappedComponentRef={(form) => this.form = form}
                            restrictHardwareSubmit={this.restrictHardwareSubmit}
                            ref="packageForm"
                        />
                    </TabPane>
                    <TabPane tab="Stand alone sim Prices" key="4">
                        <StandaloneSimForm
                            showPricingModal={this.props.showPricingModal}
                            setPkgDetail={this.setPkgDetail}
                            wrappedComponentRef={(simForm) => this.simForm = simForm}
                            restrictPackageSubmit={this.restrictPackageSubmit}
                            packageTypeTabHandler={this.packageTypeTabHandler}
                            ref="packageForm"
                            type='standalone'
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
        content:
            (<>
                <Divider />
                <Row>
                    <Col span={12}><p>Package Name</p>
                        {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                    </Col>

                    <Col span={12}>
                        <p >{_this.state.pkgName}</p>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}><p>Package Term</p>
                        {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                    </Col>

                    <Col span={12}>
                        <p >{_this.state.pkgTerms}</p>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}><p>Package Price</p>
                        {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                    </Col>
                    <Col span={12}>
                        <p >${_this.state.pkgPrice}</p>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}><p>Package Type</p>
                        {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                    </Col>
                    <Col span={12}>
                        <p >{data.package_type}</p>
                    </Col>
                </Row>

                {(data.package_type !== 'Standalone Sim') ?
                    (data.package_type && data.package_type === 'data_plan') ?
                        <Row>
                            <Col span={12}>
                                <p >Data Limit</p>
                            </Col>
                            <Col span={12}>
                                <p >{_this.state.data_limit} MB</p>
                            </Col>
                        </Row>
                        :
                        <Fragment>
                            <Row>
                                <Col span={12}><p>Sim id</p>
                                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                                </Col>
                                <Col span={12}>
                                    <p >{_this.state.pkg_features.sim_id ? 'yes' : 'No'}</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}><p>Sim id 2</p>
                                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                                </Col>
                                <Col span={12}>
                                    <p >{_this.state.pkg_features.sim_id2 ? 'yes' : 'No'}</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}><p>Chat id</p>
                                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                                </Col>
                                <Col span={12}>
                                    <p >{_this.state.pkg_features.chat_id ? 'yes' : 'No'}</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}><p>Pgp Email</p>
                                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                                </Col>
                                <Col span={12}>
                                    <p >{_this.state.pkg_features.pgp_email ? 'yes' : 'No'}</p>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}><p>Vpn</p>
                                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                                </Col>
                                <Col span={12}>
                                    <p >{_this.state.pkg_features.vpn ? 'yes' : 'No'}</p>
                                </Col>
                            </Row>
                        </Fragment>
                    : <Row>
                        <Col span={12}>
                            <p >Data Limit</p>
                        </Col>
                        <Col span={12}>
                            <p >{data.data_limit} MB</p>
                        </Col>
                    </Row>
                }
            </>
            )
        ,
        onOk() {
            // 
            _this.props.setPackage(data);
            _this.props.showPricingModal(false);
            _this.setState({
                pkgPrice: 0,
                pkg_features: JSON.parse(JSON.stringify(pkg_features)),
                pkgTerm: '1 month',
                pkgName: '',
                outerTab: '1',
                packageFormErrors: ['pkgName', 'pkgPrice', 'pkg_features']
            })
        },
        onCancel() {
            // 
        },
    });
}
function showHardwareConfirm(_this, data) {
    Modal.confirm({
        title: 'Save Price for hardware ?',
        cancelText: 'Cancel',
        okText: 'Save',
        content: <div>
            <Row>
                <Divider />
                <Col span={12}><p>Hardware Name : </p>
                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                </Col>
                <Col span={12}>
                    <p >{_this.state.hardwareName}</p>
                </Col>

                <Col span={12}><p>Package Price: </p>
                    {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], "SET")} </Button> */}
                </Col>
                <Col span={12}>
                    <p >{_this.state.hardwarePrice} Credits</p>
                </Col>
            </Row>
        </div>,
        onOk() {
            // 

            _this.props.saveHardware(data);
            _this.props.showPricingModal(false);
            _this.setState({
                outerTab: '1',
                hardwarePrice: 0,
                hardwareFormErrors: ["hardwarePrice", "hardwareName"],
            })
        },
        onCancel() {
            // 
        },
    });
}