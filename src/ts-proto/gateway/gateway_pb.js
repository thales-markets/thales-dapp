// source: gateway/gateway.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() {
  if (this) { return this; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  if (typeof self !== 'undefined') { return self; }
  return Function('return this')();
}.call(null));

var gogoproto_gogo_pb = require('../gogoproto/gogo_pb.js');
goog.object.extend(proto, gogoproto_gogo_pb);
var google_api_annotations_pb = require('../google/api/annotations_pb.js');
goog.object.extend(proto, google_api_annotations_pb);
var sgn_cbridge_v1_query_pb = require('../sgn/cbridge/v1/query_pb.js');
goog.object.extend(proto, sgn_cbridge_v1_query_pb);
var sgn_cbridge_v1_cbridge_pb = require('../sgn/cbridge/v1/cbridge_pb.js');
goog.object.extend(proto, sgn_cbridge_v1_cbridge_pb);
var sgn_common_v1_common_pb = require('../sgn/common/v1/common_pb.js');
goog.object.extend(proto, sgn_common_v1_common_pb);
var sgn_farming_v1_farming_pb = require('../sgn/farming/v1/farming_pb.js');
goog.object.extend(proto, sgn_farming_v1_farming_pb);
var sgn_distribution_v1_distribution_pb = require('../sgn/distribution/v1/distribution_pb.js');
goog.object.extend(proto, sgn_distribution_v1_distribution_pb);
var sgn_pegbridge_v1_pegbridge_pb = require('../sgn/pegbridge/v1/pegbridge_pb.js');
goog.object.extend(proto, sgn_pegbridge_v1_pegbridge_pb);
var sgn_message_v1_query_pb = require('../sgn/message/v1/query_pb.js');
goog.object.extend(proto, sgn_message_v1_query_pb);
var sgn_pegbridge_v1_tx_pb = require('../sgn/pegbridge/v1/tx_pb.js');
goog.object.extend(proto, sgn_pegbridge_v1_tx_pb);
var cosmos_base_v1beta1_coin_pb = require('../cosmos/base/v1beta1/coin_pb.js');
goog.object.extend(proto, cosmos_base_v1beta1_coin_pb);
var sgn_health_v1_health_pb = require('../sgn/health/v1/health_pb.js');
goog.object.extend(proto, sgn_health_v1_health_pb);
goog.exportSymbol('proto.sgn.gateway.v1.AbnormalStatusInfo', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.BscCampaignEventConfig', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.BscCampaignInfo', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.BscCampaignTransferWhiteList', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.CSOperation', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.CSType', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.CampaignScore', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.Chain', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ChainTokenInfo', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ClaimFeeRebateRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ClaimFeeRebateResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ClaimRetentionRewardsRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ClaimRetentionRewardsResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ErrCode', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ErrMsg', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.EstimateAmtRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.EstimateAmtResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.EstimateWithdrawAmt', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.EstimateWithdrawAmtRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.EstimateWithdrawAmtResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ExtendedPair', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.ExtendedToken', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.FeeRebateEvent', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.FeeRebateLevelConfig', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.FixEventMissRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.FixEventMissResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetAllConfigsRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetAllConfigsResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetAllLPInfoRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetAllLPInfoResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetAllTXInfoRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetAllTXInfoResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetBscCampaignInfoRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetBscCampaignInfoResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetCampaignScoresRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetCampaignScoresResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetFeeRebateInfoRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetFeeRebateInfoResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetInfoByTxHashRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetInfoByTxHashResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetLPInfoListRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetLPInfoListResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetStakingRewardDetailsRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetStakingRewardDetailsResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetTokenInfoRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetTokenInfoResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetTransferConfigsRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetTransferConfigsResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetTransferStatusRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetTransferStatusResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetUsrBalanceRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.GetUsrBalanceResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.IncentiveCampaignRank', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.InitPegRefundRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.InitPegRefundResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.InitWithdrawRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.InitWithdrawResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.LPHistory', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.LPHistoryRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.LPHistoryResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.LPInfo', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.LPOperations', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.LPType', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.LpActionType', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.PeggedPairConfig', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.QueryLiquidityStatusRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.QueryLiquidityStatusResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.RetentionRewardsEvent', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.RetentionRewardsLevelConfig', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.Reward', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.RewardingDataRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.RewardingDataResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.StakingConfigRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.StakingConfigResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.TXOperations', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.TokenInfo', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.TransferHistory', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.TransferHistoryRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.TransferHistoryResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.TransferInfo', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.UnlockFarmingRewardRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.UnlockFarmingRewardResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.UnlockStakingRewardRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.UnlockStakingRewardResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.UpdateChainRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.UpdateChainResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.UpdateTokenRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.UpdateTokenResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.UserCaseStatus', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.WithdrawInfo', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.WithdrawLiquidityRequest', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.WithdrawLiquidityResponse', null, global);
goog.exportSymbol('proto.sgn.gateway.v1.WithdrawMethodType', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.InitPegRefundRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.InitPegRefundRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.InitPegRefundRequest.displayName = 'proto.sgn.gateway.v1.InitPegRefundRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.InitPegRefundResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.InitPegRefundResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.InitPegRefundResponse.displayName = 'proto.sgn.gateway.v1.InitPegRefundResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.InitWithdrawRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.InitWithdrawRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.InitWithdrawRequest.displayName = 'proto.sgn.gateway.v1.InitWithdrawRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.InitWithdrawResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.InitWithdrawResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.InitWithdrawResponse.displayName = 'proto.sgn.gateway.v1.InitWithdrawResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetUsrBalanceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetUsrBalanceRequest.displayName = 'proto.sgn.gateway.v1.GetUsrBalanceRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetUsrBalanceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetUsrBalanceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetUsrBalanceResponse.displayName = 'proto.sgn.gateway.v1.GetUsrBalanceResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.displayName = 'proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.displayName = 'proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetCampaignScoresRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetCampaignScoresRequest.displayName = 'proto.sgn.gateway.v1.GetCampaignScoresRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetCampaignScoresResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetCampaignScoresResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetCampaignScoresResponse.displayName = 'proto.sgn.gateway.v1.GetCampaignScoresResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.CampaignScore = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.CampaignScore, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.CampaignScore.displayName = 'proto.sgn.gateway.v1.CampaignScore';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.QueryLiquidityStatusResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.QueryLiquidityStatusResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.QueryLiquidityStatusResponse.displayName = 'proto.sgn.gateway.v1.QueryLiquidityStatusResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.Chain = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.Chain, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.Chain.displayName = 'proto.sgn.gateway.v1.Chain';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ChainTokenInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.ChainTokenInfo.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.ChainTokenInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ChainTokenInfo.displayName = 'proto.sgn.gateway.v1.ChainTokenInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.TokenInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.TokenInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.TokenInfo.displayName = 'proto.sgn.gateway.v1.TokenInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.TransferInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.TransferInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.TransferInfo.displayName = 'proto.sgn.gateway.v1.TransferInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetTransferStatusRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetTransferStatusRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetTransferStatusRequest.displayName = 'proto.sgn.gateway.v1.GetTransferStatusRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetTransferStatusResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetTransferStatusResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetTransferStatusResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetTransferStatusResponse.displayName = 'proto.sgn.gateway.v1.GetTransferStatusResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetTransferConfigsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetTransferConfigsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetTransferConfigsRequest.displayName = 'proto.sgn.gateway.v1.GetTransferConfigsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetTransferConfigsResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetTransferConfigsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetTransferConfigsResponse.displayName = 'proto.sgn.gateway.v1.GetTransferConfigsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.PeggedPairConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.PeggedPairConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.PeggedPairConfig.displayName = 'proto.sgn.gateway.v1.PeggedPairConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetTokenInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetTokenInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetTokenInfoRequest.displayName = 'proto.sgn.gateway.v1.GetTokenInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetTokenInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetTokenInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetTokenInfoResponse.displayName = 'proto.sgn.gateway.v1.GetTokenInfoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.EstimateAmtRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.EstimateAmtRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.EstimateAmtRequest.displayName = 'proto.sgn.gateway.v1.EstimateAmtRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.EstimateAmtResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.EstimateAmtResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.EstimateAmtResponse.displayName = 'proto.sgn.gateway.v1.EstimateAmtResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.WithdrawInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.WithdrawInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.WithdrawInfo.displayName = 'proto.sgn.gateway.v1.WithdrawInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.EstimateWithdrawAmtRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.displayName = 'proto.sgn.gateway.v1.EstimateWithdrawAmtRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.EstimateWithdrawAmtResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.displayName = 'proto.sgn.gateway.v1.EstimateWithdrawAmtResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.EstimateWithdrawAmt, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.EstimateWithdrawAmt.displayName = 'proto.sgn.gateway.v1.EstimateWithdrawAmt';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetLPInfoListRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetLPInfoListRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetLPInfoListRequest.displayName = 'proto.sgn.gateway.v1.GetLPInfoListRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.LPInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.LPInfo.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.LPInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.LPInfo.displayName = 'proto.sgn.gateway.v1.LPInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetLPInfoListResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetLPInfoListResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetLPInfoListResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetLPInfoListResponse.displayName = 'proto.sgn.gateway.v1.GetLPInfoListResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.WithdrawLiquidityRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.WithdrawLiquidityRequest.displayName = 'proto.sgn.gateway.v1.WithdrawLiquidityRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.WithdrawLiquidityResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.WithdrawLiquidityResponse.displayName = 'proto.sgn.gateway.v1.WithdrawLiquidityResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.UnlockFarmingRewardRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.UnlockFarmingRewardRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.UnlockFarmingRewardRequest.displayName = 'proto.sgn.gateway.v1.UnlockFarmingRewardRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.UnlockFarmingRewardResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.UnlockFarmingRewardResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.UnlockFarmingRewardResponse.displayName = 'proto.sgn.gateway.v1.UnlockFarmingRewardResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.displayName = 'proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.displayName = 'proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.QueryLiquidityStatusRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.QueryLiquidityStatusRequest.displayName = 'proto.sgn.gateway.v1.QueryLiquidityStatusRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.TransferHistory = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.TransferHistory, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.TransferHistory.displayName = 'proto.sgn.gateway.v1.TransferHistory';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.LPHistory = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.LPHistory, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.LPHistory.displayName = 'proto.sgn.gateway.v1.LPHistory';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.TransferHistoryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.TransferHistoryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.TransferHistoryRequest.displayName = 'proto.sgn.gateway.v1.TransferHistoryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.TransferHistoryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.TransferHistoryResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.TransferHistoryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.TransferHistoryResponse.displayName = 'proto.sgn.gateway.v1.TransferHistoryResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.LPHistoryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.LPHistoryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.LPHistoryRequest.displayName = 'proto.sgn.gateway.v1.LPHistoryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.LPHistoryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.LPHistoryResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.LPHistoryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.LPHistoryResponse.displayName = 'proto.sgn.gateway.v1.LPHistoryResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.RewardingDataRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.RewardingDataRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.RewardingDataRequest.displayName = 'proto.sgn.gateway.v1.RewardingDataRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.Reward = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.Reward, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.Reward.displayName = 'proto.sgn.gateway.v1.Reward';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.RewardingDataResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.RewardingDataResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.RewardingDataResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.RewardingDataResponse.displayName = 'proto.sgn.gateway.v1.RewardingDataResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.UpdateChainRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.UpdateChainRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.UpdateChainRequest.displayName = 'proto.sgn.gateway.v1.UpdateChainRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.UpdateChainResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.UpdateChainResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.UpdateChainResponse.displayName = 'proto.sgn.gateway.v1.UpdateChainResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.UpdateTokenRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.UpdateTokenRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.UpdateTokenRequest.displayName = 'proto.sgn.gateway.v1.UpdateTokenRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.UpdateTokenResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.UpdateTokenResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.UpdateTokenResponse.displayName = 'proto.sgn.gateway.v1.UpdateTokenResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.StakingConfigRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.StakingConfigRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.StakingConfigRequest.displayName = 'proto.sgn.gateway.v1.StakingConfigRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.StakingConfigResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.StakingConfigResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.StakingConfigResponse.displayName = 'proto.sgn.gateway.v1.StakingConfigResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.UnlockStakingRewardRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.UnlockStakingRewardRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.UnlockStakingRewardRequest.displayName = 'proto.sgn.gateway.v1.UnlockStakingRewardRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.UnlockStakingRewardResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.UnlockStakingRewardResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.UnlockStakingRewardResponse.displayName = 'proto.sgn.gateway.v1.UnlockStakingRewardResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetStakingRewardDetailsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.displayName = 'proto.sgn.gateway.v1.GetStakingRewardDetailsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetStakingRewardDetailsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.displayName = 'proto.sgn.gateway.v1.GetStakingRewardDetailsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.displayName = 'proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.displayName = 'proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest.displayName = 'proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.displayName = 'proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetAllLPInfoRequest.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetAllLPInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetAllLPInfoRequest.displayName = 'proto.sgn.gateway.v1.GetAllLPInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetAllLPInfoResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetAllLPInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetAllLPInfoResponse.displayName = 'proto.sgn.gateway.v1.GetAllLPInfoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.LPOperations = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.LPOperations, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.LPOperations.displayName = 'proto.sgn.gateway.v1.LPOperations';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetAllTXInfoRequest.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetAllTXInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetAllTXInfoRequest.displayName = 'proto.sgn.gateway.v1.GetAllTXInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetAllTXInfoResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetAllTXInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetAllTXInfoResponse.displayName = 'proto.sgn.gateway.v1.GetAllTXInfoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.TXOperations = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.TXOperations, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.TXOperations.displayName = 'proto.sgn.gateway.v1.TXOperations';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.AbnormalStatusInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.AbnormalStatusInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.AbnormalStatusInfo.displayName = 'proto.sgn.gateway.v1.AbnormalStatusInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetInfoByTxHashRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetInfoByTxHashRequest.displayName = 'proto.sgn.gateway.v1.GetInfoByTxHashRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetInfoByTxHashResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetInfoByTxHashResponse.displayName = 'proto.sgn.gateway.v1.GetInfoByTxHashResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.FixEventMissRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.FixEventMissRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.FixEventMissRequest.displayName = 'proto.sgn.gateway.v1.FixEventMissRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.FixEventMissResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.FixEventMissResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.FixEventMissResponse.displayName = 'proto.sgn.gateway.v1.FixEventMissResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetAllConfigsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetAllConfigsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetAllConfigsRequest.displayName = 'proto.sgn.gateway.v1.GetAllConfigsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ExtendedPair = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ExtendedPair, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ExtendedPair.displayName = 'proto.sgn.gateway.v1.ExtendedPair';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetAllConfigsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetAllConfigsResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetAllConfigsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetAllConfigsResponse.displayName = 'proto.sgn.gateway.v1.GetAllConfigsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.displayName = 'proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ExtendedToken = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ExtendedToken, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ExtendedToken.displayName = 'proto.sgn.gateway.v1.ExtendedToken';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.displayName = 'proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.RetentionRewardsEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.RetentionRewardsEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.RetentionRewardsEvent.displayName = 'proto.sgn.gateway.v1.RetentionRewardsEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.displayName = 'proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.RetentionRewardsLevelConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.RetentionRewardsLevelConfig.displayName = 'proto.sgn.gateway.v1.RetentionRewardsLevelConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.displayName = 'proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.displayName = 'proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ClaimRetentionRewardsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.displayName = 'proto.sgn.gateway.v1.ClaimRetentionRewardsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ClaimRetentionRewardsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.displayName = 'proto.sgn.gateway.v1.ClaimRetentionRewardsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest.displayName = 'proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.displayName = 'proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest.displayName = 'proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.displayName = 'proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.displayName = 'proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.displayName = 'proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.IncentiveCampaignRank = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.IncentiveCampaignRank, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.IncentiveCampaignRank.displayName = 'proto.sgn.gateway.v1.IncentiveCampaignRank';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.FeeRebateEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.FeeRebateEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.FeeRebateEvent.displayName = 'proto.sgn.gateway.v1.FeeRebateEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.displayName = 'proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.FeeRebateLevelConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.FeeRebateLevelConfig.displayName = 'proto.sgn.gateway.v1.FeeRebateLevelConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetFeeRebateInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetFeeRebateInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetFeeRebateInfoRequest.displayName = 'proto.sgn.gateway.v1.GetFeeRebateInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetFeeRebateInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetFeeRebateInfoResponse.displayName = 'proto.sgn.gateway.v1.GetFeeRebateInfoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ClaimFeeRebateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ClaimFeeRebateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ClaimFeeRebateRequest.displayName = 'proto.sgn.gateway.v1.ClaimFeeRebateRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ClaimFeeRebateResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ClaimFeeRebateResponse.displayName = 'proto.sgn.gateway.v1.ClaimFeeRebateResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.BscCampaignEventConfig = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.BscCampaignEventConfig, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.BscCampaignEventConfig.displayName = 'proto.sgn.gateway.v1.BscCampaignEventConfig';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.displayName = 'proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.BscCampaignTransferWhiteList.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.BscCampaignTransferWhiteList, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.BscCampaignTransferWhiteList.displayName = 'proto.sgn.gateway.v1.BscCampaignTransferWhiteList';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetBscCampaignInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetBscCampaignInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetBscCampaignInfoRequest.displayName = 'proto.sgn.gateway.v1.GetBscCampaignInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.BscCampaignInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.BscCampaignInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.BscCampaignInfo.displayName = 'proto.sgn.gateway.v1.BscCampaignInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetBscCampaignInfoResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetBscCampaignInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetBscCampaignInfoResponse.displayName = 'proto.sgn.gateway.v1.GetBscCampaignInfoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.displayName = 'proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.displayName = 'proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest.displayName = 'proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.repeatedFields_, null);
};
goog.inherits(proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.displayName = 'proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.sgn.gateway.v1.ErrMsg = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.sgn.gateway.v1.ErrMsg, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.sgn.gateway.v1.ErrMsg.displayName = 'proto.sgn.gateway.v1.ErrMsg';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.InitPegRefundRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.InitPegRefundRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.InitPegRefundRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InitPegRefundRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    refId: msg.getRefId_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.InitPegRefundRequest}
 */
proto.sgn.gateway.v1.InitPegRefundRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.InitPegRefundRequest;
  return proto.sgn.gateway.v1.InitPegRefundRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.InitPegRefundRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.InitPegRefundRequest}
 */
proto.sgn.gateway.v1.InitPegRefundRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setRefId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.InitPegRefundRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.InitPegRefundRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.InitPegRefundRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InitPegRefundRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRefId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes ref_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.InitPegRefundRequest.prototype.getRefId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes ref_id = 1;
 * This is a type-conversion wrapper around `getRefId()`
 * @return {string}
 */
proto.sgn.gateway.v1.InitPegRefundRequest.prototype.getRefId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getRefId()));
};


/**
 * optional bytes ref_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getRefId()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.InitPegRefundRequest.prototype.getRefId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getRefId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.InitPegRefundRequest} returns this
 */
proto.sgn.gateway.v1.InitPegRefundRequest.prototype.setRefId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.InitPegRefundResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.InitPegRefundResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.InitPegRefundResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InitPegRefundResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.InitPegRefundResponse}
 */
proto.sgn.gateway.v1.InitPegRefundResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.InitPegRefundResponse;
  return proto.sgn.gateway.v1.InitPegRefundResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.InitPegRefundResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.InitPegRefundResponse}
 */
proto.sgn.gateway.v1.InitPegRefundResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.InitPegRefundResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.InitPegRefundResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.InitPegRefundResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InitPegRefundResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.InitPegRefundResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.InitPegRefundResponse} returns this
*/
proto.sgn.gateway.v1.InitPegRefundResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.InitPegRefundResponse} returns this
 */
proto.sgn.gateway.v1.InitPegRefundResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.InitPegRefundResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.InitWithdrawRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.InitWithdrawRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.InitWithdrawRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InitWithdrawRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    withdrawReq: msg.getWithdrawReq_asB64(),
    sig: msg.getSig_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.InitWithdrawRequest}
 */
proto.sgn.gateway.v1.InitWithdrawRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.InitWithdrawRequest;
  return proto.sgn.gateway.v1.InitWithdrawRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.InitWithdrawRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.InitWithdrawRequest}
 */
proto.sgn.gateway.v1.InitWithdrawRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setWithdrawReq(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSig(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.InitWithdrawRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.InitWithdrawRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.InitWithdrawRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InitWithdrawRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getWithdrawReq_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getSig_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * optional bytes withdraw_req = 1;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.InitWithdrawRequest.prototype.getWithdrawReq = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes withdraw_req = 1;
 * This is a type-conversion wrapper around `getWithdrawReq()`
 * @return {string}
 */
proto.sgn.gateway.v1.InitWithdrawRequest.prototype.getWithdrawReq_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getWithdrawReq()));
};


/**
 * optional bytes withdraw_req = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getWithdrawReq()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.InitWithdrawRequest.prototype.getWithdrawReq_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getWithdrawReq()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.InitWithdrawRequest} returns this
 */
proto.sgn.gateway.v1.InitWithdrawRequest.prototype.setWithdrawReq = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bytes sig = 2;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.InitWithdrawRequest.prototype.getSig = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes sig = 2;
 * This is a type-conversion wrapper around `getSig()`
 * @return {string}
 */
proto.sgn.gateway.v1.InitWithdrawRequest.prototype.getSig_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSig()));
};


/**
 * optional bytes sig = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSig()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.InitWithdrawRequest.prototype.getSig_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSig()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.InitWithdrawRequest} returns this
 */
proto.sgn.gateway.v1.InitWithdrawRequest.prototype.setSig = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.InitWithdrawResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.InitWithdrawResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.InitWithdrawResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InitWithdrawResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.InitWithdrawResponse}
 */
proto.sgn.gateway.v1.InitWithdrawResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.InitWithdrawResponse;
  return proto.sgn.gateway.v1.InitWithdrawResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.InitWithdrawResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.InitWithdrawResponse}
 */
proto.sgn.gateway.v1.InitWithdrawResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.InitWithdrawResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.InitWithdrawResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.InitWithdrawResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InitWithdrawResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.InitWithdrawResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.InitWithdrawResponse} returns this
*/
proto.sgn.gateway.v1.InitWithdrawResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.InitWithdrawResponse} returns this
 */
proto.sgn.gateway.v1.InitWithdrawResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.InitWithdrawResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetUsrBalanceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetUsrBalanceRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    sig: msg.getSig_asB64(),
    sigAddr: jspb.Message.getFieldWithDefault(msg, 2, ""),
    usrAddr: jspb.Message.getFieldWithDefault(msg, 3, ""),
    chainId: jspb.Message.getFieldWithDefault(msg, 4, 0),
    tokenSymbol: jspb.Message.getFieldWithDefault(msg, 5, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetUsrBalanceRequest}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetUsrBalanceRequest;
  return proto.sgn.gateway.v1.GetUsrBalanceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetUsrBalanceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetUsrBalanceRequest}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSig(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSigAddr(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setUsrAddr(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setChainId(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenSymbol(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetUsrBalanceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetUsrBalanceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSig_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getSigAddr();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getUsrAddr();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = message.getTokenSymbol();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional bytes sig = 1;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.getSig = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes sig = 1;
 * This is a type-conversion wrapper around `getSig()`
 * @return {string}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.getSig_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSig()));
};


/**
 * optional bytes sig = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSig()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.getSig_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSig()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.GetUsrBalanceRequest} returns this
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.setSig = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional string sig_addr = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.getSigAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetUsrBalanceRequest} returns this
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.setSigAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string usr_addr = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.getUsrAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetUsrBalanceRequest} returns this
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.setUsrAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional uint32 chain_id = 4;
 * @return {number}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetUsrBalanceRequest} returns this
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional string token_symbol = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.getTokenSymbol = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetUsrBalanceRequest} returns this
 */
proto.sgn.gateway.v1.GetUsrBalanceRequest.prototype.setTokenSymbol = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetUsrBalanceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetUsrBalanceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetUsrBalanceResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetUsrBalanceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    balance: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetUsrBalanceResponse}
 */
proto.sgn.gateway.v1.GetUsrBalanceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetUsrBalanceResponse;
  return proto.sgn.gateway.v1.GetUsrBalanceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetUsrBalanceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetUsrBalanceResponse}
 */
proto.sgn.gateway.v1.GetUsrBalanceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setBalance(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetUsrBalanceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetUsrBalanceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetUsrBalanceResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetUsrBalanceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBalance();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string balance = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.GetUsrBalanceResponse.prototype.getBalance = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetUsrBalanceResponse} returns this
 */
proto.sgn.gateway.v1.GetUsrBalanceResponse.prototype.setBalance = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    msg: (f = msg.getMsg()) && sgn_pegbridge_v1_tx_pb.MsgClaimFee.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest;
  return proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new sgn_pegbridge_v1_tx_pb.MsgClaimFee;
      reader.readMessage(value,sgn_pegbridge_v1_tx_pb.MsgClaimFee.deserializeBinaryFromReader);
      msg.setMsg(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMsg();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      sgn_pegbridge_v1_tx_pb.MsgClaimFee.serializeBinaryToWriter
    );
  }
};


/**
 * optional sgn.pegbridge.v1.MsgClaimFee msg = 1;
 * @return {?proto.sgn.pegbridge.v1.MsgClaimFee}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.prototype.getMsg = function() {
  return /** @type{?proto.sgn.pegbridge.v1.MsgClaimFee} */ (
    jspb.Message.getWrapperField(this, sgn_pegbridge_v1_tx_pb.MsgClaimFee, 1));
};


/**
 * @param {?proto.sgn.pegbridge.v1.MsgClaimFee|undefined} value
 * @return {!proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest} returns this
*/
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.prototype.setMsg = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest} returns this
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.prototype.clearMsg = function() {
  return this.setMsg(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeRequest.prototype.hasMsg = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    resp: (f = msg.getResp()) && sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse;
  return proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse;
      reader.readMessage(value,sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse.deserializeBinaryFromReader);
      msg.setResp(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getResp();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse} returns this
*/
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse} returns this
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional sgn.pegbridge.v1.MsgClaimFeeResponse resp = 2;
 * @return {?proto.sgn.pegbridge.v1.MsgClaimFeeResponse}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.prototype.getResp = function() {
  return /** @type{?proto.sgn.pegbridge.v1.MsgClaimFeeResponse} */ (
    jspb.Message.getWrapperField(this, sgn_pegbridge_v1_tx_pb.MsgClaimFeeResponse, 2));
};


/**
 * @param {?proto.sgn.pegbridge.v1.MsgClaimFeeResponse|undefined} value
 * @return {!proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse} returns this
*/
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.prototype.setResp = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse} returns this
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.prototype.clearResp = function() {
  return this.setResp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ClaimPegBridgeFeeResponse.prototype.hasResp = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetCampaignScoresRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetCampaignScoresRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    date: jspb.Message.getFieldWithDefault(msg, 1, 0),
    beginBlock: jspb.Message.getFieldWithDefault(msg, 2, 0),
    endBlock: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresRequest}
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetCampaignScoresRequest;
  return proto.sgn.gateway.v1.GetCampaignScoresRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetCampaignScoresRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresRequest}
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setDate(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBeginBlock(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEndBlock(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetCampaignScoresRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetCampaignScoresRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDate();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getBeginBlock();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getEndBlock();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * optional uint32 date = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.prototype.getDate = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresRequest} returns this
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.prototype.setDate = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint64 begin_block = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.prototype.getBeginBlock = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresRequest} returns this
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.prototype.setBeginBlock = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 end_block = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.prototype.getEndBlock = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresRequest} returns this
 */
