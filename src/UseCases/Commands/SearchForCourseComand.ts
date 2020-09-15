import * as vscode from 'vscode'
import setupCoursesTree from '../setupCoursesTree'

const SearchForCoursesComand: vscode.Disposable = vscode.commands.registerCommand('brightscreen.searchForCourses', async () => {
  setupCoursesTree()
})

export default SearchForCoursesComand
