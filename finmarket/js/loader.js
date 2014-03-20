function loadJS(paths, clb_fn, clb_ctx, clb_args) {
	if (paths.constructor != Array) paths = [paths];
	var current = -1;
	loadJS.file(false, onload);
	
	function onload() {
		current++;
		if (current==paths.length) {
			//try {
			if (typeof clb_fn == 'function') clb_fn.apply(clb_ctx || this, clb_args || []);
			//} catch(er) {}
		} else {
			loadJS.file(paths[current], onload);
		}
	}
}
loadJS.loading = {};
loadJS.cache = {};
if (window.jQuery) {
	loadJS.cache.jQuery = true;
	loadJS.cache["jquery-1.6.4.min.js"] = true;
}
loadJS.needReadyStateChange = true;
loadJS.file = function(path, onload) {
	if (!path || loadJS.cache[path]) return onload();
	if (loadJS.loading[path]) {
		window.setTimeout(function() {
			if (!loadJS.loading[path]) onload();
		}, 10);
	} else {
		var tag = document.createElement("script");
		tag.charset = "UTF-8";
		tag.setAttribute("charset", "UTF-8");
		if (loadJS.needReadyStateChange) {
			window.setTimeout(function() {
				tag.onreadystatechange = function() {
					if (/complete|loaded/.test(this.readyState)) {
						loadJS.cache[path] = true;
						onload();
					}
				};
				tag.src = path;
			}, 1);
		} else {
			tag.onload = function() {
				loadJS.cache[path] = true;
				loadJS.loading[path] = false;
				onload();
			}
			tag.src = path;
		}
		document.getElementsByTagName("head")[0].appendChild(tag);
	}
};

function loadCSS(paths, clb_fn, clb_ctx, clb_args) {
	if (paths.constructor != Array) paths = [paths];
	var current = -1;
	loadCSS.file(false, onload);
	
	function onload() {
		current++;
		if (current==paths.length) {
			//try {
			if (typeof clb_fn == 'function') clb_fn.apply(clb_ctx || this, clb_args || []);
			//} catch(er) {}
		} else {
			loadCSS.file(paths[current], onload);
		}
	}
}
loadCSS.cache = {};
loadCSS.file = function(path, onload) {
	if (!path || loadCSS.cache[path]) return onload();
	var tag = document.createElement("link");
	tag.rel = "stylesheet";
	tag.href = path;
	document.getElementsByTagName("head")[0].appendChild(tag);
	loadCSS.cache[path] = true;
	onload();
};

function loadHighcharts(alias, clb_fn, clb_ctx, clb_args) {
	loadCSS(loadHighcharts.any.css, function() {
		loadJS(loadHighcharts.any.js, function() {
			if (loadHighcharts[alias]) {
				if (loadHighcharts[alias].css) {
					loadCSS(loadHighcharts[alias].css, function() {
						loadJS(loadHighcharts[alias].js, clb_fn, clb_ctx, clb_args);
					});
				} else {
					loadJS(loadHighcharts[alias].js, clb_fn, clb_ctx, clb_args);
				}
			}
		});
	});
}
loadHighcharts.any = {
	css: "/css/graphs.css",
	js: ["/js/jquery-1.6.4.min.js", "/js/highcharts.js"]
};

loadHighcharts.production = {
	js: "/js/preview-live.js"
};

function loadPie(clb_fn, clb_ctx, clb_args) {
	loadCSS(loadPie.css, function() {
		loadJS(loadPie.js, clb_fn, clb_ctx, clb_args);
	});
}
loadPie.css = "/css/pie.css";
loadPie.js = ["/js/jquery-1.6.4.min.js", "/js/raphael-min.js", "/js/pie.js"];