proto.sgn.gateway.v1.GetCampaignScoresRequest.prototype.setEndBlock = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetCampaignScoresResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetCampaignScoresResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    scoresList: jspb.Message.toObjectList(msg.getScoresList(),
    proto.sgn.gateway.v1.CampaignScore.toObject, includeInstance),
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    begin: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresResponse}
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetCampaignScoresResponse;
  return proto.sgn.gateway.v1.GetCampaignScoresResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetCampaignScoresResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresResponse}
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.CampaignScore;
      reader.readMessage(value,proto.sgn.gateway.v1.CampaignScore.deserializeBinaryFromReader);
      msg.addScores(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBegin(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetCampaignScoresResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetCampaignScoresResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getScoresList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.sgn.gateway.v1.CampaignScore.serializeBinaryToWriter
    );
  }
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getBegin();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * repeated CampaignScore scores = 1;
 * @return {!Array<!proto.sgn.gateway.v1.CampaignScore>}
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.getScoresList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.CampaignScore>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.CampaignScore, 1));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.CampaignScore>} value
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresResponse} returns this
*/
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.setScoresList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sgn.gateway.v1.CampaignScore=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.CampaignScore}
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.addScores = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sgn.gateway.v1.CampaignScore, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresResponse} returns this
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.clearScoresList = function() {
  return this.setScoresList([]);
};


/**
 * optional ErrMsg err = 2;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 2));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresResponse} returns this
*/
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresResponse} returns this
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional uint64 begin = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.getBegin = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetCampaignScoresResponse} returns this
 */
proto.sgn.gateway.v1.GetCampaignScoresResponse.prototype.setBegin = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.CampaignScore.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.CampaignScore.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.CampaignScore} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.CampaignScore.toObject = function(includeInstance, msg) {
  var f, obj = {
    usrAddr: jspb.Message.getFieldWithDefault(msg, 1, ""),
    score: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.CampaignScore}
 */
proto.sgn.gateway.v1.CampaignScore.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.CampaignScore;
  return proto.sgn.gateway.v1.CampaignScore.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.CampaignScore} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.CampaignScore}
 */
proto.sgn.gateway.v1.CampaignScore.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setUsrAddr(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setScore(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.CampaignScore.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.CampaignScore.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.CampaignScore} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.CampaignScore.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsrAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getScore();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
};


/**
 * optional string usr_addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.CampaignScore.prototype.getUsrAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.CampaignScore} returns this
 */
proto.sgn.gateway.v1.CampaignScore.prototype.setUsrAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint64 score = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.CampaignScore.prototype.getScore = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.CampaignScore} returns this
 */
proto.sgn.gateway.v1.CampaignScore.prototype.setScore = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.repeatedFields_ = [4,5,6];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.QueryLiquidityStatusResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    status: jspb.Message.getFieldWithDefault(msg, 2, 0),
    wdOnchain: msg.getWdOnchain_asB64(),
    sortedSigsList: msg.getSortedSigsList_asB64(),
    signersList: msg.getSignersList_asB64(),
    powersList: msg.getPowersList_asB64(),
    blockTxLink: jspb.Message.getFieldWithDefault(msg, 7, ""),
    blockDelay: jspb.Message.getFieldWithDefault(msg, 8, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.QueryLiquidityStatusResponse;
  return proto.sgn.gateway.v1.QueryLiquidityStatusResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {!proto.sgn.cbridge.v1.WithdrawStatus} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setWdOnchain(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addSortedSigs(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addSigners(value);
      break;
    case 6:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addPowers(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setBlockTxLink(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setBlockDelay(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.QueryLiquidityStatusResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getWdOnchain_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = message.getSortedSigsList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      4,
      f
    );
  }
  f = message.getSignersList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      5,
      f
    );
  }
  f = message.getPowersList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      6,
      f
    );
  }
  f = message.getBlockTxLink();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getBlockDelay();
  if (f !== 0) {
    writer.writeUint32(
      8,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
*/
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional sgn.cbridge.v1.WithdrawStatus status = 2;
 * @return {!proto.sgn.cbridge.v1.WithdrawStatus}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getStatus = function() {
  return /** @type {!proto.sgn.cbridge.v1.WithdrawStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.sgn.cbridge.v1.WithdrawStatus} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional bytes wd_onchain = 3;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getWdOnchain = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * optional bytes wd_onchain = 3;
 * This is a type-conversion wrapper around `getWdOnchain()`
 * @return {string}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getWdOnchain_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getWdOnchain()));
};


/**
 * optional bytes wd_onchain = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getWdOnchain()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getWdOnchain_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getWdOnchain()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.setWdOnchain = function(value) {
  return jspb.Message.setProto3BytesField(this, 3, value);
};


/**
 * repeated bytes sorted_sigs = 4;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getSortedSigsList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * repeated bytes sorted_sigs = 4;
 * This is a type-conversion wrapper around `getSortedSigsList()`
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getSortedSigsList_asB64 = function() {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(
      this.getSortedSigsList()));
};


/**
 * repeated bytes sorted_sigs = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSortedSigsList()`
 * @return {!Array<!Uint8Array>}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getSortedSigsList_asU8 = function() {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getSortedSigsList()));
};


/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.setSortedSigsList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.addSortedSigs = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.clearSortedSigsList = function() {
  return this.setSortedSigsList([]);
};


/**
 * repeated bytes signers = 5;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getSignersList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(this, 5));
};


/**
 * repeated bytes signers = 5;
 * This is a type-conversion wrapper around `getSignersList()`
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getSignersList_asB64 = function() {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(
      this.getSignersList()));
};


/**
 * repeated bytes signers = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignersList()`
 * @return {!Array<!Uint8Array>}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getSignersList_asU8 = function() {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getSignersList()));
};


/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.setSignersList = function(value) {
  return jspb.Message.setField(this, 5, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.addSigners = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 5, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.clearSignersList = function() {
  return this.setSignersList([]);
};


/**
 * repeated bytes powers = 6;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getPowersList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(this, 6));
};


/**
 * repeated bytes powers = 6;
 * This is a type-conversion wrapper around `getPowersList()`
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getPowersList_asB64 = function() {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(
      this.getPowersList()));
};


/**
 * repeated bytes powers = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPowersList()`
 * @return {!Array<!Uint8Array>}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getPowersList_asU8 = function() {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getPowersList()));
};


/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.setPowersList = function(value) {
  return jspb.Message.setField(this, 6, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.addPowers = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 6, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.clearPowersList = function() {
  return this.setPowersList([]);
};


/**
 * optional string block_tx_link = 7;
 * @return {string}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getBlockTxLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.setBlockTxLink = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional uint32 block_delay = 8;
 * @return {number}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.getBlockDelay = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusResponse} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusResponse.prototype.setBlockDelay = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.Chain.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.Chain.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.Chain} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.Chain.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    icon: jspb.Message.getFieldWithDefault(msg, 3, ""),
    blockDelay: jspb.Message.getFieldWithDefault(msg, 4, 0),
    gasTokenSymbol: jspb.Message.getFieldWithDefault(msg, 5, ""),
    exploreUrl: jspb.Message.getFieldWithDefault(msg, 6, ""),
    contractAddr: jspb.Message.getFieldWithDefault(msg, 8, ""),
    dropGasAmt: jspb.Message.getFieldWithDefault(msg, 9, ""),
    dropGasCostAmt: jspb.Message.getFieldWithDefault(msg, 11, ""),
    dropGasBalanceAlert: jspb.Message.getFieldWithDefault(msg, 12, ""),
    suggestedGasCost: jspb.Message.getFieldWithDefault(msg, 13, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.Chain}
 */
proto.sgn.gateway.v1.Chain.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.Chain;
  return proto.sgn.gateway.v1.Chain.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.Chain} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.Chain}
 */
proto.sgn.gateway.v1.Chain.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setIcon(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setBlockDelay(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setGasTokenSymbol(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setExploreUrl(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setContractAddr(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setDropGasAmt(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setDropGasCostAmt(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setDropGasBalanceAlert(value);
      break;
    case 13:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setSuggestedGasCost(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.Chain.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.Chain.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.Chain} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.Chain.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getIcon();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getBlockDelay();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = message.getGasTokenSymbol();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getExploreUrl();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getContractAddr();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getDropGasAmt();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
  f = message.getDropGasCostAmt();
  if (f.length > 0) {
    writer.writeString(
      11,
      f
    );
  }
  f = message.getDropGasBalanceAlert();
  if (f.length > 0) {
    writer.writeString(
      12,
      f
    );
  }
  f = message.getSuggestedGasCost();
  if (f !== 0) {
    writer.writeUint64(
      13,
      f
    );
  }
};


/**
 * optional uint32 id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.Chain.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.Chain.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string icon = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.Chain.prototype.getIcon = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setIcon = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional uint32 block_delay = 4;
 * @return {number}
 */
proto.sgn.gateway.v1.Chain.prototype.getBlockDelay = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setBlockDelay = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional string gas_token_symbol = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.Chain.prototype.getGasTokenSymbol = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setGasTokenSymbol = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string explore_url = 6;
 * @return {string}
 */
proto.sgn.gateway.v1.Chain.prototype.getExploreUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setExploreUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string contract_addr = 8;
 * @return {string}
 */
proto.sgn.gateway.v1.Chain.prototype.getContractAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setContractAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional string drop_gas_amt = 9;
 * @return {string}
 */
proto.sgn.gateway.v1.Chain.prototype.getDropGasAmt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setDropGasAmt = function(value) {
  return jspb.Message.setProto3StringField(this, 9, value);
};


/**
 * optional string drop_gas_cost_amt = 11;
 * @return {string}
 */
proto.sgn.gateway.v1.Chain.prototype.getDropGasCostAmt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setDropGasCostAmt = function(value) {
  return jspb.Message.setProto3StringField(this, 11, value);
};


/**
 * optional string drop_gas_balance_alert = 12;
 * @return {string}
 */
proto.sgn.gateway.v1.Chain.prototype.getDropGasBalanceAlert = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 12, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setDropGasBalanceAlert = function(value) {
  return jspb.Message.setProto3StringField(this, 12, value);
};


/**
 * optional uint64 suggested_gas_cost = 13;
 * @return {number}
 */
proto.sgn.gateway.v1.Chain.prototype.getSuggestedGasCost = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 13, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.Chain} returns this
 */
proto.sgn.gateway.v1.Chain.prototype.setSuggestedGasCost = function(value) {
  return jspb.Message.setProto3IntField(this, 13, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.ChainTokenInfo.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ChainTokenInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ChainTokenInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ChainTokenInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ChainTokenInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    tokenList: jspb.Message.toObjectList(msg.getTokenList(),
    proto.sgn.gateway.v1.TokenInfo.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ChainTokenInfo}
 */
proto.sgn.gateway.v1.ChainTokenInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ChainTokenInfo;
  return proto.sgn.gateway.v1.ChainTokenInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ChainTokenInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ChainTokenInfo}
 */
proto.sgn.gateway.v1.ChainTokenInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.TokenInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.TokenInfo.deserializeBinaryFromReader);
      msg.addToken(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ChainTokenInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ChainTokenInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ChainTokenInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ChainTokenInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTokenList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.sgn.gateway.v1.TokenInfo.serializeBinaryToWriter
    );
  }
};


/**
 * repeated TokenInfo token = 1;
 * @return {!Array<!proto.sgn.gateway.v1.TokenInfo>}
 */
proto.sgn.gateway.v1.ChainTokenInfo.prototype.getTokenList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.TokenInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.TokenInfo, 1));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.TokenInfo>} value
 * @return {!proto.sgn.gateway.v1.ChainTokenInfo} returns this
*/
proto.sgn.gateway.v1.ChainTokenInfo.prototype.setTokenList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sgn.gateway.v1.TokenInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.TokenInfo}
 */
proto.sgn.gateway.v1.ChainTokenInfo.prototype.addToken = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sgn.gateway.v1.TokenInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.ChainTokenInfo} returns this
 */
proto.sgn.gateway.v1.ChainTokenInfo.prototype.clearTokenList = function() {
  return this.setTokenList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.TokenInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.TokenInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.TokenInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TokenInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    token: (f = msg.getToken()) && sgn_cbridge_v1_query_pb.Token.toObject(includeInstance, f),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    icon: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.TokenInfo}
 */
proto.sgn.gateway.v1.TokenInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.TokenInfo;
  return proto.sgn.gateway.v1.TokenInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.TokenInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.TokenInfo}
 */
proto.sgn.gateway.v1.TokenInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new sgn_cbridge_v1_query_pb.Token;
      reader.readMessage(value,sgn_cbridge_v1_query_pb.Token.deserializeBinaryFromReader);
      msg.setToken(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setIcon(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.TokenInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.TokenInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.TokenInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TokenInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getToken();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      sgn_cbridge_v1_query_pb.Token.serializeBinaryToWriter
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getIcon();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional sgn.cbridge.v1.Token token = 1;
 * @return {?proto.sgn.cbridge.v1.Token}
 */
proto.sgn.gateway.v1.TokenInfo.prototype.getToken = function() {
  return /** @type{?proto.sgn.cbridge.v1.Token} */ (
    jspb.Message.getWrapperField(this, sgn_cbridge_v1_query_pb.Token, 1));
};


/**
 * @param {?proto.sgn.cbridge.v1.Token|undefined} value
 * @return {!proto.sgn.gateway.v1.TokenInfo} returns this
*/
proto.sgn.gateway.v1.TokenInfo.prototype.setToken = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.TokenInfo} returns this
 */
proto.sgn.gateway.v1.TokenInfo.prototype.clearToken = function() {
  return this.setToken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.TokenInfo.prototype.hasToken = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.TokenInfo.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TokenInfo} returns this
 */
proto.sgn.gateway.v1.TokenInfo.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string icon = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.TokenInfo.prototype.getIcon = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TokenInfo} returns this
 */
proto.sgn.gateway.v1.TokenInfo.prototype.setIcon = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.TransferInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.TransferInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.TransferInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TransferInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    chain: (f = msg.getChain()) && proto.sgn.gateway.v1.Chain.toObject(includeInstance, f),
    token: (f = msg.getToken()) && sgn_cbridge_v1_query_pb.Token.toObject(includeInstance, f),
    amount: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.TransferInfo}
 */
proto.sgn.gateway.v1.TransferInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.TransferInfo;
  return proto.sgn.gateway.v1.TransferInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.TransferInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.TransferInfo}
 */
proto.sgn.gateway.v1.TransferInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.Chain;
      reader.readMessage(value,proto.sgn.gateway.v1.Chain.deserializeBinaryFromReader);
      msg.setChain(value);
      break;
    case 2:
      var value = new sgn_cbridge_v1_query_pb.Token;
      reader.readMessage(value,sgn_cbridge_v1_query_pb.Token.deserializeBinaryFromReader);
      msg.setToken(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAmount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.TransferInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.TransferInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.TransferInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TransferInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChain();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.Chain.serializeBinaryToWriter
    );
  }
  f = message.getToken();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      sgn_cbridge_v1_query_pb.Token.serializeBinaryToWriter
    );
  }
  f = message.getAmount();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional Chain chain = 1;
 * @return {?proto.sgn.gateway.v1.Chain}
 */
proto.sgn.gateway.v1.TransferInfo.prototype.getChain = function() {
  return /** @type{?proto.sgn.gateway.v1.Chain} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.Chain, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.Chain|undefined} value
 * @return {!proto.sgn.gateway.v1.TransferInfo} returns this
*/
proto.sgn.gateway.v1.TransferInfo.prototype.setChain = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.TransferInfo} returns this
 */
proto.sgn.gateway.v1.TransferInfo.prototype.clearChain = function() {
  return this.setChain(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.TransferInfo.prototype.hasChain = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional sgn.cbridge.v1.Token token = 2;
 * @return {?proto.sgn.cbridge.v1.Token}
 */
proto.sgn.gateway.v1.TransferInfo.prototype.getToken = function() {
  return /** @type{?proto.sgn.cbridge.v1.Token} */ (
    jspb.Message.getWrapperField(this, sgn_cbridge_v1_query_pb.Token, 2));
};


/**
 * @param {?proto.sgn.cbridge.v1.Token|undefined} value
 * @return {!proto.sgn.gateway.v1.TransferInfo} returns this
*/
proto.sgn.gateway.v1.TransferInfo.prototype.setToken = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.TransferInfo} returns this
 */
proto.sgn.gateway.v1.TransferInfo.prototype.clearToken = function() {
  return this.setToken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.TransferInfo.prototype.hasToken = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string amount = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.TransferInfo.prototype.getAmount = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TransferInfo} returns this
 */
proto.sgn.gateway.v1.TransferInfo.prototype.setAmount = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetTransferStatusRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetTransferStatusRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetTransferStatusRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTransferStatusRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    transferId: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetTransferStatusRequest}
 */
proto.sgn.gateway.v1.GetTransferStatusRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetTransferStatusRequest;
  return proto.sgn.gateway.v1.GetTransferStatusRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetTransferStatusRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetTransferStatusRequest}
 */
proto.sgn.gateway.v1.GetTransferStatusRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTransferId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetTransferStatusRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetTransferStatusRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetTransferStatusRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTransferStatusRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransferId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string transfer_id = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.GetTransferStatusRequest.prototype.getTransferId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusRequest} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusRequest.prototype.setTransferId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.repeatedFields_ = [4,5,6];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetTransferStatusResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetTransferStatusResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    status: jspb.Message.getFieldWithDefault(msg, 2, 0),
    wdOnchain: msg.getWdOnchain_asB64(),
    sortedSigsList: msg.getSortedSigsList_asB64(),
    signersList: msg.getSignersList_asB64(),
    powersList: msg.getPowersList_asB64(),
    refundReason: jspb.Message.getFieldWithDefault(msg, 7, 0),
    blockDelay: jspb.Message.getFieldWithDefault(msg, 8, 0),
    srcBlockTxLink: jspb.Message.getFieldWithDefault(msg, 9, ""),
    dstBlockTxLink: jspb.Message.getFieldWithDefault(msg, 10, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetTransferStatusResponse;
  return proto.sgn.gateway.v1.GetTransferStatusResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetTransferStatusResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {!proto.sgn.cbridge.v1.TransferHistoryStatus} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setWdOnchain(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addSortedSigs(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addSigners(value);
      break;
    case 6:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addPowers(value);
      break;
    case 7:
      var value = /** @type {!proto.sgn.cbridge.v1.XferStatus} */ (reader.readEnum());
      msg.setRefundReason(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setBlockDelay(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setSrcBlockTxLink(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setDstBlockTxLink(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetTransferStatusResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetTransferStatusResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getWdOnchain_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = message.getSortedSigsList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      4,
      f
    );
  }
  f = message.getSignersList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      5,
      f
    );
  }
  f = message.getPowersList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      6,
      f
    );
  }
  f = message.getRefundReason();
  if (f !== 0.0) {
    writer.writeEnum(
      7,
      f
    );
  }
  f = message.getBlockDelay();
  if (f !== 0) {
    writer.writeUint32(
      8,
      f
    );
  }
  f = message.getSrcBlockTxLink();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
  f = message.getDstBlockTxLink();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
*/
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional sgn.cbridge.v1.TransferHistoryStatus status = 2;
 * @return {!proto.sgn.cbridge.v1.TransferHistoryStatus}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getStatus = function() {
  return /** @type {!proto.sgn.cbridge.v1.TransferHistoryStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.sgn.cbridge.v1.TransferHistoryStatus} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional bytes wd_onchain = 3;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getWdOnchain = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * optional bytes wd_onchain = 3;
 * This is a type-conversion wrapper around `getWdOnchain()`
 * @return {string}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getWdOnchain_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getWdOnchain()));
};


/**
 * optional bytes wd_onchain = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getWdOnchain()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getWdOnchain_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getWdOnchain()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.setWdOnchain = function(value) {
  return jspb.Message.setProto3BytesField(this, 3, value);
};


/**
 * repeated bytes sorted_sigs = 4;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getSortedSigsList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * repeated bytes sorted_sigs = 4;
 * This is a type-conversion wrapper around `getSortedSigsList()`
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getSortedSigsList_asB64 = function() {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(
      this.getSortedSigsList()));
};


/**
 * repeated bytes sorted_sigs = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSortedSigsList()`
 * @return {!Array<!Uint8Array>}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getSortedSigsList_asU8 = function() {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getSortedSigsList()));
};


/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.setSortedSigsList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.addSortedSigs = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.clearSortedSigsList = function() {
  return this.setSortedSigsList([]);
};


/**
 * repeated bytes signers = 5;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getSignersList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(this, 5));
};


/**
 * repeated bytes signers = 5;
 * This is a type-conversion wrapper around `getSignersList()`
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getSignersList_asB64 = function() {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(
      this.getSignersList()));
};


/**
 * repeated bytes signers = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSignersList()`
 * @return {!Array<!Uint8Array>}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getSignersList_asU8 = function() {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getSignersList()));
};


/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.setSignersList = function(value) {
  return jspb.Message.setField(this, 5, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.addSigners = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 5, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.clearSignersList = function() {
  return this.setSignersList([]);
};


/**
 * repeated bytes powers = 6;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getPowersList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(this, 6));
};


/**
 * repeated bytes powers = 6;
 * This is a type-conversion wrapper around `getPowersList()`
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getPowersList_asB64 = function() {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(
      this.getPowersList()));
};


/**
 * repeated bytes powers = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPowersList()`
 * @return {!Array<!Uint8Array>}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getPowersList_asU8 = function() {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getPowersList()));
};


/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.setPowersList = function(value) {
  return jspb.Message.setField(this, 6, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.addPowers = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 6, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.clearPowersList = function() {
  return this.setPowersList([]);
};


/**
 * optional sgn.cbridge.v1.XferStatus refund_reason = 7;
 * @return {!proto.sgn.cbridge.v1.XferStatus}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getRefundReason = function() {
  return /** @type {!proto.sgn.cbridge.v1.XferStatus} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {!proto.sgn.cbridge.v1.XferStatus} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.setRefundReason = function(value) {
  return jspb.Message.setProto3EnumField(this, 7, value);
};


/**
 * optional uint32 block_delay = 8;
 * @return {number}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getBlockDelay = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.setBlockDelay = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};


/**
 * optional string src_block_tx_link = 9;
 * @return {string}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getSrcBlockTxLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.setSrcBlockTxLink = function(value) {
  return jspb.Message.setProto3StringField(this, 9, value);
};


/**
 * optional string dst_block_tx_link = 10;
 * @return {string}
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.getDstBlockTxLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetTransferStatusResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferStatusResponse.prototype.setDstBlockTxLink = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetTransferConfigsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetTransferConfigsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetTransferConfigsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTransferConfigsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsRequest}
 */
proto.sgn.gateway.v1.GetTransferConfigsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetTransferConfigsRequest;
  return proto.sgn.gateway.v1.GetTransferConfigsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetTransferConfigsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsRequest}
 */
proto.sgn.gateway.v1.GetTransferConfigsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetTransferConfigsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetTransferConfigsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetTransferConfigsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTransferConfigsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.repeatedFields_ = [2,5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetTransferConfigsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetTransferConfigsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    chainsList: jspb.Message.toObjectList(msg.getChainsList(),
    proto.sgn.gateway.v1.Chain.toObject, includeInstance),
    chainTokenMap: (f = msg.getChainTokenMap()) ? f.toObject(includeInstance, proto.sgn.gateway.v1.ChainTokenInfo.toObject) : [],
    farmingRewardContractAddr: jspb.Message.getFieldWithDefault(msg, 4, ""),
    peggedPairConfigsList: jspb.Message.toObjectList(msg.getPeggedPairConfigsList(),
    proto.sgn.gateway.v1.PeggedPairConfig.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsResponse}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetTransferConfigsResponse;
  return proto.sgn.gateway.v1.GetTransferConfigsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetTransferConfigsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsResponse}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.Chain;
      reader.readMessage(value,proto.sgn.gateway.v1.Chain.deserializeBinaryFromReader);
      msg.addChains(value);
      break;
    case 3:
      var value = msg.getChainTokenMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readMessage, proto.sgn.gateway.v1.ChainTokenInfo.deserializeBinaryFromReader, 0, new proto.sgn.gateway.v1.ChainTokenInfo());
         });
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setFarmingRewardContractAddr(value);
      break;
    case 5:
      var value = new proto.sgn.gateway.v1.PeggedPairConfig;
      reader.readMessage(value,proto.sgn.gateway.v1.PeggedPairConfig.deserializeBinaryFromReader);
      msg.addPeggedPairConfigs(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetTransferConfigsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetTransferConfigsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getChainsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.sgn.gateway.v1.Chain.serializeBinaryToWriter
    );
  }
  f = message.getChainTokenMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeMessage, proto.sgn.gateway.v1.ChainTokenInfo.serializeBinaryToWriter);
  }
  f = message.getFarmingRewardContractAddr();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPeggedPairConfigsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.sgn.gateway.v1.PeggedPairConfig.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsResponse} returns this
*/
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated Chain chains = 2;
 * @return {!Array<!proto.sgn.gateway.v1.Chain>}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.getChainsList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.Chain>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.Chain, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.Chain>} value
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsResponse} returns this
*/
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.setChainsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.gateway.v1.Chain=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.Chain}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.addChains = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.gateway.v1.Chain, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.clearChainsList = function() {
  return this.setChainsList([]);
};


