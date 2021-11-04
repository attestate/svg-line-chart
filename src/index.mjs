// @format
import {
  isAfter,
  isSameDay,
  format,
  isEqual,
  differenceInDays
} from "date-fns";
import { paramCase } from "param-case";

const offsetX = 10;
const offsetY = 5;

const PADDING = {
  RIGHT: 3,
  TOP: 2
};

let html;

function eachMonthOfInterval(interval) {
  // Return if invalid argument.
  if (!interval || typeof interval !== "object") return null;

  // Get start and end dates.
  const startDate = new Date(interval.start.getTime());
  const endDate = new Date(interval.end.getTime());

  const endTime = endDate.getTime();
  const dates = [];

  // Throw an exception if start date is after end date or if any date
  // is invalid.
  if (!(startDate.getTime() <= endTime)) {
    throw new RangeError("Invalid interval");
  }

  const currentDate = startDate;

  while (currentDate.getTime() <= endTime) {
    // Push current date to dates array
    dates.push(new Date(currentDate));

    // Increment month, starting on first day.
    currentDate.setMonth(currentDate.getMonth() + 1, 1);
  }

  return dates;
}

export function plot(renderer) {
  html = renderer;
  return _plot;
}

function _plot(data, options) {
  const { x, xScaledLabels } = scaleDates(
    offsetX,
    options.width - PADDING.RIGHT,
    data.x
  );

  const { min, max } = getMinMax(data.y, options.margin);
  const y = scalePoints(
    PADDING.TOP,
    options.height - offsetY,
    min,
    max,
    data.y
  );
  const yPoints = generateLabelRange(min, max, options.yNumLabels);
  const yScaledLabels = scalePoints(
    PADDING.TOP,
    options.height - offsetY,
    min,
    max,
    yPoints
  );

  const xGridLines = [
    ...xScaledLabels,
    {
      // Based on the fact that lines are equidistant from each other
      pos:
        xScaledLabels[xScaledLabels.length - 1].pos +
        xScaledLabels[1].pos -
        xScaledLabels[0].pos
    }
  ];
  const yGridLines = [
    ...yScaledLabels,
    // Based on the fact that lines are equidistant from each other
    yScaledLabels[yScaledLabels.length - 1] -
      (yScaledLabels[0] - yScaledLabels[1])
  ];

  const l = polyline(x, y, options.line);
  const gradient = polygon(x, y, options);

  return html`
    <svg ...${options.props} viewBox="0 0 ${options.width} ${options.height}">
      <defs>
        <linearGradient id="polygrad">
          <stop
            offset=${options.polygonGradient.offSet1}
            stop-color=${options.polygonGradient.stopColor1}
          />
          <stop
            offset=${options.polygonGradient.offSet2}
            stop-color=${options.polygonGradient.stopColor2}
          />
        </linearGradient>
      </defs>

      <title>${options.title}</title>
      ${yGridLines.map(p => {
        return renderAxis(offsetX, options.width, p, p, options.yLabel);
      })}
      ${xGridLines.map(({ pos }, i) => {
        // NOTE: We don't want to draw over the y axis, hence for the first
        // element we don't draw.
        if (i === 0) return;
        return renderAxis(
          pos,
          pos,
          0,
          options.height - offsetY,
          options.xLabel
        );
      })}
      ${l} ${gradient}
      ${renderAxis(
        offsetX,
        offsetX,
        0,
        options.height - offsetY,
        options.xAxis
      )}
      ${renderAxis(
        offsetX,
        options.width,
        options.height - offsetY,
        options.height - offsetY,
        options.yAxis
      )}
      ${axisLabel(
        0,
        (options.height - offsetY) / 2,
        options.yLabel.name,
        {
          style: "transform: rotate(-90deg);",
          ...options.yLabel
        },
        { style: "transform: translate(-15%, 55%)" }
      )}
      ${yPoints.map((p, i) => {
        const scaledPoint = yScaledLabels[i];
        // NOTE: +0.5 is to center text vertically
        return axisLabel(offsetX / 2, scaledPoint + 0.5, p, options.yLabel);
      })}
      ${xScaledLabels.map(({ pos, name }) => {
        return axisLabel(
          pos,
          options.height - offsetY / 2,
          name,
          options.xLabel
        );
      })}
    </svg>
  `;
}

