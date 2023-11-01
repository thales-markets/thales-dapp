import * as jspb from 'google-protobuf'

import * as cosmos_proto_cosmos_pb from '../../../cosmos_proto/cosmos_pb';
import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as google_protobuf_duration_pb from 'google-protobuf/google/protobuf/duration_pb';
import * as sgn_common_v1_common_pb from '../../../sgn/common/v1/common_pb';


export class Params extends jspb.Message {
  getSignerUpdateDuration(): google_protobuf_duration_pb.Duration | undefined;
  setSignerUpdateDuration(value?: google_protobuf_duration_pb.Duration): Params;
  hasSignerUpdateDuration(): boolean;
  clearSignerUpdateDuration(): Params;

  getSignAgainCoolDownDuration(): google_protobuf_duration_pb.Duration | undefined;
  setSignAgainCoolDownDuration(value?: google_protobuf_duration_pb.Duration): Params;
  hasSignAgainCoolDownDuration(): boolean;
  clearSignAgainCoolDownDuration(): Params;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Params.AsObject;
  static toObject(includeInstance: boolean, msg: Params): Params.AsObject;
  static serializeBinaryToWriter(message: Params, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Params;
  static deserializeBinaryFromReader(message: Params, reader: jspb.BinaryReader): Params;
}

export namespace Params {
  export type AsObject = {
    signerUpdateDuration?: google_protobuf_duration_pb.Duration.AsObject,
    signAgainCoolDownDuration?: google_protobuf_duration_pb.Duration.AsObject,
  }
}

export class CbrConfig extends jspb.Message {
  getLpFeePerc(): number;
  setLpFeePerc(value: number): CbrConfig;

  getPickLpSize(): number;
  setPickLpSize(value: number): CbrConfig;

  getRelayGasCostList(): Array<RelayGasCostParam>;
  setRelayGasCostList(value: Array<RelayGasCostParam>): CbrConfig;
  clearRelayGasCostList(): CbrConfig;
  addRelayGasCost(value?: RelayGasCostParam, index?: number): RelayGasCostParam;

  getAssetsList(): Array<ChainAsset>;
  setAssetsList(value: Array<ChainAsset>): CbrConfig;
  clearAssetsList(): CbrConfig;
  addAssets(value?: ChainAsset, index?: number): ChainAsset;

  getChainPairsList(): Array<ChainPair>;
  setChainPairsList(value: Array<ChainPair>): CbrConfig;
  clearChainPairsList(): CbrConfig;
  addChainPairs(value?: ChainPair, index?: number): ChainPair;

  getCbrContractsList(): Array<sgn_common_v1_common_pb.ContractInfo>;
  setCbrContractsList(value: Array<sgn_common_v1_common_pb.ContractInfo>): CbrConfig;
  clearCbrContractsList(): CbrConfig;
  addCbrContracts(value?: sgn_common_v1_common_pb.ContractInfo, index?: number): sgn_common_v1_common_pb.ContractInfo;

  getOverrideList(): Array<PerChainPairAssetOverride>;
  setOverrideList(value: Array<PerChainPairAssetOverride>): CbrConfig;
  clearOverrideList(): CbrConfig;
  addOverride(value?: PerChainPairAssetOverride, index?: number): PerChainPairAssetOverride;

  getMaxGainPerc(): number;
  setMaxGainPerc(value: number): CbrConfig;

  getUpdateGasCost(): boolean;
  setUpdateGasCost(value: boolean): CbrConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CbrConfig.AsObject;
  static toObject(includeInstance: boolean, msg: CbrConfig): CbrConfig.AsObject;
  static serializeBinaryToWriter(message: CbrConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CbrConfig;
  static deserializeBinaryFromReader(message: CbrConfig, reader: jspb.BinaryReader): CbrConfig;
}

export namespace CbrConfig {
  export type AsObject = {
    lpFeePerc: number,
    pickLpSize: number,
    relayGasCostList: Array<RelayGasCostParam.AsObject>,
    assetsList: Array<ChainAsset.AsObject>,
    chainPairsList: Array<ChainPair.AsObject>,
    cbrContractsList: Array<sgn_common_v1_common_pb.ContractInfo.AsObject>,
    overrideList: Array<PerChainPairAssetOverride.AsObject>,
    maxGainPerc: number,
    updateGasCost: boolean,
  }
}

export class CbrPrice extends jspb.Message {
  getUpdateEpoch(): number;
  setUpdateEpoch(value: number): CbrPrice;

