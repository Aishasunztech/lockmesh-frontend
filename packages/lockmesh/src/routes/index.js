// Libraries
import React from "react";
import { Route, Switch } from "react-router-dom";

// components
import Dashboard from './dashboard'

import Devices from "./devices/index";
import ConnectDevice from "./ConnectDevice/index";

import Users from './users';
import StandAloneSims from './StandAloneSims';
import Account from "./account/index";

import Dealers from "./dealers/index";
import ConnectDealer from './ConnectDealer/index';

import PaymentHistory from "./account/components/PaymentHistory";
import PaymentOverdueHistory from "./account/components/PaymentOverdueHistory";

import AutoUpdate from "./autoUpdate/index";


import Policy from './policy/index';
import Apk from "./apk/index";
import ApkMain from "./apk/components/index";
import myProfile from './myProfile';
import InvalidPage from "./InvalidPage";
// import FourOFour from "./404/";
import FourOFour from "./InvalidPage/FourOFour";
import AppMarket from "./appMarket/index";
import ManageData from './account/ManageData/index'
import AccountBalanceInfo from './account/AccountBalanceInfo/index'
import SetPrice from './account/PricesPakages/index'
import Domains from "./domains/index";
import Reporting from './account/Reporting/index'
import Support from './Support/index'
import DeviceMessages from './DeviceMessages/index'
import DealerAgent from './dealerAgent/index'
import BulkActivities from './bulkActivities/index'
// import ConnectSim from './ConnectSim/index';

// import Documents from "./documents/index";

const App = ({ match }) => {
  // console.log("match url: " + match.url);

  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route
          exact
          path={`${match.url}dashboard`}
          component={Dashboard}
        />

        <Route
          exact
          path={`${match.url}devices`}
          component={Devices}
        />

        <Route
          exact
          path={`${match.url}sims`}
          component={StandAloneSims}
        />

        {/* <Route
          exact
          path={`${match.url}connect-sim/:sim_id`}
          component={ConnectSim}
        /> */}

        <Route
          exact
          path={`${match.url}connect-device/:device_id`}
          component={ConnectDevice}
        />

        <Route
          exact
          path={`${match.url}users`}
          component={Users}
        />

        <Route
          exact
          path={`${match.url}account/payment-overdue-history`}
          component={PaymentOverdueHistory}
        />

        <Route
          exact
          path={`${match.url}dealer/:dealer_type`}
          component={Dealers}
        />

        <Route
          exact
          path={`${match.url}connect-dealer/:dealer_id`}
          component={ConnectDealer}
        />
        <Route
          exact
          path={`${match.url}account`}
          component={Account}
        />

        <Route
          exact
          path={`${match.url}account/credits-payment-history`}
          component={PaymentHistory}
        />

        <Route
          exact
          path={`${match.url}support`}
          component={Support}
        />

        <Route
          exact
          path={`${match.url}policy`}
          component={Policy}
        />

        <Route
          exact
          path={`${match.url}settings`}
          component={myProfile}
        />

        <Route
          exact
          path={`${match.url}apk-list`}
          component={Apk}
        />

        <Route
          exact
          path={`${match.url}apk-list/autoupdate`}
          component={AutoUpdate}
        />

        <Route
          exact
          path={`${match.url}app`}
          component={ApkMain}
        />

        <Route
          exact
          path={`${match.url}invalid_page`}
          component={InvalidPage}
        />

        <Route
          exact
          path={`${match.url}app-market`}
          component={AppMarket}
        />

        <Route
          exact
          path={`${match.url}account/managedata`}
          component={ManageData}
        />

        <Route
          exact
          path={`${match.url}account/balance_info`}
          component={AccountBalanceInfo}
        />

        <Route
          exact
          path={`${match.url}set-prices`}
          component={SetPrice}
        />

        <Route
          exact
          path={`${match.url}reporting`}
          component={Reporting}
        />

        <Route
          exact
          path={`${match.url}device-messages`}
          component={DeviceMessages}
        />

        <Route
          exact
          path={`${match.url}domains`}
          component={Domains}
        />

        <Route
          exact
          path={`${match.url}dealer-agents`}
          component={DealerAgent}
        />

        <Route
          exact
          path="/bulk-activities"
          component={BulkActivities}
        />

        <Route
          exact
          path="*"
          component={FourOFour}
        />
      </Switch>
    </div>
  )
}


export default App;
