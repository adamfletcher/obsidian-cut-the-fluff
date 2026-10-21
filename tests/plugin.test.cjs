const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createRequire } = require('node:module');
const { join } = require('node:path');
const vm = require('node:vm');
const esbuild = require('esbuild');
const { EditorState } = require('@codemirror/state');

const root = join(__dirname, '..');
const sourceRequire = createRequire(join(root, 'main.ts'));
const source = esbuild.buildSync({
    entryPoints: [join(root, 'main.ts')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    packages: 'external',
    write: false,
}).outputFiles[0].text;

async function loadPlugin() {
    const notices = [];
    const errors = [];
    let settingsTab;
    class Plugin {
        app = { workspace: { updateOptions() {} } };
        async loadData() { return {}; }
        async saveData(settings) { this.savedSettings = { ...settings }; }
        addCommand() {}
        addSettingTab(tab) { settingsTab = tab; }
        registerEditorExtension() {}
    }
    const obsidian = {
        Plugin,
        PluginSettingTab: class {},
        Notice: class { constructor(message) { notices.push(message); } },
    };
    const context = {
        module: { exports: {} },
        require: name => name === 'obsidian' ? obsidian : sourceRequire(name),
        console: { error: (...args) => errors.push(args) },
        activeDocument: { body: { classList: { toggle() {} } } },
    };
    vm.runInNewContext(source, context);
    const plugin = new context.module.exports.default();
    await plugin.onload();
    return { plugin, settingsTab, notices, errors };
}

test('closing settings returns void and persists custom rules', async () => {
    const { plugin, settingsTab, notices, errors } = await loadPlugin();
    plugin.settings.customWordList = 'test phrase';
    assert.equal(settingsTab.hide(), undefined);
    await new Promise(setImmediate);
    assert.equal(plugin.savedSettings.customWordList, 'test phrase');
    assert.equal(plugin.regex.test('test phrase'), true);
    assert.equal(notices.length, 0);
    assert.equal(errors.length, 0);
});

test('closing settings reports a failed save without rejecting', async () => {
    const { plugin, settingsTab, notices, errors } = await loadPlugin();
    const failure = new Error('disk full');
    plugin.saveData = async () => { throw failure; };
    const result = settingsTab.hide();
    assert.equal(result, undefined);
    await new Promise(setImmediate);
    assert.deepEqual(notices, ['Cut The Fluff: could not save settings. Please try again.']);
    assert.equal(errors.length, 1);
    assert.equal(errors[0][1], failure);
});

function editorView(text) {
    return {
        state: EditorState.create({ doc: text }),
        visibleRanges: [{ from: 0, to: text.length }],
    };
}

function highlights(editor) {
    const ranges = [];
    editor.decorations.between(0, 1000, (from, to, decoration) => {
        ranges.push([from, to, decoration.spec.class]);
    });
    return ranges;
}

test('highlighting responds to style, custom rule and enabled settings', async () => {
    const { plugin } = await loadPlugin();
    const view = editorView('very clear prose');
    const editor = plugin.createViewPlugin().create(view);
    const update = () => editor.update({ view, docChanged: false, viewportChanged: false });
    assert.deepEqual(highlights(editor), [[0, 4, 'fluff fluff-dim']]);

    plugin.settings.highlightStyle = 'wavy-underline';
    plugin.settings.customWordList = 'clear';
    await plugin.saveSettings();
    update();
    assert.deepEqual(highlights(editor), [
        [0, 4, 'fluff fluff-wavy-underline'],
        [5, 10, 'fluff fluff-wavy-underline'],
    ]);

    plugin.settings.enabled = false;
    await plugin.saveSettings();
    update();
    assert.deepEqual(highlights(editor), []);

    plugin.settings.enabled = true;
    plugin.settings.highlightStyle = 'none';
    await plugin.saveSettings();
    update();
    assert.deepEqual(highlights(editor), [[0, 4, 'fluff'], [5, 10, 'fluff']]);
});

test('highlighting responds to document and viewport changes', async () => {
    const { plugin } = await loadPlugin();
    const editor = plugin.createViewPlugin().create(editorView('very clear'));
    const view = editorView('clear really');
    editor.update({ view, docChanged: true, viewportChanged: false });
    assert.deepEqual(highlights(editor), [[6, 12, 'fluff fluff-dim']]);

    view.visibleRanges = [{ from: 0, to: 5 }];
    editor.update({ view, docChanged: false, viewportChanged: true });
    assert.deepEqual(highlights(editor), []);
});
