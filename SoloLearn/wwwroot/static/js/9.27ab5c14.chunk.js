webpackJsonp([9],{6994:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function a(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var i,c,u,o=n(0),l=n.n(o),m=n(19),f=n(16),p=n(43),d=n(10),h=n(7074),y=n(511),v=n(7),b=n(12),g=n(7272),E=n(7281),j=(n.n(E),function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}()),w=function(e){return{posts:Object(y.e)(e),filters:Object(y.c)(e),hasMore:Object(y.d)(e),isFetching:Object(y.f)(e)}},q={getPosts:h.d,emptyPosts:h.c,setDiscussFilters:h.g,getSidebarQuestions:h.e},O=(i=Object(m.b)(w,q),c=Object(f.b)(),i(u=c(u=function(e){function t(){var e,n,a,i;r(this,t);for(var c=arguments.length,u=Array(c),o=0;o<c;o++)u[o]=arguments[o];return n=a=s(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(u))),a.getPosts=function(){a.props.getPosts().catch(function(e){Object(d.x)(e,"Something went wrong when trying to fetch questions")})},a.handleOrderByFilterChange=function(e){var t=e.target.value,n=a.props.location;p.e.push(Object.assign({},n,{query:Object.assign({},n.query,{orderBy:t})}))},a.removeQuery=function(){var e=a.props.location;p.e.push(Object.assign({},e,{query:Object.assign({},e.query,{query:""})}))},i=n,s(a,i)}return a(t,e),j(t,[{key:"componentDidMount",value:function(){document.title="Sololearn | Discuss";var e=this.props,t=e.location,n=e.filters,r=Object.assign({},null!=t.query.query?y.a:n,t.query);this.props.setDiscussFilters(r);var s=Object(d.u)(y.a,r);p.e.replace(Object.assign({},t,{query:s})),this.props.getSidebarQuestions()}},{key:"componentWillUpdate",value:function(e){var t=e.location;if(!Object(d.q)(t.query,this.props.location.query)){var n=Object(d.u)(y.a,t.query);p.e.replace(Object.assign({},t,{query:n})),this.props.setDiscussFilters(Object.assign({},y.a,t.query))}}},{key:"componentWillUnmount",value:function(){this.props.setDiscussFilters(Object.assign({},this.props.filters,{query:""}))}},{key:"render",value:function(){var e=this.props,t=e.t,n=e.posts,r=e.filters,s=e.hasMore,a=e.isFetching;return l.a.createElement(b.m,{sidebar:l.a.createElement(g.b,null)},l.a.createElement(b.j,{hasMore:s,isLoading:a,loadMore:this.getPosts},l.a.createElement(v.y,{className:"discuss_questions-list"},l.a.createElement(v.i,{className:"toolbar"},l.a.createElement(v.k,null,t("discuss.title")),l.a.createElement(v.I,{className:"select",value:r.orderBy,onChange:this.handleOrderByFilterChange},l.a.createElement(v.v,{value:8},t("discuss.filter.trending")),l.a.createElement(v.v,{value:9},t("discuss.filter.your-network")),l.a.createElement(v.v,{value:1},t("discuss.filter.most-recent")),l.a.createElement(v.v,{value:2},t("discuss.filter.most-popular")),l.a.createElement(v.v,{value:4},t("discuss.filter.unanswered")),l.a.createElement(v.v,{value:5},t("discuss.filter.my-questions")),l.a.createElement(v.v,{value:6},t("discuss.filter.my-answers")))),l.a.createElement(g.c,{hasMore:s,questions:n}),l.a.createElement(g.a,null))))}}]),t}(o.Component))||u)||u);t.default=O},7074:function(e,t,n){"use strict";function r(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(s,a){try{var i=t[s](a),c=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(c).then(function(e){r("next",e)},function(e){r("throw",e)});e(c)}return r("next")})}}n.d(t,"d",function(){return f}),n.d(t,"c",function(){return p}),n.d(t,"g",function(){return d}),n.d(t,"e",function(){return h}),n.d(t,"f",function(){return y}),n.d(t,"a",function(){return v}),n.d(t,"b",function(){return b});var s=n(38),a=n.n(s),i=n(39),c=n(33),u=n(511),o=n(512),l=n(203),m=this,f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.count,n=void 0===t?20:t;return function(){var e=r(a.a.mark(function e(t,r){var s,o,l,f,p,d,h;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return s=r(),t({type:c._6}),o=Object(u.c)(s),l=Object(u.e)(s),f=l.length,e.next=6,i.b.request("Discussion/Search",Object.assign({index:f,count:n},o));case 6:if(p=e.sent,d=p.posts,!(h=p.error)){e.next=11;break}throw h;case 11:o===Object(u.c)(r())&&(t({type:c._24,payload:d}),d.length<n&&t({type:c.Q}));case 12:case"end":return e.stop()}},e,m)}));return function(t,n){return e.apply(this,arguments)}}()},p=function(){return{type:c.p}},d=function(e){return function(t,n){var r=Object(u.c)(n()),s=Object.assign({},e);e.orderBy&&(s.orderBy=parseInt(e.orderBy,10)),e.query&&e.query!==r.query&&(t(Object(o.c)({open:!0})),t(Object(o.b)(e.query)),t(Object(o.a)(l.a.posts)));var a=Object.keys(s);(0===a.length||a.some(function(e){return s[e]!==r[e]}))&&(t({type:c._16,payload:s}),t(p()))}},h=function(){return function(){var e=r(a.a.mark(function e(t){var n,r;return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.b.request("Discussion/Search",{index:0,query:"",count:10,orderBy:10});case 2:n=e.sent,r=n.posts,t({type:c._32,payload:r});case 5:case"end":return e.stop()}},e,m)}));return function(t){return e.apply(this,arguments)}}()},y=function(e){return{type:c._1,payload:e}},v=function(e){var t=e.id,n=e.countChange;return{type:c.h,payload:{id:t,countChange:n}}},b=function(e){return{type:c.l,payload:e}}},7229:function(e,t,n){"use strict";var r=n(7230);n.d(t,"a",function(){return r.a})},7230:function(e,t,n){"use strict";var r=n(0),s=n.n(r),a=n(3),i=n.n(a),c=n(7),u=n(10),o=n(7231),l=n(7232),m=(n.n(l),function(e){var t=e.tags;return s.a.createElement(c.i,{className:"discuss_tags"},Object(u.w)(t).map(function(e){return s.a.createElement(o.a,{key:e,tag:e})}))});m.propTypes={tags:i.a.arrayOf(i.a.string).isRequired},t.a=m},7231:function(e,t,n){"use strict";var r=n(0),s=n.n(r),a=n(7),i=n(12),c=function(e){var t=e.tag;return s.a.createElement(i.y,{className:"tag"},s.a.createElement(a.r,{to:{pathname:"/discuss",query:{query:t}}},t))};t.a=c},7232:function(e,t,n){var r=n(7233);"string"===typeof r&&(r=[[e.i,r,""]]);var s={hmr:!0};s.transform=void 0,s.insertInto=void 0;n(6)(r,s);r.locals&&(e.exports=r.locals)},7233:function(e,t,n){t=e.exports=n(5)(void 0),t.push([e.i,".discuss_tags {\n  flex-wrap: wrap; }\n  .discuss_tags .tag {\n    margin: 5px 5px 5px 0; }\n",""])},7272:function(e,t,n){"use strict";var r=n(7273);n.d(t,"c",function(){return r.a});var s=n(7279);n.d(t,"b",function(){return s.a});var a=n(7280);n.d(t,"a",function(){return a.a})},7273:function(e,t,n){"use strict";var r=n(0),s=n.n(r),a=n(51),i=n(7),c=n(12),u=n(7274),o=n(7277),l=function(e){var t=e.questions,n=e.hasMore;return t.length>0||n?0===t.length?s.a.createElement(u.a,null):s.a.createElement(i.s,null,t.map(function(e){return s.a.createElement(o.a,{key:e.id,question:e})})):s.a.createElement(c.e,null)};t.a=Object(a.observer)(l)},7274:function(e,t,n){"use strict";var r=n(0),s=n.n(r),a=n(7),i=n(200),c=n(7275),u=(n.n(c),function(){return s.a.createElement("div",{className:"discuss-shimmer-wrapper"},Array(20).fill(0).map(function(e,t){return s.a.createElement(i.d,{className:"discuss-shimmer-container",key:t},s.a.createElement(a.h,null,s.a.createElement(i.c,{width:260}),s.a.createElement(i.c,{width:200}),s.a.createElement(a.i,{justifyBetween:!0,className:"post-tags"},s.a.createElement(i.e,{width:"40%"}),s.a.createElement(i.e,{width:"30%"}),s.a.createElement(i.e,{width:"25%"}))),s.a.createElement(a.i,{fullWidth:!0,justifyEnd:!0},s.a.createElement(i.c,{width:"15%"})))}))});t.a=u},7275:function(e,t,n){var r=n(7276);"string"===typeof r&&(r=[[e.i,r,""]]);var s={hmr:!0};s.transform=void 0,s.insertInto=void 0;n(6)(r,s);r.locals&&(e.exports=r.locals)},7276:function(e,t,n){t=e.exports=n(5)(void 0),t.push([e.i,".discuss-shimmer-wrapper {\n  width: 100%;\n  max-height: 100vh;\n  overflow: hidden; }\n  .discuss-shimmer-wrapper .discuss-shimmer-container {\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n    padding: 15px;\n    height: 80px;\n    border-bottom: 1px solid #EFEFEF; }\n    .discuss-shimmer-wrapper .discuss-shimmer-container .post-tags {\n      width: 50%; }\n",""])},7277:function(e,t,n){"use strict";var r=n(0),s=n.n(r),a=n(16),i=n(7),c=n(12),u=n(10),o=n(7278),l=n(7229),m=function(e){var t=e.question,n=e.t;return s.a.createElement(r.Fragment,null,s.a.createElement(i.t,null,s.a.createElement(i.i,{column:!0,className:"question"},s.a.createElement(i.i,{className:"info"},s.a.createElement(c.c,{to:"/discuss/"+t.id},s.a.createElement(i.i,{className:"numbers"},s.a.createElement(o.a,{number:t.votes,text:n("discuss.votes-title")}),s.a.createElement(o.a,{number:t.answers>99?"99+":t.answers,text:n(1===t.answers?"discuss.answer-one-format":"discuss.answer-other-format")}))),s.a.createElement(i.i,{column:!0,className:"question-info"},s.a.createElement(i.r,{to:"/discuss/"+t.id},s.a.createElement(i.T,null,t.title)),s.a.createElement(l.a,{tags:t.tags}))),s.a.createElement(i.h,{className:"author"},s.a.createElement(i.H,{className:"text"},Object(u.C)(t.date)," "),s.a.createElement(c.A,{to:"/profile/"+t.userID},t.userName)))),s.a.createElement(i.l,null))};t.a=Object(a.b)()(m)},7278:function(e,t,n){"use strict";var r=n(0),s=n.n(r),a=n(7),i=function(e){var t=e.number,n=e.text;return s.a.createElement(a.i,{column:!0,align:!0,justify:!0,className:"number-with-text"},s.a.createElement(a.Q,null,t),s.a.createElement(a.H,null,n))};t.a=i},7279:function(e,t,n){"use strict";var r=n(0),s=n.n(r),a=n(19),i=n(16),c=n(511),u=n(302),o=n(7),l=n(12),m=n(55),f=function(e){return{questions:Object(c.h)(e),isEmpty:Object(c.g)(e)}},p=function(e){var t=e.isEmpty,n=e.questions,r=e.t;return s.a.createElement(o.h,{className:"discuss-sidebar"},s.a.createElement(o.k,null,r("discuss.filter.hot-today")),t?s.a.createElement(u.a,{noTitle:!0}):s.a.createElement(o.s,null,n.map(function(e){return s.a.createElement(o.t,{key:e.id},s.a.createElement(o.r,{to:"/discuss/"+e.id},s.a.createElement(l.i,{Icon:m.u},s.a.createElement(o.H,null,e.title))))})))};t.a=Object(a.b)(f)(Object(i.b)()(p))},7280:function(e,t,n){"use strict";var r=n(0),s=n.n(r),a=n(12),i=n(55),c=function(){return s.a.createElement(a.c,{to:"/discuss/new"},s.a.createElement(a.g,{alignment:"right"},s.a.createElement(i.b,null)))};t.a=c},7281:function(e,t,n){var r=n(7282);"string"===typeof r&&(r=[[e.i,r,""]]);var s={hmr:!0};s.transform=void 0,s.insertInto=void 0;n(6)(r,s);r.locals&&(e.exports=r.locals)},7282:function(e,t,n){t=e.exports=n(5)(void 0),t.push([e.i,".discuss_questions-list {\n  position: relative; }\n  .discuss_questions-list .toolbar {\n    justify-content: space-between;\n    align-items: center;\n    margin-bottom: 5px; }\n  .discuss_questions-list .question {\n    width: 100%; }\n    .discuss_questions-list .question .numbers {\n      width: 110px;\n      display: flex;\n      justify-content: center; }\n      .discuss_questions-list .question .numbers .number-with-text {\n        margin-right: 5px; }\n    .discuss_questions-list .question .author {\n      z-index: 1;\n      align-self: flex-end; }\n      .discuss_questions-list .question .author .text {\n        font-size: 14px; }\n",""])}});
//# sourceMappingURL=9.27ab5c14.chunk.js.map