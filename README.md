# fly-unflow [![][travis-badge]][travis-link]

> Removes [Flow](https://flow.org/) type annotations with Fly

## Install

```sh
npm install --save-dev fly-unflow
```

## Usage

```js
exports.build = function * (fly) {
  yield fly.source('src/**/*.js').unflow({
    all: false,
    sourceMap: 'inline'
  }).target('lib');
};
```

## API

### .unflow(options)

#### options.all

Type: `Boolean`<br>
Default: `true`

Transforms _all_ files; not just those with a "@flow" comment.

#### options.pretty

Type: `Boolean`<br>
Default: `true`

Remove whitespace where annotations used to be. See [here](https://github.com/flowtype/flow-remove-types#pretty-transform) for more info.

#### options.sourceMap

Type: `String`<br>
Options: `internal|external`<br>
Default: `''`

Create an inline or an external sourcemap for each entry file. A `sourceMappingURL` comment is appended to each destination file.

> If using external maps, a `foo.js` entry will also generate a `foo.js.map` file.

## License

MIT © [Luke Edwards](https://lukeed.com)

[travis-link]:  https://travis-ci.org/lukeed/fly-unflow
[travis-badge]: http://img.shields.io/travis/lukeed/fly-unflow.svg?style=flat-square
