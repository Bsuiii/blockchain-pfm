const Calculations = artifacts.require("Calculations");
const CurrencyConverter = artifacts.require("CurrencyConverter");
const GestionChaines = artifacts.require("GestionChaines");
const PositiveCheck = artifacts.require("PositiveCheck");
const ParityCheck = artifacts.require("ParityCheck");
const NumberStorage = artifacts.require("NumberStorage");
const Rectangle = artifacts.require("Rectangle");
const Payment = artifacts.require("Payment");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Calculations, 5, 10);
  deployer.deploy(CurrencyConverter);
  deployer.deploy(GestionChaines);
  deployer.deploy(PositiveCheck);
  deployer.deploy(ParityCheck);
  deployer.deploy(NumberStorage, [1, 2, 3]);
  deployer.deploy(Rectangle, 0, 0, 10, 20);
  deployer.deploy(Payment, accounts[0]); // Now using valid address for the ont who deploy the adress
};