/**
 * map<uint32, ChainTokenInfo> chain_token = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,!proto.sgn.gateway.v1.ChainTokenInfo>}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.getChainTokenMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<number,!proto.sgn.gateway.v1.ChainTokenInfo>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      proto.sgn.gateway.v1.ChainTokenInfo));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.clearChainTokenMap = function() {
  this.getChainTokenMap().clear();
  return this;};


/**
 * optional string farming_reward_contract_addr = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.getFarmingRewardContractAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.setFarmingRewardContractAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * repeated PeggedPairConfig pegged_pair_configs = 5;
 * @return {!Array<!proto.sgn.gateway.v1.PeggedPairConfig>}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.getPeggedPairConfigsList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.PeggedPairConfig>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.PeggedPairConfig, 5));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.PeggedPairConfig>} value
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsResponse} returns this
*/
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.setPeggedPairConfigsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.sgn.gateway.v1.PeggedPairConfig=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig}
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.addPeggedPairConfigs = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.sgn.gateway.v1.PeggedPairConfig, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetTransferConfigsResponse} returns this
 */
proto.sgn.gateway.v1.GetTransferConfigsResponse.prototype.clearPeggedPairConfigsList = function() {
  return this.setPeggedPairConfigsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.PeggedPairConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.PeggedPairConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.PeggedPairConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    orgChainId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    orgToken: (f = msg.getOrgToken()) && proto.sgn.gateway.v1.TokenInfo.toObject(includeInstance, f),
    peggedChainId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    peggedToken: (f = msg.getPeggedToken()) && proto.sgn.gateway.v1.TokenInfo.toObject(includeInstance, f),
    peggedDepositContractAddr: jspb.Message.getFieldWithDefault(msg, 5, ""),
    peggedBurnContractAddr: jspb.Message.getFieldWithDefault(msg, 6, ""),
    canonicalTokenContractAddr: jspb.Message.getFieldWithDefault(msg, 7, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig}
 */
proto.sgn.gateway.v1.PeggedPairConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.PeggedPairConfig;
  return proto.sgn.gateway.v1.PeggedPairConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.PeggedPairConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig}
 */
proto.sgn.gateway.v1.PeggedPairConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setOrgChainId(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.TokenInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.TokenInfo.deserializeBinaryFromReader);
      msg.setOrgToken(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setPeggedChainId(value);
      break;
    case 4:
      var value = new proto.sgn.gateway.v1.TokenInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.TokenInfo.deserializeBinaryFromReader);
      msg.setPeggedToken(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPeggedDepositContractAddr(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setPeggedBurnContractAddr(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setCanonicalTokenContractAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.PeggedPairConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.PeggedPairConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.PeggedPairConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrgChainId();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getOrgToken();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sgn.gateway.v1.TokenInfo.serializeBinaryToWriter
    );
  }
  f = message.getPeggedChainId();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = message.getPeggedToken();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.sgn.gateway.v1.TokenInfo.serializeBinaryToWriter
    );
  }
  f = message.getPeggedDepositContractAddr();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getPeggedBurnContractAddr();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getCanonicalTokenContractAddr();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional uint32 org_chain_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.getOrgChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig} returns this
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.setOrgChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional TokenInfo org_token = 2;
 * @return {?proto.sgn.gateway.v1.TokenInfo}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.getOrgToken = function() {
  return /** @type{?proto.sgn.gateway.v1.TokenInfo} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.TokenInfo, 2));
};


/**
 * @param {?proto.sgn.gateway.v1.TokenInfo|undefined} value
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig} returns this
*/
proto.sgn.gateway.v1.PeggedPairConfig.prototype.setOrgToken = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig} returns this
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.clearOrgToken = function() {
  return this.setOrgToken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.hasOrgToken = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional uint32 pegged_chain_id = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.getPeggedChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig} returns this
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.setPeggedChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional TokenInfo pegged_token = 4;
 * @return {?proto.sgn.gateway.v1.TokenInfo}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.getPeggedToken = function() {
  return /** @type{?proto.sgn.gateway.v1.TokenInfo} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.TokenInfo, 4));
};


/**
 * @param {?proto.sgn.gateway.v1.TokenInfo|undefined} value
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig} returns this
*/
proto.sgn.gateway.v1.PeggedPairConfig.prototype.setPeggedToken = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig} returns this
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.clearPeggedToken = function() {
  return this.setPeggedToken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.hasPeggedToken = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string pegged_deposit_contract_addr = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.getPeggedDepositContractAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig} returns this
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.setPeggedDepositContractAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string pegged_burn_contract_addr = 6;
 * @return {string}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.getPeggedBurnContractAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig} returns this
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.setPeggedBurnContractAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string canonical_token_contract_addr = 7;
 * @return {string}
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.getCanonicalTokenContractAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.PeggedPairConfig} returns this
 */
proto.sgn.gateway.v1.PeggedPairConfig.prototype.setCanonicalTokenContractAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetTokenInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetTokenInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetTokenInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTokenInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    chainId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    tokenSymbol: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetTokenInfoRequest}
 */
proto.sgn.gateway.v1.GetTokenInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetTokenInfoRequest;
  return proto.sgn.gateway.v1.GetTokenInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetTokenInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetTokenInfoRequest}
 */
proto.sgn.gateway.v1.GetTokenInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setChainId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenSymbol(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetTokenInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetTokenInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetTokenInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTokenInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getTokenSymbol();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional uint32 chain_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.GetTokenInfoRequest.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetTokenInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetTokenInfoRequest.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string token_symbol = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.GetTokenInfoRequest.prototype.getTokenSymbol = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetTokenInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetTokenInfoRequest.prototype.setTokenSymbol = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetTokenInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetTokenInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    tokenInfo: (f = msg.getTokenInfo()) && proto.sgn.gateway.v1.TokenInfo.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetTokenInfoResponse}
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetTokenInfoResponse;
  return proto.sgn.gateway.v1.GetTokenInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetTokenInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetTokenInfoResponse}
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.TokenInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.TokenInfo.deserializeBinaryFromReader);
      msg.setTokenInfo(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetTokenInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetTokenInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getTokenInfo();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sgn.gateway.v1.TokenInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetTokenInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetTokenInfoResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetTokenInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional TokenInfo token_info = 2;
 * @return {?proto.sgn.gateway.v1.TokenInfo}
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.prototype.getTokenInfo = function() {
  return /** @type{?proto.sgn.gateway.v1.TokenInfo} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.TokenInfo, 2));
};


/**
 * @param {?proto.sgn.gateway.v1.TokenInfo|undefined} value
 * @return {!proto.sgn.gateway.v1.GetTokenInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetTokenInfoResponse.prototype.setTokenInfo = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetTokenInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.prototype.clearTokenInfo = function() {
  return this.setTokenInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetTokenInfoResponse.prototype.hasTokenInfo = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.EstimateAmtRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.EstimateAmtRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.EstimateAmtRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    srcChainId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    dstChainId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    tokenSymbol: jspb.Message.getFieldWithDefault(msg, 3, ""),
    amt: jspb.Message.getFieldWithDefault(msg, 4, ""),
    usrAddr: jspb.Message.getFieldWithDefault(msg, 5, ""),
    slippageTolerance: jspb.Message.getFieldWithDefault(msg, 6, 0),
    isPegged: jspb.Message.getBooleanFieldWithDefault(msg, 7, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.EstimateAmtRequest}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.EstimateAmtRequest;
  return proto.sgn.gateway.v1.EstimateAmtRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.EstimateAmtRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.EstimateAmtRequest}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSrcChainId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setDstChainId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenSymbol(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setAmt(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setUsrAddr(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSlippageTolerance(value);
      break;
    case 7:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsPegged(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.EstimateAmtRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.EstimateAmtRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.EstimateAmtRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSrcChainId();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getDstChainId();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getTokenSymbol();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getAmt();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getUsrAddr();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getSlippageTolerance();
  if (f !== 0) {
    writer.writeUint32(
      6,
      f
    );
  }
  f = message.getIsPegged();
  if (f) {
    writer.writeBool(
      7,
      f
    );
  }
};


/**
 * optional uint32 src_chain_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.getSrcChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.setSrcChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint32 dst_chain_id = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.getDstChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.setDstChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string token_symbol = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.getTokenSymbol = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.setTokenSymbol = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string amt = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.getAmt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.setAmt = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string usr_addr = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.getUsrAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.setUsrAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional uint32 slippage_tolerance = 6;
 * @return {number}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.getSlippageTolerance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.setSlippageTolerance = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional bool is_pegged = 7;
 * @return {boolean}
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.getIsPegged = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 7, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateAmtRequest.prototype.setIsPegged = function(value) {
  return jspb.Message.setProto3BooleanField(this, 7, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.EstimateAmtResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.EstimateAmtResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.EstimateAmtResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    eqValueTokenAmt: jspb.Message.getFieldWithDefault(msg, 2, ""),
    bridgeRate: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    percFee: jspb.Message.getFieldWithDefault(msg, 4, ""),
    baseFee: jspb.Message.getFieldWithDefault(msg, 7, ""),
    slippageTolerance: jspb.Message.getFieldWithDefault(msg, 5, 0),
    maxSlippage: jspb.Message.getFieldWithDefault(msg, 6, 0),
    estimatedReceiveAmt: jspb.Message.getFieldWithDefault(msg, 8, ""),
    dropGasAmt: jspb.Message.getFieldWithDefault(msg, 9, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.EstimateAmtResponse;
  return proto.sgn.gateway.v1.EstimateAmtResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.EstimateAmtResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setEqValueTokenAmt(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBridgeRate(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setPercFee(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setBaseFee(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSlippageTolerance(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setMaxSlippage(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setEstimatedReceiveAmt(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setDropGasAmt(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.EstimateAmtResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.EstimateAmtResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.EstimateAmtResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getEqValueTokenAmt();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getBridgeRate();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = message.getPercFee();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getBaseFee();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getSlippageTolerance();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
  f = message.getMaxSlippage();
  if (f !== 0) {
    writer.writeUint32(
      6,
      f
    );
  }
  f = message.getEstimatedReceiveAmt();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getDropGasAmt();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse} returns this
*/
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string eq_value_token_amt = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.getEqValueTokenAmt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.setEqValueTokenAmt = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional float bridge_rate = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.getBridgeRate = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.setBridgeRate = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional string perc_fee = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.getPercFee = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.setPercFee = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string base_fee = 7;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.getBaseFee = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.setBaseFee = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional uint32 slippage_tolerance = 5;
 * @return {number}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.getSlippageTolerance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.setSlippageTolerance = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional uint32 max_slippage = 6;
 * @return {number}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.getMaxSlippage = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.setMaxSlippage = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional string estimated_receive_amt = 8;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.getEstimatedReceiveAmt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.setEstimatedReceiveAmt = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional string drop_gas_amt = 9;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.getDropGasAmt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateAmtResponse.prototype.setDropGasAmt = function(value) {
  return jspb.Message.setProto3StringField(this, 9, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.WithdrawInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.WithdrawInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.WithdrawInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.WithdrawInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    chainId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    amount: jspb.Message.getFieldWithDefault(msg, 2, ""),
    slippageTolerance: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.WithdrawInfo}
 */
proto.sgn.gateway.v1.WithdrawInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.WithdrawInfo;
  return proto.sgn.gateway.v1.WithdrawInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.WithdrawInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.WithdrawInfo}
 */
proto.sgn.gateway.v1.WithdrawInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setChainId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setAmount(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSlippageTolerance(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.WithdrawInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.WithdrawInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.WithdrawInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.WithdrawInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getAmount();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSlippageTolerance();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
};


/**
 * optional uint32 chain_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.WithdrawInfo.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.WithdrawInfo} returns this
 */
proto.sgn.gateway.v1.WithdrawInfo.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string amount = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.WithdrawInfo.prototype.getAmount = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.WithdrawInfo} returns this
 */
proto.sgn.gateway.v1.WithdrawInfo.prototype.setAmount = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional uint32 slippage_tolerance = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.WithdrawInfo.prototype.getSlippageTolerance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.WithdrawInfo} returns this
 */
proto.sgn.gateway.v1.WithdrawInfo.prototype.setSlippageTolerance = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.EstimateWithdrawAmtRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    srcWithdrawsList: jspb.Message.toObjectList(msg.getSrcWithdrawsList(),
    proto.sgn.gateway.v1.WithdrawInfo.toObject, includeInstance),
    dstChainId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    tokenSymbol: jspb.Message.getFieldWithDefault(msg, 3, ""),
    usrAddr: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtRequest}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.EstimateWithdrawAmtRequest;
  return proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.EstimateWithdrawAmtRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtRequest}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.WithdrawInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.WithdrawInfo.deserializeBinaryFromReader);
      msg.addSrcWithdraws(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setDstChainId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenSymbol(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setUsrAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.EstimateWithdrawAmtRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSrcWithdrawsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.sgn.gateway.v1.WithdrawInfo.serializeBinaryToWriter
    );
  }
  f = message.getDstChainId();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getTokenSymbol();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getUsrAddr();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * repeated WithdrawInfo src_withdraws = 1;
 * @return {!Array<!proto.sgn.gateway.v1.WithdrawInfo>}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.getSrcWithdrawsList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.WithdrawInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.WithdrawInfo, 1));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.WithdrawInfo>} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtRequest} returns this
*/
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.setSrcWithdrawsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sgn.gateway.v1.WithdrawInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.WithdrawInfo}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.addSrcWithdraws = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sgn.gateway.v1.WithdrawInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.clearSrcWithdrawsList = function() {
  return this.setSrcWithdrawsList([]);
};


/**
 * optional uint32 dst_chain_id = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.getDstChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.setDstChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string token_symbol = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.getTokenSymbol = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.setTokenSymbol = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string usr_addr = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.getUsrAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtRequest} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtRequest.prototype.setUsrAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.EstimateWithdrawAmtResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    reqAmtMap: (f = msg.getReqAmtMap()) ? f.toObject(includeInstance, proto.sgn.gateway.v1.EstimateWithdrawAmt.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtResponse}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.EstimateWithdrawAmtResponse;
  return proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.EstimateWithdrawAmtResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtResponse}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = msg.getReqAmtMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readMessage, proto.sgn.gateway.v1.EstimateWithdrawAmt.deserializeBinaryFromReader, 0, new proto.sgn.gateway.v1.EstimateWithdrawAmt());
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.EstimateWithdrawAmtResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getReqAmtMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeMessage, proto.sgn.gateway.v1.EstimateWithdrawAmt.serializeBinaryToWriter);
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtResponse} returns this
*/
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * map<uint32, EstimateWithdrawAmt> req_amt = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,!proto.sgn.gateway.v1.EstimateWithdrawAmt>}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.prototype.getReqAmtMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<number,!proto.sgn.gateway.v1.EstimateWithdrawAmt>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      proto.sgn.gateway.v1.EstimateWithdrawAmt));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmtResponse} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmtResponse.prototype.clearReqAmtMap = function() {
  this.getReqAmtMap().clear();
  return this;};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.EstimateWithdrawAmt.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.EstimateWithdrawAmt} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.toObject = function(includeInstance, msg) {
  var f, obj = {
    eqValueTokenAmt: jspb.Message.getFieldWithDefault(msg, 1, ""),
    bridgeRate: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    percFee: jspb.Message.getFieldWithDefault(msg, 3, ""),
    baseFee: jspb.Message.getFieldWithDefault(msg, 4, ""),
    slippageTolerance: jspb.Message.getFieldWithDefault(msg, 5, 0),
    maxSlippage: jspb.Message.getFieldWithDefault(msg, 6, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmt}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.EstimateWithdrawAmt;
  return proto.sgn.gateway.v1.EstimateWithdrawAmt.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.EstimateWithdrawAmt} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmt}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setEqValueTokenAmt(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBridgeRate(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setPercFee(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setBaseFee(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSlippageTolerance(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setMaxSlippage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.EstimateWithdrawAmt.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.EstimateWithdrawAmt} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEqValueTokenAmt();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getBridgeRate();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = message.getPercFee();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getBaseFee();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getSlippageTolerance();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
  f = message.getMaxSlippage();
  if (f !== 0) {
    writer.writeUint32(
      6,
      f
    );
  }
};


/**
 * optional string eq_value_token_amt = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.getEqValueTokenAmt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmt} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.setEqValueTokenAmt = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional float bridge_rate = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.getBridgeRate = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmt} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.setBridgeRate = function(value) {
  return jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional string perc_fee = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.getPercFee = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmt} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.setPercFee = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string base_fee = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.getBaseFee = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmt} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.setBaseFee = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional uint32 slippage_tolerance = 5;
 * @return {number}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.getSlippageTolerance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmt} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.setSlippageTolerance = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional uint32 max_slippage = 6;
 * @return {number}
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.getMaxSlippage = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.EstimateWithdrawAmt} returns this
 */
proto.sgn.gateway.v1.EstimateWithdrawAmt.prototype.setMaxSlippage = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetLPInfoListRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetLPInfoListRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetLPInfoListRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetLPInfoListRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetLPInfoListRequest}
 */
proto.sgn.gateway.v1.GetLPInfoListRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetLPInfoListRequest;
  return proto.sgn.gateway.v1.GetLPInfoListRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetLPInfoListRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetLPInfoListRequest}
 */
proto.sgn.gateway.v1.GetLPInfoListRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetLPInfoListRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetLPInfoListRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetLPInfoListRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetLPInfoListRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.GetLPInfoListRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetLPInfoListRequest} returns this
 */
proto.sgn.gateway.v1.GetLPInfoListRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.LPInfo.repeatedFields_ = [13];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.LPInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.LPInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.LPInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.LPInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    chain: (f = msg.getChain()) && proto.sgn.gateway.v1.Chain.toObject(includeInstance, f),
    token: (f = msg.getToken()) && proto.sgn.gateway.v1.TokenInfo.toObject(includeInstance, f),
    liquidity: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    liquidityAmt: jspb.Message.getFieldWithDefault(msg, 4, ""),
    hasFarmingSessions: jspb.Message.getBooleanFieldWithDefault(msg, 5, false),
    lpFeeEarning: jspb.Message.getFloatingPointFieldWithDefault(msg, 6, 0.0),
    farmingRewardEarning: jspb.Message.getFloatingPointFieldWithDefault(msg, 7, 0.0),
    volume24h: jspb.Message.getFloatingPointFieldWithDefault(msg, 8, 0.0),
    totalLiquidity: jspb.Message.getFloatingPointFieldWithDefault(msg, 9, 0.0),
    totalLiquidityAmt: jspb.Message.getFieldWithDefault(msg, 10, ""),
    lpFeeEarningApy: jspb.Message.getFloatingPointFieldWithDefault(msg, 11, 0.0),
    farmingApy: jspb.Message.getFloatingPointFieldWithDefault(msg, 12, 0.0),
    farmingSessionTokensList: jspb.Message.toObjectList(msg.getFarmingSessionTokensList(),
    proto.sgn.gateway.v1.TokenInfo.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.LPInfo}
 */
proto.sgn.gateway.v1.LPInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.LPInfo;
  return proto.sgn.gateway.v1.LPInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.LPInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.LPInfo}
 */
proto.sgn.gateway.v1.LPInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.Chain;
      reader.readMessage(value,proto.sgn.gateway.v1.Chain.deserializeBinaryFromReader);
      msg.setChain(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.TokenInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.TokenInfo.deserializeBinaryFromReader);
      msg.setToken(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLiquidity(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setLiquidityAmt(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setHasFarmingSessions(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLpFeeEarning(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setFarmingRewardEarning(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setVolume24h(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setTotalLiquidity(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setTotalLiquidityAmt(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setLpFeeEarningApy(value);
      break;
    case 12:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setFarmingApy(value);
      break;
    case 13:
      var value = new proto.sgn.gateway.v1.TokenInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.TokenInfo.deserializeBinaryFromReader);
      msg.addFarmingSessionTokens(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.LPInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.LPInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.LPInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.LPInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChain();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.Chain.serializeBinaryToWriter
    );
  }
  f = message.getToken();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sgn.gateway.v1.TokenInfo.serializeBinaryToWriter
    );
  }
  f = message.getLiquidity();
  if (f !== 0.0) {
    writer.writeDouble(
      3,
      f
    );
  }
  f = message.getLiquidityAmt();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getHasFarmingSessions();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
  f = message.getLpFeeEarning();
  if (f !== 0.0) {
    writer.writeDouble(
      6,
      f
    );
  }
  f = message.getFarmingRewardEarning();
  if (f !== 0.0) {
    writer.writeDouble(
      7,
      f
    );
  }
  f = message.getVolume24h();
  if (f !== 0.0) {
    writer.writeDouble(
      8,
      f
    );
  }
  f = message.getTotalLiquidity();
  if (f !== 0.0) {
    writer.writeDouble(
      9,
      f
    );
  }
  f = message.getTotalLiquidityAmt();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getLpFeeEarningApy();
  if (f !== 0.0) {
    writer.writeDouble(
      11,
      f
    );
  }
  f = message.getFarmingApy();
  if (f !== 0.0) {
    writer.writeDouble(
      12,
      f
    );
  }
  f = message.getFarmingSessionTokensList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      13,
      f,
      proto.sgn.gateway.v1.TokenInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional Chain chain = 1;
 * @return {?proto.sgn.gateway.v1.Chain}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getChain = function() {
  return /** @type{?proto.sgn.gateway.v1.Chain} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.Chain, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.Chain|undefined} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
*/
proto.sgn.gateway.v1.LPInfo.prototype.setChain = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.clearChain = function() {
  return this.setChain(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.LPInfo.prototype.hasChain = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional TokenInfo token = 2;
 * @return {?proto.sgn.gateway.v1.TokenInfo}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getToken = function() {
  return /** @type{?proto.sgn.gateway.v1.TokenInfo} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.TokenInfo, 2));
};


/**
 * @param {?proto.sgn.gateway.v1.TokenInfo|undefined} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
*/
proto.sgn.gateway.v1.LPInfo.prototype.setToken = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.clearToken = function() {
  return this.setToken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.LPInfo.prototype.hasToken = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional double liquidity = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getLiquidity = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.setLiquidity = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional string liquidity_amt = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getLiquidityAmt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.setLiquidityAmt = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bool has_farming_sessions = 5;
 * @return {boolean}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getHasFarmingSessions = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.setHasFarmingSessions = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};


/**
 * optional double lp_fee_earning = 6;
 * @return {number}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getLpFeeEarning = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 6, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.setLpFeeEarning = function(value) {
  return jspb.Message.setProto3FloatField(this, 6, value);
};


/**
 * optional double farming_reward_earning = 7;
 * @return {number}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getFarmingRewardEarning = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 7, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.setFarmingRewardEarning = function(value) {
  return jspb.Message.setProto3FloatField(this, 7, value);
};


/**
 * optional double volume_24h = 8;
 * @return {number}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getVolume24h = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 8, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.setVolume24h = function(value) {
  return jspb.Message.setProto3FloatField(this, 8, value);
};


/**
 * optional double total_liquidity = 9;
 * @return {number}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getTotalLiquidity = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 9, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.setTotalLiquidity = function(value) {
  return jspb.Message.setProto3FloatField(this, 9, value);
};


/**
 * optional string total_liquidity_amt = 10;
 * @return {string}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getTotalLiquidityAmt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.setTotalLiquidityAmt = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional double lp_fee_earning_apy = 11;
 * @return {number}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getLpFeeEarningApy = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 11, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.setLpFeeEarningApy = function(value) {
  return jspb.Message.setProto3FloatField(this, 11, value);
};


/**
 * optional double farming_apy = 12;
 * @return {number}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getFarmingApy = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 12, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.setFarmingApy = function(value) {
  return jspb.Message.setProto3FloatField(this, 12, value);
};


/**
 * repeated TokenInfo farming_session_tokens = 13;
 * @return {!Array<!proto.sgn.gateway.v1.TokenInfo>}
 */
proto.sgn.gateway.v1.LPInfo.prototype.getFarmingSessionTokensList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.TokenInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.TokenInfo, 13));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.TokenInfo>} value
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
*/
proto.sgn.gateway.v1.LPInfo.prototype.setFarmingSessionTokensList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 13, value);
};


/**
 * @param {!proto.sgn.gateway.v1.TokenInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.TokenInfo}
 */
proto.sgn.gateway.v1.LPInfo.prototype.addFarmingSessionTokens = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 13, opt_value, proto.sgn.gateway.v1.TokenInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.LPInfo} returns this
 */
proto.sgn.gateway.v1.LPInfo.prototype.clearFarmingSessionTokensList = function() {
  return this.setFarmingSessionTokensList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetLPInfoListResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetLPInfoListResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    lpInfoList: jspb.Message.toObjectList(msg.getLpInfoList(),
    proto.sgn.gateway.v1.LPInfo.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetLPInfoListResponse}
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetLPInfoListResponse;
  return proto.sgn.gateway.v1.GetLPInfoListResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetLPInfoListResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetLPInfoListResponse}
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.LPInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.LPInfo.deserializeBinaryFromReader);
      msg.addLpInfo(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetLPInfoListResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetLPInfoListResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getLpInfoList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.sgn.gateway.v1.LPInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetLPInfoListResponse} returns this
*/
proto.sgn.gateway.v1.GetLPInfoListResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetLPInfoListResponse} returns this
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated LPInfo lp_info = 2;
 * @return {!Array<!proto.sgn.gateway.v1.LPInfo>}
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.prototype.getLpInfoList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.LPInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.LPInfo, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.LPInfo>} value
 * @return {!proto.sgn.gateway.v1.GetLPInfoListResponse} returns this
*/
proto.sgn.gateway.v1.GetLPInfoListResponse.prototype.setLpInfoList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.gateway.v1.LPInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.LPInfo}
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.prototype.addLpInfo = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.gateway.v1.LPInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetLPInfoListResponse} returns this
 */
