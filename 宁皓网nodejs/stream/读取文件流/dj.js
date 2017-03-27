/**
 * @fileoverview 多趣公共扩展 JS 类 - 计时器相关
 * @author 徐立
 * $Id: dj.js 83 2015-04-01 01:47:40Z 徐立 $
 */

/**
 * @class 多趣公共计时器类
 * @param {String} instance 初始化实例名
 * @property {Num} interval 计时器运行间隔(ms)，默认值: 15
 * @property {Boolean} running 计时器是否正在运行
 * @desc 使用示例：
 * new djExtTimmer ( 'instance' );
 * instance.add ( ... );
 * instance.start ();
 * instance.stop ();
 */
function djExtTimmer ( instance )
{
	this.instance = instance;
	eval ( instance + ' = this;' );
};

djExtTimmer.prototype =
{
	aryTimmers : [], // 计时器对象数组
	interval : 15, // 计时器间隔(ms)
	timmer : null, // 计时器
	curTime : 0, // 当前计时
	running : false, // 是否正在执行

	///**
	//* 执行回调函数
	//*/
	doCallback : function()
	{
		var ob;
		var date = new Date();
		this.curTime = date.getTime ();
		date = null;
		for ( var i in this.aryTimmers )
		{
			ob = this.aryTimmers[i];
			if ( ob == null || ob.running == false )
			{
				ob = null;
				continue;
			}
			if ( this.curTime - ob.execTime >= ob.interval )
			{
				this.aryTimmers[i].execTime = this.curTime;
				if ( typeof ( ob.callback ) == 'function' )
				{
					ob.callback ();
				}
				else if ( typeof ( ob.callback ) == 'string' )
				{
					eval ( ob.callback );
				}
			}
		}
		ob = null;
	},

	/**
	 * @desc 添加计时器对象
	 * @type Num
	 * @param {String} callback 回调函数
	 * @param {Num} interval 执行间隔
	 * @param {Num} timmerId 指定计时器Id
	 * @param {Boolean} [boolRun=True] 是否立即开始执行
	 * @return {Num} 计时器对象序号
	 */
	add : function( callback, interval, timmerId, boolRun )
	{
		if ( boolRun == null ) boolRun = true;
		var lastId = this.aryTimmers.length;
		if ( timmerId != null && timmerId < lastId ) lastId = timmerId;

		var obj =
		{
			'callback' : callback, // 容器对象
			'interval' :  interval, // 执行间隔
			'execTime' : 0, // 上次执行时间
			'running' : boolRun // 执行状态
		};

		this.aryTimmers[lastId] = obj;		
		return lastId;
	},

	/**
	 * @desc 移除计时器对象
	 * @type Boolean
	 * @param {Num} intId 计时器对象ID
	 * @return {Boolean} 移除结果
	 */
	remove : function( intId )
	{
		var aryTimmers = this.aryTimmers[intId];
		if ( aryTimmers != null )
		{
			this.aryTimmers[intId] = null;
			// this.aryTimmers.splice ( intId, 1 );
		}
		return true;
	},

	///**
	//* @desc 清除计时器
	//* @type Boolean
	//* @return {Boolean} 清除结果
	//*/
	clear : function()
	{
		// 停止执行
		this.stop ();

		// 移除对象
		for ( var i in this.aryTimmers )
		{
			this.remove (i);
		}
		this.aryTimmers = [];
		return true;
	},

	/**
	 * @desc 开始执行计时器
	 * @param {Num} [intId] 计时器对象ID，不指定则全局执行
	 */
	start : function( intId )
	{
		if ( intId == null )
		{
			if ( this.timmer == null )
			{
				this.timmer = setInterval ( this.instance + '.doCallback()', this.interval );
				this.running = true;
				this.cntTime = 0;
				this.onStart ();
			}
		}
		else
		{
			this.aryTimmers[intId].running = true;
		}
	},

	/**
	 * @desc 停止计时器
	 * @param {Num} [intId] 计时器对象ID，不指定则全局停止
	 */
	stop : function( intId )
	{
		if ( intId == null )
		{
			// 清除计时器
			if ( this.timmer != null )
			{
				clearTimeout ( this.timmer );
				this.timmer = null;
				this.running = false;
				this.onStop ();
			}
		}
		else
		{
			this.aryTimmers[intId].running = false;
		}
	},

	/**
	 * @desc 执行开始触发事件
	 * @desc 外部定义
	 */
	onStart : function()
	{
	},

	/**
	 * @desc 执行停止触发事件
	 * @desc 外部定义
	 */
	onStop : function()
	{
	}
};

/**
 * @class 多趣公共动画类
 * @param {String} instance 初始化实例名
 * @property {Num} interval 动画播放间隔(ms)，默认值: 40
 * @property {Num} cntTime 动画当前播放时长(ms)
 * @property {Boolean} playing 动画是否正在播放
 * @property {Object} djExtTimmer 引用公共计时器实例
 * @desc 使用示例：
 * new djExtAni ( 'instance' );
 * new djExtTimmer ( 'instance.djExtTimmer' );
 * sprite = instance.add ( ... );
 * sprite.create ( ... );
 * instance.play ();
 * instance.stop ();
 */
function djExtAni ( instance )
{
	this.instance = instance;
	eval ( instance + ' = this;' );
	this.init ();
};

djExtAni.prototype =
{
	mc : [], // 动画对象数组
	timmer : null, // 计时器
	interval : 30, // 动画间隔
	cntTime : 0, // 播放内容长度计算
	curTime : 0, // 当前时间
	playing : false, // 是否正在播放
	djExtTimmer : null, // 可调用多趣公共计时器实例

	///**
	//* @desc 初始化动画类
	//*/
	init : function()
	{
		this.cntTime = 0;
		this.clear ();
	},

	///**
	//* @desc 播放帧
	//*/
	enterFrame : function()
	{
		var bgPos, mc, sprite;
		var date = new Date();
		this.curTime = date.getTime ();
		date = null;
		this.cntTime += this.interval;
		var row, col;

		for ( var n in this.mc )
		{
			mc = this.mc[n];
			if ( mc == null || mc.curSprite == null )
			{
				mc = null;
				continue;
			}

			sprite = mc.sprites[mc.curSprite];
			if ( sprite == null || sprite.playing == false )
			{
				mc = null;
				sprite = null;
				continue;
			}

			if ( this.curTime - sprite.execTime >= sprite.interval )
			{
				if ( sprite.rowSize > 0 )
				{
					row = parseInt ( sprite.curFrame / sprite.rowSize );
					col = sprite.curFrame - row * sprite.rowSize;
				}
				else
				{
					row = 0;
					col = sprite.curFrame;
				}

				bgPos = '-' + ( sprite.sizeW * col ) + 'px -' + ( sprite.sizeH * row ) + 'px';

				mc.container.style.backgroundPosition = bgPos;
				//mc.container.innerHTML = mc.curFrame;
				sprite.curFrame ++;
				if ( sprite.curFrame >= sprite.frames )
				{
					sprite.curFrame = 0;
				}
				sprite.execTime = this.curTime;
			}
		}

		mc = null;
		sprite = null;
	},

	/**
	 * @desc 添加动画对象
	 * @type Object
	 * @param {String} obContainer 容器对象
	 * @param {Num} sizeW 容器宽度
	 * @param {Num} sizeH 容器高度
	 * @param {Num} intFps 每秒帧数
	 * @return {Object} 动画对象
	 */
	add : function( obContainer, sizeW, sizeH, intFps )
	{
		var lastId = this.mc.length;
		if ( typeof ( obContainer ) == 'string' )
		{
			obContainer = document.getElementById ( obContainer );
		}

		
		if ( sizeW != null ) obContainer.style.width = sizeW + 'px';
		if ( sizeH != null ) obContainer.style.height = sizeH + 'px';
		if ( intFps == null ) intFps = 0;		

		this.mc[lastId] =
		{
			id : lastId, // 对象ID
			container : obContainer, // 容器对象
			sprites : {}, // 动画精灵
			curSprite : null, // 当前动画精灵Id
			sizeW : sizeW,
			sizeH : sizeH,

			/**
			 * @desc 创建动画精灵
			 * @param {String} spriteId 动画精灵名称
			 * @param {String} strResName 资源文件名
			 * @param {Num} intFrames 动画帧数
			 * @param {Num} intRowSize 每行图片数
			 * @param {Num} intFps 每秒帧数
			 * @param {Num} sizeW 容器宽度
			 * @param {Num} sizeH 容器高度
			 * @param {Boolean} boolPlay 是否直接播放
			 * @return {Num} 动画精灵Id
			 */
			create : function( spriteId, strResName, intFrames, intRowSize, intFps, sizeW, sizeH, boolPlay )
			{
				if ( boolPlay == null ) boolPlay = true;
				if ( intRowSize == null ) intRowSize = 0;
				if ( intFps == null ) intFps = this.intFps;
				if ( sizeW == null ) sizeW = this.sizeW;
				if ( sizeH == null ) sizeH = this.sizeH;

				interval = ( intFps == 0 ) ? this.interval : Math.ceil ( 1000 / intFps );

				this.sprites[spriteId] =
				{
					res :  strResName, // 资源文件名
					sizeW : sizeW,
					sizeH : sizeH,
					rowSize : intRowSize, // 每行图片数
					frames : intFrames, // 总帧数
					interval : interval, // 帧频率
					playing : boolPlay, // 播放状态
					execTime : 0, // 上次播放时间
					curFrame : 0 // 当前帧
				};

				if ( this.curSprite == null )
				{
					this.use ( spriteId );
				}
			},

			/**
			 * 切换当前动画精灵
			 * @param {String} spriteId 动画精灵名称
			 */
			use : function( spriteId )
			{
				this.curSprite = spriteId;
				var sprite = this.sprites[spriteId];
				sprite.execTime = 0;
				sprite.curFrame = 0;

				this.container.style.width = sprite.sizeW + 'px';
				this.container.style.height = sprite.sizeH + 'px';
				this.container.style.backgroundImage = 'url(' + sprite.res + ')';
				this.container.style.backgroundPosition = '';
			}
		};

		return this.mc[lastId];
	},

	/*

	/**
	 * @desc 移除动画对象
	 * @type Boolean
	 * @param {Num} intId 动画对象ID
	 * @return {Boolean} 移除结果
	 */
	remove : function( intId )
	{
		if ( this.mc[intId] != null )
		{
			this.mc[intId].container.parentNode.removeChild ( this.mc[intId].container );
			this.mc[intId] = null;
		}
		return true;
	},

	///**
	//* @desc 清除动画
	//* @type Boolean
	//* @return {Boolean} 清除结果
	//*/
	clear : function()
	{
		// 停止播放
		this.stop ();

		// 移除对象
		for ( var i in this.mc )
		{
			this.remove (i);
		}
		this.mc = [];
		return true;
	},

	/**
	 * @desc 播放动画
	 * @param {Num} intId 动画对象ID，不指定则全局播放
	 */
	play : function( intId )
	{
		if ( intId == null )
		{
			if ( this.timmer == null )
			{
				if ( this.djExtTimmer != null )
				{
					this.timmer = this.djExtTimmer.add ( this.instance + '.enterFrame()', this.interval );
					this.djExtTimmer.start ();
				}
				else
				{
					this.timmer = setInterval ( this.instance + '.enterFrame()', this.interval );
				}
				this.playing = true;
				this.cntTime = 0;
				this.onPlay ();
			}
		}
		else
		{
			this.mc[intId].playing = true;
		}
	},

	/**
	 * @desc 停止动画
	 * @param {Num} intId 动画对象ID，不指定则全局停止
	 */
	stop : function( intId )
	{
		if ( intId == null )
		{
			// 清除计时器
			if ( this.timmer != null )
			{
				if ( this.djExtTimmer != null )
				{
					this.djExtTimmer.remove ( this.timmer );
				}
				else
				{
					clearTimeout ( this.timmer );
				}
				this.timmer = null;
				this.playing = false;
				this.onStop ();
			}
		}
		else
		{
			this.mc[intId].playing = false;
		}
	},

	/**
	 * @desc 播放开始触发事件
	 * @description 外部定义
	 */
	onPlay : function()
	{
	},

	/**
	 * @desc 播放停止触发事件
	 * @description 外部定义
	 */	onStop : function()
	{
	}
};

/**
 * @overview 多趣 JS 基本类 - dj.js
 * @author 徐立
 * $Id: dj.js 83 2015-04-01 01:47:40Z 徐立 $
 */

/**
 * @class 多趣 JS 基本类
 * @param {String} [instance=dj] 初始化实例名
 * @see <a href='http://oa.duoqu.com/tools/djJSBase/demo.html' target='_blank'>http://oa.duoqu.com/tools/djJSBase/demo.html</a>
 * @property {String} apiRoot 接口根路径，默认值: http://www.duoqu.com
 * @property {String} cookieName 多趣登录信息 Cookie 名称，默认值: djCookie
 * @property {String} cookieDomain Cookie 域，默认值: .duoqu.com
 * @property {String} adVarName 推广渠道参数名称，默认值: q
 * @property {String} adCookieName 推广渠道保存 Cookie 名称，默认值: cookie_q
 * @property {String} ad 当前记录的推广渠道
 * @property {Object} queryParser 分析URL参数的结果
 * @property {Object} browser 获取浏览器版本的结果
 * @property {String} disabledClass 用于表示禁用的样式名
 * @desc 使用示例：（实际无需执行这段代码，dj.js 中已经初始化好一个 dj 实例）
 * new dj ( 'dj' );
 * dj.alert ( 'Hello World!' );
 */
function dj ( instance )
{
	if ( instance == null ) instance = 'dj';
	this._name = instance;
	eval ( instance + ' = this;' );

	// 判断是否加载多趣公共类
	this.djExtTimmer = null;
	if ( typeof ( djExtTimmer ) == 'function' )
	{
		new djExtTimmer ( this._name + '.djExtTimmer' );
	}

	// 保存渠道 Cookie
	this.queryParser = this.parseQuery ();
	if ( this.queryParser[this.adVarName] )
	{
		this.ad = this.queryParser[this.adVarName];
		this.cookie.set ( this.adCookieName, this.ad, this.cookieDomain, this.cookieExpire );
	}
	else
	{
		this.ad = this.cookie.get ( this.adCookieName );
	}

	// 获取浏览器版本
	this.getBrowser ();
};

