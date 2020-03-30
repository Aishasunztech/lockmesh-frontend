import {
  FINISHED_PUSH_APPS,
  FINISHED_PULL_APPS,
  IN_PROCESS,
  FINISHED_POLICY,
  FINISHED_POLICY_STEP,
  FINISHED_IMEI,
  SINGLE_APP_PUSHED,
  GET_APP_JOBS,
  SINGLE_APP_PULLED,
  RECEIVE_SIM_DATA,
  FINISHED_WIPE,
  DEVICE_SYNCED, GENERATE_SUPPORT_TICKET, UPDATE_SUPPORT_TICKET_REPLY, SYSTEM_SUPPORT_MESSAGE_RECEIVED,
  SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED, SUPPORT_LIVE_CHAT_USER_TYPING, SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING,
} from "../../constants/ActionTypes";

import {
  SEND_ONLINE_OFFLINE_STATUS,
  ACK_FINISHED_PUSH_APPS,
  ACK_FINISHED_PULL_APPS,
  ACTION_IN_PROCESS,
  FINISH_POLICY,
  FINISH_IMEI,
  ACK_SINGLE_PUSH_APP,
  ACK_SINGLE_PULL_APP,
  FINISH_POLICY_STEP,
  RECV_SIM_DATA,
  CONNECT_SOCKET,
  DISCONNECT_SOCKET,
  ACK_SETTING_APPLIED,
  ACK_INSTALLED_APPS,
  ACK_UNINSTALLED_APPS,
  FINISH_WIPE,
  SEND_JOB_TO_PANEL,
  FINISHED_BULK_PUSH_APPS, CONNECT_SUPPORT_SYSTEM_SOCKET, DISCONNECT_SUPPORT_SYSTEM_SOCKET
} from "../../constants/SocketConstants";

import RestService from '../services/RestServices'

// socket should connect on login
export const connectSocket = () => {
    return (dispatch) => {
        let socket = RestService.connectSocket();
        dispatch({
            type: CONNECT_SOCKET,
            payload: socket,
        })
        // CONNECT_SOCKET
    }
}

// socket should connect on login
export const connectSupportSystemSocket = () => {
  return (dispatch) => {
    let SupportSystemSocket = RestService.connectSupportSystemSocket();

    dispatch({
      type: CONNECT_SUPPORT_SYSTEM_SOCKET,
      supportSystemSocket: SupportSystemSocket
    })
    // CONNECT_SUPPORT_SYSTEM_SOCKET
  }
}

//==========> Connect Device events

export const sendOnlineOfflineStatus = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + SEND_ONLINE_OFFLINE_STATUS + deviceId] == undefined) {
            socket.on(SEND_ONLINE_OFFLINE_STATUS + deviceId, (response) => {
                dispatch({
                    type: SEND_ONLINE_OFFLINE_STATUS,
                    payload: response.status
                })
            })
        }
    }
}

export const deviceSynced = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + "device_synced_" + deviceId] == undefined) {
            socket.on("device_synced_" + deviceId, (response) => {
                dispatch({
                    type: DEVICE_SYNCED,
                    payload: response.status
                })
            })
        }
    }
}

export const ackSettingApplied = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + ACK_SETTING_APPLIED + deviceId] == undefined) {

            socket.on(ACK_SETTING_APPLIED + deviceId, (response) => {
                dispatch({
                    type: ACK_SETTING_APPLIED,
                    payload: response
                })
            })
        }
    }
}

// after install app anywhere from device acknowledgement
export const ackInstalledApps = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + ACK_INSTALLED_APPS + deviceId] == undefined) {
            socket.on(ACK_INSTALLED_APPS + deviceId, (response) => {
                dispatch({
                    type: ACK_INSTALLED_APPS,
                    payload: response
                })
            })
        } else {

        }
    }
}

// after uninstall app anywhere from device acknowledgement
export const ackUninstalledApps = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + ACK_UNINSTALLED_APPS + deviceId] == undefined) {
            socket.on(ACK_UNINSTALLED_APPS + deviceId, (response) => {
                dispatch({
                    type: ACK_UNINSTALLED_APPS,
                    payload: response
                })
            })
        } else {

        }
    }
}

// Push apps processes
export const ackSinglePushApp = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + ACK_SINGLE_PUSH_APP + deviceId] == undefined) {
            socket.on(ACK_SINGLE_PUSH_APP + deviceId, (response) => {
                // console.log("SOCKET WEB SINGLE");
                dispatch({
                    type: SINGLE_APP_PUSHED,
                    payload: response
                })
            })
        } else {

        }
    }
}

export const ackFinishedPushApps = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + ACK_FINISHED_PUSH_APPS + deviceId] == undefined) {
            socket.on(ACK_FINISHED_PUSH_APPS + deviceId, (response) => {
                // console.log("jkshdksa");
                dispatch({
                    type: FINISHED_PUSH_APPS,
                    payload: true
                })
            })
        } else {

        }
    }
}

// pull apps processes
export const ackSinglePullApp = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + ACK_SINGLE_PULL_APP + deviceId] == undefined) {
            socket.on(ACK_SINGLE_PULL_APP + deviceId, (response) => {
                // console.log("SOCKET WEB SINGLE");
                dispatch({
                    type: SINGLE_APP_PULLED,
                    payload: response
                })
            })
        } else {

        }

    }
}

export const ackFinishedPullApps = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + ACK_FINISHED_PULL_APPS + deviceId] == undefined) {
            socket.on(ACK_FINISHED_PULL_APPS + deviceId, (response) => {
                dispatch({
                    type: FINISHED_PULL_APPS,
                    payload: true
                })
            })

        } else {

        }
    }
}

