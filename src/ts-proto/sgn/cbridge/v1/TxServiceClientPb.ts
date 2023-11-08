/**
 * @fileoverview gRPC-Web generated client stub for sgn.cbridge.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_cbridge_v1_tx_pb from '../../../sgn/cbridge/v1/tx_pb';


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

  methodInfoInitWithdraw = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Msg/InitWithdraw',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_tx_pb.MsgInitWithdraw,
    sgn_cbridge_v1_tx_pb.MsgInitWithdrawResp,
    (request: sgn_cbridge_v1_tx_pb.MsgInitWithdraw) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_tx_pb.MsgInitWithdrawResp.deserializeBinary
  );

  initWithdraw(
    request: sgn_cbridge_v1_tx_pb.MsgInitWithdraw,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_tx_pb.MsgInitWithdrawResp>;

  initWithdraw(
    request: sgn_cbridge_v1_tx_pb.MsgInitWithdraw,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_tx_pb.MsgInitWithdrawResp) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_tx_pb.MsgInitWithdrawResp>;

  initWithdraw(
    request: sgn_cbridge_v1_tx_pb.MsgInitWithdraw,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_tx_pb.MsgInitWithdrawResp) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Msg/InitWithdraw',
        request,
        metadata || {},
        this.methodInfoInitWithdraw,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Msg/InitWithdraw',
    request,
    metadata || {},
    this.methodInfoInitWithdraw);
  }

  methodInfoSignAgain = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Msg/SignAgain',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_tx_pb.MsgSignAgain,
    sgn_cbridge_v1_tx_pb.MsgSignAgainResp,
    (request: sgn_cbridge_v1_tx_pb.MsgSignAgain) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_tx_pb.MsgSignAgainResp.deserializeBinary
  );

  signAgain(
    request: sgn_cbridge_v1_tx_pb.MsgSignAgain,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_tx_pb.MsgSignAgainResp>;

  signAgain(
    request: sgn_cbridge_v1_tx_pb.MsgSignAgain,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_tx_pb.MsgSignAgainResp) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_tx_pb.MsgSignAgainResp>;

  signAgain(
    request: sgn_cbridge_v1_tx_pb.MsgSignAgain,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_tx_pb.MsgSignAgainResp) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Msg/SignAgain',
        request,
        metadata || {},
        this.methodInfoSignAgain,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Msg/SignAgain',
    request,
    metadata || {},
    this.methodInfoSignAgain);
  }

  methodInfoSendMySig = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Msg/SendMySig',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_tx_pb.MsgSendMySig,
    sgn_cbridge_v1_tx_pb.MsgSendMySigResp,
    (request: sgn_cbridge_v1_tx_pb.MsgSendMySig) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_tx_pb.MsgSendMySigResp.deserializeBinary
  );

  sendMySig(
    request: sgn_cbridge_v1_tx_pb.MsgSendMySig,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_tx_pb.MsgSendMySigResp>;

  sendMySig(
    request: sgn_cbridge_v1_tx_pb.MsgSendMySig,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_tx_pb.MsgSendMySigResp) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_tx_pb.MsgSendMySigResp>;

  sendMySig(
    request: sgn_cbridge_v1_tx_pb.MsgSendMySig,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_tx_pb.MsgSendMySigResp) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Msg/SendMySig',
        request,
        metadata || {},
        this.methodInfoSendMySig,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Msg/SendMySig',
    request,
    metadata || {},
    this.methodInfoSendMySig);
  }

  methodInfoUpdateLatestSigners = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Msg/UpdateLatestSigners',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_tx_pb.MsgUpdateLatestSigners,
    sgn_cbridge_v1_tx_pb.MsgUpdateLatestSignersResp,
    (request: sgn_cbridge_v1_tx_pb.MsgUpdateLatestSigners) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_tx_pb.MsgUpdateLatestSignersResp.deserializeBinary
  );

  updateLatestSigners(
    request: sgn_cbridge_v1_tx_pb.MsgUpdateLatestSigners,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_tx_pb.MsgUpdateLatestSignersResp>;

  updateLatestSigners(
    request: sgn_cbridge_v1_tx_pb.MsgUpdateLatestSigners,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_tx_pb.MsgUpdateLatestSignersResp) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_tx_pb.MsgUpdateLatestSignersResp>;

  updateLatestSigners(
    request: sgn_cbridge_v1_tx_pb.MsgUpdateLatestSigners,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_tx_pb.MsgUpdateLatestSignersResp) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Msg/UpdateLatestSigners',
        request,
        metadata || {},
        this.methodInfoUpdateLatestSigners,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Msg/UpdateLatestSigners',
    request,
    metadata || {},
    this.methodInfoUpdateLatestSigners);
  }

  methodInfoSyncFarming = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Msg/SyncFarming',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_tx_pb.MsgSyncFarming,
    sgn_cbridge_v1_tx_pb.MsgSyncFarmingResponse,
    (request: sgn_cbridge_v1_tx_pb.MsgSyncFarming) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_tx_pb.MsgSyncFarmingResponse.deserializeBinary
  );

  syncFarming(
    request: sgn_cbridge_v1_tx_pb.MsgSyncFarming,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_tx_pb.MsgSyncFarmingResponse>;

  syncFarming(
    request: sgn_cbridge_v1_tx_pb.MsgSyncFarming,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_tx_pb.MsgSyncFarmingResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_tx_pb.MsgSyncFarmingResponse>;

  syncFarming(
    request: sgn_cbridge_v1_tx_pb.MsgSyncFarming,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_tx_pb.MsgSyncFarmingResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Msg/SyncFarming',
        request,
        metadata || {},
        this.methodInfoSyncFarming,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Msg/SyncFarming',
    request,
    metadata || {},
    this.methodInfoSyncFarming);
  }

}

