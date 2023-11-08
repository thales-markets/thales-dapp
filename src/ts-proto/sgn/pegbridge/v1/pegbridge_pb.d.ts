import * as jspb from 'google-protobuf'

import * as cosmos_proto_cosmos_pb from '../../../cosmos_proto/cosmos_pb';
import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_protobuf_duration_pb from 'google-protobuf/google/protobuf/duration_pb';
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

export class PegConfig extends jspb.Message {
  getPeggedTokenBridgesList(): Array<sgn_common_v1_common_pb.ContractInfo>;
  setPeggedTokenBridgesList(value: Array<sgn_common_v1_common_pb.ContractInfo>): PegConfig;
  clearPeggedTokenBridgesList(): PegConfig;
  addPeggedTokenBridges(value?: sgn_common_v1_common_pb.ContractInfo, index?: number): sgn_common_v1_common_pb.ContractInfo;

  getOriginalTokenVaultsList(): Array<sgn_common_v1_common_pb.ContractInfo>;
  setOriginalTokenVaultsList(value: Array<sgn_common_v1_common_pb.ContractInfo>): PegConfig;
  clearOriginalTokenVaultsList(): PegConfig;
  addOriginalTokenVaults(value?: sgn_common_v1_common_pb.ContractInfo, index?: number): sgn_common_v1_common_pb.ContractInfo;

  getOrigPeggedPairsList(): Array<OrigPeggedPair>;
  setOrigPeggedPairsList(value: Array<OrigPeggedPair>): PegConfig;
  clearOrigPeggedPairsList(): PegConfig;
  addOrigPeggedPairs(value?: OrigPeggedPair, index?: number): OrigPeggedPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PegConfig.AsObject;
  static toObject(includeInstance: boolean, msg: PegConfig): PegConfig.AsObject;
  static serializeBinaryToWriter(message: PegConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PegConfig;
  static deserializeBinaryFromReader(message: PegConfig, reader: jspb.BinaryReader): PegConfig;
}

export namespace PegConfig {
  export type AsObject = {
    peggedTokenBridgesList: Array<sgn_common_v1_common_pb.ContractInfo.AsObject>,
    originalTokenVaultsList: Array<sgn_common_v1_common_pb.ContractInfo.AsObject>,
    origPeggedPairsList: Array<OrigPeggedPair.AsObject>,
  }
}

export class OrigPeggedPair extends jspb.Message {
  getOrig(): sgn_common_v1_common_pb.ERC20Token | undefined;
  setOrig(value?: sgn_common_v1_common_pb.ERC20Token): OrigPeggedPair;
  hasOrig(): boolean;
  clearOrig(): OrigPeggedPair;

  getPegged(): sgn_common_v1_common_pb.ERC20Token | undefined;
  setPegged(value?: sgn_common_v1_common_pb.ERC20Token): OrigPeggedPair;
  hasPegged(): boolean;
  clearPegged(): OrigPeggedPair;

  getMintFeePips(): number;
  setMintFeePips(value: number): OrigPeggedPair;

  getMaxMintFee(): string;
  setMaxMintFee(value: string): OrigPeggedPair;

  getBurnFeePips(): number;
  setBurnFeePips(value: number): OrigPeggedPair;

  getMaxBurnFee(): string;
  setMaxBurnFee(value: string): OrigPeggedPair;

  getSupplyCap(): string;
  setSupplyCap(value: string): OrigPeggedPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OrigPeggedPair.AsObject;
  static toObject(includeInstance: boolean, msg: OrigPeggedPair): OrigPeggedPair.AsObject;
  static serializeBinaryToWriter(message: OrigPeggedPair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OrigPeggedPair;
  static deserializeBinaryFromReader(message: OrigPeggedPair, reader: jspb.BinaryReader): OrigPeggedPair;
}

export namespace OrigPeggedPair {
  export type AsObject = {
    orig?: sgn_common_v1_common_pb.ERC20Token.AsObject,
    pegged?: sgn_common_v1_common_pb.ERC20Token.AsObject,
    mintFeePips: number,
    maxMintFee: string,
    burnFeePips: number,
    maxBurnFee: string,
    supplyCap: string,
  }
}

export class PeggedOrigIndex extends jspb.Message {
  getPegged(): sgn_common_v1_common_pb.ContractInfo | undefined;
  setPegged(value?: sgn_common_v1_common_pb.ContractInfo): PeggedOrigIndex;
  hasPegged(): boolean;
  clearPegged(): PeggedOrigIndex;

