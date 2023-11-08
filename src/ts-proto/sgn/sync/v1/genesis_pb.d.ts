import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_sync_v1_sync_pb from '../../../sgn/sync/v1/sync_pb';


export class GenesisState extends jspb.Message {
  getParams(): sgn_sync_v1_sync_pb.Params | undefined;
  setParams(value?: sgn_sync_v1_sync_pb.Params): GenesisState;
  hasParams(): boolean;
  clearParams(): GenesisState;

  getStartUpdateId(): number;
  setStartUpdateId(value: number): GenesisState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenesisState.AsObject;
  static toObject(includeInstance: boolean, msg: GenesisState): GenesisState.AsObject;
  static serializeBinaryToWriter(message: GenesisState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenesisState;
  static deserializeBinaryFromReader(message: GenesisState, reader: jspb.BinaryReader): GenesisState;
}

export namespace GenesisState {
  export type AsObject = {
    params?: sgn_sync_v1_sync_pb.Params.AsObject,
    startUpdateId: number,
  }
}

