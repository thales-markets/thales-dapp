import * as jspb from 'google-protobuf'

import * as sgn_cbridge_v1_cbridge_pb from '../../../sgn/cbridge/v1/cbridge_pb';


export class EmptyRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EmptyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EmptyRequest): EmptyRequest.AsObject;
  static serializeBinaryToWriter(message: EmptyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EmptyRequest;
  static deserializeBinaryFromReader(message: EmptyRequest, reader: jspb.BinaryReader): EmptyRequest;
}

export namespace EmptyRequest {
  export type AsObject = {
  }
}

export class QueryParamsResponse extends jspb.Message {
  getParams(): sgn_cbridge_v1_cbridge_pb.Params | undefined;
  setParams(value?: sgn_cbridge_v1_cbridge_pb.Params): QueryParamsResponse;
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
    params?: sgn_cbridge_v1_cbridge_pb.Params.AsObject,
  }
}

export class QueryConfigResponse extends jspb.Message {
  getCbrconfig(): sgn_cbridge_v1_cbridge_pb.CbrConfig | undefined;
  setCbrconfig(value?: sgn_cbridge_v1_cbridge_pb.CbrConfig): QueryConfigResponse;
  hasCbrconfig(): boolean;
  clearCbrconfig(): QueryConfigResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryConfigResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryConfigResponse): QueryConfigResponse.AsObject;
  static serializeBinaryToWriter(message: QueryConfigResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryConfigResponse;
  static deserializeBinaryFromReader(message: QueryConfigResponse, reader: jspb.BinaryReader): QueryConfigResponse;
}

export namespace QueryConfigResponse {
  export type AsObject = {
    cbrconfig?: sgn_cbridge_v1_cbridge_pb.CbrConfig.AsObject,
  }
}

export class QueryRelayRequest extends jspb.Message {
  getXrefId(): Uint8Array | string;
  getXrefId_asU8(): Uint8Array;
  getXrefId_asB64(): string;
  setXrefId(value: Uint8Array | string): QueryRelayRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRelayRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRelayRequest): QueryRelayRequest.AsObject;
  static serializeBinaryToWriter(message: QueryRelayRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRelayRequest;
  static deserializeBinaryFromReader(message: QueryRelayRequest, reader: jspb.BinaryReader): QueryRelayRequest;
}

export namespace QueryRelayRequest {
  export type AsObject = {
    xrefId: Uint8Array | string,
  }
}

export class QueryRelayResponse extends jspb.Message {
  getXferRelay(): sgn_cbridge_v1_cbridge_pb.XferRelay | undefined;
  setXferRelay(value?: sgn_cbridge_v1_cbridge_pb.XferRelay): QueryRelayResponse;
  hasXferRelay(): boolean;
  clearXferRelay(): QueryRelayResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRelayResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRelayResponse): QueryRelayResponse.AsObject;
  static serializeBinaryToWriter(message: QueryRelayResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRelayResponse;
  static deserializeBinaryFromReader(message: QueryRelayResponse, reader: jspb.BinaryReader): QueryRelayResponse;
}

export namespace QueryRelayResponse {
  export type AsObject = {
    xferRelay?: sgn_cbridge_v1_cbridge_pb.XferRelay.AsObject,
  }
}

export class QueryChainSignersRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): QueryChainSignersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryChainSignersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryChainSignersRequest): QueryChainSignersRequest.AsObject;
  static serializeBinaryToWriter(message: QueryChainSignersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryChainSignersRequest;
  static deserializeBinaryFromReader(message: QueryChainSignersRequest, reader: jspb.BinaryReader): QueryChainSignersRequest;
}

export namespace QueryChainSignersRequest {
  export type AsObject = {
    chainId: number,
  }
}

export class QueryChainSignersResponse extends jspb.Message {
  getChainSigners(): sgn_cbridge_v1_cbridge_pb.ChainSigners | undefined;
  setChainSigners(value?: sgn_cbridge_v1_cbridge_pb.ChainSigners): QueryChainSignersResponse;
  hasChainSigners(): boolean;
  clearChainSigners(): QueryChainSignersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryChainSignersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryChainSignersResponse): QueryChainSignersResponse.AsObject;
  static serializeBinaryToWriter(message: QueryChainSignersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryChainSignersResponse;
  static deserializeBinaryFromReader(message: QueryChainSignersResponse, reader: jspb.BinaryReader): QueryChainSignersResponse;
}

