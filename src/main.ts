import { v4 as uuid } from 'uuid';
import * as CryptoJS from 'crypto-js';
import 'whatwg-fetch';

interface Payload {
  type: string;
  value: string;
  required: boolean;
}

class Tokenizer {
  constructor(public API_KEY: string) {
    this.getPublicKey() || this.setPublicKey(API_KEY); 
    this.getGuid() || this.setGuid();
  }

  private setPublicKey(key: string) {
    return localStorage.setItem('epayco_publish_key', key);
  }

  private getPublicKey() {
    return localStorage.getItem('epayco_publish_key');
  }

  public async init(payload: Array<Payload>) {
    const guid = this.getGuid();
    const tokenFromServer = await this.getTokenFromServer(guid);
    const response = await this.serialize(payload, tokenFromServer, guid);
    const token = await this.tokenize(response);
    return token;
  }

  private setGuid() {
    return localStorage.setItem('keyUserIndex', uuid());
  }

  private getGuid() {
    return localStorage.getItem('keyUserIndex');
  }

  private encrypt(value: string, token: string) {
    return CryptoJS.AES.encrypt(value, token).toString();
  }

  private async getTokenFromServer(uuid: string) {
    try {
      const response = await fetch('https://api.secure.payco.co/token/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ 
          public_key: this.getPublicKey(),
          session: uuid
        })
      });
      const res = await response.json();
      const token = res.data.token;
      return token;
    } catch (error) {
      throw error;
    }
  }

  private serialize(payload: Array<Payload>, token: string, guid: string) {
    const payloadSerialized = payload.map(x => {
      return {
        type: x.type,
        value: this.encrypt(x.value, token)
      };
    });

    payloadSerialized.push({
      type: 'publicKey',
      value: this.getPublicKey()
    });

    payloadSerialized.push({
      type: 'session',
      value: guid

    });

    return JSON.stringify(payloadSerialized);
  }

  private async tokenize(values: string) {
    try {
      const response = await fetch('https://api.secure.payco.co/token/tokenize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({ values })
      });
      const res = await response.json();
      return res;
    } catch (error) {
      throw error;
    }
  }
}

export default Tokenizer;
