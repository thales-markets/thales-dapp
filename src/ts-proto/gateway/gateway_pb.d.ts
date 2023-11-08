import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../gogoproto/gogo_pb';
import * as google_api_annotations_pb from '../google/api/annotations_pb';
import * as sgn_cbridge_v1_query_pb from '../sgn/cbridge/v1/query_pb';
import * as sgn_cbridge_v1_cbridge_pb from '../sgn/cbridge/v1/cbridge_pb';
import * as sgn_common_v1_common_pb from '../sgn/common/v1/common_pb';
import * as sgn_farming_v1_farming_pb from '../sgn/farming/v1/farming_pb';
import * as sgn_distribution_v1_distribution_pb from '../sgn/distribution/v1/distribution_pb';
import * as sgn_pegbridge_v1_pegbridge_pb from '../sgn/pegbridge/v1/pegbridge_pb';
import * as sgn_message_v1_query_pb from '../sgn/message/v1/query_pb';
import * as sgn_pegbridge_v1_tx_pb from '../sgn/pegbridge/v1/tx_pb';
import * as cosmos_base_v1beta1_coin_pb from '../cosmos/base/v1beta1/coin_pb';
import * as sgn_health_v1_health_pb from '../sgn/health/v1/health_pb';


export class InitPegRefundRequest extends jspb.Message {
  getRefId(): Uint8Array | string;
  getRefId_asU8(): Uint8Array;
  getRefId_asB64(): string;
  setRefId(value: Uint8Array | string): InitPegRefundRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitPegRefundRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitPegRefundRequest): InitPegRefundRequest.AsObject;
  static serializeBinaryToWriter(message: InitPegRefundRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitPegRefundRequest;
  static deserializeBinaryFromReader(message: InitPegRefundRequest, reader: jspb.BinaryReader): InitPegRefundRequest;
}

export namespace InitPegRefundRequest {
  export type AsObject = {
    refId: Uint8Array | string,
  }
}

export class InitPegRefundResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): InitPegRefundResponse;
  hasErr(): boolean;
  clearErr(): InitPegRefundResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitPegRefundResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InitPegRefundResponse): InitPegRefundResponse.AsObject;
  static serializeBinaryToWriter(message: InitPegRefundResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitPegRefundResponse;
  static deserializeBinaryFromReader(message: InitPegRefundResponse, reader: jspb.BinaryReader): InitPegRefundResponse;
}

export namespace InitPegRefundResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class InitWithdrawRequest extends jspb.Message {
  getWithdrawReq(): Uint8Array | string;
  getWithdrawReq_asU8(): Uint8Array;
  getWithdrawReq_asB64(): string;
  setWithdrawReq(value: Uint8Array | string): InitWithdrawRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): InitWithdrawRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitWithdrawRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InitWithdrawRequest): InitWithdrawRequest.AsObject;
  static serializeBinaryToWriter(message: InitWithdrawRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitWithdrawRequest;
  static deserializeBinaryFromReader(message: InitWithdrawRequest, reader: jspb.BinaryReader): InitWithdrawRequest;
}

export namespace InitWithdrawRequest {
  export type AsObject = {
    withdrawReq: Uint8Array | string,
    sig: Uint8Array | string,
  }
}

export class InitWithdrawResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): InitWithdrawResponse;
  hasErr(): boolean;
  clearErr(): InitWithdrawResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InitWithdrawResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InitWithdrawResponse): InitWithdrawResponse.AsObject;
  static serializeBinaryToWriter(message: InitWithdrawResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InitWithdrawResponse;
  static deserializeBinaryFromReader(message: InitWithdrawResponse, reader: jspb.BinaryReader): InitWithdrawResponse;
}

export namespace InitWithdrawResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetUsrBalanceRequest extends jspb.Message {
  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetUsrBalanceRequest;

  getSigAddr(): string;
  setSigAddr(value: string): GetUsrBalanceRequest;

  getUsrAddr(): string;
  setUsrAddr(value: string): GetUsrBalanceRequest;

  getChainId(): number;
  setChainId(value: number): GetUsrBalanceRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): GetUsrBalanceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUsrBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUsrBalanceRequest): GetUsrBalanceRequest.AsObject;
  static serializeBinaryToWriter(message: GetUsrBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUsrBalanceRequest;
  static deserializeBinaryFromReader(message: GetUsrBalanceRequest, reader: jspb.BinaryReader): GetUsrBalanceRequest;
}

export namespace GetUsrBalanceRequest {
  export type AsObject = {
    sig: Uint8Array | string,
    sigAddr: string,
    usrAddr: string,
    chainId: number,
    tokenSymbol: string,
  }
}

export class GetUsrBalanceResponse extends jspb.Message {
  getBalance(): string;
  setBalance(value: string): GetUsrBalanceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUsrBalanceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUsrBalanceResponse): GetUsrBalanceResponse.AsObject;
  static serializeBinaryToWriter(message: GetUsrBalanceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUsrBalanceResponse;
  static deserializeBinaryFromReader(message: GetUsrBalanceResponse, reader: jspb.BinaryReader): GetUsrBalanceResponse;
}

export namespace GetUsrBalanceResponse {
  export type AsObject = {
    balance: string,
  }
}

export class ClaimPegBridgeFeeRequest extends jspb.Message {
  getMsg(): sgn_pegbridge_v1_tx_pb.MsgClaimFee | undefined;
  setMsg(value?: sgn_pegbridge_v1_tx_pb.MsgClaimFee): ClaimPegBridgeFeeRequest;
  hasMsg(): boolean;
  clearMsg(): ClaimPegBridgeFeeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimPegBridgeFeeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimPegBridgeFeeRequest): ClaimPegBridgeFeeRequest.AsObject;
  static serializeBinaryToWriter(message: ClaimPegBridgeFeeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimPegBridgeFeeRequest;
  static deserializeBinaryFromReader(message: ClaimPegBridgeFeeRequest, reader: jspb.BinaryReader): ClaimPegBridgeFeeRequest;
}

export namespace ClaimPegBridgeFeeRequest {
  export type AsObject = {
    msg?: sgn_pegbridge_v1_tx_pb.MsgClaimFee.AsObject,
  }
}

export class ClaimPegBridgeFeeResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ClaimPegBridgeFeeResponse;
  hasErr(): boolean;
  clearErr(): ClaimPegBridgeFeeResponse;

  getResp(): sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse | undefined;
  setResp(value?: sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse): ClaimPegBridgeFeeResponse;
  hasResp(): boolean;
  clearResp(): ClaimPegBridgeFeeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimPegBridgeFeeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimPegBridgeFeeResponse): ClaimPegBridgeFeeResponse.AsObject;
  static serializeBinaryToWriter(message: ClaimPegBridgeFeeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimPegBridgeFeeResponse;
  static deserializeBinaryFromReader(message: ClaimPegBridgeFeeResponse, reader: jspb.BinaryReader): ClaimPegBridgeFeeResponse;
}

export namespace ClaimPegBridgeFeeResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    resp?: sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse.AsObject,
  }
}

export class GetCampaignScoresRequest extends jspb.Message {
  getDate(): number;
  setDate(value: number): GetCampaignScoresRequest;

  getBeginBlock(): number;
  setBeginBlock(value: number): GetCampaignScoresRequest;

  getEndBlock(): number;
  setEndBlock(value: number): GetCampaignScoresRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCampaignScoresRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCampaignScoresRequest): GetCampaignScoresRequest.AsObject;
  static serializeBinaryToWriter(message: GetCampaignScoresRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCampaignScoresRequest;
  static deserializeBinaryFromReader(message: GetCampaignScoresRequest, reader: jspb.BinaryReader): GetCampaignScoresRequest;
}

export namespace GetCampaignScoresRequest {
  export type AsObject = {
    date: number,
    beginBlock: number,
    endBlock: number,
  }
}

export class GetCampaignScoresResponse extends jspb.Message {
  getScoresList(): Array<CampaignScore>;
  setScoresList(value: Array<CampaignScore>): GetCampaignScoresResponse;
  clearScoresList(): GetCampaignScoresResponse;
  addScores(value?: CampaignScore, index?: number): CampaignScore;

  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetCampaignScoresResponse;
  hasErr(): boolean;
  clearErr(): GetCampaignScoresResponse;

  getBegin(): number;
  setBegin(value: number): GetCampaignScoresResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCampaignScoresResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCampaignScoresResponse): GetCampaignScoresResponse.AsObject;
  static serializeBinaryToWriter(message: GetCampaignScoresResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCampaignScoresResponse;
  static deserializeBinaryFromReader(message: GetCampaignScoresResponse, reader: jspb.BinaryReader): GetCampaignScoresResponse;
}

export namespace GetCampaignScoresResponse {
  export type AsObject = {
    scoresList: Array<CampaignScore.AsObject>,
    err?: ErrMsg.AsObject,
    begin: number,
  }
}

export class CampaignScore extends jspb.Message {
  getUsrAddr(): string;
  setUsrAddr(value: string): CampaignScore;

  getScore(): number;
  setScore(value: number): CampaignScore;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CampaignScore.AsObject;
  static toObject(includeInstance: boolean, msg: CampaignScore): CampaignScore.AsObject;
  static serializeBinaryToWriter(message: CampaignScore, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CampaignScore;
  static deserializeBinaryFromReader(message: CampaignScore, reader: jspb.BinaryReader): CampaignScore;
}

export namespace CampaignScore {
  export type AsObject = {
    usrAddr: string,
    score: number,
  }
}

export class QueryLiquidityStatusResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): QueryLiquidityStatusResponse;
  hasErr(): boolean;
  clearErr(): QueryLiquidityStatusResponse;

  getStatus(): sgn_cbridge_v1_query_pb.WithdrawStatus;
  setStatus(value: sgn_cbridge_v1_query_pb.WithdrawStatus): QueryLiquidityStatusResponse;

  getWdOnchain(): Uint8Array | string;
  getWdOnchain_asU8(): Uint8Array;
  getWdOnchain_asB64(): string;
  setWdOnchain(value: Uint8Array | string): QueryLiquidityStatusResponse;

  getSortedSigsList(): Array<Uint8Array | string>;
  setSortedSigsList(value: Array<Uint8Array | string>): QueryLiquidityStatusResponse;
  clearSortedSigsList(): QueryLiquidityStatusResponse;
  addSortedSigs(value: Uint8Array | string, index?: number): QueryLiquidityStatusResponse;

  getSignersList(): Array<Uint8Array | string>;
  setSignersList(value: Array<Uint8Array | string>): QueryLiquidityStatusResponse;
  clearSignersList(): QueryLiquidityStatusResponse;
  addSigners(value: Uint8Array | string, index?: number): QueryLiquidityStatusResponse;

  getPowersList(): Array<Uint8Array | string>;
  setPowersList(value: Array<Uint8Array | string>): QueryLiquidityStatusResponse;
  clearPowersList(): QueryLiquidityStatusResponse;
  addPowers(value: Uint8Array | string, index?: number): QueryLiquidityStatusResponse;

  getBlockTxLink(): string;
  setBlockTxLink(value: string): QueryLiquidityStatusResponse;

  getBlockDelay(): number;
  setBlockDelay(value: number): QueryLiquidityStatusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryLiquidityStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryLiquidityStatusResponse): QueryLiquidityStatusResponse.AsObject;
  static serializeBinaryToWriter(message: QueryLiquidityStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryLiquidityStatusResponse;
  static deserializeBinaryFromReader(message: QueryLiquidityStatusResponse, reader: jspb.BinaryReader): QueryLiquidityStatusResponse;
}

export namespace QueryLiquidityStatusResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    status: sgn_cbridge_v1_query_pb.WithdrawStatus,
    wdOnchain: Uint8Array | string,
    sortedSigsList: Array<Uint8Array | string>,
    signersList: Array<Uint8Array | string>,
    powersList: Array<Uint8Array | string>,
    blockTxLink: string,
    blockDelay: number,
  }
}

export class Chain extends jspb.Message {
  getId(): number;
  setId(value: number): Chain;

  getName(): string;
  setName(value: string): Chain;

  getIcon(): string;
  setIcon(value: string): Chain;

  getBlockDelay(): number;
  setBlockDelay(value: number): Chain;

  getGasTokenSymbol(): string;
  setGasTokenSymbol(value: string): Chain;

  getExploreUrl(): string;
  setExploreUrl(value: string): Chain;

  getContractAddr(): string;
  setContractAddr(value: string): Chain;

  getDropGasAmt(): string;
  setDropGasAmt(value: string): Chain;

  getDropGasCostAmt(): string;
  setDropGasCostAmt(value: string): Chain;

  getDropGasBalanceAlert(): string;
  setDropGasBalanceAlert(value: string): Chain;

  getSuggestedGasCost(): number;
  setSuggestedGasCost(value: number): Chain;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Chain.AsObject;
  static toObject(includeInstance: boolean, msg: Chain): Chain.AsObject;
  static serializeBinaryToWriter(message: Chain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Chain;
  static deserializeBinaryFromReader(message: Chain, reader: jspb.BinaryReader): Chain;
}

export namespace Chain {
  export type AsObject = {
    id: number,
    name: string,
    icon: string,
    blockDelay: number,
    gasTokenSymbol: string,
    exploreUrl: string,
    contractAddr: string,
    dropGasAmt: string,
    dropGasCostAmt: string,
    dropGasBalanceAlert: string,
    suggestedGasCost: number,
  }
}

export class ChainTokenInfo extends jspb.Message {
  getTokenList(): Array<TokenInfo>;
  setTokenList(value: Array<TokenInfo>): ChainTokenInfo;
  clearTokenList(): ChainTokenInfo;
  addToken(value?: TokenInfo, index?: number): TokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainTokenInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ChainTokenInfo): ChainTokenInfo.AsObject;
  static serializeBinaryToWriter(message: ChainTokenInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainTokenInfo;
  static deserializeBinaryFromReader(message: ChainTokenInfo, reader: jspb.BinaryReader): ChainTokenInfo;
}

export namespace ChainTokenInfo {
  export type AsObject = {
    tokenList: Array<TokenInfo.AsObject>,
  }
}

export class TokenInfo extends jspb.Message {
  getToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setToken(value?: sgn_cbridge_v1_query_pb.Token): TokenInfo;
  hasToken(): boolean;
  clearToken(): TokenInfo;

  getName(): string;
  setName(value: string): TokenInfo;

