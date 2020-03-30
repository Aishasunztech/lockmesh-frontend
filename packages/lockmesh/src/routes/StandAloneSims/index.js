import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AppFilter from '../../components/AppFilter';
import SimsList from "./components/StandAloneSimsList";
import { componentSearch, convertToLang, handleMultipleSearch, } from '../utils/commonUtils';

import {
    Appfilter_SearchUser
} from '../../constants/AppFilterConstants';


import {
    getStandaloneSimsList, changeSimStatus
} from "../../appRedux/actions/StandAloneSims";
import {
    getParentPackages,
    getAllSimIDs,
    getInvoiceId,
} from "../../appRedux/actions";

import { StandAloneSimsColumns } from '../utils/columnsUtils';

import AddSim from './components/AddStandAloneSims';
import { ADMIN } from '../../constants/Constants';

var copySimList = [];
var status = true;

class StandAloneSims extends Component {
    constructor(props) {
        super(props);
        var columns = StandAloneSimsColumns(props.translation, this.handleSearch);
        this.state = {
            orignalColumns: columns,
            columns: columns,
            packages: [],
            tabSelect: '1',
            simsList: props.simsList,
            SearchValues: []
        }
    }

    componentDidMount() {
        this.props.getStandaloneSimsList()
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            let updateState = {}
            if (this.props.translation !== prevProps.translation) {
                updateState.columns = StandAloneSimsColumns(this.props.translation, this.handleSearch)
            }
            if (this.props.simsList !== prevProps.simsList) {
                updateState.simsList = this.props.simsList
            }


            if (updateState != {}) {
                this.setState(updateState)
                // console.log("adsdsa");
            }
        }
    }

    handleComponentSearch = (value) => {
        //       
        try {
            if (value.length) {

                // 

                if (status) {
                    // 
                    copySimList = this.state.simsList;
                    status = false;
                }
                // 
                let foundUsers = componentSearch(copySimList, value);
                // 
                if (foundUsers.length) {
                    this.setState({
                        users: foundUsers,
                    })
                } else {
                    this.setState({
                        users: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    users: copySimList,
                })
            }
        } catch (error) {
            // alert("hello");
        }
    }

    handleAddSimModal = () => {
        this.refs.add_sim.showModal();
    }

    handleChangetab = (tabSelect) => {
        let columns = [...this.state.orignalColumns]
        let simsList = this.props.simsList
        if (tabSelect == 2) {
            columns.splice(5, 1)
            simsList = this.props.simsList.filter(item => item.type == 'device')
        } else if (tabSelect == 3) {
            columns.splice(2, 1)
            simsList = this.props.simsList.filter(item => item.type == 'standalone')
        }

        this.setState({
            tabSelect: tabSelect,
            columns: columns,
            simsList: simsList
        })
    }


    handleSearch = (e) => {
        // 
        // 

        this.state.SearchValues[e.target.name] = { key: e.target.name, value: e.target.value };

        let response = handleMultipleSearch(e, status, copySimList, this.state.SearchValues, this.state.simsList)


        this.setState({
            simsList: response.demoData,
            SearchValues: response.SearchValues
        });
        status = response.copy_status;
        copySimList = response.copyRequireSearchData;
    }

    render() {
        // console.log(this.props.getParentPackages);
        return (
            <Fragment>
                <AppFilter
                    searchPlaceholder={convertToLang(this.props.translation[Appfilter_SearchUser], "Search")}
                    defaultPagingValue={this.state.defaultPagingValue}
                    addButtonText={convertToLang(this.props.translation[""], "Add StandAlone Sim")}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    // isAddButton={false}
                    isAddButton={this.props.user.type !== ADMIN}
                    isAddSimButton={true}
                    // AddPolicyModel={true}
                    handleAddSimModal={this.handleAddSimModal}
                    handleCheckChange={this.handleCheckChange}
                    handlePagination={this.handlePagination}
                    handleComponentSearch={this.handleComponentSearch}
                    translation={this.props.translation}
                    pageHeading={convertToLang(this.props.translation[""], "SIMS")}
                />
                <AddSim
                    ref="add_sim"
                    translation={this.props.translation}
                    history={this.props.history}
                />

                <SimsList
                    onChangeTableSorting={this.handleTableChange}
                    columns={this.state.columns}
                    simsList={this.state.simsList}
                    pagination={this.props.DisplayPages}
                    ref="userList"
                    translation={this.props.translation}
                    user={this.props.user}
                    handleChangetab={this.handleChangetab}
                    tabSelect={this.state.tabSelect}
                    changeSimStatus={this.props.changeSimStatus}
                />
                {/* <UserList/> */}
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getStandaloneSimsList,
        getAllSimIDs,
        changeSimStatus
    }, dispatch);

}
var mapStateToProps = ({ auth, settings, standAloneSims, devices, users }) => {
    // console.log(devices);
    return {
        user: auth.authUser,
        translation: settings.translation,
        simsList: standAloneSims.standAloneSimsList,

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StandAloneSims);