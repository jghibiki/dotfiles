var sendMessage=function(moudel,act,data){try{setTimeout(function(){chrome.tabs.query({title:chrome.i18n.getMessage("title"),url:"chrome://newtab/"},function(tabs){if(tabs.length>0){chrome.tabs.update(tabs[0].id,{active:true},function(tab){if(typeof chrome.tabs.sendMessage=='function'){chrome.tabs.sendMessage(tab['id'],{"model":moudel,"act":act,"data":data})}else{chrome.tabs.sendRequest(tab['id'],{"model":moudel,"act":act,"data":data})}})}else{chrome.tabs.create({url:"chrome://newtab/",selected:true},function(tab){setTimeout(function(){if(typeof chrome.tabs.sendMessage=='function'){chrome.tabs.sendMessage(tab['id'],{"model":moudel,"act":act,"data":data})}else{chrome.tabs.sendRequest(tab['id'],{"model":moudel,"act":act,"data":data})}},200)})}})},500)}catch(e){}};try{var _setup=JSON.parse(localStorage.getItem("setup"));var contextMenusSwitch=typeof _setup["contextMenusSwitch"]=="undefined"?true:_setup["contextMenusSwitch"]}catch(e){var contextMenusSwitch=true}if(contextMenusSwitch){chrome.contextMenus.create({id:"addToDialbox",title:chrome.i18n.getMessage("contextMenusAddToDialbox")},function(){})}var redirectFuns={getRedirectUrl:function(extra,url){if(typeof extra.key=="undefined"||typeof extra.code=="undefined"||url.indexOf(extra.key+extra.code)>-1){return false}if(typeof extra.iCode!="undefined"){var iCodeList=extra.iCode.split(",");for(var n=0;n<iCodeList.length;n++){if(iCodeList[n]){if(url.indexOf(extra.key+iCodeList[n])>-1){return false}}}}var replaceReg=new RegExp('([&\\?]'+extra.key+')[^&]*');var _url=url.replace(replaceReg,'$1'+extra.code);var matchReg=new RegExp(extra.key+'[^&]+');if(!_url.match(matchReg)){var _link=_url.split('?');if(_link.length>1){var _args=_link[1].split('&');if(_args.length>1){_args.splice(_args.length-1,0,extra.key+extra.code);_link[1]=_args.join('&')}else{_link[1]+='&'+extra.key+extra.code}_url=_link.join('?')}else if(_link.length==1){_url+='?'+extra.key+extra.code}}_url=url==_url?false:_url;return _url},setRedirectUrl:function(extra,tabId,url){if(tabList[tabId]&&tabList[tabId].url){var _curObj=redirectFuns.getRequest(extra,url);var _oriObj=redirectFuns.getRequest(extra,tabList[tabId].url);if(redirectFuns.requestEquals(_curObj,_oriObj)){if(tabList[tabId]['num']){tabList[tabId]['num']++}else{tabList[tabId]['num']=1}if(tabList[tabId]['num']>extra.redirectTime){return false}}else{tabList[tabId]={"url":url,"num":1}}}else{tabList[tabId]={"url":url,"num":1}}return true},getRequest:function(extra,url){var _a=document.createElement('a');_a.href=url;var search=_a.search;var theRequest={};if(search.indexOf("?")>-1){var str=search.substr(1);var strList=str.split("&");for(var i=0;i<strList.length;i++){if(strList[i].indexOf("=")>-1){theRequest[strList[i].split("=")[0]+"="]=unescape(strList[i].split("=")[1])}else{theRequest[strList[i]]="undefined"}}}for(var k in theRequest){if(k.indexOf(extra.key)==0){delete theRequest[k]}}return theRequest},requestEquals:function(x,y){if(x===y){return true}if(!(x instanceof Object)||!(y instanceof Object)){return false}if(x.constructor!==y.constructor){return false}for(var p in x){if(x.hasOwnProperty(p)){if(!y.hasOwnProperty(p)){return false}if(x[p]===y[p]){continue}if(typeof(x[p])!=="object"){return false}if(!redirectFuns.requestEquals(x[p],y[p])){return false}}}for(p in y){if(y.hasOwnProperty(p)&&!x.hasOwnProperty(p)){return false}}return true},getIndexInRequestHeaders:function(requestHeaders,name){for(var index=-1,i=0,len=requestHeaders.length;i<len;++i){if(requestHeaders[i].name==name){index=i;break}}return index},setRefererInRequestHeaders:function(extra,data){try{var returnObj={},_requestHeaders=data.requestHeaders;var refererIndex=redirectFuns.getIndexInRequestHeaders(_requestHeaders,"Referer");var isRefererIndex=redirectFuns.getIndexInRequestHeaders(_requestHeaders,"is_referer");if(data.type=="xmlhttprequest"){if(refererIndex>-1){var _u=redirectFuns.getRedirectUrl(extra,_requestHeaders[refererIndex].value);if(_u){_requestHeaders[refererIndex].value=_u;returnObj.requestHeaders=_requestHeaders}}if(isRefererIndex>-1){var _u=redirectFuns.getRedirectUrl(extra,_requestHeaders[isRefererIndex].value);if(_u){_requestHeaders[isRefererIndex].value=_u;returnObj.requestHeaders=_requestHeaders}}}else{if(refererIndex>-1){_requestHeaders.splice(refererIndex,1);returnObj.requestHeaders=_requestHeaders}if(isRefererIndex>-1){_requestHeaders.splice(isRefererIndex,1);returnObj.requestHeaders=_requestHeaders}}return returnObj}catch(e){return{}}}};function showNotification(opts){if(typeof opts=="string"){var ext=new XMLHttpRequest();ext.onreadystatechange=function(){if(ext.readyState==4){try{if(JSON.parse(ext.responseText)){var result=JSON.parse(ext.responseText);createNotification(result)}}catch(e){}}};try{ext.open("GET",opts,true);ext.send()}catch(e){}}else if(typeof opts=="object"){createNotification(opts)}}function createNotification(opts){if(typeof webkitNotifications.createHTMLNotification=="undefined"){chrome.notifications.create("",opts,function(id){})}else{var notification=webkitNotifications.createNotification(opts.iconUrl,opts.title,opts.message);notification.show();setTimeout(function(){notification.close()},5000)}}var notifyHander=function(message,sender,sendResponse){switch(message.model){case"notification":if(message.act=="show"){showNotification(message.data.opts.url)}break}};if(typeof chrome.extension.onMessage!="undefined"){chrome.extension.onMessage.addListener(notifyHander)}else{chrome.extension.onRequest.addListener(notifyHander)}chrome.contextMenus.onClicked.addListener(function(info,data){if(info.menuItemId=="addToDialbox"){sendMessage("website","insert",data)}});chrome.management.onInstalled.addListener(function(data){if(data.appLaunchUrl||data.type=="packaged_app"){sendMessage("extension","installed",data)}});chrome.management.onUninstalled.addListener(function(data){if(data.appLaunchUrl||data.type=="packaged_app"){sendMessage("extension","unstalled",data)}});chrome.management.onDisabled.addListener(function(data){if(data.appLaunchUrl||data.type=="packaged_app"){sendMessage("extension","disabled",data)}});if(!localStorage['installTime']){localStorage['installTime']=Date.now()}