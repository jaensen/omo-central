import { identityClient } from "../graphQL/identity/identityClient";
import { createCipheriv, createDecipheriv } from "crypto";
import {KeyGenerator} from "../../../auth/util/dist/keyGenerator";

interface IPublicData {
  circles: {
    safeAddress: string;
  }
}

interface IPrivateData {
  circles:{
    safePrivateKey: string
  };
  [other:string]:any
}

interface IAgent
{
  type: string
  key: string

  identityKey: string
  identityId: string

  getPublicData() : Promise<IPublicData>;
  getPrivateData() : Promise<IPrivateData>;

  setPublicData(data:IPublicData) : Promise<void>;
  setPrivateData(data:IPrivateData) : Promise<void>;
}

export class Agent implements IAgent {

  public static me = new Agent();

  key: string;
  type: string;

  identityKey: string;
  identityId: string;

  async getPrivateData() : Promise<IPrivateData>
  {
    const privateKey = await identityClient.identityKey();
    const encryptedPrivateData = await identityClient.privateData({});
    const privateDataJson = encryptedPrivateData.data.privateData;
    const privateDataClearText = await this.decryptSym(
      Buffer.from(privateKey.data.identityKey, "base64"),
      {
        initializationVector: privateDataJson.initializationVector,
        data: privateDataJson.data
      });
    return JSON.parse(privateDataClearText);
  }

  async setPrivateData(data: IPrivateData)
  {
    const privateDataJson = JSON.stringify(data);
    const identityKeyResponse = await identityClient.identityKey({});
    const encrypted = await this.encryptSym(Buffer.from(identityKeyResponse.data.identityKey, "base64"), privateDataJson);

    await identityClient.setPrivateData({
      initializationVector: encrypted.initializationVector,
      data: encrypted.data
    });
  }

  async setPublicData(data: IPublicData) {
    await identityClient.setPublicData({
      data
    });
  }

  async getPublicData(): Promise<IPublicData>
  {
    return (await identityClient.publicData({})).data.publicData;
  }

  async encryptSym(key:Buffer, plainTextUtf8:string) : Promise<{initializationVector:string, data:string}> {
    const iv = await KeyGenerator.generateRandomKey(16);
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    let crypted = cipher.update(plainTextUtf8,'utf8','base64')
    crypted += cipher.final('base64');
    return {
      initializationVector: iv.toString("base64"),
      data: crypted
    };
  }

  async decryptSym(key:Buffer, privateData:{initializationVector:string, data:string}) : Promise<string> {
    const iv = Buffer.from(privateData.initializationVector, "base64");
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    let dec = decipher.update(privateData.data,'base64','utf8')
    dec += decipher.final('utf8');
    return dec;
  }
}