import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_api_annotations_pb from '../../../google/api/annotations_pb';
import * as cosmos_base_query_v1beta1_pagination_pb from '../../../cosmos/base/query/v1beta1/pagination_pb';
import * as cosmos_base_v1beta1_coin_pb from '../../../cosmos/base/v1beta1/coin_pb';
import * as sgn_common_v1_common_pb from '../../../sgn/common/v1/common_pb';
import * as sgn_farming_v1_farming_pb from '../../../sgn/farming/v1/farming_pb';


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
  getParams(): sgn_farming_v1_farming_pb.Params | undefined;
  setParams(value?: sgn_farming_v1_farming_pb.Params): QueryParamsResponse;
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
    params?: sgn_farming_v1_farming_pb.Params.AsObject,
  }
}

export class QueryPoolsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryPoolsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryPoolsRequest): QueryPoolsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryPoolsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryPoolsRequest;
  static deserializeBinaryFromReader(message: QueryPoolsRequest, reader: jspb.BinaryReader): QueryPoolsRequest;
}

export namespace QueryPoolsRequest {
  export type AsObject = {
  }
}

export class QueryPoolsResponse extends jspb.Message {
  getPoolsList(): Array<sgn_farming_v1_farming_pb.FarmingPool>;
  setPoolsList(value: Array<sgn_farming_v1_farming_pb.FarmingPool>): QueryPoolsResponse;
  clearPoolsList(): QueryPoolsResponse;
  addPools(value?: sgn_farming_v1_farming_pb.FarmingPool, index?: number): sgn_farming_v1_farming_pb.FarmingPool;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryPoolsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryPoolsResponse): QueryPoolsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryPoolsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryPoolsResponse;
  static deserializeBinaryFromReader(message: QueryPoolsResponse, reader: jspb.BinaryReader): QueryPoolsResponse;
}

export namespace QueryPoolsResponse {
  export type AsObject = {
    poolsList: Array<sgn_farming_v1_farming_pb.FarmingPool.AsObject>,
  }
}

export class QueryPoolRequest extends jspb.Message {
  getPoolName(): string;
  setPoolName(value: string): QueryPoolRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryPoolRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryPoolRequest): QueryPoolRequest.AsObject;
  static serializeBinaryToWriter(message: QueryPoolRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryPoolRequest;
  static deserializeBinaryFromReader(message: QueryPoolRequest, reader: jspb.BinaryReader): QueryPoolRequest;
}

export namespace QueryPoolRequest {
  export type AsObject = {
    poolName: string,
  }
}

export class QueryPoolResponse extends jspb.Message {
  getPool(): sgn_farming_v1_farming_pb.FarmingPool | undefined;
  setPool(value?: sgn_farming_v1_farming_pb.FarmingPool): QueryPoolResponse;
  hasPool(): boolean;
  clearPool(): QueryPoolResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryPoolResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryPoolResponse): QueryPoolResponse.AsObject;
  static serializeBinaryToWriter(message: QueryPoolResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryPoolResponse;
  static deserializeBinaryFromReader(message: QueryPoolResponse, reader: jspb.BinaryReader): QueryPoolResponse;
}

export namespace QueryPoolResponse {
  export type AsObject = {
    pool?: sgn_farming_v1_farming_pb.FarmingPool.AsObject,
  }
}

export class QueryTokensRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTokensRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTokensRequest): QueryTokensRequest.AsObject;
  static serializeBinaryToWriter(message: QueryTokensRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTokensRequest;
  static deserializeBinaryFromReader(message: QueryTokensRequest, reader: jspb.BinaryReader): QueryTokensRequest;
}

export namespace QueryTokensRequest {
  export type AsObject = {
  }
}

export class QueryTokensResponse extends jspb.Message {
  getTokensList(): Array<sgn_common_v1_common_pb.ERC20Token>;
  setTokensList(value: Array<sgn_common_v1_common_pb.ERC20Token>): QueryTokensResponse;
  clearTokensList(): QueryTokensResponse;
  addTokens(value?: sgn_common_v1_common_pb.ERC20Token, index?: number): sgn_common_v1_common_pb.ERC20Token;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTokensResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTokensResponse): QueryTokensResponse.AsObject;
  static serializeBinaryToWriter(message: QueryTokensResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTokensResponse;
  static deserializeBinaryFromReader(message: QueryTokensResponse, reader: jspb.BinaryReader): QueryTokensResponse;
}