  getIcon(): string;
  setIcon(value: string): TokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TokenInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TokenInfo): TokenInfo.AsObject;
  static serializeBinaryToWriter(message: TokenInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TokenInfo;
  static deserializeBinaryFromReader(message: TokenInfo, reader: jspb.BinaryReader): TokenInfo;
}

export namespace TokenInfo {
  export type AsObject = {
    token?: sgn_cbridge_v1_query_pb.Token.AsObject,
    name: string,
    icon: string,
  }
}

export class TransferInfo extends jspb.Message {
  getChain(): Chain | undefined;
  setChain(value?: Chain): TransferInfo;
  hasChain(): boolean;
  clearChain(): TransferInfo;

  getToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setToken(value?: sgn_cbridge_v1_query_pb.Token): TransferInfo;
  hasToken(): boolean;
  clearToken(): TransferInfo;

  getAmount(): string;
  setAmount(value: string): TransferInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TransferInfo): TransferInfo.AsObject;
  static serializeBinaryToWriter(message: TransferInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferInfo;
  static deserializeBinaryFromReader(message: TransferInfo, reader: jspb.BinaryReader): TransferInfo;
}

export namespace TransferInfo {
  export type AsObject = {
    chain?: Chain.AsObject,
    token?: sgn_cbridge_v1_query_pb.Token.AsObject,
    amount: string,
  }
}

export class GetTransferStatusRequest extends jspb.Message {
  getTransferId(): string;
  setTransferId(value: string): GetTransferStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferStatusRequest): GetTransferStatusRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferStatusRequest;
  static deserializeBinaryFromReader(message: GetTransferStatusRequest, reader: jspb.BinaryReader): GetTransferStatusRequest;
}

export namespace GetTransferStatusRequest {
  export type AsObject = {
    transferId: string,
  }
}

export class GetTransferStatusResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferStatusResponse;
  hasErr(): boolean;
  clearErr(): GetTransferStatusResponse;

  getStatus(): sgn_cbridge_v1_query_pb.TransferHistoryStatus;
  setStatus(value: sgn_cbridge_v1_query_pb.TransferHistoryStatus): GetTransferStatusResponse;

  getWdOnchain(): Uint8Array | string;
  getWdOnchain_asU8(): Uint8Array;
  getWdOnchain_asB64(): string;
  setWdOnchain(value: Uint8Array | string): GetTransferStatusResponse;

  getSortedSigsList(): Array<Uint8Array | string>;
  setSortedSigsList(value: Array<Uint8Array | string>): GetTransferStatusResponse;
  clearSortedSigsList(): GetTransferStatusResponse;
  addSortedSigs(value: Uint8Array | string, index?: number): GetTransferStatusResponse;

  getSignersList(): Array<Uint8Array | string>;
  setSignersList(value: Array<Uint8Array | string>): GetTransferStatusResponse;
  clearSignersList(): GetTransferStatusResponse;
  addSigners(value: Uint8Array | string, index?: number): GetTransferStatusResponse;

  getPowersList(): Array<Uint8Array | string>;
  setPowersList(value: Array<Uint8Array | string>): GetTransferStatusResponse;
  clearPowersList(): GetTransferStatusResponse;
  addPowers(value: Uint8Array | string, index?: number): GetTransferStatusResponse;

  getRefundReason(): sgn_cbridge_v1_cbridge_pb.XferStatus;
  setRefundReason(value: sgn_cbridge_v1_cbridge_pb.XferStatus): GetTransferStatusResponse;

  getBlockDelay(): number;
  setBlockDelay(value: number): GetTransferStatusResponse;

  getSrcBlockTxLink(): string;
  setSrcBlockTxLink(value: string): GetTransferStatusResponse;

  getDstBlockTxLink(): string;
  setDstBlockTxLink(value: string): GetTransferStatusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferStatusResponse): GetTransferStatusResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferStatusResponse;
  static deserializeBinaryFromReader(message: GetTransferStatusResponse, reader: jspb.BinaryReader): GetTransferStatusResponse;
}

export namespace GetTransferStatusResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    status: sgn_cbridge_v1_query_pb.TransferHistoryStatus,
    wdOnchain: Uint8Array | string,
    sortedSigsList: Array<Uint8Array | string>,
    signersList: Array<Uint8Array | string>,
    powersList: Array<Uint8Array | string>,
    refundReason: sgn_cbridge_v1_cbridge_pb.XferStatus,
    blockDelay: number,
    srcBlockTxLink: string,
    dstBlockTxLink: string,
  }
}

export class GetTransferConfigsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferConfigsRequest): GetTransferConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: GetTransferConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferConfigsRequest;
  static deserializeBinaryFromReader(message: GetTransferConfigsRequest, reader: jspb.BinaryReader): GetTransferConfigsRequest;
}

export namespace GetTransferConfigsRequest {
  export type AsObject = {
  }
}

export class GetTransferConfigsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTransferConfigsResponse;
  hasErr(): boolean;
  clearErr(): GetTransferConfigsResponse;

  getChainsList(): Array<Chain>;
  setChainsList(value: Array<Chain>): GetTransferConfigsResponse;
  clearChainsList(): GetTransferConfigsResponse;
  addChains(value?: Chain, index?: number): Chain;

  getChainTokenMap(): jspb.Map<number, ChainTokenInfo>;
  clearChainTokenMap(): GetTransferConfigsResponse;

  getFarmingRewardContractAddr(): string;
  setFarmingRewardContractAddr(value: string): GetTransferConfigsResponse;

  getPeggedPairConfigsList(): Array<PeggedPairConfig>;
  setPeggedPairConfigsList(value: Array<PeggedPairConfig>): GetTransferConfigsResponse;
  clearPeggedPairConfigsList(): GetTransferConfigsResponse;
  addPeggedPairConfigs(value?: PeggedPairConfig, index?: number): PeggedPairConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransferConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransferConfigsResponse): GetTransferConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: GetTransferConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransferConfigsResponse;
  static deserializeBinaryFromReader(message: GetTransferConfigsResponse, reader: jspb.BinaryReader): GetTransferConfigsResponse;
}

export namespace GetTransferConfigsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    chainsList: Array<Chain.AsObject>,
    chainTokenMap: Array<[number, ChainTokenInfo.AsObject]>,
    farmingRewardContractAddr: string,
    peggedPairConfigsList: Array<PeggedPairConfig.AsObject>,
  }
}

export class PeggedPairConfig extends jspb.Message {
  getOrgChainId(): number;
  setOrgChainId(value: number): PeggedPairConfig;

  getOrgToken(): TokenInfo | undefined;
  setOrgToken(value?: TokenInfo): PeggedPairConfig;
  hasOrgToken(): boolean;
  clearOrgToken(): PeggedPairConfig;

  getPeggedChainId(): number;
  setPeggedChainId(value: number): PeggedPairConfig;

  getPeggedToken(): TokenInfo | undefined;
  setPeggedToken(value?: TokenInfo): PeggedPairConfig;
  hasPeggedToken(): boolean;
  clearPeggedToken(): PeggedPairConfig;

  getPeggedDepositContractAddr(): string;
  setPeggedDepositContractAddr(value: string): PeggedPairConfig;

  getPeggedBurnContractAddr(): string;
  setPeggedBurnContractAddr(value: string): PeggedPairConfig;

  getCanonicalTokenContractAddr(): string;
  setCanonicalTokenContractAddr(value: string): PeggedPairConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeggedPairConfig.AsObject;
  static toObject(includeInstance: boolean, msg: PeggedPairConfig): PeggedPairConfig.AsObject;
  static serializeBinaryToWriter(message: PeggedPairConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeggedPairConfig;
  static deserializeBinaryFromReader(message: PeggedPairConfig, reader: jspb.BinaryReader): PeggedPairConfig;
}

export namespace PeggedPairConfig {
  export type AsObject = {
    orgChainId: number,
    orgToken?: TokenInfo.AsObject,
    peggedChainId: number,
    peggedToken?: TokenInfo.AsObject,
    peggedDepositContractAddr: string,
    peggedBurnContractAddr: string,
    canonicalTokenContractAddr: string,
  }
}

export class GetTokenInfoRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): GetTokenInfoRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): GetTokenInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenInfoRequest): GetTokenInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetTokenInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenInfoRequest;
  static deserializeBinaryFromReader(message: GetTokenInfoRequest, reader: jspb.BinaryReader): GetTokenInfoRequest;
}

export namespace GetTokenInfoRequest {
  export type AsObject = {
    chainId: number,
    tokenSymbol: string,
  }
}

export class GetTokenInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTokenInfoResponse;
  hasErr(): boolean;
  clearErr(): GetTokenInfoResponse;

  getTokenInfo(): TokenInfo | undefined;
  setTokenInfo(value?: TokenInfo): GetTokenInfoResponse;
  hasTokenInfo(): boolean;
  clearTokenInfo(): GetTokenInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTokenInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTokenInfoResponse): GetTokenInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetTokenInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTokenInfoResponse;
  static deserializeBinaryFromReader(message: GetTokenInfoResponse, reader: jspb.BinaryReader): GetTokenInfoResponse;
}

export namespace GetTokenInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    tokenInfo?: TokenInfo.AsObject,
  }
}

export class EstimateAmtRequest extends jspb.Message {
  getSrcChainId(): number;
  setSrcChainId(value: number): EstimateAmtRequest;

  getDstChainId(): number;
  setDstChainId(value: number): EstimateAmtRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): EstimateAmtRequest;

  getAmt(): string;
  setAmt(value: string): EstimateAmtRequest;

  getUsrAddr(): string;
  setUsrAddr(value: string): EstimateAmtRequest;

  getSlippageTolerance(): number;
  setSlippageTolerance(value: number): EstimateAmtRequest;

  getIsPegged(): boolean;
  setIsPegged(value: boolean): EstimateAmtRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimateAmtRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EstimateAmtRequest): EstimateAmtRequest.AsObject;
  static serializeBinaryToWriter(message: EstimateAmtRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimateAmtRequest;
  static deserializeBinaryFromReader(message: EstimateAmtRequest, reader: jspb.BinaryReader): EstimateAmtRequest;
}

export namespace EstimateAmtRequest {
  export type AsObject = {
    srcChainId: number,
    dstChainId: number,
    tokenSymbol: string,
    amt: string,
    usrAddr: string,
    slippageTolerance: number,
    isPegged: boolean,
  }
}

export class EstimateAmtResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): EstimateAmtResponse;
  hasErr(): boolean;
  clearErr(): EstimateAmtResponse;

  getEqValueTokenAmt(): string;
  setEqValueTokenAmt(value: string): EstimateAmtResponse;

  getBridgeRate(): number;
  setBridgeRate(value: number): EstimateAmtResponse;

  getPercFee(): string;
  setPercFee(value: string): EstimateAmtResponse;

  getBaseFee(): string;
  setBaseFee(value: string): EstimateAmtResponse;

  getSlippageTolerance(): number;
  setSlippageTolerance(value: number): EstimateAmtResponse;

  getMaxSlippage(): number;
  setMaxSlippage(value: number): EstimateAmtResponse;

  getEstimatedReceiveAmt(): string;
  setEstimatedReceiveAmt(value: string): EstimateAmtResponse;

  getDropGasAmt(): string;
  setDropGasAmt(value: string): EstimateAmtResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimateAmtResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EstimateAmtResponse): EstimateAmtResponse.AsObject;
  static serializeBinaryToWriter(message: EstimateAmtResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimateAmtResponse;
  static deserializeBinaryFromReader(message: EstimateAmtResponse, reader: jspb.BinaryReader): EstimateAmtResponse;
}

export namespace EstimateAmtResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eqValueTokenAmt: string,
    bridgeRate: number,
    percFee: string,
    baseFee: string,
    slippageTolerance: number,
    maxSlippage: number,
    estimatedReceiveAmt: string,
    dropGasAmt: string,
  }
}

export class WithdrawInfo extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): WithdrawInfo;

  getAmount(): string;
  setAmount(value: string): WithdrawInfo;

  getSlippageTolerance(): number;
  setSlippageTolerance(value: number): WithdrawInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawInfo.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawInfo): WithdrawInfo.AsObject;
  static serializeBinaryToWriter(message: WithdrawInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawInfo;
  static deserializeBinaryFromReader(message: WithdrawInfo, reader: jspb.BinaryReader): WithdrawInfo;
}

export namespace WithdrawInfo {
  export type AsObject = {
    chainId: number,
    amount: string,
    slippageTolerance: number,
  }
}

export class EstimateWithdrawAmtRequest extends jspb.Message {
  getSrcWithdrawsList(): Array<WithdrawInfo>;
  setSrcWithdrawsList(value: Array<WithdrawInfo>): EstimateWithdrawAmtRequest;
  clearSrcWithdrawsList(): EstimateWithdrawAmtRequest;
  addSrcWithdraws(value?: WithdrawInfo, index?: number): WithdrawInfo;

  getDstChainId(): number;
  setDstChainId(value: number): EstimateWithdrawAmtRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): EstimateWithdrawAmtRequest;

  getUsrAddr(): string;
  setUsrAddr(value: string): EstimateWithdrawAmtRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimateWithdrawAmtRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EstimateWithdrawAmtRequest): EstimateWithdrawAmtRequest.AsObject;
  static serializeBinaryToWriter(message: EstimateWithdrawAmtRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimateWithdrawAmtRequest;
  static deserializeBinaryFromReader(message: EstimateWithdrawAmtRequest, reader: jspb.BinaryReader): EstimateWithdrawAmtRequest;
}

export namespace EstimateWithdrawAmtRequest {
  export type AsObject = {
    srcWithdrawsList: Array<WithdrawInfo.AsObject>,
    dstChainId: number,
    tokenSymbol: string,
    usrAddr: string,
  }
}

export class EstimateWithdrawAmtResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): EstimateWithdrawAmtResponse;
  hasErr(): boolean;
  clearErr(): EstimateWithdrawAmtResponse;

  getReqAmtMap(): jspb.Map<number, EstimateWithdrawAmt>;
  clearReqAmtMap(): EstimateWithdrawAmtResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimateWithdrawAmtResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EstimateWithdrawAmtResponse): EstimateWithdrawAmtResponse.AsObject;
  static serializeBinaryToWriter(message: EstimateWithdrawAmtResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimateWithdrawAmtResponse;
  static deserializeBinaryFromReader(message: EstimateWithdrawAmtResponse, reader: jspb.BinaryReader): EstimateWithdrawAmtResponse;
}

export namespace EstimateWithdrawAmtResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    reqAmtMap: Array<[number, EstimateWithdrawAmt.AsObject]>,
  }
}

export class EstimateWithdrawAmt extends jspb.Message {
  getEqValueTokenAmt(): string;
  setEqValueTokenAmt(value: string): EstimateWithdrawAmt;

  getBridgeRate(): number;
  setBridgeRate(value: number): EstimateWithdrawAmt;

  getPercFee(): string;
  setPercFee(value: string): EstimateWithdrawAmt;

  getBaseFee(): string;
  setBaseFee(value: string): EstimateWithdrawAmt;

  getSlippageTolerance(): number;
  setSlippageTolerance(value: number): EstimateWithdrawAmt;

  getMaxSlippage(): number;
  setMaxSlippage(value: number): EstimateWithdrawAmt;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimateWithdrawAmt.AsObject;
  static toObject(includeInstance: boolean, msg: EstimateWithdrawAmt): EstimateWithdrawAmt.AsObject;
  static serializeBinaryToWriter(message: EstimateWithdrawAmt, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimateWithdrawAmt;
  static deserializeBinaryFromReader(message: EstimateWithdrawAmt, reader: jspb.BinaryReader): EstimateWithdrawAmt;
}

export namespace EstimateWithdrawAmt {
  export type AsObject = {
    eqValueTokenAmt: string,
    bridgeRate: number,
    percFee: string,
    baseFee: string,
    slippageTolerance: number,
    maxSlippage: number,
  }
}

export class GetLPInfoListRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): GetLPInfoListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLPInfoListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetLPInfoListRequest): GetLPInfoListRequest.AsObject;
  static serializeBinaryToWriter(message: GetLPInfoListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLPInfoListRequest;
  static deserializeBinaryFromReader(message: GetLPInfoListRequest, reader: jspb.BinaryReader): GetLPInfoListRequest;
}

export namespace GetLPInfoListRequest {
  export type AsObject = {
    addr: string,
  }
}

export class LPInfo extends jspb.Message {
  getChain(): Chain | undefined;
  setChain(value?: Chain): LPInfo;
  hasChain(): boolean;
  clearChain(): LPInfo;

  getToken(): TokenInfo | undefined;
  setToken(value?: TokenInfo): LPInfo;
  hasToken(): boolean;
  clearToken(): LPInfo;

  getLiquidity(): number;
  setLiquidity(value: number): LPInfo;

  getLiquidityAmt(): string;
  setLiquidityAmt(value: string): LPInfo;

  getHasFarmingSessions(): boolean;
  setHasFarmingSessions(value: boolean): LPInfo;

  getLpFeeEarning(): number;
  setLpFeeEarning(value: number): LPInfo;

  getFarmingRewardEarning(): number;
  setFarmingRewardEarning(value: number): LPInfo;

  getVolume24h(): number;
  setVolume24h(value: number): LPInfo;

  getTotalLiquidity(): number;
  setTotalLiquidity(value: number): LPInfo;

  getTotalLiquidityAmt(): string;
  setTotalLiquidityAmt(value: string): LPInfo;

  getLpFeeEarningApy(): number;
  setLpFeeEarningApy(value: number): LPInfo;

  getFarmingApy(): number;
  setFarmingApy(value: number): LPInfo;

  getFarmingSessionTokensList(): Array<TokenInfo>;
  setFarmingSessionTokensList(value: Array<TokenInfo>): LPInfo;
  clearFarmingSessionTokensList(): LPInfo;
  addFarmingSessionTokens(value?: TokenInfo, index?: number): TokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPInfo.AsObject;
  static toObject(includeInstance: boolean, msg: LPInfo): LPInfo.AsObject;
  static serializeBinaryToWriter(message: LPInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPInfo;
  static deserializeBinaryFromReader(message: LPInfo, reader: jspb.BinaryReader): LPInfo;
}

export namespace LPInfo {
  export type AsObject = {
    chain?: Chain.AsObject,
    token?: TokenInfo.AsObject,
    liquidity: number,
    liquidityAmt: string,
    hasFarmingSessions: boolean,
    lpFeeEarning: number,
    farmingRewardEarning: number,
    volume24h: number,
    totalLiquidity: number,
    totalLiquidityAmt: string,
    lpFeeEarningApy: number,
    farmingApy: number,
    farmingSessionTokensList: Array<TokenInfo.AsObject>,
  }
}

export class GetLPInfoListResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetLPInfoListResponse;
  hasErr(): boolean;
  clearErr(): GetLPInfoListResponse;

  getLpInfoList(): Array<LPInfo>;
  setLpInfoList(value: Array<LPInfo>): GetLPInfoListResponse;
  clearLpInfoList(): GetLPInfoListResponse;
  addLpInfo(value?: LPInfo, index?: number): LPInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLPInfoListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetLPInfoListResponse): GetLPInfoListResponse.AsObject;
  static serializeBinaryToWriter(message: GetLPInfoListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLPInfoListResponse;
  static deserializeBinaryFromReader(message: GetLPInfoListResponse, reader: jspb.BinaryReader): GetLPInfoListResponse;
}

export namespace GetLPInfoListResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    lpInfoList: Array<LPInfo.AsObject>,
  }
}

export class WithdrawLiquidityRequest extends jspb.Message {
  getWithdrawReq(): Uint8Array | string;
  getWithdrawReq_asU8(): Uint8Array;
  getWithdrawReq_asB64(): string;
  setWithdrawReq(value: Uint8Array | string): WithdrawLiquidityRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): WithdrawLiquidityRequest;

  getEstimatedReceivedAmt(): string;
  setEstimatedReceivedAmt(value: string): WithdrawLiquidityRequest;

  getMethodType(): WithdrawMethodType;
  setMethodType(value: WithdrawMethodType): WithdrawLiquidityRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawLiquidityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawLiquidityRequest): WithdrawLiquidityRequest.AsObject;
  static serializeBinaryToWriter(message: WithdrawLiquidityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawLiquidityRequest;
  static deserializeBinaryFromReader(message: WithdrawLiquidityRequest, reader: jspb.BinaryReader): WithdrawLiquidityRequest;
}

export namespace WithdrawLiquidityRequest {
  export type AsObject = {
    withdrawReq: Uint8Array | string,
    sig: Uint8Array | string,
    estimatedReceivedAmt: string,
    methodType: WithdrawMethodType,
  }
}

export class WithdrawLiquidityResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): WithdrawLiquidityResponse;
  hasErr(): boolean;
  clearErr(): WithdrawLiquidityResponse;

  getSeqNum(): number;
  setSeqNum(value: number): WithdrawLiquidityResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawLiquidityResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawLiquidityResponse): WithdrawLiquidityResponse.AsObject;
  static serializeBinaryToWriter(message: WithdrawLiquidityResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawLiquidityResponse;
  static deserializeBinaryFromReader(message: WithdrawLiquidityResponse, reader: jspb.BinaryReader): WithdrawLiquidityResponse;
}

export namespace WithdrawLiquidityResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    seqNum: number,
  }
}

export class UnlockFarmingRewardRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): UnlockFarmingRewardRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnlockFarmingRewardRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnlockFarmingRewardRequest): UnlockFarmingRewardRequest.AsObject;
  static serializeBinaryToWriter(message: UnlockFarmingRewardRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnlockFarmingRewardRequest;
  static deserializeBinaryFromReader(message: UnlockFarmingRewardRequest, reader: jspb.BinaryReader): UnlockFarmingRewardRequest;
}

export namespace UnlockFarmingRewardRequest {
  export type AsObject = {
    addr: string,
  }
}

export class UnlockFarmingRewardResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): UnlockFarmingRewardResponse;
  hasErr(): boolean;
  clearErr(): UnlockFarmingRewardResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnlockFarmingRewardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UnlockFarmingRewardResponse): UnlockFarmingRewardResponse.AsObject;
  static serializeBinaryToWriter(message: UnlockFarmingRewardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnlockFarmingRewardResponse;
  static deserializeBinaryFromReader(message: UnlockFarmingRewardResponse, reader: jspb.BinaryReader): UnlockFarmingRewardResponse;
}

export namespace UnlockFarmingRewardResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetFarmingRewardDetailsRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): GetFarmingRewardDetailsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFarmingRewardDetailsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFarmingRewardDetailsRequest): GetFarmingRewardDetailsRequest.AsObject;
  static serializeBinaryToWriter(message: GetFarmingRewardDetailsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFarmingRewardDetailsRequest;
  static deserializeBinaryFromReader(message: GetFarmingRewardDetailsRequest, reader: jspb.BinaryReader): GetFarmingRewardDetailsRequest;
}

export namespace GetFarmingRewardDetailsRequest {
  export type AsObject = {
    addr: string,
  }
}

export class GetFarmingRewardDetailsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetFarmingRewardDetailsResponse;
  hasErr(): boolean;
  clearErr(): GetFarmingRewardDetailsResponse;

  getDetailsList(): Array<sgn_farming_v1_farming_pb.RewardClaimDetails>;
  setDetailsList(value: Array<sgn_farming_v1_farming_pb.RewardClaimDetails>): GetFarmingRewardDetailsResponse;
  clearDetailsList(): GetFarmingRewardDetailsResponse;
  addDetails(value?: sgn_farming_v1_farming_pb.RewardClaimDetails, index?: number): sgn_farming_v1_farming_pb.RewardClaimDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFarmingRewardDetailsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFarmingRewardDetailsResponse): GetFarmingRewardDetailsResponse.AsObject;
  static serializeBinaryToWriter(message: GetFarmingRewardDetailsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFarmingRewardDetailsResponse;
  static deserializeBinaryFromReader(message: GetFarmingRewardDetailsResponse, reader: jspb.BinaryReader): GetFarmingRewardDetailsResponse;
}

export namespace GetFarmingRewardDetailsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    detailsList: Array<sgn_farming_v1_farming_pb.RewardClaimDetails.AsObject>,
  }
}

export class QueryLiquidityStatusRequest extends jspb.Message {
  getSeqNum(): number;
  setSeqNum(value: number): QueryLiquidityStatusRequest;

  getTxHash(): string;
  setTxHash(value: string): QueryLiquidityStatusRequest;

  getLpAddr(): string;
  setLpAddr(value: string): QueryLiquidityStatusRequest;

  getChainId(): number;
  setChainId(value: number): QueryLiquidityStatusRequest;

  getType(): LPType;
  setType(value: LPType): QueryLiquidityStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryLiquidityStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryLiquidityStatusRequest): QueryLiquidityStatusRequest.AsObject;
  static serializeBinaryToWriter(message: QueryLiquidityStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryLiquidityStatusRequest;
  static deserializeBinaryFromReader(message: QueryLiquidityStatusRequest, reader: jspb.BinaryReader): QueryLiquidityStatusRequest;
}

export namespace QueryLiquidityStatusRequest {
  export type AsObject = {
    seqNum: number,
    txHash: string,
    lpAddr: string,
    chainId: number,
    type: LPType,
  }
}

export class TransferHistory extends jspb.Message {
  getTransferId(): string;
  setTransferId(value: string): TransferHistory;

  getSrcSendInfo(): TransferInfo | undefined;
  setSrcSendInfo(value?: TransferInfo): TransferHistory;
  hasSrcSendInfo(): boolean;
  clearSrcSendInfo(): TransferHistory;

  getDstReceivedInfo(): TransferInfo | undefined;
  setDstReceivedInfo(value?: TransferInfo): TransferHistory;
  hasDstReceivedInfo(): boolean;
  clearDstReceivedInfo(): TransferHistory;

  getTs(): number;
  setTs(value: number): TransferHistory;

  getSrcBlockTxLink(): string;
  setSrcBlockTxLink(value: string): TransferHistory;

  getDstBlockTxLink(): string;
  setDstBlockTxLink(value: string): TransferHistory;

  getStatus(): sgn_cbridge_v1_query_pb.TransferHistoryStatus;
  setStatus(value: sgn_cbridge_v1_query_pb.TransferHistoryStatus): TransferHistory;

  getRefundReason(): sgn_cbridge_v1_cbridge_pb.XferStatus;
  setRefundReason(value: sgn_cbridge_v1_cbridge_pb.XferStatus): TransferHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferHistory.AsObject;
  static toObject(includeInstance: boolean, msg: TransferHistory): TransferHistory.AsObject;
  static serializeBinaryToWriter(message: TransferHistory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferHistory;
  static deserializeBinaryFromReader(message: TransferHistory, reader: jspb.BinaryReader): TransferHistory;
}

export namespace TransferHistory {
  export type AsObject = {
    transferId: string,
    srcSendInfo?: TransferInfo.AsObject,
    dstReceivedInfo?: TransferInfo.AsObject,
    ts: number,
    srcBlockTxLink: string,
    dstBlockTxLink: string,
    status: sgn_cbridge_v1_query_pb.TransferHistoryStatus,
    refundReason: sgn_cbridge_v1_cbridge_pb.XferStatus,
  }
}

export class LPHistory extends jspb.Message {
  getChain(): Chain | undefined;
  setChain(value?: Chain): LPHistory;
  hasChain(): boolean;
  clearChain(): LPHistory;

  getToken(): TokenInfo | undefined;
  setToken(value?: TokenInfo): LPHistory;
  hasToken(): boolean;
  clearToken(): LPHistory;

  getAmount(): string;
  setAmount(value: string): LPHistory;

  getTs(): number;
  setTs(value: number): LPHistory;

  getBlockTxLink(): string;
  setBlockTxLink(value: string): LPHistory;

  getStatus(): sgn_cbridge_v1_query_pb.WithdrawStatus;
  setStatus(value: sgn_cbridge_v1_query_pb.WithdrawStatus): LPHistory;

  getType(): LPType;
  setType(value: LPType): LPHistory;

  getSeqNum(): number;
  setSeqNum(value: number): LPHistory;

  getMethodType(): WithdrawMethodType;
  setMethodType(value: WithdrawMethodType): LPHistory;

