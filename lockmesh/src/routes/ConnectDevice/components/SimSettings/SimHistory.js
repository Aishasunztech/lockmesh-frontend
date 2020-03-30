import React, { Component, Fragment } from 'react';
import { Modal, message, Input, Table, Switch, Avatar } from 'antd';
import { componentSearch, getFormattedDate, convertToLang, checkIsArray } from '../../../utils/commonUtils';
import Moment from 'react-moment';
import { SECURE_SETTING, DATE, PROFILE_NAME, SEARCH } from '../../../../constants/Constants';
import { BASE_URL } from '../../../../constants/Application';
import { PREVIOUSLY_USED_SIMS, ICC_ID } from '../../../../constants/DeviceConstants';

var coppySims = [];
var status = true;
export default class SimHistory extends Component {

    constructor(props) {
        super(props);
        this.innerColumns = [
            {
                title: "Name", // convertToLang(props.translation[POLICY_APP_NAME], "APP NAME"),
                dataIndex: 'name',
                key: '1',
            }, {
                title: "Guest", // convertToLang(props.translation[Guest], "GUEST"),
                dataIndex: 'guest',
                key: '2',
            }, {
                title: "Encrypt", // convertToLang(props.translation[ENCRYPT], "ENCRYPT"),
                dataIndex: 'encrypt',
                key: '3',
            }
        ];

        this.state = {
            visible: props.visible,
            sims: props.simHistoryList,
            expandedRowKeys: [],
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
            sims: this.props.simHistoryList

        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    handleComponentSearch = (e) => {
        try {
            let value = e.target.value;
            if (value.length) {
                if (status) {
                    coppySims = this.state.sims;
                    status = false;
                }
                let foundSims = componentSearch(coppySims, value);
                if (foundSims.length) {
                    this.setState({
                        sims: foundSims,
                    })
                } else {
                    this.setState({
                        sims: [],
                    })
                }
            } else {
                status = true;
                this.setState({
                    sims: coppySims,
                })
            }

        } catch (error) {
            console.log('error')
        }
    }


    renderSim = (sims) => {
// console.log('redner sims ', sims)
        return sims.map((sim, index) => {
            // console.log(sim);
            return ({
                key: sim.key,
                name: sim.data.name,
                guest:
                    <Switch
                        size="small"
                        value={sim.data.guest}
                        disabled
                        checked={(sim.data.guest) ? true : false}
                    />,
                encrypt:
                    <Switch
                        size="small"
                        disabled
                        value={sim.data.encrypt}
                        checked={(sim.data.encrypt) ? true : false}
                    />,
            });
        });
    }

    onExpandRow = (expanded, record) => {
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


    renderList = () => {
        let data = this.state.sims;
        if (data.length) {
            return data.map((row, index) => {
                // console.log(row);
                return {
                    key: index,
                    iccid: row.iccid,
                    created_at: getFormattedDate(row.created_at),
                    data: row
                }
            })
        }
    }

    render() {
        const { visible } = this.state;
        return (
            <div>
                <Modal
                    maskClosable={false}
                    visible={visible}
                    title={convertToLang(this.props.translation[PREVIOUSLY_USED_SIMS], "Previously Used Sims")}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Input.Search
                        name="search"
                        key="search"
                        id="search"
                        onKeyUp={
                            (e) => {
                                this.handleComponentSearch(e)
                            }
                        }
                        placeholder={convertToLang(this.props.translation[SEARCH], "Search")}
                    />

                    <Table
                        columns={[
                            {
                                title: convertToLang(this.props.translation[ICC_ID], "ICC-ID"),
                                align: "center",
                                dataIndex: 'iccid',
                                key: "iccid",
                                className: '',
                                sorter: (a, b) => { return a.iccid.localeCompare(b.iccid) },
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
                        bordered
                        rowClassName={(record, index) =>
                            this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''
                        }
                        onExpand={this.onExpandRow}
                        dataSource={this.renderList()}
                        expandedRowRender={record => {
                            // console.log('recored', record)
                            return (
                                <Table
                                    style={{ margin: 0, padding: 0 }}
                                    size='middle'
                                    bordered={false}
                                    columns={this.innerColumns}
                                    align='center'
                                    dataSource={
                                        this.renderSim([record])
                                    }
                                    pagination={false}
                                />
                            )

                        }}
                        pagination={false}
                    />

                </Modal>

            </div>
        )
    }
}
