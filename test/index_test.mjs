// @format
import test from "ava";
import { isSameDay } from "date-fns";

import {
  polyline,
  sortRangeAsc,
  countUnique,
  pointWidth,
  scaleDates,
  scalePoints,
  toParamCase,
  renderAxis,
  axisLabel,
  getMinMax,
  generateLabelRange,
  insertInto
} from "../src/index.mjs";

test("if generating a label range works", t => {
  const min = 75.1;
  const max = 184.4;
  const distance = 50;
  const range = generateLabelRange(min, max, distance);
  t.deepEqual(range, [100, 150]);
});

test("if getting minimum and maximum from a range works", t => {
  const { min, max } = getMinMax([-1, 0, -2, 5, 6, 10000, 2, -1100]);
  t.is(min, -1100);
  t.is(max, 10000);
});

test("if axis label can be set", t => {
  const x = 0;
  const y = 0;
  const text = "bla";
  const options = {
    camelCase: "to test param-case"
  };
  const actual = axisLabel(x, y, text, options);
  t.is(
    actual,
    `<g><text camel-case="to test param-case" x="${x}" y="${y}">${text}</text></g>`
  );
});

test("if polyline includes all data points", t => {
  const l = polyline([0, 1], [2, 3], { fill: "none", stroke: "black" });

  t.true(l.includes(`points="0,2 1,3"`));
});

test("if error is thrown when data list has different length", t => {
  t.throws(() => polyline([0, 1], [2]));
});

test("if error is thrown when data lengths are zero", t => {
  t.throws(() => polyline([], []));
});

test("if custom options can be set", t => {
  const custom = {
    fill: "bleu",
    stroke: "green",
    strokeWidth: "1337"
  };
  const l = polyline([0, 1], [2, 3], custom);

  t.true(l.includes(`points="0,2 1,3"`));
  t.true(l.includes(`fill="${custom.fill}"`));
  t.true(l.includes(`stroke="${custom.stroke}"`));
  t.true(l.includes(`stroke-width="${custom.strokeWidth}"`));
});

test("if range can be sorted ascending", t => {
  const range = [
    new Date("2021-01-02T00:00:00.000Z"),
    new Date("2021-01-01T00:00:00.000Z")
  ];
  const expected = [
    new Date("2021-01-01T00:00:00.000Z"),
    new Date("2021-01-02T00:00:00.000Z")
  ];
  const actual = sortRangeAsc(range);
  t.deepEqual(expected, actual);
});

test("if range can be counted but only counting unique dates based on custom equality operator", t => {
  const range1 = [
    new Date("2021-01-02T00:00:00.000Z"),
    new Date("2021-01-01T00:00:00.000Z")
  ];
  const c1 = countUnique(range1, isSameDay);
  t.is(c1, 2);

  const range3 = [];
  const c3 = countUnique(range3, isSameDay);
  t.is(c3, 0);

  const range4 = [new Date("2021-01-02T00:00:00.000Z")];
  const c4 = countUnique(range4, isSameDay);
  t.is(c4, 1);

  const range5 = [
    new Date("2021-01-01T00:00:00.000Z"),
    new Date("2021-01-01T12:23:00.000Z")
  ];
  const c5 = countUnique(range5, isSameDay);
  t.is(c5, 1);

  const range6 = [
    new Date("2021-01-01T00:00:00.000Z"),
    new Date("2021-01-01T12:23:00.000Z"),
    new Date("2021-01-02T00:00:00.000Z")
  ];
  const c6 = countUnique(range6, isSameDay);
  t.is(c6, 2);

  const range7 = [
    new Date("2021-01-01T00:00:00.000Z"),
    new Date("2021-01-02T00:00:00.000Z"),
    new Date("2021-01-02T00:00:00.000Z"),
    new Date("2021-01-01T00:00:00.000Z")
  ];
  const c7 = countUnique(range7, isSameDay);
  t.is(c7, 2);
});

