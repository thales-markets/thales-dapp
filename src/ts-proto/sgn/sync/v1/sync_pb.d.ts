import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';


export class Vote extends jspb.Message {
  getVoter(): string;
  setVoter(value: string): Vote;

  getOption(): VoteOption;
  setOption(value: VoteOption): Vote;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vote.AsObject;
  static toObject(includeInstance: boolean, msg: Vote): Vote.AsObject;
  static serializeBinaryToWriter(message: Vote, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vote;
  static deserializeBinaryFromReader(message: Vote, reader: jspb.BinaryReader): Vote;
}

export namespace Vote {
  export type AsObject = {
    voter: string,
    option: VoteOption,
  }
}

export class PendingUpdate extends jspb.Message {
  getId(): number;
  setId(value: number): PendingUpdate;

  getType(): DataType;
  setType(value: DataType): PendingUpdate;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): PendingUpdate;

  getChainId(): number;
  setChainId(value: number): PendingUpdate;

  getChainBlock(): number;
  setChainBlock(value: number): PendingUpdate;

  getProposer(): string;
  setProposer(value: string): PendingUpdate;

  getVotesList(): Array<Vote>;
  setVotesList(value: Array<Vote>): PendingUpdate;
  clearVotesList(): PendingUpdate;
  addVotes(value?: Vote, index?: number): Vote;

  getProposeTs(): number;
  setProposeTs(value: number): PendingUpdate;

  getClosingTs(): number;
  setClosingTs(value: number): PendingUpdate;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PendingUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: PendingUpdate): PendingUpdate.AsObject;
  static serializeBinaryToWriter(message: PendingUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PendingUpdate;
  static deserializeBinaryFromReader(message: PendingUpdate, reader: jspb.BinaryReader): PendingUpdate;
}

export namespace PendingUpdate {
  export type AsObject = {
    id: number,
    type: DataType,
    data: Uint8Array | string,
    chainId: number,
    chainBlock: number,
    proposer: string,
    votesList: Array<Vote.AsObject>,
    proposeTs: number,
    closingTs: number,
  }
}

export class Params extends jspb.Message {
  getVotingPeriod(): number;
  setVotingPeriod(value: number): Params;

  getTallyThreshold(): Uint8Array | string;
  getTallyThreshold_asU8(): Uint8Array;
  getTallyThreshold_asB64(): string;
  setTallyThreshold(value: Uint8Array | string): Params;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Params.AsObject;
  static toObject(includeInstance: boolean, msg: Params): Params.AsObject;
  static serializeBinaryToWriter(message: Params, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Params;
  static deserializeBinaryFromReader(message: Params, reader: jspb.BinaryReader): Params;
}

export namespace Params {
  export type AsObject = {
    votingPeriod: number,
    tallyThreshold: Uint8Array | string,
  }
}

export enum DataType { 
  INVALID = 0,
  VALIDATORSGNADDR = 1,
  VALIDATORPARAMS = 2,
  VALIDATORSTATES = 3,
  DELEGATORSHARES = 4,
  CBRONCHAINEVENT = 5,
  CBRUPDATECBRPRICE = 6,
  PEGBRONCHAINEVENT = 7,
  MSGBRONCHAINEVENT = 8,
}
export enum VoteOption { 
  EMPTY = 0,
  YES = 1,
  ABSTAIN = 2,
  NO = 3,
}
