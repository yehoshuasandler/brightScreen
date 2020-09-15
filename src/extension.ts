import * as vscode from 'vscode'
import setupComands from './UseCases/setupComands'
import setupCoursesTree from './UseCases/setupCoursesTree'

export function activate(context: vscode.ExtensionContext) {
	console.log('brightscreen is now active')

	setupCoursesTree()
	setupComands(context)
}

export function deactivate() {}
