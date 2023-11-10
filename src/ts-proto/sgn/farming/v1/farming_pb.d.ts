import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_protobuf_duration_pb from 'google-protobuf/google/protobuf/duration_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import * as cosmos_base_v1beta1_coin_pb from '../../../cosmos/base/v1beta1/coin_pb';
import * as sgn_common_v1_common_pb from '../../../sgn/common/v1/common_pb';


export class Params extends jspb.Message {
  getClaimCooldown(): google_protobuf_duration_pb.Duration | undefined;
  setClaimCooldown(value?: google_protobuf_duration_pb.Duration): Params;
  hasClaimCooldown(): boolean;
  clearClaimCooldown(): Params;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Params.AsObject;
  static toObject(includeInstance: boolean, msg: Params): Params.AsObject;
  static serializeBinaryToWriter(message: Params, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Params;
  static deserializeBinaryFromReader(message: Params, reader: jspb.BinaryReader): Params;
}

export namespace Params {
  export type AsObject = {
    claimCooldown?: google_protobuf_duration_pb.Duration.AsObject,
  }
}

export class FarmingPool extends jspb.Message {
  getName(): string;
  setName(value: string): FarmingPool;

  getStakeToken(): sgn_common_v1_common_pb.ERC20Token | undefined;
  setStakeToken(value?: sgn_common_v1_common_pb.ERC20Token): FarmingPool;
  hasStakeToken(): boolean;
  clearStakeToken(): FarmingPool;

  getRewardTokensList(): Array<sgn_common_v1_common_pb.ERC20Token>;
  setRewardTokensList(value: Array<sgn_common_v1_common_pb.ERC20Token>): FarmingPool;
  clearRewardTokensList(): FarmingPool;
  addRewardTokens(value?: sgn_common_v1_common_pb.ERC20Token, index?: number): sgn_common_v1_common_pb.ERC20Token;

  getTotalStakedAmount(): cosmos_base_v1beta1_coin_pb.DecCoin | undefined;
  setTotalStakedAmount(value?: cosmos_base_v1beta1_coin_pb.DecCoin): FarmingPool;
  hasTotalStakedAmount(): boolean;
  clearTotalStakedAmount(): FarmingPool;

  getRewardTokenInfosList(): Array<RewardTokenInfo>;
  setRewardTokenInfosList(value: Array<RewardTokenInfo>): FarmingPool;
  clearRewardTokenInfosList(): FarmingPool;
  addRewardTokenInfos(value?: RewardTokenInfo, index?: number): RewardTokenInfo;

  getTotalAccumulatedRewardsList(): Array<cosmos_base_v1beta1_coin_pb.DecCoin>;
  setTotalAccumulatedRewardsList(value: Array<cosmos_base_v1beta1_coin_pb.DecCoin>): FarmingPool;
  clearTotalAccumulatedRewardsList(): FarmingPool;
  addTotalAccumulatedRewards(value?: cosmos_base_v1beta1_coin_pb.DecCoin, index?: number): cosmos_base_v1beta1_coin_pb.DecCoin;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FarmingPool.AsObject;
  static toObject(includeInstance: boolean, msg: FarmingPool): FarmingPool.AsObject;
  static serializeBinaryToWriter(message: FarmingPool, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FarmingPool;
  static deserializeBinaryFromReader(message: FarmingPool, reader: jspb.BinaryReader): FarmingPool;
}

export namespace FarmingPool {
  export type AsObject = {
    name: string,
    stakeToken?: sgn_common_v1_common_pb.ERC20Token.AsObject,
    rewardTokensList: Array<sgn_common_v1_common_pb.ERC20Token.AsObject>,
    totalStakedAmount?: cosmos_base_v1beta1_coin_pb.DecCoin.AsObject,
    rewardTokenInfosList: Array<RewardTokenInfo.AsObject>,
    totalAccumulatedRewardsList: Array<cosmos_base_v1beta1_coin_pb.DecCoin.AsObject>,
  }
}

export class NumPools extends jspb.Message {
  getNumPools(): number;
  setNumPools(value: number): NumPools;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NumPools.AsObject;
  static toObject(includeInstance: boolean, msg: NumPools): NumPools.AsObject;
  static serializeBinaryToWriter(message: NumPools, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NumPools;
  static deserializeBinaryFromReader(message: NumPools, reader: jspb.BinaryReader): NumPools;
}

export namespace NumPools {
  export type AsObject = {
    numPools: number,
  }
}

export class RewardTokenInfo extends jspb.Message {
  getRemainingAmount(): cosmos_base_v1beta1_coin_pb.DecCoin | undefined;
  setRemainingAmount(value?: cosmos_base_v1beta1_coin_pb.DecCoin): RewardTokenInfo;
  hasRemainingAmount(): boolean;
  clearRemainingAmount(): RewardTokenInfo;

  getRewardStartBlockHeight(): number;
  setRewardStartBlockHeight(value: number): RewardTokenInfo;