  getNonce(): number;
  setNonce(value: number): LPHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPHistory.AsObject;
  static toObject(includeInstance: boolean, msg: LPHistory): LPHistory.AsObject;
  static serializeBinaryToWriter(message: LPHistory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPHistory;
  static deserializeBinaryFromReader(message: LPHistory, reader: jspb.BinaryReader): LPHistory;
}

export namespace LPHistory {
  export type AsObject = {
    chain?: Chain.AsObject,
    token?: TokenInfo.AsObject,
    amount: string,
    ts: number,
    blockTxLink: string,
    status: sgn_cbridge_v1_query_pb.WithdrawStatus,
    type: LPType,
    seqNum: number,
    methodType: WithdrawMethodType,
    nonce: number,
  }
}

export class TransferHistoryRequest extends jspb.Message {
  getNextPageToken(): string;
  setNextPageToken(value: string): TransferHistoryRequest;

  getPageSize(): number;
  setPageSize(value: number): TransferHistoryRequest;

  getAddr(): string;
  setAddr(value: string): TransferHistoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferHistoryRequest): TransferHistoryRequest.AsObject;
  static serializeBinaryToWriter(message: TransferHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferHistoryRequest;
  static deserializeBinaryFromReader(message: TransferHistoryRequest, reader: jspb.BinaryReader): TransferHistoryRequest;
}

export namespace TransferHistoryRequest {
  export type AsObject = {
    nextPageToken: string,
    pageSize: number,
    addr: string,
  }
}

export class TransferHistoryResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): TransferHistoryResponse;
  hasErr(): boolean;
  clearErr(): TransferHistoryResponse;

  getHistoryList(): Array<TransferHistory>;
  setHistoryList(value: Array<TransferHistory>): TransferHistoryResponse;
  clearHistoryList(): TransferHistoryResponse;
  addHistory(value?: TransferHistory, index?: number): TransferHistory;

  getNextPageToken(): string;
  setNextPageToken(value: string): TransferHistoryResponse;

  getCurrentSize(): number;
  setCurrentSize(value: number): TransferHistoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferHistoryResponse): TransferHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: TransferHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferHistoryResponse;
  static deserializeBinaryFromReader(message: TransferHistoryResponse, reader: jspb.BinaryReader): TransferHistoryResponse;
}

export namespace TransferHistoryResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    historyList: Array<TransferHistory.AsObject>,
    nextPageToken: string,
    currentSize: number,
  }
}

export class LPHistoryRequest extends jspb.Message {
  getNextPageToken(): string;
  setNextPageToken(value: string): LPHistoryRequest;

  getPageSize(): number;
  setPageSize(value: number): LPHistoryRequest;

  getAddr(): string;
  setAddr(value: string): LPHistoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LPHistoryRequest): LPHistoryRequest.AsObject;
  static serializeBinaryToWriter(message: LPHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPHistoryRequest;
  static deserializeBinaryFromReader(message: LPHistoryRequest, reader: jspb.BinaryReader): LPHistoryRequest;
}

export namespace LPHistoryRequest {
  export type AsObject = {
    nextPageToken: string,
    pageSize: number,
    addr: string,
  }
}

export class LPHistoryResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): LPHistoryResponse;
  hasErr(): boolean;
  clearErr(): LPHistoryResponse;

  getHistoryList(): Array<LPHistory>;
  setHistoryList(value: Array<LPHistory>): LPHistoryResponse;
  clearHistoryList(): LPHistoryResponse;
  addHistory(value?: LPHistory, index?: number): LPHistory;

  getNextPageToken(): string;
  setNextPageToken(value: string): LPHistoryResponse;

  getCurrentSize(): number;
  setCurrentSize(value: number): LPHistoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LPHistoryResponse): LPHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: LPHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPHistoryResponse;
  static deserializeBinaryFromReader(message: LPHistoryResponse, reader: jspb.BinaryReader): LPHistoryResponse;
}

export namespace LPHistoryResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    historyList: Array<LPHistory.AsObject>,
    nextPageToken: string,
    currentSize: number,
  }
}

export class RewardingDataRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): RewardingDataRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardingDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RewardingDataRequest): RewardingDataRequest.AsObject;
  static serializeBinaryToWriter(message: RewardingDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardingDataRequest;
  static deserializeBinaryFromReader(message: RewardingDataRequest, reader: jspb.BinaryReader): RewardingDataRequest;
}

export namespace RewardingDataRequest {
  export type AsObject = {
    addr: string,
  }
}

export class Reward extends jspb.Message {
  getAmt(): number;
  setAmt(value: number): Reward;

  getToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setToken(value?: sgn_cbridge_v1_query_pb.Token): Reward;
  hasToken(): boolean;
  clearToken(): Reward;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Reward.AsObject;
  static toObject(includeInstance: boolean, msg: Reward): Reward.AsObject;
  static serializeBinaryToWriter(message: Reward, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Reward;
  static deserializeBinaryFromReader(message: Reward, reader: jspb.BinaryReader): Reward;
}

export namespace Reward {
  export type AsObject = {
    amt: number,
    token?: sgn_cbridge_v1_query_pb.Token.AsObject,
  }
}

export class RewardingDataResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): RewardingDataResponse;
  hasErr(): boolean;
  clearErr(): RewardingDataResponse;

  getUsdPriceMap(): jspb.Map<string, number>;
  clearUsdPriceMap(): RewardingDataResponse;

  getHistoricalCumulativeRewardsList(): Array<Reward>;
  setHistoricalCumulativeRewardsList(value: Array<Reward>): RewardingDataResponse;
  clearHistoricalCumulativeRewardsList(): RewardingDataResponse;
  addHistoricalCumulativeRewards(value?: Reward, index?: number): Reward;

  getUnlockedCumulativeRewardsList(): Array<Reward>;
  setUnlockedCumulativeRewardsList(value: Array<Reward>): RewardingDataResponse;
  clearUnlockedCumulativeRewardsList(): RewardingDataResponse;
  addUnlockedCumulativeRewards(value?: Reward, index?: number): Reward;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardingDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RewardingDataResponse): RewardingDataResponse.AsObject;
  static serializeBinaryToWriter(message: RewardingDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardingDataResponse;
  static deserializeBinaryFromReader(message: RewardingDataResponse, reader: jspb.BinaryReader): RewardingDataResponse;
}

export namespace RewardingDataResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    usdPriceMap: Array<[string, number]>,
    historicalCumulativeRewardsList: Array<Reward.AsObject>,
    unlockedCumulativeRewardsList: Array<Reward.AsObject>,
  }
}

export class UpdateChainRequest extends jspb.Message {
  getChain(): Chain | undefined;
  setChain(value?: Chain): UpdateChainRequest;
  hasChain(): boolean;
  clearChain(): UpdateChainRequest;

  getTxUrlPrefix(): string;
  setTxUrlPrefix(value: string): UpdateChainRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): UpdateChainRequest;

  getAddr(): string;
  setAddr(value: string): UpdateChainRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateChainRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateChainRequest): UpdateChainRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateChainRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateChainRequest;
  static deserializeBinaryFromReader(message: UpdateChainRequest, reader: jspb.BinaryReader): UpdateChainRequest;
}

export namespace UpdateChainRequest {
  export type AsObject = {
    chain?: Chain.AsObject,
    txUrlPrefix: string,
    sig: Uint8Array | string,
    addr: string,
  }
}

export class UpdateChainResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): UpdateChainResponse;
  hasErr(): boolean;
  clearErr(): UpdateChainResponse;

  getChain(): Chain | undefined;
  setChain(value?: Chain): UpdateChainResponse;
  hasChain(): boolean;
  clearChain(): UpdateChainResponse;

  getTxUrlPrefix(): string;
  setTxUrlPrefix(value: string): UpdateChainResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateChainResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateChainResponse): UpdateChainResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateChainResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateChainResponse;
  static deserializeBinaryFromReader(message: UpdateChainResponse, reader: jspb.BinaryReader): UpdateChainResponse;
}

export namespace UpdateChainResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    chain?: Chain.AsObject,
    txUrlPrefix: string,
  }
}

export class UpdateTokenRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): UpdateTokenRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): UpdateTokenRequest;

  getTokenName(): string;
  setTokenName(value: string): UpdateTokenRequest;

  getTokenIcon(): string;
  setTokenIcon(value: string): UpdateTokenRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): UpdateTokenRequest;

  getAddr(): string;
  setAddr(value: string): UpdateTokenRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTokenRequest): UpdateTokenRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTokenRequest;
  static deserializeBinaryFromReader(message: UpdateTokenRequest, reader: jspb.BinaryReader): UpdateTokenRequest;
}

export namespace UpdateTokenRequest {
  export type AsObject = {
    chainId: number,
    tokenSymbol: string,
    tokenName: string,
    tokenIcon: string,
    sig: Uint8Array | string,
    addr: string,
  }
}

export class UpdateTokenResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): UpdateTokenResponse;
  hasErr(): boolean;
  clearErr(): UpdateTokenResponse;

  getToken(): TokenInfo | undefined;
  setToken(value?: TokenInfo): UpdateTokenResponse;
  hasToken(): boolean;
  clearToken(): UpdateTokenResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTokenResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTokenResponse): UpdateTokenResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateTokenResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTokenResponse;
  static deserializeBinaryFromReader(message: UpdateTokenResponse, reader: jspb.BinaryReader): UpdateTokenResponse;
}

export namespace UpdateTokenResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    token?: TokenInfo.AsObject,
  }
}

export class StakingConfigRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StakingConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StakingConfigRequest): StakingConfigRequest.AsObject;
  static serializeBinaryToWriter(message: StakingConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StakingConfigRequest;
  static deserializeBinaryFromReader(message: StakingConfigRequest, reader: jspb.BinaryReader): StakingConfigRequest;
}

export namespace StakingConfigRequest {
  export type AsObject = {
  }
}

export class StakingConfigResponse extends jspb.Message {
  getViewerContract(): string;
  setViewerContract(value: string): StakingConfigResponse;

  getStakingContract(): string;
  setStakingContract(value: string): StakingConfigResponse;

  getStakingRewardContract(): string;
  setStakingRewardContract(value: string): StakingConfigResponse;

  getCelrContract(): string;
  setCelrContract(value: string): StakingConfigResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StakingConfigResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StakingConfigResponse): StakingConfigResponse.AsObject;
  static serializeBinaryToWriter(message: StakingConfigResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StakingConfigResponse;
  static deserializeBinaryFromReader(message: StakingConfigResponse, reader: jspb.BinaryReader): StakingConfigResponse;
}

export namespace StakingConfigResponse {
  export type AsObject = {
    viewerContract: string,
    stakingContract: string,
    stakingRewardContract: string,
    celrContract: string,
  }
}

export class UnlockStakingRewardRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): UnlockStakingRewardRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnlockStakingRewardRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnlockStakingRewardRequest): UnlockStakingRewardRequest.AsObject;
  static serializeBinaryToWriter(message: UnlockStakingRewardRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnlockStakingRewardRequest;
  static deserializeBinaryFromReader(message: UnlockStakingRewardRequest, reader: jspb.BinaryReader): UnlockStakingRewardRequest;
}

export namespace UnlockStakingRewardRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class UnlockStakingRewardResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): UnlockStakingRewardResponse;
  hasErr(): boolean;
  clearErr(): UnlockStakingRewardResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnlockStakingRewardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UnlockStakingRewardResponse): UnlockStakingRewardResponse.AsObject;
  static serializeBinaryToWriter(message: UnlockStakingRewardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnlockStakingRewardResponse;
  static deserializeBinaryFromReader(message: UnlockStakingRewardResponse, reader: jspb.BinaryReader): UnlockStakingRewardResponse;
}

export namespace UnlockStakingRewardResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetStakingRewardDetailsRequest extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): GetStakingRewardDetailsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStakingRewardDetailsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetStakingRewardDetailsRequest): GetStakingRewardDetailsRequest.AsObject;
  static serializeBinaryToWriter(message: GetStakingRewardDetailsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStakingRewardDetailsRequest;
  static deserializeBinaryFromReader(message: GetStakingRewardDetailsRequest, reader: jspb.BinaryReader): GetStakingRewardDetailsRequest;
}

export namespace GetStakingRewardDetailsRequest {
  export type AsObject = {
    delegatorAddress: string,
  }
}

export class GetStakingRewardDetailsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetStakingRewardDetailsResponse;
  hasErr(): boolean;
  clearErr(): GetStakingRewardDetailsResponse;

  getDetail(): sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo | undefined;
  setDetail(value?: sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo): GetStakingRewardDetailsResponse;
  hasDetail(): boolean;
  clearDetail(): GetStakingRewardDetailsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetStakingRewardDetailsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetStakingRewardDetailsResponse): GetStakingRewardDetailsResponse.AsObject;
  static serializeBinaryToWriter(message: GetStakingRewardDetailsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetStakingRewardDetailsResponse;
  static deserializeBinaryFromReader(message: GetStakingRewardDetailsResponse, reader: jspb.BinaryReader): GetStakingRewardDetailsResponse;
}

export namespace GetStakingRewardDetailsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    detail?: sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo.AsObject,
  }
}

export class GetTotalLiquidityProviderTokenBalanceRequest extends jspb.Message {
  getChainIdsList(): Array<number>;
  setChainIdsList(value: Array<number>): GetTotalLiquidityProviderTokenBalanceRequest;
  clearChainIdsList(): GetTotalLiquidityProviderTokenBalanceRequest;
  addChainIds(value: number, index?: number): GetTotalLiquidityProviderTokenBalanceRequest;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): GetTotalLiquidityProviderTokenBalanceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTotalLiquidityProviderTokenBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTotalLiquidityProviderTokenBalanceRequest): GetTotalLiquidityProviderTokenBalanceRequest.AsObject;
  static serializeBinaryToWriter(message: GetTotalLiquidityProviderTokenBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTotalLiquidityProviderTokenBalanceRequest;
  static deserializeBinaryFromReader(message: GetTotalLiquidityProviderTokenBalanceRequest, reader: jspb.BinaryReader): GetTotalLiquidityProviderTokenBalanceRequest;
}

export namespace GetTotalLiquidityProviderTokenBalanceRequest {
  export type AsObject = {
    chainIdsList: Array<number>,
    tokenSymbol: string,
  }
}

