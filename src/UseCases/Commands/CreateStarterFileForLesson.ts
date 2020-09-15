import * as vscode from 'vscode'
import * as fs from 'fs'

import BrightScreen from '../../Entities/BrightScreen'

const CreateStarterFileForLesson: vscode.Disposable = vscode.commands.registerCommand('brightscreen.createStarterFileForLesson', treeItemContext => {
  const brightScreen = BrightScreen.getInstance()
  const workspaceFolder = brightScreen.workspaceFolder

  let starterFileAsString :string
  try{
    starterFileAsString = fs.readFileSync(`${workspaceFolder}/.brightScreen/${treeItemContext.starterFileLocation}`, 'utf-8')
  } catch (err) {
    console.log(err)
    vscode.window.showErrorMessage('Issue reading starter file provided by course.')
    return
  }
    try {
    vscode.window.activeTextEditor?.edit(builder => {
      builder.insert(new vscode.Position(0, 0), starterFileAsString)
    })
  } catch (err) {
    console.log(err)
    vscode.window.showErrorMessage('Coule Not create starter file for the lesson.')
    return
  }
})

export default CreateStarterFileForLesson