  getRewardAmountPerBlock(): string;
  setRewardAmountPerBlock(value: string): RewardTokenInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardTokenInfo.AsObject;
  static toObject(includeInstance: boolean, msg: RewardTokenInfo): RewardTokenInfo.AsObject;
  static serializeBinaryToWriter(message: RewardTokenInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardTokenInfo;
  static deserializeBinaryFromReader(message: RewardTokenInfo, reader: jspb.BinaryReader): RewardTokenInfo;
}

export namespace RewardTokenInfo {
  export type AsObject = {
    remainingAmount?: cosmos_base_v1beta1_coin_pb.DecCoin.AsObject,
    rewardStartBlockHeight: number,
    rewardAmountPerBlock: string,
  }
}

export class StakeInfo extends jspb.Message {
  getStakerAddress(): string;
  setStakerAddress(value: string): StakeInfo;

  getPoolName(): string;
  setPoolName(value: string): StakeInfo;

  getAmount(): cosmos_base_v1beta1_coin_pb.DecCoin | undefined;
  setAmount(value?: cosmos_base_v1beta1_coin_pb.DecCoin): StakeInfo;
  hasAmount(): boolean;
  clearAmount(): StakeInfo;

  getStartBlockHeight(): number;
  setStartBlockHeight(value: number): StakeInfo;

  getReferencePeriod(): number;
  setReferencePeriod(value: number): StakeInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StakeInfo.AsObject;
  static toObject(includeInstance: boolean, msg: StakeInfo): StakeInfo.AsObject;
  static serializeBinaryToWriter(message: StakeInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StakeInfo;
  static deserializeBinaryFromReader(message: StakeInfo, reader: jspb.BinaryReader): StakeInfo;
}

export namespace StakeInfo {
  export type AsObject = {
    stakerAddress: string,
    poolName: string,
    amount?: cosmos_base_v1beta1_coin_pb.DecCoin.AsObject,
    startBlockHeight: number,
    referencePeriod: number,
  }
}

export class PoolHistoricalRewards extends jspb.Message {
  getCumulativeRewardRatioList(): Array<cosmos_base_v1beta1_coin_pb.DecCoin>;
  setCumulativeRewardRatioList(value: Array<cosmos_base_v1beta1_coin_pb.DecCoin>): PoolHistoricalRewards;
  clearCumulativeRewardRatioList(): PoolHistoricalRewards;
  addCumulativeRewardRatio(value?: cosmos_base_v1beta1_coin_pb.DecCoin, index?: number): cosmos_base_v1beta1_coin_pb.DecCoin;

  getReferenceCount(): number;
  setReferenceCount(value: number): PoolHistoricalRewards;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PoolHistoricalRewards.AsObject;
  static toObject(includeInstance: boolean, msg: PoolHistoricalRewards): PoolHistoricalRewards.AsObject;
  static serializeBinaryToWriter(message: PoolHistoricalRewards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PoolHistoricalRewards;
  static deserializeBinaryFromReader(message: PoolHistoricalRewards, reader: jspb.BinaryReader): PoolHistoricalRewards;
}

export namespace PoolHistoricalRewards {
  export type AsObject = {
    cumulativeRewardRatioList: Array<cosmos_base_v1beta1_coin_pb.DecCoin.AsObject>,
    referenceCount: number,
  }
}

export class PoolCurrentRewards extends jspb.Message {
  getStartBlockHeight(): number;
  setStartBlockHeight(value: number): PoolCurrentRewards;

  getPeriod(): number;
  setPeriod(value: number): PoolCurrentRewards;

  getRewardsList(): Array<cosmos_base_v1beta1_coin_pb.DecCoin>;
  setRewardsList(value: Array<cosmos_base_v1beta1_coin_pb.DecCoin>): PoolCurrentRewards;
  clearRewardsList(): PoolCurrentRewards;
  addRewards(value?: cosmos_base_v1beta1_coin_pb.DecCoin, index?: number): cosmos_base_v1beta1_coin_pb.DecCoin;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PoolCurrentRewards.AsObject;
  static toObject(includeInstance: boolean, msg: PoolCurrentRewards): PoolCurrentRewards.AsObject;
  static serializeBinaryToWriter(message: PoolCurrentRewards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PoolCurrentRewards;
  static deserializeBinaryFromReader(message: PoolCurrentRewards, reader: jspb.BinaryReader): PoolCurrentRewards;
}

export namespace PoolCurrentRewards {
  export type AsObject = {
    startBlockHeight: number,
    period: number,
    rewardsList: Array<cosmos_base_v1beta1_coin_pb.DecCoin.AsObject>,
  }
}

export class Earnings extends jspb.Message {
  getTargetBlockHeight(): number;
  setTargetBlockHeight(value: number): Earnings;

  getStakedAmount(): cosmos_base_v1beta1_coin_pb.DecCoin | undefined;
  setStakedAmount(value?: cosmos_base_v1beta1_coin_pb.DecCoin): Earnings;
  hasStakedAmount(): boolean;
  clearStakedAmount(): Earnings;