proto.sgn.gateway.v1.GetLPInfoListResponse.prototype.clearLpInfoList = function() {
  return this.setLpInfoList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.WithdrawLiquidityRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.WithdrawLiquidityRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    withdrawReq: msg.getWithdrawReq_asB64(),
    sig: msg.getSig_asB64(),
    estimatedReceivedAmt: jspb.Message.getFieldWithDefault(msg, 3, ""),
    methodType: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityRequest}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.WithdrawLiquidityRequest;
  return proto.sgn.gateway.v1.WithdrawLiquidityRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.WithdrawLiquidityRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityRequest}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setWithdrawReq(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSig(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEstimatedReceivedAmt(value);
      break;
    case 4:
      var value = /** @type {!proto.sgn.gateway.v1.WithdrawMethodType} */ (reader.readEnum());
      msg.setMethodType(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.WithdrawLiquidityRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.WithdrawLiquidityRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getWithdrawReq_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getSig_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getEstimatedReceivedAmt();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMethodType();
  if (f !== 0.0) {
    writer.writeEnum(
      4,
      f
    );
  }
};


/**
 * optional bytes withdraw_req = 1;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.getWithdrawReq = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes withdraw_req = 1;
 * This is a type-conversion wrapper around `getWithdrawReq()`
 * @return {string}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.getWithdrawReq_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getWithdrawReq()));
};


/**
 * optional bytes withdraw_req = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getWithdrawReq()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.getWithdrawReq_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getWithdrawReq()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityRequest} returns this
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.setWithdrawReq = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bytes sig = 2;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.getSig = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes sig = 2;
 * This is a type-conversion wrapper around `getSig()`
 * @return {string}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.getSig_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSig()));
};


/**
 * optional bytes sig = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSig()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.getSig_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSig()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityRequest} returns this
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.setSig = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional string estimated_received_amt = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.getEstimatedReceivedAmt = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityRequest} returns this
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.setEstimatedReceivedAmt = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional WithdrawMethodType method_type = 4;
 * @return {!proto.sgn.gateway.v1.WithdrawMethodType}
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.getMethodType = function() {
  return /** @type {!proto.sgn.gateway.v1.WithdrawMethodType} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.sgn.gateway.v1.WithdrawMethodType} value
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityRequest} returns this
 */
proto.sgn.gateway.v1.WithdrawLiquidityRequest.prototype.setMethodType = function(value) {
  return jspb.Message.setProto3EnumField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.WithdrawLiquidityResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.WithdrawLiquidityResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    seqNum: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityResponse}
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.WithdrawLiquidityResponse;
  return proto.sgn.gateway.v1.WithdrawLiquidityResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.WithdrawLiquidityResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityResponse}
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setSeqNum(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.WithdrawLiquidityResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.WithdrawLiquidityResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getSeqNum();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityResponse} returns this
*/
proto.sgn.gateway.v1.WithdrawLiquidityResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityResponse} returns this
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint64 seq_num = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.prototype.getSeqNum = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.WithdrawLiquidityResponse} returns this
 */
proto.sgn.gateway.v1.WithdrawLiquidityResponse.prototype.setSeqNum = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.UnlockFarmingRewardRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.UnlockFarmingRewardRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UnlockFarmingRewardRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.UnlockFarmingRewardRequest}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.UnlockFarmingRewardRequest;
  return proto.sgn.gateway.v1.UnlockFarmingRewardRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.UnlockFarmingRewardRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.UnlockFarmingRewardRequest}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.UnlockFarmingRewardRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.UnlockFarmingRewardRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UnlockFarmingRewardRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.UnlockFarmingRewardRequest} returns this
 */
proto.sgn.gateway.v1.UnlockFarmingRewardRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.UnlockFarmingRewardResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.UnlockFarmingRewardResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UnlockFarmingRewardResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.UnlockFarmingRewardResponse}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.UnlockFarmingRewardResponse;
  return proto.sgn.gateway.v1.UnlockFarmingRewardResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.UnlockFarmingRewardResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.UnlockFarmingRewardResponse}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.UnlockFarmingRewardResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.UnlockFarmingRewardResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UnlockFarmingRewardResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.UnlockFarmingRewardResponse} returns this
*/
proto.sgn.gateway.v1.UnlockFarmingRewardResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.UnlockFarmingRewardResponse} returns this
 */
proto.sgn.gateway.v1.UnlockFarmingRewardResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.UnlockFarmingRewardResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest;
  return proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest} returns this
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    detailsList: jspb.Message.toObjectList(msg.getDetailsList(),
    sgn_farming_v1_farming_pb.RewardClaimDetails.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse;
  return proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new sgn_farming_v1_farming_pb.RewardClaimDetails;
      reader.readMessage(value,sgn_farming_v1_farming_pb.RewardClaimDetails.deserializeBinaryFromReader);
      msg.addDetails(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getDetailsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      sgn_farming_v1_farming_pb.RewardClaimDetails.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse} returns this
*/
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse} returns this
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated sgn.farming.v1.RewardClaimDetails details = 2;
 * @return {!Array<!proto.sgn.farming.v1.RewardClaimDetails>}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.prototype.getDetailsList = function() {
  return /** @type{!Array<!proto.sgn.farming.v1.RewardClaimDetails>} */ (
    jspb.Message.getRepeatedWrapperField(this, sgn_farming_v1_farming_pb.RewardClaimDetails, 2));
};


/**
 * @param {!Array<!proto.sgn.farming.v1.RewardClaimDetails>} value
 * @return {!proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse} returns this
*/
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.prototype.setDetailsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.farming.v1.RewardClaimDetails=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.farming.v1.RewardClaimDetails}
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.prototype.addDetails = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.farming.v1.RewardClaimDetails, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse} returns this
 */
proto.sgn.gateway.v1.GetFarmingRewardDetailsResponse.prototype.clearDetailsList = function() {
  return this.setDetailsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.QueryLiquidityStatusRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.QueryLiquidityStatusRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    seqNum: jspb.Message.getFieldWithDefault(msg, 1, 0),
    txHash: jspb.Message.getFieldWithDefault(msg, 2, ""),
    lpAddr: jspb.Message.getFieldWithDefault(msg, 3, ""),
    chainId: jspb.Message.getFieldWithDefault(msg, 4, 0),
    type: jspb.Message.getFieldWithDefault(msg, 5, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusRequest}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.QueryLiquidityStatusRequest;
  return proto.sgn.gateway.v1.QueryLiquidityStatusRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.QueryLiquidityStatusRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusRequest}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setSeqNum(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxHash(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setLpAddr(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setChainId(value);
      break;
    case 5:
      var value = /** @type {!proto.sgn.gateway.v1.LPType} */ (reader.readEnum());
      msg.setType(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.QueryLiquidityStatusRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.QueryLiquidityStatusRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSeqNum();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getTxHash();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getLpAddr();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      5,
      f
    );
  }
};


/**
 * optional uint64 seq_num = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.getSeqNum = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusRequest} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.setSeqNum = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string tx_hash = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.getTxHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusRequest} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.setTxHash = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string lp_addr = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.getLpAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusRequest} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.setLpAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional uint32 chain_id = 4;
 * @return {number}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusRequest} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional LPType type = 5;
 * @return {!proto.sgn.gateway.v1.LPType}
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.getType = function() {
  return /** @type {!proto.sgn.gateway.v1.LPType} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {!proto.sgn.gateway.v1.LPType} value
 * @return {!proto.sgn.gateway.v1.QueryLiquidityStatusRequest} returns this
 */
proto.sgn.gateway.v1.QueryLiquidityStatusRequest.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.TransferHistory.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.TransferHistory} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TransferHistory.toObject = function(includeInstance, msg) {
  var f, obj = {
    transferId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    srcSendInfo: (f = msg.getSrcSendInfo()) && proto.sgn.gateway.v1.TransferInfo.toObject(includeInstance, f),
    dstReceivedInfo: (f = msg.getDstReceivedInfo()) && proto.sgn.gateway.v1.TransferInfo.toObject(includeInstance, f),
    ts: jspb.Message.getFieldWithDefault(msg, 4, 0),
    srcBlockTxLink: jspb.Message.getFieldWithDefault(msg, 5, ""),
    dstBlockTxLink: jspb.Message.getFieldWithDefault(msg, 6, ""),
    status: jspb.Message.getFieldWithDefault(msg, 7, 0),
    refundReason: jspb.Message.getFieldWithDefault(msg, 8, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.TransferHistory}
 */
proto.sgn.gateway.v1.TransferHistory.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.TransferHistory;
  return proto.sgn.gateway.v1.TransferHistory.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.TransferHistory} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.TransferHistory}
 */
proto.sgn.gateway.v1.TransferHistory.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTransferId(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.TransferInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.TransferInfo.deserializeBinaryFromReader);
      msg.setSrcSendInfo(value);
      break;
    case 3:
      var value = new proto.sgn.gateway.v1.TransferInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.TransferInfo.deserializeBinaryFromReader);
      msg.setDstReceivedInfo(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTs(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setSrcBlockTxLink(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setDstBlockTxLink(value);
      break;
    case 7:
      var value = /** @type {!proto.sgn.cbridge.v1.TransferHistoryStatus} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    case 8:
      var value = /** @type {!proto.sgn.cbridge.v1.XferStatus} */ (reader.readEnum());
      msg.setRefundReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.TransferHistory.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.TransferHistory} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TransferHistory.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransferId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSrcSendInfo();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sgn.gateway.v1.TransferInfo.serializeBinaryToWriter
    );
  }
  f = message.getDstReceivedInfo();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.sgn.gateway.v1.TransferInfo.serializeBinaryToWriter
    );
  }
  f = message.getTs();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
  f = message.getSrcBlockTxLink();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getDstBlockTxLink();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      7,
      f
    );
  }
  f = message.getRefundReason();
  if (f !== 0.0) {
    writer.writeEnum(
      8,
      f
    );
  }
};


/**
 * optional string transfer_id = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.getTransferId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TransferHistory} returns this
 */
proto.sgn.gateway.v1.TransferHistory.prototype.setTransferId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional TransferInfo src_send_info = 2;
 * @return {?proto.sgn.gateway.v1.TransferInfo}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.getSrcSendInfo = function() {
  return /** @type{?proto.sgn.gateway.v1.TransferInfo} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.TransferInfo, 2));
};


/**
 * @param {?proto.sgn.gateway.v1.TransferInfo|undefined} value
 * @return {!proto.sgn.gateway.v1.TransferHistory} returns this
*/
proto.sgn.gateway.v1.TransferHistory.prototype.setSrcSendInfo = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.TransferHistory} returns this
 */
proto.sgn.gateway.v1.TransferHistory.prototype.clearSrcSendInfo = function() {
  return this.setSrcSendInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.hasSrcSendInfo = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional TransferInfo dst_received_info = 3;
 * @return {?proto.sgn.gateway.v1.TransferInfo}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.getDstReceivedInfo = function() {
  return /** @type{?proto.sgn.gateway.v1.TransferInfo} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.TransferInfo, 3));
};


/**
 * @param {?proto.sgn.gateway.v1.TransferInfo|undefined} value
 * @return {!proto.sgn.gateway.v1.TransferHistory} returns this
*/
proto.sgn.gateway.v1.TransferHistory.prototype.setDstReceivedInfo = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.TransferHistory} returns this
 */
proto.sgn.gateway.v1.TransferHistory.prototype.clearDstReceivedInfo = function() {
  return this.setDstReceivedInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.hasDstReceivedInfo = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional uint64 ts = 4;
 * @return {number}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.getTs = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TransferHistory} returns this
 */
proto.sgn.gateway.v1.TransferHistory.prototype.setTs = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional string src_block_tx_link = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.getSrcBlockTxLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TransferHistory} returns this
 */
proto.sgn.gateway.v1.TransferHistory.prototype.setSrcBlockTxLink = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string dst_block_tx_link = 6;
 * @return {string}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.getDstBlockTxLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TransferHistory} returns this
 */
proto.sgn.gateway.v1.TransferHistory.prototype.setDstBlockTxLink = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional sgn.cbridge.v1.TransferHistoryStatus status = 7;
 * @return {!proto.sgn.cbridge.v1.TransferHistoryStatus}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.getStatus = function() {
  return /** @type {!proto.sgn.cbridge.v1.TransferHistoryStatus} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {!proto.sgn.cbridge.v1.TransferHistoryStatus} value
 * @return {!proto.sgn.gateway.v1.TransferHistory} returns this
 */
proto.sgn.gateway.v1.TransferHistory.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 7, value);
};


/**
 * optional sgn.cbridge.v1.XferStatus refund_reason = 8;
 * @return {!proto.sgn.cbridge.v1.XferStatus}
 */
proto.sgn.gateway.v1.TransferHistory.prototype.getRefundReason = function() {
  return /** @type {!proto.sgn.cbridge.v1.XferStatus} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {!proto.sgn.cbridge.v1.XferStatus} value
 * @return {!proto.sgn.gateway.v1.TransferHistory} returns this
 */
proto.sgn.gateway.v1.TransferHistory.prototype.setRefundReason = function(value) {
  return jspb.Message.setProto3EnumField(this, 8, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.LPHistory.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.LPHistory.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.LPHistory} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.LPHistory.toObject = function(includeInstance, msg) {
  var f, obj = {
    chain: (f = msg.getChain()) && proto.sgn.gateway.v1.Chain.toObject(includeInstance, f),
    token: (f = msg.getToken()) && proto.sgn.gateway.v1.TokenInfo.toObject(includeInstance, f),
    amount: jspb.Message.getFieldWithDefault(msg, 3, ""),
    ts: jspb.Message.getFieldWithDefault(msg, 4, 0),
    blockTxLink: jspb.Message.getFieldWithDefault(msg, 5, ""),
    status: jspb.Message.getFieldWithDefault(msg, 6, 0),
    type: jspb.Message.getFieldWithDefault(msg, 7, 0),
    seqNum: jspb.Message.getFieldWithDefault(msg, 8, 0),
    methodType: jspb.Message.getFieldWithDefault(msg, 9, 0),
    nonce: jspb.Message.getFieldWithDefault(msg, 10, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.LPHistory}
 */
proto.sgn.gateway.v1.LPHistory.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.LPHistory;
  return proto.sgn.gateway.v1.LPHistory.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.LPHistory} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.LPHistory}
 */
proto.sgn.gateway.v1.LPHistory.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.Chain;
      reader.readMessage(value,proto.sgn.gateway.v1.Chain.deserializeBinaryFromReader);
      msg.setChain(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.TokenInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.TokenInfo.deserializeBinaryFromReader);
      msg.setToken(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAmount(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTs(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setBlockTxLink(value);
      break;
    case 6:
      var value = /** @type {!proto.sgn.cbridge.v1.WithdrawStatus} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    case 7:
      var value = /** @type {!proto.sgn.gateway.v1.LPType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setSeqNum(value);
      break;
    case 9:
      var value = /** @type {!proto.sgn.gateway.v1.WithdrawMethodType} */ (reader.readEnum());
      msg.setMethodType(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setNonce(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.LPHistory.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.LPHistory.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.LPHistory} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.LPHistory.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChain();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.Chain.serializeBinaryToWriter
    );
  }
  f = message.getToken();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sgn.gateway.v1.TokenInfo.serializeBinaryToWriter
    );
  }
  f = message.getAmount();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getTs();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
  f = message.getBlockTxLink();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      6,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      7,
      f
    );
  }
  f = message.getSeqNum();
  if (f !== 0) {
    writer.writeUint64(
      8,
      f
    );
  }
  f = message.getMethodType();
  if (f !== 0.0) {
    writer.writeEnum(
      9,
      f
    );
  }
  f = message.getNonce();
  if (f !== 0) {
    writer.writeUint64(
      10,
      f
    );
  }
};


/**
 * optional Chain chain = 1;
 * @return {?proto.sgn.gateway.v1.Chain}
 */
proto.sgn.gateway.v1.LPHistory.prototype.getChain = function() {
  return /** @type{?proto.sgn.gateway.v1.Chain} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.Chain, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.Chain|undefined} value
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
*/
proto.sgn.gateway.v1.LPHistory.prototype.setChain = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
 */
proto.sgn.gateway.v1.LPHistory.prototype.clearChain = function() {
  return this.setChain(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.LPHistory.prototype.hasChain = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional TokenInfo token = 2;
 * @return {?proto.sgn.gateway.v1.TokenInfo}
 */
proto.sgn.gateway.v1.LPHistory.prototype.getToken = function() {
  return /** @type{?proto.sgn.gateway.v1.TokenInfo} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.TokenInfo, 2));
};


/**
 * @param {?proto.sgn.gateway.v1.TokenInfo|undefined} value
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
*/
proto.sgn.gateway.v1.LPHistory.prototype.setToken = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
 */
proto.sgn.gateway.v1.LPHistory.prototype.clearToken = function() {
  return this.setToken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.LPHistory.prototype.hasToken = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string amount = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.LPHistory.prototype.getAmount = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
 */
proto.sgn.gateway.v1.LPHistory.prototype.setAmount = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional uint64 ts = 4;
 * @return {number}
 */
proto.sgn.gateway.v1.LPHistory.prototype.getTs = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
 */
proto.sgn.gateway.v1.LPHistory.prototype.setTs = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional string block_tx_link = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.LPHistory.prototype.getBlockTxLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
 */
proto.sgn.gateway.v1.LPHistory.prototype.setBlockTxLink = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional sgn.cbridge.v1.WithdrawStatus status = 6;
 * @return {!proto.sgn.cbridge.v1.WithdrawStatus}
 */
proto.sgn.gateway.v1.LPHistory.prototype.getStatus = function() {
  return /** @type {!proto.sgn.cbridge.v1.WithdrawStatus} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {!proto.sgn.cbridge.v1.WithdrawStatus} value
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
 */
proto.sgn.gateway.v1.LPHistory.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 6, value);
};


/**
 * optional LPType type = 7;
 * @return {!proto.sgn.gateway.v1.LPType}
 */
proto.sgn.gateway.v1.LPHistory.prototype.getType = function() {
  return /** @type {!proto.sgn.gateway.v1.LPType} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {!proto.sgn.gateway.v1.LPType} value
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
 */
proto.sgn.gateway.v1.LPHistory.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 7, value);
};


/**
 * optional uint64 seq_num = 8;
 * @return {number}
 */
proto.sgn.gateway.v1.LPHistory.prototype.getSeqNum = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
 */
proto.sgn.gateway.v1.LPHistory.prototype.setSeqNum = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};


/**
 * optional WithdrawMethodType method_type = 9;
 * @return {!proto.sgn.gateway.v1.WithdrawMethodType}
 */
proto.sgn.gateway.v1.LPHistory.prototype.getMethodType = function() {
  return /** @type {!proto.sgn.gateway.v1.WithdrawMethodType} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/**
 * @param {!proto.sgn.gateway.v1.WithdrawMethodType} value
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
 */
proto.sgn.gateway.v1.LPHistory.prototype.setMethodType = function(value) {
  return jspb.Message.setProto3EnumField(this, 9, value);
};


/**
 * optional uint64 nonce = 10;
 * @return {number}
 */
proto.sgn.gateway.v1.LPHistory.prototype.getNonce = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 10, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPHistory} returns this
 */
proto.sgn.gateway.v1.LPHistory.prototype.setNonce = function(value) {
  return jspb.Message.setProto3IntField(this, 10, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.TransferHistoryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.TransferHistoryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.TransferHistoryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TransferHistoryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    nextPageToken: jspb.Message.getFieldWithDefault(msg, 1, ""),
    pageSize: jspb.Message.getFieldWithDefault(msg, 2, 0),
    addr: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.TransferHistoryRequest}
 */
proto.sgn.gateway.v1.TransferHistoryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.TransferHistoryRequest;
  return proto.sgn.gateway.v1.TransferHistoryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.TransferHistoryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.TransferHistoryRequest}
 */
proto.sgn.gateway.v1.TransferHistoryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNextPageToken(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setPageSize(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.TransferHistoryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.TransferHistoryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.TransferHistoryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TransferHistoryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNextPageToken();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPageSize();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string next_page_token = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.TransferHistoryRequest.prototype.getNextPageToken = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TransferHistoryRequest} returns this
 */
proto.sgn.gateway.v1.TransferHistoryRequest.prototype.setNextPageToken = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint64 page_size = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.TransferHistoryRequest.prototype.getPageSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TransferHistoryRequest} returns this
 */
proto.sgn.gateway.v1.TransferHistoryRequest.prototype.setPageSize = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string addr = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.TransferHistoryRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TransferHistoryRequest} returns this
 */
proto.sgn.gateway.v1.TransferHistoryRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.TransferHistoryResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.TransferHistoryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.TransferHistoryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TransferHistoryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    historyList: jspb.Message.toObjectList(msg.getHistoryList(),
    proto.sgn.gateway.v1.TransferHistory.toObject, includeInstance),
    nextPageToken: jspb.Message.getFieldWithDefault(msg, 3, ""),
    currentSize: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.TransferHistoryResponse}
 */
proto.sgn.gateway.v1.TransferHistoryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.TransferHistoryResponse;
  return proto.sgn.gateway.v1.TransferHistoryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.TransferHistoryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.TransferHistoryResponse}
 */
proto.sgn.gateway.v1.TransferHistoryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.TransferHistory;
      reader.readMessage(value,proto.sgn.gateway.v1.TransferHistory.deserializeBinaryFromReader);
      msg.addHistory(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setNextPageToken(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setCurrentSize(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.TransferHistoryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.TransferHistoryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TransferHistoryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getHistoryList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.sgn.gateway.v1.TransferHistory.serializeBinaryToWriter
    );
  }
  f = message.getNextPageToken();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getCurrentSize();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.TransferHistoryResponse} returns this
*/
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.TransferHistoryResponse} returns this
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated TransferHistory history = 2;
 * @return {!Array<!proto.sgn.gateway.v1.TransferHistory>}
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.getHistoryList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.TransferHistory>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.TransferHistory, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.TransferHistory>} value
 * @return {!proto.sgn.gateway.v1.TransferHistoryResponse} returns this
*/
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.setHistoryList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.gateway.v1.TransferHistory=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.TransferHistory}
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.addHistory = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.gateway.v1.TransferHistory, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.TransferHistoryResponse} returns this
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.clearHistoryList = function() {
  return this.setHistoryList([]);
};


/**
 * optional string next_page_token = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.getNextPageToken = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TransferHistoryResponse} returns this
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.setNextPageToken = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional uint64 current_size = 4;
 * @return {number}
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.getCurrentSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TransferHistoryResponse} returns this
 */
proto.sgn.gateway.v1.TransferHistoryResponse.prototype.setCurrentSize = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.LPHistoryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.LPHistoryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.LPHistoryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.LPHistoryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    nextPageToken: jspb.Message.getFieldWithDefault(msg, 1, ""),
    pageSize: jspb.Message.getFieldWithDefault(msg, 2, 0),
    addr: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.LPHistoryRequest}
 */
proto.sgn.gateway.v1.LPHistoryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.LPHistoryRequest;
  return proto.sgn.gateway.v1.LPHistoryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.LPHistoryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.LPHistoryRequest}
 */
proto.sgn.gateway.v1.LPHistoryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNextPageToken(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setPageSize(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.LPHistoryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.LPHistoryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.LPHistoryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.LPHistoryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNextPageToken();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPageSize();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string next_page_token = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.LPHistoryRequest.prototype.getNextPageToken = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.LPHistoryRequest} returns this
 */
proto.sgn.gateway.v1.LPHistoryRequest.prototype.setNextPageToken = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint64 page_size = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.LPHistoryRequest.prototype.getPageSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPHistoryRequest} returns this
 */
proto.sgn.gateway.v1.LPHistoryRequest.prototype.setPageSize = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string addr = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.LPHistoryRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.LPHistoryRequest} returns this
 */
proto.sgn.gateway.v1.LPHistoryRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.LPHistoryResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.LPHistoryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.LPHistoryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.LPHistoryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    historyList: jspb.Message.toObjectList(msg.getHistoryList(),
    proto.sgn.gateway.v1.LPHistory.toObject, includeInstance),
    nextPageToken: jspb.Message.getFieldWithDefault(msg, 3, ""),
    currentSize: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.LPHistoryResponse}
 */
proto.sgn.gateway.v1.LPHistoryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.LPHistoryResponse;
  return proto.sgn.gateway.v1.LPHistoryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.LPHistoryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.LPHistoryResponse}
 */
proto.sgn.gateway.v1.LPHistoryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.LPHistory;
      reader.readMessage(value,proto.sgn.gateway.v1.LPHistory.deserializeBinaryFromReader);
      msg.addHistory(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setNextPageToken(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setCurrentSize(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.LPHistoryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.LPHistoryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.LPHistoryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getHistoryList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.sgn.gateway.v1.LPHistory.serializeBinaryToWriter
    );
  }
  f = message.getNextPageToken();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getCurrentSize();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.LPHistoryResponse} returns this
*/
proto.sgn.gateway.v1.LPHistoryResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.LPHistoryResponse} returns this
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated LPHistory history = 2;
 * @return {!Array<!proto.sgn.gateway.v1.LPHistory>}
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.getHistoryList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.LPHistory>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.LPHistory, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.LPHistory>} value
 * @return {!proto.sgn.gateway.v1.LPHistoryResponse} returns this
*/
proto.sgn.gateway.v1.LPHistoryResponse.prototype.setHistoryList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.gateway.v1.LPHistory=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.LPHistory}
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.addHistory = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.gateway.v1.LPHistory, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.LPHistoryResponse} returns this
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.clearHistoryList = function() {
  return this.setHistoryList([]);
};


/**
 * optional string next_page_token = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.getNextPageToken = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.LPHistoryResponse} returns this
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.setNextPageToken = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional uint64 current_size = 4;
 * @return {number}
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.getCurrentSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPHistoryResponse} returns this
 */
proto.sgn.gateway.v1.LPHistoryResponse.prototype.setCurrentSize = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.RewardingDataRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.RewardingDataRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.RewardingDataRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.RewardingDataRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.RewardingDataRequest}
 */
proto.sgn.gateway.v1.RewardingDataRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.RewardingDataRequest;
  return proto.sgn.gateway.v1.RewardingDataRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.RewardingDataRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.RewardingDataRequest}
 */
proto.sgn.gateway.v1.RewardingDataRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.RewardingDataRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.RewardingDataRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.RewardingDataRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.RewardingDataRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.RewardingDataRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.RewardingDataRequest} returns this
 */
proto.sgn.gateway.v1.RewardingDataRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.Reward.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.Reward.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.Reward} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.Reward.toObject = function(includeInstance, msg) {
  var f, obj = {
    amt: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
    token: (f = msg.getToken()) && sgn_cbridge_v1_query_pb.Token.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.Reward}
 */
proto.sgn.gateway.v1.Reward.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.Reward;
  return proto.sgn.gateway.v1.Reward.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.Reward} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.Reward}
 */
proto.sgn.gateway.v1.Reward.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setAmt(value);
      break;
    case 2:
      var value = new sgn_cbridge_v1_query_pb.Token;
      reader.readMessage(value,sgn_cbridge_v1_query_pb.Token.deserializeBinaryFromReader);
      msg.setToken(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.Reward.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.Reward.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.Reward} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.Reward.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAmt();
  if (f !== 0.0) {
    writer.writeDouble(
      1,
      f
    );
  }
  f = message.getToken();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      sgn_cbridge_v1_query_pb.Token.serializeBinaryToWriter
    );
  }
};


/**
 * optional double amt = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.Reward.prototype.getAmt = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.Reward} returns this
 */
proto.sgn.gateway.v1.Reward.prototype.setAmt = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional sgn.cbridge.v1.Token token = 2;
 * @return {?proto.sgn.cbridge.v1.Token}
 */
proto.sgn.gateway.v1.Reward.prototype.getToken = function() {
  return /** @type{?proto.sgn.cbridge.v1.Token} */ (
    jspb.Message.getWrapperField(this, sgn_cbridge_v1_query_pb.Token, 2));
};


/**
 * @param {?proto.sgn.cbridge.v1.Token|undefined} value
 * @return {!proto.sgn.gateway.v1.Reward} returns this
*/
proto.sgn.gateway.v1.Reward.prototype.setToken = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.Reward} returns this
 */