export class GetTotalLiquidityProviderTokenBalanceResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetTotalLiquidityProviderTokenBalanceResponse;
  hasErr(): boolean;
  clearErr(): GetTotalLiquidityProviderTokenBalanceResponse;

  getTotalLiqMap(): jspb.Map<number, string>;
  clearTotalLiqMap(): GetTotalLiquidityProviderTokenBalanceResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTotalLiquidityProviderTokenBalanceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTotalLiquidityProviderTokenBalanceResponse): GetTotalLiquidityProviderTokenBalanceResponse.AsObject;
  static serializeBinaryToWriter(message: GetTotalLiquidityProviderTokenBalanceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTotalLiquidityProviderTokenBalanceResponse;
  static deserializeBinaryFromReader(message: GetTotalLiquidityProviderTokenBalanceResponse, reader: jspb.BinaryReader): GetTotalLiquidityProviderTokenBalanceResponse;
}

export namespace GetTotalLiquidityProviderTokenBalanceResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    totalLiqMap: Array<[number, string]>,
  }
}

export class GetAbnormalStatusInfoRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAbnormalStatusInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAbnormalStatusInfoRequest): GetAbnormalStatusInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetAbnormalStatusInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAbnormalStatusInfoRequest;
  static deserializeBinaryFromReader(message: GetAbnormalStatusInfoRequest, reader: jspb.BinaryReader): GetAbnormalStatusInfoRequest;
}

export namespace GetAbnormalStatusInfoRequest {
  export type AsObject = {
  }
}

export class GetAbnormalStatusInfoResponse extends jspb.Message {
  getInfoList(): Array<AbnormalStatusInfo>;
  setInfoList(value: Array<AbnormalStatusInfo>): GetAbnormalStatusInfoResponse;
  clearInfoList(): GetAbnormalStatusInfoResponse;
  addInfo(value?: AbnormalStatusInfo, index?: number): AbnormalStatusInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAbnormalStatusInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAbnormalStatusInfoResponse): GetAbnormalStatusInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetAbnormalStatusInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAbnormalStatusInfoResponse;
  static deserializeBinaryFromReader(message: GetAbnormalStatusInfoResponse, reader: jspb.BinaryReader): GetAbnormalStatusInfoResponse;
}

export namespace GetAbnormalStatusInfoResponse {
  export type AsObject = {
    infoList: Array<AbnormalStatusInfo.AsObject>,
  }
}

export class GetAllLPInfoRequest extends jspb.Message {
  getUsrAddressList(): Array<string>;
  setUsrAddressList(value: Array<string>): GetAllLPInfoRequest;
  clearUsrAddressList(): GetAllLPInfoRequest;
  addUsrAddress(value: string, index?: number): GetAllLPInfoRequest;

  getActionTypeList(): Array<LpActionType>;
  setActionTypeList(value: Array<LpActionType>): GetAllLPInfoRequest;
  clearActionTypeList(): GetAllLPInfoRequest;
  addActionType(value: LpActionType, index?: number): GetAllLPInfoRequest;

  getChainIdList(): Array<number>;
  setChainIdList(value: Array<number>): GetAllLPInfoRequest;
  clearChainIdList(): GetAllLPInfoRequest;
  addChainId(value: number, index?: number): GetAllLPInfoRequest;

  getTokenSymbolList(): Array<string>;
  setTokenSymbolList(value: Array<string>): GetAllLPInfoRequest;
  clearTokenSymbolList(): GetAllLPInfoRequest;
  addTokenSymbol(value: string, index?: number): GetAllLPInfoRequest;

  getBeginTime(): number;
  setBeginTime(value: number): GetAllLPInfoRequest;

  getEndTime(): number;
  setEndTime(value: number): GetAllLPInfoRequest;

  getNextPageToken(): number;
  setNextPageToken(value: number): GetAllLPInfoRequest;

  getSigAddr(): string;
  setSigAddr(value: string): GetAllLPInfoRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetAllLPInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllLPInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllLPInfoRequest): GetAllLPInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllLPInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllLPInfoRequest;
  static deserializeBinaryFromReader(message: GetAllLPInfoRequest, reader: jspb.BinaryReader): GetAllLPInfoRequest;
}

export namespace GetAllLPInfoRequest {
  export type AsObject = {
    usrAddressList: Array<string>,
    actionTypeList: Array<LpActionType>,
    chainIdList: Array<number>,
    tokenSymbolList: Array<string>,
    beginTime: number,
    endTime: number,
    nextPageToken: number,
    sigAddr: string,
    sig: Uint8Array | string,
  }
}

export class GetAllLPInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetAllLPInfoResponse;
  hasErr(): boolean;
  clearErr(): GetAllLPInfoResponse;

  getOperationList(): Array<LPOperations>;
  setOperationList(value: Array<LPOperations>): GetAllLPInfoResponse;
  clearOperationList(): GetAllLPInfoResponse;
  addOperation(value?: LPOperations, index?: number): LPOperations;

  getNextPageToken(): number;
  setNextPageToken(value: number): GetAllLPInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllLPInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllLPInfoResponse): GetAllLPInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllLPInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllLPInfoResponse;
  static deserializeBinaryFromReader(message: GetAllLPInfoResponse, reader: jspb.BinaryReader): GetAllLPInfoResponse;
}

export namespace GetAllLPInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    operationList: Array<LPOperations.AsObject>,
    nextPageToken: number,
  }
}

export class LPOperations extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): LPOperations;

  getAction(): LpActionType;
  setAction(value: LpActionType): LPOperations;

  getChainId(): number;
  setChainId(value: number): LPOperations;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): LPOperations;

  getAmount(): number;
  setAmount(value: number): LPOperations;

  getTimestamp(): number;
  setTimestamp(value: number): LPOperations;

  getTxLink(): string;
  setTxLink(value: string): LPOperations;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPOperations.AsObject;
  static toObject(includeInstance: boolean, msg: LPOperations): LPOperations.AsObject;
  static serializeBinaryToWriter(message: LPOperations, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPOperations;
  static deserializeBinaryFromReader(message: LPOperations, reader: jspb.BinaryReader): LPOperations;
}

export namespace LPOperations {
  export type AsObject = {
    address: string,
    action: LpActionType,
    chainId: number,
    tokenSymbol: string,
    amount: number,
    timestamp: number,
    txLink: string,
  }
}

export class GetAllTXInfoRequest extends jspb.Message {
  getUsrAddressList(): Array<string>;
  setUsrAddressList(value: Array<string>): GetAllTXInfoRequest;
  clearUsrAddressList(): GetAllTXInfoRequest;
  addUsrAddress(value: string, index?: number): GetAllTXInfoRequest;

  getSrcChainIdList(): Array<number>;
  setSrcChainIdList(value: Array<number>): GetAllTXInfoRequest;
  clearSrcChainIdList(): GetAllTXInfoRequest;
  addSrcChainId(value: number, index?: number): GetAllTXInfoRequest;

  getDstChainIdList(): Array<number>;
  setDstChainIdList(value: Array<number>): GetAllTXInfoRequest;
  clearDstChainIdList(): GetAllTXInfoRequest;
  addDstChainId(value: number, index?: number): GetAllTXInfoRequest;

  getTokenSymbolList(): Array<string>;
  setTokenSymbolList(value: Array<string>): GetAllTXInfoRequest;
  clearTokenSymbolList(): GetAllTXInfoRequest;
  addTokenSymbol(value: string, index?: number): GetAllTXInfoRequest;

  getBeginTime(): number;
  setBeginTime(value: number): GetAllTXInfoRequest;

  getEndTime(): number;
  setEndTime(value: number): GetAllTXInfoRequest;

  getNextPageToken(): number;
  setNextPageToken(value: number): GetAllTXInfoRequest;

  getSigAddr(): string;
  setSigAddr(value: string): GetAllTXInfoRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetAllTXInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllTXInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllTXInfoRequest): GetAllTXInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllTXInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllTXInfoRequest;
  static deserializeBinaryFromReader(message: GetAllTXInfoRequest, reader: jspb.BinaryReader): GetAllTXInfoRequest;
}

export namespace GetAllTXInfoRequest {
  export type AsObject = {
    usrAddressList: Array<string>,
    srcChainIdList: Array<number>,
    dstChainIdList: Array<number>,
    tokenSymbolList: Array<string>,
    beginTime: number,
    endTime: number,
    nextPageToken: number,
    sigAddr: string,
    sig: Uint8Array | string,
  }
}

export class GetAllTXInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetAllTXInfoResponse;
  hasErr(): boolean;
  clearErr(): GetAllTXInfoResponse;

  getOperationList(): Array<TXOperations>;
  setOperationList(value: Array<TXOperations>): GetAllTXInfoResponse;
  clearOperationList(): GetAllTXInfoResponse;
  addOperation(value?: TXOperations, index?: number): TXOperations;

  getNextPageToken(): number;
  setNextPageToken(value: number): GetAllTXInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllTXInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllTXInfoResponse): GetAllTXInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllTXInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllTXInfoResponse;
  static deserializeBinaryFromReader(message: GetAllTXInfoResponse, reader: jspb.BinaryReader): GetAllTXInfoResponse;
}

export namespace GetAllTXInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    operationList: Array<TXOperations.AsObject>,
    nextPageToken: number,
  }
}

export class TXOperations extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): TXOperations;

  getSrcChainId(): number;
  setSrcChainId(value: number): TXOperations;

  getDstChainId(): number;
  setDstChainId(value: number): TXOperations;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): TXOperations;

  getSendAmount(): number;
  setSendAmount(value: number): TXOperations;

  getRecievedAmount(): number;
  setRecievedAmount(value: number): TXOperations;

  getBaseFee(): number;
  setBaseFee(value: number): TXOperations;

  getLiqFee(): number;
  setLiqFee(value: number): TXOperations;

  getPrice(): number;
  setPrice(value: number): TXOperations;

  getTimestamp(): number;
  setTimestamp(value: number): TXOperations;

  getSrcTxLink(): string;
  setSrcTxLink(value: string): TXOperations;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TXOperations.AsObject;
  static toObject(includeInstance: boolean, msg: TXOperations): TXOperations.AsObject;
  static serializeBinaryToWriter(message: TXOperations, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TXOperations;
  static deserializeBinaryFromReader(message: TXOperations, reader: jspb.BinaryReader): TXOperations;
}

export namespace TXOperations {
  export type AsObject = {
    address: string,
    srcChainId: number,
    dstChainId: number,
    tokenSymbol: string,
    sendAmount: number,
    recievedAmount: number,
    baseFee: number,
    liqFee: number,
    price: number,
    timestamp: number,
    srcTxLink: string,
  }
}

export class AbnormalStatusInfo extends jspb.Message {
  getType(): string;
  setType(value: string): AbnormalStatusInfo;

  getChainId(): number;
  setChainId(value: number): AbnormalStatusInfo;

  getDstChainId(): number;
  setDstChainId(value: number): AbnormalStatusInfo;

  getTxHash(): string;
  setTxHash(value: string): AbnormalStatusInfo;

  getTime(): string;
  setTime(value: string): AbnormalStatusInfo;

  getPeggedInfo(): string;
  setPeggedInfo(value: string): AbnormalStatusInfo;

  getSrcTransferId(): string;
  setSrcTransferId(value: string): AbnormalStatusInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AbnormalStatusInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AbnormalStatusInfo): AbnormalStatusInfo.AsObject;
  static serializeBinaryToWriter(message: AbnormalStatusInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AbnormalStatusInfo;
  static deserializeBinaryFromReader(message: AbnormalStatusInfo, reader: jspb.BinaryReader): AbnormalStatusInfo;
}

export namespace AbnormalStatusInfo {
  export type AsObject = {
    type: string,
    chainId: number,
    dstChainId: number,
    txHash: string,
    time: string,
    peggedInfo: string,
    srcTransferId: string,
  }
}

export class GetInfoByTxHashRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): GetInfoByTxHashRequest;

  getTxHash(): string;
  setTxHash(value: string): GetInfoByTxHashRequest;

  getType(): CSType;
  setType(value: CSType): GetInfoByTxHashRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): GetInfoByTxHashRequest;

  getAddr(): string;
  setAddr(value: string): GetInfoByTxHashRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInfoByTxHashRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetInfoByTxHashRequest): GetInfoByTxHashRequest.AsObject;
  static serializeBinaryToWriter(message: GetInfoByTxHashRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInfoByTxHashRequest;
  static deserializeBinaryFromReader(message: GetInfoByTxHashRequest, reader: jspb.BinaryReader): GetInfoByTxHashRequest;
}

export namespace GetInfoByTxHashRequest {
  export type AsObject = {
    chainId: number,
    txHash: string,
    type: CSType,
    sig: Uint8Array | string,
    addr: string,
  }
}

export class GetInfoByTxHashResponse extends jspb.Message {
  getOperation(): CSOperation;
  setOperation(value: CSOperation): GetInfoByTxHashResponse;

  getStatus(): UserCaseStatus;
  setStatus(value: UserCaseStatus): GetInfoByTxHashResponse;

  getMemo(): string;
  setMemo(value: string): GetInfoByTxHashResponse;

  getInfo(): string;
  setInfo(value: string): GetInfoByTxHashResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInfoByTxHashResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetInfoByTxHashResponse): GetInfoByTxHashResponse.AsObject;
  static serializeBinaryToWriter(message: GetInfoByTxHashResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInfoByTxHashResponse;
  static deserializeBinaryFromReader(message: GetInfoByTxHashResponse, reader: jspb.BinaryReader): GetInfoByTxHashResponse;
}

export namespace GetInfoByTxHashResponse {
  export type AsObject = {
    operation: CSOperation,
    status: UserCaseStatus,
    memo: string,
    info: string,
  }
}

export class FixEventMissRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): FixEventMissRequest;

  getTxHash(): string;
  setTxHash(value: string): FixEventMissRequest;

  getType(): CSType;
  setType(value: CSType): FixEventMissRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): FixEventMissRequest;

  getAddr(): string;
  setAddr(value: string): FixEventMissRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FixEventMissRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FixEventMissRequest): FixEventMissRequest.AsObject;
  static serializeBinaryToWriter(message: FixEventMissRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FixEventMissRequest;
  static deserializeBinaryFromReader(message: FixEventMissRequest, reader: jspb.BinaryReader): FixEventMissRequest;
}

export namespace FixEventMissRequest {
  export type AsObject = {
    chainId: number,
    txHash: string,
    type: CSType,
    sig: Uint8Array | string,
    addr: string,
  }
}

export class FixEventMissResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): FixEventMissResponse;
  hasErr(): boolean;
  clearErr(): FixEventMissResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FixEventMissResponse.AsObject;
  static toObject(includeInstance: boolean, msg: FixEventMissResponse): FixEventMissResponse.AsObject;
  static serializeBinaryToWriter(message: FixEventMissResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FixEventMissResponse;
  static deserializeBinaryFromReader(message: FixEventMissResponse, reader: jspb.BinaryReader): FixEventMissResponse;
}

