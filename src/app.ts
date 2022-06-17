#!/usr/bin/env node

import { Command } from "commander";
import { allTypes, singleType } from "./lib"

const program = new Command();

program
  .name('gitignr')
  .description('CLI to add gitignore for your projects')
  .version('1.0.0');

program
  .option('-t, --type <type>', 'add gitignore for specified type');

const options = program.opts();
program.parse(process.argv)

if (options.type) {
  singleType(options.type)
} else {
  allTypes()
}
