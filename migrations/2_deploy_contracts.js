var Voting = artifacts.require("Voting")
var Creator = artifacts.require("Creator")

module.exports = function(deployer) {
    deployer.deploy(Creator)

}