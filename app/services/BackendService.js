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
    this._swtcSecret = getString(swtcSecretKey) || '' ;
    this._jlibServer = getString(jlibServerKey) || '';
    this._masterPassword = getString(masterPasswordKey) || '';
    this._unlocked = false;
    //this.isunlocked = false;
    console.log('backend service initialized')
  }

  get swtcSecret() {
    return this._swtcSecret
  }
  set swtcSecret(secret) {
    this._swtcSecret = secret;
    setString(swtcSecretKey, secret);
  }

  get jlibServer() {
    return this._jlibServer ;
  }
  set jlibServer(newServer) {
    this._jlibServer = newServer ;
    setString(jlibServerKey, newServer);
  }

  get masterPassword() {
    return this._masterPassword;
  }
  set masterPassword(password) {
    this._masterPassword = password ;
    setString(masterPasswordKey, password);
  }

  get unlocked() {
    return this._unlocked;
  }
  set unlocked(truefalse) {
    this._unlocked = truefalse;
    setBoolean(unlockedKey, truefalse);
  }
}