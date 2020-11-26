//cachehandler.put(); .delete .get

var cacheHandler = {
    _init: false,
    init: function()
    {
        if(this._init===true) return;
        this._init = true;
        var thisObj = this;
        addEventListener('copydata', function(mode,msg){
            //print('mode: ' + mode + ' / msg: ' + msg);
            if(mode!=61732) return;
            var cache_value = null,
                params = {}, args;
            if(typeof(msg)=='string' && msg.match(/^cachehandler\:/))
                params = JSON.parse(msg.replace(/^cachehandler\:/, ''));
 
            // args[0] = cachekey, args[1]=callback_func, args[2] = profile
            args = thisObj.callback_args.shift();
 
 
            // cache value is undefined
            if(typeof(params[args[0]])!='string') params[args[0]] = null;
 
            // profile must be same
            /*if(typeof(params.profile)!='string') params.profile = args[2];
            if(args[2]==params.profile)*/
                args[1]( params[args[0]], params );
 
            if(thisObj.callback_args.length)
            {
                sendCopyData(null, D2Bot.handle, 0, JSON.stringify( thisObj.callback_args[0][3] ));
            }
        });
    },
    put:function(cache_key, cache_value, profile)
    {
        if(typeof(profile)!='string' || !profile.length) profile = me.profile;
        this.init();
 
        var thisObj = this;
        this.get(cache_key, function(dummy, params){
            params[cache_key] = cache_value;
 
            thisObj._erase(profile);
            thisObj._write(profile, params);
        }, profile);
    },
    delete: function(cache_key, profile)
    {
        if(typeof(profile)!='string' || !profile.length) profile = me.profile;
        this.init();
        var thisObj = this;
 
        this.get(cache_key, function(dummy, params){
            delete(params[cache_key]);
            var i, ii = 0;
            for(i in params)
            {
                if(!params.hasOwnProperty(i)) continue;
                ii++;
            }
            if(!ii) thisObj._erase(profile);
            else thisObj._write(profile, params);
        }, profile);
    },
    get: function(cache_key, callback_func, profile)
    {
        if(typeof(profile)!='string' || !profile.length) profile = me.profile;
        this.init();
 
        var obj = {
            profile: me.profile,
            func: 'retrieve',
            args: [profile]
        };
 
        this.callback_args.push([cache_key, callback_func, profile, obj]);
 
        if(this.callback_args.length==1)
            sendCopyData(null, D2Bot.handle, 0, JSON.stringify(obj));
    },
    _write: function(profile, params)
    {
        var obj = {
            profile: me.profile,
            func: "store",
            args: [profile, 'cachehandler:'+JSON.stringify(params)]
        };
        sendCopyData(null, D2Bot.handle, 0, JSON.stringify(obj));
    },
    _erase: function(profile)
    {
        sendCopyData(null, D2Bot.handle, 0, JSON.stringify({
            profile: me.profile,
            func: "delete",
            args: [profile]
        }));
    },
    callback_args: []
};
