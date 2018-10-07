
export default class{
    constructor() {
        this.secret = ''
        this.address = ''
        this.sequence = 0
        this.balance = 0
        this.intransaction = false
    }

    isValidWallet() {
        return !!this.secret;
    }

    isInTransaction() {
        return this.intransaction;
    }

    getSequence() {
        return this.balance;
    }

    getBalance() {
        return this.balance;
    }

    updateBalance() {
        return this.balance;
    }
}
