export const amazonFamilySearchOverrides = {
  "automatic-bottle-washers": "Baby Brezza bottle washer dryer sterilizer",
  "business-usb-c-monitors": "Dell business USB-C hub monitor power delivery",
  "cat-gps-trackers": "Tractive GPS tracker for cats",
  "changing-pads": "Skip Hop wipe clean baby changing pad",
  "dog-activity-collars": "FitBark GPS dog activity tracker",
  "five-g-home-internet-gateways": "5G cellular modem router with SIM slot",
  "matter-hubs-bridges": "Matter smart home hub",
  "microchip-pet-feeders": "SureFeed microchip pet feeder",
  "network-attached-storage": "QNAP 2 bay NAS storage",
  "outdoor-smart-plugs": "Kasa outdoor smart plug weather resistant",
  "sfp-plus-network-switches": "10G SFP+ ethernet switch",
  "smart-dimmer-switches": "Kasa in-wall smart dimmer switch",
  "smart-displays": "Amazon Echo Show smart display",
  "smart-ev-chargers": "WiFi app smart Level 2 EV charger",
  "smart-home-sirens": "Zigbee WiFi smart alarm siren",
  "smart-irrigation-controllers": "Rachio smart sprinkler controller",
  "smart-smoke-co-listeners": "Ring Alarm smoke CO listener",
  "table-booster-seats": "toddler feeding booster seat with tray",
  "temperature-humidity-sensors": "Zigbee smart temperature humidity sensor",
  "wireless-pump-pet-fountains": "PETKIT wireless pump pet water fountain",
};

export const amazonFamilyRelevanceOverrides = {
  "automatic-bottle-washers": "bottle washer dryer",
  "business-usb-c-monitors": "USB-C business monitor",
  "cat-gps-trackers": "cat GPS tracker",
  "changing-pads": "baby changing pad",
  "dog-activity-collars": "GPS activity tracker",
  "five-g-home-internet-gateways": "5G router",
  "matter-hubs-bridges": "Matter hub",
  "microchip-pet-feeders": "microchip pet feeder",
  "network-attached-storage": "NAS",
  "outdoor-smart-plugs": "outdoor smart plug",
  "sfp-plus-network-switches": "SFP network switch",
  "smart-dimmer-switches": "smart dimmer switch",
  "smart-displays": "Echo Show display",
  "smart-ev-chargers": "smart EV charger",
  "smart-home-sirens": "smart alarm siren",
  "smart-irrigation-controllers": "smart sprinkler controller",
  "smart-smoke-co-listeners": "smoke CO listener",
  "table-booster-seats": "feeding booster seat",
  "temperature-humidity-sensors": "smart temperature humidity sensor",
  "wireless-pump-pet-fountains": "wireless pump pet fountain",
};

const semanticConstraints = {
  "automatic-bottle-washers": { all: [/bottle/i, /wash/i], none: [/replacement|washer toss|sports|game/i] },
  "business-usb-c-monitors": { all: [/monitor/i, /usb[ -]?c/i] },
  "cat-gps-trackers": { all: [/gps/i, /cat|pet/i], none: [/airtag|bluetooth|find my|google and ios|no subscription|tracking tag/i] },
  "changing-pads": { all: [/changing/i, /pad/i], none: [/disposable|underpad|100 pack/i] },
  "dog-activity-collars": { all: [/dog/i, /activity|health|fitness/i, /tracker|gps|collar/i], none: [/training collar|shock collar|e-collar/i] },
  "five-g-home-internet-gateways": { all: [/5g/i, /gateway|router|hotspot/i], none: [/antenna kit|signal booster|mount|case/i] },
  "microchip-pet-feeders": { all: [/microchip/i, /feeder/i], none: [/accessor|mat|holder|replacement|spare|lid only/i] },
  "outdoor-smart-plugs": { all: [/outdoor|weatherproof|weather resistant/i, /smart|wi[ -]?fi|alexa|google/i, /plug|outlet/i] },
  "sfp-plus-network-switches": { all: [/switch/i, /sfp\+/i], none: [/transceiver|module pack|dac cable/i] },
  "smart-dimmer-switches": { all: [/dimmer/i, /switch/i], none: [/outdoor|string light/i] },
  "smart-ev-chargers": { all: [/charger/i, /ev|electric vehicle/i], any: [/smart/i, /wi[ -]?fi/i, /app/i] },
  "smart-irrigation-controllers": { all: [/sprinkler|irrigation/i, /controller/i] },
  "smart-smoke-co-listeners": { all: [/listener/i, /smoke/i, /\bco\b|carbon monoxide/i] },
  "table-booster-seats": { all: [/booster/i, /seat/i], none: [/cushion|pad only/i] },
  "temperature-humidity-sensors": { all: [/temp(?:erature)?/i, /humid/i], any: [/smart/i, /wi[ -]?fi/i, /zigbee/i, /thread/i, /bluetooth/i, /app/i, /home assistant/i] },
  "wireless-pump-pet-fountains": { all: [/fountain/i, /wireless pump|cordless/i], none: [/replacement|replaced pump|filter|accessor/i] },
};

export function amazonFamilyTitleMeetsPolicy(familySlug, title) {
  const constraint = semanticConstraints[familySlug];
  if (!constraint) return true;
  const value = String(title ?? "");
  return constraint.all.every((pattern) => pattern.test(value))
    && (!constraint.any || constraint.any.some((pattern) => pattern.test(value)))
    && (!constraint.none || constraint.none.every((pattern) => !pattern.test(value)));
}
