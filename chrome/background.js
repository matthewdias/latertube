// Define some variables used to remember state.
var playlistId;
var playlistIndex;

// After the API loads
function handleAPILoaded(token) {
    getPlaylistId();
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

function getPlaylistId() {
    var request = gapi.client.youtube.channels.list({
        part: 'contentDetails',
        mine: true
    });
    request.execute(function(response) {
        playlistId = response.items[0].contentDetails.relatedPlaylists.watchLater;
        console.log(playlistId);
    });
}

function getPlaylistIndex(data) {
    var request = gapi.client.youtube.playlists.list({
        part: 'contentDetails',
        id: playlistId
    });
    request.execute(function(response) {
        playlistIndex = response.items[0].contentDetails.itemCount;
        // for (i in data) {
        for (i = 0; i < 1; i++) {
            console.log(data[i].id);
            console.log(playlistIndex);
            if (data[i].kind == "video") {
                addRequest(playlistIndex, data[i].id, data[i].kind);
                playlistIndex++;
            }
        }
    });
}

//get url
function watchLater(info) {
    // console.log(info);
    var url;
    if (info.linkUrl) {
        url = info.linkUrl;
    } else if (info.frameUrl) {
        url = info.frameUrl;
    } else if (info.pageUrl) {
        url = info.pageUrl;
    }
    // console.log(url);
    getYouTubeId(url);
}

// query latertube.herokuapp.com for youtube ids
function getYouTubeId(url) {
    $.get("http://latertube.herokuapp.com/find/" + url, function(data) {
        console.log(data);
        getPlaylistIndex(data);
    });
}

// Add a video to a playlist. The "startPos" and "endPos" values let you
// start and stop the video at specific times when the video is played as
// part of the playlist. However, these values are not set in this example.
function addRequest(index, id, kind, startPos, endPos) {
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
                resourceId: details,
                position: index
            }
        }
    });
    request.execute(function(response) {
        console.log(response);
    })
}

//events
//chrome.runtime.onStartup.addListener(getAuth());

chrome.commands.onCommand.addListener(function(command) {
    if (command == 'watchlater')
        watchlater();
});