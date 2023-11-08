import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_common_v1_common_pb from '../../../sgn/common/v1/common_pb';
import * as sgn_message_v1_message_pb from '../../../sgn/message/v1/message_pb';


export class GenesisState extends jspb.Message {
  getParams(): sgn_message_v1_message_pb.Params | undefined;
  setParams(value?: sgn_message_v1_message_pb.Params): GenesisState;
  hasParams(): boolean;
  clearParams(): GenesisState;

  getMessageBusesList(): Array<sgn_message_v1_message_pb.MessageBusInfo>;
  setMessageBusesList(value: Array<sgn_message_v1_message_pb.MessageBusInfo>): GenesisState;
  clearMessageBusesList(): GenesisState;
  addMessageBuses(value?: sgn_message_v1_message_pb.MessageBusInfo, index?: number): sgn_message_v1_message_pb.MessageBusInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenesisState.AsObject;
  static toObject(includeInstance: boolean, msg: GenesisState): GenesisState.AsObject;
  static serializeBinaryToWriter(message: GenesisState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenesisState;
  static deserializeBinaryFromReader(message: GenesisState, reader: jspb.BinaryReader): GenesisState;
}

export namespace GenesisState {
  export type AsObject = {
    params?: sgn_message_v1_message_pb.Params.AsObject,
    messageBusesList: Array<sgn_message_v1_message_pb.MessageBusInfo.AsObject>,
  }
}

