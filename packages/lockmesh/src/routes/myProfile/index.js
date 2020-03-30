
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CustomScrollbars from "../../util/CustomScrollbars";
import { Markup } from 'interweave';
import { updatePassword, changeTimeZone } from "../../appRedux/actions/Dealers";
import { updateUserProfile, twoFactorAuth, getLoginHistory } from "../../appRedux/actions/Auth";
import { Row, Col, Card, Table, Button, Divider, Icon, Modal, Switch, Input } from 'antd';
import ChangePassword from './components/changePassword';
import UpdateTimezone from './components/changeTimezone';
import ChangeProfile from './components/change_profile';
import BASE_URL from '../../constants/Application';
import Customizer1 from './components/Customizer';
import styles from './components/profile.css';
import { componentSearch, getFormattedDate, convertToLang, checkValue, getSelectedTZDetail, checkIsArray } from '../utils/commonUtils';
import {
    SDEALER, Login_Email, DEVICES, Name, Value, Profile_Info, Edit_Profile, Edit_Profile_02, Edit_Profile_03, Edit_Profile_01, Change_Password, Change_Email, Login_Email_Authentication, Date_Text, CREDITS, ADMIN
} from "../../constants/Constants";
import { DEALER_ID, DEALER_NAME, Parent_Dealer, DEALER_TOKENS, Login_History, DEALER_PIN } from '../../constants/DealerConstants';
import { Button_Edit, Button_Cancel, Button_Open, Button_Ok, Button_On, Button_Off } from '../../constants/ButtonConstants';
import { IP_ADDRESS } from '../../constants/DeviceConstants';

// import {Link} from 'react-router-dom';

class Profile extends Component {

