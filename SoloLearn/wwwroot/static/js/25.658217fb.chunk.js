webpackJsonp([25],{7128:function(e,t,n){"use strict";function r(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(o,a){try{var s=t[o](a),i=s.value}catch(e){return void n(e)}if(!s.done)return Promise.resolve(i).then(function(e){r("next",e)},function(e){r("throw",e)});e(i)}return r("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function s(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i,u,c=n(39),l=n.n(c),p=n(0),f=n.n(p),h=n(23),d=n(20),y=n(320),b=n(48),v=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),m=function(e){return{collectionCourses:e.slay.lessonsByUser,authorName:e.slay.activeLesson.userName}},w={getLessonsByAuthor:y.f},x=(i=Object(h.b)(m,w))(u=function(e){function t(e){var n=this;o(this,t);var s=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return s.loadMore=r(l.a.mark(function e(){var t,r,o,a,i,u;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=s.state,r=t.startIndex,o=t.loadCount,a=s.props.params,i=parseInt(a.userId,10),e.next=5,s.props.getLessonsByAuthor(0,i,{index:r,count:o});case 5:u=e.sent,s.setState({hasMore:u===o,startIndex:r+o});case 7:case"end":return e.stop()}},e,n)})),s.state={startIndex:0,loadCount:10,loading:!0,hasMore:!0},document.title="Sololearn | More lessons by "+e.authorName,s}return s(t,e),v(t,[{key:"componentWillMount",value:function(){function e(){return t.apply(this,arguments)}var t=r(l.a.mark(function e(){var t,n,r,o,a,s;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.params,n=this.state,r=n.startIndex,o=n.loadCount,a=parseInt(t.userId,10),e.next=5,this.props.getLessonsByAuthor(0,a,{index:r,count:o});case 5:s=e.sent,this.setState({loading:!1,hasMore:s===o}),this.setState({loading:!1});case 8:case"end":return e.stop()}},e,this)}));return e}()},{key:"render",value:function(){var e=this.state,t=e.loading,n=e.hasMore,r=this.props,o=r.t,a=r.collectionCourses,s=r.authorName;return f.a.createElement(b.f,{paper:!0,noSidebar:!0,loading:t,hasMore:n,items:a,loadMore:this.loadMore,cardComponent:b.a,title:o("lesson.view-more-by-author")+" "+s,wrapperStyle:{alignItems:"initial"},style:{width:"initial",padding:15,flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start"}})}}]),t}(p.PureComponent))||u;t.default=Object(d.b)()(x)}});
//# sourceMappingURL=25.658217fb.chunk.js.map