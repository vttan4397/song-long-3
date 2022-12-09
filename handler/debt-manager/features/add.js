const {google} = require('googleapis');

const{ getData, appendData } = require('../googleapis/common.js');
const{ capitalizeText } = require('../../utility/util.js');

const listDebt = require("./list.js");


class addDebt {
  constructor(props) {
    this.filter = props.filter;
    this.borrower = props.borrower;
    this.lender = props.lender;
    this.cb = props.cb;
    this.amount = props.amount;
    this.detail = props.detail;

    const currentTime = new Date();
    this.time = `${currentTime.getDate()}/${currentTime.getMonth()+1}`

    this.range = 'A4:F500';

    this.verifyFilter();
  }

  verifyFilter() {
    if (!this.filter) return this.cb('Nợ ai mà không ghi làm sao Song Long bot biết được');
    if (typeof this.lender == 'string') return this.cb(`${this.filter} là ai vậy? Song Long bot không quen`);
    if (!this.borrower) return this.cb('Xin lỗi, Song Long bot không tìm được data của người gửi trong DB hardcode của bot manual, đấm nó phát đi');
    if (this.borrower.name == this.lender.name) return this.cb('Sao tự thêm nợ cho bản thân được, ăn đấm hông');
    if (!this.amount || !this.amount.length) return this.cb(`Nợ mà không ghi số tiền nợ là nợ cái khác phải hông?`);
    if (isNaN(this.amount) || Number(this.amount) <= 0 ) return this.cb(`Tiền nợ không hợp lệ, đóng phạt cho bot manual gấp đôi nha`);
    if (!this.detail || !this.detail.length ) return this.cb(`Mượn tiền để làm gì mà ko ghi rõ, ${capitalizeText(this.lender.name)} đừng cho ${capitalizeText(this.borrower.name)} mượn nha`);

    this.amount = Number(this.amount);
    this.load();
  }

  load() {
    const content = [this.time, this.detail, capitalizeText(this.borrower.name), this.amount, capitalizeText(this.lender.name), 0]
    appendData({
      content: [content],
      range: this.range,
      type: "sheet"
    }, (res) => {
      if (res) {
        this.logRecord(content);
        this.generateText();
      }
    })
  }

  logRecord(content) {
   let newLog = [];
   
   const notice = `${capitalizeText(this.borrower.name)} nợ ${capitalizeText(this.lender.name)} ${this.amount} ${this.detail}`;

   const currentTime = new Date();
   newLog.push(`${currentTime.getDate()}/${currentTime.getMonth()+1} ${currentTime.toLocaleTimeString()}`);
   newLog = newLog.concat([ capitalizeText(this.borrower.name), notice, `Thêm:\n ${content.join(" - ")}`]);
   
   appendData({
    content: [newLog],
    range: '',
    type: 'log'
  })
 }

  generateText() {
   const notice = `Đã thêm lịch sử: ${capitalizeText(this.borrower.name)} nợ ${capitalizeText(this.lender.name)} ${this.amount} ${this.detail}\n`;

   const listDebtObj = new listDebt({ user: this.borrower, filter: this.borrower, cb: (res) => {
    this.cb(`${notice}${res}`)
  } });
 }
}

module.exports = addDebt;