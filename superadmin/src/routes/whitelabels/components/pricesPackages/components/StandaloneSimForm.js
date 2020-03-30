import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button, Select, Tabs, InputNumber
} from "antd";
import styles from '../../../whitelabels.css';
import RestService from '../../../../../appRedux/services/RestServices';
import { one_month, three_month, six_month, twelve_month, sim, chat, pgp, vpn, sim2, trial } from '../../../../../constants/Constants';

class StandaloneSimForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pkgPrice: 0,
            pkgTerms: '1 month',
            selectedTab: '1',
            packageType: 'Standalone Sim',
            data_limit: '2000'
        }
    }


    setField = (fieldName, pkg_feature_value = '', is_pkg_feature = false, e) => {
        // let value = e.target.value;
        let value = ''
        if (fieldName) {
            if (fieldName == 'pkgPrice' || fieldName == 'data_limit') {
                value = e;
                e = +e;
                e = e.toString();
                this.props.setPkgDetail(e, fieldName, is_pkg_feature);
                var isNum = /^\d+$/.test(value);
                if (!isNum || e <= 0) {
                    this.props.restrictPackageSubmit(false, fieldName)
                    if (fieldName == 'pkgPrice') {
                        this.setState({
                            validateStatus: 'error',
                            help: value === '' ? 'Please Input Package Price' : 'Price must be in Numbers and greater than zero',
                            [fieldName]: e,
                        })
                    } else {
                        this.setState({
                            dataLimitValidateStatus: 'error',
                            dataLimitHelp: value === '' ? 'Please Input Data Limit' : 'Data Limit must be in Numbers and greater than zero',
                            [fieldName]: e,
                        })
                    }
                } else {
                    this.props.restrictPackageSubmit(true, fieldName)
                    if (fieldName == 'pkgPrice') {

                        this.setState({
                            validateStatus: 'success',
                            help: '',
                            [fieldName]: e
                        })
                    } else {
                        this.setState({
                            dataLimitValidateStatus: 'success',
                            dataLimitHelp: '',
                            [fieldName]: e
                        })
                    }
                }
            } else {
                this.props.setPkgDetail(e, fieldName, is_pkg_feature);
                this.setState({
                    [fieldName]: value
                })
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
        // 
        this.setState({
            pkgPrice: 0,
        })
        this.props.packageTypeTabHandler('Standalone Sim');
    }

    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            pkgPrice: 0,
            pkgTerms: '1 month',
            selectedTab: '1',
            packageType: 'Standalone Sim'
        })
    }

    render() {
        const { Option } = Select;
        return (
            <Fragment>
                <Form >
                    <Row>
                        <Col span={13}>
                            <Form.Item label="Package Name"
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}>
                                {this.props.form.getFieldDecorator('pkgName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input Package Name!',
                                        },
                                        {
                                            validator: this.PackageNameChange,
                                        }
                                    ],
                                })(
                                    <Input placeholder="Package Name" onChange={(e => this.setField('pkgName', '', '', e.target.value))} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                        </Col>
                        <Col span={6}>
                            <h4 className='priceText'>{this.state.pkgName}</h4>
                        </Col>
                    </Row>

                    {/* Package Term */}
                    <Row>
                        <Col span={13}>

                            <Form.Item
                                label="Package Terms"
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}>

                                {this.props.form.getFieldDecorator('pkgTerms', {
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
                                    placeholder="Select a Term"
                                    optionFilterProp="children"
                                    onChange={(pkgTerms => this.setField('pkgTerms', '', '', pkgTerms))}
                                    // onChange={onChange}
                                    // onFocus={onFocus}
                                    // onBlur={onBlur}
                                    // onSearch={onSearch}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    <Option value={one_month}>{one_month}</Option>
                                    <Option value={three_month}>{three_month}</Option>
                                    <Option value={six_month}>{six_month}</Option>
                                    <Option value={twelve_month}>{twelve_month}</Option>
                                </Select>)}

                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            {/* <Button type="primary" onClick={() => this.setField('pkgTerms')}>Set</Button> */}
                        </Col>
                        <Col span={7}>
                            <h4 className='priceText'>{this.state.pkgTerms}</h4>
                        </Col>
                    </Row>

                    {/* Package Price */}
                    <Row>
                        <Col span={13}>
                            <Form.Item label="Price" labelCol={{ span: 11 }}
                                validateStatus={this.state.validateStatus}
                                help={this.state.help}
                                wrapperCol={{ span: 13 }}>
                                {this.props.form.getFieldDecorator('pkgPrice', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please Input Price',
                                        }
                                    ],
                                })(<Input placeholder="Price" onChange={(e => this.setField('pkgPrice', '', '', e.target.value))} type='number' min={1} />)}

                            </Form.Item>
                        </Col>
                        <Col span={2}>
                        </Col>
                        <Col span={7}>
                            <h4 className='priceText'>Price: ${this.state.pkgPrice}</h4>
                        </Col>
                    </Row>

                    {/* Package DATA LIMIT */}
                    <Row>
                        <Col span={13}>
                            <Form.Item label="Data Limit" labelCol={{ span: 11 }}
                                validateStatus={this.state.dataLimitValidateStatus}
                                help={this.state.dataLimitHelp}
                                wrapperCol={{ span: 13 }}>
                                {this.props.form.getFieldDecorator('data_limit', {
                                    initialValue: this.state.data_limit,
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please Input Data limit',
                                        }
                                    ],
                                })(<Input placeholder="Data Limit" onChange={(e => { this.setField('data_limit', '', '', e.target.value); this.setField('data_limit', '', '', e.target.value) })} type='number' min={1} />)}

                            </Form.Item>
                        </Col>
                        <Col span={2}>
                        </Col>
                        <Col span={7}>
                            <h4 className='priceText'>Data Limit: {this.state.data_limit} MB</h4>
                        </Col>
                    </Row>

                </Form>
            </Fragment>

        )
    }
}

StandaloneSimForm = Form.create()(StandaloneSimForm);

export default StandaloneSimForm;