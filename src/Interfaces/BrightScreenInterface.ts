import LessonInterface from '../Interfaces/LessonInterface'

interface BrightScreenInterface {
  workspaceFolder: string,
  courseName?: string,
  documentationUrl?: string,
  lessons?: LessonInterface[]
}

export default BrightScreenInterface
