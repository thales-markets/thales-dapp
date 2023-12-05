import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_cbridge_v1_cbridge_pb from '../../../sgn/cbridge/v1/cbridge_pb';


export class GenesisState extends jspb.Message {
  getParams(): sgn_cbridge_v1_cbridge_pb.Params | undefined;
  setParams(value?: sgn_cbridge_v1_cbridge_pb.Params): GenesisState;
  hasParams(): boolean;
  clearParams(): GenesisState;

  getKvsList(): Array<KV>;
  setKvsList(value: Array<KV>): GenesisState;
  clearKvsList(): GenesisState;
  addKvs(value?: KV, index?: number): KV;

  getConfig(): sgn_cbridge_v1_cbridge_pb.CbrConfig | undefined;
  setConfig(value?: sgn_cbridge_v1_cbridge_pb.CbrConfig): GenesisState;
  hasConfig(): boolean;
  clearConfig(): GenesisState;

  getPrice(): sgn_cbridge_v1_cbridge_pb.CbrPrice | undefined;
  setPrice(value?: sgn_cbridge_v1_cbridge_pb.CbrPrice): GenesisState;
  hasPrice(): boolean;
  clearPrice(): GenesisState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenesisState.AsObject;
  static toObject(includeInstance: boolean, msg: GenesisState): GenesisState.AsObject;
  static serializeBinaryToWriter(message: GenesisState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenesisState;
  static deserializeBinaryFromReader(message: GenesisState, reader: jspb.BinaryReader): GenesisState;
}

export namespace GenesisState {
  export type AsObject = {
    params?: sgn_cbridge_v1_cbridge_pb.Params.AsObject,
    kvsList: Array<KV.AsObject>,
    config?: sgn_cbridge_v1_cbridge_pb.CbrConfig.AsObject,
    price?: sgn_cbridge_v1_cbridge_pb.CbrPrice.AsObject,
  }
}

export class KV extends jspb.Message {
  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): KV;

  getVal(): Uint8Array | string;
  getVal_asU8(): Uint8Array;
  getVal_asB64(): string;
  setVal(value: Uint8Array | string): KV;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KV.AsObject;
  static toObject(includeInstance: boolean, msg: KV): KV.AsObject;
  static serializeBinaryToWriter(message: KV, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KV;
  static deserializeBinaryFromReader(message: KV, reader: jspb.BinaryReader): KV;
}

export namespace KV {
  export type AsObject = {
    key: Uint8Array | string,
    val: Uint8Array | string,
  }
}

