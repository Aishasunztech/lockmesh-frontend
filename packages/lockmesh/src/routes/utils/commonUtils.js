import React, { Component, Fragment } from 'react'
import moment_timezone from "moment-timezone";
import moment from 'moment';
import jsPDF from 'jspdf';
import XLSX from 'xlsx';
import axios from 'axios';
import jsPDFautotable from 'jspdf-autotable';

import { BASE_URL, TIME_ZONE, SERVER_TIMEZONE, TIMESTAMP_FORMAT } from '../../constants/Application';
import {
	DEVICE_ACTIVATED,
	DEVICE_EXPIRED,
	DEVICE_PENDING_ACTIVATION,
	DEVICE_PRE_ACTIVATION,
	DEVICE_SUSPENDED,
	DEVICE_UNLINKED,
	DEVICE_TRIAL,
	ADMIN
} from '../../constants/Constants'

import {
	DEALER_ID,
	DEALER_NAME,
	DEALER_EMAIL,
	DEALER_PIN,
	DEALER_DEVICES,
	DEALER_TOKENS,
	DEALER_ACTION
} from '../../constants/DealerConstants';

import { DEVICE_DEALER_ID, DEVICE_DEALER_PIN, DEVICE_DEALER_NAME } from '../../constants/DeviceConstants';

import { isArray } from "util";

export function getStatus(status, account_status, unlink_status, device_status, activation_status) {

	if (status === 'active' && (account_status === '' || account_status === null) && unlink_status === 0 && (device_status === 1 || device_status === '1')) {
		return DEVICE_ACTIVATED;
	} else if (status === 'expired') {
		return DEVICE_EXPIRED;
	} else if ((device_status === '0' || device_status === 0) && (unlink_status === '0' || unlink_status === 0) && (activation_status === null || activation_status === '')) {
		return DEVICE_PENDING_ACTIVATION;
	} else if ((device_status === '0' || device_status === 0) && (unlink_status === '0' || unlink_status === 0) && (activation_status === 0)) {
		return DEVICE_PRE_ACTIVATION;
	} else if ((unlink_status === '1' || unlink_status === 1) && (device_status === 0 || device_status === '0')) {
		// console.log("hello unlinked");
		return DEVICE_UNLINKED;
	} else if (account_status === 'suspended') {
		return DEVICE_SUSPENDED;
	} else {
		return 'N/A';
	}
}

export function getColor(status) {
	switch (status) {
		case DEVICE_ACTIVATED:
			return { color: "#008000" };

		case DEVICE_TRIAL:
			return { color: "#008000" };

		case DEVICE_PRE_ACTIVATION:
			return { color: "#0000FF" };

		case DEVICE_EXPIRED:
			return { color: "#FF0000" };
		case DEVICE_UNLINKED:
			return { color: "#FFA500" };
		case DEVICE_SUSPENDED:
			return { color: "#cccc0e" };
		case DEVICE_PENDING_ACTIVATION:
			return { color: "grey" };
		default:
			return {};
	}
}

export function getDateTimeOfClientTimeZone(dateTime, format = 'YYYY-MM-DD H:m:s') {

	// let serverTimeZoneDate = moment(dateTime).tz(TIME_ZONE).format(format)
	let timeZone = moment.tz.guess();
	if (timeZone) {
		return moment(dateTime).tz(timeZone).format(format);
	} else {
		return moment(dateTime).format(format);
	}
	// if(Intl.DateTimeFormat().resolvedOptions().timeZone){
	//   // 'YYYY/MM/DD H:m:s'
	//   return moment_timezone(dateTime).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format(format)
	// } else {
	//   return dateTime;
	// }
}
export function getSortOrder(status) {
	switch (status) {
		case DEVICE_ACTIVATED:
			return '1';
		case DEVICE_PRE_ACTIVATION:
			return '4';
		case DEVICE_EXPIRED:
			return '2';
		case DEVICE_UNLINKED:
			return '7';
		case DEVICE_SUSPENDED:
			return '3';
		case DEVICE_PENDING_ACTIVATION:
			return '5';
		default:
			return
	}
}

