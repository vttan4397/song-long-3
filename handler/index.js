const debtManager = require('./debt-manager/index.js');

const hanlder = function(message, cmd) {
	debtManager(message, cmd)
}


module.exports = hanlder;