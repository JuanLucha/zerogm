const inCode = (text) => `
\'\'\'
${text}
\'\'\'
`

const writeToDocument = (value, vscode) => {
  const editor = vscode.window.activeTextEditor
  const position = editor.selection.active
  editor.edit((edit) => {
    edit.insert(position, value)
  })
}

exports.markdownToolsFactory = (vscode) => {
  return {
    inCode,
    writeToDocument: (value) => {
      return writeToDocument(value, vscode)
    },
  }
}
