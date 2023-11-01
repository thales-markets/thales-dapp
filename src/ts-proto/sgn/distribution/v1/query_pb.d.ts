import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_api_annotations_pb from '../../../google/api/annotations_pb';
import * as cosmos_base_query_v1beta1_pagination_pb from '../../../cosmos/base/query/v1beta1/pagination_pb';
import * as cosmos_base_v1beta1_coin_pb from '../../../cosmos/base/v1beta1/coin_pb';
import * as sgn_distribution_v1_distribution_pb from '../../../sgn/distribution/v1/distribution_pb';


export class QueryParamsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryParamsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryParamsRequest): QueryParamsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryParamsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryParamsRequest;
  static deserializeBinaryFromReader(message: QueryParamsRequest, reader: jspb.BinaryReader): QueryParamsRequest;
}

export namespace QueryParamsRequest {
  export type AsObject = {
  }
}

export class QueryParamsResponse extends jspb.Message {
  getParams(): sgn_distribution_v1_distribution_pb.Params | undefined;
  setParams(value?: sgn_distribution_v1_distribution_pb.Params): QueryParamsResponse;
  hasParams(): boolean;
  clearParams(): QueryParamsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryParamsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryParamsResponse): QueryParamsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryParamsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryParamsResponse;
  static deserializeBinaryFromReader(message: QueryParamsResponse, reader: jspb.BinaryReader): QueryParamsResponse;
}

export namespace QueryParamsResponse {
  export type AsObject = {
    params?: sgn_distribution_v1_distribution_pb.Params.AsObject,
  }
}

export class QueryValidatorOutstandingRewardsRequest extends jspb.Message {
  getValidatorAddress(): string;
  setValidatorAddress(value: string): QueryValidatorOutstandingRewardsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryValidatorOutstandingRewardsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryValidatorOutstandingRewardsRequest): QueryValidatorOutstandingRewardsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryValidatorOutstandingRewardsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryValidatorOutstandingRewardsRequest;
  static deserializeBinaryFromReader(message: QueryValidatorOutstandingRewardsRequest, reader: jspb.BinaryReader): QueryValidatorOutstandingRewardsRequest;
}

export namespace QueryValidatorOutstandingRewardsRequest {
  export type AsObject = {
    validatorAddress: string,
  }
}

export class QueryValidatorOutstandingRewardsResponse extends jspb.Message {
  getRewards(): sgn_distribution_v1_distribution_pb.ValidatorOutstandingRewards | undefined;
  setRewards(value?: sgn_distribution_v1_distribution_pb.ValidatorOutstandingRewards): QueryValidatorOutstandingRewardsResponse;
  hasRewards(): boolean;
  clearRewards(): QueryValidatorOutstandingRewardsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryValidatorOutstandingRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryValidatorOutstandingRewardsResponse): QueryValidatorOutstandingRewardsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryValidatorOutstandingRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryValidatorOutstandingRewardsResponse;
  static deserializeBinaryFromReader(message: QueryValidatorOutstandingRewardsResponse, reader: jspb.BinaryReader): QueryValidatorOutstandingRewardsResponse;
}

export namespace QueryValidatorOutstandingRewardsResponse {
  export type AsObject = {
    rewards?: sgn_distribution_v1_distribution_pb.ValidatorOutstandingRewards.AsObject,
  }
}

export class QueryValidatorCommissionRequest extends jspb.Message {
  getValidatorAddress(): string;
  setValidatorAddress(value: string): QueryValidatorCommissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryValidatorCommissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryValidatorCommissionRequest): QueryValidatorCommissionRequest.AsObject;
  static serializeBinaryToWriter(message: QueryValidatorCommissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryValidatorCommissionRequest;
  static deserializeBinaryFromReader(message: QueryValidatorCommissionRequest, reader: jspb.BinaryReader): QueryValidatorCommissionRequest;
}

export namespace QueryValidatorCommissionRequest {
  export type AsObject = {
    validatorAddress: string,
  }
}

