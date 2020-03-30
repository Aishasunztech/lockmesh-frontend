import {
  PRODUCT_REPORT,
  HARDWARE_REPORT,
  INVOICE_REPORT,
  PAYMENT_HISTORY_REPORT,
  LOADING,
  SALES_REPORT,
  GRACE_DAYS_REPORT
} from "../../constants/ActionTypes";
import {Modal} from "antd";
import { message } from 'antd';
const success     = Modal.success;
const error       = Modal.error;
const initialState = {
  productData: { CHAT: [], PGP: [], SIM: [], VPN: [] },
  hardwareData: [],
  invoiceData: [],
  paymentHistoryData: [],
  graceDaysData: [],
  salesData: [],
  sales_sa_data: [],
  productType: ""
};

export default (state = initialState, action) => {

  switch (action.type) {

    case LOADING:

      return {
        ...state,
        dealers: [],
      };

    case PRODUCT_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        productData: action.payload.data,
        productType: action.productType
      };

    case INVOICE_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        invoiceData: action.payload.data
      };

    case PAYMENT_HISTORY_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        paymentHistoryData: action.payload.data
      };

    case HARDWARE_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        hardwareData: action.payload.data
      };

    case SALES_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        salesData: action.payload.data,
        sales_sa_data: action.payload.sa_data
      };

    case GRACE_DAYS_REPORT:
      if (action.payload.data.length < 1) {
        error({
          title: 'There is nothing to report for those selections.',
        });
      }
      return {
        ...state,
        graceDaysData: action.payload.data
      };

    default:
      return state;

  }
}
