import {
    FINISHED_PUSH_APPS, FINISHED_PULL_APPS, IN_PROCESS, FINISHED_POLICY, FINISHED_IMEI
} from "../../constants/ActionTypes";

import {
    ACK_FINISHED_PUSH_APPS, ACK_FINISHED_PULL_APPS, ACTION_IN_PROCESS, FINISH_POLICY, FINISH_IMEI
} from "../../constants/SocketConstants";

export const getNotification = (socket) => {
    return (dispatch) => {
        socket.on('getNotification', (data) => {
            // dispatch(
            //     action: 
            // )
        })
    }
}

export const ackFinishedPushApps = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(ACK_FINISHED_PUSH_APPS + deviceId, (response) => {
            // console.log("jkshdksa");
            dispatch({
                type: FINISHED_PUSH_APPS,
                payload: true
            })
        })
    }
}
export const ackFinishedPullApps = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(ACK_FINISHED_PULL_APPS + deviceId, (response) => {
            dispatch({
                type: FINISHED_PULL_APPS,
                payload: true
            })
        })
    }
}
export const actionInProcess = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(ACTION_IN_PROCESS + deviceId, (response) => {
            // console.log("in process socket");
            dispatch({
                type: IN_PROCESS,
                payload: true
            })
        })
    }
}
export const ackFinishedPolicy = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(FINISH_POLICY + deviceId, (response) => {
            dispatch({
                type: FINISHED_POLICY,
                payload: true
            })
        })
    }
}
export const ackImeiChanged = (socket, deviceId) => {
    return (dispatch) => {
        socket.on(FINISH_IMEI + deviceId, (response) => {
            dispatch({
                type: FINISHED_IMEI,
                payload: true
            })
        })
    }
}