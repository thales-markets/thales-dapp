import * as jspb from 'google-protobuf'

import * as cosmos_base_query_v1beta1_pagination_pb from '../../../cosmos/base/query/v1beta1/pagination_pb';
import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_api_annotations_pb from '../../../google/api/annotations_pb';
import * as sgn_staking_v1_staking_pb from '../../../sgn/staking/v1/staking_pb';


export class QueryValidatorsRequest extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): QueryValidatorsRequest;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageRequest | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageRequest): QueryValidatorsRequest;
  hasPagination(): boolean;
  clearPagination(): QueryValidatorsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryValidatorsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryValidatorsRequest): QueryValidatorsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryValidatorsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryValidatorsRequest;
  static deserializeBinaryFromReader(message: QueryValidatorsRequest, reader: jspb.BinaryReader): QueryValidatorsRequest;
}

export namespace QueryValidatorsRequest {
  export type AsObject = {
    status: string,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageRequest.AsObject,
  }
}

export class QueryValidatorsResponse extends jspb.Message {
  getValidatorsList(): Array<sgn_staking_v1_staking_pb.Validator>;
  setValidatorsList(value: Array<sgn_staking_v1_staking_pb.Validator>): QueryValidatorsResponse;
  clearValidatorsList(): QueryValidatorsResponse;
  addValidators(value?: sgn_staking_v1_staking_pb.Validator, index?: number): sgn_staking_v1_staking_pb.Validator;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageResponse | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageResponse): QueryValidatorsResponse;
  hasPagination(): boolean;
  clearPagination(): QueryValidatorsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryValidatorsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryValidatorsResponse): QueryValidatorsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryValidatorsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryValidatorsResponse;
  static deserializeBinaryFromReader(message: QueryValidatorsResponse, reader: jspb.BinaryReader): QueryValidatorsResponse;
}

export namespace QueryValidatorsResponse {
  export type AsObject = {
    validatorsList: Array<sgn_staking_v1_staking_pb.Validator.AsObject>,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageResponse.AsObject,
  }
}

export class QueryValidatorRequest extends jspb.Message {
  getValidatorAddr(): string;
  setValidatorAddr(value: string): QueryValidatorRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryValidatorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryValidatorRequest): QueryValidatorRequest.AsObject;
  static serializeBinaryToWriter(message: QueryValidatorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryValidatorRequest;
  static deserializeBinaryFromReader(message: QueryValidatorRequest, reader: jspb.BinaryReader): QueryValidatorRequest;
}

export namespace QueryValidatorRequest {
  export type AsObject = {
    validatorAddr: string,
  }
}

export class QueryValidatorResponse extends jspb.Message {
  getValidator(): sgn_staking_v1_staking_pb.Validator | undefined;
  setValidator(value?: sgn_staking_v1_staking_pb.Validator): QueryValidatorResponse;
  hasValidator(): boolean;
  clearValidator(): QueryValidatorResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryValidatorResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryValidatorResponse): QueryValidatorResponse.AsObject;
  static serializeBinaryToWriter(message: QueryValidatorResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryValidatorResponse;
  static deserializeBinaryFromReader(message: QueryValidatorResponse, reader: jspb.BinaryReader): QueryValidatorResponse;
}

export namespace QueryValidatorResponse {
  export type AsObject = {
    validator?: sgn_staking_v1_staking_pb.Validator.AsObject,
  }
}

export class QueryValidatorDelegationsRequest extends jspb.Message {
  getValidatorAddr(): string;
  setValidatorAddr(value: string): QueryValidatorDelegationsRequest;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageRequest | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageRequest): QueryValidatorDelegationsRequest;
  hasPagination(): boolean;
  clearPagination(): QueryValidatorDelegationsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryValidatorDelegationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryValidatorDelegationsRequest): QueryValidatorDelegationsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryValidatorDelegationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryValidatorDelegationsRequest;
  static deserializeBinaryFromReader(message: QueryValidatorDelegationsRequest, reader: jspb.BinaryReader): QueryValidatorDelegationsRequest;
}

export namespace QueryValidatorDelegationsRequest {
  export type AsObject = {
    validatorAddr: string,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageRequest.AsObject,
  }
}