  getRewardAmountsList(): Array<cosmos_base_v1beta1_coin_pb.DecCoin>;
  setRewardAmountsList(value: Array<cosmos_base_v1beta1_coin_pb.DecCoin>): Earnings;
  clearRewardAmountsList(): Earnings;
  addRewardAmounts(value?: cosmos_base_v1beta1_coin_pb.DecCoin, index?: number): cosmos_base_v1beta1_coin_pb.DecCoin;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Earnings.AsObject;
  static toObject(includeInstance: boolean, msg: Earnings): Earnings.AsObject;
  static serializeBinaryToWriter(message: Earnings, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Earnings;
  static deserializeBinaryFromReader(message: Earnings, reader: jspb.BinaryReader): Earnings;
}

export namespace Earnings {
  export type AsObject = {
    targetBlockHeight: number,
    stakedAmount?: cosmos_base_v1beta1_coin_pb.DecCoin.AsObject,
    rewardAmountsList: Array<cosmos_base_v1beta1_coin_pb.DecCoin.AsObject>,
  }
}

export class AccountInfo extends jspb.Message {
  getStakedPoolsList(): Array<FarmingPool>;
  setStakedPoolsList(value: Array<FarmingPool>): AccountInfo;
  clearStakedPoolsList(): AccountInfo;
  addStakedPools(value?: FarmingPool, index?: number): FarmingPool;

  getEarningsListList(): Array<Earnings>;
  setEarningsListList(value: Array<Earnings>): AccountInfo;
  clearEarningsListList(): AccountInfo;
  addEarningsList(value?: Earnings, index?: number): Earnings;

  getCumulativeRewardAmountsList(): Array<cosmos_base_v1beta1_coin_pb.DecCoin>;
  setCumulativeRewardAmountsList(value: Array<cosmos_base_v1beta1_coin_pb.DecCoin>): AccountInfo;
  clearCumulativeRewardAmountsList(): AccountInfo;
  addCumulativeRewardAmounts(value?: cosmos_base_v1beta1_coin_pb.DecCoin, index?: number): cosmos_base_v1beta1_coin_pb.DecCoin;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AccountInfo): AccountInfo.AsObject;
  static serializeBinaryToWriter(message: AccountInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountInfo;
  static deserializeBinaryFromReader(message: AccountInfo, reader: jspb.BinaryReader): AccountInfo;
}

export namespace AccountInfo {
  export type AsObject = {
    stakedPoolsList: Array<FarmingPool.AsObject>,
    earningsListList: Array<Earnings.AsObject>,
    cumulativeRewardAmountsList: Array<cosmos_base_v1beta1_coin_pb.DecCoin.AsObject>,
  }
}

export class RewardClaimDetails extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): RewardClaimDetails;

  getCumulativeRewardAmountsList(): Array<cosmos_base_v1beta1_coin_pb.DecCoin>;
  setCumulativeRewardAmountsList(value: Array<cosmos_base_v1beta1_coin_pb.DecCoin>): RewardClaimDetails;
  clearCumulativeRewardAmountsList(): RewardClaimDetails;
  addCumulativeRewardAmounts(value?: cosmos_base_v1beta1_coin_pb.DecCoin, index?: number): cosmos_base_v1beta1_coin_pb.DecCoin;

  getRewardProtoBytes(): Uint8Array | string;
  getRewardProtoBytes_asU8(): Uint8Array;
  getRewardProtoBytes_asB64(): string;
  setRewardProtoBytes(value: Uint8Array | string): RewardClaimDetails;

  getSignaturesList(): Array<sgn_common_v1_common_pb.Signature>;
  setSignaturesList(value: Array<sgn_common_v1_common_pb.Signature>): RewardClaimDetails;
  clearSignaturesList(): RewardClaimDetails;
  addSignatures(value?: sgn_common_v1_common_pb.Signature, index?: number): sgn_common_v1_common_pb.Signature;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardClaimDetails.AsObject;
  static toObject(includeInstance: boolean, msg: RewardClaimDetails): RewardClaimDetails.AsObject;
  static serializeBinaryToWriter(message: RewardClaimDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardClaimDetails;
  static deserializeBinaryFromReader(message: RewardClaimDetails, reader: jspb.BinaryReader): RewardClaimDetails;
}

export namespace RewardClaimDetails {
  export type AsObject = {
    chainId: number,
    cumulativeRewardAmountsList: Array<cosmos_base_v1beta1_coin_pb.DecCoin.AsObject>,
    rewardProtoBytes: Uint8Array | string,
    signaturesList: Array<sgn_common_v1_common_pb.Signature.AsObject>,
  }
}

export class RewardClaimInfo extends jspb.Message {
  getRecipient(): string;
  setRecipient(value: string): RewardClaimInfo;

  getLastClaimTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastClaimTime(value?: google_protobuf_timestamp_pb.Timestamp): RewardClaimInfo;
  hasLastClaimTime(): boolean;
  clearLastClaimTime(): RewardClaimInfo;

