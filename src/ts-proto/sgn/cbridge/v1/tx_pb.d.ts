import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_cbridge_v1_cbridge_pb from '../../../sgn/cbridge/v1/cbridge_pb';


export class MsgSendMySig extends jspb.Message {
  getDatatype(): SignDataType;
  setDatatype(value: SignDataType): MsgSendMySig;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): MsgSendMySig;

  getMySigsList(): Array<MySig>;
  setMySigsList(value: Array<MySig>): MsgSendMySig;
  clearMySigsList(): MsgSendMySig;
  addMySigs(value?: MySig, index?: number): MySig;

  getCreator(): string;
  setCreator(value: string): MsgSendMySig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSendMySig.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSendMySig): MsgSendMySig.AsObject;
  static serializeBinaryToWriter(message: MsgSendMySig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSendMySig;
  static deserializeBinaryFromReader(message: MsgSendMySig, reader: jspb.BinaryReader): MsgSendMySig;
}

export namespace MsgSendMySig {
  export type AsObject = {
    datatype: SignDataType,
    data: Uint8Array | string,
    mySigsList: Array<MySig.AsObject>,
    creator: string,
  }
}

export class MySig extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): MySig;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): MySig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MySig.AsObject;
  static toObject(includeInstance: boolean, msg: MySig): MySig.AsObject;
  static serializeBinaryToWriter(message: MySig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MySig;
  static deserializeBinaryFromReader(message: MySig, reader: jspb.BinaryReader): MySig;
}

export namespace MySig {
  export type AsObject = {
    chainId: number,
    sig: Uint8Array | string,
  }
}

export class MsgSendMySigResp extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSendMySigResp.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSendMySigResp): MsgSendMySigResp.AsObject;
  static serializeBinaryToWriter(message: MsgSendMySigResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSendMySigResp;
  static deserializeBinaryFromReader(message: MsgSendMySigResp, reader: jspb.BinaryReader): MsgSendMySigResp;
}

export namespace MsgSendMySigResp {
  export type AsObject = {
  }
}

export class WithdrawLq extends jspb.Message {
  getFromChainId(): number;
  setFromChainId(value: number): WithdrawLq;

  getTokenAddr(): string;
  setTokenAddr(value: string): WithdrawLq;

  getRatio(): number;
  setRatio(value: number): WithdrawLq;

  getMaxSlippage(): number;
  setMaxSlippage(value: number): WithdrawLq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawLq.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawLq): WithdrawLq.AsObject;
  static serializeBinaryToWriter(message: WithdrawLq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawLq;
  static deserializeBinaryFromReader(message: WithdrawLq, reader: jspb.BinaryReader): WithdrawLq;
}

export namespace WithdrawLq {
  export type AsObject = {
    fromChainId: number,
    tokenAddr: string,
    ratio: number,
    maxSlippage: number,
  }
}

export class WithdrawReq extends jspb.Message {
  getXferId(): string;
  setXferId(value: string): WithdrawReq;

  getWithdrawsList(): Array<WithdrawLq>;
  setWithdrawsList(value: Array<WithdrawLq>): WithdrawReq;
  clearWithdrawsList(): WithdrawReq;
  addWithdraws(value?: WithdrawLq, index?: number): WithdrawLq;

  getExitChainId(): number;
  setExitChainId(value: number): WithdrawReq;

  getReqId(): number;
  setReqId(value: number): WithdrawReq;

  getWithdrawType(): WithdrawType;
  setWithdrawType(value: WithdrawType): WithdrawReq;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawReq.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawReq): WithdrawReq.AsObject;
  static serializeBinaryToWriter(message: WithdrawReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawReq;
  static deserializeBinaryFromReader(message: WithdrawReq, reader: jspb.BinaryReader): WithdrawReq;
}

export namespace WithdrawReq {
  export type AsObject = {
    xferId: string,
    withdrawsList: Array<WithdrawLq.AsObject>,
    exitChainId: number,
    reqId: number,
    withdrawType: WithdrawType,
  }
}

export class MsgInitWithdraw extends jspb.Message {
  getWithdrawReq(): Uint8Array | string;
  getWithdrawReq_asU8(): Uint8Array;
  getWithdrawReq_asB64(): string;
  setWithdrawReq(value: Uint8Array | string): MsgInitWithdraw;

  getUserSig(): Uint8Array | string;
  getUserSig_asU8(): Uint8Array;
  getUserSig_asB64(): string;
  setUserSig(value: Uint8Array | string): MsgInitWithdraw;

  getCreator(): string;
  setCreator(value: string): MsgInitWithdraw;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgInitWithdraw.AsObject;
  static toObject(includeInstance: boolean, msg: MsgInitWithdraw): MsgInitWithdraw.AsObject;
  static serializeBinaryToWriter(message: MsgInitWithdraw, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgInitWithdraw;
  static deserializeBinaryFromReader(message: MsgInitWithdraw, reader: jspb.BinaryReader): MsgInitWithdraw;
}

export namespace MsgInitWithdraw {
  export type AsObject = {
    withdrawReq: Uint8Array | string,
    userSig: Uint8Array | string,
    creator: string,
  }
}

export class MsgInitWithdrawResp extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgInitWithdrawResp.AsObject;
  static toObject(includeInstance: boolean, msg: MsgInitWithdrawResp): MsgInitWithdrawResp.AsObject;
  static serializeBinaryToWriter(message: MsgInitWithdrawResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgInitWithdrawResp;
  static deserializeBinaryFromReader(message: MsgInitWithdrawResp, reader: jspb.BinaryReader): MsgInitWithdrawResp;
}

export namespace MsgInitWithdrawResp {
  export type AsObject = {
  }
}

export class MsgSignAgain extends jspb.Message {
  getDataType(): SignDataType;
  setDataType(value: SignDataType): MsgSignAgain;