export namespace QueryChainSignersResponse {
  export type AsObject = {
    chainSigners?: sgn_cbridge_v1_cbridge_pb.ChainSigners.AsObject,
  }
}

export class QueryLatestSignersResponse extends jspb.Message {
  getLatestSigners(): sgn_cbridge_v1_cbridge_pb.LatestSigners | undefined;
  setLatestSigners(value?: sgn_cbridge_v1_cbridge_pb.LatestSigners): QueryLatestSignersResponse;
  hasLatestSigners(): boolean;
  clearLatestSigners(): QueryLatestSignersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryLatestSignersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryLatestSignersResponse): QueryLatestSignersResponse.AsObject;
  static serializeBinaryToWriter(message: QueryLatestSignersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryLatestSignersResponse;
  static deserializeBinaryFromReader(message: QueryLatestSignersResponse, reader: jspb.BinaryReader): QueryLatestSignersResponse;
}

export namespace QueryLatestSignersResponse {
  export type AsObject = {
    latestSigners?: sgn_cbridge_v1_cbridge_pb.LatestSigners.AsObject,
  }
}

export class QueryDebugAnyRequest extends jspb.Message {
  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): QueryDebugAnyRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDebugAnyRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDebugAnyRequest): QueryDebugAnyRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDebugAnyRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDebugAnyRequest;
  static deserializeBinaryFromReader(message: QueryDebugAnyRequest, reader: jspb.BinaryReader): QueryDebugAnyRequest;
}

export namespace QueryDebugAnyRequest {
  export type AsObject = {
    key: Uint8Array | string,
  }
}

export class QueryDebugAnyResponse extends jspb.Message {
  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): QueryDebugAnyResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDebugAnyResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDebugAnyResponse): QueryDebugAnyResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDebugAnyResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDebugAnyResponse;
  static deserializeBinaryFromReader(message: QueryDebugAnyResponse, reader: jspb.BinaryReader): QueryDebugAnyResponse;
}

export namespace QueryDebugAnyResponse {
  export type AsObject = {
    data: Uint8Array | string,
  }
}

export class QueryAssetsResponse extends jspb.Message {
  getAssetsList(): Array<sgn_cbridge_v1_cbridge_pb.ChainAsset>;
  setAssetsList(value: Array<sgn_cbridge_v1_cbridge_pb.ChainAsset>): QueryAssetsResponse;
  clearAssetsList(): QueryAssetsResponse;
  addAssets(value?: sgn_cbridge_v1_cbridge_pb.ChainAsset, index?: number): sgn_cbridge_v1_cbridge_pb.ChainAsset;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryAssetsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryAssetsResponse): QueryAssetsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryAssetsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryAssetsResponse;
  static deserializeBinaryFromReader(message: QueryAssetsResponse, reader: jspb.BinaryReader): QueryAssetsResponse;
}

export namespace QueryAssetsResponse {
  export type AsObject = {
    assetsList: Array<sgn_cbridge_v1_cbridge_pb.ChainAsset.AsObject>,
  }
}

export class QueryAssetPriceRequest extends jspb.Message {
  getSymbol(): string;
  setSymbol(value: string): QueryAssetPriceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryAssetPriceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryAssetPriceRequest): QueryAssetPriceRequest.AsObject;
  static serializeBinaryToWriter(message: QueryAssetPriceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryAssetPriceRequest;
  static deserializeBinaryFromReader(message: QueryAssetPriceRequest, reader: jspb.BinaryReader): QueryAssetPriceRequest;
}

export namespace QueryAssetPriceRequest {
  export type AsObject = {
    symbol: string,
  }
}

export class QueryAssetPriceResponse extends jspb.Message {
  getPrice(): number;
  setPrice(value: number): QueryAssetPriceResponse;

  getExtraPower10(): number;
  setExtraPower10(value: number): QueryAssetPriceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryAssetPriceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryAssetPriceResponse): QueryAssetPriceResponse.AsObject;
  static serializeBinaryToWriter(message: QueryAssetPriceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryAssetPriceResponse;
  static deserializeBinaryFromReader(message: QueryAssetPriceResponse, reader: jspb.BinaryReader): QueryAssetPriceResponse;
}

