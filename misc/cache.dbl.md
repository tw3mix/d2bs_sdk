
```javascript
js_strict(true);

var Cache = new function() {
	this.Load = function(name) {
		var path = 'cache/'+name+'.json';
		if (!FileTools.exists(path)) return undefined;
		var obj = eval('('+FileTools.readText(path)+')');
		return obj.data;
	};
	this.Save = function(name, data, validFor) {
		var obj = {
			
			data:data;
		};
		FileTools.writeText('cache/'+name+'.json',obj.toSource());
	};
};
```

<h2>Example of code</h2>

<pre>
    <div class="container">
        <div class="block two first">
            <h2>Your title</h2>
            <div class="wrap">
            //Your content
            </div>
        </div>
    </div>
</pre>
