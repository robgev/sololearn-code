webpackJsonp([18],{7010:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),o=n.n(r),a=n(7080),u=function(){return o.a.createElement(a.a,{alias:"Terms-of-Use"})};t.default=u},7080:function(e,t,n){"use strict";function r(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){function r(o,a){try{var u=t[o](a),i=u.value}catch(e){return void n(e)}if(!u.done)return Promise.resolve(i).then(function(e){r("next",e)},function(e){r("throw",e)});e(i)}return r("next")})}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function u(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var i=n(38),c=n.n(i),s=n(0),l=n.n(s),f=n(12),p=n(39),h=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),y=function(e){function t(){var e,n,r,u;o(this,t);for(var i=arguments.length,c=Array(i),s=0;s<i;s++)c[s]=arguments[s];return n=r=a(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(c))),r.state={content:null},u=n,a(r,u)}return u(t,e),h(t,[{key:"componentWillMount",value:function(){function e(){return t.apply(this,arguments)}var t=r(c.a.mark(function e(){var t,n;return c.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p.b.request("GetStaticPage",{alias:this.props.alias});case 2:t=e.sent,n=t.page,this.setState({content:n.pageContent}),document.title=n.title;case 6:case"end":return e.stop()}},e,this)}));return e}()},{key:"render",value:function(){return l.a.createElement(f.l,null,l.a.createElement("div",{dangerouslySetInnerHTML:{__html:this.state.content}}))}}]),t}(s.Component);t.a=y}});
//# sourceMappingURL=18.d8a482d7.chunk.js.map