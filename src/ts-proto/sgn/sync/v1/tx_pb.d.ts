import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_sync_v1_sync_pb from '../../../sgn/sync/v1/sync_pb';


export class ProposeUpdate extends jspb.Message {
  getType(): sgn_sync_v1_sync_pb.DataType;
  setType(value: sgn_sync_v1_sync_pb.DataType): ProposeUpdate;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): ProposeUpdate;

  getChainId(): number;
  setChainId(value: number): ProposeUpdate;

  getChainBlock(): number;
  setChainBlock(value: number): ProposeUpdate;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProposeUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: ProposeUpdate): ProposeUpdate.AsObject;
  static serializeBinaryToWriter(message: ProposeUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProposeUpdate;
  static deserializeBinaryFromReader(message: ProposeUpdate, reader: jspb.BinaryReader): ProposeUpdate;
}

export namespace ProposeUpdate {
  export type AsObject = {
    type: sgn_sync_v1_sync_pb.DataType,
    data: Uint8Array | string,
    chainId: number,
    chainBlock: number,
  }
}

export class MsgProposeUpdates extends jspb.Message {
  getUpdatesList(): Array<ProposeUpdate>;
  setUpdatesList(value: Array<ProposeUpdate>): MsgProposeUpdates;
  clearUpdatesList(): MsgProposeUpdates;
  addUpdates(value?: ProposeUpdate, index?: number): ProposeUpdate;

  getSender(): string;
  setSender(value: string): MsgProposeUpdates;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgProposeUpdates.AsObject;
  static toObject(includeInstance: boolean, msg: MsgProposeUpdates): MsgProposeUpdates.AsObject;
  static serializeBinaryToWriter(message: MsgProposeUpdates, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgProposeUpdates;
  static deserializeBinaryFromReader(message: MsgProposeUpdates, reader: jspb.BinaryReader): MsgProposeUpdates;
}

export namespace MsgProposeUpdates {
  export type AsObject = {
    updatesList: Array<ProposeUpdate.AsObject>,
    sender: string,
  }
}

export class VoteUpdate extends jspb.Message {
  getId(): number;
  setId(value: number): VoteUpdate;

  getOption(): sgn_sync_v1_sync_pb.VoteOption;
  setOption(value: sgn_sync_v1_sync_pb.VoteOption): VoteUpdate;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VoteUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: VoteUpdate): VoteUpdate.AsObject;
  static serializeBinaryToWriter(message: VoteUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VoteUpdate;
  static deserializeBinaryFromReader(message: VoteUpdate, reader: jspb.BinaryReader): VoteUpdate;
}

export namespace VoteUpdate {
  export type AsObject = {
    id: number,
    option: sgn_sync_v1_sync_pb.VoteOption,
  }
}

export class MsgVoteUpdates extends jspb.Message {
  getVotesList(): Array<VoteUpdate>;
  setVotesList(value: Array<VoteUpdate>): MsgVoteUpdates;
  clearVotesList(): MsgVoteUpdates;
  addVotes(value?: VoteUpdate, index?: number): VoteUpdate;

  getSender(): string;
  setSender(value: string): MsgVoteUpdates;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgVoteUpdates.AsObject;
  static toObject(includeInstance: boolean, msg: MsgVoteUpdates): MsgVoteUpdates.AsObject;
  static serializeBinaryToWriter(message: MsgVoteUpdates, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgVoteUpdates;
  static deserializeBinaryFromReader(message: MsgVoteUpdates, reader: jspb.BinaryReader): MsgVoteUpdates;
}

export namespace MsgVoteUpdates {
  export type AsObject = {
    votesList: Array<VoteUpdate.AsObject>,
    sender: string,
  }
}

