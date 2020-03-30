import React, { Component } from "react";
import { Layout, Menu, message, Select } from 'antd';
import { connect } from "react-redux";
import CustomScrollbars from "util/CustomScrollbars";

// import languageData from "../languageData";
import UserInfo from "components/UserInfo";
// import AppNotification from "components/AppNotification";
import { Link } from "react-router-dom";
import HorizontalNav from "../HorizontalNav";
import { switchLanguage, toggleCollapsedSideNav } from "../../../appRedux/actions/Setting";
// import IntlMessages from "../../../util/IntlMessages";

const { Header } = Layout;

const Option = Select.Option;
const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">Products</Menu.Item>
    <Menu.Item key="2">Apps</Menu.Item>
    <Menu.Item key="3">Blogs</Menu.Item>
  </Menu>
);

function handleMenuClick(e) {
  message.info('Click on menu item.');
}

function handleChange(value) {
  // console.log(`selected ${value}`);
}

class HorizontalDark extends Component {

  state = {
    searchText: '',
  };

  languageMenu = () => (
    <CustomScrollbars className="gx-popover-lang-scroll">
      <ul className="gx-sub-popover">
        {/* {languageData.map(language =>
          <li className="gx-media gx-pointer" key={JSON.stringify(language)} onClick={(e) =>
            this.props.switchLanguage(language)
          }>
            <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`} />
            <span className="gx-language-text">{language.name}</span>
          </li>
        )} */}
      </ul>
    </CustomScrollbars>);

  updateSearchChatUser = (evt) => {
    this.setState({
      searchText: evt.target.value,
    });
  };


  render() {
    const { locale, navCollapsed } = this.props;

    return (
      <div className="gx-header-horizontal gx-header-horizontal-dark">

        <Header
          className="gx-header-horizontal-main">
          <div className="gx-container">
            <div className="gx-header-horizontal-main-flex">
              <div className="gx-d-block gx-d-lg-none gx-linebar gx-mr-xs-3">
                <i className="gx-icon-btn icon icon-menu"
                  onClick={() => {
                    this.props.toggleCollapsedSideNav(!navCollapsed);
                  }}
                />

              </div>
              <Link to="/" className="gx-d-block gx-d-lg-none gx-pointer gx-mr-xs-3 gx-pt-xs-1 gx-w-logo">
                {null}</Link>
              <Link to="/" className="gx-d-none gx-d-lg-block gx-pointer gx-mr-xs-5 gx-logo">
                {null}</Link>
              <div className="gx-header-search gx-d-none gx-d-lg-flex">

              </div>

              <ul className="gx-header-notifications gx-ml-auto">

                <li className="gx-user-nav"><UserInfo /></li>
              </ul>
            </div>
          </div>
        </Header>
        <div className="gx-header-horizontal-nav gx-d-none gx-d-lg-block">
          <div className="gx-container">
            <div className="gx-header-horizontal-nav-flex">
              <HorizontalNav />

            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { locale, navCollapsed } = settings;
  return { locale, navCollapsed }
};
export default connect(mapStateToProps, { toggleCollapsedSideNav, switchLanguage })(HorizontalDark);