  getUserAddr(): Uint8Array | string;
  getUserAddr_asU8(): Uint8Array;
  getUserAddr_asB64(): string;
  setUserAddr(value: Uint8Array | string): MsgSignAgain;

  getReqId(): number;
  setReqId(value: number): MsgSignAgain;

  getXferId(): Uint8Array | string;
  getXferId_asU8(): Uint8Array;
  getXferId_asB64(): string;
  setXferId(value: Uint8Array | string): MsgSignAgain;

  getCreator(): string;
  setCreator(value: string): MsgSignAgain;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignAgain.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignAgain): MsgSignAgain.AsObject;
  static serializeBinaryToWriter(message: MsgSignAgain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignAgain;
  static deserializeBinaryFromReader(message: MsgSignAgain, reader: jspb.BinaryReader): MsgSignAgain;
}

export namespace MsgSignAgain {
  export type AsObject = {
    dataType: SignDataType,
    userAddr: Uint8Array | string,
    reqId: number,
    xferId: Uint8Array | string,
    creator: string,
  }
}

export class MsgSignAgainResp extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSignAgainResp.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSignAgainResp): MsgSignAgainResp.AsObject;
  static serializeBinaryToWriter(message: MsgSignAgainResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSignAgainResp;
  static deserializeBinaryFromReader(message: MsgSignAgainResp, reader: jspb.BinaryReader): MsgSignAgainResp;
}

export namespace MsgSignAgainResp {
  export type AsObject = {
  }
}

export class MsgUpdateLatestSigners extends jspb.Message {
  getCreator(): string;
  setCreator(value: string): MsgUpdateLatestSigners;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgUpdateLatestSigners.AsObject;
  static toObject(includeInstance: boolean, msg: MsgUpdateLatestSigners): MsgUpdateLatestSigners.AsObject;
  static serializeBinaryToWriter(message: MsgUpdateLatestSigners, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgUpdateLatestSigners;
  static deserializeBinaryFromReader(message: MsgUpdateLatestSigners, reader: jspb.BinaryReader): MsgUpdateLatestSigners;
}

export namespace MsgUpdateLatestSigners {
  export type AsObject = {
    creator: string,
  }
}

export class MsgUpdateLatestSignersResp extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgUpdateLatestSignersResp.AsObject;
  static toObject(includeInstance: boolean, msg: MsgUpdateLatestSignersResp): MsgUpdateLatestSignersResp.AsObject;
  static serializeBinaryToWriter(message: MsgUpdateLatestSignersResp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgUpdateLatestSignersResp;
  static deserializeBinaryFromReader(message: MsgUpdateLatestSignersResp, reader: jspb.BinaryReader): MsgUpdateLatestSignersResp;
}

export namespace MsgUpdateLatestSignersResp {
  export type AsObject = {
  }
}

export class MsgSyncFarming extends jspb.Message {
  getLpAddress(): string;
  setLpAddress(value: string): MsgSyncFarming;

  getChainId(): number;
  setChainId(value: number): MsgSyncFarming;

  getTokenAddress(): string;
  setTokenAddress(value: string): MsgSyncFarming;

  getCreator(): string;
  setCreator(value: string): MsgSyncFarming;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSyncFarming.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSyncFarming): MsgSyncFarming.AsObject;
  static serializeBinaryToWriter(message: MsgSyncFarming, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSyncFarming;
  static deserializeBinaryFromReader(message: MsgSyncFarming, reader: jspb.BinaryReader): MsgSyncFarming;
}

export namespace MsgSyncFarming {
  export type AsObject = {
    lpAddress: string,
    chainId: number,
    tokenAddress: string,
    creator: string,
  }
}

export class MsgSyncFarmingResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgSyncFarmingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MsgSyncFarmingResponse): MsgSyncFarmingResponse.AsObject;
  static serializeBinaryToWriter(message: MsgSyncFarmingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgSyncFarmingResponse;
  static deserializeBinaryFromReader(message: MsgSyncFarmingResponse, reader: jspb.BinaryReader): MsgSyncFarmingResponse;
}

export namespace MsgSyncFarmingResponse {
  export type AsObject = {
  }
}

export class ErrMsg extends jspb.Message {
  getCode(): ErrCode;
  setCode(value: ErrCode): ErrMsg;

  getDesc(): string;
  setDesc(value: string): ErrMsg;

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
    desc: string,
  }
}

export enum SignDataType { 
  INVALID = 0,
  RELAY = 1,
  WITHDRAW = 2,
  SIGNERS = 3,
}
export enum WithdrawType { 
  WITHDRAW_TYPE_REMOVE_LIQUIDITY = 0,
  WITHDRAW_TYPE_REFUND_TRANSFER = 1,
  WITHDRAW_TYPE_CLAIM_FEE_SHARE = 2,
  WITHDRAW_TYPE_VALIDATOR_CLAIM_FEE_SHARE = 3,
}
export enum ErrCode { 
  UNDEFINED = 0,
  INVALID_REQ = 1,
  INVALID_SIG = 2,
  INVALID_STATUS = 3,
  NOT_FOUND = 4,
  DUP_REQID = 5,
  REQ_TOO_SOON = 6,
  BAL_NOT_ENOUGH = 7,
  XFER_NOT_REFUNDABLE = 10,
  XFER_REFUND_STARTED = 11,
  WD_INTERNAL_XFER_FAILURE = 12,
  WD_EXCEED_MAX_OUT_AMOUNT = 13,
}