  getRewardClaimDetailsListList(): Array<RewardClaimDetails>;
  setRewardClaimDetailsListList(value: Array<RewardClaimDetails>): RewardClaimInfo;
  clearRewardClaimDetailsListList(): RewardClaimInfo;
  addRewardClaimDetailsList(value?: RewardClaimDetails, index?: number): RewardClaimDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardClaimInfo.AsObject;
  static toObject(includeInstance: boolean, msg: RewardClaimInfo): RewardClaimInfo.AsObject;
  static serializeBinaryToWriter(message: RewardClaimInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardClaimInfo;
  static deserializeBinaryFromReader(message: RewardClaimInfo, reader: jspb.BinaryReader): RewardClaimInfo;
}

export namespace RewardClaimInfo {
  export type AsObject = {
    recipient: string,
    lastClaimTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    rewardClaimDetailsListList: Array<RewardClaimDetails.AsObject>,
  }
}

export class RewardAdjustmentInput extends jspb.Message {
  getAddAmount(): cosmos_base_v1beta1_coin_pb.DecCoin | undefined;
  setAddAmount(value?: cosmos_base_v1beta1_coin_pb.DecCoin): RewardAdjustmentInput;
  hasAddAmount(): boolean;
  clearAddAmount(): RewardAdjustmentInput;

  getRewardStartBlockDelay(): number;
  setRewardStartBlockDelay(value: number): RewardAdjustmentInput;

  getNewRewardAmountPerBlock(): string;
  setNewRewardAmountPerBlock(value: string): RewardAdjustmentInput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RewardAdjustmentInput.AsObject;
  static toObject(includeInstance: boolean, msg: RewardAdjustmentInput): RewardAdjustmentInput.AsObject;
  static serializeBinaryToWriter(message: RewardAdjustmentInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RewardAdjustmentInput;
  static deserializeBinaryFromReader(message: RewardAdjustmentInput, reader: jspb.BinaryReader): RewardAdjustmentInput;
}

export namespace RewardAdjustmentInput {
  export type AsObject = {
    addAmount?: cosmos_base_v1beta1_coin_pb.DecCoin.AsObject,
    rewardStartBlockDelay: number,
    newRewardAmountPerBlock: string,
  }
}

export class FarmingRewardsOnChain extends jspb.Message {
  getRecipient(): Uint8Array | string;
  getRecipient_asU8(): Uint8Array;
  getRecipient_asB64(): string;
  setRecipient(value: Uint8Array | string): FarmingRewardsOnChain;

  getTokenAddressesList(): Array<Uint8Array | string>;
  setTokenAddressesList(value: Array<Uint8Array | string>): FarmingRewardsOnChain;
  clearTokenAddressesList(): FarmingRewardsOnChain;
  addTokenAddresses(value: Uint8Array | string, index?: number): FarmingRewardsOnChain;

  getCumulativeRewardAmountsList(): Array<Uint8Array | string>;
  setCumulativeRewardAmountsList(value: Array<Uint8Array | string>): FarmingRewardsOnChain;
  clearCumulativeRewardAmountsList(): FarmingRewardsOnChain;
  addCumulativeRewardAmounts(value: Uint8Array | string, index?: number): FarmingRewardsOnChain;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FarmingRewardsOnChain.AsObject;
  static toObject(includeInstance: boolean, msg: FarmingRewardsOnChain): FarmingRewardsOnChain.AsObject;
  static serializeBinaryToWriter(message: FarmingRewardsOnChain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FarmingRewardsOnChain;
  static deserializeBinaryFromReader(message: FarmingRewardsOnChain, reader: jspb.BinaryReader): FarmingRewardsOnChain;
}

export namespace FarmingRewardsOnChain {
  export type AsObject = {
    recipient: Uint8Array | string,
    tokenAddressesList: Array<Uint8Array | string>,
    cumulativeRewardAmountsList: Array<Uint8Array | string>,
  }
}

export class AddPoolProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): AddPoolProposal;

  getDescription(): string;
  setDescription(value: string): AddPoolProposal;

  getPoolName(): string;
  setPoolName(value: string): AddPoolProposal;

  getStakeToken(): sgn_common_v1_common_pb.ERC20Token | undefined;
  setStakeToken(value?: sgn_common_v1_common_pb.ERC20Token): AddPoolProposal;
  hasStakeToken(): boolean;
  clearStakeToken(): AddPoolProposal;

  getRewardTokensList(): Array<sgn_common_v1_common_pb.ERC20Token>;
  setRewardTokensList(value: Array<sgn_common_v1_common_pb.ERC20Token>): AddPoolProposal;
  clearRewardTokensList(): AddPoolProposal;
  addRewardTokens(value?: sgn_common_v1_common_pb.ERC20Token, index?: number): sgn_common_v1_common_pb.ERC20Token;

  getInitialRewardInputsList(): Array<RewardAdjustmentInput>;
  setInitialRewardInputsList(value: Array<RewardAdjustmentInput>): AddPoolProposal;
  clearInitialRewardInputsList(): AddPoolProposal;
  addInitialRewardInputs(value?: RewardAdjustmentInput, index?: number): RewardAdjustmentInput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddPoolProposal.AsObject;
  static toObject(includeInstance: boolean, msg: AddPoolProposal): AddPoolProposal.AsObject;
  static serializeBinaryToWriter(message: AddPoolProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddPoolProposal;
  static deserializeBinaryFromReader(message: AddPoolProposal, reader: jspb.BinaryReader): AddPoolProposal;
}

export namespace AddPoolProposal {
  export type AsObject = {
    title: string,
    description: string,
    poolName: string,
    stakeToken?: sgn_common_v1_common_pb.ERC20Token.AsObject,
    rewardTokensList: Array<sgn_common_v1_common_pb.ERC20Token.AsObject>,
    initialRewardInputsList: Array<RewardAdjustmentInput.AsObject>,
  }
}

export class BatchAddPoolProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): BatchAddPoolProposal;

