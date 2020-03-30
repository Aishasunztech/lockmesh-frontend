import React, { Component, } from 'react'

import {
    Button, Modal, Tabs, Row, Col, Divider
} from "antd";

import { pkg_features, ADMIN, one_month, three_month, six_month, twelve_month, sim, chat, pgp, vpn, sim2 } from '../../../../constants/Constants';

import { convertToLang } from '../../../utils/commonUtils';
import {
    Form, Input, Select,
} from "antd";
// import styles from '../../../whitelabels.css';
import RestService from '../../../../appRedux/services/RestServices';
import {
    PACKAGE_NAME,
    PACKAGE_TERM,
    SELECT_PRICE,
    PACKAGE_SERVICES,
    PACKAGE_PRICE,
    PACKAGE_EXPIRY,
    PACKAGE_SEARCH,
    PACKAGE_SERVICE_NAME,
    PACKAGE_INCLUDED,
} from "../../../../constants/AccountConstants";
import {
    LABEL_DATA_CHAT_ID,
    LABEL_DATA_SIM_ID,
    LABEL_DATA_PGP_EMAIL,
    LABEL_DATA_VPN,
} from '../../../../constants/LabelConstants';
import {
    Button_SET,
    Button_UNSET,
    Button_SET_PRICE,
    Button_Save
} from '../../../../constants/ButtonConstants'

import { } from '../../../../constants/Constants';
import { Tab_SET_PACKAGES_PRICES } from '../../../../constants/TabConstants';

const { TabPane } = Tabs;

class PackagePricingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pkgPrice: 0,
            sim_id: false,
            sim_id2: false,
            chat_id: false,
            pgp_email: false,
            vpn: false,
            help: '',
            validateStatus: 'success',
            pkgTerms: '1 month'
        }
    }


    setPrice = (fieldName, is_pkg_feature = false, pkg_feature_value = '', e) => {
        let value = ''

        if (fieldName) {

            if (is_pkg_feature) {
                if (pkg_feature_value !== '' && fieldName) {
                    value = pkg_feature_value;
                    this.props.setPkgDetail(pkg_feature_value, fieldName, is_pkg_feature);
                }
            } else {
                if (fieldName) {
                    value = e
                    if (fieldName == 'pkgPrice') {
                        e = +e;
                        e = e.toString();
                    }
                    this.props.setPkgDetail(e, fieldName, is_pkg_feature);
                }
            }

            if (fieldName == 'pkgPrice') {
                var isnum = /^\d+$/.test(value);

                if (!isnum || value <= 0) {

                    this.props.restrictPackageSubmit(false, fieldName)
                    this.setState({
                        validateStatus: 'error',
                        help: value === '' ? 'Please Input Package Price' : 'Price must be in Numbers and greater than zero',
                        [fieldName]: e
                    })
                } else {
                    this.props.restrictPackageSubmit(true, fieldName)
                    this.setState({
                        validateStatus: 'success',
                        help: '',
                        [fieldName]: e
                    })
                }
                //
            } else {
                if (fieldName === "pkgTerms" && value === 'trial') {
                    this.setState({ pkgPrice: 0, [fieldName]: value })
                    this.props.form.setFieldsValue({ pkgPrice: 0 })
                } else {
                    this.setState({
                        [fieldName]: value
                    })
                }
            }
        }
    }


    PackageNameChange = async (rule, value, callback) => {
        let response = true
        //
        response = await RestService.checkPackageName(value).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    return true
                }
                else {
                    return false
                }
            }
        });
        //
        if (response) {
            this.props.restrictPackageSubmit(true, 'pkgName')
            callback()

        } else {
            this.props.restrictPackageSubmit(false, 'pkgName')
            callback("Package name already taken please use another name.")
        }
        if (value == '') {
            this.props.restrictPackageSubmit(false, 'pkgName')
        }
    }

    componentDidMount() {
        // console.log(this.props.packageData);
        let pkg_features = this.props.packageData ? JSON.parse(this.props.packageData.pkg_features) : {}
        if (pkg_features.sim_id) {
            this.setState({
                sim_id: pkg_features.sim_id,
                sim_id2: pkg_features.sim_id2,
                chat_id: pkg_features.chat_id,
                pgp_email: pkg_features.pgp_email,
                vpn: pkg_features.vpn,
                pkgTerms: this.props.packageData.pkg_term,
                pkgPrice: this.props.packageData.pkg_price,
            })
        }
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const { Option } = Select

        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={17}>
                        <Form.Item label={convertToLang(this.props.translation[PACKAGE_NAME], "PACKAGE NAME")}
                            labelCol={{ span: 11 }}
                            wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('pkgName', {
                                initialValue: this.props.packageData.pkg_name,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input Package Name!',
                                    },
                                    {
                                        validator: this.PackageNameChange,
                                    }
                                ],
                            })(<Input onChange={(e => this.setPrice('pkgName', '', '', e.target.value))} />)}
                        </Form.Item>
                    </Col>

                    <Col span={7}>
                        <h4 className='priceText'>{this.state.pkgName}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={17}>
                        <Form.Item label={convertToLang(this.props.translation[PACKAGE_TERM], "PACKAGE TERM")} labelCol={{ span: 11 }}
                            wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('pkgTerms', {
                                initialValue: this.props.packageData.pkg_term,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please Select Package Terms',
                                    },
                                ],
                            })(<Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder={convertToLang(this.props.translation[SELECT_PRICE], "SELECT TERM")}
                                optionFilterProp="children"
                                onChange={(pkgTerms => this.setPrice('pkgTerms', '', '', pkgTerms))}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value={'trial'}>{convertToLang(this.props.translation["trial"], "trial")}</Option>
                                <Option value={'1 month'}>{convertToLang(this.props.translation[one_month], "1 month")}</Option>
                                <Option value={'3 month'}>{convertToLang(this.props.translation[three_month], "3 month")}</Option>
                                <Option value={'6 month'}>{convertToLang(this.props.translation[six_month], "6 month")}</Option>
                                <Option value={'12 month'}>{convertToLang(this.props.translation[twelve_month], "12 month")}</Option>
                            </Select>)}

                        </Form.Item>
                    </Col>

                    <Col span={7}>
                        <h4 className='priceText'>{this.state.pkgTerms}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={17}>
                        <Form.Item label={convertToLang(this.props.translation[PACKAGE_PRICE], "PACKAGE PRICE")} labelCol={{ span: 11 }}
                            validateStatus={this.state.pkgTerms === "trial" ? "success" : this.state.validateStatus}
                            help={this.state.pkgTerms === "trial" ? '' : this.state.help}
                            wrapperCol={{ span: 13 }}
                        >
                            {getFieldDecorator('pkgPrice', {
                                initialValue: this.props.packageData.pkg_price,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please Input Package Price',
                                    },
                                ],
                            })(<Input disabled={this.state.pkgTerms === "trial" ? true : false} onChange={(e => this.setPrice('pkgPrice', '', '', e.target.value))} type='number' min={0} />)}

                        </Form.Item>
                    </Col>

                    <Col span={7}>
                        <h4 className='priceText'>Price: ${this.state.pkgPrice}</h4>
                    </Col>
                </Row>
                {(this.props.user.type !== ADMIN) ?
                    <Row>
                        <Col span={17}>
                            <Form.Item label={convertToLang(this.props.translation[""], "RETAIL PRICE")} labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}>
                                {getFieldDecorator('retail_price', {
                                    initialValue: this.props.packageData.retail_price,
                                    rules: [
                                        {
                                            // required: true,
                                            message: 'Please Input Price',
                                        },
                                    ],
                                })(<Input onChange={(e => this.setPrice('retail_price', '', '', e.target.value))} type='number' min={0} />)}

                            </Form.Item>
                        </Col>

                        <Col span={7}>
                            <h4 className='priceText'>Retail Price: ${this.state.retail_price}</h4>
                        </Col>
                    </Row>
                    : null}

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">{convertToLang(this.props.translation[LABEL_DATA_SIM_ID], "SIM ID")}:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(sim, true, !this.state[sim])} >{this.state[sim] ? convertToLang(this.props.translation[Button_UNSET], "UNSET") : convertToLang(this.props.translation[Button_SET], "SET")}</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' >{convertToLang(this.props.translation[LABEL_DATA_SIM_ID], "SIM ID")}: </span><span style={{ fontWeight: 'bold' }}>{this.state[sim] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">{convertToLang(this.props.translation[""], "SIM ID 2")}:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(sim2, true, !this.state[sim2])} >{this.state[sim2] ? convertToLang(this.props.translation[Button_UNSET], "UNSET") : convertToLang(this.props.translation[Button_SET], "SET")}</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' >{convertToLang(this.props.translation[""], "SIM ID 2")}: </span><span style={{ fontWeight: 'bold' }}>{this.state[sim2] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">{convertToLang(this.props.translation[LABEL_DATA_CHAT_ID], "CHAT ID")}:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(chat, true, !this.state[chat])}>{this.state[chat] ? convertToLang(this.props.translation[Button_UNSET], "UNSET") : convertToLang(this.props.translation[Button_SET], "SET")}</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' > {convertToLang(this.props.translation[LABEL_DATA_CHAT_ID], LABEL_DATA_CHAT_ID)}: </span><span style={{ fontWeight: 'bold' }}>{this.state[chat] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">{convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], "PGP EMAIL")}:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(pgp, true, !this.state[pgp])}>{this.state[pgp] ? convertToLang(this.props.translation[Button_UNSET], "UNSET") : convertToLang(this.props.translation[Button_SET], "SET")}</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' >{convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], "PGP EMAIL")}: </span><span style={{ fontWeight: 'bold' }}>{this.state[pgp] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">{convertToLang(this.props.translation[LABEL_DATA_VPN], "VPN")}:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(vpn, true, !this.state[vpn])}>{this.state[vpn] ? convertToLang(this.props.translation[Button_UNSET], "UNSET") : convertToLang(this.props.translation[Button_SET], "SET")}</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' >{convertToLang(this.props.translation[LABEL_DATA_VPN], "VPN")}: </span><span style={{ fontWeight: 'bold' }}>{this.state[vpn] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>


                {/* <div style={{float: 'right', marginTop: 20}} >
                    <Button onClick={()=> this.props.showPricingModal(false)}>Cancel</Button>
                    <Button type="primary" htmlType="submit" >Submit</Button>
                </div>  */}
            </Form>
        )
    }
}

