/**
 * @fileoverview gRPC-Web generated client stub for sgn.distribution.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_distribution_v1_query_pb from '../../../sgn/distribution/v1/query_pb';


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
    '/sgn.distribution.v1.Query/Params',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryParamsRequest,
    sgn_distribution_v1_query_pb.QueryParamsResponse,
    (request: sgn_distribution_v1_query_pb.QueryParamsRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryParamsResponse.deserializeBinary
  );

  params(
    request: sgn_distribution_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_distribution_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryParamsResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_distribution_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryParamsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/Params',
        request,
        metadata || {},
        this.methodInfoParams,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/Params',
    request,
    metadata || {},
    this.methodInfoParams);
  }

  methodInfoValidatorOutstandingRewards = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/ValidatorOutstandingRewards',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsRequest,
    sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsResponse,
    (request: sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsResponse.deserializeBinary
  );

  validatorOutstandingRewards(
    request: sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsResponse>;

  validatorOutstandingRewards(
    request: sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsResponse>;

  validatorOutstandingRewards(
    request: sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryValidatorOutstandingRewardsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/ValidatorOutstandingRewards',
        request,
        metadata || {},
        this.methodInfoValidatorOutstandingRewards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/ValidatorOutstandingRewards',
    request,
    metadata || {},
    this.methodInfoValidatorOutstandingRewards);
  }

  methodInfoValidatorCommission = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/ValidatorCommission',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryValidatorCommissionRequest,
    sgn_distribution_v1_query_pb.QueryValidatorCommissionResponse,
    (request: sgn_distribution_v1_query_pb.QueryValidatorCommissionRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryValidatorCommissionResponse.deserializeBinary
  );

  validatorCommission(
    request: sgn_distribution_v1_query_pb.QueryValidatorCommissionRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryValidatorCommissionResponse>;

  validatorCommission(
    request: sgn_distribution_v1_query_pb.QueryValidatorCommissionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryValidatorCommissionResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryValidatorCommissionResponse>;

  validatorCommission(
    request: sgn_distribution_v1_query_pb.QueryValidatorCommissionRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryValidatorCommissionResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/ValidatorCommission',
        request,
        metadata || {},
        this.methodInfoValidatorCommission,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/ValidatorCommission',
    request,
    metadata || {},
    this.methodInfoValidatorCommission);
  }

  methodInfoDelegationRewards = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/DelegationRewards',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryDelegationRewardsRequest,
    sgn_distribution_v1_query_pb.QueryDelegationRewardsResponse,
    (request: sgn_distribution_v1_query_pb.QueryDelegationRewardsRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryDelegationRewardsResponse.deserializeBinary
  );

  delegationRewards(
    request: sgn_distribution_v1_query_pb.QueryDelegationRewardsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryDelegationRewardsResponse>;

  delegationRewards(
    request: sgn_distribution_v1_query_pb.QueryDelegationRewardsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryDelegationRewardsResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryDelegationRewardsResponse>;

  delegationRewards(
    request: sgn_distribution_v1_query_pb.QueryDelegationRewardsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryDelegationRewardsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/DelegationRewards',
        request,
        metadata || {},
        this.methodInfoDelegationRewards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/DelegationRewards',
    request,
    metadata || {},
    this.methodInfoDelegationRewards);
  }

  methodInfoDelegationTotalRewards = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/DelegationTotalRewards',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsRequest,
    sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsResponse,
    (request: sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsResponse.deserializeBinary
  );

  delegationTotalRewards(
    request: sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsResponse>;

  delegationTotalRewards(
    request: sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsResponse>;

  delegationTotalRewards(
    request: sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryDelegationTotalRewardsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/DelegationTotalRewards',
        request,
        metadata || {},
        this.methodInfoDelegationTotalRewards,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/DelegationTotalRewards',
    request,
    metadata || {},
    this.methodInfoDelegationTotalRewards);
  }

  methodInfoDelegatorValidators = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/DelegatorValidators',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryDelegatorValidatorsRequest,
    sgn_distribution_v1_query_pb.QueryDelegatorValidatorsResponse,
    (request: sgn_distribution_v1_query_pb.QueryDelegatorValidatorsRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryDelegatorValidatorsResponse.deserializeBinary
  );

  delegatorValidators(
    request: sgn_distribution_v1_query_pb.QueryDelegatorValidatorsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryDelegatorValidatorsResponse>;

  delegatorValidators(
    request: sgn_distribution_v1_query_pb.QueryDelegatorValidatorsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryDelegatorValidatorsResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryDelegatorValidatorsResponse>;

  delegatorValidators(
    request: sgn_distribution_v1_query_pb.QueryDelegatorValidatorsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryDelegatorValidatorsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/DelegatorValidators',
        request,
        metadata || {},
        this.methodInfoDelegatorValidators,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/DelegatorValidators',
    request,
    metadata || {},
    this.methodInfoDelegatorValidators);
  }

  methodInfoDelegatorWithdrawAddress = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/DelegatorWithdrawAddress',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressRequest,
    sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressResponse,
    (request: sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressResponse.deserializeBinary
  );

  delegatorWithdrawAddress(
    request: sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressResponse>;

  delegatorWithdrawAddress(
    request: sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressResponse>;

  delegatorWithdrawAddress(
    request: sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryDelegatorWithdrawAddressResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/DelegatorWithdrawAddress',
        request,
        metadata || {},
        this.methodInfoDelegatorWithdrawAddress,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/DelegatorWithdrawAddress',
    request,
    metadata || {},
    this.methodInfoDelegatorWithdrawAddress);
  }

  methodInfoCommunityPool = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/CommunityPool',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryCommunityPoolRequest,
    sgn_distribution_v1_query_pb.QueryCommunityPoolResponse,
    (request: sgn_distribution_v1_query_pb.QueryCommunityPoolRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryCommunityPoolResponse.deserializeBinary
  );

  communityPool(
    request: sgn_distribution_v1_query_pb.QueryCommunityPoolRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryCommunityPoolResponse>;

  communityPool(
    request: sgn_distribution_v1_query_pb.QueryCommunityPoolRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryCommunityPoolResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryCommunityPoolResponse>;

  communityPool(
    request: sgn_distribution_v1_query_pb.QueryCommunityPoolRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryCommunityPoolResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/CommunityPool',
        request,
        metadata || {},
        this.methodInfoCommunityPool,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/CommunityPool',
    request,
    metadata || {},
    this.methodInfoCommunityPool);
  }

  methodInfoStakingRewardInfo = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/StakingRewardInfo',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryStakingRewardInfoRequest,
    sgn_distribution_v1_query_pb.QueryStakingRewardInfoResponse,
    (request: sgn_distribution_v1_query_pb.QueryStakingRewardInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryStakingRewardInfoResponse.deserializeBinary
  );

  stakingRewardInfo(
    request: sgn_distribution_v1_query_pb.QueryStakingRewardInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryStakingRewardInfoResponse>;

  stakingRewardInfo(
    request: sgn_distribution_v1_query_pb.QueryStakingRewardInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryStakingRewardInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryStakingRewardInfoResponse>;

  stakingRewardInfo(
    request: sgn_distribution_v1_query_pb.QueryStakingRewardInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryStakingRewardInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/StakingRewardInfo',
        request,
        metadata || {},
        this.methodInfoStakingRewardInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/StakingRewardInfo',
    request,
    metadata || {},
    this.methodInfoStakingRewardInfo);
  }

  methodInfoStakingRewardClaimInfo = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/StakingRewardClaimInfo',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoRequest,
    sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoResponse,
    (request: sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoResponse.deserializeBinary
  );

  stakingRewardClaimInfo(
    request: sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoResponse>;

  stakingRewardClaimInfo(
    request: sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoResponse>;

  stakingRewardClaimInfo(
    request: sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryStakingRewardClaimInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/StakingRewardClaimInfo',
        request,
        metadata || {},
        this.methodInfoStakingRewardClaimInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/StakingRewardClaimInfo',
    request,
    metadata || {},
    this.methodInfoStakingRewardClaimInfo);
  }

  methodInfoCBridgeFeeShareInfo = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/CBridgeFeeShareInfo',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoRequest,
    sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoResponse,
    (request: sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoResponse.deserializeBinary
  );

  cBridgeFeeShareInfo(
    request: sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoResponse>;

  cBridgeFeeShareInfo(
    request: sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoResponse>;

  cBridgeFeeShareInfo(
    request: sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryCBridgeFeeShareInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/CBridgeFeeShareInfo',
        request,
        metadata || {},
        this.methodInfoCBridgeFeeShareInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/CBridgeFeeShareInfo',
    request,
    metadata || {},
    this.methodInfoCBridgeFeeShareInfo);
  }

  methodInfoPegBridgeFeesInfo = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/PegBridgeFeesInfo',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoRequest,
    sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoResponse,
    (request: sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoResponse.deserializeBinary
  );

  pegBridgeFeesInfo(
    request: sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoResponse>;

  pegBridgeFeesInfo(
    request: sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoResponse>;

  pegBridgeFeesInfo(
    request: sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryPegBridgeFeesInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/PegBridgeFeesInfo',
        request,
        metadata || {},
        this.methodInfoPegBridgeFeesInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/PegBridgeFeesInfo',
    request,
    metadata || {},
    this.methodInfoPegBridgeFeesInfo);
  }

  methodInfoMessageFeesInfo = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Query/MessageFeesInfo',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_query_pb.QueryMessageFeesInfoRequest,
    sgn_distribution_v1_query_pb.QueryMessageFeesInfoResponse,
    (request: sgn_distribution_v1_query_pb.QueryMessageFeesInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_query_pb.QueryMessageFeesInfoResponse.deserializeBinary
  );

  messageFeesInfo(
    request: sgn_distribution_v1_query_pb.QueryMessageFeesInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_query_pb.QueryMessageFeesInfoResponse>;

  messageFeesInfo(
    request: sgn_distribution_v1_query_pb.QueryMessageFeesInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryMessageFeesInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_query_pb.QueryMessageFeesInfoResponse>;

  messageFeesInfo(
    request: sgn_distribution_v1_query_pb.QueryMessageFeesInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_query_pb.QueryMessageFeesInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Query/MessageFeesInfo',
        request,
        metadata || {},
        this.methodInfoMessageFeesInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Query/MessageFeesInfo',
    request,
    metadata || {},
    this.methodInfoMessageFeesInfo);
  }

}