export function checkValue(value) {
	if (value !== undefined && value !== '' && value !== null && value !== 'undefined' && value !== 'Undefined' && value !== "UNDEFINED" && value !== 'null' && value !== 'Null' && value !== 'NULL') {
		return value;
	} else {
		return 'N/A';
	}
}
export function getDealerStatus(unlink_status, account_status) {
	if (unlink_status === 1) {
		return "unlinked";
	} else if ((account_status === '' || account_status === null) && (unlink_status === 0)) {
		return 'active'
	} else if (account_status === 'suspended') {
		return 'suspended';
	} else {
		return 'N/A';
	}
}

export function componentSearch(arr, search) {
	let foundDevices = [];
	let obks = Object.keys(arr[0]);
	checkIsArray(arr).map((el) => {
		obks.some((obk) => {
			if (obk) {
				let temp = el[obk];
				if (obk === 'dealer_id')
					temp = temp.toString()
				if ((typeof temp) === 'string') {
					if (temp.toLowerCase().includes(search.toLowerCase())) {
						foundDevices.push(el);
						return true;
					}
				}
			}
		});
	})
	return foundDevices;
}


export function componentSearchSystemMessages(arr, keys, search) {
	let foundDevices = [];
	let obks = keys;
	checkIsArray(arr).map((el) => {
		obks.some((obk) => {
			if (obk) {
				let temp = el[obk];
				if (obk === 'dealer_id')
					temp = temp.toString()
				if ((typeof temp) === 'string') {
					if (temp.toLowerCase().includes(search.toLowerCase())) {
						foundDevices.push(el);
						return true;
					}
				}
			}
		});
	})
	return foundDevices;
}

export function getFormattedDate(value) {
	function convert(str) {
		var month, day, year, hours, minutes, seconds;
		var date = new Date(str),
			month = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		hours = ("0" + date.getHours()).slice(-2);
		minutes = ("0" + date.getMinutes()).slice(-2);
		seconds = ("0" + date.getSeconds()).slice(-2);

		var mySQLDate = [month, day, date.getFullYear()].join("-");
		var mySQLTime = [hours, minutes, seconds].join(":");
		return [mySQLDate, mySQLTime].join(" ");
	}

	let date = new Date(value);
	let formattedDate = convert(date)
	return formattedDate;
	// date.toLocaleDateString('%d-%b-%Y');
}

export function getDateFromTimestamp(value) {
	function convert(str) {
		var month, day, year;
		var date = new Date(str),
			month = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);


		var formatedDate = [date.getFullYear(), month, day].join("/");
		return formatedDate;
	}

	let date = new Date(value);
	let formattedDate = convert(date)
	return moment(formattedDate).format('DD-MMM-YYYY');
}

export function getOnlyTimeFromTimestamp(value) {
	return moment(value).format('HH:mm');
}

export function getOnlyTimeAndDateTimestamp(value) {
	return moment(value).format('DD-MM-YYYY HH:mm');
}

export function convertTimestampToDate(value) {
	function convert(str) {
		return moment(str).format('DD-MM-YYYY')
	}

	let formattedDate = convert(value)
	return formattedDate;
}

export function initCap(str) {
	return str.replace(/^\w/, function (chr) { return chr.toUpperCase() })
}
export function titleCase(str) {
	var wordsArray = str.toLowerCase().split(/\s+/);
	var upperCased = checkIsArray(wordsArray).map(function (word) {
		var dashWords = word.split("-");
		if (dashWords.length > 1) {
			return checkIsArray(dashWords).map((dWord, index) => {
				var char = (++index !== dashWords.length) ? "-" : "";
				return dWord.charAt(0).toUpperCase() + dWord.substr(1) + char;
			})
		} else {
			if (word === "id" || word === "pgp" || word === "ip") {
				return word.toUpperCase();
			} else {
				return word.charAt(0).toUpperCase() + word.substr(1);
			}
		}
	});
	return upperCased.join(" ").toString().replace(",", "");
}
export function checkRemainDays(createDate, validity) {
	var validDays = 0, createdDateTime, today, days;
	if (validity !== null) validDays = validity;
	createdDateTime = new Date(createDate);
	createdDateTime.setDate(createdDateTime.getDate() + validDays);
	today = new Date();
	var difference_ms = createdDateTime.getTime() - today.getTime();

	//Get 1 day in milliseconds
	var one_day = 1000 * 60 * 60 * 24;

	// Convert back to days and return
	days = Math.round(difference_ms / one_day);
	// console.log('checkk days And validity');
	// console.log(days);
	// console.log(validity, 'klkl')

	if (days > 0) return days; else if (days <= 0) return "Expired"; else return "Not Announced";
}
export function checkRemainTermDays(createDate, endDate) {
	let startDate = moment()
	let lastDate = moment(endDate)
	console.log(lastDate - startDate);
	return lastDate.diff(startDate, "days")
}

