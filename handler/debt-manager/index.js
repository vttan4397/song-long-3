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
			this.cb("Kh??ng ph???i An kh??ng ???????c quy???n root ????u")
		}
	}

	help() {
		const instruction = `
		Prefix: ?
		*Xem*:
		\t- Xem c???a m??nh: ?list
		\t- Xem t???t c???: ?list full
		\t- Xem 1 ng?????i: ?list t??n . VD: ?list c??ng???
		*Xem l???ch s??? n???*:
		\t- Xem c???a m??nh: ?log
		\t- Xem 1 ng?????i: ?log t??n . VD: ?log c??ng???
		*X??a n???*: 
		\tCh??? *CH??? N???* ???????c x??a n??? cho con n???
		\tVD: C??ng n??? ti???n Ph??, sau ???? tr??? xong cho Ph??, th?? Ph?? l?? ng?????i nh???n l???nh
		\t- ?remove con-n??? (ch??? n??? t??nh l?? ng?????i g???i tin nh???n)
		\t- VD: C??ng tr??? ti???n cho Ph??, PH?? nh???n "?remove c??ng"
		*Th??m n???*:
		\tCh??? *CON N???* ???????c th??m n??? cho b???n th??n
		\tVD: C??ng n??? ti???n Ph??, th?? C??ng l?? ng?????i nh???n l???nh
		\t- ?add ch???-n??? n???i-dung-kho???n-n??? (con n??? t??nh l?? ng?????i g???i tin nh???n)
		\t- VD: C??ng n??? Ph?? 2k, C??NG nh???n '?add ph?? 2 n??? th???a"`;
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