  getAssetPriceList(): Array<AssetPrice>;
  setAssetPriceList(value: Array<AssetPrice>): CbrPrice;
  clearAssetPriceList(): CbrPrice;
  addAssetPrice(value?: AssetPrice, index?: number): AssetPrice;

  getGasPriceList(): Array<GasPrice>;
  setGasPriceList(value: Array<GasPrice>): CbrPrice;
  clearGasPriceList(): CbrPrice;
  addGasPrice(value?: GasPrice, index?: number): GasPrice;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CbrPrice.AsObject;
  static toObject(includeInstance: boolean, msg: CbrPrice): CbrPrice.AsObject;
  static serializeBinaryToWriter(message: CbrPrice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CbrPrice;
  static deserializeBinaryFromReader(message: CbrPrice, reader: jspb.BinaryReader): CbrPrice;
}

export namespace CbrPrice {
  export type AsObject = {
    updateEpoch: number,
    assetPriceList: Array<AssetPrice.AsObject>,
    gasPriceList: Array<GasPrice.AsObject>,
  }
}

export class RelayGasCostParam extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): RelayGasCostParam;

  getCostBase(): number;
  setCostBase(value: number): RelayGasCostParam;

  getPerValidator(): number;
  setPerValidator(value: number): RelayGasCostParam;

  getPerSig(): number;
  setPerSig(value: number): RelayGasCostParam;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelayGasCostParam.AsObject;
  static toObject(includeInstance: boolean, msg: RelayGasCostParam): RelayGasCostParam.AsObject;
  static serializeBinaryToWriter(message: RelayGasCostParam, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RelayGasCostParam;
  static deserializeBinaryFromReader(message: RelayGasCostParam, reader: jspb.BinaryReader): RelayGasCostParam;
}

export namespace RelayGasCostParam {
  export type AsObject = {
    chainId: number,
    costBase: number,
    perValidator: number,
    perSig: number,
  }
}

export class AssetPrice extends jspb.Message {
  getSymbol(): string;
  setSymbol(value: string): AssetPrice;

  getChainIdsList(): Array<number>;
  setChainIdsList(value: Array<number>): AssetPrice;
  clearChainIdsList(): AssetPrice;
  addChainIds(value: number, index?: number): AssetPrice;

  getPrice(): number;
  setPrice(value: number): AssetPrice;

  getExtraPower10(): number;
  setExtraPower10(value: number): AssetPrice;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AssetPrice.AsObject;
  static toObject(includeInstance: boolean, msg: AssetPrice): AssetPrice.AsObject;
  static serializeBinaryToWriter(message: AssetPrice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AssetPrice;
  static deserializeBinaryFromReader(message: AssetPrice, reader: jspb.BinaryReader): AssetPrice;
}

export namespace AssetPrice {
  export type AsObject = {
    symbol: string,
    chainIdsList: Array<number>,
    price: number,
    extraPower10: number,
  }
}

export class GasPrice extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): GasPrice;

  getPrice(): string;
  setPrice(value: string): GasPrice;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GasPrice.AsObject;
  static toObject(includeInstance: boolean, msg: GasPrice): GasPrice.AsObject;
  static serializeBinaryToWriter(message: GasPrice, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GasPrice;
  static deserializeBinaryFromReader(message: GasPrice, reader: jspb.BinaryReader): GasPrice;
}

export namespace GasPrice {
  export type AsObject = {
    chainId: number,
    price: string,
  }
}

export class ChainAsset extends jspb.Message {
  getSymbol(): string;
  setSymbol(value: string): ChainAsset;

