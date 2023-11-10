import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_protobuf_any_pb from 'google-protobuf/google/protobuf/any_pb';
import * as cosmos_proto_cosmos_pb from '../../../cosmos_proto/cosmos_pb';
import * as cosmos_base_v1beta1_coin_pb from '../../../cosmos/base/v1beta1/coin_pb';


export class Validator extends jspb.Message {
  getEthAddress(): string;
  setEthAddress(value: string): Validator;

  getEthSigner(): string;
  setEthSigner(value: string): Validator;

  getSgnAddress(): string;
  setSgnAddress(value: string): Validator;

  getConsensusPubkey(): google_protobuf_any_pb.Any | undefined;
  setConsensusPubkey(value?: google_protobuf_any_pb.Any): Validator;
  hasConsensusPubkey(): boolean;
  clearConsensusPubkey(): Validator;

  getStatus(): BondStatus;
  setStatus(value: BondStatus): Validator;

  getTokens(): string;
  setTokens(value: string): Validator;

  getDelegatorShares(): string;
  setDelegatorShares(value: string): Validator;

  getCommissionRate(): string;
  setCommissionRate(value: string): Validator;

  getDescription(): Description | undefined;
  setDescription(value?: Description): Validator;
  hasDescription(): boolean;
  clearDescription(): Validator;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Validator.AsObject;
  static toObject(includeInstance: boolean, msg: Validator): Validator.AsObject;
  static serializeBinaryToWriter(message: Validator, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Validator;
  static deserializeBinaryFromReader(message: Validator, reader: jspb.BinaryReader): Validator;
}

export namespace Validator {
  export type AsObject = {
    ethAddress: string,
    ethSigner: string,
    sgnAddress: string,
    consensusPubkey?: google_protobuf_any_pb.Any.AsObject,
    status: BondStatus,
    tokens: string,
    delegatorShares: string,
    commissionRate: string,
    description?: Description.AsObject,
  }
}

export class Description extends jspb.Message {
  getMoniker(): string;
  setMoniker(value: string): Description;

  getIdentity(): string;
  setIdentity(value: string): Description;

  getWebsite(): string;
  setWebsite(value: string): Description;

  getContact(): string;
  setContact(value: string): Description;

  getDetails(): string;
  setDetails(value: string): Description;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Description.AsObject;
  static toObject(includeInstance: boolean, msg: Description): Description.AsObject;
  static serializeBinaryToWriter(message: Description, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Description;
  static deserializeBinaryFromReader(message: Description, reader: jspb.BinaryReader): Description;
}

export namespace Description {
  export type AsObject = {
    moniker: string,
    identity: string,
    website: string,
    contact: string,
    details: string,
  }
}

export class ValidatorTransactors extends jspb.Message {
  getTransactorsList(): Array<string>;
  setTransactorsList(value: Array<string>): ValidatorTransactors;
  clearTransactorsList(): ValidatorTransactors;
  addTransactors(value: string, index?: number): ValidatorTransactors;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidatorTransactors.AsObject;
  static toObject(includeInstance: boolean, msg: ValidatorTransactors): ValidatorTransactors.AsObject;
  static serializeBinaryToWriter(message: ValidatorTransactors, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidatorTransactors;
  static deserializeBinaryFromReader(message: ValidatorTransactors, reader: jspb.BinaryReader): ValidatorTransactors;
}

export namespace ValidatorTransactors {
  export type AsObject = {
    transactorsList: Array<string>,
  }
}

export class Delegation extends jspb.Message {
  getDelegatorAddress(): string;
  setDelegatorAddress(value: string): Delegation;

  getValidatorAddress(): string;
  setValidatorAddress(value: string): Delegation;

  getShares(): string;
  setShares(value: string): Delegation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Delegation.AsObject;
  static toObject(includeInstance: boolean, msg: Delegation): Delegation.AsObject;
  static serializeBinaryToWriter(message: Delegation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Delegation;
  static deserializeBinaryFromReader(message: Delegation, reader: jspb.BinaryReader): Delegation;
}

export namespace Delegation {
  export type AsObject = {
    delegatorAddress: string,
    validatorAddress: string,
    shares: string,
  }
}

export class DelegationResponse extends jspb.Message {
  getDelegation(): Delegation | undefined;
  setDelegation(value?: Delegation): DelegationResponse;
  hasDelegation(): boolean;
  clearDelegation(): DelegationResponse;

  getBalance(): cosmos_base_v1beta1_coin_pb.Coin | undefined;
  setBalance(value?: cosmos_base_v1beta1_coin_pb.Coin): DelegationResponse;
  hasBalance(): boolean;
  clearBalance(): DelegationResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DelegationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DelegationResponse): DelegationResponse.AsObject;
  static serializeBinaryToWriter(message: DelegationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DelegationResponse;
  static deserializeBinaryFromReader(message: DelegationResponse, reader: jspb.BinaryReader): DelegationResponse;
}

export namespace DelegationResponse {
  export type AsObject = {
    delegation?: Delegation.AsObject,
    balance?: cosmos_base_v1beta1_coin_pb.Coin.AsObject,
  }
}

export class Syncer extends jspb.Message {
  getValIndex(): number;
  setValIndex(value: number): Syncer;

  getEthAddress(): string;
  setEthAddress(value: string): Syncer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Syncer.AsObject;
  static toObject(includeInstance: boolean, msg: Syncer): Syncer.AsObject;
  static serializeBinaryToWriter(message: Syncer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Syncer;
  static deserializeBinaryFromReader(message: Syncer, reader: jspb.BinaryReader): Syncer;
}

export namespace Syncer {
  export type AsObject = {
    valIndex: number,
    ethAddress: string,
  }
}

export class Params extends jspb.Message {
  getSyncerDuration(): number;
  setSyncerDuration(value: number): Params;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Params.AsObject;
  static toObject(includeInstance: boolean, msg: Params): Params.AsObject;
  static serializeBinaryToWriter(message: Params, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Params;
  static deserializeBinaryFromReader(message: Params, reader: jspb.BinaryReader): Params;
}

export namespace Params {
  export type AsObject = {
    syncerDuration: number,
  }
}

export enum BondStatus { 
  BOND_STATUS_UNSPECIFIED = 0,
  BOND_STATUS_UNBONDED = 1,
  BOND_STATUS_UNBONDING = 2,
  BOND_STATUS_BONDED = 3,
}
