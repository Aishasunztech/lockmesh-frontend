import React, { Component } from 'react'

export default class WhiteLabelBackups extends Component {
    render() {
        return (
            <div>
                <Modal
                    title="Database Backups"
                    visible={this.state.backupDatabaseModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Table
                        bordered
                        maskClosable={false}
                        pagination={false}
                        dataSource={this.renderWhitelabelBackups(this.state.whitelabelBackups)}
                        columns={this.whitelabelBackupColumns}>
                    </Table>
                </Modal>
            </div>
        )
    }
}
