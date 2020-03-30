import React, { Component, Fragment } from 'react'
import { Input, Modal, Select, Table, Card } from "antd";
import CustomScrollbars from "util/CustomScrollbars";



const DealerList = (props) => {
    // let selectedDealers = props.selectedDealers;
    // console.log(props.selectedRows);
    const rowSelection = {
        // selectedDealers,
        onChange: props.onSelectChange,
        selectionColumnIndex: 1,
        selectedRowKeys: props.selectedRowKeys,
        selectedRows: props.selectedRows
    };
    return (
        <Fragment>
            <Card className='fix_card fix_card_perm'>
                <hr className="fix_header_border" style={{ top: "58px" }} />
                <CustomScrollbars className="gx-popover-scroll">
                    <Table
                        bordered
                        rowSelection={rowSelection}
                        dataSource={props.dealers}
                        columns={props.columns}
                        onChange={props.onChangeTableSorting}
                        hideDefaultSelections={props.hideDefaultSelections}
                        pagination={false}
                    />
                </CustomScrollbars>
            </Card>
        </Fragment>
    )

}

export default DealerList;