export namespace FixEventMissResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
  }
}

export class GetAllConfigsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllConfigsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllConfigsRequest): GetAllConfigsRequest.AsObject;
  static serializeBinaryToWriter(message: GetAllConfigsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllConfigsRequest;
  static deserializeBinaryFromReader(message: GetAllConfigsRequest, reader: jspb.BinaryReader): GetAllConfigsRequest;
}

export namespace GetAllConfigsRequest {
  export type AsObject = {
  }
}

export class ExtendedPair extends jspb.Message {
  getPeggedPair(): sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair | undefined;
  setPeggedPair(value?: sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair): ExtendedPair;
  hasPeggedPair(): boolean;
  clearPeggedPair(): ExtendedPair;

  getMinDeposit(): string;
  setMinDeposit(value: string): ExtendedPair;

  getMaxDeposit(): string;
  setMaxDeposit(value: string): ExtendedPair;

  getMinBurn(): string;
  setMinBurn(value: string): ExtendedPair;

  getMaxBurn(): string;
  setMaxBurn(value: string): ExtendedPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtendedPair.AsObject;
  static toObject(includeInstance: boolean, msg: ExtendedPair): ExtendedPair.AsObject;
  static serializeBinaryToWriter(message: ExtendedPair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtendedPair;
  static deserializeBinaryFromReader(message: ExtendedPair, reader: jspb.BinaryReader): ExtendedPair;
}

export namespace ExtendedPair {
  export type AsObject = {
    peggedPair?: sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair.AsObject,
    minDeposit: string,
    maxDeposit: string,
    minBurn: string,
    maxBurn: string,
  }
}

export class GetAllConfigsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetAllConfigsResponse;
  hasErr(): boolean;
  clearErr(): GetAllConfigsResponse;

  getPeggedPairsList(): Array<ExtendedPair>;
  setPeggedPairsList(value: Array<ExtendedPair>): GetAllConfigsResponse;
  clearPeggedPairsList(): GetAllConfigsResponse;
  addPeggedPairs(value?: ExtendedPair, index?: number): ExtendedPair;

  getCbrConfig(): sgn_cbridge_v1_cbridge_pb.CbrConfig | undefined;
  setCbrConfig(value?: sgn_cbridge_v1_cbridge_pb.CbrConfig): GetAllConfigsResponse;
  hasCbrConfig(): boolean;
  clearCbrConfig(): GetAllConfigsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAllConfigsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAllConfigsResponse): GetAllConfigsResponse.AsObject;
  static serializeBinaryToWriter(message: GetAllConfigsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAllConfigsResponse;
  static deserializeBinaryFromReader(message: GetAllConfigsResponse, reader: jspb.BinaryReader): GetAllConfigsResponse;
}

export namespace GetAllConfigsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    peggedPairsList: Array<ExtendedPair.AsObject>,
    cbrConfig?: sgn_cbridge_v1_cbridge_pb.CbrConfig.AsObject,
  }
}

export class GetCbrConfigsOnChainRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): GetCbrConfigsOnChainRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCbrConfigsOnChainRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCbrConfigsOnChainRequest): GetCbrConfigsOnChainRequest.AsObject;
  static serializeBinaryToWriter(message: GetCbrConfigsOnChainRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCbrConfigsOnChainRequest;
  static deserializeBinaryFromReader(message: GetCbrConfigsOnChainRequest, reader: jspb.BinaryReader): GetCbrConfigsOnChainRequest;
}

export namespace GetCbrConfigsOnChainRequest {
  export type AsObject = {
    chainId: number,
  }
}

export class ExtendedToken extends jspb.Message {
  getToken(): sgn_cbridge_v1_query_pb.Token | undefined;
  setToken(value?: sgn_cbridge_v1_query_pb.Token): ExtendedToken;
  hasToken(): boolean;
  clearToken(): ExtendedToken;

  getDelayThreshold(): string;
  setDelayThreshold(value: string): ExtendedToken;

  getEpochVolumeCaps(): string;
  setEpochVolumeCaps(value: string): ExtendedToken;

  getMinSend(): string;
  setMinSend(value: string): ExtendedToken;

  getMaxSend(): string;
  setMaxSend(value: string): ExtendedToken;

  getMinAdd(): string;
  setMinAdd(value: string): ExtendedToken;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtendedToken.AsObject;
  static toObject(includeInstance: boolean, msg: ExtendedToken): ExtendedToken.AsObject;
  static serializeBinaryToWriter(message: ExtendedToken, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtendedToken;
  static deserializeBinaryFromReader(message: ExtendedToken, reader: jspb.BinaryReader): ExtendedToken;
}

export namespace ExtendedToken {
  export type AsObject = {
    token?: sgn_cbridge_v1_query_pb.Token.AsObject,
    delayThreshold: string,
    epochVolumeCaps: string,
    minSend: string,
    maxSend: string,
    minAdd: string,
  }
}

export class GetCbrConfigsOnChainResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetCbrConfigsOnChainResponse;
  hasErr(): boolean;
  clearErr(): GetCbrConfigsOnChainResponse;

  getDelayPeriod(): string;
  setDelayPeriod(value: string): GetCbrConfigsOnChainResponse;

  getEpochLength(): string;
  setEpochLength(value: string): GetCbrConfigsOnChainResponse;

  getNativeWrap(): string;
  setNativeWrap(value: string): GetCbrConfigsOnChainResponse;

  getTokensList(): Array<ExtendedToken>;
  setTokensList(value: Array<ExtendedToken>): GetCbrConfigsOnChainResponse;
  clearTokensList(): GetCbrConfigsOnChainResponse;
  addTokens(value?: ExtendedToken, index?: number): ExtendedToken;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCbrConfigsOnChainResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCbrConfigsOnChainResponse): GetCbrConfigsOnChainResponse.AsObject;
  static serializeBinaryToWriter(message: GetCbrConfigsOnChainResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCbrConfigsOnChainResponse;
  static deserializeBinaryFromReader(message: GetCbrConfigsOnChainResponse, reader: jspb.BinaryReader): GetCbrConfigsOnChainResponse;
}

export namespace GetCbrConfigsOnChainResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    delayPeriod: string,
    epochLength: string,
    nativeWrap: string,
    tokensList: Array<ExtendedToken.AsObject>,
  }
}

export class RetentionRewardsEvent extends jspb.Message {
  getEventId(): number;
  setEventId(value: number): RetentionRewardsEvent;

  getEventStartTime(): number;
  setEventStartTime(value: number): RetentionRewardsEvent;

  getEventEndTime(): number;
  setEventEndTime(value: number): RetentionRewardsEvent;

  getWrapper(): RetentionRewardsEventLevelConfigWrapper | undefined;
  setWrapper(value?: RetentionRewardsEventLevelConfigWrapper): RetentionRewardsEvent;
  hasWrapper(): boolean;
  clearWrapper(): RetentionRewardsEvent;

  getEventPromoImgUrl(): string;
  setEventPromoImgUrl(value: string): RetentionRewardsEvent;

  getEventFaqLinkUrl(): string;
  setEventFaqLinkUrl(value: string): RetentionRewardsEvent;

  getEventRewardsTooltip(): string;
  setEventRewardsTooltip(value: string): RetentionRewardsEvent;

  getEventDescription(): string;
  setEventDescription(value: string): RetentionRewardsEvent;

  getEventTitle(): string;
  setEventTitle(value: string): RetentionRewardsEvent;

  getEventMaxRewardCap(): number;
  setEventMaxRewardCap(value: number): RetentionRewardsEvent;

  getSoFarSumReward(): number;
  setSoFarSumReward(value: number): RetentionRewardsEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RetentionRewardsEvent.AsObject;
  static toObject(includeInstance: boolean, msg: RetentionRewardsEvent): RetentionRewardsEvent.AsObject;
  static serializeBinaryToWriter(message: RetentionRewardsEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RetentionRewardsEvent;
  static deserializeBinaryFromReader(message: RetentionRewardsEvent, reader: jspb.BinaryReader): RetentionRewardsEvent;
}

export namespace RetentionRewardsEvent {
  export type AsObject = {
    eventId: number,
    eventStartTime: number,
    eventEndTime: number,
    wrapper?: RetentionRewardsEventLevelConfigWrapper.AsObject,
    eventPromoImgUrl: string,
    eventFaqLinkUrl: string,
    eventRewardsTooltip: string,
    eventDescription: string,
    eventTitle: string,
    eventMaxRewardCap: number,
    soFarSumReward: number,
  }
}

export class RetentionRewardsEventLevelConfigWrapper extends jspb.Message {
  getLevelConfigMap(): jspb.Map<string, RetentionRewardsLevelConfig>;
  clearLevelConfigMap(): RetentionRewardsEventLevelConfigWrapper;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RetentionRewardsEventLevelConfigWrapper.AsObject;
  static toObject(includeInstance: boolean, msg: RetentionRewardsEventLevelConfigWrapper): RetentionRewardsEventLevelConfigWrapper.AsObject;
  static serializeBinaryToWriter(message: RetentionRewardsEventLevelConfigWrapper, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RetentionRewardsEventLevelConfigWrapper;
  static deserializeBinaryFromReader(message: RetentionRewardsEventLevelConfigWrapper, reader: jspb.BinaryReader): RetentionRewardsEventLevelConfigWrapper;
}

export namespace RetentionRewardsEventLevelConfigWrapper {
  export type AsObject = {
    levelConfigMap: Array<[string, RetentionRewardsLevelConfig.AsObject]>,
  }
}

export class RetentionRewardsLevelConfig extends jspb.Message {
  getMaxReward(): string;
  setMaxReward(value: string): RetentionRewardsLevelConfig;

  getMaxTransferVolume(): number;
  setMaxTransferVolume(value: number): RetentionRewardsLevelConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RetentionRewardsLevelConfig.AsObject;
  static toObject(includeInstance: boolean, msg: RetentionRewardsLevelConfig): RetentionRewardsLevelConfig.AsObject;
  static serializeBinaryToWriter(message: RetentionRewardsLevelConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RetentionRewardsLevelConfig;
  static deserializeBinaryFromReader(message: RetentionRewardsLevelConfig, reader: jspb.BinaryReader): RetentionRewardsLevelConfig;
}

export namespace RetentionRewardsLevelConfig {
  export type AsObject = {
    maxReward: string,
    maxTransferVolume: number,
  }
}

export class GetRetentionRewardsInfoRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): GetRetentionRewardsInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRetentionRewardsInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRetentionRewardsInfoRequest): GetRetentionRewardsInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetRetentionRewardsInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRetentionRewardsInfoRequest;
  static deserializeBinaryFromReader(message: GetRetentionRewardsInfoRequest, reader: jspb.BinaryReader): GetRetentionRewardsInfoRequest;
}

export namespace GetRetentionRewardsInfoRequest {
  export type AsObject = {
    addr: string,
  }
}

export class GetRetentionRewardsInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetRetentionRewardsInfoResponse;
  hasErr(): boolean;
  clearErr(): GetRetentionRewardsInfoResponse;

  getEventId(): number;
  setEventId(value: number): GetRetentionRewardsInfoResponse;

  getEventEndTime(): number;
  setEventEndTime(value: number): GetRetentionRewardsInfoResponse;

  getMaxReward(): string;
  setMaxReward(value: string): GetRetentionRewardsInfoResponse;

  getMaxTransferVolume(): number;
  setMaxTransferVolume(value: number): GetRetentionRewardsInfoResponse;

  getCurrentReward(): string;
  setCurrentReward(value: string): GetRetentionRewardsInfoResponse;

  getCelrUsdPrice(): number;
  setCelrUsdPrice(value: number): GetRetentionRewardsInfoResponse;

  getClaimTime(): number;
  setClaimTime(value: number): GetRetentionRewardsInfoResponse;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): GetRetentionRewardsInfoResponse;
  hasSignature(): boolean;
  clearSignature(): GetRetentionRewardsInfoResponse;

  getEventPromoImgUrl(): string;
  setEventPromoImgUrl(value: string): GetRetentionRewardsInfoResponse;

  getEventFaqLinkUrl(): string;
  setEventFaqLinkUrl(value: string): GetRetentionRewardsInfoResponse;

  getEventRewardsTooltip(): string;
  setEventRewardsTooltip(value: string): GetRetentionRewardsInfoResponse;

  getEventDescription(): string;
  setEventDescription(value: string): GetRetentionRewardsInfoResponse;

  getEventTitle(): string;
  setEventTitle(value: string): GetRetentionRewardsInfoResponse;

  getEventMaxRewardCap(): number;
  setEventMaxRewardCap(value: number): GetRetentionRewardsInfoResponse;

  getSoFarSumReward(): number;
  setSoFarSumReward(value: number): GetRetentionRewardsInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRetentionRewardsInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRetentionRewardsInfoResponse): GetRetentionRewardsInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetRetentionRewardsInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRetentionRewardsInfoResponse;
  static deserializeBinaryFromReader(message: GetRetentionRewardsInfoResponse, reader: jspb.BinaryReader): GetRetentionRewardsInfoResponse;
}

export namespace GetRetentionRewardsInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eventId: number,
    eventEndTime: number,
    maxReward: string,
    maxTransferVolume: number,
    currentReward: string,
    celrUsdPrice: number,
    claimTime: number,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
    eventPromoImgUrl: string,
    eventFaqLinkUrl: string,
    eventRewardsTooltip: string,
    eventDescription: string,
    eventTitle: string,
    eventMaxRewardCap: number,
    soFarSumReward: number,
  }
}

export class ClaimRetentionRewardsRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): ClaimRetentionRewardsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimRetentionRewardsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimRetentionRewardsRequest): ClaimRetentionRewardsRequest.AsObject;
  static serializeBinaryToWriter(message: ClaimRetentionRewardsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimRetentionRewardsRequest;
  static deserializeBinaryFromReader(message: ClaimRetentionRewardsRequest, reader: jspb.BinaryReader): ClaimRetentionRewardsRequest;
}

export namespace ClaimRetentionRewardsRequest {
  export type AsObject = {
    addr: string,
  }
}

