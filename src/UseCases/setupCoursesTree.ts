import * as vscode from 'vscode'
import axios from 'axios'
import CourseProvider from '../Entities/CourseProvider'

function setupCoursesTree (): void {
  let courses: any
  try {
    axios.get('https://brightscreen.io/api/courses')
    .then(response => {
      console.log(response.data)
      courses = response.data

      try {
        vscode.window.registerTreeDataProvider('brightScreenCourses', new CourseProvider(courses))
      } catch (err) {
        console.log(err)
        vscode.window.showErrorMessage('Could Not Create BrightScreen Course List')
        return
      }
    })
  } catch (err) {
    console.log(err)
    vscode.window.showErrorMessage('Could Not Access BrightScreen Course List')
    return
  }
}

export default setupCoursesTree
