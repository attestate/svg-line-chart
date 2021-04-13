# svg-line-chart

[![npm version](https://badge.fury.io/js/svg-line-chart.svg)](https://badge.fury.io/js/svg-line-chart) [![Node.js CI](https://github.com/TimDaub/svg-line-chart/actions/workflows/node.js.yml/badge.svg)](https://github.com/TimDaub/svg-line-chart/actions/workflows/node.js.yml)

## Why?

- line-chart.js.br is only 1.8KB
  ([d3.min.js](https://cdnjs.cloudflare.com/ajax/libs/d3/6.6.2/d3.min.js) is
  264KB!)
- Just generates a `<svg>` line chart. NO EXTRA JS OR CSS.
- Responsive & Configurable
- Unit tests & Small code base
- Node.js & Browsers

## Installation

Works for browser and node.js.

```bash
$ npm i svg-line-chart
```

## Usage

A working example can be found in
[`./scripts/serve.mjs`](https://github.com/TimDaub/svg-line-chart/blob/master/scripts/serve.mjs).
                                                             
```js                                                        
const x = ["2021-01-01T00:00:00.000Z","2021-01-02T00:00:00.000Z"];
const y = [0, 1];

const svgChart = plot(                                       
  { x, y },                                                  
  {                                                          
    margin: 10,                                              
    width: 70,                                               
    height: 35,                                              
    title: "A line chart",                                   
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
    yDistance: 50
  }
);
```

## Changelog

### 0.0.1

- Initial release

## License

See [License](./LICENSE).

## References

- https://css-tricks.com/how-to-make-charts-with-svg/
