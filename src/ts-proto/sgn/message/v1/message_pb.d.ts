import * as jspb from 'google-protobuf'

import * as cosmos_proto_cosmos_pb from '../../../cosmos_proto/cosmos_pb';
import * as cosmos_base_v1beta1_coin_pb from '../../../cosmos/base/v1beta1/coin_pb';
import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_protobuf_duration_pb from 'google-protobuf/google/protobuf/duration_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as sgn_common_v1_common_pb from '../../../sgn/common/v1/common_pb';


export class Params extends jspb.Message {
  getTriggerSignCooldown(): google_protobuf_duration_pb.Duration | undefined;
  setTriggerSignCooldown(value?: google_protobuf_duration_pb.Duration): Params;
  hasTriggerSignCooldown(): boolean;
  clearTriggerSignCooldown(): Params;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Params.AsObject;
  static toObject(includeInstance: boolean, msg: Params): Params.AsObject;
  static serializeBinaryToWriter(message: Params, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Params;
  static deserializeBinaryFromReader(message: Params, reader: jspb.BinaryReader): Params;
}

export namespace Params {
  export type AsObject = {
    triggerSignCooldown?: google_protobuf_duration_pb.Duration.AsObject,
  }
}

export class Message extends jspb.Message {
  getSrcChainId(): number;
  setSrcChainId(value: number): Message;

  getSender(): string;
  setSender(value: string): Message;

  getDstChainId(): number;
  setDstChainId(value: number): Message;

  getReceiver(): string;
  setReceiver(value: string): Message;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): Message;

  getFee(): string;
  setFee(value: string): Message;

  getTransferType(): TransferType;
  setTransferType(value: TransferType): Message;

  getExecutionStatus(): ExecutionStatus;
  setExecutionStatus(value: ExecutionStatus): Message;

  getSignaturesList(): Array<sgn_common_v1_common_pb.Signature>;
  setSignaturesList(value: Array<sgn_common_v1_common_pb.Signature>): Message;
  clearSignaturesList(): Message;
  addSignatures(value?: sgn_common_v1_common_pb.Signature, index?: number): sgn_common_v1_common_pb.Signature;

  getLastSigReqTime(): number;
  setLastSigReqTime(value: number): Message;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Message.AsObject;
  static toObject(includeInstance: boolean, msg: Message): Message.AsObject;
  static serializeBinaryToWriter(message: Message, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Message;
  static deserializeBinaryFromReader(message: Message, reader: jspb.BinaryReader): Message;
}

export namespace Message {
  export type AsObject = {
    srcChainId: number,
    sender: string,
    dstChainId: number,
    receiver: string,
    data: Uint8Array | string,
    fee: string,
    transferType: TransferType,
    executionStatus: ExecutionStatus,
    signaturesList: Array<sgn_common_v1_common_pb.Signature.AsObject>,
    lastSigReqTime: number,
  }
}

export class Transfer extends jspb.Message {
  getToken(): Uint8Array | string;
  getToken_asU8(): Uint8Array;
  getToken_asB64(): string;
  setToken(value: Uint8Array | string): Transfer;

  getAmount(): string;
  setAmount(value: string): Transfer;

  getSeqNum(): number;
  setSeqNum(value: number): Transfer;

  getRefId(): Uint8Array | string;
  getRefId_asU8(): Uint8Array;
  getRefId_asB64(): string;
  setRefId(value: Uint8Array | string): Transfer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transfer.AsObject;
  static toObject(includeInstance: boolean, msg: Transfer): Transfer.AsObject;
  static serializeBinaryToWriter(message: Transfer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transfer;
  static deserializeBinaryFromReader(message: Transfer, reader: jspb.BinaryReader): Transfer;
}

export namespace Transfer {
  export type AsObject = {
    token: Uint8Array | string,
    amount: string,
    seqNum: number,
    refId: Uint8Array | string,
  }
}

export class ExecutionContext extends jspb.Message {
  getMessageId(): Uint8Array | string;
  getMessageId_asU8(): Uint8Array;
  getMessageId_asB64(): string;
  setMessageId(value: Uint8Array | string): ExecutionContext;

  getMessage(): Message | undefined;
  setMessage(value?: Message): ExecutionContext;
  hasMessage(): boolean;
  clearMessage(): ExecutionContext;

  getTransfer(): Transfer | undefined;
  setTransfer(value?: Transfer): ExecutionContext;
  hasTransfer(): boolean;
  clearTransfer(): ExecutionContext;

  getPowersList(): Array<string>;
  setPowersList(value: Array<string>): ExecutionContext;
  clearPowersList(): ExecutionContext;
  addPowers(value: string, index?: number): ExecutionContext;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutionContext.AsObject;
  static toObject(includeInstance: boolean, msg: ExecutionContext): ExecutionContext.AsObject;
  static serializeBinaryToWriter(message: ExecutionContext, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecutionContext;
  static deserializeBinaryFromReader(message: ExecutionContext, reader: jspb.BinaryReader): ExecutionContext;
}

export namespace ExecutionContext {
  export type AsObject = {
    messageId: Uint8Array | string,
    message?: Message.AsObject,
    transfer?: Transfer.AsObject,
    powersList: Array<string>,
  }
}

export class FeeClaimDetails extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): FeeClaimDetails;