  getOrig(): sgn_common_v1_common_pb.ContractInfo | undefined;
  setOrig(value?: sgn_common_v1_common_pb.ContractInfo): PeggedOrigIndex;
  hasOrig(): boolean;
  clearOrig(): PeggedOrigIndex;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PeggedOrigIndex.AsObject;
  static toObject(includeInstance: boolean, msg: PeggedOrigIndex): PeggedOrigIndex.AsObject;
  static serializeBinaryToWriter(message: PeggedOrigIndex, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PeggedOrigIndex;
  static deserializeBinaryFromReader(message: PeggedOrigIndex, reader: jspb.BinaryReader): PeggedOrigIndex;
}

export namespace PeggedOrigIndex {
  export type AsObject = {
    pegged?: sgn_common_v1_common_pb.ContractInfo.AsObject,
    orig?: sgn_common_v1_common_pb.ContractInfo.AsObject,
  }
}

export class DepositInfo extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): DepositInfo;

  getDepositId(): Uint8Array | string;
  getDepositId_asU8(): Uint8Array;
  getDepositId_asB64(): string;
  setDepositId(value: Uint8Array | string): DepositInfo;

  getMintId(): Uint8Array | string;
  getMintId_asU8(): Uint8Array;
  getMintId_asB64(): string;
  setMintId(value: Uint8Array | string): DepositInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DepositInfo.AsObject;
  static toObject(includeInstance: boolean, msg: DepositInfo): DepositInfo.AsObject;
  static serializeBinaryToWriter(message: DepositInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DepositInfo;
  static deserializeBinaryFromReader(message: DepositInfo, reader: jspb.BinaryReader): DepositInfo;
}

export namespace DepositInfo {
  export type AsObject = {
    chainId: number,
    depositId: Uint8Array | string,
    mintId: Uint8Array | string,
  }
}

export class MintInfo extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): MintInfo;

  getMintProtoBytes(): Uint8Array | string;
  getMintProtoBytes_asU8(): Uint8Array;
  getMintProtoBytes_asB64(): string;
  setMintProtoBytes(value: Uint8Array | string): MintInfo;

  getSignaturesList(): Array<sgn_common_v1_common_pb.Signature>;
  setSignaturesList(value: Array<sgn_common_v1_common_pb.Signature>): MintInfo;
  clearSignaturesList(): MintInfo;
  addSignatures(value?: sgn_common_v1_common_pb.Signature, index?: number): sgn_common_v1_common_pb.Signature;

  getBaseFee(): string;
  setBaseFee(value: string): MintInfo;

  getPercentageFee(): string;
  setPercentageFee(value: string): MintInfo;

  getSuccess(): boolean;
  setSuccess(value: boolean): MintInfo;

  getLastReqTime(): number;
  setLastReqTime(value: number): MintInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MintInfo.AsObject;
  static toObject(includeInstance: boolean, msg: MintInfo): MintInfo.AsObject;
  static serializeBinaryToWriter(message: MintInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MintInfo;
  static deserializeBinaryFromReader(message: MintInfo, reader: jspb.BinaryReader): MintInfo;
}

export namespace MintInfo {
  export type AsObject = {
    chainId: number,
    mintProtoBytes: Uint8Array | string,
    signaturesList: Array<sgn_common_v1_common_pb.Signature.AsObject>,
    baseFee: string,
    percentageFee: string,
    success: boolean,
    lastReqTime: number,
  }
}

export class BurnInfo extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): BurnInfo;

  getBurnId(): Uint8Array | string;
  getBurnId_asU8(): Uint8Array;
  getBurnId_asB64(): string;
  setBurnId(value: Uint8Array | string): BurnInfo;

  getWithdrawId(): Uint8Array | string;
  getWithdrawId_asU8(): Uint8Array;
  getWithdrawId_asB64(): string;
  setWithdrawId(value: Uint8Array | string): BurnInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BurnInfo.AsObject;
  static toObject(includeInstance: boolean, msg: BurnInfo): BurnInfo.AsObject;
  static serializeBinaryToWriter(message: BurnInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BurnInfo;
  static deserializeBinaryFromReader(message: BurnInfo, reader: jspb.BinaryReader): BurnInfo;
}

export namespace BurnInfo {
  export type AsObject = {
    chainId: number,
    burnId: Uint8Array | string,
    withdrawId: Uint8Array | string,
  }
}