proto.sgn.gateway.v1.Reward.prototype.clearToken = function() {
  return this.setToken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.Reward.prototype.hasToken = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.RewardingDataResponse.repeatedFields_ = [3,4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.RewardingDataResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.RewardingDataResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.RewardingDataResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    usdPriceMap: (f = msg.getUsdPriceMap()) ? f.toObject(includeInstance, undefined) : [],
    historicalCumulativeRewardsList: jspb.Message.toObjectList(msg.getHistoricalCumulativeRewardsList(),
    proto.sgn.gateway.v1.Reward.toObject, includeInstance),
    unlockedCumulativeRewardsList: jspb.Message.toObjectList(msg.getUnlockedCumulativeRewardsList(),
    proto.sgn.gateway.v1.Reward.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.RewardingDataResponse}
 */
proto.sgn.gateway.v1.RewardingDataResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.RewardingDataResponse;
  return proto.sgn.gateway.v1.RewardingDataResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.RewardingDataResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.RewardingDataResponse}
 */
proto.sgn.gateway.v1.RewardingDataResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = msg.getUsdPriceMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readDouble, null, "", 0.0);
         });
      break;
    case 3:
      var value = new proto.sgn.gateway.v1.Reward;
      reader.readMessage(value,proto.sgn.gateway.v1.Reward.deserializeBinaryFromReader);
      msg.addHistoricalCumulativeRewards(value);
      break;
    case 4:
      var value = new proto.sgn.gateway.v1.Reward;
      reader.readMessage(value,proto.sgn.gateway.v1.Reward.deserializeBinaryFromReader);
      msg.addUnlockedCumulativeRewards(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.RewardingDataResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.RewardingDataResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.RewardingDataResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getUsdPriceMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeDouble);
  }
  f = message.getHistoricalCumulativeRewardsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.sgn.gateway.v1.Reward.serializeBinaryToWriter
    );
  }
  f = message.getUnlockedCumulativeRewardsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.sgn.gateway.v1.Reward.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.RewardingDataResponse} returns this
*/
proto.sgn.gateway.v1.RewardingDataResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.RewardingDataResponse} returns this
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * map<string, double> usd_price = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,number>}
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.getUsdPriceMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,number>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.sgn.gateway.v1.RewardingDataResponse} returns this
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.clearUsdPriceMap = function() {
  this.getUsdPriceMap().clear();
  return this;};


/**
 * repeated Reward historical_cumulative_rewards = 3;
 * @return {!Array<!proto.sgn.gateway.v1.Reward>}
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.getHistoricalCumulativeRewardsList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.Reward>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.Reward, 3));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.Reward>} value
 * @return {!proto.sgn.gateway.v1.RewardingDataResponse} returns this
*/
proto.sgn.gateway.v1.RewardingDataResponse.prototype.setHistoricalCumulativeRewardsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.sgn.gateway.v1.Reward=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.Reward}
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.addHistoricalCumulativeRewards = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.sgn.gateway.v1.Reward, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.RewardingDataResponse} returns this
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.clearHistoricalCumulativeRewardsList = function() {
  return this.setHistoricalCumulativeRewardsList([]);
};


/**
 * repeated Reward unlocked_cumulative_rewards = 4;
 * @return {!Array<!proto.sgn.gateway.v1.Reward>}
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.getUnlockedCumulativeRewardsList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.Reward>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.Reward, 4));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.Reward>} value
 * @return {!proto.sgn.gateway.v1.RewardingDataResponse} returns this
*/
proto.sgn.gateway.v1.RewardingDataResponse.prototype.setUnlockedCumulativeRewardsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.sgn.gateway.v1.Reward=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.Reward}
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.addUnlockedCumulativeRewards = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.sgn.gateway.v1.Reward, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.RewardingDataResponse} returns this
 */
proto.sgn.gateway.v1.RewardingDataResponse.prototype.clearUnlockedCumulativeRewardsList = function() {
  return this.setUnlockedCumulativeRewardsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.UpdateChainRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.UpdateChainRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UpdateChainRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    chain: (f = msg.getChain()) && proto.sgn.gateway.v1.Chain.toObject(includeInstance, f),
    txUrlPrefix: jspb.Message.getFieldWithDefault(msg, 2, ""),
    sig: msg.getSig_asB64(),
    addr: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.UpdateChainRequest}
 */
proto.sgn.gateway.v1.UpdateChainRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.UpdateChainRequest;
  return proto.sgn.gateway.v1.UpdateChainRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.UpdateChainRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.UpdateChainRequest}
 */
proto.sgn.gateway.v1.UpdateChainRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.Chain;
      reader.readMessage(value,proto.sgn.gateway.v1.Chain.deserializeBinaryFromReader);
      msg.setChain(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxUrlPrefix(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSig(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.UpdateChainRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.UpdateChainRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UpdateChainRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChain();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.Chain.serializeBinaryToWriter
    );
  }
  f = message.getTxUrlPrefix();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSig_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional Chain chain = 1;
 * @return {?proto.sgn.gateway.v1.Chain}
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.getChain = function() {
  return /** @type{?proto.sgn.gateway.v1.Chain} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.Chain, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.Chain|undefined} value
 * @return {!proto.sgn.gateway.v1.UpdateChainRequest} returns this
*/
proto.sgn.gateway.v1.UpdateChainRequest.prototype.setChain = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.UpdateChainRequest} returns this
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.clearChain = function() {
  return this.setChain(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.hasChain = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string tx_url_prefix = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.getTxUrlPrefix = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.UpdateChainRequest} returns this
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.setTxUrlPrefix = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bytes sig = 3;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.getSig = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * optional bytes sig = 3;
 * This is a type-conversion wrapper around `getSig()`
 * @return {string}
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.getSig_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSig()));
};


/**
 * optional bytes sig = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSig()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.getSig_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSig()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.UpdateChainRequest} returns this
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.setSig = function(value) {
  return jspb.Message.setProto3BytesField(this, 3, value);
};


/**
 * optional string addr = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.UpdateChainRequest} returns this
 */
proto.sgn.gateway.v1.UpdateChainRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.UpdateChainResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.UpdateChainResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.UpdateChainResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UpdateChainResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    chain: (f = msg.getChain()) && proto.sgn.gateway.v1.Chain.toObject(includeInstance, f),
    txUrlPrefix: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.UpdateChainResponse}
 */
proto.sgn.gateway.v1.UpdateChainResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.UpdateChainResponse;
  return proto.sgn.gateway.v1.UpdateChainResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.UpdateChainResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.UpdateChainResponse}
 */
proto.sgn.gateway.v1.UpdateChainResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.Chain;
      reader.readMessage(value,proto.sgn.gateway.v1.Chain.deserializeBinaryFromReader);
      msg.setChain(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxUrlPrefix(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.UpdateChainResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.UpdateChainResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.UpdateChainResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UpdateChainResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getChain();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sgn.gateway.v1.Chain.serializeBinaryToWriter
    );
  }
  f = message.getTxUrlPrefix();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.UpdateChainResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.UpdateChainResponse} returns this
*/
proto.sgn.gateway.v1.UpdateChainResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.UpdateChainResponse} returns this
 */
proto.sgn.gateway.v1.UpdateChainResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.UpdateChainResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Chain chain = 2;
 * @return {?proto.sgn.gateway.v1.Chain}
 */
proto.sgn.gateway.v1.UpdateChainResponse.prototype.getChain = function() {
  return /** @type{?proto.sgn.gateway.v1.Chain} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.Chain, 2));
};


/**
 * @param {?proto.sgn.gateway.v1.Chain|undefined} value
 * @return {!proto.sgn.gateway.v1.UpdateChainResponse} returns this
*/
proto.sgn.gateway.v1.UpdateChainResponse.prototype.setChain = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.UpdateChainResponse} returns this
 */
proto.sgn.gateway.v1.UpdateChainResponse.prototype.clearChain = function() {
  return this.setChain(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.UpdateChainResponse.prototype.hasChain = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string tx_url_prefix = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.UpdateChainResponse.prototype.getTxUrlPrefix = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.UpdateChainResponse} returns this
 */
proto.sgn.gateway.v1.UpdateChainResponse.prototype.setTxUrlPrefix = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.UpdateTokenRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.UpdateTokenRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UpdateTokenRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    chainId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    tokenSymbol: jspb.Message.getFieldWithDefault(msg, 2, ""),
    tokenName: jspb.Message.getFieldWithDefault(msg, 3, ""),
    tokenIcon: jspb.Message.getFieldWithDefault(msg, 4, ""),
    sig: msg.getSig_asB64(),
    addr: jspb.Message.getFieldWithDefault(msg, 6, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.UpdateTokenRequest}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.UpdateTokenRequest;
  return proto.sgn.gateway.v1.UpdateTokenRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.UpdateTokenRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.UpdateTokenRequest}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setChainId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenSymbol(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenName(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenIcon(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSig(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.UpdateTokenRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.UpdateTokenRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UpdateTokenRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getTokenSymbol();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTokenName();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getTokenIcon();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getSig_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
};


/**
 * optional uint32 chain_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.UpdateTokenRequest} returns this
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string token_symbol = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.getTokenSymbol = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.UpdateTokenRequest} returns this
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.setTokenSymbol = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string token_name = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.getTokenName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.UpdateTokenRequest} returns this
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.setTokenName = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string token_icon = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.getTokenIcon = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.UpdateTokenRequest} returns this
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.setTokenIcon = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bytes sig = 5;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.getSig = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * optional bytes sig = 5;
 * This is a type-conversion wrapper around `getSig()`
 * @return {string}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.getSig_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSig()));
};


/**
 * optional bytes sig = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSig()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.getSig_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSig()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.UpdateTokenRequest} returns this
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.setSig = function(value) {
  return jspb.Message.setProto3BytesField(this, 5, value);
};


/**
 * optional string addr = 6;
 * @return {string}
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.UpdateTokenRequest} returns this
 */
proto.sgn.gateway.v1.UpdateTokenRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.UpdateTokenResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.UpdateTokenResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.UpdateTokenResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UpdateTokenResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    token: (f = msg.getToken()) && proto.sgn.gateway.v1.TokenInfo.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.UpdateTokenResponse}
 */
proto.sgn.gateway.v1.UpdateTokenResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.UpdateTokenResponse;
  return proto.sgn.gateway.v1.UpdateTokenResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.UpdateTokenResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.UpdateTokenResponse}
 */
proto.sgn.gateway.v1.UpdateTokenResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.TokenInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.TokenInfo.deserializeBinaryFromReader);
      msg.setToken(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.UpdateTokenResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.UpdateTokenResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.UpdateTokenResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UpdateTokenResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getToken();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.sgn.gateway.v1.TokenInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.UpdateTokenResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.UpdateTokenResponse} returns this
*/
proto.sgn.gateway.v1.UpdateTokenResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.UpdateTokenResponse} returns this
 */
proto.sgn.gateway.v1.UpdateTokenResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.UpdateTokenResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional TokenInfo token = 2;
 * @return {?proto.sgn.gateway.v1.TokenInfo}
 */
proto.sgn.gateway.v1.UpdateTokenResponse.prototype.getToken = function() {
  return /** @type{?proto.sgn.gateway.v1.TokenInfo} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.TokenInfo, 2));
};


/**
 * @param {?proto.sgn.gateway.v1.TokenInfo|undefined} value
 * @return {!proto.sgn.gateway.v1.UpdateTokenResponse} returns this
*/
proto.sgn.gateway.v1.UpdateTokenResponse.prototype.setToken = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.UpdateTokenResponse} returns this
 */
proto.sgn.gateway.v1.UpdateTokenResponse.prototype.clearToken = function() {
  return this.setToken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.UpdateTokenResponse.prototype.hasToken = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.StakingConfigRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.StakingConfigRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.StakingConfigRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.StakingConfigRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.StakingConfigRequest}
 */
proto.sgn.gateway.v1.StakingConfigRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.StakingConfigRequest;
  return proto.sgn.gateway.v1.StakingConfigRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.StakingConfigRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.StakingConfigRequest}
 */
proto.sgn.gateway.v1.StakingConfigRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.StakingConfigRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.StakingConfigRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.StakingConfigRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.StakingConfigRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.StakingConfigResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.StakingConfigResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.StakingConfigResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.StakingConfigResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    viewerContract: jspb.Message.getFieldWithDefault(msg, 1, ""),
    stakingContract: jspb.Message.getFieldWithDefault(msg, 2, ""),
    stakingRewardContract: jspb.Message.getFieldWithDefault(msg, 3, ""),
    celrContract: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.StakingConfigResponse}
 */
proto.sgn.gateway.v1.StakingConfigResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.StakingConfigResponse;
  return proto.sgn.gateway.v1.StakingConfigResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.StakingConfigResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.StakingConfigResponse}
 */
proto.sgn.gateway.v1.StakingConfigResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setViewerContract(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setStakingContract(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setStakingRewardContract(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setCelrContract(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.StakingConfigResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.StakingConfigResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.StakingConfigResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.StakingConfigResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getViewerContract();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getStakingContract();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getStakingRewardContract();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getCelrContract();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional string viewer_contract = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.StakingConfigResponse.prototype.getViewerContract = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.StakingConfigResponse} returns this
 */
proto.sgn.gateway.v1.StakingConfigResponse.prototype.setViewerContract = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string staking_contract = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.StakingConfigResponse.prototype.getStakingContract = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.StakingConfigResponse} returns this
 */
proto.sgn.gateway.v1.StakingConfigResponse.prototype.setStakingContract = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string staking_reward_contract = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.StakingConfigResponse.prototype.getStakingRewardContract = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.StakingConfigResponse} returns this
 */
proto.sgn.gateway.v1.StakingConfigResponse.prototype.setStakingRewardContract = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string celr_contract = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.StakingConfigResponse.prototype.getCelrContract = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.StakingConfigResponse} returns this
 */
proto.sgn.gateway.v1.StakingConfigResponse.prototype.setCelrContract = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.UnlockStakingRewardRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.UnlockStakingRewardRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.UnlockStakingRewardRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UnlockStakingRewardRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    delegatorAddress: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.UnlockStakingRewardRequest}
 */
proto.sgn.gateway.v1.UnlockStakingRewardRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.UnlockStakingRewardRequest;
  return proto.sgn.gateway.v1.UnlockStakingRewardRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.UnlockStakingRewardRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.UnlockStakingRewardRequest}
 */
proto.sgn.gateway.v1.UnlockStakingRewardRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setDelegatorAddress(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.UnlockStakingRewardRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.UnlockStakingRewardRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.UnlockStakingRewardRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UnlockStakingRewardRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDelegatorAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string delegator_address = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.UnlockStakingRewardRequest.prototype.getDelegatorAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.UnlockStakingRewardRequest} returns this
 */
proto.sgn.gateway.v1.UnlockStakingRewardRequest.prototype.setDelegatorAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.UnlockStakingRewardResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.UnlockStakingRewardResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.UnlockStakingRewardResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UnlockStakingRewardResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.UnlockStakingRewardResponse}
 */
proto.sgn.gateway.v1.UnlockStakingRewardResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.UnlockStakingRewardResponse;
  return proto.sgn.gateway.v1.UnlockStakingRewardResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.UnlockStakingRewardResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.UnlockStakingRewardResponse}
 */
proto.sgn.gateway.v1.UnlockStakingRewardResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.UnlockStakingRewardResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.UnlockStakingRewardResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.UnlockStakingRewardResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.UnlockStakingRewardResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.UnlockStakingRewardResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.UnlockStakingRewardResponse} returns this
*/
proto.sgn.gateway.v1.UnlockStakingRewardResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.UnlockStakingRewardResponse} returns this
 */
proto.sgn.gateway.v1.UnlockStakingRewardResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.UnlockStakingRewardResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetStakingRewardDetailsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    delegatorAddress: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetStakingRewardDetailsRequest}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetStakingRewardDetailsRequest;
  return proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetStakingRewardDetailsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetStakingRewardDetailsRequest}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setDelegatorAddress(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetStakingRewardDetailsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDelegatorAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string delegator_address = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.prototype.getDelegatorAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetStakingRewardDetailsRequest} returns this
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsRequest.prototype.setDelegatorAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetStakingRewardDetailsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    detail: (f = msg.getDetail()) && sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetStakingRewardDetailsResponse}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetStakingRewardDetailsResponse;
  return proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetStakingRewardDetailsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetStakingRewardDetailsResponse}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo;
      reader.readMessage(value,sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo.deserializeBinaryFromReader);
      msg.setDetail(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetStakingRewardDetailsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getDetail();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetStakingRewardDetailsResponse} returns this
*/
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetStakingRewardDetailsResponse} returns this
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional sgn.distribution.v1.StakingRewardClaimInfo detail = 2;
 * @return {?proto.sgn.distribution.v1.StakingRewardClaimInfo}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.prototype.getDetail = function() {
  return /** @type{?proto.sgn.distribution.v1.StakingRewardClaimInfo} */ (
    jspb.Message.getWrapperField(this, sgn_distribution_v1_distribution_pb.StakingRewardClaimInfo, 2));
};


/**
 * @param {?proto.sgn.distribution.v1.StakingRewardClaimInfo|undefined} value
 * @return {!proto.sgn.gateway.v1.GetStakingRewardDetailsResponse} returns this
*/
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.prototype.setDetail = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetStakingRewardDetailsResponse} returns this
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.prototype.clearDetail = function() {
  return this.setDetail(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetStakingRewardDetailsResponse.prototype.hasDetail = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    chainIdsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
    tokenSymbol: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest;
  return proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedUint32() : [reader.readUint32()]);
      for (var i = 0; i < values.length; i++) {
        msg.addChainIds(values[i]);
      }
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenSymbol(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChainIdsList();
  if (f.length > 0) {
    writer.writePackedUint32(
      1,
      f
    );
  }
  f = message.getTokenSymbol();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * repeated uint32 chain_ids = 1;
 * @return {!Array<number>}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.prototype.getChainIdsList = function() {
  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<number>} value
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest} returns this
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.prototype.setChainIdsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {number} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest} returns this
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.prototype.addChainIds = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest} returns this
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.prototype.clearChainIdsList = function() {
  return this.setChainIdsList([]);
};


/**
 * optional string token_symbol = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.prototype.getTokenSymbol = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest} returns this
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceRequest.prototype.setTokenSymbol = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    totalLiqMap: (f = msg.getTotalLiqMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse;
  return proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = msg.getTotalLiqMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint64, jspb.BinaryReader.prototype.readString, null, 0, "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getTotalLiqMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeUint64, jspb.BinaryWriter.prototype.writeString);
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse} returns this
*/
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse} returns this
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * map<uint64, string> total_liq = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,string>}
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.prototype.getTotalLiqMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<number,string>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      null));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse} returns this
 */
proto.sgn.gateway.v1.GetTotalLiquidityProviderTokenBalanceResponse.prototype.clearTotalLiqMap = function() {
  this.getTotalLiqMap().clear();
  return this;};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest}
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest;
  return proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest}
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    infoList: jspb.Message.toObjectList(msg.getInfoList(),
    proto.sgn.gateway.v1.AbnormalStatusInfo.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse}
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse;
  return proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse}
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.AbnormalStatusInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.AbnormalStatusInfo.deserializeBinaryFromReader);
      msg.addInfo(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInfoList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.sgn.gateway.v1.AbnormalStatusInfo.serializeBinaryToWriter
    );
  }
};


/**
 * repeated AbnormalStatusInfo info = 1;
 * @return {!Array<!proto.sgn.gateway.v1.AbnormalStatusInfo>}
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.prototype.getInfoList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.AbnormalStatusInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.AbnormalStatusInfo, 1));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.AbnormalStatusInfo>} value
 * @return {!proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.prototype.setInfoList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.sgn.gateway.v1.AbnormalStatusInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.AbnormalStatusInfo}
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.prototype.addInfo = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.sgn.gateway.v1.AbnormalStatusInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetAbnormalStatusInfoResponse.prototype.clearInfoList = function() {
  return this.setInfoList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.repeatedFields_ = [1,2,3,4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetAllLPInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetAllLPInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    usrAddressList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
    actionTypeList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
    chainIdList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
    tokenSymbolList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
    beginTime: jspb.Message.getFieldWithDefault(msg, 5, 0),
    endTime: jspb.Message.getFieldWithDefault(msg, 6, 0),
    nextPageToken: jspb.Message.getFieldWithDefault(msg, 7, 0),
    sigAddr: jspb.Message.getFieldWithDefault(msg, 8, ""),
    sig: msg.getSig_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetAllLPInfoRequest;
  return proto.sgn.gateway.v1.GetAllLPInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetAllLPInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addUsrAddress(value);
      break;
    case 2:
      var values = /** @type {!Array<!proto.sgn.gateway.v1.LpActionType>} */ (reader.isDelimited() ? reader.readPackedEnum() : [reader.readEnum()]);
      for (var i = 0; i < values.length; i++) {
        msg.addActionType(values[i]);
      }
      break;
    case 3:
      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedUint32() : [reader.readUint32()]);
      for (var i = 0; i < values.length; i++) {
        msg.addChainId(values[i]);
      }
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.addTokenSymbol(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBeginTime(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEndTime(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setNextPageToken(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setSigAddr(value);
      break;
    case 9:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSig(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetAllLPInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetAllLPInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsrAddressList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = message.getActionTypeList();
  if (f.length > 0) {
    writer.writePackedEnum(
      2,
      f
    );
  }
  f = message.getChainIdList();
  if (f.length > 0) {
    writer.writePackedUint32(
      3,
      f
    );
  }
  f = message.getTokenSymbolList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
  f = message.getBeginTime();
  if (f !== 0) {
    writer.writeUint64(
      5,
      f
    );
  }
  f = message.getEndTime();
  if (f !== 0) {
    writer.writeUint64(
      6,
      f
    );
  }
  f = message.getNextPageToken();
  if (f !== 0) {
    writer.writeUint64(
      7,
      f
    );
  }
  f = message.getSigAddr();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getSig_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      9,
      f
    );
  }
};


/**
 * repeated string usr_address = 1;
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getUsrAddressList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.setUsrAddressList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.addUsrAddress = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.clearUsrAddressList = function() {
  return this.setUsrAddressList([]);
};


/**
 * repeated LpActionType action_type = 2;
 * @return {!Array<!proto.sgn.gateway.v1.LpActionType>}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getActionTypeList = function() {
  return /** @type {!Array<!proto.sgn.gateway.v1.LpActionType>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.LpActionType>} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.setActionTypeList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!proto.sgn.gateway.v1.LpActionType} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.addActionType = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.clearActionTypeList = function() {
  return this.setActionTypeList([]);
};


/**
 * repeated uint32 chain_id = 3;
 * @return {!Array<number>}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getChainIdList = function() {
  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<number>} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.setChainIdList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {number} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.addChainId = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.clearChainIdList = function() {
  return this.setChainIdList([]);
};


/**
 * repeated string token_symbol = 4;
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getTokenSymbolList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.setTokenSymbolList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.addTokenSymbol = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.clearTokenSymbolList = function() {
  return this.setTokenSymbolList([]);
};


/**
 * optional uint64 begin_time = 5;
 * @return {number}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getBeginTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.setBeginTime = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional uint64 end_time = 6;
 * @return {number}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getEndTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.setEndTime = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional uint64 next_page_token = 7;
 * @return {number}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getNextPageToken = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.setNextPageToken = function(value) {
  return jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * optional string sig_addr = 8;
 * @return {string}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getSigAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.setSigAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional bytes sig = 9;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getSig = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * optional bytes sig = 9;
 * This is a type-conversion wrapper around `getSig()`
 * @return {string}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getSig_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSig()));
};


/**
 * optional bytes sig = 9;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSig()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.getSig_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSig()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoRequest.prototype.setSig = function(value) {
  return jspb.Message.setProto3BytesField(this, 9, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetAllLPInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetAllLPInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    operationList: jspb.Message.toObjectList(msg.getOperationList(),
    proto.sgn.gateway.v1.LPOperations.toObject, includeInstance),
    nextPageToken: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoResponse}
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetAllLPInfoResponse;
  return proto.sgn.gateway.v1.GetAllLPInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetAllLPInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoResponse}
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.LPOperations;
      reader.readMessage(value,proto.sgn.gateway.v1.LPOperations.deserializeBinaryFromReader);
      msg.addOperation(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setNextPageToken(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetAllLPInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetAllLPInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getOperationList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.sgn.gateway.v1.LPOperations.serializeBinaryToWriter
    );
  }
  f = message.getNextPageToken();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated LPOperations operation = 2;
 * @return {!Array<!proto.sgn.gateway.v1.LPOperations>}
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.getOperationList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.LPOperations>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.LPOperations, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.LPOperations>} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.setOperationList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.gateway.v1.LPOperations=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.LPOperations}
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.addOperation = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.gateway.v1.LPOperations, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.clearOperationList = function() {
  return this.setOperationList([]);
};


/**
 * optional uint64 next_page_token = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.getNextPageToken = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetAllLPInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetAllLPInfoResponse.prototype.setNextPageToken = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.LPOperations.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.LPOperations.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.LPOperations} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.LPOperations.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: jspb.Message.getFieldWithDefault(msg, 1, ""),
    action: jspb.Message.getFieldWithDefault(msg, 2, 0),
    chainId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    tokenSymbol: jspb.Message.getFieldWithDefault(msg, 4, ""),
    amount: jspb.Message.getFloatingPointFieldWithDefault(msg, 5, 0.0),
    timestamp: jspb.Message.getFieldWithDefault(msg, 6, 0),
    txLink: jspb.Message.getFieldWithDefault(msg, 7, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.LPOperations}
 */
proto.sgn.gateway.v1.LPOperations.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.LPOperations;
  return proto.sgn.gateway.v1.LPOperations.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.LPOperations} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.LPOperations}
 */
