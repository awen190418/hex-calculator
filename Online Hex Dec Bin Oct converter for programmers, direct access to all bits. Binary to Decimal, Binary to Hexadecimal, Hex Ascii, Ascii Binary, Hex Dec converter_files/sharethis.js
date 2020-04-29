var stlib = stlib || {
  functions: [],
  functionCount: 0,
  util: {
    prop: function(p, obj) {
      if (obj) {
        return obj[p];
      }
      return function(o) { return o[p]; };
    }
  },
  dynamicOn: true,
  setPublisher : function(pubKey){
    stlib.publisher = pubKey;
  },
  setProduct : function(prod){
    stlib.product = prod;
  },
  parseQuery: function( query ) {
    var Params = new Object ();
    if ( ! query ) return Params; // return empty object
    var Pairs = query.split(/[;&]/);
    for ( var i = 0; i < Pairs.length; i++ ) {
       var KeyVal = Pairs[i].split('=');
       if ( ! KeyVal || KeyVal.length != 2 ) continue;
       var key = unescape( KeyVal[0] );
       var val = unescape( KeyVal[1] );
       val = val.replace(/\+/g, ' ');
       Params[key] = val;
    }
    return Params;
  },
  getQueryParams : function(){
    var buttonScript = document.getElementById('st_insights_js');
    if(buttonScript && buttonScript.src){
      var queryString = buttonScript.src.replace(/^[^\?]+\??/,'');
      var params = stlib.parseQuery( queryString );
      stlib.setPublisher ( params.publisher);
      stlib.setProduct( params.product);
    }
  }
};

stlib.global = {
  hash: stlib.util.prop('hash', document.location).substr(1)
};

// Extract out parameters
stlib.getQueryParams();
/********************START BROWSER CODE***********************/
stlib.browser = {
	iemode: null,
	firefox: null,
	firefoxVersion: null,
	safari: null,
	chrome: null,
	opera: null,
	windows: null,
	mac: null,
	ieFallback: (/MSIE [6789]/).test(navigator.userAgent),
	//ieFallback: true,
	
	init: function() {
		var ua = navigator.userAgent.toString().toLowerCase();
		
		if (/msie|trident/i.test(ua)) {
	      if (document.documentMode) // IE8 or later
	    	  stlib.browser.iemode = document.documentMode;
		  else{ // IE 5-7
			  stlib.browser.iemode = 5; // Assume quirks mode unless proven otherwise
			  if (document.compatMode){
				  if (document.compatMode == "CSS1Compat")
					  stlib.browser.iemode = 7; // standards mode
		      }
		   }
	      //stlib.browser.iemode = getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i); //IE11+ 
		}
		/*stlib.browser.firefox 	=(navigator.userAgent.indexOf("Firefox") !=-1) ? true : false;
		stlib.browser.firefoxVersion 	=(navigator.userAgent.indexOf("Firefox/5.0") !=-1 || navigator.userAgent.indexOf("Firefox/9.0") !=-1) ? false : true;
		stlib.browser.safari 	=(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1) ? true : false;
		stlib.browser.chrome 	=(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") !=-1) ? true : false;
		stlib.browser.windows 	=(navigator.userAgent.indexOf("Windows") !=-1) ? true : false;
		stlib.browser.mac 		=(navigator.userAgent.indexOf("Macintosh") !=-1) ? true : false;*/
		
		stlib.browser.firefox 	= ((ua.indexOf("firefox") !=-1) && (typeof InstallTrigger !== 'undefined'))?true:false;
	    stlib.browser.firefoxVersion 	=(ua.indexOf("firefox/5.0") !=-1 || ua.indexOf("firefox/9.0") !=-1) ? false : true;
	    stlib.browser.safari 	= (ua.indexOf("safari") !=-1 && ua.indexOf("chrome") ==-1)?true:false;
	    stlib.browser.chrome 	= (ua.indexOf("safari") !=-1 && ua.indexOf("chrome") !=-1)?true:false;
    	stlib.browser.opera 	= (window.opera || ua.indexOf(' opr/') >= 0)?true:false;
		stlib.browser.windows 	=(ua.indexOf("windows") !=-1) ? true : false;
		stlib.browser.mac 		=(ua.indexOf("macintosh") !=-1) ? true : false;
	},

	getIEVersion : function() {
		return stlib.browser.iemode;
	},
	isFirefox : function() {
		return stlib.browser.firefox;
	},
	firefox8Version : function() {
		return stlib.browser.firefoxVersion;
	},
	isSafari : function() {
		return stlib.browser.safari;
	},
	isWindows : function() {
		return stlib.browser.windows;
	},
	isChrome : function() {
		return stlib.browser.chrome;
	},
	isOpera : function() {
		return stlib.browser.opera;
	},
	isMac : function() {
		return stlib.browser.mac;
	},
       isSafariBrowser: function(vendor, ua) {
              // check if browser is safari
              var isSafari = vendor &&
                              vendor.indexOf('Apple Computer, Inc.') > -1 &&
                              ua && !ua.match('CriOS');
              // check if browser is not chrome
              var notChrome = /^((?!chrome|android).)*safari/i.test(ua);
              // check if browser is not firefox
              var notFireFox = /^((?!firefox|linux))/i.test(ua);
              // check if OS is from Apple
              var isApple = (ua.indexOf('Mac OS X') > -1) ||
                             (/iPad|iPhone|iPod/.test(ua) && !window.MSStream);
              // check if OS is windows
              var isWindows = (ua.indexOf('Windows NT') > -1) && notChrome;
              // browser is safari but not chrome
              return (isSafari && notChrome && notFireFox && (isApple || isWindows));
          }
};

stlib.browser.init();
/********************END BROWSER CODE***********************/
/********************START MOBILE BROWSER CODE***********************/

stlib.browser.mobile = {
	mobile:false,
	uagent: null,
	android: null,
	iOs: null,
	silk: null,
	windows: null,
	kindle: null,
	url: null,
	sharCreated: false,
	sharUrl: null,
	isExcerptImplementation: false, //Flag to check if multiple sharethis buttons (Excerpt) have been implemented
	iOsVer: 0, // It will hold iOS version if device is iOS else 0
	
	init: function () {
		this.uagent = navigator.userAgent.toLowerCase();
		if (this.isAndroid()) {
			this.mobile = true;
		}else if (this.isIOs()) {
			this.mobile = true;
		} else if (this.isSilk()) {
			this.mobile = true;
		} else if (this.isWindowsPhone()) {
			this.mobile = true;
		}else if (this.isKindle()) {
			this.mobile = true;
		}
		
		
	},
	
	isMobile: function isMobile() {
		return this.mobile;
	},
	
	isAndroid: function() {
		if (this.android === null) {
			this.android = this.uagent.indexOf("android") > -1;
		}
		return this.android;
	},

	isKindle: function() {
		if (this.kindle === null) {
			this.kindle = this.uagent.indexOf("kindle") > -1;
		}
		return this.kindle;
	},
	
	isIOs: function isIOs() {
		if (this.iOs === null) {
			this.iOs = (this.uagent.indexOf("ipad") > -1) ||
				   (this.uagent.indexOf("ipod") > -1) ||
				   (this.uagent.indexOf("iphone") > -1);
		}
		return this.iOs;
		
	},

	isSilk: function() {
		if (this.silk === null) {
			this.silk = this.uagent.indexOf("silk") > -1;
		}
		return this.silk;
	},

	/**
	 * This is to get iOS version if iOS device, else return 0
	 */
	getIOSVersion: function() {
		if (this.isIOs()) {
			this.iOsVer = this.uagent.substr( (this.uagent.indexOf( 'os ' )) + 3, 5 ).replace( /\_/g, '.' );
		}
		return this.iOsVer;
	},
	
	isWindowsPhone: function() {
		if (this.windows === null) {
			this.windows = this.uagent.indexOf("windows phone") > -1;
		}
		return this.windows;
	}
	
};

stlib.browser.mobile.init();

/********************END MOBILE BROWSER CODE***********************/

/********************START MOBILE BROWSER FRIENDLY CODE***********************/
stlib = stlib || {};
stlib.browser = stlib.browser || {};
stlib.browser.mobile = stlib.browser.mobile || {};

stlib.browser.mobile.handleForMobileFriendly = function(o, options, widgetOpts) {
    if (!this.isMobile()) {
      return false;
    }
    if (typeof(stLight) === 'undefined') {
      stLight = {}
      stLight.publisher = options.publisher;
      stLight.sessionID = options.sessionID;
      stLight.fpc = "";
    }
          var title = (typeof(o.title) !== 'undefined') ? o.title: encodeURIComponent(document.title);
          var url =  (typeof(o.url) !== 'undefined') ? o.url: document.URL;
                //SA-77: introduce new st_short_url parameter
                var shortUrl = (options.short_url != "" && options.short_url != null) ? options.short_url : '';

    if (options.service=="sharethis") {
      var title = (typeof(o.title) !== 'undefined') ? o.title: encodeURIComponent(document.title);
      var url =  (typeof(o.url) !== 'undefined') ? o.url: document.URL;



      var summary = '';
      if(typeof(o.summary)!='undefined' && o.summary!=null){
        summary=o.summary;
      }
      var form = document.createElement("form");
      form.setAttribute("method", "GET");
      form.setAttribute("action", "http://edge.sharethis.com/share4x/mobile.html");
      form.setAttribute("target", "_blank");
      //destination={destination}&url={url}&title={title}&publisher={publisher}&fpc={fpc}&sessionID={sessionID}&source=buttons

      var params={url:url,title:title,summary:summary,destination:options.service,publisher:stLight.publisher,fpc:stLight.fpc,sessionID:stLight.sessionID,short_url:shortUrl};
      if(typeof(o.image)!='undefined' && o.image!=null){
        params.image=o.image;
      }if(typeof(o.summary)!='undefined' && o.summary!=null){
        params.desc=o.summary;
      }if(typeof(widgetOpts)!='undefined' && typeof(widgetOpts.exclusive_services)!='undefined' && widgetOpts.exclusive_services!=null){
        params.exclusive_services=widgetOpts.exclusive_services;
      }if(typeof(options.exclusive_services)!='undefined' && options.exclusive_services!=null){
        params.exclusive_services=options.exclusive_services;
      }if(typeof(widgetOpts)!='undefined' && typeof(widgetOpts.services)!='undefined' && widgetOpts.services!=null){
        params.services=widgetOpts.services;
      }if(typeof(options.services)!='undefined' && options.services!=null){
        params.services=options.services;
      }

      // Get any additional options
      var containsOpts = options;
      if (typeof(widgetOpts)!='undefined') {
        containsOpts = widgetOpts;
      }
      if(typeof(containsOpts.doNotHash)!='undefined' && containsOpts.doNotHash!=null){
        params.doNotHash=containsOpts.doNotHash;
      }
      if(typeof(o.via)!='undefined' && o.via!=null){
        params.via=o.via;
      }

      params.service = options.service;
      params.type = options.type;
      if (stlib.data) {
        var toStoreA = stlib.json.encode(stlib.data.pageInfo);
        var toStoreB = stlib.json.encode(stlib.data.shareInfo);

        if (stlib.browser.isFirefox() && !stlib.browser.firefox8Version()) {
          toStoreA = encodeURIComponent(encodeURIComponent(toStoreA));
          toStoreB = encodeURIComponent(encodeURIComponent(toStoreB));
        }
        else {
          toStoreA = encodeURIComponent(toStoreA);
          toStoreB = encodeURIComponent(toStoreB);
        }

        params.pageInfo = toStoreA;
        params.shareInfo = toStoreB;
      }

      for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
      }
      document.body.appendChild(form);
      form.submit();
      return true;
    }
    if(options.service=='email') {
      var sharInterval, i=0;
      stlib.browser.mobile.url = url;
      if(stlib.browser.mobile.sharUrl == null) {
        stlib.browser.mobile.createSharOnPage();
      }
      var body = (shortUrl != "") ? shortUrl  + "%0A%0a" : "{sharURLValue}" + "%0A%0a";
      if( (typeof(o.summary) != 'undefined') && o.summary!=null){
        body += o.summary + "%0A%0a";
      }
      body += "Sent using ShareThis";
      var mailto = "mailto:?";
      mailto += "subject=" + title;
      mailto += "&body=" +body;

      //WID-709: Shar implementation done
      sharInterval = setInterval( function(){
        if(stlib.browser.mobile.sharUrl != null){
          clearInterval(sharInterval);
          window.location.href=mailto.replace("{sharURLValue}", stlib.browser.mobile.sharUrl);
        }
        if(i > 500) {
          clearInterval(sharInterval);
          window.location.href=mailto.replace("{sharURLValue}", stlib.browser.mobile.sharUrl);
        }
        i++;
      }, 100);
    }
    return true;
  };

stlib.browser.mobile.createSharOnPage = function(){
    if(stlib.browser.mobile.url!=="" && stlib.browser.mobile.url!==" " && stlib.browser.mobile.url!==null && !stlib.browser.mobile.sharCreated)
    {
      var data=["return=json","cb=stlib.browser.mobile.createSharOnPage_onSuccess","service=createSharURL","url="+encodeURIComponent(stlib.browser.mobile.url)];
      data=data.join('&');
      stlib.scriptLoader.loadJavascript("https://ws.sharethis.com/api/getApi.php?"+data, function(){});
    }
};

stlib.browser.mobile.createSharOnPage_onSuccess = function(response){
    if(response.status=="SUCCESS") {
      stlib.browser.mobile.sharCreated = true;
      stlib.browser.mobile.sharUrl = response.data.sharURL;
    } else {
      stlib.browser.mobile.sharUrl = stlib.browser.mobile.url;
    }
};

/********************END MOBILE BROWSER FRIENDLY CODE***********************/

stlib.debugOn = false;
stlib.debug = {
	count: 0,
	messages: [],
	debug: function(message, show) {
		if (show && (typeof console) != "undefined") {
			console.log(message);
		} 
		stlib.debug.messages.push(message);
	},
	show: function(errorOnly) {
		for (message in stlib.debug.messages) {
			if ((typeof console) != "undefined") {
				if (errorOnly) {
					/ERROR/.test(stlib.debug.messages[message]) ? console.log(stlib.debug.messages[message]) : null;
				} else {
					console.log(stlib.debug.messages[message]);
				}
			} 
		}
	},
	showError: function() { 
		stlib.debug.show(true); 
	}
};

var _$d = function(message) {	stlib.debug.debug(message, stlib.debugOn); }
var _$d0 = function() { _$d(" "); };
var _$d_ = function() { _$d("___________________________________________"); };
var _$d1 = function(m) { _$d(_$dt() + "| " + m); };
var _$d2 = function(m) { _$d(_$dt() + "|  * " + m); };
var _$de = function(m) { _$d(_$dt() + "ERROR: " + m); };

var _$dt = function() { 
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	return h+":"+m+":"+s+" > ";
};
/********************START LOGGING***********************/
/*
 * This handles logging
 */