dj.prototype =
{
	apiRoot : 'http://www.duoqu.com',
	djPath : '', // DJ 路径
	staticUrl : 'http://s0.static.duoqu.com/www', // 静态文件路径
	cookieName : 'dqUser', // Cookie 名称
	cookieDomain : '.duoqu.com', // Cookie 域
	cookieExpire : 7200, // Cookie 有效时间
	adVarName : 'q', // 渠道参数
	adCookieName : 'cookie_q', // 渠道 Cookie
	ad : '', // 当前渠道值
	queryParser : null,
	browser : '', // 浏览器版本
	disabledClass : 'disable',

	isIE : ( navigator.appVersion.indexOf("MSIE") != -1 ) ? true : false,
	isIE6 : ( navigator.appVersion.indexOf("MSIE 6") != -1 ) ? true : false,
	isWin : ( navigator.appVersion.toLowerCase().indexOf("win") != -1 ) ? true : false,
	isOpera : ( navigator.userAgent.indexOf("Opera") != -1 ) ? true : false,

	alertDialogId : 'alert-box', // 弹出提示对话框ID

	/**
	 * @desc 根据 id 获取对象
	 * @param {String} obId 对象Id，（首字符用 . 可根据 ClassName 获取对象，返回对象数组）
	 * @param {Object} parent 指定父对象
	 * @type Object
	 * @return {Object} DOM 对象
	 * @desc 使用示例：
	 * var ob = dj.$ ( 'obId' );
	 */
	$ : function( obId, parent )
	{
		if ( obId == undefined ) return null;
		if ( typeof ( obId ) == 'object' ) return obId;

		if ( parent == null ) parent = document;
		else if ( typeof ( parent ) == 'string' ) parent = document.getElementById ( parent );

		var target, chr, str, returns = [];

		chr = obId.substr ( 0, 1 );
		if ( chr == '.' )
		{
			var className = obId.substr ( 1, obId.length - 1 );
			var nodes, returns = [];

			try
			{
				nodes = parent.getElementsByClassName ( className );
				for ( var i = 0; i < nodes.length; i ++ ) returns.push ( nodes[i] );
			}
			catch( e )
			{
				nodes = parent.getElementsByTagName ( '*' );
				for ( var i = 0; i < nodes.length; i ++ )
				{
					var obClassName = ' ' + nodes[i].className + ' ';
					if ( obClassName.indexOf ( ' ' + className + ' ' ) >= 0 )
					{
						returns.push ( nodes[i] );
					}
				}
			}

			return returns;
		}
		else
		{
			if ( chr == '#' ) obId = obId.substr ( 1, obId.length - 1 );
			return document.getElementById ( obId );
		}
	},

	/**
	 * @desc 设置 document.domain 为一级域
	 */
	setMainDomain : function()
	{
		var host = this.getHost().split( '.' );
		document.domain = host[host.length - 2] + '.' + host[host.length - 1];
	},

	/**
	 * @desc alert 提示框
	 * @param {String} msg 提示文字
	 * @param {String} callback 回调代码
	 * @param {String} parent 父节点ID
	 */
	alert : function( msg, callback, parentId )
	{
		if ( typeof ( this.dialog ) == 'object' )
		{
			msg = msg.replace( /\n/g, '<br />' );

			var dlgId = this.dialog.open ( msg, this.alertDialogId, null, null, null, null, null, null, null, parentId );
			if ( callback ) this.dialog.setCloseCallback( dlgId, callback );
		}
		else
		{
			alert ( msg );

			var callbackType = typeof( callback );
			if ( callbackType == 'function' )
			{
				callback();
			}
			else if ( callbackType == 'string' )
			{
				try
				{
					eval ( callback );
				}
				catch(e) {};
			}
		}
	},

	/**
	 * @desc closeAlert 关闭提示框
	 */
	closeAlert : function()
	{
		this.dialog.close( this.alertDialogId );
	},

	/**
	 * @desc 提示框
	 * @param {String} msg 提示文字
	 * @param {String} value 默认内容
	 */
	prompt : function( msg, value )
	{
		return prompt ( msg, value );
	},

	/**
	 * @desc 格式化文本
	 * @param {String} str 文字内容
	 * @param {String} [arg1] 填充数据1
	 * @param {String} [arg2] 填充数据2
	 * @param {String} [...]
	 * @type String
	 * @return {String} 处理结果字符串
	 * @desc 使用示例：
	 * dj.sprintf ( '测试文本 %s', 'ABC' );
	 */
	sprintf : function()
	{
		var data = this.sprintf.arguments[0];
		if ( this.sprintf.arguments.length < 2 ) return data;
		for( var k = 1; k < this.sprintf.arguments.length; ++ k )
		{
			switch ( typeof ( this.sprintf.arguments[k] ) )
			{
				case 'string':
				{
					data = data.replace ( /%s/, this.sprintf.arguments[k] );
					break;
				}
				case 'number':
				{
					data = data.replace ( /%d/, this.sprintf.arguments[k] );
					break;
				}
				case 'boolean':
				{
					data = data.replace ( /%b/, this.sprintf.arguments[k] ? 'true' : 'false' );
					break;
				}
				default:
				{
					break;
				}
			}
		}
		return data;
	},

	/**
	 * @desc 格式化数字
	 * @param {Number} num 数字
	 * @param {Number} dec 小数位数
	 * @desc 使用示例：
	 * dj.number ( 123456 );
	 */
	number : function( num, dec )
	{
		var out = [], tmp = '', sp = 1000, parts = [], cent = '';
		var number = num.toString().replace( /,/g, '' );
		if ( isNaN( number ) || number == 0 ) return '0';

		if ( dec > 0 )
		{
			var m = Math.pow( 10, dec );
			number = Math.round( number * m ) / m;
		}

		while ( number != 0 )
		{
			tmp = number % sp;
			for ( i = 10; i < sp; i *= 10 ) if ( tmp < i ) tmp = '0' + tmp.toString();

			out.unshift( tmp );
			number = parseInt( number / sp );
		}

		out[0] = Math.floor( out[0] );
		return out.join( ',' ) + cent;
	},

	/**
	 * @desc 格式化数字（缩略显示）
	 * @param {Number} num 数字
	 * @desc 使用示例：
	 * dj.packNumber ( 123456 );
	 */
	packNumber : function( num )
	{
		var unit = { 100000000 : '亿', 10000000 : '千万', 10000 : '万' };
		var v = '';
		num = parseInt( num );
		
		for ( var k in unit )
		{
			if ( num >= k )
			{
				num /= k;
				v = unit[k];
				break;
			}
		}

		return this.number( num, 4 ) + v;
	},

	/**
	 * @desc 时间戳转日期
	 * @param {Integer} time 时间戳
	 * @param {Boolean} showSecond 是否显示秒
	 * @type String
	 * @return {String} 日期格式
	 */
	formatDate : function( time, showSecond )
	{
		var now = new Date( parseInt( time ) * 1000 );
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		if ( month < 10 ) month = '0' + month;
		var date = now.getDate();
		if ( date < 10 ) date = '0' + date;
		var hour = now.getHours();
		if ( hour < 10 ) hour = '0' + hour;
		var minute = now.getMinutes();
		if ( minute < 10 ) minute = '0' + minute;
		var second = now.getSeconds();
		if ( second < 10 ) second = '0' + second;

		var timeText = year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
		if ( showSecond == true )
		{
			timeText += ':' + second;
		}
		return timeText;
	},

	/**
	 * @desc 获取URL的域名部分
	 * @type String
	 * @return {String} 浏览器类型及版本
	 */
	getHost : function( url )
	{
		if ( url == null || url.substring( 0, 4 ) != 'http' ) url = window.location.href;
		return url.split( '/' )[2].toLowerCase();
	},

	/**
	 * @desc 获取浏览器类型及版本
	 * @type String
	 * @return {String} 浏览器类型及版本
	 */
	getBrowser : function()
	{
		var  browser = {};
		var  userAgent = navigator.userAgent.toLowerCase();
		var  s;

		(s = userAgent.match(/msie ([\d.]+)/)) 
		? browser.ie = s[1] : (s = userAgent.match(/firefox\/([\d.]+)/))
		? browser.firefox = s[1] : (s = userAgent.match(/chrome\/([\d.]+)/))
		? browser.chrome = s[1] : (s = userAgent.match(/opera.([\d.]+)/))
		? browser.opera = s[1] : (s = userAgent.match(/version\/([\d.]+).*safari/))
		? browser.safari = s[1] : 0;

		if  (browser.ie)
		{
			version = 'msie '  + browser.ie;
		}
		else if (browser.firefox)
		{
			version = 'firefox '  + browser.firefox;
		}
		else if (browser.chrome)
		{
			version = 'chrome '  + browser.chrome;
		}
		else if (browser.opera)
		{
			version = 'opera '  + browser.opera;
		}
		else if (browser.safari)
		{
			version = 'safari '  + browser.safari;
		}
		else
		{  
			version = 'unknown';
		}

		this.browser = version;
		return version;
	},

	/**
	 * @class 用于避免闭包调用
	 * @param {Function} func 回调函数
	 * @param {Array} args 回调参数数组
	 * @desc 使用示例：
	 * button.onclick = new dj.closure( my_func, [ param1, param2, param3, ... ] ).run;
	 * 等价于：
	 * button.onclick = function()
	 * {
			my_func( param1, param2, param3, ... );
	 * }
	 */
	closure : function( func, args )
	{
		this.run = function()
		{
			try
			{
				return func.apply ( this, args );
			}
			catch (e) {}
			
		};
	},

	/**
	 * @desc 获取样式
	 * @param {String/Object} ob 对象名或对象
	 * @param {String} 样式名
	 * @return {String} 样式值
	 */
	getStyle : function( ob, styleName )
	{
		ob = this.$( ob );
		if ( !ob ) return '';

		try
		{
			if ( this.isIE )
			{
				return ob.currentStyle[styleName];
			}
			else
			{
				return document.defaultView.getComputedStyle ( ob, null )[styleName];
			}
		}
		catch (e) {};
		return null;
	},

	/**
	 * @desc 获取 iframe 窗口
	 * @param {String/Object} frmId iframe ID 或 name
	 * @return {Object}
	 */
	getFrame : function( frmId )
	{
		try
		{
			var ob = document.getElementById( frmId );
			if ( ob && ob.contentDocument )
			{
				return ob.contentWindow;
			}
			else
			{ 
				return document.frames[frmId];
			}  
		}
		catch (e)
		{
			return null;
		}
	},

	/**
	 * @class Cookie 操作类
	 * @desc 使用示例：
	 * dj.cookie.set ( 'name', 'value' );
	 * dj.cookie.get ( 'name' );
	 * dj.cookie.remove ( 'name' );
	 */
	cookie :
	{
		/**
		 * @desc 保存 Cookie
		 * @param {String} name Cookie 名称
		 * @param {String} value Cookie 值
		 * @param {String} [domain] Cookie 域
		 * @param {String} [expireTime] Cookie 有效期（秒数）
		 * @desc 使用示例：
		 * dj.cookie.set ( 'name', 'value' );
		 */
		set : function( name, value, domain, expireTime )
		{
			var expireString = '';
			if ( expireTime == undefined ) expireTime = 0;
			if ( expireTime > 0 )
			{
				var expires = new Date();
				expires.setTime ( expires.getTime () + expireTime * 1000 );
				expireString = ' expires=' + expires.toGMTString() +  ';';
			}
			var cookie = name + '=' + escape(value) + ';' + expireString + ' path=/';
			if ( domain != null && domain.length > 0 )
			{
				if ( domain.substring ( 0, 1 ) != '.' ) domain = '.' + domain;
				cookie += '; domain=' + domain;
			}
			document.cookie = cookie;
		},

		/**
		 * @desc 获取 Cookie
		 * @param {String} name Cookie 名称
		 * @type String
		 * @return {String} Cookie 值
		 * @desc 使用示例：
		 * dj.cookie.get ( 'name' );
		 */
		get : function( name )
		{
			cookie_name = name + "=";
			cookie_length = document.cookie.length;
			cookie_begin = 0;
			while (cookie_begin < cookie_length)
			{
				value_begin = cookie_begin + cookie_name.length;
				if (document.cookie.substring(cookie_begin, value_begin) == cookie_name)
				{
					var value_end = document.cookie.indexOf (";", value_begin);
					if (value_end == -1)
					{
						value_end = cookie_length;
					}
					return unescape(document.cookie.substring(value_begin, value_end));
				}
				cookie_begin = document.cookie.indexOf(" ", cookie_begin) + 1;
				if (cookie_begin == 0)
				{
					break;
				}
			}
			return null;
		},

		/**
		 * @desc 删除 Cookie
		 * @param {String} name Cookie 名称
		 * @desc 使用示例：
		 * dj.cookie.remove ( 'name' );
		 */
		remove : function( name, domain )
		{
			this.set ( name, '', domain );
		}
	},

	/**
	 * @desc 获取 URL 变量
	 * @param {String} [url=当前页面] 网址
	 * @param {Object} [param] 覆盖参数
	 * @type Object
	 * @return {Object} 解析结果对象
	 * @desc 使用示例：
	 * var ret = dj.parseQuery ( 'http://www.duoqu.com/?q=abcd' );
	 * 结果：ret = { 'q' : 'abcd' }
	 */
	parseQuery : function( url, param )
	{
		if ( url == null ) url = window.location.href;
		if ( param == null ) param = {};

		var qs, parts, value, pos;
		pos = url.indexOf( '?' );
		pos = pos < 0 ? url.length : pos + 1;
		qs = url.substring ( pos, url.length );
		ret = {};

		if ( qs )
		{
			parts = qs.split ( '&' );
			for ( var i in parts )
			{
				value = parts[i].split ( '=' );
				ret[value[0]] = decodeURIComponent( value[1].replace( /\+/g, ' ' ) );
			}
		}

		for ( var i in param )
		{
			ret[i] = param[i];
		}
		return ret;
	},

	/**
	 * @desc 生成Query字符串
	 */
	makeQueryString : function( json )
	{
		if ( typeof ( json ) == 'string' ) return json;
		var arrQuery = [];
		for ( var i in json )
		{
			arrQuery.push ( i + '=' + encodeURIComponent ( json[i] ) );
		}
		return arrQuery.join ( '&' );
	},

	/**
	 * @desc 获取当前 URL
	 * @param {Object} [param] 覆盖Query参数
	 * @type String
	 * @return {String} URL 地址
	 * @desc 使用示例：
	 * var ret = dj.getUrl ( { page : 1 } );
	 * 结果：ret = 'http://www.duoqu.com/?page=1'
	 */
	getUrl : function( param )
	{
		var url = window.location.href;
		var pos = url.indexOf ( '?' );
		if ( pos < 0 ) pos = url.length;
		var baseUrl = url.substring ( 0, pos );
		var query = this.parseQuery( url, param );
		var queryString = this.makeQueryString( query );
		if ( queryString )
		{
			baseUrl += '?' + queryString;
		}
		return baseUrl;
	},

	/**
	 * @desc 提交表单到地址
	 * @param {String} URL 提交地址
	 * @param {Object} [param] 提交参数
	 * @param {String} [method] 提交方式，默认 GET
	 * @param {String} [method] 提交目标，默认 _self
	 * @type Void
	 */
	formTo : function( url, param, method, target )
	{
		if ( url == undefined ) url = window.location.href;
		var form = document.createElement( 'form' );
		document.body.appendChild( form );
		form.style.display = 'none';
		var query = dj.parseQuery( url, param );
		var item;
		for ( var i in query )
		{
			item = document.createElement( 'input' );
			item.name = i;
			item.value = query[i];
			form.appendChild( item );
		}
		form.method = method != undefined ? method : 'get';
		if ( target != undefined ) form.target = target;
		form.action = url;
		form.submit();
	},

	/**
	 * @desc 复制文本
	 * @param {String} txt 需要复制的文本内容
	 * @desc 使用示例：
	 * dj.copyText ( 'http://www.duoqu.com/' );
	 */
	copyText : function( txt )
	{
		if ( navigator.userAgent.toLowerCase().indexOf ( 'ie' ) > -1 )
		{
			clipboardData.setData ( 'Text', txt );
			this.alert ( '文字已复制到您的剪贴板中\n您可以使用 Ctrl+V 快捷键进行粘贴' );
		}
		else
		{
			this.prompt ( '请复制文字内容: ', txt );
		}
	},

	/**
	 * @desc 设为首页
	 * @param {String} [url=当前页面] 网址
	 * @desc 使用示例：
	 * dj.setHomepage ( 'http://www.duoqu.com/' );
	 */
	setHomepage : function( url )
	{
		if ( url == null ) url = window.location.href;
		if ( document.all )
		{
			document.body.style.behavior = 'url(#default#homepage)';
			document.body.setHomePage ( url );
		}
		else
		{
			try
			{
				netscape.security.PrivilegeManager.enablePrivilege ( 'UniversalXPConnect' );
			}
			catch( e )
			{
				try
				{
					var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components. interfaces.nsIPrefBranch);
					prefs.setCharPref ( 'browser.startup.homepage', url );
				}
				catch( e )
				{
					this.alert ( '您的浏览器不支持该操作，请使用浏览器菜单手动设置' );
				}
			}
		}
	},

	/**
	 * @desc 添加收藏
	 * @param {String} [title=当前页面标题] 站点名称
	 * @param {String} [url=当前页面] 网址
	 * @desc 使用示例：
	 * dj.addFav ( '多趣', 'http://www.duoqu.com/' );
	 */
	addFav : function( title, url )
	{
		if ( title == undefined ) title = document.title;
		if ( url == undefined ) url = window.location.href;
		try // IE
		{
			window.external.addFavorite ( url, title );
		}
		catch( e )
		{
			try // Firefox
			{
				window.sidebar.addPanel ( title, url, '' );
			}
			catch( e )
			{
				if ( navigator.userAgent.toLowerCase().indexOf ( 'opera' ) > -1 )
				{
					alert ( '请使用 Ctrl+T 快捷键将本页加入收藏夹' );
				}
				else
				{
					alert ( '请使用 Ctrl+D 快捷键将本页加入收藏夹' );
				}
			}
		}
	},

	/**
	 * @desc 为目标添加 class
	 * @param {String} ob 目标Id
	 * @param {String} className 添加样式名称
	 * @desc 使用示例：
	 * weeCB.addClass ( 'div1', 'on' );
	 */
	addClass : function( ob, className )
	{
		if ( typeof ( ob ) == 'string' ) ob = this.$( ob );
		if ( ob )
		{
			if ( ob.className == undefined )
			{
				ob.className = className;
			}
			else
			{
				if ( !this.hasClass ( ob, className ) )
				{
					ob.className += ( ob.className ? ' ' : '' ) + className;
				}
			}
		}
	},

	/**
	 * @desc 判断目标是否存在 class
	 * @param {String} ob 目标Id
	 * @param {String} className 样式名称
	 * @desc 使用示例：
	 * weeCB.hasClass ( 'div1', 'on' );
	 */
	hasClass : function( ob, className )
	{
		if ( typeof ( ob ) == 'string' ) ob = this.$( ob );
		if ( !ob || !ob.className ) return false;
		var obClassName = ' ' + ob.className + ' ';

		if ( obClassName.indexOf ( ' ' + className + ' ' ) < 0 )
		{
			return false;
		}
		return true;
	},

	/**
	 * @desc 为目标移除 class
	 * @param {String} ob 目标Id
	 * @param {String} className 移除样式名称
	 * @desc 使用示例：
	 * dj.removeClass ( 'div1', 'on' );
	 */
	removeClass : function( ob, className )
	{
		if ( typeof ( ob ) == 'string' ) ob = this.$( ob );
		if ( ob && ob.className != null )
		{
			var re = new RegExp ( "[ ]*" + className );
			ob.className = ob.className.replace ( re, '' );
		}
	},

	/**
	 * @desc 执行字符串中的 JS 代码
	 * @param {String} msg 内容
	 * @desc 使用示例：
	 * dj.execScript ( text );
	 */
	execScript : function ( msg )
	{
		var _re = /<script[^>]*>([^\x00]+)$/i;
		var _msgs = msg.split ( "<\/script>" );

		for ( var _i in _msgs )
		{
			var _strScript;
			if ( _strScript = _msgs[_i].match ( _re ) )
			{
				var _strEval = _strScript[1].replace ( /<!--/, '' );
				try
				{
					eval ( _strEval );
				}
				catch ( e ) {};
			}
		}
	},

	/**
	 * @desc 获取窗口尺寸
	 * @desc 使用示例：
	 * var size = dj.getWindowSize();
	 * alert( size.height );
	 */
	getWindowSize : function()
	{
		var size = {
			'width' : 0,
			'height' : 0
			};

		var isOpera = ( dj.browser.indexOf( 'opera' ) >= 0 );
		if ( !isOpera && ( window.innerWidth || window.innerHeight ) )
		{
			size.width = window.innerWidth;
			size.height = window.innerHeight;
		}
		else if ( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
		{
			size.width = document.documentElement.clientWidth;
			size.height = document.documentElement.clientHeight;
		}
		else
		{
			size.width = document.body.clientWidth;
			size.height = document.body.clientHeight;
		}

		return size;
	},

	/**
	 * @desc 添加 Flash 到目标
	 * @param {Object} target 目标对象
	 * @param {String} src Flash 地址
	 * @param {Object} attr 属性
	 * @param {Object} param 参数
	 * @desc 使用示例：
	 * dj.embedSwf ( 'div1', '/flash/test.swf', { id : 'flash1' }, { wmode : 'transparent' } );
	 */
	embedSwf : function( target, src, attr, param )
	{
		var html = [], attrs = [], params = [], strAttr, strParam, ob;

		if ( param == undefined ) param = {};
		if ( param.quality == undefined ) param.quality = 'high';
		if ( param.allowScriptAccess == undefined ) param.allowScriptAccess = 'always';
		if ( param.allowNetworking == undefined ) param.AllowNetworking = 'all';
		if ( param.allowFullScreen == undefined ) param.allowFullScreen = 'true';
		if ( param.menu == undefined ) param.menu = 'false';

		if ( this.isIE )
		{
			param.movie = src;
			for ( var i in attr ) attrs.push( i + '="' + attr[i] + '"' );
			for ( var i in param ) params.push( '<param name="' + i + '" value="' + param[i] + '" />' );
			strAttr = attrs.join( ' ' );
			strParam = params.join( ' ' );

			html.push( '<object codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ' + strAttr + '>' );
			html.push( strParam );
			html.push( '</object>' );
		}
		else
		{
			attr.src = src;
			for ( var i in attr ) attrs.push( i + '="' + attr[i] + '"' );
			for ( var i in param ) params.push( i + '="' + param[i] + '"' );
			strAttr = attrs.join( '' );
			strParam = params.join( '' );

			html.push( '<embed pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" ' + strAttr + ' ' + strParam + '></embed>' );
		}

		target = this.$( target );
		if ( !target )
		{
			document.write( html.join( '' ) );
		}
		else
		{
			ob = document.createElement( 'div' );
			ob.innerHTML = html.join( '' );
			target.appendChild( ob );
		}
	},

	/**
	 * @desc 为目标对象设置 transition 属性
	 * @param {String} ob 目标Id
	 * @param {String} transition transition 属性，留空则返回是否支持
	 * @type Boolean
	 * @return {Boolean} 是否成功或是否支持 transition 属性
	 * @desc 使用示例：
	 * dj.useTransition ( 'div1', 'all .5s ease-in-out' );
	 */
	useTransition : function( ob, transition )
	{
		if ( typeof ( ob ) == 'string' ) ob = this.$( ob );
		if ( ob )
		{
			var userAgent = navigator.userAgent.toLowerCase ();
			var support = userAgent.indexOf ( 'mozilla' ) > -1 || userAgent.indexOf ( 'webkit' ) > -1;
			if ( support )
			{
				if ( transition != null )
				{
					var props = [ 'transition', 'webkitTransition', 'MozTransition', 'OTransition' ];
					for ( var i in props )
					{
						ob.style[props[i]] = transition;
					}
				}
				return true;
			}
		}
		return false;
	},

	// 获取对象坐标
	/**
	 * @desc 获取对象坐标
	 * @param {String/Object} target 目标对象
	 * @return {Object} { top: ?, left: ? }
	 */

	getPos : function( target )
	{
		if ( typeof ( target ) == 'string' ) target = this.$( target );

		var pos = { 'top': target.offsetTop, 'left' : target.offsetLeft };
		target = target.offsetParent;
        while ( target )
        {
            pos.top += target.offsetTop;
            pos.left += target.offsetLeft;             
            target = target.offsetParent;
        }
		return pos;
	},

	/**
	 * @desc 为当前页面添加 Script
	 * @param {String} src Script 路径
	 * @param {Function} [callback] Script 加载完成后回调函数
	 * @desc 使用示例：
	 * dj.appendScript ( 'http://www.demo.com/test.js', function() { alert ( 'Done!' ); } );
	 */
	appendScript : function( src, callback )
	{
		var script = document.createElement ( 'script' );
		script.setAttribute ( 'type', 'text/javascript' );
		script.setAttribute ( 'src', src );

		document.body.appendChild ( script );

		script.onload = script.onreadystatechange = function()
		{
			if ( !this.readyState || this.readyState == 'loaded' || this.readyState == 'complete' )
			{
				this.onload = this.onreadystatechange = null;

				if ( callback != undefined ) callback ();

				// 过河拆桥
				this.parentNode.removeChild( this );
			}
		};

		return script;
	},

	/**
	 * @desc 添加事件监听
	 * @param {Object} target 监听对象
	 * @param {String} event 监听事件(load、mousemove、mousedown...)
	 * @param {Function} callback 触发函数
	 * @desc 使用示例：
	 * dj.addEvent ( window, 'load', function() { alert ( 'Window Loaded!' ); } );
	 */
	addEvent : function( target, event, callback )
	{
		if ( event.substr ( 0, 2 ) == 'on' )
		{
			event = event.substr ( 2, event.length - 2 );
		}
		if ( typeof ( document.attachEvent ) != 'undefined' )
		{
			target.attachEvent ( 'on' + event, callback );
		}
		else
		{
			target.addEventListener ( event, callback, false );
		}
	},

	/**
	 * @desc 生成随机字符串
	 * @param {Num} len 长度
	 * @return {String}
	 */
	randStr : function( len )
	{
		var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var rand, randStr = '';
		if ( len == null ) len = 8;

		for ( var i = 0; i < 8; i ++ )
		{
			rand = parseInt( str.length * Math.random() );
			randStr += str.substr( rand, 1 );
		}

		return randStr;
	},

	/**
	 * @desc 加密函数
	 * @param {String} str 字符串
	 * @param {String} key 密钥
	 */
	encryptPost : function( str, key )
	{
		str = escape( str );
		if ( key == null ) key = 'D' + '@' + 'Q' + 'a' + '_' + 'iDzX' + 'eW' + ')=F' + '+';
		var i, keyIndex, code, rand, newStr = [];
		for ( i = 0; i < str.length; i ++ )
		{
			rand = parseInt( 256 * Math.random() );
			keyIndex = i % key.length;
			code = ( str.charCodeAt( i ) + key.charCodeAt( keyIndex ) + rand ) % 256;
			newStr.push ( String.fromCharCode( rand ) );
			newStr.push ( String.fromCharCode( code ) );
		}
		return escape( newStr.join( '' ) );
	},

	/**
	 * @desc 为 dj 添加扩展
	 * @param {String} instance 实例名称
	 * @param {Object/Function} [prototype] 原型或函数，缺省则调用 dj[instance]
	 * @desc 使用示例：
	 * dj.extend ( 'instance', {
	 *	init : function()
	 *	{
	 *		alert ( 'Hello World!' );
	 *	}
	 * } );
	 * dj.instance.init ();
	 */
	extend : function( instance, prototype )
	{
		if ( prototype == null ) prototype = dj[instance];
		var type = typeof ( prototype );
		if ( type == 'function' )
		{
			this[instance] = new prototype;
		}
		else if ( type == 'object' )
		{
			this[instance] = prototype;
		}
		else
		{
			return false;
		}

		this[instance]._parentName = this._name;
		this[instance]._name = this._name + '.' + instance;
		this[instance]._parent = this;
		this[instance]._self = eval ( this[instance]._name );
		return true;
	}
};

