webpackJsonp([15],{6990:function(e,t,n){"use strict";function r(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(a,o){try{var i=t[a](o),s=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(s).then(function(e){r("next",e)},function(e){r("throw",e)});e(s)}return r("next")})}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function i(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var s,c,l=n(38),p=n.n(l),u=n(0),d=n.n(u),h=n(81),m=n.n(h),f=n(19),y=n(293),w=n(7071),g=n(49),b=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),x=function(e){return{courses:e.courses,selectedCollection:e.slay.selectedCollection,collectionCourses:e.slay.filteredCollectionItems}},v={getLessonCollections:y.e,getCollectionItems:y.b,setSelectedCollection:y.j},C=(s=Object(f.b)(x,v))(c=function(e){function t(){var e=this;a(this,t);var n=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return n.loadMore=r(p.a.mark(function t(){var r,a,o,i,s,c;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=n.state,a=r.startIndex,o=r.loadCount,i=n.props.params,s=parseInt(i.collectionId,10),0===a){e.next=8;break}return e.next=6,n.props.getCollectionItems(s,{index:a,count:o});case 6:c=e.sent,n.setState({hasMore:c===o,startIndex:a+o});case 8:case"end":return e.stop()}},t,e)})),n.state={startIndex:0,loadCount:10,loading:!0,hasMore:!0},document.title="Slay | Detailed",n}return i(t,e),b(t,[{key:"componentWillMount",value:function(){function e(){return t.apply(this,arguments)}var t=r(p.a.mark(function e(){var t,n,r,a,o,i;return p.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.params,n=this.state,r=n.startIndex,a=n.loadCount,o=parseInt(t.collectionId,10),e.next=5,this.props.setSelectedCollection(o);case 5:return e.next=7,this.props.getCollectionItems(o,{index:r,count:a});case 7:i=e.sent,this.setState({loading:!1,hasMore:i===a,startIndex:r+i}),-1!==o?m.a.ga("send","screenView",{screenName:"Collection Page"}):m.a.ga("send","screenView",{screenName:"Lessons Page"}),this.setState({loading:!1});case 11:case"end":return e.stop()}},e,this)}));return e}()},{key:"render",value:function(){var e=this.state,t=e.loading,n=e.hasMore,r=this.props,a=r.params,o=r.collectionCourses,i=r.selectedCollection,s=parseInt(a.collectionId,10),c=-1===s;return d.a.createElement(g.f,{paper:!0,heading:!0,noSidebar:!0,loading:t,hasMore:n,isCourses:c,items:o,loadMore:this.loadMore,cardComponent:c?g.c:g.a,loadingComponent:w.a,title:t?"":i?i.name:"Learn the Basics",wrapperStyle:{alignItems:"initial"},style:{width:"initial",flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start"}})}}]),t}(u.PureComponent))||c;t.default=C},7071:function(e,t,n){"use strict";var r=n(0),a=n.n(r),o=n(7),i=n(200),s=n(7072),c=(n.n(s),function(){return a.a.createElement(o.y,{className:"slay-detailed-shimmer-wrapper"},a.a.createElement(i.d,null,a.a.createElement(i.b,{className:"collection-title"})),a.a.createElement(o.i,{fullWidth:!0,align:!0,justify:!0,className:"course-chips"},Array(42).fill(0).map(function(e,t){return a.a.createElement(i.d,{className:"shimmer-chip-container",key:t},a.a.createElement(o.i,{column:!0,align:!0,justify:!0},a.a.createElement(i.b,{className:"chip-body"}),a.a.createElement(i.b,{className:"chip-name"})))})))});t.a=c},7072:function(e,t,n){var r=n(7073);"string"===typeof r&&(r=[[e.i,r,""]]);var a={hmr:!0};a.transform=void 0,a.insertInto=void 0;n(6)(r,a);r.locals&&(e.exports=r.locals)},7073:function(e,t,n){t=e.exports=n(5)(void 0),t.push([e.i,".slay-detailed-shimmer-wrapper {\n  width: 100%;\n  padding: 20px; }\n  .slay-detailed-shimmer-wrapper .collection-title {\n    width: 215px;\n    height: 16px; }\n  .slay-detailed-shimmer-wrapper .course-chips {\n    flex-flow: row wrap; }\n    .slay-detailed-shimmer-wrapper .course-chips .shimmer-chip-container {\n      width: calc(100% / 3 - 30px);\n      margin-right: 15px;\n      margin-top: 15px; }\n      .slay-detailed-shimmer-wrapper .course-chips .shimmer-chip-container .chip-body {\n        width: 100%;\n        padding-top: 53%; }\n      .slay-detailed-shimmer-wrapper .course-chips .shimmer-chip-container .chip-name {\n        width: 100%; }\n",""])}});
//# sourceMappingURL=15.31f919c9.chunk.js.map