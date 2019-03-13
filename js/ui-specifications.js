// JavaScript Document

// NUNJUCKS SETUP
var nunEnv = new nunjucks.Environment(new nunjucks.WebLoader(''));

$(document).ready(() => {
  locationHashChange();
  $('pre code').each((i, block) => {
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
const getCurrentViewFile = () => ('views/' + getRequestedViewName() + '.html');

// fills the view settings "viewData" object with the actual JSON data from referenced file
function getViewSettingsAndData () {
	var viewSettingsData = null;
	var requestedViewName = getRequestedViewName();
	var views = loadData('__views');
	
	var viewCount = views.length;
	for (var i = 0; i < viewCount; i++) {
		if (views[i]["uri"] === requestedViewName) {
			var viewSettings = views[i];
            var viewData = viewSettings["viewData"];
            if (viewData) {
				for (var d in viewData) {
				    if(viewData.hasOwnProperty(d)) {
                        viewData[d] = loadData(viewData[d]);
                    }
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
    var context = getViewSettingsAndData();
    if(context) {
        document.title = context.data.title;
    }
    try {
        $('body').html(nunEnv.render(getCurrentViewFile(), context));
    } catch (exception) {
        $('body').html('<div class="app-container app-container-padded"><h1>Oops, an error occurred!</h1><div class="content-container  content-container-wrong" style="margin: 16px 0;"><pre class="content-container-body">' + exception + '</pre></div><a href="#home">show home page (press h)</a> </div>');
    }
    window.dispatchEvent(new CustomEvent('contentChanged', {title: document.title, selector: 'body'}));
}

function handleKeyPress(event) {
    if(event.key === 'h' || event.key === '0') {
        window.location.hash = '#home';
        event.preventDefault();
        return;
    }
    var pos = parseInt(event.key, 16);
    if(pos > 0) {
        var views = loadData('__views');
        var view = views[pos];
        if (view && view.uri) {
            window.location.hash = '#'+view.uri;
            event.preventDefault();
        }
    }
}

document.addEventListener('keydown', handleKeyPress, false);
window.addEventListener('hashchange', locationHashChange, false);

window.addEventListener('contentChanged', () => {
    // refresh code prettyPrint. see https://github.com/google/code-prettify
    if(PR && PR.prettyPrint) PR.prettyPrint();
});