proto.sgn.gateway.v1.LPOperations.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 2:
      var value = /** @type {!proto.sgn.gateway.v1.LpActionType} */ (reader.readEnum());
      msg.setAction(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setChainId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenSymbol(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setAmount(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTimestamp(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxLink(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.LPOperations.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.LPOperations.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.LPOperations} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.LPOperations.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAction();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = message.getTokenSymbol();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getAmount();
  if (f !== 0.0) {
    writer.writeFloat(
      5,
      f
    );
  }
  f = message.getTimestamp();
  if (f !== 0) {
    writer.writeUint64(
      6,
      f
    );
  }
  f = message.getTxLink();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional string address = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.LPOperations.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.LPOperations} returns this
 */
proto.sgn.gateway.v1.LPOperations.prototype.setAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional LpActionType action = 2;
 * @return {!proto.sgn.gateway.v1.LpActionType}
 */
proto.sgn.gateway.v1.LPOperations.prototype.getAction = function() {
  return /** @type {!proto.sgn.gateway.v1.LpActionType} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.sgn.gateway.v1.LpActionType} value
 * @return {!proto.sgn.gateway.v1.LPOperations} returns this
 */
proto.sgn.gateway.v1.LPOperations.prototype.setAction = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional uint32 chain_id = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.LPOperations.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPOperations} returns this
 */
proto.sgn.gateway.v1.LPOperations.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string token_symbol = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.LPOperations.prototype.getTokenSymbol = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.LPOperations} returns this
 */
proto.sgn.gateway.v1.LPOperations.prototype.setTokenSymbol = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional float amount = 5;
 * @return {number}
 */
proto.sgn.gateway.v1.LPOperations.prototype.getAmount = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 5, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPOperations} returns this
 */
proto.sgn.gateway.v1.LPOperations.prototype.setAmount = function(value) {
  return jspb.Message.setProto3FloatField(this, 5, value);
};


/**
 * optional uint64 timestamp = 6;
 * @return {number}
 */
proto.sgn.gateway.v1.LPOperations.prototype.getTimestamp = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.LPOperations} returns this
 */
proto.sgn.gateway.v1.LPOperations.prototype.setTimestamp = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional string tx_link = 7;
 * @return {string}
 */
proto.sgn.gateway.v1.LPOperations.prototype.getTxLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.LPOperations} returns this
 */
proto.sgn.gateway.v1.LPOperations.prototype.setTxLink = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.repeatedFields_ = [1,2,3,4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetAllTXInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetAllTXInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    usrAddressList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
    srcChainIdList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
    dstChainIdList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f,
    tokenSymbolList: (f = jspb.Message.getRepeatedField(msg, 4)) == null ? undefined : f,
    beginTime: jspb.Message.getFieldWithDefault(msg, 5, 0),
    endTime: jspb.Message.getFieldWithDefault(msg, 6, 0),
    nextPageToken: jspb.Message.getFieldWithDefault(msg, 7, 0),
    sigAddr: jspb.Message.getFieldWithDefault(msg, 8, ""),
    sig: msg.getSig_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetAllTXInfoRequest;
  return proto.sgn.gateway.v1.GetAllTXInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetAllTXInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addUsrAddress(value);
      break;
    case 2:
      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedUint32() : [reader.readUint32()]);
      for (var i = 0; i < values.length; i++) {
        msg.addSrcChainId(values[i]);
      }
      break;
    case 3:
      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedUint32() : [reader.readUint32()]);
      for (var i = 0; i < values.length; i++) {
        msg.addDstChainId(values[i]);
      }
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.addTokenSymbol(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBeginTime(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEndTime(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setNextPageToken(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setSigAddr(value);
      break;
    case 9:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSig(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetAllTXInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetAllTXInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUsrAddressList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = message.getSrcChainIdList();
  if (f.length > 0) {
    writer.writePackedUint32(
      2,
      f
    );
  }
  f = message.getDstChainIdList();
  if (f.length > 0) {
    writer.writePackedUint32(
      3,
      f
    );
  }
  f = message.getTokenSymbolList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
  f = message.getBeginTime();
  if (f !== 0) {
    writer.writeUint64(
      5,
      f
    );
  }
  f = message.getEndTime();
  if (f !== 0) {
    writer.writeUint64(
      6,
      f
    );
  }
  f = message.getNextPageToken();
  if (f !== 0) {
    writer.writeUint64(
      7,
      f
    );
  }
  f = message.getSigAddr();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getSig_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      9,
      f
    );
  }
};


/**
 * repeated string usr_address = 1;
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getUsrAddressList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.setUsrAddressList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.addUsrAddress = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.clearUsrAddressList = function() {
  return this.setUsrAddressList([]);
};


/**
 * repeated uint32 src_chain_id = 2;
 * @return {!Array<number>}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getSrcChainIdList = function() {
  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<number>} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.setSrcChainIdList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {number} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.addSrcChainId = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.clearSrcChainIdList = function() {
  return this.setSrcChainIdList([]);
};


/**
 * repeated uint32 dst_chain_id = 3;
 * @return {!Array<number>}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getDstChainIdList = function() {
  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<number>} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.setDstChainIdList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {number} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.addDstChainId = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.clearDstChainIdList = function() {
  return this.setDstChainIdList([]);
};


/**
 * repeated string token_symbol = 4;
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getTokenSymbolList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 4));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.setTokenSymbolList = function(value) {
  return jspb.Message.setField(this, 4, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.addTokenSymbol = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 4, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.clearTokenSymbolList = function() {
  return this.setTokenSymbolList([]);
};


/**
 * optional uint64 begin_time = 5;
 * @return {number}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getBeginTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.setBeginTime = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional uint64 end_time = 6;
 * @return {number}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getEndTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.setEndTime = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional uint64 next_page_token = 7;
 * @return {number}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getNextPageToken = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.setNextPageToken = function(value) {
  return jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * optional string sig_addr = 8;
 * @return {string}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getSigAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.setSigAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional bytes sig = 9;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getSig = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * optional bytes sig = 9;
 * This is a type-conversion wrapper around `getSig()`
 * @return {string}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getSig_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSig()));
};


/**
 * optional bytes sig = 9;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSig()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.getSig_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSig()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoRequest.prototype.setSig = function(value) {
  return jspb.Message.setProto3BytesField(this, 9, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetAllTXInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetAllTXInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    operationList: jspb.Message.toObjectList(msg.getOperationList(),
    proto.sgn.gateway.v1.TXOperations.toObject, includeInstance),
    nextPageToken: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoResponse}
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetAllTXInfoResponse;
  return proto.sgn.gateway.v1.GetAllTXInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetAllTXInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoResponse}
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.TXOperations;
      reader.readMessage(value,proto.sgn.gateway.v1.TXOperations.deserializeBinaryFromReader);
      msg.addOperation(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setNextPageToken(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetAllTXInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetAllTXInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getOperationList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.sgn.gateway.v1.TXOperations.serializeBinaryToWriter
    );
  }
  f = message.getNextPageToken();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated TXOperations operation = 2;
 * @return {!Array<!proto.sgn.gateway.v1.TXOperations>}
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.getOperationList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.TXOperations>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.TXOperations, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.TXOperations>} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.setOperationList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.gateway.v1.TXOperations=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.TXOperations}
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.addOperation = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.gateway.v1.TXOperations, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.clearOperationList = function() {
  return this.setOperationList([]);
};


/**
 * optional uint64 next_page_token = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.getNextPageToken = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetAllTXInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetAllTXInfoResponse.prototype.setNextPageToken = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.TXOperations.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.TXOperations.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.TXOperations} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TXOperations.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: jspb.Message.getFieldWithDefault(msg, 1, ""),
    srcChainId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    dstChainId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    tokenSymbol: jspb.Message.getFieldWithDefault(msg, 4, ""),
    sendAmount: jspb.Message.getFloatingPointFieldWithDefault(msg, 5, 0.0),
    recievedAmount: jspb.Message.getFloatingPointFieldWithDefault(msg, 6, 0.0),
    baseFee: jspb.Message.getFloatingPointFieldWithDefault(msg, 7, 0.0),
    liqFee: jspb.Message.getFloatingPointFieldWithDefault(msg, 8, 0.0),
    price: jspb.Message.getFloatingPointFieldWithDefault(msg, 9, 0.0),
    timestamp: jspb.Message.getFieldWithDefault(msg, 10, 0),
    srcTxLink: jspb.Message.getFieldWithDefault(msg, 11, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.TXOperations}
 */
proto.sgn.gateway.v1.TXOperations.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.TXOperations;
  return proto.sgn.gateway.v1.TXOperations.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.TXOperations} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.TXOperations}
 */
proto.sgn.gateway.v1.TXOperations.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSrcChainId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setDstChainId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenSymbol(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setSendAmount(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setRecievedAmount(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setBaseFee(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setLiqFee(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setPrice(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTimestamp(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setSrcTxLink(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.TXOperations.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.TXOperations.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.TXOperations} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.TXOperations.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSrcChainId();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getDstChainId();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = message.getTokenSymbol();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getSendAmount();
  if (f !== 0.0) {
    writer.writeFloat(
      5,
      f
    );
  }
  f = message.getRecievedAmount();
  if (f !== 0.0) {
    writer.writeFloat(
      6,
      f
    );
  }
  f = message.getBaseFee();
  if (f !== 0.0) {
    writer.writeFloat(
      7,
      f
    );
  }
  f = message.getLiqFee();
  if (f !== 0.0) {
    writer.writeFloat(
      8,
      f
    );
  }
  f = message.getPrice();
  if (f !== 0.0) {
    writer.writeFloat(
      9,
      f
    );
  }
  f = message.getTimestamp();
  if (f !== 0) {
    writer.writeUint64(
      10,
      f
    );
  }
  f = message.getSrcTxLink();
  if (f.length > 0) {
    writer.writeString(
      11,
      f
    );
  }
};


/**
 * optional string address = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint32 src_chain_id = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getSrcChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setSrcChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint32 dst_chain_id = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getDstChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setDstChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string token_symbol = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getTokenSymbol = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setTokenSymbol = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional float send_amount = 5;
 * @return {number}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getSendAmount = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 5, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setSendAmount = function(value) {
  return jspb.Message.setProto3FloatField(this, 5, value);
};


/**
 * optional float recieved_amount = 6;
 * @return {number}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getRecievedAmount = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 6, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setRecievedAmount = function(value) {
  return jspb.Message.setProto3FloatField(this, 6, value);
};


/**
 * optional float base_fee = 7;
 * @return {number}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getBaseFee = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 7, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setBaseFee = function(value) {
  return jspb.Message.setProto3FloatField(this, 7, value);
};


/**
 * optional float liq_fee = 8;
 * @return {number}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getLiqFee = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 8, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setLiqFee = function(value) {
  return jspb.Message.setProto3FloatField(this, 8, value);
};


/**
 * optional float price = 9;
 * @return {number}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getPrice = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 9, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setPrice = function(value) {
  return jspb.Message.setProto3FloatField(this, 9, value);
};


/**
 * optional uint64 timestamp = 10;
 * @return {number}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getTimestamp = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 10, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setTimestamp = function(value) {
  return jspb.Message.setProto3IntField(this, 10, value);
};


/**
 * optional string src_tx_link = 11;
 * @return {string}
 */
proto.sgn.gateway.v1.TXOperations.prototype.getSrcTxLink = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.TXOperations} returns this
 */
proto.sgn.gateway.v1.TXOperations.prototype.setSrcTxLink = function(value) {
  return jspb.Message.setProto3StringField(this, 11, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.AbnormalStatusInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.AbnormalStatusInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    type: jspb.Message.getFieldWithDefault(msg, 1, ""),
    chainId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    dstChainId: jspb.Message.getFieldWithDefault(msg, 3, 0),
    txHash: jspb.Message.getFieldWithDefault(msg, 4, ""),
    time: jspb.Message.getFieldWithDefault(msg, 5, ""),
    peggedInfo: jspb.Message.getFieldWithDefault(msg, 6, ""),
    srcTransferId: jspb.Message.getFieldWithDefault(msg, 7, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.AbnormalStatusInfo}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.AbnormalStatusInfo;
  return proto.sgn.gateway.v1.AbnormalStatusInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.AbnormalStatusInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.AbnormalStatusInfo}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChainId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setDstChainId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxHash(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setTime(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setPeggedInfo(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setSrcTransferId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.AbnormalStatusInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.AbnormalStatusInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getDstChainId();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getTxHash();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getTime();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getPeggedInfo();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getSrcTransferId();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional string type = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.AbnormalStatusInfo} returns this
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint64 chain_id = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.AbnormalStatusInfo} returns this
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 dst_chain_id = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.getDstChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.AbnormalStatusInfo} returns this
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.setDstChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string tx_hash = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.getTxHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.AbnormalStatusInfo} returns this
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.setTxHash = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string time = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.getTime = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.AbnormalStatusInfo} returns this
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.setTime = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string pegged_info = 6;
 * @return {string}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.getPeggedInfo = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.AbnormalStatusInfo} returns this
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.setPeggedInfo = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string src_transfer_id = 7;
 * @return {string}
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.getSrcTransferId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.AbnormalStatusInfo} returns this
 */
proto.sgn.gateway.v1.AbnormalStatusInfo.prototype.setSrcTransferId = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetInfoByTxHashRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetInfoByTxHashRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    chainId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    txHash: jspb.Message.getFieldWithDefault(msg, 2, ""),
    type: jspb.Message.getFieldWithDefault(msg, 3, 0),
    sig: msg.getSig_asB64(),
    addr: jspb.Message.getFieldWithDefault(msg, 5, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashRequest}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetInfoByTxHashRequest;
  return proto.sgn.gateway.v1.GetInfoByTxHashRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetInfoByTxHashRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashRequest}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setChainId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxHash(value);
      break;
    case 3:
      var value = /** @type {!proto.sgn.gateway.v1.CSType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSig(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetInfoByTxHashRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetInfoByTxHashRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getTxHash();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getSig_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional uint32 chain_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashRequest} returns this
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string tx_hash = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.getTxHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashRequest} returns this
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.setTxHash = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional CSType type = 3;
 * @return {!proto.sgn.gateway.v1.CSType}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.getType = function() {
  return /** @type {!proto.sgn.gateway.v1.CSType} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.sgn.gateway.v1.CSType} value
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashRequest} returns this
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * optional bytes sig = 4;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.getSig = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * optional bytes sig = 4;
 * This is a type-conversion wrapper around `getSig()`
 * @return {string}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.getSig_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSig()));
};


/**
 * optional bytes sig = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSig()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.getSig_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSig()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashRequest} returns this
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.setSig = function(value) {
  return jspb.Message.setProto3BytesField(this, 4, value);
};


/**
 * optional string addr = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashRequest} returns this
 */
proto.sgn.gateway.v1.GetInfoByTxHashRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetInfoByTxHashResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetInfoByTxHashResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    operation: jspb.Message.getFieldWithDefault(msg, 1, 0),
    status: jspb.Message.getFieldWithDefault(msg, 2, 0),
    memo: jspb.Message.getFieldWithDefault(msg, 3, ""),
    info: jspb.Message.getFieldWithDefault(msg, 4, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashResponse}
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetInfoByTxHashResponse;
  return proto.sgn.gateway.v1.GetInfoByTxHashResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetInfoByTxHashResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashResponse}
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.sgn.gateway.v1.CSOperation} */ (reader.readEnum());
      msg.setOperation(value);
      break;
    case 2:
      var value = /** @type {!proto.sgn.gateway.v1.UserCaseStatus} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setMemo(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setInfo(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetInfoByTxHashResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetInfoByTxHashResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOperation();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getMemo();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getInfo();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * optional CSOperation operation = 1;
 * @return {!proto.sgn.gateway.v1.CSOperation}
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.prototype.getOperation = function() {
  return /** @type {!proto.sgn.gateway.v1.CSOperation} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.sgn.gateway.v1.CSOperation} value
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashResponse} returns this
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.prototype.setOperation = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional UserCaseStatus status = 2;
 * @return {!proto.sgn.gateway.v1.UserCaseStatus}
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.prototype.getStatus = function() {
  return /** @type {!proto.sgn.gateway.v1.UserCaseStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.sgn.gateway.v1.UserCaseStatus} value
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashResponse} returns this
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional string memo = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.prototype.getMemo = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashResponse} returns this
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.prototype.setMemo = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string info = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.prototype.getInfo = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetInfoByTxHashResponse} returns this
 */
proto.sgn.gateway.v1.GetInfoByTxHashResponse.prototype.setInfo = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.FixEventMissRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.FixEventMissRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.FixEventMissRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    chainId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    txHash: jspb.Message.getFieldWithDefault(msg, 2, ""),
    type: jspb.Message.getFieldWithDefault(msg, 3, 0),
    sig: msg.getSig_asB64(),
    addr: jspb.Message.getFieldWithDefault(msg, 5, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.FixEventMissRequest}
 */
proto.sgn.gateway.v1.FixEventMissRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.FixEventMissRequest;
  return proto.sgn.gateway.v1.FixEventMissRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.FixEventMissRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.FixEventMissRequest}
 */
proto.sgn.gateway.v1.FixEventMissRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setChainId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxHash(value);
      break;
    case 3:
      var value = /** @type {!proto.sgn.gateway.v1.CSType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSig(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.FixEventMissRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.FixEventMissRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.FixEventMissRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getTxHash();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
  f = message.getSig_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional uint32 chain_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.FixEventMissRequest} returns this
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string tx_hash = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.getTxHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.FixEventMissRequest} returns this
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.setTxHash = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional CSType type = 3;
 * @return {!proto.sgn.gateway.v1.CSType}
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.getType = function() {
  return /** @type {!proto.sgn.gateway.v1.CSType} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.sgn.gateway.v1.CSType} value
 * @return {!proto.sgn.gateway.v1.FixEventMissRequest} returns this
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.setType = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};


/**
 * optional bytes sig = 4;
 * @return {!(string|Uint8Array)}
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.getSig = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * optional bytes sig = 4;
 * This is a type-conversion wrapper around `getSig()`
 * @return {string}
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.getSig_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSig()));
};


/**
 * optional bytes sig = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSig()`
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.getSig_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSig()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.sgn.gateway.v1.FixEventMissRequest} returns this
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.setSig = function(value) {
  return jspb.Message.setProto3BytesField(this, 4, value);
};


/**
 * optional string addr = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.FixEventMissRequest} returns this
 */
proto.sgn.gateway.v1.FixEventMissRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.FixEventMissResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.FixEventMissResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.FixEventMissResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.FixEventMissResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.FixEventMissResponse}
 */
proto.sgn.gateway.v1.FixEventMissResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.FixEventMissResponse;
  return proto.sgn.gateway.v1.FixEventMissResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.FixEventMissResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.FixEventMissResponse}
 */
proto.sgn.gateway.v1.FixEventMissResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.FixEventMissResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.FixEventMissResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.FixEventMissResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.FixEventMissResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.FixEventMissResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.FixEventMissResponse} returns this
*/
proto.sgn.gateway.v1.FixEventMissResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.FixEventMissResponse} returns this
 */
proto.sgn.gateway.v1.FixEventMissResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.FixEventMissResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetAllConfigsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetAllConfigsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetAllConfigsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllConfigsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetAllConfigsRequest}
 */
proto.sgn.gateway.v1.GetAllConfigsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetAllConfigsRequest;
  return proto.sgn.gateway.v1.GetAllConfigsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetAllConfigsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetAllConfigsRequest}
 */
proto.sgn.gateway.v1.GetAllConfigsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetAllConfigsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetAllConfigsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetAllConfigsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllConfigsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ExtendedPair.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ExtendedPair} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ExtendedPair.toObject = function(includeInstance, msg) {
  var f, obj = {
    peggedPair: (f = msg.getPeggedPair()) && sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair.toObject(includeInstance, f),
    minDeposit: jspb.Message.getFieldWithDefault(msg, 2, ""),
    maxDeposit: jspb.Message.getFieldWithDefault(msg, 3, ""),
    minBurn: jspb.Message.getFieldWithDefault(msg, 4, ""),
    maxBurn: jspb.Message.getFieldWithDefault(msg, 5, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ExtendedPair}
 */
proto.sgn.gateway.v1.ExtendedPair.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ExtendedPair;
  return proto.sgn.gateway.v1.ExtendedPair.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ExtendedPair} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ExtendedPair}
 */
proto.sgn.gateway.v1.ExtendedPair.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair;
      reader.readMessage(value,sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair.deserializeBinaryFromReader);
      msg.setPeggedPair(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setMinDeposit(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setMaxDeposit(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setMinBurn(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setMaxBurn(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ExtendedPair.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ExtendedPair} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ExtendedPair.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPeggedPair();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair.serializeBinaryToWriter
    );
  }
  f = message.getMinDeposit();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getMaxDeposit();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMinBurn();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getMaxBurn();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional sgn.pegbridge.v1.OrigPeggedPair pegged_pair = 1;
 * @return {?proto.sgn.pegbridge.v1.OrigPeggedPair}
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.getPeggedPair = function() {
  return /** @type{?proto.sgn.pegbridge.v1.OrigPeggedPair} */ (
    jspb.Message.getWrapperField(this, sgn_pegbridge_v1_pegbridge_pb.OrigPeggedPair, 1));
};


/**
 * @param {?proto.sgn.pegbridge.v1.OrigPeggedPair|undefined} value
 * @return {!proto.sgn.gateway.v1.ExtendedPair} returns this
*/
proto.sgn.gateway.v1.ExtendedPair.prototype.setPeggedPair = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ExtendedPair} returns this
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.clearPeggedPair = function() {
  return this.setPeggedPair(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.hasPeggedPair = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string min_deposit = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.getMinDeposit = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ExtendedPair} returns this
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.setMinDeposit = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string max_deposit = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.getMaxDeposit = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ExtendedPair} returns this
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.setMaxDeposit = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string min_burn = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.getMinBurn = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ExtendedPair} returns this
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.setMinBurn = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string max_burn = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.getMaxBurn = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ExtendedPair} returns this
 */
proto.sgn.gateway.v1.ExtendedPair.prototype.setMaxBurn = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetAllConfigsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetAllConfigsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    peggedPairsList: jspb.Message.toObjectList(msg.getPeggedPairsList(),
    proto.sgn.gateway.v1.ExtendedPair.toObject, includeInstance),
    cbrConfig: (f = msg.getCbrConfig()) && sgn_cbridge_v1_cbridge_pb.CbrConfig.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetAllConfigsResponse}
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetAllConfigsResponse;
  return proto.sgn.gateway.v1.GetAllConfigsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetAllConfigsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetAllConfigsResponse}
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.ExtendedPair;
      reader.readMessage(value,proto.sgn.gateway.v1.ExtendedPair.deserializeBinaryFromReader);
      msg.addPeggedPairs(value);
      break;
    case 3:
      var value = new sgn_cbridge_v1_cbridge_pb.CbrConfig;
      reader.readMessage(value,sgn_cbridge_v1_cbridge_pb.CbrConfig.deserializeBinaryFromReader);
      msg.setCbrConfig(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetAllConfigsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetAllConfigsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getPeggedPairsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.sgn.gateway.v1.ExtendedPair.serializeBinaryToWriter
    );
  }
  f = message.getCbrConfig();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      sgn_cbridge_v1_cbridge_pb.CbrConfig.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetAllConfigsResponse} returns this
*/
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetAllConfigsResponse} returns this
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated ExtendedPair pegged_pairs = 2;
 * @return {!Array<!proto.sgn.gateway.v1.ExtendedPair>}
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.getPeggedPairsList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.ExtendedPair>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.ExtendedPair, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.ExtendedPair>} value
 * @return {!proto.sgn.gateway.v1.GetAllConfigsResponse} returns this
*/
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.setPeggedPairsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.gateway.v1.ExtendedPair=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.ExtendedPair}
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.addPeggedPairs = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.gateway.v1.ExtendedPair, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetAllConfigsResponse} returns this
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.clearPeggedPairsList = function() {
  return this.setPeggedPairsList([]);
};


/**
 * optional sgn.cbridge.v1.CbrConfig cbr_config = 3;
 * @return {?proto.sgn.cbridge.v1.CbrConfig}
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.getCbrConfig = function() {
  return /** @type{?proto.sgn.cbridge.v1.CbrConfig} */ (
    jspb.Message.getWrapperField(this, sgn_cbridge_v1_cbridge_pb.CbrConfig, 3));
};


/**
 * @param {?proto.sgn.cbridge.v1.CbrConfig|undefined} value
 * @return {!proto.sgn.gateway.v1.GetAllConfigsResponse} returns this
*/
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.setCbrConfig = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetAllConfigsResponse} returns this
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.clearCbrConfig = function() {
  return this.setCbrConfig(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetAllConfigsResponse.prototype.hasCbrConfig = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    chainId: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest;
  return proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setChainId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChainId();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
};


/**
 * optional uint32 chain_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.prototype.getChainId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest} returns this
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainRequest.prototype.setChainId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ExtendedToken.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ExtendedToken} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ExtendedToken.toObject = function(includeInstance, msg) {
  var f, obj = {
    token: (f = msg.getToken()) && sgn_cbridge_v1_query_pb.Token.toObject(includeInstance, f),
    delayThreshold: jspb.Message.getFieldWithDefault(msg, 2, ""),
    epochVolumeCaps: jspb.Message.getFieldWithDefault(msg, 3, ""),
    minSend: jspb.Message.getFieldWithDefault(msg, 4, ""),
    maxSend: jspb.Message.getFieldWithDefault(msg, 5, ""),
    minAdd: jspb.Message.getFieldWithDefault(msg, 6, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ExtendedToken}
 */
proto.sgn.gateway.v1.ExtendedToken.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ExtendedToken;
  return proto.sgn.gateway.v1.ExtendedToken.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ExtendedToken} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ExtendedToken}
 */
proto.sgn.gateway.v1.ExtendedToken.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new sgn_cbridge_v1_query_pb.Token;
      reader.readMessage(value,sgn_cbridge_v1_query_pb.Token.deserializeBinaryFromReader);
      msg.setToken(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDelayThreshold(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEpochVolumeCaps(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setMinSend(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setMaxSend(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setMinAdd(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ExtendedToken.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ExtendedToken} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ExtendedToken.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getToken();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      sgn_cbridge_v1_query_pb.Token.serializeBinaryToWriter
    );
  }
  f = message.getDelayThreshold();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getEpochVolumeCaps();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getMinSend();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getMaxSend();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getMinAdd();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
};


/**
 * optional sgn.cbridge.v1.Token token = 1;
 * @return {?proto.sgn.cbridge.v1.Token}
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.getToken = function() {
  return /** @type{?proto.sgn.cbridge.v1.Token} */ (
    jspb.Message.getWrapperField(this, sgn_cbridge_v1_query_pb.Token, 1));
};


/**
 * @param {?proto.sgn.cbridge.v1.Token|undefined} value
 * @return {!proto.sgn.gateway.v1.ExtendedToken} returns this
*/
proto.sgn.gateway.v1.ExtendedToken.prototype.setToken = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ExtendedToken} returns this
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.clearToken = function() {
  return this.setToken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.hasToken = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string delay_threshold = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.getDelayThreshold = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ExtendedToken} returns this
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.setDelayThreshold = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string epoch_volume_caps = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.getEpochVolumeCaps = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ExtendedToken} returns this
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.setEpochVolumeCaps = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string min_send = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.getMinSend = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ExtendedToken} returns this
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.setMinSend = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string max_send = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.getMaxSend = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ExtendedToken} returns this
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.setMaxSend = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string min_add = 6;
 * @return {string}
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.getMinAdd = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ExtendedToken} returns this
 */
