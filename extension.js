const vscode = require('vscode')
const times = require('lodash').times
const languagesContent = require('./localization/index')

const mementoKeys = {
  language: 'language',
}

const defaultLanguage = 'en'

// Will store all the localized strings
let content

// Main menu options
let options

// Will store the targets of the outcomes from the Oracle checks
let outcomeTargets

// Local storage
let storage

// Language of the messages shown to the user
let language

// Mythic oracle
let mythic

// Function to write in the document
let writeToDocument

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "zerogm" is now active!')

  // Get the language and set the variables
  storage = context.globalState
  loadLanguage()

  console.log('Language loaded, registering commands...')

  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.zeroGM', () => {
    // Display a message box to the user
    vscode.window
      .showQuickPick([
        options.mythic,
        options.recluse,
        options.oracle,
        options.diceCheck,
        options.changeLanguage,
      ])
      .then(manageMainAction)
  })

  context.subscriptions.push(disposable)
  mythic = require('./systems/mythic').mythicFactory(vscode, content)

  // Mythic commands
  const mythicCommands = [
    vscode.commands.registerCommand(
      'extension.zeroGM.mythic.fateCheck',
      mythic.doFateCheck
    ),
    vscode.commands.registerCommand(
      'extension.zeroGM.mythic.eventCheck',
      mythic.doEventCheck
    ),
    vscode.commands.registerCommand(
      'extension.zeroGM.mythic.detailsCheck',
      mythic.doDetailsCheck
    ),
    vscode.commands.registerCommand(
      'extension.zeroGM.mythic.chaosFactor',
      mythic.getChaosFactor
    ),
    vscode.commands.registerCommand(
      'extension.zeroGM.mythic.increaseChaosFactor',
      mythic.increaseChaosFactor
    ),
    vscode.commands.registerCommand(
      'extension.zeroGM.mythic.decreaseChaosFactor',
      mythic.decreaseChaosFactor
    ),
    vscode.commands.registerCommand(
      'extension.zeroGM.mythic.setChaosFactor',
      mythic.setChaosFactor
    ),
    vscode.commands.registerCommand(
      'extension.zeroGM.mythic.getEventMeaning',
      mythic.getEventMeaning
    ),
    vscode.commands.registerCommand(
      'extension.zeroGM.mythic.getAction',
      mythic.getAction
    ),
    vscode.commands.registerCommand(
      'extension.zeroGM.mythic.getDescription',
      mythic.getDescription
    ),
  ]
  context.subscriptions.push(mythicCommands)

  // Register Tree View Providers for sidebar
  const { ZeroGMMythicProvider, ZeroGMOracleProvider } = require('./sidebar/treeProviders');
  
  const mythicProvider = new ZeroGMMythicProvider(mythic, content);
  const oracleProvider = new ZeroGMOracleProvider(content);
  
  vscode.window.createTreeView('zeroGMMythic', {
    treeDataProvider: mythicProvider
  });
  
  vscode.window.createTreeView('zeroGMOracle', {
    treeDataProvider: oracleProvider
  });

  // Oracle and Dice commands for the sidebar
  const sidebarCommands = [
    vscode.commands.registerCommand('zeroGM.oracleCheck', doOracleCheck),
    vscode.commands.registerCommand('zeroGM.diceCheck', doDiceCheck),
    vscode.commands.registerCommand('extension.zeroGM.changeLanguage', changeLanguage)
  ];

  context.subscriptions.push(...sidebarCommands);

  writeToDocument =
    require('./tools/markdown').markdownToolsFactory(vscode).writeToDocument
  
  console.log('Extension activation completed')
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = { activate, deactivate }

// ///////////////////
// Logic functions //
// ///////////////////

function manageMainAction(selection) {
  switch (selection) {
    case options.mythic:
      mythic.openMythicMenu()
      break
    case options.recluse:
      doOracleCheck()
      break
    case options.oracle:
      doOracleCheck()
      break
    case options.diceCheck:
      doDiceCheck()
      break
    case options.changeLanguage:
      changeLanguage()
      break
  }
}

function doOracleCheck() {
  vscode.window
    .showInputBox({
      placeHolder: content.oracle.placeHolder,
      validateInput: (value) => {
        if (isNaN(value)) {
          return content.oracle.nanError
        }
      },
    })
    .then((modifier) => {
      return Promise.all([
        Promise.resolve(modifier),
        vscode.window.showInputBox({
          placeHolder: content.diceCheck.reasonPlaceHolder,
        }),
      ])
    })
    .then(([modifier, message = content.oracle.defaultQuestion]) => {
      if (modifier === '') modifier = 0
      const fateCheck = fateDiceCheck(parseInt(modifier), message)
      writeToDocument(fateCheck)
    })
}

