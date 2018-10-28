import * as applicationSettings from 'tns-core-modules/application-settings/application-settings'
import { openUrl } from "tns-core-modules/utils/utils";

const masterPasswordKey = 'MASTERPASSWORD'
const unlockedKey = "UNLOCKED"

/**
 * Parent service class. Has common configs and methods.
 */
export default class BackendService {
  constructor(v) {
    console.log(`backend service ${v} initializing`)
    console.log(`backend service ${v} initialized`)
  }

  get masterPassword() {
    return applicationSettings.getString(masterPasswordKey)
  }
  set masterPassword(v) {
    applicationSettings.setString(masterPasswordKey, v)
  }

  get unlocked() {
    return applicationSettings.getBoolean(unlockedKey)
  }
  set unlocked(v) {
    applicationSettings.setBoolean(unlockedKey, v)
  }
  openurl(url) {
    openUrl(url)
  }
}
