import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';


export class Minter extends jspb.Message {
  getAnnualProvisions(): string;
  setAnnualProvisions(value: string): Minter;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Minter.AsObject;
  static toObject(includeInstance: boolean, msg: Minter): Minter.AsObject;
  static serializeBinaryToWriter(message: Minter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Minter;
  static deserializeBinaryFromReader(message: Minter, reader: jspb.BinaryReader): Minter;
}

export namespace Minter {
  export type AsObject = {
    annualProvisions: string,
  }
}

export class Params extends jspb.Message {
  getMintDenom(): string;
  setMintDenom(value: string): Params;

  getBlocksPerYear(): number;
  setBlocksPerYear(value: number): Params;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Params.AsObject;
  static toObject(includeInstance: boolean, msg: Params): Params.AsObject;
  static serializeBinaryToWriter(message: Params, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Params;
  static deserializeBinaryFromReader(message: Params, reader: jspb.BinaryReader): Params;
}

export namespace Params {
  export type AsObject = {
    mintDenom: string,
    blocksPerYear: number,
  }
}

export class AdjustProvisionsProposal extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): AdjustProvisionsProposal;

  getDescription(): string;
  setDescription(value: string): AdjustProvisionsProposal;

  getNewAnnualProvisions(): string;
  setNewAnnualProvisions(value: string): AdjustProvisionsProposal;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdjustProvisionsProposal.AsObject;
  static toObject(includeInstance: boolean, msg: AdjustProvisionsProposal): AdjustProvisionsProposal.AsObject;
  static serializeBinaryToWriter(message: AdjustProvisionsProposal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdjustProvisionsProposal;
  static deserializeBinaryFromReader(message: AdjustProvisionsProposal, reader: jspb.BinaryReader): AdjustProvisionsProposal;
}

export namespace AdjustProvisionsProposal {
  export type AsObject = {
    title: string,
    description: string,
    newAnnualProvisions: string,
  }
}

export class AdjustProvisionsProposalWithDeposit extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): AdjustProvisionsProposalWithDeposit;

  getDescription(): string;
  setDescription(value: string): AdjustProvisionsProposalWithDeposit;

  getNewAnnualProvisions(): string;
  setNewAnnualProvisions(value: string): AdjustProvisionsProposalWithDeposit;

  getDeposit(): string;
  setDeposit(value: string): AdjustProvisionsProposalWithDeposit;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AdjustProvisionsProposalWithDeposit.AsObject;
  static toObject(includeInstance: boolean, msg: AdjustProvisionsProposalWithDeposit): AdjustProvisionsProposalWithDeposit.AsObject;
  static serializeBinaryToWriter(message: AdjustProvisionsProposalWithDeposit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AdjustProvisionsProposalWithDeposit;
  static deserializeBinaryFromReader(message: AdjustProvisionsProposalWithDeposit, reader: jspb.BinaryReader): AdjustProvisionsProposalWithDeposit;
}

export namespace AdjustProvisionsProposalWithDeposit {
  export type AsObject = {
    title: string,
    description: string,
    newAnnualProvisions: string,
    deposit: string,
  }
}

