const SHEET_ID = 'PASTE_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'wedding_budget_data';

function doGet(e) {
  const params = e.parameter || {};
  if (params.action !== 'load') {
    return jsonp_(params.callback, { ok: false, error: 'Unsupported action' });
  }

  const userKey = normalizeUserKey_(params.userKey);
  if (!userKey) {
    return jsonp_(params.callback, { ok: false, error: 'Missing userKey' });
  }

  const sheet = getSheet_();
  const row = findRow_(sheet, userKey);
  if (row < 0) {
    return jsonp_(params.callback, { ok: false, error: 'No saved data' });
  }

  const values = sheet.getRange(row, 1, 1, 4).getValues()[0];
  return jsonp_(params.callback, {
    ok: true,
    userKey: values[0],
    updatedAt: values[1],
    payload: JSON.parse(values[3] || '{}'),
  });
}

function doPost(e) {
  const body = JSON.parse((e.postData && e.postData.contents) || '{}');
  if (body.action !== 'save') {
    return text_({ ok: false, error: 'Unsupported action' });
  }

  const userKey = normalizeUserKey_(body.userKey);
  if (!userKey) {
    return text_({ ok: false, error: 'Missing userKey' });
  }

  const sheet = getSheet_();
  const now = new Date().toISOString();
  const payloadJson = JSON.stringify(body.payload || {});
  const row = findRow_(sheet, userKey);
  const record = [userKey, now, Session.getActiveUser().getEmail() || '', payloadJson];

  if (row > 0) {
    sheet.getRange(row, 1, 1, record.length).setValues([record]);
  } else {
    sheet.appendRow(record);
  }

  return text_({ ok: true, userKey, updatedAt: now });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['userKey', 'updatedAt', 'googleUser', 'payloadJson']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findRow_(sheet, userKey) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const keys = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < keys.length; i++) {
    if (normalizeUserKey_(keys[i][0]) === userKey) return i + 2;
  }
  return -1;
}

function normalizeUserKey_(value) {
  return String(value || '').trim().toLowerCase();
}

function text_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp_(callback, obj) {
  const safeCallback = /^[A-Za-z_$][\w$]*$/.test(callback || '') ? callback : 'callback';
  return ContentService
    .createTextOutput(`${safeCallback}(${JSON.stringify(obj)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
