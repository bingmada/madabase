import assert from "node:assert/strict";
import { classifyCostumeFeedProduct as classify, costumeFeedTransaction as transaction } from "./lib/costume-feed-classification.mjs";

const roles = [
  ["The Deluxe Joker Purple & Green Child Costume w/ Mask", "Child Costume", "masks-prosthetics", "costumes"],
  ["Creeping Dead Mask w/ Bone Suit Adult Costume", "Costume Rental", "masks-prosthetics", "costumes"],
  ["Clean Old Joel Arm, Dark", "Gore", "accessories-party-effects", "props-animatronics"],
  ["Skeleton Adult Costume", "Adult Costume", "", "costumes"],
  ["Costume mask", "Mask", "", "masks-prosthetics"],
  ["Mask for an adult costume", "Mask", "", "masks-prosthetics"],
  ["Costume wig", "Wigs", "", "wigs-makeup"],
  ["Santa Wig and Beard Costume Set", "Wigs", "", "wigs-makeup"],
  ["Display uniform figure", "Prop", "", "props-animatronics"],
];
for (const [title, type, description, expected] of roles) assert.equal(classify(title, type, description), expected, title);
const transactions = [
  [{ description: "A different, current and transparent prop" }, "unknown"],
  [{ description: "Rent facial flesh and exposed bones", product_type: "Costume Rental" }, "unknown"],
  [{ title: "Rental suit", description: "Rent or buy this parent product" }, "unknown"],
  [{ variant_title: "Buy / Large", description: "Rental deposit $250" }, "buy"],
  [{ option1: "X-Large", option2: "Rent" }, "rent"],
  [{ rent_or_buy: "Purchase" }, "buy"],
  [{ variant_title: "Rent / Buy" }, "conflict"],
  [{ option1: "Rental", size: "Small" }, "rent"],
  [{ size: "Parent size" }, "unknown"],
  [{ size: "Small", description: "Buy this costume" }, "unknown"],
];
for (const [row, expected] of transactions) assert.equal(transaction(row), expected, JSON.stringify(row));
console.log(JSON.stringify({ passed: true, roleCases: roles.length, transactionCases: transactions.length, parentDescriptionNeverEstablishesSelectedTransaction: true, noDatabaseQueryOrWrite: true }));
