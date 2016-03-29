// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
  gapi.auth.init(function() {
    window.setTimeout(checkAuth, 1);
  });
}

function getAuth() {
  chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    gapi.auth.setToken({
      'access_token': token
    });
    loadAPIClientInterfaces(token);
  });
}

// Load the client interfaces for the YouTube Analytics and Data APIs, which
// are required to use the Google APIs JS client. More info is available at
// http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
function loadAPIClientInterfaces(token) {
  gapi.client.load('youtube', 'v3', function() {
    handleAPILoaded(token);
  });
}