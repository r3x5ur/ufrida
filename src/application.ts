import { Icon } from './icon'
import { SystemParameters } from './system_parameters'

export interface Application {
  identifier: string
  name: string
  pid: number
  parameters: ApplicationParameters
}

/**
 * Application parameters typically obtained through `enumerateApplications({ scope })`,
 * where `scope` is either `Scope.Metadata` or `Scope.Full`. The default of `Scope.Minimal`
 * means no parameters will be included.
 */
export interface ApplicationParameters {
  /**
   * Version. Exposes `CFBundleShortVersionString` on Apple OSes, `versionName` on Android.
   */
  version?: string

  /**
   * Build stamp. Exposes `CFBundleVersion` on Apple OSes, `versionCode` on Android.
   */
  build?: string

  /**
   * Filesystem path of application. On Apple OSes this is where the bundle is.
   */
  path?: string

  /**
   * Apple storage container locations.
   */
  containers?: {
    /**
     * Data container location.
     */
    data?: string

    /**
     * App group container locations.
     */
    [name: string]: string | undefined
  }

  /**
   * Android source APKs. Exposes `publicSourceDir` followed by `splitPublicSourceDirs`.
   */
  sources?: string[]

  /**
   * Android data directory location.
   */
  dataDir?: string

  /**
   * Android target SDK.
   */
  targetSdk?: number

  /**
   * Whether the application is debuggable. Applicable on e.g. iOS and Android.
   */
  debuggable?: boolean

  /**
   * If application is running, whether it is currently frontmost.
   */
  frontmost?: boolean

  /**
   * If application is running, name of user that it is running as.
   */
  user?: string

  /**
   * If application is running, PID of its parent process.
   */
  ppid?: number

  /**
   * If application is running, when it was started.
   */
  started?: Date

  /**
   * One or more icons. Only included when `scope` is set to `Scope.Full`.
   */
  icons?: Icon[]

  /**
   * System parameters, available for applications accessed through a portal.
   */
  system?: SystemParameters

  [name: string]: any
}