  getChainId(): number;
  setChainId(value: number): ChainAsset;

  getAddr(): string;
  setAddr(value: string): ChainAsset;

  getDecimal(): number;
  setDecimal(value: number): ChainAsset;

  getMaxFeeAmount(): string;
  setMaxFeeAmount(value: string): ChainAsset;

  getXferDisabled(): boolean;
  setXferDisabled(value: boolean): ChainAsset;

  getMaxOutAmt(): string;
  setMaxOutAmt(value: string): ChainAsset;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainAsset.AsObject;
  static toObject(includeInstance: boolean, msg: ChainAsset): ChainAsset.AsObject;
  static serializeBinaryToWriter(message: ChainAsset, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainAsset;
  static deserializeBinaryFromReader(message: ChainAsset, reader: jspb.BinaryReader): ChainAsset;
}

export namespace ChainAsset {
  export type AsObject = {
    symbol: string,
    chainId: number,
    addr: string,
    decimal: number,
    maxFeeAmount: string,
    xferDisabled: boolean,
    maxOutAmt: string,
  }
}

export class ChainPair extends jspb.Message {
  getChid1(): number;
  setChid1(value: number): ChainPair;

  getChid2(): number;
  setChid2(value: number): ChainPair;

  getWeight1(): number;
  setWeight1(value: number): ChainPair;

  getFee1to2(): number;
  setFee1to2(value: number): ChainPair;

  getFee2to1(): number;
  setFee2to1(value: number): ChainPair;

  getConstA(): number;
  setConstA(value: number): ChainPair;

  getNoCurve(): boolean;
  setNoCurve(value: boolean): ChainPair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainPair.AsObject;
  static toObject(includeInstance: boolean, msg: ChainPair): ChainPair.AsObject;
  static serializeBinaryToWriter(message: ChainPair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainPair;
  static deserializeBinaryFromReader(message: ChainPair, reader: jspb.BinaryReader): ChainPair;
}

export namespace ChainPair {
  export type AsObject = {
    chid1: number,
    chid2: number,
    weight1: number,
    fee1to2: number,
    fee2to1: number,
    constA: number,
    noCurve: boolean,
  }
}

export class PerChainPairAssetOverride extends jspb.Message {
  getSymbol(): string;
  setSymbol(value: string): PerChainPairAssetOverride;

  getChpair(): ChainPair | undefined;
  setChpair(value?: ChainPair): PerChainPairAssetOverride;
  hasChpair(): boolean;
  clearChpair(): PerChainPairAssetOverride;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PerChainPairAssetOverride.AsObject;
  static toObject(includeInstance: boolean, msg: PerChainPairAssetOverride): PerChainPairAssetOverride.AsObject;
  static serializeBinaryToWriter(message: PerChainPairAssetOverride, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PerChainPairAssetOverride;
  static deserializeBinaryFromReader(message: PerChainPairAssetOverride, reader: jspb.BinaryReader): PerChainPairAssetOverride;
}

export namespace PerChainPairAssetOverride {
  export type AsObject = {
    symbol: string,
    chpair?: ChainPair.AsObject,
  }
}

export class CbrProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): CbrProposal;

  getDescription(): string;
  setDescription(value: string): CbrProposal;

  getCbrConfig(): CbrConfig | undefined;
  setCbrConfig(value?: CbrConfig): CbrProposal;
  hasCbrConfig(): boolean;
  clearCbrConfig(): CbrProposal;

  getDeposit(): string;
  setDeposit(value: string): CbrProposal;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CbrProposal.AsObject;
  static toObject(includeInstance: boolean, msg: CbrProposal): CbrProposal.AsObject;
  static serializeBinaryToWriter(message: CbrProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CbrProposal;
  static deserializeBinaryFromReader(message: CbrProposal, reader: jspb.BinaryReader): CbrProposal;
}

export namespace CbrProposal {
  export type AsObject = {
    title: string,
    description: string,
    cbrConfig?: CbrConfig.AsObject,
    deposit: string,
  }
}

export class OnChainEvent extends jspb.Message {
  getChainid(): number;
  setChainid(value: number): OnChainEvent;