stlib.logger = {
  loggerUrl: "https://l.sharethis.com/",
  l2LoggerUrl: "https://l2.sharethis.com/",
  productArray: new Array(),
  version: '',
  lang: 'en',
  isFpEvent: false,

  constructParamString: function() {
    // Pull all the parameters from the page the widget was on
    var p = stlib.data.pageInfo;
    var paramString = "";
    var param;

    for (param in p) {
      // the following line creates "param=value&"
      paramString += param + "=" + p[param] + "&";
    }

    // Pull all the parameters related to the share
    p = stlib.data.shareInfo;
    for (param in p) {
      paramString += param + "=" + p[param] + "&";
    }
    // add sop parameter
    paramString += "sop=false"
    return paramString
  },
  ibl: function() {
    var blacklist, domain, protocol, hostname, href, i, len;
    href = document.referrer;
    if (href) {
      hostname = stlib.data.hostname(href) || '';
      if (stlib.data.protocol) {
        protocol = stlib.data.protocol(href) || '';
        if (protocol == "android-app:") {
          return true;
        }
      }
      blacklist = ['aol', 'bing', 'bs.to', 'facebook', 'google', 'yahoo', 'yandex', document.location.hostname];
      for (i = 0, len = blacklist.length; i < len; i++) {
        domain = blacklist[i];
        if (hostname.indexOf(domain) > -1) {
          return true;
        }
      }
      var logUrl = stlib.logger.loggerUrl + "log?event=ibl&url=" + href;
      stlib.logger.logByImage("ibl", logUrl, null);
    }
    return true;
  },
  obl: function(e) {
    var href, prefix, ref;
    if ((e != null ? (ref = e.target) != null ? ref.tagName : void 0 : void 0) === 'A') {
      href = e.target.getAttribute('href') || '';
      prefix = href.slice(0, href.indexOf(':'));
      if (href.slice(0, 4) === 'http' && e.target.hostname !== document.location.hostname) {
        var logUrl = stlib.logger.loggerUrl + "log?event=obl&url=" + href;
        stlib.logger.logByImage("obl", logUrl, null);
      }
    }
    return true;
  },
  getGDPRQueryString: function() {
    var gdpr_consent = stlib.data.get("consentData","pageInfo");
    var gdpr_domain = encodeURIComponent(stlib.data.get("consentDomain","pageInfo"));
    var gdpr_query_str = "";
    if(gdpr_consent !== false){
      gdpr_query_str = "&gdpr_consent="+gdpr_consent+"&gdpr_domain="+gdpr_domain;
    }
    return gdpr_query_str;
  },

  loadPixelsAsync: function(res) {
    if (typeof(stlib.product) !== "undefined") {
      if ((stlib.product == "ecommerce") ||
         (stlib.product == "dos2") ||
         (stlib.product == "feather") ||
         (stlib.product == "simple") ||
         (stlib.product == "simpleshare") ||
         (stlib.product == "simple-share-pro")) {
        return;
      }
    }
    if (typeof(res) !== "undefined") {
        if (res.status === "true") {
          // set stid
          stlib.data.set("stid", res.stid, "pageInfo")

          // fire the pixel
          var pxcel_url = "https://t.sharethis.com/1/d/t.dhj?rnd=" +
            (new Date()).getTime() +
            "&cid=c010&dmn="+
            window.location.hostname +
            stlib.logger.getGDPRQueryString();
          var $el = document.createElement('script');
          $el.async = 1;
          $el.src = pxcel_url;
          $el.id = "pxscrpt";
          var first = document.getElementsByTagName('script')[0];
          first.parentNode.insertBefore($el, first);
        }
    }
  },
  logByImage: function(event, logUrl, callback) {
    var mImage = new Image(1, 1);
    mImage.src = logUrl + "&img_pview=true";
    mImage.onload = function () {
      return;
    };
    if (event == "pview") {
      stlib.logger.loadPixelsAsync(undefined);
    } else {
      callback? callback() : null;
    }
  },

  // TODO: (step 1) error checking on data
  // TODO: (step 2) convert params into a generic object, normalize or prepare before logging
  log : function(event, loggingUrl, callback, newEndpoint) {

    if(typeof(stlib.data.get("counter", "shareInfo")) != "undefined") {
      var count = 0;
      if (stlib.data.get("counter", "shareInfo")) {
        count = stlib.data.get("counter", "shareInfo");
      }
      stlib.data.set("ts" + new Date().getTime() + "." + count, "", "shareInfo");
      stlib.data.unset("counter", "shareInfo");
    } else {
      stlib.data.set("ts" + new Date().getTime(), "", "shareInfo");
    }

    if(event == 'widget') {
      var shortenedDestination = "." + stlib.hash.hashDestination(stlib.data.shareInfo.destination);
      stlib.hash.updateDestination(shortenedDestination);
    }

    //Fix for SAB-709
    if ( !loggingUrl || (loggingUrl != stlib.logger.loggerUrl && loggingUrl != stlib.logger.l2LoggerUrl)) {
      loggingUrl = stlib.logger.loggerUrl;
    }

    // Step 3: log data (iterate through objects)
    var logName = null;
    if (newEndpoint) {
      logName = event;
    } else {
      logName = (event == "pview") ? event : ((event == "debug") ? "cns" : "log");
    }
    stlib.data.getEUConsent(function(consent){
      if(event == "pview") {
        var logUrl = loggingUrl + logName + "?event="+event+  "&" + "version="+stlib.logger.version+ "&" + "lang="+stlib.logger.lang + "&" + stlib.logger.constructParamString();
      }else {
        var logUrl = loggingUrl + logName + "?event="+event +  "&" + stlib.logger.constructParamString();
      }
      try {
        var client = new XMLHttpRequest();
        var res;
        client.open("GET", logUrl, true);
        client.withCredentials = true;
        client.timeout = 10000;
        client.onreadystatechange = function () {
          if (this.readyState == this.DONE) {
            try {
              res = JSON.parse(client.responseText);
              if (event == "pview") {
                /*
                // stop firing comscore beacon
                if (typeof (stlib.comscore) != "undefined") {
                  stlib.comscore.load();
                }
                */
                stlib.logger.loadPixelsAsync(res);
              } else {
                callback ? callback(): null;
              }
            } catch (e) {
              // responseText is empty for request timeout
              stlib.logger.logByImage(event, logUrl, callback);
            }
          }
        };
        client.send();
      } catch (err) { // some browsers don't support XMLHttpRequest
        stlib.logger.logByImage(event, logUrl, callback);
      }
    });
  }
};

/********************END LOGGING***********************/
/***************START JSON ENCODE/DECODE***************/
stlib.json = {
	c : {"\b":"b","\t":"t","\n":"n","\f":"f","\r":"r",'"':'"',"\\":"\\","/":"/"},
	d : function(n){return n<10?"0".concat(n):n},
	e : function(c,f,e){e=eval;delete eval;if(typeof eval==="undefined")eval=e;f=eval(""+c);eval=e;return f},
	i : function(e,p,l){return 1*e.substr(p,l)},
	p : ["","000","00","0",""],
	rc : null,
	rd : /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/,
	rs : /(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g,
	rt : /^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/,
	ru : /([\x00-\x07]|\x0b|[\x0e-\x1f])/g,
	s : function(i,d){return "\\".concat(stlib.json.c[d])},
	u : function(i,d){
		var	n=d.charCodeAt(0).toString(16);
		return "\\u".concat(stlib.json.p[n.length],n)
	},
	v : function(k,v){return stlib.json.types[typeof result](result)!==Function&&(v.hasOwnProperty?v.hasOwnProperty(k):v.constructor.prototype[k]!==v[k])},
	types : {
		"boolean":function(){return Boolean},
		"function":function(){return Function},
		"number":function(){return Number},
		"object":function(o){return o instanceof o.constructor?o.constructor:null},
		"string":function(){return String},
		"undefined":function(){return null}
	},
	$$ : function(m){
		function $(c,t) { 
			t=c[m];
			delete c[m];
			try {
				stlib.json.e(c)
			} catch(z){c[m]=t;return 1;}
		};
		return $(Array)&&$(Object);
	},
	encode : function(){
		var	self = arguments.length ? arguments[0] : this,
			result, tmp;
		if(self === null)
			result = "null";
		else if(self !== undefined && (tmp = stlib.json.types[typeof self](self))) {
			switch(tmp){
				case	Array:
					result = [];
					for(var	i = 0, j = 0, k = self.length; j < k; j++) {
						if(self[j] !== undefined && (tmp = stlib.json.encode(self[j])))
							result[i++] = tmp;
					};
					result = "[".concat(result.join(","), "]");
					break;
				case	Boolean:
					result = String(self);
					break;
				case	Date:
					result = '"'.concat(self.getFullYear(), '-', stlib.json.d(self.getMonth() + 1), '-', stlib.json.d(self.getDate()), 'T', stlib.json.d(self.getHours()), ':', stlib.json.d(self.getMinutes()), ':', stlib.json.d(self.getSeconds()), '"');
					break;
				case	Function:
					break;
				case	Number:
					result = isFinite(self) ? String(self) : "null";
					break;
				case	String:
					result = '"'.concat(self.replace(stlib.json.rs, stlib.json.s).replace(stlib.json.ru, stlib.json.u), '"');
					break;
				default:
					var	i = 0, key;
					result = [];
					for(key in self) {
						if(self[key] !== undefined && (tmp = stlib.json.encode(self[key])))
							result[i++] = '"'.concat(key.replace(stlib.json.rs, stlib.json.s).replace(stlib.json.ru, stlib.json.u), '":', tmp);
					};
					result = "{".concat(result.join(","), "}");
					break;
			}
		};
		return result;
	},
	decode : function(input){
		if(typeof(input)=='string')
		{
			var data=null;
			try{if ( /^[\],:{}\s]*$/.test(input.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			 .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")	
			 .replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {
			 	data=window.JSON && window.JSON.parse ? window.JSON.parse(input) : (new Function("return " + input))();
			 	return data;
			 }else{
			 	return null;
			 }}catch(err){}	
		}
	}
};
try{stlib.json.rc=new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')}
catch(z){stlib.json.rc=/^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/}
/***************END JSON ENCODE/DECODE***************/
/********************START COOKIE LIBRARY***********************/
/*
 * This handles cookies
 */
var tpcCookiesEnableCheckingDone = false;
var tpcCookiesEnabledStatus = true;

stlib.cookie = {
	setCookie : function(name, value, days) {
		var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
		var ie =(navigator.userAgent.indexOf("MSIE") !=-1);

		if (safari || ie) {
			  var expiration = (days) ? days*24*60*60 : 0;

			  var _div = document.createElement('div');
			  _div.setAttribute("id", name);
			  _div.setAttribute("type", "hidden");
			  document.body.appendChild(_div);

			  var
			  div = document.getElementById(name),
			  form = document.createElement('form');

			  try {
				  var iframe = document.createElement('<iframe name="'+name+'" ></iframe>');
					//try is ie
				} catch(err) {
					//catch is ff and safari
					iframe = document.createElement('iframe');
				}

			  iframe.name = name;
			  iframe.src = 'javascript:false';
			  iframe.style.display="none";
			  div.appendChild(iframe);

			  form.action = "https://sharethis.com/account/setCookie.php";
			  form.method = 'POST';

			  var hiddenField = document.createElement("input");
			  hiddenField.setAttribute("type", "hidden");
			  hiddenField.setAttribute("name", "name");
			  hiddenField.setAttribute("value", name);
			  form.appendChild(hiddenField);

			  var hiddenField2 = document.createElement("input");
			  hiddenField2.setAttribute("type", "hidden");
			  hiddenField2.setAttribute("name", "value");
			  hiddenField2.setAttribute("value", value);
			  form.appendChild(hiddenField2);

			  var hiddenField3 = document.createElement("input");
			  hiddenField3.setAttribute("type", "hidden");
			  hiddenField3.setAttribute("name", "time");
			  hiddenField3.setAttribute("value", expiration);
			  form.appendChild(hiddenField3);

			  form.target = name;
			  div.appendChild(form);

			  form.submit();
		}
		else {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			} else {
				var expires = "";
			}
			var cookie_string = name + "=" + escape(value) + expires;
			cookie_string += "; domain=" + escape (".sharethis.com")+";path=/";
			document.cookie = cookie_string;
		}
	},
	setTempCookie : function(name, value, days) {
		if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
		} else {
				var expires = "";
		}
		var cookie_string = name + "=" + escape(value) + expires;
		cookie_string += "; domain=" + escape (".sharethis.com")+";path=/";
		document.cookie = cookie_string;
	},
	getCookie : function(cookie_name) {
	  var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
	  if (results) {
		  return (unescape(results[2]));
	  } else {
		  return false;
	  }
	},
	deleteCookie : function(name) {

		// For all browsers
		var path="/";
		var domain=".sharethis.com";
		document.cookie = name.replace(/^\s+|\s+$/g,"") + "=" +( ( path ) ? ";path=" + path : "")
				  + ( ( domain ) ? ";domain=" + domain : "" ) +";expires=Thu, 01-Jan-1970 00:00:01 GMT";


		// For Safari and IE
		var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
		var ie =(navigator.userAgent.indexOf("MSIE") !=-1);

		if (safari || ie) {
			var _div = document.createElement('div');
			_div.setAttribute("id", name);
			_div.setAttribute("type", "hidden");
			document.body.appendChild(_div);

			var
			div = document.getElementById(name),
			form = document.createElement('form');

			try {
			  var iframe = document.createElement('<iframe name="'+name+'" ></iframe>');
				//try is ie
			} catch(err) {
				//catch is ff and safari
				iframe = document.createElement('iframe');
			}

			iframe.name = name;
			iframe.src = 'javascript:false';
			iframe.style.display="none";
			div.appendChild(iframe);

			form.action = "https://sharethis.com/account/deleteCookie.php";
			form.method = 'POST';

			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", "name");
			hiddenField.setAttribute("value", name);
			form.appendChild(hiddenField);

			form.target = name;
			div.appendChild(form);

			form.submit();
		}
	},
	deleteAllSTCookie : function() {
		var a=document.cookie;
		a=a.split(';');
		for(var i=0;i<a.length;i++){
			var b=a[i];
			b=b.split('=');

      // do not delete the st_optout cookie
			if(!/st_optout/.test(b[0])){
				var name=b[0];
				var path="/";
				var domain=".edge.sharethis.com";
				document.cookie = name + "=;path=" + path + ";domain=" + domain +";expires=Thu, 01-Jan-1970 00:00:01 GMT";
			}
		}
	},
	setFpcCookie : function(name, value) {
//		var name="__unam";
		var current_date = new Date;
		var exp_y = current_date.getFullYear();
		var exp_m = current_date.getMonth() + 9;// set cookie for 9 months into future
		var exp_d = current_date.getDate();
		var cookie_string = name + "=" + escape(value);
		if (exp_y) {
			var expires = new Date (exp_y,exp_m,exp_d);
			cookie_string += "; expires=" + expires.toGMTString();
		}
		var domain=stlib.cookie.getDomain();
		cookie_string += "; domain=" + escape (domain)+";path=/";
		document.cookie = cookie_string;
	},
	getFpcCookie : function(cookie_name) {
		var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
		if (results)
			return (unescape(results[2]));
		else
			return false;
	},
	getDomain : function() {
		var str = document.domain.split(/\./);
		var domain="";
		if(str.length>1){
			domain="."+str[str.length-2]+"."+str[str.length-1];
		}
		return domain;
	},
	checkCookiesEnabled: function() {
		if(!tpcCookiesEnableCheckingDone) {
			stlib.cookie.setTempCookie("STPC", "yes", 1);
			if(stlib.cookie.getCookie("STPC") == "yes") {
				tpcCookiesEnabledStatus = true;
			}else {
				tpcCookiesEnabledStatus = false;
			}
			tpcCookiesEnableCheckingDone = true;
			return tpcCookiesEnabledStatus;
		}else{
			return tpcCookiesEnabledStatus;
		}
	},
	hasLocalStorage: function() {
		try {
			localStorage.setItem("stStorage", "yes");
			localStorage.removeItem("stStorage");
			return true;
		} catch(e) {
			return false;
		}
	}
};
/********************END COOKIE LIBRARY***********************/
/*
 * Requires cookie.js
 */
stlib.fpc = {
	cookieName: "__unam",
	cookieValue: "",
	createFpc: function() {
		if(!document.domain || document.domain.search(/\.gov/) > 0){
			return false;
		}
//		var firstPersonCookie = stlib.cookie.getCookie(stlib.fpc.cookieName);
		var firstPersonCookie = stlib.cookie.getFpcCookie(stlib.fpc.cookieName);
		if(firstPersonCookie==false){
			// Create a new cookie
			var bigRan = Math.round(Math.random() * 2147483647);
			bigRan = bigRan.toString(16);

			var time = (new Date()).getTime();
			time = time.toString(16);

			var partialDomain = window.location.hostname.split(/\./)[1];
			if(!partialDomain){
				return false;
			}

			var cookieValue = "";
			cookieValue = stlib.fpc.determineHash(partialDomain) + "-" + time + "-" + bigRan + "-1";

			firstPersonCookie = cookieValue;
		}else{
			// Increment the counter on the cookie by one
			var originalCookie = firstPersonCookie;
			var originalCookieArray = originalCookie.split(/\-/);
			if(originalCookieArray.length == 4){
				var num = Number(originalCookieArray[3]);
				num++;
				firstPersonCookie = originalCookieArray[0] + "-" + originalCookieArray[1] + "-" + originalCookieArray[2] + "-" + num;
			}
		}

//		stlib.cookie.setCookie(stlib.fpc.cookieName, firstPersonCookie, 90);
		stlib.cookie.setFpcCookie(stlib.fpc.cookieName, firstPersonCookie);
		stlib.fpc.cookieValue = firstPersonCookie;
		return firstPersonCookie;
	},

	determineHash: function(partialDomain) {
		var hash = 0;
		var salt = 0;
		for (var i = partialDomain.length - 1; i >= 0; i--) {
			var charCode = parseInt(partialDomain.charCodeAt(i));
			hash = ((hash << 8) & 268435455) + charCode + (charCode << 12);
			if ((salt = hash & 161119850) != 0){
				hash = (hash ^ (salt >> 20));
			}
		}
		return hash.toString(16);
	}
};
stlib.validate = {
	regexes: {
		notEncoded:		/(%[^0-7])|(%[0-7][^0-9a-f])|["{}\[\]\<\>\\\^`\|]/gi,
		tooEncoded:		/%25([0-7][0-9a-f])/gi,
		publisher:		/^(([a-z]{2}(-|\.))|)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
		url:			/^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i,
		fpc:			/^[0-9a-f]{7}-[0-9a-f]{11}-[0-9a-f]{7,8}-[0-9]*$/i,
		sessionID:		/^[0-9]*\.[0-9a-f]*$/i,
		title:			/.*/,
		description:	/.*/,
		buttonType:		/^(chicklet|vcount|hcount|large|custom|button|)$/, // TODO: verify, also, is blank ok.
		comment:		/.*/,
		destination:	/.*/, // TODO: check against all service (construct a regexp?)
		source:			/.*/, // TODO: Need to define this
		image:			/(^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))|^$/i,
		sourceURL:		/^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i,
		sharURL:		/(^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))|^$/i
	}
};

stlib.html = {
	encode : function(value) {
		if(stlib.html.startsWith(value, 'http')) {//URL check
			return String(value)
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');		
		} else {
			return String(value)
				.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
		}
	},
  
	startsWith : function(value, str) {
     return (value.match("^"+str)==str);
    }
};
/*
 * This holds critical data, requires the cookie object
 * Requires fpc.js
 */