export function isBase64(str) {
	if (!str || str.trim() === '') { return false; }
	try {
		return atob(str)
	} catch (err) {
		return false;
	}
}

export function getDevicesListActionBtns(user, device, status, allButtons) {
	let actionBtns = [];

	if (status === DEVICE_ACTIVATED || status === DEVICE_TRIAL) {
		actionBtns.push(<Fragment><Fragment>{allButtons.SuspendBtn}</Fragment><Fragment>{allButtons.EditBtn}</Fragment><Fragment>{allButtons.ConnectBtn}</Fragment></Fragment>)
	}
	else if (status === DEVICE_PRE_ACTIVATION) {
		if (user.type !== ADMIN) {
			actionBtns.push(<Fragment>{allButtons.DeleteBtnPreActive}</Fragment>)
		}
		actionBtns.push(<Fragment>{allButtons.EditBtn}</Fragment>)
	}
	// else if (device.flagged !== 'Not flagged') {
	//    // (<Fragment><Fragment>{allButtons.Unflagbtn}</Fragment><Fragment>{allButtons.ConnectBtn}</Fragment></Fragment>)
	// }
	else if (device.flagged !== 'Not flagged' && device.transfer_status === 0 && status === "Flagged") {
		actionBtns.push(<Fragment><Fragment>{allButtons.Unflagbtn}</Fragment><Fragment>{allButtons.ConnectBtn}</Fragment></Fragment>)
	}
	else if (device.flagged !== 'Not flagged' && device.transfer_status === 1 && status === "Transferred") {
		actionBtns.push(<Fragment><Fragment>{allButtons.Unflagbtn}</Fragment><Fragment>{allButtons.ConnectBtn}</Fragment></Fragment>)
	}
	else if (status === DEVICE_SUSPENDED) {
		actionBtns.push(<Fragment><Fragment>{allButtons.ActiveBtn}</Fragment><Fragment>{allButtons.EditBtn}</Fragment><Fragment>{allButtons.ConnectBtn}</Fragment></Fragment>)
	}
	else if (status === DEVICE_EXPIRED) {
		actionBtns.push(<Fragment><Fragment>{allButtons.EditBtn}</Fragment><Fragment>{allButtons.ConnectBtn}</Fragment></Fragment>)
	}
	else if (status === DEVICE_UNLINKED && user.type !== ADMIN) {
		actionBtns.push(<Fragment>{allButtons.DeleteBtn}</Fragment>)
	}
	else if (status === DEVICE_PENDING_ACTIVATION && user.type !== ADMIN && device.link_code === user.dealer_pin) {
		if (device.relink_status == 1) {
			actionBtns.push(<Fragment> <Fragment>{allButtons.rejectRelinkBtn}</Fragment> <Fragment>{allButtons.relinkBtn}</Fragment></Fragment>)
		} else {
			actionBtns.push(<Fragment> <Fragment>{allButtons.DeclineBtn}</Fragment><Fragment>{allButtons.AcceptBtn}</Fragment><Fragment>{allButtons.transferButton}</Fragment></Fragment>)
		}
	}
	// else if (status === DEVICE_PRE_ACTIVATION) {
	//     actionBtns = false
	// }
	// else if (status === DEVICE_EXPIRED) {
	//     if (status === DEVICE_ACTIVATED) {
	//         actionBtns = <Fragment>{allButtons.SuspendBtn}</Fragment>
	//     } else {
	//         actionBtns = <Fragment><Fragment> {ActiveBtn}</Fragment> <Fragment>{allButtons.ConnectBtn}</Fragment> <Fragment>{allButtons.EditBtn}</Fragment></Fragment >
	//     }
	// } else {
	//     actionBtns = false
	// }

	return actionBtns;
}