export namespace QueryAssetPriceResponse {
  export type AsObject = {
    price: number,
    extraPower10: number,
  }
}

export class QueryLPsRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): QueryLPsRequest;

  getTokenAddr(): string;
  setTokenAddr(value: string): QueryLPsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryLPsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryLPsRequest): QueryLPsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryLPsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryLPsRequest;
  static deserializeBinaryFromReader(message: QueryLPsRequest, reader: jspb.BinaryReader): QueryLPsRequest;
}

export namespace QueryLPsRequest {
  export type AsObject = {
    chainId: number,
    tokenAddr: string,
  }
}

export class QueryLPsResponse extends jspb.Message {
  getLpsList(): Array<string>;
  setLpsList(value: Array<string>): QueryLPsResponse;
  clearLpsList(): QueryLPsResponse;
  addLps(value: string, index?: number): QueryLPsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryLPsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryLPsResponse): QueryLPsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryLPsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryLPsResponse;
  static deserializeBinaryFromReader(message: QueryLPsResponse, reader: jspb.BinaryReader): QueryLPsResponse;
}

export namespace QueryLPsResponse {
  export type AsObject = {
    lpsList: Array<string>,
  }
}

export class CheckLiqSumRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): CheckLiqSumRequest;

  getTokenAddr(): string;
  setTokenAddr(value: string): CheckLiqSumRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckLiqSumRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckLiqSumRequest): CheckLiqSumRequest.AsObject;
  static serializeBinaryToWriter(message: CheckLiqSumRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckLiqSumRequest;
  static deserializeBinaryFromReader(message: CheckLiqSumRequest, reader: jspb.BinaryReader): CheckLiqSumRequest;
}

export namespace CheckLiqSumRequest {
  export type AsObject = {
    chainId: number,
    tokenAddr: string,
  }
}

export class CheckLiqSumResponse extends jspb.Message {
  getLiqsum(): string;
  setLiqsum(value: string): CheckLiqSumResponse;

  getSumiter(): string;
  setSumiter(value: string): CheckLiqSumResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckLiqSumResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckLiqSumResponse): CheckLiqSumResponse.AsObject;
  static serializeBinaryToWriter(message: CheckLiqSumResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckLiqSumResponse;
  static deserializeBinaryFromReader(message: CheckLiqSumResponse, reader: jspb.BinaryReader): CheckLiqSumResponse;
}

export namespace CheckLiqSumResponse {
  export type AsObject = {
    liqsum: string,
    sumiter: string,
  }
}

export class ChainTokensConfigRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainTokensConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ChainTokensConfigRequest): ChainTokensConfigRequest.AsObject;
  static serializeBinaryToWriter(message: ChainTokensConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainTokensConfigRequest;
  static deserializeBinaryFromReader(message: ChainTokensConfigRequest, reader: jspb.BinaryReader): ChainTokensConfigRequest;
}

export namespace ChainTokensConfigRequest {
  export type AsObject = {
  }
}

export class ChainTokensConfigResponse extends jspb.Message {
  getChainTokensMap(): jspb.Map<string, Tokens>;
  clearChainTokensMap(): ChainTokensConfigResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainTokensConfigResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ChainTokensConfigResponse): ChainTokensConfigResponse.AsObject;
  static serializeBinaryToWriter(message: ChainTokensConfigResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainTokensConfigResponse;
  static deserializeBinaryFromReader(message: ChainTokensConfigResponse, reader: jspb.BinaryReader): ChainTokensConfigResponse;
}

export namespace ChainTokensConfigResponse {
  export type AsObject = {
    chainTokensMap: Array<[string, Tokens.AsObject]>,
  }
}

export class Tokens extends jspb.Message {
  getTokensList(): Array<Token>;
  setTokensList(value: Array<Token>): Tokens;
  clearTokensList(): Tokens;
  addTokens(value?: Token, index?: number): Token;

  getContractAddr(): string;
  setContractAddr(value: string): Tokens;

