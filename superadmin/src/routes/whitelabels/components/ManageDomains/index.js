import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Table, Card, Input, Icon, Modal } from 'antd';
import {
    getDomains,
    deleteDomains,
    addDomain,
    editDomain
} from '../../../../appRedux/actions/WhiteLabels';
import AppFilter from '../../../../components/AppFilter/index';
import { componentSearch, getDealerStatus, titleCase } from '../../../utils/commonUtils';
import DomainsModal from './DomainForm'
import { isArray } from "util";
const confirm = Modal.confirm
let domainsCopy = []
class ManageDomains extends Component {
    constructor(props) {
        super(props)
        this.columns = [
            {
                title: "#",
                dataIndex: 'sr',
                key: 'sr',
                align: "center",
                render: (text, record, index) => ++index,
            },
            {
                title: "ACTION",
                dataIndex: 'action',
                align: 'center',
                className: 'row',
                key: "action"
            },
            {
                title: (
                    <Input.Search
                        name="domain_name"
                        key="domain_name"
                        id="domain_name"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder='DOMAIN NAME'
                    />
                ),
                dataIndex: 'domain_name',
                className: '',
                children: [
                    {
                        title: 'DOMAIN NAME',
                        align: "center",
                        className: '',
                        dataIndex: 'domain_name',
                        key: 'domain_name',
                        sorter: (a, b) => { return a.domain_name.localeCompare(b.domain_name) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="created_at"
                        key="created_at"
                        id="created_at"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder='CREATED AT'
                    />
                ),
                dataIndex: 'created_at',
                className: '',
                children: [
                    {
                        title: 'CREATED AT',
                        align: "center",
                        className: '',
                        dataIndex: 'created_at',
                        key: 'created_at',
                        sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
        ];

        this.state = {
            visible: false,
            domains: [],
            domains_modal: false,
            copyStatus: true,

        }
    }

    handleSearch = (e) => {
        let dumyPackages = [];
        if (this.state.copyStatus) {
            domainsCopy = this.state.domains;
            this.state.copyStatus = false;
        }

        if (e.target.value.length) {

            domainsCopy.forEach((dealer) => {

                if (dealer[e.target.name] !== undefined) {
                    if ((typeof dealer[e.target.name]) === 'string') {
                        if (dealer[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            dumyPackages.push(dealer);
                        }
                    } else if (dealer[e.target.name] != null) {
                        if (dealer[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            dumyPackages.push(dealer);
                        }
                        if (isArray(dealer[e.target.name])) {
                            if (dealer[e.target.name][0]['total'].includes(e.target.value)) {
                                dumyPackages.push(dealer);
                            }
                        }
                    } else {
                    }
                } else {
                    dumyPackages.push(dealer);
                }
            });

            this.setState({
                packages: dumyPackages
            })
        } else {
            this.setState({
                packages: domainsCopy
            })
        }
    }

    componentDidMount() {
        this.props.getDomains(this.props.id)

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.domains !== nextProps.domains) {
            this.setState({
                domains: nextProps.domains
            })
        }
    }

    showDomainModal = () => {
        this.AddDomains.showModal(this.props.addDomain, true)
    }

    handleCancel = () => {
        this.setState({ visible: false })
    }

    deleteDomain = (item) => {
        let _this = this;

        confirm({
            title: <div>Are You Sure To Delete <span style={{ textDecoration: 'underline' }}>{item.domain_name}</span> Domain ?</div>,
            onOk() {
                _this.props.deleteDomains(item.id, _this.props.id)
            },
            onCancel() {
            },
        })
    }

    editDomain = (item) => {
        this.AddDomains.showModal(this.props.editDomain, true, "Edit Domain", item)
    }

    renderList = (type) => {

        if (this.state.domains) {
            return this.state.domains.map((item, index) => {
                return {
                    key: item.id,
                    action:
                        <Fragment>
                            <Button type="danger" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.deleteDomain(item) }}>DELETE </Button>
                            <Button type="primary" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.editDomain(item) }}>EDIT </Button>
                        </Fragment>
                    ,
                    domain_name: item.domain_name,
                    created_at: item.created_at
                }
            })
        }
    }



    handleComponentSearch = (value) => {

        try {
            if (value.length) {
                if (this.state.copyStatus) {
                    domainsCopy = this.state.domains;
                    this.state.copyStatus = false;
                }
                let foundDomains = componentSearch(domainsCopy, value);
                if (foundDomains.length) {
                    this.setState({
                        domains: foundDomains,
                    })
                } else {
                    this.setState({
                        domains: []
                    })
                }
            } else {
                this.state.copyStatus = true;
                this.setState({
                    domains: domainsCopy,
                })
            }
        } catch (error) {
        }
    }

    tabChaged = (e) => {
        // this.props.innerTabChanged(e)
        this.setState({
            tabSelected: e,
            innerTabData: this.state.prices ? this.state.prices[e] : {}
        })
    }
    render() {
        // 
        return (
            <div>
                <div>
                    <AppFilter
                        // handleFilterOptions={this.handleFilterOptions}
                        searchPlaceholder="Search Domains"
                        addButtonText={"Add Domain"}
                        // defaultPagingValue={this.state.defaultPagingValue}
                        // selectedOptions={this.props.selectedOptions}
                        // options={this.state.options}
                        isAddButton={true}
                        addDomain={true}
                        // handlePolicyModal={this.handlePolicyModal2}

                        showDomainModal={this.showDomainModal}

                        // handleCheckChange={this.handleCheckChange}
                        // handlePagination={this.handlePagination}
                        handleComponentSearch={this.handleComponentSearch}
                        pageTitle={this.props.whiteLabelName}

                    />


                    <Table
                        columns={this.columns}
                        dataSource={this.renderList()}
                        bordered
                        pagination={false}
                    />

                </div>
                <DomainsModal
                    wrappedComponentRef={(AddDomains) => this.AddDomains = AddDomains}
                    whitelabel_id={this.props.id}
                />

            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDomains,
        deleteDomains,
        addDomain,
        editDomain
    }, dispatch)
}


var mapStateToProps = ({ whiteLabels }, otherprops) => {
    return {
        domains: whiteLabels.domains
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ManageDomains);