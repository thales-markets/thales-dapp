/**
 * @fileoverview gRPC-Web generated client stub for sgn.message.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_message_v1_tx_pb from '../../../sgn/message/v1/tx_pb';


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

  methodInfoSignMessage = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Msg/SignMessage',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_tx_pb.MsgSignMessage,
    sgn_message_v1_tx_pb.MsgSignMessageResponse,
    (request: sgn_message_v1_tx_pb.MsgSignMessage) => {
      return request.serializeBinary();
    },
    sgn_message_v1_tx_pb.MsgSignMessageResponse.deserializeBinary
  );

  signMessage(
    request: sgn_message_v1_tx_pb.MsgSignMessage,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_tx_pb.MsgSignMessageResponse>;

  signMessage(
    request: sgn_message_v1_tx_pb.MsgSignMessage,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_tx_pb.MsgSignMessageResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_tx_pb.MsgSignMessageResponse>;

  signMessage(
    request: sgn_message_v1_tx_pb.MsgSignMessage,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_tx_pb.MsgSignMessageResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Msg/SignMessage',
        request,
        metadata || {},
        this.methodInfoSignMessage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Msg/SignMessage',
    request,
    metadata || {},
    this.methodInfoSignMessage);
  }

  methodInfoTriggerSignMessage = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Msg/TriggerSignMessage',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_tx_pb.MsgTriggerSignMessage,
    sgn_message_v1_tx_pb.MsgTriggerSignMessageResponse,
    (request: sgn_message_v1_tx_pb.MsgTriggerSignMessage) => {
      return request.serializeBinary();
    },
    sgn_message_v1_tx_pb.MsgTriggerSignMessageResponse.deserializeBinary
  );

  triggerSignMessage(
    request: sgn_message_v1_tx_pb.MsgTriggerSignMessage,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_tx_pb.MsgTriggerSignMessageResponse>;

  triggerSignMessage(
    request: sgn_message_v1_tx_pb.MsgTriggerSignMessage,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_tx_pb.MsgTriggerSignMessageResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_tx_pb.MsgTriggerSignMessageResponse>;

  triggerSignMessage(
    request: sgn_message_v1_tx_pb.MsgTriggerSignMessage,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_tx_pb.MsgTriggerSignMessageResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Msg/TriggerSignMessage',
        request,
        metadata || {},
        this.methodInfoTriggerSignMessage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Msg/TriggerSignMessage',
    request,
    metadata || {},
    this.methodInfoTriggerSignMessage);
  }

  methodInfoClaimAllFees = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Msg/ClaimAllFees',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_tx_pb.MsgClaimAllFees,
    sgn_message_v1_tx_pb.MsgClaimAllFeesResponse,
    (request: sgn_message_v1_tx_pb.MsgClaimAllFees) => {
      return request.serializeBinary();
    },
    sgn_message_v1_tx_pb.MsgClaimAllFeesResponse.deserializeBinary
  );

  claimAllFees(
    request: sgn_message_v1_tx_pb.MsgClaimAllFees,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_tx_pb.MsgClaimAllFeesResponse>;

  claimAllFees(
    request: sgn_message_v1_tx_pb.MsgClaimAllFees,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_tx_pb.MsgClaimAllFeesResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_tx_pb.MsgClaimAllFeesResponse>;

  claimAllFees(
    request: sgn_message_v1_tx_pb.MsgClaimAllFees,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_tx_pb.MsgClaimAllFeesResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Msg/ClaimAllFees',
        request,
        metadata || {},
        this.methodInfoClaimAllFees,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Msg/ClaimAllFees',
    request,
    metadata || {},
    this.methodInfoClaimAllFees);
  }

}

