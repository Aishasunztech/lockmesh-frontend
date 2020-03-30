import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Tabs } from "antd";
import CustomScrollbars from "../../../utils/CustomScrollbars";
const TabPane = Tabs.TabPane;

let data = [];
const confirm = Modal.confirm;
class AccountList extends Component {
    constructor(props) {
        super(props);
        this.confirm = Modal.confirm;
        this.state = {
            searchText: '',
            columns: [],
            dataFieldName: '',
            pagination: this.props.pagination,
            innerTabSelect: this.props.innerTabSelect,
            dataList: [],
            innerTabKey: '1',
            selectedRowKeys: [],
            selectedRows: [],
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
            // console.log(this.props.columns);
            this.setState({
                columns: this.props.columns,
                dataList: this.props.dataList,
                innerTabKey: "1",
                selectedRows: [],
                selectedRowKeys: [],
            })
        }
    }

    resetSeletedRows = () => {
        // console.log('table ref', this.refs.tablelist)
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
    }

    deleteIDs = (id) => {
        let arr = [];
        arr.push(id);
        let title = ' Are you sure, you want to delete the ID';
        this.confirmDelete(arr, title);
    }
    confirmDelete = (ids, title) => {
        console.log(ids);
        this.confirm({
            title: title,
            content: '',
            onOk: (() => {
                let type = '';
                switch (this.state.innerTabSelect) {
                    case '1':
                        type = 'chat_id'
                        break;
                    case '2':
                        type = 'pgp_email'
                        break;
                    case '3':
                        type = 'sim_id'
                        break;

                    default:
                        break;
                }
                // console.log(type);
                this.props.deleteCSVids(type, ids);
                //    this.props.resetTabSelected()
                // this.props.refreshComponent();
                // console.log('this.refs.tablelist.props.rowSelection', this.refs.tablelist.props.rowSelection)
                this.resetSeletedRows();
                if (this.refs.tablelist.props.rowSelection !== null) {
                    this.refs.tablelist.props.rowSelection.selectedRowKeys = []
                }
            }),
            onCancel() { },
        });
    }

    deleteSelectedIDs = (type) => {
        console.log(type);
        if (this.state.selectedRowKeys.length) {
            let title = ' Are you sure, you want to delete All these IDS';
            let arr = [];
            // console.log('delete the device', this.state.selectedRowKeys);
            for (let id of this.state.selectedRowKeys) {
                for (let data of this.props.dataList) {
                    if (type == '1') {
                        if (data.id == id && data.whitelabel_id == this.props.tabselect && this.state.innerTabSelect == '1') {
                            arr.push(data)
                        }
                    }
                    else if (type == '2') {
                        if (data.id == id && data.whitelabel_id == this.props.tabselect && this.state.innerTabSelect == '2') {
                            arr.push(data)
                        }
                    }
                    else if (type == '3') {
                        // console.log(data.id == id, data.whitelabel_id == this.props.tabselect, this.state.innerTabSelect == '3');
                        if (data.id == id && data.whitelabel_id == this.props.tabselect && this.state.innerTabSelect == '3') {
                            arr.push(data)
                        }
                    }
                }
            }
            this.confirmDelete(arr, title);
        }
    }

    renderList(list) {
        data = [];
        // console.log(this.state.innerTabSelect);
        // console.log('data list at renderList::', this.props.dataList)
        // console.log('index is::', this.props.tabselect);
        if (this.props.tabselect != 'all') {

            list = list.filter(e => e.whitelabel_id == this.props.tabselect);
        }
        if (this.state.innerTabKey !== '3') {
            this.state.columns = this.state.columns.filter((item) => {
                return item.dataIndex !== 'action'

            })
        }
        // if (this.props.tabselect == 2) {
        // } else if (this.props.tabselect == 3) {
        //     list = list.filter(e => e.whitelabel_id == 2);
        // }
        // const filterList = list.filter(e => e.whitelabel_id == 1);
        list.map((item, index) => {
            // let label;
            // if (item.whitelabel_id == 1) { label = "Lockmesh" } else if (item.whitelabel_id == 2) { label = "Titan Locker" } else { label = "N/A" }
            if (this.state.innerTabKey === '3') {
                // console.log(this.state.innerTabSelect);
                data.push({
                    'row_key': `${item.id}`,
                    'action': <Button type="danger" size="small" style={{ margin: '0 8px 0 8px ', textTransform: 'uppercase' }} onClick={() => this.deleteIDs(item)} >DELETE</Button>,
                    'count': ++index,
                    'label': item.name,
                    'chat_id': item.chat_id ? item.chat_id : 'N/A',
                    'sim_id': item.sim_id ? item.sim_id : 'N/A',
                    'pgp_email': item.pgp_email ? item.pgp_email : 'N/A',
                    'created_at': item.created_at ? item.created_at : 'N/A',
                })
            } else {
                data.push({
                    'row_key': `${item.id}`,
                    'count': ++index,
                    'label': item.name,
                    'chat_id': item.chat_id ? item.chat_id : 'N/A',
                    'sim_id': item.sim_id ? item.sim_id : 'N/A',
                    'pgp_email': item.pgp_email ? item.pgp_email : 'N/A',
                    'created_at': item.created_at ? item.created_at : 'N/A',
                })

            }
        });
        return (data);
    }

