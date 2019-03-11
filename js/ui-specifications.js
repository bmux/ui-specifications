// JavaScript Document

// NUNJUCKS SETUP
var nunEnv = new nunjucks.Environment(new nunjucks.WebLoader(''));

$(document).ready(function() {
  locationHashChange();
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});

// CUSTOM TEMPLATE MOCK DATA LOGIC
// retrieves the view ID/uri called in the URLs query string
function getRequestedViewName() {
	var view = window.location.hash;
	return view ? view.substr(1) : 'home';
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
				for (var d in viewSettings["viewData"]) {
					viewSettings["viewData"][d] = loadData(viewSettings["viewData"][d]);
				}
			}
			viewSettingsData = { "data" : viewSettings };
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
}

function locationHashChange() {
	$('body').html(nunEnv.render(getCurrentViewFile(), getViewSettingsAndData()));
}

window.addEventListener('hashchange', locationHashChange, false);

