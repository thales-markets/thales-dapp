/**
 * @fileoverview gRPC-Web generated client stub for sgn.gateway.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as gateway_gateway_pb from '../gateway/gateway_pb';
import * as sgn_health_v1_health_pb from '../sgn/health/v1/health_pb';
import * as sgn_message_v1_query_pb from '../sgn/message/v1/query_pb';


export class WebClient {
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

  methodInfoGetTransferConfigs = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetTransferConfigs',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetTransferConfigsRequest,
    gateway_gateway_pb.GetTransferConfigsResponse,
    (request: gateway_gateway_pb.GetTransferConfigsRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetTransferConfigsResponse.deserializeBinary
  );

  getTransferConfigs(
    request: gateway_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetTransferConfigsResponse>;

  getTransferConfigs(
    request: gateway_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetTransferConfigsResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetTransferConfigsResponse>;

  getTransferConfigs(
    request: gateway_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetTransferConfigsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetTransferConfigs',
        request,
        metadata || {},
        this.methodInfoGetTransferConfigs,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetTransferConfigs',
    request,
    metadata || {},
    this.methodInfoGetTransferConfigs);
  }

  methodInfoGetTransferConfigsForAll = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetTransferConfigsForAll',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetTransferConfigsRequest,
    gateway_gateway_pb.GetTransferConfigsResponse,
    (request: gateway_gateway_pb.GetTransferConfigsRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetTransferConfigsResponse.deserializeBinary
  );

  getTransferConfigsForAll(
    request: gateway_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetTransferConfigsResponse>;

  getTransferConfigsForAll(
    request: gateway_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetTransferConfigsResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetTransferConfigsResponse>;

  getTransferConfigsForAll(
    request: gateway_gateway_pb.GetTransferConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetTransferConfigsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetTransferConfigsForAll',
        request,
        metadata || {},
        this.methodInfoGetTransferConfigsForAll,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetTransferConfigsForAll',
    request,
    metadata || {},
    this.methodInfoGetTransferConfigsForAll);
  }

  methodInfoGetTokenInfo = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetTokenInfo',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetTokenInfoRequest,
    gateway_gateway_pb.GetTokenInfoResponse,
    (request: gateway_gateway_pb.GetTokenInfoRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetTokenInfoResponse.deserializeBinary
  );

  getTokenInfo(
    request: gateway_gateway_pb.GetTokenInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetTokenInfoResponse>;

  getTokenInfo(
    request: gateway_gateway_pb.GetTokenInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetTokenInfoResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetTokenInfoResponse>;

  getTokenInfo(
    request: gateway_gateway_pb.GetTokenInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetTokenInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetTokenInfo',
        request,
        metadata || {},
        this.methodInfoGetTokenInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetTokenInfo',
    request,
    metadata || {},
    this.methodInfoGetTokenInfo);
  }

  methodInfoEstimateAmt = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/EstimateAmt',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.EstimateAmtRequest,
    gateway_gateway_pb.EstimateAmtResponse,
    (request: gateway_gateway_pb.EstimateAmtRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.EstimateAmtResponse.deserializeBinary
  );

  estimateAmt(
    request: gateway_gateway_pb.EstimateAmtRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.EstimateAmtResponse>;

  estimateAmt(
    request: gateway_gateway_pb.EstimateAmtRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.EstimateAmtResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.EstimateAmtResponse>;

  estimateAmt(
    request: gateway_gateway_pb.EstimateAmtRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.EstimateAmtResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/EstimateAmt',
        request,
        metadata || {},
        this.methodInfoEstimateAmt,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/EstimateAmt',
    request,
    metadata || {},
    this.methodInfoEstimateAmt);
  }

  methodInfoGetTransferStatus = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetTransferStatus',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetTransferStatusRequest,
    gateway_gateway_pb.GetTransferStatusResponse,
    (request: gateway_gateway_pb.GetTransferStatusRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetTransferStatusResponse.deserializeBinary
  );

  getTransferStatus(
    request: gateway_gateway_pb.GetTransferStatusRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetTransferStatusResponse>;

  getTransferStatus(
    request: gateway_gateway_pb.GetTransferStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetTransferStatusResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetTransferStatusResponse>;

  getTransferStatus(
    request: gateway_gateway_pb.GetTransferStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetTransferStatusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetTransferStatus',
        request,
        metadata || {},
        this.methodInfoGetTransferStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetTransferStatus',
    request,
    metadata || {},
    this.methodInfoGetTransferStatus);
  }

  methodInfoGetLPInfoList = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetLPInfoList',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetLPInfoListRequest,
    gateway_gateway_pb.GetLPInfoListResponse,
    (request: gateway_gateway_pb.GetLPInfoListRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetLPInfoListResponse.deserializeBinary
  );

  getLPInfoList(
    request: gateway_gateway_pb.GetLPInfoListRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetLPInfoListResponse>;

  getLPInfoList(
    request: gateway_gateway_pb.GetLPInfoListRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetLPInfoListResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetLPInfoListResponse>;

  getLPInfoList(
    request: gateway_gateway_pb.GetLPInfoListRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetLPInfoListResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetLPInfoList',
        request,
        metadata || {},
        this.methodInfoGetLPInfoList,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetLPInfoList',
    request,
    metadata || {},
    this.methodInfoGetLPInfoList);
  }

  methodInfoWithdrawLiquidity = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/WithdrawLiquidity',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.WithdrawLiquidityRequest,
    gateway_gateway_pb.WithdrawLiquidityResponse,
    (request: gateway_gateway_pb.WithdrawLiquidityRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.WithdrawLiquidityResponse.deserializeBinary
  );

  withdrawLiquidity(
    request: gateway_gateway_pb.WithdrawLiquidityRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.WithdrawLiquidityResponse>;

  withdrawLiquidity(
    request: gateway_gateway_pb.WithdrawLiquidityRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.WithdrawLiquidityResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.WithdrawLiquidityResponse>;

  withdrawLiquidity(
    request: gateway_gateway_pb.WithdrawLiquidityRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.WithdrawLiquidityResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/WithdrawLiquidity',
        request,
        metadata || {},
        this.methodInfoWithdrawLiquidity,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/WithdrawLiquidity',
    request,
    metadata || {},
    this.methodInfoWithdrawLiquidity);
  }

  methodInfoEstimateWithdrawAmt = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/EstimateWithdrawAmt',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.EstimateWithdrawAmtRequest,
    gateway_gateway_pb.EstimateWithdrawAmtResponse,
    (request: gateway_gateway_pb.EstimateWithdrawAmtRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.EstimateWithdrawAmtResponse.deserializeBinary
  );

  estimateWithdrawAmt(
    request: gateway_gateway_pb.EstimateWithdrawAmtRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.EstimateWithdrawAmtResponse>;

  estimateWithdrawAmt(
    request: gateway_gateway_pb.EstimateWithdrawAmtRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.EstimateWithdrawAmtResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.EstimateWithdrawAmtResponse>;

  estimateWithdrawAmt(
    request: gateway_gateway_pb.EstimateWithdrawAmtRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.EstimateWithdrawAmtResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/EstimateWithdrawAmt',
        request,
        metadata || {},
        this.methodInfoEstimateWithdrawAmt,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/EstimateWithdrawAmt',
    request,
    metadata || {},
    this.methodInfoEstimateWithdrawAmt);
  }

  methodInfoQueryLiquidityStatus = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/QueryLiquidityStatus',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.QueryLiquidityStatusRequest,
    gateway_gateway_pb.QueryLiquidityStatusResponse,
    (request: gateway_gateway_pb.QueryLiquidityStatusRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.QueryLiquidityStatusResponse.deserializeBinary
  );

  queryLiquidityStatus(
    request: gateway_gateway_pb.QueryLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.QueryLiquidityStatusResponse>;

  queryLiquidityStatus(
    request: gateway_gateway_pb.QueryLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.QueryLiquidityStatusResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.QueryLiquidityStatusResponse>;

  queryLiquidityStatus(
    request: gateway_gateway_pb.QueryLiquidityStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.QueryLiquidityStatusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/QueryLiquidityStatus',
        request,
        metadata || {},
        this.methodInfoQueryLiquidityStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/QueryLiquidityStatus',
    request,
    metadata || {},
    this.methodInfoQueryLiquidityStatus);
  }

  methodInfoUnlockFarmingReward = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/UnlockFarmingReward',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.UnlockFarmingRewardRequest,
    gateway_gateway_pb.UnlockFarmingRewardResponse,
    (request: gateway_gateway_pb.UnlockFarmingRewardRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.UnlockFarmingRewardResponse.deserializeBinary
  );

  unlockFarmingReward(
    request: gateway_gateway_pb.UnlockFarmingRewardRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.UnlockFarmingRewardResponse>;

  unlockFarmingReward(
    request: gateway_gateway_pb.UnlockFarmingRewardRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.UnlockFarmingRewardResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.UnlockFarmingRewardResponse>;

  unlockFarmingReward(
    request: gateway_gateway_pb.UnlockFarmingRewardRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.UnlockFarmingRewardResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/UnlockFarmingReward',
        request,
        metadata || {},
        this.methodInfoUnlockFarmingReward,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/UnlockFarmingReward',
    request,
    metadata || {},
    this.methodInfoUnlockFarmingReward);
  }

  methodInfoGetFarmingRewardDetails = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetFarmingRewardDetails',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetFarmingRewardDetailsRequest,
    gateway_gateway_pb.GetFarmingRewardDetailsResponse,
    (request: gateway_gateway_pb.GetFarmingRewardDetailsRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetFarmingRewardDetailsResponse.deserializeBinary
  );

  getFarmingRewardDetails(
    request: gateway_gateway_pb.GetFarmingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetFarmingRewardDetailsResponse>;

  getFarmingRewardDetails(
    request: gateway_gateway_pb.GetFarmingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetFarmingRewardDetailsResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetFarmingRewardDetailsResponse>;

  getFarmingRewardDetails(
    request: gateway_gateway_pb.GetFarmingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetFarmingRewardDetailsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetFarmingRewardDetails',
        request,
        metadata || {},
        this.methodInfoGetFarmingRewardDetails,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetFarmingRewardDetails',
    request,
    metadata || {},
    this.methodInfoGetFarmingRewardDetails);
  }

  methodInfoTransferHistory = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/TransferHistory',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.TransferHistoryRequest,
    gateway_gateway_pb.TransferHistoryResponse,
    (request: gateway_gateway_pb.TransferHistoryRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.TransferHistoryResponse.deserializeBinary
  );

  transferHistory(
    request: gateway_gateway_pb.TransferHistoryRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.TransferHistoryResponse>;

  transferHistory(
    request: gateway_gateway_pb.TransferHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.TransferHistoryResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.TransferHistoryResponse>;

  transferHistory(
    request: gateway_gateway_pb.TransferHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.TransferHistoryResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/TransferHistory',
        request,
        metadata || {},
        this.methodInfoTransferHistory,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/TransferHistory',
    request,
    metadata || {},
    this.methodInfoTransferHistory);
  }

  methodInfoLPHistory = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/LPHistory',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.LPHistoryRequest,
    gateway_gateway_pb.LPHistoryResponse,
    (request: gateway_gateway_pb.LPHistoryRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.LPHistoryResponse.deserializeBinary
  );

  lPHistory(
    request: gateway_gateway_pb.LPHistoryRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.LPHistoryResponse>;

  lPHistory(
    request: gateway_gateway_pb.LPHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.LPHistoryResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.LPHistoryResponse>;

  lPHistory(
    request: gateway_gateway_pb.LPHistoryRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.LPHistoryResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/LPHistory',
        request,
        metadata || {},
        this.methodInfoLPHistory,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/LPHistory',
    request,
    metadata || {},
    this.methodInfoLPHistory);
  }

  methodInfoRewardingData = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/RewardingData',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.RewardingDataRequest,
    gateway_gateway_pb.RewardingDataResponse,
    (request: gateway_gateway_pb.RewardingDataRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.RewardingDataResponse.deserializeBinary
  );

  rewardingData(
    request: gateway_gateway_pb.RewardingDataRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.RewardingDataResponse>;

  rewardingData(
    request: gateway_gateway_pb.RewardingDataRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.RewardingDataResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.RewardingDataResponse>;

  rewardingData(
    request: gateway_gateway_pb.RewardingDataRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.RewardingDataResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/RewardingData',
        request,
        metadata || {},
        this.methodInfoRewardingData,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/RewardingData',
    request,
    metadata || {},
    this.methodInfoRewardingData);
  }

  methodInfoStakingConfig = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/StakingConfig',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.StakingConfigRequest,
    gateway_gateway_pb.StakingConfigResponse,
    (request: gateway_gateway_pb.StakingConfigRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.StakingConfigResponse.deserializeBinary
  );

  stakingConfig(
    request: gateway_gateway_pb.StakingConfigRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.StakingConfigResponse>;

  stakingConfig(
    request: gateway_gateway_pb.StakingConfigRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.StakingConfigResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.StakingConfigResponse>;

  stakingConfig(
    request: gateway_gateway_pb.StakingConfigRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.StakingConfigResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/StakingConfig',
        request,
        metadata || {},
        this.methodInfoStakingConfig,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/StakingConfig',
    request,
    metadata || {},
    this.methodInfoStakingConfig);
  }

  methodInfoUnlockStakingReward = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/UnlockStakingReward',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.UnlockStakingRewardRequest,
    gateway_gateway_pb.UnlockStakingRewardResponse,
    (request: gateway_gateway_pb.UnlockStakingRewardRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.UnlockStakingRewardResponse.deserializeBinary
  );

  unlockStakingReward(
    request: gateway_gateway_pb.UnlockStakingRewardRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.UnlockStakingRewardResponse>;

  unlockStakingReward(
    request: gateway_gateway_pb.UnlockStakingRewardRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.UnlockStakingRewardResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.UnlockStakingRewardResponse>;

  unlockStakingReward(
    request: gateway_gateway_pb.UnlockStakingRewardRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.UnlockStakingRewardResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/UnlockStakingReward',
        request,
        metadata || {},
        this.methodInfoUnlockStakingReward,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/UnlockStakingReward',
    request,
    metadata || {},
    this.methodInfoUnlockStakingReward);
  }

  methodInfoGetStakingRewardDetails = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetStakingRewardDetails',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetStakingRewardDetailsRequest,
    gateway_gateway_pb.GetStakingRewardDetailsResponse,
    (request: gateway_gateway_pb.GetStakingRewardDetailsRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetStakingRewardDetailsResponse.deserializeBinary
  );

  getStakingRewardDetails(
    request: gateway_gateway_pb.GetStakingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetStakingRewardDetailsResponse>;

  getStakingRewardDetails(
    request: gateway_gateway_pb.GetStakingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetStakingRewardDetailsResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetStakingRewardDetailsResponse>;

  getStakingRewardDetails(
    request: gateway_gateway_pb.GetStakingRewardDetailsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetStakingRewardDetailsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetStakingRewardDetails',
        request,
        metadata || {},
        this.methodInfoGetStakingRewardDetails,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetStakingRewardDetails',
    request,
    metadata || {},
    this.methodInfoGetStakingRewardDetails);
  }

  methodInfoGetTotalLiquidityProviderTokenBalance = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetTotalLiquidityProviderTokenBalance',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest,
    gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse,
    (request: gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse.deserializeBinary
  );

  getTotalLiquidityProviderTokenBalance(
    request: gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse>;

  getTotalLiquidityProviderTokenBalance(
    request: gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse>;

  getTotalLiquidityProviderTokenBalance(
    request: gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetTotalLiquidityProviderTokenBalance',
        request,
        metadata || {},
        this.methodInfoGetTotalLiquidityProviderTokenBalance,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetTotalLiquidityProviderTokenBalance',
    request,
    metadata || {},
    this.methodInfoGetTotalLiquidityProviderTokenBalance);
  }

  methodInfoUpdateChain = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/UpdateChain',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.UpdateChainRequest,
    gateway_gateway_pb.UpdateChainResponse,
    (request: gateway_gateway_pb.UpdateChainRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.UpdateChainResponse.deserializeBinary
  );

  updateChain(
    request: gateway_gateway_pb.UpdateChainRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.UpdateChainResponse>;

  updateChain(
    request: gateway_gateway_pb.UpdateChainRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.UpdateChainResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.UpdateChainResponse>;

  updateChain(
    request: gateway_gateway_pb.UpdateChainRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.UpdateChainResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/UpdateChain',
        request,
        metadata || {},
        this.methodInfoUpdateChain,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/UpdateChain',
    request,
    metadata || {},
    this.methodInfoUpdateChain);
  }

  methodInfoUpdateToken = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/UpdateToken',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.UpdateTokenRequest,
    gateway_gateway_pb.UpdateTokenResponse,
    (request: gateway_gateway_pb.UpdateTokenRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.UpdateTokenResponse.deserializeBinary
  );

  updateToken(
    request: gateway_gateway_pb.UpdateTokenRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.UpdateTokenResponse>;

  updateToken(
    request: gateway_gateway_pb.UpdateTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.UpdateTokenResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.UpdateTokenResponse>;

  updateToken(
    request: gateway_gateway_pb.UpdateTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.UpdateTokenResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/UpdateToken',
        request,
        metadata || {},
        this.methodInfoUpdateToken,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/UpdateToken',
    request,
    metadata || {},
    this.methodInfoUpdateToken);
  }

  methodInfoGetCampaignScores = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetCampaignScores',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetCampaignScoresRequest,
    gateway_gateway_pb.GetCampaignScoresResponse,
    (request: gateway_gateway_pb.GetCampaignScoresRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetCampaignScoresResponse.deserializeBinary
  );

  getCampaignScores(
    request: gateway_gateway_pb.GetCampaignScoresRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetCampaignScoresResponse>;

  getCampaignScores(
    request: gateway_gateway_pb.GetCampaignScoresRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetCampaignScoresResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetCampaignScoresResponse>;

  getCampaignScores(
    request: gateway_gateway_pb.GetCampaignScoresRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetCampaignScoresResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetCampaignScores',
        request,
        metadata || {},
        this.methodInfoGetCampaignScores,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetCampaignScores',
    request,
    metadata || {},
    this.methodInfoGetCampaignScores);
  }

  methodInfoGetInfoByTxHash = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetInfoByTxHash',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetInfoByTxHashRequest,
    gateway_gateway_pb.GetInfoByTxHashResponse,
    (request: gateway_gateway_pb.GetInfoByTxHashRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetInfoByTxHashResponse.deserializeBinary
  );

  getInfoByTxHash(
    request: gateway_gateway_pb.GetInfoByTxHashRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetInfoByTxHashResponse>;

  getInfoByTxHash(
    request: gateway_gateway_pb.GetInfoByTxHashRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetInfoByTxHashResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetInfoByTxHashResponse>;

  getInfoByTxHash(
    request: gateway_gateway_pb.GetInfoByTxHashRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetInfoByTxHashResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetInfoByTxHash',
        request,
        metadata || {},
        this.methodInfoGetInfoByTxHash,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetInfoByTxHash',
    request,
    metadata || {},
    this.methodInfoGetInfoByTxHash);
  }

  methodInfoGetAbnormalStatusInfo = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetAbnormalStatusInfo',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetAbnormalStatusInfoRequest,
    gateway_gateway_pb.GetAbnormalStatusInfoResponse,
    (request: gateway_gateway_pb.GetAbnormalStatusInfoRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetAbnormalStatusInfoResponse.deserializeBinary
  );

  getAbnormalStatusInfo(
    request: gateway_gateway_pb.GetAbnormalStatusInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetAbnormalStatusInfoResponse>;

  getAbnormalStatusInfo(
    request: gateway_gateway_pb.GetAbnormalStatusInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetAbnormalStatusInfoResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetAbnormalStatusInfoResponse>;

  getAbnormalStatusInfo(
    request: gateway_gateway_pb.GetAbnormalStatusInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetAbnormalStatusInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetAbnormalStatusInfo',
        request,
        metadata || {},
        this.methodInfoGetAbnormalStatusInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetAbnormalStatusInfo',
    request,
    metadata || {},
    this.methodInfoGetAbnormalStatusInfo);
  }

  methodInfoGetAllLPInfo = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetAllLPInfo',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetAllLPInfoRequest,
    gateway_gateway_pb.GetAllLPInfoResponse,
    (request: gateway_gateway_pb.GetAllLPInfoRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetAllLPInfoResponse.deserializeBinary
  );

  getAllLPInfo(
    request: gateway_gateway_pb.GetAllLPInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetAllLPInfoResponse>;

  getAllLPInfo(
    request: gateway_gateway_pb.GetAllLPInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetAllLPInfoResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetAllLPInfoResponse>;

  getAllLPInfo(
    request: gateway_gateway_pb.GetAllLPInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetAllLPInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetAllLPInfo',
        request,
        metadata || {},
        this.methodInfoGetAllLPInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetAllLPInfo',
    request,
    metadata || {},
    this.methodInfoGetAllLPInfo);
  }

  methodInfoGetAllTXInfo = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetAllTXInfo',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetAllTXInfoRequest,
    gateway_gateway_pb.GetAllTXInfoResponse,
    (request: gateway_gateway_pb.GetAllTXInfoRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetAllTXInfoResponse.deserializeBinary
  );

  getAllTXInfo(
    request: gateway_gateway_pb.GetAllTXInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetAllTXInfoResponse>;

  getAllTXInfo(
    request: gateway_gateway_pb.GetAllTXInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetAllTXInfoResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetAllTXInfoResponse>;

  getAllTXInfo(
    request: gateway_gateway_pb.GetAllTXInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetAllTXInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetAllTXInfo',
        request,
        metadata || {},
        this.methodInfoGetAllTXInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetAllTXInfo',
    request,
    metadata || {},
    this.methodInfoGetAllTXInfo);
  }

  methodInfoFixEventMiss = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/FixEventMiss',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.FixEventMissRequest,
    gateway_gateway_pb.FixEventMissResponse,
    (request: gateway_gateway_pb.FixEventMissRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.FixEventMissResponse.deserializeBinary
  );

  fixEventMiss(
    request: gateway_gateway_pb.FixEventMissRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.FixEventMissResponse>;

  fixEventMiss(
    request: gateway_gateway_pb.FixEventMissRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.FixEventMissResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.FixEventMissResponse>;

  fixEventMiss(
    request: gateway_gateway_pb.FixEventMissRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.FixEventMissResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/FixEventMiss',
        request,
        metadata || {},
        this.methodInfoFixEventMiss,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/FixEventMiss',
    request,
    metadata || {},
    this.methodInfoFixEventMiss);
  }

  methodInfoGetUsrBalance = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetUsrBalance',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetUsrBalanceRequest,
    gateway_gateway_pb.GetUsrBalanceResponse,
    (request: gateway_gateway_pb.GetUsrBalanceRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetUsrBalanceResponse.deserializeBinary
  );

  getUsrBalance(
    request: gateway_gateway_pb.GetUsrBalanceRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetUsrBalanceResponse>;

  getUsrBalance(
    request: gateway_gateway_pb.GetUsrBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetUsrBalanceResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetUsrBalanceResponse>;

  getUsrBalance(
    request: gateway_gateway_pb.GetUsrBalanceRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetUsrBalanceResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetUsrBalance',
        request,
        metadata || {},
        this.methodInfoGetUsrBalance,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetUsrBalance',
    request,
    metadata || {},
    this.methodInfoGetUsrBalance);
  }

  methodInfoGetAllConfigs = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetAllConfigs',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetAllConfigsRequest,
    gateway_gateway_pb.GetAllConfigsResponse,
    (request: gateway_gateway_pb.GetAllConfigsRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetAllConfigsResponse.deserializeBinary
  );

  getAllConfigs(
    request: gateway_gateway_pb.GetAllConfigsRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetAllConfigsResponse>;

  getAllConfigs(
    request: gateway_gateway_pb.GetAllConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetAllConfigsResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetAllConfigsResponse>;

  getAllConfigs(
    request: gateway_gateway_pb.GetAllConfigsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetAllConfigsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetAllConfigs',
        request,
        metadata || {},
        this.methodInfoGetAllConfigs,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetAllConfigs',
    request,
    metadata || {},
    this.methodInfoGetAllConfigs);
  }

  methodInfoGetCbrConfigsOnChain = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetCbrConfigsOnChain',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetCbrConfigsOnChainRequest,
    gateway_gateway_pb.GetCbrConfigsOnChainResponse,
    (request: gateway_gateway_pb.GetCbrConfigsOnChainRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetCbrConfigsOnChainResponse.deserializeBinary
  );

  getCbrConfigsOnChain(
    request: gateway_gateway_pb.GetCbrConfigsOnChainRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetCbrConfigsOnChainResponse>;

  getCbrConfigsOnChain(
    request: gateway_gateway_pb.GetCbrConfigsOnChainRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetCbrConfigsOnChainResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetCbrConfigsOnChainResponse>;

  getCbrConfigsOnChain(
    request: gateway_gateway_pb.GetCbrConfigsOnChainRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetCbrConfigsOnChainResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetCbrConfigsOnChain',
        request,
        metadata || {},
        this.methodInfoGetCbrConfigsOnChain,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetCbrConfigsOnChain',
    request,
    metadata || {},
    this.methodInfoGetCbrConfigsOnChain);
  }

  methodInfoReportCurrentBlockNumber = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/ReportCurrentBlockNumber',
    grpcWeb.MethodType.UNARY,
    sgn_health_v1_health_pb.ReportSgnAnalyticsRequest,
    sgn_health_v1_health_pb.ReportSgnAnalyticsResponse,
    (request: sgn_health_v1_health_pb.ReportSgnAnalyticsRequest) => {
      return request.serializeBinary();
    },
    sgn_health_v1_health_pb.ReportSgnAnalyticsResponse.deserializeBinary
  );

  reportCurrentBlockNumber(
    request: sgn_health_v1_health_pb.ReportSgnAnalyticsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_health_v1_health_pb.ReportSgnAnalyticsResponse>;

  reportCurrentBlockNumber(
    request: sgn_health_v1_health_pb.ReportSgnAnalyticsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_health_v1_health_pb.ReportSgnAnalyticsResponse) => void): grpcWeb.ClientReadableStream<sgn_health_v1_health_pb.ReportSgnAnalyticsResponse>;

  reportCurrentBlockNumber(
    request: sgn_health_v1_health_pb.ReportSgnAnalyticsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_health_v1_health_pb.ReportSgnAnalyticsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/ReportCurrentBlockNumber',
        request,
        metadata || {},
        this.methodInfoReportCurrentBlockNumber,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/ReportCurrentBlockNumber',
    request,
    metadata || {},
    this.methodInfoReportCurrentBlockNumber);
  }

  methodInfoGetCurrentBlockNumberByNode = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetCurrentBlockNumberByNode',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetCurrentBlockNumberByNodeRequest,
    gateway_gateway_pb.GetCurrentBlockNumberByNodeResponse,
    (request: gateway_gateway_pb.GetCurrentBlockNumberByNodeRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetCurrentBlockNumberByNodeResponse.deserializeBinary
  );

  getCurrentBlockNumberByNode(
    request: gateway_gateway_pb.GetCurrentBlockNumberByNodeRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetCurrentBlockNumberByNodeResponse>;

  getCurrentBlockNumberByNode(
    request: gateway_gateway_pb.GetCurrentBlockNumberByNodeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetCurrentBlockNumberByNodeResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetCurrentBlockNumberByNodeResponse>;

  getCurrentBlockNumberByNode(
    request: gateway_gateway_pb.GetCurrentBlockNumberByNodeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetCurrentBlockNumberByNodeResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetCurrentBlockNumberByNode',
        request,
        metadata || {},
        this.methodInfoGetCurrentBlockNumberByNode,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetCurrentBlockNumberByNode',
    request,
    metadata || {},
    this.methodInfoGetCurrentBlockNumberByNode);
  }

  methodInfoGetRetentionRewardsInfo = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetRetentionRewardsInfo',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetRetentionRewardsInfoRequest,
    gateway_gateway_pb.GetRetentionRewardsInfoResponse,
    (request: gateway_gateway_pb.GetRetentionRewardsInfoRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetRetentionRewardsInfoResponse.deserializeBinary
  );

  getRetentionRewardsInfo(
    request: gateway_gateway_pb.GetRetentionRewardsInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetRetentionRewardsInfoResponse>;

  getRetentionRewardsInfo(
    request: gateway_gateway_pb.GetRetentionRewardsInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetRetentionRewardsInfoResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetRetentionRewardsInfoResponse>;

  getRetentionRewardsInfo(
    request: gateway_gateway_pb.GetRetentionRewardsInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetRetentionRewardsInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetRetentionRewardsInfo',
        request,
        metadata || {},
        this.methodInfoGetRetentionRewardsInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetRetentionRewardsInfo',
    request,
    metadata || {},
    this.methodInfoGetRetentionRewardsInfo);
  }

  methodInfoGetIncentiveCampaignCelrRank = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetIncentiveCampaignCelrRank',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetIncentiveCampaignCelrRankRequest,
    gateway_gateway_pb.GetIncentiveCampaignCelrRankResponse,
    (request: gateway_gateway_pb.GetIncentiveCampaignCelrRankRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetIncentiveCampaignCelrRankResponse.deserializeBinary
  );

  getIncentiveCampaignCelrRank(
    request: gateway_gateway_pb.GetIncentiveCampaignCelrRankRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetIncentiveCampaignCelrRankResponse>;

  getIncentiveCampaignCelrRank(
    request: gateway_gateway_pb.GetIncentiveCampaignCelrRankRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetIncentiveCampaignCelrRankResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetIncentiveCampaignCelrRankResponse>;

  getIncentiveCampaignCelrRank(
    request: gateway_gateway_pb.GetIncentiveCampaignCelrRankRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetIncentiveCampaignCelrRankResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetIncentiveCampaignCelrRank',
        request,
        metadata || {},
        this.methodInfoGetIncentiveCampaignCelrRank,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetIncentiveCampaignCelrRank',
    request,
    metadata || {},
    this.methodInfoGetIncentiveCampaignCelrRank);
  }

  methodInfoInIncentiveCampaignBnbWhiteList = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/InIncentiveCampaignBnbWhiteList',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.InIncentiveCampaignBnbWhiteListRequest,
    gateway_gateway_pb.InIncentiveCampaignBnbWhiteListResponse,
    (request: gateway_gateway_pb.InIncentiveCampaignBnbWhiteListRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.InIncentiveCampaignBnbWhiteListResponse.deserializeBinary
  );

  inIncentiveCampaignBnbWhiteList(
    request: gateway_gateway_pb.InIncentiveCampaignBnbWhiteListRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.InIncentiveCampaignBnbWhiteListResponse>;

  inIncentiveCampaignBnbWhiteList(
    request: gateway_gateway_pb.InIncentiveCampaignBnbWhiteListRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.InIncentiveCampaignBnbWhiteListResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.InIncentiveCampaignBnbWhiteListResponse>;

  inIncentiveCampaignBnbWhiteList(
    request: gateway_gateway_pb.InIncentiveCampaignBnbWhiteListRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.InIncentiveCampaignBnbWhiteListResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/InIncentiveCampaignBnbWhiteList',
        request,
        metadata || {},
        this.methodInfoInIncentiveCampaignBnbWhiteList,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/InIncentiveCampaignBnbWhiteList',
    request,
    metadata || {},
    this.methodInfoInIncentiveCampaignBnbWhiteList);
  }

  methodInfoGetIncentiveCampaignBnbRank = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetIncentiveCampaignBnbRank',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetIncentiveCampaignBnbRankRequest,
    gateway_gateway_pb.GetIncentiveCampaignBnbRankResponse,
    (request: gateway_gateway_pb.GetIncentiveCampaignBnbRankRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetIncentiveCampaignBnbRankResponse.deserializeBinary
  );

  getIncentiveCampaignBnbRank(
    request: gateway_gateway_pb.GetIncentiveCampaignBnbRankRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetIncentiveCampaignBnbRankResponse>;

  getIncentiveCampaignBnbRank(
    request: gateway_gateway_pb.GetIncentiveCampaignBnbRankRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetIncentiveCampaignBnbRankResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetIncentiveCampaignBnbRankResponse>;

  getIncentiveCampaignBnbRank(
    request: gateway_gateway_pb.GetIncentiveCampaignBnbRankRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetIncentiveCampaignBnbRankResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetIncentiveCampaignBnbRank',
        request,
        metadata || {},
        this.methodInfoGetIncentiveCampaignBnbRank,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetIncentiveCampaignBnbRank',
    request,
    metadata || {},
    this.methodInfoGetIncentiveCampaignBnbRank);
  }

  methodInfoClaimRetentionRewards = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/ClaimRetentionRewards',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.ClaimRetentionRewardsRequest,
    gateway_gateway_pb.ClaimRetentionRewardsResponse,
    (request: gateway_gateway_pb.ClaimRetentionRewardsRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.ClaimRetentionRewardsResponse.deserializeBinary
  );

  claimRetentionRewards(
    request: gateway_gateway_pb.ClaimRetentionRewardsRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.ClaimRetentionRewardsResponse>;

  claimRetentionRewards(
    request: gateway_gateway_pb.ClaimRetentionRewardsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.ClaimRetentionRewardsResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.ClaimRetentionRewardsResponse>;

  claimRetentionRewards(
    request: gateway_gateway_pb.ClaimRetentionRewardsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.ClaimRetentionRewardsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/ClaimRetentionRewards',
        request,
        metadata || {},
        this.methodInfoClaimRetentionRewards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/ClaimRetentionRewards',
    request,
    metadata || {},
    this.methodInfoClaimRetentionRewards);
  }

  methodInfoGetBscCampaignInfo = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetBscCampaignInfo',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetBscCampaignInfoRequest,
    gateway_gateway_pb.GetBscCampaignInfoResponse,
    (request: gateway_gateway_pb.GetBscCampaignInfoRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetBscCampaignInfoResponse.deserializeBinary
  );

  getBscCampaignInfo(
    request: gateway_gateway_pb.GetBscCampaignInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetBscCampaignInfoResponse>;

  getBscCampaignInfo(
    request: gateway_gateway_pb.GetBscCampaignInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetBscCampaignInfoResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetBscCampaignInfoResponse>;

  getBscCampaignInfo(
    request: gateway_gateway_pb.GetBscCampaignInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetBscCampaignInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetBscCampaignInfo',
        request,
        metadata || {},
        this.methodInfoGetBscCampaignInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetBscCampaignInfo',
    request,
    metadata || {},
    this.methodInfoGetBscCampaignInfo);
  }

  methodInfoClaimGetBscCampaignReward = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/ClaimGetBscCampaignReward',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.ClaimGetBscCampaignRewardRequest,
    gateway_gateway_pb.ClaimGetBscCampaignRewardResponse,
    (request: gateway_gateway_pb.ClaimGetBscCampaignRewardRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.ClaimGetBscCampaignRewardResponse.deserializeBinary
  );

  claimGetBscCampaignReward(
    request: gateway_gateway_pb.ClaimGetBscCampaignRewardRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.ClaimGetBscCampaignRewardResponse>;

  claimGetBscCampaignReward(
    request: gateway_gateway_pb.ClaimGetBscCampaignRewardRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.ClaimGetBscCampaignRewardResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.ClaimGetBscCampaignRewardResponse>;

  claimGetBscCampaignReward(
    request: gateway_gateway_pb.ClaimGetBscCampaignRewardRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.ClaimGetBscCampaignRewardResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/ClaimGetBscCampaignReward',
        request,
        metadata || {},
        this.methodInfoClaimGetBscCampaignReward,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/ClaimGetBscCampaignReward',
    request,
    metadata || {},
    this.methodInfoClaimGetBscCampaignReward);
  }

  methodInfoGetFeeRebateInfo = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/GetFeeRebateInfo',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.GetFeeRebateInfoRequest,
    gateway_gateway_pb.GetFeeRebateInfoResponse,
    (request: gateway_gateway_pb.GetFeeRebateInfoRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.GetFeeRebateInfoResponse.deserializeBinary
  );

  getFeeRebateInfo(
    request: gateway_gateway_pb.GetFeeRebateInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.GetFeeRebateInfoResponse>;

  getFeeRebateInfo(
    request: gateway_gateway_pb.GetFeeRebateInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetFeeRebateInfoResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.GetFeeRebateInfoResponse>;

  getFeeRebateInfo(
    request: gateway_gateway_pb.GetFeeRebateInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.GetFeeRebateInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/GetFeeRebateInfo',
        request,
        metadata || {},
        this.methodInfoGetFeeRebateInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/GetFeeRebateInfo',
    request,
    metadata || {},
    this.methodInfoGetFeeRebateInfo);
  }

  methodInfoClaimFeeRebate = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/ClaimFeeRebate',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.ClaimFeeRebateRequest,
    gateway_gateway_pb.ClaimFeeRebateResponse,
    (request: gateway_gateway_pb.ClaimFeeRebateRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.ClaimFeeRebateResponse.deserializeBinary
  );

  claimFeeRebate(
    request: gateway_gateway_pb.ClaimFeeRebateRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.ClaimFeeRebateResponse>;

  claimFeeRebate(
    request: gateway_gateway_pb.ClaimFeeRebateRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.ClaimFeeRebateResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.ClaimFeeRebateResponse>;

  claimFeeRebate(
    request: gateway_gateway_pb.ClaimFeeRebateRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.ClaimFeeRebateResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/ClaimFeeRebate',
        request,
        metadata || {},
        this.methodInfoClaimFeeRebate,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/ClaimFeeRebate',
    request,
    metadata || {},
    this.methodInfoClaimFeeRebate);
  }

  methodInfoClaimPegBridgeFee = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/ClaimPegBridgeFee',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.ClaimPegBridgeFeeRequest,
    gateway_gateway_pb.ClaimPegBridgeFeeResponse,
    (request: gateway_gateway_pb.ClaimPegBridgeFeeRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.ClaimPegBridgeFeeResponse.deserializeBinary
  );

  claimPegBridgeFee(
    request: gateway_gateway_pb.ClaimPegBridgeFeeRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.ClaimPegBridgeFeeResponse>;

  claimPegBridgeFee(
    request: gateway_gateway_pb.ClaimPegBridgeFeeRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.ClaimPegBridgeFeeResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.ClaimPegBridgeFeeResponse>;

  claimPegBridgeFee(
    request: gateway_gateway_pb.ClaimPegBridgeFeeRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.ClaimPegBridgeFeeResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/ClaimPegBridgeFee',
        request,
        metadata || {},
        this.methodInfoClaimPegBridgeFee,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/ClaimPegBridgeFee',
    request,
    metadata || {},
    this.methodInfoClaimPegBridgeFee);
  }

  methodInfoInitWithdraw = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/InitWithdraw',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.InitWithdrawRequest,
    gateway_gateway_pb.InitWithdrawResponse,
    (request: gateway_gateway_pb.InitWithdrawRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.InitWithdrawResponse.deserializeBinary
  );

  initWithdraw(
    request: gateway_gateway_pb.InitWithdrawRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.InitWithdrawResponse>;

  initWithdraw(
    request: gateway_gateway_pb.InitWithdrawRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.InitWithdrawResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.InitWithdrawResponse>;

  initWithdraw(
    request: gateway_gateway_pb.InitWithdrawRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.InitWithdrawResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/InitWithdraw',
        request,
        metadata || {},
        this.methodInfoInitWithdraw,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/InitWithdraw',
    request,
    metadata || {},
    this.methodInfoInitWithdraw);
  }

  methodInfoInitPegRefund = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/InitPegRefund',
    grpcWeb.MethodType.UNARY,
    gateway_gateway_pb.InitPegRefundRequest,
    gateway_gateway_pb.InitPegRefundResponse,
    (request: gateway_gateway_pb.InitPegRefundRequest) => {
      return request.serializeBinary();
    },
    gateway_gateway_pb.InitPegRefundResponse.deserializeBinary
  );

  initPegRefund(
    request: gateway_gateway_pb.InitPegRefundRequest,
    metadata: grpcWeb.Metadata | null): Promise<gateway_gateway_pb.InitPegRefundResponse>;

  initPegRefund(
    request: gateway_gateway_pb.InitPegRefundRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.InitPegRefundResponse) => void): grpcWeb.ClientReadableStream<gateway_gateway_pb.InitPegRefundResponse>;

  initPegRefund(
    request: gateway_gateway_pb.InitPegRefundRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: gateway_gateway_pb.InitPegRefundResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.gateway.v1.Web/InitPegRefund',
        request,
        metadata || {},
        this.methodInfoInitPegRefund,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/InitPegRefund',
    request,
    metadata || {},
    this.methodInfoInitPegRefund);
  }

  methodInfoExecutionContexts = new grpcWeb.MethodDescriptor(
    '/sgn.gateway.v1.Web/ExecutionContexts',
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
          '/sgn.gateway.v1.Web/ExecutionContexts',
        request,
        metadata || {},
        this.methodInfoExecutionContexts,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.gateway.v1.Web/ExecutionContexts',
    request,
    metadata || {},
    this.methodInfoExecutionContexts);
  }

}

