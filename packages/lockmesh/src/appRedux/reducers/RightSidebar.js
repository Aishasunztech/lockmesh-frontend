import {
    INVALID_TOKEN, GET_QUE_JOBS,
} from "../../constants/ActionTypes"
import { SEND_JOB_TO_PANEL } from "../../constants/SocketConstants";
import { removeDuplicateObjects } from "../../routes/utils/commonUtils";

const initialStates = {
    tasks: []
}

export default (state = initialStates, action) => {
    switch (action.type) {
        case GET_QUE_JOBS: {
            // console.log("GET_QUE_JOBS rightside bar reducer: ", action.payload, state.tasks);
            let tasks = removeDuplicateObjects([...state.tasks, ...action.payload], "id");
            return {
                ...state,
                tasks: tasks
            }
        }
        case SEND_JOB_TO_PANEL: {
            // console.log("SEND_JOB_TO_PANEL rightside bar reducer: ", action.payload, state.tasks);
            if (action.payload) {
                console.log("new task: ", action.payload);
                let index = state.tasks.findIndex((task) => task.id === action.payload.id)
                console.log("new index: ", index);
                if (index === -1) {
                    state.tasks.push(action.payload);
                }
            }
            // console.log("state.tasks ", state.tasks);
            return {
                ...state
            }
        }
        default:
            return state;
    }
}