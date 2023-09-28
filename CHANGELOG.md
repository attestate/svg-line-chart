# Changelog


### 0.4.1

- Add capability to input Integer array for x axis
- Fix label name rendering for x and y axis

### 0.4.0

- (breaking) Pass `options.xAxis` and `options.yAxis` to correct axis
  (it was wrong before).
- (breaking) Separate font and axis style configuration.
- Align y-axis label properly to not waste space.
- Separate numerical magnitude of axis labels with comma

### 0.3.3

- Time between two points horizontally is now scaled as their difference in
  hours and not their difference in days.

### 0.3.2

- Add `props` attribute to `options` to allow defining properties on the root
  `<svg>` tag.

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