export class QueryValidatorCommissionResponse extends jspb.Message {
  getCommission(): sgn_distribution_v1_distribution_pb.ValidatorAccumulatedCommission | undefined;
  setCommission(value?: sgn_distribution_v1_distribution_pb.ValidatorAccumulatedCommission): QueryValidatorCommissionResponse;
  hasCommission(): boolean;
  clearCommission(): QueryValidatorCommissionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryValidatorCommissionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryValidatorCommissionResponse): QueryValidatorCommissionResponse.AsObject;
  static serializeBinaryToWriter(message: QueryValidatorCommissionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryValidatorCommissionResponse;
  static deserializeBinaryFromReader(message: QueryValidatorCommissionResponse, reader: jspb.BinaryReader): QueryValidatorCommissionResponse;
}

export namespace QueryValidatorCommissionResponse {
  export type AsObject = {
    commission?: sgn_distribution_v1_distribution_pb.ValidatorAccumulatedCommission.AsObject,
  }
}

export class QueryDelegationRewardsRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): QueryDelegationRewardsRequest;

  getValidatorAddress(): string;
  setValidatorAddress(value: string): QueryDelegationRewardsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegationRewardsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegationRewardsRequest): QueryDelegationRewardsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDelegationRewardsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegationRewardsRequest;
  static deserializeBinaryFromReader(message: QueryDelegationRewardsRequest, reader: jspb.BinaryReader): QueryDelegationRewardsRequest;
}

export namespace QueryDelegationRewardsRequest {
  export type AsObject = {
    delegatorAddress: string,
    validatorAddress: string,
  }
}

export class QueryDelegationRewardsResponse extends jspb.Message {
  getRewardsList(): Array<cosmos_base_v1beta1_coin_pb.DecCoin>;
  setRewardsList(value: Array<cosmos_base_v1beta1_coin_pb.DecCoin>): QueryDelegationRewardsResponse;
  clearRewardsList(): QueryDelegationRewardsResponse;
  addRewards(value?: cosmos_base_v1beta1_coin_pb.DecCoin, index?: number): cosmos_base_v1beta1_coin_pb.DecCoin;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegationRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegationRewardsResponse): QueryDelegationRewardsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDelegationRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegationRewardsResponse;
  static deserializeBinaryFromReader(message: QueryDelegationRewardsResponse, reader: jspb.BinaryReader): QueryDelegationRewardsResponse;
}

export namespace QueryDelegationRewardsResponse {
  export type AsObject = {
    rewardsList: Array<cosmos_base_v1beta1_coin_pb.DecCoin.AsObject>,
  }
}

export class QueryDelegationTotalRewardsRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): QueryDelegationTotalRewardsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegationTotalRewardsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegationTotalRewardsRequest): QueryDelegationTotalRewardsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDelegationTotalRewardsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegationTotalRewardsRequest;
  static deserializeBinaryFromReader(message: QueryDelegationTotalRewardsRequest, reader: jspb.BinaryReader): QueryDelegationTotalRewardsRequest;
}

export namespace QueryDelegationTotalRewardsRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class QueryDelegationTotalRewardsResponse extends jspb.Message {
  getRewardsList(): Array<sgn_distribution_v1_distribution_pb.DelegationDelegatorReward>;
  setRewardsList(value: Array<sgn_distribution_v1_distribution_pb.DelegationDelegatorReward>): QueryDelegationTotalRewardsResponse;
  clearRewardsList(): QueryDelegationTotalRewardsResponse;
  addRewards(value?: sgn_distribution_v1_distribution_pb.DelegationDelegatorReward, index?: number): sgn_distribution_v1_distribution_pb.DelegationDelegatorReward;

  getTotalList(): Array<cosmos_base_v1beta1_coin_pb.DecCoin>;
  setTotalList(value: Array<cosmos_base_v1beta1_coin_pb.DecCoin>): QueryDelegationTotalRewardsResponse;
  clearTotalList(): QueryDelegationTotalRewardsResponse;
  addTotal(value?: cosmos_base_v1beta1_coin_pb.DecCoin, index?: number): cosmos_base_v1beta1_coin_pb.DecCoin;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegationTotalRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegationTotalRewardsResponse): QueryDelegationTotalRewardsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDelegationTotalRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegationTotalRewardsResponse;
  static deserializeBinaryFromReader(message: QueryDelegationTotalRewardsResponse, reader: jspb.BinaryReader): QueryDelegationTotalRewardsResponse;
}