  getEvtype(): string;
  setEvtype(value: string): OnChainEvent;

  getElog(): Uint8Array | string;
  getElog_asU8(): Uint8Array;
  getElog_asB64(): string;
  setElog(value: Uint8Array | string): OnChainEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OnChainEvent.AsObject;
  static toObject(includeInstance: boolean, msg: OnChainEvent): OnChainEvent.AsObject;
  static serializeBinaryToWriter(message: OnChainEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OnChainEvent;
  static deserializeBinaryFromReader(message: OnChainEvent, reader: jspb.BinaryReader): OnChainEvent;
}

export namespace OnChainEvent {
  export type AsObject = {
    chainid: number,
    evtype: string,
    elog: Uint8Array | string,
  }
}

export class RelayOnChain extends jspb.Message {
  getSender(): Uint8Array | string;
  getSender_asU8(): Uint8Array;
  getSender_asB64(): string;
  setSender(value: Uint8Array | string): RelayOnChain;

  getReceiver(): Uint8Array | string;
  getReceiver_asU8(): Uint8Array;
  getReceiver_asB64(): string;
  setReceiver(value: Uint8Array | string): RelayOnChain;

  getToken(): Uint8Array | string;
  getToken_asU8(): Uint8Array;
  getToken_asB64(): string;
  setToken(value: Uint8Array | string): RelayOnChain;

  getAmount(): Uint8Array | string;
  getAmount_asU8(): Uint8Array;
  getAmount_asB64(): string;
  setAmount(value: Uint8Array | string): RelayOnChain;

  getSrcChainId(): number;
  setSrcChainId(value: number): RelayOnChain;

  getDstChainId(): number;
  setDstChainId(value: number): RelayOnChain;

  getSrcTransferId(): Uint8Array | string;
  getSrcTransferId_asU8(): Uint8Array;
  getSrcTransferId_asB64(): string;
  setSrcTransferId(value: Uint8Array | string): RelayOnChain;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RelayOnChain.AsObject;
  static toObject(includeInstance: boolean, msg: RelayOnChain): RelayOnChain.AsObject;
  static serializeBinaryToWriter(message: RelayOnChain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RelayOnChain;
  static deserializeBinaryFromReader(message: RelayOnChain, reader: jspb.BinaryReader): RelayOnChain;
}

export namespace RelayOnChain {
  export type AsObject = {
    sender: Uint8Array | string,
    receiver: Uint8Array | string,
    token: Uint8Array | string,
    amount: Uint8Array | string,
    srcChainId: number,
    dstChainId: number,
    srcTransferId: Uint8Array | string,
  }
}

export class WithdrawOnchain extends jspb.Message {
  getChainid(): number;
  setChainid(value: number): WithdrawOnchain;

  getSeqnum(): number;
  setSeqnum(value: number): WithdrawOnchain;

  getReceiver(): Uint8Array | string;
  getReceiver_asU8(): Uint8Array;
  getReceiver_asB64(): string;
  setReceiver(value: Uint8Array | string): WithdrawOnchain;

  getToken(): Uint8Array | string;
  getToken_asU8(): Uint8Array;
  getToken_asB64(): string;
  setToken(value: Uint8Array | string): WithdrawOnchain;

  getAmount(): Uint8Array | string;
  getAmount_asU8(): Uint8Array;
  getAmount_asB64(): string;
  setAmount(value: Uint8Array | string): WithdrawOnchain;