  getBlockDelay(): number;
  setBlockDelay(value: number): Tokens;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tokens.AsObject;
  static toObject(includeInstance: boolean, msg: Tokens): Tokens.AsObject;
  static serializeBinaryToWriter(message: Tokens, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tokens;
  static deserializeBinaryFromReader(message: Tokens, reader: jspb.BinaryReader): Tokens;
}

export namespace Tokens {
  export type AsObject = {
    tokensList: Array<Token.AsObject>,
    contractAddr: string,
    blockDelay: number,
  }
}

export class GetFeeRequest extends jspb.Message {
  getSrcChainId(): number;
  setSrcChainId(value: number): GetFeeRequest;

  getDstChainId(): number;
  setDstChainId(value: number): GetFeeRequest;

  getSrcTokenAddr(): string;
  setSrcTokenAddr(value: string): GetFeeRequest;

  getAmt(): string;
  setAmt(value: string): GetFeeRequest;

  getLpAddr(): string;
  setLpAddr(value: string): GetFeeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeeRequest): GetFeeRequest.AsObject;
  static serializeBinaryToWriter(message: GetFeeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeeRequest;
  static deserializeBinaryFromReader(message: GetFeeRequest, reader: jspb.BinaryReader): GetFeeRequest;
}

export namespace GetFeeRequest {
  export type AsObject = {
    srcChainId: number,
    dstChainId: number,
    srcTokenAddr: string,
    amt: string,
    lpAddr: string,
  }
}

export class GetFeeResponse extends jspb.Message {
  getEqValueTokenAmt(): string;
  setEqValueTokenAmt(value: string): GetFeeResponse;

  getPercFee(): string;
  setPercFee(value: string): GetFeeResponse;

  getBaseFee(): string;
  setBaseFee(value: string): GetFeeResponse;

  getDecimal(): number;
  setDecimal(value: number): GetFeeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeeResponse): GetFeeResponse.AsObject;
  static serializeBinaryToWriter(message: GetFeeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeeResponse;
  static deserializeBinaryFromReader(message: GetFeeResponse, reader: jspb.BinaryReader): GetFeeResponse;
}

export namespace GetFeeResponse {
  export type AsObject = {
    eqValueTokenAmt: string,
    percFee: string,
    baseFee: string,
    decimal: number,
  }
}

export class GetFeePercentageRequest extends jspb.Message {
  getSrcChainId(): number;
  setSrcChainId(value: number): GetFeePercentageRequest;

  getDstChainId(): number;
  setDstChainId(value: number): GetFeePercentageRequest;

  getSymbol(): string;
  setSymbol(value: string): GetFeePercentageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeePercentageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeePercentageRequest): GetFeePercentageRequest.AsObject;
  static serializeBinaryToWriter(message: GetFeePercentageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeePercentageRequest;
  static deserializeBinaryFromReader(message: GetFeePercentageRequest, reader: jspb.BinaryReader): GetFeePercentageRequest;
}

export namespace GetFeePercentageRequest {
  export type AsObject = {
    srcChainId: number,
    dstChainId: number,
    symbol: string,
  }
}

export class GetFeePercentageResponse extends jspb.Message {
  getFeePerc(): number;
  setFeePerc(value: number): GetFeePercentageResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeePercentageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeePercentageResponse): GetFeePercentageResponse.AsObject;
  static serializeBinaryToWriter(message: GetFeePercentageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeePercentageResponse;
  static deserializeBinaryFromReader(message: GetFeePercentageResponse, reader: jspb.BinaryReader): GetFeePercentageResponse;
}

export namespace GetFeePercentageResponse {
  export type AsObject = {
    feePerc: number,
  }
}

export class QueryTransferStatusRequest extends jspb.Message {
  getTransferIdList(): Array<string>;
  setTransferIdList(value: Array<string>): QueryTransferStatusRequest;
  clearTransferIdList(): QueryTransferStatusRequest;
  addTransferId(value: string, index?: number): QueryTransferStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTransferStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTransferStatusRequest): QueryTransferStatusRequest.AsObject;
  static serializeBinaryToWriter(message: QueryTransferStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTransferStatusRequest;
  static deserializeBinaryFromReader(message: QueryTransferStatusRequest, reader: jspb.BinaryReader): QueryTransferStatusRequest;
}

export namespace QueryTransferStatusRequest {
  export type AsObject = {
    transferIdList: Array<string>,
  }
}

export class QueryTransferStatusResponse extends jspb.Message {
  getStatusMap(): jspb.Map<string, TransferStatus>;
  clearStatusMap(): QueryTransferStatusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTransferStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTransferStatusResponse): QueryTransferStatusResponse.AsObject;
  static serializeBinaryToWriter(message: QueryTransferStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTransferStatusResponse;
  static deserializeBinaryFromReader(message: QueryTransferStatusResponse, reader: jspb.BinaryReader): QueryTransferStatusResponse;
}

export namespace QueryTransferStatusResponse {
  export type AsObject = {
    statusMap: Array<[string, TransferStatus.AsObject]>,
  }
}

export class LiquidityDetail extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): LiquidityDetail;

  getToken(): Token | undefined;
  setToken(value?: Token): LiquidityDetail;
  hasToken(): boolean;
  clearToken(): LiquidityDetail;

  getUsrLiquidity(): string;
  setUsrLiquidity(value: string): LiquidityDetail;

  getUsrLpFeeEarning(): string;
  setUsrLpFeeEarning(value: string): LiquidityDetail;

  getTotalLiquidity(): string;
  setTotalLiquidity(value: string): LiquidityDetail;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LiquidityDetail.AsObject;
  static toObject(includeInstance: boolean, msg: LiquidityDetail): LiquidityDetail.AsObject;
  static serializeBinaryToWriter(message: LiquidityDetail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LiquidityDetail;
  static deserializeBinaryFromReader(message: LiquidityDetail, reader: jspb.BinaryReader): LiquidityDetail;
}

