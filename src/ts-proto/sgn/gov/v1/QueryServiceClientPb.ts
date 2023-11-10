/**
 * @fileoverview gRPC-Web generated client stub for sgn.gov.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_gov_v1_query_pb from '../../../sgn/gov/v1/query_pb';


export class QueryClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoProposal = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Query/Proposal',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_query_pb.QueryProposalRequest,
    sgn_gov_v1_query_pb.QueryProposalResponse,
    (request: sgn_gov_v1_query_pb.QueryProposalRequest) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_query_pb.QueryProposalResponse.deserializeBinary
  );

  proposal(
    request: sgn_gov_v1_query_pb.QueryProposalRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_query_pb.QueryProposalResponse>;

  proposal(
    request: sgn_gov_v1_query_pb.QueryProposalRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryProposalResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_query_pb.QueryProposalResponse>;

  proposal(
    request: sgn_gov_v1_query_pb.QueryProposalRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryProposalResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Query/Proposal',
        request,
        metadata || {},
        this.methodInfoProposal,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Query/Proposal',
    request,
    metadata || {},
    this.methodInfoProposal);
  }

  methodInfoProposals = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Query/Proposals',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_query_pb.QueryProposalsRequest,
    sgn_gov_v1_query_pb.QueryProposalsResponse,
    (request: sgn_gov_v1_query_pb.QueryProposalsRequest) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_query_pb.QueryProposalsResponse.deserializeBinary
  );

  proposals(
    request: sgn_gov_v1_query_pb.QueryProposalsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_query_pb.QueryProposalsResponse>;

  proposals(
    request: sgn_gov_v1_query_pb.QueryProposalsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryProposalsResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_query_pb.QueryProposalsResponse>;

  proposals(
    request: sgn_gov_v1_query_pb.QueryProposalsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryProposalsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Query/Proposals',
        request,
        metadata || {},
        this.methodInfoProposals,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Query/Proposals',
    request,
    metadata || {},
    this.methodInfoProposals);
  }

  methodInfoVote = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Query/Vote',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_query_pb.QueryVoteRequest,
    sgn_gov_v1_query_pb.QueryVoteResponse,
    (request: sgn_gov_v1_query_pb.QueryVoteRequest) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_query_pb.QueryVoteResponse.deserializeBinary
  );

  vote(
    request: sgn_gov_v1_query_pb.QueryVoteRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_query_pb.QueryVoteResponse>;

  vote(
    request: sgn_gov_v1_query_pb.QueryVoteRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryVoteResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_query_pb.QueryVoteResponse>;

  vote(
    request: sgn_gov_v1_query_pb.QueryVoteRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryVoteResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Query/Vote',
        request,
        metadata || {},
        this.methodInfoVote,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Query/Vote',
    request,
    metadata || {},
    this.methodInfoVote);
  }

  methodInfoVotes = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Query/Votes',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_query_pb.QueryVotesRequest,
    sgn_gov_v1_query_pb.QueryVotesResponse,
    (request: sgn_gov_v1_query_pb.QueryVotesRequest) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_query_pb.QueryVotesResponse.deserializeBinary
  );

  votes(
    request: sgn_gov_v1_query_pb.QueryVotesRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_query_pb.QueryVotesResponse>;

  votes(
    request: sgn_gov_v1_query_pb.QueryVotesRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryVotesResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_query_pb.QueryVotesResponse>;

  votes(
    request: sgn_gov_v1_query_pb.QueryVotesRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryVotesResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Query/Votes',
        request,
        metadata || {},
        this.methodInfoVotes,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Query/Votes',
    request,
    metadata || {},
    this.methodInfoVotes);
  }

  methodInfoParams = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Query/Params',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_query_pb.QueryParamsRequest,
    sgn_gov_v1_query_pb.QueryParamsResponse,
    (request: sgn_gov_v1_query_pb.QueryParamsRequest) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_query_pb.QueryParamsResponse.deserializeBinary
  );

  params(
    request: sgn_gov_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_gov_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryParamsResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_gov_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryParamsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Query/Params',
        request,
        metadata || {},
        this.methodInfoParams,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Query/Params',
    request,
    metadata || {},
    this.methodInfoParams);
  }

  methodInfoDeposit = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Query/Deposit',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_query_pb.QueryDepositRequest,
    sgn_gov_v1_query_pb.QueryDepositResponse,
    (request: sgn_gov_v1_query_pb.QueryDepositRequest) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_query_pb.QueryDepositResponse.deserializeBinary
  );

  deposit(
    request: sgn_gov_v1_query_pb.QueryDepositRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_query_pb.QueryDepositResponse>;

  deposit(
    request: sgn_gov_v1_query_pb.QueryDepositRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryDepositResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_query_pb.QueryDepositResponse>;

  deposit(
    request: sgn_gov_v1_query_pb.QueryDepositRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryDepositResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Query/Deposit',
        request,
        metadata || {},
        this.methodInfoDeposit,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Query/Deposit',
    request,
    metadata || {},
    this.methodInfoDeposit);
  }

  methodInfoDeposits = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Query/Deposits',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_query_pb.QueryDepositsRequest,
    sgn_gov_v1_query_pb.QueryDepositsResponse,
    (request: sgn_gov_v1_query_pb.QueryDepositsRequest) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_query_pb.QueryDepositsResponse.deserializeBinary
  );

  deposits(
    request: sgn_gov_v1_query_pb.QueryDepositsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_query_pb.QueryDepositsResponse>;

  deposits(
    request: sgn_gov_v1_query_pb.QueryDepositsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryDepositsResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_query_pb.QueryDepositsResponse>;

  deposits(
    request: sgn_gov_v1_query_pb.QueryDepositsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryDepositsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Query/Deposits',
        request,
        metadata || {},
        this.methodInfoDeposits,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Query/Deposits',
    request,
    metadata || {},
    this.methodInfoDeposits);
  }

  methodInfoTallyResult = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Query/TallyResult',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_query_pb.QueryTallyResultRequest,
    sgn_gov_v1_query_pb.QueryTallyResultResponse,
    (request: sgn_gov_v1_query_pb.QueryTallyResultRequest) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_query_pb.QueryTallyResultResponse.deserializeBinary
  );

  tallyResult(
    request: sgn_gov_v1_query_pb.QueryTallyResultRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_query_pb.QueryTallyResultResponse>;

  tallyResult(
    request: sgn_gov_v1_query_pb.QueryTallyResultRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryTallyResultResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_query_pb.QueryTallyResultResponse>;

  tallyResult(
    request: sgn_gov_v1_query_pb.QueryTallyResultRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_query_pb.QueryTallyResultResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Query/TallyResult',
        request,
        metadata || {},
        this.methodInfoTallyResult,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Query/TallyResult',
    request,
    metadata || {},
    this.methodInfoTallyResult);
  }

}

