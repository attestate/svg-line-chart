import t from"htm";import e from"vhtml";import{isEqual as n,isAfter as r,isSameDay as o,eachMonthOfInterval as l,format as h}from"date-fns";import{paramCase as a}from"param-case";function i(){return(i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}let s,f,g,u,p=t=>t;const c=t.bind(e);function m(t,e){const{x:n,labels:r}=w(10,e.width,t.x),{min:o,max:l}=M(t.y,e.margin),h=v(5,e.height,o,l,t.y),a=E(o,l,e.yDistance),f=v(5,e.height,o,l,a),g=y(n,h,e.line);return c(s||(s=p`
      <svg viewBox="0 0 ${0} ${0}">
        <title>${0}</title>
        ${0}
        ${0}
        ${0}
        ${0}
        ${0}
        ${0}
        ${0}
        ${0}
      </svg>
    `),e.width,e.height,e.title,O(10,10,0,e.height-5,e.xAxis),O(10,e.width,e.height-5,e.height-5,e.yAxis),j(0,(e.height-5)/2,e.yLabel.name,i({style:"transform: rotate(-90deg);"},e.yLabel),{style:"transform: translate(-15%, 55%)"}),a.map((t,n)=>j(10/1.5,f[n]+.5,t,e.yLabel)),f.map(t=>O(10,e.width,t,t,e.yLabel)),r.map(({pos:t,name:n})=>j(t,e.height-2.5,n,e.xLabel)),r.map(({pos:t},n)=>{if(0!==n)return O(t,t,0,e.height-5,e.xLabel)}),g)}function y(t,e,n){if(n=L(n),t.length!==e.length)throw new Error(`x and y parameters need to be of same length. They are not: x (${t.length}) and y (${e.length}).`);if(0===t.length)throw new Error("Length of data x and y cannot be zero");let r="";for(let n=0;n<t.length;n++)r+=`${t[n]},${e[n]} `;return r=r.slice(0,-1),c(f||(f=p`
    <polyline ...${0} points=${0}/>
  `),n,r)}function $(t){return t.sort((t,e)=>t-e)}function x(t,e){if(t.length<2)return t.length;let n=[[t[0]]];for(let r=1;r<t.length;r++){const o=t[r];let l;for(let t of n)e(o,t[0])&&(l=t);l?l.push(o):n.push([o])}return n.length}function b(t,e,n){return t/x(e,n)}function d(t,e){let o=[],l=[...e];for(let e=0;e<t.length;e++){const h=t[e];for(let t=0;t<l.length;t++){const a=l[t];(n(h,a)||r(h,a))&&(o.push(e),l.splice(t,1),e=0)}}if(l.length>0)for(let e=t.length;e<t.length+l.length;e++)o.push(e);return o}function w(t,e,n,r=o){n=$(n);const a=b(e-t,n,r),i=n.map((e,n)=>t+n*a),s=l({start:n[0],end:n[n.length-1]}),f=d(n,s),g=s.map(t=>h(t,"MMM yyyy"));return{x:i,labels:f.map((e,n)=>({pos:t+e*a,name:g[n]}))}}function M(t,e=0){const n=Math.max.apply(Math,t)+e;return{min:Math.min.apply(Math,t)-e,max:n}}function v(t,e,n,r,o){const l=t,h=e;return o.map(o=>e-2*t-(h-l)*(o-n)/(r-n)+l)}function L(t){let e={};return Object.keys(t).forEach(n=>{e[a(n)]=t[n]}),e}function O(t,e,n,r,o){return o=L(o),c(g||(g=p`
    <g ...${0}>
      <line x1=${0} x2=${0} y1=${0} y2=${0}></line>
    </g>
  `),o,t,e,n,r)}function j(t,e,n,r,o){return r=L(r),c(u||(u=p`
    <g ...${0}>
      <text ...${0} x=${0} y=${0}>${0}</text>
    </g>
  `),o,r,t,e,n)}function E(t,e,n){const r=[];for(let o=Math.floor(t);o<=e;o++)o%n==0&&r.push(o);return r}export{j as axisLabel,x as countUnique,E as generateLabelRange,M as getMinMax,d as insertInto,m as plot,b as pointWidth,y as polyline,O as renderAxis,w as scaleDates,v as scalePoints,$ as sortRangeAsc,L as toParamCase};
//# sourceMappingURL=line-chart.modern.js.map
