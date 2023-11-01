import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_api_annotations_pb from '../../../google/api/annotations_pb';
import * as cosmos_base_query_v1beta1_pagination_pb from '../../../cosmos/base/query/v1beta1/pagination_pb';
import * as sgn_gov_v1_gov_pb from '../../../sgn/gov/v1/gov_pb';


export class QueryProposalRequest extends jspb.Message {
  getProposalId(): number;
  setProposalId(value: number): QueryProposalRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryProposalRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryProposalRequest): QueryProposalRequest.AsObject;
  static serializeBinaryToWriter(message: QueryProposalRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryProposalRequest;
  static deserializeBinaryFromReader(message: QueryProposalRequest, reader: jspb.BinaryReader): QueryProposalRequest;
}

export namespace QueryProposalRequest {
  export type AsObject = {
    proposalId: number,
  }
}

export class QueryProposalResponse extends jspb.Message {
  getProposal(): sgn_gov_v1_gov_pb.Proposal | undefined;
  setProposal(value?: sgn_gov_v1_gov_pb.Proposal): QueryProposalResponse;
  hasProposal(): boolean;
  clearProposal(): QueryProposalResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryProposalResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryProposalResponse): QueryProposalResponse.AsObject;
  static serializeBinaryToWriter(message: QueryProposalResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryProposalResponse;
  static deserializeBinaryFromReader(message: QueryProposalResponse, reader: jspb.BinaryReader): QueryProposalResponse;
}

export namespace QueryProposalResponse {
  export type AsObject = {
    proposal?: sgn_gov_v1_gov_pb.Proposal.AsObject,
  }
}

export class QueryProposalsRequest extends jspb.Message {
  getProposalStatus(): sgn_gov_v1_gov_pb.ProposalStatus;
  setProposalStatus(value: sgn_gov_v1_gov_pb.ProposalStatus): QueryProposalsRequest;

  getVoter(): string;
  setVoter(value: string): QueryProposalsRequest;

  getDepositor(): string;
  setDepositor(value: string): QueryProposalsRequest;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageRequest | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageRequest): QueryProposalsRequest;
  hasPagination(): boolean;
  clearPagination(): QueryProposalsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryProposalsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryProposalsRequest): QueryProposalsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryProposalsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryProposalsRequest;
  static deserializeBinaryFromReader(message: QueryProposalsRequest, reader: jspb.BinaryReader): QueryProposalsRequest;
}

export namespace QueryProposalsRequest {
  export type AsObject = {
    proposalStatus: sgn_gov_v1_gov_pb.ProposalStatus,
    voter: string,
    depositor: string,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageRequest.AsObject,
  }
}

export class QueryProposalsResponse extends jspb.Message {
  getProposalsList(): Array<sgn_gov_v1_gov_pb.Proposal>;
  setProposalsList(value: Array<sgn_gov_v1_gov_pb.Proposal>): QueryProposalsResponse;
  clearProposalsList(): QueryProposalsResponse;
  addProposals(value?: sgn_gov_v1_gov_pb.Proposal, index?: number): sgn_gov_v1_gov_pb.Proposal;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageResponse | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageResponse): QueryProposalsResponse;
  hasPagination(): boolean;
  clearPagination(): QueryProposalsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryProposalsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryProposalsResponse): QueryProposalsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryProposalsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryProposalsResponse;
  static deserializeBinaryFromReader(message: QueryProposalsResponse, reader: jspb.BinaryReader): QueryProposalsResponse;
}

export namespace QueryProposalsResponse {
  export type AsObject = {
    proposalsList: Array<sgn_gov_v1_gov_pb.Proposal.AsObject>,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageResponse.AsObject,
  }
}

export class QueryVoteRequest extends jspb.Message {
  getProposalId(): number;
  setProposalId(value: number): QueryVoteRequest;

  getVoter(): string;
  setVoter(value: string): QueryVoteRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryVoteRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryVoteRequest): QueryVoteRequest.AsObject;
  static serializeBinaryToWriter(message: QueryVoteRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryVoteRequest;
  static deserializeBinaryFromReader(message: QueryVoteRequest, reader: jspb.BinaryReader): QueryVoteRequest;
}

export namespace QueryVoteRequest {
  export type AsObject = {
    proposalId: number,
    voter: string,
  }
}

