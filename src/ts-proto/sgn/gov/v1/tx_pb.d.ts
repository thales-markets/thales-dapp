import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_protobuf_any_pb from 'google-protobuf/google/protobuf/any_pb';
import * as cosmos_proto_cosmos_pb from '../../../cosmos_proto/cosmos_pb';
import * as sgn_gov_v1_gov_pb from '../../../sgn/gov/v1/gov_pb';


export class MsgSubmitProposal extends jspb.Message {
  getContent(): google_protobuf_any_pb.Any | undefined;
  setContent(value?: google_protobuf_any_pb.Any): MsgSubmitProposal;
  hasContent(): boolean;
  clearContent(): MsgSubmitProposal;

  getInitialDeposit(): string;
  setInitialDeposit(value: string): MsgSubmitProposal;

  getProposer(): string;
  setProposer(value: string): MsgSubmitProposal;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSubmitProposal.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSubmitProposal): MsgSubmitProposal.AsObject;
  static serializeBinaryToWriter(message: MsgSubmitProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSubmitProposal;
  static deserializeBinaryFromReader(message: MsgSubmitProposal, reader: jspb.BinaryReader): MsgSubmitProposal;
}

export namespace MsgSubmitProposal {
  export type AsObject = {
    content?: google_protobuf_any_pb.Any.AsObject,
    initialDeposit: string,
    proposer: string,
  }
}

export class MsgSubmitProposalResponse extends jspb.Message {
  getProposalId(): number;
  setProposalId(value: number): MsgSubmitProposalResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSubmitProposalResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSubmitProposalResponse): MsgSubmitProposalResponse.AsObject;
  static serializeBinaryToWriter(message: MsgSubmitProposalResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSubmitProposalResponse;
  static deserializeBinaryFromReader(message: MsgSubmitProposalResponse, reader: jspb.BinaryReader): MsgSubmitProposalResponse;
}

export namespace MsgSubmitProposalResponse {
  export type AsObject = {
    proposalId: number,
  }
}

export class MsgVote extends jspb.Message {
  getProposalId(): number;
  setProposalId(value: number): MsgVote;

  getVoter(): string;
  setVoter(value: string): MsgVote;

  getOption(): sgn_gov_v1_gov_pb.VoteOption;
  setOption(value: sgn_gov_v1_gov_pb.VoteOption): MsgVote;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgVote.AsObject;
  static toObject(includeInstance: boolean, msg: MsgVote): MsgVote.AsObject;
  static serializeBinaryToWriter(message: MsgVote, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgVote;
  static deserializeBinaryFromReader(message: MsgVote, reader: jspb.BinaryReader): MsgVote;
}

export namespace MsgVote {
  export type AsObject = {
    proposalId: number,
    voter: string,
    option: sgn_gov_v1_gov_pb.VoteOption,
  }
}

export class MsgVoteResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgVoteResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgVoteResponse): MsgVoteResponse.AsObject;
  static serializeBinaryToWriter(message: MsgVoteResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgVoteResponse;
  static deserializeBinaryFromReader(message: MsgVoteResponse, reader: jspb.BinaryReader): MsgVoteResponse;
}

export namespace MsgVoteResponse {
  export type AsObject = {
  }
}

export class MsgDeposit extends jspb.Message {
  getProposalId(): number;
  setProposalId(value: number): MsgDeposit;

  getDepositor(): string;
  setDepositor(value: string): MsgDeposit;

  getAmount(): string;
  setAmount(value: string): MsgDeposit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgDeposit.AsObject;
  static toObject(includeInstance: boolean, msg: MsgDeposit): MsgDeposit.AsObject;
  static serializeBinaryToWriter(message: MsgDeposit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgDeposit;
  static deserializeBinaryFromReader(message: MsgDeposit, reader: jspb.BinaryReader): MsgDeposit;
}

export namespace MsgDeposit {
  export type AsObject = {
    proposalId: number,
    depositor: string,
    amount: string,
  }
}

export class MsgDepositResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgDepositResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgDepositResponse): MsgDepositResponse.AsObject;
  static serializeBinaryToWriter(message: MsgDepositResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgDepositResponse;
  static deserializeBinaryFromReader(message: MsgDepositResponse, reader: jspb.BinaryReader): MsgDepositResponse;
}

export namespace MsgDepositResponse {
  export type AsObject = {
  }
}