new dj ();

/**
 * @class Ajax 类
 * @desc 使用示例：
 * dj.ajax.get ( 'http://www.duoqu.com', { ac: 'login', user: 'Eks' }, callbackFunc );
 */
dj.ajax =
{
	// 缓存控制
	noCache : true,

	/**
	 * @desc GET 方式调用目标 URL
	 * @param {String} sUrl : 目标 URL
	 * @param {Object/String} sQueryString 提交变量，建议使用对象
	 * @param {Function/String} callbackFunc 回调函数
	 * @param {String} [callbackParams] 回调函数参数
	 * @param {Num} [sRecvType] 返回值格式 0: 文本(当回调函数是 Function 类型时JSON字符串将自动转为对象), 1: XML
	 * @desc 使用示例：
	 * dj.ajax.get ( 'http://www.duoqu.com', { ac: 'login', user: 'Eks' }, callbackFunc );
	 */
	get : function( sUrl, sQueryString, callbackFunc, callbackParams, sRecvType )
	{
		if ( typeof( callbackFunc ) == 'string' && this._parent.getHost() != this._parent.getHost( sUrl ) )
		{
			return this.cross( sUrl, sQueryString, callbackFunc );
		}

		var ajax = new this.djAjax ( this.makeUrl( sUrl ), this.makeQueryString ( sQueryString ), callbackFunc, callbackParams, sRecvType );
		ajax.get ();
	},

	/**
	 * @desc POST 方式调用目标 URL
	 * @param {String} sUrl : 目标 URL
	 * @param {Object/String} sQueryString 提交变量，建议使用对象
	 * @param {Function/String} callbackFunc 回调函数
	 * @param {String} [callbackParams] 回调函数参数
	 * @param {Num} [sRecvType] 返回值格式 ( 0: 文本, 1: XML );
	 * @desc 使用示例：
	 * dj.ajax.post ( 'http://www.duoqu.com', { ac: 'login', user: 'Eks' }, callbackFunc );
	 */
	post : function( sUrl, sQueryString, callbackFunc, callbackParams, sRecvType )
	{
		if ( typeof( callbackFunc ) == 'string' && this._parent.getHost() != this._parent.getHost( sUrl ) )
		{
			return this.cross( sUrl, sQueryString, callbackFunc );
		}

		var ajax = new this.djAjax ( this.makeUrl( sUrl ), this.makeQueryString ( sQueryString ), callbackFunc, callbackParams, sRecvType );
		ajax.post ();
	},

	/**
	 * @desc 跨域调用目标 URL
	 * @param {String} sUrl : 目标 URL
	 * @param {Object/String} sQueryString 提交变量，建议使用对象
	 * @param {String} callbackFunc 回调函数
	 * @desc 使用示例：
	 * dj.ajax.cross ( 'http://www.duoqu.com', { ac: 'login', user: 'Eks' }, 'callbackFunc' );
	 */
	cross : function( sUrl, sQueryString, callbackFunc )
	{
		var re = /(v=json)|(\/v\/json)/g;
		if ( sUrl.match( re ) )
		{
			sUrl = sUrl.replace( re, '' );
			sUrl += ( sUrl.indexOf( '?' ) > -1 ) ? '&' : '?';
			sUrl += 'v=js&callback=' + callbackFunc;
		}

		var url = this.makeUrl( sUrl );

		var queryString = this.makeQueryString( sQueryString );
		if ( queryString )
		{
			queryString += '&';
			url += ( url.indexOf( '?' ) > -1 ) ? '&' : '?';
			url += queryString;
		}

		this._parent.appendScript( url );
	},

	makeUrl : function( url )
	{
		if ( this.noCache )
		{
			var time = new Date().getTime().toString().substr( 5, 8 ) + parseInt( Math.random() * 1000 ).toString();
			url += ( url.indexOf( '?' ) > -1 ) ? '&' : '?';
			url += '_rnd=' + time;
		}
		return url;
	},

	makeQueryString : function( json )
	{
		return this._parent.makeQueryString( json );
	},

	djAjax : function( sUrl, sQueryString, callbackFunc, callbackParams, sRecvType )
	{
		this.createXMLHttpRequest = function()
		{
			try
			{
				return new ActiveXObject ( "Msxml2.XMLHTTP" );
			} catch( e ) {};

			try
			{
				return new ActiveXObject ( "Microsoft.XMLHTTP" );
			} catch( e ) {};

			try
			{
				return new XMLHttpRequest ();
			} catch( e ) {};

			return null;
		};

		this.createQueryString = function()
		{
			var queryString = '';
			if ( this.QueryString != null && typeof ( this.QueryString ) != 'string' )
			{
				var elements = this.QueryString.elements;
				var pairs = new Array();
				for ( var i = 0; i < elements.length; i ++ )
				{
					if ( ( name = elements[i].name ) && ( value = elements[i].value ) )
					{
						pairs.push ( name + "=" + encodeURIComponent(value) );
					}
				}
				queryString = pairs.join ("&");
			}
			else
			{
				queryString = this.QueryString;
			}
			return queryString;
		};

		this.get = function()
		{
			sUrl = this.Url;
			var queryString = sUrl + ( sUrl.indexOf ('?') > -1 ? '&' : '?' ) + this.createQueryString();
			this.XmlHttp.open ( "GET", queryString, true );
			this.XmlHttp.send ( null );
		};

		this.post = function()
		{
			var sUrl = this.Url;
			var queryString = this.createQueryString ();
			this.XmlHttp.open ( "POST", sUrl, true );
			this.XmlHttp.setRequestHeader ( "Content-Type","application/x-www-form-urlencoded" );
			this.XmlHttp.send ( queryString );
		};

		this.handleStateChange = function( XmlHttp, sRecvType, callbackFunc, callbackParams )
		{
			if ( XmlHttp.readyState == 4 && XmlHttp.status == 200  )
			{
				Response = sRecvType ? XmlHttp.responseXML : XmlHttp.responseText;
				if ( callbackFunc != null )
				{
					var type = typeof ( callbackFunc );
					if ( type == 'string' )
					{
						callbackFunc = eval( callbackFunc );
					}

					try
					{
						eval ( 'var json=' + Response + ';' );
						if ( typeof ( json ) == 'object' ) Response = json;
					}
					catch( e ) {};

					try
					{
						callbackFunc ( Response, callbackParams );
					}
					catch( e ) {};
				}
			}
		};

		this.Url = sUrl;
		this.QueryString = sQueryString != null ? sQueryString : '';
		this.response; // 返回值

		this.XmlHttp = this.createXMLHttpRequest ();
		if ( this.XmlHttp == null )
		{
			alert ( 'Network Error!' );
			return false;
		}
		var objxml = this.XmlHttp;

		var obSelf = this;
		objxml.onreadystatechange = function()
		{
			obSelf.handleStateChange ( objxml, sRecvType, callbackFunc, callbackParams );
		};
	}
};
dj.extend ( 'ajax' );

/**
 * @class 跑马灯类
 * @desc 使用示例：
 * dj.marquee.add ( 'marquee1', 'up', 20, 1000 );
 * dj.marquee.start ();
 */
