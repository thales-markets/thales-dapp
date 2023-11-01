import * as jspb from 'google-protobuf'

import * as sgn_staking_v1_staking_pb from '../../../sgn/staking/v1/staking_pb';


export class MsgSetTransactors extends jspb.Message {
  getOperation(): SetTransactorsOp;
  setOperation(value: SetTransactorsOp): MsgSetTransactors;

  getTransactorsList(): Array<string>;
  setTransactorsList(value: Array<string>): MsgSetTransactors;
  clearTransactorsList(): MsgSetTransactors;
  addTransactors(value: string, index?: number): MsgSetTransactors;

  getSender(): string;
  setSender(value: string): MsgSetTransactors;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSetTransactors.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSetTransactors): MsgSetTransactors.AsObject;
  static serializeBinaryToWriter(message: MsgSetTransactors, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSetTransactors;
  static deserializeBinaryFromReader(message: MsgSetTransactors, reader: jspb.BinaryReader): MsgSetTransactors;
}

export namespace MsgSetTransactors {
  export type AsObject = {
    operation: SetTransactorsOp,
    transactorsList: Array<string>,
    sender: string,
  }
}

export class MsgEditDescription extends jspb.Message {
  getDescription(): sgn_staking_v1_staking_pb.Description | undefined;
  setDescription(value?: sgn_staking_v1_staking_pb.Description): MsgEditDescription;
  hasDescription(): boolean;
  clearDescription(): MsgEditDescription;

  getSender(): string;
  setSender(value: string): MsgEditDescription;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgEditDescription.AsObject;
  static toObject(includeInstance: boolean, msg: MsgEditDescription): MsgEditDescription.AsObject;
  static serializeBinaryToWriter(message: MsgEditDescription, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgEditDescription;
  static deserializeBinaryFromReader(message: MsgEditDescription, reader: jspb.BinaryReader): MsgEditDescription;
}

export namespace MsgEditDescription {
  export type AsObject = {
    description?: sgn_staking_v1_staking_pb.Description.AsObject,
    sender: string,
  }
}

export enum SetTransactorsOp { 
  NOP = 0,
  OVERWRITE = 1,
  ADD = 2,
  REMOVE = 3,
}
