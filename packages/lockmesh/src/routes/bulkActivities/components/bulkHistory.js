import React, { Component, Fragment } from 'react';
import { Modal, message, Input, Table, Switch, Avatar, Card, Tabs } from 'antd';
import { convertToLang, convertTimezoneValue, checkIsArray } from '../../utils/commonUtils';
import { DATE } from '../../../constants/Constants';
import { BASE_URL } from '../../../constants/Application';
import { POLICY_APP_NAME, POLICY_NAME, ACTIVITY } from '../../../constants/PolicyConstants';
import { Guest, ENCRYPTED, ENABLE } from '../../../constants/TabConstants';
import { bulkDeviceHistoryColumns } from '../../utils/columnsUtils';
import CustomScrollbars from '../../../util/CustomScrollbars';

const TabPane = Tabs.TabPane;

export default class BulkActivity extends Component {

    constructor(props) {
        super(props);
        let columns = bulkDeviceHistoryColumns(props.translation, this.handleSearch);

        this.appsColumns = [
            {
                title: convertToLang(props.translation[POLICY_APP_NAME], "APP NAME"),
                dataIndex: 'app_name',
                key: '1',
                render: text => <a >{text}</a>,
            }, {
                title: convertToLang(props.translation[Guest], "GUEST"),
                dataIndex: 'guest',
                key: '2',
            }, {
                title: convertToLang(props.translation[ENCRYPTED], "ENCRYPTED"),
                dataIndex: 'encrypted',
                key: '3',
            }, {
                title: convertToLang(props.translation[ENABLE], "ENABLE"),
                dataIndex: 'enable',
                key: '4',
            }
        ];
        this.pullAppsColumns = [
            {
                title: convertToLang(props.translation[POLICY_APP_NAME], "APP NAME"),
                dataIndex: 'app_name',
                key: '1',
                render: text => <a >{text}</a>,
            }
        ];
        this.policyColumns = [
            {
                title: convertToLang(props.translation[POLICY_NAME], "POLICY NAME"),
                dataIndex: 'policy_name',
                key: '1',
                render: text => <a >{text}</a>,
            }
        ];

        this.state = {
            columns: columns,
            visible: false,
            activities: props.history ? props.history : [],
            expandedRowKeys: [],
            device: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.history !== nextProps.history) {
            this.setState({
                activities: nextProps.history
            })
        }
    }

