import * as jspb from 'google-protobuf'



export class ReportSgnAnalyticsRequest extends jspb.Message {
  getReport(): Uint8Array | string;
  getReport_asU8(): Uint8Array;
  getReport_asB64(): string;
  setReport(value: Uint8Array | string): ReportSgnAnalyticsRequest;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): ReportSgnAnalyticsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReportSgnAnalyticsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ReportSgnAnalyticsRequest): ReportSgnAnalyticsRequest.AsObject;
  static serializeBinaryToWriter(message: ReportSgnAnalyticsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReportSgnAnalyticsRequest;
  static deserializeBinaryFromReader(message: ReportSgnAnalyticsRequest, reader: jspb.BinaryReader): ReportSgnAnalyticsRequest;
}

export namespace ReportSgnAnalyticsRequest {
  export type AsObject = {
    report: Uint8Array | string,
    sig: Uint8Array | string,
  }
}

export class SgnAnalyticsReport extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): SgnAnalyticsReport;

  getBlockNumsMap(): jspb.Map<string, number>;
  clearBlockNumsMap(): SgnAnalyticsReport;

  getSgndVersion(): string;
  setSgndVersion(value: string): SgnAnalyticsReport;

  getLpFeeEarningHistoriesMap(): jspb.Map<number, LPFeeEarningHistory>;
  clearLpFeeEarningHistoriesMap(): SgnAnalyticsReport;

  getBaseFeeDistributionHistoriesMap(): jspb.Map<number, BaseFeeDistributionHistory>;
  clearBaseFeeDistributionHistoriesMap(): SgnAnalyticsReport;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SgnAnalyticsReport.AsObject;
  static toObject(includeInstance: boolean, msg: SgnAnalyticsReport): SgnAnalyticsReport.AsObject;
  static serializeBinaryToWriter(message: SgnAnalyticsReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SgnAnalyticsReport;
  static deserializeBinaryFromReader(message: SgnAnalyticsReport, reader: jspb.BinaryReader): SgnAnalyticsReport;
}

export namespace SgnAnalyticsReport {
  export type AsObject = {
    timestamp: number,
    blockNumsMap: Array<[string, number]>,
    sgndVersion: string,
    lpFeeEarningHistoriesMap: Array<[number, LPFeeEarningHistory.AsObject]>,
    baseFeeDistributionHistoriesMap: Array<[number, BaseFeeDistributionHistory.AsObject]>,
  }
}

export class BaseFeeDistributionHistory extends jspb.Message {
  getBridgeType(): BridgeType;
  setBridgeType(value: BridgeType): BaseFeeDistributionHistory;

  getBaseFeeReceiverAddr(): string;
  setBaseFeeReceiverAddr(value: string): BaseFeeDistributionHistory;

  getBaseFeeAmt(): string;
  setBaseFeeAmt(value: string): BaseFeeDistributionHistory;

  getTokenSymbol(): string;
  setTokenSymbol(value: string): BaseFeeDistributionHistory;

  getTokenDecimal(): number;
  setTokenDecimal(value: number): BaseFeeDistributionHistory;

  getSrcChainId(): number;
  setSrcChainId(value: number): BaseFeeDistributionHistory;

  getDstChainId(): number;
  setDstChainId(value: number): BaseFeeDistributionHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BaseFeeDistributionHistory.AsObject;
  static toObject(includeInstance: boolean, msg: BaseFeeDistributionHistory): BaseFeeDistributionHistory.AsObject;
  static serializeBinaryToWriter(message: BaseFeeDistributionHistory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BaseFeeDistributionHistory;
  static deserializeBinaryFromReader(message: BaseFeeDistributionHistory, reader: jspb.BinaryReader): BaseFeeDistributionHistory;
}

export namespace BaseFeeDistributionHistory {
  export type AsObject = {
    bridgeType: BridgeType,
    baseFeeReceiverAddr: string,
    baseFeeAmt: string,
    tokenSymbol: string,
    tokenDecimal: number,
    srcChainId: number,
    dstChainId: number,
  }
}

export class LPFeeEarningHistory extends jspb.Message {
  getDstTokenAddr(): string;
  setDstTokenAddr(value: string): LPFeeEarningHistory;

  getDstChainId(): number;
  setDstChainId(value: number): LPFeeEarningHistory;

  getLogsMap(): jspb.Map<string, LPFeeEarningLog>;
  clearLogsMap(): LPFeeEarningHistory;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPFeeEarningHistory.AsObject;
  static toObject(includeInstance: boolean, msg: LPFeeEarningHistory): LPFeeEarningHistory.AsObject;
  static serializeBinaryToWriter(message: LPFeeEarningHistory, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPFeeEarningHistory;
  static deserializeBinaryFromReader(message: LPFeeEarningHistory, reader: jspb.BinaryReader): LPFeeEarningHistory;
}

export namespace LPFeeEarningHistory {
  export type AsObject = {
    dstTokenAddr: string,
    dstChainId: number,
    logsMap: Array<[string, LPFeeEarningLog.AsObject]>,
  }
}

export class LPFeeEarningLog extends jspb.Message {
  getDstChainLiquidityUsed(): string;
  setDstChainLiquidityUsed(value: string): LPFeeEarningLog;

  getEarnedFee(): string;
  setEarnedFee(value: string): LPFeeEarningLog;

  getDstChainLiquidityRemained(): string;
  setDstChainLiquidityRemained(value: string): LPFeeEarningLog;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LPFeeEarningLog.AsObject;
  static toObject(includeInstance: boolean, msg: LPFeeEarningLog): LPFeeEarningLog.AsObject;
  static serializeBinaryToWriter(message: LPFeeEarningLog, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LPFeeEarningLog;
  static deserializeBinaryFromReader(message: LPFeeEarningLog, reader: jspb.BinaryReader): LPFeeEarningLog;
}

export namespace LPFeeEarningLog {
  export type AsObject = {
    dstChainLiquidityUsed: string,
    earnedFee: string,
    dstChainLiquidityRemained: string,
  }
}

export class ReportSgnAnalyticsResponse extends jspb.Message {
  getErr(): ErrMsg | undefined;
  setErr(value?: ErrMsg): ReportSgnAnalyticsResponse;
  hasErr(): boolean;
  clearErr(): ReportSgnAnalyticsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReportSgnAnalyticsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ReportSgnAnalyticsResponse): ReportSgnAnalyticsResponse.AsObject;
  static serializeBinaryToWriter(message: ReportSgnAnalyticsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReportSgnAnalyticsResponse;
  static deserializeBinaryFromReader(message: ReportSgnAnalyticsResponse, reader: jspb.BinaryReader): ReportSgnAnalyticsResponse;
}

export namespace ReportSgnAnalyticsResponse {
  export type AsObject = {
    err?: ErrMsg.AsObject,
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

export enum BridgeType { 
  BRIDGE_TYPE_UNDEFINED = 0,
  BRIDGE_TYPE_LIQUIDITY = 1,
  BRIDGE_TYPE_PEGGED = 2,
}
export enum ErrCode { 
  ERROR_CODE_UNDEFINED = 0,
  ERROR_CODE_COMMON = 500,
  ERROR_NO_TOKEN_ON_DST_CHAIN = 1001,
  ERROR_NO_TOKEN_ON_SRC_CHAIN = 1002,
  ERROR_INIT_WITHDRAW_FAILED = 1003,
  ERROR_CODE_NO_ENOUGH_TOKEN_ON_DST_CHAIN = 1004,
}
