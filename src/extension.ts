import * as vscode from 'vscode'
import * as fs from 'fs'
import BrightScreen from './Entities/BrightScreen'
import setupBrightScreen from './UseCases/setupBrightScreen'
import LessonsProvider from './UseCases/LessonsProvider'
import LessonInterface from './Interfaces/LessonInterface'
import { spawn, exec  } from 'child_process'
import { stderr } from 'process'

export function activate(context: vscode.ExtensionContext) {
	console.log('brightscreen is now active')

	let brightScreen: BrightScreen
	let workspaceFolder: string
	let lessons: LessonInterface[]

	setupBrightScreen()
	brightScreen = BrightScreen.getInstance()
	workspaceFolder = brightScreen.workspaceFolder
	lessons = brightScreen.lessons

	try {
		vscode.window.registerTreeDataProvider('brightScreen', new LessonsProvider())
	} catch (err) {
		console.log(err)
	}

	const startupBrightScreenCommand = vscode.commands.registerCommand('brightscreen.startBrightScreen', (value) => {
		setupBrightScreen()
		brightScreen = BrightScreen.getInstance()
		workspaceFolder = brightScreen.workspaceFolder
		lessons = brightScreen.lessons
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

			console.log(stdout)
		})
	})

	context.subscriptions.push(...[runTestCommand, startupBrightScreenCommand])
}

export function deactivate() {}
