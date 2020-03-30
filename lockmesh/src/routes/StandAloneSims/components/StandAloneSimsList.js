import React, { Component, Fragment } from 'react'
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import scrollIntoView from 'scroll-into-view';
import { Card, Row, Col, List, Button, message, Table, Icon, Switch, Modal, Tabs } from "antd";

import CustomScrollbars from "../../../util/CustomScrollbars";
import { getFormattedDate, convertToLang, getDateTimeOfClientTimeZone, convertTimezoneValue } from '../../utils/commonUtils';

import AddUser from './AddStandAloneSims';
import {
    Button_Delete,
    Button_Edit,
    Button_Undo,
    Button_Active,
} from '../../../constants/ButtonConstants';
import moment from 'moment-timezone';
import { EDIT_USER, DELETE_USER, DO_YOU_WANT_TO_DELETE_USER, UNDO, DO_YOU_WANT_TO_UNDO_USER } from '../../../constants/UserConstants';
import { ADMIN, sim } from '../../../constants/Constants';

import styles from './standAloneSim.css';
import { TIMESTAMP_FORMAT } from '../../../constants/Application';
import { Link } from 'react-router-dom';
// import styles1 from './users_fixheader.css';

const confirm = Modal.confirm
const TabPane = Tabs.TabPane
class SimList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            pagination: this.props.pagination,
            users: [],
            expandedRowKeys: [],
            scrollStatus: true,
            tabselect: '1'
        }
    }

    handleSearch2 = () => {
        // console.log('refs of all', this.refs)

    }

    callback = (key) => {
        this.props.handleChangetab(key);
    }

    changeSimStatus = (sim, type) => {
        showConfirm(this.props.changeSimStatus, sim, `Are You sure you want to ${type} Sim ID  ${sim.sim_id} ?`, type)
    }

    renderList(list) {
        // console.log(list);
        if (list && Array.isArray(list) && list.length) {
            let user_list = list
            return user_list.map((sim, index) => {
                // this.state.expandTabSelected[index]='1';
                // this.state.expandedByCustom[index]=false;
                // console.log(sim);
                return {
                    key: `${sim.sim_id}`,
                    rowKey: `${sim.sim_id}`,
                    counter: ++index,
                    action:
                        <Fragment>
                            <div>
                                {(sim.sim_status == 'active') ?
                                    <Button
                                        type="danger"
                                        size="small"
                                        style={{ textTransform: 'uppercase' }}
                                        onClick={() => { this.changeSimStatus(sim, 'suspend') }}
                                    >
                                        {convertToLang(this.props.translation[""], "SUSPEND")}
                                    </Button>
                                    :
                                    <Button
                                        type="primary"
                                        size="small"
                                        style={{ textTransform: 'uppercase' }}
                                        onClick={() => { this.changeSimStatus(sim, 'activate') }}

                                    >
                                        {convertToLang(this.props.translation[Button_Active], "ACTIVATE")}
                                    </Button>
                                }
                                <Button
                                    type=""
                                    size="small"
                                    style={{ textTransform: 'uppercase' }}
                                    onClick={() => { this.changeSimStatus(sim, 'reset') }}
                                >
                                    {convertToLang(this.props.translation[""], "RESET")}
                                </Button>
                                <Link to={`/connect-sim/${btoa(sim.sim_id.toString())}`.trim()}>
                                    <Button
                                        type="primary"
                                        size="small"
                                        style={{ textTransform: 'uppercase' }}
                                    >
                                        {convertToLang(this.props.translation[""], "CONNECT")}
                                    </Button>
                                </Link>
                            </div>
                        </Fragment>
                    ,
                    device_id: sim.device_id ? sim.device_id : 'N/A',
                    status: sim.sim_status == 'active' ? 'ACTIVE' : 'SUSPENDED',
                    sim_iccid: sim.sim_id,
                    term: sim.term ? (sim.term + ' month') : 'N/A',
                    start_date: sim.start_date ? sim.start_date : 'N/A',
                    expiry_date: sim.expiry_date ? sim.expiry_date : 'N/A',
                    // devices: (user.devicesList) ? user.devicesList.length : 0,
                    // devicesList: user.devicesList,
                    // user_name: user.user_name,
                    // email: user.email,
                    // tokens: 'N/A',
                    created_at: convertTimezoneValue(this.props.user.timezone, sim.created_at, TIMESTAMP_FORMAT),
                    // created_at: (user.created_at) ? moment(user.created_at).tz(convertTimezoneValue(this.props.user.timezone)).format("YYYY-MM-DD HH:mm:ss") : 'N/A',
                    // created_at: getFormattedDate(user.created_at)
                }
            });

        } else {
            return []
        }
    }

    componentDidMount() {
        this.setState({
            users: this.props.users,
            expandedRowKeys: this.props.expandedRowsKey
        });
        // this.handleScroll()
    }


    componentDidUpdate(prevProps) {

        if (JSON.stringify(this.props.expandedRowsKey) !== JSON.stringify(prevProps.expandedRowsKey)) {
            this.setState({
                expandedRowKeys: this.props.expandedRowsKey
            })
        }

        if (this.props !== prevProps) {

            // console.log('this.props.expandr', this.props)
            this.setState({
                columns: this.props.columns,
                users: this.props.users,
                // expandedRowKeys: this.props.expandedRowsKey
            })
        }
    }

    render() {
        let { translation } = this.props
        let type = this.props.user.type
        let styleType = "";
        if (type === ADMIN) {
            styleType = "users_fix_card_admin"
        } else {
            styleType = "users_fix_card_dealer"
        }
        // console.log("render function this.state.expandedRowKeys: ", this.state.expandedRowKeys)
        return (
            <Fragment>
                <div>
                    <hr className="fix_header_border" style={{ top: "59px" }} />
                    <Tabs type="card" className="dev_tabs" activeKey={this.props.tabSelect} onChange={this.callback}>
                        <TabPane tab={<span>{convertToLang(translation[""], "All")}</span>} key="1" forceRender={true}>
                        </TabPane>
                        <TabPane tab={<span>{convertToLang(translation[""], "Device Sims")} </span>} key="2" forceRender={true}>
                        </TabPane>
                        <TabPane tab={<span>{convertToLang(translation[""], "Stand Alone Sims")}</span>} key="3" forceRender={true}>
                        </TabPane>
                    </Tabs>
                    <Table
                        className="users_list"
                        size="middle"
                        bordered
                        columns={this.props.columns}
                        onChange={this.props.onChangeTableSorting}
                        dataSource={this.renderList(this.props.simsList)}
                        pagination={false}
                        ref='user_table'
                        translation={this.props.translation}
                    />
                </div>
                <AddUser ref='edit_user' translation={this.props.translation} />
            </Fragment>
        )
    }
}

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({
//         // getPolicies: getPolicies,
//     }, dispatch);
// }

// var mapStateToProps = ({ policies }) => {
//     // console.log("policies", policies);
//     return {
//         // routing: routing,
//     };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(PolicyList);
export default SimList;


function showConfirm(action, sim, msg, type) {
    confirm({
        title: msg,
        okText: "Confirm",
        // cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
        onOk() {
            action(sim.id, type)
        },
        onCancel() { },
    })
}

