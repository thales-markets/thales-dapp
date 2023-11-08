import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as cosmos_base_v1beta1_coin_pb from '../../../cosmos/base/v1beta1/coin_pb';


export class MsgSetWithdrawAddress extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): MsgSetWithdrawAddress;

  getWithdrawAddress(): string;
  setWithdrawAddress(value: string): MsgSetWithdrawAddress;

  getSender(): string;
  setSender(value: string): MsgSetWithdrawAddress;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSetWithdrawAddress.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSetWithdrawAddress): MsgSetWithdrawAddress.AsObject;
  static serializeBinaryToWriter(message: MsgSetWithdrawAddress, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSetWithdrawAddress;
  static deserializeBinaryFromReader(message: MsgSetWithdrawAddress, reader: jspb.BinaryReader): MsgSetWithdrawAddress;
}

export namespace MsgSetWithdrawAddress {
  export type AsObject = {
    delegatorAddress: string,
    withdrawAddress: string,
    sender: string,
  }
}

export class MsgSetWithdrawAddressResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSetWithdrawAddressResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSetWithdrawAddressResponse): MsgSetWithdrawAddressResponse.AsObject;
  static serializeBinaryToWriter(message: MsgSetWithdrawAddressResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSetWithdrawAddressResponse;
  static deserializeBinaryFromReader(message: MsgSetWithdrawAddressResponse, reader: jspb.BinaryReader): MsgSetWithdrawAddressResponse;
}

export namespace MsgSetWithdrawAddressResponse {
  export type AsObject = {
  }
}

export class MsgWithdrawDelegatorReward extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): MsgWithdrawDelegatorReward;

  getValidatorAddress(): string;
  setValidatorAddress(value: string): MsgWithdrawDelegatorReward;

  getSender(): string;
  setSender(value: string): MsgWithdrawDelegatorReward;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgWithdrawDelegatorReward.AsObject;
  static toObject(includeInstance: boolean, msg: MsgWithdrawDelegatorReward): MsgWithdrawDelegatorReward.AsObject;
  static serializeBinaryToWriter(message: MsgWithdrawDelegatorReward, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgWithdrawDelegatorReward;
  static deserializeBinaryFromReader(message: MsgWithdrawDelegatorReward, reader: jspb.BinaryReader): MsgWithdrawDelegatorReward;
}

export namespace MsgWithdrawDelegatorReward {
  export type AsObject = {
    delegatorAddress: string,
    validatorAddress: string,
    sender: string,
  }
}

export class MsgWithdrawDelegatorRewardResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgWithdrawDelegatorRewardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgWithdrawDelegatorRewardResponse): MsgWithdrawDelegatorRewardResponse.AsObject;
  static serializeBinaryToWriter(message: MsgWithdrawDelegatorRewardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgWithdrawDelegatorRewardResponse;
  static deserializeBinaryFromReader(message: MsgWithdrawDelegatorRewardResponse, reader: jspb.BinaryReader): MsgWithdrawDelegatorRewardResponse;
}

export namespace MsgWithdrawDelegatorRewardResponse {
  export type AsObject = {
  }
}

export class MsgWithdrawValidatorCommission extends jspb.Message {
  getValidatorAddress(): string;
  setValidatorAddress(value: string): MsgWithdrawValidatorCommission;

  getSender(): string;
  setSender(value: string): MsgWithdrawValidatorCommission;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgWithdrawValidatorCommission.AsObject;
  static toObject(includeInstance: boolean, msg: MsgWithdrawValidatorCommission): MsgWithdrawValidatorCommission.AsObject;
  static serializeBinaryToWriter(message: MsgWithdrawValidatorCommission, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgWithdrawValidatorCommission;
  static deserializeBinaryFromReader(message: MsgWithdrawValidatorCommission, reader: jspb.BinaryReader): MsgWithdrawValidatorCommission;
}

export namespace MsgWithdrawValidatorCommission {
  export type AsObject = {
    validatorAddress: string,
    sender: string,
  }
}

export class MsgWithdrawValidatorCommissionResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgWithdrawValidatorCommissionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgWithdrawValidatorCommissionResponse): MsgWithdrawValidatorCommissionResponse.AsObject;
  static serializeBinaryToWriter(message: MsgWithdrawValidatorCommissionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgWithdrawValidatorCommissionResponse;
  static deserializeBinaryFromReader(message: MsgWithdrawValidatorCommissionResponse, reader: jspb.BinaryReader): MsgWithdrawValidatorCommissionResponse;
}

