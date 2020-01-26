export class User {
    constructor(
        private _token: string,
        public isAdmin: boolean,
    ){}
    get token() {
        return this._token;
    }
}