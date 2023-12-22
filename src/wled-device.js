module.exports = function(RED) {
    function WledDevice(n) {
        RED.nodes.createNode(this, n);  // Create instance of self
        this.name = n.name;
        this.ip = n.ip;
    }
    RED.nodes.registerType("wled-device", WledDevice)
}