export namespace LiquidityDetail {
  export type AsObject = {
    chainId: number,
    token?: Token.AsObject,
    usrLiquidity: string,
    usrLpFeeEarning: string,
    totalLiquidity: string,
  }
}

export class ChainTokenAddrPair extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): ChainTokenAddrPair;

  getTokenAddr(): string;
  setTokenAddr(value: string): ChainTokenAddrPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainTokenAddrPair.AsObject;
  static toObject(includeInstance: boolean, msg: ChainTokenAddrPair): ChainTokenAddrPair.AsObject;
  static serializeBinaryToWriter(message: ChainTokenAddrPair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainTokenAddrPair;
  static deserializeBinaryFromReader(message: ChainTokenAddrPair, reader: jspb.BinaryReader): ChainTokenAddrPair;
}

export namespace ChainTokenAddrPair {
  export type AsObject = {
    chainId: number,
    tokenAddr: string,
  }
}

export class LiquidityDetailListRequest extends jspb.Message {
  getLpAddr(): string;
  setLpAddr(value: string): LiquidityDetailListRequest;

  getChainTokenList(): Array<ChainTokenAddrPair>;
  setChainTokenList(value: Array<ChainTokenAddrPair>): LiquidityDetailListRequest;
  clearChainTokenList(): LiquidityDetailListRequest;
  addChainToken(value?: ChainTokenAddrPair, index?: number): ChainTokenAddrPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LiquidityDetailListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LiquidityDetailListRequest): LiquidityDetailListRequest.AsObject;
  static serializeBinaryToWriter(message: LiquidityDetailListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LiquidityDetailListRequest;
  static deserializeBinaryFromReader(message: LiquidityDetailListRequest, reader: jspb.BinaryReader): LiquidityDetailListRequest;
}

export namespace LiquidityDetailListRequest {
  export type AsObject = {
    lpAddr: string,
    chainTokenList: Array<ChainTokenAddrPair.AsObject>,
  }
}

export class LiquidityDetailListResponse extends jspb.Message {
  getLiquidityDetailList(): Array<LiquidityDetail>;
  setLiquidityDetailList(value: Array<LiquidityDetail>): LiquidityDetailListResponse;
  clearLiquidityDetailList(): LiquidityDetailListResponse;
  addLiquidityDetail(value?: LiquidityDetail, index?: number): LiquidityDetail;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LiquidityDetailListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LiquidityDetailListResponse): LiquidityDetailListResponse.AsObject;
  static serializeBinaryToWriter(message: LiquidityDetailListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LiquidityDetailListResponse;
  static deserializeBinaryFromReader(message: LiquidityDetailListResponse, reader: jspb.BinaryReader): LiquidityDetailListResponse;
}

