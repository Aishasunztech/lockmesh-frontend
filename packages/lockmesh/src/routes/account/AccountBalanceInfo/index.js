// libraries
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Button, Row, Col, Select, Input, Checkbox, Icon } from "antd";

// components
import AppFilter from '../../../components/AppFilter';
import CircularProgress from "../../../components/CircularProgress";
import CreditsModal from '../../../components/CreditsModal/index';

// actions
import {
    getLatestPaymentHistory,
    getOverdueDetails,
    getUserCredit
} from "../../../appRedux/actions";

// Helpers 
import { componentSearch, titleCase, convertToLang, checkIsArray } from '../../utils/commonUtils';



var copyInnerContent = [];
var status = true;
class AccountBalanceInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
        };
    }
    componentDidMount() {
        this.props.getUserCredit()
        this.props.getLatestPaymentHistory({ limit: 10, type: 'credits' })
        this.props.getOverdueDetails();
    }

    componentWillReceiveProps(nextProps) {

    }

    handleComponentSearch = (value) => {

        // console.log('searched keyword:', value);

        try {
            if (value && value.length) {
                if (status) {
                    copyInnerContent = this.state.innerContent;
                    status = false;
                }
                let foundContent = componentSearch(copyInnerContent, value);

                if (foundContent.length) {
                    this.setState({
                        innerContent: foundContent,
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
            checkIsArray(copyInnerContent).forEach((item) => {

                if (item[e.target.name] !== undefined) {
                    if ((typeof item[e.target.name]) === 'string') {
                        if (item[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoItems.push(item);
                        }
                    } else if (item[e.target.name] !== null) {
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

    render() {
        // console.log(this.state.tabselect);
        // console.log(this.state.columns, window.location.pathname.split("/").pop(), this.state.options)
        return (

            <div>
                {
                    this.props.isloading ?
                        <CircularProgress />
                        :
                        <div>
                            <AppFilter
                                isAddButton={false}
                                translation={this.props.translation}
                                pageHeading={convertToLang(this.props.translation[""], "Account Balance Info")}
                            />
                            <CreditsModal
                                ref='credits_modal'
                                translation={this.props.translation}
                                user_credit={this.props.user_credit}
                                due_credit={this.props.due_credit}
                                latestPaymentTransaction={this.props.latestPaymentTransaction}
                                overdueDetails={this.props.overdueDetails}
                                account_balance_status={this.props.account_balance_status}
                                account_balance_status_by={this.props.account_balance_status_by}
                            />
                        </div>
                }
            </div>
        );
    }
}


var mapStateToProps = ({ settings, auth, sidebar, account }) => {

    return {
        translation: settings.translation,
        user: auth.authUser,
        user_credit: sidebar.user_credit,
        due_credit: sidebar.due_credit,
        latestPaymentTransaction: account.paymentHistory,
        overdueDetails: account.overdueDetails,
        account_balance_status: auth.authUser.account_balance_status,
        account_balance_status_by: auth.authUser.account_balance_status_by,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getLatestPaymentHistory,
        getOverdueDetails,
        getUserCredit,
    }, dispatch);
}



export default connect(mapStateToProps, mapDispatchToProps)(AccountBalanceInfo)
