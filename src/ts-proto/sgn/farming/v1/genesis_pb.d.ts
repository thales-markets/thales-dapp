import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_farming_v1_farming_pb from '../../../sgn/farming/v1/farming_pb';
import * as sgn_common_v1_common_pb from '../../../sgn/common/v1/common_pb';


export class PoolHistoricalRewardsRecord extends jspb.Message {
  getPoolName(): string;
  setPoolName(value: string): PoolHistoricalRewardsRecord;

  getPeriod(): number;
  setPeriod(value: number): PoolHistoricalRewardsRecord;

  getRewards(): sgn_farming_v1_farming_pb.PoolHistoricalRewards | undefined;
  setRewards(value?: sgn_farming_v1_farming_pb.PoolHistoricalRewards): PoolHistoricalRewardsRecord;
  hasRewards(): boolean;
  clearRewards(): PoolHistoricalRewardsRecord;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PoolHistoricalRewardsRecord.AsObject;
  static toObject(includeInstance: boolean, msg: PoolHistoricalRewardsRecord): PoolHistoricalRewardsRecord.AsObject;
  static serializeBinaryToWriter(message: PoolHistoricalRewardsRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PoolHistoricalRewardsRecord;
  static deserializeBinaryFromReader(message: PoolHistoricalRewardsRecord, reader: jspb.BinaryReader): PoolHistoricalRewardsRecord;
}

export namespace PoolHistoricalRewardsRecord {
  export type AsObject = {
    poolName: string,
    period: number,
    rewards?: sgn_farming_v1_farming_pb.PoolHistoricalRewards.AsObject,
  }
}

export class PoolCurrentRewardsRecord extends jspb.Message {
  getPoolName(): string;
  setPoolName(value: string): PoolCurrentRewardsRecord;

  getRewards(): sgn_farming_v1_farming_pb.PoolCurrentRewards | undefined;
  setRewards(value?: sgn_farming_v1_farming_pb.PoolCurrentRewards): PoolCurrentRewardsRecord;
  hasRewards(): boolean;
  clearRewards(): PoolCurrentRewardsRecord;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PoolCurrentRewardsRecord.AsObject;
  static toObject(includeInstance: boolean, msg: PoolCurrentRewardsRecord): PoolCurrentRewardsRecord.AsObject;
  static serializeBinaryToWriter(message: PoolCurrentRewardsRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PoolCurrentRewardsRecord;
  static deserializeBinaryFromReader(message: PoolCurrentRewardsRecord, reader: jspb.BinaryReader): PoolCurrentRewardsRecord;
}

export namespace PoolCurrentRewardsRecord {
  export type AsObject = {
    poolName: string,
    rewards?: sgn_farming_v1_farming_pb.PoolCurrentRewards.AsObject,
  }
}

export class StakeInfoRecord extends jspb.Message {
  getPoolName(): string;
  setPoolName(value: string): StakeInfoRecord;

  getStakerAddress(): string;
  setStakerAddress(value: string): StakeInfoRecord;

  getStakeInfo(): sgn_farming_v1_farming_pb.StakeInfo | undefined;
  setStakeInfo(value?: sgn_farming_v1_farming_pb.StakeInfo): StakeInfoRecord;
  hasStakeInfo(): boolean;
  clearStakeInfo(): StakeInfoRecord;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StakeInfoRecord.AsObject;
  static toObject(includeInstance: boolean, msg: StakeInfoRecord): StakeInfoRecord.AsObject;
  static serializeBinaryToWriter(message: StakeInfoRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StakeInfoRecord;
  static deserializeBinaryFromReader(message: StakeInfoRecord, reader: jspb.BinaryReader): StakeInfoRecord;
}

export namespace StakeInfoRecord {
  export type AsObject = {
    poolName: string,
    stakerAddress: string,
    stakeInfo?: sgn_farming_v1_farming_pb.StakeInfo.AsObject,
  }
}

export class GenesisState extends jspb.Message {
  getParams(): sgn_farming_v1_farming_pb.Params | undefined;
  setParams(value?: sgn_farming_v1_farming_pb.Params): GenesisState;
  hasParams(): boolean;
  clearParams(): GenesisState;

  getPoolsList(): Array<sgn_farming_v1_farming_pb.FarmingPool>;
  setPoolsList(value: Array<sgn_farming_v1_farming_pb.FarmingPool>): GenesisState;
  clearPoolsList(): GenesisState;
  addPools(value?: sgn_farming_v1_farming_pb.FarmingPool, index?: number): sgn_farming_v1_farming_pb.FarmingPool;

  getStakeInfosList(): Array<sgn_farming_v1_farming_pb.StakeInfo>;
  setStakeInfosList(value: Array<sgn_farming_v1_farming_pb.StakeInfo>): GenesisState;
  clearStakeInfosList(): GenesisState;
  addStakeInfos(value?: sgn_farming_v1_farming_pb.StakeInfo, index?: number): sgn_farming_v1_farming_pb.StakeInfo;

  getPoolHistoricalRewardsList(): Array<PoolHistoricalRewardsRecord>;
  setPoolHistoricalRewardsList(value: Array<PoolHistoricalRewardsRecord>): GenesisState;
  clearPoolHistoricalRewardsList(): GenesisState;
  addPoolHistoricalRewards(value?: PoolHistoricalRewardsRecord, index?: number): PoolHistoricalRewardsRecord;

  getPoolCurrentRewardsList(): Array<PoolCurrentRewardsRecord>;
  setPoolCurrentRewardsList(value: Array<PoolCurrentRewardsRecord>): GenesisState;
  clearPoolCurrentRewardsList(): GenesisState;
  addPoolCurrentRewards(value?: PoolCurrentRewardsRecord, index?: number): PoolCurrentRewardsRecord;

  getRewardContractsList(): Array<sgn_common_v1_common_pb.ContractInfo>;
  setRewardContractsList(value: Array<sgn_common_v1_common_pb.ContractInfo>): GenesisState;
  clearRewardContractsList(): GenesisState;
  addRewardContracts(value?: sgn_common_v1_common_pb.ContractInfo, index?: number): sgn_common_v1_common_pb.ContractInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenesisState.AsObject;
  static toObject(includeInstance: boolean, msg: GenesisState): GenesisState.AsObject;
  static serializeBinaryToWriter(message: GenesisState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenesisState;
  static deserializeBinaryFromReader(message: GenesisState, reader: jspb.BinaryReader): GenesisState;
}

export namespace GenesisState {
  export type AsObject = {
    params?: sgn_farming_v1_farming_pb.Params.AsObject,
    poolsList: Array<sgn_farming_v1_farming_pb.FarmingPool.AsObject>,
    stakeInfosList: Array<sgn_farming_v1_farming_pb.StakeInfo.AsObject>,
    poolHistoricalRewardsList: Array<PoolHistoricalRewardsRecord.AsObject>,
    poolCurrentRewardsList: Array<PoolCurrentRewardsRecord.AsObject>,
    rewardContractsList: Array<sgn_common_v1_common_pb.ContractInfo.AsObject>,
  }
}

