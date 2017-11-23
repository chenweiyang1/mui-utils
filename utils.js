var utils = {
	reqUrl: 'http://www.shandian001.com/api/app/',
	openWindow: function(url, id, ani, data) {
		if(!ani) ani = 'slide-in-right'; 
		mui.openWindow({
		    url: url,
		    id: id,
		    show:{
		      autoShow:true,//页面loaded事件发生后自动显示，默认为true
		      aniShow: ani
		    },
		    extras:data,
		    waiting:{
		      autoShow:true,//自动显示等待框，默认为true
		      title:'...',//等待对话框上显示的提示内容
		      options:{
//		        width:waiting-dialog-widht,//等待框背景区域宽度，默认根据内容自动计算合适宽度
//		        height:waiting-dialog-height,//等待框背景区域高度，默认根据内容自动计算合适高度
		      }
		    }
		})
	},
	closeOtherwv: function(){
		var curr = plus.webview.currentWebview();
	    var wvs = plus.webview.all();
	    for (var i = 0, len = wvs.length; i < len; i++) {
	        //关闭除当前页面外的其他页面
	        if (wvs[i].getURL() == curr.getURL())
	            continue;
			plus.webview.close(wvs[i],'none')
	    }
	},
	back: function() {
		var first = null;
	    mui.back = function() {
	    	if(!first){
	            first = new Date().getTime();
	            mui.toast('再按一次退出应用');
	            setTimeout(function(){
	                first = null;
	            },1000);
	        }else{
	            if(new Date().getTime()-first<1000){
	                plus.runtime.quit();
	            }
	        }
	    }
	},
	ajax: function(url, type, req, success, err) {
    	mui.ajax(url,{
    		data:req,
    		dataType:'json',//服务器返回json格式数据
    		type:type,//HTTP请求类型
    		timeout:10000,//超时时间设置为10秒；
    		success:success,
    		error:err
    	});
  	},
   	isPhone: function(phone) {
   		return /^1([38]\d|4[57]|5[012356789]|7[678])\d{8}$/.test(phone) ? true : false;
   	},
   	isIdNumber: function(idNumber) {
   		return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idNumber) ? true : false;
   	},
   	timer: function(time, el, clname) {
   		var time = time;
   		if(el.classList.contains(clname)){
   			el.innerText = time + '秒后重新获取';
   			var t = setInterval(f,1000);
	   		function f() {
				time --;
				el.innerText = time + '秒后重新获取';
				if(time < 0) {
					clearInterval(t);
					el.classList.remove(clname);
					el.innerText = '获取验证码';
				}
	   		}
   		} else {
   			return;
   		}
   	},
   	seePwd: function(el, attr){
   		if(el && attr){
   			attr == 'password' ? el.setAttribute('type', 'text') : el.setAttribute('type', 'password');
   		} else {
   			console.log('元素或属性获取错误');
   		}
   	},
   	camera: function(el) {
   		var c = plus.camera.getCamera();
		c.captureImage(function(e) {
			plus.io.resolveLocalFileSystemURL(e, function(entry) {
				var s = entry.toLocalURL() + "?version=" + new Date().getTime();
				el.setAttribute('src', s);
			}, function(e) {
				console.log("读取拍照文件错误：" + e.message);
			});
		}, function(s) {
			console.log("error" + s);
		}, {
			filename: "_doc/head.jpg"
		})
   	},
   	gallery: function(el) {
   		plus.gallery.pick(function(a) {
			plus.io.resolveLocalFileSystemURL(a, function(entry) {
				plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
					root.getFile("head.jpg", {}, function(file) {
						//文件已存在
						file.remove(function() {
							console.log("file remove success");
							entry.copyTo(root, 'head.jpg', function(e) {
									var e = e.fullPath + "?version=" + new Date().getTime();
									el.setAttribute('src', e);
								},
								function(e) {
									console.log('copy image fail:' + e.message);
								});
						}, function() {
							console.log("delete image fail:" + e.message);
						});
					}, function() {
						//文件不存在
						entry.copyTo(root, 'head.jpg', function(e) {
								var path = e.fullPath + "?version=" + new Date().getTime();
								el.setAttribute('src', path);
							},
							function(e) {
								console.log('copy image fail:' + e.message);
							});
					});
				}, function(e) {
					console.log("get _www folder fail");
				})
			}, function(e) {
				console.log("读取拍照文件错误：" + e.message);
			});
		}, function(a) {}, {
			filter: "image"
		});
   	}
}