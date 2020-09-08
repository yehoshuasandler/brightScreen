import BrightScreenInterface from '../Interfaces/BrightScreenInterface'
import LessonInterface from '../Interfaces/LessonInterface'

class BrightScreen {
  private static instance: BrightScreen
  public workspaceFolder: string
  public courseName: string
  public documentationUrl: string
  public lessons: LessonInterface[]
  

  constructor (props: BrightScreenInterface) {
    if (!BrightScreen.instance)  BrightScreen.instance = this

    this.workspaceFolder = props.workspaceFolder
    this.courseName = props.courseName || ''
    this.documentationUrl = props.documentationUrl || ''
    this.lessons = props.lessons || []

    return BrightScreen.instance
  }

  public static getInstance(): BrightScreen {
    return BrightScreen.instance
  }

  public get props (): BrightScreenInterface {
    return {
      workspaceFolder: this.workspaceFolder,
      courseName: this.courseName,
      lessons: this.lessons
    }
  }

  executeLessonTest (activeUserCode: string, lessonCode: string): void {
    eval(activeUserCode)
    eval(lessonCode)
  }
}

export default BrightScreen