export class QueryVoteResponse extends jspb.Message {
  getVote(): sgn_gov_v1_gov_pb.Vote | undefined;
  setVote(value?: sgn_gov_v1_gov_pb.Vote): QueryVoteResponse;
  hasVote(): boolean;
  clearVote(): QueryVoteResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryVoteResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryVoteResponse): QueryVoteResponse.AsObject;
  static serializeBinaryToWriter(message: QueryVoteResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryVoteResponse;
  static deserializeBinaryFromReader(message: QueryVoteResponse, reader: jspb.BinaryReader): QueryVoteResponse;
}

export namespace QueryVoteResponse {
  export type AsObject = {
    vote?: sgn_gov_v1_gov_pb.Vote.AsObject,
  }
}

export class QueryVotesRequest extends jspb.Message {
  getProposalId(): number;
  setProposalId(value: number): QueryVotesRequest;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageRequest | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageRequest): QueryVotesRequest;
  hasPagination(): boolean;
  clearPagination(): QueryVotesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryVotesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryVotesRequest): QueryVotesRequest.AsObject;
  static serializeBinaryToWriter(message: QueryVotesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryVotesRequest;
  static deserializeBinaryFromReader(message: QueryVotesRequest, reader: jspb.BinaryReader): QueryVotesRequest;
}

export namespace QueryVotesRequest {
  export type AsObject = {
    proposalId: number,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageRequest.AsObject,
  }
}

export class QueryVotesResponse extends jspb.Message {
  getVotesList(): Array<sgn_gov_v1_gov_pb.Vote>;
  setVotesList(value: Array<sgn_gov_v1_gov_pb.Vote>): QueryVotesResponse;
  clearVotesList(): QueryVotesResponse;
  addVotes(value?: sgn_gov_v1_gov_pb.Vote, index?: number): sgn_gov_v1_gov_pb.Vote;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageResponse | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageResponse): QueryVotesResponse;
  hasPagination(): boolean;
  clearPagination(): QueryVotesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryVotesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryVotesResponse): QueryVotesResponse.AsObject;
  static serializeBinaryToWriter(message: QueryVotesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryVotesResponse;
  static deserializeBinaryFromReader(message: QueryVotesResponse, reader: jspb.BinaryReader): QueryVotesResponse;
}

export namespace QueryVotesResponse {
  export type AsObject = {
    votesList: Array<sgn_gov_v1_gov_pb.Vote.AsObject>,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageResponse.AsObject,
  }
}

export class QueryParamsRequest extends jspb.Message {
  getParamsType(): string;
  setParamsType(value: string): QueryParamsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryParamsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryParamsRequest): QueryParamsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryParamsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryParamsRequest;
  static deserializeBinaryFromReader(message: QueryParamsRequest, reader: jspb.BinaryReader): QueryParamsRequest;
}

export namespace QueryParamsRequest {
  export type AsObject = {
    paramsType: string,
  }
}

export class QueryParamsResponse extends jspb.Message {
  getVotingParams(): sgn_gov_v1_gov_pb.VotingParams | undefined;
  setVotingParams(value?: sgn_gov_v1_gov_pb.VotingParams): QueryParamsResponse;
  hasVotingParams(): boolean;
  clearVotingParams(): QueryParamsResponse;

  getDepositParams(): sgn_gov_v1_gov_pb.DepositParams | undefined;
  setDepositParams(value?: sgn_gov_v1_gov_pb.DepositParams): QueryParamsResponse;
  hasDepositParams(): boolean;
  clearDepositParams(): QueryParamsResponse;

  getTallyParams(): sgn_gov_v1_gov_pb.TallyParams | undefined;
  setTallyParams(value?: sgn_gov_v1_gov_pb.TallyParams): QueryParamsResponse;
  hasTallyParams(): boolean;
  clearTallyParams(): QueryParamsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryParamsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryParamsResponse): QueryParamsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryParamsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryParamsResponse;
  static deserializeBinaryFromReader(message: QueryParamsResponse, reader: jspb.BinaryReader): QueryParamsResponse;
}

export namespace QueryParamsResponse {
  export type AsObject = {
    votingParams?: sgn_gov_v1_gov_pb.VotingParams.AsObject,
    depositParams?: sgn_gov_v1_gov_pb.DepositParams.AsObject,
    tallyParams?: sgn_gov_v1_gov_pb.TallyParams.AsObject,
  }
}