  getDescription(): string;
  setDescription(value: string): BatchAddPoolProposal;

  getAddPoolInfosList(): Array<AddPoolInfo>;
  setAddPoolInfosList(value: Array<AddPoolInfo>): BatchAddPoolProposal;
  clearAddPoolInfosList(): BatchAddPoolProposal;
  addAddPoolInfos(value?: AddPoolInfo, index?: number): AddPoolInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BatchAddPoolProposal.AsObject;
  static toObject(includeInstance: boolean, msg: BatchAddPoolProposal): BatchAddPoolProposal.AsObject;
  static serializeBinaryToWriter(message: BatchAddPoolProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BatchAddPoolProposal;
  static deserializeBinaryFromReader(message: BatchAddPoolProposal, reader: jspb.BinaryReader): BatchAddPoolProposal;
}

export namespace BatchAddPoolProposal {
  export type AsObject = {
    title: string,
    description: string,
    addPoolInfosList: Array<AddPoolInfo.AsObject>,
  }
}

export class AddPoolInfo extends jspb.Message {
  getPoolName(): string;
  setPoolName(value: string): AddPoolInfo;

  getStakeToken(): sgn_common_v1_common_pb.ERC20Token | undefined;
  setStakeToken(value?: sgn_common_v1_common_pb.ERC20Token): AddPoolInfo;
  hasStakeToken(): boolean;
  clearStakeToken(): AddPoolInfo;

  getRewardTokensList(): Array<sgn_common_v1_common_pb.ERC20Token>;
  setRewardTokensList(value: Array<sgn_common_v1_common_pb.ERC20Token>): AddPoolInfo;
  clearRewardTokensList(): AddPoolInfo;
  addRewardTokens(value?: sgn_common_v1_common_pb.ERC20Token, index?: number): sgn_common_v1_common_pb.ERC20Token;

  getInitialRewardInputsList(): Array<RewardAdjustmentInput>;
  setInitialRewardInputsList(value: Array<RewardAdjustmentInput>): AddPoolInfo;
  clearInitialRewardInputsList(): AddPoolInfo;
  addInitialRewardInputs(value?: RewardAdjustmentInput, index?: number): RewardAdjustmentInput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddPoolInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AddPoolInfo): AddPoolInfo.AsObject;
  static serializeBinaryToWriter(message: AddPoolInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddPoolInfo;
  static deserializeBinaryFromReader(message: AddPoolInfo, reader: jspb.BinaryReader): AddPoolInfo;
}

export namespace AddPoolInfo {
  export type AsObject = {
    poolName: string,
    stakeToken?: sgn_common_v1_common_pb.ERC20Token.AsObject,
    rewardTokensList: Array<sgn_common_v1_common_pb.ERC20Token.AsObject>,
    initialRewardInputsList: Array<RewardAdjustmentInput.AsObject>,
  }
}

export class AddPoolProposalWithDeposit extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): AddPoolProposalWithDeposit;

  getDescription(): string;
  setDescription(value: string): AddPoolProposalWithDeposit;

  getPoolName(): string;
  setPoolName(value: string): AddPoolProposalWithDeposit;

  getStakeToken(): sgn_common_v1_common_pb.ERC20Token | undefined;
  setStakeToken(value?: sgn_common_v1_common_pb.ERC20Token): AddPoolProposalWithDeposit;
  hasStakeToken(): boolean;
  clearStakeToken(): AddPoolProposalWithDeposit;

  getRewardTokensList(): Array<sgn_common_v1_common_pb.ERC20Token>;
  setRewardTokensList(value: Array<sgn_common_v1_common_pb.ERC20Token>): AddPoolProposalWithDeposit;
  clearRewardTokensList(): AddPoolProposalWithDeposit;
  addRewardTokens(value?: sgn_common_v1_common_pb.ERC20Token, index?: number): sgn_common_v1_common_pb.ERC20Token;

  getInitialRewardInputsList(): Array<RewardAdjustmentInput>;
  setInitialRewardInputsList(value: Array<RewardAdjustmentInput>): AddPoolProposalWithDeposit;
  clearInitialRewardInputsList(): AddPoolProposalWithDeposit;
  addInitialRewardInputs(value?: RewardAdjustmentInput, index?: number): RewardAdjustmentInput;

