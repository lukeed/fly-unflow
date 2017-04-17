const join = require('path').join;
const test = require('tape');
const Fly = require('fly');

const dir = join(__dirname, 'fixtures');

const plugins = [require('fly-clear'), require('../')];

const tmpDir = str => join(__dirname, str);
const create = tasks => new Fly({tasks, plugins});
const hasFlow = str => /flow|interface|:/.test(str);

test('fly-unflow', t => {
	t.plan(2);
	const fly = create({
		*foo(f) {
			t.true('unflow' in f, 'attach `unflow` to Task instance');
			t.true('unflow' in fly.plugins, 'attach `unflow` plugin to instance');
		}
	});
	fly.start('foo');
});

test('fly-unflow (defaults)', t => {
	t.plan(3);
	create({
		*foo(f) {
			const tmp = tmpDir('tmp-1');
			yield f.source(`${dir}/*.js`).unflow().target(tmp);
			// totals
			const arr = yield f.$.expand(`${tmp}/*.js`);
			t.equal(arr.length, 2, 'send all files to target');
			// contents
			const str1 = yield f.$.read(`${tmp}/foo.js`, 'utf8');
			const str2 = yield f.$.read(`${tmp}/bar.js`, 'utf8');
			t.false(hasFlow(str1), 'remove flow evidence from `foo.js`');
			t.false(hasFlow(str2), 'remove flow evidence from `bar.js`');
			yield f.clear(tmp);
		}
	}).start('foo');
});

test('fly-unflow (all:false)', t => {
	t.plan(2);
	create({
		*foo(f) {
			const tmp = tmpDir('tmp-2');
			yield f.source(`${dir}/*.js`).unflow({all: false}).target(tmp);
			const str1 = yield f.$.read(`${tmp}/foo.js`, 'utf8');
			const str2 = yield f.$.read(`${tmp}/bar.js`, 'utf8');
			t.false(hasFlow(str1), 'remove flow evidence from `foo.js`');
			t.true(hasFlow(str2), 'keeps flow evidence within `bar.js`');
			yield f.clear(tmp);
		}
	}).start('foo');
});

test('fly-unflow (sourceMap:`inline`)', t => {
	t.plan(1);
	create({
		*foo(f) {
			const tmp = tmpDir('tmp-3');
			yield f.source(`${dir}/*.js`).unflow({sourceMap: 'inline'}).target(tmp);
			const str = yield f.$.read(`${tmp}/foo.js`, 'utf8');
			t.true(/sourceMappingURL=data:application/.test(str), 'attach an `inline` sourceMap');
			yield f.clear(tmp);
		}
	}).start('foo');
});

test('fly-unflow (sourceMap:`external`)', t => {
	t.plan(1);
	create({
		*foo(f) {
			const tmp = tmpDir('tmp-4');
			yield f.source(`${dir}/*.js`).unflow({sourceMap: 'external'}).target(tmp);
			const str = yield f.$.read(`${tmp}/foo.js`, 'utf8');
			t.true(/sourceMappingURL=foo.js.map/.test(str), 'attach an `external` sourceMap link');
			yield f.clear(tmp);
		}
	}).start('foo');
});
