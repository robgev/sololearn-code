webpackJsonp([23],{7134:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function a(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var c,u,i,l=n(0),s=n.n(l),f=n(20),p=n(23),b=n(598),y=n(642),h=n(11),g=n(7),m=n(13),v=n(636),w=n(635),O=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),j={getDiscoverSuggestions:b.b},_=(c=Object(p.b)(null,j),u=Object(f.b)(),c(i=u(i=function(e){function t(){var e,n,a,c;r(this,t);for(var u=arguments.length,i=Array(u),l=0;l<u;l++)i[l]=arguments[l];return n=a=o(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(i))),a.componentDidMount=function(){a.props.getDiscoverSuggestions().catch(function(e){return Object(h.z)(e,"Something went wrong when trying to fetch user suggestions")})},c=n,o(a,c)}return a(t,e),O(t,[{key:"render",value:function(){var e=this.props.t;return s.a.createElement(m.m,{sidebar:s.a.createElement(y.a,{t:e})},s.a.createElement(g.y,null,s.a.createElement(v.a,null),s.a.createElement(g.l,null),s.a.createElement(w.a,{isPopup:!1})))}}]),t}(l.Component))||i)||i);t.default=_}});
//# sourceMappingURL=23.24666631.chunk.js.map