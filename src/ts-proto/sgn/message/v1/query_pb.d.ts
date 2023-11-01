import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_api_annotations_pb from '../../../google/api/annotations_pb';
import * as sgn_common_v1_common_pb from '../../../sgn/common/v1/common_pb';
import * as sgn_message_v1_message_pb from '../../../sgn/message/v1/message_pb';


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
  getParams(): sgn_message_v1_message_pb.Params | undefined;
  setParams(value?: sgn_message_v1_message_pb.Params): QueryParamsResponse;
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
    params?: sgn_message_v1_message_pb.Params.AsObject,
  }
}

export class QueryExecutionContextsRequest extends jspb.Message {
  getContractInfosList(): Array<sgn_common_v1_common_pb.ContractInfo>;
  setContractInfosList(value: Array<sgn_common_v1_common_pb.ContractInfo>): QueryExecutionContextsRequest;
  clearContractInfosList(): QueryExecutionContextsRequest;
  addContractInfos(value?: sgn_common_v1_common_pb.ContractInfo, index?: number): sgn_common_v1_common_pb.ContractInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryExecutionContextsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryExecutionContextsRequest): QueryExecutionContextsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryExecutionContextsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryExecutionContextsRequest;
  static deserializeBinaryFromReader(message: QueryExecutionContextsRequest, reader: jspb.BinaryReader): QueryExecutionContextsRequest;
}

export namespace QueryExecutionContextsRequest {
  export type AsObject = {
    contractInfosList: Array<sgn_common_v1_common_pb.ContractInfo.AsObject>,
  }
}

export class QueryExecutionContextsResponse extends jspb.Message {
  getExecutionContextsList(): Array<sgn_message_v1_message_pb.ExecutionContext>;
  setExecutionContextsList(value: Array<sgn_message_v1_message_pb.ExecutionContext>): QueryExecutionContextsResponse;
  clearExecutionContextsList(): QueryExecutionContextsResponse;
  addExecutionContexts(value?: sgn_message_v1_message_pb.ExecutionContext, index?: number): sgn_message_v1_message_pb.ExecutionContext;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryExecutionContextsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryExecutionContextsResponse): QueryExecutionContextsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryExecutionContextsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryExecutionContextsResponse;
  static deserializeBinaryFromReader(message: QueryExecutionContextsResponse, reader: jspb.BinaryReader): QueryExecutionContextsResponse;
}

export namespace QueryExecutionContextsResponse {
  export type AsObject = {
    executionContextsList: Array<sgn_message_v1_message_pb.ExecutionContext.AsObject>,
  }
}

export class IsMessageActiveRequest extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): IsMessageActiveRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsMessageActiveRequest.AsObject;
  static toObject(includeInstance: boolean, msg: IsMessageActiveRequest): IsMessageActiveRequest.AsObject;
  static serializeBinaryToWriter(message: IsMessageActiveRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsMessageActiveRequest;
  static deserializeBinaryFromReader(message: IsMessageActiveRequest, reader: jspb.BinaryReader): IsMessageActiveRequest;
}

export namespace IsMessageActiveRequest {
  export type AsObject = {
    messageId: string,
  }
}

export class IsMessageActiveResponse extends jspb.Message {
  getExists(): boolean;
  setExists(value: boolean): IsMessageActiveResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsMessageActiveResponse.AsObject;
  static toObject(includeInstance: boolean, msg: IsMessageActiveResponse): IsMessageActiveResponse.AsObject;
  static serializeBinaryToWriter(message: IsMessageActiveResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsMessageActiveResponse;
  static deserializeBinaryFromReader(message: IsMessageActiveResponse, reader: jspb.BinaryReader): IsMessageActiveResponse;
}

export namespace IsMessageActiveResponse {
  export type AsObject = {
    exists: boolean,
  }
}

export class QueryMessageExistsRequest extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): QueryMessageExistsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryMessageExistsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryMessageExistsRequest): QueryMessageExistsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryMessageExistsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryMessageExistsRequest;
  static deserializeBinaryFromReader(message: QueryMessageExistsRequest, reader: jspb.BinaryReader): QueryMessageExistsRequest;
}

export namespace QueryMessageExistsRequest {
  export type AsObject = {
    messageId: string,
  }
}

export class QueryMessageExistsResponse extends jspb.Message {
  getExists(): boolean;
  setExists(value: boolean): QueryMessageExistsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryMessageExistsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryMessageExistsResponse): QueryMessageExistsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryMessageExistsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryMessageExistsResponse;
  static deserializeBinaryFromReader(message: QueryMessageExistsResponse, reader: jspb.BinaryReader): QueryMessageExistsResponse;
}

export namespace QueryMessageExistsResponse {
  export type AsObject = {
    exists: boolean,
  }
}

export class QueryRefundExistsRequest extends jspb.Message {
  getSrcTransferId(): string;
  setSrcTransferId(value: string): QueryRefundExistsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRefundExistsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRefundExistsRequest): QueryRefundExistsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryRefundExistsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRefundExistsRequest;
  static deserializeBinaryFromReader(message: QueryRefundExistsRequest, reader: jspb.BinaryReader): QueryRefundExistsRequest;
}