export class ClaimRetentionRewardsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ClaimRetentionRewardsResponse;
  hasErr(): boolean;
  clearErr(): ClaimRetentionRewardsResponse;

  getEventId(): number;
  setEventId(value: number): ClaimRetentionRewardsResponse;

  getCurrentReward(): string;
  setCurrentReward(value: string): ClaimRetentionRewardsResponse;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): ClaimRetentionRewardsResponse;
  hasSignature(): boolean;
  clearSignature(): ClaimRetentionRewardsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimRetentionRewardsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimRetentionRewardsResponse): ClaimRetentionRewardsResponse.AsObject;
  static serializeBinaryToWriter(message: ClaimRetentionRewardsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimRetentionRewardsResponse;
  static deserializeBinaryFromReader(message: ClaimRetentionRewardsResponse, reader: jspb.BinaryReader): ClaimRetentionRewardsResponse;
}

export namespace ClaimRetentionRewardsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eventId: number,
    currentReward: string,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
  }
}

export class GetIncentiveCampaignCelrRankRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIncentiveCampaignCelrRankRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetIncentiveCampaignCelrRankRequest): GetIncentiveCampaignCelrRankRequest.AsObject;
  static serializeBinaryToWriter(message: GetIncentiveCampaignCelrRankRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIncentiveCampaignCelrRankRequest;
  static deserializeBinaryFromReader(message: GetIncentiveCampaignCelrRankRequest, reader: jspb.BinaryReader): GetIncentiveCampaignCelrRankRequest;
}

export namespace GetIncentiveCampaignCelrRankRequest {
  export type AsObject = {
  }
}

export class GetIncentiveCampaignCelrRankResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetIncentiveCampaignCelrRankResponse;
  hasErr(): boolean;
  clearErr(): GetIncentiveCampaignCelrRankResponse;

  getRanksList(): Array<IncentiveCampaignRank>;
  setRanksList(value: Array<IncentiveCampaignRank>): GetIncentiveCampaignCelrRankResponse;
  clearRanksList(): GetIncentiveCampaignCelrRankResponse;
  addRanks(value?: IncentiveCampaignRank, index?: number): IncentiveCampaignRank;

  getUpdateTime(): number;
  setUpdateTime(value: number): GetIncentiveCampaignCelrRankResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIncentiveCampaignCelrRankResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetIncentiveCampaignCelrRankResponse): GetIncentiveCampaignCelrRankResponse.AsObject;
  static serializeBinaryToWriter(message: GetIncentiveCampaignCelrRankResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIncentiveCampaignCelrRankResponse;
  static deserializeBinaryFromReader(message: GetIncentiveCampaignCelrRankResponse, reader: jspb.BinaryReader): GetIncentiveCampaignCelrRankResponse;
}

export namespace GetIncentiveCampaignCelrRankResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    ranksList: Array<IncentiveCampaignRank.AsObject>,
    updateTime: number,
  }
}

export class GetIncentiveCampaignBnbRankRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIncentiveCampaignBnbRankRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetIncentiveCampaignBnbRankRequest): GetIncentiveCampaignBnbRankRequest.AsObject;
  static serializeBinaryToWriter(message: GetIncentiveCampaignBnbRankRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIncentiveCampaignBnbRankRequest;
  static deserializeBinaryFromReader(message: GetIncentiveCampaignBnbRankRequest, reader: jspb.BinaryReader): GetIncentiveCampaignBnbRankRequest;
}

export namespace GetIncentiveCampaignBnbRankRequest {
  export type AsObject = {
  }
}

export class GetIncentiveCampaignBnbRankResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetIncentiveCampaignBnbRankResponse;
  hasErr(): boolean;
  clearErr(): GetIncentiveCampaignBnbRankResponse;

  getRanksList(): Array<IncentiveCampaignRank>;
  setRanksList(value: Array<IncentiveCampaignRank>): GetIncentiveCampaignBnbRankResponse;
  clearRanksList(): GetIncentiveCampaignBnbRankResponse;
  addRanks(value?: IncentiveCampaignRank, index?: number): IncentiveCampaignRank;

  getUpdateTime(): number;
  setUpdateTime(value: number): GetIncentiveCampaignBnbRankResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetIncentiveCampaignBnbRankResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetIncentiveCampaignBnbRankResponse): GetIncentiveCampaignBnbRankResponse.AsObject;
  static serializeBinaryToWriter(message: GetIncentiveCampaignBnbRankResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetIncentiveCampaignBnbRankResponse;
  static deserializeBinaryFromReader(message: GetIncentiveCampaignBnbRankResponse, reader: jspb.BinaryReader): GetIncentiveCampaignBnbRankResponse;
}

export namespace GetIncentiveCampaignBnbRankResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    ranksList: Array<IncentiveCampaignRank.AsObject>,
    updateTime: number,
  }
}

export class InIncentiveCampaignBnbWhiteListRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): InIncentiveCampaignBnbWhiteListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InIncentiveCampaignBnbWhiteListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: InIncentiveCampaignBnbWhiteListRequest): InIncentiveCampaignBnbWhiteListRequest.AsObject;
  static serializeBinaryToWriter(message: InIncentiveCampaignBnbWhiteListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InIncentiveCampaignBnbWhiteListRequest;
  static deserializeBinaryFromReader(message: InIncentiveCampaignBnbWhiteListRequest, reader: jspb.BinaryReader): InIncentiveCampaignBnbWhiteListRequest;
}

export namespace InIncentiveCampaignBnbWhiteListRequest {
  export type AsObject = {
    addr: string,
  }
}

export class InIncentiveCampaignBnbWhiteListResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): InIncentiveCampaignBnbWhiteListResponse;
  hasErr(): boolean;
  clearErr(): InIncentiveCampaignBnbWhiteListResponse;

  getEligible(): boolean;
  setEligible(value: boolean): InIncentiveCampaignBnbWhiteListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InIncentiveCampaignBnbWhiteListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: InIncentiveCampaignBnbWhiteListResponse): InIncentiveCampaignBnbWhiteListResponse.AsObject;
  static serializeBinaryToWriter(message: InIncentiveCampaignBnbWhiteListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InIncentiveCampaignBnbWhiteListResponse;
  static deserializeBinaryFromReader(message: InIncentiveCampaignBnbWhiteListResponse, reader: jspb.BinaryReader): InIncentiveCampaignBnbWhiteListResponse;
}

export namespace InIncentiveCampaignBnbWhiteListResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eligible: boolean,
  }
}

export class IncentiveCampaignRank extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): IncentiveCampaignRank;

  getRank(): number;
  setRank(value: number): IncentiveCampaignRank;

  getVolume(): number;
  setVolume(value: number): IncentiveCampaignRank;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IncentiveCampaignRank.AsObject;
  static toObject(includeInstance: boolean, msg: IncentiveCampaignRank): IncentiveCampaignRank.AsObject;
  static serializeBinaryToWriter(message: IncentiveCampaignRank, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IncentiveCampaignRank;
  static deserializeBinaryFromReader(message: IncentiveCampaignRank, reader: jspb.BinaryReader): IncentiveCampaignRank;
}

export namespace IncentiveCampaignRank {
  export type AsObject = {
    addr: string,
    rank: number,
    volume: number,
  }
}

export class FeeRebateEvent extends jspb.Message {
  getEventId(): number;
  setEventId(value: number): FeeRebateEvent;

  getEventStartTime(): number;
  setEventStartTime(value: number): FeeRebateEvent;

  getEventEndTime(): number;
  setEventEndTime(value: number): FeeRebateEvent;

  getWrapper(): FeeRebateEventLevelConfigWrapper | undefined;
  setWrapper(value?: FeeRebateEventLevelConfigWrapper): FeeRebateEvent;
  hasWrapper(): boolean;
  clearWrapper(): FeeRebateEvent;

  getEventMaxRewardCap(): number;
  setEventMaxRewardCap(value: number): FeeRebateEvent;

  getSoFarSumReward(): number;
  setSoFarSumReward(value: number): FeeRebateEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeRebateEvent.AsObject;
  static toObject(includeInstance: boolean, msg: FeeRebateEvent): FeeRebateEvent.AsObject;
  static serializeBinaryToWriter(message: FeeRebateEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeRebateEvent;
  static deserializeBinaryFromReader(message: FeeRebateEvent, reader: jspb.BinaryReader): FeeRebateEvent;
}

export namespace FeeRebateEvent {
  export type AsObject = {
    eventId: number,
    eventStartTime: number,
    eventEndTime: number,
    wrapper?: FeeRebateEventLevelConfigWrapper.AsObject,
    eventMaxRewardCap: number,
    soFarSumReward: number,
  }
}

export class FeeRebateEventLevelConfigWrapper extends jspb.Message {
  getLevelDivisionLowerBoundList(): Array<number>;
  setLevelDivisionLowerBoundList(value: Array<number>): FeeRebateEventLevelConfigWrapper;
  clearLevelDivisionLowerBoundList(): FeeRebateEventLevelConfigWrapper;
  addLevelDivisionLowerBound(value: number, index?: number): FeeRebateEventLevelConfigWrapper;

  getLevelConfigMap(): jspb.Map<string, FeeRebateLevelConfig>;
  clearLevelConfigMap(): FeeRebateEventLevelConfigWrapper;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeRebateEventLevelConfigWrapper.AsObject;
  static toObject(includeInstance: boolean, msg: FeeRebateEventLevelConfigWrapper): FeeRebateEventLevelConfigWrapper.AsObject;
  static serializeBinaryToWriter(message: FeeRebateEventLevelConfigWrapper, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeRebateEventLevelConfigWrapper;
  static deserializeBinaryFromReader(message: FeeRebateEventLevelConfigWrapper, reader: jspb.BinaryReader): FeeRebateEventLevelConfigWrapper;
}

export namespace FeeRebateEventLevelConfigWrapper {
  export type AsObject = {
    levelDivisionLowerBoundList: Array<number>,
    levelConfigMap: Array<[string, FeeRebateLevelConfig.AsObject]>,
  }
}

export class FeeRebateLevelConfig extends jspb.Message {
  getRebatePortion(): number;
  setRebatePortion(value: number): FeeRebateLevelConfig;

  getMaxReward(): string;
  setMaxReward(value: string): FeeRebateLevelConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeRebateLevelConfig.AsObject;
  static toObject(includeInstance: boolean, msg: FeeRebateLevelConfig): FeeRebateLevelConfig.AsObject;
  static serializeBinaryToWriter(message: FeeRebateLevelConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeRebateLevelConfig;
  static deserializeBinaryFromReader(message: FeeRebateLevelConfig, reader: jspb.BinaryReader): FeeRebateLevelConfig;
}

export namespace FeeRebateLevelConfig {
  export type AsObject = {
    rebatePortion: number,
    maxReward: string,
  }
}

export class GetFeeRebateInfoRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): GetFeeRebateInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeeRebateInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeeRebateInfoRequest): GetFeeRebateInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetFeeRebateInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeeRebateInfoRequest;
  static deserializeBinaryFromReader(message: GetFeeRebateInfoRequest, reader: jspb.BinaryReader): GetFeeRebateInfoRequest;
}

export namespace GetFeeRebateInfoRequest {
  export type AsObject = {
    addr: string,
  }
}

export class GetFeeRebateInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetFeeRebateInfoResponse;
  hasErr(): boolean;
  clearErr(): GetFeeRebateInfoResponse;

  getEventId(): number;
  setEventId(value: number): GetFeeRebateInfoResponse;

  getEventEndTime(): number;
  setEventEndTime(value: number): GetFeeRebateInfoResponse;

  getRebatePortion(): number;
  setRebatePortion(value: number): GetFeeRebateInfoResponse;

  getReward(): string;
  setReward(value: string): GetFeeRebateInfoResponse;

  getCelrUsdPrice(): number;
  setCelrUsdPrice(value: number): GetFeeRebateInfoResponse;

  getClaimTime(): number;
  setClaimTime(value: number): GetFeeRebateInfoResponse;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): GetFeeRebateInfoResponse;
  hasSignature(): boolean;
  clearSignature(): GetFeeRebateInfoResponse;

  getEventMaxRewardCap(): number;
  setEventMaxRewardCap(value: number): GetFeeRebateInfoResponse;

  getSoFarSumReward(): number;
  setSoFarSumReward(value: number): GetFeeRebateInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFeeRebateInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFeeRebateInfoResponse): GetFeeRebateInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetFeeRebateInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFeeRebateInfoResponse;
  static deserializeBinaryFromReader(message: GetFeeRebateInfoResponse, reader: jspb.BinaryReader): GetFeeRebateInfoResponse;
}

export namespace GetFeeRebateInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eventId: number,
    eventEndTime: number,
    rebatePortion: number,
    reward: string,
    celrUsdPrice: number,
    claimTime: number,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
    eventMaxRewardCap: number,
    soFarSumReward: number,
  }
}

export class ClaimFeeRebateRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): ClaimFeeRebateRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimFeeRebateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimFeeRebateRequest): ClaimFeeRebateRequest.AsObject;
  static serializeBinaryToWriter(message: ClaimFeeRebateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimFeeRebateRequest;
  static deserializeBinaryFromReader(message: ClaimFeeRebateRequest, reader: jspb.BinaryReader): ClaimFeeRebateRequest;
}

export namespace ClaimFeeRebateRequest {
  export type AsObject = {
    addr: string,
  }
}

export class ClaimFeeRebateResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ClaimFeeRebateResponse;
  hasErr(): boolean;
  clearErr(): ClaimFeeRebateResponse;

  getEventId(): number;
  setEventId(value: number): ClaimFeeRebateResponse;

  getReward(): string;
  setReward(value: string): ClaimFeeRebateResponse;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): ClaimFeeRebateResponse;
  hasSignature(): boolean;
  clearSignature(): ClaimFeeRebateResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimFeeRebateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimFeeRebateResponse): ClaimFeeRebateResponse.AsObject;
  static serializeBinaryToWriter(message: ClaimFeeRebateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimFeeRebateResponse;
  static deserializeBinaryFromReader(message: ClaimFeeRebateResponse, reader: jspb.BinaryReader): ClaimFeeRebateResponse;
}

export namespace ClaimFeeRebateResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eventId: number,
    reward: string,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
  }
}

export class BscCampaignEventConfig extends jspb.Message {
  getEventId(): number;
  setEventId(value: number): BscCampaignEventConfig;

  getEventStartTime(): number;
  setEventStartTime(value: number): BscCampaignEventConfig;

  getEventEndTime(): number;
  setEventEndTime(value: number): BscCampaignEventConfig;