export namespace LiquidityDetailListResponse {
  export type AsObject = {
    liquidityDetailList: Array<LiquidityDetail.AsObject>,
  }
}

export class QueryTotalLiquidityRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): QueryTotalLiquidityRequest;

  getTokenAddr(): string;
  setTokenAddr(value: string): QueryTotalLiquidityRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTotalLiquidityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTotalLiquidityRequest): QueryTotalLiquidityRequest.AsObject;
  static serializeBinaryToWriter(message: QueryTotalLiquidityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTotalLiquidityRequest;
  static deserializeBinaryFromReader(message: QueryTotalLiquidityRequest, reader: jspb.BinaryReader): QueryTotalLiquidityRequest;
}

export namespace QueryTotalLiquidityRequest {
  export type AsObject = {
    chainId: number,
    tokenAddr: string,
  }
}

export class QueryTotalLiquidityResponse extends jspb.Message {
  getTotalLiq(): string;
  setTotalLiq(value: string): QueryTotalLiquidityResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTotalLiquidityResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTotalLiquidityResponse): QueryTotalLiquidityResponse.AsObject;
  static serializeBinaryToWriter(message: QueryTotalLiquidityResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTotalLiquidityResponse;
  static deserializeBinaryFromReader(message: QueryTotalLiquidityResponse, reader: jspb.BinaryReader): QueryTotalLiquidityResponse;
}

export namespace QueryTotalLiquidityResponse {
  export type AsObject = {
    totalLiq: string,
  }
}

export class QueryAddLiquidityStatusRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): QueryAddLiquidityStatusRequest;

  getSeqNum(): number;
  setSeqNum(value: number): QueryAddLiquidityStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryAddLiquidityStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryAddLiquidityStatusRequest): QueryAddLiquidityStatusRequest.AsObject;
  static serializeBinaryToWriter(message: QueryAddLiquidityStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryAddLiquidityStatusRequest;
  static deserializeBinaryFromReader(message: QueryAddLiquidityStatusRequest, reader: jspb.BinaryReader): QueryAddLiquidityStatusRequest;
}

export namespace QueryAddLiquidityStatusRequest {
  export type AsObject = {
    chainId: number,
    seqNum: number,
  }
}

export class QueryWithdrawLiquidityStatusRequest extends jspb.Message {
  getSeqNum(): number;
  setSeqNum(value: number): QueryWithdrawLiquidityStatusRequest;

  getUsrAddr(): string;
  setUsrAddr(value: string): QueryWithdrawLiquidityStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryWithdrawLiquidityStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryWithdrawLiquidityStatusRequest): QueryWithdrawLiquidityStatusRequest.AsObject;
  static serializeBinaryToWriter(message: QueryWithdrawLiquidityStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryWithdrawLiquidityStatusRequest;
  static deserializeBinaryFromReader(message: QueryWithdrawLiquidityStatusRequest, reader: jspb.BinaryReader): QueryWithdrawLiquidityStatusRequest;
}

export namespace QueryWithdrawLiquidityStatusRequest {
  export type AsObject = {
    seqNum: number,
    usrAddr: string,
  }
}

export class QueryLiquidityStatusResponse extends jspb.Message {
  getStatus(): WithdrawStatus;
  setStatus(value: WithdrawStatus): QueryLiquidityStatusResponse;

  getDetail(): sgn_cbridge_v1_cbridge_pb.WithdrawDetail | undefined;
  setDetail(value?: sgn_cbridge_v1_cbridge_pb.WithdrawDetail): QueryLiquidityStatusResponse;
  hasDetail(): boolean;
  clearDetail(): QueryLiquidityStatusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryLiquidityStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryLiquidityStatusResponse): QueryLiquidityStatusResponse.AsObject;
  static serializeBinaryToWriter(message: QueryLiquidityStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryLiquidityStatusResponse;
  static deserializeBinaryFromReader(message: QueryLiquidityStatusResponse, reader: jspb.BinaryReader): QueryLiquidityStatusResponse;
}

export namespace QueryLiquidityStatusResponse {
  export type AsObject = {
    status: WithdrawStatus,
    detail?: sgn_cbridge_v1_cbridge_pb.WithdrawDetail.AsObject,
  }
}