  getDeposit(): string;
  setDeposit(value: string): AddPoolProposalWithDeposit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddPoolProposalWithDeposit.AsObject;
  static toObject(includeInstance: boolean, msg: AddPoolProposalWithDeposit): AddPoolProposalWithDeposit.AsObject;
  static serializeBinaryToWriter(message: AddPoolProposalWithDeposit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddPoolProposalWithDeposit;
  static deserializeBinaryFromReader(message: AddPoolProposalWithDeposit, reader: jspb.BinaryReader): AddPoolProposalWithDeposit;
}

export namespace AddPoolProposalWithDeposit {
  export type AsObject = {
    title: string,
    description: string,
    poolName: string,
    stakeToken?: sgn_common_v1_common_pb.ERC20Token.AsObject,
    rewardTokensList: Array<sgn_common_v1_common_pb.ERC20Token.AsObject>,
    initialRewardInputsList: Array<RewardAdjustmentInput.AsObject>,
    deposit: string,
  }
}

export class BatchAddPoolProposalWithDeposit extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): BatchAddPoolProposalWithDeposit;

  getDescription(): string;
  setDescription(value: string): BatchAddPoolProposalWithDeposit;

  getAddPoolInfosList(): Array<AddPoolInfo>;
  setAddPoolInfosList(value: Array<AddPoolInfo>): BatchAddPoolProposalWithDeposit;
  clearAddPoolInfosList(): BatchAddPoolProposalWithDeposit;
  addAddPoolInfos(value?: AddPoolInfo, index?: number): AddPoolInfo;

  getDeposit(): string;
  setDeposit(value: string): BatchAddPoolProposalWithDeposit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BatchAddPoolProposalWithDeposit.AsObject;
  static toObject(includeInstance: boolean, msg: BatchAddPoolProposalWithDeposit): BatchAddPoolProposalWithDeposit.AsObject;
  static serializeBinaryToWriter(message: BatchAddPoolProposalWithDeposit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BatchAddPoolProposalWithDeposit;
  static deserializeBinaryFromReader(message: BatchAddPoolProposalWithDeposit, reader: jspb.BinaryReader): BatchAddPoolProposalWithDeposit;
}

export namespace BatchAddPoolProposalWithDeposit {
  export type AsObject = {
    title: string,
    description: string,
    addPoolInfosList: Array<AddPoolInfo.AsObject>,
    deposit: string,
  }
}

export class AdjustRewardProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): AdjustRewardProposal;

  getDescription(): string;
  setDescription(value: string): AdjustRewardProposal;

  getPoolName(): string;
  setPoolName(value: string): AdjustRewardProposal;

  getRewardAdjustmentInputsList(): Array<RewardAdjustmentInput>;
  setRewardAdjustmentInputsList(value: Array<RewardAdjustmentInput>): AdjustRewardProposal;
  clearRewardAdjustmentInputsList(): AdjustRewardProposal;
  addRewardAdjustmentInputs(value?: RewardAdjustmentInput, index?: number): RewardAdjustmentInput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdjustRewardProposal.AsObject;
  static toObject(includeInstance: boolean, msg: AdjustRewardProposal): AdjustRewardProposal.AsObject;
  static serializeBinaryToWriter(message: AdjustRewardProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdjustRewardProposal;
  static deserializeBinaryFromReader(message: AdjustRewardProposal, reader: jspb.BinaryReader): AdjustRewardProposal;
}

export namespace AdjustRewardProposal {
  export type AsObject = {
    title: string,
    description: string,
    poolName: string,
    rewardAdjustmentInputsList: Array<RewardAdjustmentInput.AsObject>,
  }
}

export class BatchAdjustRewardProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): BatchAdjustRewardProposal;

  getDescription(): string;
  setDescription(value: string): BatchAdjustRewardProposal;

  getAdjustRewardInfosList(): Array<AdjustRewardInfo>;
  setAdjustRewardInfosList(value: Array<AdjustRewardInfo>): BatchAdjustRewardProposal;
  clearAdjustRewardInfosList(): BatchAdjustRewardProposal;
  addAdjustRewardInfos(value?: AdjustRewardInfo, index?: number): AdjustRewardInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BatchAdjustRewardProposal.AsObject;
  static toObject(includeInstance: boolean, msg: BatchAdjustRewardProposal): BatchAdjustRewardProposal.AsObject;
  static serializeBinaryToWriter(message: BatchAdjustRewardProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BatchAdjustRewardProposal;
  static deserializeBinaryFromReader(message: BatchAdjustRewardProposal, reader: jspb.BinaryReader): BatchAdjustRewardProposal;
}

export namespace BatchAdjustRewardProposal {
  export type AsObject = {
    title: string,
    description: string,
    adjustRewardInfosList: Array<AdjustRewardInfo.AsObject>,
  }
}

export class AdjustRewardInfo extends jspb.Message {
  getPoolName(): string;
  setPoolName(value: string): AdjustRewardInfo;

  getRewardAdjustmentInputsList(): Array<RewardAdjustmentInput>;
  setRewardAdjustmentInputsList(value: Array<RewardAdjustmentInput>): AdjustRewardInfo;
  clearRewardAdjustmentInputsList(): AdjustRewardInfo;
  addRewardAdjustmentInputs(value?: RewardAdjustmentInput, index?: number): RewardAdjustmentInput;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdjustRewardInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AdjustRewardInfo): AdjustRewardInfo.AsObject;
  static serializeBinaryToWriter(message: AdjustRewardInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdjustRewardInfo;
  static deserializeBinaryFromReader(message: AdjustRewardInfo, reader: jspb.BinaryReader): AdjustRewardInfo;
}

export namespace AdjustRewardInfo {
  export type AsObject = {
    poolName: string,
    rewardAdjustmentInputsList: Array<RewardAdjustmentInput.AsObject>,
  }
}

export class AdjustRewardProposalWithDeposit extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): AdjustRewardProposalWithDeposit;

