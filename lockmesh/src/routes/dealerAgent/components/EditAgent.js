import React, { Component } from 'react';
import { Modal, message } from 'antd';
import EditAgentForm from './EditAgentForm';
import { convertToLang } from '../../utils/commonUtils';
import {
    Button_Ok,
    Button_Cancel,
    Button_Add_User
} from '../../../constants/ButtonConstants';

const EditAgent = (props) => {
  
    return (
        <Modal
            visible={props.editAgentModal}
            title={"Edit Agent"}
            maskClosable={false}
            destroyOnClose={true}
            onCancel={() => props.showEditModal(false)}
            footer={null}
            className="edit_form"
            okText={convertToLang(props.translation[Button_Ok], "Ok")}
            cancelText={convertToLang(props.translation[Button_Cancel], "Cancel")}
        >
            <EditAgentForm
                updateAgent={props.updateAgent}
                showEditModal={props.showEditModal}
                agent={props.agent}
                translation={props.translation}
            />
        </Modal>
    )
}

export default EditAgent;