  getCumulativeFeeAmount(): cosmos_base_v1beta1_coin_pb.DecCoin | undefined;
  setCumulativeFeeAmount(value?: cosmos_base_v1beta1_coin_pb.DecCoin): FeeClaimDetails;
  hasCumulativeFeeAmount(): boolean;
  clearCumulativeFeeAmount(): FeeClaimDetails;

  getSignaturesList(): Array<sgn_common_v1_common_pb.Signature>;
  setSignaturesList(value: Array<sgn_common_v1_common_pb.Signature>): FeeClaimDetails;
  clearSignaturesList(): FeeClaimDetails;
  addSignatures(value?: sgn_common_v1_common_pb.Signature, index?: number): sgn_common_v1_common_pb.Signature;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeClaimDetails.AsObject;
  static toObject(includeInstance: boolean, msg: FeeClaimDetails): FeeClaimDetails.AsObject;
  static serializeBinaryToWriter(message: FeeClaimDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeClaimDetails;
  static deserializeBinaryFromReader(message: FeeClaimDetails, reader: jspb.BinaryReader): FeeClaimDetails;
}

export namespace FeeClaimDetails {
  export type AsObject = {
    chainId: number,
    cumulativeFeeAmount?: cosmos_base_v1beta1_coin_pb.DecCoin.AsObject,
    signaturesList: Array<sgn_common_v1_common_pb.Signature.AsObject>,
  }
}

export class FeeClaimInfo extends jspb.Message {
  getRecipient(): string;
  setRecipient(value: string): FeeClaimInfo;

  getLastClaimTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastClaimTime(value?: google_protobuf_timestamp_pb.Timestamp): FeeClaimInfo;
  hasLastClaimTime(): boolean;
  clearLastClaimTime(): FeeClaimInfo;

  getFeeClaimDetailsListList(): Array<FeeClaimDetails>;
  setFeeClaimDetailsListList(value: Array<FeeClaimDetails>): FeeClaimInfo;
  clearFeeClaimDetailsListList(): FeeClaimInfo;
  addFeeClaimDetailsList(value?: FeeClaimDetails, index?: number): FeeClaimDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeClaimInfo.AsObject;
  static toObject(includeInstance: boolean, msg: FeeClaimInfo): FeeClaimInfo.AsObject;
  static serializeBinaryToWriter(message: FeeClaimInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeClaimInfo;
  static deserializeBinaryFromReader(message: FeeClaimInfo, reader: jspb.BinaryReader): FeeClaimInfo;
}

export namespace FeeClaimInfo {
  export type AsObject = {
    recipient: string,
    lastClaimTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    feeClaimDetailsListList: Array<FeeClaimDetails.AsObject>,
  }
}

export class MessageBusInfo extends jspb.Message {
  getContractInfo(): sgn_common_v1_common_pb.ContractInfo | undefined;
  setContractInfo(value?: sgn_common_v1_common_pb.ContractInfo): MessageBusInfo;
  hasContractInfo(): boolean;
  clearContractInfo(): MessageBusInfo;

  getFeeTokenSymbol(): string;
  setFeeTokenSymbol(value: string): MessageBusInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MessageBusInfo.AsObject;
  static toObject(includeInstance: boolean, msg: MessageBusInfo): MessageBusInfo.AsObject;
  static serializeBinaryToWriter(message: MessageBusInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MessageBusInfo;
  static deserializeBinaryFromReader(message: MessageBusInfo, reader: jspb.BinaryReader): MessageBusInfo;
}

export namespace MessageBusInfo {
  export type AsObject = {
    contractInfo?: sgn_common_v1_common_pb.ContractInfo.AsObject,
    feeTokenSymbol: string,
  }
}

export class MsgProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): MsgProposal;

  getDescription(): string;
  setDescription(value: string): MsgProposal;

  getMessageBusesList(): Array<MessageBusInfo>;
  setMessageBusesList(value: Array<MessageBusInfo>): MsgProposal;
  clearMessageBusesList(): MsgProposal;
  addMessageBuses(value?: MessageBusInfo, index?: number): MessageBusInfo;

  getDeposit(): string;
  setDeposit(value: string): MsgProposal;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MsgProposal.AsObject;
  static toObject(includeInstance: boolean, msg: MsgProposal): MsgProposal.AsObject;
  static serializeBinaryToWriter(message: MsgProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MsgProposal;
  static deserializeBinaryFromReader(message: MsgProposal, reader: jspb.BinaryReader): MsgProposal;
}

export namespace MsgProposal {
  export type AsObject = {
    title: string,
    description: string,
    messageBusesList: Array<MessageBusInfo.AsObject>,
    deposit: string,
  }
}

export enum TransferType { 
  TRANSFER_TYPE_NULL = 0,
  TRANSFER_TYPE_LIQUIDITY_SEND = 1,
  TRANSFER_TYPE_LIQUIDITY_WITHDRAW = 2,
  TRANSFER_TYPE_PEG_MINT = 3,
  TRANSFER_TYPE_PEG_WITHDRAW = 4,
}
export enum ExecutionStatus { 
  EXECUTION_STATUS_PENDING = 0,
  EXECUTION_STATUS_SUCCESS = 1,
  EXECUTION_STATUS_FAILURE = 2,
  EXECUTION_STATUS_FALLBACK = 3,
}
export enum MsgType { 
  MSG_TYPE_MESSAGE_WITH_TRANSFER = 0,
  MSG_TYPE_MESSAGE = 1,
}