export function convertToLang(lngWord, constant) {
	if (lngWord !== undefined && lngWord !== '' && lngWord !== null) {
		return lngWord;
	} else if (constant !== undefined && constant !== '' && constant !== null) {
		return constant;
	} else {
		return "N/A";
	}
}

export function getDefaultLanguage(transaction_id) {
	switch (transaction_id) {

		// Devices Columns
		case "tableHeadings.DEVICEID":
			return "DEVICE ID";
		case "tableHeadings.USERID":
			return "USER ID";
		case "tableHeadings.STATUS":
			return "STATUS";
		case "tableHeadings.MODE":
			return "MODE";
		case "tableHeadings.FLAGGED":
			return "FLAGGED";
		case "tableHeadings.DEVICENAME":
			return "DEVICE NAME";
		case "tableHeadings.ACCOUNTEMAIL":
			return "ACCOUNT EMAIL";
		case "tableHeadings.CLIENTID":
			return "CLIENT ID";
		case "tableHeadings.ACTIVATIONCODE":
			return "ACTIVATION CODE";
		case "tableHeadings.PGPEMAIL":
			return "PGP EMAIL";
		case "tableHeadings.SIMID":
			return "SIM ID";
		case "tableHeadings.CHATID":
			return "CHAT ID";
		case "tableHeadings.DEALERID":
			return "DEALER ID";
		case "tableHeadings.DEALERNAME":
			return "DEALER NAME";
		case "tableHeadings.DEALERPIN":
			return "DEALER PIN";
		case "tableHeadings.MACADDRESS":
			return "MAC ADDRESS";
		case "tableHeadings.IMEI1":
			return "IMEI1";
		case "tableHeadings.SIM1":
			return "SIM1";
		case "tableHeadings.SIM2":
			return "SIM2";
		case "tableHeadings.IMEI2":
			return "IMEI2";
		case "tableHeadings.SERIALNUMBER":
			return "SERIAL NUMBER";
		case "tableHeadings.MODEL":
			return "MODEL";
		case "tableHeadings.S-DEALER":
			return "S-DEALER";
		case "tableHeadings.S-DEALERNAME":
			return "S-DEALER NAME";
		case "tableHeadings.STARTDATE":
			return "START DATE";
		case "tableHeadings.EXPIRYDATE":
			return "DEVICE EXPIRY DATE";
		case "tableHeadings.TYPE":
			return "Type";
		case "tableHeadings.VERSION":
			return "Version";
		case "pre.activated.tab.extra.id":
			return "PRE-ACTIVATED TAB";
		case "tableHeadings.TRANSFERED":
			return "TRANSFERED TO";
		case "tableHeadings.lastOnline":
			return "Last Online";
		case "tableHeadings.IPAddress":
			return "IP Address";
		case "tableHeadings.REMAININGDAYS":
			return "VALID DAYS";

		case "tableHeadings.device-parent-id":
			return "PARENT DEALER ID";
		case "tableHeadings.device-parent-name":
			return "PARENT DEALER NAME";

		// apk Columns
		case "show.on.device.id":
			return "SHOW ON DEVICE1";
		case "app.name.id":
			return "APP NAME";
		case "app.logo.id":
			return "APP LOGO";
		case "permission.id":
			return "PERMISSION";
		case "apk.size.id":
			return "APK SIZE";
		case "apk.id":
			return "APK";
		case "label.id":
			return "LABEL";
		case "package.name.id":
			return "PACKAGE NAME";
		case "created_at":
			return "LAST UPLOADED";
		case "updated_at":
			return "LAST UPDATED";

		// dealer/sdealer Columns
		case "dealer_id":
			return "DEALER ID";
		case "dealer_name":
			return "DEALER NAME";
		case "dealer_email":
			return "DEALER EMAIL";
		case "link_code":
			return "DEALER PIN";
		case "connected_devices":
			return "DEALER DEVICES";
		case "dealer_credits":
			return "DEALER CREDITS";
		case "parent_dealer":
			return "Parent Dealer";
		case "parent_dealer_id":
			return "Parent Dealer ID";

		default:
			return transaction_id; // already translated language
	}
}

