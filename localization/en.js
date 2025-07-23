exports.en = {
  mainMenu: {
    mythic: "Mythic",
    recluse: "Recluse",
    oracle: "oracle",
    diceCheck: "dice check",
    changeLanguage: "change language",
  },
  languages: [{ name: "English", code: "en" }, { name: "Spanish", code: "es" }],
  oracle: {
    placeHolder: "How probable is it? (-4 to +4)",
    question: "Which is the question?",
    nanError: `The value must be a number`,
    defaultQuestion: "Ask the oracle"
  },
  diceCheck: {
    dicePlaceHolder: "What dices to throw? (20, 100, 1d20, 1d8, f)",
    noValueError: `You must enter a value for the dices`,
    nanError: `The value for the dices should be a number or a xdy format (1d4, 2d6, etc...)`,
    reasonPlaceHolder: "What is the reason of the check?",
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
  },
  mythic: {
    chaosFactor: "Chaos Factor",
    setChaosFactor: "Set Chaos Factor",
    increaseChaosFactor: "Increase Chaos Factor",
    decreaseChaosFactor: "Decrease Chaos Factor",
    fateCheck: "Fate Check",
    eventCheck: "Event Check",
    getEventMeaning: "Event Meaning Check",
    getAction: "Action Check",
    getDescription: "Description Check",
    detailsCheck: "Details Check",
    chaosFactorIs: "Chaos Factor is",
    chaosFactorIncreased: "Chaos Factor increased",
    chaosFactorDecreased: "Chaos Factor decreased",
    newChaosFactorIs: "The new Chaos Factor is",
    howLikely: "How likely is the question? (from -8 to +8, empty for 0)",
    setTheChaosFactor: "Set the new chaos Factor value, from 3 to 6"
  },
  globalErrors: {
    mustBeNumber: "Must be a number"
  }
};
