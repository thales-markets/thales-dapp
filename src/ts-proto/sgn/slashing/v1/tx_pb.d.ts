import * as jspb from 'google-protobuf'

import * as sgn_slashing_v1_slashing_pb from '../../../sgn/slashing/v1/slashing_pb';
import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';


export class MsgSignSlash extends jspb.Message {
  getNonce(): number;
  setNonce(value: number): MsgSignSlash;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): MsgSignSlash;

  getSender(): string;
  setSender(value: string): MsgSignSlash;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignSlash.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignSlash): MsgSignSlash.AsObject;
  static serializeBinaryToWriter(message: MsgSignSlash, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignSlash;
  static deserializeBinaryFromReader(message: MsgSignSlash, reader: jspb.BinaryReader): MsgSignSlash;
}

export namespace MsgSignSlash {
  export type AsObject = {
    nonce: number,
    sig: Uint8Array | string,
    sender: string,
  }
}