  getRefid(): Uint8Array | string;
  getRefid_asU8(): Uint8Array;
  getRefid_asB64(): string;
  setRefid(value: Uint8Array | string): WithdrawOnchain;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawOnchain.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawOnchain): WithdrawOnchain.AsObject;
  static serializeBinaryToWriter(message: WithdrawOnchain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawOnchain;
  static deserializeBinaryFromReader(message: WithdrawOnchain, reader: jspb.BinaryReader): WithdrawOnchain;
}

export namespace WithdrawOnchain {
  export type AsObject = {
    chainid: number,
    seqnum: number,
    receiver: Uint8Array | string,
    token: Uint8Array | string,
    amount: Uint8Array | string,
    refid: Uint8Array | string,
  }
}

export class XferRelay extends jspb.Message {
  getRelay(): Uint8Array | string;
  getRelay_asU8(): Uint8Array;
  getRelay_asB64(): string;
  setRelay(value: Uint8Array | string): XferRelay;

  getSortedSigsList(): Array<AddrSig>;
  setSortedSigsList(value: Array<AddrSig>): XferRelay;
  clearSortedSigsList(): XferRelay;
  addSortedSigs(value?: AddrSig, index?: number): AddrSig;

  getLastReqTime(): number;
  setLastReqTime(value: number): XferRelay;

  getPercFee(): Uint8Array | string;
  getPercFee_asU8(): Uint8Array;
  getPercFee_asB64(): string;
  setPercFee(value: Uint8Array | string): XferRelay;

  getBaseFee(): Uint8Array | string;
  getBaseFee_asU8(): Uint8Array;
  getBaseFee_asB64(): string;
  setBaseFee(value: Uint8Array | string): XferRelay;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): XferRelay.AsObject;
  static toObject(includeInstance: boolean, msg: XferRelay): XferRelay.AsObject;
  static serializeBinaryToWriter(message: XferRelay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): XferRelay;
  static deserializeBinaryFromReader(message: XferRelay, reader: jspb.BinaryReader): XferRelay;
}

export namespace XferRelay {
  export type AsObject = {
    relay: Uint8Array | string,
    sortedSigsList: Array<AddrSig.AsObject>,
    lastReqTime: number,
    percFee: Uint8Array | string,
    baseFee: Uint8Array | string,
  }
}

export class WithdrawDetail extends jspb.Message {
  getWdOnchain(): Uint8Array | string;
  getWdOnchain_asU8(): Uint8Array;
  getWdOnchain_asB64(): string;
  setWdOnchain(value: Uint8Array | string): WithdrawDetail;

  getSortedSigsList(): Array<AddrSig>;
  setSortedSigsList(value: Array<AddrSig>): WithdrawDetail;
  clearSortedSigsList(): WithdrawDetail;
  addSortedSigs(value?: AddrSig, index?: number): AddrSig;

  getCompleted(): boolean;
  setCompleted(value: boolean): WithdrawDetail;

  getLastReqTime(): number;
  setLastReqTime(value: number): WithdrawDetail;

  getXferid(): Uint8Array | string;
  getXferid_asU8(): Uint8Array;
  getXferid_asB64(): string;
  setXferid(value: Uint8Array | string): WithdrawDetail;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WithdrawDetail.AsObject;
  static toObject(includeInstance: boolean, msg: WithdrawDetail): WithdrawDetail.AsObject;
  static serializeBinaryToWriter(message: WithdrawDetail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WithdrawDetail;
  static deserializeBinaryFromReader(message: WithdrawDetail, reader: jspb.BinaryReader): WithdrawDetail;
}

export namespace WithdrawDetail {
  export type AsObject = {
    wdOnchain: Uint8Array | string,
    sortedSigsList: Array<AddrSig.AsObject>,
    completed: boolean,
    lastReqTime: number,
    xferid: Uint8Array | string,
  }
}

export class AddrSig extends jspb.Message {
  getAddr(): Uint8Array | string;
  getAddr_asU8(): Uint8Array;
  getAddr_asB64(): string;
  setAddr(value: Uint8Array | string): AddrSig;