export function getWeekDays() {
	return [
		{ key: 1, value: "Sunday" },
		{ key: 2, value: "Monday" },
		{ key: 3, value: "Tuesday" },
		{ key: 4, value: "Wednesday" },
		{ key: 5, value: "Thursday" },
		{ key: 6, value: "Friday" },
		{ key: 7, value: "Saturday" },
	];
}
export function getMonthNames() {
	return [
		{ key: 1, value: "January" },
		{ key: 2, value: "February" },
		{ key: 3, value: "March" },
		{ key: 4, value: "April" },
		{ key: 5, value: "May" },
		{ key: 6, value: "June" },
		{ key: 7, value: "July" },
		{ key: 8, value: "August" },
		{ key: 9, value: "September" },
		{ key: 10, value: "October" },
		{ key: 11, value: "November" },
		{ key: 12, value: "December" },
	]
}

export function getDaysOfMonth(monthName = '') {
	let monthDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
	//  January, March, May, July, August, October & December (all these months contain 31 days) Total # 07
	//  April, June, September & November (all these months contain 30 days) Total # 04

	if (monthName === 4 || monthName === 6 || monthName === 9 || monthName === 11) { // April, June, September & November
		monthDays.pop(); // it will remove last index from array
		// monthDays = monthDays.slice(0, -1); // it will remove last index from array
	}
	else if (monthName === 2) { // February
		let currentYear = moment().format('YYYY');
		let leepYear = (currentYear % 100 === 0) ? (currentYear % 400 === 0) : (currentYear % 4 === 0);
		if (leepYear) {
			monthDays = monthDays.slice(0, -2); // it will remove last 2 index from array
		} else {
			monthDays = monthDays.slice(0, -3); // it will remove last 3 index from array
		}
	}
	return monthDays;
}

export function getTimezonesList() {
	let timeZones = moment.tz.names();
	let offsetTmz = [];

	for (let i in timeZones) {
		offsetTmz.push({ zoneName: timeZones[i], tzOffset: `(GMT${moment.tz(timeZones[i]).format('Z')})` });
	}

	return offsetTmz.sort();
}

export function getSelectedTZDetail(zone_name) {
	let detail = '';
	let timeZones = moment.tz.names();
	if (!zone_name) {
		zone_name = moment.tz.guess(); // get local time zone value "Asia/Karachi"
	}
	let foundZoneIndex = timeZones.findIndex(item => item.toLowerCase() === zone_name.toLowerCase());

	if (foundZoneIndex !== -1) {
		detail = `(GMT${moment.tz(timeZones[foundZoneIndex]).format('Z')}) ${timeZones[foundZoneIndex]}`
	} else {
		detail = 'Timezone not selected';
	}
	return detail;
}

export function checkTimezoneValue(zone_name, withGMT = true) {
	let detail = 'N/A'; // Timezone not selected
	let timeZones = moment.tz.names();
	let foundZoneIndex = timeZones.findIndex(item => item.toLowerCase() === zone_name.toLowerCase());

	if (foundZoneIndex !== -1) {
		if (withGMT) {
			detail = `(GMT${moment.tz(timeZones[foundZoneIndex]).format('Z')}) ${timeZones[foundZoneIndex]}`
		} else {
			detail = timeZones[foundZoneIndex];
		}
	} else {
		if (!withGMT) detail = '';
	}
	return detail;
}


export function getWeekDayDescription(key) {

	switch (key) {
		case 1:
			return "Every Sunday";
		case 2:
			return "Every Monday";
		case 3:
			return "Every Tuesday";
		case 4:
			return "Every Wednesday";
		case 5:
			return "Every Thursday";
		case 6:
			return "Every Friday";
		case 7:
			return "Every Saturday";


		default:
			return "N/A";
	}
}

