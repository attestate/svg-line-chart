# API Documentation

### `plot(html)({ x, y }, { options })`

Returns a HTML string that can be rendered by a browser

```js
import htm from "htm";
import vhtml from "vhtml";

const html = htm.bind(vhtml);

plot(html)({ x, y }, { options });
```

### `x`

An array of Dates for the x-axis

##### Example:

```js
const x = [
  "2021-01-01",
  "2021-02-01",
  "2021-03-01",
  "2021-04-01",
  "2021-05-01",
].map((d) => new Date(d));
```

### `y`

An array of Numbers for the y-axis

##### Example:

```js
const y = [1, 2, 3, 4, 5];
```

### `options`

```ts
{
  // HTML attributes for the <svg> element
  props: StyleObject,

  // Add margin to the y data points
  margin: Number,

  // Width of the svg; used in viewBox
  width: Number,

  // Height of the svg; used in viewBox
  height: Number,

  // <title> tag
  title: String,
  
  // HTML attributes for the <polygon> element; used to create the gradient
  polygon: StyleObject,
  
  // HTML attributes for the <polyline> element; used to create the chart line
  line: StyleObject,
  
  // Colors and offset to define the gradient
  polygonGradient: {
    offSet1: string,
    stopColor1: string,
    offSet2: string,
    stopColor2: string
  },
  
  // HTML attributes for the x-axis line
  xAxis: StyleObject,
  
  // HTML attributes for the y-axis line
  yAxis: StyleObject,
  
  // HTML attributes for the labels on the x-axis
  xLabel: StyleObject,
  
  // HTML attributes for the labels on the y-axis
  yLabel: StyleObject,
  
  // HTML attributes for the labels on the vertical grid lines
  xGrid: StyleObject,
  
  // HTML attributes for the labels on the horizontal grid lines
  yGrid: StyleObject,
  
  // Number of labels on the y-axis
  // The rendered number may not be exact as the implemented algorithm is based on a best effort strategy
  yNumLabels: Number
}
```

#### `StyleObject`

This object is passed onto a corresponding html element.

```ts
StyleObject = {
  [key: string]: any
}
```

##### Example:

```js
props = {
  style: "margin: 0 auto",
  class: "svg-line-chart",
};
```

The `props` object is passed onto the `svg` html element. The returned html will have the following properties.

```html
<svg style="margin: 0 auto" class="svg-line-chart">
  <!-- More Code -->
</svg>
```