export namespace QueryTokensResponse {
  export type AsObject = {
    tokensList: Array<sgn_common_v1_common_pb.ERC20Token.AsObject>,
  }
}

export class QueryTokenRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): QueryTokenRequest;

  getSymbol(): string;
  setSymbol(value: string): QueryTokenRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTokenRequest): QueryTokenRequest.AsObject;
  static serializeBinaryToWriter(message: QueryTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTokenRequest;
  static deserializeBinaryFromReader(message: QueryTokenRequest, reader: jspb.BinaryReader): QueryTokenRequest;
}

export namespace QueryTokenRequest {
  export type AsObject = {
    chainId: number,
    symbol: string,
  }
}

export class QueryTokenResponse extends jspb.Message {
  getToken(): sgn_common_v1_common_pb.ERC20Token | undefined;
  setToken(value?: sgn_common_v1_common_pb.ERC20Token): QueryTokenResponse;
  hasToken(): boolean;
  clearToken(): QueryTokenResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTokenResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTokenResponse): QueryTokenResponse.AsObject;
  static serializeBinaryToWriter(message: QueryTokenResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTokenResponse;
  static deserializeBinaryFromReader(message: QueryTokenResponse, reader: jspb.BinaryReader): QueryTokenResponse;
}

export namespace QueryTokenResponse {
  export type AsObject = {
    token?: sgn_common_v1_common_pb.ERC20Token.AsObject,
  }
}

export class QueryRewardContractsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRewardContractsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRewardContractsRequest): QueryRewardContractsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryRewardContractsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRewardContractsRequest;
  static deserializeBinaryFromReader(message: QueryRewardContractsRequest, reader: jspb.BinaryReader): QueryRewardContractsRequest;
}

export namespace QueryRewardContractsRequest {
  export type AsObject = {
  }
}

export class QueryRewardContractsResponse extends jspb.Message {
  getRewardContractsList(): Array<sgn_common_v1_common_pb.ContractInfo>;
  setRewardContractsList(value: Array<sgn_common_v1_common_pb.ContractInfo>): QueryRewardContractsResponse;
  clearRewardContractsList(): QueryRewardContractsResponse;
  addRewardContracts(value?: sgn_common_v1_common_pb.ContractInfo, index?: number): sgn_common_v1_common_pb.ContractInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRewardContractsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRewardContractsResponse): QueryRewardContractsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryRewardContractsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRewardContractsResponse;
  static deserializeBinaryFromReader(message: QueryRewardContractsResponse, reader: jspb.BinaryReader): QueryRewardContractsResponse;
}

export namespace QueryRewardContractsResponse {
  export type AsObject = {
    rewardContractsList: Array<sgn_common_v1_common_pb.ContractInfo.AsObject>,
  }
}

export class QueryRewardContractRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): QueryRewardContractRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRewardContractRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRewardContractRequest): QueryRewardContractRequest.AsObject;
  static serializeBinaryToWriter(message: QueryRewardContractRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRewardContractRequest;
  static deserializeBinaryFromReader(message: QueryRewardContractRequest, reader: jspb.BinaryReader): QueryRewardContractRequest;
}

export namespace QueryRewardContractRequest {
  export type AsObject = {
    chainId: number,
  }
}

export class QueryRewardContractResponse extends jspb.Message {
  getRewardContract(): sgn_common_v1_common_pb.ContractInfo | undefined;
  setRewardContract(value?: sgn_common_v1_common_pb.ContractInfo): QueryRewardContractResponse;
  hasRewardContract(): boolean;
  clearRewardContract(): QueryRewardContractResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRewardContractResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRewardContractResponse): QueryRewardContractResponse.AsObject;
  static serializeBinaryToWriter(message: QueryRewardContractResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRewardContractResponse;
  static deserializeBinaryFromReader(message: QueryRewardContractResponse, reader: jspb.BinaryReader): QueryRewardContractResponse;
}

