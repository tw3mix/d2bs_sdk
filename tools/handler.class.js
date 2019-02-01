//enabledProfiles: [ (me.profile.match(/^xShop/)? me.profile : '') ],

enabledProfiles: (function(){
	if (!isIncluded('handler.class.js')) include('handler.class.js');

	/* cacheHandler 는 OOG init 이전이라 D2Bot.handle 통신불가.
	var tick = getTickCount() + 2000,
		muleList = null;

	cacheHandler.get('MuleClaws', function(cache_value){
		muleList = (typeof(cache_value)=='object' && cache_value!=null)? cache_value : [];
	}, 'MuleClaws');
	while(muleList===null || tick > getTickCount()) delay(100);
	*/

	var muleList = fileHandler.get('MuleClaws', 'MuleClaws');


	if (muleList==null) muleList = [];
	// xShop 문자열로 시작하는 프로필을 세팅함.

	if (me.profile.match(/^xShop/)) {
		if (muleList.indexOf(me.profile) < 0) {
			muleList.push(me.profile);
			//cacheHandler.put('MuleClaws', muleList, 'MuleClaws');
			fileHandler.put('MuleClaws', muleList, 'MuleClaws');
		}
	}

	return muleList;

})(),



libs/handler.class.js 경로에 위치할 것. ANSI 인코딩 추천

// 파일읽기/쓰기 없이 다른 프로필과 안정적이고 빠른 연동이 가능하다.
var cacheHandler = {
	_init: false,
	init: function() {
		if (this._init===true) return;
		this._init = true;
		var thisObj = this;
		addEventListener('copydata', function(mode,msg){
			//print('mode: ' + mode + ' / msg: ' + msg);
			if (mode!=61732) return;
			var cache_value = null,
				params = {}, args;
			if (typeof(msg)=='string' && msg.match(/^cachehandler\:/)) {
				params = JSON.parse(msg.replace(/^cachehandler\:/, ''));
			}

			// args[0] = cachekey, args[1]=callback_func, args[2] = profile
			args = thisObj.callback_args.shift();

			// cache value is undefined
			if (typeof(params[args[0]])!='string') {
				params[args[0]] = null;
			}

			// profile must be same
			/*if(typeof(params.profile)!='string') params.profile = args[2]; */
			if (args[2]==params.profile) {
				args[1]( params[args[0]], params );
			}

			if (thisObj.callback_args.length) {
				sendCopyData(null, D2Bot.handle, 0, JSON.stringify( thisObj.callback_args[0][3] ));
			}
		});
	},

	put: function(cache_key, cache_value, profile) {
		if (typeof(profile)!='string' || !profile.length) {
			profile = me.profile;
		}
		this.init();

		var thisObj = this;
		this.get(cache_key, function(dummy, params){
			params[cache_key] = cache_value;
			thisObj._erase(profile);
			thisObj._write(profile, params);
		}, profile);

	},

	delete: function(cache_key, profile) {
		if(typeof(profile)!='string' || !profile.length) {
			profile = me.profile;
		}
		this.init();
		var thisObj = this;

		this.get(cache_key, function(dummy, params){
			delete(params[cache_key]);
			var i, ii = 0;
			for (i in params) {
				if (!params.hasOwnProperty(i)) {
					continue;
				}
				ii++;
			}
			if(!ii) {
				thisObj._erase(profile);
			} else {
				thisObj._write(profile, params);
			}
		}, profile);
	},

	get: function(cache_key, callback_func, profile) {
		if (typeof(profile)!='string' || !profile.length) {
			profile = me.profile;
		}
		this.init();

		var obj = {
			profile: me.profile,
			func: 'retrieve',
			args: [profile]
		};

		this.callback_args.push([cache_key, callback_func, profile, obj]);
		if (this.callback_args.length==1) {
			sendCopyData(null, D2Bot.handle, 0, JSON.stringify(obj));
		}
	},

	_write: function(profile, params) {
		var obj = {
			profile: me.profile,
			func: "store",
			args: [profile, 'cachehandler:'+JSON.stringify(params)]
		};
		sendCopyData(null, D2Bot.handle, 0, JSON.stringify(obj));
	},

	_erase: function(profile) {
		sendCopyData(null, D2Bot.handle, 0, JSON.stringify({
			profile: me.profile,
			func: "delete",
			args: [profile]
		}));
	},
	callback_args: []
};

var fileHandler = {
	lock: [],

	get: function(cache_key, /*callback_func, */profile) {
		if(typeof(profile)!='string' || !profile.length) profile = me.profile;

		var params = this._read(profile);
		if(typeof(params[cache_key])!='undefined') return params[cache_key];

		return null;
	},

	put: function(cache_key, cache_value, profile) {
		if(typeof(profile)!='string' || !profile.length) profile = me.profile;

		var params = this._read(profile);
		params[cache_key] = cache_value;
		this._write(profile, params);
	},

	delete: function(cache_key, profile) {
		if(typeof(profile)!='string' || !profile.length) profile = me.profile;
		var params = this._read(profile);
		delete(params[cache_key]);

		var i, ii = 0;
		for (i in params) {
			if(!params.hasOwnProperty(i)) continue;
			ii++;
		}

		if(!ii) this._erase(profile);
		else this._write(profile, params);
	},

	filename: function(profile) {
		return 'data/cache['+profile+'].json';
	},

	_read: function(profile) {
		var filename = this.filename(profile),
			params = {},
			i, buff;

		for (i=0; i<30; i++) {
			try {
				if(!FileTools.exists(filename)) return {};
				buff = FileTools.readText(filename);
				if(typeof(buff)=='string' && buff.match(/^filehandler\:/)) {
					params = JSON.parse(buff.replace(/^filehandler\:/, ''));
					if(params!==null && typeof(params)=='object') return params;
				}
				return {};
			} catch (e) {
				D2Bot.printToConsole(e.toString(), 9);
			}
			delay(100);
		}
		return {};
	},

	_write: function(profile, params)
	{
		var filename = this.filename(profile),
			buff = 'filehandler:' + JSON.stringify(params);

		for (var i=0; i<30; i++) {
			try {
				FileTools.writeText(filename, buff);
				return;
			} catch (e) {
				D2Bot.printToConsole(e.toString(), 9);
			}
			delay(100);
		}
	},

	_erase: function(profile)
	{
		if(typeof(profile)!='string' || !profile.length) profile = me.profile;
		var filename = this.filename(profile);
		if(!FileTools.exists(filename)) return;

		for (var i=0; i<30; i++) {
			try {
				FileTools.remove(filename);
				return;
			} catch (e) {
				D2Bot.printToConsole(e.toString(), 9);
			}
			delay(100);
		}
	}
};
