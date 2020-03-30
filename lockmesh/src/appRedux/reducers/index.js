import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import Settings from "./Settings";
import Auth from "./Auth";
import Devices from "./Devices"
import BulkDevices from "./BulkDevices"
import Dealers from "./Dealer";
import Apk_List from "./Apk";
import ConnectDealer from './ConnectDealer';
import ConnectDevice from "./ConnectDevice";
import Account from "./Account";
import Policy from "./Policy";
import Users from "./Users";
import StandAloneSims from "./StandAloneSims";
import AppMarket from "./AppMarket";
import socket from "./Socket";
import SideBar from "./SideBar"
import Agents from './Agent';
import Dashboard from './Dashboard';
import Reporting from './Reports';
import SupportTickets from './SupportTickets';
import SupportSystemMessages from './SupportSystemMessages';
import SupportLiveChat from './SupportLiveChat';
import RightSidebar from './RightSidebar';

const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  devices: Devices,
  bulkDevices: BulkDevices,
  dealers: Dealers,
  apk_list: Apk_List,
  device_details: ConnectDevice,
  dealer_details: ConnectDealer,
  account: Account,
  policies: Policy,
  users: Users,
  standAloneSims: StandAloneSims,
  appMarket: AppMarket,
  agents: Agents,
  socket: socket,
  sidebar: SideBar,
  dashboard: Dashboard,
  rightSidebar: RightSidebar,
  reporting: Reporting,
  SupportTickets: SupportTickets,
  SupportSystemMessages: SupportSystemMessages,
  SupportLiveChat: SupportLiveChat,
});

export default reducers;
