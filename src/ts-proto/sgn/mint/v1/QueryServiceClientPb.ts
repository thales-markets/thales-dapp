/**
 * @fileoverview gRPC-Web generated client stub for sgn.mint.v1
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as sgn_mint_v1_query_pb from '../../../sgn/mint/v1/query_pb';


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

  methodInfoParams = new grpcWeb.MethodDescriptor(
    '/sgn.mint.v1.Query/Params',
    grpcWeb.MethodType.UNARY,
    sgn_mint_v1_query_pb.QueryParamsRequest,
    sgn_mint_v1_query_pb.QueryParamsResponse,
    (request: sgn_mint_v1_query_pb.QueryParamsRequest) => {
      return request.serializeBinary();
    },
    sgn_mint_v1_query_pb.QueryParamsResponse.deserializeBinary
  );

  params(
    request: sgn_mint_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_mint_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_mint_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_mint_v1_query_pb.QueryParamsResponse) => void): grpcWeb.ClientReadableStream<sgn_mint_v1_query_pb.QueryParamsResponse>;

  params(
    request: sgn_mint_v1_query_pb.QueryParamsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_mint_v1_query_pb.QueryParamsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.mint.v1.Query/Params',
        request,
        metadata || {},
        this.methodInfoParams,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.mint.v1.Query/Params',
    request,
    metadata || {},
    this.methodInfoParams);
  }

  methodInfoAnnualProvisions = new grpcWeb.MethodDescriptor(
    '/sgn.mint.v1.Query/AnnualProvisions',
    grpcWeb.MethodType.UNARY,
    sgn_mint_v1_query_pb.QueryAnnualProvisionsRequest,
    sgn_mint_v1_query_pb.QueryAnnualProvisionsResponse,
    (request: sgn_mint_v1_query_pb.QueryAnnualProvisionsRequest) => {
      return request.serializeBinary();
    },
    sgn_mint_v1_query_pb.QueryAnnualProvisionsResponse.deserializeBinary
  );

  annualProvisions(
    request: sgn_mint_v1_query_pb.QueryAnnualProvisionsRequest,
    metadata: grpcWeb.Metadata | null): Promise<sgn_mint_v1_query_pb.QueryAnnualProvisionsResponse>;

  annualProvisions(
    request: sgn_mint_v1_query_pb.QueryAnnualProvisionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: sgn_mint_v1_query_pb.QueryAnnualProvisionsResponse) => void): grpcWeb.ClientReadableStream<sgn_mint_v1_query_pb.QueryAnnualProvisionsResponse>;

  annualProvisions(
    request: sgn_mint_v1_query_pb.QueryAnnualProvisionsRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: sgn_mint_v1_query_pb.QueryAnnualProvisionsResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/sgn.mint.v1.Query/AnnualProvisions',
        request,
        metadata || {},
        this.methodInfoAnnualProvisions,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/sgn.mint.v1.Query/AnnualProvisions',
    request,
    metadata || {},
    this.methodInfoAnnualProvisions);
  }

}

