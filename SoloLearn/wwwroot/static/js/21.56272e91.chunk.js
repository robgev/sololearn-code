webpackJsonp([21],{7144:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(0),o=n.n(r),a=n(7215),u=function(){return o.a.createElement(a.a,{alias:"Contact"})};e.default=u},7215:function(t,e,n){"use strict";function r(t){return function(){var e=t.apply(this,arguments);return new Promise(function(t,n){function r(o,a){try{var u=e[o](a),i=u.value}catch(t){return void n(t)}if(!u.done)return Promise.resolve(i).then(function(t){r("next",t)},function(t){r("throw",t)});t(i)}return r("next")})}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!==typeof e&&"function"!==typeof e?t:e}function u(t,e){if("function"!==typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var i=n(39),c=n.n(i),l=n(0),s=n.n(l),f=n(13),p=n(36),h=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),y=function(t){function e(){var t,n,r,u;o(this,e);for(var i=arguments.length,c=Array(i),l=0;l<i;l++)c[l]=arguments[l];return n=r=a(this,(t=e.__proto__||Object.getPrototypeOf(e)).call.apply(t,[this].concat(c))),r.state={content:null},u=n,a(r,u)}return u(e,t),h(e,[{key:"componentWillMount",value:function(){function t(){return e.apply(this,arguments)}var e=r(c.a.mark(function t(){var e,n;return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p.b.request("GetStaticPage",{alias:this.props.alias});case 2:e=t.sent,n=e.page,this.setState({content:n.pageContent}),document.title=n.title;case 6:case"end":return t.stop()}},t,this)}));return t}()},{key:"render",value:function(){return s.a.createElement(f.l,null,s.a.createElement("div",{dangerouslySetInnerHTML:{__html:this.state.content}}))}}]),e}(l.Component);e.a=y}});
//# sourceMappingURL=21.56272e91.chunk.js.map