export namespace QueryRewardContractResponse {
  export type AsObject = {
    rewardContract?: sgn_common_v1_common_pb.ContractInfo.AsObject,
  }
}

export class QueryEarningsRequest extends jspb.Message {
  getPoolName(): string;
  setPoolName(value: string): QueryEarningsRequest;

  getAddress(): string;
  setAddress(value: string): QueryEarningsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryEarningsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryEarningsRequest): QueryEarningsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryEarningsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryEarningsRequest;
  static deserializeBinaryFromReader(message: QueryEarningsRequest, reader: jspb.BinaryReader): QueryEarningsRequest;
}

export namespace QueryEarningsRequest {
  export type AsObject = {
    poolName: string,
    address: string,
  }
}

export class QueryEarningsResponse extends jspb.Message {
  getEarnings(): sgn_farming_v1_farming_pb.Earnings | undefined;
  setEarnings(value?: sgn_farming_v1_farming_pb.Earnings): QueryEarningsResponse;
  hasEarnings(): boolean;
  clearEarnings(): QueryEarningsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryEarningsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryEarningsResponse): QueryEarningsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryEarningsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryEarningsResponse;
  static deserializeBinaryFromReader(message: QueryEarningsResponse, reader: jspb.BinaryReader): QueryEarningsResponse;
}

export namespace QueryEarningsResponse {
  export type AsObject = {
    earnings?: sgn_farming_v1_farming_pb.Earnings.AsObject,
  }
}

export class QueryStakeInfoRequest extends jspb.Message {
  getPoolName(): string;
  setPoolName(value: string): QueryStakeInfoRequest;

  getAddress(): string;
  setAddress(value: string): QueryStakeInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryStakeInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryStakeInfoRequest): QueryStakeInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryStakeInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryStakeInfoRequest;
  static deserializeBinaryFromReader(message: QueryStakeInfoRequest, reader: jspb.BinaryReader): QueryStakeInfoRequest;
}

export namespace QueryStakeInfoRequest {
  export type AsObject = {
    poolName: string,
    address: string,
  }
}

export class QueryStakeInfoResponse extends jspb.Message {
  getStakeInfo(): sgn_farming_v1_farming_pb.StakeInfo | undefined;
  setStakeInfo(value?: sgn_farming_v1_farming_pb.StakeInfo): QueryStakeInfoResponse;
  hasStakeInfo(): boolean;
  clearStakeInfo(): QueryStakeInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryStakeInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryStakeInfoResponse): QueryStakeInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryStakeInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryStakeInfoResponse;
  static deserializeBinaryFromReader(message: QueryStakeInfoResponse, reader: jspb.BinaryReader): QueryStakeInfoResponse;
}

export namespace QueryStakeInfoResponse {
  export type AsObject = {
    stakeInfo?: sgn_farming_v1_farming_pb.StakeInfo.AsObject,
  }
}

export class QueryAccountInfoRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): QueryAccountInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryAccountInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryAccountInfoRequest): QueryAccountInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryAccountInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryAccountInfoRequest;
  static deserializeBinaryFromReader(message: QueryAccountInfoRequest, reader: jspb.BinaryReader): QueryAccountInfoRequest;
}

export namespace QueryAccountInfoRequest {
  export type AsObject = {
    address: string,
  }
}

export class QueryAccountInfoResponse extends jspb.Message {
  getAccountInfo(): sgn_farming_v1_farming_pb.AccountInfo | undefined;
  setAccountInfo(value?: sgn_farming_v1_farming_pb.AccountInfo): QueryAccountInfoResponse;
  hasAccountInfo(): boolean;
  clearAccountInfo(): QueryAccountInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryAccountInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryAccountInfoResponse): QueryAccountInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryAccountInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryAccountInfoResponse;
  static deserializeBinaryFromReader(message: QueryAccountInfoResponse, reader: jspb.BinaryReader): QueryAccountInfoResponse;
}

