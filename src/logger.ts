/*
* create-adonis-ts-app
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { Ora } from 'ora'
import cliWidth from 'cli-width'
import { yellow, dim, underline } from 'kleur'

/**
 * Getting width of the stdout to put log messages
 * in one line
 */
const width = cliWidth()

/**
 * Log installing dependencies message
 */
export function logInstall (list: string[], spinner: Ora, dev: boolean) {
  const namedDependencies: string[] = []
  let widthConsumed = 17 + 15

  for (let dependency of list) {
    if ((widthConsumed + dependency.length + 2) > width) {
      break
    }

    /**
     * Increase the width consumed
     */
    widthConsumed += dependency.length + 2

    /**
     * Add dependency to the named dependencies
     */
    namedDependencies.push(dependency)
  }

  /**
   * Total number of out of bound dependencies
   */
  const outOfBounds = list.length - namedDependencies.length

  if (outOfBounds === 1 && list[list.length - 1].length <= 13) {
    namedDependencies.push(list[list.length - 1])
  } else if (outOfBounds > 0) {
    namedDependencies.push(`and ${outOfBounds} other${outOfBounds !== 1 ? 's' : ''}`)
  }

  spinner.text = ` ${yellow(underline('install'))}  ${namedDependencies.join(', ')} ${dim(`${dev ? '[dev]' : '[prod]'}`)}`
  spinner.spinner = 'dots'
  spinner.color = 'gray'
  spinner.start()
}
