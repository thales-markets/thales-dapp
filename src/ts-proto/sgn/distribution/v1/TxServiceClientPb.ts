/**
 * @fileoverview gRPC-Web generated client stub for sgn.distribution.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_distribution_v1_tx_pb from '../../../sgn/distribution/v1/tx_pb';


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

  methodInfoSetWithdrawAddress = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Msg/SetWithdrawAddress',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_tx_pb.MsgSetWithdrawAddress,
    sgn_distribution_v1_tx_pb.MsgSetWithdrawAddressResponse,
    (request: sgn_distribution_v1_tx_pb.MsgSetWithdrawAddress) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_tx_pb.MsgSetWithdrawAddressResponse.deserializeBinary
  );

  setWithdrawAddress(
    request: sgn_distribution_v1_tx_pb.MsgSetWithdrawAddress,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_tx_pb.MsgSetWithdrawAddressResponse>;

  setWithdrawAddress(
    request: sgn_distribution_v1_tx_pb.MsgSetWithdrawAddress,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgSetWithdrawAddressResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_tx_pb.MsgSetWithdrawAddressResponse>;

  setWithdrawAddress(
    request: sgn_distribution_v1_tx_pb.MsgSetWithdrawAddress,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgSetWithdrawAddressResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Msg/SetWithdrawAddress',
        request,
        metadata || {},
        this.methodInfoSetWithdrawAddress,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Msg/SetWithdrawAddress',
    request,
    metadata || {},
    this.methodInfoSetWithdrawAddress);
  }

  methodInfoWithdrawDelegatorReward = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Msg/WithdrawDelegatorReward',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorReward,
    sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorRewardResponse,
    (request: sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorReward) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorRewardResponse.deserializeBinary
  );

  withdrawDelegatorReward(
    request: sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorReward,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorRewardResponse>;

  withdrawDelegatorReward(
    request: sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorReward,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorRewardResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorRewardResponse>;

  withdrawDelegatorReward(
    request: sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorReward,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgWithdrawDelegatorRewardResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Msg/WithdrawDelegatorReward',
        request,
        metadata || {},
        this.methodInfoWithdrawDelegatorReward,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Msg/WithdrawDelegatorReward',
    request,
    metadata || {},
    this.methodInfoWithdrawDelegatorReward);
  }

  methodInfoWithdrawValidatorCommission = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Msg/WithdrawValidatorCommission',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommission,
    sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommissionResponse,
    (request: sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommission) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommissionResponse.deserializeBinary
  );

  withdrawValidatorCommission(
    request: sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommission,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommissionResponse>;

  withdrawValidatorCommission(
    request: sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommission,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommissionResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommissionResponse>;

  withdrawValidatorCommission(
    request: sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommission,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgWithdrawValidatorCommissionResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Msg/WithdrawValidatorCommission',
        request,
        metadata || {},
        this.methodInfoWithdrawValidatorCommission,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Msg/WithdrawValidatorCommission',
    request,
    metadata || {},
    this.methodInfoWithdrawValidatorCommission);
  }

  methodInfoFundCommunityPool = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Msg/FundCommunityPool',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_tx_pb.MsgFundCommunityPool,
    sgn_distribution_v1_tx_pb.MsgFundCommunityPoolResponse,
    (request: sgn_distribution_v1_tx_pb.MsgFundCommunityPool) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_tx_pb.MsgFundCommunityPoolResponse.deserializeBinary
  );

  fundCommunityPool(
    request: sgn_distribution_v1_tx_pb.MsgFundCommunityPool,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_tx_pb.MsgFundCommunityPoolResponse>;

  fundCommunityPool(
    request: sgn_distribution_v1_tx_pb.MsgFundCommunityPool,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgFundCommunityPoolResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_tx_pb.MsgFundCommunityPoolResponse>;

  fundCommunityPool(
    request: sgn_distribution_v1_tx_pb.MsgFundCommunityPool,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgFundCommunityPoolResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Msg/FundCommunityPool',
        request,
        metadata || {},
        this.methodInfoFundCommunityPool,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Msg/FundCommunityPool',
    request,
    metadata || {},
    this.methodInfoFundCommunityPool);
  }

  methodInfoClaimAllStakingReward = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Msg/ClaimAllStakingReward',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_tx_pb.MsgClaimAllStakingReward,
    sgn_distribution_v1_tx_pb.MsgClaimAllStakingRewardResponse,
    (request: sgn_distribution_v1_tx_pb.MsgClaimAllStakingReward) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_tx_pb.MsgClaimAllStakingRewardResponse.deserializeBinary
  );

  claimAllStakingReward(
    request: sgn_distribution_v1_tx_pb.MsgClaimAllStakingReward,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_tx_pb.MsgClaimAllStakingRewardResponse>;

  claimAllStakingReward(
    request: sgn_distribution_v1_tx_pb.MsgClaimAllStakingReward,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgClaimAllStakingRewardResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_tx_pb.MsgClaimAllStakingRewardResponse>;

  claimAllStakingReward(
    request: sgn_distribution_v1_tx_pb.MsgClaimAllStakingReward,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgClaimAllStakingRewardResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Msg/ClaimAllStakingReward',
        request,
        metadata || {},
        this.methodInfoClaimAllStakingReward,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Msg/ClaimAllStakingReward',
    request,
    metadata || {},
    this.methodInfoClaimAllStakingReward);
  }

  methodInfoSignStakingReward = new grpcWeb.MethodDescriptor(
    '/sgn.distribution.v1.Msg/SignStakingReward',
    grpcWeb.MethodType.UNARY,
    sgn_distribution_v1_tx_pb.MsgSignStakingReward,
    sgn_distribution_v1_tx_pb.MsgSignStakingRewardResponse,
    (request: sgn_distribution_v1_tx_pb.MsgSignStakingReward) => {
      return request.serializeBinary();
    },
    sgn_distribution_v1_tx_pb.MsgSignStakingRewardResponse.deserializeBinary
  );

  signStakingReward(
    request: sgn_distribution_v1_tx_pb.MsgSignStakingReward,
    metadata: grpcWeb.Metadata | null): Promise<sgn_distribution_v1_tx_pb.MsgSignStakingRewardResponse>;

  signStakingReward(
    request: sgn_distribution_v1_tx_pb.MsgSignStakingReward,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgSignStakingRewardResponse) => void): grpcWeb.ClientReadableStream<sgn_distribution_v1_tx_pb.MsgSignStakingRewardResponse>;

  signStakingReward(
    request: sgn_distribution_v1_tx_pb.MsgSignStakingReward,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_distribution_v1_tx_pb.MsgSignStakingRewardResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.distribution.v1.Msg/SignStakingReward',
        request,
        metadata || {},
        this.methodInfoSignStakingReward,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.distribution.v1.Msg/SignStakingReward',
    request,
    metadata || {},
    this.methodInfoSignStakingReward);
  }

}

