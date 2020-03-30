// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select } from "antd";

// Components
import AllDomainsModal from './AllDomainsModal';

// Helpers
import { convertToLang, formatMoney, checkIsArray } from '../../utils/commonUtils'
import { domainColumns } from "../../utils/columnsUtils";
// import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
// import { getDealerDetails, editDealer } from '../../appRedux/actions'
// import RestService from "../../appRedux/services/RestServices";

// Constants
// import { CONNECT_EDIT_DEALER } from "../../../constants/ActionTypes";
import {
    Button_Remove
} from '../../../constants/ButtonConstants';
import { ADMIN } from "../../../constants/Constants";
// import { DO_YOU_WANT_TO, OF_THIS } from '../../../constants/DeviceConstants';
// import {
//     DEALER_TEXT
// } from '../../../constants/DealerConstants';

var domainStatus = true;
var copyDomainList = [];

export default class DealerDomains extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dealer_id: null,
            domains: [],
            domainLoading: false
        }
        this.columns = domainColumns(props.translation, this.handleSearch, true);

    }

    handleSearch = (e) => {
        let fieldName = e.target.name;
        let fieldValue = e.target.value;

        if (domainStatus) {
            copyDomainList = this.props.domains
            domainStatus = false;
        }

        // console.log("copyDomainList ", copyDomainList)
        let searchedData = this.searchField(copyDomainList, fieldName, fieldValue);
        // console.log("searchedData ", searchedData)
        this.setState({
            domains: searchedData
        });

    }

    searchField = (originalData, fieldName, value) => {
        let demoData = [];
        if (value.length) {
            checkIsArray(originalData).forEach((data) => {
                // console.log(data);
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] != null) {
                        if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    }
                    // else {
                    //     // demoDevices.push(device);
                    // }
                } else {
                    demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }

    showModal = (dealer, getDomains, getDealerDomains) => {
        this.setState({
            visible: true,
            dealer_id: dealer.dealer_id,
        });
        getDomains();
        getDealerDomains(dealer.dealer_id)
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.domains.length !== nextProps.domains.length) {
            this.setState({
                domains: nextProps.domains,
                domainLoading: nextProps.dealerDomainLoading
            })
        }
    }
    deleteDomain = id => {
        // this.props.deleteDomain(id);
        this.props.domainPermission([id], [this.state.dealer_id], 'delete', false, this.props.authUser, id);
        let loadingCopy = Object.assign({}, this.state.domainLoading)
        loadingCopy[`removebtn_` + id] = true
        this.setState({ domainLoading: loadingCopy })

        setTimeout(
            (_this = this) => {
                _this.setState({ domainLoading: false })
            }, 1000);
    }
    renderDealerDomainList = (list) => {

        return checkIsArray(list).map((item, index) => {

            return {
                rowKey: item.id,
                key: ++index,
                action: (<Fragment>
                    <Button
                        size="small"
                        type="danger"
                        loading={this.state.domainLoading[`removebtn_` + item.id] ? true : false}
                        onClick={() => this.deleteDomain(item.id)}
                        disabled={item.dealer_type === ADMIN && this.props.authUser.type !== ADMIN ? true : false}
                    >
                        {convertToLang(this.props.translation[Button_Remove], "Remove")}
                    </Button>
                </Fragment>),
                name: item.name,
                permission_by: (item.permission_by).toUpperCase()
            }
        })
    };
    render() {
        const { visible } = this.state;
        return (
            <Fragment>
                <Modal
                    visible={visible}
                    title="Manage Domains"
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button
                            key="back"
                            onClick={this.handleCancel}
                        >
                            Close
                            {/* {convertToLang(this.props.translation[Button_Cancel], "Cancel")} */}
                        </Button>,

                    ]}
                >
                    <Button size="small" type="primary"
                        onClick={() => this.refs.allDomainsModal.showModal()}
                    >Add Domain</Button>

                    <Table
                        style={{
                            marginTop: '5px'
                        }}
                        columns={this.columns}
                        dataSource={this.renderDealerDomainList(this.state.domains)}
                        bordered
                        // title={this.pay_history_title}
                        pagination={false}
                        scroll={{ x: true }}
                    />
                </Modal>
                <AllDomainsModal
                    ref='allDomainsModal'
                    // props
                    translation={this.props.translation}
                    allDomainList={this.props.allDomainList}
                    domains={this.props.domains}
                    domainPermission={this.props.domainPermission}
                    authUser={this.props.authUser}
                    dealerId={this.state.dealer_id}
                    dealerDomainLoading={this.props.dealerDomainLoading}
                />
            </Fragment >
        )
    }

}
