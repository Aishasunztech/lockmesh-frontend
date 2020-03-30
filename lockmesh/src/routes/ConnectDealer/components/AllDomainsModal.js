// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select } from "antd";

// Components

// Helpers
import { convertToLang, formatMoney, checkIsArray } from '../../utils/commonUtils'
import { domainColumns, addDomainModalColumns } from "../../utils/columnsUtils";
// import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
// import { getDealerDetails, editDealer } from '../../appRedux/actions'
// import RestService from "../../appRedux/services/RestServices";

// Constants
// import { CONNECT_EDIT_DEALER } from "../../../constants/ActionTypes";
import {
    Button_Remove
} from '../../../constants/ButtonConstants';

// import { DO_YOU_WANT_TO, OF_THIS } from '../../../constants/DeviceConstants';
// import {
//     DEALER_TEXT
// } from '../../../constants/DealerConstants';

var domainStatus = true;
var copyDomainList = [];

export default class AllDomainsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dealer_id: null,
            // allDomainList: []
            selectedDomainList: [],
            selectedRowKeys: [],
            domainLoading: false
        }

        this.columns = addDomainModalColumns(props.translation, this.handleSearch);
    }

    handleSearch = (e) => {
        let fieldName = e.target.name;
        let fieldValue = e.target.value;

        if (domainStatus) {
            copyDomainList = this.props.allDomainList
            domainStatus = false;
        }

        // console.log("copyDomainList ", copyDomainList)
        let searchedData = this.searchField(copyDomainList, fieldName, fieldValue);
        // console.log("searchedData ", searchedData)
        this.setState({
            allDomainList: searchedData
        });

    }

    // searchField = (originalData, fieldName, value) => {
    //     let demoData = [];
    //     if (value.length) {
    //         originalData.forEach((data) => {
    //             // console.log(data);
    //             if (data[fieldName] !== undefined) {
    //                 if ((typeof data[fieldName]) === 'string') {

    //                     if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
    //                         demoData.push(data);
    //                     }
    //                 } else if (data[fieldName] != null) {
    //                     if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
    //                         demoData.push(data);
    //                     }
    //                 }
    //                 // else {
    //                 //     // demoDevices.push(device);
    //                 // }
    //             } else {
    //                 demoData.push(data);
    //             }
    //         });

    //         return demoData;
    //     } else {
    //         return originalData;
    //     }
    // }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
            selectedDomainList: [],
            selectedRowKeys: []
        });
    }



    renderDealerDomainList = () => {
        if (this.props.allDomainList && this.props.allDomainList.length) {
            let allDomainList = this.props.allDomainList;
            let dealerDomains = this.props.domains
            if (dealerDomains && dealerDomains.length) {
                allDomainList = checkIsArray(allDomainList).filter(d1 => !dealerDomains.find(d2 => (d1.name === d2.name)))
            }
            console.log("add domains:", this.props.allDomainList, this.props.domains, allDomainList);

            return checkIsArray(allDomainList).map((item, index) => {
                return {
                    id: item.id,
                    rowKey: item.id,
                    key: item.id,
                    name: item.name,

                }
            })
        } else {
            return []
        }
    };

    onCheckBoxSelection = (selectedRowKeys, selectedRows) => {
        console.log("selectedRows ", selectedRows, "selectedRowKeys ", selectedRowKeys)
        this.setState({
            selectedDomainList: selectedRows,
            selectedRowKeys: selectedRowKeys
        })
    }
    getCheckboxProps = (record) => {
        console.log('object:', record);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dealerDomainLoading !== nextProps.dealerDomainLoading) {
            let visible = this.state.visible;
            if (!nextProps.dealerDomainLoading) {
                visible = false;
            }
            this.setState({
                domainLoading: nextProps.dealerDomainLoading,
                visible
            })
        }
    }

    handleAddDomain = () => {
        // console.log("handle add domain for connect deaeler: ", this.props.dealerId, JSON.stringify(this.state.selectedRowKeys), 'save', false, this.props.authUser);
        // this.handleCancel();
        this.props.domainPermission(this.state.selectedRowKeys, [this.props.dealerId], 'save', false, this.props.authUser, this.state.selectedDomainList);
        this.setState({ domainLoading: true, selectedDomainList: [], selectedRowKeys: [] });
    }

    render() {
        const { visible } = this.state;

        return (
            <Fragment>
                <Modal
                    visible={visible}
                    title="All Domains"
                    maskClosable={false}
                    destroyOnClose
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button
                            key="back"
                            onClick={this.handleCancel}
                        >
                            Close
                        </Button>,
                        <Button
                            key="add"
                            loading={this.props.dealerDomainLoading}
                            disabled={this.state.selectedDomainList && this.state.selectedDomainList.length ? false : true}
                            onClick={this.handleAddDomain}
                        >
                            Add
                        </Button>,

                    ]}
                >
                    <Table
                        rowSelection={{
                            onChange: this.onCheckBoxSelection,
                            // getCheckboxProps: this.getCheckboxProps
                        }}
                        style={{
                            marginTop: '5px'
                        }}
                        columns={this.columns}
                        dataSource={this.renderDealerDomainList()}
                        bordered
                        // title={this.pay_history_title}
                        pagination={false}
                        scroll={{ x: true }}
                    />
                </Modal>

            </Fragment >
        )
    }

}