function doDiceCheck() {
  vscode.window
    .showInputBox({
      placeHolder: content.diceCheck.dicePlaceHolder,
      validateInput: (value) => {
        if (value.trim() === '') {
          return true
        } else if (!value) {
          return content.diceCheck.noValueError
        } else if (
          isNaN(value) &&
          !value.includes('f') &&
          !value.includes('d') &&
          !value.includes('+') &&
          !value.includes('-')
        ) {
          return content.diceCheck.nanError
        }
      },
    })
    .then((dice) => {
      return Promise.all([
        Promise.resolve(dice),
        vscode.window.showInputBox({
          placeHolder: content.diceCheck.reasonPlaceHolder,
        }),
      ])
    })
    .then(([dice, message]) => {
      let diceCheck
      if (dice.trim() === '' || dice.includes('f')) {
        dice = '4df'
        diceCheck = fateDiceCheck(0, message)
        writeToDocument(diceCheck)
      } else {
        diceCheck = checkDice(dice)
        if (!dice.includes('d')) {
          dice = `1d${dice}`
        }
        let completeCheck
        if (message) {
          completeCheck = `\`\`\`
${message}
${dice} -> ${diceCheck}
\`\`\`
`
        } else {
          completeCheck = `\`\`\`
${dice} -> ${diceCheck}
\`\`\`
`
        }
        writeToDocument(completeCheck)
      }
    })
}

function checkDice(dice) {
  let numberOfDices = 1
  let kindOfDice
  let modifier
  if (dice.toLowerCase().includes('d')) {
    const parsedDice = dice.toLowerCase().split('d')
    numberOfDices = parsedDice[0]
    kindOfDice = parsedDice[1]
  } else {
    kindOfDice = dice
  }
  if (kindOfDice.includes('+')) {
    modifier = parseInt(kindOfDice.split('+')[1])
    kindOfDice = kindOfDice.split('+')[0]
  }
  if (kindOfDice.includes('-')) {
    modifier = -parseInt(kindOfDice.split('-')[1])
    kindOfDice = kindOfDice.split('-')[0]
  }
  let result = []
  times(numberOfDices, () => {
    let check = Math.floor(Math.random() * kindOfDice + 1)
    result.push(check)
  })
  return formatDiceCheck(result, modifier)
}

function formatDiceCheck(results, modifier) {
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
  if (modifier) {
    total = total + modifier
  }
  resultCheck += ` ${total}`

  return resultCheck
}

function fateDiceCheck(modifier, message) {
  let fateCheck = [0, 0, 0, 0]
  fateCheck = fateCheck.map(() => fateDice())
  const fateCheckValue =
    fateCheck.reduce((acumulator, dice) => acumulator + dice) + modifier
  return formatFateCheck(fateCheck, modifier, fateCheckValue, message)
}

function fateDice() {
  return Math.floor(Math.random() * 3 + 2) - 3
}

function formatFateCheck(fateCheck, modifier, fateCheckValue, message) {
  let formattedCheck = fateCheck.reduce((accumulator, value) => {
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

  let formattedMessage
  if (message) {
    formattedMessage = `\`\`\`
${message}
${formattedCheck} + ${modifier} = ${fateCheckValue}
${resultInText}
\`\`\`
`
  } else {
    formattedMessage = `\`\`\`
${formattedCheck} + ${modifier} = ${fateCheckValue}
${resultInText}
\`\`\`
`
  }

  return formattedMessage
}

function checkFateCheckAnswer(value) {
  if (value >= 0) {
    return content.diceCheck.yes
  } else {
    return content.diceCheck.no
  }
}

function checkSideOutcome(fateCheck) {
  let sideOutcome = ''
  let positives = 0
  let negatives = 0

  fateCheck.forEach((value) => {
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

function getOutcomeTarget() {
  const index = Math.floor(Math.random() * 10 + 1)

  return outcomeTargets[index]
}

function changeLanguage() {
  const languageOptions = content.languages.map((language, index) => {
    return `${index + 1}. ${language.name} (${language.code})`
  })
  vscode.window.showQuickPick(languageOptions).then((selectedLanguage) => {
    if (selectedLanguage) {
      const languageCode = selectedLanguage.match(/\(([^)]+)\)/)[1]
      storage.update(mementoKeys.language, languageCode).then(() => {
        loadLanguage()
      })
    }
  })
}

function loadLanguage() {
  language = storage.get(mementoKeys.language) || defaultLanguage
  content = languagesContent[language]
  outcomeTargets = content.diceCheck.outcomes
  options = {
    mythic: `1. ${content.mainMenu.mythic}`,
    recluse: `2. ${content.mainMenu.recluse}`,
    oracle: `3. ${content.mainMenu.oracle}`,
    diceCheck: `4. ${content.mainMenu.diceCheck}`,
    changeLanguage: `5. ${content.mainMenu.changeLanguage}`,
  }
}
