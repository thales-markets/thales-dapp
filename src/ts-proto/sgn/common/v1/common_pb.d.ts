import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';


export class Signature extends jspb.Message {
  getSigner(): string;
  setSigner(value: string): Signature;

  getSigBytes(): Uint8Array | string;
  getSigBytes_asU8(): Uint8Array;
  getSigBytes_asB64(): string;
  setSigBytes(value: Uint8Array | string): Signature;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Signature.AsObject;
  static toObject(includeInstance: boolean, msg: Signature): Signature.AsObject;
  static serializeBinaryToWriter(message: Signature, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Signature;
  static deserializeBinaryFromReader(message: Signature, reader: jspb.BinaryReader): Signature;
}

export namespace Signature {
  export type AsObject = {
    signer: string,
    sigBytes: Uint8Array | string,
  }
}

export class ContractInfo extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): ContractInfo;

  getAddress(): string;
  setAddress(value: string): ContractInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContractInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ContractInfo): ContractInfo.AsObject;
  static serializeBinaryToWriter(message: ContractInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContractInfo;
  static deserializeBinaryFromReader(message: ContractInfo, reader: jspb.BinaryReader): ContractInfo;
}

export namespace ContractInfo {
  export type AsObject = {
    chainId: number,
    address: string,
  }
}

export class ERC20Token extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): ERC20Token;

  getSymbol(): string;
  setSymbol(value: string): ERC20Token;

  getAddress(): string;
  setAddress(value: string): ERC20Token;

  getDecimals(): number;
  setDecimals(value: number): ERC20Token;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ERC20Token.AsObject;
  static toObject(includeInstance: boolean, msg: ERC20Token): ERC20Token.AsObject;
  static serializeBinaryToWriter(message: ERC20Token, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ERC20Token;
  static deserializeBinaryFromReader(message: ERC20Token, reader: jspb.BinaryReader): ERC20Token;
}

export namespace ERC20Token {
  export type AsObject = {
    chainId: number,
    symbol: string,
    address: string,
    decimals: number,
  }
}

