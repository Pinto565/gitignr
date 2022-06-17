#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const lib_1 = require("./lib");
const program = new commander_1.Command();
program
    .name('gitignr')
    .description('CLI to add gitignore for your projects')
    .version('1.0.0');
program
    .option('-t, --type <type>', 'add gitignore for specified type');
const options = program.opts();
program.parse(process.argv);
if (options.type) {
    (0, lib_1.singleType)(options.type);
}
else {
    (0, lib_1.allTypes)();
}
