import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Table, Card, Input, Icon, Modal } from 'antd';
import {
    getPrices, resetPrice, setPackage,
    saveIDPrices, setPrice, getPackages, saveHardware, getHardwares, deletePakage, deleteHardware, editHardware
} from '../../../../appRedux/actions';
import { sim, chat, pgp, vpn } from '../../../../constants/Constants';
import AppFilter from '../../../../components/AppFilter/index';
import PricesList from './components/pricesList';
import { componentSearch, getDealerStatus, titleCase } from '../../../utils/commonUtils';
import {
    TAB_SIM_ID,
    TAB_CHAT_ID,
    TAB_PGP_EMAIL,
    TAB_VPN
} from '../../../../constants/LabelConstants';
import { isArray } from "util";
import WhiteLabelPricing from './WhiteLabelPricing';
import EditHardware from './components/EditHardware';
const confirm = Modal.confirm
let packagesCopy = [];
let hardwaresCopy = [];
class Prices extends Component {
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
                        name="pkg_name"
                        key="pkg_name"
                        id="pkg_name"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder='PACKAGE NAME'
                    />
                ),
                dataIndex: 'pkg_name',
                className: '',
                children: [
                    {
                        title: 'PACKAGE NAME',
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_name',
                        key: 'pkg_name',
                        sorter: (a, b) => { return a.pkg_name.localeCompare(b.pkg_name) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="pkg_term"
                        key="pkg_term"
                        id="pkg_term"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder='PACKAGE TERM'
                    />
                ),
                dataIndex: 'pkg_term',
                className: '',
                children: [
                    {
                        title: 'PACKAGE TERM',
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_term',
                        key: 'pkg_term',
                        // ...this.getColumnSearchProps('status'),
                        sorter: (a, b) => { return a.pkg_term.localeCompare(b.pkg_term) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <span>
                        Services
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'permission',
                key: 'permission',
                className: 'row '
            },
            {
                title: (
                    <Input.Search
                        name="pkg_price"
                        key="pkg_price"
                        id="pkg_price"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder='PACKAGE PRICE'
                    />
                ),
                dataIndex: 'pkg_price',
                className: '',
                children: [
                    {
                        title: 'PACKAGE PRICE',
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_price',
                        key: 'pkg_price',
                        // ...this.getColumnSearchProps('status'),
                        // sorter: (a, b) => { return a.pkg_price - b.pkg_price },
                        sorter: (a, b) => { return a.pkg_price.localeCompare(b.pkg_price) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="pkg_expiry"
                        key="pkg_expiry"
                        id="pkg_expiry"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder='EXPIRY'
                    />
                ),
                dataIndex: 'pkg_expiry',
                className: '',
                children: [
                    {
                        title: 'EXPIRY',
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_expiry',
                        key: 'pkg_expiry',
                        // ...this.getColumnSearchProps('status'),
                        sorter: (a, b) => { return a.pkg_expiry - b.pkg_expiry },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            }
        ];

        this.hardwareColumns = [
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
                // width: 800,
            },
            {
                title: (
                    <Input.Search
                        name="name"
                        key="name"
                        id="name"
                        className="search_heading"
                        onKeyUp={this.handleHDWSearch}
                        autoComplete="new-password"
                        placeholder='HARDWARE NAME'
                    />
                ),
                dataIndex: 'name',
                className: '',
                children: [
                    {
                        title: 'HARDWARE NAME',
                        align: "center",
                        className: '',
                        dataIndex: 'name',
                        key: 'name',
                        sorter: (a, b) => { return a.name.localeCompare(b.name) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },

            {
                title: (
                    <Input.Search
                        name="price"
                        key="price"
                        id="price"
                        className="search_heading"
                        onKeyUp={this.handleHDWSearch}
                        autoComplete="new-password"
                        placeholder='HADWARE PRICE (CREDITS)'
                    />
                ),
                dataIndex: 'price',
                className: '',
                children: [
                    {
                        title: 'HARDWARE PRICE (CREDITS)',
                        align: "center",
                        className: '',
                        dataIndex: 'price',
                        key: 'price',
                        // ...this.getColumnSearchProps('status'),
                        // sorter: (a, b) => { return a.price - b.price },
                        sorter: (a, b) => { return a.price.localeCompare(b.price) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            }
        ];
        this.standaloneColumns = [
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
                // width: 800,
            },
            {
                title: (
                    <Input.Search
                        name="pkg_name"
                        key="pkg_name"
                        id="pkg_name"
                        className="search_heading"
                        onKeyUp={this.handleHDWSearch}
                        autoComplete="new-password"
                        placeholder='NAME'
                    />
                ),
                dataIndex: 'pkg_name',
                className: '',
                children: [
                    {
                        title: 'NAME',
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_name',
                        key: 'pkg_name',
                        sorter: (a, b) => { return a.name.localeCompare(b.name) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },

            {
                title: (
                    <Input.Search
                        name="pkg_price"
                        key="pkg_price"
                        id="pkg_price"
                        className="search_heading"
                        onKeyUp={this.handleHDWSearch}
                        autoComplete="new-password"
                        placeholder='PRICE (CREDITS)'
                    />
                ),
                dataIndex: 'pkg_price',
                className: '',
                children: [
                    {
                        title: 'PRICE (CREDITS)',
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_price',
                        key: 'pkg_price',
                        // ...this.getColumnSearchProps('status'),
                        // sorter: (a, b) => { return a.price - b.price },
                        sorter: (a, b) => { return a.price.localeCompare(b.price) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="pkg_term"
                        key="pkg_term"
                        id="pkg_term"
                        className="search_heading"
                        onKeyUp={this.handleHDWSearch}
                        autoComplete="new-password"
                        placeholder='TERM'
                    />
                ),
                dataIndex: 'pkg_term',
                className: '',
                children: [
                    {
                        title: 'TERM',
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_term',
                        key: 'pkg_term',
                        // ...this.getColumnSearchProps('status'),
                        // sorter: (a, b) => { return a.price - b.price },
                        sorter: (a, b) => { return a.price.localeCompare(b.price) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            }
        ];

        this.state = {
            pricing_modal: false,
            innerTabData: this.props.prices ? this.props.prices[sim] : {},
            tabSelected: sim,
            packages: [],
            copyStatus: true,
            copyHDWStatus: true,
            isPriceChanged: this.props.isPriceChanged,
            hardwares: [],
            visible: false,
            editHardwareObj: {},
            packageListTab: '1'
        }
    }

    handleSearch = (e) => {

        let dummyPackages = [];
        if (this.state.copyStatus) {
            packagesCopy = this.state.packages;
            this.state.copyStatus = false;
        }

        if (e.target.value.length) {

            packagesCopy.forEach((dealer) => {

                if (dealer[e.target.name] !== undefined) {
                    if ((typeof dealer[e.target.name]) === 'string') {
                        if (dealer[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            dummyPackages.push(dealer);
                        }
                    } else if (dealer[e.target.name] != null) {
                        if (dealer[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            dummyPackages.push(dealer);
                        }
                        if (isArray(dealer[e.target.name])) {
                            if (dealer[e.target.name][0]['total'].includes(e.target.value)) {
                                dummyPackages.push(dealer);
                            }
                        }
                    } else {
                    }
                } else {
                    dummyPackages.push(dealer);
                }
            });

            this.setState({
                packages: dummyPackages
            })
        } else {
            this.setState({
                packages: packagesCopy
            })
        }
    }

    handleHDWSearch = (e) => {

        let dumyHardwares = [];
        if (this.state.copyHDWStatus) {
            hardwaresCopy = this.state.hardwares;
            this.state.copyHDWStatus = false;
        }

        if (e.target.value.length) {

            hardwaresCopy.forEach((dealer) => {

                if (dealer[e.target.name] !== undefined) {
                    if ((typeof dealer[e.target.name]) === 'string') {
                        if (dealer[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            dumyHardwares.push(dealer);
                        }
                    } else if (dealer[e.target.name] != null) {
                        if (dealer[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            dumyHardwares.push(dealer);
                        }
                        if (isArray(dealer[e.target.name])) {
                            if (dealer[e.target.name][0]['total'].includes(e.target.value)) {
                                dumyHardwares.push(dealer);
                            }
                        }
                    } else {
                    }
                } else {
                    dumyHardwares.push(dealer);
                }
            });

            this.setState({
                hardwares: dumyHardwares
            })
        } else {
            this.setState({
                hardwares: hardwaresCopy
            })
        }
    }

    componentDidMount() {
        this.props.getPrices(this.props.id);
        this.props.getPackages(this.props.id)
        this.props.getHardwares(this.props.id)
        this.setState({
            prices: this.props.prices,
            innerTabData: this.props.prices ? this.props.prices[sim] : {},
            packages: this.props.packages,
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                prices: nextProps.prices,
                packages: nextProps.packages,
                isPriceChanged: nextProps.isPriceChanged,
                hardwares: nextProps.hardwares,
                copyStatus: true
            })
        }
    }

    showPricingModal = (visible) => {
        this.setState({
            pricing_modal: visible
        })
    }


    editHardware = (hd) => {
        this.setState({ visible: true, editHardwareObj: hd })
    }

    handleCancel = () => {
        this.setState({ visible: false })
    }

    deleteHardware = (item) => {
        let _this = this;

        confirm({
            title: <div>Are You Sure To Delete <span style={{ textDecoration: 'underline' }}>{item.name}</span> Hardware ?</div>,
            onOk() {
                _this.props.deleteHardware(item.id)
            },
            onCancel() {
            },
        })
    }

    deletePackage = (item) => {
        let _this = this;

        confirm({
            title: <div>Are You Sure To Delete <span style={{ textDecoration: 'underline' }}>{item.pkg_name}</span> Package ?</div>,
            onOk() {
                _this.props.deletePakage(item.id)
            },
            onCancel() {
            },
        })
    }


    renderList = (type, tab) => {
        if (type === 'packages') {
            // 
            if (this.state.packages) {
                let packages_type = 'services';
                // console.log(this.state.tabSelected);
                if (tab === '4') {
                    packages_type = 'standalone_sim';
                }
                else if (this.state.packageListTab === '1') {
                    packages_type = 'services';
                }
                else if (this.state.packageListTab === '2') {
                    packages_type = 'data_plan';
                }
                let packages = this.state.packages.filter(packageItem => packageItem.package_type === packages_type);
                return packages.map((item, index) => {
                    return {
                        key: item.id,
                        action: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.deletePackage(item) }}>DELETE </Button>,
                        pkg_name: item.pkg_name,
                        pkg_price: item.pkg_price,
                        pkg_term: item.pkg_term,
                        pkg_features: item.pkg_features ? JSON.parse(item.pkg_features) : {},
                        pkg_expiry: item.pkg_expiry
                    }
                })
            }
        } else if (type === "hardware") {
            if (this.state.hardwares) {

                return this.state.hardwares.map((item, index) => {
                    return {
                        key: item.id,
                        action: <Fragment>
                            <Button type="primary" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => this.editHardware(item)} >EDIT</Button>
                            <Button type="danger" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.deleteHardware(item) }}>DELETE </Button>
                        </Fragment>,
                        name: item.name,
                        price: item.price
                    }
                })
            }
        }
        // 
    }

    customExpandIcon(props) {
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /></a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }

    renderFeatures = (data) => {
        let features = [];
        if (Object.keys(data).length !== 0 && data.constructor === Object) {

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    // 
                    let name = key;
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                    let dump = {
                        name: name.replace(/_/g, ' '),
                        f_value: data[key] ? "yes" : 'No',
                        rowKey: name
                    }

                    features.push(dump)
                }
            }
        }
        // 
        return features
    }


    handleComponentSearch = (value) => {

        try {
            if (value.length) {
                if (this.state.copyStatus) {
                    packagesCopy = this.state.packages;
                    this.state.copyStatus = false;
                }
                let foundPackages = componentSearch(packagesCopy, value);
                if (foundPackages.length) {
                    this.setState({
                        packages: foundPackages,
                    })
                } else {
                    this.setState({
                        packages: []
                    })
                }
            } else {
                this.state.copyStatus = true;
                this.setState({
                    packages: packagesCopy,
                })
            }
        } catch (error) {
        }
    }

    tabChanged = (e) => {
        // this.props.innerTabChanged(e)
        this.setState({
            tabSelected: e,
            innerTabData: this.state.prices ? this.state.prices[e] : {}
        })
    }

    packagesFilterHandler = (e) => {
        this.setState({
            packageListTab: e
        })

    }
    render() {
        // 
        return (
            <div>
                <div>
                    <AppFilter
                        // handleFilterOptions={this.handleFilterOptions}
                        searchPlaceholder="Search Packages"
                        addButtonText={"Set Price"}
                        // defaultPagingValue={this.state.defaultPagingValue}
                        // selectedOptions={this.props.selectedOptions}
                        // options={this.state.options}
                        isAddButton={true}
                        setPrice={true}
                        // handlePolicyModal={this.handlePolicyModal2}

                        showPricingModal={this.showPricingModal}

                        // handleCheckChange={this.handleCheckChange}
                        // handlePagination={this.handlePagination}
                        handleComponentSearch={this.handleComponentSearch}
                        pageTitle={this.props.whiteLabelName}

                    />

                    <Card>

                        {/* Prices */}
                        <Tabs
                            // className="set_price"
                            type="card"
                            onChange={(e) => this.setState({ outerTab: e })}
                        >
                            <Tabs.TabPane tab="ID Prices" key="1">
                                <div>
                                    <Tabs
                                        tabPosition={'left'}
                                        type="card"
                                        onChange={(e) => this.tabChanged(e)}
                                        style={{ width: '10%', float: 'left' }}
                                    >
                                        <Tabs.TabPane tab={TAB_SIM_ID} key={sim} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={TAB_CHAT_ID} key={chat} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={TAB_PGP_EMAIL} key={pgp} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={TAB_VPN} key={vpn} >

                                        </Tabs.TabPane>
                                    </Tabs>
                                    <div style={{ width: '90%', float: 'right' }}>
                                        <PricesList
                                            data={this.state.prices ? this.state.prices[this.state.tabSelected] : {}}
                                            tabSelected={this.state.tabSelected}

                                        />
                                    </div>
                                </div>
                            </Tabs.TabPane>

                            {/* Packages */}
                            <Tabs.TabPane tab="Packages" key="2">
                                <Tabs
                                    tabPosition={'left'}
                                    type="card"
                                    onChange={(e) => this.packagesFilterHandler(e)}
                                    style={{ width: '10%', float: 'left' }}
                                >
                                    <Tabs.TabPane tab={'Service Packages'} key='1' >

                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={'Data Plan Packages'} key='2' >

                                    </Tabs.TabPane>
                                </Tabs>

                                <div style={{ width: '90%', float: 'right' }}>
                                    <Table
                                        columns={this.columns}
                                        dataSource={this.renderList("packages")}
                                        expandIcon={(props) => this.customExpandIcon(props)}
                                        bordered
                                        expandIconAsCell={false}
                                        expandIconColumnIndex={4}
                                        expandedRowRender={record => {
                                            if (Object.keys(record.pkg_features).length !== 0 && record.pkg_features.constructor === Object) {
                                                return (
                                                    <Table
                                                        columns={[
                                                            { title: 'Service Name', dataIndex: 'name', key: 'name', align: 'center' },
                                                            { title: 'Included', key: 'f_value', dataIndex: 'f_value', align: 'center' }]}
                                                        dataSource={this.renderFeatures(record.pkg_features)}
                                                        pagination={false}
                                                    />
                                                )
                                            } else {
                                                return null
                                            }


                                        }}
                                        pagination={false}

                                    />
                                </div>

                            </Tabs.TabPane>

                            {/* Hardware */}
                            <Tabs.TabPane tab="Hardware" key="3">
                                <Table
                                    columns={this.hardwareColumns}
                                    dataSource={this.renderList("hardware")}
                                    bordered
                                    pagination={false}
                                />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Stand Alone Sims" key="4">
                                <Table
                                    columns={this.standaloneColumns}
                                    dataSource={this.renderList("packages", '4')}
                                    bordered
                                    pagination={false}
                                />
                            </Tabs.TabPane>
                        </Tabs>

                    </Card>
                </div>

                <WhiteLabelPricing
                    showPricingModal={this.showPricingModal}
                    pricing_modal={this.state.pricing_modal}
                    LabelName={this.props.whiteLabelName}
                    saveIDPrices={this.props.saveIDPrices}
                    // whitelabel_id={this.props.whiteLabelInfo.id}
                    setPackage={this.props.setPackage}
                    prices={this.props.prices}
                    setPrice={this.props.setPrice}
                    saveHardware={this.props.saveHardware}
                    isPriceChanged={this.state.isPriceChanged}
                    resetPrice={this.props.resetPrice}
                    whitelabel_id={this.props.id}
                />

                <Modal
                    title="Edit Hardware"
                    visible={this.state.visible}
                    maskClosable={false}
                    footer={false}
                >
                    <EditHardware
                        editHardwareObj={this.state.editHardwareObj}
                        editHardwareFunc={this.props.editHardware}
                        handleCancel={this.handleCancel}
                    />
                </Modal>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPrices: getPrices,
        saveIDPrices: saveIDPrices,
        setPackage: setPackage,
        resetPrice: resetPrice,
        setPrice: setPrice,
        getPackages: getPackages,
        saveHardware: saveHardware,
        getHardwares: getHardwares,
        deletePakage: deletePakage,
        deleteHardware: deleteHardware,
        editHardware: editHardware
    }, dispatch)
}


var mapStateToProps = ({ whiteLabels }, otherProps) => {
    // 
    return {
        prices: whiteLabels.prices,
        packages: whiteLabels.packages,
        isPriceChanged: whiteLabels.isPriceChanged,
        hardwares: whiteLabels.hardwares
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Prices);