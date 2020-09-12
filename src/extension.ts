import * as vscode from 'vscode'
import * as fs from 'fs'
import BrightScreen from './Entities/BrightScreen'
import setupBrightScreen from './UseCases/setupBrightScreen'
import setupCoursesTree from './UseCases/setupCoursesTree'
import LessonInterface from './Interfaces/LessonInterface'
import { exec  } from 'child_process'
import installCourse from './UseCases/installCourse'

export function activate(context: vscode.ExtensionContext) {
	console.log('brightscreen is now active')

	let brightScreen: BrightScreen
  let workspaceFolder: string = vscode.workspace.rootPath || ''
	let lessons: LessonInterface[]
	const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('brightScreen')

	setupCoursesTree()

	const startupBrightScreenCommand = vscode.commands.registerCommand('brightscreen.startBrightScreen', () => {
		setupBrightScreen()
		brightScreen = BrightScreen.getInstance()
		workspaceFolder = brightScreen.workspaceFolder
		lessons = brightScreen.lessons
	})

	const searchForCoursesComand = vscode.commands.registerCommand('brightscreen.searchForCourses', async () => {
		// console.log(await vscode.window.showInputBox())
		setupCoursesTree()
	})

	const downloadCourseComand = vscode.commands.registerCommand('brightscreen.downloadCourse', async (treeItemContext) => {
		console.log(treeItemContext)
		const repo = treeItemContext.repo
		// console.log(await vscode.window.showInputBox())
		if (brightScreen) {
			vscode.window.showErrorMessage('brightScreen Course is already installed')
			return
		}
		installCourse(workspaceFolder, repo, outputChannel)
		// setupBrightScreen()
	})

	const createStarterFileForLesson = vscode.commands.registerCommand('brightscreen.createStarterFileForLesson', treeItemContext => {
		let starterFileAsString :string
		try{
			starterFileAsString = fs.readFileSync(`${workspaceFolder}/.brightScreen/${treeItemContext.starterFileLocation}`, 'utf-8')
		} catch (err) {
			console.log(err)
			vscode.window.showErrorMessage('Issue reading starter file provided by course.')
			return
		}
			try {
			vscode.window.activeTextEditor?.edit(builder => {
				builder.insert(new vscode.Position(0, 0), starterFileAsString)
				// builder.replace(vscode.window?.activeTextEditor.selection, starterFileAsString);
			})
		} catch (err) {
			console.log(err)
			vscode.window.showErrorMessage('Coule Not create starter file for the lesson.')
			return
		}
	})

	const runTestCommand = vscode.commands.registerCommand('brightscreen.runTests', (treeItemContext) => {
		let lessonCodeAsString: string
		try {
			lessonCodeAsString = fs.readFileSync(`${workspaceFolder}/.brightScreen/${treeItemContext.location}`, 'utf-8')
		} catch (err) {
			console.log(err)
			vscode.window.showErrorMessage('Could not find file')
			return
		}

		let userCodeAsString: string | undefined
		try {
			userCodeAsString = vscode.window.activeTextEditor?.document.getText()
			if (typeof userCodeAsString !== 'string') {
				vscode.window.showErrorMessage('Could not get active text editor')
				return
			}
		} catch (err) {
			console.log(err)
			vscode.window.showErrorMessage('Could not get active text editor')
			return
		}
		
		let mergedCodeAsString: string
		try {
			mergedCodeAsString = lessonCodeAsString.replace(treeItemContext.replacementSubstring, userCodeAsString)
		} catch (err) {
			console.log(err)
			vscode.window.showErrorMessage('Could not create test')
			return
		}

		const runningTestPath = `${workspaceFolder}/.brightScreen/runningTest.${treeItemContext.fileExtention}`
		try {
			fs.writeFileSync(runningTestPath, mergedCodeAsString)
		} catch (err) {
			console.log(err)
			vscode.window.showErrorMessage('Could not create ./runningTest file')
		}
	
		exec(`${treeItemContext.executionPrefix} ${runningTestPath}`, (error, stdout, stderr) => {
			if (stderr) {
				console.log('stderr: ', stderr)
				return
			}
			
			if (error !== null) {
				console.log('exec error: ', error)
			}

			let output: { didPass: boolean, message: string }
			try {
				output = JSON.parse(stdout)
			} catch (err) {
				console.log(err)
				outputChannel.appendLine('Problem reading code from active text editor. Make sure to focus on the code you wish to test.')
				vscode.window.showErrorMessage(`Issue receiving test results from ${treeItemContext.label}`, 'Read More').then( selection => {
					if (selection === 'Read More') outputChannel.show()
				})
				return
			}

			outputChannel.appendLine(`${treeItemContext.label}: ${output.message}`)

			if (output.didPass) {
				vscode.window.showInformationMessage(`${treeItemContext.label} Passed!`, 'Read More').then( selection => {
					if (selection === 'Read More') outputChannel.show()
				})
			} else {
				vscode.window.showErrorMessage(`${treeItemContext.label} Failed!`).then( selection => {
					if (selection === 'Read More') outputChannel.show()
				})
			}
		})
	})

	context.subscriptions.push(...[runTestCommand, startupBrightScreenCommand, searchForCoursesComand, downloadCourseComand])
}

export function deactivate() {}
