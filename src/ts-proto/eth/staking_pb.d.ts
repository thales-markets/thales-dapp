import * as jspb from 'google-protobuf'



export class StakingReward extends jspb.Message {
  getRecipient(): Uint8Array | string;
  getRecipient_asU8(): Uint8Array;
  getRecipient_asB64(): string;
  setRecipient(value: Uint8Array | string): StakingReward;

  getCumulativeRewardAmount(): Uint8Array | string;
  getCumulativeRewardAmount_asU8(): Uint8Array;
  getCumulativeRewardAmount_asB64(): string;
  setCumulativeRewardAmount(value: Uint8Array | string): StakingReward;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StakingReward.AsObject;
  static toObject(includeInstance: boolean, msg: StakingReward): StakingReward.AsObject;
  static serializeBinaryToWriter(message: StakingReward, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StakingReward;
  static deserializeBinaryFromReader(message: StakingReward, reader: jspb.BinaryReader): StakingReward;
}

export namespace StakingReward {
  export type AsObject = {
    recipient: Uint8Array | string,
    cumulativeRewardAmount: Uint8Array | string,
  }
}

export class Slash extends jspb.Message {
  getValidator(): Uint8Array | string;
  getValidator_asU8(): Uint8Array;
  getValidator_asB64(): string;
  setValidator(value: Uint8Array | string): Slash;

  getNonce(): number;
  setNonce(value: number): Slash;

  getSlashFactor(): number;
  setSlashFactor(value: number): Slash;

  getExpireTime(): number;
  setExpireTime(value: number): Slash;

  getJailPeriod(): number;
  setJailPeriod(value: number): Slash;

  getCollectorsList(): Array<AcctAmtPair>;
  setCollectorsList(value: Array<AcctAmtPair>): Slash;
  clearCollectorsList(): Slash;
  addCollectors(value?: AcctAmtPair, index?: number): AcctAmtPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Slash.AsObject;
  static toObject(includeInstance: boolean, msg: Slash): Slash.AsObject;
  static serializeBinaryToWriter(message: Slash, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Slash;
  static deserializeBinaryFromReader(message: Slash, reader: jspb.BinaryReader): Slash;
}

export namespace Slash {
  export type AsObject = {
    validator: Uint8Array | string,
    nonce: number,
    slashFactor: number,
    expireTime: number,
    jailPeriod: number,
    collectorsList: Array<AcctAmtPair.AsObject>,
  }
}

export class AcctAmtPair extends jspb.Message {
  getAccount(): Uint8Array | string;
  getAccount_asU8(): Uint8Array;
  getAccount_asB64(): string;
  setAccount(value: Uint8Array | string): AcctAmtPair;

  getAmount(): Uint8Array | string;
  getAmount_asU8(): Uint8Array;
  getAmount_asB64(): string;
  setAmount(value: Uint8Array | string): AcctAmtPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AcctAmtPair.AsObject;
  static toObject(includeInstance: boolean, msg: AcctAmtPair): AcctAmtPair.AsObject;
  static serializeBinaryToWriter(message: AcctAmtPair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AcctAmtPair;
  static deserializeBinaryFromReader(message: AcctAmtPair, reader: jspb.BinaryReader): AcctAmtPair;
}

export namespace AcctAmtPair {
  export type AsObject = {
    account: Uint8Array | string,
    amount: Uint8Array | string,
  }
}

