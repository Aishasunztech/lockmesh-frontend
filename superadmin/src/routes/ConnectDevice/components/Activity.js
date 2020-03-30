import React, { Component } from 'react';
import { Modal, message, Input, Table } from 'antd';
import { componentSearch, getFormattedDate } from '../../utils/commonUtils';
import Moment from 'react-moment'

var coppyActivities = [];
var status = true;
export default class Activity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            activities: this.props.activities

        }
    }

    showModal = () => {
        this.setState({
            visible: true,
            activities: this.props.activities

        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }
    // handlePagination = (value) => {
    //     this.setState({
    //         pagination: value
    //     })
    // }

    handleComponentSearch = (e) => {
        try {
            let value = e.target.value;
            // console.log(status,'searched value', e.target.value)
            if (value.length) {
                // console.log(status,'searched value', value)
                if (status) {
                    // console.log('status')
                    coppyActivities = this.state.activities;
                    status = false;
                }
                // console.log(this.state.users,'coppy de', coppyDevices)
                let foundActivities = componentSearch(coppyActivities, value);
                //  console.log('found devics', foundImeis)
                if (foundActivities.length) {

                    this.setState({
                        activities: foundActivities,
                    })
                } else {

                    this.setState({
                        activities: [],
                    })
                }
            } else {
                status = true;
                this.setState({
                    activities: coppyActivities,
                })
            }

        } catch (error) {
            console.log('error')
            // alert("hello");
        }
    }
    renderList = () => {
        let data = this.state.activities;
        if (data.length) {
            return data.map((row, index) => {
                return {
                    key: index,
                    action_name: row.action_name.toUpperCase(),
                    created_at: getFormattedDate(row.created_at)
                }
            })
        }
    }
    render() {

        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    maskClosable={false}
                    visible={visible}
                    title='Activities'
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="activities"
                // className="edit_form"
                >
                    <Input.Search
                        name="search"
                        key="search"
                        id="search"
                        // className="search_heading1"
                        onKeyUp={
                            (e) => {
                                this.handleComponentSearch(e)
                            }
                        }
                        placeholder="Search"
                    />

                    <Table
                        columns={[
                            {
                                title: 'ACTIVITY',
                                align: "center",
                                dataIndex: 'action_name',
                                key: "action_name",
                                className: '',
                                sorter: (a, b) => { return a.action_name.localeCompare(b.action_name) },
                                sortDirections: ['ascend', 'descend'],

                            },
                            {
                                title: "DATE",
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
                        dataSource={this.renderList()}
                        // scroll={{ y: 350 }}
                        pagination={false}
                    />

                </Modal>

            </div>
        )
    }
}