export class QueryValidatorDelegationsResponse extends jspb.Message {
  getDelegationResponsesList(): Array<sgn_staking_v1_staking_pb.DelegationResponse>;
  setDelegationResponsesList(value: Array<sgn_staking_v1_staking_pb.DelegationResponse>): QueryValidatorDelegationsResponse;
  clearDelegationResponsesList(): QueryValidatorDelegationsResponse;
  addDelegationResponses(value?: sgn_staking_v1_staking_pb.DelegationResponse, index?: number): sgn_staking_v1_staking_pb.DelegationResponse;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageResponse | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageResponse): QueryValidatorDelegationsResponse;
  hasPagination(): boolean;
  clearPagination(): QueryValidatorDelegationsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryValidatorDelegationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryValidatorDelegationsResponse): QueryValidatorDelegationsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryValidatorDelegationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryValidatorDelegationsResponse;
  static deserializeBinaryFromReader(message: QueryValidatorDelegationsResponse, reader: jspb.BinaryReader): QueryValidatorDelegationsResponse;
}

export namespace QueryValidatorDelegationsResponse {
  export type AsObject = {
    delegationResponsesList: Array<sgn_staking_v1_staking_pb.DelegationResponse.AsObject>,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageResponse.AsObject,
  }
}

export class QueryDelegationRequest extends jspb.Message {
  getDelegatorAddr(): string;
  setDelegatorAddr(value: string): QueryDelegationRequest;

  getValidatorAddr(): string;
  setValidatorAddr(value: string): QueryDelegationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegationRequest): QueryDelegationRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDelegationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegationRequest;
  static deserializeBinaryFromReader(message: QueryDelegationRequest, reader: jspb.BinaryReader): QueryDelegationRequest;
}

export namespace QueryDelegationRequest {
  export type AsObject = {
    delegatorAddr: string,
    validatorAddr: string,
  }
}

export class QueryDelegationResponse extends jspb.Message {
  getDelegationResponse(): sgn_staking_v1_staking_pb.DelegationResponse | undefined;
  setDelegationResponse(value?: sgn_staking_v1_staking_pb.DelegationResponse): QueryDelegationResponse;
  hasDelegationResponse(): boolean;
  clearDelegationResponse(): QueryDelegationResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegationResponse): QueryDelegationResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDelegationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegationResponse;
  static deserializeBinaryFromReader(message: QueryDelegationResponse, reader: jspb.BinaryReader): QueryDelegationResponse;
}

export namespace QueryDelegationResponse {
  export type AsObject = {
    delegationResponse?: sgn_staking_v1_staking_pb.DelegationResponse.AsObject,
  }
}

export class QueryDelegatorDelegationsRequest extends jspb.Message {
  getDelegatorAddr(): string;
  setDelegatorAddr(value: string): QueryDelegatorDelegationsRequest;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageRequest | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageRequest): QueryDelegatorDelegationsRequest;
  hasPagination(): boolean;
  clearPagination(): QueryDelegatorDelegationsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegatorDelegationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegatorDelegationsRequest): QueryDelegatorDelegationsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDelegatorDelegationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegatorDelegationsRequest;
  static deserializeBinaryFromReader(message: QueryDelegatorDelegationsRequest, reader: jspb.BinaryReader): QueryDelegatorDelegationsRequest;
}

export namespace QueryDelegatorDelegationsRequest {
  export type AsObject = {
    delegatorAddr: string,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageRequest.AsObject,
  }
}

export class QueryDelegatorDelegationsResponse extends jspb.Message {
  getDelegationResponsesList(): Array<sgn_staking_v1_staking_pb.DelegationResponse>;
  setDelegationResponsesList(value: Array<sgn_staking_v1_staking_pb.DelegationResponse>): QueryDelegatorDelegationsResponse;
  clearDelegationResponsesList(): QueryDelegatorDelegationsResponse;
  addDelegationResponses(value?: sgn_staking_v1_staking_pb.DelegationResponse, index?: number): sgn_staking_v1_staking_pb.DelegationResponse;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageResponse | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageResponse): QueryDelegatorDelegationsResponse;
  hasPagination(): boolean;
  clearPagination(): QueryDelegatorDelegationsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegatorDelegationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegatorDelegationsResponse): QueryDelegatorDelegationsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDelegatorDelegationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegatorDelegationsResponse;
  static deserializeBinaryFromReader(message: QueryDelegatorDelegationsResponse, reader: jspb.BinaryReader): QueryDelegatorDelegationsResponse;
}

export namespace QueryDelegatorDelegationsResponse {
  export type AsObject = {
    delegationResponsesList: Array<sgn_staking_v1_staking_pb.DelegationResponse.AsObject>,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageResponse.AsObject,
  }
}

