// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select, AutoComplete, Input } from "antd";
import { Markup } from "interweave";

// Components
import EditDealer from '../../dealers/components/editDealer';
import DealerPaymentHistory from './DealerPaymentHistory';
import DealerSalesHistory from "./DealerSalesHistory";
import DealerDomains from './DealerDomains';

// Helpers
import { convertToLang, componentSearch, checkIsArray } from '../../utils/commonUtils'
// import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
// import { getDealerDetails, editDealer } from '../../appRedux/actions'
// import RestService from "../../appRedux/services/RestServices";

// Constants
import { CONNECT_EDIT_DEALER } from "../../../constants/ActionTypes";
import {
    Button_Delete,
    Button_Activate,
    Button_Connect,
    Button_Suspend,
    Button_Undo,
    Button_passwordreset,
    Button_Ok,
    Button_Cancel,

} from '../../../constants/ButtonConstants';
import { DO_YOU_WANT_TO, OF_THIS } from '../../../constants/DeviceConstants';
import {
    DEALER_TEXT
} from '../../../constants/DealerConstants';
import CreditsLimits from "./CreditLimits";
import DemosLimit from "./DemosLimits";
import RestrictDealerAccount from "./RestrictDealerAccount";
import { ADMIN } from "../../../constants/Constants";


// user defined
const confirm = Modal.confirm;


function showConfirm(_this, dealer, action, btn_title, name = "") {
    console.log("dealer ", dealer)
    let title_Action = '';
    if (btn_title == 'SUSPEND') {
        title_Action = convertToLang(_this.props.translation[Button_Suspend], "SUSPEND ");
    } else if (btn_title == 'DELETE') {
        title_Action = convertToLang(_this.props.translation[Button_Delete], "DELETE");
    } else if (btn_title == 'UNDELETE') {
        title_Action = convertToLang(_this.props.translation[Button_Undo], "UNDELETE");
    } else if (btn_title == "RESET PASSWORD") {
        title_Action = convertToLang(_this.props.translation[Button_passwordreset], "RESET PASSWORD");
    } else {
        title_Action = btn_title;
    }

    confirm({
        title: <Markup content={(btn_title === 'DELETE') ?
            // convertToLang(_this.props.translation[''], `Do you wish to Permanently Delete Dealer ${name}?<br/> This action cannot be reversed!`)
            convertToLang(_this.props.translation[''], `Do you wish to Delete Dealer ${name}?`)
            :
            (btn_title === 'RESET PASSWORD') ?
                `${convertToLang(_this.props.translation[DO_YOU_WANT_TO], "Do you want to ")} ${title_Action} ${convertToLang(_this.props.translation[OF_THIS], " of this dealer")} ${name ? `(${name})` : ""} ?`
                :
                `${convertToLang(_this.props.translation[DO_YOU_WANT_TO], "Do you want to ")} ${title_Action} ${convertToLang(_this.props.translation[""], " this dealer ")} ${name ? `(${name})` : ""} ?`
        } />,
        onOk() {
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject);

                if (btn_title === 'RESET PASSWORD') {
                    dealer.pageName = 'dealer'
                    action(dealer);
                } else {
                    action(dealer, 'CONNECT');
                }
                //  success();

            }).catch(() => console.log('Oops errors!'));
        },
        okText: convertToLang(_this.props.translation[Button_Ok], "Ok"),
        cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
        onCancel() { },
    });
}

