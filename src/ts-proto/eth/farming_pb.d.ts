import * as jspb from 'google-protobuf'



export class FarmingRewards extends jspb.Message {
  getRecipient(): Uint8Array | string;
  getRecipient_asU8(): Uint8Array;
  getRecipient_asB64(): string;
  setRecipient(value: Uint8Array | string): FarmingRewards;

  getChainId(): Uint8Array | string;
  getChainId_asU8(): Uint8Array;
  getChainId_asB64(): string;
  setChainId(value: Uint8Array | string): FarmingRewards;

  getTokenAddressesList(): Array<Uint8Array | string>;
  setTokenAddressesList(value: Array<Uint8Array | string>): FarmingRewards;
  clearTokenAddressesList(): FarmingRewards;
  addTokenAddresses(value: Uint8Array | string, index?: number): FarmingRewards;

  getCumulativeRewardAmountsList(): Array<Uint8Array | string>;
  setCumulativeRewardAmountsList(value: Array<Uint8Array | string>): FarmingRewards;
  clearCumulativeRewardAmountsList(): FarmingRewards;
  addCumulativeRewardAmounts(value: Uint8Array | string, index?: number): FarmingRewards;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FarmingRewards.AsObject;
  static toObject(includeInstance: boolean, msg: FarmingRewards): FarmingRewards.AsObject;
  static serializeBinaryToWriter(message: FarmingRewards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FarmingRewards;
  static deserializeBinaryFromReader(message: FarmingRewards, reader: jspb.BinaryReader): FarmingRewards;
}

export namespace FarmingRewards {
  export type AsObject = {
    recipient: Uint8Array | string,
    chainId: Uint8Array | string,
    tokenAddressesList: Array<Uint8Array | string>,
    cumulativeRewardAmountsList: Array<Uint8Array | string>,
  }
}