export class WithdrawInfo extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): WithdrawInfo;

  getWithdrawProtoBytes(): Uint8Array | string;
  getWithdrawProtoBytes_asU8(): Uint8Array;
  getWithdrawProtoBytes_asB64(): string;
  setWithdrawProtoBytes(value: Uint8Array | string): WithdrawInfo;

  getSignaturesList(): Array<sgn_common_v1_common_pb.Signature>;
  setSignaturesList(value: Array<sgn_common_v1_common_pb.Signature>): WithdrawInfo;
  clearSignaturesList(): WithdrawInfo;
  addSignatures(value?: sgn_common_v1_common_pb.Signature, index?: number): sgn_common_v1_common_pb.Signature;

  getBaseFee(): string;
  setBaseFee(value: string): WithdrawInfo;

  getPercentageFee(): string;
  setPercentageFee(value: string): WithdrawInfo;

  getSuccess(): boolean;
  setSuccess(value: boolean): WithdrawInfo;

  getLastReqTime(): number;
  setLastReqTime(value: number): WithdrawInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawInfo.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawInfo): WithdrawInfo.AsObject;
  static serializeBinaryToWriter(message: WithdrawInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawInfo;
  static deserializeBinaryFromReader(message: WithdrawInfo, reader: jspb.BinaryReader): WithdrawInfo;
}

export namespace WithdrawInfo {
  export type AsObject = {
    chainId: number,
    withdrawProtoBytes: Uint8Array | string,
    signaturesList: Array<sgn_common_v1_common_pb.Signature.AsObject>,
    baseFee: string,
    percentageFee: string,
    success: boolean,
    lastReqTime: number,
  }
}

export class FeeClaimInfo extends jspb.Message {
  getWithdrawId(): Uint8Array | string;
  getWithdrawId_asU8(): Uint8Array;
  getWithdrawId_asB64(): string;
  setWithdrawId(value: Uint8Array | string): FeeClaimInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeClaimInfo.AsObject;
  static toObject(includeInstance: boolean, msg: FeeClaimInfo): FeeClaimInfo.AsObject;
  static serializeBinaryToWriter(message: FeeClaimInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeClaimInfo;
  static deserializeBinaryFromReader(message: FeeClaimInfo, reader: jspb.BinaryReader): FeeClaimInfo;
}

export namespace FeeClaimInfo {
  export type AsObject = {
    withdrawId: Uint8Array | string,
  }
}

export class MintOnChain extends jspb.Message {
  getToken(): Uint8Array | string;
  getToken_asU8(): Uint8Array;
  getToken_asB64(): string;
  setToken(value: Uint8Array | string): MintOnChain;

  getAccount(): Uint8Array | string;
  getAccount_asU8(): Uint8Array;
  getAccount_asB64(): string;
  setAccount(value: Uint8Array | string): MintOnChain;

  getAmount(): Uint8Array | string;
  getAmount_asU8(): Uint8Array;
  getAmount_asB64(): string;
  setAmount(value: Uint8Array | string): MintOnChain;

  getDepositor(): Uint8Array | string;
  getDepositor_asU8(): Uint8Array;
  getDepositor_asB64(): string;
  setDepositor(value: Uint8Array | string): MintOnChain;

  getRefChainId(): number;
  setRefChainId(value: number): MintOnChain;

  getRefId(): Uint8Array | string;
  getRefId_asU8(): Uint8Array;
  getRefId_asB64(): string;
  setRefId(value: Uint8Array | string): MintOnChain;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MintOnChain.AsObject;
  static toObject(includeInstance: boolean, msg: MintOnChain): MintOnChain.AsObject;
  static serializeBinaryToWriter(message: MintOnChain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MintOnChain;
  static deserializeBinaryFromReader(message: MintOnChain, reader: jspb.BinaryReader): MintOnChain;
}

export namespace MintOnChain {
  export type AsObject = {
    token: Uint8Array | string,
    account: Uint8Array | string,
    amount: Uint8Array | string,
    depositor: Uint8Array | string,
    refChainId: number,
    refId: Uint8Array | string,
  }
}

export class WithdrawOnChain extends jspb.Message {
  getToken(): Uint8Array | string;
  getToken_asU8(): Uint8Array;
  getToken_asB64(): string;
  setToken(value: Uint8Array | string): WithdrawOnChain;

  getReceiver(): Uint8Array | string;
  getReceiver_asU8(): Uint8Array;
  getReceiver_asB64(): string;
  setReceiver(value: Uint8Array | string): WithdrawOnChain;

