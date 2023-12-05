import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_mint_v1_mint_pb from '../../../sgn/mint/v1/mint_pb';


export class GenesisState extends jspb.Message {
  getMinter(): sgn_mint_v1_mint_pb.Minter | undefined;
  setMinter(value?: sgn_mint_v1_mint_pb.Minter): GenesisState;
  hasMinter(): boolean;
  clearMinter(): GenesisState;

  getParams(): sgn_mint_v1_mint_pb.Params | undefined;
  setParams(value?: sgn_mint_v1_mint_pb.Params): GenesisState;
  hasParams(): boolean;
  clearParams(): GenesisState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenesisState.AsObject;
  static toObject(includeInstance: boolean, msg: GenesisState): GenesisState.AsObject;
  static serializeBinaryToWriter(message: GenesisState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenesisState;
  static deserializeBinaryFromReader(message: GenesisState, reader: jspb.BinaryReader): GenesisState;
}

export namespace GenesisState {
  export type AsObject = {
    minter?: sgn_mint_v1_mint_pb.Minter.AsObject,
    params?: sgn_mint_v1_mint_pb.Params.AsObject,
  }
}