PackagePricingForm = Form.create()(PackagePricingForm);

export default class EditPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pkg_features: JSON.parse(JSON.stringify(pkg_features)),
            pkgName: '',
            pkgTerms: '1 month',
            pkgPrice: 0,
            submitAvailable: true,
            packageFormErrors: [],
            packageData: {}
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


    showModal(item) {

        this.setState({
            editPackageModal: true,
            packageData: item,
            pkgName: item.pkg_name,
            pkgPrice: item.pkg_price,
            pkgTerms: item.pkg_term,
            pkg_features: JSON.parse(item.pkg_features),
            submitAvailable: true,
            retail_price: item.retail_price
        })
    }

    handleSubmit = () => {

        var isnum = /^\d+$/.test(this.state.pkgPrice);
        if (this.state.packageFormErrors && (!this.state.packageFormErrors.length || (this.state.packageFormErrors[0] === "pkgPrice" && this.state.pkgTerms === "trial")) && isnum && (this.state.pkgPrice > 0 || this.state.pkgTerms === "trial") && this.state.pkg_features && this.state.pkgName && this.state.pkgTerms && this.state.pkgName !== '' && this.state.pkgTerms !== '') {
            let pkgName = this.state.pkgName;
            let pkgTerm = this.state.pkgTerms;
            let pkgPrice = this.state.pkgPrice;
            let pkgFeatures = this.state.pkg_features;
            let dealer_id = this.props.dealer_id
            let package_id = this.state.packageData.id
            let retail_price = this.state.retail_price

            let data = {
                pkgName: pkgName,
                pkgTerm: pkgTerm,
                pkgPrice: pkgTerm === "trial" ? 0 : pkgPrice,
                pkgFeatures: pkgFeatures,
                dealer_id: dealer_id,
                package_id: package_id,
                retail_price: retail_price
            }
            showConfirm(this, data)
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
                title={<div>{convertToLang(this.props.translation[''], "Edit Package")}</div>}
                visible={this.state.editPackageModal}
                onOk={() => { this.handleSubmit() }}
                okText={convertToLang(this.props.translation[Button_Save], "Save")}
                okButtonProps={{ disabled: this.state.packageFormErrors && this.state.packageFormErrors.length ? (this.state.packageFormErrors[0] === "pkgPrice" && this.state.pkgTerms === "trial") ? false : true : false }}
                onCancel={() => {
                    this.props.showPricingModal(false);
                    this.props.resetPrice();
                    this.setState({
                        pkgPrice: 0,
                        pkg_features: JSON.parse(JSON.stringify(pkg_features)),
                        pkgTerms: '1 month',
                        pkgName: '',
                        submitAvailable: true,
                        packageFormErrors: [],
                        editPackageModal: false
                    })
                }}
                // footer={null}
                width='650px'
                className="set_price_modal"
            >
                <PackagePricingForm
                    showPricingModal={this.props.showPricingModal}
                    setPkgDetail={this.setPkgDetail}
                    wrappedComponentRef={(form) => this.form = form}
                    translation={this.props.translation}
                    restrictPackageSubmit={this.restrictPackageSubmit}
                    packageData={this.state.packageData}
                    user={this.props.auth}
                />
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

            _this.props.editPackage(data);
            _this.setState({
                pkgPrice: 0,
                pkg_features: JSON.parse(JSON.stringify(pkg_features)),
                pkgTerms: '1 month',
                pkgName: '',
                packageFormErrors: [],
                editPackageModal: false
            })
        },
        onCancel() {
            //
        },
    });
}
