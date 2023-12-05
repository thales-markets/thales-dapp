import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_api_annotations_pb from '../../../google/api/annotations_pb';
import * as sgn_common_v1_common_pb from '../../../sgn/common/v1/common_pb';
import * as sgn_pegbridge_v1_pegbridge_pb from '../../../sgn/pegbridge/v1/pegbridge_pb';


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
  getParams(): sgn_pegbridge_v1_pegbridge_pb.Params | undefined;
  setParams(value?: sgn_pegbridge_v1_pegbridge_pb.Params): QueryParamsResponse;
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
    params?: sgn_pegbridge_v1_pegbridge_pb.Params.AsObject,
  }
}

export class QueryConfigRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryConfigRequest): QueryConfigRequest.AsObject;
  static serializeBinaryToWriter(message: QueryConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryConfigRequest;
  static deserializeBinaryFromReader(message: QueryConfigRequest, reader: jspb.BinaryReader): QueryConfigRequest;
}

export namespace QueryConfigRequest {
  export type AsObject = {
  }
}

export class QueryOrigPeggedPairsRequest extends jspb.Message {
  getOrig(): sgn_common_v1_common_pb.ContractInfo | undefined;
  setOrig(value?: sgn_common_v1_common_pb.ContractInfo): QueryOrigPeggedPairsRequest;
  hasOrig(): boolean;
  clearOrig(): QueryOrigPeggedPairsRequest;

  getPegged(): sgn_common_v1_common_pb.ContractInfo | undefined;
  setPegged(value?: sgn_common_v1_common_pb.ContractInfo): QueryOrigPeggedPairsRequest;
  hasPegged(): boolean;
  clearPegged(): QueryOrigPeggedPairsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryOrigPeggedPairsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryOrigPeggedPairsRequest): QueryOrigPeggedPairsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryOrigPeggedPairsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryOrigPeggedPairsRequest;
  static deserializeBinaryFromReader(message: QueryOrigPeggedPairsRequest, reader: jspb.BinaryReader): QueryOrigPeggedPairsRequest;
}

export namespace QueryOrigPeggedPairsRequest {
  export type AsObject = {
    orig?: sgn_common_v1_common_pb.ContractInfo.AsObject,
    pegged?: sgn_common_v1_common_pb.ContractInfo.AsObject,
  }
}

export class QueryOrigPeggedPairsResponse extends jspb.Message {
  getPairsList(): Array<sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair>;
  setPairsList(value: Array<sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair>): QueryOrigPeggedPairsResponse;
  clearPairsList(): QueryOrigPeggedPairsResponse;
  addPairs(value?: sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair, index?: number): sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryOrigPeggedPairsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryOrigPeggedPairsResponse): QueryOrigPeggedPairsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryOrigPeggedPairsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryOrigPeggedPairsResponse;
  static deserializeBinaryFromReader(message: QueryOrigPeggedPairsResponse, reader: jspb.BinaryReader): QueryOrigPeggedPairsResponse;
}

export namespace QueryOrigPeggedPairsResponse {
  export type AsObject = {
    pairsList: Array<sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair.AsObject>,
  }
}

export class QueryEstimatedAmountFeesRequest extends jspb.Message {
  getPair(): sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair | undefined;
  setPair(value?: sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair): QueryEstimatedAmountFeesRequest;
  hasPair(): boolean;
  clearPair(): QueryEstimatedAmountFeesRequest;

  getRequestAmount(): string;
  setRequestAmount(value: string): QueryEstimatedAmountFeesRequest;

  getMint(): boolean;
  setMint(value: boolean): QueryEstimatedAmountFeesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryEstimatedAmountFeesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryEstimatedAmountFeesRequest): QueryEstimatedAmountFeesRequest.AsObject;
  static serializeBinaryToWriter(message: QueryEstimatedAmountFeesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryEstimatedAmountFeesRequest;
  static deserializeBinaryFromReader(message: QueryEstimatedAmountFeesRequest, reader: jspb.BinaryReader): QueryEstimatedAmountFeesRequest;
}

export namespace QueryEstimatedAmountFeesRequest {
  export type AsObject = {
    pair?: sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair.AsObject,
    requestAmount: string,
    mint: boolean,
  }
}

export class QueryEstimatedAmountFeesResponse extends jspb.Message {
  getReceiveAmount(): string;
  setReceiveAmount(value: string): QueryEstimatedAmountFeesResponse;

  getBaseFee(): string;
  setBaseFee(value: string): QueryEstimatedAmountFeesResponse;

  getPercentageFee(): string;
  setPercentageFee(value: string): QueryEstimatedAmountFeesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryEstimatedAmountFeesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryEstimatedAmountFeesResponse): QueryEstimatedAmountFeesResponse.AsObject;
  static serializeBinaryToWriter(message: QueryEstimatedAmountFeesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryEstimatedAmountFeesResponse;
  static deserializeBinaryFromReader(message: QueryEstimatedAmountFeesResponse, reader: jspb.BinaryReader): QueryEstimatedAmountFeesResponse;
}