export function getMonthName(key) {

	switch (key) {
		case 1:
			return "January";
		case 2:
			return "February";
		case 3:
			return "March";
		case 4:
			return "April";
		case 5:
			return "May";
		case 6:
			return "June";
		case 7:
			return "July";
		case 8:
			return "August";
		case 9:
			return "September";
		case 10:
			return "October";
		case 11:
			return "November";
		case 12:
			return "December";

		default:
			return "N/A";
	}
}
export function convertTimezoneValue(dealerTimezone, data, clientToServerTZ = false, dateFormat = TIMESTAMP_FORMAT) { // dealerTimezone: timezone, data: date/time
	let convertedDateTime = "N/A";

	if (data && data !== "N/A" && data !== "n/a" && data !== "0000-00-00 00:00:00") {
		let timeZones = moment.tz.names();
		let foundZoneIndex = timeZones.findIndex(item => item.toLowerCase() === dealerTimezone.toLowerCase());
		if (foundZoneIndex === -1) {
			dealerTimezone = moment.tz.guess(); // get local time zone value e.g "Asia/Karachi"
		}
		if (typeof clientToServerTZ === "boolean" && clientToServerTZ) {
			convertedDateTime = moment.tz(data, dealerTimezone).tz(SERVER_TIMEZONE).format(dateFormat);
		} else {
			// convert server time to client time
			convertedDateTime = moment.tz(data, SERVER_TIMEZONE).tz(dealerTimezone).format(dateFormat);
		}
	}

	// console.log("convertTimezoneValue ",data, SERVER_TIMEZONE,  dealerTimezone, convertedDateTime)
	return convertedDateTime;
}

export function checkIsArray(data) {
	if(!data){
		return [];
	}
	if(Array.isArray(data) && data.length){
		return data;
	}else {
		return [];
	}
}

