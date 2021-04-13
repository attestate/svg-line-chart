var vhtml = require('vhtml');
var dateFns = require('date-fns');
var paramCase = require('param-case');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var vhtml__default = /*#__PURE__*/_interopDefaultLegacy(vhtml);

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var n=function(t,s,r,e){var u;s[0]=0;for(var h=1;h<s.length;h++){var p=s[h++],a=s[h]?(s[0]|=p?1:2,r[s[h++]]):s[++h];3===p?e[0]=a:4===p?e[1]=Object.assign(e[1]||{},a):5===p?(e[1]=e[1]||{})[s[++h]]=a:6===p?e[1][s[++h]]+=a+"":p?(u=t.apply(a,n(t,a,r,["",null])),e.push(u),a[0]?s[0]|=2:(s[h-2]=0,s[h]=u)):e.push(a);}return e},t=new Map;function htm(s){var r=t.get(this);return r||(r=new Map,t.set(this,r)),(r=n(this,r.get(s)||(r.set(s,r=function(n){for(var t,s,r=1,e="",u="",h=[0],p=function(n){1===r&&(n||(e=e.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?h.push(0,n,e):3===r&&(n||e)?(h.push(3,n,e),r=2):2===r&&"..."===e&&n?h.push(4,n,0):2===r&&e&&!n?h.push(5,0,!0,e):r>=5&&((e||!n&&5===r)&&(h.push(r,0,e,s),r=6),n&&(h.push(r,n,0,s),r=6)),e="";},a=0;a<n.length;a++){a&&(1===r&&p(),p(a));for(var l=0;l<n[a].length;l++)t=n[a][l],1===r?"<"===t?(p(),h=[h],r=3):e+=t:4===r?"--"===e&&">"===t?(r=1,e=""):e=t+e[0]:u?t===u?u="":e+=t:'"'===t||"'"===t?u=t:">"===t?(p(),r=1):r&&("="===t?(r=5,s=e,e=""):"/"===t&&(r<5||">"===n[a][l+1])?(p(),3===r&&(h=h[0]),r=h,(h=h[0]).push(2,0,r),r=0):" "===t||"\t"===t||"\n"===t||"\r"===t?(p(),r=2):e+=t),3===r&&"!--"===e&&(r=4,h=h[0]);}return p(),h}(s)),r),arguments,[])).length>1?r:r[0]}

const html = htm.bind(vhtml__default['default']);
const offsetX = 10;
const offsetY = 5;
function plot(data, options) {
  const {
    x,
    labels
  } = scaleDates(offsetX, options.width, data.x);
  const {
    min,
    max
  } = getMinMax(data.y, options.margin);
  const y = scalePoints(offsetY, options.height, min, max, data.y);
  const yPoints = generateLabelRange(min, max, options.yDistance);
  const yScaledLabels = scalePoints(offsetY, options.height, min, max, yPoints);
  const l = polyline(x, y, options.line);
  return html`
      <svg viewBox="0 0 ${options.width} ${options.height}">
        <title>${options.title}</title>
        ${renderAxis(offsetX, offsetX, 0, options.height - offsetY, options.xAxis)}
        ${renderAxis(offsetX, options.width, options.height - offsetY, options.height - offsetY, options.yAxis)}
        ${axisLabel(0, (options.height - offsetY) / 2, options.yLabel.name, _extends({
    style: "transform: rotate(-90deg);"
  }, options.yLabel), {
    style: "transform: translate(-15%, 55%)"
  })}
        ${yPoints.map((p, i) => {
    const scaledPoint = yScaledLabels[i]; // NOTE: +0.5 is to center text vertically

    return axisLabel(offsetX / 1.5, scaledPoint + 0.5, p, options.yLabel);
  })}
        ${yScaledLabels.map(p => {
    return renderAxis(offsetX, options.width, p, p, options.yLabel);
  })}
        ${labels.map(({
    pos,
    name
  }) => {
    return axisLabel(pos, options.height - offsetY / 2, name, options.xLabel);
  })}
        ${labels.map(({
    pos
  }, i) => {
    // NOTE: We don't want to draw over the y axis, hence for the first
    // element we don't draw.
    if (i === 0) return;
    return renderAxis(pos, pos, 0, options.height - offsetY, options.xLabel);
  })}
        ${l}
      </svg>
    `;
}
function polyline(x, y, options) {
  options = toParamCase(options);

  if (x.length !== y.length) {
    throw new Error(`x and y parameters need to be of same length. They are not: x (${x.length}) and y (${y.length}).`);
  }

  if (x.length === 0) {
    throw new Error("Length of data x and y cannot be zero");
  }

  let points = "";

  for (let i = 0; i < x.length; i++) {
    points += `${x[i]},${y[i]} `;
  } // NOTE: We pop the last character as it's an unneeded space.


  points = points.slice(0, -1);
  return html`
    <polyline ...${options} points=${points}/>
  `;
}
function sortRangeAsc(range) {
  return range.sort((a, b) => a - b);
}
function countUnique(range, equalityOp) {
  if (range.length < 2) {
    return range.length;
  }

  let buckets = [[range[0]]]; // NOTE: We start at `1` as we've already put element `0` in the first
  // bucket.

  for (let i = 1; i < range.length; i++) {
    const date = range[i];
    let match;

    for (let bucket of buckets) {
      if (equalityOp(date, bucket[0])) {
        match = bucket;
      }
    }

    if (match) {
      match.push(date);
    } else {
      buckets.push([date]);
    }
  }

  return buckets.length;
} // NOTE: Expects sorted `range` (ASC).

function pointWidth(total, range, equalityOp) {
  const count = countUnique(range, equalityOp);
  return total / count;
}
function insertInto(range, candidates) {
  let insertedAt = [];
  let cCopy = [...candidates];

  for (let i = 0; i < range.length; i++) {
    const date = range[i];

    for (let j = 0; j < cCopy.length; j++) {
      const candidate = cCopy[j];

      if (dateFns.isEqual(date, candidate)) {
        insertedAt.push(i);
        cCopy.splice(j, 1);
        i = 0;
      } else if (dateFns.isAfter(date, candidate)) {
        insertedAt.push(i);
        cCopy.splice(j, 1);
        i = 0;
      }
    }
  }

  if (cCopy.length > 0) {
    for (let i = range.length; i < range.length + cCopy.length; i++) {
      insertedAt.push(i);
    }
  }

  return insertedAt;
}
function scaleDates(from, to, range, equalityOp = dateFns.isSameDay) {
  range = sortRangeAsc(range);
  const pWidth = pointWidth(to - from, range, equalityOp);
  const x = range.map((d, i) => from + i * pWidth);
  const months = dateFns.eachMonthOfInterval({
    start: range[0],
    end: range[range.length - 1]
  });
  const insertedAt = insertInto(range, months);
  const names = months.map(d => dateFns.format(d, "MMM yyyy"));
  const labels = insertedAt.map((i, j) => ({
    pos: from + i * pWidth,
    name: names[j]
  }));
  return {
    x,
    labels
  };
}
function getMinMax(range, margin = 0) {
  const max = Math.max.apply(Math, range) + margin;
  const min = Math.min.apply(Math, range) - margin;
  return {
    min,
    max
  };
}
function scalePoints(from, to, min, max, range) {
  const minAllowed = from;
  const maxAllowed = to; // NOTE: For explaination see: https://stackoverflow.com/a/31687097/1263876

  const scale = val => to - from * 2 - (maxAllowed - minAllowed) * (val - min) / (max - min) + minAllowed;

  return range.map(scale);
}
function toParamCase(obj) {
  let pcObj = {};
  Object.keys(obj).forEach(key => {
    pcObj[paramCase.paramCase(key)] = obj[key];
  });
  return pcObj;
}
function renderAxis(x1, x2, y1, y2, options) {
  options = toParamCase(options);
  return html`
    <g ...${options}>
      <line x1=${x1} x2=${x2} y1=${y1} y2=${y2}></line>
    </g>
  `;
}
function axisLabel(x, y, text, options, containerOptions) {
  options = toParamCase(options);
  return html`
    <g ...${containerOptions}>
      <text ...${options} x=${x} y=${y}>${text}</text>
    </g>
  `;
}
function generateLabelRange(min, max, distance) {
  const labels = [];
  const start = Math.floor(min);

  for (let i = start; i <= max; i++) {
    if (i % distance === 0) {
      labels.push(i);
    }
  }

  return labels;
}

exports.axisLabel = axisLabel;
exports.countUnique = countUnique;
exports.generateLabelRange = generateLabelRange;
exports.getMinMax = getMinMax;
exports.insertInto = insertInto;
exports.plot = plot;
exports.pointWidth = pointWidth;
exports.polyline = polyline;
exports.renderAxis = renderAxis;
exports.scaleDates = scaleDates;
exports.scalePoints = scalePoints;
exports.sortRangeAsc = sortRangeAsc;
exports.toParamCase = toParamCase;
//# sourceMappingURL=line-chart.js.map