export namespace QueryEstimatedAmountFeesResponse {
  export type AsObject = {
    receiveAmount: string,
    baseFee: string,
    percentageFee: string,
  }
}

export class QueryDepositInfoRequest extends jspb.Message {
  getDepositId(): string;
  setDepositId(value: string): QueryDepositInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDepositInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDepositInfoRequest): QueryDepositInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDepositInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDepositInfoRequest;
  static deserializeBinaryFromReader(message: QueryDepositInfoRequest, reader: jspb.BinaryReader): QueryDepositInfoRequest;
}

export namespace QueryDepositInfoRequest {
  export type AsObject = {
    depositId: string,
  }
}

export class QueryDepositInfoResponse extends jspb.Message {
  getDepositInfo(): sgn_pegbridge_v1_pegbridge_pb.DepositInfo | undefined;
  setDepositInfo(value?: sgn_pegbridge_v1_pegbridge_pb.DepositInfo): QueryDepositInfoResponse;
  hasDepositInfo(): boolean;
  clearDepositInfo(): QueryDepositInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDepositInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDepositInfoResponse): QueryDepositInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDepositInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDepositInfoResponse;
  static deserializeBinaryFromReader(message: QueryDepositInfoResponse, reader: jspb.BinaryReader): QueryDepositInfoResponse;
}

export namespace QueryDepositInfoResponse {
  export type AsObject = {
    depositInfo?: sgn_pegbridge_v1_pegbridge_pb.DepositInfo.AsObject,
  }
}

export class QueryWithdrawInfoRequest extends jspb.Message {
  getWithdrawId(): string;
  setWithdrawId(value: string): QueryWithdrawInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryWithdrawInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryWithdrawInfoRequest): QueryWithdrawInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryWithdrawInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryWithdrawInfoRequest;
  static deserializeBinaryFromReader(message: QueryWithdrawInfoRequest, reader: jspb.BinaryReader): QueryWithdrawInfoRequest;
}

export namespace QueryWithdrawInfoRequest {
  export type AsObject = {
    withdrawId: string,
  }
}

export class QueryWithdrawInfoResponse extends jspb.Message {
  getWithdrawInfo(): sgn_pegbridge_v1_pegbridge_pb.WithdrawInfo | undefined;
  setWithdrawInfo(value?: sgn_pegbridge_v1_pegbridge_pb.WithdrawInfo): QueryWithdrawInfoResponse;
  hasWithdrawInfo(): boolean;
  clearWithdrawInfo(): QueryWithdrawInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryWithdrawInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryWithdrawInfoResponse): QueryWithdrawInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryWithdrawInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryWithdrawInfoResponse;
  static deserializeBinaryFromReader(message: QueryWithdrawInfoResponse, reader: jspb.BinaryReader): QueryWithdrawInfoResponse;
}

export namespace QueryWithdrawInfoResponse {
  export type AsObject = {
    withdrawInfo?: sgn_pegbridge_v1_pegbridge_pb.WithdrawInfo.AsObject,
  }
}

export class QueryMintInfoRequest extends jspb.Message {
  getMintId(): string;
  setMintId(value: string): QueryMintInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryMintInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryMintInfoRequest): QueryMintInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryMintInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryMintInfoRequest;
  static deserializeBinaryFromReader(message: QueryMintInfoRequest, reader: jspb.BinaryReader): QueryMintInfoRequest;
}

export namespace QueryMintInfoRequest {
  export type AsObject = {
    mintId: string,
  }
}

export class QueryMintInfoResponse extends jspb.Message {
  getMintInfo(): sgn_pegbridge_v1_pegbridge_pb.MintInfo | undefined;
  setMintInfo(value?: sgn_pegbridge_v1_pegbridge_pb.MintInfo): QueryMintInfoResponse;
  hasMintInfo(): boolean;
  clearMintInfo(): QueryMintInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryMintInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryMintInfoResponse): QueryMintInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryMintInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryMintInfoResponse;
  static deserializeBinaryFromReader(message: QueryMintInfoResponse, reader: jspb.BinaryReader): QueryMintInfoResponse;
}

export namespace QueryMintInfoResponse {
  export type AsObject = {
    mintInfo?: sgn_pegbridge_v1_pegbridge_pb.MintInfo.AsObject,
  }
}

export class QueryBurnInfoRequest extends jspb.Message {
  getBurnId(): string;
  setBurnId(value: string): QueryBurnInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryBurnInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryBurnInfoRequest): QueryBurnInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryBurnInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryBurnInfoRequest;
  static deserializeBinaryFromReader(message: QueryBurnInfoRequest, reader: jspb.BinaryReader): QueryBurnInfoRequest;
}

export namespace QueryBurnInfoRequest {
  export type AsObject = {
    burnId: string,
  }
}

