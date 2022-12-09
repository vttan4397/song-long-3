const listDebt = require('./features/list.js');
const detailDebt = require('./features/detail.js');
const removeDebt = require('./features/remove.js');
const addDebt = require('./features/add.js');
const logDebt = require('./features/log.js');


const rootDebt = require('./admin/index.js');


const users = require("./../../data/user.js");



class DebtCmdManager {
	constructor(props) {
		this.user = props.user;
		this.cmd = props.cmd;
		this.params = props.params;
		this.cb = props.cb;

		this.load();
	}

	findUser(name) {
		if (!value || !value.length) return undefined;
		return users.find(user => user.names.includes(`${value}`.toLowerCase()));
	}

	findSender(value) {
		if (!value || !value.length) return undefined;
		return users.find(user => user.full === value);
	}

	findByID(id) {
		if (!id || !id.length) return undefined;
		return users.find(user => `${user.id}` == `${id}`);
	}

	findByName(name) {
		if (!name || !name.length) return undefined;
		const user = users.find(user => user.names.includes(`${name}`.toLowerCase()));
		return user ? user : name
	}

	summaryList() {
		const user = this.findByID(this.user.id);
		//Full list
		let filter;
		//My list
		if (!this.params.length) {
			filter = user;
		}
		//Others list
		else if (this.params[0] != 'full'){
			filter = this.findByName(this.params[0]);
		}
		const listDebtObj = new listDebt({ user, filter, cb: this.cb });
	}


	detailList() {
		// const user = this.findUser(this.params[0]);
		const user = this.findByID(this.user.id);
		//My list
		let filter = user;
		if (this.params.length){
			filter = this.findByName(this.params[0]);
		}
		const detailDebtObj = new detailDebt({ user, filter, cb: this.cb });
	}

	addDebt() {
		//borrower is the one who sends mess
		const lender = this.findByName(this.params[0]);
		const borrower = this.findByID(this.user.id);
		const amount = this.params[1];
		const detail = this.params.slice(2).join(' ');
		const addDebtObj = new addDebt({ lender, borrower, filter: this.params[0], amount, detail, cb: this.cb });
	}


	removeDebt() {
		//lender is the one who sends mess
		const borrower = this.findByName(this.params[0]);
		const lender = this.findByID(this.user.id);
		const removeDebtObj = new removeDebt({ lender, borrower, filter: this.params[0], cb: this.cb });
	}

	rootCmd() {
		const user = this.findByID(this.user.id);

		if (user && user.name === 'an') {
			const rootDebtObj = new rootDebt({ params: this.params, cb: this.cb, findUser: this.findByName })
		}
		else {
			this.cb("Không phải An không được quyền root đâu")
		}
	}

	help() {
		const instruction = `
		Prefix: ?
		*Xem*:
		\t- Xem của mình: ?list
		\t- Xem tất cả: ?list full
		\t- Xem 1 người: ?list tên . VD: ?list công 
		*Xem lịch sử nợ*:
		\t- Xem của mình: ?log
		\t- Xem 1 người: ?log tên . VD: ?log công 
		*Xóa nợ*: 
		\tChỉ *CHỦ NỢ* được xóa nợ cho con nợ
		\tVD: Công nợ tiền Phú, sau đó trả xong cho Phú, thì Phú là người nhắn lệnh
		\t- ?remove con-nợ (chủ nợ tính là người gửi tin nhắn)
		\t- VD: Công trả tiền cho Phú, PHÚ nhắn "?remove công"
		*Thêm nợ*:
		\tChỉ *CON NỢ* được thêm nợ cho bản thân
		\tVD: Công nợ tiền Phú, thì Công là người nhắn lệnh
		\t- ?add chủ-nợ nội-dung-khoản-nợ (con nợ tính là người gửi tin nhắn)
		\t- VD: Công nợ Phú 2k, CÔNG nhắn '?add phú 2 nợ thừa"`;
		this.cb(instruction)
	}

	load() {
		switch (this.cmd) {
			case 'list': {
				this.summaryList();
				break;
			}
			case 'log': {
				this.detailList();
				break;
			}
			case 'remove': {
				this.removeDebt();
				break;
			}
			case 'add': {
				this.addDebt();
				break;
			}
			case 'root': {
				this.rootCmd();
				break;
			}
			case 'help': {
				this.help();
			}
		}
	}


}

debCommandFilter = (message, cmd) => {
	const text = message.content;
	const textSplit = text.split(" ");

	const debtCmdManager = new DebtCmdManager({
		user: message.author,
		cmd,
		params: textSplit.slice(1),
		cb: (res) => {
			if (message && message.reply) {
				message.reply(res);
			}
			else {
				console.log(res)
			}
		}
	})

}

module.exports = debCommandFilter;