# some link
http://subversion.assembla.com/svn/d2bs/branches/bob-18/ <br />
http://subversion.assembla.com/svn/d2bs/branches/patch-114d-d2m/ <br />
https://github.com/D2etal/Etal/blob/master/D2NT/scripts/libs/controlInfo.ntl <br />

# D2_ColorCodes

`ÿc + [1,2,3,4,5,6,7,8,9,0,  ` ÿ is made with: ALT + 152
![d2_colorCodes](/image/D2_ColorCodes.jpg "d2 color code")
![d2_colorCodes](/image/LineClassColor.png "d2 color code")

```javascript
		case  46: // Delete
			if (!colorHooks) {
				var i, k, color, x, y, lines = 32, lineHeight = 18;
				colorHooks = [];
				colorTextHooks = [];
				colorBackground1 = new Box (400, 0, 800, 600, 0x0, 100, 2);
				for (k = 0; k < 8; k++) {
					x = k * 100 + 5;
					for (i = 0; i < lines; i++) {
						y = i * lineHeight + 20;
						color = k * lines + i;
						colorHooks.push(new Line(x, y, x + 60, y, color, false));
						colorTextHooks.push(new Text(color.toString(), x + 62, y + 5, 0x10, 8));
					}
				}
			} else {
				while(colorHooks.length) {
					colorHooks.shift().remove();
					colorTextHooks.shift().remove();
				}
				colorBackground1.remove();

				colorHooks = null;
			}
			break;
```
