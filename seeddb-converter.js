/* seeddbconv.js v20180807 - Marc Robledo 2018 - http://www.marcrobledo.com/license */

/*
TYPES
-----
0x00040000:eShop/Application
0x00040002:Demo
0x0004000e:Patch
0x0004008c:DLC
0x00040138:System
0x00048004:DSiWare
*/

const REGIONS={
	'A':'ALL',
	'J':'JPN',
	'E':'USA',
	'P':'EUR',
	'S':'EUR (S)',
	'I':'EUR (I)',
	'D':'EUR (G)',
	'F':'EUR (F)',
	'Z':'ALL (Z)',
	'K':'KOR'
};





 
/* Shortcuts */
function addEvent(e,ev,f){e.addEventListener(ev,f,false)}
function toHex(i){var r=i.toString(16);while(r.length<8)r='0'+r;return r}





function clickDat(evt){
	var blob=new Blob([seeds[this.seedIndex].seed], {type: 'application/octet-stream'});
	saveAs(blob, this.innerHTML);
}

var seeds;
/* event for reading seedbdb.bin file */
var fr=new FileReader();
fr.onload=function(e){
	seeds=parseFile(new Uint8Array(e.target.result)).sort(function(a,b){
		if (a.title<b.title)
			return -1;
		if (a.title>b.title)
			return 1;
		return 0;
	});

	for(var i=0; i<seeds.length; i++){
		var tr=document.createElement('tr');
		var td0=document.createElement('td');
		var td1=document.createElement('td');
		var td2=document.createElement('td');
		var td3=document.createElement('td');
		var td4=document.createElement('td');

		td0.innerHTML=seeds[i].serial;
		td1.innerHTML=seeds[i].region;
		td2.innerHTML='0x'+toHex(seeds[i].gameId);
		td3.innerHTML=seeds[i].title || '0x'+seeds[i].gameId.toString(16);

		var button=document.createElement('button');
		button.innerHTML=toHex(seeds[i].type)+toHex(seeds[i].gameId)+'.dat';
		button.seedIndex=i;
		addEvent(button,'click', clickDat);
		td4.appendChild(button);

		tr.appendChild(td0);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		document.getElementById('table').appendChild(tr);

		/*var div=document.createElement('div');
		div.innerHTML='0x'+toHex(seeds[i].gameId)+':\''+seeds[i].serial+' '+seeds[i].title.replace(/&#39;/g,'&amp;#39;')+'\',';
		document.body.appendChild(div);*/
	}
	console.log(seeds.length);
}

function readFile(file){fr.readAsArrayBuffer(file)}
function parseFile(arr){
	var seeds=[];

	var seek=16;
	while(seek<arr.length){
		var gameId=0;
		var type=0;
		for(var i=0; i<4; i++){
			gameId+=arr[seek+i] << i*8;
			type+=arr[seek+i+4] << i*8;
		}
		seek+=8;
		seeds.push({
			type:type,
			gameId:gameId,
			title:DATABASE[gameId].substr(11),
			region:REGIONS[DATABASE[gameId].substr(9,1)],
			serial:DATABASE[gameId].substr(0,10),
			seed:arr.slice(seek, seek+16)
		});
		seek+=24;
	}
	return seeds;
}




/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
