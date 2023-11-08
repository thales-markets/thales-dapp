/**
 * @fileoverview gRPC-Web generated client stub for sgn.pegbridge.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_pegbridge_v1_pegbridge_pb from '../../../sgn/pegbridge/v1/pegbridge_pb';
import * as sgn_pegbridge_v1_query_pb from '../../../sgn/pegbridge/v1/query_pb';


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
    '/sgn.pegbridge.v1.Query/Params',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QueryParamsRequest,
    sgn_pegbridge_v1_query_pb.QueryParamsResponse,
    (request: sgn_pegbridge_v1_query_pb.QueryParamsRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_query_pb.QueryParamsResponse.deserializeBinary
  );

  params(
    request: sgn_pegbridge_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_pegbridge_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryParamsResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_pegbridge_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryParamsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/Params',
        request,
        metadata || {},
        this.methodInfoParams,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/Params',
    request,
    metadata || {},
    this.methodInfoParams);
  }

  methodInfoConfig = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Query/Config',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QueryConfigRequest,
    sgn_pegbridge_v1_pegbridge_pb.PegConfig,
    (request: sgn_pegbridge_v1_query_pb.QueryConfigRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_pegbridge_pb.PegConfig.deserializeBinary
  );

  config(
    request: sgn_pegbridge_v1_query_pb.QueryConfigRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_pegbridge_pb.PegConfig>;

  config(
    request: sgn_pegbridge_v1_query_pb.QueryConfigRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_pegbridge_pb.PegConfig) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_pegbridge_pb.PegConfig>;

  config(
    request: sgn_pegbridge_v1_query_pb.QueryConfigRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_pegbridge_pb.PegConfig) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/Config',
        request,
        metadata || {},
        this.methodInfoConfig,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/Config',
    request,
    metadata || {},
    this.methodInfoConfig);
  }

  methodInfoOrigPeggedPairs = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Query/OrigPeggedPairs',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsRequest,
    sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsResponse,
    (request: sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsResponse.deserializeBinary
  );

  origPeggedPairs(
    request: sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsResponse>;

  origPeggedPairs(
    request: sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsResponse>;

  origPeggedPairs(
    request: sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryOrigPeggedPairsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/OrigPeggedPairs',
        request,
        metadata || {},
        this.methodInfoOrigPeggedPairs,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/OrigPeggedPairs',
    request,
    metadata || {},
    this.methodInfoOrigPeggedPairs);
  }

  methodInfoEstimatedAmountFees = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Query/EstimatedAmountFees',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesRequest,
    sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesResponse,
    (request: sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesResponse.deserializeBinary
  );

  estimatedAmountFees(
    request: sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesResponse>;

  estimatedAmountFees(
    request: sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesResponse>;

  estimatedAmountFees(
    request: sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryEstimatedAmountFeesResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/EstimatedAmountFees',
        request,
        metadata || {},
        this.methodInfoEstimatedAmountFees,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/EstimatedAmountFees',
    request,
    metadata || {},
    this.methodInfoEstimatedAmountFees);
  }

  methodInfoDepositInfo = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Query/DepositInfo',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QueryDepositInfoRequest,
    sgn_pegbridge_v1_query_pb.QueryDepositInfoResponse,
    (request: sgn_pegbridge_v1_query_pb.QueryDepositInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_query_pb.QueryDepositInfoResponse.deserializeBinary
  );

  depositInfo(
    request: sgn_pegbridge_v1_query_pb.QueryDepositInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_query_pb.QueryDepositInfoResponse>;

  depositInfo(
    request: sgn_pegbridge_v1_query_pb.QueryDepositInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryDepositInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_query_pb.QueryDepositInfoResponse>;

  depositInfo(
    request: sgn_pegbridge_v1_query_pb.QueryDepositInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryDepositInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/DepositInfo',
        request,
        metadata || {},
        this.methodInfoDepositInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/DepositInfo',
    request,
    metadata || {},
    this.methodInfoDepositInfo);
  }

  methodInfoWithdrawInfo = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Query/WithdrawInfo',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QueryWithdrawInfoRequest,
    sgn_pegbridge_v1_query_pb.QueryWithdrawInfoResponse,
    (request: sgn_pegbridge_v1_query_pb.QueryWithdrawInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_query_pb.QueryWithdrawInfoResponse.deserializeBinary
  );

  withdrawInfo(
    request: sgn_pegbridge_v1_query_pb.QueryWithdrawInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_query_pb.QueryWithdrawInfoResponse>;

  withdrawInfo(
    request: sgn_pegbridge_v1_query_pb.QueryWithdrawInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryWithdrawInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_query_pb.QueryWithdrawInfoResponse>;

  withdrawInfo(
    request: sgn_pegbridge_v1_query_pb.QueryWithdrawInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryWithdrawInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/WithdrawInfo',
        request,
        metadata || {},
        this.methodInfoWithdrawInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/WithdrawInfo',
    request,
    metadata || {},
    this.methodInfoWithdrawInfo);
  }

  methodInfoMintInfo = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Query/MintInfo',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QueryMintInfoRequest,
    sgn_pegbridge_v1_query_pb.QueryMintInfoResponse,
    (request: sgn_pegbridge_v1_query_pb.QueryMintInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_query_pb.QueryMintInfoResponse.deserializeBinary
  );

  mintInfo(
    request: sgn_pegbridge_v1_query_pb.QueryMintInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_query_pb.QueryMintInfoResponse>;

  mintInfo(
    request: sgn_pegbridge_v1_query_pb.QueryMintInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryMintInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_query_pb.QueryMintInfoResponse>;

  mintInfo(
    request: sgn_pegbridge_v1_query_pb.QueryMintInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryMintInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/MintInfo',
        request,
        metadata || {},
        this.methodInfoMintInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/MintInfo',
    request,
    metadata || {},
    this.methodInfoMintInfo);
  }

  methodInfoBurnInfo = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Query/BurnInfo',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QueryBurnInfoRequest,
    sgn_pegbridge_v1_query_pb.QueryBurnInfoResponse,
    (request: sgn_pegbridge_v1_query_pb.QueryBurnInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_query_pb.QueryBurnInfoResponse.deserializeBinary
  );

  burnInfo(
    request: sgn_pegbridge_v1_query_pb.QueryBurnInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_query_pb.QueryBurnInfoResponse>;

  burnInfo(
    request: sgn_pegbridge_v1_query_pb.QueryBurnInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryBurnInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_query_pb.QueryBurnInfoResponse>;

  burnInfo(
    request: sgn_pegbridge_v1_query_pb.QueryBurnInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryBurnInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/BurnInfo',
        request,
        metadata || {},
        this.methodInfoBurnInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/BurnInfo',
    request,
    metadata || {},
    this.methodInfoBurnInfo);
  }

  methodInfoFeeClaimInfo = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Query/FeeClaimInfo',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoRequest,
    sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoResponse,
    (request: sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoResponse.deserializeBinary
  );

  feeClaimInfo(
    request: sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoResponse>;

  feeClaimInfo(
    request: sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoResponse>;

  feeClaimInfo(
    request: sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryFeeClaimInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/FeeClaimInfo',
        request,
        metadata || {},
        this.methodInfoFeeClaimInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/FeeClaimInfo',
    request,
    metadata || {},
    this.methodInfoFeeClaimInfo);
  }

  methodInfoSupplyInfo = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Query/SupplyInfo',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QuerySupplyInfoRequest,
    sgn_pegbridge_v1_query_pb.QuerySupplyInfoResponse,
    (request: sgn_pegbridge_v1_query_pb.QuerySupplyInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_query_pb.QuerySupplyInfoResponse.deserializeBinary
  );

  supplyInfo(
    request: sgn_pegbridge_v1_query_pb.QuerySupplyInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_query_pb.QuerySupplyInfoResponse>;

  supplyInfo(
    request: sgn_pegbridge_v1_query_pb.QuerySupplyInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QuerySupplyInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_query_pb.QuerySupplyInfoResponse>;

  supplyInfo(
    request: sgn_pegbridge_v1_query_pb.QuerySupplyInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QuerySupplyInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/SupplyInfo',
        request,
        metadata || {},
        this.methodInfoSupplyInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/SupplyInfo',
    request,
    metadata || {},
    this.methodInfoSupplyInfo);
  }

  methodInfoRefundClaimInfo = new grpcWeb.MethodDescriptor(
    '/sgn.pegbridge.v1.Query/RefundClaimInfo',
    grpcWeb.MethodType.UNARY,
    sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoRequest,
    sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoResponse,
    (request: sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoResponse.deserializeBinary
  );

  refundClaimInfo(
    request: sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoResponse>;

  refundClaimInfo(
    request: sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoResponse>;

  refundClaimInfo(
    request: sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_pegbridge_v1_query_pb.QueryRefundClaimInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.pegbridge.v1.Query/RefundClaimInfo',
        request,
        metadata || {},
        this.methodInfoRefundClaimInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.pegbridge.v1.Query/RefundClaimInfo',
    request,
    metadata || {},
    this.methodInfoRefundClaimInfo);
  }

}

