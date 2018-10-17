// JavaScript Document

// NUNJUCKS SETUP
var nunEnv = new nunjucks.Environment(new nunjucks.WebLoader(''));

$(document).ready(function() {
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});

// CUSTOM TEMPLATE MOCK DATA LOGIC

// returns the value of a key in the query string of an URL
// if no url argument is passed, the current document URL is used
function getQueryStringParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// retrieves the view ID/uri called in the URLs query string
function getRequestedViewName() {
	var view = getQueryStringParam('view');
	if (view) {
		return view;
	} else {
		return 'home';
	}
}

// returns the base template file for the current view
function getCurrentViewFile (){
	return  'views/' + getRequestedViewName() + '.html';
}

// fills the view settings "viewData" object with the actual JSON data from referenced file
function getViewSettingsAndData () {
	var viewSettingsData = null;
	var requestedViewName = getRequestedViewName();
	var views = loadData('__views');
	
	var viewCount = views.length;
	for (var i = 0; i < viewCount; i++) {
		if (views[i]["uri"] === requestedViewName) {
			var viewSettings = views[i];
			if (viewSettings["viewData"]) {
				for (d in viewSettings["viewData"]) {
					viewSettings["viewData"][d] = loadData(viewSettings["viewData"][d]);
				}
			}
			var viewSettingsData = { "data" : viewSettings };
		}
	}
	return viewSettingsData;
}

// loads JSON mock data from the data folder
function loadData(myURL) {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'data/' + myURL + '.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        },
		'error': function (e) {
			alert('Data load error for ' + myURL + '.json');
			console.log(e);
		}
    });
    return json;
};

