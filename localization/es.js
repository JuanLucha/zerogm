exports.es = {
  mainMenu: {
    oracle: 'oráculo',
    diceCheck: 'tirada de dado',
    changeLanguage: 'cambiar idioma'
  },
  languages: [
    {name: 'Inglés' , code: 'en'},
    {name: 'Español' , code: 'es'},
  ],
  oracle: {
    placeHolder: '¿Cómo de probable? (-4 a +4 si es una pregunta al master)',
    question: '¿Cuál es la pregunta?',
    nanError: `El valor debe ser un número`,
    defaultQuestion: 'Pregunta al oráculo'
  },
  diceCheck: {
    dicePlaceHolder: '¿Qué dados lanzar? (20, 100, 1d20, 1d8, f)',
    noValueError: `Debes introducir un valor para los dados`,
    nanError: `El valor de los dados debe ser un número o en formato xdy (1d4, 2d6, etc...)`,
    reasonPlaceHolder: '¿Cuál es el motivo de la tirada?',
    extremeYes: `Definitivamente sí`,
    yes: `Sí`,
    no: `No`,
    extremeNo: `Definitivamente no`,
    positiveOutcome: `y ocurre algo positivo para ti relacionado con`,
    negativeOutcome: `y se fuerza uno de tus aspectos`,
    outcomes: [
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
  }
}
