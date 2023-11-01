import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_farming_v1_farming_pb from '../../../sgn/farming/v1/farming_pb';


export class MsgClaimRewards extends jspb.Message {
  getPoolName(): string;
  setPoolName(value: string): MsgClaimRewards;

  getAddress(): string;
  setAddress(value: string): MsgClaimRewards;

  getSender(): string;
  setSender(value: string): MsgClaimRewards;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimRewards.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimRewards): MsgClaimRewards.AsObject;
  static serializeBinaryToWriter(message: MsgClaimRewards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimRewards;
  static deserializeBinaryFromReader(message: MsgClaimRewards, reader: jspb.BinaryReader): MsgClaimRewards;
}

export namespace MsgClaimRewards {
  export type AsObject = {
    poolName: string,
    address: string,
    sender: string,
  }
}

export class MsgClaimRewardsResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimRewardsResponse): MsgClaimRewardsResponse.AsObject;
  static serializeBinaryToWriter(message: MsgClaimRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimRewardsResponse;
  static deserializeBinaryFromReader(message: MsgClaimRewardsResponse, reader: jspb.BinaryReader): MsgClaimRewardsResponse;
}

export namespace MsgClaimRewardsResponse {
  export type AsObject = {
  }
}

export class MsgClaimAllRewards extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): MsgClaimAllRewards;

  getSender(): string;
  setSender(value: string): MsgClaimAllRewards;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimAllRewards.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimAllRewards): MsgClaimAllRewards.AsObject;
  static serializeBinaryToWriter(message: MsgClaimAllRewards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimAllRewards;
  static deserializeBinaryFromReader(message: MsgClaimAllRewards, reader: jspb.BinaryReader): MsgClaimAllRewards;
}

export namespace MsgClaimAllRewards {
  export type AsObject = {
    address: string,
    sender: string,
  }
}

export class MsgClaimAllRewardsResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimAllRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimAllRewardsResponse): MsgClaimAllRewardsResponse.AsObject;
  static serializeBinaryToWriter(message: MsgClaimAllRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimAllRewardsResponse;
  static deserializeBinaryFromReader(message: MsgClaimAllRewardsResponse, reader: jspb.BinaryReader): MsgClaimAllRewardsResponse;
}

export namespace MsgClaimAllRewardsResponse {
  export type AsObject = {
  }
}

export class SignatureDetails extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): SignatureDetails;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): SignatureDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignatureDetails.AsObject;
  static toObject(includeInstance: boolean, msg: SignatureDetails): SignatureDetails.AsObject;
  static serializeBinaryToWriter(message: SignatureDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignatureDetails;
  static deserializeBinaryFromReader(message: SignatureDetails, reader: jspb.BinaryReader): SignatureDetails;
}

export namespace SignatureDetails {
  export type AsObject = {
    chainId: number,
    signature: Uint8Array | string,
  }
}

export class MsgSignRewards extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): MsgSignRewards;

  getSender(): string;
  setSender(value: string): MsgSignRewards;

  getSignatureDetailsListList(): Array<SignatureDetails>;
  setSignatureDetailsListList(value: Array<SignatureDetails>): MsgSignRewards;
  clearSignatureDetailsListList(): MsgSignRewards;
  addSignatureDetailsList(value?: SignatureDetails, index?: number): SignatureDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignRewards.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignRewards): MsgSignRewards.AsObject;
  static serializeBinaryToWriter(message: MsgSignRewards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignRewards;
  static deserializeBinaryFromReader(message: MsgSignRewards, reader: jspb.BinaryReader): MsgSignRewards;
}

export namespace MsgSignRewards {
  export type AsObject = {
    address: string,
    sender: string,
    signatureDetailsListList: Array<SignatureDetails.AsObject>,
  }
}

export class MsgSignRewardsResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignRewardsResponse): MsgSignRewardsResponse.AsObject;
  static serializeBinaryToWriter(message: MsgSignRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignRewardsResponse;
  static deserializeBinaryFromReader(message: MsgSignRewardsResponse, reader: jspb.BinaryReader): MsgSignRewardsResponse;
}

export namespace MsgSignRewardsResponse {
  export type AsObject = {
  }
}

