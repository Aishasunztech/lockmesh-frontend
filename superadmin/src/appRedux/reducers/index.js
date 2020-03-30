import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import Settings from "./Settings";
import Auth from "./Auth";
import Account from "./Account"
import sidebarMenu from "./SidebarMenu";
import whiteLabels from './WhiteLabels';
import Apk_List from "./Apk";
import Devices from './Devices';
import Tool from "./Tool";
import Reports from "./Reports";


const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  devices: Devices,
  account: Account,
  sidebarMenu: sidebarMenu,
  whiteLabels: whiteLabels,
  apk_list: Apk_List,
  tool: Tool,
  reports: Reports
});

export default reducers;
