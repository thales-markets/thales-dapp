import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_common_v1_common_pb from '../../../sgn/common/v1/common_pb';
import * as sgn_pegbridge_v1_pegbridge_pb from '../../../sgn/pegbridge/v1/pegbridge_pb';


export class GenesisState extends jspb.Message {
  getParams(): sgn_pegbridge_v1_pegbridge_pb.Params | undefined;
  setParams(value?: sgn_pegbridge_v1_pegbridge_pb.Params): GenesisState;
  hasParams(): boolean;
  clearParams(): GenesisState;

  getConfig(): sgn_pegbridge_v1_pegbridge_pb.PegConfig | undefined;
  setConfig(value?: sgn_pegbridge_v1_pegbridge_pb.PegConfig): GenesisState;
  hasConfig(): boolean;
  clearConfig(): GenesisState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenesisState.AsObject;
  static toObject(includeInstance: boolean, msg: GenesisState): GenesisState.AsObject;
  static serializeBinaryToWriter(message: GenesisState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenesisState;
  static deserializeBinaryFromReader(message: GenesisState, reader: jspb.BinaryReader): GenesisState;
}

export namespace GenesisState {
  export type AsObject = {
    params?: sgn_pegbridge_v1_pegbridge_pb.Params.AsObject,
    config?: sgn_pegbridge_v1_pegbridge_pb.PegConfig.AsObject,
  }
}

