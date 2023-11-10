import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_staking_v1_staking_pb from '../../../sgn/staking/v1/staking_pb';


export class GenesisState extends jspb.Message {
  getParams(): sgn_staking_v1_staking_pb.Params | undefined;
  setParams(value?: sgn_staking_v1_staking_pb.Params): GenesisState;
  hasParams(): boolean;
  clearParams(): GenesisState;

  getSyncer(): sgn_staking_v1_staking_pb.Syncer | undefined;
  setSyncer(value?: sgn_staking_v1_staking_pb.Syncer): GenesisState;
  hasSyncer(): boolean;
  clearSyncer(): GenesisState;

  getValidatorsList(): Array<sgn_staking_v1_staking_pb.Validator>;
  setValidatorsList(value: Array<sgn_staking_v1_staking_pb.Validator>): GenesisState;
  clearValidatorsList(): GenesisState;
  addValidators(value?: sgn_staking_v1_staking_pb.Validator, index?: number): sgn_staking_v1_staking_pb.Validator;

  getDelegationsList(): Array<sgn_staking_v1_staking_pb.Delegation>;
  setDelegationsList(value: Array<sgn_staking_v1_staking_pb.Delegation>): GenesisState;
  clearDelegationsList(): GenesisState;
  addDelegations(value?: sgn_staking_v1_staking_pb.Delegation, index?: number): sgn_staking_v1_staking_pb.Delegation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenesisState.AsObject;
  static toObject(includeInstance: boolean, msg: GenesisState): GenesisState.AsObject;
  static serializeBinaryToWriter(message: GenesisState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenesisState;
  static deserializeBinaryFromReader(message: GenesisState, reader: jspb.BinaryReader): GenesisState;
}

export namespace GenesisState {
  export type AsObject = {
    params?: sgn_staking_v1_staking_pb.Params.AsObject,
    syncer?: sgn_staking_v1_staking_pb.Syncer.AsObject,
    validatorsList: Array<sgn_staking_v1_staking_pb.Validator.AsObject>,
    delegationsList: Array<sgn_staking_v1_staking_pb.Delegation.AsObject>,
  }
}

