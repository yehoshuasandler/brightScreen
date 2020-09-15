import * as vscode from 'vscode'
import StartupBrightScreenComand from './Commands/StartupBrightScreenComand'
import DownloadCourseComand from './Commands/DownloadCourseComand'
import SearchForCoursesComand from './Commands/SearchForCourseComand'
import CreateStarterFileForLesson from './Commands/CreateStarterFileForLesson'
import RunTestCommand from './Commands/RunTestComand'


function setupComands (context: vscode.ExtensionContext) {
	const comands = [
		StartupBrightScreenComand,
		DownloadCourseComand,
		SearchForCoursesComand,
		CreateStarterFileForLesson,
		RunTestCommand
	]

	context.subscriptions.push(...comands)
}

export default setupComands