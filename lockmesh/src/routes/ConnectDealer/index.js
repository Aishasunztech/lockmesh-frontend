// libraries
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select, Avatar } from "antd";
import moment from 'moment-timezone';

// methods, constants and components
import AppFilter from '../../components/AppFilter';
import DealerAction from "./components/DealerActions";
import DealerNotFoundPage from '../InvalidPage/dealerNotFound';
import CircularProgress from "components/CircularProgress/index";
import DealerPaymentHistory from './components/DealerPaymentHistory';
import DealerOverDuePayments from './components/DealerOverDuePayments';

// helpers and actions
import RestService from "../../appRedux/services/RestServices";
import { getColor, isBase64, convertToLang, checkValue, checkTimezoneValue, convertTimezoneValue } from "../utils/commonUtils"
import {
    getDealerDetails,
    editDealer,
    updatePassword,
    suspendDealer,
    activateDealer,
    deleteDealer,
    undoDealer,
    getDealerPaymentHistory,
    setCreditLimit,
    getDealerSalesHistory,
    getDealerDomains,
    getAllDealers,
    setDemosLimit,
    changeDealerStatus,
    getDomains,
    connectDealerDomainPermission
} from '../../appRedux/actions'
import image from '../../assets/images/warning.png'
import styles from './connect_dealer.css'
import { TIMESTAMP_FORMAT } from "../../constants/Application";

