module.exports = function(RED) {
    function WledGet(config) {  // Function called
        RED.nodes.createNode(this, config);  // Load self as node

        this.device = RED.nodes.getNode(config.device);  // Load device node
        if (this.device) {
            this.on('input', function(msg) {  // The code to run (on message)
                this.status({ fill:"yellow", shape:"dot", text:"fetching" });
                fetch(new Request(`http://${ this.device.ip }/json/${ config.scope }`,
                    { method: 'GET' }))
                    .then((response) => response.json())  // Request data and decode
                    .then((data) => {  // Http response data
                        msg.payload = data;
                        this.status({ fill:"green", shape:"dot", text:"success" })
                        this.send(msg);  // Output message
                    })
                    .catch((e) => {  // If http error
                        this.error(e);
                        this.status({ fill:"red", shape:"dot", text:"error" })
                    });  // End of request
            });
        }
        else {
            this.err('No device was configured');
        }
    }  // End of node function
    RED.nodes.registerType("wled get", WledGet);  // Add to palette
}