// Policy processes
export const ackFinishedPolicyStep = (socket, deviceId) => {
    // console.log("ssad");
    return (dispatch) => {
        if (socket && socket._callbacks['$' + FINISH_POLICY_STEP + deviceId] == undefined) {
            socket.on(FINISH_POLICY_STEP + deviceId, (response) => {
                dispatch({
                    type: FINISHED_POLICY_STEP,
                    payload: true
                })
            })
        } else {

        }
    }
}

export const ackFinishedPolicy = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + FINISH_POLICY + deviceId] == undefined) {
            socket.on(FINISH_POLICY + deviceId, (response) => {
                dispatch({
                    type: FINISHED_POLICY,
                    payload: true
                })
            })
        } else {

        }
    }
}

export const actionInProcess = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + ACTION_IN_PROCESS + deviceId] == undefined) {
            socket.on(ACTION_IN_PROCESS + deviceId, (response) => {
                dispatch({
                    type: IN_PROCESS,
                    payload: true
                })
            })
        } else {

        }
    }
}

export const ackFinishedWipe = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + FINISH_WIPE + deviceId] == undefined) {
            socket.on(FINISH_WIPE + deviceId, (response) => {
                dispatch({
                    type: FINISHED_WIPE,
                    payload: true
                })
            })
        } else {

        }
    }
}

export const ackImeiChanged = (socket, deviceId) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + FINISH_IMEI + deviceId] == undefined) {
            socket.on(FINISH_IMEI + deviceId, (response) => {
                dispatch({
                    type: FINISHED_IMEI,
                    payload: true
                })
            })
        } else {

        }
    }
}

// sim button
export const receiveSim = (socket, deviceId) => {
    // console.log("1: RECEIVE_SIM_DATA fro mobile at client side");
    return (dispatch) => {
        if (socket && socket._callbacks['$' + RECV_SIM_DATA + deviceId] == undefined) {
            socket.on(RECV_SIM_DATA + deviceId, (response) => {
                console.log("2: RECEIVE_SIM_DATA fro mobile at client side", response);
                dispatch({
                    type: RECEIVE_SIM_DATA,
                    payload: response,
                })
            })
        } else {

        }
    }
}

export function getAppJobQueue(deviceId) {
    return (dispatch) => {
        RestService.getAppJobQueue(deviceId).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data) {
                    dispatch({
                        type: GET_APP_JOBS,
                        payload: response.data.data,
                        data_type: response.data.type
                    })
                }

            }
        });

    };
}

export const closeWebSocket = (socket) => {
  return (dispatch) => {
    if(socket) {
      socket.off();
      socket.disconnect();
    }

    dispatch({
      type: DISCONNECT_SOCKET,
      payload: null
    });
  }
};

export const closeConnectPageSocketEvents = (socket, deviceId) => {
    return (dispatch) => {
        if (socket) {
            // push apps
            socket.off(ACK_FINISHED_PUSH_APPS + deviceId);
            socket.off(ACK_SINGLE_PUSH_APP + deviceId)

            // pull apps
            socket.off(ACK_FINISHED_PULL_APPS + deviceId);
            socket.off(ACK_SINGLE_PULL_APP + deviceId);

            // policy
            socket.off(FINISH_POLICY + deviceId)
            socket.off(FINISH_POLICY_STEP + deviceId)
            socket.off(ACTION_IN_PROCESS + deviceId)

            // imei
            socket.off(FINISH_IMEI + deviceId);

            // sim data
            socket.off(RECV_SIM_DATA + deviceId);

            // test
            socket.off('hello_web');

            socket.disconnect();
        } else {

        }
        dispatch({
            type: DISCONNECT_SOCKET,
            payload: null
        });

    }
}

// ===> panel events
export const getNotification = (socket) => {
    return (dispatch) => {
        if (socket && socket._callbacks['$' + SEND_JOB_TO_PANEL] == undefined) {
            socket.on(SEND_JOB_TO_PANEL, (data) => {
                dispatch({
                    type: SEND_JOB_TO_PANEL,
                    payload: data
                })
            })
        } else {

        }
    }
}
export const hello_web = (socket) => {

    return (dispatch) => {
        if (socket && socket._callbacks['$' + 'hello_web'] == undefined) {
            // socket.emit('join', 'testRoom');
            socket.on('hello_web', function () {
                console.log("hello world");
            })

        } else {

        }
    }
}

export const closeSupportSystemSocket = (socket) => {
  return (dispatch) => {
    if (socket) {

      socket.off(GENERATE_SUPPORT_TICKET);
      socket.off(UPDATE_SUPPORT_TICKET_REPLY);
      socket.off(SYSTEM_SUPPORT_MESSAGE_RECEIVED);
      socket.off(SUPPORT_LIVE_CHAT_MESSAGE_RECEIVED);
      socket.off(SUPPORT_LIVE_CHAT_USER_TYPING);
      socket.off(SUPPORT_LIVE_CHAT_USER_STOPPED_TYPING);

      socket.disconnect();
    } else {

    }
    dispatch({
      type: DISCONNECT_SUPPORT_SYSTEM_SOCKET,
      payload: null
    });

  }
};



//******************** Bulk Activities */

// export const ackFinishedBulkPushApps = (socket, deviceId) => {
//     return (dispatch) => {
//         if (socket && socket._callbacks['$' + ACK_FINISHED_PUSH_APPS + deviceId] == undefined) {
//             socket.on(ACK_FINISHED_PUSH_APPS + deviceId, (response) => {
//                 // console.log("jkshdksa");
//                 dispatch({
//                     type: FINISHED_BULK_PUSH_APPS,
//                     payload: true
//                 })
//             })
//         } else {

//         }
//     }
// }
