import React, { Component, Fragment } from 'react'
import { Card, Button, Row, Col, Table, Modal } from "antd";
import PasswordForm from "./PasswordForm";
const confirm = Modal.confirm;

export default class WhitelabelList extends Component {
    constructor() {
        super();
        const columns = [
            {
                // title: '#',
                dataIndex: 'count',
                align: 'center',
                className: 'row',
                width: 50,
            },
            {
                // title: 'Label',
                dataIndex: 'label',
                align: 'center',
                className: 'row',
                width: 50,
            },
            {
                // title: 'Reboot',
                dataIndex: 'reboot',
                align: 'center',
                className: 'row',
                width: 50,
            },

        ];
        this.state = {
            columns: columns,
            // reset_confirm_modal: false,
            password_modal: false,
            wlID: null
        }

    }

    showPasswrodForm = (visible) => {
        this.setState({
            password_modal: visible,
        })
    }
    setWLID = (id) => {
        this.setState({
            wlID: id
        })
    }
    renderList() {
        return this.props.whiteLabels.map((item, index) => {
            return {
                row_key: `${index}`,
                count: ++index,
                label: item.name ? item.name : 'N/A',
                reboot: (
                    <Fragment>
                        <Button
                            style={{ backgroundColor: "orange", color: 'white', borderRadius: '15px' }}
                            onClick={(e) => {
                                this.setWLID(item.id);
                                this.showPasswrodForm(true)
                            }}
                        >Reboot Server</Button>
                    </Fragment>
                ),
            }
        });

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.confirmRebootModal) {
            let _this = this
            confirm({
                title: 'WARNNING!',
                content: "Are you sure, you want to Reboot Server",
                okText: "Confirm",
                onOk() {
                    _this.props.restartWhiteLabel(_this.state.wlID);
                    _this.props.resetConfirmReboot()
                },
                onCancel() {
                    _this.props.resetConfirmReboot()
                },
            });
        }
    }
    render() {
        return (
            <Fragment>
                <Modal
                    width={300}
                    maskClosable={false}
                    visible={this.state.password_modal}
                    // onOk={this.handleCancel}
                    onCancel={() => {
                        this.showPasswrodForm(false)
                    }}
                    footer={false}
                >
                    <PasswordForm
                        checkPass={this.props.checkPass}
                        handleCancel={this.showPasswrodForm}
                    />
                </Modal>
                <Table size="middle"
                    style={{ width: '100%' }}
                    bordered
                    columns={this.state.columns}
                    rowKey='row_key'
                    align='center'
                    dataSource={this.renderList()}
                    pagination={false}
                />
            </Fragment>
        )
    }
}

