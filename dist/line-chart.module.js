import n from"htm";import t from"vhtml";import{isEqual as r,isAfter as e,eachMonthOfInterval as o,format as a,isSameDay as i}from"date-fns";import{paramCase as u}from"param-case";function l(){return(l=Object.assign||function(n){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&(n[e]=r[e])}return n}).apply(this,arguments)}function h(n,t){return t||(t=n.slice(0)),n.raw=t,n}function f(n,t){(null==t||t>n.length)&&(t=n.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=n[r];return e}function c(n,t){var r;if("undefined"==typeof Symbol||null==n[Symbol.iterator]){if(Array.isArray(n)||(r=function(n,t){if(n){if("string"==typeof n)return f(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);return"Object"===r&&n.constructor&&(r=n.constructor.name),"Map"===r||"Set"===r?Array.from(n):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(n,t):void 0}}(n))||t&&n&&"number"==typeof n.length){r&&(n=r);var e=0;return function(){return e>=n.length?{done:!0}:{done:!1,value:n[e++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(r=n[Symbol.iterator]()).next.bind(r)}var g,m,s,p,y=n.bind(t);function v(n,t){var r=A(10,t.width,n.x),e=r.x,o=r.labels,a=L(n.y,t.margin),i=a.min,u=a.max,f=j(5,t.height,i,u,n.y),c=I(i,u,t.yDistance),m=j(5,t.height,i,u,c),s=d(e,f,t.line);return y(g||(g=h(['\n      <svg viewBox="0 0 '," ",'">\n        <title>',"</title>\n        ","\n        ","\n        ","\n        ","\n        ","\n        ","\n        ","\n        ","\n      </svg>\n    "])),t.width,t.height,t.title,S(10,10,0,t.height-5,t.xAxis),S(10,t.width,t.height-5,t.height-5,t.yAxis),E(0,(t.height-5)/2,t.yLabel.name,l({style:"transform: rotate(-90deg);"},t.yLabel),{style:"transform: translate(-15%, 55%)"}),c.map(function(n,r){return E(10/1.5,m[r]+.5,n,t.yLabel)}),m.map(function(n){return S(10,t.width,n,n,t.yLabel)}),o.map(function(n){return E(n.pos,t.height-2.5,n.name,t.xLabel)}),o.map(function(n,r){var e=n.pos;if(0!==r)return S(e,e,0,t.height-5,t.xLabel)}),s)}function d(n,t,r){if(r=O(r),n.length!==t.length)throw new Error("x and y parameters need to be of same length. They are not: x ("+n.length+") and y ("+t.length+").");if(0===n.length)throw new Error("Length of data x and y cannot be zero");for(var e="",o=0;o<n.length;o++)e+=n[o]+","+t[o]+" ";return e=e.slice(0,-1),y(m||(m=h(["\n    <polyline ..."," points=","/>\n  "])),r,e)}function b(n){return n.sort(function(n,t){return n-t})}function x(n,t){if(n.length<2)return n.length;for(var r=[[n[0]]],e=1;e<n.length;e++){for(var o,a=n[e],i=void 0,u=c(r);!(o=u()).done;){var l=o.value;t(a,l[0])&&(i=l)}i?i.push(a):r.push([a])}return r.length}function w(n,t,r){return n/x(t,r)}function M(n,t){for(var o=[],a=[].concat(t),i=0;i<n.length;i++)for(var u=n[i],l=0;l<a.length;l++){var h=a[l];(r(u,h)||e(u,h))&&(o.push(i),a.splice(l,1),i=0)}if(a.length>0)for(var f=n.length;f<n.length+a.length;f++)o.push(f);return o}function A(n,t,r,e){void 0===e&&(e=i),r=b(r);var u=w(t-n,r,e),l=r.map(function(t,r){return n+r*u}),h=o({start:r[0],end:r[r.length-1]}),f=M(r,h),c=h.map(function(n){return a(n,"MMM yyyy")});return{x:l,labels:f.map(function(t,r){return{pos:n+t*u,name:c[r]}})}}function L(n,t){void 0===t&&(t=0);var r=Math.max.apply(Math,n)+t;return{min:Math.min.apply(Math,n)-t,max:r}}function j(n,t,r,e,o){var a=n,i=t;return o.map(function(o){return t-2*n-(i-a)*(o-r)/(e-r)+a})}function O(n){var t={};return Object.keys(n).forEach(function(r){t[u(r)]=n[r]}),t}function S(n,t,r,e,o){return o=O(o),y(s||(s=h(["\n    <g ...",">\n      <line x1="," x2="," y1="," y2=","></line>\n    </g>\n  "])),o,n,t,r,e)}function E(n,t,r,e,o){return e=O(e),y(p||(p=h(["\n    <g ...",">\n      <text ..."," x="," y=",">","</text>\n    </g>\n  "])),o,e,n,t,r)}function I(n,t,r){for(var e=[],o=Math.floor(n);o<=t;o++)o%r==0&&e.push(o);return e}export{E as axisLabel,x as countUnique,I as generateLabelRange,L as getMinMax,M as insertInto,v as plot,w as pointWidth,d as polyline,S as renderAxis,A as scaleDates,j as scalePoints,b as sortRangeAsc,O as toParamCase};
//# sourceMappingURL=line-chart.module.js.map