class ConnectDealer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dealer_id: isBase64(props.match.params.dealer_id),
            currency: 'USD',
            currency_sign: '$',
            currency_price: null,
        }

        this.dealerAccountInfoColumns = [
            {
                dataIndex: 'name',
                key: 'name',
                className: 'ac_pro_txt',
            },
            {
                dataIndex: 'value',
                key: 'value',
                className: 'ac_pro_val',
            },
        ];

        this.dealerInfoColumns = [
            {
                dataIndex: 'name',
                key: 'name',
                className: 'dealer_info',
                title: 'Status',
            },
            {
                dataIndex: 'value',
                key: 'value',
                className: 'dealer_values',
                title: '',

            },
        ]

        this.overDueColumns = [
            {
                title: 'A',
                dataIndex: 'a',
                key: 'a',
                className: '',
            },
            {
                title: 'B',
                dataIndex: 'b',
                key: 'b',
                className: '',
            },
        ]

        this.a_s_columns = [
            {
                title: 'RESTRICTED',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '21+ days Overdue',
                dataIndex: 'value',
                key: 'value',
            },
        ];
    }

    componentDidMount() {
        const dealer_id = isBase64(this.props.match.params.dealer_id);
        if (dealer_id) {
            this.props.getDealerDetails(dealer_id);
            this.props.getAllDealers();
        }
    }

    componentDidUpdate(prevProps) {
        // console.log('hi')
        // const dealer_id = isBase64(this.props.match.params.dealer_id);

    }
    componentWillReceiveProps(nextProps) {
        // const dealer_id = isBase64(nextProps.match.params.dealer_id);

    }
    componentWillUnmount() {
        // const dealer_id = isBase64(this.props.match.params.dealer_id);
    }

    onChangeCurrency = (e, field) => {

        let _this = this;
        if (e === 'USD') {
            this.setState({
                currency: 'usd',
                currency_price: null,
            })
        } else {
            RestService.exchangeCurrency(e).then((response) => {
                if (response.data.status) {
                    console.log(this.props.dealer.credits * response.data.currency_unit)
                    _this.setState({
                        currency: e,
                        currency_price: (this.props.dealer.credits * response.data.currency_unit),
                    })
                    // if (this.props.dealer.credits > 0) {
                    //     this.setState({
                    //         currency: e,
                    //         currency_price: this.props.dealer.credits * response.data.currency_unit
                    //     })
                    // } else {

                    // }
                }
            })
        }
    }

    renderDealerInfo = () => {
        let dealer = this.props.dealer;
        // console.log("dealer ", dealer, this.props.authUser);
        let dealer_tz = checkTimezoneValue(dealer.timezone);
        // console.log("dealer_tz ", dealer_tz)
        if (dealer) {
            const account_balance_status = (dealer.account_balance_status == 'restricted') ? "Restriction Level 1" : (dealer.account_balance_status === "suspended") ? "Restriction Level 2" : "Active";
            let account_balance_style = (dealer.account_balance_status == 'restricted') ? 'restrict1' : (dealer.account_balance_status === "suspended") ? 'restrict2' : 'active';
            return [
                {
                    key: '8',
                    name: <a className="break_text">Account Balance Status</a>,
                    value: <span className='text_center_td'>{account_balance_status.toUpperCase()}</span>,
                    className: account_balance_style
                },
                {
                    key: '1',
                    name: <a>Dealer Name</a>,
                    value: (dealer.dealer_name) ? dealer.dealer_name : 'N/A',
                },
                {
                    key: '2',
                    name: <a>Dealer Pin</a>,
                    value: (dealer.link_code) ? dealer.link_code : 'N/A',
                },
                {
                    key: '3',
                    name: <a>Dealer ID</a>,
                    value: (dealer.dealer_id) ? dealer.dealer_id : 'N/A',
                },
                {
                    key: '4',
                    name: <a>Dealer Email</a>,
                    value: <div className="break_text">{(dealer.dealer_email) ? dealer.dealer_email : 'N/A'}</div>,
                },
                {
                    key: '5',
                    name: <a>Devices</a>,
                    value: (dealer.connected_devices) ? dealer.connected_devices : 'N/A',
                },
                {
                    key: '6',
                    name: <a>Demos</a>,
                    value: dealer.demos,
                },
                {
                    key: '7',
                    name: <a>Remaining Demos</a>,
                    value: dealer.remaining_demos,
                },
                // {
                //     key: '8',
                //     name: <a>Status</a>,
                //     value: dealer_status,
                // },
                {
                    key: '9',
                    name: <a>Parent Dealer</a>,
                    value: (dealer.parent_dealer) ? dealer.parent_dealer : 'N/A',
                },
                {
                    key: 41,
                    name: <a>{convertToLang(this.props.translation[""], "COMPANY NAME")}</a>,
                    value: checkValue(dealer.company_name),
                },
                {
                    key: 42,
                    name: <a>{convertToLang(this.props.translation[""], "COMPANY ADDRESS")}</a>,
                    value: <span className="company_address">{checkValue(dealer.company_address)}</span>,
                },
                {
                    key: 43,
                    name: <a>{convertToLang(this.props.translation[""], "CITY")}</a>,
                    value: checkValue(dealer.city),
                },
                {
                    key: 44,
                    name: <a>{convertToLang(this.props.translation[""], "STATE/PROVINCE")}</a>,
                    value: checkValue(dealer.state),
                },
                {
                    key: 45,
                    name: <a>{convertToLang(this.props.translation[""], "COUNTRY")}</a>,
                    value: checkValue(dealer.country),
                },
                {
                    key: 46,
                    name: <a>{convertToLang(this.props.translation[""], "POSTAL CODE")}</a>,
                    value: checkValue(dealer.postal_code),
                },
                {
                    key: 47,
                    name: <a>{convertToLang(this.props.translation[""], "TEL #")}</a>,
                    value: checkValue(dealer.tel_no),
                },
                {
                    key: 48,
                    name: <a>{convertToLang(this.props.translation[""], "WEBSITE")}</a>,
                    value: checkValue(dealer.website),
                },
                {
                    key: 49,
                    name: <a>{convertToLang(this.props.translation[""], "TIMEZONE")}</a>,
                    value: dealer_tz,
                },
                {
                    key: '10',
                    name: <a>Last Login</a>,
                    value: convertTimezoneValue(this.props.authUser.timezone, dealer.last_login),
                    // value: (dealer.last_login) ? moment(dealer.last_login).tz(convertTimezoneValue(this.props.authUser.timezone)).format("YYYY-MM-DD HH:mm:ss") : 'N/A',
                    // value: (dealer.last_login) ? dealer.last_login : 'N/A',
                },
                {
                    key: '11',
                    name: <a>Start Date</a>,
                    value: convertTimezoneValue(this.props.authUser.timezone, dealer.created),
                    // value: (dealer.created) ? moment(dealer.created).tz(convertTimezoneValue(this.props.authUser.timezone)).format("YYYY-MM-DD HH:mm:ss") : 'N/A',
                    // value: this.props.dealer.created,
                },

            ]
        } else {
            return []
        }
    }

    ac_st_title = () => {
        return <h4 className="credit_modal_heading">{convertToLang(this.props.translation[""], "Account Status")}</h4>
    };

    renderAccountStatus = () => {
        let statusBGC, statusDays;
        let account_status_paragraph = '';
        if (this.props.dealer.account_balance_status_by === 'due_credits') {
            if (this.props.dealer.account_balance_status === 'restricted' && this.props.overdueDetails._30to60 > 0) {
                statusBGC = 'bg_yellow';
                statusDays = '31+ days Overdue';
                account_status_paragraph = "Please clear payment over 31+ days to activate \"PAY LATER\" feature";
            } else if (this.props.dealer.account_balance_status === 'restricted') {
                statusBGC = 'bg_yellow';
                statusDays = '21+ days Overdue';
                account_status_paragraph = "Please clear payment over 21+ days to activate \"PAY LATER\" feature";
            } else if (this.props.dealer.account_balance_status === 'suspended') {
                statusBGC = 'bg_red';
                statusDays = '60+ days Overdue';
                account_status_paragraph = "Please clear 60+ days payment to allow new device activation";
            } else {
                statusBGC = 'bg_green';
                statusDays = 'No Overdue';
            }
        } else if (this.props.dealer.account_balance_status_by === 'admin') {
            statusBGC = 'bg_red';
            statusDays = 'admin';
        } else {
            statusBGC = 'bg_green';
            statusDays = 'No Overdue';
        }

        return [
            {
                name: <h5 className={'weight_600 p-5 text-uppercase ' + statusBGC} >Restricted By</h5>,
                value: statusDays
            },
            {
                name: <h5 className={'weight_600 p-5 text-uppercase ' + statusBGC} >{this.props.dealer.account_balance_status}</h5>,
                value: <h5 className="weight_600 bg_brown p-5">{statusDays} </h5>,
            }
        ];
    };

    renderAccountData = () => {
        let dealer = this.props.dealer;
        if (dealer) {

            return [
                {
                    key: '1',
                    name: 'Balance (Credits):',
                    value: (dealer.credits) ? dealer.credits : 0,
                },
                {
                    key: '2',
                    name: 'Currency:',
                    value: (
                        <Select style={{ margin: '-8px 0', width: '100%' }} defaultValue="USD" onChange={(e) => { this.onChangeCurrency(e, 'currency') }} >
                            <Select.Option value="USD">USD</Select.Option>
                            <Select.Option value="CAD">CAD</Select.Option>
                            <Select.Option value="EUR">EUR</Select.Option>
                            <Select.Option value="VND">VND</Select.Option>
                            <Select.Option value="CNY">CNY</Select.Option>
                        </Select>
                    ),
                },
                {
                    key: '3',
                    name: 'USD equivalent:',
                    value: (this.state.currency_price !== null) ? this.state.currency_price : dealer.credits,
                },
                {
                    key: '4',
                    name: 'Credit Limit (Credits):',
                    value: Math.abs(dealer.credits_limit),
                }
            ]
        } else {
            return []
        }
    }

    renderOverDue = () => {
        let dealer = this.props.dealer;
        if (dealer) {
            // console.log(dealer._0to21,
            //     dealer._0to21_dues,
            //     dealer._21to30,
            //     dealer._21to30_dues,
            //     dealer._30to60,
            //     dealer._30to60_dues,
            //     dealer._60toOnward,
            //     dealer._60toOnward_dues)
            // _0to21,
            // _0to21_dues,
            // _21to30,
            // _21to30_dues,
            return [
                {
                    key: '1',
                    a:
                        <div className="cursor_p"
                            onClick={() => this.refs.dealerOverDuePayments.showModal(this.props.dealer, dealer._0to21_dues_history)}
                        >
                            <span className="overdue_txt">0-21:</span>
                            <span className="overdue_values">{dealer._0to21_dues}</span>
                        </div>,
                    b:
                        <div className="cursor_p"
                            onClick={() => this.refs.dealerOverDuePayments.showModal(this.props.dealer, dealer._21to30_dues_history)}
                        >
                            <span className="overdue_txt">21+:</span>
                            <span className="overdue_values">{dealer._21to30_dues}</span>
                        </div>,
                },
                {
                    key: '2',
                    // a: <div><span className="overdue_txt">0-21:</span> <span className="overdue_values">{dealer._0to21_dues}</span></div>,
                    // b: <div><span className="overdue_txt">21+:</span> <span className="overdue_values">{dealer._21to30_dues}</span></div>,
                    a:
                        <div className="cursor_p"
                            onClick={() => this.refs.dealerOverDuePayments.showModal(this.props.dealer, dealer._30to60_dues_history)}
                        >
                            <span className="overdue_txt">30+:</span>
                            <span className="overdue_values">{dealer._30to60_dues}</span>
                        </div>,
                    b:
                        <div className="cursor_p"
                            onClick={() => this.refs.dealerOverDuePayments.showModal(this.props.dealer, dealer._60toOnward_history)}
                        >
                            <span className="overdue_txt">60+:</span>
                            <span className="overdue_values">{dealer._60toOnward_dues}</span>
                        </div>,
                }
            ]
        } else {
            return []
        }
    }

    render() {
        let dealer = this.props.dealer;
        let dealer_status = '';
        let restricted_by = ''
        let restricted_level = ''
        let account_status_message1 = ''
        let account_status_message2 = ''
        let account_balance_style_icon = ''

        if (dealer) {
            dealer_status = (dealer.unlink_status == 1) ? "Archived" : (dealer.account_status === "suspended") ? "Suspend" : "Active";
            restricted_by = dealer.account_balance_status_by === 'admin' ? 'Admin' : "Due Credits"
            restricted_level = dealer.account_balance_status === 'restricted' ? 'Restriction Level 1' : 'Restriction Level 2'
            account_status_message1 = "Account " + restricted_level + " by " + restricted_by
            account_status_message2 = (dealer.account_balance_status === 'restricted' ? "(Pay Later feature disabled)" : "(You may not add new devices)")
            account_balance_style_icon = (dealer.account_balance_status == 'restricted') ? 'restrict1_icon' : (dealer.account_balance_status === "suspended") ? 'restrict2_icon' : 'active';
        }

        this.dealerInfoColumns[1].title = dealer_status.toUpperCase();
        return (

            <Fragment>
                {this.props.isLoading ? <CircularProgress /> : this.props.dealer ?
                    <Fragment>

                        {/* Dealer Info Page */}
                        <AppFilter
                            pageHeading="Dealer Profile Page"
                        />

                        {/* {this.props.dealer ? */}
                        <Row gutter={16} type="flex" align="top">

                            {/* Dealer Information */}
                            <Col className="" xs={24} sm={24} md={8} lg={8} xl={8}>
                                <Card style={{ borderRadius: 12 }} className="height_auto">
                                    <h2 style={{ textAlign: "center" }}>Dealer Info</h2>
                                    <Divider className="mb-0" />
                                    <Table
                                        columns={this.dealerInfoColumns}
                                        bordered
                                        // showHeader={false}
                                        dataSource={this.renderDealerInfo()}
                                        rowClassName={(record) => (record.className) ? record.className : ''}
                                        pagination={false}
                                        className="ac_pro_table profile_table"
                                    />
                                </Card>
                            </Col>

                            {/* Dealer Account Information */}
                            <Col className="" xs={24} sm={24} md={8} lg={8} xl={8}>
                                <Card className="" style={{ borderRadius: 12 }}>
                                    <h2 style={{ textAlign: "center" }}>Account Profile</h2>
                                    <Divider className="mb-0" />
                                    {
                                        dealer.account_balance_status !== 'active' ?
                                            <Row style={{ marginTop: 10 }}>
                                                <Col span={19}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <h4>{account_status_message1} <br /> {account_status_message2}</h4>
                                                    </div>

                                                </Col>
                                                <Col span={5}>
                                                    {/* <Avatar className="gx-size-30"
                                                        alt={""}
                                                        src={image} /> */}
                                                    <Icon className={`${account_balance_style_icon}`} type="info-circle" />
                                                </Col>

                                            </Row>
                                            :
                                            null
                                    }

                                    <Row>
                                        {/* Dealer Avatar */}
                                        <Col span={24} className="text-center">
                                            <div className="text-left">
                                                <img src={require("assets/images/profile-image.png")} className="prof_pic" width="85px" />
                                                <div className="name_type">
                                                    <h1 className="mb-0 d_n_vh_vw">{(this.props.dealer) ? this.props.dealer.dealer_name : 'N/A'}</h1>
                                                    <p style={{ textTransform: 'capitalize', }}>({(this.props.dealer) ? this.props.dealer.dealer_type : 'N/A'})</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            {/* Account Data Information */}
                                            <Table
                                                columns={this.dealerAccountInfoColumns}
                                                bordered
                                                showHeader={false}
                                                dataSource={this.renderAccountData()}
                                                pagination={false}
                                                className="ac_pro_table"
                                            />
                                            {/* OverDue Information */}
                                            <div>
                                                <h4 className="mt-13 border_bottom">Overdue </h4>
                                                <p className='mb-4'>(click on overdue period to check pending payments)</p>
                                            </div>
                                            <Table
                                                columns={this.overDueColumns}
                                                bordered
                                                showHeader={false}
                                                dataSource={this.renderOverDue()}
                                                pagination={false}
                                                className="ovd_table"
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            {/* Dealer Action Buttons */}
                            <Col className="side_action right_bar" xs={24} sm={24} md={8} lg={8} xl={8} >
                                <DealerAction
                                    // translation
                                    translation={this.props.translation}

                                    // dealer information
                                    dealerList={this.props.dealerList}
                                    dealer={this.props.dealer}
                                    paymentHistory={this.props.paymentHistory}
                                    salesHistory={this.props.salesHistory}
                                    domains={this.props.domains}
                                    history={this.props.history}
                                    authUser={this.props.authUser}
                                    allDomainList={this.props.allDomainList}
                                    // dealer actions
                                    updatePassword={this.props.updatePassword}
                                    editDealer={this.props.editDealer}

                                    suspendDealer={this.props.suspendDealer}
                                    activateDealer={this.props.activateDealer}
                                    deleteDealer={this.props.deleteDealer}
                                    undoDealer={this.props.undoDealer}

                                    getDomains={this.props.getDomains}
                                    getDealerDomains={this.props.getDealerDomains}
                                    getDealerPaymentHistory={this.props.getDealerPaymentHistory}
                                    setCreditLimit={this.props.setCreditLimit}
                                    setDemosLimit={this.props.setDemosLimit}
                                    getDealerSalesHistory={this.props.getDealerSalesHistory}
                                    changeDealerStatus={this.props.changeDealerStatus}
                                    domainPermission={this.props.domainPermission}
                                    dealerDomainLoading={this.props.dealerDomainLoading}
                                />
                            </Col>
                        </Row>

                        {/* Dealer Payment History for overDues */}
                        <DealerPaymentHistory
                            ref='dealerPaymentHistory'
                            translation={this.props.translation}
                            paymentHistory={this.props.paymentHistory}
                        />

                        <DealerOverDuePayments
                            ref="dealerOverDuePayments"
                            translation={this.props.translation}
                        />
                    </Fragment>
                    : <DealerNotFoundPage />
                }
            </Fragment >
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDealerDetails: getDealerDetails,
        editDealer: editDealer,
        updatePassword: updatePassword,
        suspendDealer: suspendDealer,
        activateDealer: activateDealer,
        deleteDealer: deleteDealer,
        undoDealer: undoDealer,
        getDealerPaymentHistory: getDealerPaymentHistory,
        setCreditLimit: setCreditLimit,
        setDemosLimit: setDemosLimit,
        getDealerSalesHistory: getDealerSalesHistory,
        getDealerDomains: getDealerDomains,
        getAllDealers: getAllDealers,
        changeDealerStatus: changeDealerStatus,
        getDomains: getDomains,
        domainPermission: connectDealerDomainPermission
    }, dispatch);
}

var mapStateToProps = ({ dealer_details, dealers, settings, auth, account }) => {
    return {
        translation: settings.translation,
        dealer: dealer_details.dealer,
        dealerList: dealers.dealers, // dealers.parent_dealers,
        domains: dealer_details.domains,
        allDomainList: account.domainList,
        paymentHistory: dealer_details.paymentHistory,
        salesHistory: dealer_details.salesHistory,
        isLoading: dealer_details.connectDealerLoading,
        authUser: auth.authUser,
        // dealers: dealers.textTransform
        dealerDomainLoading: dealer_details.dealerDomainLoading
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDealer);