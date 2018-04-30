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

## CLI

After `diffter` is installed globally or in local NPM scripts:

```
diffter-report --base path\to\base.json --subject path\to\subject.json --save report.html
diffter-results --base path\to\base.json --subject path\to\subject.json --save data.js --js

Options:
  --help        Show help                                              [boolean]
  --config      Path to JS/JSON config file
  --base        Path of BASE results list JSON file.                  [required]
  --subject     Path of SUBJECT results list JSON file.               [required]
  --title       Title of the report                          [default: "Report"]
  --save        Path of JSON file where DiffResults should be saved.  [required]
  --comparator  Path of JS file which exports custom Comparator function. Config
                could also contain actual Comparator function.
  --filter      Path of JS file which exports custom Filter function. Config
                could also contain actual Filter function.
  --modifier    Path of JS file which exports custom function to transform
                source data to display data. Config could also contain actual
                Transform function.
  --js          Should the result be save to JS file which exports DiffResults
                Object.                                         [default: false]
```

The `--config` can specify a JS/JSON file, which can contain all the above-listed options.

## API

### `diff(baseList, subjectList[, options])`

**Params**:
* `{SourceList|Array} baseList` - the list of items used as the base list
* `{SourceList|Array} subjectList` - the list of subject items which are compared to the base list
* `{DiffOptions} options` - options could be passed to the analyzer.

**Returns**: `{DiffResults}` the results of the analysis

### `saveReport(filePath, title, results)`

**Params**:
* `{string} filePath` - the path to the file, where report needs to be stored
* `{string} title` - the title of the report
* `{DiffResults} results` - the results needs to be displayed in report

### `saveResults(filePath, results[, type[, jsPrefix]])`

**Params**:
* `{string} filePath` - the path to the file, where results needs to be stored
* `{DiffResults} results` - the results needs to be stored in the file
* `{string} type` - the type of the file to store the results, `js` or `json`, default: `json`
* `{string} jsPrefix` - the prefix which needs to be used in case of storing to JS, default: `module.exports = `

## Types

### `SourceList`

Type of a list as input for given methods.

* `{string} title` - the title/name of the list
* `{Array} items` - the actual items of the list

```json
{
    "title": "Souce List",
    "items": [1, 2, 3]
}
```

### `DiffResults`

Type of the diff-analysis results.

* `{DiffList} baseList` - the items of the base list
* `{DiffList} subjectList` - the items of the subject list
* `{Array<Array<number>>} indexes` - the list of indexes/states

```json
{
    "baseList": {
        "title": "Base List",
        "items": [
            {"title": 1},
            {"title": 2},
            {"title": 3}
        ]
    },
    "subjectList": {
        "title": "Subject List",
        "items": [
            {"title": 1},
            {"title": 3},
            {"title": 2}
        ]
    },
    "indexes": [
        [0, 0],
        [1, 2],
        [2, 1]
    ]
}
```

### `DiffList`

Type for a list to store result items.

* `{string} title` - the title/name of the list
* `{Array<DiffListItem>} items` - the actual items of the list

```json
{
    "title": "Subject List",
    "items": [
        {"title": 1},
        {"title": 3},
        {"title": 2}
    ]
}
```

### `DiffListItem`

Type for an item of a list.

* `{string} title` - the title/name of the actual item
* `{Object} metadata` - any metadata (key-value pair) of the given item

```json
{
    "title": 2
}
```

### `DiffOptions`

Type to define options of diff-analysis.

* `{Comparator} comparator` - the comparator function, by default: [deep-eql](https://www.npmjs.com/package/deep-eql)
* `{Filter} filter` - the filter funtion, by default: `() => true`
* `{Transform} transform` - the transform function, by default: `item => item`

```javascript
module.exports = {
    comparator: (a, b) => a === b,
    filter: item => !item.ignore,
    transform: item => ({
        title: item
    })
}
```

### `Comparator`

Type for comparator function, to compare to items in the diff-analyzer.

**Params**:
* `{*} base` - the base item
* `{*} subject` - the subject item

**Returns**: `{boolean}` - `true` if the two items are equal

### `Filter`

Type for filter function, to determine items to ignore.

**Params**:
* `{*} item` - the item to check

**Returns**: `{boolean}` - `true` if the item should be kept

### `Transform`

Type for transform function, to convert given items to `DiffListItem`.

**Params**:
* `{*} item` - the item to transform

**Returns**: `{DiffListItem}` - the transformed item