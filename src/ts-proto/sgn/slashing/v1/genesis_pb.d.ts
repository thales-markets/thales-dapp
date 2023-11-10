import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_slashing_v1_slashing_pb from '../../../sgn/slashing/v1/slashing_pb';


export class GenesisState extends jspb.Message {
  getParams(): sgn_slashing_v1_slashing_pb.Params | undefined;
  setParams(value?: sgn_slashing_v1_slashing_pb.Params): GenesisState;
  hasParams(): boolean;
  clearParams(): GenesisState;

  getSlashesList(): Array<sgn_slashing_v1_slashing_pb.Slash>;
  setSlashesList(value: Array<sgn_slashing_v1_slashing_pb.Slash>): GenesisState;
  clearSlashesList(): GenesisState;
  addSlashes(value?: sgn_slashing_v1_slashing_pb.Slash, index?: number): sgn_slashing_v1_slashing_pb.Slash;

  getSlashNonce(): number;
  setSlashNonce(value: number): GenesisState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenesisState.AsObject;
  static toObject(includeInstance: boolean, msg: GenesisState): GenesisState.AsObject;
  static serializeBinaryToWriter(message: GenesisState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenesisState;
  static deserializeBinaryFromReader(message: GenesisState, reader: jspb.BinaryReader): GenesisState;
}

export namespace GenesisState {
  export type AsObject = {
    params?: sgn_slashing_v1_slashing_pb.Params.AsObject,
    slashesList: Array<sgn_slashing_v1_slashing_pb.Slash.AsObject>,
    slashNonce: number,
  }
}

