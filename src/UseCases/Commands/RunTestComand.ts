import * as vscode from 'vscode'
import * as fs from 'fs'
import { exec  } from 'child_process'

import BrightScreen from '../../Entities/BrightScreen'

const RunTestCommand = vscode.commands.registerCommand('brightscreen.runTests', (treeItemContext) => {
  const brightscreen = BrightScreen.getInstance()
  const workspaceFolder = brightscreen.workspaceFolder
  const outputChannel = brightscreen.outputChannel

  let lessonCodeAsString: string
  try {
    lessonCodeAsString = fs.readFileSync(`${workspaceFolder}/.brightScreen/${treeItemContext.location}`, 'utf-8')
  } catch (err) {
    console.log(err)
    vscode.window.showErrorMessage('Could not find file')
    return
  }

  let userCodeAsString: string | undefined
  try {
    userCodeAsString = vscode.window.activeTextEditor?.document.getText()
    if (typeof userCodeAsString !== 'string') {
      vscode.window.showErrorMessage('Could not get active text editor')
      return
    }
  } catch (err) {
    console.log(err)
    vscode.window.showErrorMessage('Could not get active text editor')
    return
  }
  
  let mergedCodeAsString: string
  try {
    mergedCodeAsString = lessonCodeAsString.replace(treeItemContext.replacementSubstring, userCodeAsString)
  } catch (err) {
    console.log(err)
    vscode.window.showErrorMessage('Could not create test')
    return
  }

  const runningTestPath = `${workspaceFolder}/.brightScreen/runningTest.${treeItemContext.fileExtention}`
  try {
    fs.writeFileSync(runningTestPath, mergedCodeAsString)
  } catch (err) {
    console.log(err)
    vscode.window.showErrorMessage('Could not create ./runningTest file')
  }

  exec(`${treeItemContext.executionPrefix} ${runningTestPath}`, (error, stdout, stderr) => {
    if (stderr) {
      console.log('stderr: ', stderr)
      return
    }
    
    if (error !== null) {
      console.log('exec error: ', error)
    }

    let output: { didPass: boolean, message: string }
    try {
      output = JSON.parse(stdout)
    } catch (err) {
      console.log(err)
      outputChannel.appendLine('Problem reading code from active text editor. Make sure to focus on the code you wish to test.')
      vscode.window.showErrorMessage(`Issue receiving test results from ${treeItemContext.label}`, 'Read More').then( selection => {
        if (selection === 'Read More') outputChannel.show()
      })
      return
    }

    outputChannel.appendLine(`${treeItemContext.label}: ${output.message}`)

    if (output.didPass) {
      vscode.window.showInformationMessage(`${treeItemContext.label} Passed!`, 'Read More').then( selection => {
        if (selection === 'Read More') outputChannel.show()
      })
    } else {
      vscode.window.showErrorMessage(`${treeItemContext.label} Failed!`).then( selection => {
        if (selection === 'Read More') outputChannel.show()
      })
    }
  })
})

export default RunTestCommand
