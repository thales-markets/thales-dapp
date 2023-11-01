/**
 * @fileoverview gRPC-Web generated client stub for sgn.message.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_message_v1_query_pb from '../../../sgn/message/v1/query_pb';


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

  methodInfoParams = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Query/Params',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_query_pb.QueryParamsRequest,
    sgn_message_v1_query_pb.QueryParamsResponse,
    (request: sgn_message_v1_query_pb.QueryParamsRequest) => {
      return request.serializeBinary();
    },
    sgn_message_v1_query_pb.QueryParamsResponse.deserializeBinary
  );

  params(
    request: sgn_message_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_message_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryParamsResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_message_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryParamsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Query/Params',
        request,
        metadata || {},
        this.methodInfoParams,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Query/Params',
    request,
    metadata || {},
    this.methodInfoParams);
  }

  methodInfoExecutionContexts = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Query/ExecutionContexts',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_query_pb.QueryExecutionContextsRequest,
    sgn_message_v1_query_pb.QueryExecutionContextsResponse,
    (request: sgn_message_v1_query_pb.QueryExecutionContextsRequest) => {
      return request.serializeBinary();
    },
    sgn_message_v1_query_pb.QueryExecutionContextsResponse.deserializeBinary
  );

  executionContexts(
    request: sgn_message_v1_query_pb.QueryExecutionContextsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_query_pb.QueryExecutionContextsResponse>;

  executionContexts(
    request: sgn_message_v1_query_pb.QueryExecutionContextsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryExecutionContextsResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_query_pb.QueryExecutionContextsResponse>;

  executionContexts(
    request: sgn_message_v1_query_pb.QueryExecutionContextsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryExecutionContextsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Query/ExecutionContexts',
        request,
        metadata || {},
        this.methodInfoExecutionContexts,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Query/ExecutionContexts',
    request,
    metadata || {},
    this.methodInfoExecutionContexts);
  }

  methodInfoMessage = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Query/Message',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_query_pb.QueryMessageRequest,
    sgn_message_v1_query_pb.QueryMessageResponse,
    (request: sgn_message_v1_query_pb.QueryMessageRequest) => {
      return request.serializeBinary();
    },
    sgn_message_v1_query_pb.QueryMessageResponse.deserializeBinary
  );

  message(
    request: sgn_message_v1_query_pb.QueryMessageRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_query_pb.QueryMessageResponse>;

  message(
    request: sgn_message_v1_query_pb.QueryMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryMessageResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_query_pb.QueryMessageResponse>;

  message(
    request: sgn_message_v1_query_pb.QueryMessageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryMessageResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Query/Message',
        request,
        metadata || {},
        this.methodInfoMessage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Query/Message',
    request,
    metadata || {},
    this.methodInfoMessage);
  }

  methodInfoMessageExists = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Query/MessageExists',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_query_pb.QueryMessageExistsRequest,
    sgn_message_v1_query_pb.QueryMessageExistsResponse,
    (request: sgn_message_v1_query_pb.QueryMessageExistsRequest) => {
      return request.serializeBinary();
    },
    sgn_message_v1_query_pb.QueryMessageExistsResponse.deserializeBinary
  );

  messageExists(
    request: sgn_message_v1_query_pb.QueryMessageExistsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_query_pb.QueryMessageExistsResponse>;

  messageExists(
    request: sgn_message_v1_query_pb.QueryMessageExistsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryMessageExistsResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_query_pb.QueryMessageExistsResponse>;

  messageExists(
    request: sgn_message_v1_query_pb.QueryMessageExistsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryMessageExistsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Query/MessageExists',
        request,
        metadata || {},
        this.methodInfoMessageExists,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Query/MessageExists',
    request,
    metadata || {},
    this.methodInfoMessageExists);
  }

  methodInfoIsMessageActive = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Query/IsMessageActive',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_query_pb.IsMessageActiveRequest,
    sgn_message_v1_query_pb.IsMessageActiveResponse,
    (request: sgn_message_v1_query_pb.IsMessageActiveRequest) => {
      return request.serializeBinary();
    },
    sgn_message_v1_query_pb.IsMessageActiveResponse.deserializeBinary
  );

  isMessageActive(
    request: sgn_message_v1_query_pb.IsMessageActiveRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_query_pb.IsMessageActiveResponse>;

  isMessageActive(
    request: sgn_message_v1_query_pb.IsMessageActiveRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.IsMessageActiveResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_query_pb.IsMessageActiveResponse>;

  isMessageActive(
    request: sgn_message_v1_query_pb.IsMessageActiveRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.IsMessageActiveResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Query/IsMessageActive',
        request,
        metadata || {},
        this.methodInfoIsMessageActive,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Query/IsMessageActive',
    request,
    metadata || {},
    this.methodInfoIsMessageActive);
  }

  methodInfoRefundExists = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Query/RefundExists',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_query_pb.QueryRefundExistsRequest,
    sgn_message_v1_query_pb.QueryRefundExistsResponse,
    (request: sgn_message_v1_query_pb.QueryRefundExistsRequest) => {
      return request.serializeBinary();
    },
    sgn_message_v1_query_pb.QueryRefundExistsResponse.deserializeBinary
  );

  refundExists(
    request: sgn_message_v1_query_pb.QueryRefundExistsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_query_pb.QueryRefundExistsResponse>;

  refundExists(
    request: sgn_message_v1_query_pb.QueryRefundExistsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryRefundExistsResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_query_pb.QueryRefundExistsResponse>;

  refundExists(
    request: sgn_message_v1_query_pb.QueryRefundExistsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryRefundExistsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Query/RefundExists',
        request,
        metadata || {},
        this.methodInfoRefundExists,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Query/RefundExists',
    request,
    metadata || {},
    this.methodInfoRefundExists);
  }

  methodInfoTransfer = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Query/Transfer',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_query_pb.QueryTransferRequest,
    sgn_message_v1_query_pb.QueryTransferResponse,
    (request: sgn_message_v1_query_pb.QueryTransferRequest) => {
      return request.serializeBinary();
    },
    sgn_message_v1_query_pb.QueryTransferResponse.deserializeBinary
  );

  transfer(
    request: sgn_message_v1_query_pb.QueryTransferRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_query_pb.QueryTransferResponse>;

  transfer(
    request: sgn_message_v1_query_pb.QueryTransferRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryTransferResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_query_pb.QueryTransferResponse>;

  transfer(
    request: sgn_message_v1_query_pb.QueryTransferRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryTransferResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Query/Transfer',
        request,
        metadata || {},
        this.methodInfoTransfer,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Query/Transfer',
    request,
    metadata || {},
    this.methodInfoTransfer);
  }

  methodInfoMessageBus = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Query/MessageBus',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_query_pb.QueryMessageBusRequest,
    sgn_message_v1_query_pb.QueryMessageBusResponse,
    (request: sgn_message_v1_query_pb.QueryMessageBusRequest) => {
      return request.serializeBinary();
    },
    sgn_message_v1_query_pb.QueryMessageBusResponse.deserializeBinary
  );

  messageBus(
    request: sgn_message_v1_query_pb.QueryMessageBusRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_query_pb.QueryMessageBusResponse>;

  messageBus(
    request: sgn_message_v1_query_pb.QueryMessageBusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryMessageBusResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_query_pb.QueryMessageBusResponse>;

  messageBus(
    request: sgn_message_v1_query_pb.QueryMessageBusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryMessageBusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Query/MessageBus',
        request,
        metadata || {},
        this.methodInfoMessageBus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Query/MessageBus',
    request,
    metadata || {},
    this.methodInfoMessageBus);
  }

  methodInfoFeeClaimInfo = new grpcWeb.MethodDescriptor(
    '/sgn.message.v1.Query/FeeClaimInfo',
    grpcWeb.MethodType.UNARY,
    sgn_message_v1_query_pb.QueryFeeClaimInfoRequest,
    sgn_message_v1_query_pb.QueryFeeClaimInfoResponse,
    (request: sgn_message_v1_query_pb.QueryFeeClaimInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_message_v1_query_pb.QueryFeeClaimInfoResponse.deserializeBinary
  );

  feeClaimInfo(
    request: sgn_message_v1_query_pb.QueryFeeClaimInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_message_v1_query_pb.QueryFeeClaimInfoResponse>;

  feeClaimInfo(
    request: sgn_message_v1_query_pb.QueryFeeClaimInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryFeeClaimInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_message_v1_query_pb.QueryFeeClaimInfoResponse>;

  feeClaimInfo(
    request: sgn_message_v1_query_pb.QueryFeeClaimInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_message_v1_query_pb.QueryFeeClaimInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.message.v1.Query/FeeClaimInfo',
        request,
        metadata || {},
        this.methodInfoFeeClaimInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.message.v1.Query/FeeClaimInfo',
    request,
    metadata || {},
    this.methodInfoFeeClaimInfo);
  }

}