test("if point width is calculated correctly", t => {
  const range = [
    new Date("2021-01-01T00:00:00.000Z"),
    new Date("2021-01-01T00:00:00.000Z"),
    new Date("2021-01-02T00:00:00.000Z"),
    new Date("2021-01-02T00:00:00.000Z")
  ];
  const total = 2;
  const width = pointWidth(total, range, isSameDay);
  t.is(width, 1);
});

test("if range to points works", t => {
  const range = [
    new Date("2021-01-01T00:00:00.000Z"),
    new Date("2021-01-02T00:00:00.000Z"),
    new Date("2021-01-02T00:00:00.000Z"),
    new Date("2021-01-03T00:00:00.000Z")
  ];

  const total = 3;

  const { x } = scaleDates(0, total, range, isSameDay);
  const [p1, p2, p3] = x;
  t.is(p1, 0);
  t.is(p2, 1);
  t.is(p3, 2);
});

test("if labels are shown at right position", t => {
  const range = [
    new Date("2021-01-01T00:00:00.000Z"),
    new Date("2021-02-01T00:00:00.000Z"),
    new Date("2021-03-01T00:00:00.000Z")
  ];

  const total = 3;

  const { x, labels } = scaleDates(0, total, range, isSameDay);
  const [p1, p2, p3] = x;
  t.is(p1, 0);
  t.is(p2, 1);
  t.is(p3, 2);

  const [l1, l2, l3] = labels;
  t.is(l1.pos, 0);
  t.is(l2.pos, 1);
  t.is(l3.pos, 2);
});

test("if scaling a simple set of points works", t => {
  const points = [0, 1, 1];
  const { min, max } = getMinMax(points);
  const [p1, p2, p3] = scalePoints(0, 1, min, max, points);
  t.is(p1, 1);
  t.is(p2, 0);
  t.is(p3, 0);
});

test("if scaling a complex set of points works", t => {
  const points = [0, 5];
  const { min, max } = getMinMax(points);
  const [p1, p2, p3] = scalePoints(0, 10, min, max, points);
  t.is(p1, 10);
  t.is(p2, 0);
});

test("if scaling points and adding a margin works", t => {
  const points = [1, 2];
  const margin = 1;
  const { min, max } = getMinMax(points, margin);
  const [p1, p2] = scalePoints(0, 3, min, max, points);
  t.is(p1, 2);
  t.is(p2, 1);
});

test("if scaling points, adding a margin and an offset works", t => {
  const points = [1, 2];
  const margin = 1;
  const from = 1;
  const to = 4;
  const { min, max } = getMinMax(points, margin);
  const [p1, p2] = scalePoints(from, to, min, max, points);
  t.is(p1, 2);
  t.is(p2, 1);
});

test("if param-case for object is applied", t => {
  const actual = toParamCase({ hello: "world", helloWorld: "helloWorld" });
  t.deepEqual(actual, {
    hello: "world",
    "hello-world": "helloWorld"
  });
});

test("if rendering an axis is possible", t => {
  const x1 = 1;
  const x2 = 2;
  const y1 = 3;
  const y2 = 4;

  const actual = renderAxis(x1, x2, y1, y2, { stroke: "black" });
  t.true(
    actual.includes(`<line x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}"></line>`)
  );
});

test("if dates can be inserted into a range of dates", t => {
  const exampleRange = [
    new Date("2021-01-01T00:00:00.000Z"),
    new Date("2021-01-02T00:00:00.000Z"),
    new Date("2021-01-02T00:00:00.000Z"),
    new Date("2021-01-03T00:00:00.000Z")
  ];
  const candidates = [
    new Date("2020-12-31T00:00:00.000Z"),
    new Date("2021-01-02T12:00:00.000Z"),
    new Date("2021-01-04T00:00:00.000Z"),
    new Date("2021-01-05T00:00:00.000Z")
  ];
  const originalCandidatesLength = candidates.length;
  const rangeLength = exampleRange.length;

  const insertedAt = insertInto(exampleRange, candidates);
  t.deepEqual(insertedAt, [0, 3, 4, 5]);
});
