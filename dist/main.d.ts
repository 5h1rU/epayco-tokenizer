import 'whatwg-fetch';
interface Payload {
    type: string;
    value: string;
    required: boolean;
}
declare class Tokenizer {
    API_KEY: string;
    constructor(API_KEY: string);
    private setPublicKey;
    private getPublicKey;
    init(payload: Array<Payload>): Promise<any>;
    private setGuid;
    private getGuid;
    private encrypt;
    private getTokenFromServer;
    private serialize;
    private tokenize;
}
export default Tokenizer;
