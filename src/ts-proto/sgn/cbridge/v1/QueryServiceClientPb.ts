/**
 * @fileoverview gRPC-Web generated client stub for sgn.cbridge.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_cbridge_v1_query_pb from '../../../sgn/cbridge/v1/query_pb';


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

  methodInfoQueryParams = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryParams',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.EmptyRequest,
    sgn_cbridge_v1_query_pb.QueryParamsResponse,
    (request: sgn_cbridge_v1_query_pb.EmptyRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryParamsResponse.deserializeBinary
  );

  queryParams(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryParamsResponse>;

  queryParams(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryParamsResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryParamsResponse>;

  queryParams(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryParamsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryParams',
        request,
        metadata || {},
        this.methodInfoQueryParams,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryParams',
    request,
    metadata || {},
    this.methodInfoQueryParams);
  }

  methodInfoQueryConfig = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryConfig',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.EmptyRequest,
    sgn_cbridge_v1_query_pb.QueryConfigResponse,
    (request: sgn_cbridge_v1_query_pb.EmptyRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryConfigResponse.deserializeBinary
  );

  queryConfig(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryConfigResponse>;

  queryConfig(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryConfigResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryConfigResponse>;

  queryConfig(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryConfigResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryConfig',
        request,
        metadata || {},
        this.methodInfoQueryConfig,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryConfig',
    request,
    metadata || {},
    this.methodInfoQueryConfig);
  }

  methodInfoQueryRelay = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryRelay',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.QueryRelayRequest,
    sgn_cbridge_v1_query_pb.QueryRelayResponse,
    (request: sgn_cbridge_v1_query_pb.QueryRelayRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryRelayResponse.deserializeBinary
  );

  queryRelay(
    request: sgn_cbridge_v1_query_pb.QueryRelayRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryRelayResponse>;

  queryRelay(
    request: sgn_cbridge_v1_query_pb.QueryRelayRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryRelayResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryRelayResponse>;

  queryRelay(
    request: sgn_cbridge_v1_query_pb.QueryRelayRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryRelayResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryRelay',
        request,
        metadata || {},
        this.methodInfoQueryRelay,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryRelay',
    request,
    metadata || {},
    this.methodInfoQueryRelay);
  }

  methodInfoQueryChainSigners = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryChainSigners',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.QueryChainSignersRequest,
    sgn_cbridge_v1_query_pb.QueryChainSignersResponse,
    (request: sgn_cbridge_v1_query_pb.QueryChainSignersRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryChainSignersResponse.deserializeBinary
  );

  queryChainSigners(
    request: sgn_cbridge_v1_query_pb.QueryChainSignersRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryChainSignersResponse>;

  queryChainSigners(
    request: sgn_cbridge_v1_query_pb.QueryChainSignersRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryChainSignersResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryChainSignersResponse>;

  queryChainSigners(
    request: sgn_cbridge_v1_query_pb.QueryChainSignersRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryChainSignersResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryChainSigners',
        request,
        metadata || {},
        this.methodInfoQueryChainSigners,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryChainSigners',
    request,
    metadata || {},
    this.methodInfoQueryChainSigners);
  }

  methodInfoQueryLatestSigners = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryLatestSigners',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.EmptyRequest,
    sgn_cbridge_v1_query_pb.QueryLatestSignersResponse,
    (request: sgn_cbridge_v1_query_pb.EmptyRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryLatestSignersResponse.deserializeBinary
  );

  queryLatestSigners(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryLatestSignersResponse>;

  queryLatestSigners(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryLatestSignersResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryLatestSignersResponse>;

  queryLatestSigners(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryLatestSignersResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryLatestSigners',
        request,
        metadata || {},
        this.methodInfoQueryLatestSigners,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryLatestSigners',
    request,
    metadata || {},
    this.methodInfoQueryLatestSigners);
  }

  methodInfoQueryCheckChainTokenValid = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryCheckChainTokenValid',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.CheckChainTokenValidRequest,
    sgn_cbridge_v1_query_pb.CheckChainTokenValidResponse,
    (request: sgn_cbridge_v1_query_pb.CheckChainTokenValidRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.CheckChainTokenValidResponse.deserializeBinary
  );

  queryCheckChainTokenValid(
    request: sgn_cbridge_v1_query_pb.CheckChainTokenValidRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.CheckChainTokenValidResponse>;

  queryCheckChainTokenValid(
    request: sgn_cbridge_v1_query_pb.CheckChainTokenValidRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.CheckChainTokenValidResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.CheckChainTokenValidResponse>;

  queryCheckChainTokenValid(
    request: sgn_cbridge_v1_query_pb.CheckChainTokenValidRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.CheckChainTokenValidResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryCheckChainTokenValid',
        request,
        metadata || {},
        this.methodInfoQueryCheckChainTokenValid,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryCheckChainTokenValid',
    request,
    metadata || {},
    this.methodInfoQueryCheckChainTokenValid);
  }

  methodInfoQueryChkLiqSum = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryChkLiqSum',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.CheckLiqSumRequest,
    sgn_cbridge_v1_query_pb.CheckLiqSumResponse,
    (request: sgn_cbridge_v1_query_pb.CheckLiqSumRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.CheckLiqSumResponse.deserializeBinary
  );

  queryChkLiqSum(
    request: sgn_cbridge_v1_query_pb.CheckLiqSumRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.CheckLiqSumResponse>;

  queryChkLiqSum(
    request: sgn_cbridge_v1_query_pb.CheckLiqSumRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.CheckLiqSumResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.CheckLiqSumResponse>;

  queryChkLiqSum(
    request: sgn_cbridge_v1_query_pb.CheckLiqSumRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.CheckLiqSumResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryChkLiqSum',
        request,
        metadata || {},
        this.methodInfoQueryChkLiqSum,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryChkLiqSum',
    request,
    metadata || {},
    this.methodInfoQueryChkLiqSum);
  }

  methodInfoQueryDebugAny = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryDebugAny',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.QueryDebugAnyRequest,
    sgn_cbridge_v1_query_pb.QueryDebugAnyResponse,
    (request: sgn_cbridge_v1_query_pb.QueryDebugAnyRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryDebugAnyResponse.deserializeBinary
  );

  queryDebugAny(
    request: sgn_cbridge_v1_query_pb.QueryDebugAnyRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryDebugAnyResponse>;

  queryDebugAny(
    request: sgn_cbridge_v1_query_pb.QueryDebugAnyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryDebugAnyResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryDebugAnyResponse>;

  queryDebugAny(
    request: sgn_cbridge_v1_query_pb.QueryDebugAnyRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryDebugAnyResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryDebugAny',
        request,
        metadata || {},
        this.methodInfoQueryDebugAny,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryDebugAny',
    request,
    metadata || {},
    this.methodInfoQueryDebugAny);
  }

  methodInfoQueryAssets = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryAssets',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.EmptyRequest,
    sgn_cbridge_v1_query_pb.QueryAssetsResponse,
    (request: sgn_cbridge_v1_query_pb.EmptyRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryAssetsResponse.deserializeBinary
  );

  queryAssets(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryAssetsResponse>;

  queryAssets(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryAssetsResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryAssetsResponse>;

  queryAssets(
    request: sgn_cbridge_v1_query_pb.EmptyRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryAssetsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryAssets',
        request,
        metadata || {},
        this.methodInfoQueryAssets,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryAssets',
    request,
    metadata || {},
    this.methodInfoQueryAssets);
  }

  methodInfoQueryAssetPrice = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryAssetPrice',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.QueryAssetPriceRequest,
    sgn_cbridge_v1_query_pb.QueryAssetPriceResponse,
    (request: sgn_cbridge_v1_query_pb.QueryAssetPriceRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryAssetPriceResponse.deserializeBinary
  );

  queryAssetPrice(
    request: sgn_cbridge_v1_query_pb.QueryAssetPriceRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryAssetPriceResponse>;

  queryAssetPrice(
    request: sgn_cbridge_v1_query_pb.QueryAssetPriceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryAssetPriceResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryAssetPriceResponse>;

  queryAssetPrice(
    request: sgn_cbridge_v1_query_pb.QueryAssetPriceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryAssetPriceResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryAssetPrice',
        request,
        metadata || {},
        this.methodInfoQueryAssetPrice,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryAssetPrice',
    request,
    metadata || {},
    this.methodInfoQueryAssetPrice);
  }

  methodInfoChainTokensConfig = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/ChainTokensConfig',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.ChainTokensConfigRequest,
    sgn_cbridge_v1_query_pb.ChainTokensConfigResponse,
    (request: sgn_cbridge_v1_query_pb.ChainTokensConfigRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.ChainTokensConfigResponse.deserializeBinary
  );

  chainTokensConfig(
    request: sgn_cbridge_v1_query_pb.ChainTokensConfigRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.ChainTokensConfigResponse>;

  chainTokensConfig(
    request: sgn_cbridge_v1_query_pb.ChainTokensConfigRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.ChainTokensConfigResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.ChainTokensConfigResponse>;

  chainTokensConfig(
    request: sgn_cbridge_v1_query_pb.ChainTokensConfigRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.ChainTokensConfigResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/ChainTokensConfig',
        request,
        metadata || {},
        this.methodInfoChainTokensConfig,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/ChainTokensConfig',
    request,
    metadata || {},
    this.methodInfoChainTokensConfig);
  }

  methodInfoGetFee = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/GetFee',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.GetFeeRequest,
    sgn_cbridge_v1_query_pb.GetFeeResponse,
    (request: sgn_cbridge_v1_query_pb.GetFeeRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.GetFeeResponse.deserializeBinary
  );

  getFee(
    request: sgn_cbridge_v1_query_pb.GetFeeRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.GetFeeResponse>;

  getFee(
    request: sgn_cbridge_v1_query_pb.GetFeeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.GetFeeResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.GetFeeResponse>;

  getFee(
    request: sgn_cbridge_v1_query_pb.GetFeeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.GetFeeResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/GetFee',
        request,
        metadata || {},
        this.methodInfoGetFee,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/GetFee',
    request,
    metadata || {},
    this.methodInfoGetFee);
  }

  methodInfoGetFeePercentage = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/GetFeePercentage',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.GetFeePercentageRequest,
    sgn_cbridge_v1_query_pb.GetFeePercentageResponse,
    (request: sgn_cbridge_v1_query_pb.GetFeePercentageRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.GetFeePercentageResponse.deserializeBinary
  );

  getFeePercentage(
    request: sgn_cbridge_v1_query_pb.GetFeePercentageRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.GetFeePercentageResponse>;

  getFeePercentage(
    request: sgn_cbridge_v1_query_pb.GetFeePercentageRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.GetFeePercentageResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.GetFeePercentageResponse>;

  getFeePercentage(
    request: sgn_cbridge_v1_query_pb.GetFeePercentageRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.GetFeePercentageResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/GetFeePercentage',
        request,
        metadata || {},
        this.methodInfoGetFeePercentage,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/GetFeePercentage',
    request,
    metadata || {},
    this.methodInfoGetFeePercentage);
  }

  methodInfoQueryTransferStatus = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryTransferStatus',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.QueryTransferStatusRequest,
    sgn_cbridge_v1_query_pb.QueryTransferStatusResponse,
    (request: sgn_cbridge_v1_query_pb.QueryTransferStatusRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryTransferStatusResponse.deserializeBinary
  );

  queryTransferStatus(
    request: sgn_cbridge_v1_query_pb.QueryTransferStatusRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryTransferStatusResponse>;

  queryTransferStatus(
    request: sgn_cbridge_v1_query_pb.QueryTransferStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryTransferStatusResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryTransferStatusResponse>;

  queryTransferStatus(
    request: sgn_cbridge_v1_query_pb.QueryTransferStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryTransferStatusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryTransferStatus',
        request,
        metadata || {},
        this.methodInfoQueryTransferStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryTransferStatus',
    request,
    metadata || {},
    this.methodInfoQueryTransferStatus);
  }

  methodInfoLiquidityDetailList = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/LiquidityDetailList',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.LiquidityDetailListRequest,
    sgn_cbridge_v1_query_pb.LiquidityDetailListResponse,
    (request: sgn_cbridge_v1_query_pb.LiquidityDetailListRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.LiquidityDetailListResponse.deserializeBinary
  );

  liquidityDetailList(
    request: sgn_cbridge_v1_query_pb.LiquidityDetailListRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.LiquidityDetailListResponse>;

  liquidityDetailList(
    request: sgn_cbridge_v1_query_pb.LiquidityDetailListRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.LiquidityDetailListResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.LiquidityDetailListResponse>;

  liquidityDetailList(
    request: sgn_cbridge_v1_query_pb.LiquidityDetailListRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.LiquidityDetailListResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/LiquidityDetailList',
        request,
        metadata || {},
        this.methodInfoLiquidityDetailList,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/LiquidityDetailList',
    request,
    metadata || {},
    this.methodInfoLiquidityDetailList);
  }

  methodInfoQueryTotalLiquidity = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryTotalLiquidity',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.QueryTotalLiquidityRequest,
    sgn_cbridge_v1_query_pb.QueryTotalLiquidityResponse,
    (request: sgn_cbridge_v1_query_pb.QueryTotalLiquidityRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryTotalLiquidityResponse.deserializeBinary
  );

  queryTotalLiquidity(
    request: sgn_cbridge_v1_query_pb.QueryTotalLiquidityRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryTotalLiquidityResponse>;

  queryTotalLiquidity(
    request: sgn_cbridge_v1_query_pb.QueryTotalLiquidityRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryTotalLiquidityResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryTotalLiquidityResponse>;

  queryTotalLiquidity(
    request: sgn_cbridge_v1_query_pb.QueryTotalLiquidityRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryTotalLiquidityResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryTotalLiquidity',
        request,
        metadata || {},
        this.methodInfoQueryTotalLiquidity,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryTotalLiquidity',
    request,
    metadata || {},
    this.methodInfoQueryTotalLiquidity);
  }

  methodInfoQueryAddLiquidityStatus = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryAddLiquidityStatus',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.QueryAddLiquidityStatusRequest,
    sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse,
    (request: sgn_cbridge_v1_query_pb.QueryAddLiquidityStatusRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse.deserializeBinary
  );

  queryAddLiquidityStatus(
    request: sgn_cbridge_v1_query_pb.QueryAddLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse>;

  queryAddLiquidityStatus(
    request: sgn_cbridge_v1_query_pb.QueryAddLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse>;

  queryAddLiquidityStatus(
    request: sgn_cbridge_v1_query_pb.QueryAddLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryAddLiquidityStatus',
        request,
        metadata || {},
        this.methodInfoQueryAddLiquidityStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryAddLiquidityStatus',
    request,
    metadata || {},
    this.methodInfoQueryAddLiquidityStatus);
  }

  methodInfoQueryWithdrawLiquidityStatus = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryWithdrawLiquidityStatus',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.QueryWithdrawLiquidityStatusRequest,
    sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse,
    (request: sgn_cbridge_v1_query_pb.QueryWithdrawLiquidityStatusRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse.deserializeBinary
  );

  queryWithdrawLiquidityStatus(
    request: sgn_cbridge_v1_query_pb.QueryWithdrawLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse>;

  queryWithdrawLiquidityStatus(
    request: sgn_cbridge_v1_query_pb.QueryWithdrawLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse>;

  queryWithdrawLiquidityStatus(
    request: sgn_cbridge_v1_query_pb.QueryWithdrawLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryLiquidityStatusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryWithdrawLiquidityStatus',
        request,
        metadata || {},
        this.methodInfoQueryWithdrawLiquidityStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryWithdrawLiquidityStatus',
    request,
    metadata || {},
    this.methodInfoQueryWithdrawLiquidityStatus);
  }

  methodInfoQueryLPs = new grpcWeb.MethodDescriptor(
    '/sgn.cbridge.v1.Query/QueryLPs',
    grpcWeb.MethodType.UNARY,
    sgn_cbridge_v1_query_pb.QueryLPsRequest,
    sgn_cbridge_v1_query_pb.QueryLPsResponse,
    (request: sgn_cbridge_v1_query_pb.QueryLPsRequest) => {
      return request.serializeBinary();
    },
    sgn_cbridge_v1_query_pb.QueryLPsResponse.deserializeBinary
  );

  queryLPs(
    request: sgn_cbridge_v1_query_pb.QueryLPsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_cbridge_v1_query_pb.QueryLPsResponse>;

  queryLPs(
    request: sgn_cbridge_v1_query_pb.QueryLPsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryLPsResponse) => void): grpcWeb.ClientReadableStream<sgn_cbridge_v1_query_pb.QueryLPsResponse>;

  queryLPs(
    request: sgn_cbridge_v1_query_pb.QueryLPsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_cbridge_v1_query_pb.QueryLPsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.cbridge.v1.Query/QueryLPs',
        request,
        metadata || {},
        this.methodInfoQueryLPs,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.cbridge.v1.Query/QueryLPs',
    request,
    metadata || {},
    this.methodInfoQueryLPs);
  }

}

