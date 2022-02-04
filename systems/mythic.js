const mythic = require('solo-rpg-lib').mythic

let vscode
let content
let inCode
let writeToDocument

exports.mythicFactory = (_vscode, _content) => {
  vscode = _vscode
  content = _content
  const markdownTools =
    require('../tools/markdown').markdownToolsFactory(vscode)
  inCode = markdownTools.inCode
  writeToDocument = markdownTools.writeToDocument

  return {
    openMythicMenu: function () {
      const mythicOptions = [
        `1. ${content.mythic.fateCheck}`,
        `2. ${content.mythic.eventCheck}`,
        `3. ${content.mythic.detailsCheck}`,
        `4. ${content.mythic.chaosFactor}`,
        `5. ${content.mythic.increaseChaosFactor}`,
        `6. ${content.mythic.decreaseChaosFactor}`,
        `7. ${content.mythic.setChaosFactor}`,
        `8. ${content.mythic.getEventMeaning}`,
        `9. ${content.mythic.getAction}`,
        `10. ${content.mythic.getDescription}`,
      ]
      vscode.window.showQuickPick(mythicOptions).then((selectedOption) => {
        if (!selectedOption) return
        switch (selectedOption) {
          case mythicOptions[0]:
            this.doFateCheck()
            break
          case mythicOptions[1]:
            this.doEventCheck()
            break
          case mythicOptions[2]:
            this.doDetailsCheck()
            break
          case mythicOptions[3]:
            this.getChaosFactor()
            break
          case mythicOptions[4]:
            this.increaseChaosFactor()
            break
          case mythicOptions[5]:
            this.decreaseChaosFactor()
            break
          case mythicOptions[6]:
            this.setChaosFactor()
            break
          case mythicOptions[7]:
            this.getEventMeaning()
            break
          case mythicOptions[8]:
            this.getAction()
            break
          case mythicOptions[9]:
            this.getDescription()
            break
          default:
            return
        }
      })
    },
    doFateCheck: () => {
      vscode.window
        .showInputBox({
          placeHolder: content.diceCheck.reasonPlaceHolder,
        })
        .then((reason) => {
          return Promise.all([
            Promise.resolve(reason),
            vscode.window.showInputBox({
              placeHolder: content.mythic.howLikely,
              validateInput: (value) => {
                if (isNaN(value)) {
                  return content.globalErrors.mustBeNumber
                }
              },
            }),
          ])
        })
        .then(([message = content.oracle.defaultQuestion, modifier]) => {
          if (
            modifier === '' ||
            (parseInt(modifier) < -8 && parseInt(modifier) > 8)
          )
            modifier = 0
          modifier = parseInt(modifier)
          let fateCheck = content.mythic.fateCheck
          fateCheck += message ? `: ${message}` : ''
          fateCheck += `\n${mythic.fateCheck(modifier)}`
          writeToDocument(inCode(fateCheck))
        })
    },
    doEventCheck: () => writeToDocument(inCode(mythic.eventCheck())),
    doDetailsCheck: () => writeToDocument(inCode(mythic.detailsCheck())),
    setChaosFactor: () => {
      vscode.window
        .showInputBox({
          placeHolder: content.mythic.setTheNewChaosFactor,
          validateInput: (value) => {
            if (isNaN(value)) {
              return content.globalErrors.mustBeNumber
            }
          },
        })
        .then((newChaosFactor) => {
          newChaosFactor =
            newChaosFactor === ''
              ? 0
              : parseInt(newChaosFactor) < 3
              ? 3
              : parseInt(newChaosFactor) > 6
              ? 6
              : newChaosFactor
          newChaosFactor = parseInt(newChaosFactor)
          mythic.setChaosFactor(newChaosFactor)
          writeToDocument(
            inCode(`${content.mythic.newChaosFactorIs} ${newChaosFactor}`)
          )
        })
    },
    getChaosFactor: () =>
      writeToDocument(
        inCode(`${content.mythic.chaosFactorIs} ${mythic.chaosFactor}`)
      ),
    increaseChaosFactor: () => {
      mythic.increaseChaosFactor()
      writeToDocument(
        inCode(
          `${content.mythic.chaosFactorIncreased}\n${content.mythic.newChaosFactorIs} ${mythic.chaosFactor}`
        )
      )
    },
    decreaseChaosFactor: () => {
      mythic.decreaseChaosFactor()
      writeToDocument(
        inCode(
          `${content.mythic.chaosFactorDecreased}\n${content.mythic.newChaosFactorIs} ${mythic.chaosFactor}`
        )
      )
    },
    getEventMeaning: () => writeToDocument(inCode(mythic.getEventMeaning())),
    getAction: () => writeToDocument(inCode(mythic.getActions())),
    getDescription: () => writeToDocument(inCode(mythic.getDescriptors())),
  }
}
