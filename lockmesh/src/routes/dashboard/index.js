import React, { Component, Fragment } from "react";
import { Col, Row, Icon, Card, Avatar, Badge, Modal } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Auxiliary from "util/Auxiliary";
import { Link } from 'react-router-dom';
import AppFilter from '../../components/AppFilter';
import NewDevice from '../../components/NewDevices';
import { getStatus, componentSearch, titleCase, convertToLang } from '../utils/commonUtils';
import {
    ADMIN,
    DEALER,
    SDEALER,
} from '../../constants/Constants'
import styles from './dashboard.css'



import {
    getDashboardData
} from "../../appRedux/actions/Dashboard";
import { rejectDevice, addDevice, getDevicesList } from '../../appRedux/actions/Devices';
import {
    getNewCashRequests,
    getUserCredit,
    rejectRequest,
    acceptRequest,
    getCancelServiceRequests,
    acceptServiceRequest,
    rejectServiceRequest,
    getTicketsNotifications,

} from "../../appRedux/actions/SideBar";
import { getNewDevicesList } from "../../appRedux/actions/Common";

import { transferDeviceProfile } from "../../appRedux/actions/ConnectDevice";
import { Button_Yes, Button_No } from "../../constants/ButtonConstants";
import { APP_MANAGE_APKs, APP_SECURE_MARKET, APP_MANAGE_POLICY } from "../../constants/AppConstants";
import { Sidebar_users, Sidebar_sdealers, Sidebar_dealers, Sidebar_devices, Sidebar_users_devices, Sidebar_clients } from "../../constants/SidebarConstants";
import { Tab_SET_PACKAGES_PRICES, Tab_PACKAGES, Tab_Active } from "../../constants/TabConstants";
import { PACKAGES_AND_IDS, MANAGE_DATA } from "../../constants/AccountConstants";
import { PURCHASE_CREDITS } from "../../constants/ActionTypes";
import { ONLINE } from "../../constants/DeviceConstants";

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.props.getDashboardData();
        this.props.getNewDevicesList();
    }

    // transferDeviceProfile = (obj) => {

    //     let _this = this;
    //     Modal.confirm({
    //         content: `Are you sure you want to Transfer, from ${obj.flagged_device.device_id} to ${obj.reqDevice.device_id} ?`, //convertToLang(_this.props.translation[ARE_YOU_SURE_YOU_WANT_TRANSFER_THE_DEVICE], "Are You Sure, You want to Transfer this Device"),
    //         onOk() {
    //             //
    //             _this.props.transferDeviceProfile(obj);
    //         },
    //         onCancel() { },
    //         okText: convertToLang(this.props.translation[Button_Yes], 'Yes'),
    //         cancelText: convertToLang(this.props.translation[Button_No], 'No'),
    //     });
    // }


    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {

        }
    }

    handleLinkRequests = () => {

        // this.props.getNewCashRequests();
        this.props.getNewDevicesList()
        // this.props.getUserCredit()

        this.refs.new_device.showModal(false, true); // sectionvisible, showLInkRequest

        // this.props.getDevicesList();
    }

    render() {

        return (
            <div>
                <AppFilter
                    // searchPlaceholder={convertToLang(this.props.translation[''], "Search")}
                    // defaultPagingValue={this.state.defaultPagingValue}
                    // addButtonText={convertToLang(this.props.translation[Button_Add_User], "Add User")}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    // isAddButton={this.props.user.type !== ADMIN}
                    // isAddUserButton={true}
                    // AddPolicyModel={true}
                    // handleUserModal={this.handleUserModal}
                    // handleCheckChange={this.handleCheckChange}
                    // handlePagination={this.handlePagination}
                    // handleComponentSearch={this.handleComponentSearch}
                    // translation={this.props.translation}
                    // pageHeading={convertToLang(this.props.translation[''], "Dashboard")}
                    pageHeading="Dashboard"
                />

                <NewDevice
                    history={this.props.history}
                    showSupport={false}
                    ref='new_device'
                    devices={this.props.devices}
                    addDevice={this.props.addDevice}
                    rejectDevice={this.props.rejectDevice}
                    authUser={this.props.authUser}
                    requests={this.props.requests}
                    acceptRequest={this.props.acceptRequest}
                    rejectRequest={this.props.rejectRequest}
                    translation={this.props.translation}
                    allDevices={this.props.allDevices}
                    transferDeviceProfile={this.props.transferDeviceProfile}
                    cancel_service_requests={this.props.cancel_service_requests}
                    rejectServiceRequest={this.props.rejectServiceRequest}
                    acceptServiceRequest={this.props.acceptServiceRequest}
                    // ticketNotifications={this.props.ticketNotifications}
                    allDealers={this.props.allDealers}
                />

                <Auxiliary>

                    <Row>
                        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                            <div className='dashboard-item-div'><Link to='devices'>
                                <Card className='dashboard-card'>
                                    {/* <i className="fa fa-mobile dashboard-icon " aria-hidden="true" /> */}
                                    <Avatar
                                        src={require("../../assets/images/dashboard/active_device.png")}
                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                        alt=""
                                    />
                                </Card>
                                <div className="dash_btm_txt">
                                    <span className='db-span-qnty'>{this.props.items.activeDevices}</span>
                                    <span className='db-span-text'>{convertToLang(this.props.translation[Tab_Active], "Active")} {convertToLang(this.props.translation[Sidebar_users_devices], "Users & Devices")}</span>
                                </div>
                            </Link>
                            </div>
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                            <div className='dashboard-item-div'>
                                <Link to='devices' className="">
                                    <Card className='dashboard-card'>
                                        <Avatar
                                            src={require("../../assets/images/dashboard/online_device.png")}
                                            // className="gx-size-40 gx-pointer gx-mr-3"
                                            alt=""
                                        />
                                    </Card>
                                    <div className="dash_btm_txt">
                                        <span className='db-span-qnty'>{this.props.items.onlineDevices}</span>
                                        <span className='db-span-text'>{convertToLang(this.props.translation[ONLINE], "Online")} {convertToLang(this.props.translation[Sidebar_users_devices], "Users & Devices")}</span>
                                    </div>
                                </Link>
                            </div>
                        </Col>
                        {
                            this.props.authUser.type == DEALER || this.props.authUser.type == SDEALER ?

                                <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                    <div className='dashboard-item-div'>
                                        {/* <Link to='devices'> */}
                                        <a href="javascript:void(0)" onClick={this.handleLinkRequests} >
                                            <Badge count={this.props.devices ? this.props.devices.length : 0} >
                                                <Card className='dashboard-card head-example'>
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/link_device.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                            </Badge>
                                            <div className="dash_btm_txt">
                                                <span className='db-span-qnty'>{this.props.devices ? this.props.devices.length : 0}</span>
                                                <span className='db-span-text'>Link Request</span>
                                            </div>
                                        </a>
                                        {/* </Link> */}
                                    </div>
                                </Col> : null
                        }

                        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                            <div className='dashboard-item-div'>
                                <Link to='users'>
                                    <Card className='dashboard-card'>
                                        {/* <i className="icon icon-user dashboard-icon " aria-hidden="true" /> */}
                                        <Avatar
                                            src={require("../../assets/images/dashboard/users.png")}
                                            // className="gx-size-40 gx-pointer gx-mr-3"
                                            alt=""
                                        />
                                    </Card>
                                    <div className="dash_btm_txt">
                                        <span className='db-span-qnty'>{this.props.items.users}</span>
                                        <span className='db-span-text'>{convertToLang(this.props.translation[Sidebar_clients], "Clients")}</span>
                                    </div>
                                </Link>
                            </div>
                        </Col>

                        {
                            this.props.authUser.type == ADMIN ?

                                <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                    <div className='dashboard-item-div'>
                                        <Link to='dealer/dealer'>
                                            <Card className='dashboard-card'>
                                                {/* <i className="icon icon-avatar dashboard-icon " aria-hidden="true" /> */}
                                                <Avatar
                                                    src={require("../../assets/images/dashboard/dealers.png")}
                                                    // className="gx-size-40 gx-pointer gx-mr-3"
                                                    alt=""
                                                />
                                            </Card>
                                            <div className="dash_btm_txt">
                                                <span className='db-span-qnty'>{this.props.items.dealers}</span>
                                                <span className='db-span-text'>{convertToLang(this.props.translation[Sidebar_dealers], "Dealers")}</span>
                                            </div>
                                        </Link>
                                    </div>
                                </Col> : null
                        }


                        {
                            this.props.authUser.type == ADMIN || this.props.authUser.type == DEALER ?
                                <Fragment>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='dealer/sdealer'>
                                                <Card className='dashboard-card'>
                                                    {/* <i className="icon icon-avatar dashboard-icon " aria-hidden="true" /> */}
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/sdealers.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    <span className='db-span-qnty'>{this.props.items.sdealers}</span>
                                                    <span className='db-span-text'>{convertToLang(this.props.translation[Sidebar_sdealers], "S-Dealers")}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>

                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='policy'>
                                                <Card className='dashboard-card'>
                                                    {/* <i className="fa fa-mobile dashboard-icon " aria-hidden="true" /> */}
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/policy.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    <span className='db-span-qnty'>{this.props.items.policies}</span>
                                                    <span className='db-span-text'>{convertToLang(this.props.translation[APP_MANAGE_POLICY], "Manage Policy")}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='apk-list'>
                                                <Card className='dashboard-card'>
                                                    {/* <i className="icon icon-apps dashboard-icon " aria-hidden="true" /> */}

                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/manageApks.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    <span className='db-span-qnty'>{this.props.items.apks}</span>
                                                    <span className='db-span-text'>{convertToLang(this.props.translation[APP_MANAGE_APKs], "Manage APK's")}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='app-market'>
                                                <Card className='dashboard-card'>
                                                    {/* <i className="fa fa-mobile dashboard-icon " aria-hidden="true" /> */}
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/secure_market.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    {/* <span className='db-span-qnty'>12</span> */}
                                                    <span className='db-span-text'>{convertToLang(this.props.translation[APP_SECURE_MARKET], "Secure Market")}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>
                                </Fragment> : null
                        }

                        {
                            this.props.authUser.type == ADMIN ?
                                <Fragment>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='set-prices'>
                                                <Card className='dashboard-card'>
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/package.png")}
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    {/* <span className='db-span-qnty'>12</span> */}
                                                    <span className='db-span-text'>{convertToLang(this.props.translation[PACKAGES_AND_IDS], "Packages & ID's")}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            <Link to='account/managedata'>
                                                <Card className='dashboard-card'>
                                                    {/* <i className="fa fa-mobile dashboard-icon " aria-hidden="true" /> */}
                                                    <Avatar
                                                        src={require("../../assets/images/dashboard/managedata.png")}
                                                        // className="gx-size-40 gx-pointer gx-mr-3"
                                                        alt=""
                                                    />
                                                </Card>
                                                <div className="dash_btm_txt">
                                                    {/* <span className='db-span-qnty'>12</span> */}
                                                    <span className='db-span-text'>{convertToLang(this.props.translation[MANAGE_DATA], "Manage ID Inventory")}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </Col>
                                    <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                                        <div className='dashboard-item-div'>
                                            {/* <Link to='devices'> */}
                                            <Card className='dashboard-card'>
                                                {/* <i className="fa fa-mobile dashboard-icon " aria-hidden="true" /> */}
                                                <Avatar
                                                    src={require("../../assets/images/dashboard/credits.png")}
                                                    // className="gx-size-40 gx-pointer gx-mr-3"
                                                    alt=""
                                                />
                                            </Card>
                                            <div className="dash_btm_txt">
                                                {/* <span className='db-span-qnty'>12</span> */}
                                                <span className='db-span-text'>{convertToLang(this.props.translation[""], "Credits")}</span>
                                            </div>
                                            {/* </Link> */}
                                        </div>
                                    </Col>
                                </Fragment> : null
                        }
                        <Col xl={4} lg={4} md={4} sm={12} xs={12}>
                            <div className='dashboard-item-div'>
                                <Link to='support'>
                                    <Card className='dashboard-card'>
                                        <Avatar
                                            src={require("../../assets/images/dashboard/support.jpg")}
                                            alt=""
                                        />
                                    </Card>
                                    <div className="dash_btm_txt">
                                        <span className='db-span-text'>{convertToLang(this.props.translation[""], "Support")}</span>
                                    </div>
                                </Link>
                            </div>
                        </Col>
                    </Row>


                </Auxiliary>
            </div>

        );
    }
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDashboardData: getDashboardData,

        addDevice: addDevice,  // for link requests
        rejectDevice: rejectDevice, // for link requests
        acceptRequest: acceptRequest,  // for credit requests
        rejectRequest: rejectRequest, // for credit requests
        transferDeviceProfile: transferDeviceProfile,

        getNewCashRequests: getNewCashRequests,
        getUserCredit: getUserCredit,
        getDevicesList: getDevicesList,
        getNewDevicesList: getNewDevicesList,
        getCancelServiceRequests,
        acceptServiceRequest,
        rejectServiceRequest,
        getTicketsNotifications
    }, dispatch);
}
var mapStateToProps = ({ dashboard, auth, devices, sidebar, settings, dealers }) => {

    return {
        items: dashboard.dashboard_items,
        authUser: auth.authUser,

        allDevices: devices.devices,
        devices: devices.newDevices,
        requests: sidebar.newRequests,
        translation: settings.translation,
        cancel_service_requests: sidebar.cancel_service_requests,
        ticketNotifications: sidebar.ticketNotifications,
        allDealers: dealers.allDealers,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
