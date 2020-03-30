import React, { Component, Fragment } from 'react'
import { Card, Button, Row, Col, Select, Input, Checkbox, Icon } from "antd";
// import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import styles from "./appfilter.css";
import Picky from 'react-picky';
import 'react-picky/dist/picky.css';
import { withRouter, Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    checkComponent,
    getUser
} from "../../appRedux/actions/Auth";

import {
    Tab_All,
    Tab_Active,
    Tab_Expired,
    Tab_Trial,
    Tab_Suspended,
    Tab_PreActivated,
    Tab_PendingActivation,
    Tab_Transfer,
    Tab_Unlinked,
    Tab_Flagged,
    Tab_ComingSoon,
    Tab_Archived,
} from '../../constants/TabConstants';

import {
    Devices_Top_Bar,
    Appfilter_SelectAll,
    Appfilter_ShowDevices,
    Appfilter_SearchDevices,
    Dealer_Top_Bar,
    Appfilter_ShowDealer,
    Appfilter_SearchDealer,
    Appfilter_Display
} from '../../constants/AppFilterConstants';

import { convertToLang, getDefaultLanguage } from '../../routes/utils/commonUtils';
import { ADMIN } from '../../constants/Constants';
// Picky.prototype={
//     value: new PropTypes.object(),
// }
class AppFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedDisplayValues: [],
            DisplayPages: this.props.defaultPagingValue,
        }
    }

    componentDidMount() {
        this.setState({
            selectedDisplayValues: this.props.selectedOptions,
        });
        //this.setDropdowns(this.props.selectedOptions);
        // alert('did mount ', )
        // this.setDropdowns(this.props.selectedOptions);
        // console.log("componentDidMount12", this.state.selectedDisplayValues);
        // this.props.handleCheckChange(this.props.selectedOptions);
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.selectedOptions, 'component will recieve props', this.props.selectedOptions);
        if (this.props.defaultPagingValue !== nextProps.defaultPagingValue) {
            // console.log("Will Recieve Props", nextProps.defaultPagingValue, this.props.defaultPagingValue);
            this.setPagination(nextProps.defaultPagingValue)
        }
        // if (this.props.selectedOptions !== nextProps.selectedOptions) {
        // console.log(nextProps.selectedOptions, "componentWillReceiveProps selectedOptions", this.props.selectedOptions);
        // console.log("componentWillReceiveProps", this.state.selectedDisplayValues);
        // alert('recive props', nextProps.selectedOptions);
        // console.log(' recive props set dropdwon', nextProps);
        // this.setDropdowns(nextProps.selectedOptions);

        //  this.props.handleCheckChange();
        // }
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedOptions !== prevProps.selectedOptions) {
            this.setDropdowns(this.props.selectedOptions);
        }
    }

    setDropdowns(values) {
        // console.log('setDropdowns val : ', values)   
        this.setState({
            selectedDisplayValues: values,
        });
        // console.log('values:',this.state.selectedDisplayValues);
        this.props.handleCheckChange(values);
        //  alert('set dropdwon');
        // console.log('set dropdwon');
    }
    setPagination(value) {
        // console.log("Set State", value);
        this.setState({
            DisplayPages: value
        })
        this.props.handlePagination(value);
    }

    handlePagination(value) {
        // console.log(value);
        this.setState({ DisplayPages: value })
        this.props.handlePagination(value);
    }

    handleComponentSearch = (value) => {
        this.props.handleComponentSearch(value);
    }

    render() {
        let type = this.props.user.type
        let buttonType = false;
        if (type === ADMIN) {
            if (this.props.AddDeviceModal || this.props.isAddUserButton || this.props.isAddAgentButton) { buttonType = { display: "none" } }
        }

        const { translation } = this.props;

        let fullScreenClass1 = "";
        let fullScreenClass2 = "";
        let fullScreenClass3 = "";

        if (this.props.isAddButton === false) {
            fullScreenClass1 = "col-md-3";
            fullScreenClass2 = "col-md-3";
            fullScreenClass3 = "col-md-3";
        } else {
            fullScreenClass1 = "col-md-3";
            fullScreenClass2 = "col-md-2";
            fullScreenClass3 = "col-md-2";
        }

        // console.log('render props selectedOptions ...', this.props.selectedOptions, this.props.options);
        //  console.log('allSelected val this.props.selectedOptions are: ', this.props.selectedOptions)
        // console.log('render state selectedDisplayValues ...', this.state.selectedDisplayValues);
        let allSelectedOpt;
        if (this.state.selectedDisplayValues !== undefined && this.props.options !== undefined) {
            if (this.props.options.length === this.state.selectedDisplayValues.length) {
                allSelectedOpt = true;
            } else { allSelectedOpt = false }
            //  console.log('allSelectedOpt val are: ', allSelectedOpt)
        }

        return (
            // className="gutter-example"
            <Card className="sticky_top_bar">
                <Row gutter={24} className="filter_top">
                    <Col className={`${fullScreenClass3} col-sm-12 col-xs-12 vertical_center`}>
                        <span className="font_26_vw white_now">
                            {(this.props.pageHeading) ? this.props.pageHeading : ""}
                        </span>
                    </Col>
                    <Col className={`${fullScreenClass1} col-sm-6 col-xs-6`}>
                        <div className="m_mt-16">
                            {(this.props.options !== undefined && this.props.options !== null) ?
                                <Fragment>

                                    <Picky
                                        options={this.props.options}
                                        valueKey="key"
                                        labelKey="value"
                                        value={this.state.selectedDisplayValues}
                                        placeholder={convertToLang(translation[Appfilter_Display], "Display")}
                                        manySelectedPlaceholder={allSelectedOpt ? "All Selected" : `${this.state.selectedDisplayValues.length} selected`}
                                        allSelectedPlaceholder={allSelectedOpt ? "All Selected" : ""}
                                        className="display_"
                                        multiple={true}
                                        numberDisplayed={true}
                                        includeSelectAll={true}
                                        onChange={values => this.setDropdowns(values)}
                                        dropdownHeight={300}
                                        caseSensitiveFilter={false}
                                        renderSelectAll={({
                                            filtered,
                                            tabIndex,
                                            allSelected,
                                            toggleSelectAll,
                                            multiple
                                        }) => {
                                            // Don't show if single select or items have been filtered.
                                            if (multiple && !filtered) {
                                                return (

                                                    <li
                                                        tabIndex={tabIndex}
                                                        role="option"
                                                        className={allSelected ? 'option selected' : 'option'}
                                                        onClick={toggleSelectAll}
                                                        onKeyPress={toggleSelectAll}
                                                        key={tabIndex}
                                                    >
                                                        <Checkbox checked={allSelectedOpt} className="slct_all upper_case">
                                                            <span className="upper_case">  {convertToLang(translation[Appfilter_SelectAll], "Select All")}</span>
                                                        </Checkbox>
                                                    </li>
                                                );
                                            }
                                        }
                                        }
                                        render={({
                                            style,
                                            isSelected,
                                            item,
                                            selectValue,
                                            labelKey,
                                            valueKey,
                                            multiple
                                        }) => {
                                            let extraText = (item.value == "tableHeadings.REMAININGDAYS") ? `(${convertToLang(this.props.translation["pre.activated.tab.extra.id"], "PRE-ACTIVATED TAB)")})` : "";
                                            return (
                                                <li
                                                    style={style} // required
                                                    className={isSelected ? 'selected' : ''} // required to indicate is selected
                                                    key={item.key} // required
                                                    onClick={() => selectValue({ "key": item.key, "value": convertToLang(this.props.translation[item.value], item.value) })}
                                                >
                                                    <Checkbox checked={isSelected}>{`${getDefaultLanguage(convertToLang(this.props.translation[item.value], item.value))}  ${extraText}`}</Checkbox>
                                                </li>
                                            );
                                        }
                                        }

                                        // Filter Options
                                        // includeFilter={true}
                                        // onFiltered={(e)=> {
                                        //     console.log(e)
                                        // }}

                                    />
                                    <Icon type="down" className="down_icon" />
                                </Fragment>
                                :
                                null
                            }

                        </div>
                    </Col>
                    <Col className={`${fullScreenClass1} col-sm-6 col-xs-6`}>
                        <div className="m_mt-16">
                            {(this.props.handleFilterOptions !== undefined && this.props.handleFilterOptions !== null) ? this.props.handleFilterOptions() : null}
                        </div>
                    </Col>
                    <Col className={`${fullScreenClass2} col-sm-12 col-xs-12`}>
                        <div className="m_mt-16">
                            {(this.props.handleComponentSearch) ? (
                                <Input.Search
                                    placeholder={this.props.searchPlaceholder}
                                    onChange={e => this.handleComponentSearch(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            ) : null}

                        </div>
                    </Col>
                    <Col className={`${fullScreenClass2} col-sm-12 col-xs-12`} style={(buttonType) ? buttonType : { display: "block" }}>
                        <div className="m_mt-16">
                            {
                                (this.props.isAddButton === true) ?
                                    (this.props.toLink !== undefined && this.props.toLink !== '' && this.props.toLink !== null) ?
                                        <Link to={this.props.toLink}>
                                            <Button
                                                type="primary"
                                                disabled={(this.props.disableAddButton === true) ? true : false}
                                                style={{ width: '100%' }}
                                            >
                                                {this.props.addButtonText}
                                            </Button>
                                        </Link>
                                        : (this.props.addDealer) ?
                                            <Button
                                                type="primary"
                                                disabled={(this.props.disableAddButton === true) ? true : false}
                                                style={{ width: '100%' }}
                                                onClick={() => this.props.addDealer(true)}
                                            >
                                                {this.props.addButtonText}
                                            </Button>
                                            :
                                            (this.props.AddDeviceModal) ?
                                                <Button
                                                    type="primary"
                                                    disabled={(this.props.disableAddButton === true) ? true : false}
                                                    style={{ width: '100%' }}
                                                    onClick={() => this.props.handleDeviceModal(true)}
                                                >
                                                    {this.props.addButtonText}
                                                </Button>
                                                :
                                                (this.props.AddPolicyModel) ?
                                                    <Button
                                                        type="primary"
                                                        disabled={(this.props.disableAddButton === true) ? true : false}
                                                        style={{ width: '100%' }}
                                                        onClick={() => this.props.handlePolicyModal(true)}
                                                    >
                                                        {this.props.addButtonText}
                                                    </Button>
                                                    : (this.props.handleUploadApkModal) ?
                                                        <Button
                                                            type="primary"
                                                            disabled={(this.props.disableAddButton === true) ? true : false}
                                                            style={{ width: '100%' }}
                                                            onClick={() => this.props.handleUploadApkModal(true)}
                                                        >
                                                            {this.props.addButtonText}
                                                        </Button>
                                                        : (this.props.setPrice) ?
                                                            <Button
                                                                type="primary"
                                                                disabled={(this.props.disableAddButton === true) ? true : false}
                                                                style={{ width: '100%' }}
                                                                onClick={() => this.props.showPricingModal(true)}
                                                            >
                                                                {this.props.addButtonText}
                                                            </Button>
                                                            :
                                                            (this.props.handleUserModal) ?
                                                                <Button
                                                                    type="primary"
                                                                    disabled={(this.props.disableAddButton === true) ? true : false}
                                                                    style={{ width: '100%' }}
                                                                    onClick={() => this.props.handleUserModal()}
                                                                >
                                                                    {this.props.addButtonText}
                                                                </Button> :
                                                                (this.props.handleSendMsgModal) ?
                                                                    <Button
                                                                        type="primary"
                                                                        // disabled={(this.props.disableAddButton === true) ? true : false}
                                                                        style={{ width: '100%' }}
                                                                        onClick={() => this.props.handleSendMsgButton(true)}
                                                                    >
                                                                        {this.props.addButtonText}
                                                                    </Button>
                                                                    :
                                                                    (this.props.isAddSimButton) ?
                                                                        <Button
                                                                            type="primary"
                                                                            // disabled={(this.props.disableAddButton === true) ? true : false}
                                                                            style={{ width: '100%' }}
                                                                            onClick={() => this.props.handleAddSimModal(true)}
                                                                        >
                                                                            {this.props.addButtonText}
                                                                        </Button>
                                                                        :
                                                                        <Button
                                                                            type="primary"
                                                                            disabled={(this.props.disableAddButton === true) ? true : false}
                                                                            style={{ width: '100%' }}
                                                                            onClick={() => this.props.handleAppFilterAddButton(true)}
                                                                        >
                                                                            {this.props.addButtonText}
                                                                        </Button>

                                    : null
                            }
                        </div>
                    </Col>
                    {/* {(false) ?//!this.props.setPrice
                        <Col className={`${fullScreenClass2} col-sm-6 col-xs-12`}>
                            <div className="m_mt-16">
                                <Select
                                    value={this.state.DisplayPages}
                                    //  defaultValue={this.state.DisplayPages}
                                    style={{ width: '100%' }}
                                    // onSelect={value => this.setState({DisplayPages:value})}
                                    onChange={value => this.handlePagination(value)}
                                >
                                    <Select.Option value="10" >10</Select.Option>
                                    <Select.Option value="20">20</Select.Option>
                                    <Select.Option value="30">30</Select.Option>
                                    <Select.Option value="50">50</Select.Option>
                                    <Select.Option value="100">100</Select.Option>
                                </Select>
                            </div>
                        </Col>
                        :
                        <Col />
                    } */}
                </Row>
            </Card >
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // checkComponent: checkComponent,
        // getUser: getUser
    }, dispatch);
}
var mapStateToProps = ({ routing, auth }, otherProps) => {
    // console.log("restricted route", routing);
    // console.log("restricted auth", auth);
    // console.log("restricted other", otherProps);
    return {
        user: auth.authUser,
        // routing: routing,
        pathname: routing.location.pathname,
        // authUser: auth.authUser,
        // isAllowed: auth.isAllowed
    };
}

/**
 * @author Usman Hafeez
 * commented withRouter function
 */
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppFilter));
export default connect(mapStateToProps, mapDispatchToProps)(AppFilter);