  getDescription(): string;
  setDescription(value: string): AdjustRewardProposalWithDeposit;

  getPoolName(): string;
  setPoolName(value: string): AdjustRewardProposalWithDeposit;

  getRewardAdjustmentInputsList(): Array<RewardAdjustmentInput>;
  setRewardAdjustmentInputsList(value: Array<RewardAdjustmentInput>): AdjustRewardProposalWithDeposit;
  clearRewardAdjustmentInputsList(): AdjustRewardProposalWithDeposit;
  addRewardAdjustmentInputs(value?: RewardAdjustmentInput, index?: number): RewardAdjustmentInput;

  getDeposit(): string;
  setDeposit(value: string): AdjustRewardProposalWithDeposit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdjustRewardProposalWithDeposit.AsObject;
  static toObject(includeInstance: boolean, msg: AdjustRewardProposalWithDeposit): AdjustRewardProposalWithDeposit.AsObject;
  static serializeBinaryToWriter(message: AdjustRewardProposalWithDeposit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdjustRewardProposalWithDeposit;
  static deserializeBinaryFromReader(message: AdjustRewardProposalWithDeposit, reader: jspb.BinaryReader): AdjustRewardProposalWithDeposit;
}

export namespace AdjustRewardProposalWithDeposit {
  export type AsObject = {
    title: string,
    description: string,
    poolName: string,
    rewardAdjustmentInputsList: Array<RewardAdjustmentInput.AsObject>,
    deposit: string,
  }
}

export class BatchAdjustRewardProposalWithDeposit extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): BatchAdjustRewardProposalWithDeposit;

  getDescription(): string;
  setDescription(value: string): BatchAdjustRewardProposalWithDeposit;

  getAdjustRewardInfosList(): Array<AdjustRewardInfo>;
  setAdjustRewardInfosList(value: Array<AdjustRewardInfo>): BatchAdjustRewardProposalWithDeposit;
  clearAdjustRewardInfosList(): BatchAdjustRewardProposalWithDeposit;
  addAdjustRewardInfos(value?: AdjustRewardInfo, index?: number): AdjustRewardInfo;

  getDeposit(): string;
  setDeposit(value: string): BatchAdjustRewardProposalWithDeposit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BatchAdjustRewardProposalWithDeposit.AsObject;
  static toObject(includeInstance: boolean, msg: BatchAdjustRewardProposalWithDeposit): BatchAdjustRewardProposalWithDeposit.AsObject;
  static serializeBinaryToWriter(message: BatchAdjustRewardProposalWithDeposit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BatchAdjustRewardProposalWithDeposit;
  static deserializeBinaryFromReader(message: BatchAdjustRewardProposalWithDeposit, reader: jspb.BinaryReader): BatchAdjustRewardProposalWithDeposit;
}

export namespace BatchAdjustRewardProposalWithDeposit {
  export type AsObject = {
    title: string,
    description: string,
    adjustRewardInfosList: Array<AdjustRewardInfo.AsObject>,
    deposit: string,
  }
}

export class RemovePoolProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): RemovePoolProposal;

  getDescription(): string;
  setDescription(value: string): RemovePoolProposal;

  getPoolName(): string;
  setPoolName(value: string): RemovePoolProposal;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemovePoolProposal.AsObject;
  static toObject(includeInstance: boolean, msg: RemovePoolProposal): RemovePoolProposal.AsObject;
  static serializeBinaryToWriter(message: RemovePoolProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemovePoolProposal;
  static deserializeBinaryFromReader(message: RemovePoolProposal, reader: jspb.BinaryReader): RemovePoolProposal;
}

export namespace RemovePoolProposal {
  export type AsObject = {
    title: string,
    description: string,
    poolName: string,
  }
}

export class RemovePoolProposalWithDeposit extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): RemovePoolProposalWithDeposit;

  getDescription(): string;
  setDescription(value: string): RemovePoolProposalWithDeposit;

  getPoolName(): string;
  setPoolName(value: string): RemovePoolProposalWithDeposit;

  getDeposit(): string;
  setDeposit(value: string): RemovePoolProposalWithDeposit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemovePoolProposalWithDeposit.AsObject;
  static toObject(includeInstance: boolean, msg: RemovePoolProposalWithDeposit): RemovePoolProposalWithDeposit.AsObject;
  static serializeBinaryToWriter(message: RemovePoolProposalWithDeposit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemovePoolProposalWithDeposit;
  static deserializeBinaryFromReader(message: RemovePoolProposalWithDeposit, reader: jspb.BinaryReader): RemovePoolProposalWithDeposit;
}

export namespace RemovePoolProposalWithDeposit {
  export type AsObject = {
    title: string,
    description: string,
    poolName: string,
    deposit: string,
  }
}

