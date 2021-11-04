# svg-line-chart

[![npm version](https://badge.fury.io/js/svg-line-chart.svg)](https://badge.fury.io/js/svg-line-chart) [![Node.js CI](https://github.com/TimDaub/svg-line-chart/actions/workflows/node.js.yml/badge.svg)](https://github.com/TimDaub/svg-line-chart/actions/workflows/node.js.yml)

## Why?

- browser-svg-line-chart.js is 34KB
  ([d3.min.js](https://cdnjs.cloudflare.com/ajax/libs/d3/6.6.2/d3.min.js) is
  264KB!)
- Just generates a `<svg>` line chart. NO EXTRA JS OR CSS.
- Responsiveness through `<svg>` tag
- Unit tests & Small code base
- CJS and ESM bundles

## Screenshot

![](./assets/screenshot.png)

## Installation

```bash
$ npm i svg-line-chart vhtml htm
```

## Usage

A working example can be found in
[`./scripts/serve.mjs`](https://github.com/TimDaub/svg-line-chart/blob/master/scripts/serve.mjs).
                                                             
```js                                                        
import htm from "htm";
import vhtml from "vhtml";
const html = htm.bind(vhtml);

import { plot } from "svg-line-chart";

const x = ["2021-01-01T00:00:00.000Z","2021-01-02T00:00:00.000Z"];
const y = [0, 1];

const svgChart = plot(html)(
  { x, y },                                                  
  {                                                          
    props: {
      style: "display:block;margin:0 auto;"
    },
    margin: 10,                                              
    width: 70,                                               
    height: 35,                                              
    title: "A line chart",                                   
    polygon: {
      fill: "none",
      style: "fill:url(#polygrad);",
      strokeWidth: 0.01,
      stroke: "white"
    },
    polygonGradient: {
      offSet1: "0%",
      stopColor1: "blue",
      offSet2: "100%",
      stopColor2: "orange"
    },
    line: {                                                  
      fill: "none",                                          
      strokeWidth: 0.1,                                      
      stroke: "black"                                        
    },                                                       
    xAxis: {                                                 
      strokeWidth: 0.1,                                      
      stroke: "black"                                        
    },                                                       
    yAxis: {                                                 
      strokeWidth: 0.1,                                      
      stroke: "black"                                        
    },                                                       
    xLabel: {                                                
      strokeWidth: 0.05,                                     
      stroke: "lightgrey",                                   
      fontSize: 1.5                                          
    },                                                       
    yLabel: {                                                
      strokeWidth: 0.05,                                     
      stroke: "lightgrey",                                   
      fontSize: 1.5                                          
    },                                                       
    yNumLabels: 10
  }
);
```

### Notes

- `plot` will try to automatically scale the y labels based on how many labels
  you prefer using `yNumLabels`. Please note that the algorithm behind
  `yNumLabels` is based on a best-effort strategy. There won't be a guarantee
  that it'll return the number specified.

## Changelog

### 0.3.1

- Fix cut of text labels at the border of the graph
- Stop gradient painting over x-axis
- Stop grey lines cutting into x and y-axis
- Fix timezone bug; Library can now be used in PST timezone without problems
- Remove redundant year number from x axis labels

### 0.3.0

- Add `polygon` and `polygonGradient` options.
- Export CommonJS and EcmaScript Modules side-by-side.

### 0.2.0

- Breaking change: Remove `yDistance` option
- Breaking change: Introduce `yNumLabels` option. Internally, add
  function to scale y label values to the power of ten.

### 0.1.2

- `scaleDates` function didn't consider svg width and rendered beyond right
  border. It was adjusted to consider the width of the svg and scale the input
  data points accordingly.

### 0.1.1

- `scaleDates` function assumed a uniformly distributed range of date data
  points which lead to temporal distortion of the graph. Distance between data
  points is now calculated precisely with a data-specific range measurement
  function (e.g. `differenceInDays` from date-fns).

### 0.1.0

- Release targeted bundles for node14 and browsers (minified)
- Breaking change: Separate `htm` and `vhtml` as `peerDependencies`
- Switch from `microbundle` to `esbuild`

### 0.0.4

- Target node again

### 0.0.3

- Target node

### 0.0.2

- Improve axis and line rendering through proper render-order

### 0.0.1

- Initial release

## License

See [License](./LICENSE).

## References

- https://css-tricks.com/how-to-make-charts-with-svg/