export class QueryBurnInfoResponse extends jspb.Message {
  getBurnInfo(): sgn_pegbridge_v1_pegbridge_pb.BurnInfo | undefined;
  setBurnInfo(value?: sgn_pegbridge_v1_pegbridge_pb.BurnInfo): QueryBurnInfoResponse;
  hasBurnInfo(): boolean;
  clearBurnInfo(): QueryBurnInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryBurnInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryBurnInfoResponse): QueryBurnInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryBurnInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryBurnInfoResponse;
  static deserializeBinaryFromReader(message: QueryBurnInfoResponse, reader: jspb.BinaryReader): QueryBurnInfoResponse;
}

export namespace QueryBurnInfoResponse {
  export type AsObject = {
    burnInfo?: sgn_pegbridge_v1_pegbridge_pb.BurnInfo.AsObject,
  }
}

export class QueryFeeClaimInfoRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): QueryFeeClaimInfoRequest;

  getNonce(): number;
  setNonce(value: number): QueryFeeClaimInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryFeeClaimInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryFeeClaimInfoRequest): QueryFeeClaimInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryFeeClaimInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryFeeClaimInfoRequest;
  static deserializeBinaryFromReader(message: QueryFeeClaimInfoRequest, reader: jspb.BinaryReader): QueryFeeClaimInfoRequest;
}

export namespace QueryFeeClaimInfoRequest {
  export type AsObject = {
    address: string,
    nonce: number,
  }
}

export class QueryFeeClaimInfoResponse extends jspb.Message {
  getFeeClaimInfo(): sgn_pegbridge_v1_pegbridge_pb.FeeClaimInfo | undefined;
  setFeeClaimInfo(value?: sgn_pegbridge_v1_pegbridge_pb.FeeClaimInfo): QueryFeeClaimInfoResponse;
  hasFeeClaimInfo(): boolean;
  clearFeeClaimInfo(): QueryFeeClaimInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryFeeClaimInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryFeeClaimInfoResponse): QueryFeeClaimInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryFeeClaimInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryFeeClaimInfoResponse;
  static deserializeBinaryFromReader(message: QueryFeeClaimInfoResponse, reader: jspb.BinaryReader): QueryFeeClaimInfoResponse;
}

export namespace QueryFeeClaimInfoResponse {
  export type AsObject = {
    feeClaimInfo?: sgn_pegbridge_v1_pegbridge_pb.FeeClaimInfo.AsObject,
  }
}

export class QuerySupplyInfoRequest extends jspb.Message {
  getPeggedChainId(): number;
  setPeggedChainId(value: number): QuerySupplyInfoRequest;

  getPeggedAddress(): string;
  setPeggedAddress(value: string): QuerySupplyInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuerySupplyInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QuerySupplyInfoRequest): QuerySupplyInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QuerySupplyInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuerySupplyInfoRequest;
  static deserializeBinaryFromReader(message: QuerySupplyInfoRequest, reader: jspb.BinaryReader): QuerySupplyInfoRequest;
}

export namespace QuerySupplyInfoRequest {
  export type AsObject = {
    peggedChainId: number,
    peggedAddress: string,
  }
}

export class QuerySupplyInfoResponse extends jspb.Message {
  getTotal(): string;
  setTotal(value: string): QuerySupplyInfoResponse;

  getCap(): string;
  setCap(value: string): QuerySupplyInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuerySupplyInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QuerySupplyInfoResponse): QuerySupplyInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QuerySupplyInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuerySupplyInfoResponse;
  static deserializeBinaryFromReader(message: QuerySupplyInfoResponse, reader: jspb.BinaryReader): QuerySupplyInfoResponse;
}

export namespace QuerySupplyInfoResponse {
  export type AsObject = {
    total: string,
    cap: string,
  }
}

export class QueryRefundClaimInfoRequest extends jspb.Message {
  getDepositId(): string;
  setDepositId(value: string): QueryRefundClaimInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRefundClaimInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRefundClaimInfoRequest): QueryRefundClaimInfoRequest.AsObject;
  static serializeBinaryToWriter(message: QueryRefundClaimInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRefundClaimInfoRequest;
  static deserializeBinaryFromReader(message: QueryRefundClaimInfoRequest, reader: jspb.BinaryReader): QueryRefundClaimInfoRequest;
}

export namespace QueryRefundClaimInfoRequest {
  export type AsObject = {
    depositId: string,
  }
}

export class QueryRefundClaimInfoResponse extends jspb.Message {
  getWithdrawId(): string;
  setWithdrawId(value: string): QueryRefundClaimInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRefundClaimInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRefundClaimInfoResponse): QueryRefundClaimInfoResponse.AsObject;
  static serializeBinaryToWriter(message: QueryRefundClaimInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRefundClaimInfoResponse;
  static deserializeBinaryFromReader(message: QueryRefundClaimInfoResponse, reader: jspb.BinaryReader): QueryRefundClaimInfoResponse;
}

export namespace QueryRefundClaimInfoResponse {
  export type AsObject = {
    withdrawId: string,
  }
}