  getEventPromoImgUrl(): string;
  setEventPromoImgUrl(value: string): BscCampaignEventConfig;

  getEventFaqLinkUrl(): string;
  setEventFaqLinkUrl(value: string): BscCampaignEventConfig;

  getEventRewardsTooltip(): string;
  setEventRewardsTooltip(value: string): BscCampaignEventConfig;

  getEventDescription(): string;
  setEventDescription(value: string): BscCampaignEventConfig;

  getEventTitle(): string;
  setEventTitle(value: string): BscCampaignEventConfig;

  getWbnbAddr(): string;
  setWbnbAddr(value: string): BscCampaignEventConfig;

  getRewardContractAddr(): string;
  setRewardContractAddr(value: string): BscCampaignEventConfig;

  getEventMaxRewardCap(): number;
  setEventMaxRewardCap(value: number): BscCampaignEventConfig;

  getSoFarSumReward(): number;
  setSoFarSumReward(value: number): BscCampaignEventConfig;

  getMaxReward(): string;
  setMaxReward(value: string): BscCampaignEventConfig;

  getMaxTransferVolume(): number;
  setMaxTransferVolume(value: number): BscCampaignEventConfig;

  getTransferWhiteList(): BscCampaignTransferWhiteListWrapper | undefined;
  setTransferWhiteList(value?: BscCampaignTransferWhiteListWrapper): BscCampaignEventConfig;
  hasTransferWhiteList(): boolean;
  clearTransferWhiteList(): BscCampaignEventConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BscCampaignEventConfig.AsObject;
  static toObject(includeInstance: boolean, msg: BscCampaignEventConfig): BscCampaignEventConfig.AsObject;
  static serializeBinaryToWriter(message: BscCampaignEventConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BscCampaignEventConfig;
  static deserializeBinaryFromReader(message: BscCampaignEventConfig, reader: jspb.BinaryReader): BscCampaignEventConfig;
}

export namespace BscCampaignEventConfig {
  export type AsObject = {
    eventId: number,
    eventStartTime: number,
    eventEndTime: number,
    eventPromoImgUrl: string,
    eventFaqLinkUrl: string,
    eventRewardsTooltip: string,
    eventDescription: string,
    eventTitle: string,
    wbnbAddr: string,
    rewardContractAddr: string,
    eventMaxRewardCap: number,
    soFarSumReward: number,
    maxReward: string,
    maxTransferVolume: number,
    transferWhiteList?: BscCampaignTransferWhiteListWrapper.AsObject,
  }
}

export class BscCampaignTransferWhiteListWrapper extends jspb.Message {
  getTransferWhiteListMap(): jspb.Map<string, BscCampaignTransferWhiteList>;
  clearTransferWhiteListMap(): BscCampaignTransferWhiteListWrapper;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BscCampaignTransferWhiteListWrapper.AsObject;
  static toObject(includeInstance: boolean, msg: BscCampaignTransferWhiteListWrapper): BscCampaignTransferWhiteListWrapper.AsObject;
  static serializeBinaryToWriter(message: BscCampaignTransferWhiteListWrapper, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BscCampaignTransferWhiteListWrapper;
  static deserializeBinaryFromReader(message: BscCampaignTransferWhiteListWrapper, reader: jspb.BinaryReader): BscCampaignTransferWhiteListWrapper;
}

export namespace BscCampaignTransferWhiteListWrapper {
  export type AsObject = {
    transferWhiteListMap: Array<[string, BscCampaignTransferWhiteList.AsObject]>,
  }
}

export class BscCampaignTransferWhiteList extends jspb.Message {
  getChainIdsList(): Array<number>;
  setChainIdsList(value: Array<number>): BscCampaignTransferWhiteList;
  clearChainIdsList(): BscCampaignTransferWhiteList;
  addChainIds(value: number, index?: number): BscCampaignTransferWhiteList;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BscCampaignTransferWhiteList.AsObject;
  static toObject(includeInstance: boolean, msg: BscCampaignTransferWhiteList): BscCampaignTransferWhiteList.AsObject;
  static serializeBinaryToWriter(message: BscCampaignTransferWhiteList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BscCampaignTransferWhiteList;
  static deserializeBinaryFromReader(message: BscCampaignTransferWhiteList, reader: jspb.BinaryReader): BscCampaignTransferWhiteList;
}

export namespace BscCampaignTransferWhiteList {
  export type AsObject = {
    chainIdsList: Array<number>,
  }
}

export class GetBscCampaignInfoRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): GetBscCampaignInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBscCampaignInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBscCampaignInfoRequest): GetBscCampaignInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetBscCampaignInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBscCampaignInfoRequest;
  static deserializeBinaryFromReader(message: GetBscCampaignInfoRequest, reader: jspb.BinaryReader): GetBscCampaignInfoRequest;
}

export namespace GetBscCampaignInfoRequest {
  export type AsObject = {
    addr: string,
  }
}

export class BscCampaignInfo extends jspb.Message {
  getEventConfig(): BscCampaignEventConfig | undefined;
  setEventConfig(value?: BscCampaignEventConfig): BscCampaignInfo;
  hasEventConfig(): boolean;
  clearEventConfig(): BscCampaignInfo;

  getCurrentTransferVolume(): number;
  setCurrentTransferVolume(value: number): BscCampaignInfo;

  getWbnbUsdPrice(): number;
  setWbnbUsdPrice(value: number): BscCampaignInfo;

  getClaimTime(): number;
  setClaimTime(value: number): BscCampaignInfo;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): BscCampaignInfo;
  hasSignature(): boolean;
  clearSignature(): BscCampaignInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BscCampaignInfo.AsObject;
  static toObject(includeInstance: boolean, msg: BscCampaignInfo): BscCampaignInfo.AsObject;
  static serializeBinaryToWriter(message: BscCampaignInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BscCampaignInfo;
  static deserializeBinaryFromReader(message: BscCampaignInfo, reader: jspb.BinaryReader): BscCampaignInfo;
}

export namespace BscCampaignInfo {
  export type AsObject = {
    eventConfig?: BscCampaignEventConfig.AsObject,
    currentTransferVolume: number,
    wbnbUsdPrice: number,
    claimTime: number,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
  }
}

export class GetBscCampaignInfoResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetBscCampaignInfoResponse;
  hasErr(): boolean;
  clearErr(): GetBscCampaignInfoResponse;

  getInfoList(): Array<BscCampaignInfo>;
  setInfoList(value: Array<BscCampaignInfo>): GetBscCampaignInfoResponse;
  clearInfoList(): GetBscCampaignInfoResponse;
  addInfo(value?: BscCampaignInfo, index?: number): BscCampaignInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBscCampaignInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBscCampaignInfoResponse): GetBscCampaignInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetBscCampaignInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBscCampaignInfoResponse;
  static deserializeBinaryFromReader(message: GetBscCampaignInfoResponse, reader: jspb.BinaryReader): GetBscCampaignInfoResponse;
}

export namespace GetBscCampaignInfoResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    infoList: Array<BscCampaignInfo.AsObject>,
  }
}

export class ClaimGetBscCampaignRewardRequest extends jspb.Message {
  getAddr(): string;
  setAddr(value: string): ClaimGetBscCampaignRewardRequest;

  getEventId(): number;
  setEventId(value: number): ClaimGetBscCampaignRewardRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimGetBscCampaignRewardRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimGetBscCampaignRewardRequest): ClaimGetBscCampaignRewardRequest.AsObject;
  static serializeBinaryToWriter(message: ClaimGetBscCampaignRewardRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimGetBscCampaignRewardRequest;
  static deserializeBinaryFromReader(message: ClaimGetBscCampaignRewardRequest, reader: jspb.BinaryReader): ClaimGetBscCampaignRewardRequest;
}

export namespace ClaimGetBscCampaignRewardRequest {
  export type AsObject = {
    addr: string,
    eventId: number,
  }
}

export class ClaimGetBscCampaignRewardResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ClaimGetBscCampaignRewardResponse;
  hasErr(): boolean;
  clearErr(): ClaimGetBscCampaignRewardResponse;

  getEventId(): number;
  setEventId(value: number): ClaimGetBscCampaignRewardResponse;

  getCurrentReward(): string;
  setCurrentReward(value: string): ClaimGetBscCampaignRewardResponse;

  getSignature(): sgn_common_v1_common_pb.Signature | undefined;
  setSignature(value?: sgn_common_v1_common_pb.Signature): ClaimGetBscCampaignRewardResponse;
  hasSignature(): boolean;
  clearSignature(): ClaimGetBscCampaignRewardResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimGetBscCampaignRewardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimGetBscCampaignRewardResponse): ClaimGetBscCampaignRewardResponse.AsObject;
  static serializeBinaryToWriter(message: ClaimGetBscCampaignRewardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimGetBscCampaignRewardResponse;
  static deserializeBinaryFromReader(message: ClaimGetBscCampaignRewardResponse, reader: jspb.BinaryReader): ClaimGetBscCampaignRewardResponse;
}

export namespace ClaimGetBscCampaignRewardResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    eventId: number,
    currentReward: string,
    signature?: sgn_common_v1_common_pb.Signature.AsObject,
  }
}

export class GetCurrentBlockNumberByNodeRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCurrentBlockNumberByNodeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCurrentBlockNumberByNodeRequest): GetCurrentBlockNumberByNodeRequest.AsObject;
  static serializeBinaryToWriter(message: GetCurrentBlockNumberByNodeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCurrentBlockNumberByNodeRequest;
  static deserializeBinaryFromReader(message: GetCurrentBlockNumberByNodeRequest, reader: jspb.BinaryReader): GetCurrentBlockNumberByNodeRequest;
}

export namespace GetCurrentBlockNumberByNodeRequest {
  export type AsObject = {
  }
}

export class GetCurrentBlockNumberByNodeResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): GetCurrentBlockNumberByNodeResponse;
  hasErr(): boolean;
  clearErr(): GetCurrentBlockNumberByNodeResponse;

  getReportsMap(): jspb.Map<string, sgn_health_v1_health_pb.SgnAnalyticsReport>;
  clearReportsMap(): GetCurrentBlockNumberByNodeResponse;

  getProblematicAddrsList(): Array<string>;
  setProblematicAddrsList(value: Array<string>): GetCurrentBlockNumberByNodeResponse;
  clearProblematicAddrsList(): GetCurrentBlockNumberByNodeResponse;
  addProblematicAddrs(value: string, index?: number): GetCurrentBlockNumberByNodeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCurrentBlockNumberByNodeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCurrentBlockNumberByNodeResponse): GetCurrentBlockNumberByNodeResponse.AsObject;
  static serializeBinaryToWriter(message: GetCurrentBlockNumberByNodeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCurrentBlockNumberByNodeResponse;
  static deserializeBinaryFromReader(message: GetCurrentBlockNumberByNodeResponse, reader: jspb.BinaryReader): GetCurrentBlockNumberByNodeResponse;
}

export namespace GetCurrentBlockNumberByNodeResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
    reportsMap: Array<[string, sgn_health_v1_health_pb.SgnAnalyticsReport.AsObject]>,
    problematicAddrsList: Array<string>,
  }
}

export class ErrMsg extends jspb.Message {
  getCode(): ErrCode;
  setCode(value: ErrCode): ErrMsg;

  getMsg(): string;
  setMsg(value: string): ErrMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ErrMsg): ErrMsg.AsObject;
  static serializeBinaryToWriter(message: ErrMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrMsg;
  static deserializeBinaryFromReader(message: ErrMsg, reader: jspb.BinaryReader): ErrMsg;
}

export namespace ErrMsg {
  export type AsObject = {
    code: ErrCode,
    msg: string,
  }
}

export enum LPType { 
  LP_TYPE_UNKNOWN = 0,
  LP_TYPE_ADD = 1,
  LP_TYPE_REMOVE = 2,
}
export enum CSType { 
  CT_UNKNOWN = 0,
  CT_TX = 1,
  CT_LP_ADD = 2,
  CT_LP_RM = 3,
  CT_DROP_GAS = 4,
}
export enum CSOperation { 
  CA_UNKNOWN = 0,
  CA_NORMAL = 1,
  CA_WAITING = 2,
  CA_REPORT = 3,
  CA_USE_RESYNC_TOOL = 4,
  CA_USE_RESIGN_TOOL = 5,
  CA_USE_RESUMBIT_TOOL = 6,
  CA_MORE_INFO_NEEDED = 7,
  CA_CS_TOOL = 8,
}
export enum UserCaseStatus { 
  CC_UNKNOWN = 0,
  CC_TRANSFER_NO_HISTORY = 1,
  CC_TRANSFER_SUBMITTING = 2,
  CC_TRANSFER_WAITING_FOR_SGN_CONFIRMATION = 3,
  CC_TRANSFER_WAITING_FOR_FUND_RELEASE = 4,
  CC_TRANSFER_REQUESTING_REFUND = 5,
  CC_TRANSFER_CONFIRMING_YOUR_REFUND = 6,
  CC_ADD_NO_HISTORY = 7,
  CC_ADD_SUBMITTING = 8,
  CC_ADD_WAITING_FOR_SGN = 9,
  CC_WAITING_FOR_LP = 10,
  CC_WITHDRAW_SUBMITTING = 11,
  CC_WITHDRAW_WAITING_FOR_SGN = 12,
  CC_DROP_GAS_FAIL = 13,
  CC_DROP_GAS_SUCCESS = 14,
  CC_DROP_GAS_NO_RECORD = 15,
}
export enum WithdrawMethodType { 
  WD_METHOD_TYPE_UNDEFINED = 0,
  WD_METHOD_TYPE_ONE_RM = 1,
  WD_METHOD_TYPE_ALL_IN_ONE = 2,
  WD_METHOD_TYPE_STAKING_CLAIM = 3,
}
export enum LpActionType { 
  LAT_UNKNOWN = 0,
  LAT_ADD = 1,
  LAT_REMOVE = 2,
  LAT_AGGREGATE_REMOVE = 3,
}
export enum ErrCode { 
  ERROR_CODE_UNDEFINED = 0,
  ERROR_CODE_COMMON = 500,
  ERROR_NO_TOKEN_ON_DST_CHAIN = 1001,
  ERROR_NO_TOKEN_ON_SRC_CHAIN = 1002,
  ERROR_INIT_WITHDRAW_FAILED = 1003,
  ERROR_CODE_NO_ENOUGH_TOKEN_ON_DST_CHAIN = 1004,
}
