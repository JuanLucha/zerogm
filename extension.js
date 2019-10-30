// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const times = require('lodash').times
const languagesContent = require('./localization/index')

const mementoKeys = {
  language: 'language'
}

const defaultLanguage = 'en'

// Will store all the localized strings
let content

// Main menu options
let options

let outcomeTargets

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "zerogm" is now active!')

  // Get the language and set the variables
  let language = context.globalState.get(mementoKeys.language) || defaultLanguage
  content = languagesContent[language]
  outcomeTargets = content.diceCheck.outcomes
  options = {
    oracle: `1. ${content.mainMenu.oracle}`,
    diceCheck: `2. ${content.mainMenu.diceCheck}`
  }

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.zeroGM', () => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showQuickPick([options.oracle, options.diceCheck]).then(manageMainAction)
  })

  context.subscriptions.push(disposable)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate () {}

module.exports = {activate,deactivate}

// ///////////////////
// Logic functions //
// ///////////////////

function manageMainAction (selection) {
  if (selection === options.oracle) {
    doOracleCheck()
  } else {
    doDiceCheck()
  }
}

function doOracleCheck () {
  vscode.window
    .showInputBox({
      placeHolder: content.oracle.placeHolder,
      validateInput: value => {
        if (isNaN(value)) {
          return content.oracle.nanError
        }
      }
    })
    .then((modifier) => {
      return Promise.all([
        Promise.resolve(modifier),
        vscode.window
          .showInputBox({
            placeHolder: content.diceCheck.reasonPlaceHolder
          })
      ])
    })
    .then(([modifier, message = content.oracle.defaultQuestion]) => {
      if (modifier === '') modifier = 0
      const fateCheck = fateDiceCheck(parseInt(modifier))
      writeToDocument(fateCheck)
    })
}

function doDiceCheck () {
  vscode.window
    .showInputBox({
      placeHolder: content.diceCheck.dicePlaceHolder,
      validateInput: value => {
        if (!value) {
          return content.diceCheck.noValueError
        } else if (isNaN(value) && !value.includes('d')) {
          return content.diceCheck.nanError
        }
      }
    })
    .then((dice) => {
      return Promise.all([
        Promise.resolve(dice),
        vscode.window
          .showInputBox({
            placeHolder: content.diceCheck.reasonPlaceHolder
          })
      ])
    })
    .then(([dice, message = '']) => {
      const diceCheck = checkDice(dice)
      if (!dice.includes('d')) {
        dice = `1d${dice}`
      }
      const completeCheck = `\`\`\`
${message}
${dice} -> ${diceCheck}
\`\`\`
`
      writeToDocument(completeCheck)
    })
}

function checkDice (dice) {
  let numberOfDices = 1
  let kindOfDice
  if (dice.toLowerCase().includes('d')) {
    const parsedDice = dice.toLowerCase().split('d')
    numberOfDices = parsedDice[0]
    kindOfDice = parsedDice[1]
  } else {
    kindOfDice = dice
  }
  let result = []
  times(numberOfDices, () => {
    const check = Math.floor(Math.random() * kindOfDice + 1)
    result.push(check)
  })
  return formatDiceCheck(result)
}

function formatDiceCheck (results) {
  let resultCheck = ''
  let total = 0

  results.forEach((result, index) => {
    resultCheck += `${result}`
    total += parseInt(result)
    if (index < results.length - 1) {
      resultCheck += ` + `
    } else {
      resultCheck += ` = `
    }
  })
  resultCheck += ` ${total}`

  return resultCheck
}

function fateDiceCheck (modifier) {
  let fateCheck = [0, 0, 0, 0]
  fateCheck = fateCheck.map(() => fateDice())
  const fateCheckValue = fateCheck.reduce((acumulator, dice) => acumulator + dice) + modifier
  return formatFateCheck(fateCheck, modifier, fateCheckValue)
}

function fateDice () {
  return Math.floor(Math.random() * 3 + 2) - 3
}

function writeToDocument (value) {
  const editor = vscode.window.activeTextEditor
  const position = editor.selection.active
  editor.edit(edit => {
    edit.insert(position, value)
  })
}

function formatFateCheck (fateCheck, modifier, fateCheckValue) {
  let formattedCheck = fateCheck.reduce((accumulator, value, index) => {
    switch (value) {
      case -1:
        accumulator += '- '
        break
      case 0:
        accumulator += '͸ '
        break
      case 1:
        accumulator += '+ '
        break
    }

    return accumulator
  }, '')

  let resultInText = checkFateCheckAnswer(fateCheckValue)
  resultInText += checkSideOutcome(fateCheck)

  return `\`\`\`
${formattedCheck} + ${modifier} = ${fateCheckValue}
${resultInText}
\`\`\`
`
}

function checkFateCheckAnswer (value) {
  if (value >= 0) {
    return content.diceCheck.yes
  } else {
    return content.diceCheck.no
  }
}

function checkSideOutcome (fateCheck) {
  let sideOutcome = ''
  let positives = 0
  let negatives = 0

  fateCheck.forEach(value => {
    if (value > 0) {
      positives++
    } else if (value < 0) {
      negatives++
    }
  })

  if (positives > 2) {
    sideOutcome = ` ${content.diceCheck.positiveOutcome} ${getOutcomeTarget()}`
  } else if (negatives > 2) {
    sideOutcome = ` ${content.diceCheck.negativeOutcome}`
  }

  return sideOutcome
}

function getOutcomeTarget () {
  const index = Math.floor(Math.random() * 10) + 1

  return outcomeTargets[index]
}