dj.marquee = 
{
	items : {},
	interval : 20,

	/**
	 * @desc 添加跑马灯
	 * @param {String} 跑马灯容器对象Id
	 * @param {String} [direction=up] 方向(up/down)
	 * @param {Num} [speed=20] 速度(ms, 越小越快)
	 * @param {Num} [stayTime=3000] 每行停留时间(ms)
	 * @param {String} [marqueeId] 指定跑马灯Id，避免重复添加
	 * @return {String} 跑马灯Id
	 * @desc 使用示例：
	 * dj.marquee.add ( 'marquee1', 'up', 20, 1000 ); // 添加跑马灯
	 */
	add : function( marqueeId, direction, speed, stayTime )
	{
		var ob = this._parent.$ ( marqueeId );
		if ( !ob ) return false;

		if ( direction == null ) direction = 'up';
		if ( speed == null ) speed = 20;
		if ( stayTime == null ) stayTime = 3000;
		var lineCount = Math.ceil ( ob.scrollHeight / ob.clientHeight );
		var contentHeight = parseInt ( lineCount * ob.clientHeight );
		ob.innerHTML += ob.innerHTML;

		if ( direction == 'down' ) ob.scrollTop = contentHeight;
		this.items[marqueeId] =
		{
			'ob' : ob,
			'direction' : direction,
			'speed' : speed,
			'stayTime' : stayTime,
			'lineCount' : lineCount,
			'contentHeight' : contentHeight,
			'countStay' : stayTime
		};

		return marqueeId;
	},

	/**
	 * @desc 移除跑马灯
	 * @param {String} [marqueeId] 指定跑马灯Id
	 * @desc 使用示例：
	 * dj.marquee.remove ( 'marquee1' ); // 移除跑马灯
	 */
	remove : function( marqueeId )
	{
		if ( !this.items[marqueeId] ) return false;

		this.items[marqueeId].ob.innerHTML = '';
		this.items[marqueeId] = null;
		
		return true;
	},

	/**
	 * @desc 开始跑马灯
	 * @desc 使用示例：
	 * dj.marquee.start ();
	 */
	start : function()
	{
		if ( this.timmer == null )
		{
			if ( this._parent.djExtTimmer != null )
			{
				this.timmer = this._parent.djExtTimmer.add ( this._name + '.move()', this.interval );
				this._parent.djExtTimmer.start ();
			}
			else
			{
				this.timmer = setInterval ( this._name + '.move()', this.interval );
			}
		}
	},

	/**
	 * @desc 停止跑马灯
	 * @desc 使用示例：
	 * dj.marquee.stop ();
	 */
	stop : function()
	{
		// 清除计时器
		if ( this.timmer != null )
		{
			if ( this._parent.djExtTimmer != null )
			{
				this._parent.djExtTimmer.remove ( this.timmer );
			}
			else
			{
				clearTimeout ( this.timmer );
			}
		}
	},

	///**
	//* @desc 跑马灯定时函数
	//* @desc 私有函数
	//*/
	move : function()
	{
		var flag, offsetHeight, item;

		for ( var i in this.items )
		{
			item = this.items[i];
			if ( !item ) continue;

			if ( item.countStay > 0 )
			{
				item.countStay -= this.interval;
			}
			else
			{
				if ( item.direction == 'up' )
				{
					offsetHeight = 0;
					flag = 1;
				}
				else
				{
					offsetHeight = item.contentHeight;
					flag = -1;
				}

				item.ob.scrollTop += flag;
				if ( item.ob.scrollTop == item.contentHeight - offsetHeight )
				{
					item.ob.scrollTop = offsetHeight;
				}
				if ( item.ob.scrollTop % item.ob.clientHeight == 0 )
				{
					item.countStay = item.stayTime;
				}
			}
		}
	}
};
dj.extend ( 'marquee' );

/**
 * @class 选项卡操作类
 * @desc 使用示例：
 * dj.tab.set ( 'tabDiv', 'tabClass', 'contentClass', 'activeClass', 'mouseover', 300 );
 */
dj.tab =
{
	tabs : {}, // 选项卡数组
	easeInterval : 15,
	easeSpeed : 3,
	padding: 0,
	cssTransition: 'height .5s ease-in-out, padding .5s ease-in-out',

	/**
	 * @desc 设置选项卡关联
	 * @param {String} tabId 选项卡容器对象Id
	 * @param {String} tabClass 选项卡标签样式名
	 * @param {String} contentClass 选项卡内容容器标签样式
	 * @param {String} [activeClass] 选项卡激活样式名
	 * @param {String} [event] 绑定事件(onmousemove / onclick)
	 * @param {Num} [delay=0] 延时触发(ms)
	 * @param {Boolean} [ease=False] 是否缓动
	 * @param {Num} [padding=0] 选项卡内容顶部和底部间距
	 * @param {Function} [callback] 点击标签后的回调函数
	 * @param {Num} [hideMode=1] 1=display:none, 2=visibility:hidden
	 
	 * @type Num
	 * @return {Num} 选项卡序号
	 * @desc 使用示例：
	 * dj.tab.set ( 'tabDiv', 'tabClass', 'contentClass', 'activeClass', 'mouseover', 300 );
	 * 本示例将 ID='tabDiv' 的 DOM 对象下 classname='tabClass' 的标签作为选项卡，将 classname='contentClasst' 的标签作为选项卡关联的内容
	 */
	set : function( tabId, tabClass, contentClass, activeClass, event, delay, ease, padding, callback, hideMode )
	{
		if ( event == null ) event = 'onclick';
		else if ( event.substr ( 0, 2 ) != 'on' ) event = 'on' + event;

		if ( delay == null || delay < 0 ) delay = 0;
		if ( ease == null ) ease = false;
		if ( padding == null ) padding = this.padding;
		if ( hideMode == null ) hideMode = 1;

		var contentHeight, open, state;
		var obTab = this._parent.$( tabId );
		if ( !obTab ) obTab = null;

		var data = [];
		var tabs = this._parent.$ ( '.' + tabClass, obTab );
		var tabContents = this._parent.$ ( '.' + contentClass, obTab );

		for ( var i in tabs )
		{
			// 如果支持 CSS3 则使用 transition
			/*
			if ( ease )
			{
				this._parent.useTransition ( tabContents[i], this.cssTransition );
			}
			 */

			open = this.tabs[tabId] && this.tabs[tabId].data[i] ? this.tabs[tabId].data[i].open : 0;
			data[i] =
			{
				'padding' : padding,
				'open' : open,
				'state' : 0,
				'hideMode' : hideMode,
				'position' : this._parent.getStyle( tabContents[i], 'position' )
			};
		}

		var timmer = this.tabs[tabId] ? this.tabs[tabId].timmer : null;
		var lastIndex = this.tabs[tabId] ? this.tabs[tabId].lastIndex : -1;

		this.tabs[tabId] =
		{
			'arguments' :
			{
				'tabClass' : tabClass,
				'contentClass' : contentClass,
				'activeClass' : activeClass,
				'event' : event,
				'delay' : delay,
				'ease' : ease,
				'padding' : padding
			},
			'tabs' : tabs,
			'tabContents' : tabContents,
			'timmer' : timmer,
			'lastIndex' : lastIndex,
			'callback' : callback,
			'data' : data
		};

		var selfName = this._name;
		var self = this._self;

		for ( var i = 0; i < tabs.length; i ++ )
		{
			tabs[i].setAttribute ( 'index', i );
			tabs[i][event] = function()
			{
				var index = this.getAttribute ( 'index' );
				if ( delay > 0 )
				{
					if ( self.timmer != null ) clearTimeout ( self.timmer );
					self.timmer = setTimeout ( selfName + '.active ( "' + tabId + '", ' + index + ', ' + ease + ' )', delay );
				}
				else
				{
					self.active ( tabId, index, ease );
				}
				window.focus();
			};

			tabs[i]['onmouseout'] = function()
			{
				if ( self.timmer != null ) clearTimeout ( self.timmer );
			};
		}

		this.active ( tabId, !ease ? 0 : this.tabs[tabId].lastIndex, ease, true );
	},

	/**
	 * @desc 重置选项卡关联，当改变选项卡数量时调用
	 * @param {String} tabId 选项卡DOM对象Id
	 * @desc 使用示例：
	 * dj.tab.reset ( 'tabDiv' );
	 */
	reset : function( tabId )
	{
		var curTab = this.tabs[tabId];
		if ( !curTab ) return false;
		var arg = curTab.arguments;
		this.set ( tabId, arg.tabClass, arg.contentClass, arg.activeClass, arg.event, arg.delay, arg.ease, arg.padding )
	},

	/**
	 * @desc 切换选项卡
	 * @param {String} tabId 选项卡Id
	 * @param {Num} index 激活的选项卡下标
	 * @param {Boolean} [ease=False] 是否缓动
	 * @param {Boolean} [keepOpen=False] 是否保持当前展开状态
	 * @desc 使用示例：
	 * dj.tab.active ( 'tabDiv', 2, false );
	 */
	active : function( tabId, index, ease, keepOpen )
	{
		if ( keepOpen == null ) keepOpen = false;
		var curTab = this.tabs[tabId];
		if ( !curTab ) return false;
		curTab.lastIndex = index;

		if ( !ease )
		{
			if ( index >= 0 && curTab.data[index] ) curTab.data[index].open = 1;
		}
		else if ( !keepOpen && index >= 0 )
		{
			curTab.data[index].open = 1 - curTab.data[index].open;
		}

		for ( var i = 0; i < curTab.tabs.length; i ++ )
		{
			curTab.data[i].state = 0;
			if ( i != index )
			{
				curTab.data[i].open = 0;
			}
			if ( curTab.data[i].open == 1 )
			{
				this._parent.addClass ( curTab.tabs[i], curTab.arguments.activeClass );
			}
			else
			{
				this._parent.removeClass ( curTab.tabs[i], curTab.arguments.activeClass );
			}
		}

		if ( !ease )
		{
			this.resize ( tabId, index, ease, keepOpen );
		}
		else if ( this._parent.djExtTimmer != null )
		{
			if ( curTab.timmer != null ) this._parent.djExtTimmer.remove ( curTab.timmer );
			curTab.timmer = this._parent.djExtTimmer.add ( this._name + '.resize ( "' + tabId + '", ' + index + ', ' + ease + ', ' + keepOpen + ' )', this.easeInterval, curTab.timmer );
			this._parent.djExtTimmer.start();
		}
		else
		{
			if ( curTab.timmer != null ) clearInterval ( curTab.timmer );
			curTab.timmer = setInterval ( this._name + '.resize ( "' + tabId + '", ' + index + ', ' + ease + ', ' + keepOpen + ' )', this.easeInterval );
		}

		if ( typeof curTab.callback == 'function' )
		{
			curTab.callback( index );
		}
	},

	resize : function( tabId, index, ease, keepOpen )
	{
		var countReady = 0;
		var curTab = this.tabs[tabId];
		var contentHeight, curHeight, targetHeight, offset, padding, closeTab = false;
		if ( ease == null ) ease = false;

		// 隐藏其他选项卡内容
		for ( var i = 0; i < curTab.tabs.length; i ++ )
		{
			if ( curTab.data[i].state == 1 )
			{
				countReady ++;
				continue;
			}

			if ( curTab.tabContents[i] )
			{
				if ( curTab.data[i].hideMode == 1 )
				{
					curTab.tabContents[i].style.display = '';
				}
				else
				{
					curTab.tabContents[i].style.visibility = '';
					curTab.tabContents[i].style.position = curTab.data[i].position;
				}

				curHeight = curTab.tabContents[i].style.height;
				// if ( ease ) this._parent.useTransition ( curTab.tabContents[i], '' );
				curTab.tabContents[i].style.height = '';
				contentHeight = parseInt ( curTab.tabContents[i].scrollHeight - parseInt ( curTab.tabContents[i].style.paddingTop ? curTab.tabContents[i].style.paddingTop : 0 ) - parseInt ( curTab.tabContents[i].style.paddingBottom ? curTab.tabContents[i].style.paddingBottom : 0 ) );
				contentHeight = Math.max( 2, contentHeight );

				curTab.tabContents[i].style.height = curHeight;
				// if ( ease ) this._parent.useTransition ( curTab.tabContents[i], this.cssTransition );

				if ( !curTab.data[i].open )
				{
					targetHeight = 0;
				}
				else
				{
					targetHeight = contentHeight;
				}

				curHeight = parseInt ( curTab.tabContents[i].style.height ? curTab.tabContents[i].style.height : targetHeight );

				if ( !ease || !this.easeInterval ) // || this._parent.useTransition ( curTab.tabContents[i] ) )
				{
					curHeight = targetHeight;
				}
				else
				{
					// offset = Math.max ( 1, Math.sqrt ( Math.abs ( targetHeight - curHeight ) ) );
					offset = Math.max( 1, Math.abs( targetHeight - curHeight ) / this.easeSpeed );
					if ( targetHeight < curHeight ) offset = - offset;
					curHeight += offset;
				}

				curTab.tabContents[i].style.overflow = 'hidden';
				if ( Math.abs ( curHeight - targetHeight ) <= 1 )
				{
					if ( curHeight >= contentHeight - 1 )
					{
						curHeight = contentHeight;
						curTab.tabContents[i].style.overflow = '';
					}
					else if ( curHeight <= 1 )
					{
						curHeight = 0;
						if ( curTab.data[i].hideMode == 1 )
						{
							curTab.tabContents[i].style.display = 'none';
						}
						else
						{
							curTab.tabContents[i].style.visibility = 'hidden';
							curTab.tabContents[i].style.position = 'absolute';
						}
					}
					curTab.data[i].state = 1;
				}

				if ( ease && this.easeInterval > 0 )
					curTab.tabContents[i].style.height = curHeight + 'px';

				if ( !keepOpen )
				{
					padding = curTab.data[i].padding * curHeight / contentHeight;
					curTab.tabContents[i].style.paddingTop = padding + 'px';
					curTab.tabContents[i].style.paddingBottom = padding + 'px';
				}
			}
		}

		if ( countReady >= curTab.tabs.length )
		{
			if ( this._parent.djExtTimmer != null )
			{
				this._parent.djExtTimmer.remove ( curTab.timmer );
			}
			else
			{
				clearInterval ( curTab.timmer );
			}
		}
	}
};
dj.extend ( 'tab' );

/**
 * @class 对话框类
 * @desc 使用示例：
 * dj.dialog.dialogClass = 'dj-dlg';
 * dj.dialog.closeClass = 'dj-dlg-close';
 * dj.dialog.closeText = '×';
 * dj.dialog.maskClass = 'dj-dlg-mask';
 * dj.dialog.open ( 'HTML', 'dialog1', 300, 200 );
 * dj.dialog.setCloseCallback( 'dialog1', function() { alert( 'I was closed' ); } );
 * dj.dialog.close ( 'dialog1' );
 */
