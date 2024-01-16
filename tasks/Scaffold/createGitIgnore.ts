/*
 * adonis-ts-boilerplate
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { files } from '@adonisjs/sink'
import { TaskFn } from '../../src/Contracts'

/**
 * Creates `.gitignore` file inside destination
 */
const task: TaskFn = (_, logger, { absPath }) => {
  const gitignore = new files.NewLineFile(absPath, '.gitignore')

  gitignore.add('node_modules')
  gitignore.add('build')
  gitignore.add('coverage')
  gitignore.add('.vscode')
  gitignore.add('.DS_STORE')
  gitignore.add('.env')
  gitignore.add('tmp')
  gitignore.add('npm-debug.log*')
  gitignore.add('yarn-debug.log*')
  gitignore.add('yarn-error.log*')
  gitignore.add('lerna-debug.log*')
  gitignore.add('.pnpm-debug.log*')
  gitignore.add('logs')
  gitignore.add('*.log')
  gitignore.add('.yarn/cache')
  gitignore.add('.yarn/unplugged')
  gitignore.add('.yarn/build-state.yml')
  gitignore.add('.yarn/install-state.gz')
  gitignore.add('.pnp.*')
  gitignore.add('.yarn-integrity')

  gitignore.commit()
  logger.action('create').succeeded('.gitignore')
}

export default task
