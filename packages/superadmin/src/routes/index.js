import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import Account from "./account/index";
import ManageData from "./account/ManageData";
import Tools from "./tools/index";
import WhiteLabels from "./whitelabels/index";
import Device from "./devices/index";
import AutoUpdate from './autoUpdate/index';
import SetPrices from './whitelabels/components/pricesPackages/index';
import ManageDomains from './whitelabels/components/ManageDomains/index';
import Billing from "./account/billing/index.js";
import Reports from "./account/Reports/index.js";

import FourOFour from "./404/";

const AppRoutes = ({ match, whiteLabels }) => {

  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route
          exact
          path={`${match.url}devices`}
          component={Device}
        />
        <Route
          exact
          path={`${match.url}labels`}
        // component={Labels}
        />
        {
          whiteLabels.map((whiteLabel, index) => {
            return (

              <Route
                exact
                path={`${whiteLabel.route_uri}`}
                key={index}
                // id={whiteLabel.id} 
                render={
                  (routeProps) => (
                    <WhiteLabels
                      {...routeProps}
                      id={whiteLabel.id}
                    />
                  )
                }
              />

            );
          })
        }

        {
          whiteLabels.map((whiteLabel, index) => {
            return (
              <Route
                exact
                path={'/set-prices' + whiteLabel.route_uri}
                id={whiteLabel.id}
                key={index}
                render={
                  (routeProps) => (
                    <SetPrices
                      {...routeProps}
                      id={whiteLabel.id}
                      whiteLabelName={whiteLabel.name}
                    />
                  )
                }
              />
            );
          })
        }
        {
          whiteLabels.map((whiteLabel, index) => {
            return (
              <Route
                exact
                path={'/manage-domains' + whiteLabel.route_uri}
                id={whiteLabel.id}
                key={index}
                render={
                  (routeProps) => (
                    <ManageDomains
                      {...routeProps}
                      id={whiteLabel.id}
                      whiteLabelName={whiteLabel.name}
                    />
                  )
                }
              />
            );
          })
        }
        <Route
          exact
          path={`${match.url}account`}
          component={Account}
        // component={ManageData}
        />
        <Route
          exact
          path={`${match.url}tools`}
          component={Tools}
        />
        <Route
          exact
          path={`${match.url}account/managedata`}
          component={ManageData}
        />
        <Route
          exact
          path={`${match.url}account/billing`}
          component={Billing}
        />
        <Route
          exact
          path={`${match.url}account/reports`}
          component={Reports}
        />
        <Route
          exact
          path={`${match.url}devices`}
          component={Device}
        />
        <Route
          exact
          path={`${match.url}apk-list/autoupdate`}
          component={AutoUpdate}
        />

        <Route
          path="*"
          component={FourOFour}
        />
      </Switch>
    </div>
  )
}

export default AppRoutes;
