import {
    GET_DASHBOARD_DATA
} from "constants/ActionTypes";

import { message, Modal } from 'antd';

const success = Modal.success
const error = Modal.error

const initialState = {
    isloading: false,
    dashboard_items: []

};

export default (state = initialState, action) => {

    switch (action.type) {
       case GET_DASHBOARD_DATA: {
            console.log('reducer dashboard response', action.response)
            return {
                dashboard_items: action.response.data.data
            }
        }
       
        default :
        return state
    }
}