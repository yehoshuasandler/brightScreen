import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import BrightScreen from '../Entities/BrightScreen'
import LessonInterface from '../Interfaces/LessonInterface'
import LessonsProvider from './LessonsProvider'

function setupBrightScreen (): void {
  const workspaceFolder: string = vscode.workspace.rootPath || ''
  let courseName: string
  let lessons: LessonInterface[]

  let didBrightScreenExist: boolean = false
  try {
    const brightScreenPath = path.join(workspaceFolder, '.brightScreen')
    didBrightScreenExist = fs.existsSync(brightScreenPath)
    if (!didBrightScreenExist){
      fs.mkdirSync(brightScreenPath)
      return
    }
  } catch (err) {
    console.log(err)
    vscode.window.showErrorMessage('Could not create .brightScreen directory')
    return
  }

  let brightScreenCourseConfig: any
  try {
    brightScreenCourseConfig = JSON.parse(fs.readFileSync(`${workspaceFolder}/.brightScreen/brightScreen.json`, 'utf-8'))
  } catch (err) {
    console.log(err)
    vscode.window.showErrorMessage('Could not find brightScreen config for lesson')
    return
  }
  courseName = brightScreenCourseConfig.courseName
  lessons = brightScreenCourseConfig.lessons

  if (!courseName || !lessons || !workspaceFolder) {
    vscode.window.showErrorMessage('Required configurations not provided')
    return
  }

  new BrightScreen({
    workspaceFolder: workspaceFolder,
    courseName: courseName,
    lessons: lessons
  })

  try {
		vscode.window.registerTreeDataProvider('brightScreen', new LessonsProvider())
	} catch (err) {
    console.log(err)
    return
	}
  
  vscode.window.showInformationMessage(`brightScreen has been configured for ${courseName}`)
}

export default setupBrightScreen
