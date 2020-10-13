/*
 * create-adonis-ts-app
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import cliWidth from 'cli-width'
import { isAbsolute, join, basename } from 'path'
import { files, getPrompt } from '@adonisjs/sink'

import { CliState } from '../contracts'
import { ensureDirSync } from 'fs-extra'

/**
 * Getting width of the stdout to put log messages in one line
 */
const WIDTH = cliWidth()

/**
 * Returns the state for creating project
 */
export async function getState(
	projectRoot: string,
	options: {
		boilerplate?: 'web' | 'api'
		projectName?: string
		eslint?: boolean
		prettier?: boolean
		client: 'yarn' | 'npm'
	}
): Promise<CliState> {
	/**
	 * If project root is not absolute, then we derive it from the current
	 * working directory
	 */
	const absPath = isAbsolute(projectRoot) ? projectRoot : join(process.cwd(), projectRoot)

	/**
	 * Prompt for boilerplate
	 */
	if (!options.boilerplate) {
		try {
			options.boilerplate = await getPrompt().choice('Select the project structure', [
				{
					name: 'api',
					message: 'API Server',
				},
				{
					name: 'web',
					message: 'Web Application',
				},
			])
		} catch (_) {
			process.exit(1)
		}
	}

	/**
	 * Ask for the project name
	 */
	if (!options.projectName) {
		try {
			options.projectName = await getPrompt().ask('Enter the project name', {
				default: basename(absPath),
			})
		} catch (_) {
			process.exit(1)
		}
	}

	/**
	 * Prompt for ESLINT
	 */
	if (options.eslint === null) {
		try {
			options.eslint = await getPrompt().confirm('Setup eslint?')
		} catch (_) {
			process.exit(1)
		}
	}

	/**
	 * Prompt for Prettier. Only when accepted to use prettier
	 */
	if (options.prettier === null && options.eslint) {
		try {
			options.prettier = await getPrompt().confirm('Setup prettier?')
		} catch (_) {
			process.exit(1)
		}
	}

	/**
	 * Create project root
	 */
	ensureDirSync(absPath)

	const pkg = new files.PackageJsonFile(absPath)
	pkg.set('name', options.projectName)
	pkg.set('version', '1.0.0')
	pkg.set('private', true)
	pkg.setScript('build', 'node ace build --production')
	pkg.setScript('start', 'node server.js')
	pkg.setScript('dev', 'node ace serve --watch')

	/**
	 * Set environment variables that can be used by the packages
	 * to tweak their setup behavior
	 */
	process.env['ADONIS_CREATE_APP_NAME'] = options.projectName!
	process.env['ADONIS_CREATE_ESLINT'] = String(options.eslint)
	process.env['ADONIS_CREATE_PRETTIER'] = String(options.prettier)
	process.env['ADONIS_CREATE_APP_CLIENT'] = options.client
	process.env['ADONIS_CREATE_APP_BOILERPLATE'] = options.boilerplate

	return {
		baseName: projectRoot,
		absPath: absPath,
		boilerplate: options.boilerplate!,
		pkg: pkg,
		projectName: options.projectName!,
		eslint: options.eslint!,
		prettier: options.prettier!,
		client: options.client,
	}
}

/**
 * Log installing dependencies message
 */
export function getInstallMessage(list: string[]): string {
	const dependencies: string[] = []
	const spaceBetweenDependencies = 2

	/**
	 * Since the log message is indented, we need to leave certain columns
	 */
	let widthConsumed = 17 + 20

	for (let dependency of list) {
		if (widthConsumed + dependency.length + spaceBetweenDependencies > WIDTH) {
			break
		}

		/**
		 * Increase the width consumed
		 */
		widthConsumed += dependency.length + spaceBetweenDependencies

		/**
		 * Add dependency to the named dependencies
		 */
		dependencies.push(dependency)
	}

	/**
	 * Total number of out of bound dependencies
	 */
	const outOfBounds = list.length - dependencies.length

	if (outOfBounds === 1 && list[list.length - 1].length <= 13) {
		dependencies.push(list[list.length - 1])
	} else if (outOfBounds > 0) {
		dependencies.push(`and ${outOfBounds} other${outOfBounds !== 1 ? 's' : ''}`)
	}

	return dependencies.join(', ')
}

/**
 * Find if process is a child process of yarn or not
 */
export const usingYarn = !!(process.env.npm_execpath && process.env.npm_execpath.includes('yarn'))