if (typeof(stlib.data) == "undefined") {
	stlib.data = {
		bInit: false,
		publisherKeySet: false,
		pageInfo: {
		},
		shareInfo: {
		},
		resetPageData: function() {
			//stlib.data.pageInfo.publisher 		= "00-00-00"; // The publisher key as given by the publisher
			stlib.data.pageInfo.fpc 			= "ERROR"; // The cookie set on the publisher's domain to track the user on that domain
			stlib.data.pageInfo.sessionID 		= "ERROR"; // The session on any given pageview with our widget on it
			//stlib.data.pageInfo.sourceURL		= "ERROR"; // The source domain
			stlib.data.pageInfo.hostname		= "ERROR"; // The source domain
			stlib.data.pageInfo.location		= "ERROR"; // The source domain
			stlib.data.pageInfo.product             = "widget";
			stlib.data.pageInfo.stid            = "";
		},
		resetShareData: function() {
			stlib.data.shareInfo = {};
			stlib.data.shareInfo.url 			= "ERROR"; // The url the service is sharing before any modification
			stlib.data.shareInfo.sharURL		= ""; // The shar url the service is sharing before any modification
			stlib.data.shareInfo.buttonType		= "ERROR"; // The button type that were clicked (hcount or vcount)
			stlib.data.shareInfo.destination	= "ERROR"; // The channel that is being shared to (facebook, twitter)
			stlib.data.shareInfo.source 		= "ERROR"; // The widget or code location that is generating the request
			//stlib.data.shareInfo.title 			= ""; // The title of the article as best as can be determined
			//stlib.data.shareInfo.image 			= ""; // The title of the article as best as can be determined
			//stlib.data.shareInfo.description 	= "";	   // The description of the article as best as can be determined
			//stlib.data.shareInfo.comment	 	= "";	   // The description of the article as best as can be determined
		},
		resetData: function() {
			stlib.data.resetPageData();
			stlib.data.resetShareData();
		},
		validate: function () {
			var regexes = stlib.validate.regexes;

			function validateHelp(key, value) {
				if (value != encodeURIComponent(value)) {
					regexes.notEncoded.test(value) ? _$de(key + " not encoded") : null;
					regexes.tooEncoded.test(value) ? _$de(key + " has too much encoding") :null;
				}
				var valueOk = regexes[key] ? regexes[key].test(decodeURIComponent(value)) : true;
				if (!valueOk) {
					_$de(key + " failed validation");
				}
			}

			var p = stlib.data.pageInfo;
			var param;
			for (param in p) {
				validateHelp(param, p[param])
			}
			p = stlib.data.shareInfo;
			for (param in p) {
				validateHelp(param, p[param])
			}

		},
		init: function() {
			if (!stlib.data.bInit) {
				stlib.data.bInit = true;
				stlib.data.resetData();
				stlib.data.set("fcmp", typeof(window.__cmp) == 'function', "pageInfo");

				if(stlib.publisher){
					stlib.data.setPublisher(stlib.publisher);
				}
				stlib.data.set("product",stlib.product,"pageInfo");
				var rawUrl = document.location.href, refDomain = '', refQuery = '', referArray = [], currentRefer = '', cleanUrl = '', hashString = "",
					baseURL = '', sessionID_time = '', sessionID_rand = '';

				//Fix for WID-343
				referArray = stlib.data.getRefDataFromUrl(rawUrl);//get referrer data coming from share.es
				if(referArray.length > 0) {
					refDomain = (typeof(referArray[0]) != "undefined") ? referArray[0] : "";
					refQuery = (typeof(referArray[1]) != "undefined") ? referArray[1] : "";
					cleanUrl = stlib.data.removeRefDataFromUrl(rawUrl);//Remove referrer data from the URL.

					//Displays the modified(without referrer data parameter) or original URL in the address bar
					stlib.data.showModifiedUrl(cleanUrl);
					stlib.data.set("url", cleanUrl, "shareInfo");
				} else { //For old non-secure shar urls
					currentRefer = document.referrer;
					referArray = currentRefer.replace("http://", "").replace("https://", "").split("/");
					refDomain = referArray.shift();
					refQuery = referArray.join("/");

					stlib.data.set("url", rawUrl,"shareInfo");
				}
				// TODO add option to not use hash tag

        stlib.data.set("title", document.title, "shareInfo");

				if (stlib.data.publisherKeySet != true) {
					stlib.data.set("publisher","ur.00000000-0000-0000-0000-000000000000","pageInfo");
				}

				stlib.fpc.createFpc();
				stlib.data.set("fpc",stlib.fpc.cookieValue,"pageInfo"); // Requires that the cookie has been created

				sessionID_time = (new Date()).getTime().toString();
				sessionID_rand = Number(Math.random().toPrecision(5).toString().substr(2)).toString();
				stlib.data.set("sessionID",sessionID_time + '.' + sessionID_rand,"pageInfo");

				//stlib.data.set("sourceURL", document.location.href,"pageInfo");
				stlib.data.set("hostname", document.location.hostname,"pageInfo");
				stlib.data.set("location", document.location.pathname,"pageInfo");

				stlib.data.set("refDomain", refDomain ,"pageInfo");
				stlib.data.set("refQuery", refQuery,"pageInfo");
			}
		},
		//Fix for WID-343
		showModifiedUrl: function(modUrl) {
			if (window.history && history.replaceState)
				history.replaceState(null, document.title, modUrl);
			else if ((/MSIE/).test(navigator.userAgent)) {
				var ampInHashIndex = 0, hashString = window.location.hash, patt1 = new RegExp("(\&st_refDomain=?)[^\&|]+"),
					patt2 = new RegExp("(\#st_refDomain=?)[^\&|]+"), hRef = document.location.href;
				if(patt1.test(hRef)) {
					ampInHashIndex = hashString.indexOf('&st_refDomain');
					window.location.hash = hashString.substr(0, ampInHashIndex);
				} else if(patt2.test(hRef))
					window.location.replace("#");
			} else {
				document.location.replace(modUrl);
			}
		},
		//Fix for WID-343
		getRefDataFromUrl: function(url) {
			var patt = new RegExp("st_refDomain="), tempDomain = '', tempQuery = '', result = [];

			if(patt.test(url)) {
				tempDomain = url.match(/(st_refDomain=?)[^\&|]+/g);
				result.push(tempDomain[0].split('=')[1]);

				tempQuery = url.match(/(st_refQuery=?)[^\&|]+/g);
				result.push(tempQuery[0].replace('st_refQuery=', ''));
			}

			return result;
		},
		//Fix for WID-343
		removeRefDataFromUrl: function(url) {
			var urlWoRefdomain = '',
				obj = '',
				patt1 = new RegExp("(\&st_refDomain=?)[^\&|]+"),
				patt2 = new RegExp("(\#st_refDomain=?)[^\&|]+");

			if(patt1.test(url)) {
				urlWoRefdomain = url.replace(/\&st_refDomain=(.*)/g,'');
			} else if(patt2.test(url)) {
				urlWoRefdomain = url.replace(/\#st_refDomain=(.*)/g,'');
			} else {
				urlWoRefdomain = url;
			}

			return urlWoRefdomain;
		},
		setPublisher: function(publisherKey) {
			// TODO: Add Validation
			stlib.data.set("publisher",publisherKey,"pageInfo");
			stlib.data.publisherKeySet = true;
		},
		setSource: function(src, options) {
			// TODO: Add Validation
			var source = "";
			// Inside widget logging
			if (options) {
				if (options.toolbar) {
					source = "toolbar"+src;
				} else if (options.page && options.page != "home" && options.page != "") {
					source = "chicklet"+src;
				} else {
					source = "button"+src;
				}
			}
			// Outside widget logging
			else {
				// can be share5x, share4x, chicklet, fastshare, mobile
				source = src;
			}
			stlib.data.set("source",source,"shareInfo");
		},
		set: function(key, value, table) {
			if (typeof(value) == "number" || typeof(value) == "boolean") {
				stlib.data[table][key] = value;
			} else if (typeof(value) == "undefined" || value == null) {
			} else {
//				_$d1("Stripping HTML: " + key + ": " + value.replace(/<[^<>]*>/gi, " "));
//				_$d1("decodeURI: " + key + ": " + decodeURI(value.replace(/<[^<>]*>/gi, " ")));
//				_$d1("Escape percent: " + key + ": " + decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25"));
//				_$d1("Decoding: " + key + ": " + decodeURIComponent(decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
//				_$d1("Encoding: " + key + ": " + encodeURIComponent(decodeURIComponent(decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25"))));
				stlib.data[table][key] = encodeURIComponent(decodeURIComponent(unescape(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
				// These might have url encoded data
				if (key=="url" /*|| key=="sourceURL"*/ || key=="location" || key=="image") {
					try {
						stlib.data[table][key] = encodeURIComponent(decodeURIComponent(decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
					} catch (e) {
						stlib.data[table][key] = encodeURIComponent(decodeURIComponent(unescape(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
					}
				}
			}
		},
		get: function(key, table) {
			try {
				if (stlib.data[table] && stlib.data[table][key])
					return decodeURIComponent(stlib.data[table][key]);
				else
					return false;
			}catch(e){
				return false
			}
		},
		unset: function(key, table) {
			if (stlib.data[table] && typeof(stlib.data[table][key])!="undefined")
				delete stlib.data[table][key];
		},
                bindEvent: function(element, eventName, eventHandler) {
                    if (element.addEventListener) {
                        element.addEventListener(eventName, eventHandler, false);
                    } else if (element.attachEvent) {
                        element.attachEvent('on' + eventName, eventHandler);
                    }
                },
                debug: function(endpoint, event) {
                  stlib.data.init();
                  var a = stlib.data.pageInfo;
                  var c = "";
                  var b;
                  for (b in a) {
                      c += b + "=" + a[b] + "&"
                  }
                  c = c.substring(0, c.length - 1);

                  var loggerUrl = "https://l.sharethis.com/";
                  loggerUrl += endpoint;
                  loggerUrl += "?event=" + event;
                  loggerUrl += "&" + c;

                  var e = new Image(1, 1);
                  e.src = loggerUrl;
                  e.onload = function() {
                      return
                  };
                },
                hostname: function(url) {
                  var a;
                  if (url == null) {
                    url = st.href;
                  }
                  a = document.createElement('a');
                  a.setAttribute('href', url);
                  return a.hostname;
                },
                protocol: function(url) {
                  var a;
                  if (url == null) {
                    url = st.href;
                  }
                  a = document.createElement('a');
                  a.setAttribute('href', url);
                  return a.protocol;
                },
                parseCookie: function(name, cookie) {
                    cookie = "; " + cookie
                    var parts = cookie.split("; "+name+"=");
                    if(parts.length === 2) {
                        return parts.pop().split(';').shift();
                    }else {
                        return null;
                    }
                },
                setConsent: function(consent) {
                    for(var consent_key in consent) {
                         stlib.data.set(consent_key,consent[consent_key],"pageInfo");
                    }
                },
                getEUConsent: function(c) {
                    var is_done = false;
                    var done = function() {
                      if (!is_done) { c(); }
                      is_done = true;
                    }

                    // set a timeout in case gdpr service is too slow or unavailable
                    setTimeout(done, 3000);

                    var euconsent = stlib.data.parseCookie("euconsent", document.cookie);
                    if(euconsent !== null) {
                           stlib.data.setConsent({
                             consentData: euconsent,
                             consentDomain: document.location.hostname
                           });
                           c();
                           done();
                    } else {
                      var iframe = document.createElement('iframe');
                      var iframeSource = "https://c.sharethis.mgr.consensu.org/portal-v2.html";
                      iframe.setAttribute('src', iframeSource);
                      iframe.setAttribute('id', 'st_gdpr_iframe');
                      iframe.setAttribute('title', 'GDPR Consent Management');
                      iframe.style.width = '0px';
                      iframe.style.height = '0px';
                      iframe.style.position = 'absolute';
                      iframe.style.left = '-5000px';
                      var readyStateCheckInterval = setInterval(function() {
                        if (document.body != null) {
                          clearInterval(readyStateCheckInterval);
                          document.body.appendChild(iframe);
                        }
                      }, 10);
                      stlib.data.bindEvent(window, 'message', function (e) {
                        if (e.origin == "https://c.sharethis.mgr.consensu.org") {
                          var command = e.data && e.data.command;
                          var result = e.data;
                          var supports_samesite = e.data && e.data.supports_samesite;
                          if (command == "isLoaded") {
                            iframe.contentWindow.postMessage({ command: 'readAllCookies' }, "*");
                          }
                          if (command == 'readAllCookies') {
                            stlib.data.setConsent({
                              bsamesite: supports_samesite,
                              consentData: result.v1,
                              consentDomain: '.consensu.org',
                              gdpr_consent: result.v2 || result.v1,
                              gdpr_consent_v1: result.v1,
                              gdpr_domain: '.consensu.org',
                              gdpr_domain_v1: '.consensu.org'
                            });
                            done();
                          }
                        }
                      });
                    }
               }

	};

	stlib.data.resetData();
}
stlib.hash = {
	doNotHash: false,
	hashAddressBar: false,
	doNotCopy: false,
	prefix:"sthash",
	shareHash: "",
	incomingHash: "",
	validChars: ["1","2","3","4","5","6","7","8","9","0",
				"A","B","C","D","E","F","G","H","I","J",
				"K","L","M","N","O","P","Q","R","S","T",
				"U","V","W","X","Y","Z","a","b","c","d",
				"e","f","g","h","i","j","k","l","m","n",
				"o","p","q","r","s","t","u","v","w","x",
				"y","z"],
	servicePreferences: {
		linkedin: "param",
		stumbleupon: "param",
		bebo: "param"
	},
	hashDestination: function(destination) {
		if (destination == "copy") {return "dpuf";}
		var condensedString = destination.substring(0,2) + destination.substring(destination.length-2, destination.length);
		var increment = function(string, pos) {
			if(string.charCodeAt(pos) == 122) {
				return "a";
			}
			return String.fromCharCode(string.charCodeAt(pos) + 1);
		}
		return increment(condensedString, 0) + increment(condensedString, 1) + increment(condensedString, 2) + increment(condensedString, 3);
	},
	getHash: function() {
		var sthashFound = false;
		var sthashValue = "";
		var urlWithoutHash = document.location.href;
		urlWithoutHash = urlWithoutHash.split("#").shift();
		var paramArray = urlWithoutHash.split("?");
		if (paramArray.length > 1) {
			paramArray = paramArray[1].split("&");
			for (arg in paramArray) {
				try {
					if (paramArray[arg].substring(0, 6) == "sthash") {
						sthashFound = true;
						sthashValue = paramArray[arg];
					}
				} catch (err) {

				}
			}
			if (sthashFound) {
				return sthashValue;
			} else {
				return document.location.hash.substring(1);
			}
		} else {
			return document.location.hash.substring(1);
		}
	},
	stripHash: function(url) {
		var urlWithoutHash = url;
		urlWithoutHash = urlWithoutHash.split("#");
		if (urlWithoutHash.length > 1)
			return urlWithoutHash[1];
		else
			return "";
	},
	clearHash: function() {
		if (stlib.hash.validateHash(document.location.hash)) {
			var baseHref = document.location.href.split("#").shift();

			if (window.history && history.replaceState)
//				history.replaceState(null, "ShareThis", "#");
				history.replaceState(null, document.title, baseHref);
			else if ((/MSIE/).test(navigator.userAgent))
				window.location.replace("#");
			else
				document.location.hash = "";
		}
	},
	init: function() {
		var finalHash = "";
		var max = stlib.hash.validChars.length;
		for (var i=0;i<8;i++) {
			finalHash += stlib.hash.validChars[Math.random()*max|0];
		}
		if (stlib.hash.getHash() == "") {
			stlib.hash.shareHash = stlib.hash.prefix + "." + finalHash;
		} else {
			var splitHash = stlib.hash.getHash().split(".");
			var key = splitHash.shift();
			if (key == stlib.hash.prefix || key == stlib.hash.prefix) {
				stlib.hash.incomingHash = stlib.hash.getHash();
				stlib.hash.shareHash = stlib.hash.prefix + "." + splitHash.shift() + "." + finalHash;
			} else {
				stlib.hash.shareHash = stlib.hash.prefix + "." + finalHash;
			}
		}
		if (!stlib.hash.doNotHash && stlib.hash.hashAddressBar) {
			if (document.location.hash == "" || stlib.hash.validateHash(document.location.hash)) {
				if (window.history && history.replaceState)
					history.replaceState(null, "ShareThis", "#"+stlib.hash.shareHash + ".dpbs");
				else if ((/MSIE/).test(navigator.userAgent))
					window.location.replace("#"+stlib.hash.shareHash + ".dpbs");
				else
					document.location.hash = stlib.hash.shareHash + ".dpbs";
			}
		} else {
			stlib.hash.clearHash();
		}
		if (!stlib.hash.doNotHash && !stlib.hash.doNotCopy) {
			stlib.hash.copyPasteInit();
		}
		stlib.hash.copyPasteLog();
	},
	checkURL: function() {
		var destination = stlib.data.get("destination", "shareInfo");
		var baseURL = stlib.hash.updateParams(destination);
		var shortenedDestination = "." + stlib.hash.hashDestination(destination);
		stlib.hash.updateDestination(shortenedDestination);
		if (!stlib.hash.doNotHash && typeof(stlib.data.pageInfo.shareHash) != "undefined") {
			var url = stlib.data.get("url", "shareInfo");
			var hash = stlib.hash.stripHash(url);
			if (stlib.hash.validateHash(hash) || hash == "") {
				if(typeof(stlib.hash.servicePreferences[destination]) != "undefined") {
					if(stlib.hash.servicePreferences[destination] == "param") {
						_$d1("Don't use hash, use params");
						_$d2(baseURL);
						if (baseURL.split("?").length > 1) {
							var parameterArray = baseURL.split("?")[1].split("&")
							var sthashExists = false;
							//for (arg in parameterArray) {
							for (var arg = 0; arg < parameterArray.length; arg++) {
								if (parameterArray[arg].split(".")[0] == "sthash") {
									sthashExists = true;
								}
							}
							if (sthashExists) {
								// Param was fixed by updateParams, dont need to add anything
								stlib.data.set("url",baseURL, "shareInfo");
							} else {
								// Param wasn't there, need to add it.
								stlib.data.set("url",baseURL + "&" + stlib.data.pageInfo.shareHash, "shareInfo");
							}
						} else {
							// There are no params, need to add the hash param
							stlib.data.set("url",baseURL + "?" + stlib.data.pageInfo.shareHash, "shareInfo");
						}
						if (destination == "linkedin") {	// shar url contains # which is an error in LinkedIn
							if (stlib.data.get("sharURL", "shareInfo") != "") {
								stlib.data.set("sharURL", stlib.data.get("url", "shareInfo"), "shareInfo");
							}
						}
					} else {
						_$d1("Using Hash");
						stlib.data.set("url",baseURL + "#" + stlib.data.pageInfo.shareHash, "shareInfo");
					}
				} else {
					_$d1("Not using custom destination hash type");
					stlib.data.set("url",baseURL + "#" + stlib.data.pageInfo.shareHash, "shareInfo");
				}
			}
		}
	},
	updateParams: function(destination) {
		var baseURL = stlib.data.get("url", "shareInfo").split("#").shift();
		var regex2a = /(\?)sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}/;
		var regex2b = /(&)sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}/;
		var regex1a = /(\?)sthash\.[a-zA-z0-9]{8}/;
		var regex1b = /(&)sthash\.[a-zA-z0-9]{8}/;
		if (regex2a.test(baseURL)) {
			baseURL = baseURL.replace(regex2a, "?" + stlib.data.pageInfo.shareHash);
		} else if (regex2b.test(baseURL)) {
			baseURL = baseURL.replace(regex2b, "&" + stlib.data.pageInfo.shareHash);
		} else if (regex1a.test(baseURL)) {
			baseURL = baseURL.replace(regex1a, "?" + stlib.data.pageInfo.shareHash);
		} else if (regex1b.test(baseURL)) {
			baseURL = baseURL.replace(regex1b, "&" + stlib.data.pageInfo.shareHash);
		}
		return baseURL;
	},
	updateDestination: function(destinationHash) {
		var regex2 = /sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}\.[a-z]{4}/;
		var regex1 = /sthash\.[a-zA-z0-9]{8}\.[a-z]{4}/;
		_$d_();
		_$d1("Updating Destination");
		if (regex2.test(stlib.data.pageInfo.shareHash)) {
			_$d2(stlib.data.pageInfo.shareHash.substring(0,24));
			stlib.data.pageInfo.shareHash = stlib.data.pageInfo.shareHash.substring(0,24) + destinationHash;
		} else if (regex1.test(stlib.data.pageInfo.shareHash)) {
			_$d2(stlib.data.pageInfo.shareHash.substring(0,15));
			stlib.data.pageInfo.shareHash = stlib.data.pageInfo.shareHash.substring(0,15) + destinationHash;
		} else {
			stlib.data.pageInfo.shareHash += destinationHash;
		}
	},
	validateHash: function(isValidHash) {
		var regex3 = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}$/;
		var regex2 = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}\.[a-z]{4}$/;
		var regex1 = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-z]{4}$/;
		var regex0 = /[\?#&]?sthash\.[a-zA-z0-9]{8}$/;
		return regex0.test(isValidHash) || regex1.test(isValidHash) || regex2.test(isValidHash) || regex3.test(isValidHash);
	},
	appendHash : function (url) {
		var hash = stlib.hash.stripHash(url);
		if (stlib.data.pageInfo.shareHash && (stlib.hash.validateHash(hash) || hash == "")) {
			url = url.replace("#"+hash,"") + "#" + stlib.data.pageInfo.shareHash;
		} else {
		}
		return url;
	},
	copyPasteInit: function() {
		var body = document.getElementsByTagName("body")[0];
		var replacement = document.createElement("div");
		replacement.id = "stcpDiv";
		replacement.style.position = "absolute";
		replacement.style.top = "-1999px";
		replacement.style.left = "-1988px";
		body.appendChild(replacement);
		replacement.innerHTML = "ShareThis Copy and Paste";
		var baseHref = document.location.href.split("#").shift();
		var hash = "#" + stlib.hash.shareHash;
		if (document.addEventListener) {
			body["addEventListener"]("copy",function(e){
				//TYNT CONFLICT FIX: do not copy if Tynt object exists
				if (typeof(Tynt)!="undefined"){
//					console.log("Tynt exists. Don't copy");
					return;
				}
//				console.log("Tynt doesn't exist. Proceed");

				//grab current range and append url to it
				var selection = document.getSelection();

				if (selection.isCollapsed) {
					return;
				}

				var markUp = selection.getRangeAt(0).cloneContents();
				replacement.innerHTML = "";
				replacement.appendChild(markUp);

				if (replacement.textContent.trim().length==0) {
				    return;
				}

				if((selection+"").trim().length==0) {
					//No text, don't need to do anything
				} else if (replacement.innerHTML == (selection+"") || replacement.textContent == (selection+"")) {
					//Fix for CNS FB:12969. Encode html data to avoid js script execution on content copy
					replacement.innerHTML = stlib.html.encode(stlib.hash.selectionModify(selection));
				} else {
					//Fix for CNS FB:12969. Encode html data to avoid js script execution on content copy
					replacement.innerHTML += stlib.html.encode(stlib.hash.selectionModify(selection, true));
				}
				var range = document.createRange();
				range.selectNodeContents(replacement);
				var oldRange = selection.getRangeAt(0);
			},false);
		} else if (document.attachEvent) {
			/*
			body.oncopy = function() {
				var oldRange = document.selection.createRange();
				replacement.innerHTML = oldRange.htmlText;
				try {
					var length = (oldRange.text).trim().length;
				} catch (e) {
					var length = (oldRange.text).replace(/^\s+|\s+$/g, '').length;
				}
				if(length==0) {
					//No text, don't need to do anything
				} else if (oldRange.htmlText == oldRange.text) {
					//Just text, treat normally
					replacement.innerHTML = stlib.hash.selectionModify(oldRange.text);
				} else {
					//Text and markup, special case
					replacement.innerHTML += stlib.hash.selectionModify(oldRange.text, true);
				}
				var range = document.body.createTextRange();
				range.moveToElementText(replacement);
				range.select();
				setTimeout(function() {oldRange.select();}, 1);
			};
			*/
		}
	},
	copyPasteLog: function() {
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var messageEvent1 = eventMethod == "attachEvent" ? "oncopy" : "copy";
		var body = document.getElementsByTagName("body")[0];
		if(body){
			body[eventMethod](messageEvent1,function(e){
				var pass = true;
				stlib.data.resetShareData();
				stlib.data.set("url", document.location.href, "shareInfo");
				stlib.data.setSource("copy");
				stlib.data.set("destination", "copy", "shareInfo");
		    	stlib.data.set("buttonType", "custom", "shareInfo");

				if (typeof(Tynt)!="undefined"){
					// Log Tynt
					stlib.data.set("result", "tynt", "shareInfo");
					pass = false;
				}
				if (typeof(addthis_config)!="undefined") {
					// Log AddThis
					stlib.data.set("result", "addThis", "shareInfo");
					if (typeof(addthis_config.data_track_textcopy)=="undefined"||addthis_config.data_track_textcopy) {
						stlib.data.set("enabled", "true", "shareInfo");
						pass = false;
					} else {
						stlib.data.set("enabled", "false", "shareInfo");
					}
				}
			},false);
		}
	},
	logCopy: function(url, selection) {
		stlib.data.resetShareData();
	    stlib.data.set("url", url, "shareInfo");
	    stlib.data.setSource("copy");
    	stlib.data.set("destination", "copy", "shareInfo");
    	stlib.data.set("buttonType", "custom", "shareInfo");
    	if (selection)
    		stlib.data.set("copy_text", selection, "shareInfo");
    	stlib.sharer.share();
	},
	selectionModify: function(selection, anchorOnly) {
		selection = "" + selection;
		_$d_();
		_$d1("Copy Paste");
		var regex = /^((http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))/i;
		var regex2 = /^([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i;
		var regexPhoneNumberUS = /^\+?1?[\.\-\\)_\s]?[\\(]?[0-9]{3}[\.\-\\)_\s]?[0-9]{3}[\.\-_\s]?[0-9]{4}$|^[0-9]{3}[\.\-_\s]?[0-9]{4}$/;
		var regexPhoneNumberIndia = /^[0-9]{3}[\.\-_\s]?[0-9]{8}$/;
		var regexPhoneNumberBrazil = /^[0-9]{2}[\.\-_\s]?[0-9]{4}[\.\-_\s]?[0-9]{4}$/;
		var regexEmail = /[\-_\.a-z0-9]+@[\-_\.a-z0-9]+\.[\-_\.a-z0-9]+/i;
		var regex3 = /[\s@]/;
		var baseHref = document.location.href.split("#").shift();
		var hash = "#" + stlib.hash.shareHash;
		var anchorStr = "";
		var urlStr = "";
		var returnStr = selection;
		if (typeof(anchorOnly) == "undefined" && ((regex.test(selection) || regex2.test(selection)) && !regex3.test(selection.trim()))) { // the selection is a url
			_$d2("is Url");
			if (selection.match(/#/) == null || stlib.hash.validateHash(selection)) {
				urlStr = selection.split("#")[0] + hash + ".dpuf";
			} else {
				urlStr = selection;
			}
		} else {
			_$d2("is Not Url");
			if (document.location.hash == "" || (/^#$/).test(document.location.hash) || stlib.hash.validateHash(document.location.hash)) {
				urlStr = baseHref + hash + ".dpuf";
			} else {
				urlStr = document.location.href;
			}
			returnStr = selection;
			if (selection.length > 50) {
				if (!regexPhoneNumberUS.test(selection) && !regexPhoneNumberIndia.test(selection) && !regexPhoneNumberBrazil.test(selection) && !regexEmail.test(selection)) {		// don't add if an email or phone number
					returnStr += anchorStr;
				}
			}
		}
		if (selection.length > 500) {
			selection = selection.substring(0, 497) + "...";
		}
		stlib.hash.logCopy(urlStr, selection);
		return returnStr;
	}
};

/********************START MESSAGE QUEUE***********************/

stlib.messageQueue = function () {
	var that = this;
	this.pumpInstance = null;
	this.queue = [];
	this.dependencies = ["data"]; // This holds a sorted array of dependency tags, [0] should be loaded before [1].
	this.sending = true;
	this.setPumpInstance = function(pumpInstance){
		this.pumpInstance = pumpInstance;
	};
	this.send = function(message, tag){
		// Send debug message
		if ((typeof(message) == "string") && (typeof(tag) == "string")) { 
			_$d_();
			_$d1("Queueing message: " + tag + ": " + message);
		}
		// Queue the message
		(typeof(message) == "string") && (typeof(tag) == "string") ? this.queue.push([tag, message]) : null;
		
		if (this.sending == false || stlib.browser.ieFallback) { // Don't process the queue if it's currently processing
			if (this.pumpInstance != null) { // If the pumpInstance is valid
				if (this.dependencies.length > 0) { // If there are current dependencies
					for (messageSet in this.queue) { // Look for the dependency and send it.  If not found, don't send anything.
						if (this.queue.hasOwnProperty(messageSet) && this.queue[messageSet][0] == this.dependencies[0]) {
							if(this.queue.length > 0) {
								_$d1("Current Queue Length: " + this.queue.length);
								var m = this.queue.shift();
								this.pumpInstance.broadcastSendMessage(m[1]);
								this.dependencies.shift();
								this.sending = true;
							}
						} 
					}
				} else { // If there are no dependencies, just send the first message
					if (this.queue.length > 0) {
						_$d1("Current Queue Length: " + this.queue.length);
						var m = this.queue.shift();
						this.pumpInstance.broadcastSendMessage(m[1]);
						this.sending = true;
					}
				}
			} else {
				_$d_();
				_$d1("Pump is null");
			}
		}
		if ((stlib.browser.ieFallback) && (this.queue.length > 0)) {
			var processName = "process" + stlib.functionCount;
			stlib.functionCount++;
			stlib.functions[processName] = that.process;
			setTimeout("stlib.functions['" + processName + "']()", 500);
		}
	};
	this.process = function() {
		_$d1("Processing MessageQueue");
		that.sending = false;
		_$d(this.queue);
		that.send();
	};
};
/********************END MESSAGE QUEUE***********************/
/* Requires browser obj */
stlib.pump = function (destination, source, callback) {
	var that = this;
	this.isIframeReady = false;
	this.isIframeSending = false;
	
	this.getHash = function(url) {
		var mArray = url.split("#");
		mArray.shift();
		return mArray.join("#");
	}
	
	this.broadcastInit = function(destination) {
		this.destination = destination;
		_$d_('---------------------');
		_$d1("Initiating broadcaster:");
		_$d(this.destination);
	};
	this.broadcastSendMessage = function(message) {
		_$d_('---------------------');
		_$d1("Initiating Send:");
		if (this.destination === window) { // Iframe sends an event to the parent window
			if (stlib.browser.ieFallback) {
				//window.location.hash = message;
				window.location.replace(window.location.href.split("#")[0] + "#" + message);
				_$d2("child can't communicate with parent");
				return;
			}
			_$d2("Iframe to publisher: " + message);
			parent.postMessage("#" + message, document.referrer);
		} else { // The parent window sends an event to the iframe
			_$d2("Publisher to Iframe: " + message);
			if (stlib.browser.ieFallback) {
				if (this.destination.contentWindow) {
					this.destination.contentWindow.location.replace(this.destination.src + "#" + message);
					this.isIframeSending = true;
				}
				return;
			}
			this.destination.contentWindow.postMessage("#" + message, this.destination.src);
		}
	};
	this.receiverInit = function(source, callback) {
		_$d_('---------------------');
		_$d1("Initiating Receiver:");
		_$d(source);
		if (stlib.browser.ieFallback) {
			this.callback = callback;
			this.source = source;
			if (source === window) { // The iframe polls the hash value for any changes
				//window.location.hash = "";
				window.location.replace(window.location.href.split("#")[0] + "#");
				this.currentIframe = window.location.hash;
				
				var receiverName = "receiver" + stlib.functionCount;
				stlib.functions[receiverName] = function (callback) {
					if ("" != window.location.hash && "#" != window.location.hash) {
						var hash = window.location.hash;
						callback(hash);
						//window.location.hash = "";
						window.location.replace(window.location.href.split("#")[0] + "#");
					}
				};
				stlib.functionCount++;
				var callbackName = "callback" + stlib.functionCount;
				stlib.functions[callbackName] = callback;
				stlib.functionCount++;
				setInterval("stlib.functions['" + receiverName + "'](stlib.functions['" + callbackName + "'])", 200);
				
			} else { // The parent polls the iframe 
			/*
				var receiverName = "receiver" + stlib.functionCount;
				that.oldHash = that.getHash(source.src);
				stlib.functions[receiverName] = function (callback) {
					_$d1("ShareThis Publisher is polling: " + that.oldHash + ": " + (source.src));
					if (that.oldHash != that.getHash(source.src)) {
						that.oldHash = that.getHash(source.src);
						callback(hash);
					}
				};
				stlib.functionCount++;
				var callbackName = "callback" + stlib.functionCount;
				stlib.functions[callbackName] = callback;
				stlib.functionCount++;
				setInterval("stlib.functions['" + receiverName + "'](stlib.functions['" + callbackName + "'])", 200);
			*/
			}
			var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
			// Listen to message from child window
			window[eventMethod](messageEvent,function(e) {
				if (source == window) {
				} else {
					if (e.origin.indexOf("sharethis.com") != -1) {
						if (e.data.match(/#Pinterest Click/))
							stlib.sharer.sharePinterest();
						if (e.data.match(/#Print Click/))
							stlib.sharer.stPrint();
					}
				}
			},false);
			return;
		}
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
		// Listen to message from child window
		window[eventMethod](messageEvent,function(e) {
			if (source == window) {
				_$d1("arrived in iframe from:");
				_$d(e.origin);
				if (e.data.match(/#fragmentPump/) || e.data.match(/#Buttons Ready/) || e.data.match(/#Widget Ready/) || e.data.indexOf("#light")==0 || e.data.indexOf("#widget")==0 || e.data.indexOf("#popup")==0 || e.data.indexOf("#show")==0 || e.data.indexOf("#init")==0 || e.data.indexOf("#test")==0 || e.data.indexOf("#data")==0)			// Make sure data is our own
					callback(e.data);				
			} else {
				if (e.origin.indexOf("sharethis.com") != -1) {
					_$d1("arrived in parent from:");
					_$d(e.origin);
					if (e.data.match(/#fragmentPump/) || e.data.match(/#Buttons Ready/) || e.data.match(/#Widget Ready/) || e.data.indexOf("#light")==0 || e.data.indexOf("#widget")==0 || e.data.indexOf("#popup")==0 || e.data.indexOf("#show")==0 || e.data.indexOf("#init")==0 || e.data.indexOf("#test")==0 || e.data.indexOf("#data")==0)			// Make sure data is our own
						callback(e.data);
					else if (e.data.match(/#Pinterest Click/))
						stlib.sharer.sharePinterest();
					else if (e.data.match(/#Print Click/))
						stlib.sharer.stPrint();
				} else {
					_$d1("discarded event from:");
					_$d(e.origin);
				}
			}
		},false);			
	};
	
	this.broadcastInit(destination);
	this.receiverInit(source, callback);
};
/*
 * This handles direct post sharing
 */
stlib.sharer = {
	sharerUrl: "https://ws.sharethis.com/api/sharer.php",
	regAuto : new RegExp(/(.*?)_auto$/), //regexp to detect auto events
	constructParamString: function() {
		// Validate the data
		stlib.data.validate();
//		if (!stlib.hash.doNotHash) {
    //			stlib.hash.checkURL();
//		}
		// Pull all the parameters from the page the widget was on
		var p = stlib.data.pageInfo;
		var paramString = "?";
		var param;
		for (param in p) {
			// the following line creates "param=value&"
			paramString += param + "=" + encodeURIComponent(p[param]) + "&";
			_$d1("constructParamStringPageInfo: " + param + ": " + p[param]);
		}
		// Pull all the parameters related to the share
		p = stlib.data.shareInfo;
		for (param in p) {

			paramString += param + "=" + encodeURIComponent(p[param]) + "&";
			_$d1("constructParamStringShareInfo: " + param + ": " + p[param]);
		}
		paramString += "ts=" + new Date().getTime() + "&";

		return paramString.substring(0, paramString.length-1);
	},
	stPrint : function() {
		window.print();
	},
	incrementShare : function() {
					var currentRefer = document.referrer;
					var referArray = currentRefer.replace("http://", "").replace("https://", "").split("/");
					var refD = referArray.shift();
					if ( refD == "www.mangatown.com" || refD == "imobiliariacasa.com.br") {
						return;
					}
          var url = stlib.data.get("url", "shareInfo");
          var dest = stlib.data.get("destination", "shareInfo");
          var proto = "https://";
          var cs_ep = "count-server.sharethis.com/increment_shares?countType=share&output=false";
          // remove #sthash
          url = url.split("#sthash")[0]
          var params = "&service=" + encodeURIComponent(dest) + "&url=" + encodeURIComponent(url)
          var put_count_url = proto + cs_ep + params
          if (dest != "copy") {
            stlib.scriptLoader.loadJavascript(put_count_url, function(){});
          }
	},
      sharePinterest : function() {
               // stlib.sharer.incrementShare();
		if (stlib.data.get("image", "shareInfo") == false || stlib.data.get("image", "shareInfo") == null || stlib.data.get("pinterest_native", "shareInfo") == "true"){
			if (typeof(stWidget)!="undefined" && typeof(stWidget.closeWidget) === "function")
				stWidget.closeWidget();
			if (typeof(stcloseWidget) === "function")
				stcloseWidget();
			if (typeof(stToolbar) !="undefined" && typeof(stToolbar.closeWidget) === "function")
				stToolbar.closeWidget();
			var e = document.createElement('script');
		    e.setAttribute('type', 'text/javascript');
		    e.setAttribute('charset', 'UTF-8');
		    e.setAttribute('src', '//assets.pinterest.com/js/pinmarklet.js?r='+Math.random() * 99999999);
		    document.body.appendChild(e);
		}
	},
	share: function(callback, popup) {
		var paramString = stlib.sharer.constructParamString();
		_$d_();
		_$d1("Initiating a Share with the following url:");
		_$d2(stlib.sharer.sharerUrl + paramString);
               // stlib.sharer.incrementShare();

		// Pass sharer.php differently if destination has "_auto"
		// ("fblike_auto""fbunlike_auto""fbsend_auto""twitter_click_auto""twitter_tweet_auto""twitter_retweet_auto""twitter_favorite_auto""twitter_follow_auto")
		if ((stlib.data.get("destination", "shareInfo") == "print") || (stlib.data.get("destination", "shareInfo") == "email") || (stlib.data.get("destination", "shareInfo") == "pinterest" && stlib.data.get("source", "shareInfo").match(/share4xmobile/) == null && stlib.data.get("source", "shareInfo").match(/share4xpage/) == null && stlib.data.get("source", "shareInfo").match(/5xpage/) == null && (stlib.data.get("image", "shareInfo") == false || stlib.data.get("image", "shareInfo") == null))|| stlib.data.get("destination", "shareInfo") == "snapsets" || stlib.data.get("destination", "shareInfo") == "copy" || stlib.data.get("destination", "shareInfo") == "plusone" || stlib.data.get("destination", "shareInfo").match(stlib.sharer.regAuto) || (typeof(stlib.nativeButtons) != "undefined" && stlib.nativeButtons.checkNativeButtonSupport(stlib.data.get("destination", "shareInfo")))||(stlib.data.get("pinterest_native", "shareInfo") != false && stlib.data.get("pinterest_native", "shareInfo") != null)){
		   	var mImage = new Image(1,1);
			mImage.src = stlib.sharer.sharerUrl + paramString;
			mImage.onload = function(){return;};
		} else {
			if (typeof(popup)!="undefined"&&popup==true)		// <-- force popup here
				window.open(stlib.sharer.sharerUrl + paramString, (new Date()).valueOf(), "scrollbars=1, status=1, height=480, width=640, resizable=1");
			else
				window.open(stlib.sharer.sharerUrl + paramString);
		}

		callback ? callback() : null;
	}
};
stlib.logger.version = 'sharethis.js'
// set product and property for new buttons
if (window.__sharethis__) {
  stlib.setProduct(window.__sharethis__.product);
  stlib.setPublisher(window.__sharethis__.property);
}
var sop_pview_logged = typeof __stdos__ !== 'undefined' && __stdos__ !== null && __stdos__.onscriptload;
if (!sop_pview_logged && !stlib.onscriptload && document.URL.indexOf("edge.sharethis.com") == -1) {
  stlib.data.init();
  stlib.onscriptload = true;
  stlib.logger.log("pview", null);
}
stlib.logger.ibl();
stlib.data.bindEvent(document, "click", stlib.logger.obl);

if(typeof(_gaq)!=="undefined" && typeof(__stPubGA)!=="undefined"){
	if(typeof(_gat)!=="undefined"){
		var __stPubGA=_gat._getTrackerByName("~0")._getAccount();
	}
	if(typeof(__stPubGA)!=="undefined" && __stPubGA!="UA-XXXXX-X"){
		_gaq.push(function(){
			var temp=_gat._getTrackerByName();
			__stPubGA=temp._getAccount();
			if(__stPubGA=="UA-XXXXX-X"){
				delete __stPubGA;
			}
		});
	}
}
//try{
	if (!SHARETHIS) {
		if(!SHARETHIS_TOOLBAR){
			var SHARETHIS_TOOLBAR=false;
		}
		var SHARETHIS=null;
		/* parseQueryString.js - a function to parse and decode query strings -- The author of this program, Safalra (Stephen Morley), irrevocably releases all rights to this program, with the intention of it becoming part of the public domain. Because this program is released into the public domain, it comes with no warranty either expressed or implied, to the extent permitted by law.  For more public domain JavaScript code by the same author, visit: http://www.safalra.com/web-design/javascript/ */
		function parseQueryString(G){var E={};if(G==undefined){G=location.search?location.search:""}if(G.charAt(0)=="?"){G=G.substring(1)}var C=G.indexOf("?");if(C){G=G.substring(C+1)}C=G.indexOf("#");if(C){G=G.substring(C+1)}G=G.replace("+"," ");var B=G.split(/[&;]/g);for(var C=0;C<B.length;C++){var F=B[C].split("=");var A=decodeURIComponent(F[0]);var D=decodeURIComponent(F[1]);if(!E[A]){E[A]=[]}E[A].push((F.length==1)?"":D)}return E};//var D=decodeURIComponent(F[1]);E[A]=((F.length==1)?"":D)}return E};

		var stVisibleInterval=null;
		var readyTestInterval=null;
		var st_showing = false;
		var stautoclose = true;

		function SHARETHIS_merge(){
			var mix = {};
			for (var i = 0, l = arguments.length; i < l; i++){
				var object = arguments[i];
				if (SHARETHIS_typeof(object) != 'object') continue;
				for (var key in object){
					var op = object[key], mp = mix[key];
					mix[key] = (mp && SHARETHIS_typeof(op) == 'object' && SHARETHIS_typeof(mp) == 'object') ? SHARETHIS_merge(mp, op) : SHARETHIS_unlink(op);
				}
			}
			return mix;
		}

		function SHARETHIS_merge2(o1,o2){
			for(var opts in o2){
				if(SHARETHIS_tstOptions(opts)==true && o2[opts]!==null){
					o1[opts]=o2[opts];
//				} else {
//					console.log("not in list: "+opts);
				}
			}
			return o1;
		}

		function SHARETHIS_unlink(object){
			var SHARETHIS_unlinked;
			switch (SHARETHIS_typeof(object)){
				case 'object':
					SHARETHIS_unlinked = {};
					for (var p in object) SHARETHIS_unlinked[p] = SHARETHIS_unlink(object[p]);
				break;
				case 'hash':
					SHARETHIS_unlinked = SHARETHIS_unlink(object.getClean());
				break;
				case 'array':
					SHARETHIS_unlinked = [];
					for (var i = 0, l = object.length; i < l; i++) SHARETHIS_unlinked[i] = SHARETHIS_unlink(object[i]);
				break;
				default: return object;
			}
			return SHARETHIS_unlinked;
		}

		function SHARETHIS_typeof(object){
			if(SHARETHIS_isArray(object)){
				return 'array';
			}
			else{
				return typeof object;
			}
		}

		function SHARETHIS_isArray(object){
			var a=object != null && typeof object == "object" && 'splice' in object && 'join' in object;
			return a;
		}

		function SHARETHIS_Shareable(properties,options){
			this.idx=-1;
			this.frameUrl="";
			this.element=null;
			this.trigger=null;
			this.page="";
			this.properties={
				type:       '',
				title:      encodeURIComponent(document.title),
				summary:    '',
				content:    '',
				url:        document.URL,
				icon:       '',
				category:   '',
				updated:    document.lastModified,
				published:  '',
				author:     ''
			};
			//onmouseover set to true for default
			this.options={
				button: true,
				onmouseover: true,
				buttonText: 'ShareThis',
				popup: false,
				offsetLeft: 0,
				offsetTop: 0,
				embeds: false,
				autoclose: false
			};
			this.initialize= function(properties, options){
				this.options = SHARETHIS_merge2(this.options, options);
				this.properties = SHARETHIS_merge2(this.properties, properties);
				if (options.target){
					var o = this;
					options.target.onclick=function(){o.share();};
					if (options.mouseover){
						options.target.onmouseover=function(){o.share();};
					}
				}
			}
			this.initialize(properties,options);
			this.share=function(){
				frames['stframe'].location=this.frameUrl+"#getObject/"+SHARETHIS.guid+"/"+this.idx;
			}
			this.attachButton=function(newbutton) {
				this.element = newbutton;
				newbutton.setAttribute("st_page", "home");
				if(this.options.onmouseover) {
					newbutton.onmouseover = this.popup;
				} else {
					newbutton.onclick = this.popup;
				}
			}
			this.attachChicklet = function(type, chicklet) {
				switch (type) {
				case "facebook":
//					chicklet.setAttribute("st_dest", "facebook.com");
					chicklet.setAttribute("st_dest", "facebook");
					var children = chicklet.childNodes;
					for ( var i = 0; i < children.length; i++) {
						var child = children[i];
						try {
//							child.setAttribute("st_dest", "facebook.com");
							child.setAttribute("st_dest", "facebook");
						} catch (err) {
						}
					}
					chicklet.onclick = this.chicklet;
					break;
				case "digg":
//					chicklet.setAttribute("st_dest", "digg.com");
					chicklet.setAttribute("st_dest", "digg");
					var children = chicklet.childNodes;
					for ( var i = 0; i < children.length; i++) {
						var child = children[i];
						try {
//							child.setAttribute("st_dest", "digg.com");
							child.setAttribute("st_dest", "digg");
						} catch (err) {
						}
					}
					chicklet.onclick = this.chicklet;
					break;
				case "yahoo_buzz":
//					chicklet.setAttribute("st_dest", "buzz.yahoo.com");
					chicklet.setAttribute("st_dest", "ybuzz");
					var children = chicklet.childNodes;
					for ( var i = 0; i < children.length; i++) {
						var child = children[i];
						try {
//							child.setAttribute("st_dest", "buzz.yahoo.com");
							child.setAttribute("st_dest", "ybuzz");
						} catch (err) {
						}
					}
					chicklet.onclick = this.chicklet;
					break;
				case "email":
					chicklet.setAttribute("st_page", "send");
					var children = chicklet.childNodes;
					for ( var i = 0; i < children.length; i++) {
						var child = children[i];
						try {
							child.setAttribute("st_page", "send");
						} catch (err) {
						}
					}
					chicklet.onclick = this.popup;
					break;
				case "twitter":
//					chicklet.setAttribute("st_dest", "twitter.com");
					chicklet.setAttribute("st_dest", "twitter");
					var children = chicklet.childNodes;
					for ( var i = 0; i < children.length; i++) {
						var child = children[i];
						try {
//							child.setAttribute("st_dest", "twitter.com");
							child.setAttribute("st_dest", "twitter");
						} catch (err) {
						}
					}
					chicklet.onclick = this.chicklet;
					break;
				case "myspace":
//					chicklet.setAttribute("st_dest", "myspace.com");
					chicklet.setAttribute("st_dest", "myspace");
					var children = chicklet.childNodes;
					for ( var i = 0; i < children.length; i++) {
						var child = children[i];
						try {
//							child.setAttribute("st_dest", "myspace.com");
							child.setAttribute("st_dest", "myspace");
						} catch (err) {
						}
					}
					chicklet.onclick = this.chicklet;
					break;
				case "aim":
//					chicklet.setAttribute("st_dest", "aim.com");
					chicklet.setAttribute("st_dest", "aim");
					var children = chicklet.childNodes;
					for ( var i = 0; i < children.length; i++) {
						var child = children[i];
						try {
//							child.setAttribute("st_dest", "aim.com");
							child.setAttribute("st_dest", "aim");
						} catch (err) {
						}
					}
					chicklet.onclick = this.chicklet;
					break;
				case "mixx":
//					chicklet.setAttribute("st_dest", "mixx.com");
					chicklet.setAttribute("st_dest", "mixx");
					var children = chicklet.childNodes;
					for ( var i = 0; i < children.length; i++) {
						var child = children[i];
						try {
//							child.setAttribute("st_dest", "mixx.com");
							chicklet.setAttribute("st_dest", "mixx");
						} catch (err) {
						}
					}
					chicklet.onclick = this.chicklet;
					break;
				}
			}
		}

		function ShareThis(options){
			var that = this;
			if(typeof(options)=="undefined"){
				options={};
			}
			this.version=2.03;
			this.tmpSendData="";
			this.sendArray=[];
			this.sendInit=[];
			this.sendNum=0;
			this.guid=null;
			this.popExists=false;
			this.popup_win=null;
			this.newwinfrag="";
			this.page=null;
			this.shareables=[];
			this.readyList=[];
			this.postUrl="";
			this.frameUrl="";
			this.counter=0;
			this.wrapper=null;
			this.ready=false;
			this.popupCalled=false;
			this.referrer_sts = "";
			this.shr_flag = "";
			this.publisherID = (typeof(stLight)!=="undefined") ? stLight.publisher:null;
			this.bodyLoaded=false;
			this.doNotHash=false;
			this.doNotCopy=false;
			this.hashAddressBar=false;

			if(options && typeof(options['publisher'])!=="undefined" ) {
				this.publisherID = options['publisher'][0];
			}
			if(options && typeof(options['hashAddressBar'])!=="undefined" ) {
				this.hashAddressBar = options['hashAddressBar'][0];
			}
			this.publisherID = (typeof(stLight)!=="undefined") ? stLight.publisher:this.publisherID;
			options['jsref']=encodeURIComponent(document.referrer);
			options['pUrl']=encodeURIComponent(document.location.href);
			this.widgetCalled=false;
			this.lastUrl='blank';
			this.logFlag=true;
			this.closebutton=null;
			this.widgetExists=false;
			this.oldScroll=0;
			this.fp=null;
			this.currentId=null;
			this.toolbar=false;
			this.st_clicked=false;
			this.st_clicked_o=null;
			this.publisherGA= (typeof(__stPubGA)!=="undefined") ? __stPubGA:null;//__stPubGA
			if(this.publisherGA!==null){options['publisherGA']=this.publisherGA;}
			this.curr_offsetTop=0;
			this.curr_offsetLeft=0;
			this.frameReady=false;
			this.delayShow=false;
			this.numIframe=0;
			this.frameLoaded=false;
			this.curr_id=null;
			this.current_element=null;
			this.opt_arr=[];
			this.mousetimer=null;
			this.autoPosition=true;
			this.openDuration=0;
			this.stopClosing=false;
			this.inTime=0;
			this.outTime=0;
			this.clickSubscribers=[];
			this.buttonCount=0;
			this.buttonClicked=false;
			this.fragString="";
			this.meta={
				publisher: '',
				hostname: location.host,
				location: location.pathname
			};
			this.positionWidget=function(){
				function getHW(elem) {
					var retH=0;
					var retW=0;
					var going = true;
					while( elem!=null ) {
						if (elem.offsetLeft<0 && (document.all &&  navigator.appVersion.indexOf('MSIE 8.')!=-1)){
							var newVal = elem.offsetLeft*-1;
							retW+= newVal;
						}
						else
							retW+= elem.offsetLeft;
						if (going) {
							retH+= elem.offsetTop;
						}
						if (window.getComputedStyle) {
							if (document.defaultView.getComputedStyle(elem,null).getPropertyValue("position") == "fixed") {
								retH += (document.documentElement.scrollTop || document.body.scrollTop);
								going = false;
							}
						} else if (elem.currentStyle) {
							if (elem.currentStyle["position"] == "fixed") {
								retH += (document.documentElement.scrollTop || document.body.scrollTop);
								going = false;
							}
						}
						elem= elem.offsetParent;
					}
					return {height:retH,width:retW};
				}
				var id=SHARETHIS.curr_id;
					var shareel = SHARETHIS.current_element;
					if(shareel==null){
						shareel=document.getElementById(id);
					}
					var curleft = curtop = 0;

					var mPos = getHW(shareel);
					curleft = mPos.width;
					curtop = mPos.height;

//					if (shareel.offsetParent) {
//						curleft = shareel.offsetLeft;
//						curtop = shareel.offsetTop;
//						while (shareel = shareel.offsetParent) {
//							curleft += shareel.offsetLeft;
//							curtop += shareel.offsetTop;
//						}
//					}
					shareel = SHARETHIS.current_element;
					if(shareel==null){
						shareel=document.getElementById(id);
					}

					var eltop=0;
					var elleft=0;
					var topVal=0;
					var leftVal=0;
					var elemH=0;
					var elemW=0;
					eltop = curtop + shareel.offsetHeight;
					elleft = curleft+5;
					topVal=(eltop + SHARETHIS.curr_offsetTop);
					topVal=eval(topVal);
					elemH=topVal;
					topVal+="px";
					leftVal=(elleft + SHARETHIS.curr_offsetLeft);
					leftVal=eval(leftVal);
					elemW=leftVal;
					leftVal+="px";
					SHARETHIS.wrapper.style.top = topVal;
					SHARETHIS.wrapper.style.left = leftVal;
					if(SHARETHIS.autoPosition==true){
						SHARETHIS.oldScroll=document.body.scrollTop;
						var pginfo=this.pageSize();
						var effectiveH=pginfo.height+pginfo.scrY;
						var effectiveW=pginfo.width+pginfo.scrX;
						var widgetH=330;
						var widgetW=330;
						var needH=widgetH+elemH; //500
						var needW=widgetW+elemW; //1270
						var diffH=needH-effectiveH; //~100
						var diffW=needW-effectiveW;
						var newH=elemH-diffH;// ~121
						var newW=elemW-diffW;

						var buttonPos=getHW(shareel);
						var leftA,rightA,topA,bottomA=false;
						if(diffH>0){
							//bottom space is not available assume top is
							bottomA=false;
							topA=true;
							if((buttonPos.height-widgetH)>0){
								newH=buttonPos.height-widgetH;
							}
							SHARETHIS.wrapper.style.top = newH+"px";
						}

						if(diffW>0){
							//left is not avaialbe assume right is...
							leftA=false;
							rightA=true;
							if((buttonPos.width-widgetW)>0){
								newW=buttonPos.width-widgetW;
							}
							SHARETHIS.wrapper.style.left = newW+"px";
						}
					}
					SHARETHIS.wrapper.style.visibility="visible";
					SHARETHIS.mainstframe.style.visibility = 'visible';
			},
			this.hideWidget=function(){
				if(SHARETHIS.wrapper.style.visibility !== 'hidden'){
					SHARETHIS.wrapper.style.visibility = 'hidden';
				}
				if(SHARETHIS.mainstframe.style.visibility !== 'hidden'){
					SHARETHIS.mainstframe.style.visibility = 'hidden';
				}
			},
			this.pageSize=function() {
		        var pScroll = [0,0,0,0];
				var scX=0;
				var scY=0;
				var winX=0;
				var winY=0;
		        if (typeof(window.pageYOffset) == 'number') {
		            //Netscape compliant
		            scX=window.pageXOffset;
					scY=window.pageYOffset;
		        } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
		            //DOM compliant
					scX=document.body.scrollLeft;
					scY=document.body.scrollTop;
		        } else if (document.documentElement
		          && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
		            //IE6 standards compliant mode
					scX=document.documentElement.scrollLeft;
					scY=document.documentElement.scrollTop;
		        }
		  	   if (window.innerWidth) {
			   		winX=window.innerWidth;
			      	winY=window.innerHeight;
			   }
			   else if (document.documentElement.offsetWidth) {
			   		winX= document.documentElement.offsetWidth;
			        winY=document.documentElement.offsetHeight;
			   }
				pScroll={scrX:scX,scrY:scY,width:winX,height:winY};
		        return pScroll;
		    }

		    this.addEntry=function(properties, options){
		    	if(_thisScript===null){
		    		var tmpScr=getShareThisScript();
		    		SHARETHIS.options=parseQueryString(tmpScr.src);

		    		this.frameUrl="https://ws.sharethis.com/secure/index.html";
		    		//this.frameUrl="http://edge.sharethis.com/share4x/index.a2b2573ebf279bdef1f84025a2fa2b7c.html"; // - Last Uncommented URL
					//this.frameUrl="http://wd.sharethis.com/share5x/index.html
					this.postUrl="https://ws.sharethis.com/api/setCache_ws.php";

					if(SHARETHIS.options["button"]){SHARETHIS.options["button"]=SHARETHIS.getBool(SHARETHIS.options["button"].toString());}
					if(SHARETHIS.options["popup"]){SHARETHIS.options["popup"]=SHARETHIS.getBool(SHARETHIS.options["popup"].toString());}
					if(SHARETHIS.options["embeds"]){SHARETHIS.options["embeds"]=SHARETHIS.getBool(SHARETHIS.options["embeds"].toString());}

					var init = "init";
					SHARETHIS.newwinfrag = "#popup";

					for (var o in SHARETHIS.options){
						if(SHARETHIS_tstOptions(o)==true)
		            	{
		            		init = init+"/"+o+"="+encodeURIComponent(options[o]);
							this.newwinfrag = this.newwinfrag+ "/" +o +"-=-" +encodeURIComponent(options[o]);
		            	}
					}

					SHARETHIS.initstr = init;

					//PUMP
					//SHARETHIS.mainstframe.src=SHARETHIS.frameUrl+SHARETHIS.initstr;
					SHARETHIS.messageQueueInstance.send(SHARETHIS.initstr, 'init');

		    	}

		        var o = new SHARETHIS_Shareable(properties, SHARETHIS_merge2(SHARETHIS.options, options));
		        if(typeof(o.properties.url)==="object"){
		        	try{o.properties.url=o.properties.url.href;}catch(err){}
		        }
		        for (var prop in o.properties){
		        	try{o.properties[prop]=o.properties[prop].toString();}catch(err){}
		        }
				var xInt="";
				var xInt2="";
				var sendDataInt="";
				var sendPopupDataInt="";
				//
				if(
						this.meta.publisher=="5afea983-e449-4a75-a464-3c9a7f6c6e37" ||  //zillow
						this.meta.publisher=="e1e0ea5a-a326-4731-b1d1-f21623043511" || //boston.com
						this.meta.publisher=="ccd2a158-6cce-4bbc-afa8-1d2dc62fe84c" || //foxnews.com
						this.meta.publisher=="1e542d6f-546f-4d85-a790-bbaf333155b7" || //espn.com
						this.meta.publisher=="89879177-51bf-4cf0-91c9-6326d062d5e6" || //huffington post
						this.meta.publisher=="44b6b8a4-c8df-4bd0-8d8d-e6ad27ec63f4" ||//fast company
						stlib.browser.mobile.isMobile()
				){ //on hover is false for these publishers
					o.options.onmouseover=false;
				}
				if( SHARETHIS.options['onmouseover'] ) {
					if( SHARETHIS.options['onmouseover'] == 'true' ) {
						o.options.onmouseover=true;
					} else if( SHARETHIS.options['onmouseover'] == 'false' ) {
						o.options.onmouseover=false;
					}
				}


		        if(o.options.popup){
					o.options.onmouseover = false;
					SHARETHIS.popupExists=true;
				}
				else if(SHARETHIS_TOOLBAR!==true){
					SHARETHIS.widgetExists=true;
				}
		        o.idx = this.shareables.push(o) - 1;
				var id = 'sharethis_' + o.idx;
		        var oidx = o.idx;

				if(o.properties.url!==this.lastUrl){
					this.lastUrl=o.properties.url;
				}
				else{
					SHARETHIS.logFlag=false;
				}
				o.chicklet = function(e){
					if (!e) var e = window.event;
					if (e.target) {
						o.trigger = e.target;
					}
					else if (e.srcElement) {
						o.trigger = e.srcElement;
					}
					var dest = o.trigger.getAttribute("st_dest");

					stlib.data.resetShareData();
				    stlib.data.set("url", o.properties.url, "shareInfo");
				    stlib.data.set("title", o.properties.title, "shareInfo");
				    stlib.data.set("destination", dest, "shareInfo");
				    stlib.data.setSource("chicklet");
				    stlib.data.set("buttonType", "custom", "shareInfo");
				    if(typeof(o.properties.icon)!='undefined' && o.properties.icon!=null){
				    	stlib.data.set("image", o.properties.icon, "shareInfo");
					}if(typeof(o.properties.summary)!='undefined' && o.properties.summary!=null){
						stlib.data.set("description", o.properties.summary, "shareInfo");
					}
					stlib.sharer.share();

//					stlib.logger.log("click");
//
//					var url  ="https://ws.sharethis.com/button/redirect.php";
//					url += "?d="  + dest;
//					url += "&pk=" + SHARETHIS.options.publisher;
//					url += "&s="  + SHARETHIS.options.sessionID;
//					url += "&p="  + encodeURIComponent(stlib.json.encode(o.properties));
//					window.open(url,"stpopup","width=970,height=700,location=1,toolbar=1,scrollbars=1,menubar=1,resizable=1");
				}
		        o.popup = function(e) {
	        	if(stlib.browser.ieFallback) {
					if (typeof(SHARETHIS.initIE)=="undefined"||SHARETHIS.initIE!=true) {
//							console.log("IE not init");
						return;
					}
				}
				stCancelClose();
				if (!o.options.service) {
					var service = "";
					if (e && e.currentTarget) {
						service = e.currentTarget.getAttribute("st_page");
					} else {
						service = o.button.getAttribute("st_page");
					}
					if (service == "home") {
						o.options.service = "sharethis";
					} else if (service == "send") {
						o.options.service = "email";
					}
				}
				if (stlib.browser.mobile.handleForMobileFriendly(o, o.options)) {
					SHARETHIS.log("widget", o, "mobile");
					return;
				}
		        	o.options.autoclose=true;
		        	SHARETHIS.postEntries(o);
		        	//o.options.onmouseover=true;//setting to true for default...
		        	if(SHARETHIS_TOOLBAR===true){
		        		if(st_showing===false){
		        			SHARETHIS.log('widget',o,'toolbar');
		        		}
						st_showing=true;
						clearInterval(stVisibleInterval);
						SHARETHIS.hideEmbeds();
						var added="#popup/title="+encodeURIComponent(encodeURIComponent(o.properties.title))+"/url="+encodeURIComponent(encodeURIComponent(o.properties.url))+"/publisher="+o.options.publisher+"/toolbar=true";
						var pgval="";
						if(SHARETHIS.page!=null){
							pgval="/page="+SHARETHIS.page;
						}
						//PUMP
						//SHARETHIS.mainstframe.src = SHARETHIS.frameUrl +added+pgval;
						SHARETHIS.messageQueueInstance.send(added+pgval, 'popup');
						SHARETHIS.wrapper.style.visibility="visible";
						SHARETHIS.mainstframe.style.visibility = 'visible';
		        	} else {
		        		if( (SHARETHIS.ready===true && SHARETHIS.frameReady===true) || (SHARETHIS.popupExists===true && SHARETHIS.ready==true && SHARETHIS.widgetExists===false) || (SHARETHIS.popupExists===true && SHARETHIS.ready==true && SHARETHIS.frameReady===true) ){
							clearInterval(stVisibleInterval);
							if ( ( typeof(e) != "undefined" &&  typeof(e) != "unknown" && e) || (typeof(event) != "undefined" &&  typeof(event) != "unknown" && event) ) {
								if (typeof(e) != "undefined" &&  typeof(e) != "unknown" && e) {
									o.trigger = e.target
								}
								else if (typeof(event) != "undefined" && typeof(event) != "unknown" && event) {
									o.trigger = event.srcElement;
								}
								if (o.trigger !== null && o.trigger) {
									id=o.trigger.id;
									SHARETHIS.current_element=o.trigger;
									o.page = o.trigger.getAttribute('st_page');
									if(st_showing===false){
										if (o.page == "home") {
											SHARETHIS.log('widget',o,'button');
										} else {
											SHARETHIS.log('widget',o,'chicklet');
										}
								 	}
								}
								else {
									o.page = "home";
									if(st_showing===false){
								 		SHARETHIS.log('widget',o,'button');
								 	}
								}
							}
							else {
								if (o.element != null) {
									id=o.element.id;
									SHARETHIS.current_element=o.element;
								}
								o.page = "home";
								if(st_showing===false){
							 		SHARETHIS.log('widget',o,'button');
							 	}
							}
							var pageFrag = o.page ? "/page=" + o.page : "/page=home";
							SHARETHIS.curr_offsetTop=Number(o.options.offsetTop);
							SHARETHIS.curr_offsetLeft=Number(o.options.offsetLeft);
							if(SHARETHIS.curr_offsetTop>0 || SHARETHIS.curr_offsetTop>0){
								SHARETHIS.autoPosition=false;
							}
							SHARETHIS.curr_id=id;
							if(o.options.onclick) {
					        		var res = o.options.onclick.apply(document, [o]);
					        		if(res == false) return false;
							}
							var added="#popup/title-=-"+encodeURIComponent(encodeURIComponent(o.properties.title))+"/url-=-"+encodeURIComponent(encodeURIComponent(o.properties.url))+"/publisher-=-"+o.options.publisher+"/toolbar-=-true";

							if (stlib.data) {
								var toStoreA = stlib.json.encode(stlib.data.pageInfo);
								var toStoreB = stlib.json.encode(stlib.data.shareInfo);

								if (stlib.browser.isFirefox() && !stlib.browser.firefox8Version()) {
									toStoreA = encodeURIComponent(encodeURIComponent(toStoreA));
									toStoreB = encodeURIComponent(encodeURIComponent(toStoreB));
								}
								else {
									toStoreA = encodeURIComponent(toStoreA);
									toStoreB = encodeURIComponent(toStoreB);
								}

								added += "/pageInfo-=-" + toStoreA;
								added += "/shareInfo-=-" + toStoreB;
							}
							_$d_();
							_$d1("Is popup:" + o.options.popup);
					        if(o.options.popup) {
								_$d2(SHARETHIS.frameUrl);
								_$d2(added);
					        	var newwinurl = SHARETHIS.frameUrl + added;
								window.open(newwinurl, "newstframe","status=1,toolbar=0,width=350,height=450");
					        }
					        else{
								if(st_showing == false) {
									if(o.options.embeds == false) {
										SHARETHIS.hideEmbeds();
									}
									stautoclose = o.options.autoclose;
									if(o.options.onmouseover==false){
										stautoclose=false;
									}
									if(SHARETHIS.sendNum<SHARETHIS.sendArray.length){
										var temparr=[];
										SHARETHIS.sendArray.splice(0,0,"show" + "/guid_index=0" + pageFrag);
										if(SHARETHIS.delayShow===true){
											sendDataInt=setTimeout(SHARETHIS.sendData,1000);
										}
										else{
											sendDataInt=setTimeout(SHARETHIS.sendData,20);
										}
									}
									else{
										//SHARETHIS.mainstframe.src = SHARETHIS.frameUrl + "#show" + "/guid_index=" + oidx;
										//PUMP
										//window.frames['stframe'].location.replace(SHARETHIS.frameUrl + "#show" + "/guid_index=0" + pageFrag);
										if(stlib.browser.ieFallback) {
											setTimeout(function(){SHARETHIS.messageQueueInstance.send("show" + "/guid_index=0" + pageFrag, 'show');}, 500);
										} else {
											SHARETHIS.messageQueueInstance.send("show" + "/guid_index=0" + pageFrag, 'show');
										}
										if(SHARETHIS.delayShow===true){
											sendDataInt=setTimeout(SHARETHIS.sendData,1000);
										}
										else{
											sendDataInt=setTimeout(SHARETHIS.sendData,20);
										}
									}
									SHARETHIS.positionWidget();
									st_showing = true;
								}
								else{
									if(o.options.onmouseover==false || o.options.onmouseover=="false"){stcloseWidget();}
								}
							}
		        		}
		        		else{
							SHARETHIS.st_clicked=true;
							SHARETHIS.delayShow=true;
							SHARETHIS.st_clicked_o=o;
		        		}
					}//end else for SHARETHIS_TOOLBAR===true
				};

				var style = o.options.style ? o.options.style : (SHARETHIS.options.style ? SHARETHIS.options.style : 'default');
				switch (style) {
				case 'vertical':
					var ovr = document.createElement("div");
					ovr.className = 'stoverlay';
					o.button = ovr;
					var img = document.createElement("img");
					img.setAttribute("src", "https://ws.sharethis.com/images/vbutton.gif";
					if(o.options.onmouseover == false || o.options.onmouseover == "false") ovr.onclick = o.popup;
			        if(o.options.onmouseover == true || o.options.onmouseover == "true") {
			        	ovr.onclick=function(){stCancelClose();};
			        	ovr.onmouseover=function(){;stCancelClose();SHARETHIS.mousetimer=setTimeout(o.popup,150);};
			        	ovr.onmouseout=function(){clearInterval(SHARETHIS.mousetimer);};
			        }
					try{
						if(o.options.button==true && SHARETHIS.bodyLoaded==false){
							document.write('<div class="stbutton vertical" id="' + id + '"></div>');
						}
					}
					catch(err){

					}
					var x = document.getElementById(id);
					if (x) {
			            if(o.options.button) {
			            	x.appendChild(ovr);
			            	x.appendChild(img);
						}
			        }
					break;
				case 'horizontal':
				case 'vertical':
					var ovr = document.createElement("div");
					ovr.className = 'stoverlay';
					o.button = ovr;
					var img = document.createElement("img");
					img.setAttribute("src", "https://ws.sharethis.com/images/hbutton.gif";
					if(o.options.onmouseover == false || o.options.onmouseover == "false") ovr.onclick = o.popup;
			        if(o.options.onmouseover == true || o.options.onmouseover == "true") {
			        	ovr.onclick=function(){stCancelClose();};
			        	ovr.onmouseover=function(){;stCancelClose();SHARETHIS.mousetimer=setTimeout(o.popup,150);};
			        	ovr.onmouseout=function(){clearInterval(SHARETHIS.mousetimer);};
			        }
					try{
						if(o.options.button==true && SHARETHIS.bodyLoaded==false){
							document.write('<div class="stbutton horizontal" id="' + id + '"></div>');
						}
					}
					catch(err){

					}
					var x = document.getElementById(id);
					if (x) {
			            if(o.options.button) {
			            	x.appendChild(ovr);
			            	x.appendChild(img);
						}
			        }
					break;
				default:
					var a = document.createElement("a");
			        a.className = 'stbutton stico_' + (o.options.style ? o.options.style : (SHARETHIS.options.style ? SHARETHIS.options.style : 'default'));
				    a.title = "ShareThis via email, AIM, social bookmarking and networking sites, etc.";
			        a.href = "javascript:void(0)";
			        a.setAttribute("st_page", "home");

			        //mouse over
			        if(o.options.onmouseover == false || o.options.onmouseover == "false") a.onclick = o.popup;
			        if(o.options.onmouseover == true || o.options.onmouseover == "true") {
			        	//SHARETHIS.wrapper.onmouseover=function(){;stCancelClose();};
			        	//SHARETHIS.wrapper.onmouseout=function(){console.log("widget mouse out");};
			        	//manu
			        	a.onclick=function(){stCancelClose();};
			        	a.onmouseover=function(){;stCancelClose();SHARETHIS.mousetimer=setTimeout(o.popup,150);};
			        	a.onmouseout=function(){clearInterval(SHARETHIS.mousetimer);};
			        		//function(){SHARETHIS.mousetimer=setTimeout(o.popup,100);};
			        		//a.onmouseover = o.popup;
			        }
			        var t = document.createElement("span");
			        t.className = 'stbuttontext';
			        t.setAttribute("st_page", "home");
			        t.appendChild(document.createTextNode(o.options.buttonText));
			        a.appendChild(t);
			        o.button = a;
			 		try{
						if(o.options.button==true && SHARETHIS.bodyLoaded==false){
							if(document.readyState != "complete" && document.readyState != "loaded" && document.readyState != "interactive"){
								document.write('<span id="' + id + '"></span>');
							}else if(document.readyState != "complete" && (/MSIE/gi.test(navigator.userAgent))){
								document.write('<span id="' + id + '"></span>');
							}
						}
			 		}catch(err){}
					//SHARETHIS.onReady();
			        var x = document.getElementById(id);
					if (x) {
			            if(o.options.button) {
			            	x.appendChild(a);
						}
			        }
				}

				if(SHARETHIS.logFlag){SHARETHIS.buttonCount++;}
		        return o;
		    },

		    this.postEntries=function(o){
		    	SHARETHIS.sendNum=0;
		        var urls = '';
		        var propertylist = [];
	            var tmp_prop={};
	            //var o = this.shareables[i];
	            urls = urls+o.properties.url;
	            for (p in o.properties){
		        	if(SHARETHIS_tstOptions(p)==true){
		        		tmp_prop[p]=null;
						tmp_prop[p]=o.properties[p];
					}
		        }

				var metaProps={};
				var meta=document.getElementsByTagName("meta");
				for(var i=0;i<meta.length;i++){
					if(meta[i].getAttribute('property')=="og:title"){
						metaProps.ogtitle=meta[i].getAttribute('content');
					}else if(meta[i].getAttribute('property')=="og:type"){
						metaProps.ogtype=meta[i].getAttribute('content');
					}else if(meta[i].getAttribute('property')=="og:url"){
						metaProps.ogurl=meta[i].getAttribute('content');
					}else if(meta[i].getAttribute('property')=="og:image"){
						metaProps.ogimg=meta[i].getAttribute('content');
					}else if(meta[i].getAttribute('property')=="og:description"){
						metaProps.ogdesc=meta[i].getAttribute('content');
					}else if(meta[i].getAttribute('name')=="description" || meta[i].getAttribute('name')=="Description"){
						metaProps.desc=meta[i].getAttribute('content');
					}
				}

				var pTitle = o.properties.title ? o.properties.title : metaProps.ogtitle;
				pTitle = pTitle ? pTitle : document.title;

				var pUrl = o.properties.url ? o.properties.url : metaProps.url;
				pUrl = pUrl ? pUrl : document.URL;

				var tmp="/title-=-"+encodeURIComponent(encodeURIComponent(pTitle))+"/pUrl-=-"+encodeURIComponent(encodeURIComponent(pUrl));
				if(typeof(metaProps.ogimg)!='undefined' && metaProps.ogimg!=null){
					tmp += "/image-=-" + encodeURIComponent(encodeURIComponent(metaProps.ogimg));
				}
				if(typeof(metaProps.ogdesc)!='undefined' && metaProps.ogdesc!=null){
					tmp += "/summary-=-" + encodeURIComponent(encodeURIComponent(metaProps.ogdesc));
				} else 	if(typeof(metaProps.desc)!='undefined' && metaProps.desc!=null){
					tmp += "/summary-=-" + encodeURIComponent(encodeURIComponent(metaProps.desc));
				}
				if(SHARETHIS.publisherGA!==null){
					tmp += "/publisherGA-=-" +SHARETHIS.publisherGA;
				}
				tmp += "/source-=-sharethis.js";
				if (SHARETHIS.dataInit != true) {
					SHARETHIS.dataInit = true;
					stlib.data.init();
					stlib.data.set("source","sharethis.js.4x","shareInfo");
					SHARETHIS.messageQueueInstance = new stlib.messageQueue();
					var thisMessageQueue = SHARETHIS.messageQueueInstance;
					SHARETHIS.pumpInstance = new stlib.pump(SHARETHIS.mainstframe, SHARETHIS.mainstframe, function() {
						thisMessageQueue.process();
					});
					SHARETHIS.messageQueueInstance.setPumpInstance(SHARETHIS.pumpInstance);
					try {
						SHARETHIS.pumpInstance.broadcastSendMessage("Buttons Ready");
					} catch (err) {

					}
				}
				SHARETHIS.messageQueueInstance.send("popup"+tmp, 'popup');
		    },
			this.sendData=function(){
				xInt=setInterval(SHARETHIS.sendJSON,50);
			},
			this.sendJSON=function(){
					if(SHARETHIS.sendNum<SHARETHIS.sendArray.length){
						//SHARETHIS.mainstframe.src=SHARETHIS.frameUrl+SHARETHIS.sendArray[SHARETHIS.sendNum];
						//console.log(SHARETHIS.frameUrl+SHARETHIS.sendArray[SHARETHIS.sendNum]);
						//PUMP
						//window.frames['stframe'].location.replace(SHARETHIS.frameUrl+SHARETHIS.sendArray[SHARETHIS.sendNum]);
						SHARETHIS.messageQueueInstance.send(SHARETHIS.sendArray[SHARETHIS.sendNum], 'show');
					}
					else{
						clearInterval(xInt);

					}
					SHARETHIS.sendNum++;
			},

		    this.defer=function(f){
		        if (this.ready) {
		            f.apply(document, [SHARETHIS]);
		        } else {
		            this.readyList.push(function(){return f.apply(this, [SHARETHIS])});
		        }
		    },
		    this.onReady=function(){
		    	if(SHARETHIS.ready!=true){
			        SHARETHIS.ready = true;
			        for (var i = 0; i < SHARETHIS.readyList.length; ++i){
			            	SHARETHIS.readyList[i].apply(document, [SHARETHIS]);
			            }
		    	}
		    },
		    this.load=function(t, opts){
		        var e = document.createElement(t);
		        for (var i in opts) {
		            e.setAttribute(i, opts[i]);
		        }
		        try {
		            document.getElementsByTagName('head')[0].appendChild(e);
		        } catch (err) {
		            document.body.appendChild(e);
		        }
		    },
		    this.hideEmbeds=function() {
		        var embeds = document.getElementsByTagName('embed');
		        for (var i=0; i< embeds.length; i++) {
		            embeds[i].style.visibility = "hidden";
		        }
		    },
		    this.showEmbeds=function() {
		        var embeds = document.getElementsByTagName('embed');
		        for (var i=0; i< embeds.length; i++) {
		            embeds[i].style.visibility = "visible";
		        }
		    },
		    this.log=function(event, obj, source) {
		    	stlib.data.resetShareData();
				if (event == "widget") {
					if (obj && obj.page == "send") {
						stlib.data.set("destination", "email" , "shareInfo");
					} else {
						stlib.data.set("destination", "sharethis" , "shareInfo");
					}
					stlib.data.set("buttonType", "button" , "shareInfo");
				} else {
					stlib.data.set("buttonType", "custom", "shareInfo");
				}

				if (obj) {
					if (obj.properties.url) {
						stlib.data.set("url", obj.properties.url, "shareInfo");
					}if (obj.properties.title) {
						stlib.data.set("title", obj.properties.title, "shareInfo");
					}if(typeof(obj.properties.icon)!='undefined' && obj.properties.icon!=null){
				    	stlib.data.set("image", obj.properties.icon, "shareInfo");
					}if(typeof(obj.properties.summary)!='undefined' && obj.properties.summary!=null){
						stlib.data.set("description", obj.properties.summary, "shareInfo");
					}
				}
			    stlib.data.setSource(source);

				stlib.logger.log(event);
		    },
		    this.getBool= function(variable)    {
			    var vtype;
			    var toReturn;
			    if(variable != null)    {
			        switch(typeof(variable))    {
			            case 'boolean':
			                vtype = "boolean";
			                return variable;
			                break;
			            case 'number':
			                vtype = "number";
			                if(variable == 0)
			                    toReturn = false;
			                else toReturn = true;
			                break;
			            case 'string':
			                vtype = "string";
			                if(variable == "true" || variable == "1")
			                    toReturn = true;
			                else if(variable == "false" || variable == "0")
			                    toReturn = false;
			                else if(variable.length > 0)
			                    toReturn = true;
			                else if(variable.length == 0)
			                    toReturn = false;
			                break;
			        }
			        return toReturn;
				}
			},

			this.onStFrameLoad=function(){
				if(SHARETHIS.frameLoaded===false){
					//SHARETHIS.postEntries();
					SHARETHIS.widgetCalled=true;
					SHARETHIS.frameLoaded=true;
					if(SHARETHIS.st_clicked==true){
						setTimeout("SHARETHIS.st_clicked_o.popup()",1000);
		       		}
				}
			}

			this.readyTest=function(){
				if(SHARETHIS.frameReady===true && SHARETHIS.ready===true){
					clearInterval(SHARETHIS.readyTestInterval);
					SHARETHIS.onStFrameLoad();
				}
			}

			this.sendEvent=function(name,value){
				var tmpSend="widget/"+name+"="+value;
				this.messageQueueInstance.send(tmpSend, 'widget');
			}

			this.initData = function() {
				stlib.data.init();
				this.dataInit = true;
				stlib.data.resetShareData();
			    stlib.data.set("url", document.location.href, "shareInfo");
			    stlib.data.set("title", document.title, "shareInfo");
				stlib.data.set("source", "sharethis.js.4x","shareInfo");

				//stlib.logger.productArray.push("Widget4x");
				//WID-751: Adding product parameter for all ShareThis logging
				stlib.data.set("product", "Widget4x", "pageInfo");

				this.messageQueueInstance = new stlib.messageQueue();
				var thisMessageQueue = this.messageQueueInstance;
				this.pumpInstance = new stlib.pump(this.mainstframe, this.mainstframe, function() {
					thisMessageQueue.process();
				});
				this.messageQueueInstance.setPumpInstance(this.pumpInstance);
				try {
					this.pumpInstance.broadcastSendMessage("Buttons Ready");
				} catch (err) {

				}
				var stringNeeded = "data";
				for (var o in stlib.data){
					if(stlib.data.hasOwnProperty(o)==true && stlib.data[o]!==null && typeof(stlib.data[o])!="function"){
						if(typeof(stlib.data[o])=="object") {
							var toStore = stlib.json.encode(stlib.data[o]); }
						else if (typeof stlib.data[o] == "boolean") {
							var toStore = stlib.data[o] ? "true" : "false" ;}
						else {
							var toStore = stlib.data[o]; }
						// Only encode twice if Firefox (Firefox decodes any encoded URL)
						if (stlib.browser.isFirefox() && !stlib.browser.firefox8Version())
							stringNeeded += "/"+o+"="+encodeURIComponent(encodeURIComponent(toStore));
						else
							stringNeeded += "/"+o+"="+encodeURIComponent(toStore);
					}
				}

				this.fragString = stringNeeded;
				if(stlib.browser.ieFallback) {
					setTimeout(function(){SHARETHIS.messageQueueInstance.send(SHARETHIS.fragString, 'data');}, 1000);
				} else {
					this.messageQueueInstance.send(stringNeeded, 'data');
				}
				if(stlib.browser.ieFallback) {
					setTimeout(function(){SHARETHIS.messageQueueInstance.send(SHARETHIS.sendInit[0], 'init');}, 2000);
					setTimeout(function(){SHARETHIS.initIE=true;}, 2500);
				} else {
					this.messageQueueInstance.send(this.sendInit[0], 'init');
				}
			};

			this.initialize=function(options){
					if(typeof(options['publisher'])=="undefined" && typeof(stLight)!=="undefined"){
						options.publisher=(typeof(stLight)!=="undefined") ? stLight.publisher:null
					}
					for(o in options){
						options[o]=options[o].toString();
					}
					// Fixing our logging. Publishers have been adding 'type=website' to sharethis.js. We will not use 'website' anymore, so change to 'custom'
					for(o in options){
						if (o=="type"&&options[o]=="website") {
							options[o]="custom";
						}
					}
					if(_thisScript==null){
						var _slist = document.getElementsByTagName('script');
			    		var _thisScript3 = _slist[_slist.length - 1];
			    		var ST_script_src=_thisScript3.src;
					}
					else{
						var ST_script_src=_thisScript.src;
					}
					this.frameUrl="https://ws.sharethis.com/secure/index.html";
					// this.frameUrl="http://edge.sharethis.com/share4x/index.a2b2573ebf279bdef1f84025a2fa2b7c.html";
					this.postUrl="https://ws.sharethis.com/api/setCache_ws.php";
					this.options = options || {};
					if(this.options["button"]){this.options["button"]=this.getBool(this.options["button"].toString());}
					if(this.options["popup"]){this.options["popup"]=this.getBool(this.options["popup"].toString());}
					if(this.options["embeds"]){this.options["embeds"]=this.getBool(this.options["embeds"].toString());}
					stlib.hash.doNotHash=false;
					stlib.hash.doNotCopy=false;
					if(this.options["hashAddressBar"]){
						this.options["hashAddressBar"]=this.getBool(this.options["hashAddressBar"].toString());
						stlib.hash.hashAddressBar=this.options["hashAddressBar"];
					}
					if (this.options.publisher) {
						this.meta.publisher = this.options.publisher;
						stlib.data.setPublisher(this.options.publisher);
					}

					//var tmp_css="https://wd.sharethis.com/button/css/secure.sharethis.1ac33bc7d4476110a610f925104446ff.css";
					var tmp_css="https://ws.sharethis.com/button/css/sharethis-secure.css";
					try{
						if(this.options.css){
						tmp_css=this.options.css.toString();
						}
					}
					catch(err){}
					var css = tmp_css;
					this.load('link', {
						href : (this.options.css ? this.options.css : css),
						rel  : 'stylesheet',
						type : 'text/css'
					});


					try {
						this.mainstframe = document.createElement('<iframe name="stframe" allowTransparency="true" style="body{background:transparent;}" ></iframe>');
						this.mainstframe.onreadystatechange=function() {
																	if(SHARETHIS.mainstframe.readyState==="complete"){
																		SHARETHIS.frameReady=true;
																		that.initData();
																	}
																	};
						//try is ie
					} catch(err) {
					//catch is ff and safari
						this.mainstframe = document.createElement('iframe');
						this.mainstframe.allowTransparency="true";
						this.mainstframe.setAttribute("allowTransparency", "true");
						this.mainstframe.onload=function() { SHARETHIS.frameReady=true; that.initData();};
					}
					this.mainstframe.id = 'stframe';
					this.mainstframe.className = 'stframe';
					this.mainstframe.name = 'stframe';
					this.mainstframe.frameBorder = '0';
					this.mainstframe.scrolling = 'no';
					this.mainstframe.width = '350px';
					this.mainstframe.height = '450px';
					this.mainstframe.style.top = '0px';
					this.mainstframe.style.left = '0px';
					 //this works in ff and safari


					try {
			            this.fp = document.createElement('<iframe name="stpostframe" style="visibility:hidden"></iframe>');
			        } catch(err) {
			            this.fp = document.createElement('iframe');
			            this.fp.style.visibility = 'hidden';
			        }
			        this.fp.name = 'stpostframe';
			        this.fp.width = '0px';
			        this.fp.height = '0px';
			        this.fp.src = "";

					var init = "init";
					this.newwinfrag = "#popup";
					for (var o in options){
						if(SHARETHIS_tstOptions(o)==true){
							init = init+"/"+o+"="+encodeURIComponent(options[o]);
							this.newwinfrag = this.newwinfrag+ "/" +o +"-=-" +encodeURIComponent(options[o]);
		            	}
					}
					if(typeof(stLight)!=="undefined"){
						init=init+"/stLight=true";
						this.newwinfrag = this.newwinfrag+"/stLight-=-true";
					}
					this.initstr = init;
					this.sendInit.push(this.initstr);
					//PUMP
					//this.mainstframe.src=this.frameUrl+this.sendInit[0];
					this.mainstframe.src=this.frameUrl;

				//	this.sendNum++;
					this.wrapper= document.createElement('div');
					this.wrapper.id = 'stwrapper';
					this.wrapper.className = 'stwrapper';
					this.wrapper.style.visibility = 'hidden';
					this.wrapper.style.top = "-999px";
					this.wrapper.style.left = "-999px";
					this.closewrapper= document.createElement('div');
					this.closewrapper.className = 'stclose';
					this.closewrapper.onclick = stcloseWidget;
					this.wrapper.appendChild(this.closewrapper);
					this.wrapper.appendChild(this.mainstframe);

					this.defer(function(){
						//make button count call
						SHARETHIS.bodyLoaded=true;
						SHARETHIS.trackTwitter();
						SHARETHIS.trackFB();
						SHARETHIS.subscribe("click",SHARETHIS.gaTS);

						if(SHARETHIS_TOOLBAR===true){
							document.body.appendChild(SHARETHIS.fp);
						//	SHARETHIS.postPopup(); //posts data to set cache
							SHARETHIS_TOOLBAR_DIV.appendChild(SHARETHIS.wrapper);
						}
						if(SHARETHIS.popupExists===true && SHARETHIS.popupCalled===false){
							document.body.appendChild(SHARETHIS.fp);
							//SHARETHIS.postPopup();
							SHARETHIS.popupCalled=true;
						}
						if(SHARETHIS.widgetCalled===false && SHARETHIS.widgetExists===true){
							document.body.appendChild(SHARETHIS.wrapper);
							setTimeout(function(){try{
								//PUMP
								//window.frames['stframe'].location.replace(SHARETHIS.mainstframe.src);
							}catch(err){}},100);
							SHARETHIS.readyTestInterval=setInterval(SHARETHIS.readyTest,250);
						}
						try{
							var stfrm=document.getElementById("stframe");
				        	stfrm.onmouseover=function(){stCancelClose();SHARETHIS.inTime=(new Date()).getTime();};
				        	stfrm.onmouseout=function(){SHARETHIS.outTime=(new Date()).getTime();SHARETHIS.openDuration=(SHARETHIS.outTime-SHARETHIS.inTime)/1000;stClose();};
				        	try{
					        	if(document.body.attachEvent){
					        		document.body.attachEvent('onclick',function(){if(SHARETHIS.buttonClicked==false){SHARETHIS.stopClosing=false;SHARETHIS.openDuration=0;stClose(100);}});
					    		}else{
					    			document.body.setAttribute('onclick','if(SHARETHIS.buttonClicked==false){SHARETHIS.stopClosing=false;SHARETHIS.openDuration=0;stClose(100);}');
					    		}
				        	}catch(err){
				        		document.body.onclick=function(){if(SHARETHIS.buttonClicked==false){SHARETHIS.stopClosing=false;SHARETHIS.openDuration=0;stClose(100);}}; //close widget instantly on body click
				        	}

						}catch(err){}
					});
					if (typeof(window.addEventListener) != 'undefined') {
			            window.addEventListener("load", this.onReady, false);
			        } else if (typeof(document.addEventListener) != 'undefined') {
			            document.addEventListener("load", this.onReady, false);
			        } else if (typeof window.attachEvent != 'undefined') {
			            window.attachEvent("onload", this.onReady);
			        }
					if(typeof(__st_loadLate)=="undefined"){
						if (typeof(window.addEventListener) != 'undefined') {
						    window.addEventListener("DOMContentLoaded", this.onReady, false);
						} else if (typeof(document.addEventListener) != 'undefined') {
						    document.addEventListener("DOMContentLoaded", this.onReady, false);
						}
					}

					setTimeout(function(){
						for (var s in SHARETHIS.shareables) {
							if (SHARETHIS.shareables[s].options != undefined) {
								switch (SHARETHIS.shareables[s].options.style) {
								case 'vertical':
									var ifr;
									try {
										ifr = document.createElement('<iframe allowTransparency="true"></iframe>');
									} catch(err) {
										ifr = document.createElement('iframe');
										ifr.allowTransparency="true";
										ifr.setAttribute("allowTransparency", "true");
									}
									ifr.className = 'stcounter';
									ifr.frameBorder = '0';
									ifr.scrolling = 'no';
									ifr.width = '57px';
									ifr.height = '39px';
									ifr.src = "https://ws.sharethis.com/button/vcounter.php?url=" + encodeURIComponent(SHARETHIS.shareables[s].properties.url);
									SHARETHIS.shareables[s].button.parentNode.appendChild(ifr);
									break;
								case 'horizontal':
									var ifr;
									try {
										ifr = document.createElement('<iframe allowTransparency="true"></iframe>');
									} catch(err) {
										ifr = document.createElement('iframe');
										ifr.allowTransparency="true";
										ifr.setAttribute("allowTransparency", "true");
									}
									ifr.className = 'stcounter';
									ifr.frameBorder = '0';
									ifr.scrolling = 'no';
									ifr.width = '37px';
									ifr.height = '18px';
									ifr.src = "https://ws.sharethis.com/button/hcounter.php?url=" + encodeURIComponent(SHARETHIS.shareables[s].properties.url);
									SHARETHIS.shareables[s].button.parentNode.appendChild(ifr);
									break;
								}
							}
						}
					}, 1000);
				}
			this.initialize(options);
		}

		var closetimeout;

		function stClose(timer){
			if(!timer){
				timer=1000;
			}
			if(stautoclose==true && SHARETHIS_TOOLBAR==false){
				if(SHARETHIS.openDuration<0.5 && SHARETHIS.stopClosing==false){
					closetimeout = setTimeout("stcloseWidget()",timer);
				}else{
					SHARETHIS.stopClosing=true;
				}
			}
		}

		function stCancelClose() {
			clearTimeout(closetimeout);
        	SHARETHIS.buttonClicked=true;
        	setTimeout(function(){SHARETHIS.buttonClicked=false;},100);//manu
		}

		function stcloseWidget(){
			if(typeof(SHARETHIS.grayOut)!=="undefined"){
				SHARETHIS.grayOut(false);
			}
			if(st_showing==false){
				return false;
			}
			st_showing = false;
			SHARETHIS.wrapper.style.visibility ='hidden' ;
			SHARETHIS.mainstframe.style.visibility = 'hidden';
			SHARETHIS.wrapper.style.top = "-999px";
			SHARETHIS.wrapper.style.left = "-999px";
			SHARETHIS.showEmbeds();
			SHARETHIS.sendEvent("screen","home");
			SHARETHIS.sendArray=[];//reset send array to be blank
		}

		function SHARETHIS_tstOptions(tstStr){
			var opt_arr=['type','title','summary','content','url','icon','category','updated','published','author','button','onmouseover','buttonText','popup','offsetLeft','offsetTop','embeds','autoclose','publisher','tabs','services','charset','headerbg','inactivebg','inactivefg','linkfg','style','send_services','exclusive_services','post_services','headerfg','headerType','headerTitle','sessionID','tracking','fpc','ads','pUrl','publisher','doneScreen','jsref','publisherGA','lang','doNotHash'];
			var retVal=false;
				for(var i=0;i<opt_arr.length;i++){
					if(tstStr===opt_arr[i]){
					 retVal=true;
					}
				}
			return retVal;
		}


		function SHARETHIS_TEST(){
			//PUMP
			//SHARETHIS.mainstframe.src = SHARETHIS.frameUrl+"#test";
			SHARETHIS.messageQueueInstance.send("test", 'test');
		}

		//resolves domain for use in cookie
		function _stGetD(){
			var str = document.domain.split(/\./)
			var domain="";
			if(str.length>1){
			    domain="."+str[str.length-2]+"."+str[str.length-1];
			}
			return domain;
		}
		//hashes dd and returns value
		function _stdHash(dd) {
			var hash=0,salt=0;
		 	for (var i=dd.length-1;i>=0;i--) {
			  var charCode=parseInt(dd.charCodeAt(i));
			  hash=((hash << 8) & 268435455) + charCode + (charCode << 12);
			  if ((salt=hash & 161119850)!=0){hash=(hash ^ (salt >> 20))};
			}
		 return hash.toString(16);
		}

		var _thisScript=null;
		function getShareThisScript(){
			var _slist = document.getElementsByTagName('script');
			var rScript=null;
			for(var i=0;i<_slist.length;i++)
			{
				var temp=_slist[i].src;
				if( temp.search(/.*sharethis.*\/button/) >=0 ){
					rScript=_slist[i];
				}
				else if(temp.search(/.*sharethis.*\/widget\/\?/) >=0 || temp.search(/.*sharethis.*\/widget\/index/) >=0 || temp.search(/.*sharethis.*\/widget\/\?&/) >=0){
					rScript=_slist[i];
				}
			}
			return rScript;
		}

		function dbrInfo(){
			var dbr=document.referrer;
			if(dbr && dbr.length>0){
				var domainReg=/\/\/.*?\//; //something between //something/
				var matches=dbr.match(domainReg);
				if(typeof(matches)!=="undefined" && typeof(matches[0])!=="undefined"){
					var reg=new RegExp(document.domain,'gi');
					if(reg.test(matches[0])==true){
						return false;
					}
				}
				var re1=/(http:\/\/)(.*?)\/.*/i;
				var re2=/(^.*\?)(.*)/ig;
				var retVal="";
				var domain=dbr.replace(re1, "$2");
				var reg=new RegExp(domain,'gi');
				if(domain.length>0){retVal+="&refDomain="+domain;}
				else{return false;}
				var query=dbr.replace(re2,"$2");
				if(query.length>0){retVal+="&refQuery="+encodeURIComponent(query);}
				return retVal;
			}
			else{
				return false;
			}
		}


		_thisScript=getShareThisScript();
		if (_thisScript){
			SHARETHIS = new ShareThis(parseQueryString(_thisScript.src));
		} else {
			SHARETHIS = new ShareThis();
		}
		//SHARETHIS.log('pview', null, null);

	} // End !SHARETHIS

	// Don't run if called from HEAD, or if toolbar has been run

	var _slist = document.getElementsByTagName('script');
	var _thisScript2 = _slist[_slist.length - 1];
	if (_thisScript2 && _thisScript2.parentNode.tagName != "HEAD" && typeof(_sttoolbar) == "undefined") {
		var obj = SHARETHIS.addEntry();
	}

	SHARETHIS.trackFB=function(){
		try {
		    if (FB && FB.Event && FB.Event.subscribe) {
		      FB.Event.subscribe('edge.create', function(targetUrl) {
		    	  SHARETHIS.trackShare("fblike_auto",targetUrl);
		    	  SHARETHIS.callSubscribers("click","fblike",targetUrl);
		      });
		      FB.Event.subscribe('edge.remove', function(targetUrl) {
		    	  SHARETHIS.trackShare("fbunlike_auto",targetUrl);
		    	  SHARETHIS.callSubscribers("click","fbunlike",targetUrl);
		      });
		      FB.Event.subscribe('message.send', function(targetUrl) {
		    	  SHARETHIS.trackShare("fbsend_auto",targetUrl);
		    	  SHARETHIS.callSubscribers("click","fbsend",targetUrl);
		      });
		    }
		  }catch(err){}
	};

	SHARETHIS.trackTwitter=function(){
		try {
		    if (twttr && twttr.events && twttr.events.bind) {
		    	twttr.events.bind('click',function(){SHARETHIS.trackTwitterEvent("click");SHARETHIS.callSubscribers("click","twitter");});
		        twttr.events.bind('tweet',function(){SHARETHIS.trackTwitterEvent("tweet");});
		        twttr.events.bind('retweet',function(){SHARETHIS.trackTwitterEvent("retweet");SHARETHIS.callSubscribers("click","retweet");});
		        twttr.events.bind('favorite',function(){SHARETHIS.trackTwitterEvent("favorite");SHARETHIS.callSubscribers("click","favorite");});
		        twttr.events.bind('follow',function(){SHARETHIS.trackTwitterEvent("follow");SHARETHIS.callSubscribers("click","follow");});
		    }
		  }catch(err){}
	};

	SHARETHIS.trackTwitterEvent=function(name){
		SHARETHIS.trackShare("twitter_"+name+"_auto");
	};

	SHARETHIS.trackShare=function(destination,inUrl){
		if(typeof(inUrl)!=="undefined" || inUrl!==null){
			var outUrl=inUrl;
		}else{
			var outUrl=document.location.href;
		}
		stlib.data.set("url", outUrl, "shareInfo");
		stlib.data.set("destination", destination, "shareInfo");
		stlib.data.set("buttonType", "button", "shareInfo");
		stlib.data.setSource("sharethis4x");
		stlib.sharer.share();
	};
	SHARETHIS.messageReceiver=function(event){
		if(event && (event.origin=="http://edge.sharethis.com" || event.origin=="https://ws.sharethis.com")){
			var data=event.data;
			data=data.split("|");
			if(data[0]=="ShareThis" && data.length>2){
				var url= (typeof(data[3])=="undefined") ? document.location.href : data[3];
				SHARETHIS.callSubscribers(data[1],data[2],url);
			}

		}
	};

	SHARETHIS.subscribe=function(evnt,fun){
		if(evnt=="click"){
			SHARETHIS.clickSubscribers.push(fun);
		}
	};

	SHARETHIS.callSubscribers=function(evnt,service,url){
		if(evnt=="click"){
			for(var i=0;i<SHARETHIS.clickSubscribers.length;i++){
				SHARETHIS.clickSubscribers[i]("click",service,url); //their function must accept event,service
			}
		}
	};
	SHARETHIS.gaTS=function(type,service,url){
		if(service=="fblike"){
			network="ShareThis_facebook";
			action="Like";
		}else if(service=="fbunlike"){
			network="ShareThis_facebook";
			action="UnLike";
		}else if(service=="fbsend"){
			network="ShareThis_facebook";
			action="Send";
		}else if(service=="twitter"){
			network="ShareThis_twitter";
			action="Share";
		}else if(service=="retweet"){
			network="ShareThis_twitter";
			action="ReTweet";
		}else if(service=="favorite"){
			network="ShareThis_twitter";
			action="Favorite";
		}else if(service=="follow"){
			network="ShareThis_twitter";
			action="Follow";
		}else{
			network="ShareThis_"+service;
			action="Share";
		}
		if( typeof(_gaq) != "undefined") {
			_gaq.push(['_trackSocial', network,action,url]);
		}
	};

	//Message Receiver
	if (typeof(window.addEventListener) != 'undefined') {
	    window.addEventListener("message", SHARETHIS.messageReceiver, false);
	} else if (typeof(document.addEventListener) != 'undefined') {
	    document.addEventListener("message", SHARETHIS.messageReceiver, false);
	}else if (typeof window.attachEvent != 'undefined') {
	    window.attachEvent("onmessage", SHARETHIS.messageReceiver);
	}

