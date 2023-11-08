/**
 * @fileoverview gRPC-Web generated client stub for sgn.farming.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_farming_v1_tx_pb from '../../../sgn/farming/v1/tx_pb';


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

  methodInfoClaimRewards = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Msg/ClaimRewards',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_tx_pb.MsgClaimRewards,
    sgn_farming_v1_tx_pb.MsgClaimRewardsResponse,
    (request: sgn_farming_v1_tx_pb.MsgClaimRewards) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_tx_pb.MsgClaimRewardsResponse.deserializeBinary
  );

  claimRewards(
    request: sgn_farming_v1_tx_pb.MsgClaimRewards,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_tx_pb.MsgClaimRewardsResponse>;

  claimRewards(
    request: sgn_farming_v1_tx_pb.MsgClaimRewards,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_tx_pb.MsgClaimRewardsResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_tx_pb.MsgClaimRewardsResponse>;

  claimRewards(
    request: sgn_farming_v1_tx_pb.MsgClaimRewards,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_tx_pb.MsgClaimRewardsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Msg/ClaimRewards',
        request,
        metadata || {},
        this.methodInfoClaimRewards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Msg/ClaimRewards',
    request,
    metadata || {},
    this.methodInfoClaimRewards);
  }

  methodInfoClaimAllRewards = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Msg/ClaimAllRewards',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_tx_pb.MsgClaimAllRewards,
    sgn_farming_v1_tx_pb.MsgClaimAllRewardsResponse,
    (request: sgn_farming_v1_tx_pb.MsgClaimAllRewards) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_tx_pb.MsgClaimAllRewardsResponse.deserializeBinary
  );

  claimAllRewards(
    request: sgn_farming_v1_tx_pb.MsgClaimAllRewards,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_tx_pb.MsgClaimAllRewardsResponse>;

  claimAllRewards(
    request: sgn_farming_v1_tx_pb.MsgClaimAllRewards,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_tx_pb.MsgClaimAllRewardsResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_tx_pb.MsgClaimAllRewardsResponse>;

  claimAllRewards(
    request: sgn_farming_v1_tx_pb.MsgClaimAllRewards,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_tx_pb.MsgClaimAllRewardsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Msg/ClaimAllRewards',
        request,
        metadata || {},
        this.methodInfoClaimAllRewards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Msg/ClaimAllRewards',
    request,
    metadata || {},
    this.methodInfoClaimAllRewards);
  }

  methodInfoSignRewards = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Msg/SignRewards',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_tx_pb.MsgSignRewards,
    sgn_farming_v1_tx_pb.MsgSignRewardsResponse,
    (request: sgn_farming_v1_tx_pb.MsgSignRewards) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_tx_pb.MsgSignRewardsResponse.deserializeBinary
  );

  signRewards(
    request: sgn_farming_v1_tx_pb.MsgSignRewards,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_tx_pb.MsgSignRewardsResponse>;

  signRewards(
    request: sgn_farming_v1_tx_pb.MsgSignRewards,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_tx_pb.MsgSignRewardsResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_tx_pb.MsgSignRewardsResponse>;

  signRewards(
    request: sgn_farming_v1_tx_pb.MsgSignRewards,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_tx_pb.MsgSignRewardsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Msg/SignRewards',
        request,
        metadata || {},
        this.methodInfoSignRewards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Msg/SignRewards',
    request,
    metadata || {},
    this.methodInfoSignRewards);
  }

}

