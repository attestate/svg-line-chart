// @format
import htm from "htm";
import vhtml from "vhtml";
import { isBefore, isSameDay, format } from "date-fns";
import { paramCase } from "param-case";

const html = htm.bind(vhtml);

const defaultOptions = {
  fill: "none",
  stroke: "black",
  strokeWidth: "1"
};

export function polyline(x, y, options = defaultOptions) {
  options = { ...defaultOptions, ...options };
  options = toParamCase(options);

  if (x.length !== y.length) {
    throw new Error(
      `x and y parameters need to be of same length. They are not: x (${
        x.length
      }) and y (${y.length}).`
    );
  }

  if (x.length === 0) {
    throw new Error("Length of data x and y cannot be zero");
  }

  let points = "";
  for (let i = 0; i < x.length; i++) {
    points += `${x[i]},${y[i]} `;
  }

  // NOTE: We pop the last character as it's an unneeded space.
  points = points.slice(0, -1);

  return html`
    <polyline ...${options} points=${points}/>
  `;
}

export function sortRangeAsc(range) {
  return range.sort((a, b) => a - b);
}

export function countUnique(range, equalityOp) {
  if (range.length < 2) {
    return range.length;
  }
  let buckets = [[range[0]]];

  // NOTE: We start at `1` as we've already put element `0` in the first
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
}

// NOTE: Expects sorted `range` (ASC).
export function pointWidth(total, range, equalityOp) {
  const count = countUnique(range, equalityOp);
  return total / count;
}

export function scaleDates(from, to, range, equalityOp = isSameDay) {
  range = sortRangeAsc(range);
  const pWidth = pointWidth(to - from, range, equalityOp);
  return range.map((d, i) => from + i * pWidth);
}

export function getMinMax(range, margin = 0) {
  const max = Math.max.apply(Math, range) + margin;
  const min = Math.min.apply(Math, range) - margin;

  return {
    min,
    max
  };
}

export function scalePoints(from, to, min, max, range) {
  const minAllowed = from;
  const maxAllowed = to;

  // NOTE: For explaination see: https://stackoverflow.com/a/31687097/1263876
  const scale = val =>
    to -
    from * 2 -
    ((maxAllowed - minAllowed) * (val - min)) / (max - min) +
    minAllowed;
  return range.map(scale);
}

export function toParamCase(obj) {
  let pcObj = {};

  Object.keys(obj).forEach(key => {
    pcObj[paramCase(key)] = obj[key];
  });

  return pcObj;
}

export function renderAxis(x1, x2, y1, y2, options) {
  options = { ...defaultOptions, ...options };
  options = toParamCase(options);
  return html`
    <g ...${options}>
      <line x1=${x1} x2=${x2} y1=${y1} y2=${y2}></line>
    </g>
  `;
}

export function axisLabel(x, y, text, options, containerOptions) {
  options = toParamCase(options);
  return html`
    <g ...${containerOptions}>
      <text ...${options} x=${x} y=${y}>${text}</text>
    </g>
  `;
}

export function generateLabelRange(min, max, distance) {
  const labels = [];
  const start = Math.floor(min);
  for (let i = start; i <= max; i++) {
    if (i % distance === 0) {
      labels.push(i);
    }
  }

  return labels;
}