dj.dialog =
{
	dialogs : {}, // 对话框容器数组
	dialogsPos : [], // 对话框位置数组
	dialogClass : 'dj-dlg', // 对话框默认 Class
	closeClass : 'dj-dlg-close', // 关闭按钮默认 Class
	closeText : '×', // 关闭按钮默认文字
	maskClass : 'dj-dlg-mask', // 遮罩默认 Class
	dialogIdPrefix : 'dj-dlg-', // 对话框 ID 前缀
	// maskBackground : '#000000', // 遮罩背景（已弃用）
	// maskOpacity : null, // 遮罩透明度（已弃用）

	timmerScroll : null, // 滚动计时器
	scrollDelay : 200, // 滚动触发延时(ms)

	closeCallback : {},

	dialogCount : 0,
	isFirst : true,
	overflow : '',

	/**
	 * @desc 设置关闭对话框时的回调函数，必须在 open 之后调用
	 * @param {String} dialogId 对话框Id
	 * @param {String/Function} callback 关闭对话框回调函数
	 * @desc 使用示例：
	 * dj.dialog.setCloseCallback( 'dialog1', function() { alert( 'I was closed' ); } );
	 */
	setCloseCallback : function( dialogId, callback )
	{
		if ( this.dialogs[dialogId] ) this.closeCallback[dialogId] = callback;
	},

	/**
	 * @desc 开启对话框
	 * @param {String} dialogHTML 对话框内容HTML
	 * @param {String} [dialogId] 对话框Id
	 * @param {Num} [width] 对话框宽度
	 * @param {Num} [height] 对话框高度
	 * @param {String} [top=50%] 对话框纵坐标，缺省为 50%
	 * @param {String} [left=50%] 对话框横坐标，缺省为 50%
	 * @param {String} [dialogClass=dj-dlg] 对话框样式名，缺省则应用 dj.dialog.dialogClass
	 * @param {String} [closeClass=dj-dlg-close] 对话框关闭按钮样式名，缺省则应用 dj.dialog.closeClass
	 * @param {String} [maskClass=dj-dlg-mask] 遮罩样式名，缺省则应用 dj.dialog.maskClass，传入 False 则不使用遮罩
	 * @param {String} [parentId] 父节点ID
	 * @type Num
	 * @return {Num} 对话框序号
	 * @desc 使用示例：
	 * dj.dialog.open ( 'HTML', 'dialog1', 300, 200 );
	 */
	open : function( dialogHTML, dialogId, width, height, top, left, dialogClass, closeClass, maskClass, parentId )
	{
		if ( dialogId == null ) dialogId = this.dialogCount;
		if ( dialogClass == null ) dialogClass = this.dialogClass;
		if ( closeClass == null ) closeClass = this.closeClass;
		if ( maskClass == false ) maskClass = null;
		else if ( maskClass == null ) maskClass = this.maskClass;

		var parent = null;
		if ( typeof parentId == 'string' ) parent = this._parent.$( parentId );
		if ( !parent ) parent = document.body;

		// 先关闭同名对话框
		this.close( dialogId );

		if ( this.isFirst )
		{
			var self = this._self;
			this._parent.addEvent ( window, 'scroll', self.onScroll );
			this._parent.addEvent ( window, 'resize', self.onScroll );
			this.isFirst = false;
		}

		this.dialogCount ++;

		var obDialog; // 对话框对象
		var obMask, maskFrame;
		var self = this._self;

		// this.overflow = this._parent.getStyle( parent, 'overflow' );
		// parent.style.overflow = 'hidden';

		// 创建新对话框
		if ( !this.dialogs[dialogId] )
		{
			if ( maskClass != null )
			{
				obMask = document.createElement ( 'div' );
				parent.appendChild ( obMask );
				obMask.className = maskClass;

				/*
				// 遮罩样式通过 CSS 控制
				obMask.style.position = 'absolute';
				obMask.style.left = '0px';
				obMask.style.top = '0px';
				if ( !this._parent.isIE6 )
				{
					obMask.style.width = parent.offsetWidth + 'px';
					obMask.style.height = parent.offsetHeight + 'px';
					obMask.style.background = this.maskBackground;
				}

				if ( this.maskOpacity )
				{
					obMask.style.filter = 'alpha(opacity=' + this.maskOpacity + ')';
					obMask.style.opacity = this.maskOpacity / 100;
				}
				*/

				obMask.onclick = function()
				{
					self.close ( dialogId );
				};
			}

			obDialog = document.createElement ( 'div' );
			parent.appendChild ( obDialog );

			obDialog.id = this.dialogIdPrefix + dialogId;
			obDialog.className = dialogClass;
			obDialog.style.position = 'absolute';

			if ( parent == document.body )
			{
				obDialog.style.visibility = 'hidden';
			}

			if ( width != null ) obDialog.style.width = width + 'px';
			if ( height != null ) obDialog.style.height = height + 'px';

			// 添加关闭按钮
			var closeButton = document.createElement ( 'a' );
			obDialog.appendChild ( closeButton );
			closeButton.className = closeClass;
			closeButton.innerHTML = this.closeText;

			closeButton.onclick = function()
			{
				self.close ( dialogId );
			};

			this.dialogs[dialogId] =
			{
				'ob' : obDialog,
				'obContent' : null,
				'obMask' : obMask,
				'closeButton' : closeButton
			};

			this.dialogsPos[dialogId] =
			{
				'top' : top,
				'left' : left
			};
		}
		else
		{
			obDialog = this.dialogs[dialogId].ob;

			// 移除上次内容
			this.dialogs[dialogId].obContent.parentNode.removeChild ( this.dialogs[dialogId].obContent );
		}

		// 添加内容
		var obContent = document.createElement ( 'div' );
		obDialog.appendChild ( obContent );
		obContent.innerHTML = dialogHTML;
		this.dialogs[dialogId].obContent = obContent;

		if ( top != null ) obDialog.style.top = top.toString().indexOf ( '%' ) > -1 ? top : ( parseInt ( top ) + 'px' );
		if ( left != null ) obDialog.style.left = left.toString().indexOf ( '%' ) > -1 ? left : ( parseInt ( left ) + 'px' );

		if ( parent == document.body )
		{
			setTimeout( this._name + '.fixPosition ( "' + dialogId + '" );', 50 );
		}

		return dialogId;
	},

	/**
	 * @desc 关闭对话框
	 * @param {String} dialogId 对话框Id
	 * @desc 使用示例：
	 * dj.dialog.close ( 'dialog1' );
	 */
	close : function( dialogId )
	{
		if ( this.dialogs[dialogId] )
		{
			this.dialogs[dialogId].obContent.parentNode.removeChild ( this.dialogs[dialogId].obContent );
			this.dialogs[dialogId].closeButton.onclick = null;
			this.dialogs[dialogId].closeButton.parentNode.removeChild ( this.dialogs[dialogId].closeButton );
			this.dialogs[dialogId].obMask.parentNode.removeChild ( this.dialogs[dialogId].obMask );
			this.dialogs[dialogId].ob.parentNode.removeChild ( this.dialogs[dialogId].ob );

			this.dialogs[dialogId].obContent = null;
			this.dialogs[dialogId].closeButton = null;
			this.dialogs[dialogId].obMask = null;
			this.dialogs[dialogId].ob = null;

			this.dialogs[dialogId] = null;
			delete( this.dialogs[dialogId] );

			this.dialogCount --;

			var closeCallback = this.closeCallback[dialogId];
			if ( closeCallback )
			{
				var callbackType = typeof( closeCallback );
				if ( callbackType == 'function' )
				{
					closeCallback();
				}
				else if ( callbackType == 'string' )
				{
					try
					{
						eval( closeCallback );
					}
					catch( e ) {};
				}

				this.setCloseCallback( dialogId, null );
			}
		}
	},

	///**
	//* @desc 修正对话框位置
	//* @desc 私有函数
	//*/
	fixPosition : function( dialogId )
	{
		if ( this.dialogCount < 1 ) return false;

		var dialogs = {};
		if ( dialogId == null )
		{
			dialogs = this.dialogs;
		}
		else
		{
			dialogs[dialogId] = this.dialogs[dialogId];
		}

		var marginTop, marginLeft, clientHeight, clientWidth;
		for ( var i in dialogs )
		{
			var dialog = dialogs[i];
			var dialogPos = this.dialogsPos[i];

			if ( !dialog || !dialog.ob ) continue;
			if ( dialog.ob.parentNode != document.body ) continue;

			var size = dj.getWindowSize();
			if ( dialogPos.top == null )
			{
				marginTop = ( document.documentElement && document.documentElement.scrollTop ) ? document.documentElement.scrollTop : document.body.scrollTop;
				dialog.ob.style.top = marginTop + size.height / 2 + 'px';
				dialog.ob.style.marginTop = ( - dialog.ob.offsetHeight / 2 ) + 'px';
			}

			if ( dialogPos.left == null )
			{
				marginLeft = ( document.documentElement && document.documentElement.scrollLeft ) ? document.documentElement.scrollLeft : document.body.scrollLeft;
				dialog.ob.style.left = marginLeft + size.width / 2 + 'px';
				dialog.ob.style.marginLeft = ( - dialog.ob.offsetWidth / 2 ) + 'px';
			}

			setTimeout( "dj.dialog.dialogs['" + i + "'].ob.style.visibility = 'visible';", 20 );
		}
	},

	///**
	//* @desc 监听窗口滚动
	//* @desc 私有函数
	//*/
	onScroll : function( flag )
	{
		var self = dj.dialog;
		if ( self.timmerScroll != null ) clearTimeout ( self.timmerScroll );
		if ( flag == true )
		{
			self.fixPosition ();
		}
		else
		{
			self.timmerScroll = setTimeout ( self._name + '.onScroll ( true )', self.scrollDelay );
		}
	}
};
dj.extend ( 'dialog' );

/**
 * @class 幻灯片类
 * @desc 使用示例：
 * dj.slide.add ( 'slide1', 'slide_item', 'thumb1', 'thumb_item', 'on', 4000 );
 * dj.slide.start ();
 */
dj.slide = 
{
	items : {},
	interval : 20,
	opacityStep : 2,

	/**
	 * @desc 添加幻灯片
	 * @param {String} slideId 幻灯片容器对象Id
	 * @param {String} slideItemClass 幻灯片条目样式名
	 * @param {String} thumbId 缩略图容器对象Id
	 * @param {String} [thumbItemNowClass=on] 缩略图停留条目样式名
	 * @param {String} [thumbItemTag=li] 缩略图条目标签
	 * @param {Num} [stayTime=4000] 停留时间(ms)
	 * @return {String} 幻灯片Id
	 * @desc 使用示例：
	 * dj.slide.add ( 'slide1', 'slide_item', 'thumb1', 'li', 'on', 4000 ); // 添加幻灯片
	 */
	add : function( slideId, slideItemClass, thumbId, thumbItemNowClass, thumbItemTag, stayTime )
	{
		var ob = this._parent.$( slideId );
		if ( !ob ) return false;

		if ( thumbItemNowClass == null ) thumbItemNowClass = 'on';
		if ( thumbItemTag == null ) thumbItemTag = 'a';
		if ( stayTime == null ) stayTime = 4000;

		var slides = this._parent.$( '.' + slideItemClass, slideId );
		var obThumb = this._parent.$( thumbId );
		var thumbItems = obThumb.getElementsByTagName( thumbItemTag );
		for ( var i in thumbItems )
		{
			if ( i > 0 ) slides[i].style.display = 'none';
			else dj.addClass( thumbItems[i], thumbItemNowClass );

			thumbItems[i].onclick = new this._parent.closure( this.active, [ slideId, i ] ).run;
		}

		this.items[slideId] =
		{
			'ob' : ob,
			'slides' : slides,
			'thumbItems' : thumbItems,
			'slideItemClass' : slideItemClass,
			'thumbItemTag' : thumbItemTag,
			'thumbItemNowClass' : thumbItemNowClass,
			'stayTime' : stayTime,
			'countStay' : stayTime,
			'nowIndex' : 0,
			'ready' : false
		};

		return slideId;
	},

	/**
	 * @desc 切换幻灯片
	 * @param {String} slideId 幻灯片Id
	 * @param {Num} index 序号
	 * @desc 使用示例：
	 * dj.slide.switch ( 'slide1', 2 ); // 切换到第2张幻灯片
	 */
	active : function( slideId, index )
	{
		var item = dj.slide.items[slideId];
		index = parseInt( index );
		if ( !item || index == item.nowIndex ) return false;
		item.countStay = item.stayTime;
		item.nowIndex = index;

		for ( var i = 0; i < item.thumbItems.length; i ++ )
		{
			if ( i == index )
			{
				dj.addClass( item.thumbItems[i], item.thumbItemNowClass );
			}
			else
			{
				dj.removeClass( item.thumbItems[i], item.thumbItemNowClass );
			}		
		}

		item.ready = true;
	},

	/**
	 * @desc 移除幻灯片
	 * @param {String} [slideId] 指定幻灯片Id
	 * @desc 使用示例：
	 * dj.slide.remove ( 'slide1' ); // 移除幻灯片
	 */
	remove : function( slideId )
	{
		if ( !this.items[slideId] ) return false;

		this.items[slideId] = null;
		
		return true;
	},

	/**
	 * @desc 开始播放
	 * @desc 使用示例：
	 * dj.slide.start ();
	 */
	start : function()
	{
		if ( this.timmer == null )
		{
			if ( this._parent.djExtTimmer != null )
			{
				this.timmer = this._parent.djExtTimmer.add ( this._name + '.play()', this.interval );
				this._parent.djExtTimmer.start ();
			}
			else
			{
				this.timmer = setInterval ( this._name + '.play()', this.interval );
			}
		}
	},

	/**
	 * @desc 停止幻灯片
	 * @desc 使用示例：
	 * dj.slide.stop ();
	 */
	stop : function()
	{
		// 清除计时器
		if ( this.timmer != null )
		{
			if ( this._parent.djExtTimmer != null )
			{
				this._parent.djExtTimmer.remove ( this.timmer );
			}
			else
			{
				clearTimeout ( this.timmer );
			}
		}
	},

	///**
	//* @desc 幻灯片定时函数
	//* @desc 私有函数
	//*/
	play : function()
	{
		var item, slideItem, nextIndex, opacity, newOpacity, countFinish;
		for ( var slideId in dj.slide.items )
		{
			item = dj.slide.items[slideId];
			if ( !item ) continue;

			item.countStay -= dj.slide.interval;
			if ( item.countStay <= 0 )
			{
				nextIndex = item.nowIndex + 1;
				if ( nextIndex >= item.slides.length ) nextIndex = 0;
				dj.slide.active( slideId, nextIndex );
			}

			if ( !item.ready ) continue;

			countFinish = 0;
			for ( var i in item.slides )
			{
				slideItem = item.slides[i];
				if ( slideItem.style.display == 'none' )
				{
					opacity = 0;
				}
				else
				{
					opacity = dj.getStyle( slideItem, 'opacity' ) * 100;
					if ( opacity == null || isNaN( opacity ) )
					{
						opacity = ( slideItem.style.display == 'none' ) ? 0 : 100;
						slideItem.style.filter = 'alpha(opacity=' + opacity + ')';
						slideItem.style.opacity = opacity / 100;
					}
				}

				newOpacity = opacity;
				if ( i == item.nowIndex )
				{
					slideItem.style.display = '';
					if ( opacity < 100 )
					{
						newOpacity = opacity + dj.slide.opacityStep;
					}
				}
				else if ( opacity > 0 )
				{
					newOpacity = opacity - dj.slide.opacityStep;
				}

				newOpacity = Math.max( 0, Math.min( 100, newOpacity ) );
				if ( newOpacity != opacity )
				{
					if ( newOpacity > 1 )
					{
						slideItem.style.filter = 'alpha(opacity=' + newOpacity + ')';
						slideItem.style.opacity = newOpacity / 100;
					}
					else
					{
						slideItem.style.opacity = '';
						slideItem.style.display = 'none';
					}
				}
				else
				{
					countFinish ++;
				}
			}

			if ( countFinish >= item.slides.length )
			{
				item.ready = false;
			}
		}
	}
};
dj.extend ( 'slide' );

/**
 * @class 图片分步加载类
 * @desc 使用示例：
 * dj.imageVision.init(
 * {
 *	 	'objects' : document.getElementsByTagName('img'),
 * 		'attr' : 'data-url',
 *	 	'className' : 'wimg'
 *	} );
 */
dj.imageVision = 
{
	cache : [],
	className : '',

	/**
	 * @desc 初始化
	 * @desc 使用示例：
	 * dj.imageVision.init(
	 * {
	 *	 	'objects' : document.getElementsByTagName('img'), // 图片对象数组
	 * 		'attr' : 'data-url', // 真实图片链接属性
	 *	 	'className' : 'wimg' // 图片隐藏样式
	 *	} );
	 */
	init : function( params )
	{
		var objects, attr, attrValue, ob;

		objects = params.objects;
		if ( !objects || objects.length < 1 ) return false;

		attr = ( params.attr == undefined ) ? 'data-url' : params.attr;
		this.className = ( params.className == undefined ) ? 'wimg' : params.className;

		for ( var i = 0; i < objects.length; i ++ )
		{
			ob = objects[i];
			attrValue = ob.getAttribute( attr );
			if ( attrValue )
			{
				this.cache.push(
				{
					object : ob,
					src : attrValue,
					state : 0
				} );
				ob.setAttribute( attr, '' );
			}
		}

		this.loading();
		if ( this._parent.isIE )
		{
			setTimeout( this.loading, 300 );
		}
		this._parent.addEvent ( window, 'scroll', this.loading );
	},

	loading : function()
	{
		var st = parseInt( window.pageYOffset || document.documentElement.scrollTop || document.body.scrolltop );
		if ( isNaN( st ) ) st = 0;

		var sth = st + dj.getWindowSize().height;

		var post, posb, o, self = dj.imageVision;
		for ( var i = 0; i < self.cache.length; i ++ )
		{
			if ( self.cache[i].state != 0 ) continue;
			o = self.cache[i].object;
			post = self._parent.getPos( o ).top;
			posb = post + o.offsetHeight;
			if ( ( post > st && post < sth ) || ( posb > st && posb < sth ) )
			{
				o.src = self.cache[i].src;
				self._parent.removeClass( o, self.className );
				self.cache[i].state = 1;
			}
			else
			{
				self._parent.addClass( o, self.className );
			}
		}
	}
};
dj.extend ( 'imageVision' );


/**
 * @overview 多趣登录类 - djLogin.js
 * @author 徐立
 * $Id: dj.js 83 2015-04-01 01:47:40Z 徐立 $
 */