export function checkDate(date) {
	return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

export function handleMultipleSearch(e, copy_status, copyRequireSearchData, demoSearchValues, requireForSearch) {
	// handleMultipleSearch(e, this.state.copy_status, copyDevices, this.state.SearchValues, this.state.filteredDevices)

	// console.log("e, copy_status, copyRequireSearchData, demoSearchValues, requireForSearch ", e.target.value, copy_status, copyRequireSearchData, demoSearchValues, requireForSearch)

	let demoData = [];
	if (copy_status) {
		copyRequireSearchData = requireForSearch;
		copy_status = false;
	}

	let targetName = e.target.name;
	let targetValue = e.target.value;
	let searchColsAre = Object.keys(demoSearchValues).length;

	// console.log(demoSearchValues, 'value  is: ', targetValue)

	if (targetValue.length || Object.keys(demoSearchValues).length) {
		demoSearchValues[targetName] = { key: targetName, value: targetValue };

		checkIsArray(copyRequireSearchData).forEach((obj) => {
			// console.log('device is: ', device);
			// if (obj[targetName] !== undefined) {

			let searchRecords = 0;

			if (searchColsAre > 0) {
				checkIsArray(Object.values(demoSearchValues)).forEach((data) => {

					if (obj[data.key] !== undefined && obj[data.key] !== null) {
						if (data.value == "") {
							searchRecords++;
						} else if (typeof (obj[data.key]) === 'string') {
							if (obj[data.key].toString().toUpperCase().includes(data.value.toString().toUpperCase())) {
								searchRecords++;
							}
						} else
							// if (obj[data.key] !== null) {
							if (isArray(obj[data.key])) {

								if (data.key == "devicesList") {
									if (obj[data.key].length.toString().toUpperCase().includes(data.value.toString().toUpperCase())) {
										searchRecords++;
									}
								}

							} else if (obj[data.key].toString().toUpperCase().includes(data.value.toString().toUpperCase())) {
								searchRecords++;
							}
						// }
					}
				})

				if (searchColsAre === searchRecords) {
					demoData.push(obj);
				}
			}
			else {
				if (obj[targetName].toString().toUpperCase().includes(targetValue.toString().toUpperCase())) {
					demoData.push(obj);
				}
			}
			// }
			// else {
			//   // demoData.push(obj);
			// }
		});
		return {
			copy_status,
			copyRequireSearchData,
			demoData,
			SearchValues: demoSearchValues
		}
	} else {
		return {
			copy_status,
			copyRequireSearchData,
			demoData: copyRequireSearchData,
			SearchValues: demoSearchValues
		}
	}
}

export function filterData_RelatedToMultipleSearch(devices, SearchValues) {
	let searchedDevices = [];
	let searchData = Object.values(SearchValues);
	let searchColsAre = Object.keys(SearchValues).length;

	if (searchColsAre) {
		checkIsArray(devices).forEach((device) => {
			let searchDevices = 0;

			for (let search of searchData) {
				// console.log('search is: ', search)
				// console.log('search key is: ', search.key)
				if (search.value == "") {
					searchDevices++;
				} else if (typeof (device[search.key]) === 'string') {
					if (device[search.key].toUpperCase().includes(search.value.toUpperCase())) {
						searchDevices++;
					}
				} else if (isArray(device[search.key])) {
					if (search.key == "devicesList") {
						if (device[search.key].length.toString().toUpperCase().includes(search.value.toUpperCase())) {
							searchDevices++;
						}
					}
				} else {
					if (device[search.key].toString().toUpperCase().includes(search.value.toUpperCase())) {
						searchDevices++;
					}
				}

			}
			if (searchColsAre === searchDevices) {
				searchedDevices.push(device);
			}

		});
		return searchedDevices;
	} else {
		return devices;
	}
}


export function findAndRemove_duplicate_in_array(arra1) {
	// console.log('array is: ', arra1)
	var object = {};
	var duplicateIds = [];

	checkIsArray(arra1).forEach(function (item) {
		if (!object[item])
			object[item] = 0;
		object[item] += 1;
	})

	for (var prop in object) {
		if (object[prop] >= 2) {
			duplicateIds.push(Number(prop));
		}
	}

	let removeDuplicateIds = checkIsArray(arra1).filter((item) => !duplicateIds.includes(item));
	return ([...removeDuplicateIds, ...duplicateIds]);

}


export function removeDuplicateObjects(originalArray, prop) {
	var newArray = [];
	var lookupObject = {};

	for (var i in originalArray) {
		lookupObject[originalArray[i][prop]] = originalArray[i];
	}

	for (i in lookupObject) {
		newArray.push(lookupObject[i]);
	}
	return newArray;
}
export function generatePDF(columns, rows, title, fileName, formData) {

	let y = 15;
	let x = 20;
	var doc = new jsPDF('p', 'pt', [610, 842]);
	doc.setFontSize(16);
	doc.setTextColor(40);
	doc.setFontStyle('normal');
	doc.text(title, y, x);

	if (title === 'Product Inventory Report') {

		doc.setFontSize(12);
		doc.setTextColor(40);
		doc.setFontStyle('normal');
		doc.text((formData.productType) ? 'Product: ' + formData.productType : 'Product: All', y, x += 15);

		doc.setFontSize(12);
		doc.setTextColor(40);
		doc.setFontStyle('normal');
		doc.text((formData.type) ? 'Type: ' + formData.type : 'Type: All', y, x += 15);

	} else if (title === 'Hardware Inventory Report') {

		doc.setFontSize(12);
		doc.setTextColor(40);
		doc.setFontStyle('normal');
		doc.text((formData.hardware) ? 'Hardware: ' + formData.hardware : 'Hardware: All', y, x += 15);

	} else if (title === 'Payment History Report') {

		doc.setFontSize(12);
		doc.setTextColor(40);
		doc.setFontStyle('normal');
		doc.text((formData.type) ? formData.type : 'Product Type: All', y, x += 15);

		doc.setFontSize(12);
		doc.setTextColor(40);
		doc.setFontStyle('normal');
		doc.text((formData.transaction_type) ? 'Transaction Type: ' + formData.transaction_type : 'Transaction Type: All', y, x += 15);


	} else if (title === 'Invoice Report') {

		doc.setFontSize(12);
		doc.setTextColor(40);
		doc.setFontStyle('normal');
		doc.text((formData.payment_status) ? 'Payment Status: ' + formData.payment_status : 'Payment Status: All', y, x += 15);

	} else if (title === 'Sales Report') {

		doc.setFontSize(12);
		doc.setTextColor(40);
		doc.setFontStyle('normal');
		doc.text('Total Cost: ' + (formData.saleInfo.totalCost) ? 'Total Cost: ' + formData.saleInfo.totalCost : 'Total Cost: ' + 0, y, x += 15);

		doc.setFontSize(12);
		doc.setTextColor(40);
		doc.setFontStyle('normal');
		doc.text('Total Sale: ' + (formData.saleInfo.totalSale) ? 'Total Sale: ' + formData.saleInfo.totalSale : 'Total Sale: ' + 0, y, x += 15);

		doc.setFontSize(12);
		doc.setTextColor(40);
		doc.setFontStyle('normal');
		doc.text('Profit/Loss: ' + (formData.saleInfo.totalProfitLoss) ? 'Profit/Loss: ' + formData.saleInfo.totalProfitLoss : 'Profit/Loss: ' + 0, y, x += 15);

		doc.setFontSize(12);
		doc.setTextColor(40);
		doc.setFontStyle('normal');
		doc.text((formData.saleInfo.product) ? 'Product Type(s): ' + formData.saleInfo.product : 'Product Type(s): All', y, x += 15);

	}

	doc.setFontSize(12);
	doc.setTextColor(40);
	doc.setFontStyle('normal');
	doc.text((formData.dealerObject) ? 'Dealer(s): ' + formData.dealerObject.link_code : 'Dealer(s): All', y, x += 15);


	doc.setFontSize(12);
	doc.setTextColor(40);
	doc.setFontStyle('normal');
	doc.text((formData.device) ? 'Device(s): ' + formData.device : 'Device(s): All', y, x += 15);


	if (!formData.from && !formData.to) {
		doc.text('Duration: All', y, x += 15);
	} else {
		if (formData.from) {
			doc.setFontSize(12);
			doc.setTextColor(40);
			doc.setFontStyle('normal');
			doc.text('From: ' + convertTimestampToDate(formData.from), y, x += 15);
		}

		if (formData.to) {
			doc.setFontSize(12);
			doc.setTextColor(40);
			doc.setFontStyle('normal');
			doc.text('To: ' + convertTimestampToDate(formData.to), y, x += 15);
		}
	}

	doc.setFontSize(12);
	doc.setTextColor(40);
	doc.setFontStyle('normal');
	doc.text('Total Records: ' + rows.length, y, x += 15);


	doc.autoTable(columns, rows, {
		startY: doc.autoTableEndPosY() + x + 15,
		margin: { horizontal: 10 },
		styles: { overflow: 'linebreak' },
		bodyStyles: { valign: 'top' },
		theme: "striped"
	});

	var pdf = doc.output('blob');
	var blobToBase64 = function (blob, cb) {
		var reader = new FileReader();
		reader.onload = function () {
			var dataUrl = reader.result;
			var base64 = dataUrl.split(',')[1];
			cb(base64);
		};
		reader.readAsDataURL(blob);
	};

	var FileNameToOpen = fileName + '.pdf';
	blobToBase64(pdf, function (base64) {
		var update = { 'blob': base64, 'fileName': FileNameToOpen };
		axios.post(BASE_URL + 'users/show-pdf-file', update).then(res => {
			if (res.status) {
				window.open(BASE_URL + 'users/getFileWithFolder/report/' + FileNameToOpen, '_blank');
			}
		});

	});
}

export function generateExcel(rows, fileName) {
	var wb = XLSX.utils.book_new();
	let ws = XLSX.utils.json_to_sheet(rows);
	let fileNameCSV = fileName + ".xlsx";

	XLSX.utils.book_append_sheet(wb, ws, 'Devices');
	XLSX.writeFile(wb, fileNameCSV)

}

export function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
	try {
		decimalCount = Math.abs(decimalCount);
		decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

		const negativeSign = amount < 0 ? "-" : "";

		let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
		let j = (i.length > 3) ? i.length % 3 : 0;

		return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
	} catch (e) {
		console.log(e)
	}
};

/**
 * @author Usman Hafeez
 * @description removeColumns Method
 */

export function removeColumns(columnList, removeIndexes) {
	return checkIsArray(columnList).filter((column) => {
		for (let i = 0; i < removeIndexes.length; i++) {
			if (column.dataIndex !== removeIndexes[i]) {
				return column;
			}
		}
	})
}
