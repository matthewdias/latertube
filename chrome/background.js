// Define some variables used to remember state.
var playlistId;

// After the API loads
function handleAPILoaded(token) {
	getPlaylist();
	props = {
		"id": "watchlatercontext",
		"title": "Add video to Watch Later",
		"contexts": ['page', 'frame', 'link'],
		"onclick": watchLater
	}
	chrome.contextMenus.create(props, function() {
		// console.log('context created');
	});
}

function getPlaylist() {
	var request = gapi.client.youtube.channels.list({
    part: 'contentDetails',
    mine: true
  });
  request.execute(function(response) {
  	playlistId = response.items[0].contentDetails.relatedPlaylists.watchLater;
  });
}

//get url
function watchLater(info) {
	// console.log(info);
	var url;
	if(info.linkUrl) {
		url = info.linkUrl;
	}
	else if(info.frameUrl) {
		url = info.frameUrl;
	}
	else if(info.pageUrl) {
		url = info.pageUrl;
	}
	// console.log(url);
	getYouTubeId(url);
}

// query latertube.herokuapp.com for youtube id
function getYouTubeId(url){
	$.get("http://127.0.0.1.xip.io:3000/find/" + url, function(data) {
       		addToPlaylist(data.id, data.kind);
    });
}

// Add a video to a playlist. The "startPos" and "endPos" values let you
// start and stop the video at specific times when the video is played as
// part of the playlist. However, these values are not set in this example.
function addToPlaylist(id, kind, startPos, endPos) {
  var details = {
    videoId: id,
    kind: 'youtube#' + kind
  }
  if (startPos != undefined) {
    details['startAt'] = startPos;
  }
  if (endPos != undefined) {
    details['endAt'] = endPos;
  }
  var request = gapi.client.youtube.playlistItems.insert({
    part: 'snippet',
    resource: {
      snippet: {
        playlistId: playlistId,
        resourceId: details
      }
    }
  });
  request.execute(function(response) {
    console.log('response: ' + JSON.stringify(response.result));
    if(response != undefined) {
    	alert('success');
    }
    else alert('failure')
  });
}

//events
chrome.runtime.onStartup.addListener(getAuth());

chrome.commands.onCommand.addListener(function(command) {
    if(command == 'watchlater')
    	watchlater();
});