webpackJsonp([16],{7126:function(e,t,n){"use strict";function r(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,o){try{var i=t[a](o),s=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}return r("next")})}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function i(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s,c,l=n(39),u=n.n(l),p=n(0),m=n.n(p),h=n(87),d=n.n(h),f=n(23),y=n(20),w=n(7206),b=n(320),g=n(48),v=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),x=function(e){return{lessons:e.slay.bookmarks}},k={getBookmarkLessons:b.a},E=(s=Object(f.b)(x,k))(c=function(e){function t(e){var n=this;a(this,t);var i=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return i.loadMore=r(u.a.mark(function e(){var t,r,a,o;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=i.state,r=t.startIndex,a=t.loadCount,e.next=3,i.props.getBookmarkLessons({index:r,count:a});case 3:o=e.sent,i.setState({hasMore:o===a,startIndex:r+a});case 5:case"end":return e.stop()}},e,n)})),i.state={startIndex:e.lessons.length,loadCount:10,loading:!0,hasMore:!0},document.title="Sololearn | Bookmarks",i}return i(t,e),v(t,[{key:"componentWillMount",value:function(){function e(){return t.apply(this,arguments)}var t=r(u.a.mark(function e(){var t,n,r,a;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.state,n=t.startIndex,r=t.loadCount,e.next=3,this.props.getBookmarkLessons({index:n,count:r});case 3:a=e.sent,this.setState({loading:!1,hasMore:a===r,startIndex:n+r}),d.a.ga("send","screenView",{screenName:"Bookmarks Page"});case 6:case"end":return e.stop()}},e,this)}));return e}()},{key:"render",value:function(){var e=this.state,t=e.loading,n=e.hasMore,r=this.props,a=r.lessons,o=r.t;return m.a.createElement(g.f,{paper:!0,noSidebar:!0,loading:t,hasMore:n,items:a,title:o("store.bookmarks.title"),loadMore:this.loadMore,cardComponent:g.a,loadingComponent:w.a,wrapperStyle:{alignItems:"initial"},style:{width:"initial",padding:15,flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start"}},a.length?null:m.a.createElement("p",null,o("common.empty-list-message")))}}]),t}(p.PureComponent))||c;t.default=Object(y.b)()(E)},7206:function(e,t,n){"use strict";var r=n(0),a=n.n(r),o=n(7),i=n(217),s=n(7207),c=(n.n(s),function(){return a.a.createElement(o.y,{className:"slay-detailed-shimmer-wrapper"},a.a.createElement(i.d,null,a.a.createElement(i.b,{className:"collection-title"})),a.a.createElement(o.i,{fullWidth:!0,align:!0,justify:!0,className:"course-chips"},Array(42).fill(0).map(function(e,t){return a.a.createElement(i.d,{className:"shimmer-chip-container",key:t},a.a.createElement(o.i,{column:!0,align:!0,justify:!0},a.a.createElement(i.b,{className:"chip-body"}),a.a.createElement(i.b,{className:"chip-name"})))})))});t.a=c},7207:function(e,t,n){var r=n(7208);"string"===typeof r&&(r=[[e.i,r,""]]);var a={hmr:!0};a.transform=void 0,a.insertInto=void 0;n(6)(r,a);r.locals&&(e.exports=r.locals)},7208:function(e,t,n){t=e.exports=n(5)(void 0),t.push([e.i,".slay-detailed-shimmer-wrapper {\n  width: 100%;\n  padding: 20px; }\n  .slay-detailed-shimmer-wrapper .collection-title {\n    width: 215px;\n    height: 16px; }\n  .slay-detailed-shimmer-wrapper .course-chips {\n    flex-flow: row wrap; }\n    .slay-detailed-shimmer-wrapper .course-chips .shimmer-chip-container {\n      width: calc(100% / 3 - 30px);\n      margin-right: 15px;\n      margin-top: 15px; }\n      .slay-detailed-shimmer-wrapper .course-chips .shimmer-chip-container .chip-body {\n        width: 100%;\n        padding-top: 53%; }\n      .slay-detailed-shimmer-wrapper .course-chips .shimmer-chip-container .chip-name {\n        width: 100%; }\n",""])}});
//# sourceMappingURL=16.544a4bf3.chunk.js.map