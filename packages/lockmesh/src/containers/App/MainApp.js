import React, { Component } from "react";
import { Layout } from "antd";
import { connect } from "react-redux";
import IdleTimer from 'react-idle-timer'

import Sidebar from "../Sidebar/index";
import RightSidebar from "../RightSidebar";

import HorizontalDefault from "../Topbar/HorizontalDefault/index";
import HorizontalDark from "../Topbar/HorizontalDark/index";
import InsideHeader from "../Topbar/InsideHeader/index";
import AboveHeader from "../Topbar/AboveHeader/index";
import BelowHeader from "../Topbar/BelowHeader/index";
import Topbar from "../Topbar/index";
import { checkMicrServiceStatus } from "../../appRedux/actions";
import { closeSupportSystemSocket, closeConnectPageSocketEvents, closeWebSocket } from '../../appRedux/actions/Socket';

import Customizer from "./Customizer";

import { footerText } from "../../util/config";
import App from "../../routes/index";

import {
	connectSocket,
	connectSupportSystemSocket,
	hello_web,
	getNotification
} from '../../appRedux/actions'

import {
	NAV_STYLE_ABOVE_HEADER,
	NAV_STYLE_BELOW_HEADER,
	NAV_STYLE_DARK_HORIZONTAL,
	NAV_STYLE_DEFAULT_HORIZONTAL,
	NAV_STYLE_DRAWER,
	NAV_STYLE_FIXED,
	NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
	NAV_STYLE_MINI_SIDEBAR,
	NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
	NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
	TAB_SIZE
} from "../../constants/ThemeSetting";
import NoHeaderNotification from "../Topbar/NoHeaderNotification/index";
import { HOST_NAME } from "../../constants/Application";

const { Content, Footer } = Layout;

export class MainApp extends Component {
	constructor(props) {
		super(props)

		this.idleTimer = null
		this.onAction = this._onAction.bind(this)
		this.onActive = this._onActive.bind(this)
		this.onIdle = this._onIdle.bind(this)

		this.state = {
			seconds: 0,
			interval: null
		};
	}

	componentDidMount() {
    if(!this.props.microServiceRunning){
      this.props.checkMicrServiceStatus();
    }
		if ((!this.props.socket || !this.props.socket.connected)) {
			this.props.connectSocket();
		}
	}

	componentWillReceiveProps(nextProps) {

		// if(nextProps.socket && nextProps.socket.connected){
		// if(nextProps.socket ){

		//   // this.props.hello_web(nextProps.socket);
		//   // this.props.getNotification(nextProps.socket)
		// }
	}

	componentDidUpdate(prevProps){
	  if(this.props !== prevProps){
      if(this.props.microServiceRunning !== prevProps.microServiceRunning){
        this.props.checkMicrServiceStatus();
      }

	    if (this.props.microServiceRunning && (!this.props.supportSystemSocket)) {
        this.props.connectSupportSystemSocket();
      }
    }
  }

	componentWillUnmount() {
	  if(this.props.microServiceRunning && this.props.supportSystemSocket !== null && this.props.supportSystemSocket.connected){
	    this.props.closeSupportSystemSocket(this.props.supportSystemSocket);
    }

    if(this.props.socket && this.props.socket.connected){
	    this.props.closeWebSocket(this.props.socket);
    }
	}

	getContainerClass = (navStyle) => {
		switch (navStyle) {
			case NAV_STYLE_DARK_HORIZONTAL:
				return "gx-container-wrap";
			case NAV_STYLE_DEFAULT_HORIZONTAL:
				return "gx-container-wrap";
			case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
				return "gx-container-wrap";
			case NAV_STYLE_BELOW_HEADER:
				return "gx-container-wrap";
			case NAV_STYLE_ABOVE_HEADER:
				return "gx-container-wrap";
			default:
				return '';
		}
	};
	getNavStyles = (navStyle) => {
		switch (navStyle) {
			case NAV_STYLE_DEFAULT_HORIZONTAL:
				return <HorizontalDefault />;
			case NAV_STYLE_DARK_HORIZONTAL:
				return <HorizontalDark />;
			case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
				return <InsideHeader />;
			case NAV_STYLE_ABOVE_HEADER:
				return <AboveHeader />;
			case NAV_STYLE_BELOW_HEADER:
				return <BelowHeader />;
			case NAV_STYLE_FIXED:
				return <Topbar />;
			case NAV_STYLE_DRAWER:
				return <Topbar />;
			case NAV_STYLE_MINI_SIDEBAR:
				return <Topbar />;
			case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
				return <NoHeaderNotification />;
			case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
				// return <Topbar />;
				return <NoHeaderNotification />;
			default:
				return null;
		}
	};

	getSidebar = (navStyle, width) => {
		if (width < TAB_SIZE) {
			return <Sidebar />;
		}
		switch (navStyle) {
			case NAV_STYLE_FIXED:
			case NAV_STYLE_DRAWER:
			case NAV_STYLE_MINI_SIDEBAR:
			case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
			case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
				return <Sidebar />;
			// 				return <Sidebar />;
			// 			return <Sidebar />;
			// 		return <Sidebar />;
			// return <Sidebar />;
			default:
				return null;
		}
	};

	_onAction(e) {
	}

	_onActive(e) {

	}

	_onIdle(e) {
		// console.log("USER IDLE");
		localStorage.removeItem('email');
		localStorage.removeItem('id');
		localStorage.removeItem('type');
		localStorage.removeItem('name');
		localStorage.removeItem('firstName');
		localStorage.removeItem('lastName');
		localStorage.removeItem('token');
		localStorage.removeItem('dealer_pin');
		setTimeout(() => {
			this.props.history.push('/session_timeout')
		}, 1000);
	}


	render() {
		const { match, width, navStyle } = this.props;
		return (
			<div style={{ marginBottom: 40 }}>
				<IdleTimer
					ref={ref => { this.idleTimer = ref }}
					element={document}
					onActive={this.onActive}
					onIdle={this.onIdle}
					onAction={this.onAction}
					debounce={250}
					timeout={3600000} />
				<App match={match} />
			</div>
		)
	}
}

const mapStateToProps = ({ settings, socket, sidebar }) => {

	const { width, navStyle } = settings;
	const { microServiceRunning } = sidebar;
	const { supportSystemSocket } = socket;

	return { width, navStyle, socket: socket.socket, supportSystemSocket: supportSystemSocket, microServiceRunning }
};

export default connect(mapStateToProps, { connectSocket, connectSupportSystemSocket, hello_web, getNotification, closeSupportSystemSocket, closeConnectPageSocketEvents, closeWebSocket, checkMicrServiceStatus })(MainApp);

