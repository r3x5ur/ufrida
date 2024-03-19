import { Icon } from './icon'
import { SystemParameters } from './system_parameters'

export interface Process {
  pid: number
  name: string
  parameters: ProcessParameters
}

/**
 * Process parameters typically obtained through `enumerateProcesses({ scope })`, where
 * `scope` is either `Scope.Metadata` or `Scope.Full`. The default of `Scope.Minimal`
 * means no parameters will be included.
 */
export interface ProcessParameters {
  /**
   * Filesystem path of program.
   */
  path?: string

  /**
   * Name of user that the process is running as.
   */
  user?: string

  /**
   * Parent process ID.
   */
  ppid?: number

  /**
   * When the process was started.
   */
  started?: Date

  /**
   * Application IDs that have code running inside this process.
   */
  applications?: string[]

  /**
   * Whether the process is currently frontmost.
   */
  frontmost?: boolean

  /**
   * One or more icons. Only included when `scope` is set to `Scope.Full`.
   */
  icons?: Icon[]

  /**
   * System parameters, available for processes accessed through a portal.
   */
  system?: SystemParameters

  [name: string]: any
}
