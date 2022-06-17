import * as inquirer from "inquirer"
import axios from "axios"
import * as fs from "fs"
import { createSpinner } from "nanospinner"


export const allTypes = () => {
  const spinner = createSpinner('Getting all the available configurations...').start();
  axios.get("https://api.github.com/repos/github/gitignore/contents").then((res) => {
    let allGitIgnores = res.data.map((item: any) => (item.name).replace(".gitignore", ""))
    let unwantedFiles = ["CONTRIBUTING.md", "LICENSE", "README.md", ".github", "community", "GlobalF"]
    return allGitIgnores.filter((item: string) => !unwantedFiles.includes(item))
  }).then((languages: any) => {
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
          axios.get(`https://raw.githubusercontent.com/github/gitignore/master/${language}.gitignore`).then((res) => {
            let file = fs.createWriteStream(".gitignore", {
              flags: "w"
            })
            file.write(res.data)
            spinner.success({ text: "File created successfully..!" });
          }).catch(() => {
            spinner.error({ text: "Something went wrong..!" });
          })
        })
    } else {
      spinner.error({ text: "Error in the getting the configurations.." });
    }
  })
}

export const singleType = (projectType: any) => {
  const spinner = createSpinner('Searching for the configuration...').start();
  axios.get("https://api.github.com/repos/github/gitignore/contents").then((res) => {
    let allGitIgnores = res.data.map((item: any) => (item.name).replace(".gitignore", ""))
    let unwantedFiles = ["CONTRIBUTING.md", "LICENSE", "README.md", ".github", "community", "GlobalF"]
    return allGitIgnores.filter((item: string) => !unwantedFiles.includes(item))
  }).then((data) => {
    return data.find((item: string) => item.toLowerCase() == projectType.toLowerCase())
  }).then((data: any) => {
    if (data) {
      spinner.success({ text: `Found configuration for ${data}` });
      axios.get(`https://raw.githubusercontent.com/github/gitignore/master/${data}.gitignore`).then((res) => {
        // console.log(JSON.stringify(res.data))
        let file = fs.createWriteStream(".gitignore", {
          flags: "w"
        })
        file.write(res.data)
        spinner.success({ text: "File created successfully..!" });
      }).catch(() => {
        spinner.error({ text: "Something went wrong..!" });
      })
    } else {
      spinner.error({ text: "Not found...!" });
    }
  }).catch(() => {
    spinner.error({ text: "Something went wrong....!" });
  })
}