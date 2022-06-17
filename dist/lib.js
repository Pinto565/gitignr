"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleType = exports.allTypes = void 0;
const inquirer = __importStar(require("inquirer"));
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const nanospinner_1 = require("nanospinner");
const allTypes = () => {
    const spinner = (0, nanospinner_1.createSpinner)('Getting all the available configurations...').start();
    axios_1.default.get("https://api.github.com/repos/github/gitignore/contents").then((res) => {
        let allGitIgnores = res.data.map((item) => (item.name).replace(".gitignore", ""));
        let unwantedFiles = ["CONTRIBUTING.md", "LICENSE", "README.md", ".github", "community", "GlobalF"];
        return allGitIgnores.filter((item) => !unwantedFiles.includes(item));
    }).then((languages) => {
        if (languages.length > 0) {
            spinner.success({ text: "Done..!" });
            inquirer
                .prompt([
                {
                    type: "list",
                    message: "Pick the language of the project",
                    name: "language",
                    choices: languages
                }
            ])
                .then(({ language }) => {
                spinner.start({ text: "Getting the gitignore file..!" });
                axios_1.default.get(`https://raw.githubusercontent.com/github/gitignore/master/${language}.gitignore`).then((res) => {
                    let file = fs.createWriteStream(".gitignore", {
                        flags: "w"
                    });
                    file.write(res.data);
                    spinner.success({ text: "File created successfully..!" });
                }).catch(() => {
                    spinner.error({ text: "Something went wrong..!" });
                });
            });
        }
        else {
            spinner.error({ text: "Error in the getting the configurations.." });
        }
    });
};
exports.allTypes = allTypes;
const singleType = (projectType) => {
    const spinner = (0, nanospinner_1.createSpinner)('Searching for the configuration...').start();
    axios_1.default.get("https://api.github.com/repos/github/gitignore/contents").then((res) => {
        let allGitIgnores = res.data.map((item) => (item.name).replace(".gitignore", ""));
        let unwantedFiles = ["CONTRIBUTING.md", "LICENSE", "README.md", ".github", "community", "GlobalF"];
        return allGitIgnores.filter((item) => !unwantedFiles.includes(item));
    }).then((data) => {
        return data.find((item) => item.toLowerCase() == projectType.toLowerCase());
    }).then((data) => {
        if (data) {
            spinner.success({ text: `Found configuration for ${data}` });
            axios_1.default.get(`https://raw.githubusercontent.com/github/gitignore/master/${data}.gitignore`).then((res) => {
                // console.log(JSON.stringify(res.data))
                let file = fs.createWriteStream(".gitignore", {
                    flags: "w"
                });
                file.write(res.data);
                spinner.success({ text: "File created successfully..!" });
            }).catch(() => {
                spinner.error({ text: "Something went wrong..!" });
            });
        }
        else {
            spinner.error({ text: "Not found...!" });
        }
    }).catch(() => {
        spinner.error({ text: "Something went wrong....!" });
    });
};
exports.singleType = singleType;
