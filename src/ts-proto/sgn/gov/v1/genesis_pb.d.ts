import * as jspb from 'google-protobuf'

import * as gogoproto_gogo_pb from '../../../gogoproto/gogo_pb';
import * as sgn_gov_v1_gov_pb from '../../../sgn/gov/v1/gov_pb';


export class GenesisState extends jspb.Message {
  getStartingProposalId(): number;
  setStartingProposalId(value: number): GenesisState;

  getDepositsList(): Array<sgn_gov_v1_gov_pb.Deposit>;
  setDepositsList(value: Array<sgn_gov_v1_gov_pb.Deposit>): GenesisState;
  clearDepositsList(): GenesisState;
  addDeposits(value?: sgn_gov_v1_gov_pb.Deposit, index?: number): sgn_gov_v1_gov_pb.Deposit;

  getVotesList(): Array<sgn_gov_v1_gov_pb.Vote>;
  setVotesList(value: Array<sgn_gov_v1_gov_pb.Vote>): GenesisState;
  clearVotesList(): GenesisState;
  addVotes(value?: sgn_gov_v1_gov_pb.Vote, index?: number): sgn_gov_v1_gov_pb.Vote;

  getProposalsList(): Array<sgn_gov_v1_gov_pb.Proposal>;
  setProposalsList(value: Array<sgn_gov_v1_gov_pb.Proposal>): GenesisState;
  clearProposalsList(): GenesisState;
  addProposals(value?: sgn_gov_v1_gov_pb.Proposal, index?: number): sgn_gov_v1_gov_pb.Proposal;

  getDepositParams(): sgn_gov_v1_gov_pb.DepositParams | undefined;
  setDepositParams(value?: sgn_gov_v1_gov_pb.DepositParams): GenesisState;
  hasDepositParams(): boolean;
  clearDepositParams(): GenesisState;

  getVotingParams(): sgn_gov_v1_gov_pb.VotingParams | undefined;
  setVotingParams(value?: sgn_gov_v1_gov_pb.VotingParams): GenesisState;
  hasVotingParams(): boolean;
  clearVotingParams(): GenesisState;

  getTallyParams(): sgn_gov_v1_gov_pb.TallyParams | undefined;
  setTallyParams(value?: sgn_gov_v1_gov_pb.TallyParams): GenesisState;
  hasTallyParams(): boolean;
  clearTallyParams(): GenesisState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenesisState.AsObject;
  static toObject(includeInstance: boolean, msg: GenesisState): GenesisState.AsObject;
  static serializeBinaryToWriter(message: GenesisState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenesisState;
  static deserializeBinaryFromReader(message: GenesisState, reader: jspb.BinaryReader): GenesisState;
}

export namespace GenesisState {
  export type AsObject = {
    startingProposalId: number,
    depositsList: Array<sgn_gov_v1_gov_pb.Deposit.AsObject>,
    votesList: Array<sgn_gov_v1_gov_pb.Vote.AsObject>,
    proposalsList: Array<sgn_gov_v1_gov_pb.Proposal.AsObject>,
    depositParams?: sgn_gov_v1_gov_pb.DepositParams.AsObject,
    votingParams?: sgn_gov_v1_gov_pb.VotingParams.AsObject,
    tallyParams?: sgn_gov_v1_gov_pb.TallyParams.AsObject,
  }
}

