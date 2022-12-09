const {google} = require('googleapis');

const{ getData, appendData } = require('../googleapis/common.js');
const{ capitalizeText } = require('../../utility/util.js');

// const listDebt = require("./list.js");


class addDebtRoot {
  constructor(props) {
    this.lender = props.lender;
    this.cb = props.cb;
    this.debtList = props.debtList;
    this.error = props.error;
    this.detail = props.detail;


    const currentTime = new Date();
    this.time = `${currentTime.getDate()}/${currentTime.getMonth()+1}`

    this.range = 'A4:F500';

    this.load()
  }

  generateRecords() {
    return this.debtList.map(debt => {
      return [this.time, capitalizeText(this.detail), capitalizeText(debt.borrower.name), debt.amount, capitalizeText(this.lender.name), 0]
    })
  }

  load() {
    const content = this.generateRecords();
    appendData({
      content,
      range: this.range,
      type: "sheet"
    }, (res) => {
      if (res) {
        this.logRecord(content);
        this.generateText(content);
      }
    })
  }

  logRecord(content) {
   let newLog = [];
   
   const notice = `Update nợ ${this.detail} - ${this.lender.name} trả`;

   const currentTime = new Date();
   newLog.push(`${currentTime.getDate()}/${currentTime.getMonth()+1} ${currentTime.toLocaleTimeString()}`);
   newLog = newLog.concat([ 'An (Root)', notice, `Thêm:\n ${content.map(c => c.join(" - ")).join("\n")}`]);
   
   appendData({
    content: [newLog],
    range: '',
    type: 'log'
  })
 }

  generateText(content) {
    const error = this.error.length ? "Các lỗi xảy ra:\n" + this.error.join("\n") : '';
   const notice = `Đã thêm lịch sử nợ ${this.detail} do ${this.lender.name} trả\nNhững mục đã thêm:\n${content.map(c => "\t" + c.join(" - ")).join("\n")}\n${error}`;
   this.cb(notice)
 }
}

module.exports = addDebtRoot;