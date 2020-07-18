#!/usr/bin/env node

let fs = require('fs-extra');
let path = require('path');

let args = process.argv.slice(2);

let flags_map = [{
    required: true,
    key: '--name',
    value: true
}, {
    required: true,
    key: '--template',
    value: true
}];

// Parse the CLI commands into an object we can use
let flags = flags_map.map(descriptor => {
    let argIndex = args.findIndex(a => a === descriptor.key);
    if (descriptor.required && argIndex === -1) {
        console.error('Missing ' + descriptor.key + ' flag.');
        process.exit(1);
    }

    if (descriptor.value) {
        if (!args[argIndex + 1] || args[argIndex + 1].startsWith('--')) {
            console.error('Missing value for ' + descriptor.key + ' flag.');
            process.exit(1);
        } else {
            return [descriptor.key, args[argIndex + 1]];
        }
    } else {
        return [descriptor.key, false];
    }
}).reduce((acc, val) => {
    acc[val[0]] = val[1];
    return acc;
}, {});

// Check to see if directory exists and is empty
let projectName = flags['--name'];
let projectPath = path.resolve(process.cwd(), projectName);

if (fs.existsSync(projectPath) && fs.readdirSync(projectPath).length !== 0) {
    console.error('Target directory "' + projectName + '" is not empty.');
    process.exit(1);
}

// Check to see if the template exists in the templates directory
let selectedTemplate = flags['--template'];
let availableTemplates = fs.readdirSync(path.resolve(__dirname + '/templates'));
if (availableTemplates.indexOf(selectedTemplate) === -1) {
    console.error([
        '',
        '  Template does not exist "' + selectedTemplate + '".',
        '  The following templates are available:',
        '',
        ...availableTemplates.map(t => (
        '      * ' + t
        )),
        ''
    ].join('\n'));
    process.exit(1);
}

// Start copying
if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath);
}

let templateDirectory = path.resolve(__dirname + '/templates/' + selectedTemplate);
fs.copySync(templateDirectory, projectPath);
console.log([
    '',
    '  Created ' + selectedTemplate + ' template in ' + projectName + '.',
    '  Next steps: ',
    '',
    '      * cd ' + projectName,
    '      * npm install',
    '      * npm start',
    ''
].join('\n'));