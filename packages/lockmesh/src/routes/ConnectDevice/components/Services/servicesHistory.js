import React, { Component, Fragment } from 'react';
import { Modal, message, Input, Table, Switch, Avatar } from 'antd';
import { componentSearch, getFormattedDate, convertToLang, checkValue, checkIsArray } from '../../../utils/commonUtils';
import Moment from 'react-moment';
import { SEARCH } from '../../../../constants/Constants';
import moment from 'moment';

var copyServices = [];
var status = true;
export default class ServicesHistory extends Component {

    constructor(props) {
        super(props);

        var columns = [
            {
                title: convertToLang(this.props.translation["STATUS"], "STATUS"),
                align: "center",
                dataIndex: 'status',
                key: "status",
                className: '',
                sorter: (a, b) => { return a.status.localeCompare(b.status) },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation["NAME"], "NAME"),
                align: "center",
                dataIndex: 'name',
                key: "name",
                className: '',
                sorter: (a, b) => { return a.name.localeCompare(b.name) },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation["TERM"], "TERM"),
                align: "center",
                dataIndex: 'term',
                key: "term",
                className: '',
                sorter: (a, b) => { return a.term.localeCompare(b.term) },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation["START DATE"], "START DATE"),
                align: "center",
                dataIndex: 'start_date',
                key: "start_date",
                className: '',
                sorter: (a, b) => { return a.start_date.localeCompare(b.start_date) },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation["END DATE"], "END DATE"),
                align: "center",
                dataIndex: 'end_date',
                key: "end_date",
                className: '',
                sorter: (a, b) => { return a.end_date.localeCompare(b.end_date) },
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: 'descend'
            },
        ]

        this.state = {
            columns: columns,
            visible: props.visible,
            expandedRowKeys: [],
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
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
                    copyServices = this.state.services;
                    status = false;
                }
                let foundSims = componentSearch(copyServices, value);
                if (foundSims.length) {
                    this.setState({
                        services: foundSims,
                    })
                } else {
                    this.setState({
                        services: [],
                    })
                }
            } else {
                status = true;
                this.setState({
                    services: copyServices,
                })
            }

        } catch (error) {
            console.log('error')
        }
    }


    // renderHistory = (data) => {
    //     return data.map((row, index) => {
    //         console.log("row ", row);
    //         if (row.type === "PACKAGE") {
    //             return {
    //                 key: index,
    //                 type: checkValue(row.type),
    //                 name: checkValue(row.pkg_name),
    //                 term: checkValue(row.pkg_term),
    //                 // expiry_date: checkValue(moment(row.service_expiry_date).format("YYYY/MM/DD")),
    //             }
    //         } else if (row.type === "PRODUCT") {
    //             return {
    //                 key: index,
    //                 type: checkValue(row.type),
    //                 name: checkValue(row.price_for),
    //                 term: checkValue(row.price_term),
    //                 // expiry_date: checkValue(moment(row.service_expiry_date).format("YYYY/MM/DD")),
    //             }
    //         } else {

    //             return ({
    //                 key: index,
    //                 type: checkValue(row.type),
    //                 name: checkValue(row.price_for),
    //                 term: checkValue(row.term),
    //             });
    //         }
    //     });
    // }

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

    filterServices = (checkServices) => {

        let allServices = [];
        // checkServices.map((services) => {
            checkIsArray(checkServices).forEach((services) => {

            let packages = [];
            let products = [];

            if (services && services.packages) {
                packages = checkIsArray(JSON.parse(services.packages)).map((item) => {
                    item.type = "PACKAGE";
                    item.status = services.status;
                    item.start_date = services.start_date;
                    item.end_date = services.end_date;
                    return item;
                });
            }
            // if (services && services.products) {
            //     products = JSON.parse(services.products).map((item) => {
            //         item.type = "PRODUCT";
            //         item.status = services.status;
            //         item.updated_at = services.updated_at;
            //         return item;
            //     });
            // }

            console.log("packages ", packages)
            // console.log("products ", products)

            // if (packages.length === 0 && products.length === 0) {
            //     continue;
            // }
            if (packages && packages.length) {
                allServices.push(...packages)
            }
            // if (products && products.length) {
            //     allServices.push(...products)
            // }

            // return [...packages, ...products];
        })
        return allServices;
    }

    renderList = (data) => {
        // console.log('data is: ', data)
        // let data = this.state.services;
        // if (data && data.length) {
            return checkIsArray(data).map((row, index) => {
                console.log(row);
                return {
                    key: index,
                    status: checkValue(row.status).toUpperCase(),
                    type: checkValue(row.type),
                    name: checkValue(row.pkg_name),
                    term: checkValue(row.pkg_term),
                    start_date: checkValue(moment(row.start_date).format("YYYY/MM/DD")),
                    end_date: checkValue(moment(row.end_date).format("YYYY/MM/DD")),
                    // data: row
                }
            })
        // } else {
        //     return []
        // }
    }

    render() {
        const { visible } = this.state;
        var { servicesHistoryList } = this.props;
        // console.log("servicesHistoryList history ", this.props.servicesHistoryList)

        let allServices = this.filterServices(servicesHistoryList);
        // console.log("allServices ", allServices);
        return (
            <div>
                <Modal
                    width="880px"
                    maskClosable={false}
                    visible={visible}
                    title={<div>Services History <small>(Returned, Cancelled & Completed)</small></div>} //{convertToLang(this.props.translation["PREVIOUSLY_USED_SIMS"], "Services History")}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {/* <Input.Search
                        name="search"
                        key="search"
                        id="search"
                        onKeyUp={
                            (e) => {
                                this.handleComponentSearch(e)
                            }
                        }
                        placeholder={convertToLang(this.props.translation[SEARCH], "Search")}
                    /> */}
                    <Table
                        columns={this.state.columns}
                        bordered
                        dataSource={this.renderList(allServices)}
                        pagination={false}
                    />
                </Modal>
            </div>
        )
    }
}