proto.sgn.gateway.v1.ExtendedToken.prototype.setMinAdd = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.repeatedFields_ = [5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    delayPeriod: jspb.Message.getFieldWithDefault(msg, 2, ""),
    epochLength: jspb.Message.getFieldWithDefault(msg, 3, ""),
    nativeWrap: jspb.Message.getFieldWithDefault(msg, 4, ""),
    tokensList: jspb.Message.toObjectList(msg.getTokensList(),
    proto.sgn.gateway.v1.ExtendedToken.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse;
  return proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDelayPeriod(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setEpochLength(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setNativeWrap(value);
      break;
    case 5:
      var value = new proto.sgn.gateway.v1.ExtendedToken;
      reader.readMessage(value,proto.sgn.gateway.v1.ExtendedToken.deserializeBinaryFromReader);
      msg.addTokens(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getDelayPeriod();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getEpochLength();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getNativeWrap();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getTokensList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.sgn.gateway.v1.ExtendedToken.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse} returns this
*/
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse} returns this
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string delay_period = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.getDelayPeriod = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse} returns this
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.setDelayPeriod = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string epoch_length = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.getEpochLength = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse} returns this
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.setEpochLength = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string native_wrap = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.getNativeWrap = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse} returns this
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.setNativeWrap = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * repeated ExtendedToken tokens = 5;
 * @return {!Array<!proto.sgn.gateway.v1.ExtendedToken>}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.getTokensList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.ExtendedToken>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.ExtendedToken, 5));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.ExtendedToken>} value
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse} returns this
*/
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.setTokensList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.sgn.gateway.v1.ExtendedToken=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.ExtendedToken}
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.addTokens = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.sgn.gateway.v1.ExtendedToken, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse} returns this
 */
proto.sgn.gateway.v1.GetCbrConfigsOnChainResponse.prototype.clearTokensList = function() {
  return this.setTokensList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.RetentionRewardsEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.RetentionRewardsEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    eventId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    eventStartTime: jspb.Message.getFieldWithDefault(msg, 2, 0),
    eventEndTime: jspb.Message.getFieldWithDefault(msg, 3, 0),
    wrapper: (f = msg.getWrapper()) && proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.toObject(includeInstance, f),
    eventPromoImgUrl: jspb.Message.getFieldWithDefault(msg, 5, ""),
    eventFaqLinkUrl: jspb.Message.getFieldWithDefault(msg, 6, ""),
    eventRewardsTooltip: jspb.Message.getFieldWithDefault(msg, 7, ""),
    eventDescription: jspb.Message.getFieldWithDefault(msg, 8, ""),
    eventTitle: jspb.Message.getFieldWithDefault(msg, 9, ""),
    eventMaxRewardCap: jspb.Message.getFloatingPointFieldWithDefault(msg, 10, 0.0),
    soFarSumReward: jspb.Message.getFloatingPointFieldWithDefault(msg, 11, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.RetentionRewardsEvent;
  return proto.sgn.gateway.v1.RetentionRewardsEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.RetentionRewardsEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventStartTime(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventEndTime(value);
      break;
    case 4:
      var value = new proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper;
      reader.readMessage(value,proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.deserializeBinaryFromReader);
      msg.setWrapper(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventPromoImgUrl(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventFaqLinkUrl(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventRewardsTooltip(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventDescription(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventTitle(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setEventMaxRewardCap(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setSoFarSumReward(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.RetentionRewardsEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.RetentionRewardsEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEventId();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getEventStartTime();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getEventEndTime();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getWrapper();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.serializeBinaryToWriter
    );
  }
  f = message.getEventPromoImgUrl();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getEventFaqLinkUrl();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getEventRewardsTooltip();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getEventDescription();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getEventTitle();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
  f = message.getEventMaxRewardCap();
  if (f !== 0.0) {
    writer.writeDouble(
      10,
      f
    );
  }
  f = message.getSoFarSumReward();
  if (f !== 0.0) {
    writer.writeDouble(
      11,
      f
    );
  }
};


/**
 * optional uint64 event_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getEventId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setEventId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint64 event_start_time = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getEventStartTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setEventStartTime = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 event_end_time = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getEventEndTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setEventEndTime = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional RetentionRewardsEventLevelConfigWrapper wrapper = 4;
 * @return {?proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getWrapper = function() {
  return /** @type{?proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper, 4));
};


/**
 * @param {?proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper|undefined} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
*/
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setWrapper = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.clearWrapper = function() {
  return this.setWrapper(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.hasWrapper = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string event_promo_img_url = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getEventPromoImgUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setEventPromoImgUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string event_faq_link_url = 6;
 * @return {string}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getEventFaqLinkUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setEventFaqLinkUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string event_rewards_tooltip = 7;
 * @return {string}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getEventRewardsTooltip = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setEventRewardsTooltip = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional string event_description = 8;
 * @return {string}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getEventDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setEventDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional string event_title = 9;
 * @return {string}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getEventTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setEventTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 9, value);
};


/**
 * optional double event_max_reward_cap = 10;
 * @return {number}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getEventMaxRewardCap = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 10, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setEventMaxRewardCap = function(value) {
  return jspb.Message.setProto3FloatField(this, 10, value);
};


/**
 * optional double so_far_sum_reward = 11;
 * @return {number}
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.getSoFarSumReward = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 11, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEvent} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEvent.prototype.setSoFarSumReward = function(value) {
  return jspb.Message.setProto3FloatField(this, 11, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.toObject = function(includeInstance, msg) {
  var f, obj = {
    levelConfigMap: (f = msg.getLevelConfigMap()) ? f.toObject(includeInstance, proto.sgn.gateway.v1.RetentionRewardsLevelConfig.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper}
 */
proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper;
  return proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper}
 */
proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getLevelConfigMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.sgn.gateway.v1.RetentionRewardsLevelConfig.deserializeBinaryFromReader, "", new proto.sgn.gateway.v1.RetentionRewardsLevelConfig());
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLevelConfigMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.sgn.gateway.v1.RetentionRewardsLevelConfig.serializeBinaryToWriter);
  }
};


/**
 * map<string, RetentionRewardsLevelConfig> level_config = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.sgn.gateway.v1.RetentionRewardsLevelConfig>}
 */
proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.prototype.getLevelConfigMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.sgn.gateway.v1.RetentionRewardsLevelConfig>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      proto.sgn.gateway.v1.RetentionRewardsLevelConfig));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsEventLevelConfigWrapper.prototype.clearLevelConfigMap = function() {
  this.getLevelConfigMap().clear();
  return this;};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.RetentionRewardsLevelConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.RetentionRewardsLevelConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    maxReward: jspb.Message.getFieldWithDefault(msg, 1, ""),
    maxTransferVolume: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.RetentionRewardsLevelConfig}
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.RetentionRewardsLevelConfig;
  return proto.sgn.gateway.v1.RetentionRewardsLevelConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.RetentionRewardsLevelConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.RetentionRewardsLevelConfig}
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setMaxReward(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setMaxTransferVolume(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.RetentionRewardsLevelConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.RetentionRewardsLevelConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMaxReward();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getMaxTransferVolume();
  if (f !== 0.0) {
    writer.writeDouble(
      2,
      f
    );
  }
};


/**
 * optional string max_reward = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig.prototype.getMaxReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsLevelConfig} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig.prototype.setMaxReward = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional double max_transfer_volume = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig.prototype.getMaxTransferVolume = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.RetentionRewardsLevelConfig} returns this
 */
proto.sgn.gateway.v1.RetentionRewardsLevelConfig.prototype.setMaxTransferVolume = function(value) {
  return jspb.Message.setProto3FloatField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest;
  return proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    eventId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    eventEndTime: jspb.Message.getFieldWithDefault(msg, 3, 0),
    maxReward: jspb.Message.getFieldWithDefault(msg, 4, ""),
    maxTransferVolume: jspb.Message.getFloatingPointFieldWithDefault(msg, 5, 0.0),
    currentReward: jspb.Message.getFieldWithDefault(msg, 6, ""),
    celrUsdPrice: jspb.Message.getFloatingPointFieldWithDefault(msg, 7, 0.0),
    claimTime: jspb.Message.getFieldWithDefault(msg, 8, 0),
    signature: (f = msg.getSignature()) && sgn_common_v1_common_pb.Signature.toObject(includeInstance, f),
    eventPromoImgUrl: jspb.Message.getFieldWithDefault(msg, 10, ""),
    eventFaqLinkUrl: jspb.Message.getFieldWithDefault(msg, 11, ""),
    eventRewardsTooltip: jspb.Message.getFieldWithDefault(msg, 12, ""),
    eventDescription: jspb.Message.getFieldWithDefault(msg, 13, ""),
    eventTitle: jspb.Message.getFieldWithDefault(msg, 14, ""),
    eventMaxRewardCap: jspb.Message.getFloatingPointFieldWithDefault(msg, 15, 0.0),
    soFarSumReward: jspb.Message.getFloatingPointFieldWithDefault(msg, 16, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse;
  return proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventEndTime(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setMaxReward(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setMaxTransferVolume(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setCurrentReward(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setCelrUsdPrice(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setClaimTime(value);
      break;
    case 9:
      var value = new sgn_common_v1_common_pb.Signature;
      reader.readMessage(value,sgn_common_v1_common_pb.Signature.deserializeBinaryFromReader);
      msg.setSignature(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventPromoImgUrl(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventFaqLinkUrl(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventRewardsTooltip(value);
      break;
    case 13:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventDescription(value);
      break;
    case 14:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventTitle(value);
      break;
    case 15:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setEventMaxRewardCap(value);
      break;
    case 16:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setSoFarSumReward(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getEventId();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getEventEndTime();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getMaxReward();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getMaxTransferVolume();
  if (f !== 0.0) {
    writer.writeDouble(
      5,
      f
    );
  }
  f = message.getCurrentReward();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getCelrUsdPrice();
  if (f !== 0.0) {
    writer.writeDouble(
      7,
      f
    );
  }
  f = message.getClaimTime();
  if (f !== 0) {
    writer.writeUint64(
      8,
      f
    );
  }
  f = message.getSignature();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      sgn_common_v1_common_pb.Signature.serializeBinaryToWriter
    );
  }
  f = message.getEventPromoImgUrl();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getEventFaqLinkUrl();
  if (f.length > 0) {
    writer.writeString(
      11,
      f
    );
  }
  f = message.getEventRewardsTooltip();
  if (f.length > 0) {
    writer.writeString(
      12,
      f
    );
  }
  f = message.getEventDescription();
  if (f.length > 0) {
    writer.writeString(
      13,
      f
    );
  }
  f = message.getEventTitle();
  if (f.length > 0) {
    writer.writeString(
      14,
      f
    );
  }
  f = message.getEventMaxRewardCap();
  if (f !== 0.0) {
    writer.writeDouble(
      15,
      f
    );
  }
  f = message.getSoFarSumReward();
  if (f !== 0.0) {
    writer.writeDouble(
      16,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint64 event_id = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getEventId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setEventId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 event_end_time = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getEventEndTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setEventEndTime = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string max_reward = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getMaxReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setMaxReward = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional double max_transfer_volume = 5;
 * @return {number}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getMaxTransferVolume = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 5, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setMaxTransferVolume = function(value) {
  return jspb.Message.setProto3FloatField(this, 5, value);
};


/**
 * optional string current_reward = 6;
 * @return {string}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getCurrentReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setCurrentReward = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional double celr_usd_price = 7;
 * @return {number}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getCelrUsdPrice = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 7, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setCelrUsdPrice = function(value) {
  return jspb.Message.setProto3FloatField(this, 7, value);
};


/**
 * optional uint64 claim_time = 8;
 * @return {number}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getClaimTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setClaimTime = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};


/**
 * optional sgn.common.v1.Signature signature = 9;
 * @return {?proto.sgn.common.v1.Signature}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getSignature = function() {
  return /** @type{?proto.sgn.common.v1.Signature} */ (
    jspb.Message.getWrapperField(this, sgn_common_v1_common_pb.Signature, 9));
};


/**
 * @param {?proto.sgn.common.v1.Signature|undefined} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setSignature = function(value) {
  return jspb.Message.setWrapperField(this, 9, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.clearSignature = function() {
  return this.setSignature(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.hasSignature = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional string event_promo_img_url = 10;
 * @return {string}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getEventPromoImgUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setEventPromoImgUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional string event_faq_link_url = 11;
 * @return {string}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getEventFaqLinkUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setEventFaqLinkUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 11, value);
};


/**
 * optional string event_rewards_tooltip = 12;
 * @return {string}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getEventRewardsTooltip = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 12, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setEventRewardsTooltip = function(value) {
  return jspb.Message.setProto3StringField(this, 12, value);
};


/**
 * optional string event_description = 13;
 * @return {string}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getEventDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 13, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setEventDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 13, value);
};


/**
 * optional string event_title = 14;
 * @return {string}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getEventTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 14, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setEventTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 14, value);
};


/**
 * optional double event_max_reward_cap = 15;
 * @return {number}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getEventMaxRewardCap = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 15, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setEventMaxRewardCap = function(value) {
  return jspb.Message.setProto3FloatField(this, 15, value);
};


/**
 * optional double so_far_sum_reward = 16;
 * @return {number}
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.getSoFarSumReward = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 16, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetRetentionRewardsInfoResponse.prototype.setSoFarSumReward = function(value) {
  return jspb.Message.setProto3FloatField(this, 16, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ClaimRetentionRewardsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsRequest}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ClaimRetentionRewardsRequest;
  return proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ClaimRetentionRewardsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsRequest}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ClaimRetentionRewardsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsRequest} returns this
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    eventId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    currentReward: jspb.Message.getFieldWithDefault(msg, 3, ""),
    signature: (f = msg.getSignature()) && sgn_common_v1_common_pb.Signature.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ClaimRetentionRewardsResponse;
  return proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setCurrentReward(value);
      break;
    case 4:
      var value = new sgn_common_v1_common_pb.Signature;
      reader.readMessage(value,sgn_common_v1_common_pb.Signature.deserializeBinaryFromReader);
      msg.setSignature(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getEventId();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getCurrentReward();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getSignature();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      sgn_common_v1_common_pb.Signature.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse} returns this
*/
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse} returns this
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint64 event_id = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.getEventId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse} returns this
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.setEventId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string current_reward = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.getCurrentReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse} returns this
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.setCurrentReward = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional sgn.common.v1.Signature signature = 4;
 * @return {?proto.sgn.common.v1.Signature}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.getSignature = function() {
  return /** @type{?proto.sgn.common.v1.Signature} */ (
    jspb.Message.getWrapperField(this, sgn_common_v1_common_pb.Signature, 4));
};


/**
 * @param {?proto.sgn.common.v1.Signature|undefined} value
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse} returns this
*/
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.setSignature = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ClaimRetentionRewardsResponse} returns this
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.clearSignature = function() {
  return this.setSignature(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ClaimRetentionRewardsResponse.prototype.hasSignature = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest;
  return proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    ranksList: jspb.Message.toObjectList(msg.getRanksList(),
    proto.sgn.gateway.v1.IncentiveCampaignRank.toObject, includeInstance),
    updateTime: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse;
  return proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.IncentiveCampaignRank;
      reader.readMessage(value,proto.sgn.gateway.v1.IncentiveCampaignRank.deserializeBinaryFromReader);
      msg.addRanks(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setUpdateTime(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getRanksList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.sgn.gateway.v1.IncentiveCampaignRank.serializeBinaryToWriter
    );
  }
  f = message.getUpdateTime();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse} returns this
*/
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse} returns this
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated IncentiveCampaignRank ranks = 2;
 * @return {!Array<!proto.sgn.gateway.v1.IncentiveCampaignRank>}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.getRanksList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.IncentiveCampaignRank>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.IncentiveCampaignRank, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.IncentiveCampaignRank>} value
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse} returns this
*/
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.setRanksList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.gateway.v1.IncentiveCampaignRank=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.IncentiveCampaignRank}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.addRanks = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.gateway.v1.IncentiveCampaignRank, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse} returns this
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.clearRanksList = function() {
  return this.setRanksList([]);
};


/**
 * optional uint64 update_time = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.getUpdateTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse} returns this
 */
proto.sgn.gateway.v1.GetIncentiveCampaignCelrRankResponse.prototype.setUpdateTime = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest;
  return proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    ranksList: jspb.Message.toObjectList(msg.getRanksList(),
    proto.sgn.gateway.v1.IncentiveCampaignRank.toObject, includeInstance),
    updateTime: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse;
  return proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.IncentiveCampaignRank;
      reader.readMessage(value,proto.sgn.gateway.v1.IncentiveCampaignRank.deserializeBinaryFromReader);
      msg.addRanks(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setUpdateTime(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getRanksList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.sgn.gateway.v1.IncentiveCampaignRank.serializeBinaryToWriter
    );
  }
  f = message.getUpdateTime();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse} returns this
*/
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse} returns this
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated IncentiveCampaignRank ranks = 2;
 * @return {!Array<!proto.sgn.gateway.v1.IncentiveCampaignRank>}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.getRanksList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.IncentiveCampaignRank>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.IncentiveCampaignRank, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.IncentiveCampaignRank>} value
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse} returns this
*/
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.setRanksList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.gateway.v1.IncentiveCampaignRank=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.IncentiveCampaignRank}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.addRanks = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.gateway.v1.IncentiveCampaignRank, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse} returns this
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.clearRanksList = function() {
  return this.setRanksList([]);
};


/**
 * optional uint64 update_time = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.getUpdateTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse} returns this
 */
proto.sgn.gateway.v1.GetIncentiveCampaignBnbRankResponse.prototype.setUpdateTime = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest;
  return proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest} returns this
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    eligible: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse;
  return proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setEligible(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getEligible();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse} returns this
*/
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse} returns this
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bool eligible = 2;
 * @return {boolean}
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.prototype.getEligible = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse} returns this
 */
proto.sgn.gateway.v1.InIncentiveCampaignBnbWhiteListResponse.prototype.setEligible = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.IncentiveCampaignRank.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.IncentiveCampaignRank} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, ""),
    rank: jspb.Message.getFieldWithDefault(msg, 2, 0),
    volume: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.IncentiveCampaignRank}
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.IncentiveCampaignRank;
  return proto.sgn.gateway.v1.IncentiveCampaignRank.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.IncentiveCampaignRank} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.IncentiveCampaignRank}
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setRank(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setVolume(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.IncentiveCampaignRank.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.IncentiveCampaignRank} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRank();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getVolume();
  if (f !== 0.0) {
    writer.writeDouble(
      3,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.IncentiveCampaignRank} returns this
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint64 rank = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.prototype.getRank = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.IncentiveCampaignRank} returns this
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.prototype.setRank = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional double volume = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.prototype.getVolume = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.IncentiveCampaignRank} returns this
 */
proto.sgn.gateway.v1.IncentiveCampaignRank.prototype.setVolume = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.FeeRebateEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.FeeRebateEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.FeeRebateEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    eventId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    eventStartTime: jspb.Message.getFieldWithDefault(msg, 2, 0),
    eventEndTime: jspb.Message.getFieldWithDefault(msg, 3, 0),
    wrapper: (f = msg.getWrapper()) && proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.toObject(includeInstance, f),
    eventMaxRewardCap: jspb.Message.getFloatingPointFieldWithDefault(msg, 5, 0.0),
    soFarSumReward: jspb.Message.getFloatingPointFieldWithDefault(msg, 6, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.FeeRebateEvent}
 */
proto.sgn.gateway.v1.FeeRebateEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.FeeRebateEvent;
  return proto.sgn.gateway.v1.FeeRebateEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.FeeRebateEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.FeeRebateEvent}
 */
proto.sgn.gateway.v1.FeeRebateEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventStartTime(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventEndTime(value);
      break;
    case 4:
      var value = new proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper;
      reader.readMessage(value,proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.deserializeBinaryFromReader);
      msg.setWrapper(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setEventMaxRewardCap(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setSoFarSumReward(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.FeeRebateEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.FeeRebateEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.FeeRebateEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEventId();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getEventStartTime();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getEventEndTime();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getWrapper();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.serializeBinaryToWriter
    );
  }
  f = message.getEventMaxRewardCap();
  if (f !== 0.0) {
    writer.writeDouble(
      5,
      f
    );
  }
  f = message.getSoFarSumReward();
  if (f !== 0.0) {
    writer.writeDouble(
      6,
      f
    );
  }
};


/**
 * optional uint64 event_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.getEventId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.FeeRebateEvent} returns this
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.setEventId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint64 event_start_time = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.getEventStartTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.FeeRebateEvent} returns this
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.setEventStartTime = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 event_end_time = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.getEventEndTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.FeeRebateEvent} returns this
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.setEventEndTime = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional FeeRebateEventLevelConfigWrapper wrapper = 4;
 * @return {?proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper}
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.getWrapper = function() {
  return /** @type{?proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper, 4));
};


/**
 * @param {?proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper|undefined} value
 * @return {!proto.sgn.gateway.v1.FeeRebateEvent} returns this
*/
proto.sgn.gateway.v1.FeeRebateEvent.prototype.setWrapper = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.FeeRebateEvent} returns this
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.clearWrapper = function() {
  return this.setWrapper(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.hasWrapper = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional double event_max_reward_cap = 5;
 * @return {number}
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.getEventMaxRewardCap = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 5, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.FeeRebateEvent} returns this
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.setEventMaxRewardCap = function(value) {
  return jspb.Message.setProto3FloatField(this, 5, value);
};


/**
 * optional double so_far_sum_reward = 6;
 * @return {number}
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.getSoFarSumReward = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 6, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.FeeRebateEvent} returns this
 */
proto.sgn.gateway.v1.FeeRebateEvent.prototype.setSoFarSumReward = function(value) {
  return jspb.Message.setProto3FloatField(this, 6, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.toObject = function(includeInstance, msg) {
  var f, obj = {
    levelDivisionLowerBoundList: (f = jspb.Message.getRepeatedFloatingPointField(msg, 1)) == null ? undefined : f,
    levelConfigMap: (f = msg.getLevelConfigMap()) ? f.toObject(includeInstance, proto.sgn.gateway.v1.FeeRebateLevelConfig.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper}
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper;
  return proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper}
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedDouble() : [reader.readDouble()]);
      for (var i = 0; i < values.length; i++) {
        msg.addLevelDivisionLowerBound(values[i]);
      }
      break;
    case 2:
      var value = msg.getLevelConfigMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.sgn.gateway.v1.FeeRebateLevelConfig.deserializeBinaryFromReader, "", new proto.sgn.gateway.v1.FeeRebateLevelConfig());
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLevelDivisionLowerBoundList();
  if (f.length > 0) {
    writer.writePackedDouble(
      1,
      f
    );
  }
  f = message.getLevelConfigMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.sgn.gateway.v1.FeeRebateLevelConfig.serializeBinaryToWriter);
  }
};


/**
 * repeated double level_division_lower_bound = 1;
 * @return {!Array<number>}
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.prototype.getLevelDivisionLowerBoundList = function() {
  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedFloatingPointField(this, 1));
};


/**
 * @param {!Array<number>} value
 * @return {!proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper} returns this
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.prototype.setLevelDivisionLowerBoundList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {number} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper} returns this
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.prototype.addLevelDivisionLowerBound = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper} returns this
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.prototype.clearLevelDivisionLowerBoundList = function() {
  return this.setLevelDivisionLowerBoundList([]);
};


/**
 * map<string, FeeRebateLevelConfig> level_config = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.sgn.gateway.v1.FeeRebateLevelConfig>}
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.prototype.getLevelConfigMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.sgn.gateway.v1.FeeRebateLevelConfig>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      proto.sgn.gateway.v1.FeeRebateLevelConfig));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper} returns this
 */
proto.sgn.gateway.v1.FeeRebateEventLevelConfigWrapper.prototype.clearLevelConfigMap = function() {
  this.getLevelConfigMap().clear();
  return this;};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.FeeRebateLevelConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.FeeRebateLevelConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    rebatePortion: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
    maxReward: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.FeeRebateLevelConfig}
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.FeeRebateLevelConfig;
  return proto.sgn.gateway.v1.FeeRebateLevelConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.FeeRebateLevelConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.FeeRebateLevelConfig}
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setRebatePortion(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setMaxReward(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.FeeRebateLevelConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.FeeRebateLevelConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRebatePortion();
  if (f !== 0.0) {
    writer.writeDouble(
      1,
      f
    );
  }
  f = message.getMaxReward();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional double rebate_portion = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig.prototype.getRebatePortion = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.FeeRebateLevelConfig} returns this
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig.prototype.setRebatePortion = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional string max_reward = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig.prototype.getMaxReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.FeeRebateLevelConfig} returns this
 */
