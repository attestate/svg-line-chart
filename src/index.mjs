// @format
import htm from "htm";
import vhtml from "vhtml";
import { isBefore, isSameDay, format } from "date-fns";

const html = htm.bind(vhtml);

const defaultOptions = {
  fill: "none",
  stroke: "black",
  strokeWidth: "1"
};

export function polyline(x, y, options = defaultOptions) {
  options = { ...defaultOptions, ...options };

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
    <polyline
      fill=${options.fill}
      stroke=${options.stroke}
      stroke-width=${options.strokeWidth}
      points=${points}/>
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

export function scaleDates(total, range, equalityOp = isSameDay) {
  range = sortRangeAsc(range);
  const pWidth = pointWidth(total, range, equalityOp);
  return range.map((d, i) => i * pWidth);
}

export function scalePoints(total, range) {
  var max = Math.max.apply(Math, range);
  var min = Math.min.apply(Math, range);
  const maxAllowed = total;
  const minAllowed = 0;

  // NOTE: For explaination see: https://stackoverflow.com/a/31687097/1263876
  const scale = val =>
    total -
    ((maxAllowed - minAllowed) * (val - min)) / (max - min) +
    minAllowed;
  return range.map(scale);
}
