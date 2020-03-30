// Libraries
import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal, Row, Col, Input } from "antd";
import { BASE_URL, TIMESTAMP_FORMAT} from '../../../constants/Application';

// Helpers
import {
     convertTimezoneValue, checkIsArray
} from '../../utils/commonUtils';

// Components
import Permissions from './Permissions';
import EditApk from './EditApk';

// Constants
import { AUTO_UPDATE_ADMIN } from '../../../constants/Constants';

export default class ListApk extends Component {
    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            columns: [],
            pagination: this.props.pagination,

        };
        this.renderList = this.renderList.bind(this);
    }

    handlePagination = (value) => {

        var x = Number(value)
        // console.log(value)
        this.setState({
            pagination: x,
        });

    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {
            this.setState({
                columns: this.props.columns
            })
        }
    }

    // renderList
    renderList(list) {

        return checkIsArray(list).map((app) => {
            return {
                apk_id: app.apk_id,
                action: (
                    <Fragment>
                        <Button type="primary" size="small" style={{ margin: '0px 8px 0 0px', textTransform: "uppercase" }}
                            onClick={(e) => { this.refs.editApk.showModal(app, this.props.editApk) }} > EDIT</Button>
                        <Button type="danger" className="mob_m_t" size="small" style={{ width: '60px', textTransform: "uppercase" }} onClick={(e) => {
                            this.props.handleConfirmDelete(app.apk_id);
                        }}>DELETE</Button>

                    </Fragment>
                ),
                permission: <span style={{ fontSize: 15, fontWeight: 400 }}>{app.permission_count}</span>,
                permissions: app.permissions,
                apk: app.apk ? app.apk : 'N/A',
                apk_name: app.apk_name ? app.apk_name : 'N/A',
                apk_logo: (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />),
                apk_size: (
                    <div data-column="APP SIZE">
                        {app.size ? app.size : 'N/A'}
                    </div>
                ),
                label: app.label,
                package_name: app.package_name,
                version: app.version,
                created_at: convertTimezoneValue(this.props.user.timezone, app.created_at),
                updated_at: convertTimezoneValue(this.props.user.timezone, app.updated_at),
            }
           
        });
    }

    render() {

        return (
            <Card>
                <Table
                    // expandableRowIcon={<Icon type="right" />
                    className="gx-table-responsive apklist_table"
                    size="small"
                    bordered
                    columns={this.state.columns}
                    dataSource={this.renderList(this.props.apk_list)}
                    pagination={false}
                    className="devices"
                    scroll={{ x: 500 }}
                    rowKey="apk_id"
                />
                <EditApk ref='editApk' getApkList={this.props.getApkList} />
            </Card>
        )
    }
}