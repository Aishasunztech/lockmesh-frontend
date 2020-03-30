import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal } from "antd";
// import { BASE_URL } from '../../../constants/Application';
// import EditDealer from './editDealer';
import { convertToLang, convertTimezoneValue, checkIsArray } from '../../../utils/commonUtils';

import { Tabs } from 'antd';
import {
    Tab_All,
    TAB_CHAT_ID,
    TAB_SIM_ID,
    TAB_PGP_EMAIL,
    TAB_VPN,
    Tab_USED,
    Tab_UNUSED,
} from '../../../../constants/TabConstants';
import { ADMIN } from '../../../../constants/Constants';
import { TIMESTAMP_FORMAT } from '../../../../constants/Application';

// import EditApk from './editDealer';
const TabPane = Tabs.TabPane;

let data = [];
const confirm = Modal.confirm;
class AccountList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            columns: [],
            dataFieldName: '',
            pagination: this.props.pagination,
            innerTabSelect: this.props.innerTabSelect

        };
        this.renderList = this.renderList.bind(this);
    }

    handlePagination = (value) => {
        // console.log(value)
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {
            this.setState({
                columns: this.props.columns
            })
        }
    }

    renderList(list) {
        data = [];
        if (this.props.tabselect !== 'all') {
            list = checkIsArray(list).filter(e => e.used == this.props.tabselect);
        }
        checkIsArray(list).map((item, index) => {
            // let label;
            // if (item.whitelabel_id === 1) { label = "Lockmesh" } else if (item.whitelabel_id === 2) { label = "Titan Locker" } else { label = "N/A" }
            data.push({
                'row_key': `${index}Key`,
                'count': ++index,
                'chat_id': item.chat_id ? item.chat_id : 'N/A',
                'sim_id': item.sim_id ? item.sim_id : 'N/A',
                'pgp_email': item.pgp_email ? item.pgp_email : 'N/A',
                'created_at': convertTimezoneValue(this.props.user.timezone, item.created_at),
                // 'created_at': item.created_at ? item.created_at : 'N/A',
                // 'action': <Button >Realese</Button>
            })
        });
        return (data);
    }

    callback = (key) => {
        this.props.handleChangeInnerTab(key);
    }

    render() {
        // console.log('data list at::', this.props.dataList)
        return (
            <Card bordered={false} className="fix_card m_d_fix_table">
                <Tabs defaultActiveKey="1" type="card" tabPosition="left" className="m_d_table_tabs" onChange={this.callback}>
                    <TabPane tab={convertToLang(this.props.translation[TAB_CHAT_ID], "CHAT")} key="1" >
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[TAB_PGP_EMAIL], "PGP")} key="2" forceRender={true}>
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[TAB_SIM_ID], "SIM")} key="3" forceRender={true}>
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[TAB_VPN], "VPN")} key="4" forceRender={true}>
                    </TabPane>

                </Tabs>
                <Table
                    size="middle"
                    className="gx-table-responsive devices table m_d_table"
                    bordered
                    //scroll={{ x: 500 }}
                    columns={this.state.columns}
                    rowKey='row_key'
                    align='center'
                    pagination={false}
                    // pagination={{ pageSize: this.state.pagination, size: "midddle" }}
                    dataSource={this.renderList(this.props.dataList)}
                />
            </Card>
        )
    }
}
export default class Tab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: props.dataList,
            tabselect: props.tabselect,
            // selectedOptions: this.props.selectedOptions,
            // innerTabSelect: this.props.innerTabSelect

        }
    }
    callback = (key) => {
        this.props.handleChangeTab(key);
    }

    handlePagination = (value) => {
        this.refs.dataList.handlePagination(value);
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {

            this.setState({
                dataList: this.props.dataList,
                columns: this.props.columns,
                tabselect: this.props.tabselect,
                // innerTabSelect: this.props.innerTabSelect,
                // selectedOptions: this.props.selectedOptions
            })
        }
    }

    render() {
        // console.log(this.state.dataList);
        return (
            <Fragment>
                {/* {this.props.user.type === ADMIN ? */}
                    <Tabs defaultActiveKey="all" type='card' className="dev_tabs dev_tabs1" activeKey={this.state.tabselect} onChange={this.callback}>
                        <TabPane tab={convertToLang(this.props.translation[Tab_All], "All")} key="all" >
                        </TabPane>
                        <TabPane tab={convertToLang(this.props.translation[Tab_USED], "USED")} key="1" forceRender={true} > </TabPane>
                        <TabPane tab={convertToLang(this.props.translation[Tab_UNUSED], "UNUSED")} key="0" forceRender={true} > </TabPane>

                    </Tabs>
                    {/* : null} */}
                <AccountList
                    user={this.props.user}
                    dataList={this.state.dataList}
                    innerTabSelect={this.props.innerTabSelect}
                    tabselect={this.state.tabselect}
                    // suspendDealer={this.props.suspendDealer}
                    // activateDealer={this.props.activateDealer}
                    // deleteDealer={this.props.deleteDealer}
                    // undoDealer={this.props.undoDealer}
                    columns={this.props.columns}
                    // selectedOptions={this.state.selectedOptions}
                    ref="dealerList"
                    pagination={this.props.pagination}
                    // editDealer={this.props.editDealer}
                    // updatePassword={this.props.updatePassword}
                    handleChangeInnerTab={this.props.handleChangeInnerTab}
                    translation={this.props.translation}
                />
            </Fragment>

        )
    }
}