    callback = (key) => {
        this.props.handleChangeInnerTab(key);
        this.setState({
            innerTabSelect: key
        })
    }
    callback1 = (key) => {
        let data = []
        switch (key) {
            case '1':
                this.setState({
                    dataList: this.props.dataList,
                    innerTabKey: key,
                    columns: this.props.columns
                })
                break;
            case '2':
                data = this.props.dataList.filter((item) => {
                    return item.used == 1
                })
                // console.log(data);
                this.setState({
                    dataList: data,
                    innerTabKey: key,
                    columns: this.props.columns
                })

                break;
            case "3":
                data = this.props.dataList.filter((item) => {
                    return item.used == 0
                })
                this.state.columns.splice(0, 0, {
                    title: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteSelectedIDs(this.state.innerTabSelect)} >Delete Selected</Button>,
                    dataIndex: 'action',
                    align: 'center',
                    className: 'row',
                    width: 100,
                })
                // console.log(data);
                this.setState({
                    dataList: data,
                    innerTabKey: key,
                    columns: this.state.columns
                })
                break


            default:
                this.setState({
                    data: this.props.dataList,
                    innerTabKey: "1",
                    columns: this.props.columns
                })
                break;
        }
    }

    render() {
        let rowSelection;
        if (this.state.innerTabKey == '3') {
            rowSelection = {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({ selectedRows: selectedRows, selectedRowKeys: selectedRowKeys })
                },
                getCheckboxProps: record => ({
                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    name: record.name,
                }),
            };
        }
        else {
            rowSelection = null
        }






        return (
            <Card bordered={false}>
                {(this.props.tabselect !== 'all') ?
                    <Tabs className="text-center" activeKey={this.state.innerTabKey} defaultActiveKey="1" type='card' onChange={this.callback1}>
                        <TabPane tab="All" key="1" >
                        </TabPane>
                        <TabPane tab="Used" key="2" forceRender={true}>
                        </TabPane>
                        <TabPane tab="Unused" key="3" forceRender={true}>
                        </TabPane>
                    </Tabs>
                    : null}

                <Tabs defaultActiveKey="1" type='card' tabPosition="left" className="dev_tabs manage_data" onChange={this.callback}>
                    <TabPane tab="CHAT" key="1" >
                    </TabPane>
                    <TabPane tab="PGP" key="2" forceRender={true}>
                    </TabPane>
                    <TabPane tab="SIM" key="3" forceRender={true}>
                    </TabPane>
                    <TabPane tab="VPN" key="4" forceRender={true}>
                    </TabPane>
                </Tabs>
                <Table
                    ref='tablelist'
                    size="middle"
                    className="gx-table-responsive devices table m_d_table"
                    bordered
                    scroll={{ x: 500 }}
                    columns={this.state.columns}
                    rowSelection={rowSelection}
                    rowKey='row_key'
                    align='center'
                    pagination={false}
                    dataSource={this.renderList(this.state.dataList)}
                />


            </Card>
        )
    }
}

export default class Tab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: this.props.dataList,
            tabselect: this.props.tabselect,
            selectedOptions: this.props.selectedOptions,
            // innerTabSelect: this.props.innerTabSelect

        }
    }
    callback = (key) => {
        this.props.handleChangetab(key);
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
                selectedOptions: this.props.selectedOptions
            })
        }
    }

    render() {
        // console.log(this.props.whiteLables);
        return (
            <Fragment>
                <Tabs defaultActiveKey="all" type='card' className="dev_tabs" activeKey={this.state.tabselect} onChange={this.callback}>
                    <TabPane tab="All" key="all" >
                    </TabPane>

                    {this.props.whiteLables.map((item, index) => {
                        // console.log(item);
                        return (
                            <TabPane tab={item.name} key={item.id.toString()} forceRender={true} > </TabPane>
                        )
                    })}
                </Tabs>

                <AccountList
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
                    deleteCSVids={this.props.deleteCSVids}
                />
            </Fragment>

        )
    }
}