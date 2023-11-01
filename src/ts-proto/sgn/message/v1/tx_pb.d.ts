import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';


export class MsgSignMessage extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): MsgSignMessage;

  getSender(): string;
  setSender(value: string): MsgSignMessage;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): MsgSignMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignMessage.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignMessage): MsgSignMessage.AsObject;
  static serializeBinaryToWriter(message: MsgSignMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignMessage;
  static deserializeBinaryFromReader(message: MsgSignMessage, reader: jspb.BinaryReader): MsgSignMessage;
}

export namespace MsgSignMessage {
  export type AsObject = {
    messageId: string,
    sender: string,
    signature: Uint8Array | string,
  }
}

export class MsgSignMessageResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignMessageResponse): MsgSignMessageResponse.AsObject;
  static serializeBinaryToWriter(message: MsgSignMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignMessageResponse;
  static deserializeBinaryFromReader(message: MsgSignMessageResponse, reader: jspb.BinaryReader): MsgSignMessageResponse;
}

export namespace MsgSignMessageResponse {
  export type AsObject = {
  }
}

export class MsgTriggerSignMessage extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): MsgTriggerSignMessage;

  getSender(): string;
  setSender(value: string): MsgTriggerSignMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgTriggerSignMessage.AsObject;
  static toObject(includeInstance: boolean, msg: MsgTriggerSignMessage): MsgTriggerSignMessage.AsObject;
  static serializeBinaryToWriter(message: MsgTriggerSignMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgTriggerSignMessage;
  static deserializeBinaryFromReader(message: MsgTriggerSignMessage, reader: jspb.BinaryReader): MsgTriggerSignMessage;
}

export namespace MsgTriggerSignMessage {
  export type AsObject = {
    messageId: string,
    sender: string,
  }
}

export class MsgTriggerSignMessageResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgTriggerSignMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgTriggerSignMessageResponse): MsgTriggerSignMessageResponse.AsObject;
  static serializeBinaryToWriter(message: MsgTriggerSignMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgTriggerSignMessageResponse;
  static deserializeBinaryFromReader(message: MsgTriggerSignMessageResponse, reader: jspb.BinaryReader): MsgTriggerSignMessageResponse;
}

export namespace MsgTriggerSignMessageResponse {
  export type AsObject = {
  }
}

export class MsgClaimAllFees extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): MsgClaimAllFees;

  getSender(): string;
  setSender(value: string): MsgClaimAllFees;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimAllFees.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimAllFees): MsgClaimAllFees.AsObject;
  static serializeBinaryToWriter(message: MsgClaimAllFees, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimAllFees;
  static deserializeBinaryFromReader(message: MsgClaimAllFees, reader: jspb.BinaryReader): MsgClaimAllFees;
}

export namespace MsgClaimAllFees {
  export type AsObject = {
    delegatorAddress: string,
    sender: string,
  }
}

export class MsgClaimAllFeesResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgClaimAllFeesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgClaimAllFeesResponse): MsgClaimAllFeesResponse.AsObject;
  static serializeBinaryToWriter(message: MsgClaimAllFeesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgClaimAllFeesResponse;
  static deserializeBinaryFromReader(message: MsgClaimAllFeesResponse, reader: jspb.BinaryReader): MsgClaimAllFeesResponse;
}

export namespace MsgClaimAllFeesResponse {
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

export class MsgSignFees extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): MsgSignFees;

  getSender(): string;
  setSender(value: string): MsgSignFees;

  getSignatureDetailsListList(): Array<SignatureDetails>;
  setSignatureDetailsListList(value: Array<SignatureDetails>): MsgSignFees;
  clearSignatureDetailsListList(): MsgSignFees;
  addSignatureDetailsList(value?: SignatureDetails, index?: number): SignatureDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignFees.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignFees): MsgSignFees.AsObject;
  static serializeBinaryToWriter(message: MsgSignFees, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignFees;
  static deserializeBinaryFromReader(message: MsgSignFees, reader: jspb.BinaryReader): MsgSignFees;
}

export namespace MsgSignFees {
  export type AsObject = {
    address: string,
    sender: string,
    signatureDetailsListList: Array<SignatureDetails.AsObject>,
  }
}

export class MsgSignFeesResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignFeesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignFeesResponse): MsgSignFeesResponse.AsObject;
  static serializeBinaryToWriter(message: MsgSignFeesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignFeesResponse;
  static deserializeBinaryFromReader(message: MsgSignFeesResponse, reader: jspb.BinaryReader): MsgSignFeesResponse;
}

export namespace MsgSignFeesResponse {
  export type AsObject = {
  }
}