/**
 * @class 多趣登录类
 * @property {String} loginApi 登录提交地址，默认值: /user/login/post/v/json
 * @property {String} logoutApi 退出登录地址，默认值: /user/login/quit/v/json
 * @property {String} serverApi 服务器列表接口，默认值: /game/server/index/v/json/g/{GAME_ID}/op/{OP_ID}
 * @property {String} serverMyApi 我的服务器列表接口，默认值: /game/server/my/v/json/g/{GAME_ID}
 * @property {String} serverPlayUrl 服务器登录接口，默认值: /game/play/index/g/{GAME_ID}/s/{SERVER_ID}/op/{OP_ID}
 * @property {String} serverPlayTarget 进入服务器目标窗口，默认值 _blank
 * @property {String} serverClassPrefix 服务器 li 样式前缀，后面跟标识 0:正常, 1:未开服, 2:维护中
 * @property {Boolean} serverWithGameName 服务器是否带游戏名
 * @property {String} form 登录表单Id
 * @property {String} html 登录表单 HTML 数组，第1个元素为登录前，第2个元素为登录后
 * @property {String} loginId 当前登录用户Id
 * @property {String} alertParentId 提示框父节点ID
 * @desc 包括登录表单生成和服务器列表获取
 * 使用示例：
 * dj.login.form = 'formLogin';
 * dj.login.html = [ '登录前HTML', '登录后HTML' ];
 * dj.login.callback = function() { }; // 设置登录提交后回调函数
 * dj.login.init ();
 */
dj.login =
{
	loginApi : '/user/login/post/v/json', // 登录提交地址
	logoutApi : '/user/login/quit/v/json', // 退出登录地址
	serverApi : '/game/server/index/v/json/op/{OP_ID}/g/{GAME_ID}', // 服务器列表接口
	serverMyApi : '/game/server/my/v/json/g/{GAME_ID}', // 服务器列表接口
	serverPlayUrl : '/game/play/index/op/{OP_ID}/g/{GAME_ID}/s/{SERVER_ID}', // 进入游戏地址
	serverPlayTarget : '_blank',
	serverClassPrefix : '_flag',
	serverWithGameName : true,
	lastLoginCookieName : 'dqL',

	alertParentId : 'login-alert',
	forceLogin : false, // 强制显示登录表单

	form : '', // 登录表单Id
	obForm : null, // 登录表单对象
	formElem :
	{
		username : null,
		password : null	
	}, // 用于保存用户名和密码对象

	html : [ '', '' ],

	hiddenVars : {}, // 隐藏域变量
	gameServers : {}, // 服务器列表对象

	loginId : 0, // 当前登录用户Id
	loginUsername : '', // 当前登录用户名
	userLevel : 0, // 当前登录用户级别
	tmpSession : '', // 未注册用户临时 Session
	extInfo : {}, // 用户扩展信息

	opName : '',

	messages :
	{
		'usernameEmpty' : '请填写您的用户名、邮箱地址或手机号码！',
		'passwordEmpty' : '请填写登录密码！',
		'usernameTips' : '填写用户名/邮箱/手机',
		'passwordTips' : '填写登录密码',
		'guest' : '游客',
		'serverNotOpen' : "本服务器将于 %s 开服，敬请期待！\n当前服务器时间为：%s",
		'serverStoped' : "本服务器正在停服维护中，预计开服时间：%s\n当前服务器时间为：%s",
		'serverFlagNotOpen' : "新服：%s开启",
		'serverFlagStoped' : "维护：%s开启",
		'unknownTime' : '即将',
		'dump' : ''
	},

	/**
	 * @desc 设置表单隐藏域
	 * @param {String} varName 隐藏域名称
	 * @param {String} value 隐藏域值
	 * @desc 使用示例：
	 * dj.login.setVar ( 'refer', 'http://www.duoqu.com' );
	 * 在 dj.login.init () 之前调用
	 */
	setVar : function( varName, value )
	{
		if ( value == null ) value = '';
		this.hiddenVars[varName] = value;
	},

	/**
	 * @desc 生成登录框HTML
	 * @param {String} [form] 登录表单Id，缺省则使用已赋值的 dj.login.form
	 * @param {Array} [html] 登录表单HTML数组，缺省则使用已赋值的 dj.login.html
	 * @desc 使用示例：
	 * dj.login.form = 'formLogin';
	 * dj.login.html = [ '登录前HTML', '登录后HTML' ];
	 * dj.login.init ();
	 */
	init : function( form, html )
	{
		if ( form == null ) form = this.form;
		if ( html == null ) html = this.html;

		form = this._parent.$ ( form );
		if ( !form ) return false;

		this.obForm = form;

		var cookie = this._parent.cookie.get ( this._parent.cookieName );
		var index;

		eval ( 'var ret = ' + cookie + ';' );

		if ( ret && ret[0] > 0 && !this.forceLogin )
		{
			this.loginId = ret[0];
			this.loginUsername = ret[1];
			this.userLevel = parseInt( ret[2] );
			if ( isNaN( this.userLevel) ) this.userLevel = 0;
			this.tmpSession = ret[3];
			if ( ret[4] )
			{
				var ext = ret[4].split( ',' );
				this.extInfo.emailBind = parseInt( ext[0] );
				this.extInfo.mobileBind = parseInt( ext[1] );
			}

			var username = this.loginUsername;
			if ( !username ) username = this.loginId;
			form.innerHTML = html[1].replace ( /{USERNAME}/g, username ).replace ( /{LEVEL}/g, this.userLevel );
		}
		else
		{
			this.loginId = 0;
			this.loginUsername = '';
			this.tmpSession = '';
			this.extInfo = {};

			form.innerHTML = html[0];

			this.formElem.username = form.username;
			this.formElem.password = form.password;

			try
			{
				if ( !form.username.onfocus )
				{
					form.username.onfocus = function()
					{
						var chk = dj.hasClass( this, dj.disabledClass );
						if ( chk )
						{
							dj.removeClass( this, dj.disabledClass );
							this.value = '';
						}
					};

					// form.username.onclick = this.inputOnClick;
				}

				if ( !form.username.onblur )
				{
					form.username.onblur = function()
					{
						if ( this.value.length == 0 )
						{
							dj.addClass( this, dj.disabledClass );
							this.value = dj.sprintf( dj.login.messages.usernameTips, dj.login.opName );
						}
					};
					form.username.onblur();
				}

				if ( !form.password.onfocus )
				{
					form.password.onfocus = this.passwordFocus;
					// form.password.onclick = this.inputOnClick;
					form.password.onkeyup = this.inputOnKeyUp;
				}

				if ( !form.password.onblur )
				{
					form.password.onblur = this.passwordBlur;
					form.password.onblur();
				}
			}
			catch (e) {};

			var self = this._self;

			try
			{
				var lastLogin = self._parent.cookie.get( self.lastLoginCookieName );
				if ( lastLogin )
				{
					form.username.value = lastLogin;
					// form.password.focus();
					self._parent.removeClass( form.username, dj.disabledClass );
				}
				/*
				else
				{
					form.username.focus();
				}
				*/
			}
			catch (e) {};

			form.onsubmit = function()
			{
				return self.post();
			};
		}
	},

	inputOnClick : function()
	{
	},

	inputOnKeyUp : function( event )
	{
		var keyCode = window.event ? window.event.keyCode : event.which;
		if ( keyCode == 13 )
		{
			dj.login.post();
		}
	},

	passwordFocus : function()
	{
		var ob = this;
		var type = ob.getAttribute( 'type' );
		if ( type == 'text' )
		{
			if ( dj.browser.match( /msie [5678]/i ) )
			{
				ob = dj.login.clonePassword( ob, 'password' );
				ob.focus ();
			}
			else
			{
				ob.setAttribute( 'type', 'password' );
			}

			dj.removeClass( ob, dj.disabledClass );
			ob.value = '';			
		}
	},

	passwordBlur : function()
	{
		var ob = this;
		if ( ob.value.length == 0 )
		{
			if ( dj.browser.match( /msie [5678]/i ) )
			{
				ob = dj.login.clonePassword( ob, 'text' );
			}
			else
			{
				ob.setAttribute( 'type', 'text' );
			}

			dj.addClass( ob, dj.disabledClass );
			ob.value = dj.sprintf( dj.login.messages.passwordTips, dj.login.opName );
		}
	},

	clonePassword : function( ob, type )
	{
		try
		{
			var newOb = document.createElement( '<input type="' + type + '">' );
			var attrs = { 'id' : '', 'name' : '', 'tabIndex' : '', 'className' : '', 'size' : '', 'maxLength' : '' };

			for ( var i in attrs ) attrs[i] = ob[i];
			ob.onfocus = null;
			ob.onclick = null;
			ob.onblur = null;
			ob.parentNode.insertBefore( newOb, ob );
			ob.parentNode.removeChild( ob );
			ob = null;

			for ( var i in attrs ) newOb[i] = attrs[i];
			dj.login.formElem.password = newOb;
			// dj.login.obForm.password = newOb;

			newOb.onfocus = dj.login.passwordFocus;
			// newOb.onclick = dj.login.inputOnClick;
			newOb.onkeyup = dj.login.inputOnKeyUp;
			newOb.onblur = dj.login.passwordBlur;
			return newOb;
		}
		catch (e) {};		
	},

	/**
	 * @desc 提交登录表单
	 * @type Boolean
	 * @return {Boolean} 检查结果
	 * @desc 使用示例：
	 * dj.login.post ( 'formLogin' );
	 */
	post : function()
	{
		var form = this.obForm;
		var item, checkEmpty = [ 'username', 'password' ];

		for ( var i = 0; i < checkEmpty.length; i ++ )
		{
			item = checkEmpty[i];
			if ( this.formElem[item].value == '' || this._parent.hasClass( this.formElem[item], this._parent.disabledClass ) )
			{
				this._parent.alert ( this.messages[item + 'Empty'], 'dj.login.obForm.' + item + '.focus()', this.alertParentId );
				return false;
			}
		}

		var query = {};
		for ( var i in form )
		{
			try
			{
				if ( typeof( form[i] ) == 'object' && form[i] && form[i].name && form[i].value )
				{
					if ( form[i].name == 'password' ) continue;
					query[form[i].name] = form[i].value;
				}
			}
			catch( e ) {};
		}

		query['password_enc'] = this._parent.encryptPost ( this.formElem.password.value );

		for ( var i in this.hiddenVars )
		{
			query[i] = this.hiddenVars[i];
		}

		// 记住上次登录帐号
		if ( !form.remember || form.remember && form.remember.checked )
		{
			this._parent.cookie.set( this.lastLoginCookieName, query['username'], this._parent.cookieDomain, 86400 * 365 );
		}
		else
		{
			this._parent.cookie.remove( this.lastLoginCookieName, this._parent.cookieDomain );
		}
		
		this._parent.ajax.post( dj.apiRoot + this.loginApi, query, this._name + '.loginCallback' );

		return false;
	},

	loginCallback : function( ret )
	{
		var self = dj.login;
		if ( ret && ret.actionName == 'quit' )
		{
			// 清除我的服务器
			for ( var i in self.gameServers )
			{
				self.gameServers[i].my = null;
			}
			self.loginId = 0;
		}

		if ( !self.forceLogin ) self.init();

		if ( ret && typeof( self.callback ) == 'function' )
		{
			self.callback( ret );
		}
	},

	/**
	 * @desc 获取输入框焦点
	 */
	focus : function()
	{
		if ( !this.formElem.username || !this.formElem.password ) return false;

		if ( this.formElem.username.value == '' || this.formElem.username.value == this.messages.usernameTips )
		{
			this.formElem.username.focus();
		}
		else
		{
			this.formElem.password.focus();
		}
	},

	/**
	 * @desc 退出登录
	 */
	logout : function()
	{
		this._parent.ajax.post( dj.apiRoot + this.logoutApi, null, this._name + '.loginCallback' );
	},

	/**
	 * function 获取服务器列表
	 * @param {Num} gameId 游戏Id
	 * @param {Function} callback 回调函数
	 * @param {Num} opId 运营商Id
	 * @desc 使用示例：
	 * dj.login.getGameServers ( 1, function( gs ) { alert ( gs ); } );
	 * 回调函数中的 gs 参数是一个对象，包含
	 *		gs.data : 服务器数据
	 *		gs.server : 服务器列表数组，已组合成 HTML，每个数组元素是一个 li 标签
	 *		gs.my : 最近登录服务器列表，已组合成 HTML，每个数组元素是一个 li 标签
	 *
	 *		gs.data 为二维数组，数组元素依次为：
	 *			0 : 服务器Id
	 *			1 : 服务器名称
	 *			2 : 服务器状态（1=内部测试,2=技术封测,3=删档内测,4=公测）
	 *			3 : 开服时间戳
	 *			4 : 开始停服时间戳
	 *			5 : 停服结束时间戳
	 *
	 * 例如上例中可通过 gs.server[0] 获取第一个服务器链接的 HTML
	 */
	getGameServers : function( gameId, callback, opId )
	{
		if ( opId == undefined ) opId = 1;
		this.getGameServersUserCallback = callback;

		var api = '';

		if ( !this.gameServers || !this.gameServers[gameId] || !this.gameServers[gameId].data )
		{
			api = dj.apiRoot + this.serverApi;
		}
		else if ( this.loginId > 0 && !this.gameServers[gameId].my  )
		{
			api = dj.apiRoot + this.serverMyApi;
		}

		if ( api )
		{
			api = api.replace ( /{GAME_ID}/g, gameId );
			api = api.replace ( /{OP_ID}/g, opId );

			var self = this._self;
			this._parent.ajax.post ( api, '', this._name + '.getGameServersCallback' );
		}
		else
		{
			callback ( this.gameServers[gameId] );
		}
	},

	/**
	 * function 获取服务器列表回调函数
	 * @param {Object} ret 回调数据
	 */
	getGameServersCallback : function( ret )
	{
        ret = {"controllerName":"game_server","actionName":"index","data":{"game_id":51,"op_id":1,"op_name":"\u591a\u8da3\u7f51","game_name":"\u51b3\u6218\u6b66\u6797","time":1478836422,"server":[["19","S19","4","1478743200","0","0","1"],["17","S17","4","1478682000","0","0","1"],["4","S4","4","1477879200","0","0","1"],["1","S1","4","1477879200","0","0","1"]]},"callBack":"","state":1};
		if ( !ret || !ret.data ) return false;

		var serverInfo, serverItem, url;
		var gameId = ret.data.game_id;
		var timeOffset = 0;

		var date = new Date();
		curTime = date.getTime () / 1000;

		timeOffset = parseInt( parseInt( ret.data.time ) - curTime );

		if ( !this.gameServers[gameId] )
		{
			this.gameServers[gameId] = { 'gameName' : ret.data.game_name, 'timeOffset' : timeOffset };
		}

		// 服务器列表
		if ( ret.data.server )
		{
			this.gameServers[gameId].data = {};
			for ( var i in ret.data.server )
			{
				this.addGameServerInfo( gameId, ret.data.server[i] );
			}

			this.gameServers[gameId].server = [];
			for ( var i in ret.data.server )
			{
				var opId = ret.data.server[i].length >= 7 ? ret.data.server[i][6] : 1;
				serverItem = this.makeServerLink( gameId, ret.data.server[i][0], opId );
				this.gameServers[gameId].server.push( serverItem );
			}
		}

		// 最近登录列表
		if ( ret.data.my )
		{
			var addToServer = {};
			for ( var i in ret.data.my )
			{
				var exist = this.addGameServerInfo( gameId, ret.data.my[i] );
				if ( !exist ) addToServer[i] = true;
			}

			this.gameServers[gameId].my = [];
			for ( var i in ret.data.my )
			{
				var opId = ret.data.my[i].length >= 7 ? ret.data.my[i][6] : 1;
				serverItem = this.makeServerLink( gameId, ret.data.my[i][0], opId );
				this.gameServers[gameId].my.push( serverItem );
				if ( addToServer[i] ) this.gameServers[gameId].server.unshift( serverItem );
			}
		}

		if ( this.getGameServersUserCallback )
		{
			this.getGameServersUserCallback( this.gameServers[gameId] );
		}
	},

	/**
	 * function 添加服务器信息
	 * @param {Integer} gameId 游戏Id
	 * @param {Array} serverInfo 服务器信息
	 */
	addGameServerInfo : function( gameId, serverInfo )
	{
		var opId = serverInfo.length >= 7 ? serverInfo[6] : 1;
		var key = opId + '-' + serverInfo[0];
		var exist = ( this.gameServers[gameId].data[key] != undefined );
		this.gameServers[gameId].data[key] =
		{
			'name' : serverInfo[1],
			'state' : serverInfo[2],
			'openTime' : serverInfo[3],
			'stopStartTime' : serverInfo[4],
			'stopFinishTime' : serverInfo[5],
			'open' : this._parent.formatDate( serverInfo[3] ),
			'stopStart' : this._parent.formatDate( serverInfo[4] ),
			'stopFinish' : this._parent.formatDate( serverInfo[5] ),
			'op_id' : opId
		};

		return exist;
	},

	/**
	 * function 获取服务器信息
	 * @param {Integer} gameId 游戏Id
	 * @param {Integer} serverId 服务器Id
	 * @param {Integer} opId 运营商Id
	 */
	getGameServerInfo : function( gameId, serverId, opId )
	{
		if ( opId == undefined ) opId = 1;
		return this.gameServers[gameId].data[opId + '-' + serverId];
	},

	/**
	 * function 生成进入服务器链接
	 * @param {Integer} gameId 游戏Id
	 * @param {Integer} serverId 服务器Id
	 * @param {Integer} opId 运营商Id
	 * @return {String} 服务器链接HTML
	 */
	makeServerLink : function( gameId, serverId, opId )
	{
		if ( opId == undefined ) opId = 1;
		var serverItem = '', openTime;
		var serverInfo = this.getGameServerInfo( gameId, serverId, opId );
		if ( serverInfo )
		{
			var target = this.serverPlayTarget != undefined ? this.serverPlayTarget : '_blank';
			var url = dj.apiRoot + this.serverPlayUrl;
			url = url.replace ( /{GAME_ID}/g, gameId );
			url = url.replace ( /{SERVER_ID}/g, serverId );
			url = url.replace ( /{OP_ID}/g, opId );

			var flagTip = '';
			var flag = this.getServerFlag( gameId, serverId, opId );
			var openTime = this.messages.unknownTime;

			if ( flag == 1 )
			{
				if ( serverInfo.openTime ) openTime = serverInfo.open + ' ';
				flagTip = this._parent.sprintf( this.messages['serverFlagNotOpen'], openTime );
			}
			else if ( flag == 2 )
			{
				if ( serverInfo.stopFinishTime ) openTime = serverInfo.stopFinish + ' ';
				flagTip = this._parent.sprintf( this.messages['serverFlagStoped'], openTime );
			}
			var className = this.serverClassPrefix + flag.toString();
			var serverName = serverInfo.name;
			if ( this.serverWithGameName )
			{
				serverName = this.gameServers[gameId].gameName + ' ' + serverName;
			}
			serverItem = '<li class="' + className + '"><a href="' + url + '" target="' + target + '" onclick="return ' + this._name + '.play(' + gameId + ',' + serverId + ', ' + opId + ')">' + serverName + '</a><span>' + flagTip + '</span></li>';
		}
		return serverItem;
	},

	/**
	 * function 获取服务器标识
	 * @param {Integer} gameId 游戏Id
	 * @param {Integer} serverId 服务器Id
	 * @param {Integer} opId 运营商Id
	 * @return {Integer} 服务器标识(0=正常,1=未开服,2=停服维护)
	 */
	getServerFlag : function( gameId, serverId, opId )
	{
		var date = new Date();
		curTime = parseInt( date.getTime () / 1000 );

		try
		{
			var serverInfo = this.getGameServerInfo( gameId, serverId, opId );
			if ( !serverInfo ) return 0;

			if ( !isNaN( server.timeOffset ) ) curTime += server.timeOffset;

			// 未开服
			if ( curTime < serverInfo.openTime )
			{
				return 1;
			}

			// 停服中
			else if ( serverInfo.stopStartTime > 0 && curTime >= serverInfo.stopStartTime && ( !serverInfo.stopFinishTime || curTime <= serverInfo.stopFinishTime ) )
			{
				return 2;
			}
		}
		catch( e ) {};

		return 0;
	},

	/**
	 * function 判断是否可以进入游戏
	 * @param {Integer} gameId 游戏Id
	 * @param {Integer} serverId 服务器Id
	 * @param {Integer} opId 运营商Id
	 */
	play : function( gameId, serverId, opId )
	{
		var flag = this.getServerFlag( gameId, serverId, opId );
		if ( flag == 0 )
		{
			return true;
		}
		else
		{
			var date = new Date();
			curTime = parseInt( date.getTime () / 1000 );

			var server = this.gameServers[gameId];
			var serverInfo = server.data[serverId];

			if ( !isNaN( server.timeOffset ) ) curTime += server.timeOffset;

			if ( flag == 1 )
			{
				this._parent.alert( this._parent.sprintf( this.messages.serverNotOpen, serverInfo.open, this._parent.formatDate( curTime ) ) );
			}
			else if ( flag == 2 )
			{
				this._parent.alert( this._parent.sprintf( this.messages.serverStoped, serverInfo.stopFinish, this._parent.formatDate( curTime ) ) );
			}

			return false;
		}
	},

	/**
	 * function 清除已获取的游戏服务器列表
	 * @param {Num} gameId 游戏Id（缺省则清空所有服务器列表）
	 * @desc 使用示例：
	 * dj.login.clearGameServers ( 1 );
	 */
	clearGameServers : function( gameId )
	{
		if ( gameId == null )
		{
			this.gameServers = {};
		}
		else
		{
			this.gameServers[gameId] = null;
		}
	}
};
dj.extend ( 'login' );

