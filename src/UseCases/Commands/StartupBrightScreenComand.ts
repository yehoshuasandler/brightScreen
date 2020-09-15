import * as vscode from 'vscode'
import setupBrightScreen from '../../UseCases/setupBrightScreen'

const StartupBrightScreenComand: vscode.Disposable = vscode.commands.registerCommand('brightscreen.startBrightScreen', () => {
  setupBrightScreen()
})

export default StartupBrightScreenComand