export class CheckChainTokenValidRequest extends jspb.Message {
  getSrcChainId(): number;
  setSrcChainId(value: number): CheckChainTokenValidRequest;

  getSrcTokenAddr(): string;
  setSrcTokenAddr(value: string): CheckChainTokenValidRequest;

  getDestChainId(): number;
  setDestChainId(value: number): CheckChainTokenValidRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckChainTokenValidRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CheckChainTokenValidRequest): CheckChainTokenValidRequest.AsObject;
  static serializeBinaryToWriter(message: CheckChainTokenValidRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckChainTokenValidRequest;
  static deserializeBinaryFromReader(message: CheckChainTokenValidRequest, reader: jspb.BinaryReader): CheckChainTokenValidRequest;
}

export namespace CheckChainTokenValidRequest {
  export type AsObject = {
    srcChainId: number,
    srcTokenAddr: string,
    destChainId: number,
  }
}

export class CheckChainTokenValidResponse extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): CheckChainTokenValidResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CheckChainTokenValidResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CheckChainTokenValidResponse): CheckChainTokenValidResponse.AsObject;
  static serializeBinaryToWriter(message: CheckChainTokenValidResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CheckChainTokenValidResponse;
  static deserializeBinaryFromReader(message: CheckChainTokenValidResponse, reader: jspb.BinaryReader): CheckChainTokenValidResponse;
}

export namespace CheckChainTokenValidResponse {
  export type AsObject = {
    valid: boolean,
  }
}

export class TransferStatus extends jspb.Message {
  getGatewayStatus(): TransferHistoryStatus;
  setGatewayStatus(value: TransferHistoryStatus): TransferStatus;

  getSgnStatus(): sgn_cbridge_v1_cbridge_pb.XferStatus;
  setSgnStatus(value: sgn_cbridge_v1_cbridge_pb.XferStatus): TransferStatus;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferStatus.AsObject;
  static toObject(includeInstance: boolean, msg: TransferStatus): TransferStatus.AsObject;
  static serializeBinaryToWriter(message: TransferStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferStatus;
  static deserializeBinaryFromReader(message: TransferStatus, reader: jspb.BinaryReader): TransferStatus;
}

export namespace TransferStatus {
  export type AsObject = {
    gatewayStatus: TransferHistoryStatus,
    sgnStatus: sgn_cbridge_v1_cbridge_pb.XferStatus,
  }
}

export class Token extends jspb.Message {
  getSymbol(): string;
  setSymbol(value: string): Token;

  getAddress(): string;
  setAddress(value: string): Token;

  getDecimal(): number;
  setDecimal(value: number): Token;

  getXferDisabled(): boolean;
  setXferDisabled(value: boolean): Token;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Token.AsObject;
  static toObject(includeInstance: boolean, msg: Token): Token.AsObject;
  static serializeBinaryToWriter(message: Token, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Token;
  static deserializeBinaryFromReader(message: Token, reader: jspb.BinaryReader): Token;
}

export namespace Token {
  export type AsObject = {
    symbol: string,
    address: string,
    decimal: number,
    xferDisabled: boolean,
  }
}

export enum WithdrawStatus { 
  WD_UNKNOWN = 0,
  WD_WAITING_FOR_SGN = 1,
  WD_WAITING_FOR_LP = 2,
  WD_SUBMITTING = 3,
  WD_COMPLETED = 4,
  WD_FAILED = 5,
  WD_DELAYED = 6,
}
export enum TransferHistoryStatus { 
  TRANSFER_UNKNOWN = 0,
  TRANSFER_SUBMITTING = 1,
  TRANSFER_FAILED = 2,
  TRANSFER_WAITING_FOR_SGN_CONFIRMATION = 3,
  TRANSFER_WAITING_FOR_FUND_RELEASE = 4,
  TRANSFER_COMPLETED = 5,
  TRANSFER_TO_BE_REFUNDED = 6,
  TRANSFER_REQUESTING_REFUND = 7,
  TRANSFER_REFUND_TO_BE_CONFIRMED = 8,
  TRANSFER_CONFIRMING_YOUR_REFUND = 9,
  TRANSFER_REFUNDED = 10,
  TRANSFER_DELAYED = 11,
}