/**
 * @overview 多趣注册验证类 - djRegister.js
 * @author 徐立
 * $Id: dj.js 83 2015-04-01 01:47:40Z 徐立 $
 */

/**
 * @class 多趣注册验证类
 * @param {String} form 注册表单Id
 * @property {String} registerApi 注册提交地址，默认值: /user/register/post/v/json
 * @property {String} checkApi 注册提交地址，默认值: /user/check/{ITEM}/v/json
 * @property {Array} className 提示文字样式数组，默认值: [ 'tip-normal', 'tip-error', 'tip-passed', 'tip-waiting' ],
 * @property {Array} checkItems 需要验证的项目数组，默认值: [ 'Username', 'Password', 'PasswordConfirm', 'Email', 'Code' ,'IdCard', 'Realname' ]
 * @property {String} checkScript 注册信息 Ajax 验证脚本，默认值: passport_check.php
 * @desc 使用示例：
 * dj.register.checkItems = [ 'Username', 'Password', 'PasswordConfirm', 'Realname', 'IdCard' ];
 * dj.register.callback = function() { }; // 设置注册提交后回调函数
 * dj.register.init ( 'formRegister' );
 */
dj.register =
{
	registerApi : '/user/register/post/v/json', // 注册提交地址
	checkApi : '/user/check/{ITEM}/v/json', // 检验字段地址

	hiddenVars : {}, // 隐藏域变量

	className : [ 'tip-normal', 'tip-error', 'tip-passed', 'tip-waiting' ],
	checkItems : [ 'Username', 'Password', 'PasswordConfirm', 'Email', 'Code' ,'IdCard', 'Realname' ],
	checkScript : 'passport_check.php',
	

	itemFields :
	{
		'Username' : 'username',
		'Password' : 'password',
		'PasswordConfirm' : 'passwordcfm',
		'Email' : 'email',
		'Code' : 'code',
		'IdCard' : 'idcard',
		'Realname' : 'realname'
	},

	// 文字
	messages : {
		'OK' : 'OK',
		'Username' : '4 - 20 字符',
		'Password' : '6 - 20 字符',
		'PasswordConfirm' : '再次输入密码。',
		'Email' :'请在此输入您的真实邮箱',
		'Question' : '如不修改请留空',
		'Answer' : '如不修改请留空',
		'Code' : '填写 4 位数字验证码',
		'PasswordOld' : '请输入您当前的登录密码。',
		'IdCard' : '请填写身份证号码',
		'Realname' : '请填写真实姓名',
		'inRegister' : '注册中',
		'checkUsername' : '请填写登录用户名',
		'invalidUsername' : '请使用汉字、字母或数字',
		'numUsername' : '用户名不能为纯数字',
		'usernameInCheck' : '正在检测用户名',
		'usernameCheckOK' : '帐号可以成功注册',
		'usernameCheckFailed' : '帐号已经被使用',
		'emptyIdCard' : '请填写身份证号码',
		'idCardCheckOK' : '身份证填写正确',
		'invalidPasswordLength' : '密码长度必须为 6 - 20 字符',
		'passwordInCheck' : '正在检测密码...',
		'passwordCheckOK' : '密码填写正确',
		'passwordNotMatch' : '两次密码不一致, 请重新填写',
		'emptyPassword' : '请填写密码',
		'emptyEmail' : '请填写您的邮箱地址',
		'emailInCheck' : '正在检测邮箱地址...',
		'emailCheckOK' : '邮箱填写正确',
		'codeNotMatch' : '验证码不正确，请重新输入',
		'codeCheckOK' : '验证码填写正确',
		'mobileCodeNotMatch' : '手机验证码不正确，请重新输入',
		'mobileCodeCheckOK' : '',
		'emptyMobile' : '请填写手机号码',
		'invalidMobile' : '您的手机号码格式无效，请重新填写',
		'mobileCheckOK' : '手机号可以成功注册',
		'mobileInCheck' : '正在检测手机号...',
		'emptyRealname' : '请填写真实姓名',
		'invalidRealname' : '您填写的不是真实姓名',
		'invalidRealnameLength' : '您填写的不是真实姓名',
		'invalidFirstname' : '您填写的不是真实姓名',
		'realnameCheckOK' : '姓名填写正确',
		'invalidIdCardLength' : '您填写的身份证有误',
		'invalidIdCardBirth' : '您填写的身份证有误',
		'invalidIdCard' : '您填写的身份证有误',
		'invalidIdCardArea' : '您填写的身份证有误',
		'emptyCode' : '请填写验证码',
		'Dump' : ''
	},

	singleNames : '赵钱孙李周吴郑王冯陈褚卫付蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁锺徐邱骆高夏蔡田 樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄麴家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭历戎祖武符刘景詹束龙叶幸司韶郜黎蓟溥印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阳郁胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍却璩桑桂濮牛寿通 边扈燕冀僪浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逮盍益桓公寸贰皇侨彤竭端赫实甫集象翠狂辟典良函芒苦其京中夕税荤靖绪愈硕牢买但巧枚撒泰秘亥绍以壬森斋释奕姒朋求羽用占真穰翦闾漆贵代贯 旁崇栋告休褒谏锐皋闳在歧禾示是委钊频嬴呼大威昂律冒保系抄定化莱校么抗祢綦悟宏功庚务敏捷拱兆丑丙畅苟随类卯俟友答乙允甲留尾佼玄乘裔延植环矫赛昔侍度旷遇偶前由咎塞敛受泷袭衅叔圣御夫仆镇藩邸府掌首员焉戏可智尔凭悉进笃厚仁业肇资合仍九衷哀刑俎仵圭夷徭蛮汗孛乾帖罕洛淦洋邶郸郯邗邛剑虢隋蒿茆菅苌树桐锁钟机盘铎斛玉线针箕庹绳磨蒉瓮弭刀疏牵浑恽势世仝户闭才无书学愚本性雪霜烟寒少字桥板斐独千诗嘉扬善揭祈析赤紫青柔刚奇拜佛陀弥阿素长僧隐仙隽宇祭酒淡塔琦闪始星南天接波碧速禚腾潮镜似澄潭謇纵渠奈风春濯沐茂英兰檀藤枝检生折登驹骑貊虎肥鹿雀野禽飞节宜鲜粟栗豆帛官布衣藏宝钞银门盈庆喜及普建营巨望希道载声漫犁力贸勤革改兴亓睦修信闽北守坚勇汉练尉士旅同蚁止戢睢冼种涂肖己泣潜卷脱谬蹉赧浮顿说次错念夙斯完丹表聊源姓吾寻展出不五令将旗军行奉敬恭仪母堂丘义礼慈孝理伦卿问永辉位让尧依犹介承市所苑杞剧第零谌招续达忻六鄞战迟候宛励粘萨邝覃辜初楼城区局台原考妫纳泉老清德卑过麦曲竹百福言佟爱年笪谯哈墨召丛岳之冠宾香果有舜海归帅赏伯佴佘牟商后况亢缑楚晋蹇称诺来多繁戊朴回毓钦鄢开光操瑞眭泥运摩伟铁迮汝法闫琴盖逯库郏逢阴薄厉稽督仉',

	doubleNames : '万俟司马上官欧阳夏侯诸葛闻人东方赫连皇甫尉迟公羊澹台公冶宗政濮阳淳于单于太叔申屠公孙仲孙轩辕令狐乌雅范姜碧鲁张廖张简图门太史公叔乌孙完颜马佳佟佳钟离宇文长孙慕容司徒司空章佳那拉第五纳喇富察费莫南宫西门东门左丘梁丘微生羊舌呼延南门东郭子车司寇百里谷梁宰父夹谷拓跋壤驷乐正漆雕公西巫马端木颛孙 亓官鲜于锺离闾丘公良段干赫舍里萨嘛喇萨克达钮祜禄他塔喇喜塔腊库雅喇瓜尔佳舒穆禄索绰络叶赫那拉依尔觉罗额尔德特叶赫那兰爱新觉罗讷殷富察依尔根觉罗',

	areas : {
		11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
	},

	passed : false,
	currentUser : null,
	obLocked : [],

	/**
	 * @desc 初始化注册表单
	 * @param {String} form 注册表单Id
	 * @desc 使用示例：
	 * dj.register.init ( 'formRegister' );
	 */
	init : function( form )
	{
		form = this._parent.$ ( form );

		this.obForm = form;

		// 设置渠道
		if ( this._parent.adVarName )
		{
			this.setVar ( this._parent.adVarName, this._parent.ad );
		}

		var self = this._self;

		var field;
		for ( var i in this.checkItems )
		{
			field = this.obForm[this.itemFields[this.checkItems[i]]];
			if ( !field ) continue;

			field.setAttribute ( 'check_item', this.checkItems[i] );
			field.onfocus = function()
			{
				var checkItem = this.getAttribute ( 'check_item' );
				self.showTip ( checkItem );
			};
			
			field.onblur = function()
			{
				var checkItem = this.getAttribute ( 'check_item' );
				self['check' + checkItem]();
			};
		}

		this.showAllTips ();

		try
		{
			if ( this.obForm.username ) this.obForm.username.focus();
		}
		catch ( e ) 	{};		

		this.obForm.onsubmit = function()
		{
			self.post ( form );
			return false;
		};
	},

	/**
	 * @desc 设置表单隐藏域
	 * @param {String} varName 隐藏域名称
	 * @param {String} value 隐藏域值
	 * @desc 使用示例：
	 * dj.register.setVar ( 'refer', 'http://www.duoqu.com' );
	 * 在 dj.register.init () 之前调用
	 */
	setVar : function( varName, value )
	{
		if ( value == null ) value = '';
		this.hiddenVars[varName] = value;
	},

	/**
	 * @desc 检查注册表单
	 * @param {String} form 注册表单Id
	 * @desc 使用示例：
	 * dj.register.post ( 'formRegister' );
	 */
	post : function()
	{
		try
		{
			var form = this.obForm;
			this.passed = true;
			for ( var i = 0; i < this.checkItems.length; i ++ )
			{
				obj = document.getElementById ( "tip" + this.checkItems[i] );
				if ( obj && obj.className != this.className[2] )
				{
					var check = eval ( "this.check" + this.checkItems[i] + "()" );
					if ( check == 'checking' )
					{
						this.passed = false;
					}
					else
					{
						this.passed = this.passed && check;
					}
				}
			}

			if ( this.passed )
			{
				this.lockForm();

				var query = {};
				for ( var i in form )
				{
					try
					{
						if ( form[i] && typeof( form[i] ) == 'object' && form[i].name && form[i].value )
						{
							if ( form[i].name == 'password' || form[i].name == 'passwordcfm' || form[i].name == 'secure_answer' ) continue;
							query[form[i].name] = form[i].value;
						}						
					}
					catch ( e )
					{
						continue;
					};
				}

				query['password_enc'] = this._parent.encryptPost ( form.password.value );
				if ( form.secure_answer )
				{
					query['secure_answer_enc'] = this._parent.encryptPost ( form.secure_answer.value );
				}

				for ( var i in this.hiddenVars )
				{
					query[i] = this.hiddenVars[i];
				}

				this._parent.ajax.post( dj.apiRoot + this.registerApi, query, this._name + '.registerCallback' );
			}
		}
		catch( e ) {}

		return false;
	},

	registerCallback : function( ret )
	{
		dj.register.unlockForm();

		// 如果注册成功则删除广告渠道Cookie
		if ( !ret.data.error )
		{
			dj.cookie.set ( dj.adCookieName, '', dj.cookieDomain );
		}

		if ( typeof( dj.register.callback ) == 'function' )
		{
			dj.register.callback( ret );
		}
	},

	// 锁定表单
	lockForm : function()
	{
		var obInputs = this.obForm.getElementsByTagName ( 'input' );
		for ( var i = 0; i < obInputs.length; i ++ )
		{
			if ( obInputs[i].getAttribute ( 'type' ) == 'submit' || obInputs[i].getAttribute ( 'type' ) == 'image' )
			{
				try
				{
					this.obLocked[i] = obInputs[i];
					obInputs[i].disabled = true;					
				}
				catch ( e ) {}
			}
		}
	},

	// 解锁表单
	unlockForm : function()
	{
		for ( var i = 0; i < this.obLocked.length; i ++ )
		{
			try
			{
				this.obLocked[i].disabled = false;
			}
			catch ( e ) {}
		}
	},

	// 显示所有提示
	showAllTips : function()
	{
		for ( var i in this.checkItems )
		{
			var obj;
			if ( obj = document.getElementById ( 'tip' + this.checkItems[i] ) )
			{
				obj.innerHTML = this.messages[this.checkItems[i]];
			}
		}
	},

	// 显示提示信息
	showTip : function( chkItem, tipType, message )
	{
		var obj;
		if ( obj = document.getElementById ( 'tip' + chkItem ) )
		{
			if ( tipType == null ) tipType = 0;
			if ( message == null ) message = this.messages[chkItem];
			obj.style.display = '';
			obj.innerHTML = message;
			obj.className = this.className[tipType];
		}
	},

	// 隐藏提示信息
	hideTip : function( chkItem )
	{
		var obj;
		if ( obj = document.getElementById ( 'tip' + chkItem ) )
		{
			if ( obj.className != this.className[2] )
			{
				obj.style.display = "none";
			}
		}
	},

	// 检查用户名
	checkUsername : function( checkSystem )
	{
		var message = '';
		if ( checkSystem == null ) checkSystem = true;
		if ( this.obForm.username.value.length == 0 )
		{
			message = this.messages.checkUsername;
		}
		else if ( this.obForm.username.value.match ( /[`~!@#$%^&*()=+\[\]\\{}|:;\"\'<>,?\/]/ ) )
		{
			message = this.messages.invalidUsername;
		}
		else if ( this.obForm.username.value.match ( /^[0-9]+$/ ) )
		{
			message = this.messages.numUsername;
		}
		if ( message != '' )
		{
			this.showTip ( 'Username', 1, message );
			return false;
		}
		else if ( checkSystem )
		{
			this.checkUsernameSystem ();
			return 'checking';
		}
		return true;
	},

	// Ajax 检查用户名
	checkUsernameSystem : function()
	{
		this.showTip ( 'Username', 3, this.messages.usernameInCheck );
		this._parent.ajax.get ( dj.apiRoot + this.checkApi.replace( /{ITEM}/g, 'username' ), { 'username' : this.obForm.username.value }, this._name + '.callbackCheckUsername' );
	},

	// 检查用户名回调函数
	callbackCheckUsername : function( ret )
	{
		if ( !ret.data.error )
		{
			dj.register.showTip ( 'Username', 2, dj.register.messages.usernameCheckOK );
			return true;
		}
		else if ( ret.data.err_msg )
		{
			dj.register.showTip ( 'Username', 1, ret.data.err_msg );
			return false;
		}
		else if ( ret != '' )
		{
			dj.register.showTip ( 'Username', 1, dj.register.messages.usernameCheckFailed );
			return false;
		}
		else
		{
			dj.register.hideTip ( 'Username' );
		}
	},

	// 检查身份证号
	checkIdCard : function( checkSystem, form )
	{
		if ( form == null ) form = this.obForm;
		var idcard = form.idcard.value;

		var message = '';
		if ( checkSystem == null ) checkSystem = true;
		if ( form.idcard.value.length == 0 )
		{
			message = this.messages.emptyIdCard;
		}
		if ( message != '' )
		{
			this.showTip ( 'IdCard', 1, message );
			return false;
		}
		else if ( checkSystem )
		{
			this.checkIdCardSystem ( form );
			return 'checking';
		}
		return true;
	},

	// Ajax 检查身份证号
	checkIdCardSystem : function( form )
	{
		if ( form == null ) form = this.obForm;
		this.callbackCheckIdCard ( this.isValidIdCard ( form.idcard.value.toLowerCase() ) );
	},

	// 检查身份证回调函数
	callbackCheckIdCard : function( ret )
	{
		if ( !ret.data.error )
		{
			dj.register.showTip ( 'IdCard', 2, dj.register.messages.idCardCheckOK );
			return true;
		}
		else if ( ret.data.err_msg )
		{
			dj.register.showTip ( 'IdCard', 1, ret.data.err_msg );
			return false;
		}
		else
		{
			dj.register.hideTip ( 'IdCard' );
		}
	},

	isValidIdCard : function( idCard )
	{
		var y, jym;
		var s,m;
		var idCardArray = new Array();
		idCardArray = idCard.split ( "" );

		// 地区检验
		if ( this.areas[parseInt(idCard.substr(0,2))] == null ) return this.result( this.messages.invalidIdCardArea );

		//身份号码位数及格式检验
		switch ( idCard.length )
		{
			case 15:
			{
				if ( (parseInt(idCard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idCard.substr(6,2))+1900) % 100 == 0 && (parseInt(idCard.substr(6,2))+1900) % 4 == 0 ) )
				{
					ereg = /^[1-9][0-9] {5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])| (04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
				}
				else
				{
					ereg=/^[1-9][0-9]{5}[0-9]{2} ((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]| [1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
				}
				if ( ereg.test ( idCard ) ) return this.result();
				else return this.result( this.messages.invalidIdCardBirth );
				break;
			}
			case 18:
			{
				if ( parseInt(idCard.substr(6,4)) % 4 == 0 || (parseInt(idCard.substr(6,4)) % 100 == 0 && parseInt(idCard.substr(6,4))%4 == 0 ) )
				{
					ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9xx]$/; //闰年出生日期的合法性正则表达式
				}
				else
				{
					ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9xx]$/; //平年出生日期的合法性正则表达式
				}
				
				if ( ereg.test ( idCard ) )
				{
					//测试出生日期的合法性
					//计算校验位
					s = (parseInt(idCardArray[0]) + parseInt(idCardArray[10])) * 7
					+ (parseInt(idCardArray[1]) + parseInt(idCardArray[11])) * 9
					+ (parseInt(idCardArray[2]) + parseInt(idCardArray[12])) * 10
					+ (parseInt(idCardArray[3]) + parseInt(idCardArray[13])) * 5
					+ (parseInt(idCardArray[4]) + parseInt(idCardArray[14])) * 8
					+ (parseInt(idCardArray[5]) + parseInt(idCardArray[15])) * 4
					+ (parseInt(idCardArray[6]) + parseInt(idCardArray[16])) * 2
					+ parseInt(idCardArray[7]) * 1
					+ parseInt(idCardArray[8]) * 6
					+ parseInt(idCardArray[9]) * 3 ;
					y = s % 11;
					m = "f";
					jym = "10x98765432";
					m = jym.substr(y,1); //判断校验位
					if ( m == idCardArray[17] ) return this.result();
					else return this.result( this.messages.invalidIdCard );
				}
				else return this.result( this.messages.invalidIdCardBirth );
				break;
			}
			default:
			{
				return this.result( this.messages.invalidIdCardLength );
				break;
			}
		}
	},

	// 检查密码
	checkPassword : function()
	{
		var message = '';
		if ( this.obForm.password.value == '' )
		{
			message = this.messages.emptyPassword;
		}
		else if ( this.obForm.password.value.length < 6 || this.obForm.password.value.length > 20 )
		{
			message = this.messages.invalidPasswordLength;
		}
		if ( message != '' )
		{
			this.showTip ( 'Password', 1, message );
			return false;
		}
		else
		{
			this.showTip ( 'Password', 2, this.messages.passwordCheckOK );
			return true;
		}	
	},

	// 检查密码确认
	checkPasswordConfirm : function()
	{
		var message = '';
		if ( this.obForm.passwordcfm.value != this.obForm.password.value )
		{
			message = this.messages.passwordNotMatch;
		}
		else if ( this.obForm.password.value == '' )
		{
			message = this.messages.emptyPassword;
		}
		
		if ( message != '' )
		{
			this.showTip ( 'PasswordConfirm', 1, message );
			return false;
		}
		else
		{
			this.showTip ( 'PasswordConfirm', 2, this.messages.passwordCheckOK );
			return true;
		}
	},

	// 检查邮箱
	checkEmail : function( username, checkSystem )
	{
		var message = '';
		checkSystem = checkSystem != null ? checkSystem : true;
		if ( this.obForm.email.value.length == 0 )
		{
			message = this.messages.emptyEmail;
		}
		if ( message != '' )
		{
			this.showTip ( 'Email', 1, message );
			return false;
		}
		else if ( checkSystem )
		{
			this.checkEmailSystem ( username );
			return 'checking';
		}
		return true;
	},

	checkEmailSystem : function( username )
	{
		if ( username == null ) username = this.currentUser;
		this.showTip ( 'Email', 3, this.messages.emailInCheck );
		this._parent.ajax.get ( dj.apiRoot + this.checkApi.replace( /{ITEM}/g, 'email' ), { 'email' : this.obForm.email.value }, this._name + '.callbackCheckEmail' );
	},

	callbackCheckEmail : function( ret )
	{
		if ( !ret.data.error )
		{
			dj.register.showTip ( 'Email', 2, dj.register.messages.emailCheckOK );
			return true;
		}
		else if ( ret.data.err_msg )
		{
			dj.register.showTip ( 'Email', 1, ret.data.err_msg );
			return false;
		}
		else
		{
			dj.register.hideTip ( 'Email' );
		}
	},

	// 检查验证码
	checkCode : function()
	{
		if ( this.obForm.code.value == '' )
		{
			this.showTip ( 'Code', 1, this.messages.emptyCode );
			return false;
		}
		else
		{
			// this.showTip ( 'Code', 2, this.messages.codeCheckOK );
			return true;
		}
	},

	// 检查手机验证码
	checkMobile_code : function()
	{
		this.checkMobile();
		var Mobilecode = this._parent.cookie.get ( 'Mobilecode' ) ? this._parent.cookie.get ( 'Mobilecode' ) : '';
		if ( this.obForm.mobile_code.value.toUpperCase () != Mobilecode.toUpperCase () )
		{
			this.showTip ( 'Mobile_code', 1, this.messages.mobileCodeNotMatch );
			document.getElementById('mesMobilecode').style.display = '';
			return false;
		}
		else
		{
			this.showTip ( 'Mobile_code', 2, this.messages.mobileCodeCheckOK );
			document.getElementById('mesMobilecode').style.display = '';
			return true;
		}
	},

	// 检查手机号码
	checkMobile : function(checkSystem)
	{
		var message = '';
		if ( checkSystem == null ) checkSystem = true;
		if ( this.obForm.mobile.value.length == 0)
		{
			message = this.messages.emptyMobile;
		}
		else if ( !this.obForm.mobile.value.match ( /^[0-9]{11}$/ ) )
		{
			message = this.messages.invalidMobile;
		}
		if ( message != '' )
		{
			this.showTip ( 'Mobile', 1, message );
			return false;
		}
		else if ( checkSystem )
		{
			this.checkMobileSystem ();
			return 'checking';
		}
		return true;
	},
	
	// 检查手机号回调函数
	callbackCheckMobile : function( ret )
	{
		if ( !ret.data.error )
		{
			dj.register.showTip ( 'Mobile', 2, dj.register.messages.mobileCheckOK );
			return true;
		}
		else if ( ret.data.err_msg )
		{
			dj.register.showTip ( 'Mobile', 1, ret.data.err_msg );
			return false;
		}
		else
		{
			dj.register.hideTip ( 'Mobile' );
		}
	},
	
	// Ajax 检查手机号
	checkMobileSystem : function()
	{
		this.showTip ( 'Mobile', 3, this.messages.mobileInCheck );
		this._parent.ajax.get ( dj.apiRoot + this.checkApi.replace( /{ITEM}/g, 'mobile' ), { 'mobile' : this.obForm.mobile.value }, this._name + '.callbackCheckMobile' );
	},

	// 检查真实姓名
	checkRealname : function( form )
	{
		if ( form == null ) form = this.obForm;
		var username = form.realname.value;
		var usernameLength = this.JHshStrLen ( username );

		if ( usernameLength <= 0 )
		{
			this.showTip ( 'Realname', 1, this.messages.emptyRealname );
			return false;
		}
		var obj = username.match(/^[\u4e00-\u9fa5]*$/g);
		if ( obj == null )
		{
			this.showTip ( 'Realname', 1, this.messages.invalidRealname );
			return false;
		}
		if ( usernameLength < 4 )
		{
			this.showTip ( 'Realname', 1, this.messages.invalidRealnameLength );
			return false;
		}

		// 验证是否合法姓名
		var isValidName = true;
		if ( this.singleNames.indexOf ( username.substring ( 0, 1 ) ) < 0 )
		{
			if ( this.doubleNames.indexOf ( username.substring ( 0, 2 ) ) < 0 )
			{
				isValidName = false;
			}
		}
		 
		if ( !isValidName )
		{
			this.showTip ( 'Realname', 1, this.messages.invalidFirstname );
			return false;
		}

		this.showTip ( 'Realname', 2, this.messages.realnameCheckOK );
		return true;
	},

	JHshStrLen : function( sString )
	{
		var sStr,iCount,i,strTemp ;
		iCount = 0 ;
		sStr = sString.split ( '' );
		for (i = 0 ; i < sStr.length ; i ++)
		{
			strTemp = escape(sStr[i]);
			if (strTemp.indexOf("%u",0) == -1) 
			{
				iCount = iCount + 1 ;
			}
			else
			{
				iCount = iCount + 2 ;
			}
		}
		return iCount ;
	},

	result : function( errMsg, error )
	{
		if ( errMsg == undefined )
		{
			errMsg == '';
			error = 0;
		}
		else
		{
			error = 1;
		}

		var result =
		{
			'data' :
			{
				'error' : error,
				'err_msg' : errMsg
			}
		};

		return result;
	},

	// 获取验证码
	getVCode : function( ob )
	{
		ob = dj.$( ob );
		ob.style.visibility = 'visible';
		ob.src = dj.apiRoot + '/misc/vcode/register/_rnd/' + new Date().getTime();
	}
};
dj.extend ( 'register' );

/**
 * @overview 多趣瀑布流布局类 - dj_waterfall.js
 * $Id: dj.js 83 2015-04-01 01:47:40Z 徐立 $
 */

/**
 * @class 多趣瀑布流布局类
 * 使用示例：
 * var wf = dj.waterfall.create(
 *	{
 *		container : "container", // 容器
 *		cls : "class" // 应用瀑布流的对象样式
 *	} );
 */

dj.waterfall =
{
	create : function( param )
	{
		var instance = new this.instance( param );
		return instance;
	},

	instance : function( param )
	{
		this.id = dj.$( param.container );
		this.cls = param.cls && param.cls != '' ? param.cls : 'dj-wf';
		this.init();
	}
};

dj.waterfall.instance.prototype =
{
	lastLen : 0, // 最后处理计数
	inited : false,
	col : [],

	getByClass : function( cls, p )
	{
		var arr = [], reg = new RegExp( "(^|\\s+)" + cls + "(\\s+|$)", "g" );
		var nodes = p.getElementsByTagName("*"),len = nodes.length;
		for ( var i = this.lastLen; i < len; i++ )
		{
			if ( reg.test(nodes[i].className ) )
			{
				arr.push( nodes[i] );
				reg.lastIndex = 0;
			}
		}
		this.lastLen = len - 1;
		return arr;
	},

	maxArr : function( arr )
	{
		var len = arr.length, temp = arr[0];
		for( var ii= 1; ii < len; ii++ )
		{
			if ( temp < arr[ii] ) temp = arr[ii];
		}
		return temp;
	},

	getMinCol : function( arr )
	{
		var ca = arr, cl = ca.length, temp = ca[0], minc = 0;
		for ( var ci = 0; ci < cl; ci++ )
		{
			if ( temp > ca[ci] )
			{
				temp = ca[ci];
				minc = ci;
			}
		}
		return minc;
	},

	init : function()
	{
		var _this = this;
		var nodes = _this.getByClass( _this.cls, _this.id ), len = nodes.length;

		if ( !_this.inited )
		{
			var marRight = parseInt( dj.getStyle( nodes[0], 'marginRight' ) );
			_this.colWidth = nodes[0].offsetWidth + marRight;
			_this.colCount = parseInt( _this.id.offsetWidth / _this.colWidth );

			for ( var i = 0; i < _this.colCount; i++ ) _this.col[i] = 0;
			_this.inited = true;
		}

		var marBottom;
		for ( var i = 0; i < len; i++ )
		{
			marBottom = parseInt( dj.getStyle( nodes[i], 'marginBottom' ) );
			nodes[i].h = nodes[i].offsetHeight + marBottom;
		}
		 
		for ( var i = 0; i < len; i++ )
		{
			var ming = _this.getMinCol ( _this.col );
			nodes[i].style.left = ming * _this.colWidth + 'px';
			nodes[i].style.top = _this.col[ming] + 'px';
			_this.col[ming] += nodes[i].h;
		}
		 
		_this.id.style.height = _this.maxArr( _this.col ) + 'px';
	}
};

dj.extend( 'waterfall' );