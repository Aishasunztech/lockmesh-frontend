import React, { Fragment } from 'react'
import {
    FINISHED_PUSH_APPS, FINISHED_PULL_APPS, IN_PROCESS, FINISHED_POLICY, FINISHED_IMEI, SINGLE_APP_PUSHED, GET_APP_JOBS, SINGLE_APP_PULLED, FINISHED_POLICY_STEP, FINISHED_WIPE
} from "../../constants/ActionTypes";

import { message, Modal } from 'antd';
import {
  CONNECT_SOCKET,
  DISCONNECT_SOCKET,
  ACK_SETTING_APPLIED,
  ACK_INSTALLED_APPS,
  ACK_UNINSTALLED_APPS,
  FINISHED_BULK_PUSH_APPS,
  CONNECT_SUPPORT_SYSTEM_SOCKET,
  DISCONNECT_SUPPORT_SYSTEM_SOCKET
} from '../../constants/SocketConstants';

// import io from 'socket.io-client';

const success = Modal.success
const error = Modal.error

const initialState = {
    is_in_process: false,
    noOfApp_pushed_pulled: 0,
    noOfApp_push_pull: 0,
    is_push_apps: 0,
    complete_policy_step: 0,
    is_policy_process: 0,
    is_policy_finish: false,
    socket: null,
    supportSystemSocket: null,
};

export default (state = initialState, action) => {

    switch (action.type) {
        case CONNECT_SOCKET: {
            console.log("socket connected");
            return {
                ...state,
                socket: action.payload,
            }
        }

      case CONNECT_SUPPORT_SYSTEM_SOCKET: {
        console.log("socket connected support system");
        return {
          ...state,
          supportSystemSocket: action.supportSystemSocket,
        }
      }

        case DISCONNECT_SOCKET: {
            console.log('socket disconnected');

            return {
                ...state,
                socket: action.payload,
            }
        }


      case DISCONNECT_SUPPORT_SYSTEM_SOCKET: {
        console.log('support system socket disconnected');

        return {
          ...state,
          supportSystemSocket: action.payload,
        }
      }

        case GET_APP_JOBS: {
            console.log("GET_APP_JOBS ", action.payload)
            if (action.payload.id) {
                if (action.data_type === 'policy') {
                    return {
                        ...state,
                        is_policy_process: action.payload.is_in_process,
                        complete_policy_step: action.payload.complete_steps,
                    }
                } else {
                    return {
                        ...state,
                        is_push_apps: action.payload.is_in_process,
                        noOfApp_push_pull: action.payload.total_apps,
                        noOfApp_pushed_pulled: action.payload.complete_apps,
                    }
                }
            } else {
                return {
                    ...state,
                    is_policy_process: 0,
                    is_push_apps: 0,
                    is_in_process: false,
                }
            }
        }

        case ACK_INSTALLED_APPS: {
            return {
                ...state
            }
        }

        case SINGLE_APP_PUSHED: {
            // console.log(action.payload.completePushApps);
            return {
                ...state,
                noOfApp_pushed_pulled: state.noOfApp_pushed_pulled + 1
            }
        }

        case FINISHED_PUSH_APPS: {
            // console.log("works");
            success({
                title: "Apps Pushed Successfully.",
            });
            return {
                ...state,
                is_in_process: false,
                noOfApp_pushed_pulled: state.noOfApp_push_pull,
                is_policy_process: 0
            }
        }

        case FINISHED_BULK_PUSH_APPS: {
            // console.log("works");
            success({
                title: "Apps Pushed Successfully.",
            });
            return {
                ...state,
                is_in_process: false,
                noOfApp_pushed_pulled: state.noOfApp_push_pull,
                is_policy_process: 0
            }
        }

        case ACK_UNINSTALLED_APPS: {
            return {
                ...state
            }
        }
        case SINGLE_APP_PULLED: {
            // console.log(action.payload.completePushApps);
            return {
                ...state,
                noOfApp_pushed_pulled: state.noOfApp_pushed_pulled + 1
            }
        }
        case FINISHED_PULL_APPS: {
            // console.log("works");
            success({
                title: "Apps Pulled Successfully.",
            });
            return {
                ...state,
                is_in_process: false,
                noOfApp_pushed_pulled: state.noOfApp_push_pull,
                is_policy_process: 0
            }
        }

        case FINISHED_POLICY_STEP: {
            return {
                ...state,
                complete_policy_step: state.complete_policy_step + 1
            }
        }
        case FINISHED_WIPE: {
            success({
                title: "Device Wiped Successfully.",
            });
            return {
                ...state
            }
        }

        case FINISHED_POLICY: {
            // console.log("works");
            success({
                title: "Policy Applied Successfully.",
            });
            return {
                ...state,
                is_in_process: false,
                is_policy_process: 0,
                is_policy_finish: true,
                complete_policy_step: 0
            }
        }

        case IN_PROCESS: {
            // console.log("works");
            return {
                ...state,
                is_in_process: true,
                is_policy_finish: false
            }
        }
        case FINISHED_IMEI: {
            success({
                title: "Imei Changed Successfully.",
            });
            return {
                ...state,
                is_in_process: false,
                is_policy_process: 0
            }
        }

        default:
            return state;
    }
}
