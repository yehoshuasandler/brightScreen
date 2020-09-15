import * as vscode from 'vscode'
import BrightScreen from '../../Entities/BrightScreen'
import installCourse from '../installCourse'

const DownloadCourseComand: vscode.Disposable = vscode.commands.registerCommand('brightscreen.downloadCourse', async (treeItemContext) => {
  const brightScreen = BrightScreen.getInstance()
  if (brightScreen) {
    vscode.window.showErrorMessage('brightScreen Course is already installed')
    return
  }

  const repo = treeItemContext.repo
  const	workspaceFolder: string = vscode.workspace.rootPath || ''
  const outputChannel = vscode.window.createOutputChannel('brightScreen')
  
  installCourse(workspaceFolder, repo, outputChannel)
})

export default DownloadCourseComand

