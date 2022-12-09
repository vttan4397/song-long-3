const {google} = require('googleapis');

const{ getData } = require('../googleapis/common.js')
const{ capitalizeText } = require('../../utility/util.js');

const addDebtRoot = require('./add.js')
const removeDebtRoot = require('./remove.js')



class rootDebt {
  constructor(props) {
    this.params = props.params;
    this.cb = props.cb;
    this.findUser = props.findUser;

    
    this.cmdFilter();

  }

  verifyFilter() {
    if (!this.params.length || (!this.params[1])) return this.cb("Thiếu params");

  }

  addPrep() {
   const lender = this.findUser(this.params[1]);
   if (!lender) return this.cb(`Không biết ${this.params[1]} là ai sao thêm`);

   const detail = this.params[2].replace(/-/g, ' ');

   const listParam = this.params.slice(3);

   if (!listParam || !listParam.length) return this.cb("Tự code mà gõ lệnh cũng sai nữa, đấm phát giờ");

   const error = [];
   let debtList = [];
   for (let i = 0; i < listParam.length; i+=2) {
    if (!listParam[i] || !listParam[i+1]) {
      return this.cb(`\tThiếu param, hủy bỏ thêm cho toàn bộ process`);
      break;
    }

    let amount = listParam[i];
    if (!amount || isNaN(amount) || !Number(amount)) {
      error.push(`\tSố tiền ${amount} không hợp lệ, hủy bỏ thêm cho ${listParam[i+1]}`);
      continue;
    }
    amount = Number(amount);

    const borrowers = listParam[i+1].split(',');
    borrowers.forEach(rec => {
      const borrower = this.findUser(rec);
      if (borrower) {
        debtList.push({
          borrower,
          amount
        })
      }
      else {
        error.push(`\tSong Long bot không biết ${rec} là ai, hủy bỏ thêm cho ${rec}`);
      }
    })

  }

  if (debtList.length) {
    const addDebtRootObj = new addDebtRoot({ lender, detail, debtList, error, cb: this.cb });
  }
  else {
    return this.cb("Không có param nào hợp lệ để thêm nợ, terminate process")
  }


}

removePrep() {
  if (!this.params[1] || !this.params[2]) return this.cb("Thiếu params kìa, đấm phát giờ")

  const lender = this.findUser(this.params[1]);
  const borrower = this.findUser(this.params[2]);

  if (!lender) return this.cb(`Không biết ${this.params[1]} là ai`);
  if (!borrower) return this.cb(`Không biết ${this.params[0]} là ai`);

  const removeDebtRootObj = new removeDebtRoot({ lender, borrower, filter: this.params[2], cb: this.cb });


}

cmdFilter() {
    //add phu cafe-trưa 18 quang 19 an 20 khoa,cong
    //remove phu quang
    const cmd = this.params[0];
    switch (cmd) {
      case 'add': {
        this.addPrep();
        break;
      }
      case 'remove': {
        this.removePrep();
        break;
      }
      default: {
        this.cb("Bot manual gọi em chi đó?");
      }
    }

  }
}


module.exports = rootDebt;