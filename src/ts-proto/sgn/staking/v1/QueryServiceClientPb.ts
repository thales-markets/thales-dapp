/**
 * @fileoverview gRPC-Web generated client stub for sgn.staking.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_staking_v1_query_pb from '../../../sgn/staking/v1/query_pb';


export class QueryClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoValidators = new grpcWeb.MethodDescriptor(
    '/sgn.staking.v1.Query/Validators',
    grpcWeb.MethodType.UNARY,
    sgn_staking_v1_query_pb.QueryValidatorsRequest,
    sgn_staking_v1_query_pb.QueryValidatorsResponse,
    (request: sgn_staking_v1_query_pb.QueryValidatorsRequest) => {
      return request.serializeBinary();
    },
    sgn_staking_v1_query_pb.QueryValidatorsResponse.deserializeBinary
  );

  validators(
    request: sgn_staking_v1_query_pb.QueryValidatorsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_staking_v1_query_pb.QueryValidatorsResponse>;

  validators(
    request: sgn_staking_v1_query_pb.QueryValidatorsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryValidatorsResponse) => void): grpcWeb.ClientReadableStream<sgn_staking_v1_query_pb.QueryValidatorsResponse>;

  validators(
    request: sgn_staking_v1_query_pb.QueryValidatorsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryValidatorsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.staking.v1.Query/Validators',
        request,
        metadata || {},
        this.methodInfoValidators,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.staking.v1.Query/Validators',
    request,
    metadata || {},
    this.methodInfoValidators);
  }

  methodInfoValidator = new grpcWeb.MethodDescriptor(
    '/sgn.staking.v1.Query/Validator',
    grpcWeb.MethodType.UNARY,
    sgn_staking_v1_query_pb.QueryValidatorRequest,
    sgn_staking_v1_query_pb.QueryValidatorResponse,
    (request: sgn_staking_v1_query_pb.QueryValidatorRequest) => {
      return request.serializeBinary();
    },
    sgn_staking_v1_query_pb.QueryValidatorResponse.deserializeBinary
  );

  validator(
    request: sgn_staking_v1_query_pb.QueryValidatorRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_staking_v1_query_pb.QueryValidatorResponse>;

  validator(
    request: sgn_staking_v1_query_pb.QueryValidatorRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryValidatorResponse) => void): grpcWeb.ClientReadableStream<sgn_staking_v1_query_pb.QueryValidatorResponse>;

  validator(
    request: sgn_staking_v1_query_pb.QueryValidatorRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryValidatorResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.staking.v1.Query/Validator',
        request,
        metadata || {},
        this.methodInfoValidator,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.staking.v1.Query/Validator',
    request,
    metadata || {},
    this.methodInfoValidator);
  }

  methodInfoValidatorDelegations = new grpcWeb.MethodDescriptor(
    '/sgn.staking.v1.Query/ValidatorDelegations',
    grpcWeb.MethodType.UNARY,
    sgn_staking_v1_query_pb.QueryValidatorDelegationsRequest,
    sgn_staking_v1_query_pb.QueryValidatorDelegationsResponse,
    (request: sgn_staking_v1_query_pb.QueryValidatorDelegationsRequest) => {
      return request.serializeBinary();
    },
    sgn_staking_v1_query_pb.QueryValidatorDelegationsResponse.deserializeBinary
  );

  validatorDelegations(
    request: sgn_staking_v1_query_pb.QueryValidatorDelegationsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_staking_v1_query_pb.QueryValidatorDelegationsResponse>;

  validatorDelegations(
    request: sgn_staking_v1_query_pb.QueryValidatorDelegationsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryValidatorDelegationsResponse) => void): grpcWeb.ClientReadableStream<sgn_staking_v1_query_pb.QueryValidatorDelegationsResponse>;

  validatorDelegations(
    request: sgn_staking_v1_query_pb.QueryValidatorDelegationsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryValidatorDelegationsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.staking.v1.Query/ValidatorDelegations',
        request,
        metadata || {},
        this.methodInfoValidatorDelegations,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.staking.v1.Query/ValidatorDelegations',
    request,
    metadata || {},
    this.methodInfoValidatorDelegations);
  }

  methodInfoDelegation = new grpcWeb.MethodDescriptor(
    '/sgn.staking.v1.Query/Delegation',
    grpcWeb.MethodType.UNARY,
    sgn_staking_v1_query_pb.QueryDelegationRequest,
    sgn_staking_v1_query_pb.QueryDelegationResponse,
    (request: sgn_staking_v1_query_pb.QueryDelegationRequest) => {
      return request.serializeBinary();
    },
    sgn_staking_v1_query_pb.QueryDelegationResponse.deserializeBinary
  );

  delegation(
    request: sgn_staking_v1_query_pb.QueryDelegationRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_staking_v1_query_pb.QueryDelegationResponse>;

  delegation(
    request: sgn_staking_v1_query_pb.QueryDelegationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryDelegationResponse) => void): grpcWeb.ClientReadableStream<sgn_staking_v1_query_pb.QueryDelegationResponse>;

  delegation(
    request: sgn_staking_v1_query_pb.QueryDelegationRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryDelegationResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.staking.v1.Query/Delegation',
        request,
        metadata || {},
        this.methodInfoDelegation,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.staking.v1.Query/Delegation',
    request,
    metadata || {},
    this.methodInfoDelegation);
  }

  methodInfoDelegatorDelegations = new grpcWeb.MethodDescriptor(
    '/sgn.staking.v1.Query/DelegatorDelegations',
    grpcWeb.MethodType.UNARY,
    sgn_staking_v1_query_pb.QueryDelegatorDelegationsRequest,
    sgn_staking_v1_query_pb.QueryDelegatorDelegationsResponse,
    (request: sgn_staking_v1_query_pb.QueryDelegatorDelegationsRequest) => {
      return request.serializeBinary();
    },
    sgn_staking_v1_query_pb.QueryDelegatorDelegationsResponse.deserializeBinary
  );

  delegatorDelegations(
    request: sgn_staking_v1_query_pb.QueryDelegatorDelegationsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_staking_v1_query_pb.QueryDelegatorDelegationsResponse>;

  delegatorDelegations(
    request: sgn_staking_v1_query_pb.QueryDelegatorDelegationsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryDelegatorDelegationsResponse) => void): grpcWeb.ClientReadableStream<sgn_staking_v1_query_pb.QueryDelegatorDelegationsResponse>;

  delegatorDelegations(
    request: sgn_staking_v1_query_pb.QueryDelegatorDelegationsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryDelegatorDelegationsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.staking.v1.Query/DelegatorDelegations',
        request,
        metadata || {},
        this.methodInfoDelegatorDelegations,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.staking.v1.Query/DelegatorDelegations',
    request,
    metadata || {},
    this.methodInfoDelegatorDelegations);
  }

  methodInfoDelegatorValidators = new grpcWeb.MethodDescriptor(
    '/sgn.staking.v1.Query/DelegatorValidators',
    grpcWeb.MethodType.UNARY,
    sgn_staking_v1_query_pb.QueryDelegatorValidatorsRequest,
    sgn_staking_v1_query_pb.QueryDelegatorValidatorsResponse,
    (request: sgn_staking_v1_query_pb.QueryDelegatorValidatorsRequest) => {
      return request.serializeBinary();
    },
    sgn_staking_v1_query_pb.QueryDelegatorValidatorsResponse.deserializeBinary
  );

  delegatorValidators(
    request: sgn_staking_v1_query_pb.QueryDelegatorValidatorsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_staking_v1_query_pb.QueryDelegatorValidatorsResponse>;

  delegatorValidators(
    request: sgn_staking_v1_query_pb.QueryDelegatorValidatorsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryDelegatorValidatorsResponse) => void): grpcWeb.ClientReadableStream<sgn_staking_v1_query_pb.QueryDelegatorValidatorsResponse>;

  delegatorValidators(
    request: sgn_staking_v1_query_pb.QueryDelegatorValidatorsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryDelegatorValidatorsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.staking.v1.Query/DelegatorValidators',
        request,
        metadata || {},
        this.methodInfoDelegatorValidators,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.staking.v1.Query/DelegatorValidators',
    request,
    metadata || {},
    this.methodInfoDelegatorValidators);
  }

  methodInfoDelegatorValidator = new grpcWeb.MethodDescriptor(
    '/sgn.staking.v1.Query/DelegatorValidator',
    grpcWeb.MethodType.UNARY,
    sgn_staking_v1_query_pb.QueryDelegatorValidatorRequest,
    sgn_staking_v1_query_pb.QueryDelegatorValidatorResponse,
    (request: sgn_staking_v1_query_pb.QueryDelegatorValidatorRequest) => {
      return request.serializeBinary();
    },
    sgn_staking_v1_query_pb.QueryDelegatorValidatorResponse.deserializeBinary
  );

  delegatorValidator(
    request: sgn_staking_v1_query_pb.QueryDelegatorValidatorRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_staking_v1_query_pb.QueryDelegatorValidatorResponse>;

  delegatorValidator(
    request: sgn_staking_v1_query_pb.QueryDelegatorValidatorRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryDelegatorValidatorResponse) => void): grpcWeb.ClientReadableStream<sgn_staking_v1_query_pb.QueryDelegatorValidatorResponse>;

  delegatorValidator(
    request: sgn_staking_v1_query_pb.QueryDelegatorValidatorRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryDelegatorValidatorResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.staking.v1.Query/DelegatorValidator',
        request,
        metadata || {},
        this.methodInfoDelegatorValidator,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.staking.v1.Query/DelegatorValidator',
    request,
    metadata || {},
    this.methodInfoDelegatorValidator);
  }

  methodInfoParams = new grpcWeb.MethodDescriptor(
    '/sgn.staking.v1.Query/Params',
    grpcWeb.MethodType.UNARY,
    sgn_staking_v1_query_pb.QueryParamsRequest,
    sgn_staking_v1_query_pb.QueryParamsResponse,
    (request: sgn_staking_v1_query_pb.QueryParamsRequest) => {
      return request.serializeBinary();
    },
    sgn_staking_v1_query_pb.QueryParamsResponse.deserializeBinary
  );

  params(
    request: sgn_staking_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_staking_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_staking_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryParamsResponse) => void): grpcWeb.ClientReadableStream<sgn_staking_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_staking_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_staking_v1_query_pb.QueryParamsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.staking.v1.Query/Params',
        request,
        metadata || {},
        this.methodInfoParams,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.staking.v1.Query/Params',
    request,
    metadata || {},
    this.methodInfoParams);
  }

}

