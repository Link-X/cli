const fs = require('fs')
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')
 
function changeJson(fileName, params){
    fs.readFile(fileName,function(err,data){
        if(err){
            console.error(err)
        }
        const person = JSON.parse(data.toString())
        for (let i in person) {
            if (params[i]) {
                person[i] = params[i]
            }
        }
        const str = JSON.stringify(person)
        fs.writeFile(fileName,str, function(err) {
            if(err){
                console.error(err)
            }
        })
    })
}

function downloadWebReact (name) {
    inquirer.prompt([
        {
          name: 'description',
          message: '请输入项目描述'
        },
        {
          name: 'author',
          message: '请输入作者名称'
        }
      ]).then((answers) => {
        const spinner = ora('download...')
        spinner.start()
        download('direct:https://github.com/Link-X/broke-fn-mobile#master', name, {clone: true}, (err) => {
          if(err){
            spinner.fail()
            console.log(chalk.red(err))
          }else{
            spinner.succeed()
            const fileName = `${name}/package.json`
            const meta = {
              name,
              description: answers.description,
              author: answers.author
            }
            if(fs.existsSync(fileName)){
                changeJson(fileName, meta)
            }
            console.log(chalk.green('success'))
          }
        })
      })
}

program.version('1.0.0', '-v, --version')
  .command('init <name>')
  .action((name) => {
    if(!fs.existsSync(name)){
        inquirer.prompt({
            type: 'list',
            name: 'create',
            message: '想创建啥？',
            choices: [
              {
                name: 'web项目',
                value: 'web'
              },
              {
                name: 'taro项目',
                value: 'taro'
              }
            ]
        }).then(({ create }) => {
            if (create === 'web') {
                downloadWebReact(name)
            } else if (create === 'taro') {
                console.log('over')
            }
        })
    }else{
      console.log(symbols.error, chalk.red('项目已存在'))
    }
  })


program.parse(process.argv)