export namespace QueryDelegationTotalRewardsResponse {
  export type AsObject = {
    rewardsList: Array<sgn_distribution_v1_distribution_pb.DelegationDelegatorReward.AsObject>,
    totalList: Array<cosmos_base_v1beta1_coin_pb.DecCoin.AsObject>,
  }
}

export class QueryDelegatorValidatorsRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): QueryDelegatorValidatorsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegatorValidatorsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegatorValidatorsRequest): QueryDelegatorValidatorsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDelegatorValidatorsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegatorValidatorsRequest;
  static deserializeBinaryFromReader(message: QueryDelegatorValidatorsRequest, reader: jspb.BinaryReader): QueryDelegatorValidatorsRequest;
}

export namespace QueryDelegatorValidatorsRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class QueryDelegatorValidatorsResponse extends jspb.Message {
  getValidatorsList(): Array<string>;
  setValidatorsList(value: Array<string>): QueryDelegatorValidatorsResponse;
  clearValidatorsList(): QueryDelegatorValidatorsResponse;
  addValidators(value: string, index?: number): QueryDelegatorValidatorsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegatorValidatorsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegatorValidatorsResponse): QueryDelegatorValidatorsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDelegatorValidatorsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegatorValidatorsResponse;
  static deserializeBinaryFromReader(message: QueryDelegatorValidatorsResponse, reader: jspb.BinaryReader): QueryDelegatorValidatorsResponse;
}

export namespace QueryDelegatorValidatorsResponse {
  export type AsObject = {
    validatorsList: Array<string>,
  }
}

export class QueryDelegatorWithdrawAddressRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): QueryDelegatorWithdrawAddressRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegatorWithdrawAddressRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegatorWithdrawAddressRequest): QueryDelegatorWithdrawAddressRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDelegatorWithdrawAddressRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegatorWithdrawAddressRequest;
  static deserializeBinaryFromReader(message: QueryDelegatorWithdrawAddressRequest, reader: jspb.BinaryReader): QueryDelegatorWithdrawAddressRequest;
}

export namespace QueryDelegatorWithdrawAddressRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class QueryDelegatorWithdrawAddressResponse extends jspb.Message {
  getWithdrawAddress(): string;
  setWithdrawAddress(value: string): QueryDelegatorWithdrawAddressResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegatorWithdrawAddressResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegatorWithdrawAddressResponse): QueryDelegatorWithdrawAddressResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDelegatorWithdrawAddressResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegatorWithdrawAddressResponse;
  static deserializeBinaryFromReader(message: QueryDelegatorWithdrawAddressResponse, reader: jspb.BinaryReader): QueryDelegatorWithdrawAddressResponse;
}

export namespace QueryDelegatorWithdrawAddressResponse {
  export type AsObject = {
    withdrawAddress: string,
  }
}

export class QueryCommunityPoolRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryCommunityPoolRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryCommunityPoolRequest): QueryCommunityPoolRequest.AsObject;
  static serializeBinaryToWriter(message: QueryCommunityPoolRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryCommunityPoolRequest;
  static deserializeBinaryFromReader(message: QueryCommunityPoolRequest, reader: jspb.BinaryReader): QueryCommunityPoolRequest;
}

export namespace QueryCommunityPoolRequest {
  export type AsObject = {
  }
}

