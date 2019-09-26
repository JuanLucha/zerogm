// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "zerogm" is now active!')

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.zeroGM', function() {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showQuickPick(['1. tirada', '2. generador']).then(manageMainAction)
  })

  context.subscriptions.push(disposable)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
}

/////////////////////
// Logic functions //
/////////////////////

function manageMainAction(selection) {
  if (selection === '1. tirada') {
    vscode.window
      .showInputBox({
        placeHolder: '¿Cómo de probable? (-4 a +4)',
        validateInput: value => {
          if (value < -4 || value > 4) {
            return `El valor debe estar comprendido entre -4 y +4`
          }
        }
      })
      .then((modifier) => {
				if (modifier === '') modifier = 0
        const fateCheck = fateDiceCheck(parseInt(modifier))
        writeToDocument(fateCheck)
      })
  }
}

function fateDiceCheck(modifier) {
  let fateCheck = [0, 0, 0, 0]
  fateCheck = fateCheck.map(() => fateDice())
  const fateCheckValue = fateCheck.reduce((acumulator, dice) => acumulator + dice) + modifier
  return formatFateCheck(fateCheck, modifier, fateCheckValue)
}

function fateDice() {
  return Math.floor(Math.random() * 3 + 2) - 3
}

function writeToDocument(value) {
  const editor = vscode.window.activeTextEditor
  const position = editor.selection.active
  editor.edit(edit => {
    edit.insert(position, value)
  })
}

function formatFateCheck(fateCheck, modifier, fateCheckValue) {
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

function checkFateCheckAnswer(value) {
  if (value === 8) {
    return `Definitivamente sí`
  } else if (value >= 0) {
    return `Sí`
  } else if (value > -8) {
    return `No`
  } else {
    return `Definitivamente no`
  }
}

function checkSideOutcome(fateCheck) {
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
    sideOutcome = ` y ocurre algo positivo relacionado con ${getOutcomeTarget()}`
  } else if (negatives > 2) {
    sideOutcome = ` y ocurre algo negativo relacionado con ${getOutcomeTarget()}`
  }

  return sideOutcome
}

const outcomeTargets = [
  `uno de tus aspectos`,
  `uno de tus proezas`,
  `uno de tus aliados`,
  `uno de tus enemigos`,
  `lo que intentabas hacer`,
  `el escenario donde estás`,
  `un aspecto temporal beneficioso para ti`,
  `un aspecto temporal perjudicial para ti`,
  `tu concepto de personaje`,
  `tu personaje`
]

function getOutcomeTarget() {
  const index = Math.floor(Math.random() * 10) + 1

  return outcomeTargets[index]
}