export default class DealerAction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dealerList: [],
            searchedValue: '',
            disabledSearchButton: true
        }
    }

    componentWillReceiveProps(nextProps) {
        // if (this.props.dealerList.length !== nextProps.dealerList.length) {
        //     this.setState({
        //         dealerList: nextProps.dealerList
        //     })
        // }
    }

    handleDealerSearch = (value) => {
        
        let dealerList = [];
        let index = -1;
        let states = {}

        if (value && this.props.dealerList && this.props.dealerList.length) {
            dealerList = componentSearch(this.props.dealerList, value)

            index = this.props.dealerList.findIndex((dealer) => (dealer.dealer_name.toLowerCase() === value.toLowerCase() || dealer.dealer_id.toString().toLowerCase() === value.toLowerCase() || dealer.dealer_email.toLowerCase() === value.toLowerCase() || dealer.link_code.toString().toLowerCase() === value.toLowerCase()));
        }


        states.dealerList = dealerList;
        states.searchedValue = value

        if (index === -1) {
            states.disabledSearchButton = true;
        } else {
            states.disabledSearchButton = false
        }
        console.log("states:", states)
        this.setState({
            ...states
        });
    }

    handleDealerChange = (e) => {
        if (e) {
            let path = `${btoa(e)}`.trim()
            this.props.history.push(path)
        }
    }

    handleDealerButtonClick = (e) => {
        if (this.state.searchedValue) {
            let path = `${btoa(this.state.searchedValue)}`.trim()
            this.props.history.push(path)
        }
    }

    render() {
        if (!this.props.dealer) {
            return null;
        }
        let dealer = this.props.dealer;

        const { dealerList } = this.state;

        const dealer_status = (dealer.account_status === "suspended") ? "Suspended" : "Activated";

        const restrict_button_type = (dealer_status === "Activated") ? "danger" : "default";
        const restrict_button_text = (dealer_status === 'Activated') ? 'Suspend' : 'Activate';

        const undo_button_type = (dealer.unlink_status === 0) ? 'danger' : "default";
        const undo_button_text = (dealer.unlink_status === 0) ? 'Delete' : 'Undelete';

        return (
            <Fragment>

                {/* Dealer Search */}
                <Card className="search_dev_id" style={{ borderRadius: 12 }}>
                    <Row gutter={16} type="flex" justify="center" align="top">
                        <Col span={24} className="gutter-row" justify="center" >
                            <h4 className="mb-6">Search Dealer</h4>
                            <AutoComplete
                                className="global-search"
                                size="large"
                                style={{ width: '100%' }}
                                dataSource={checkIsArray(dealerList).map((item, index) => {
                                    return (<Select.Option key={index} value={item.dealer_id.toString()}>{item.dealer_name}</Select.Option>)
                                })}
                                onSelect={this.handleDealerChange}
                                onSearch={this.handleDealerSearch}
                                placeholder={convertToLang(this.props.translation[""], "Search Dealer")}
                                optionLabelProp="text"
                            >
                                <Input
                                    suffix={
                                        <Button
                                            className="search-btn"
                                            style={{ marginRight: -12 }}
                                            size="large"
                                            type="primary"
                                            onClick={this.handleDealerButtonClick}
                                            disabled={this.state.disabledSearchButton}

                                        >
                                            <Icon type="search" />
                                        </Button>
                                    }
                                />
                            </AutoComplete>
                            {/* <Select
                                showSearch={true}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                style={{ width: '100%' }}
                                placeholder="Search Dealer ID"
                                onChange={this.onChangeDealer}
                            >
                                {this.renderDealerList()}
                            </Select> */}
                        </Col>
                    </Row>
                </Card>

                {/* Dealer Action */}
                <Card style={{ borderRadius: 12 }}>
                    <Row gutter={16} type="flex" justify="center" align="top">

                        {/* Activities Button */}
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button disabled style={{ width: "100%", marginBottom: 16, }} >
                                <h6 className="mb-0">Activity</h6>
                            </Button>
                        </Col>

                        {/* Domains Button */}
                        <Col
                            span={12}
                            className="gutter-row"
                            justify="center">
                            <Button
                                onClick={() => this.refs.dealerDomains.showModal(this.props.dealer, this.props.getDomains, this.props.getDealerDomains)}
                                style={{ width: "100%", marginBottom: 16, }}>
                                <h6 className="mb-0">Domains</h6>
                            </Button>
                        </Col>

                        {/* Credit Limit Button */}
                        {(this.props.authUser.type === ADMIN) ?
                            <Col className="gutter-row" justify="center" span={12} >
                                <Button style={{ width: "100%", marginBottom: 16, }}
                                    onClick={() => { this.form1.showModal() }}
                                >
                                    <h6 className="mb-0">Credit Limit</h6>
                                </Button>
                            </Col>
                            :
                            null
                        }

                        {/* Demo Button */}
                        {(this.props.authUser.type === ADMIN) ?

                            <Col className="gutter-row" justify="center" span={12} >
                                <Button
                                    style={{ width: "100%", marginBottom: 16, }}
                                    onClick={() => { this.form2.showModal()}}
                                >
                                    <h6 className="mb-0">DEMO</h6>
                                </Button>
                            </Col>
                            :
                            null
                        }

                        {/* Payment History Button */}
                        <Col
                            className="gutter-row"
                            justify="center"
                            span={12}
                        >
                            <Button
                                style={{ width: "100%", marginBottom: 16, }}
                                onClick={() => this.refs.dealerPaymentHistory.showModal(this.props.dealer, this.props.getDealerPaymentHistory)}>
                                <h6 className="mb-0">Payment History</h6>
                            </Button>
                        </Col>

                        {/* Sales History Button */}
                        <Col
                            className="gutter-row"
                            justify="center"
                            span={12}
                        >
                            <Button
                                style={{ width: "100%", marginBottom: 16, }}
                                onClick={() => this.refs.dealerSalesHistory.showModal(this.props.dealer, this.props.getDealerSalesHistory)}

                            >
                                <h6 className="mb-0">Sales History</h6>
                            </Button>
                        </Col>
                    </Row>
                </Card>

                <Card style={{ borderRadius: 12 }}>
                    <Row
                        gutter={16}
                        type="flex"
                        justify="center"
                        align="top"
                    >
                        {/* Password Button */}
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button
                                style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }}
                                onClick={() => showConfirm(this, this.props.dealer, this.props.updatePassword, 'RESET PASSWORD', this.props.dealer.dealer_name)}
                            >
                                Pass Reset
                            </Button>
                        </Col>

                        {/* Edit Button */}
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button
                                // disabled
                                style={{ width: "100%", marginBottom: 16, backgroundColor: '#FF861C', color: '#fff' }}
                                onClick={() => this.refs.editDealer.showModal(this.props.dealer, this.props.editDealer, CONNECT_EDIT_DEALER)}
                            >
                                <Icon type='edit' />
                                Edit
                            </Button>
                        </Col>

                        {/* Suspend Button */}
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button
                                type={restrict_button_type}
                                style={{ width: "100%", marginBottom: 16, }}
                                onClick={
                                    () => (!dealer.account_status) ?
                                        showConfirm(this, dealer.dealer_id, this.props.suspendDealer, 'SUSPEND', this.props.dealer.dealer_name) :
                                        showConfirm(this, dealer.dealer_id, this.props.activateDealer, 'ACTIVATE', this.props.dealer.dealer_name)
                                }
                            >
                                {restrict_button_text}
                            </Button>
                        </Col>

                        {/* Account Limit Button */}
                        {
                            (this.props.authUser.type === ADMIN) ?
                                <Col span={12} className="gutter-row" justify="center" >
                                    <Button
                                        className="btn_break_line"
                                        style={{
                                            width: "100%", marginBottom: 16,
                                            backgroundColor: 'yellow'
                                            // backgroundColor: '#f31517', color: '#fff'
                                        }}
                                        onClick={
                                            (e) => {
                                                this.restrictDealerAction.showModal(dealer, this.props.changeDealerStatus)
                                                // showConfirm(this, this.props.dealer, this.props.handleDealerChange, 'RESET PASSWORD', this.props.dealer.dealer_name)
                                            }
                                        }

                                    >
                                        {/* <Icon type="lock" className="lock_icon" /> */}
                                        Restrict
                                    </Button>
                                </Col>
                                : null
                        }

                        {/* Delete Button */}
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button
                                type={undo_button_type}
                                className="btn_break_line"
                                style={{
                                    width: "100%", marginBottom: 16,
                                    // backgroundColor: '#f31517', color: '#fff'
                                }}
                                onClick={
                                    () => (dealer.unlink_status === 0) ?
                                        showConfirm(this, dealer.dealer_id, this.props.deleteDealer, 'DELETE', this.props.dealer.dealer_name) :
                                        showConfirm(this, dealer.dealer_id, this.props.undoDealer, 'UNDELETE')
                                }
                            >
                                {undo_button_text}
                            </Button>
                        </Col>
                    </Row>
                </Card>

                <EditDealer
                    ref='editDealer'
                    // getDealerList={this.props.getDealerList} 
                    translation={this.props.translation}
                />

                <DealerPaymentHistory
                    ref='dealerPaymentHistory'
                    translation={this.props.translation}
                    paymentHistory={this.props.paymentHistory}
                />

                <CreditsLimits
                    ref='credits_limits'
                    translation={this.props.translation}
                    wrappedComponentRef={(form) => this.form1 = form}
                    dealer={this.props.dealer}
                    credits_limit={this.props.dealer.credits_limit}
                    setCreditLimit={this.props.setCreditLimit}
                />
                <DemosLimit
                    ref='demosLimit'
                    translation={this.props.translation}
                    wrappedComponentRef={(form) => this.form2 = form}
                    dealer={this.props.dealer}
                    demos={this.props.dealer.demos}
                    setDemosLimit={this.props.setDemosLimit}
                />

                <DealerSalesHistory
                    ref='dealerSalesHistory'
                    translation={this.props.translation}
                    salesHistory={this.props.salesHistory}
                />

                <DealerDomains
                    ref='dealerDomains'
                    translation={this.props.translation}
                    domainPermission={this.props.domainPermission}
                    domains={this.props.domains}
                    allDomainList={this.props.allDomainList}
                    authUser={this.props.authUser}
                    getDomains={this.props.getDomains}
                    dealerDomainLoading={this.props.dealerDomainLoading}
                // dealerDomains
                />

                <RestrictDealerAccount
                    ref='restrictDealerAction'
                    dealer={this.props.dealer}
                    wrappedComponentRef={(form) => this.restrictDealerAction = form}
                    translation={this.props.translation}
                />

            </Fragment >
        )
    }

}