export class QueryDepositRequest extends jspb.Message {
  getProposalId(): number;
  setProposalId(value: number): QueryDepositRequest;

  getDepositor(): string;
  setDepositor(value: string): QueryDepositRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDepositRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDepositRequest): QueryDepositRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDepositRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDepositRequest;
  static deserializeBinaryFromReader(message: QueryDepositRequest, reader: jspb.BinaryReader): QueryDepositRequest;
}

export namespace QueryDepositRequest {
  export type AsObject = {
    proposalId: number,
    depositor: string,
  }
}

export class QueryDepositResponse extends jspb.Message {
  getDeposit(): sgn_gov_v1_gov_pb.Deposit | undefined;
  setDeposit(value?: sgn_gov_v1_gov_pb.Deposit): QueryDepositResponse;
  hasDeposit(): boolean;
  clearDeposit(): QueryDepositResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDepositResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDepositResponse): QueryDepositResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDepositResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDepositResponse;
  static deserializeBinaryFromReader(message: QueryDepositResponse, reader: jspb.BinaryReader): QueryDepositResponse;
}

export namespace QueryDepositResponse {
  export type AsObject = {
    deposit?: sgn_gov_v1_gov_pb.Deposit.AsObject,
  }
}

export class QueryDepositsRequest extends jspb.Message {
  getProposalId(): number;
  setProposalId(value: number): QueryDepositsRequest;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageRequest | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageRequest): QueryDepositsRequest;
  hasPagination(): boolean;
  clearPagination(): QueryDepositsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDepositsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDepositsRequest): QueryDepositsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDepositsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDepositsRequest;
  static deserializeBinaryFromReader(message: QueryDepositsRequest, reader: jspb.BinaryReader): QueryDepositsRequest;
}

export namespace QueryDepositsRequest {
  export type AsObject = {
    proposalId: number,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageRequest.AsObject,
  }
}

export class QueryDepositsResponse extends jspb.Message {
  getDepositsList(): Array<sgn_gov_v1_gov_pb.Deposit>;
  setDepositsList(value: Array<sgn_gov_v1_gov_pb.Deposit>): QueryDepositsResponse;
  clearDepositsList(): QueryDepositsResponse;
  addDeposits(value?: sgn_gov_v1_gov_pb.Deposit, index?: number): sgn_gov_v1_gov_pb.Deposit;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageResponse | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageResponse): QueryDepositsResponse;
  hasPagination(): boolean;
  clearPagination(): QueryDepositsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDepositsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDepositsResponse): QueryDepositsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDepositsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDepositsResponse;
  static deserializeBinaryFromReader(message: QueryDepositsResponse, reader: jspb.BinaryReader): QueryDepositsResponse;
}

export namespace QueryDepositsResponse {
  export type AsObject = {
    depositsList: Array<sgn_gov_v1_gov_pb.Deposit.AsObject>,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageResponse.AsObject,
  }
}

export class QueryTallyResultRequest extends jspb.Message {
  getProposalId(): number;
  setProposalId(value: number): QueryTallyResultRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTallyResultRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTallyResultRequest): QueryTallyResultRequest.AsObject;
  static serializeBinaryToWriter(message: QueryTallyResultRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTallyResultRequest;
  static deserializeBinaryFromReader(message: QueryTallyResultRequest, reader: jspb.BinaryReader): QueryTallyResultRequest;
}

export namespace QueryTallyResultRequest {
  export type AsObject = {
    proposalId: number,
  }
}

export class QueryTallyResultResponse extends jspb.Message {
  getTally(): sgn_gov_v1_gov_pb.TallyResult | undefined;
  setTally(value?: sgn_gov_v1_gov_pb.TallyResult): QueryTallyResultResponse;
  hasTally(): boolean;
  clearTally(): QueryTallyResultResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTallyResultResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTallyResultResponse): QueryTallyResultResponse.AsObject;
  static serializeBinaryToWriter(message: QueryTallyResultResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTallyResultResponse;
  static deserializeBinaryFromReader(message: QueryTallyResultResponse, reader: jspb.BinaryReader): QueryTallyResultResponse;
}

export namespace QueryTallyResultResponse {
  export type AsObject = {
    tally?: sgn_gov_v1_gov_pb.TallyResult.AsObject,
  }
}

