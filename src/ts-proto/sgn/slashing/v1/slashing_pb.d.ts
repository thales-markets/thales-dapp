import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as cosmos_proto_cosmos_pb from '../../../cosmos_proto/cosmos_pb';
import * as sgn_common_v1_common_pb from '../../../sgn/common/v1/common_pb';


export class Params extends jspb.Message {
  getEnableSlash(): boolean;
  setEnableSlash(value: boolean): Params;

  getSignedBlocksWindow(): number;
  setSignedBlocksWindow(value: number): Params;

  getSlashTimeout(): number;
  setSlashTimeout(value: number): Params;

  getSlashFactorDoubleSign(): number;
  setSlashFactorDoubleSign(value: number): Params;

  getSlashFactorDowntime(): number;
  setSlashFactorDowntime(value: number): Params;

  getJailPeriod(): number;
  setJailPeriod(value: number): Params;

  getMinSignedPerWindow(): Uint8Array | string;
  getMinSignedPerWindow_asU8(): Uint8Array;
  getMinSignedPerWindow_asB64(): string;
  setMinSignedPerWindow(value: Uint8Array | string): Params;

  getStakingContract(): sgn_common_v1_common_pb.ContractInfo | undefined;
  setStakingContract(value?: sgn_common_v1_common_pb.ContractInfo): Params;
  hasStakingContract(): boolean;
  clearStakingContract(): Params;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Params.AsObject;
  static toObject(includeInstance: boolean, msg: Params): Params.AsObject;
  static serializeBinaryToWriter(message: Params, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Params;
  static deserializeBinaryFromReader(message: Params, reader: jspb.BinaryReader): Params;
}

export namespace Params {
  export type AsObject = {
    enableSlash: boolean,
    signedBlocksWindow: number,
    slashTimeout: number,
    slashFactorDoubleSign: number,
    slashFactorDowntime: number,
    jailPeriod: number,
    minSignedPerWindow: Uint8Array | string,
    stakingContract?: sgn_common_v1_common_pb.ContractInfo.AsObject,
  }
}

export class Slash extends jspb.Message {
  getSlashOnChain(): SlashOnChain | undefined;
  setSlashOnChain(value?: SlashOnChain): Slash;
  hasSlashOnChain(): boolean;
  clearSlashOnChain(): Slash;

  getSlashBytes(): Uint8Array | string;
  getSlashBytes_asU8(): Uint8Array;
  getSlashBytes_asB64(): string;
  setSlashBytes(value: Uint8Array | string): Slash;

  getSignaturesList(): Array<sgn_common_v1_common_pb.Signature>;
  setSignaturesList(value: Array<sgn_common_v1_common_pb.Signature>): Slash;
  clearSignaturesList(): Slash;
  addSignatures(value?: sgn_common_v1_common_pb.Signature, index?: number): sgn_common_v1_common_pb.Signature;

  getReason(): string;
  setReason(value: string): Slash;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Slash.AsObject;
  static toObject(includeInstance: boolean, msg: Slash): Slash.AsObject;
  static serializeBinaryToWriter(message: Slash, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Slash;
  static deserializeBinaryFromReader(message: Slash, reader: jspb.BinaryReader): Slash;
}

export namespace Slash {
  export type AsObject = {
    slashOnChain?: SlashOnChain.AsObject,
    slashBytes: Uint8Array | string,
    signaturesList: Array<sgn_common_v1_common_pb.Signature.AsObject>,
    reason: string,
  }
}

export class SlashOnChain extends jspb.Message {
  getValidator(): Uint8Array | string;
  getValidator_asU8(): Uint8Array;
  getValidator_asB64(): string;
  setValidator(value: Uint8Array | string): SlashOnChain;

  getNonce(): number;
  setNonce(value: number): SlashOnChain;

  getSlashFactor(): number;
  setSlashFactor(value: number): SlashOnChain;

  getExpireTime(): number;
  setExpireTime(value: number): SlashOnChain;

  getJailPeriod(): number;
  setJailPeriod(value: number): SlashOnChain;

  getCollectorsList(): Array<AcctAmtPair>;
  setCollectorsList(value: Array<AcctAmtPair>): SlashOnChain;
  clearCollectorsList(): SlashOnChain;
  addCollectors(value?: AcctAmtPair, index?: number): AcctAmtPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SlashOnChain.AsObject;
  static toObject(includeInstance: boolean, msg: SlashOnChain): SlashOnChain.AsObject;
  static serializeBinaryToWriter(message: SlashOnChain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SlashOnChain;
  static deserializeBinaryFromReader(message: SlashOnChain, reader: jspb.BinaryReader): SlashOnChain;
}

export namespace SlashOnChain {
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

export class QuerySlashParams extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): QuerySlashParams;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuerySlashParams.AsObject;
  static toObject(includeInstance: boolean, msg: QuerySlashParams): QuerySlashParams.AsObject;
  static serializeBinaryToWriter(message: QuerySlashParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuerySlashParams;
  static deserializeBinaryFromReader(message: QuerySlashParams, reader: jspb.BinaryReader): QuerySlashParams;
}

export namespace QuerySlashParams {
  export type AsObject = {
    nonce: number,
  }
}

