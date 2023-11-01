/**
 * @fileoverview gRPC-Web generated client stub for sgn.pegbridge.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_pegbridge_v1_tx_pb from '../../../sgn/pegbridge/v1/tx_pb';


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

  methodInfoSignMint = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Msg/SignMint',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_tx_pb.MsgSignMint,
    sgn_pegbridge_v1_tx_pb.MsgSignMintResponse,
    (request: sgn_pegbridge_v1_tx_pb.MsgSignMint) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_tx_pb.MsgSignMintResponse.deserializeBinary
  );

  signMint(
    request: sgn_pegbridge_v1_tx_pb.MsgSignMint,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_tx_pb.MsgSignMintResponse>;

  signMint(
    request: sgn_pegbridge_v1_tx_pb.MsgSignMint,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgSignMintResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_tx_pb.MsgSignMintResponse>;

  signMint(
    request: sgn_pegbridge_v1_tx_pb.MsgSignMint,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgSignMintResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Msg/SignMint',
        request,
        metadata || {},
        this.methodInfoSignMint,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Msg/SignMint',
    request,
    metadata || {},
    this.methodInfoSignMint);
  }

  methodInfoSignWithdraw = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Msg/SignWithdraw',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_tx_pb.MsgSignWithdraw,
    sgn_pegbridge_v1_tx_pb.MsgSignWithdrawResponse,
    (request: sgn_pegbridge_v1_tx_pb.MsgSignWithdraw) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_tx_pb.MsgSignWithdrawResponse.deserializeBinary
  );

  signWithdraw(
    request: sgn_pegbridge_v1_tx_pb.MsgSignWithdraw,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_tx_pb.MsgSignWithdrawResponse>;

  signWithdraw(
    request: sgn_pegbridge_v1_tx_pb.MsgSignWithdraw,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgSignWithdrawResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_tx_pb.MsgSignWithdrawResponse>;

  signWithdraw(
    request: sgn_pegbridge_v1_tx_pb.MsgSignWithdraw,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgSignWithdrawResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Msg/SignWithdraw',
        request,
        metadata || {},
        this.methodInfoSignWithdraw,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Msg/SignWithdraw',
    request,
    metadata || {},
    this.methodInfoSignWithdraw);
  }

  methodInfoTriggerSignMint = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Msg/TriggerSignMint',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_tx_pb.MsgTriggerSignMint,
    sgn_pegbridge_v1_tx_pb.MsgTriggerSignMintResponse,
    (request: sgn_pegbridge_v1_tx_pb.MsgTriggerSignMint) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_tx_pb.MsgTriggerSignMintResponse.deserializeBinary
  );

  triggerSignMint(
    request: sgn_pegbridge_v1_tx_pb.MsgTriggerSignMint,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_tx_pb.MsgTriggerSignMintResponse>;

  triggerSignMint(
    request: sgn_pegbridge_v1_tx_pb.MsgTriggerSignMint,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgTriggerSignMintResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_tx_pb.MsgTriggerSignMintResponse>;

  triggerSignMint(
    request: sgn_pegbridge_v1_tx_pb.MsgTriggerSignMint,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgTriggerSignMintResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Msg/TriggerSignMint',
        request,
        metadata || {},
        this.methodInfoTriggerSignMint,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Msg/TriggerSignMint',
    request,
    metadata || {},
    this.methodInfoTriggerSignMint);
  }

  methodInfoTriggerSignWithdraw = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Msg/TriggerSignWithdraw',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdraw,
    sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdrawResponse,
    (request: sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdraw) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdrawResponse.deserializeBinary
  );

  triggerSignWithdraw(
    request: sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdraw,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdrawResponse>;

  triggerSignWithdraw(
    request: sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdraw,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdrawResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdrawResponse>;

  triggerSignWithdraw(
    request: sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdraw,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgTriggerSignWithdrawResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Msg/TriggerSignWithdraw',
        request,
        metadata || {},
        this.methodInfoTriggerSignWithdraw,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Msg/TriggerSignWithdraw',
    request,
    metadata || {},
    this.methodInfoTriggerSignWithdraw);
  }

  methodInfoClaimFee = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Msg/ClaimFee',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_tx_pb.MsgClaimFee,
    sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse,
    (request: sgn_pegbridge_v1_tx_pb.MsgClaimFee) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse.deserializeBinary
  );

  claimFee(
    request: sgn_pegbridge_v1_tx_pb.MsgClaimFee,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse>;

  claimFee(
    request: sgn_pegbridge_v1_tx_pb.MsgClaimFee,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse>;

  claimFee(
    request: sgn_pegbridge_v1_tx_pb.MsgClaimFee,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Msg/ClaimFee',
        request,
        metadata || {},
        this.methodInfoClaimFee,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Msg/ClaimFee',
    request,
    metadata || {},
    this.methodInfoClaimFee);
  }

  methodInfoClaimRefund = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Msg/ClaimRefund',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_tx_pb.MsgClaimRefund,
    sgn_pegbridge_v1_tx_pb.MsgClaimRefundResponse,
    (request: sgn_pegbridge_v1_tx_pb.MsgClaimRefund) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_tx_pb.MsgClaimRefundResponse.deserializeBinary
  );

  claimRefund(
    request: sgn_pegbridge_v1_tx_pb.MsgClaimRefund,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_tx_pb.MsgClaimRefundResponse>;

  claimRefund(
    request: sgn_pegbridge_v1_tx_pb.MsgClaimRefund,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgClaimRefundResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_tx_pb.MsgClaimRefundResponse>;

  claimRefund(
    request: sgn_pegbridge_v1_tx_pb.MsgClaimRefund,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_tx_pb.MsgClaimRefundResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Msg/ClaimRefund',
        request,
        metadata || {},
        this.methodInfoClaimRefund,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Msg/ClaimRefund',
    request,
    metadata || {},
    this.methodInfoClaimRefund);
  }

}

