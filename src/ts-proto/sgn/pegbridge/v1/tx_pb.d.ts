import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';


export class MsgSignMint extends jspb.Message {
  getMintId(): string;
  setMintId(value: string): MsgSignMint;

  getSender(): string;
  setSender(value: string): MsgSignMint;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): MsgSignMint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignMint.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignMint): MsgSignMint.AsObject;
  static serializeBinaryToWriter(message: MsgSignMint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignMint;
  static deserializeBinaryFromReader(message: MsgSignMint, reader: jspb.BinaryReader): MsgSignMint;
}

export namespace MsgSignMint {
  export type AsObject = {
    mintId: string,
    sender: string,
    signature: Uint8Array | string,
  }
}

export class MsgSignMintResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignMintResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignMintResponse): MsgSignMintResponse.AsObject;
  static serializeBinaryToWriter(message: MsgSignMintResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignMintResponse;
  static deserializeBinaryFromReader(message: MsgSignMintResponse, reader: jspb.BinaryReader): MsgSignMintResponse;
}

export namespace MsgSignMintResponse {
  export type AsObject = {
  }
}

export class MsgSignWithdraw extends jspb.Message {
  getWithdrawId(): string;
  setWithdrawId(value: string): MsgSignWithdraw;

  getSender(): string;
  setSender(value: string): MsgSignWithdraw;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): MsgSignWithdraw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignWithdraw.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignWithdraw): MsgSignWithdraw.AsObject;
  static serializeBinaryToWriter(message: MsgSignWithdraw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignWithdraw;
  static deserializeBinaryFromReader(message: MsgSignWithdraw, reader: jspb.BinaryReader): MsgSignWithdraw;
}

export namespace MsgSignWithdraw {
  export type AsObject = {
    withdrawId: string,
    sender: string,
    signature: Uint8Array | string,
  }
}

export class MsgSignWithdrawResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignWithdrawResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignWithdrawResponse): MsgSignWithdrawResponse.AsObject;
  static serializeBinaryToWriter(message: MsgSignWithdrawResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignWithdrawResponse;
  static deserializeBinaryFromReader(message: MsgSignWithdrawResponse, reader: jspb.BinaryReader): MsgSignWithdrawResponse;
}

export namespace MsgSignWithdrawResponse {
  export type AsObject = {
  }
}

export class MsgTriggerSignMint extends jspb.Message {
  getMintId(): string;
  setMintId(value: string): MsgTriggerSignMint;

  getSender(): string;
  setSender(value: string): MsgTriggerSignMint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgTriggerSignMint.AsObject;
  static toObject(includeInstance: boolean, msg: MsgTriggerSignMint): MsgTriggerSignMint.AsObject;
  static serializeBinaryToWriter(message: MsgTriggerSignMint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgTriggerSignMint;
  static deserializeBinaryFromReader(message: MsgTriggerSignMint, reader: jspb.BinaryReader): MsgTriggerSignMint;
}

export namespace MsgTriggerSignMint {
  export type AsObject = {
    mintId: string,
    sender: string,
  }
}

export class MsgTriggerSignMintResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgTriggerSignMintResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgTriggerSignMintResponse): MsgTriggerSignMintResponse.AsObject;
  static serializeBinaryToWriter(message: MsgTriggerSignMintResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgTriggerSignMintResponse;
  static deserializeBinaryFromReader(message: MsgTriggerSignMintResponse, reader: jspb.BinaryReader): MsgTriggerSignMintResponse;
}

export namespace MsgTriggerSignMintResponse {
  export type AsObject = {
  }
}

export class MsgTriggerSignWithdraw extends jspb.Message {
  getWithdrawId(): string;
  setWithdrawId(value: string): MsgTriggerSignWithdraw;

  getSender(): string;
  setSender(value: string): MsgTriggerSignWithdraw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgTriggerSignWithdraw.AsObject;
  static toObject(includeInstance: boolean, msg: MsgTriggerSignWithdraw): MsgTriggerSignWithdraw.AsObject;
  static serializeBinaryToWriter(message: MsgTriggerSignWithdraw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgTriggerSignWithdraw;
  static deserializeBinaryFromReader(message: MsgTriggerSignWithdraw, reader: jspb.BinaryReader): MsgTriggerSignWithdraw;
}

export namespace MsgTriggerSignWithdraw {
  export type AsObject = {
    withdrawId: string,
    sender: string,
  }
}

export class MsgTriggerSignWithdrawResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgTriggerSignWithdrawResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgTriggerSignWithdrawResponse): MsgTriggerSignWithdrawResponse.AsObject;
  static serializeBinaryToWriter(message: MsgTriggerSignWithdrawResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgTriggerSignWithdrawResponse;
  static deserializeBinaryFromReader(message: MsgTriggerSignWithdrawResponse, reader: jspb.BinaryReader): MsgTriggerSignWithdrawResponse;
}

export namespace MsgTriggerSignWithdrawResponse {
  export type AsObject = {
  }
}

export class MsgClaimFee extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): MsgClaimFee;

  getChainId(): number;
  setChainId(value: number): MsgClaimFee;

  getTokenAddress(): string;
  setTokenAddress(value: string): MsgClaimFee;

  getNonce(): number;
  setNonce(value: number): MsgClaimFee;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): MsgClaimFee;

  getSender(): string;
  setSender(value: string): MsgClaimFee;

  getIsValidator(): boolean;
  setIsValidator(value: boolean): MsgClaimFee;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimFee.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimFee): MsgClaimFee.AsObject;
  static serializeBinaryToWriter(message: MsgClaimFee, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimFee;
  static deserializeBinaryFromReader(message: MsgClaimFee, reader: jspb.BinaryReader): MsgClaimFee;
}

export namespace MsgClaimFee {
  export type AsObject = {
    delegatorAddress: string,
    chainId: number,
    tokenAddress: string,
    nonce: number,
    signature: Uint8Array | string,
    sender: string,
    isValidator: boolean,
  }
}

export class MsgClaimFeeResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimFeeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimFeeResponse): MsgClaimFeeResponse.AsObject;
  static serializeBinaryToWriter(message: MsgClaimFeeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimFeeResponse;
  static deserializeBinaryFromReader(message: MsgClaimFeeResponse, reader: jspb.BinaryReader): MsgClaimFeeResponse;
}

export namespace MsgClaimFeeResponse {
  export type AsObject = {
  }
}

export class MsgClaimRefund extends jspb.Message {
  getRefId(): string;
  setRefId(value: string): MsgClaimRefund;

  getSender(): string;
  setSender(value: string): MsgClaimRefund;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimRefund.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimRefund): MsgClaimRefund.AsObject;
  static serializeBinaryToWriter(message: MsgClaimRefund, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimRefund;
  static deserializeBinaryFromReader(message: MsgClaimRefund, reader: jspb.BinaryReader): MsgClaimRefund;
}

export namespace MsgClaimRefund {
  export type AsObject = {
    refId: string,
    sender: string,
  }
}

export class MsgClaimRefundResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimRefundResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimRefundResponse): MsgClaimRefundResponse.AsObject;
  static serializeBinaryToWriter(message: MsgClaimRefundResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimRefundResponse;
  static deserializeBinaryFromReader(message: MsgClaimRefundResponse, reader: jspb.BinaryReader): MsgClaimRefundResponse;
}

export namespace MsgClaimRefundResponse {
  export type AsObject = {
  }
}