  getAmount(): Uint8Array | string;
  getAmount_asU8(): Uint8Array;
  getAmount_asB64(): string;
  setAmount(value: Uint8Array | string): WithdrawOnChain;

  getBurnAccount(): Uint8Array | string;
  getBurnAccount_asU8(): Uint8Array;
  getBurnAccount_asB64(): string;
  setBurnAccount(value: Uint8Array | string): WithdrawOnChain;

  getRefChainId(): number;
  setRefChainId(value: number): WithdrawOnChain;

  getRefId(): Uint8Array | string;
  getRefId_asU8(): Uint8Array;
  getRefId_asB64(): string;
  setRefId(value: Uint8Array | string): WithdrawOnChain;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawOnChain.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawOnChain): WithdrawOnChain.AsObject;
  static serializeBinaryToWriter(message: WithdrawOnChain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawOnChain;
  static deserializeBinaryFromReader(message: WithdrawOnChain, reader: jspb.BinaryReader): WithdrawOnChain;
}

export namespace WithdrawOnChain {
  export type AsObject = {
    token: Uint8Array | string,
    receiver: Uint8Array | string,
    amount: Uint8Array | string,
    burnAccount: Uint8Array | string,
    refChainId: number,
    refId: Uint8Array | string,
  }
}

export class PegProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): PegProposal;

  getDescription(): string;
  setDescription(value: string): PegProposal;

  getPegConfig(): PegConfig | undefined;
  setPegConfig(value?: PegConfig): PegProposal;
  hasPegConfig(): boolean;
  clearPegConfig(): PegProposal;

  getDeposit(): string;
  setDeposit(value: string): PegProposal;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PegProposal.AsObject;
  static toObject(includeInstance: boolean, msg: PegProposal): PegProposal.AsObject;
  static serializeBinaryToWriter(message: PegProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PegProposal;
  static deserializeBinaryFromReader(message: PegProposal, reader: jspb.BinaryReader): PegProposal;
}

export namespace PegProposal {
  export type AsObject = {
    title: string,
    description: string,
    pegConfig?: PegConfig.AsObject,
    deposit: string,
  }
}

export class PairDeleteProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): PairDeleteProposal;

  getDescription(): string;
  setDescription(value: string): PairDeleteProposal;

  getPairToDelete(): OrigPeggedPair | undefined;
  setPairToDelete(value?: OrigPeggedPair): PairDeleteProposal;
  hasPairToDelete(): boolean;
  clearPairToDelete(): PairDeleteProposal;

  getDeposit(): string;
  setDeposit(value: string): PairDeleteProposal;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PairDeleteProposal.AsObject;
  static toObject(includeInstance: boolean, msg: PairDeleteProposal): PairDeleteProposal.AsObject;
  static serializeBinaryToWriter(message: PairDeleteProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PairDeleteProposal;
  static deserializeBinaryFromReader(message: PairDeleteProposal, reader: jspb.BinaryReader): PairDeleteProposal;
}

export namespace PairDeleteProposal {
  export type AsObject = {
    title: string,
    description: string,
    pairToDelete?: OrigPeggedPair.AsObject,
    deposit: string,
  }
}

export class TotalSupplyUpdateProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): TotalSupplyUpdateProposal;

  getDescription(): string;
  setDescription(value: string): TotalSupplyUpdateProposal;

  getPair(): OrigPeggedPair | undefined;
  setPair(value?: OrigPeggedPair): TotalSupplyUpdateProposal;
  hasPair(): boolean;
  clearPair(): TotalSupplyUpdateProposal;

  getTotalSupply(): string;
  setTotalSupply(value: string): TotalSupplyUpdateProposal;

  getDeposit(): string;
  setDeposit(value: string): TotalSupplyUpdateProposal;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TotalSupplyUpdateProposal.AsObject;
  static toObject(includeInstance: boolean, msg: TotalSupplyUpdateProposal): TotalSupplyUpdateProposal.AsObject;
  static serializeBinaryToWriter(message: TotalSupplyUpdateProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TotalSupplyUpdateProposal;
  static deserializeBinaryFromReader(message: TotalSupplyUpdateProposal, reader: jspb.BinaryReader): TotalSupplyUpdateProposal;
}

export namespace TotalSupplyUpdateProposal {
  export type AsObject = {
    title: string,
    description: string,
    pair?: OrigPeggedPair.AsObject,
    totalSupply: string,
    deposit: string,
  }
}