export namespace MsgWithdrawValidatorCommissionResponse {
  export type AsObject = {
  }
}

export class MsgFundCommunityPool extends jspb.Message {
  getAmountList(): Array<cosmos_base_v1beta1_coin_pb.Coin>;
  setAmountList(value: Array<cosmos_base_v1beta1_coin_pb.Coin>): MsgFundCommunityPool;
  clearAmountList(): MsgFundCommunityPool;
  addAmount(value?: cosmos_base_v1beta1_coin_pb.Coin, index?: number): cosmos_base_v1beta1_coin_pb.Coin;

  getDepositor(): string;
  setDepositor(value: string): MsgFundCommunityPool;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgFundCommunityPool.AsObject;
  static toObject(includeInstance: boolean, msg: MsgFundCommunityPool): MsgFundCommunityPool.AsObject;
  static serializeBinaryToWriter(message: MsgFundCommunityPool, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgFundCommunityPool;
  static deserializeBinaryFromReader(message: MsgFundCommunityPool, reader: jspb.BinaryReader): MsgFundCommunityPool;
}

export namespace MsgFundCommunityPool {
  export type AsObject = {
    amountList: Array<cosmos_base_v1beta1_coin_pb.Coin.AsObject>,
    depositor: string,
  }
}

export class MsgFundCommunityPoolResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgFundCommunityPoolResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgFundCommunityPoolResponse): MsgFundCommunityPoolResponse.AsObject;
  static serializeBinaryToWriter(message: MsgFundCommunityPoolResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgFundCommunityPoolResponse;
  static deserializeBinaryFromReader(message: MsgFundCommunityPoolResponse, reader: jspb.BinaryReader): MsgFundCommunityPoolResponse;
}

export namespace MsgFundCommunityPoolResponse {
  export type AsObject = {
  }
}

export class MsgClaimAllStakingReward extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): MsgClaimAllStakingReward;

  getSender(): string;
  setSender(value: string): MsgClaimAllStakingReward;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimAllStakingReward.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimAllStakingReward): MsgClaimAllStakingReward.AsObject;
  static serializeBinaryToWriter(message: MsgClaimAllStakingReward, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimAllStakingReward;
  static deserializeBinaryFromReader(message: MsgClaimAllStakingReward, reader: jspb.BinaryReader): MsgClaimAllStakingReward;
}

export namespace MsgClaimAllStakingReward {
  export type AsObject = {
    delegatorAddress: string,
    sender: string,
  }
}

export class MsgClaimAllStakingRewardResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimAllStakingRewardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimAllStakingRewardResponse): MsgClaimAllStakingRewardResponse.AsObject;
  static serializeBinaryToWriter(message: MsgClaimAllStakingRewardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimAllStakingRewardResponse;
  static deserializeBinaryFromReader(message: MsgClaimAllStakingRewardResponse, reader: jspb.BinaryReader): MsgClaimAllStakingRewardResponse;
}

export namespace MsgClaimAllStakingRewardResponse {
  export type AsObject = {
  }
}

export class MsgSignStakingReward extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): MsgSignStakingReward;

  getSender(): string;
  setSender(value: string): MsgSignStakingReward;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): MsgSignStakingReward;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignStakingReward.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignStakingReward): MsgSignStakingReward.AsObject;
  static serializeBinaryToWriter(message: MsgSignStakingReward, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignStakingReward;
  static deserializeBinaryFromReader(message: MsgSignStakingReward, reader: jspb.BinaryReader): MsgSignStakingReward;
}

export namespace MsgSignStakingReward {
  export type AsObject = {
    delegatorAddress: string,
    sender: string,
    signature: Uint8Array | string,
  }
}

export class MsgSignStakingRewardResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignStakingRewardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignStakingRewardResponse): MsgSignStakingRewardResponse.AsObject;
  static serializeBinaryToWriter(message: MsgSignStakingRewardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignStakingRewardResponse;
  static deserializeBinaryFromReader(message: MsgSignStakingRewardResponse, reader: jspb.BinaryReader): MsgSignStakingRewardResponse;
}

export namespace MsgSignStakingRewardResponse {
  export type AsObject = {
  }
}

