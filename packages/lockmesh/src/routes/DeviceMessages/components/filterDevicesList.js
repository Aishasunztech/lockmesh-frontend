import React, { Component, Fragment } from 'react'
import { Table, Card } from "antd";
import CustomScrollbars from '../../../util/CustomScrollbars';

const FilterDevicesList = (props) => {
    const rowSelection = {
        onChange: props.onSelectChange,
        selectionColumnIndex: 1,
        selectedRowKeys: props.selectedRowKeys,
        selectedRows: props.selectedRows
    };
    return (
        <Card className='fix_card fix_card_bulk_act'>
            <hr className="fix_header_border" style={{ top: "56px" }} />
            <CustomScrollbars className="gx-popover-scroll ">
                <Table
                    id='scrolltablelist'
                    className={"devices "}
                    rowSelection={rowSelection}
                    size="middle"
                    bordered
                    onChange={props.onChangeTableSorting}
                    dataSource={props.devices}
                    columns={props.columns}
                    hideDefaultSelections={props.hideDefaultSelections}
                    pagination={false}
                // scroll={{ x: true }}
                />
            </CustomScrollbars>
        </Card>
    )

}

export default FilterDevicesList;