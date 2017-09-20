// Client ID and API key from the Developer Console
// var CLIENT_ID = '686170479566-sd046p0dspafjglrkh4pp7ukrgjvhq82.apps.googleusercontent.com';
//old
var CLIENT_ID = '686170479566-9t5rdf5hujoh1vjcg3rt1074djcrcfun.apps.googleusercontent.com';
// var CLIENT_ID = '686170479566-7a3t7qmtgscbu00itr0ieb2gpr2nta1r.apps.googleusercontent.com';
// var CLIENT_ID = '686170479566-89a0jmjo06s5r7irt8v753hvmu1cr2vi.apps.googleusercontent.com';
/**
 * 686170479566-89a0jmjo06s5r7irt8v753hvmu1cr2vi.apps.googleusercontent.com
 * 
 * 686170479566-89a0jmjo06s5r7irt8v753hvmu1cr2vi.apps.googleusercontent.com
 */
console.log('CLIENT_ID: ', CLIENT_ID);

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
// var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = null;
var signoutButton = null;

var SPREADSHEET = "1rvWqb4IZGDqVcFjYrFKludMCq6GkRzCqy0kJLErwIfw"
var SHEET_NAME = "regSheet1"
var LAST = 0;
/**
 * Load UI after view is loaded 
 * @param {*} callee 
 */
window.LoadUI = function loadUI(callee) {
  console.log('callee: ', callee);
  authorizeButton = document.getElementById('authorize-button');
  signoutButton = document.getElementById('signout-button');

  gapi.load('client:auth2', initClient);
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  console.log('handleClientLoad: ');
  myAppConfig.googleApiLoaded = true;
  // window.LoadUI("handle ClientLoad")
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  console.log('init Client: ');
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  console.log('sheet track isSignedIn: ', isSignedIn);
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    // getData();
    setData(myAppConfig.regUsersSheetData)
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}


/**
 * https://stackoverflow.com/questions/39135459/write-values-on-specific-google-spreadsheet-with-google-api-php-client
 * set the data to sheet
 * */
function setData(valueArray) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET,
    range: SHEET_NAME,
  }).then(function (response) {
    var range = response.result;

    if (range.values.length > 0) {
      LAST = (range.values.length + 1);
      console.log('LAST: ', LAST);
    }
  }).then(function () {
    gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET,
      valueInputOption: 'USER_ENTERED',
      /*  values: [
         ["311", "3", "4", "5", "6", "7"],
         ["411", "3", "4", "5", "6", "7"]
       ], */
      values: valueArray,
      // range: SHEET_NAME+'!A' + LAST,
      range: SHEET_NAME + '!A2',
    }).then(function (response) {
      console.log('update last: ' + LAST);
    });
  });
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * 
 * tata classedge account sheet ID
 * https://docs.google.com/spreadsheets/d/1Kl7auwITtc_yXvXLqOEemVTxs6vMVvfnUh9G3k9Q3ZA/edit
 * 
 * https://stackoverflow.com/questions/43964539/google-api-not-a-valid-origin-for-the-client-url-has-not-been-whitelisted-for
 * I cleared cache. Started working then
 */
function getData() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET,
    range: SHEET_NAME + '!A2:E',
  }).then(function (response) {
    var range = response.result;
    if (range.values.length > 0) {
      appendPre('Name, Major2222:');
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
        // Print columns A and E, which correspond to indices 0 and 4.
        appendPre(row[0] + ', ' + row[4]);
      }
    } else {
      appendPre('No data found.');
    }
  }, function (response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

function setSheetData(users) {
  /**
   * BO Create Google Sheet
   */
  var colArr = [];

  for (var index = 0; index < users.length; index++) {
    var rowArr = [];
    var regUserObj = users[index];
    console.log(index, ' :: regUserObj: ', regUserObj);
    rowArr.push(index + 1 || "")
    rowArr.push(new Date(regUserObj.timeStamp || "") || "")
    rowArr.push(regUserObj.uid || "")
    rowArr.push(regUserObj.full_name || "")
    rowArr.push(regUserObj.ccl2017PaidTo || "")
    rowArr.push(regUserObj.cluster || "")
    rowArr.push(regUserObj.wing || "")
    rowArr.push(regUserObj.flat || "")
    rowArr.push(regUserObj.ownership || "")
    rowArr.push(regUserObj.mobile || "")
    rowArr.push(regUserObj.email || "")
    rowArr.push(regUserObj.sportsname || "")
    colArr.push(rowArr)
  }
  myAppConfig.regUsersSheetData = colArr;
  console.log('sheet track myAppConfig.regUsersSheetData: ', myAppConfig.regUsersSheetData);

  window.LoadUI("set SheetData automatically for admins on open");
  /**
   * EO Create Google Sheet
   */
}
