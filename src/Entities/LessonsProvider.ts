import * as vscode from 'vscode'
import BrightScreen from '../Entities/BrightScreen'

class LessonsProvider implements vscode.TreeDataProvider<LessonTreeItem> {
  constructor() { }

  getTreeItem (element: LessonTreeItem): vscode.TreeItem {
    return element
  }

  getChildren (): LessonTreeItem[] {
    const brightScreen = BrightScreen.getInstance()

    if (brightScreen.lessons) {
      const treeItems: LessonTreeItem[] = brightScreen.lessons.map(l => {
        return new LessonTreeItem(
          l.name,
          vscode.TreeItemCollapsibleState.None,
          l.executionPrefix,
          l.fileExtention,
          l.replacementSubstring,
          l.location,
          l.starterFileLocation
        )
      })
      return treeItems
    } else return []
  }
}

class LessonTreeItem extends vscode.TreeItem {
  constructor (
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly executionPrefix: string,
    public readonly fileExtention: string,
    public readonly replacementSubstring: string,
    public readonly location: string,
    public readonly starterFileLocation: string
    ) {
    super(label, collapsibleState)
  }

  get tooltip (): string {
    return this.label
  }

  get description(): string {
    return this.fileExtention
  }

  iconPath = {
    light: `../media/runCommand.png`,
    dark: '../media/runCommand.png'
  }
}

export default LessonsProvider
