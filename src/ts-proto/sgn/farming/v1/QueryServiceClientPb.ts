/**
 * @fileoverview gRPC-Web generated client stub for sgn.farming.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_farming_v1_query_pb from '../../../sgn/farming/v1/query_pb';


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
    '/sgn.farming.v1.Query/Params',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryParamsRequest,
    sgn_farming_v1_query_pb.QueryParamsResponse,
    (request: sgn_farming_v1_query_pb.QueryParamsRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryParamsResponse.deserializeBinary
  );

  params(
    request: sgn_farming_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_farming_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryParamsResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_farming_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryParamsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/Params',
        request,
        metadata || {},
        this.methodInfoParams,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/Params',
    request,
    metadata || {},
    this.methodInfoParams);
  }

  methodInfoPools = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/Pools',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryPoolsRequest,
    sgn_farming_v1_query_pb.QueryPoolsResponse,
    (request: sgn_farming_v1_query_pb.QueryPoolsRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryPoolsResponse.deserializeBinary
  );

  pools(
    request: sgn_farming_v1_query_pb.QueryPoolsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryPoolsResponse>;

  pools(
    request: sgn_farming_v1_query_pb.QueryPoolsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryPoolsResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryPoolsResponse>;

  pools(
    request: sgn_farming_v1_query_pb.QueryPoolsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryPoolsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/Pools',
        request,
        metadata || {},
        this.methodInfoPools,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/Pools',
    request,
    metadata || {},
    this.methodInfoPools);
  }

  methodInfoPool = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/Pool',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryPoolRequest,
    sgn_farming_v1_query_pb.QueryPoolResponse,
    (request: sgn_farming_v1_query_pb.QueryPoolRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryPoolResponse.deserializeBinary
  );

  pool(
    request: sgn_farming_v1_query_pb.QueryPoolRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryPoolResponse>;

  pool(
    request: sgn_farming_v1_query_pb.QueryPoolRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryPoolResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryPoolResponse>;

  pool(
    request: sgn_farming_v1_query_pb.QueryPoolRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryPoolResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/Pool',
        request,
        metadata || {},
        this.methodInfoPool,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/Pool',
    request,
    metadata || {},
    this.methodInfoPool);
  }

  methodInfoTokens = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/Tokens',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryTokensRequest,
    sgn_farming_v1_query_pb.QueryTokensResponse,
    (request: sgn_farming_v1_query_pb.QueryTokensRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryTokensResponse.deserializeBinary
  );

  tokens(
    request: sgn_farming_v1_query_pb.QueryTokensRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryTokensResponse>;

  tokens(
    request: sgn_farming_v1_query_pb.QueryTokensRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryTokensResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryTokensResponse>;

  tokens(
    request: sgn_farming_v1_query_pb.QueryTokensRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryTokensResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/Tokens',
        request,
        metadata || {},
        this.methodInfoTokens,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/Tokens',
    request,
    metadata || {},
    this.methodInfoTokens);
  }

  methodInfoToken = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/Token',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryTokenRequest,
    sgn_farming_v1_query_pb.QueryTokenResponse,
    (request: sgn_farming_v1_query_pb.QueryTokenRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryTokenResponse.deserializeBinary
  );

  token(
    request: sgn_farming_v1_query_pb.QueryTokenRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryTokenResponse>;

  token(
    request: sgn_farming_v1_query_pb.QueryTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryTokenResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryTokenResponse>;

  token(
    request: sgn_farming_v1_query_pb.QueryTokenRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryTokenResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/Token',
        request,
        metadata || {},
        this.methodInfoToken,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/Token',
    request,
    metadata || {},
    this.methodInfoToken);
  }

  methodInfoRewardContracts = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/RewardContracts',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryRewardContractsRequest,
    sgn_farming_v1_query_pb.QueryRewardContractsResponse,
    (request: sgn_farming_v1_query_pb.QueryRewardContractsRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryRewardContractsResponse.deserializeBinary
  );

  rewardContracts(
    request: sgn_farming_v1_query_pb.QueryRewardContractsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryRewardContractsResponse>;

  rewardContracts(
    request: sgn_farming_v1_query_pb.QueryRewardContractsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryRewardContractsResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryRewardContractsResponse>;

  rewardContracts(
    request: sgn_farming_v1_query_pb.QueryRewardContractsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryRewardContractsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/RewardContracts',
        request,
        metadata || {},
        this.methodInfoRewardContracts,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/RewardContracts',
    request,
    metadata || {},
    this.methodInfoRewardContracts);
  }

  methodInfoRewardContract = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/RewardContract',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryRewardContractRequest,
    sgn_farming_v1_query_pb.QueryRewardContractResponse,
    (request: sgn_farming_v1_query_pb.QueryRewardContractRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryRewardContractResponse.deserializeBinary
  );

  rewardContract(
    request: sgn_farming_v1_query_pb.QueryRewardContractRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryRewardContractResponse>;

  rewardContract(
    request: sgn_farming_v1_query_pb.QueryRewardContractRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryRewardContractResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryRewardContractResponse>;

  rewardContract(
    request: sgn_farming_v1_query_pb.QueryRewardContractRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryRewardContractResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/RewardContract',
        request,
        metadata || {},
        this.methodInfoRewardContract,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/RewardContract',
    request,
    metadata || {},
    this.methodInfoRewardContract);
  }

  methodInfoEarnings = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/Earnings',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryEarningsRequest,
    sgn_farming_v1_query_pb.QueryEarningsResponse,
    (request: sgn_farming_v1_query_pb.QueryEarningsRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryEarningsResponse.deserializeBinary
  );

  earnings(
    request: sgn_farming_v1_query_pb.QueryEarningsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryEarningsResponse>;

  earnings(
    request: sgn_farming_v1_query_pb.QueryEarningsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryEarningsResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryEarningsResponse>;

  earnings(
    request: sgn_farming_v1_query_pb.QueryEarningsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryEarningsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/Earnings',
        request,
        metadata || {},
        this.methodInfoEarnings,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/Earnings',
    request,
    metadata || {},
    this.methodInfoEarnings);
  }

  methodInfoStakeInfo = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/StakeInfo',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryStakeInfoRequest,
    sgn_farming_v1_query_pb.QueryStakeInfoResponse,
    (request: sgn_farming_v1_query_pb.QueryStakeInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryStakeInfoResponse.deserializeBinary
  );

  stakeInfo(
    request: sgn_farming_v1_query_pb.QueryStakeInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryStakeInfoResponse>;

  stakeInfo(
    request: sgn_farming_v1_query_pb.QueryStakeInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryStakeInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryStakeInfoResponse>;

  stakeInfo(
    request: sgn_farming_v1_query_pb.QueryStakeInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryStakeInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/StakeInfo',
        request,
        metadata || {},
        this.methodInfoStakeInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/StakeInfo',
    request,
    metadata || {},
    this.methodInfoStakeInfo);
  }

  methodInfoAccountInfo = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/AccountInfo',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryAccountInfoRequest,
    sgn_farming_v1_query_pb.QueryAccountInfoResponse,
    (request: sgn_farming_v1_query_pb.QueryAccountInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryAccountInfoResponse.deserializeBinary
  );

  accountInfo(
    request: sgn_farming_v1_query_pb.QueryAccountInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryAccountInfoResponse>;

  accountInfo(
    request: sgn_farming_v1_query_pb.QueryAccountInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryAccountInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryAccountInfoResponse>;

  accountInfo(
    request: sgn_farming_v1_query_pb.QueryAccountInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryAccountInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/AccountInfo',
        request,
        metadata || {},
        this.methodInfoAccountInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/AccountInfo',
    request,
    metadata || {},
    this.methodInfoAccountInfo);
  }

  methodInfoAccountsStakedIn = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/AccountsStakedIn',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryAccountsStakedInRequest,
    sgn_farming_v1_query_pb.QueryAccountsStakedInResponse,
    (request: sgn_farming_v1_query_pb.QueryAccountsStakedInRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryAccountsStakedInResponse.deserializeBinary
  );

  accountsStakedIn(
    request: sgn_farming_v1_query_pb.QueryAccountsStakedInRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryAccountsStakedInResponse>;

  accountsStakedIn(
    request: sgn_farming_v1_query_pb.QueryAccountsStakedInRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryAccountsStakedInResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryAccountsStakedInResponse>;

  accountsStakedIn(
    request: sgn_farming_v1_query_pb.QueryAccountsStakedInRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryAccountsStakedInResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/AccountsStakedIn',
        request,
        metadata || {},
        this.methodInfoAccountsStakedIn,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/AccountsStakedIn',
    request,
    metadata || {},
    this.methodInfoAccountsStakedIn);
  }

  methodInfoNumPools = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/NumPools',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryNumPoolsRequest,
    sgn_farming_v1_query_pb.QueryNumPoolsResponse,
    (request: sgn_farming_v1_query_pb.QueryNumPoolsRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryNumPoolsResponse.deserializeBinary
  );

  numPools(
    request: sgn_farming_v1_query_pb.QueryNumPoolsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryNumPoolsResponse>;

  numPools(
    request: sgn_farming_v1_query_pb.QueryNumPoolsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryNumPoolsResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryNumPoolsResponse>;

  numPools(
    request: sgn_farming_v1_query_pb.QueryNumPoolsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryNumPoolsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/NumPools',
        request,
        metadata || {},
        this.methodInfoNumPools,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/NumPools',
    request,
    metadata || {},
    this.methodInfoNumPools);
  }

  methodInfoRewardClaimInfo = new grpcWeb.MethodDescriptor(
    '/sgn.farming.v1.Query/RewardClaimInfo',
    grpcWeb.MethodType.UNARY,
    sgn_farming_v1_query_pb.QueryRewardClaimInfoRequest,
    sgn_farming_v1_query_pb.QueryRewardClaimInfoResponse,
    (request: sgn_farming_v1_query_pb.QueryRewardClaimInfoRequest) => {
      return request.serializeBinary();
    },
    sgn_farming_v1_query_pb.QueryRewardClaimInfoResponse.deserializeBinary
  );

  rewardClaimInfo(
    request: sgn_farming_v1_query_pb.QueryRewardClaimInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_farming_v1_query_pb.QueryRewardClaimInfoResponse>;

  rewardClaimInfo(
    request: sgn_farming_v1_query_pb.QueryRewardClaimInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryRewardClaimInfoResponse) => void): grpcWeb.ClientReadableStream<sgn_farming_v1_query_pb.QueryRewardClaimInfoResponse>;

  rewardClaimInfo(
    request: sgn_farming_v1_query_pb.QueryRewardClaimInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_farming_v1_query_pb.QueryRewardClaimInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.farming.v1.Query/RewardClaimInfo',
        request,
        metadata || {},
        this.methodInfoRewardClaimInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.farming.v1.Query/RewardClaimInfo',
    request,
    metadata || {},
    this.methodInfoRewardClaimInfo);
  }

}