export namespace QueryRefundExistsRequest {
  export type AsObject = {
    srcTransferId: string,
  }
}

export class QueryRefundExistsResponse extends jspb.Message {
  getExists(): boolean;
  setExists(value: boolean): QueryRefundExistsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryRefundExistsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryRefundExistsResponse): QueryRefundExistsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryRefundExistsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryRefundExistsResponse;
  static deserializeBinaryFromReader(message: QueryRefundExistsResponse, reader: jspb.BinaryReader): QueryRefundExistsResponse;
}

export namespace QueryRefundExistsResponse {
  export type AsObject = {
    exists: boolean,
  }
}

export class QueryMessageRequest extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): QueryMessageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryMessageRequest): QueryMessageRequest.AsObject;
  static serializeBinaryToWriter(message: QueryMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryMessageRequest;
  static deserializeBinaryFromReader(message: QueryMessageRequest, reader: jspb.BinaryReader): QueryMessageRequest;
}

export namespace QueryMessageRequest {
  export type AsObject = {
    messageId: string,
  }
}

export class QueryMessageResponse extends jspb.Message {
  getMessage(): sgn_message_v1_message_pb.Message | undefined;
  setMessage(value?: sgn_message_v1_message_pb.Message): QueryMessageResponse;
  hasMessage(): boolean;
  clearMessage(): QueryMessageResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryMessageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryMessageResponse): QueryMessageResponse.AsObject;
  static serializeBinaryToWriter(message: QueryMessageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryMessageResponse;
  static deserializeBinaryFromReader(message: QueryMessageResponse, reader: jspb.BinaryReader): QueryMessageResponse;
}

export namespace QueryMessageResponse {
  export type AsObject = {
    message?: sgn_message_v1_message_pb.Message.AsObject,
  }
}

export class QueryTransferRequest extends jspb.Message {
  getMessageId(): string;
  setMessageId(value: string): QueryTransferRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTransferRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTransferRequest): QueryTransferRequest.AsObject;
  static serializeBinaryToWriter(message: QueryTransferRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTransferRequest;
  static deserializeBinaryFromReader(message: QueryTransferRequest, reader: jspb.BinaryReader): QueryTransferRequest;
}

export namespace QueryTransferRequest {
  export type AsObject = {
    messageId: string,
  }
}

export class QueryTransferResponse extends jspb.Message {
  getTransfer(): sgn_message_v1_message_pb.Transfer | undefined;
  setTransfer(value?: sgn_message_v1_message_pb.Transfer): QueryTransferResponse;
  hasTransfer(): boolean;
  clearTransfer(): QueryTransferResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryTransferResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryTransferResponse): QueryTransferResponse.AsObject;
  static serializeBinaryToWriter(message: QueryTransferResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryTransferResponse;
  static deserializeBinaryFromReader(message: QueryTransferResponse, reader: jspb.BinaryReader): QueryTransferResponse;
}

export namespace QueryTransferResponse {
  export type AsObject = {
    transfer?: sgn_message_v1_message_pb.Transfer.AsObject,
  }
}

export class QueryMessageBusRequest extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): QueryMessageBusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryMessageBusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryMessageBusRequest): QueryMessageBusRequest.AsObject;
  static serializeBinaryToWriter(message: QueryMessageBusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryMessageBusRequest;
  static deserializeBinaryFromReader(message: QueryMessageBusRequest, reader: jspb.BinaryReader): QueryMessageBusRequest;
}

export namespace QueryMessageBusRequest {
  export type AsObject = {
    chainId: number,
  }
}

export class QueryMessageBusResponse extends jspb.Message {
  getMessageBus(): sgn_message_v1_message_pb.MessageBusInfo | undefined;
  setMessageBus(value?: sgn_message_v1_message_pb.MessageBusInfo): QueryMessageBusResponse;
  hasMessageBus(): boolean;
  clearMessageBus(): QueryMessageBusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryMessageBusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryMessageBusResponse): QueryMessageBusResponse.AsObject;
  static serializeBinaryToWriter(message: QueryMessageBusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryMessageBusResponse;
  static deserializeBinaryFromReader(message: QueryMessageBusResponse, reader: jspb.BinaryReader): QueryMessageBusResponse;
}

export namespace QueryMessageBusResponse {
  export type AsObject = {
    messageBus?: sgn_message_v1_message_pb.MessageBusInfo.AsObject,
  }
}

export class QueryFeeClaimInfoRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): QueryFeeClaimInfoRequest;

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
  }
}

export class QueryFeeClaimInfoResponse extends jspb.Message {
  getFeeClaimInfo(): sgn_message_v1_message_pb.FeeClaimInfo | undefined;
  setFeeClaimInfo(value?: sgn_message_v1_message_pb.FeeClaimInfo): QueryFeeClaimInfoResponse;
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
    feeClaimInfo?: sgn_message_v1_message_pb.FeeClaimInfo.AsObject,
  }
}

