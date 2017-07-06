/**
 * y-array - Array Type for Yjs
 * @version v11.0.0-2
 * @license MIT
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.yArray=t()}(this,function(){"use strict";function e(e){var o=function(o){function a(n,r,o){t(this,a);var s=i(this,(a.__proto__||Object.getPrototypeOf(a)).call(this));return s.os=n,s._model=r,s._content=o,s._parent=null,s._deepEventHandler=new e.utils.EventListenerHandler,s.eventHandler=new e.utils.EventHandler(function(t){if("Insert"===t.struct){if(s._content.some(function(n){return e.utils.compareIds(n.id,t.id)}))return;var n=void 0;if(null===t.left)n=0;else if((n=1+s._content.findIndex(function(n){return e.utils.compareIds(n.id,t.left)}))<=0)throw new Error("Unexpected operation!");var r,i;if(t.hasOwnProperty("opContent")){s._content.splice(n,0,{id:t.id,type:t.opContent}),i=1;var o=s.os.getType(t.opContent);o._parent=s._model,r=[o]}else{var a=t.content.map(function(e,n){return{id:[t.id[0],t.id[1]+n],val:e}});a.length<3e4?s._content.splice.apply(s._content,[n,0].concat(a)):s._content=s._content.slice(0,n).concat(a).concat(s._content.slice(n)),r=t.content,i=t.content.length}e.utils.bubbleEvent(s,{type:"insert",object:s,index:n,values:r,length:i})}else{if("Delete"!==t.struct)throw new Error("Unexpected struct!");for(var u=0;u<s._content.length&&t.length>0;u++){var l=s._content[u];if(e.utils.inDeletionRange(t,l.id)){var c;for(c=1;c<t.length&&u+c<s._content.length&&e.utils.inDeletionRange(t,s._content[u+c].id);c++);l=s._content[u+c-1],t.length-=l.id[1]-t.target[1]+1,t.target=[l.id[0],l.id[1]+1];var p=s._content.splice(u,c),f=p.map(function(e){return null!=e.val?e.val:s.os.getType(e.type)});e.utils.bubbleEvent(s,{type:"delete",object:s,index:u,values:f,_content:p,length:c})}}}}),s}return r(a,o),n(a,[{key:"_getPathToChild",value:function(t){return this._content.findIndex(function(n){return null!=n.type&&e.utils.compareIds(n.type,t)})}},{key:"_destroy",value:function(){this.eventHandler.destroy(),this.eventHandler=null,this._content=null,this._model=null,this._parent=null,this.os=null}},{key:"get",value:function(e){if(null==e||"number"!=typeof e)throw new Error("pos must be a number!");if(!(e>=this._content.length))return null==this._content[e].type?this._content[e].val:this.os.getType(this._content[e].type)}},{key:"toArray",value:function(){var e=this;return this._content.map(function(t,n){return null!=t.type?e.os.getType(t.type):t.val})}},{key:"push",value:function(e){return this.insert(this._content.length,e)}},{key:"insert",value:function(t,n){if("number"!=typeof t)throw new Error("pos must be a number!");if(!Array.isArray(n))throw new Error("contents must be an Array of objects!");if(0!==n.length){if(t>this._content.length||t<0)throw new Error("This position exceeds the range of the array!");for(var r=0===t?null:this._content[t-1].id,i=[],o=r,a=0;a<n.length;){for(var s,u={left:o,origin:o,parent:this._model,struct:"Insert"},l=[];a<n.length;){var c=n[a++];if(s=e.utils.isTypeDefinition(c)){if(l.length>0){a--;break}break}l.push(c)}if(l.length>0)u.content=l,u.id=this.os.getNextOpId(l.length);else{var p=this.os.getNextOpId(1);this.os.createType(s,p),u.opContent=p,u.id=this.os.getNextOpId(1)}i.push(u),o=u.id}var f=this.eventHandler;this.os.requestTransaction(regeneratorRuntime.mark(function e(){var t,n,o,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(null==r){e.next=6;break}return e.delegateYield(this.getInsertionCleanEnd(r),"t0",2);case 2:n=e.t0,t=n.right,e.next=8;break;case 6:return e.delegateYield(this.getOperation(i[0].parent),"t1",7);case 7:t=e.t1.start;case 8:for(o=0;o<i.length;o++)a=i[o],a.right=t;return e.delegateYield(f.awaitOps(this,this.applyCreatedOperations,[i]),"t2",10);case 10:case"end":return e.stop()}},e,this)})),f.awaitAndPrematurelyCall(i)}}},{key:"delete",value:function(t,n){if(null==n&&(n=1),"number"!=typeof n)throw new Error("length must be a number!");if("number"!=typeof t)throw new Error("pos must be a number!");if(t+n>this._content.length||t<0||n<0)throw new Error("The deletion range exceeds the range of the array!");if(0!==n){for(var r,i=this.eventHandler,o=[],a=0;a<n;a+=r){var s=this._content[t+a].id;for(r=1;a+r<n&&e.utils.compareIds(this._content[t+a+r].id,[s[0],s[1]+r]);r++);o.push({target:s,struct:"Delete",length:r})}this.os.requestTransaction(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.delegateYield(i.awaitOps(this,this.applyCreatedOperations,[o]),"t0",1);case 1:case"end":return e.stop()}},e,this)})),i.awaitAndPrematurelyCall(o)}}},{key:"observe",value:function(e){this.eventHandler.addEventListener(e)}},{key:"observeDeep",value:function(e){this._deepEventHandler.addEventListener(e)}},{key:"unobserve",value:function(e){this.eventHandler.removeEventListener(e)}},{key:"unobserveDeep",value:function(e){this._deepEventHandler.addEventListener(e)}},{key:"_changed",value:regeneratorRuntime.mark(function e(t,n){var r,i;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(n.deleted){e.next=15;break}if("Insert"!==n.struct){e.next=14;break}r=n.left;case 3:if(null==r){e.next=11;break}return e.delegateYield(t.getInsertion(r),"t0",5);case 5:if(i=e.t0,i.deleted){e.next=8;break}return e.abrupt("break",11);case 8:r=i.left,e.next=3;break;case 11:if(n.left=r,null==n.opContent){e.next=14;break}return e.delegateYield(t.store.initType.call(t,n.opContent),"t1",14);case 14:this.eventHandler.receivedOp(n);case 15:case"end":return e.stop()}},e,this)})},{key:"length",get:function(){return this._content.length}}]),a}(e.utils.CustomType);e.extend("Array",new e.utils.CustomTypeDefinition({name:"Array",class:o,struct:"List",initType:regeneratorRuntime.mark(function t(n,r){var i,a,s,u;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return i=[],a=[],t.delegateYield(e.Struct.List.map.call(this,r,function(e){e.hasOwnProperty("opContent")?(i.push({id:e.id,type:e.opContent}),a.push(e.opContent)):e.content.forEach(function(t,n){i.push({id:[e.id[0],e.id[1]+n],val:e.content[n]})})}),"t0",3);case 3:s=0;case 4:if(!(s<a.length)){t.next=11;break}return t.delegateYield(this.store.initType.call(this,a[s]),"t1",6);case 6:u=t.t1,u._parent=r.id;case 8:s++,t.next=4;break;case 11:return t.abrupt("return",new o(n,r.id,i));case 12:case"end":return t.stop()}},t,this)}),createType:function(e,t){return new o(e,t.id,[])}}))}var t=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},n=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),r=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)},i=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t};return"undefined"!=typeof Y&&e(Y),e});
//# sourceMappingURL=y-array.js.map