  getSig(): Uint8Array | string;
  getSig_asU8(): Uint8Array;
  getSig_asB64(): string;
  setSig(value: Uint8Array | string): AddrSig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddrSig.AsObject;
  static toObject(includeInstance: boolean, msg: AddrSig): AddrSig.AsObject;
  static serializeBinaryToWriter(message: AddrSig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddrSig;
  static deserializeBinaryFromReader(message: AddrSig, reader: jspb.BinaryReader): AddrSig;
}

export namespace AddrSig {
  export type AsObject = {
    addr: Uint8Array | string,
    sig: Uint8Array | string,
  }
}

export class Signer extends jspb.Message {
  getAddr(): Uint8Array | string;
  getAddr_asU8(): Uint8Array;
  getAddr_asB64(): string;
  setAddr(value: Uint8Array | string): Signer;

  getPower(): Uint8Array | string;
  getPower_asU8(): Uint8Array;
  getPower_asB64(): string;
  setPower(value: Uint8Array | string): Signer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Signer.AsObject;
  static toObject(includeInstance: boolean, msg: Signer): Signer.AsObject;
  static serializeBinaryToWriter(message: Signer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Signer;
  static deserializeBinaryFromReader(message: Signer, reader: jspb.BinaryReader): Signer;
}

export namespace Signer {
  export type AsObject = {
    addr: Uint8Array | string,
    power: Uint8Array | string,
  }
}

export class ChainSigners extends jspb.Message {
  getChainId(): number;
  setChainId(value: number): ChainSigners;

  getSortedSignersList(): Array<Signer>;
  setSortedSignersList(value: Array<Signer>): ChainSigners;
  clearSortedSignersList(): ChainSigners;
  addSortedSigners(value?: Signer, index?: number): Signer;

  getSortedSigsList(): Array<AddrSig>;
  setSortedSigsList(value: Array<AddrSig>): ChainSigners;
  clearSortedSigsList(): ChainSigners;
  addSortedSigs(value?: AddrSig, index?: number): AddrSig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChainSigners.AsObject;
  static toObject(includeInstance: boolean, msg: ChainSigners): ChainSigners.AsObject;
  static serializeBinaryToWriter(message: ChainSigners, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChainSigners;
  static deserializeBinaryFromReader(message: ChainSigners, reader: jspb.BinaryReader): ChainSigners;
}

export namespace ChainSigners {
  export type AsObject = {
    chainId: number,
    sortedSignersList: Array<Signer.AsObject>,
    sortedSigsList: Array<AddrSig.AsObject>,
  }
}

export class LatestSigners extends jspb.Message {
  getSortedSignersList(): Array<Signer>;
  setSortedSignersList(value: Array<Signer>): LatestSigners;
  clearSortedSignersList(): LatestSigners;
  addSortedSigners(value?: Signer, index?: number): Signer;

  getSignersBytes(): Uint8Array | string;
  getSignersBytes_asU8(): Uint8Array;
  getSignersBytes_asB64(): string;
  setSignersBytes(value: Uint8Array | string): LatestSigners;

  getTriggerTime(): number;
  setTriggerTime(value: number): LatestSigners;

  getLastSignTime(): number;
  setLastSignTime(value: number): LatestSigners;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LatestSigners.AsObject;
  static toObject(includeInstance: boolean, msg: LatestSigners): LatestSigners.AsObject;
  static serializeBinaryToWriter(message: LatestSigners, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LatestSigners;
  static deserializeBinaryFromReader(message: LatestSigners, reader: jspb.BinaryReader): LatestSigners;
}

export namespace LatestSigners {
  export type AsObject = {
    sortedSignersList: Array<Signer.AsObject>,
    signersBytes: Uint8Array | string,
    triggerTime: number,
    lastSignTime: number,
  }
}

export enum XferStatus { 
  UNKNOWN = 0,
  OK_TO_RELAY = 1,
  SUCCESS = 2,
  BAD_LIQUIDITY = 3,
  BAD_SLIPPAGE = 4,
  BAD_TOKEN = 5,
  REFUND_REQUESTED = 6,
  REFUND_DONE = 7,
  BAD_XFER_DISABLED = 8,
  BAD_DEST_CHAIN = 9,
  EXCEED_MAX_OUT_AMOUNT = 10,
  XFER_DELAYED = 11,
  BAD_ADDRESS = 12,
}
