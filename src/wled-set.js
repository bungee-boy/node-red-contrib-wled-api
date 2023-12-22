module.exports = function(RED) {
    function WledSet(config) {  // Function called
        RED.nodes.createNode(this, config);  // Load self as node

        this.device = RED.nodes.getNode(config.device);  // Load device node
        if (this.device) {
            this.on('input', function(msg) {  // The code to run (on message)
                this.status({ fill:"yellow", shape:"dot", text:"fetching" });
                fetch(new Request(`http://${ this.device.ip }/json/state`,
                    { method: 'POST', body: JSON.stringify(msg.payload) }))
                    .then((response) => response.json())  // Request data and decode
                    .then((data) => {  // Http response data
                        msg.payload = data;
                        if (msg.payload.success){
                            this.status({ fill:"green", shape:"dot", text:"success" })
                        }
                        else {
                            this.status({ fill:"red", shape:"dot", text:"error" })
                        }
                        this.send(msg);  // Output message
                    })
                    .catch((e) => {  // If http error
                        this.error(e);
                        this.status({ fill:"red", shape:"dot", text:"error" })
                        msg.payload = { "success": false };
                        this.send(msg);

                    });  // End of request
            });
        }
        else {
            this.err('No device was configured');
        }
    }  // End of node function
    RED.nodes.registerType("wled set", WledSet);  // Add to palette
}