export namespace QueryAccountInfoResponse {
  export type AsObject = {
    accountInfo?: sgn_farming_v1_farming_pb.AccountInfo.AsObject,
  }
}

export class QueryAccountsStakedInRequest extends jspb.Message {
  getPoolName(): string;
  setPoolName(value: string): QueryAccountsStakedInRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryAccountsStakedInRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryAccountsStakedInRequest): QueryAccountsStakedInRequest.AsObject;
  static serializeBinaryToWriter(message: QueryAccountsStakedInRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryAccountsStakedInRequest;
  static deserializeBinaryFromReader(message: QueryAccountsStakedInRequest, reader: jspb.BinaryReader): QueryAccountsStakedInRequest;
}

export namespace QueryAccountsStakedInRequest {
  export type AsObject = {
    poolName: string,
  }
}

export class QueryAccountsStakedInResponse extends jspb.Message {
  getAddressesList(): Array<string>;
  setAddressesList(value: Array<string>): QueryAccountsStakedInResponse;
  clearAddressesList(): QueryAccountsStakedInResponse;
  addAddresses(value: string, index?: number): QueryAccountsStakedInResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryAccountsStakedInResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryAccountsStakedInResponse): QueryAccountsStakedInResponse.AsObject;
  static serializeBinaryToWriter(message: QueryAccountsStakedInResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryAccountsStakedInResponse;
  static deserializeBinaryFromReader(message: QueryAccountsStakedInResponse, reader: jspb.BinaryReader): QueryAccountsStakedInResponse;
}

export namespace QueryAccountsStakedInResponse {
  export type AsObject = {
    addressesList: Array<string>,
  }
}

export class QueryNumPoolsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryNumPoolsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryNumPoolsRequest): QueryNumPoolsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryNumPoolsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryNumPoolsRequest;
  static deserializeBinaryFromReader(message: QueryNumPoolsRequest, reader: jspb.BinaryReader): QueryNumPoolsRequest;
}

export namespace QueryNumPoolsRequest {
  export type AsObject = {
  }
}

export class QueryNumPoolsResponse extends jspb.Message {
  getNumPools(): number;
  setNumPools(value: number): QueryNumPoolsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryNumPoolsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryNumPoolsResponse): QueryNumPoolsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryNumPoolsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryNumPoolsResponse;
  static deserializeBinaryFromReader(message: QueryNumPoolsResponse, reader: jspb.BinaryReader): QueryNumPoolsResponse;
}

export namespace QueryNumPoolsResponse {
  export type AsObject = {
    numPools: number,
  }
}

export class QueryRewardClaimInfoRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): QueryRewardClaimInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRewardClaimInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRewardClaimInfoRequest): QueryRewardClaimInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryRewardClaimInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRewardClaimInfoRequest;
  static deserializeBinaryFromReader(message: QueryRewardClaimInfoRequest, reader: jspb.BinaryReader): QueryRewardClaimInfoRequest;
}

export namespace QueryRewardClaimInfoRequest {
  export type AsObject = {
    address: string,
  }
}

export class QueryRewardClaimInfoResponse extends jspb.Message {
  getRewardClaimInfo(): sgn_farming_v1_farming_pb.RewardClaimInfo | undefined;
  setRewardClaimInfo(value?: sgn_farming_v1_farming_pb.RewardClaimInfo): QueryRewardClaimInfoResponse;
  hasRewardClaimInfo(): boolean;
  clearRewardClaimInfo(): QueryRewardClaimInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRewardClaimInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRewardClaimInfoResponse): QueryRewardClaimInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryRewardClaimInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRewardClaimInfoResponse;
  static deserializeBinaryFromReader(message: QueryRewardClaimInfoResponse, reader: jspb.BinaryReader): QueryRewardClaimInfoResponse;
}

export namespace QueryRewardClaimInfoResponse {
  export type AsObject = {
    rewardClaimInfo?: sgn_farming_v1_farming_pb.RewardClaimInfo.AsObject,
  }
}

