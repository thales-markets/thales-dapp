/**
 * @fileoverview gRPC-Web generated client stub for sgn.gov.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_gov_v1_tx_pb from '../../../sgn/gov/v1/tx_pb';


export class MsgClient {
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

  methodInfoSubmitProposal = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Msg/SubmitProposal',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_tx_pb.MsgSubmitProposal,
    sgn_gov_v1_tx_pb.MsgSubmitProposalResponse,
    (request: sgn_gov_v1_tx_pb.MsgSubmitProposal) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_tx_pb.MsgSubmitProposalResponse.deserializeBinary
  );

  submitProposal(
    request: sgn_gov_v1_tx_pb.MsgSubmitProposal,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_tx_pb.MsgSubmitProposalResponse>;

  submitProposal(
    request: sgn_gov_v1_tx_pb.MsgSubmitProposal,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_tx_pb.MsgSubmitProposalResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_tx_pb.MsgSubmitProposalResponse>;

  submitProposal(
    request: sgn_gov_v1_tx_pb.MsgSubmitProposal,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_tx_pb.MsgSubmitProposalResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Msg/SubmitProposal',
        request,
        metadata || {},
        this.methodInfoSubmitProposal,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Msg/SubmitProposal',
    request,
    metadata || {},
    this.methodInfoSubmitProposal);
  }

  methodInfoVote = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Msg/Vote',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_tx_pb.MsgVote,
    sgn_gov_v1_tx_pb.MsgVoteResponse,
    (request: sgn_gov_v1_tx_pb.MsgVote) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_tx_pb.MsgVoteResponse.deserializeBinary
  );

  vote(
    request: sgn_gov_v1_tx_pb.MsgVote,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_tx_pb.MsgVoteResponse>;

  vote(
    request: sgn_gov_v1_tx_pb.MsgVote,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_tx_pb.MsgVoteResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_tx_pb.MsgVoteResponse>;

  vote(
    request: sgn_gov_v1_tx_pb.MsgVote,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_tx_pb.MsgVoteResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Msg/Vote',
        request,
        metadata || {},
        this.methodInfoVote,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Msg/Vote',
    request,
    metadata || {},
    this.methodInfoVote);
  }

  methodInfoDeposit = new grpcWeb.MethodDescriptor(
    '/sgn.gov.v1.Msg/Deposit',
    grpcWeb.MethodType.UNARY,
    sgn_gov_v1_tx_pb.MsgDeposit,
    sgn_gov_v1_tx_pb.MsgDepositResponse,
    (request: sgn_gov_v1_tx_pb.MsgDeposit) => {
      return request.serializeBinary();
    },
    sgn_gov_v1_tx_pb.MsgDepositResponse.deserializeBinary
  );

  deposit(
    request: sgn_gov_v1_tx_pb.MsgDeposit,
    metadata: grpcWeb.Metadata | null): Promise<sgn_gov_v1_tx_pb.MsgDepositResponse>;

  deposit(
    request: sgn_gov_v1_tx_pb.MsgDeposit,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_tx_pb.MsgDepositResponse) => void): grpcWeb.ClientReadableStream<sgn_gov_v1_tx_pb.MsgDepositResponse>;

  deposit(
    request: sgn_gov_v1_tx_pb.MsgDeposit,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_gov_v1_tx_pb.MsgDepositResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gov.v1.Msg/Deposit',
        request,
        metadata || {},
        this.methodInfoDeposit,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gov.v1.Msg/Deposit',
    request,
    metadata || {},
    this.methodInfoDeposit);
  }

}