    componentDidMount() {
        this.setState({
            activities: this.props.history
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
            activities: this.props.history
        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }


    handleComponentSearch = (e) => {
        let demoHistory = [];
        if (e.target.value.length && this.props.history && this.props.history.length) {
            checkIsArray(this.props.history).forEach((device) => {
                if (device.action) {
                    if (device.action.toUpperCase().includes(e.target.value.toUpperCase())) {
                        if (!demoHistory.includes(device)) {
                            demoHistory.push(device);
                        }
                    }
                }
            });
            this.setState({
                activities: demoHistory
            })
        } else {
            this.setState({
                activities: this.props.history ? this.props.history : []
            })
        }
    }

    renderApps = (apps) => {

        return checkIsArray(apps).map(app => {
            // console.log(app.app_id);
            return ({
                key: app.app_id,
                app_name:
                    <Fragment>
                        <Avatar
                            size={"small"}
                            src={`${BASE_URL}users/getFile/${app.icon}`}
                        // style={{ width: "30px", height: "30px" }} 
                        />
                        <br />
                        <div className="line_break1">{app.apk_name}</div>
                    </Fragment>,
                guest:
                    <Switch
                        size="small"
                        value={app.guest}
                        disabled
                        checked={(app.guest === true || app.guest === 1) ? true : false}

                    />,
                encrypted:
                    <Switch
                        size="small"
                        disabled
                        value={app.encrypted}
                        checked={(app.encrypted === true || app.encrypted === 1) ? true : false}
                    />,
                enable:
                    <Switch
                        size="small"
                        value={app.enable}
                        disabled
                        checked={((app.enable === true) || (app.enable === 1)) ? true : false}
                    />
            });
        });
    }

    onExpandRow = (expanded, record) => {
        // console.log(expanded, 'data is expanded', record);
        if (expanded) {
            if (!this.state.expandedRowKeys.includes(record.key)) {
                this.state.expandedRowKeys.push(record.key);
                this.setState({ expandedRowKeys: this.state.expandedRowKeys })
            }
        } else if (!expanded) {
            if (this.state.expandedRowKeys.includes(record.key)) {
                let list = checkIsArray(this.state.expandedRowKeys).filter(item => item !== record.key)
                this.setState({ expandedRowKeys: list })
            }
        }
    }


    renderHistoryList = (data) => {
        return checkIsArray(data).map((row, index) => {
            return {
                key: index,
                action: row.action.toUpperCase(),
                created_at: convertTimezoneValue(this.props.user.timezone, row.created_at),
                // created_at: getFormattedDate(row.created_at),
                allData: row
            }
        })
    }
    render() {
        return (
            <div>
                <Modal
                    width="750px"
                    maskClosable={false}
                    visible={this.props.historyModalShow}
                    title={
                        <div className="pp_popup">
                            {convertToLang(this.props.translation[""], "History of Bulk Device Activities")}
                            <Input.Search
                                name="search"
                                key="search"
                                id="search"
                                className="search_heading1"
                                onKeyUp={
                                    (e) => {
                                        this.handleComponentSearch(e)
                                    }
                                }
                                placeholder="Search"
                            />
                        </div>
                    }
                    onOk={this.handleOk}
                    onCancel={this.props.handleHistoryCancel}
                    footer={null}
                    bodyStyle={{ height: 400, overflow: 'overlay', width: '100%' }}
                >
                    <Card className='fix_card fix_card_his_bulk'>
                        <hr className="fix_header_border" style={{ top: "17px" }} />
                        <CustomScrollbars className="gx-popover-scroll ">
                            <Table
                                columns={[
                                    {
                                        title: convertToLang(this.props.translation[ACTIVITY], "ACTIVITY"),
                                        align: "center",
                                        dataIndex: 'action',
                                        key: "action",
                                        className: '',
                                        sorter: (a, b) => { return a.action.localeCompare(b.action) },
                                        sortDirections: ['ascend', 'descend'],

                                    },
                                    {
                                        title: convertToLang(this.props.translation[DATE], "DATE"),
                                        align: "center",
                                        dataIndex: 'created_at',
                                        key: "created_at",
                                        className: '',
                                        sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
                                        sortDirections: ['ascend', 'descend'],
                                        defaultSortOrder: 'descend'

                                    },
                                ]}
                                onChange={this.props.onChangeTableSorting}
                                bordered
                                rowClassName={(record, index) =>
                                    this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''
                                }
                                onExpand={this.onExpandRow}
                                dataSource={this.renderHistoryList(this.state.activities ? this.state.activities : [])}
                                expandedRowRender={record => {

                                    if (record.action === 'PUSHED APPS' || record.action === 'PULLED APPS' || record.action === 'PUSHED POLICY') {
                                        return (
                                            <Tabs type="card">
                                                {(record.action === 'PUSHED APPS') ?
                                                    <TabPane tab={convertToLang(this.props.translation[""], "PUSHED APPS")} key="2" >
                                                        <Table
                                                            style={{ margin: 0, padding: 0 }}
                                                            size='middle'
                                                            bordered={false}
                                                            columns={this.appsColumns}
                                                            align='center'
                                                            dataSource={this.renderApps(JSON.parse(record.allData.apps))}
                                                            pagination={false}
                                                            scroll={{ x: true }}
                                                        />
                                                    </TabPane>
                                                    : (record.action === 'PULLED APPS') ?
                                                        <TabPane tab={convertToLang(this.props.translation[""], "PULLED APPS")} key="3" >
                                                            <Table
                                                                style={{ margin: 0, padding: 0 }}
                                                                size='middle'
                                                                bordered={false}
                                                                columns={this.pullAppsColumns}
                                                                align='center'
                                                                dataSource={this.renderApps(JSON.parse(record.allData.apps))}
                                                                pagination={false}
                                                                scroll={{ x: true }}
                                                            />
                                                        </TabPane>
                                                        : (record.action === 'PUSHED POLICY') ?
                                                            <TabPane tab={convertToLang(this.props.translation[""], "POLICY APPLIED")} key="4" >
                                                                <Table
                                                                    style={{ margin: 0, padding: 0 }}
                                                                    size='middle'
                                                                    bordered={false}
                                                                    columns={this.policyColumns}
                                                                    align='center'
                                                                    dataSource={
                                                                        record.allData.policy ? [{
                                                                            key: record.key,
                                                                            policy_name: '#' + record.allData.policy
                                                                        }] : []
                                                                    }
                                                                    pagination={false}
                                                                    scroll={{ x: true }}
                                                                />
                                                            </TabPane>
                                                            : null}
                                                <TabPane tab={convertToLang(this.props.translation[""], "DEVICES")} key="1" >
                                                    <Table
                                                        style={{ margin: 0, padding: 0 }}
                                                        size='middle'
                                                        bordered={false}
                                                        columns={this.state.columns}
                                                        align='center'
                                                        dataSource={this.props.renderList(JSON.parse(record.allData.devices), this.props.user.timezone)}
                                                        pagination={false}
                                                        scroll={{ x: true }}
                                                    />
                                                </TabPane>
                                            </Tabs>
                                        )
                                    } else {
                                        return (
                                            <Table
                                                style={{ margin: 0, padding: 0 }}
                                                size='middle'
                                                bordered={false}
                                                columns={this.state.columns}
                                                align='center'
                                                dataSource={this.props.renderList(JSON.parse(record.allData.devices), this.props.user.timezone)}
                                                pagination={false}
                                                scroll={{ x: true }}
                                            />
                                        )
                                    }
                                }}
                                pagination={false}
                            />
                        </CustomScrollbars>
                    </Card>
                </Modal>
            </div>
        )
    }
}
