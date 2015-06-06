/**
 * Event handler for when the number of trade offers changes.
 * @param number Current number of trade offers.
 */
module.exports = function(number) {
    var log = this.log;

    log.info("Number of trade offers has changed: " + number);

    if(number !== 0) {
        resolveOffers(this);
    }
};

var TradeOffer = {
    ETradeOfferStateActive: 2,
    ETradeOfferStateAccepted: 3,
    ETradeOfferStateInvalidItems: 8
};

var resolveOfferTimer;
var beingProcessed = {};

function resolveOffers(Vapor) {
    Vapor.tradeOffers.getOffers({
        "get_received_offers": 1,
        "get_sent_offers": 0,
        "active_only": 1,
        "time_historical_cutoff": Math.round(Date.now() / 1000) - 3600
    }, function (err, offerhist) {
        if (err !== null) {
            Vapor.log.warn(err + " receiving offers, re-trying in 10s.");
            resolveOfferTimer = setTimeout(resolveOffers, 10000, Vapor);
        } else {
            try {
                offerhist.response.trade_offers_received.forEach(function (offer) {
                    if (offer.trade_offer_state === TradeOffer.ETradeOfferStateActive) {
                        checkOffer(Vapor, offer);
                    } else if (offer.trade_offer_state === TradeOffer.ETradeOfferStateInvalidItems) {
                        discardOffer(Vapor, offer);
                    }
                });
            } catch (e) {
                // Most likely no offers pending.
            }
        }
    });
}

function checkOffer(Vapor, offer) {
    if (beingProcessed[offer.tradeofferid]) {
        return;
    }

    beingProcessed[offer.tradeofferid] = true;

    if (offer.items_to_give !== undefined && offer.items_to_receive !== undefined) {
        var valid = offer.items_to_receive.every(function (item) {
            return item.appid === 440;
        });

        if (valid) {
            Vapor.log.info("[%d] Checking offer from %s...", offer.tradeofferid, offer.steamid_other);
            //loadPartnerInventory(offer);
        } else {
            Vapor.log.info("[" + offer.tradeofferid + "] Skipping: Includes non-supported items.");
        }
    } else {
        Vapor.log.info("[" + offer.tradeofferid + "] Skipping: Gift offer.");
    }
}


function discardOffer(Vapor, offer) {
    Vapor.log.info("[" + offer.tradeofferid + "/" + offer.steamid_other + "] Offer contains items no longer available, discarding.");
    offers.declineOffer({"tradeOfferId": offer.tradeofferid}, function () {
        delete beingProcessed[offer.tradeofferid];
    });
}
