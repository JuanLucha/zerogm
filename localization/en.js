exports.en = {
  mainMenu: {
    oracle: 'oracle',
    diceCheck: 'dice check'
  },
  oracle: {
    placeHolder: 'How probable is it? (-4 to +4)',
    question: 'Which is the question?',
    nanError: `The value must be a number`,
    defaultQuestion: 'Ask the oracle'
  },
  diceCheck: {
    dicePlaceHolder: 'What dices to throw? (20, 100, 1d20, 1d8, f)',
    noValueError: `You must enter a value for the dices`,
    nanError: `The value for the dices should be a number or a xdy format (1d4, 2d6, etc...)`,
    reasonPlaceHolder: 'What is the reason of the check?',
    extremeYes: `Extreme yes`,
    yes: `Yes`,
    no: `No`,
    extremeNo: `Extreme no`,
    positiveOutcome: `and something positive for you happens related to`,
    negativeOutcome: `and one of your aspects is compelled`,
    outcomes: [
      `one of your aspects`, 
      `une of your stunts`,
      `one of your allies`,
      `one of your enemies`,
      `what you are trying to do`,
      `the scenary where you are`,
      `a beneficial temporal aspect for you`,
      `a negative temporal aspect for you`,
      `the concept of your character`,
      `your character`
    ]
  }
}
