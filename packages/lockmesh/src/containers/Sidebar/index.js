import React, { Component } from "react";
import { connect } from "react-redux";
import { Drawer, Layout } from "antd";
import styles from './sidebar.css';
import SidebarContent from "./SidebarContent";
import { toggleCollapsedSideNav, updateWindowWidth } from "appRedux/actions/Setting";
import { generateSupportTicketEvent, systemMessageSocket, getAdmin, checkMicrServiceStatus, supportLiveChatSocket } from "../../appRedux/actions";
import {
	NAV_STYLE_DRAWER,
	NAV_STYLE_FIXED,
	NAV_STYLE_MINI_SIDEBAR,
	NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
	NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
	TAB_SIZE,
	THEME_TYPE_LITE
} from "../../constants/ThemeSetting";

const { Sider } = Layout;

export class Sidebar extends Component {

  constructor(props){
    super(props);
    this.state = {
      microServiceRunning: props.microServiceRunning,
      isMicroServiceChecked: false
    };
  }

	onToggleCollapsedNav = () => {
		this.props.toggleCollapsedSideNav(!this.props.navCollapsed);
	};

	componentDidMount() {
		window.addEventListener('resize', () => {
			this.props.updateWindowWidth(window.innerWidth)
		});
    if(this.props.checkMicrServiceStatus){
      this.props.checkMicrServiceStatus();
      this.setState({isMicroServiceChecked: true});
    }
  }

  componentDidUpdate(prevProps){
	  if(prevProps !== this.props){
      if(!this.state.isMicroServiceChecked && !this.state.microServiceRunning && this.props.checkMicrServiceStatus){
        this.props.checkMicrServiceStatus();
        this.setState({isMicroServiceChecked: true})
      };
    }
  }

	componentWillReceiveProps(nextProps){
    if ( this.state.isMicroServiceChecked && nextProps.microServiceRunning && nextProps.supportSystemSocket ) {
      nextProps.generateSupportTicketEvent(nextProps.supportSystemSocket);
      nextProps.systemMessageSocket(nextProps.supportSystemSocket);
      nextProps.supportLiveChatSocket(nextProps.supportSystemSocket);
    }

    if(nextProps.microServiceRunning){
      this.setState({microServiceRunning: nextProps.microServiceRunning});
    }
    if(Object.keys(nextProps.admin).length === 0){
      nextProps.getAdmin();
    }
  }

	render() {
		const { themeType, navCollapsed, width, navStyle } = this.props;

		let drawerStyle = "gx-collapsed-sidebar";

		if (navStyle === NAV_STYLE_FIXED) {
			drawerStyle = "";
		} else if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
			drawerStyle = "gx-mini-sidebar gx-mini-custom-sidebar";
		} else if (navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
			drawerStyle = "gx-custom-sidebar"
		} else if (navStyle === NAV_STYLE_MINI_SIDEBAR) {
			drawerStyle = "gx-mini-sidebar";
		} else if (navStyle === NAV_STYLE_DRAWER) {
			drawerStyle = "gx-collapsed-sidebar"
		}
		if ((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR
			|| navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) && width < TAB_SIZE) {
			drawerStyle = "gx-collapsed-sidebar"
		}
		return (
			<Sider
				className={`gx-app-sidebar ${drawerStyle} ${themeType !== THEME_TYPE_LITE ? 'gx-layout-sider-dark' : null}`}
				trigger={null}
				collapsed={(width < TAB_SIZE ? false : navStyle === NAV_STYLE_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR)}
				theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
				collapsible>
				{
					navStyle === NAV_STYLE_DRAWER || width < TAB_SIZE ?
						<Drawer
							className={`gx-drawer-sidebar ${themeType !== THEME_TYPE_LITE ? 'gx-drawer-sidebar-dark' : null}`}
							placement="left"
							closable={false}
							onClose={this.onToggleCollapsedNav.bind(this)}
							visible={navCollapsed}
						>
							<SidebarContent authUser={this.props.authUser} />
						</Drawer> :
						<SidebarContent authUser={this.props.authUser} />
				}
			</Sider>
		);
	}
}

const mapStateToProps = ({ settings, auth, socket, sidebar }) => {
	const { themeType, navStyle, navCollapsed, width, locale } = settings;
	const { authUser } = auth;
	const { microServiceRunning, admin } = sidebar;
	const { supportSystemSocket } = socket;
	return { themeType, navStyle, navCollapsed, width, locale, authUser, supportSystemSocket, microServiceRunning, admin }
};
export default connect(mapStateToProps, { toggleCollapsedSideNav, updateWindowWidth, systemMessageSocket, generateSupportTicketEvent, getAdmin, checkMicrServiceStatus, supportLiveChatSocket})(Sidebar);