export function polyline(x, y, options) {
  options = toParamCase(options);

  if (x.length !== y.length) {
    throw new Error(
      `x and y parameters need to be of same length. They are not: x (${x.length}) and y (${y.length}).`
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
    <polyline ...${options} points=${points} />
  `;
}

export function polygon(x, y, options) {
  const polygonOptions = toParamCase(options.polygon);

  if (x.length !== y.length) {
    throw new Error(
      `x and y parameters need to be of same length. They are not: x (${x.length}) and y (${y.length}).`
    );
  }

  if (x.length === 0) {
    throw new Error("Length of data x and y cannot be zero");
  }

  let gradientPoints = "";

  gradientPoints += `${x[0]},${options.height - offsetY} `;
  for (let i = 0; i < x.length; i++) {
    gradientPoints += `${x[i]},${y[i]} `;
  }
  gradientPoints += `${x[x.length - 1]},${options.height - offsetY} `;

  return html`
    <polygon ...${polygonOptions} points=${gradientPoints} />
  `;
}

export function sortRangeAsc(range) {
  return range.sort((a, b) => a - b);
}

export function pointWidth(totalSpace, range, rangeMeasurement) {
  const count = rangeMeasurement(range[range.length - 1], range[0]);
  return totalSpace / count;
}

export function insertInto(range, candidates) {
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

export function scaleDates(
  from,
  to,
  range,
  equalityOp = isSameDay,
  rangeMeasurement = differenceInDays
) {
  range = sortRangeAsc(range);

  const pWidth = pointWidth(to - from, range, rangeMeasurement);
  const start = range[0];
  const x = range.map(d => {
    const distanceFromStart = differenceInDays(d, start);
    const pos = from + distanceFromStart * pWidth;
    return pos;
  });

  const months = eachMonthOfInterval({
    start: range[0],
    end: range[range.length - 1]
  });

  const labels = months.map(firstDayOfMonth => {
    const distanceFromStart = differenceInDays(firstDayOfMonth, start);

    const // Get formatted date.
      _name = format(firstDayOfMonth, "MMM yy"),
      // Abbreviate date and add an apostrophe.
      name = [_name.slice(0, -2), "'", _name.slice(-2)].join("");

    return {
      name,
      pos: from + distanceFromStart * pWidth
    };
  });

  return { x, xScaledLabels: labels };
}

export function getMinMax(range, margin = 0) {
  const max = Math.max.apply(Math, range) + margin;
  let min = Math.min.apply(Math, range) - margin;

  // NOTE: We've observed cases where `min` reached a point beyond
  // zero and hence broke the assumptions the library was built upon. We hence
  // set min manually to zero if it goes negative.
  if (min < 0) {
    min = 0;
  }

  return {
    min,
    max
  };
}

/**
 * Scale the given points into the range [from, to].
 *
 * Points closer to min will be scaled closer to 'to'.
 * Points closer to max will be scaled closer to 'from'.
 *
 * Example - scalePoints(5, 30, 8, 20, [8, 9, 10, 11, 15, 16, 20])
 * = [30, 27.916666666666668, 25.833333333333332, 23.75, 15.416666666666666, 13.333333333333332, 5]
 *
 * Note: It is not necesarry for input range to include
 * min and max.
 *
 * @param from {Number} Lower bound of output range
 * @param to {Number} Upper bound of output range
 * @param min {number} Minimum value of the input range
 * @param max {Number} Maximum value of the input range
 * @param range {Number[]} Points within the range [min, max] to be scaled
 * @returns {Number[]} Array of scaled points
 */
export function scalePoints(from, to, min, max, range) {
  // NOTE: For explaination see: https://stackoverflow.com/a/5295202/11370119
  const scale = val => to - ((to - from) * (val - min)) / (max - min);
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

export function generateLabelRange(min, max, numLabels) {
  const space = max - min;
  const step = space / numLabels;
  const powerStep = Math.pow(10, Math.floor(Math.log10(step)));

  let diff;
  if (step > powerStep) {
    diff = Math.round(step / powerStep);
  } else {
    diff = Math.round(powerStep / step);
  }

  const labels = [];
  const pow10Start = Math.floor(Math.log10(min));
  let start;
  if (pow10Start <= 2) {
    start = 0;
  } else {
    start = Math.pow(10, pow10Start);
  }
  for (let i = start; i <= max; i += powerStep * diff) {
    if (i > min && i < max) {
      labels.push(i);
    }
  }

  return labels;
}
