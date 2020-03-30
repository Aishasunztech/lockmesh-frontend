import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button, Select,
} from "antd";
// import styles from '../../../whitelabels.css';
import RestService from '../../../../appRedux/services/RestServices';
import { convertToLang } from '../../../utils/commonUtils';
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
    Button_UNSET
} from '../../../../constants/ButtonConstants'

import { one_month, three_month, six_month, twelve_month, sim, chat, pgp, vpn, sim2, ADMIN } from '../../../../constants/Constants';

class PackagePricingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pkgPrice: 0,
            sim: false,
            sim2: false,
            chat: false,
            pgp: false,
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

    render() {

        const formItemLayout = {
            labelCol: {
                xs: { span: 24, offset: 2 },
                sm: { span: 10, offset: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const { Option } = Select;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={17}>
                        <Form.Item label={convertToLang(this.props.translation[PACKAGE_NAME], "PACKAGE NAME")}
                            labelCol={{ span: 11 }}
                            wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('pkgName', {
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
                                initialValue: '1 month',
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
                            <Form.Item label={convertToLang(this.props.translation[""], "PACKAGE RETAIL PRICE")} labelCol={{ span: 11 }}
                                validateStatus={this.state.pkgTerms === "trial" ? "success" : this.state.validateStatus}
                                help={this.state.pkgTerms === "trial" ? '' : this.state.help}
                                wrapperCol={{ span: 13 }}
                            >
                                {getFieldDecorator('retail_price', {
                                    rules: [
                                        {
                                            // required: true,
                                            message: 'Please Input Package Price',
                                        },
                                    ],
                                })(<Input disabled={this.state.pkgTerms === "trial" ? true : false} onChange={(e => this.setPrice('retail_price', '', '', e.target.value))} type='number' min={0} />)}

                            </Form.Item>
                        </Col>

                        <Col span={7}>
                            <h4 className='priceText'>Price: ${this.state.pkgPrice}</h4>
                        </Col>
                    </Row>
                    : null
                }

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

export default PackagePricingForm;
