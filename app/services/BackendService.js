import { getString, setString, getBoolean, setBoolean } from 'tns-core-modules/application-settings'

const unlockedKey = "unlocked";
const jlibServerKey = 'jlibServer';
const masterPasswordKey = 'masterPassword';
const swtcSecretKey = 'swtcSecret';

/**
 * Parent service class. Has common configs and methods.
 */
export default class BackendService {
  constructor() {
    console.log('backend service initializing')
    //this._swtcSecret = getString(swtcSecretKey) || '' ;
    //this._jlibServer = getString(jlibServerKey) || '';
    //this._masterPassword = getString(masterPasswordKey) || '';
    //this._unlocked = false;
    console.log('backend service initialized')
  }

  get swtcSecret() {
    return getString(swtcSecretKey) || '' ;
  }
  set swtcSecret(secret) {
    setString(swtcSecretKey, secret);
  }

  get jlibServer() {
    return getString(jlibServerKey) || ''
  }
  set jlibServer(newServer) {
    setString(jlibServerKey, newServer);
  }

  get masterPassword() {
    return getString(masterPasswordKey);
  }
  set masterPassword(password) {
    //this._masterPassword = password ;
    setString(masterPasswordKey, password);
  }

  get unlocked() {
    return getBoolean(unlockedKey);
  }
  set unlocked(truefalse) {
    setBoolean(unlockedKey, truefalse);
  }
}