export class QueryCommunityPoolResponse extends jspb.Message {
  getPoolList(): Array<cosmos_base_v1beta1_coin_pb.DecCoin>;
  setPoolList(value: Array<cosmos_base_v1beta1_coin_pb.DecCoin>): QueryCommunityPoolResponse;
  clearPoolList(): QueryCommunityPoolResponse;
  addPool(value?: cosmos_base_v1beta1_coin_pb.DecCoin, index?: number): cosmos_base_v1beta1_coin_pb.DecCoin;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryCommunityPoolResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryCommunityPoolResponse): QueryCommunityPoolResponse.AsObject;
  static serializeBinaryToWriter(message: QueryCommunityPoolResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryCommunityPoolResponse;
  static deserializeBinaryFromReader(message: QueryCommunityPoolResponse, reader: jspb.BinaryReader): QueryCommunityPoolResponse;
}

export namespace QueryCommunityPoolResponse {
  export type AsObject = {
    poolList: Array<cosmos_base_v1beta1_coin_pb.DecCoin.AsObject>,
  }
}

export class QueryStakingRewardInfoRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): QueryStakingRewardInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryStakingRewardInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryStakingRewardInfoRequest): QueryStakingRewardInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryStakingRewardInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryStakingRewardInfoRequest;
  static deserializeBinaryFromReader(message: QueryStakingRewardInfoRequest, reader: jspb.BinaryReader): QueryStakingRewardInfoRequest;
}

export namespace QueryStakingRewardInfoRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class QueryStakingRewardInfoResponse extends jspb.Message {
  getRewardInfo(): sgn_distribution_v1_distribution_pb.StakingRewardInfo | undefined;
  setRewardInfo(value?: sgn_distribution_v1_distribution_pb.StakingRewardInfo): QueryStakingRewardInfoResponse;
  hasRewardInfo(): boolean;
  clearRewardInfo(): QueryStakingRewardInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryStakingRewardInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryStakingRewardInfoResponse): QueryStakingRewardInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryStakingRewardInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryStakingRewardInfoResponse;
  static deserializeBinaryFromReader(message: QueryStakingRewardInfoResponse, reader: jspb.BinaryReader): QueryStakingRewardInfoResponse;
}

export namespace QueryStakingRewardInfoResponse {
  export type AsObject = {
    rewardInfo?: sgn_distribution_v1_distribution_pb.StakingRewardInfo.AsObject,
  }
}

export class QueryStakingRewardClaimInfoRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): QueryStakingRewardClaimInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryStakingRewardClaimInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryStakingRewardClaimInfoRequest): QueryStakingRewardClaimInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryStakingRewardClaimInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryStakingRewardClaimInfoRequest;
  static deserializeBinaryFromReader(message: QueryStakingRewardClaimInfoRequest, reader: jspb.BinaryReader): QueryStakingRewardClaimInfoRequest;
}

export namespace QueryStakingRewardClaimInfoRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class QueryStakingRewardClaimInfoResponse extends jspb.Message {
  getRewardClaimInfo(): sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo | undefined;
  setRewardClaimInfo(value?: sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo): QueryStakingRewardClaimInfoResponse;
  hasRewardClaimInfo(): boolean;
  clearRewardClaimInfo(): QueryStakingRewardClaimInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryStakingRewardClaimInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryStakingRewardClaimInfoResponse): QueryStakingRewardClaimInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryStakingRewardClaimInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryStakingRewardClaimInfoResponse;
  static deserializeBinaryFromReader(message: QueryStakingRewardClaimInfoResponse, reader: jspb.BinaryReader): QueryStakingRewardClaimInfoResponse;
}

export namespace QueryStakingRewardClaimInfoResponse {
  export type AsObject = {
    rewardClaimInfo?: sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo.AsObject,
  }
}

export class QueryCBridgeFeeShareInfoRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): QueryCBridgeFeeShareInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryCBridgeFeeShareInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryCBridgeFeeShareInfoRequest): QueryCBridgeFeeShareInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryCBridgeFeeShareInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryCBridgeFeeShareInfoRequest;
  static deserializeBinaryFromReader(message: QueryCBridgeFeeShareInfoRequest, reader: jspb.BinaryReader): QueryCBridgeFeeShareInfoRequest;
}

export namespace QueryCBridgeFeeShareInfoRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class QueryCBridgeFeeShareInfoResponse extends jspb.Message {
  getFeeShareInfo(): sgn_distribution_v1_distribution_pb.ClaimableFeesInfo | undefined;
  setFeeShareInfo(value?: sgn_distribution_v1_distribution_pb.ClaimableFeesInfo): QueryCBridgeFeeShareInfoResponse;
  hasFeeShareInfo(): boolean;
  clearFeeShareInfo(): QueryCBridgeFeeShareInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryCBridgeFeeShareInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryCBridgeFeeShareInfoResponse): QueryCBridgeFeeShareInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryCBridgeFeeShareInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryCBridgeFeeShareInfoResponse;
  static deserializeBinaryFromReader(message: QueryCBridgeFeeShareInfoResponse, reader: jspb.BinaryReader): QueryCBridgeFeeShareInfoResponse;
}

export namespace QueryCBridgeFeeShareInfoResponse {
  export type AsObject = {
    feeShareInfo?: sgn_distribution_v1_distribution_pb.ClaimableFeesInfo.AsObject,
  }
}

export class QueryPegBridgeFeesInfoRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): QueryPegBridgeFeesInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryPegBridgeFeesInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryPegBridgeFeesInfoRequest): QueryPegBridgeFeesInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryPegBridgeFeesInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryPegBridgeFeesInfoRequest;
  static deserializeBinaryFromReader(message: QueryPegBridgeFeesInfoRequest, reader: jspb.BinaryReader): QueryPegBridgeFeesInfoRequest;
}

export namespace QueryPegBridgeFeesInfoRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class QueryPegBridgeFeesInfoResponse extends jspb.Message {
  getFeesInfo(): sgn_distribution_v1_distribution_pb.ClaimableFeesInfo | undefined;
  setFeesInfo(value?: sgn_distribution_v1_distribution_pb.ClaimableFeesInfo): QueryPegBridgeFeesInfoResponse;
  hasFeesInfo(): boolean;
  clearFeesInfo(): QueryPegBridgeFeesInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryPegBridgeFeesInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryPegBridgeFeesInfoResponse): QueryPegBridgeFeesInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryPegBridgeFeesInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryPegBridgeFeesInfoResponse;
  static deserializeBinaryFromReader(message: QueryPegBridgeFeesInfoResponse, reader: jspb.BinaryReader): QueryPegBridgeFeesInfoResponse;
}

export namespace QueryPegBridgeFeesInfoResponse {
  export type AsObject = {
    feesInfo?: sgn_distribution_v1_distribution_pb.ClaimableFeesInfo.AsObject,
  }
}

export class QueryMessageFeesInfoRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): QueryMessageFeesInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryMessageFeesInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryMessageFeesInfoRequest): QueryMessageFeesInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryMessageFeesInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryMessageFeesInfoRequest;
  static deserializeBinaryFromReader(message: QueryMessageFeesInfoRequest, reader: jspb.BinaryReader): QueryMessageFeesInfoRequest;
}

export namespace QueryMessageFeesInfoRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class QueryMessageFeesInfoResponse extends jspb.Message {
  getFeesInfo(): sgn_distribution_v1_distribution_pb.ClaimableFeesInfo | undefined;
  setFeesInfo(value?: sgn_distribution_v1_distribution_pb.ClaimableFeesInfo): QueryMessageFeesInfoResponse;
  hasFeesInfo(): boolean;
  clearFeesInfo(): QueryMessageFeesInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryMessageFeesInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryMessageFeesInfoResponse): QueryMessageFeesInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryMessageFeesInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryMessageFeesInfoResponse;
  static deserializeBinaryFromReader(message: QueryMessageFeesInfoResponse, reader: jspb.BinaryReader): QueryMessageFeesInfoResponse;
}

export namespace QueryMessageFeesInfoResponse {
  export type AsObject = {
    feesInfo?: sgn_distribution_v1_distribution_pb.ClaimableFeesInfo.AsObject,
  }
}

