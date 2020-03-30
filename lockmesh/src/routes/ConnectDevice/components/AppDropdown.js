import React, { Component, Fragment } from 'react'
import { Icon, Popover, Checkbox } from 'antd';
import Styles from "./Applist.css";
import { GUEST_ALL, Encrypted_ALL, Enable_ALL, SHOW_ALL } from '../../../constants/Constants';
import { convertToLang } from '../../utils/commonUtils';

export default class AppDropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guestAll: false,
            encryptedAll: false,
            enableAll: false
        }
    }
    componentDidMount() {
        // console.log("AppDropdown");
        // console.log(this.props);
        this.setState({
            guestAll: this.props.guestAll,
            encryptedAll: this.props.encryptedAll,
            enableAll: this.props.enableAll,
        });
    }
    componentWillReceiveProps(nextProps) {
        // if(this.props !== nextProps){
        // alert("hello");
        // console.log("appdropdown nextprops", nextProps);
        // this.state[this.checked_app_id.key] = this.checked_app_id.value;
        this.setState({
            guestAll: nextProps.guestAll,
            encryptedAll: nextProps.encryptedAll,
            enableAll: nextProps.enableAll,
        })
        // }
    }
    handleCheckedAll = (e, key) => {
        // console.log("hello world");
        // console.log(e.target.checked,key);
        this.props.handleCheckedAll(key, e.target.checked);
    }

    renderDropdown() {
        return (
            <div className="applist_menu">
                {this.props.type === "guest" ?
                    <Fragment>
                        <Checkbox checked={this.state.guestAll ? true : false} onChange={(e) => {
                            this.handleCheckedAll(e, "guestAll");
                        }}>{convertToLang(this.props.translation[SHOW_ALL], "Show All")}</Checkbox> <br></br>
                    </Fragment>
                    : null}
                {this.props.type === "encrypted" ?
                    <Fragment>
                        <Checkbox checked={this.state.encryptedAll ? true : false} onChange={(e) => {
                            this.handleCheckedAll(e, "encryptedAll");
                        }}>{convertToLang(this.props.translation[SHOW_ALL], "Show All")}</Checkbox>
                        <br></br>
                    </Fragment>
                    : null
                }
                <Checkbox checked={this.state.enableAll ? true : false} onChange={(e) => {
                    this.handleCheckedAll(e, "enableAll");
                }}>{convertToLang(this.props.translation[Enable_ALL], "Enable All")}</Checkbox>
            </div>
        );
    }
    render() {
        return (
            <Popover className="list_d_down" placement="bottomRight" content={this.renderDropdown()} trigger="click">
                <a><Icon type="ellipsis" /></a>
            </Popover>
        )
    }
}