export class AddTokensProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): AddTokensProposal;

  getDescription(): string;
  setDescription(value: string): AddTokensProposal;

  getTokensList(): Array<sgn_common_v1_common_pb.ERC20Token>;
  setTokensList(value: Array<sgn_common_v1_common_pb.ERC20Token>): AddTokensProposal;
  clearTokensList(): AddTokensProposal;
  addTokens(value?: sgn_common_v1_common_pb.ERC20Token, index?: number): sgn_common_v1_common_pb.ERC20Token;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddTokensProposal.AsObject;
  static toObject(includeInstance: boolean, msg: AddTokensProposal): AddTokensProposal.AsObject;
  static serializeBinaryToWriter(message: AddTokensProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddTokensProposal;
  static deserializeBinaryFromReader(message: AddTokensProposal, reader: jspb.BinaryReader): AddTokensProposal;
}

export namespace AddTokensProposal {
  export type AsObject = {
    title: string,
    description: string,
    tokensList: Array<sgn_common_v1_common_pb.ERC20Token.AsObject>,
  }
}

export class AddTokensProposalWithDeposit extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): AddTokensProposalWithDeposit;

  getDescription(): string;
  setDescription(value: string): AddTokensProposalWithDeposit;

  getTokensList(): Array<sgn_common_v1_common_pb.ERC20Token>;
  setTokensList(value: Array<sgn_common_v1_common_pb.ERC20Token>): AddTokensProposalWithDeposit;
  clearTokensList(): AddTokensProposalWithDeposit;
  addTokens(value?: sgn_common_v1_common_pb.ERC20Token, index?: number): sgn_common_v1_common_pb.ERC20Token;

  getDeposit(): string;
  setDeposit(value: string): AddTokensProposalWithDeposit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddTokensProposalWithDeposit.AsObject;
  static toObject(includeInstance: boolean, msg: AddTokensProposalWithDeposit): AddTokensProposalWithDeposit.AsObject;
  static serializeBinaryToWriter(message: AddTokensProposalWithDeposit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddTokensProposalWithDeposit;
  static deserializeBinaryFromReader(message: AddTokensProposalWithDeposit, reader: jspb.BinaryReader): AddTokensProposalWithDeposit;
}

export namespace AddTokensProposalWithDeposit {
  export type AsObject = {
    title: string,
    description: string,
    tokensList: Array<sgn_common_v1_common_pb.ERC20Token.AsObject>,
    deposit: string,
  }
}

export class SetRewardContractsProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): SetRewardContractsProposal;

  getDescription(): string;
  setDescription(value: string): SetRewardContractsProposal;

  getRewardContractsList(): Array<sgn_common_v1_common_pb.ContractInfo>;
  setRewardContractsList(value: Array<sgn_common_v1_common_pb.ContractInfo>): SetRewardContractsProposal;
  clearRewardContractsList(): SetRewardContractsProposal;
  addRewardContracts(value?: sgn_common_v1_common_pb.ContractInfo, index?: number): sgn_common_v1_common_pb.ContractInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetRewardContractsProposal.AsObject;
  static toObject(includeInstance: boolean, msg: SetRewardContractsProposal): SetRewardContractsProposal.AsObject;
  static serializeBinaryToWriter(message: SetRewardContractsProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetRewardContractsProposal;
  static deserializeBinaryFromReader(message: SetRewardContractsProposal, reader: jspb.BinaryReader): SetRewardContractsProposal;
}

export namespace SetRewardContractsProposal {
  export type AsObject = {
    title: string,
    description: string,
    rewardContractsList: Array<sgn_common_v1_common_pb.ContractInfo.AsObject>,
  }
}

export class SetRewardContractsProposalWithDeposit extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): SetRewardContractsProposalWithDeposit;

  getDescription(): string;
  setDescription(value: string): SetRewardContractsProposalWithDeposit;

  getRewardContractsList(): Array<sgn_common_v1_common_pb.ContractInfo>;
  setRewardContractsList(value: Array<sgn_common_v1_common_pb.ContractInfo>): SetRewardContractsProposalWithDeposit;
  clearRewardContractsList(): SetRewardContractsProposalWithDeposit;
  addRewardContracts(value?: sgn_common_v1_common_pb.ContractInfo, index?: number): sgn_common_v1_common_pb.ContractInfo;

  getDeposit(): string;
  setDeposit(value: string): SetRewardContractsProposalWithDeposit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetRewardContractsProposalWithDeposit.AsObject;
  static toObject(includeInstance: boolean, msg: SetRewardContractsProposalWithDeposit): SetRewardContractsProposalWithDeposit.AsObject;
  static serializeBinaryToWriter(message: SetRewardContractsProposalWithDeposit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetRewardContractsProposalWithDeposit;
  static deserializeBinaryFromReader(message: SetRewardContractsProposalWithDeposit, reader: jspb.BinaryReader): SetRewardContractsProposalWithDeposit;
}

export namespace SetRewardContractsProposalWithDeposit {
  export type AsObject = {
    title: string,
    description: string,
    rewardContractsList: Array<sgn_common_v1_common_pb.ContractInfo.AsObject>,
    deposit: string,
  }
}

