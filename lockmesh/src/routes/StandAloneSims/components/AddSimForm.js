import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, Modal, Table, Switch } from 'antd';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { checkValue, convertToLang } from '../../utils/commonUtils'
import { inventorySales } from '../../utils/columnsUtils'

import { Button_Cancel, Button_submit } from '../../../constants/ButtonConstants';
import { Required_Fields } from '../../../constants/DeviceConstants';
import Invoice from './simInvoice'

import RestService from '../../../appRedux/services/RestServices'
import { DUMY_TRANS_ID } from '../../../constants/LabelConstants';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    getParentPackages,
    getInvoiceId,
    addStandAloneSim
} from "../../../appRedux/actions";

const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error;
const { TextArea } = Input;

class AddSimForm extends Component {

    constructor(props) {
        super(props);
        const invoiceColumns = inventorySales(props.translation);
        let data_plan_column = {
            title: convertToLang(props.translation[DUMY_TRANS_ID], "DATA LIMIT"),
            dataIndex: 'data_limit',
            className: '',
            align: "center",
            key: 'data_limit'
        }
        invoiceColumns.splice(3, 0, data_plan_column)
        this.state = {
            visible: false,
            term: undefined,
            pkg_id: undefined,
            data_pkg_id: "",
            invoice_modal: false,
            invoiceVisible: false,
            invoiceType: '',
            invoiceID: 'PI00001',
            paidByUser: "PAID",
            packages: [],
            loading: false,
            invoiceColumns: invoiceColumns,
            serviceData: {},
            showConfirmCredit: false,
            standAlonePackages: [],
            dataPlanPackages: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                RestService.activateICCID(values.iccid).then((response) => {
                    if (response.data) {
                        if (response.data.valid) {
                            let packages = []
                            let standAlonePackages = []
                            let dataPlanPackages = []
                            if (this.state.pkg_id) {
                                standAlonePackages = this.state.standAlonePackages.filter(item => item.id === this.state.pkg_id)

                            }
                            if (this.state.data_pkg_id) {
                                dataPlanPackages = this.state.dataPlanPackages.filter(item => item.id === this.state.data_pkg_id)
                            }
                            packages = [...standAlonePackages, ...dataPlanPackages]
                            let total_price = 0
                            if (packages && packages.length) {
                                packages.map((item) => {
                                    total_price = total_price + Number(item.pkg_price)
                                })
                            }
                            values.total_price = total_price
                            this.setState({
                                loading: false,
                                showConfirmCredit: true,
                                packages: packages,
                                serviceData: values
                            })
                        } else {
                            error({
                                title: response.data.msg
                            })
                            this.setState({
                                loading: false
                            })
                        }
                    }
                    // should be logged out
                    else {
                        this.setState({
                            loading: false
                        })
                    }
                });
            }

        });
    }

    validateICCID = (rule, value, callback) => {
        if ((value !== undefined) && value.length > 0) {

            if (/^[0-9]+$/.test(value)) {
                if (value.length != 20 && value.length != 19) {
                    return callback(`${convertToLang(this.props.translation[''], "ICC ID should be 19 or 20 digits long")}  :(${value.length})`);
                }
            } else {
                return callback(convertToLang(this.props.translation[''], "Please insert only numbers"));
            }
        }
        return callback();
    }

    componentDidMount() {
        console.log("DID MOUNT");
        this.props.getParentPackages()
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            let updateState = {}
            if (this.props.invoiceID !== prevProps.invoiceID) {
                updateState.invoiceID = this.props.invoiceID
                // this.setState({ invoiceID: nextProps.invoiceID })
            }
            if (Object.keys(updateState).length) {
                this.setState(updateState)
            }
        }
    }

    handleCancel = () => {
        this.handleReset();
        this.props.handleCancel();
    }

    handleChange = (e) => {
        this.setState({ type: e.target.value });
    }

    onChangeTerm = (value) => {
        value = value + ' month'
        let standalonePackages = this.props.packages.filter(item => item.pkg_term == value && item.package_type === 'standalone_sim')
        let dataPackages = this.props.packages.filter(item => item.pkg_term == value && item.package_type === 'data_plan')
        this.props.form.setFieldsValue({
            data_plan: '',
            package: undefined,
        });
        this.setState({
            term: value,
            standAlonePackages: standalonePackages,
            dataPlanPackages: dataPackages,
            pkg_id: undefined,
            data_plan_id: ""
        });
    }


    confirmRenderList = () => {
        if (this.state.packages && Array.isArray(this.state.packages) && this.state.packages.length) {
            return this.state.packages.map((item, index) => {
                return {
                    id: item.id,
                    rowKey: item.id,
                    item: item.package_type === 'standalone_sim' ? "STAND ALONE SIM" : `Data plan`,
                    description: item.pkg_name,
                    data_limit: item.data_limit ? item.data_limit : 0,
                    term: this.state.term,
                    unit_price: item.pkg_price,
                    quantity: 1,
                    line_total: item.pkg_price
                }
            });
        }
        else {
            return []
        }
    }

    submitServicesConfirm(pay_now) {
        this.props.getInvoiceId();
        this.state.serviceData.pay_now = pay_now;

        if (pay_now) {
            if ((this.state.serviceData.total_price) <= this.props.user_credit || !this.state.serviceData.pay_now) {
                this.setState({ invoiceVisible: true, invoiceType: "pay_now" })
            } else {
                showCreditPurchase(this, "Your Credits are not enough to apply these services. Please select other services OR Purchase Credits.")
            }
        } else {
            let after_pay_credits = this.props.user_credit - this.state.serviceData.total_price
            let credits_limit = this.props.credits_limit
            if (credits_limit > after_pay_credits) {
                showCreditPurchase(this, "Your Credits limits will exceed after apply this service. Please select other services OR Purchase Credits.")
            } else {
                this.setState({ invoiceVisible: true, invoiceType: "pay_later" })
            }
        }

    }

    handleOkInvoice = () => {
        // console.log("handleOk for invoice", this.state.serviceData)

        if (this.state.serviceData.total_price <= this.props.user_credit || !this.state.serviceData.pay_now) {
            this.state.serviceData.paid_by_user = this.state.paidByUser
            this.props.addStandAloneSim(this.state.serviceData);
            this.props.handleCancel();
            this.handleReset();
            this.setState({
                serviceData: {},
                showConfirmCredit: false
            })
        } else {
            showCreditPurchase(this, "Your Credits are not enough to apply these services. Please select other services OR Purchase Credits.")
        }

        this.setState({
            invoiceVisible: false,
            // showConfirmCredit: false,
            servicesModal: false
        })
    }

    handleCancelInvoice = () => {
        this.setState({ invoiceVisible: false })
    }

    handlePaidUser = (e) => {
        if (e) {
            this.setState({
                paidByUser: "PAID"
            })
        } else {
            this.setState({
                paidByUser: "UNPAID"
            })
        }
    }



    render() {

        const { visible, loading } = this.state;

        return (
            <>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>
                    {(this.props.user) ? <Form.Item>
                        {this.props.form.getFieldDecorator('user_id', {
                            initialValue: this.props.user.user_id,
                        })(
                            <Input type='hidden' />
                        )}
                    </Form.Item> : null}
                    {/* Sim ID Input */}
                    <Form.Item
                        label={convertToLang(this.props.translation[""], "ICCID")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('iccid', {
                            initialValue: "",
                            rules: [
                                {
                                    required: true, message: "ICCID is required"
                                },
                                {
                                    validator: (rule, value, callback) => { this.validateICCID(rule, value, callback) },
                                }
                            ]
                        })(
                            <Input
                                type='number' placeholder={convertToLang(this.props.translation[""], "Enter ICCID")}
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        label={convertToLang(this.props.translation[""], "NAME")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('name', {
                            initialValue: "",
                        })(
                            <Input
                                placeholder={convertToLang(this.props.translation[""], "Enter Name")}
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        label={convertToLang(this.props.translation[""], "EMAIL")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('email', {
                            initialValue: "",
                            rules: [{
                                type: 'email',
                                message: "Please enter a valid email address"
                            }]
                        })(
                            <Input
                                placeholder={convertToLang(this.props.translation[""], "Enter Email")}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[""], "SELECT TERM")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('term', {
                            initialValue: this.state.term,
                            rules: [
                                {
                                    required: true, message: "Term is required"
                                },
                            ],
                        })(
                            <Select
                                showSearch
                                placeholder={convertToLang(this.props.translation[""], "Select Term")}
                                optionFilterProp="children"
                                onChange={(value) => this.onChangeTerm(value)}
                                autoComplete="new-password"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value={'1'}>1 Month</Select.Option>
                                <Select.Option value={'3'}>3 Month</Select.Option>
                                <Select.Option value={'6'}>6 Month</Select.Option>
                                <Select.Option value={'12'}>12 Month</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[""], "SELECT PACKAGE")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('package', {
                            initialValue: this.state.pkg_id,
                            rules: [
                                {
                                    required: true, message: "Package is required"
                                },
                            ],
                        })(
                            <Select
                                showSearch
                                placeholder={convertToLang(this.props.translation[""], "Select Package")}
                                optionFilterProp="children"
                                onChange={(e) => this.setState({ pkg_id: e })}
                                autoComplete="new-password"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {this.state.standAlonePackages.map((pkg) => {
                                    return (<Select.Option key={pkg.id} value={pkg.id}>{`${pkg.pkg_name} (${pkg.data_limit} MB for ${pkg.pkg_price} Credits) `}</Select.Option>)
                                })}
                            </Select>
                        )}
                    </Form.Item>

                    <Form.Item
                        label={convertToLang(this.props.translation[""], "ADD ADDITIONAL DATA PLAN")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('data_plan', {
                            initialValue: this.state.data_pkg_id,
                        })(
                            <Select
                                showSearch
                                placeholder={convertToLang(this.props.translation[""], "Select data plan Package")}
                                optionFilterProp="children"
                                onChange={(e) => this.setState({ data_pkg_id: e })}
                                autoComplete="new-password"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value=''>ADD DATA PLAN</Select.Option>
                                {this.state.dataPlanPackages.map((pkg) => {
                                    return (<Select.Option key={pkg.id} value={pkg.id}>{`${pkg.pkg_name} (${pkg.data_limit} MB for ${pkg.pkg_price} Credits) `}</Select.Option>)
                                })}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[""], "NOTE")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('note', {
                            initialValue: "",
                        })(
                            <TextArea
                                // value={value}
                                // onChange={this.onChange}
                                placeholder="Add Note"
                                autosize={{ minRows: 3, maxRows: 5 }}
                            />
                        )}
                    </Form.Item>



                    <Form.Item className="edit_ftr_btn"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button key="back" type="button" onClick={this.handleCancel}> {convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>
                        <Button type="primary" htmlType="submit" loading={this.state.loading}> {convertToLang(this.props.translation[Button_submit], "Submit")} </Button>
                    </Form.Item>



                </Form>
                {/* Confirmation Modal */}
                <Modal
                    width={900}
                    visible={this.state.showConfirmCredit}
                    title={<span style={{ fontWeight: "bold" }}> {convertToLang(this.props.translation[DUMY_TRANS_ID], "Do You Really want to apply selected packages on this Sim ?")} </span>}
                    maskClosable={false}
                    // onOk={this.handleOk}
                    closable={false}
                    onCancel={
                        () => {
                            this.setState({
                                showConfirmCredit: false
                            })
                        }
                    }
                    footer={null}
                    className="edit_form"
                >
                    <Fragment>
                        <div style={{ marginTop: 20 }}>
                            <Table
                                id='packages'
                                className={"devices mb-20"}
                                // rowSelection={packageRowSelection}
                                size="middle"
                                bordered
                                columns={this.state.invoiceColumns}
                                dataSource={this.confirmRenderList()}
                                pagination={
                                    false
                                }
                            />
                        </div >
                        <div>
                            <h5 style={{ textAlign: "right" }}><b>Sub Total :  {this.state.serviceData.total_price} Credits</b></h5>
                            <h4 style={{ textAlign: "center" }}><b>There will be a charge of {this.state.serviceData.total_price} Credits</b></h4>
                        </div>
                        {/* {(this.state.term !== '0') ?
                            <div>
                                <h4 style={{ textAlign: "center", color: 'red' }}>If you PAY NOW you will get 3% discount.</h4>
                            </div>
                            : null
                            } */}

                        <div className="edit_ftr_btn" >
                            <Button onClick={() => { this.setState({ showConfirmCredit: false }) }}>CANCEL</Button>
                            <Fragment>
                                {(this.props.user_credit < (this.state.serviceData.total_price) && this.props.user.account_balance_status === 'active') ?
                                    <Button type='primary' onClick={() => { this.submitServicesConfirm(false) }}>PAY LATER</Button>
                                    : null}
                                <Button style={{ backgroundColor: "green", color: "white" }} onClick={() => { this.submitServicesConfirm(true) }}>PAY NOW (-3%)</Button>
                            </Fragment>

                        </div >
                    </Fragment>
                </Modal>

                {/* Invoices Modal */}
                <Modal
                    width="850px"
                    visible={this.state.invoiceVisible}
                    maskClosable={false}
                    closable={false}
                    // title={convertToLang(this.props.translation[""], "MDM PANEL SERVICES")}
                    onOk={this.handleOkInvoice}
                    onCancel={this.handleCancelInvoice}
                    className="edit_form"
                    bodyStyle={{ overflow: "overlay" }}
                    okText={convertToLang(this.props.translation[""], "CHECKOUT")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <Invoice
                        // ref="invoice_modal"
                        PkgSelectedRows={this.state.packages}
                        proSelectedRows={[]}
                        renderInvoiceList={this.confirmRenderList}
                        subTotal={this.state.serviceData.total_price}
                        invoiceType={this.state.invoiceType}
                        term={this.state.serviceData.term}
                        duplicate={0}
                        // deviceAction={"sim"}
                        hardwarePrice={0}
                        hardwares={[]}
                        user_id={null}
                        invoiceID={this.state.invoiceID}
                        translation={this.props.translation}
                        page_name='sim'
                        iccid={this.state.serviceData.iccid}

                    />
                    <div style={{ float: "right" }}><b>PAID BY USER: </b> <Switch size="small" defaultChecked onChange={this.handlePaidUser} /></div>
                </Modal>
            </>
        )

    }
}

const WrappedAddDeviceForm = Form.create()(AddSimForm);
// const WrappedAddDeviceForm = Form.create({ name: 'register' })(AddDevice);
// export default WrappedRegistrationForm;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getInvoiceId: getInvoiceId,
        getParentPackages,
        addStandAloneSim
    }, dispatch);
}
var mapStateToProps = ({ routing, devices, device_details, users, settings, sidebar, auth, account }) => {
    // console.log(devices.parent_packages, "PARENT PACLKAGES")
    return {
        invoiceID: users.invoiceID,
        routing: routing,
        translation: settings.translation,
        user_credit: sidebar.user_credit,
        credits_limit: sidebar.credits_limit,
        user: auth.authUser,
        packages: devices.parent_packages,
        invoiceID: users.invoiceID,
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(WrappedAddDeviceForm);

function showCreditPurchase(_this, msg) {
    confirm({
        title: msg,
        okText: "PURCHASE CREDITS",
        onOk() {
            _this.props.history.push('/account')
        },
        onCancel() {

        },

    })
}