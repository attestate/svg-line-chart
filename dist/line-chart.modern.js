import htm from 'htm';
import vhtml from 'vhtml';
import { isEqual, isAfter, isSameDay, eachMonthOfInterval, format } from 'date-fns';
import { paramCase } from 'param-case';

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

let _ = t => t,
    _t,
    _t2,
    _t3,
    _t4;
const html = htm.bind(vhtml);
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
  return html(_t || (_t = _`
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
    `), options.width, options.height, options.title, renderAxis(offsetX, offsetX, 0, options.height - offsetY, options.xAxis), renderAxis(offsetX, options.width, options.height - offsetY, options.height - offsetY, options.yAxis), axisLabel(0, (options.height - offsetY) / 2, options.yLabel.name, _extends({
    style: "transform: rotate(-90deg);"
  }, options.yLabel), {
    style: "transform: translate(-15%, 55%)"
  }), yPoints.map((p, i) => {
    const scaledPoint = yScaledLabels[i]; // NOTE: +0.5 is to center text vertically

    return axisLabel(offsetX / 1.5, scaledPoint + 0.5, p, options.yLabel);
  }), yScaledLabels.map(p => {
    return renderAxis(offsetX, options.width, p, p, options.yLabel);
  }), labels.map(({
    pos,
    name
  }) => {
    return axisLabel(pos, options.height - offsetY / 2, name, options.xLabel);
  }), labels.map(({
    pos
  }, i) => {
    // NOTE: We don't want to draw over the y axis, hence for the first
    // element we don't draw.
    if (i === 0) return;
    return renderAxis(pos, pos, 0, options.height - offsetY, options.xLabel);
  }), l);
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
  return html(_t2 || (_t2 = _`
    <polyline ...${0} points=${0}/>
  `), options, points);
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

      if (isEqual(date, candidate)) {
        insertedAt.push(i);
        cCopy.splice(j, 1);
        i = 0;
      } else if (isAfter(date, candidate)) {
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
function scaleDates(from, to, range, equalityOp = isSameDay) {
  range = sortRangeAsc(range);
  const pWidth = pointWidth(to - from, range, equalityOp);
  const x = range.map((d, i) => from + i * pWidth);
  const months = eachMonthOfInterval({
    start: range[0],
    end: range[range.length - 1]
  });
  const insertedAt = insertInto(range, months);
  const names = months.map(d => format(d, "MMM yyyy"));
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
    pcObj[paramCase(key)] = obj[key];
  });
  return pcObj;
}
function renderAxis(x1, x2, y1, y2, options) {
  options = toParamCase(options);
  return html(_t3 || (_t3 = _`
    <g ...${0}>
      <line x1=${0} x2=${0} y1=${0} y2=${0}></line>
    </g>
  `), options, x1, x2, y1, y2);
}
function axisLabel(x, y, text, options, containerOptions) {
  options = toParamCase(options);
  return html(_t4 || (_t4 = _`
    <g ...${0}>
      <text ...${0} x=${0} y=${0}>${0}</text>
    </g>
  `), containerOptions, options, x, y, text);
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

export { axisLabel, countUnique, generateLabelRange, getMinMax, insertInto, plot, pointWidth, polyline, renderAxis, scaleDates, scalePoints, sortRangeAsc, toParamCase };
//# sourceMappingURL=line-chart.modern.js.map
