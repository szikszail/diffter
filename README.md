# diffter

[![Build Status](https://travis-ci.org/szikszail/diffter.svg?branch=master)](https://travis-ci.org/szikszail/diffter) [![dependency Status](https://david-dm.org/szikszail/diffter.svg)](https://david-dm.org/szikszail/diffter) [![devDependency Status](https://david-dm.org/szikszail/diffter/dev-status.svg)](https://david-dm.org/szikszail/diffter#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/szikszail/diffter/badge.svg?branch=master)](https://coveralls.io/github/szikszail/diffter?branch=master)

**diffter** can be used to determine the difference between two list of any items and generate an HTML report about the results.

## Prerequisites

* NodeJS 6+

## Usage

The following script generated the report can be seen below:

```javascript
const {diff, saveReport} = require('diffter');

const baseList = [1, 2, 3, 4];
const subjectList = [1, 3, 4, 5];

const results = diff(baseList, subjectList);
saveReport('./report', results);
```

![report](example.png)

The items are colored in the following way:

* **Green** items are the **same** in both list.
* **Blue** items are **changed position** in subject list.
* **Red** items in base list are those which are **deleted** in subject list.
* **Yellow** items in subject list are those which are **new** compared to the base list.
* **Gray** items are the **ignored** items.

## API

### `diff(baseList, subjectList[, options])`

**Params**:
* `{Array} baseList` - the list of items used as the base list
* `{Array} subjectList` - the list of subject items which are compared to the base list
* `{DiffOptions} options` - options could be passed to the analyzer.

**Returns**: `{DiffResults}` the results of the analysis