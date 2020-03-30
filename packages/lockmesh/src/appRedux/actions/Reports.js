import {
  PRODUCT_REPORT,
  HARDWARE_REPORT,
  INVOICE_REPORT,
  PAYMENT_HISTORY_REPORT,
  INVALID_TOKEN,
  SALES_REPORT,
  GRACE_DAYS_REPORT,
  SPIN_lOADING
} from "../../constants/ActionTypes";

import RestService from '../services/RestServices';


export function generateProductReport(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.generateProductReport(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: PRODUCT_REPORT,
          payload: response.data,
          productType: data.product
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });

  };
}



export function generateInvoiceReport(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.generateInvoiceReport(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: INVOICE_REPORT,
          payload: response.data,
          productType: data.product
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });

  };
}

export function generatePaymentHistoryReport(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.generatePaymentHistoryReport(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: PAYMENT_HISTORY_REPORT,
          payload: response.data,
          productType: data.product
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });

  };
}

export function generateHardwareReport(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.generateHardwareReport(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: HARDWARE_REPORT,
          payload: response.data
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });

  };
}

export function generateSalesReport(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.generateSalesReport(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: SALES_REPORT,
          payload: response.data
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });

  };
}

export function generateGraceDaysReport(data) {
  return (dispatch) => {
    dispatch({
      type: SPIN_lOADING,
    });

    RestService.generateGraceDaysReport(data).then((response) => {
      if (RestService.checkAuth(response.data)) {
        dispatch({
          type: GRACE_DAYS_REPORT,
          payload: response.data
        });
      } else {
        dispatch({
          type: INVALID_TOKEN
        });
      }
    });

  };
}
