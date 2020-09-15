import * as vscode from 'vscode'

class CourseProvider implements vscode.TreeDataProvider<CourseTreeItem> {
  courses: {_id: string, name:string, repo: string}[] 
  constructor(courses: {_id: string, name:string, repo: string}[] ) {
    this.courses = courses
  }

  getTreeItem (element: CourseTreeItem): vscode.TreeItem {
    return element
  }

  getChildren (): CourseTreeItem[] {
      const treeItems: CourseTreeItem[] = this.courses.map(c => {
        return new CourseTreeItem(
          c.name,
          vscode.TreeItemCollapsibleState.None,
          c.repo,
        )
      })
      return treeItems || []
    }
  }

class CourseTreeItem extends vscode.TreeItem {
  constructor (
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly repo: string,
    ) {
    super(label, collapsibleState)
  }

  get tooltip (): string {
    return this.repo
  }

  iconPath = {
    light: `../media/downloadIcon.svg`,
    dark: '../media/downloadIcon.svg'
  }
}

export default CourseProvider