proto.sgn.gateway.v1.FeeRebateLevelConfig.prototype.setMaxReward = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetFeeRebateInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetFeeRebateInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetFeeRebateInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoRequest}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetFeeRebateInfoRequest;
  return proto.sgn.gateway.v1.GetFeeRebateInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetFeeRebateInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoRequest}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetFeeRebateInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetFeeRebateInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetFeeRebateInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetFeeRebateInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    eventId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    eventEndTime: jspb.Message.getFieldWithDefault(msg, 3, 0),
    rebatePortion: jspb.Message.getFloatingPointFieldWithDefault(msg, 4, 0.0),
    reward: jspb.Message.getFieldWithDefault(msg, 5, ""),
    celrUsdPrice: jspb.Message.getFloatingPointFieldWithDefault(msg, 6, 0.0),
    claimTime: jspb.Message.getFieldWithDefault(msg, 7, 0),
    signature: (f = msg.getSignature()) && sgn_common_v1_common_pb.Signature.toObject(includeInstance, f),
    eventMaxRewardCap: jspb.Message.getFloatingPointFieldWithDefault(msg, 9, 0.0),
    soFarSumReward: jspb.Message.getFloatingPointFieldWithDefault(msg, 10, 0.0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetFeeRebateInfoResponse;
  return proto.sgn.gateway.v1.GetFeeRebateInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventEndTime(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setRebatePortion(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setReward(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setCelrUsdPrice(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setClaimTime(value);
      break;
    case 8:
      var value = new sgn_common_v1_common_pb.Signature;
      reader.readMessage(value,sgn_common_v1_common_pb.Signature.deserializeBinaryFromReader);
      msg.setSignature(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setEventMaxRewardCap(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setSoFarSumReward(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetFeeRebateInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getEventId();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getEventEndTime();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getRebatePortion();
  if (f !== 0.0) {
    writer.writeDouble(
      4,
      f
    );
  }
  f = message.getReward();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getCelrUsdPrice();
  if (f !== 0.0) {
    writer.writeDouble(
      6,
      f
    );
  }
  f = message.getClaimTime();
  if (f !== 0) {
    writer.writeUint64(
      7,
      f
    );
  }
  f = message.getSignature();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      sgn_common_v1_common_pb.Signature.serializeBinaryToWriter
    );
  }
  f = message.getEventMaxRewardCap();
  if (f !== 0.0) {
    writer.writeDouble(
      9,
      f
    );
  }
  f = message.getSoFarSumReward();
  if (f !== 0.0) {
    writer.writeDouble(
      10,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint64 event_id = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.getEventId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.setEventId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 event_end_time = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.getEventEndTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.setEventEndTime = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional double rebate_portion = 4;
 * @return {number}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.getRebatePortion = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 4, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.setRebatePortion = function(value) {
  return jspb.Message.setProto3FloatField(this, 4, value);
};


/**
 * optional string reward = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.getReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.setReward = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional double celr_usd_price = 6;
 * @return {number}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.getCelrUsdPrice = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 6, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.setCelrUsdPrice = function(value) {
  return jspb.Message.setProto3FloatField(this, 6, value);
};


/**
 * optional uint64 claim_time = 7;
 * @return {number}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.getClaimTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.setClaimTime = function(value) {
  return jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * optional sgn.common.v1.Signature signature = 8;
 * @return {?proto.sgn.common.v1.Signature}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.getSignature = function() {
  return /** @type{?proto.sgn.common.v1.Signature} */ (
    jspb.Message.getWrapperField(this, sgn_common_v1_common_pb.Signature, 8));
};


/**
 * @param {?proto.sgn.common.v1.Signature|undefined} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.setSignature = function(value) {
  return jspb.Message.setWrapperField(this, 8, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.clearSignature = function() {
  return this.setSignature(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.hasSignature = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional double event_max_reward_cap = 9;
 * @return {number}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.getEventMaxRewardCap = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 9, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.setEventMaxRewardCap = function(value) {
  return jspb.Message.setProto3FloatField(this, 9, value);
};


/**
 * optional double so_far_sum_reward = 10;
 * @return {number}
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.getSoFarSumReward = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 10, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.GetFeeRebateInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetFeeRebateInfoResponse.prototype.setSoFarSumReward = function(value) {
  return jspb.Message.setProto3FloatField(this, 10, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ClaimFeeRebateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ClaimFeeRebateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ClaimFeeRebateRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimFeeRebateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateRequest}
 */
proto.sgn.gateway.v1.ClaimFeeRebateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ClaimFeeRebateRequest;
  return proto.sgn.gateway.v1.ClaimFeeRebateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ClaimFeeRebateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateRequest}
 */
proto.sgn.gateway.v1.ClaimFeeRebateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ClaimFeeRebateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ClaimFeeRebateRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ClaimFeeRebateRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimFeeRebateRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.ClaimFeeRebateRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateRequest} returns this
 */
proto.sgn.gateway.v1.ClaimFeeRebateRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ClaimFeeRebateResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ClaimFeeRebateResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    eventId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    reward: jspb.Message.getFieldWithDefault(msg, 3, ""),
    signature: (f = msg.getSignature()) && sgn_common_v1_common_pb.Signature.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateResponse}
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ClaimFeeRebateResponse;
  return proto.sgn.gateway.v1.ClaimFeeRebateResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ClaimFeeRebateResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateResponse}
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setReward(value);
      break;
    case 4:
      var value = new sgn_common_v1_common_pb.Signature;
      reader.readMessage(value,sgn_common_v1_common_pb.Signature.deserializeBinaryFromReader);
      msg.setSignature(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ClaimFeeRebateResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ClaimFeeRebateResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getEventId();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getReward();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getSignature();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      sgn_common_v1_common_pb.Signature.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateResponse} returns this
*/
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateResponse} returns this
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint64 event_id = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.getEventId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateResponse} returns this
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.setEventId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string reward = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.getReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateResponse} returns this
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.setReward = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional sgn.common.v1.Signature signature = 4;
 * @return {?proto.sgn.common.v1.Signature}
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.getSignature = function() {
  return /** @type{?proto.sgn.common.v1.Signature} */ (
    jspb.Message.getWrapperField(this, sgn_common_v1_common_pb.Signature, 4));
};


/**
 * @param {?proto.sgn.common.v1.Signature|undefined} value
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateResponse} returns this
*/
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.setSignature = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ClaimFeeRebateResponse} returns this
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.clearSignature = function() {
  return this.setSignature(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ClaimFeeRebateResponse.prototype.hasSignature = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.BscCampaignEventConfig.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.BscCampaignEventConfig} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.toObject = function(includeInstance, msg) {
  var f, obj = {
    eventId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    eventStartTime: jspb.Message.getFieldWithDefault(msg, 2, 0),
    eventEndTime: jspb.Message.getFieldWithDefault(msg, 3, 0),
    eventPromoImgUrl: jspb.Message.getFieldWithDefault(msg, 4, ""),
    eventFaqLinkUrl: jspb.Message.getFieldWithDefault(msg, 5, ""),
    eventRewardsTooltip: jspb.Message.getFieldWithDefault(msg, 6, ""),
    eventDescription: jspb.Message.getFieldWithDefault(msg, 7, ""),
    eventTitle: jspb.Message.getFieldWithDefault(msg, 8, ""),
    wbnbAddr: jspb.Message.getFieldWithDefault(msg, 9, ""),
    rewardContractAddr: jspb.Message.getFieldWithDefault(msg, 10, ""),
    eventMaxRewardCap: jspb.Message.getFloatingPointFieldWithDefault(msg, 11, 0.0),
    soFarSumReward: jspb.Message.getFloatingPointFieldWithDefault(msg, 12, 0.0),
    maxReward: jspb.Message.getFieldWithDefault(msg, 13, ""),
    maxTransferVolume: jspb.Message.getFloatingPointFieldWithDefault(msg, 14, 0.0),
    transferWhiteList: (f = msg.getTransferWhiteList()) && proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.BscCampaignEventConfig;
  return proto.sgn.gateway.v1.BscCampaignEventConfig.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.BscCampaignEventConfig} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventStartTime(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventEndTime(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventPromoImgUrl(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventFaqLinkUrl(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventRewardsTooltip(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventDescription(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setEventTitle(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setWbnbAddr(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setRewardContractAddr(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setEventMaxRewardCap(value);
      break;
    case 12:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setSoFarSumReward(value);
      break;
    case 13:
      var value = /** @type {string} */ (reader.readString());
      msg.setMaxReward(value);
      break;
    case 14:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setMaxTransferVolume(value);
      break;
    case 15:
      var value = new proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper;
      reader.readMessage(value,proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.deserializeBinaryFromReader);
      msg.setTransferWhiteList(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.BscCampaignEventConfig.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.BscCampaignEventConfig} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEventId();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getEventStartTime();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getEventEndTime();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getEventPromoImgUrl();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getEventFaqLinkUrl();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getEventRewardsTooltip();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getEventDescription();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = message.getEventTitle();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getWbnbAddr();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
  f = message.getRewardContractAddr();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getEventMaxRewardCap();
  if (f !== 0.0) {
    writer.writeDouble(
      11,
      f
    );
  }
  f = message.getSoFarSumReward();
  if (f !== 0.0) {
    writer.writeDouble(
      12,
      f
    );
  }
  f = message.getMaxReward();
  if (f.length > 0) {
    writer.writeString(
      13,
      f
    );
  }
  f = message.getMaxTransferVolume();
  if (f !== 0.0) {
    writer.writeDouble(
      14,
      f
    );
  }
  f = message.getTransferWhiteList();
  if (f != null) {
    writer.writeMessage(
      15,
      f,
      proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.serializeBinaryToWriter
    );
  }
};


/**
 * optional uint64 event_id = 1;
 * @return {number}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getEventId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setEventId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint64 event_start_time = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getEventStartTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setEventStartTime = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 event_end_time = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getEventEndTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setEventEndTime = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string event_promo_img_url = 4;
 * @return {string}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getEventPromoImgUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setEventPromoImgUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string event_faq_link_url = 5;
 * @return {string}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getEventFaqLinkUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setEventFaqLinkUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string event_rewards_tooltip = 6;
 * @return {string}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getEventRewardsTooltip = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setEventRewardsTooltip = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string event_description = 7;
 * @return {string}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getEventDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setEventDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};


/**
 * optional string event_title = 8;
 * @return {string}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getEventTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setEventTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional string wbnb_addr = 9;
 * @return {string}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getWbnbAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setWbnbAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 9, value);
};


/**
 * optional string reward_contract_addr = 10;
 * @return {string}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getRewardContractAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setRewardContractAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional double event_max_reward_cap = 11;
 * @return {number}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getEventMaxRewardCap = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 11, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setEventMaxRewardCap = function(value) {
  return jspb.Message.setProto3FloatField(this, 11, value);
};


/**
 * optional double so_far_sum_reward = 12;
 * @return {number}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getSoFarSumReward = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 12, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setSoFarSumReward = function(value) {
  return jspb.Message.setProto3FloatField(this, 12, value);
};


/**
 * optional string max_reward = 13;
 * @return {string}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getMaxReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 13, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setMaxReward = function(value) {
  return jspb.Message.setProto3StringField(this, 13, value);
};


/**
 * optional double max_transfer_volume = 14;
 * @return {number}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getMaxTransferVolume = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 14, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setMaxTransferVolume = function(value) {
  return jspb.Message.setProto3FloatField(this, 14, value);
};


/**
 * optional BscCampaignTransferWhiteListWrapper transfer_white_list = 15;
 * @return {?proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.getTransferWhiteList = function() {
  return /** @type{?proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper, 15));
};


/**
 * @param {?proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper|undefined} value
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
*/
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.setTransferWhiteList = function(value) {
  return jspb.Message.setWrapperField(this, 15, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.BscCampaignEventConfig} returns this
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.clearTransferWhiteList = function() {
  return this.setTransferWhiteList(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.BscCampaignEventConfig.prototype.hasTransferWhiteList = function() {
  return jspb.Message.getField(this, 15) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.toObject = function(includeInstance, msg) {
  var f, obj = {
    transferWhiteListMap: (f = msg.getTransferWhiteListMap()) ? f.toObject(includeInstance, proto.sgn.gateway.v1.BscCampaignTransferWhiteList.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper}
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper;
  return proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper}
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getTransferWhiteListMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.sgn.gateway.v1.BscCampaignTransferWhiteList.deserializeBinaryFromReader, "", new proto.sgn.gateway.v1.BscCampaignTransferWhiteList());
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransferWhiteListMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.sgn.gateway.v1.BscCampaignTransferWhiteList.serializeBinaryToWriter);
  }
};


/**
 * map<string, BscCampaignTransferWhiteList> transfer_white_list = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.sgn.gateway.v1.BscCampaignTransferWhiteList>}
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.prototype.getTransferWhiteListMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.sgn.gateway.v1.BscCampaignTransferWhiteList>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      proto.sgn.gateway.v1.BscCampaignTransferWhiteList));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper} returns this
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteListWrapper.prototype.clearTransferWhiteListMap = function() {
  this.getTransferWhiteListMap().clear();
  return this;};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.BscCampaignTransferWhiteList.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.BscCampaignTransferWhiteList} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.toObject = function(includeInstance, msg) {
  var f, obj = {
    chainIdsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.BscCampaignTransferWhiteList}
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.BscCampaignTransferWhiteList;
  return proto.sgn.gateway.v1.BscCampaignTransferWhiteList.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.BscCampaignTransferWhiteList} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.BscCampaignTransferWhiteList}
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var values = /** @type {!Array<number>} */ (reader.isDelimited() ? reader.readPackedUint64() : [reader.readUint64()]);
      for (var i = 0; i < values.length; i++) {
        msg.addChainIds(values[i]);
      }
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.BscCampaignTransferWhiteList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.BscCampaignTransferWhiteList} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChainIdsList();
  if (f.length > 0) {
    writer.writePackedUint64(
      1,
      f
    );
  }
};


/**
 * repeated uint64 chain_ids = 1;
 * @return {!Array<number>}
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.prototype.getChainIdsList = function() {
  return /** @type {!Array<number>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<number>} value
 * @return {!proto.sgn.gateway.v1.BscCampaignTransferWhiteList} returns this
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.prototype.setChainIdsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {number} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.BscCampaignTransferWhiteList} returns this
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.prototype.addChainIds = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.BscCampaignTransferWhiteList} returns this
 */
proto.sgn.gateway.v1.BscCampaignTransferWhiteList.prototype.clearChainIdsList = function() {
  return this.setChainIdsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetBscCampaignInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetBscCampaignInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetBscCampaignInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetBscCampaignInfoRequest}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetBscCampaignInfoRequest;
  return proto.sgn.gateway.v1.GetBscCampaignInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetBscCampaignInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetBscCampaignInfoRequest}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetBscCampaignInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetBscCampaignInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetBscCampaignInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.GetBscCampaignInfoRequest} returns this
 */
proto.sgn.gateway.v1.GetBscCampaignInfoRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.BscCampaignInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.BscCampaignInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.BscCampaignInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    eventConfig: (f = msg.getEventConfig()) && proto.sgn.gateway.v1.BscCampaignEventConfig.toObject(includeInstance, f),
    currentTransferVolume: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    wbnbUsdPrice: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    claimTime: jspb.Message.getFieldWithDefault(msg, 4, 0),
    signature: (f = msg.getSignature()) && sgn_common_v1_common_pb.Signature.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.BscCampaignInfo}
 */
proto.sgn.gateway.v1.BscCampaignInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.BscCampaignInfo;
  return proto.sgn.gateway.v1.BscCampaignInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.BscCampaignInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.BscCampaignInfo}
 */
proto.sgn.gateway.v1.BscCampaignInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.BscCampaignEventConfig;
      reader.readMessage(value,proto.sgn.gateway.v1.BscCampaignEventConfig.deserializeBinaryFromReader);
      msg.setEventConfig(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setCurrentTransferVolume(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setWbnbUsdPrice(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setClaimTime(value);
      break;
    case 5:
      var value = new sgn_common_v1_common_pb.Signature;
      reader.readMessage(value,sgn_common_v1_common_pb.Signature.deserializeBinaryFromReader);
      msg.setSignature(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.BscCampaignInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.BscCampaignInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.BscCampaignInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEventConfig();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.BscCampaignEventConfig.serializeBinaryToWriter
    );
  }
  f = message.getCurrentTransferVolume();
  if (f !== 0.0) {
    writer.writeDouble(
      2,
      f
    );
  }
  f = message.getWbnbUsdPrice();
  if (f !== 0.0) {
    writer.writeDouble(
      3,
      f
    );
  }
  f = message.getClaimTime();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
  f = message.getSignature();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      sgn_common_v1_common_pb.Signature.serializeBinaryToWriter
    );
  }
};


/**
 * optional BscCampaignEventConfig event_config = 1;
 * @return {?proto.sgn.gateway.v1.BscCampaignEventConfig}
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.getEventConfig = function() {
  return /** @type{?proto.sgn.gateway.v1.BscCampaignEventConfig} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.BscCampaignEventConfig, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.BscCampaignEventConfig|undefined} value
 * @return {!proto.sgn.gateway.v1.BscCampaignInfo} returns this
*/
proto.sgn.gateway.v1.BscCampaignInfo.prototype.setEventConfig = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.BscCampaignInfo} returns this
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.clearEventConfig = function() {
  return this.setEventConfig(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.hasEventConfig = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional double current_transfer_volume = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.getCurrentTransferVolume = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.BscCampaignInfo} returns this
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.setCurrentTransferVolume = function(value) {
  return jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional double wbnb_usd_price = 3;
 * @return {number}
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.getWbnbUsdPrice = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.BscCampaignInfo} returns this
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.setWbnbUsdPrice = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional uint64 claim_time = 4;
 * @return {number}
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.getClaimTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.BscCampaignInfo} returns this
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.setClaimTime = function(value) {
  return jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional sgn.common.v1.Signature signature = 5;
 * @return {?proto.sgn.common.v1.Signature}
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.getSignature = function() {
  return /** @type{?proto.sgn.common.v1.Signature} */ (
    jspb.Message.getWrapperField(this, sgn_common_v1_common_pb.Signature, 5));
};


/**
 * @param {?proto.sgn.common.v1.Signature|undefined} value
 * @return {!proto.sgn.gateway.v1.BscCampaignInfo} returns this
*/
proto.sgn.gateway.v1.BscCampaignInfo.prototype.setSignature = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.BscCampaignInfo} returns this
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.clearSignature = function() {
  return this.setSignature(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.BscCampaignInfo.prototype.hasSignature = function() {
  return jspb.Message.getField(this, 5) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetBscCampaignInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetBscCampaignInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    infoList: jspb.Message.toObjectList(msg.getInfoList(),
    proto.sgn.gateway.v1.BscCampaignInfo.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetBscCampaignInfoResponse}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetBscCampaignInfoResponse;
  return proto.sgn.gateway.v1.GetBscCampaignInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetBscCampaignInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetBscCampaignInfoResponse}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = new proto.sgn.gateway.v1.BscCampaignInfo;
      reader.readMessage(value,proto.sgn.gateway.v1.BscCampaignInfo.deserializeBinaryFromReader);
      msg.addInfo(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetBscCampaignInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetBscCampaignInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getInfoList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.sgn.gateway.v1.BscCampaignInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetBscCampaignInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetBscCampaignInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated BscCampaignInfo info = 2;
 * @return {!Array<!proto.sgn.gateway.v1.BscCampaignInfo>}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.prototype.getInfoList = function() {
  return /** @type{!Array<!proto.sgn.gateway.v1.BscCampaignInfo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.sgn.gateway.v1.BscCampaignInfo, 2));
};


/**
 * @param {!Array<!proto.sgn.gateway.v1.BscCampaignInfo>} value
 * @return {!proto.sgn.gateway.v1.GetBscCampaignInfoResponse} returns this
*/
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.prototype.setInfoList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.sgn.gateway.v1.BscCampaignInfo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.BscCampaignInfo}
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.prototype.addInfo = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.sgn.gateway.v1.BscCampaignInfo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetBscCampaignInfoResponse} returns this
 */
proto.sgn.gateway.v1.GetBscCampaignInfoResponse.prototype.clearInfoList = function() {
  return this.setInfoList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: jspb.Message.getFieldWithDefault(msg, 1, ""),
    eventId: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest;
  return proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getEventId();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest} returns this
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.prototype.setAddr = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint64 event_id = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.prototype.getEventId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest} returns this
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardRequest.prototype.setEventId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    eventId: jspb.Message.getFieldWithDefault(msg, 2, 0),
    currentReward: jspb.Message.getFieldWithDefault(msg, 3, ""),
    signature: (f = msg.getSignature()) && sgn_common_v1_common_pb.Signature.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse;
  return proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEventId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setCurrentReward(value);
      break;
    case 4:
      var value = new sgn_common_v1_common_pb.Signature;
      reader.readMessage(value,sgn_common_v1_common_pb.Signature.deserializeBinaryFromReader);
      msg.setSignature(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getEventId();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getCurrentReward();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getSignature();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      sgn_common_v1_common_pb.Signature.serializeBinaryToWriter
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse} returns this
*/
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse} returns this
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint64 event_id = 2;
 * @return {number}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.getEventId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse} returns this
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.setEventId = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string current_reward = 3;
 * @return {string}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.getCurrentReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse} returns this
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.setCurrentReward = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional sgn.common.v1.Signature signature = 4;
 * @return {?proto.sgn.common.v1.Signature}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.getSignature = function() {
  return /** @type{?proto.sgn.common.v1.Signature} */ (
    jspb.Message.getWrapperField(this, sgn_common_v1_common_pb.Signature, 4));
};


/**
 * @param {?proto.sgn.common.v1.Signature|undefined} value
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse} returns this
*/
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.setSignature = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse} returns this
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.clearSignature = function() {
  return this.setSignature(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.ClaimGetBscCampaignRewardResponse.prototype.hasSignature = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest;
  return proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    err: (f = msg.getErr()) && proto.sgn.gateway.v1.ErrMsg.toObject(includeInstance, f),
    reportsMap: (f = msg.getReportsMap()) ? f.toObject(includeInstance, proto.sgn.health.v1.SgnAnalyticsReport.toObject) : [],
    problematicAddrsList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse;
  return proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.sgn.gateway.v1.ErrMsg;
      reader.readMessage(value,proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader);
      msg.setErr(value);
      break;
    case 2:
      var value = msg.getReportsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.sgn.health.v1.SgnAnalyticsReport.deserializeBinaryFromReader, "", new proto.sgn.health.v1.SgnAnalyticsReport());
         });
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addProblematicAddrs(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter
    );
  }
  f = message.getReportsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.sgn.health.v1.SgnAnalyticsReport.serializeBinaryToWriter);
  }
  f = message.getProblematicAddrsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
};


/**
 * optional ErrMsg err = 1;
 * @return {?proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.getErr = function() {
  return /** @type{?proto.sgn.gateway.v1.ErrMsg} */ (
    jspb.Message.getWrapperField(this, proto.sgn.gateway.v1.ErrMsg, 1));
};


/**
 * @param {?proto.sgn.gateway.v1.ErrMsg|undefined} value
 * @return {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse} returns this
*/
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.setErr = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse} returns this
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.clearErr = function() {
  return this.setErr(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.hasErr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * map<string, sgn.health.v1.SgnAnalyticsReport> reports = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.sgn.health.v1.SgnAnalyticsReport>}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.getReportsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.sgn.health.v1.SgnAnalyticsReport>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      proto.sgn.health.v1.SgnAnalyticsReport));
};


/**
 * Clears values from the map. The map will be non-null.
 * @return {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse} returns this
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.clearReportsMap = function() {
  this.getReportsMap().clear();
  return this;};


/**
 * repeated string problematic_addrs = 3;
 * @return {!Array<string>}
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.getProblematicAddrsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse} returns this
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.setProblematicAddrsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse} returns this
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.addProblematicAddrs = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse} returns this
 */
proto.sgn.gateway.v1.GetCurrentBlockNumberByNodeResponse.prototype.clearProblematicAddrsList = function() {
  return this.setProblematicAddrsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.sgn.gateway.v1.ErrMsg.prototype.toObject = function(opt_includeInstance) {
  return proto.sgn.gateway.v1.ErrMsg.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.sgn.gateway.v1.ErrMsg} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ErrMsg.toObject = function(includeInstance, msg) {
  var f, obj = {
    code: jspb.Message.getFieldWithDefault(msg, 1, 0),
    msg: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.ErrMsg.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.sgn.gateway.v1.ErrMsg;
  return proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.sgn.gateway.v1.ErrMsg} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.sgn.gateway.v1.ErrMsg}
 */
proto.sgn.gateway.v1.ErrMsg.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.sgn.gateway.v1.ErrCode} */ (reader.readEnum());
      msg.setCode(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setMsg(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.sgn.gateway.v1.ErrMsg.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.sgn.gateway.v1.ErrMsg} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.sgn.gateway.v1.ErrMsg.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCode();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getMsg();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional ErrCode code = 1;
 * @return {!proto.sgn.gateway.v1.ErrCode}
 */
proto.sgn.gateway.v1.ErrMsg.prototype.getCode = function() {
  return /** @type {!proto.sgn.gateway.v1.ErrCode} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.sgn.gateway.v1.ErrCode} value
 * @return {!proto.sgn.gateway.v1.ErrMsg} returns this
 */
proto.sgn.gateway.v1.ErrMsg.prototype.setCode = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional string msg = 2;
 * @return {string}
 */
proto.sgn.gateway.v1.ErrMsg.prototype.getMsg = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.sgn.gateway.v1.ErrMsg} returns this
 */
proto.sgn.gateway.v1.ErrMsg.prototype.setMsg = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * @enum {number}
 */
proto.sgn.gateway.v1.LPType = {
  LP_TYPE_UNKNOWN: 0,
  LP_TYPE_ADD: 1,
  LP_TYPE_REMOVE: 2
};

/**
 * @enum {number}
 */
proto.sgn.gateway.v1.CSType = {
  CT_UNKNOWN: 0,
  CT_TX: 1,
  CT_LP_ADD: 2,
  CT_LP_RM: 3,
  CT_DROP_GAS: 4
};

/**
 * @enum {number}
 */
proto.sgn.gateway.v1.CSOperation = {
  CA_UNKNOWN: 0,
  CA_NORMAL: 1,
  CA_WAITING: 2,
  CA_REPORT: 3,
  CA_USE_RESYNC_TOOL: 4,
  CA_USE_RESIGN_TOOL: 5,
  CA_USE_RESUMBIT_TOOL: 6,
  CA_MORE_INFO_NEEDED: 7,
  CA_CS_TOOL: 8
};

/**
 * @enum {number}
 */
proto.sgn.gateway.v1.UserCaseStatus = {
  CC_UNKNOWN: 0,
  CC_TRANSFER_NO_HISTORY: 1,
  CC_TRANSFER_SUBMITTING: 2,
  CC_TRANSFER_WAITING_FOR_SGN_CONFIRMATION: 3,
  CC_TRANSFER_WAITING_FOR_FUND_RELEASE: 4,
  CC_TRANSFER_REQUESTING_REFUND: 5,
  CC_TRANSFER_CONFIRMING_YOUR_REFUND: 6,
  CC_ADD_NO_HISTORY: 7,
  CC_ADD_SUBMITTING: 8,
  CC_ADD_WAITING_FOR_SGN: 9,
  CC_WAITING_FOR_LP: 10,
  CC_WITHDRAW_SUBMITTING: 11,
  CC_WITHDRAW_WAITING_FOR_SGN: 12,
  CC_DROP_GAS_FAIL: 13,
  CC_DROP_GAS_SUCCESS: 14,
  CC_DROP_GAS_NO_RECORD: 15
};

/**
 * @enum {number}
 */
proto.sgn.gateway.v1.WithdrawMethodType = {
  WD_METHOD_TYPE_UNDEFINED: 0,
  WD_METHOD_TYPE_ONE_RM: 1,
  WD_METHOD_TYPE_ALL_IN_ONE: 2,
  WD_METHOD_TYPE_STAKING_CLAIM: 3
};

/**
 * @enum {number}
 */
proto.sgn.gateway.v1.LpActionType = {
  LAT_UNKNOWN: 0,
  LAT_ADD: 1,
  LAT_REMOVE: 2,
  LAT_AGGREGATE_REMOVE: 3
};

/**
 * @enum {number}
 */
proto.sgn.gateway.v1.ErrCode = {
  ERROR_CODE_UNDEFINED: 0,
  ERROR_CODE_COMMON: 500,
  ERROR_NO_TOKEN_ON_DST_CHAIN: 1001,
  ERROR_NO_TOKEN_ON_SRC_CHAIN: 1002,
  ERROR_INIT_WITHDRAW_FAILED: 1003,
  ERROR_CODE_NO_ENOUGH_TOKEN_ON_DST_CHAIN: 1004
};

goog.object.extend(exports, proto.sgn.gateway.v1);