    constructor(props) {
        super(props);
        var loginHistoryColumns = [
            {
                title: '#',
                align: "center",
                dataIndex: 'tableIndex',
                key: "tableIndex",
                className: '',
                sorter: (a, b) => { return a.tableIndex - b.tableIndex },
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[IP_ADDRESS], "IP ADDRESS"),
                align: "center",
                dataIndex: 'imei',
                key: "imei",
                className: '',
                sorter: (a, b) => { return a.imei.localeCompare(b.imei) },
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[Date_Text], "Date"),
                align: "center",
                dataIndex: 'changed_time',
                key: "changed_time",
                className: '',
                sorter: (a, b) => { return a.changed_time.localeCompare(b.changed_time) },
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: "descend",
            },
        ]
        this.state = {
            loginHistoryColumns: loginHistoryColumns,
            sorterKey: '',
            sortOrder: 'ascend',
            visible: false,
            historyModel: false,
            limitValue: 20
        }
    }
    showModal1 = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk1 = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel1 = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    callChild = () => {
        this.refs.Customize33.toggleCustomizer();
    }
    twoFactorAuth = (e) => {
        this.props.twoFactorAuth(e);
    }

    showLoginHistory = () => {
        this.setState({
            historyModel: true
        })
    }

    handleCancelHistory = () => {
        this.setState({
            historyModel: false
        })
    }

    loadMoreLoginHistory = () => {
        let limitUpdate = this.state.limitValue + 20;
        this.props.getLoginHistory(0, limitUpdate);
        this.setState({ limitValue: limitUpdate })
    }

    componentDidMount = () => {
        this.props.getLoginHistory(0, this.state.limitValue);
    }

    handleTableSorting = (pagination, query, sorter) => {
        let columns = this.state.loginHistoryColumns;

        checkIsArray(columns).forEach(column => {
            if (Object.keys(sorter).length > 0) {
                if (column.dataIndex == sorter.field) {
                    if (this.state.sorterKey == sorter.field) {
                        column['sortOrder'] = sorter.order;
                    } else {
                        column['sortOrder'] = "ascend";
                    }
                } else {
                    column['sortOrder'] = "";
                }
                this.setState({ sorterKey: sorter.field });
            } else {
                if (this.state.sorterKey == column.dataIndex) column['sortOrder'] = "ascend";
            }
        })
        this.setState({
            loginHistoryColumns: columns
        });
    }

    renderList = (history) => {
        let data = checkIsArray(history).map((data, index) => {
            if (data.ip_address.substr(0, 7) === "::ffff:") {
                data.ip_address = data.ip_address.substr(7)
            }
            if (index === 0) {
                return {
                    key: index,
                    tableIndex: index + 1,
                    imei: data.ip_address + ' (CURRENT)',
                    changed_time: getFormattedDate(data.created_at)
                }
            } else if (index === 1) {
                return {
                    key: index,
                    tableIndex: index + 1,
                    imei: data.ip_address + " (LAST)",
                    changed_time: getFormattedDate(data.created_at)
                }
            } else {
                return {
                    key: index,
                    tableIndex: index + 1,
                    imei: data.ip_address,
                    changed_time: getFormattedDate(data.created_at)
                }

            }
        })

        return data;
    }


    render() {
        let selected_tz_detail = getSelectedTZDetail(this.props.profile.timezone);
        let columnData = null
        let commonColumns = [
            {
                key: 1,
                name: <a> {convertToLang(this.props.translation[DEALER_ID], "DEALER ID")} </a>,
                value: this.props.profile.id,
            },
            {
                key: 2,
                name: <a>{convertToLang(this.props.translation[DEALER_PIN], "DEALER PIN")}</a>,
                value: this.props.profile.type !== ADMIN ? this.props.profile.dealer_pin : 'N/A',
            },
            {
                key: 3,
                name: <a>{convertToLang(this.props.translation[DEALER_NAME], "DEALER NAME")} </a>,
                value: this.props.profile.name,
            },
            {
                key: 4,
                name: <a>{convertToLang(this.props.translation[Login_Email], "LOGIN EMAIL")}</a>,
                value: this.props.profile.email,
            },
            {
                key: 41,
                name: <a>{convertToLang(this.props.translation[""], "COMPANY NAME")}</a>,
                value: checkValue(this.props.profile.company_name),
            },
            {
                key: 42,
                name: <a>{convertToLang(this.props.translation[""], "COMPANY ADDRESS")}</a>,
                value: <span className="company_address">{checkValue(this.props.profile.company_address)}</span>,
            },
            {
                key: 43,
                name: <a>{convertToLang(this.props.translation[""], "CITY")}</a>,
                value: checkValue(this.props.profile.city),
            },
            {
                key: 44,
                name: <a>{convertToLang(this.props.translation[""], "STATE/PROVINCE")}</a>,
                value: checkValue(this.props.profile.state),
            },
            {
                key: 45,
                name: <a>{convertToLang(this.props.translation[""], "COUNTRY")}</a>,
                value: checkValue(this.props.profile.country),
            },
            {
                key: 46,
                name: <a>{convertToLang(this.props.translation[""], "POSTAL CODE")}</a>,
                value: checkValue(this.props.profile.postal_code),
            },
            {
                key: 47,
                name: <a>{convertToLang(this.props.translation[""], "TEL #")}</a>,
                value: checkValue(this.props.profile.tel_no),
            },
            {
                key: 48,
                name: <a>{convertToLang(this.props.translation[""], "WEBSITE")}</a>,
                value: checkValue(this.props.profile.website),
            },
            {
                key: 49,
                name: <a>{convertToLang(this.props.translation[""], "TIMEZONE")}</a>,
                value: selected_tz_detail,
            },
            {
                key: 5,
                name: <a>{convertToLang(this.props.translation[DEVICES], "DEVICES")}</a>,
                value: this.props.profile.type === 'admin' ? 'All' : this.props.profile.connected_devices,
            },
        ]

        if (this.props.profile.type === SDEALER) {
            columnData = {
                key: 6,
                name: <a>{convertToLang(this.props.translation[Parent_Dealer], "PARENT DEALER")}</a>,
                value: (this.props.profile.connected_dealer === 0) ? "N/A" : this.props.profile.connected_dealer,
            }
        }
        let dataSource = [];
        if (columnData !== null) {

            dataSource = commonColumns;
            dataSource.push(columnData);
            dataSource.push({
                key: 7,
                name: <a>{convertToLang(this.props.translation[CREDITS], "CREDITS")}</a>,
                value: (this.props.credits) ? this.props.credits : 'N/A',
            });

        } else {
            dataSource = [
                ...commonColumns,
                {
                    key: 7,
                    name: <a>{convertToLang(this.props.translation[CREDITS], "CREDITS")}</a>,
                    value: (this.props.credits) ? this.props.credits : 'N/A',
                },

                {
                    key: 6,
                    name: <a><Markup content={convertToLang(this.props.translation[Login_History], "LOGIN HISTORY")} /> </a>,
                    value: <Button size="small" type='primary' style={{ textTransform: "uppercase" }} onClick={() => { this.showLoginHistory() }} > {convertToLang(this.props.translation[Button_Open], "OPEN")}  </Button>,
                }

            ];
        }

        const columns = [{
            title: convertToLang(this.props.translation[Name], "Name"),
            dataIndex: 'name',
            key: 'name',
            className: 'dealer_info'
        }, {
            title: convertToLang(this.props.translation[Value], "Value"),
            dataIndex: 'value',
            key: 'value',
            className: 'dealer_value'
        }];

        // console.log('uio', this.refs.Customizer.toggleCustomizer)
        return (
            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 110, paddingTop: 20 }}>
                </Row>
                <div style={{ marginTop: -40 }}>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <Card className="manage_sec_pro height_auto" style={{ borderRadius: 12 }}>
                                    <div className="profile_table">
                                        <Row>
                                            <Col span={24}>
                                                <h2 style={{ textAlign: "center" }}>{convertToLang(this.props.translation[Profile_Info], "Profile Info")}</h2>
                                            </Col>
                                        </Row>
                                        <Table columns={columns} dataSource={dataSource} bordered={true} pagination={false} showHeader={false}></Table>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <a onClick={this.showModal1}>
                                    <Card className="manage_sec_pro" style={{ borderRadius: 12 }}>
                                        <div>
                                            <h2 style={{ textAlign: "center" }}>{convertToLang(this.props.translation[Edit_Profile], "Edit Profile")}</h2>
                                            <Divider className="mb-0" />
                                            <Row style={{ padding: '12px 0px 0px' }}>
                                                <Col span={7} className="text-center ">
                                                    <div className="text-left">
                                                        <img src={require("assets/images/profile-image.png")} className="prof_pic" width="85px" />
                                                        <div className="text-center">
                                                            <p style={{ textTransform: 'capitalize', }}> ({this.props.profile.type})</p>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col span={17} style={{ padding: 0 }}>
                                                    <div className="name_type">
                                                        <h1 className="mb-12 d_n_vh_vw" >{this.props.profile.name}</h1>
                                                    </div>
                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[Edit_Profile_01], "Change password")}</h5>
                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[Edit_Profile_02], "Change Email")}</h5>
                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[Edit_Profile_03], "Enable Dual Authentication")}  </h5>
                                                    <h5><span className="diamond_icon">&#9670;</span>{convertToLang(this.props.translation[""], "Change Timezone")}  </h5>
                                                    {/* <h5 className="more_txt">and more...</h5> */}
                                                </Col>
                                            </Row>
                                            {/* <Row justify='center'>
                                                <Col span={6}>
                                                </Col>
                                                <Col span={12} style={{ padding: "", marginTop: 0 }}>
                                                </Col>
                                            </Row> */}

                                        </div>
                                    </Card>
                                    <Button type="primary" size="small" className="open_btn open_btn1">
                                        {convertToLang(this.props.translation[Button_Open], "OPEN")}
                                    </Button>
                                </a>
                            </div>
                            <Modal
                                maskClosable={false}
                                title={<div>{convertToLang(this.props.translation[Edit_Profile], "Edit Profile")} <a className="edit_a_tag" onClick={() => this.refs.change_profile.showModal()} >{convertToLang(this.props.translation[Button_Edit], "EDIT")}</a></div>}
                                visible={this.state.visible}
                                onOk={this.handleOk1}
                                onCancel={this.handleCancel1}
                                footer={false}
                                okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                                cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                            >
                                <Row justify='center' style={{}}>
                                    <Col span={12} style={{ padding: "0 16px 0" }} className="change_pass">
                                        <Button type="primary" size="small" style={{ width: "100%" }}
                                            onClick={() => this.refs.change_password.showModal()} icon="unlock">{convertToLang(this.props.translation[Change_Password], "Change Password")}</Button>
                                    </Col>
                                    <Col span={12} style={{ padding: "0 16px 0" }} className="  ">
                                        <Button type="primary" size="small" style={{ width: "100%" }}
                                            onClick={() => this.refs.set_timezone.showModal()}
                                            icon="unlock">{convertToLang(this.props.translation[""], "Change Timezone")}</Button>
                                    </Col>

                                    <Col span={12} style={{ padding: "16px 16px 0 " }} className="change_email">
                                        <Button disabled size="small" type="primary" style={{ width: "100%" }} icon="mail">{convertToLang(this.props.translation[Change_Email], "Change Email")}</Button>
                                    </Col>
                                    <Col span={6}></Col>
                                    <Col span={6}></Col>
                                    <Col span={14} style={{ padding: "16px 16px 0 " }}>
                                        <h3>{convertToLang(this.props.translation[Login_Email_Authentication], "Login Email Authentication")}</h3>
                                    </Col>
                                    <Col span={6} style={{ padding: "16px 16px 0 " }}>
                                        <Switch
                                            checkedChildren={convertToLang(this.props.translation[Button_On], "ON")}
                                            unCheckedChildren={convertToLang(this.props.translation[Button_Off], "OFF")}
                                            defaultChecked={(this.props.profile.two_factor_auth === 1 || this.props.profile.two_factor_auth === true) ? true : false}
                                            onChange={(e) => {
                                                this.twoFactorAuth(e);
                                            }} />
                                    </Col>
                                </Row>
                            </Modal>
                        </Col>
                        <Customizer1 ref="Customize33" />
                    </Row>
                </div>
                <ChangePassword ref="change_password" profile={this.props.profile} func={this.props.updatePassword} translation={this.props.translation} />
                <UpdateTimezone
                    ref="set_timezone"
                    changeTimeZone={this.props.changeTimeZone}
                    profile={this.props.profile}
                    translation={this.props.translation}
                />
                <ChangeProfile
                    ref="change_profile"
                    profile={this.props.profile}
                    func={this.props.updatePassword}
                    updateUserProfile={this.props.updateUserProfile}
                    translation={this.props.translation}
                />

                <Modal
                    maskClosable={false}
                    title={<div>{convertToLang(this.props.translation[Login_History], "Login History")} </div>}
                    visible={this.state.historyModel}
                    onOk={this.loadMoreLoginHistory}
                    onCancel={this.handleCancelHistory}
                    className="login_history"
                    centered
                    footer={false}
                //bodyStyle={{ height: 500, overflow: "overlay" }}
                // okText={convertToLang(this.props.translation[""], "Load More History")}
                // cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <Fragment>
                        {/* <div className="row">
                            <div className="col-md-12">
                                <Input.Search
                                    name="imei1"
                                    key="imei1"
                                    id="imei1"
                                    className="search_heading1"
                                    onKeyUp={
                                        (e) => {
                                            this.handleComponentSearch(e, 'imei1')
                                        }
                                    }
                                    autoComplete="new-password"
                                    placeholder="Search"
                                />
                            </div>
                        </div> */}
                        <div className="">
                            <hr className="fix_header_border_login_history" />
                            <Table
                                columns={this.state.loginHistoryColumns}
                                bordered
                                dataSource={this.renderList(this.props.loginHistory)}
                                pagination={false}
                                onChange={this.handleTableSorting}
                            />
                        </div>
                    </Fragment>

                </Modal>

            </div>
        )
    }
}

var matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        twoFactorAuth: twoFactorAuth,
        updatePassword, updateUserProfile,
        getLoginHistory: getLoginHistory,
        changeTimeZone: changeTimeZone
    }, dispatch);
}

var mapStateToProps = ({ auth, settings, sidebar }) => {
    // console.log("mapStateToProps");
    // console.log('ooo', auth.authUser);
    return {
        profile: auth.authUser,
        loginHistory: auth.loginHistory,
        translation: settings.translation,
        credits: sidebar.user_credit
    };
}


export default connect(mapStateToProps, matchDispatchToProps)(Profile)