export class QueryDelegatorValidatorsRequest extends jspb.Message {
  getDelegatorAddr(): string;
  setDelegatorAddr(value: string): QueryDelegatorValidatorsRequest;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageRequest | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageRequest): QueryDelegatorValidatorsRequest;
  hasPagination(): boolean;
  clearPagination(): QueryDelegatorValidatorsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegatorValidatorsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegatorValidatorsRequest): QueryDelegatorValidatorsRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDelegatorValidatorsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegatorValidatorsRequest;
  static deserializeBinaryFromReader(message: QueryDelegatorValidatorsRequest, reader: jspb.BinaryReader): QueryDelegatorValidatorsRequest;
}

export namespace QueryDelegatorValidatorsRequest {
  export type AsObject = {
    delegatorAddr: string,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageRequest.AsObject,
  }
}

export class QueryDelegatorValidatorsResponse extends jspb.Message {
  getValidatorsList(): Array<sgn_staking_v1_staking_pb.Validator>;
  setValidatorsList(value: Array<sgn_staking_v1_staking_pb.Validator>): QueryDelegatorValidatorsResponse;
  clearValidatorsList(): QueryDelegatorValidatorsResponse;
  addValidators(value?: sgn_staking_v1_staking_pb.Validator, index?: number): sgn_staking_v1_staking_pb.Validator;

  getPagination(): cosmos_base_query_v1beta1_pagination_pb.PageResponse | undefined;
  setPagination(value?: cosmos_base_query_v1beta1_pagination_pb.PageResponse): QueryDelegatorValidatorsResponse;
  hasPagination(): boolean;
  clearPagination(): QueryDelegatorValidatorsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegatorValidatorsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegatorValidatorsResponse): QueryDelegatorValidatorsResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDelegatorValidatorsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegatorValidatorsResponse;
  static deserializeBinaryFromReader(message: QueryDelegatorValidatorsResponse, reader: jspb.BinaryReader): QueryDelegatorValidatorsResponse;
}

export namespace QueryDelegatorValidatorsResponse {
  export type AsObject = {
    validatorsList: Array<sgn_staking_v1_staking_pb.Validator.AsObject>,
    pagination?: cosmos_base_query_v1beta1_pagination_pb.PageResponse.AsObject,
  }
}

export class QueryDelegatorValidatorRequest extends jspb.Message {
  getDelegatorAddr(): string;
  setDelegatorAddr(value: string): QueryDelegatorValidatorRequest;

  getValidatorAddr(): string;
  setValidatorAddr(value: string): QueryDelegatorValidatorRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegatorValidatorRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegatorValidatorRequest): QueryDelegatorValidatorRequest.AsObject;
  static serializeBinaryToWriter(message: QueryDelegatorValidatorRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegatorValidatorRequest;
  static deserializeBinaryFromReader(message: QueryDelegatorValidatorRequest, reader: jspb.BinaryReader): QueryDelegatorValidatorRequest;
}

export namespace QueryDelegatorValidatorRequest {
  export type AsObject = {
    delegatorAddr: string,
    validatorAddr: string,
  }
}

export class QueryDelegatorValidatorResponse extends jspb.Message {
  getValidator(): sgn_staking_v1_staking_pb.Validator | undefined;
  setValidator(value?: sgn_staking_v1_staking_pb.Validator): QueryDelegatorValidatorResponse;
  hasValidator(): boolean;
  clearValidator(): QueryDelegatorValidatorResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueryDelegatorValidatorResponse.AsObject;
  static toObject(includeInstance: boolean, msg: QueryDelegatorValidatorResponse): QueryDelegatorValidatorResponse.AsObject;
  static serializeBinaryToWriter(message: QueryDelegatorValidatorResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueryDelegatorValidatorResponse;
  static deserializeBinaryFromReader(message: QueryDelegatorValidatorResponse, reader: jspb.BinaryReader): QueryDelegatorValidatorResponse;
}

export namespace QueryDelegatorValidatorResponse {
  export type AsObject = {
    validator?: sgn_staking_v1_staking_pb.Validator.AsObject,
  }
}

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
  getParams(): sgn_staking_v1_staking_pb.Params | undefined;
  setParams(value?: sgn_staking_v1_staking_pb.Params): QueryParamsResponse;
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
    params?: sgn_staking_v1_staking_pb.Params.AsObject,
  }
}

