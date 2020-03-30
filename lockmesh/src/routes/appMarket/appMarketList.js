import React, { Component, Fragment } from 'react'
import { Input, Modal, Select, Table } from "antd";

const AppMarketList = (props) => {
    const rowSelection = {
        onChange: props.onSelectChange,
        selectionColumnIndex: 1,
        selectedRowKeys: props.selectedRowKeys,
        selectedRows: props.selectedRows
    };
    return (
        <Table
            // id='scrolltablelist'
            className={"devices "}
            rowSelection={rowSelection}
            size="middle"
            bordered
            // onChange={props.onChangeTableSorting}
            dataSource={props.dataSource}
            columns={props.columns}
            hideDefaultSelections={props.hideDefaultSelections}
            pagination={false}
        />
    )

}

export default AppMarketList;