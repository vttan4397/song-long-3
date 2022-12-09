const {google} = require('googleapis');

const{ getData } = require('../googleapis/common.js')
const{ capitalizeText } = require('../../utility/util.js');




class detailDebt {
  constructor(props) {
    this.filter = props.filter;
    this.user = props.user;
    this.cb = props.cb;

    this.debtList = [];
    this.range = 'A4:F500';
    
    this.verifyFilter();

  }

  verifyFilter() {
    if (typeof this.filter == 'string') {
      return this.cb(`${this.filter} là ai vậy? Song Long bot không quen`)
    }
    // if (this.user) {
    //   this.filter = this.user.name;
    // }
    this.load();
  }

  load() {
    getData({
      range: this.range,
      type: "sheet"
    },(data) => {
      if (!data || data.length <= 0) return 'Không có lịch sử nợ nào hết';
      
      this.debtList = this.processDebt(data);
      const result = this.generateText();
      if (this.cb) this.cb(result);
    })
  }

  processDebt(debtList) {
    if (!debtList || !debtList.length) return [];

    let finalList = debtList;
    if (this.filter) {
      finalList = debtList.filter(debtRec => {
        return debtRec.find(item => item.toLowerCase() === this.filter.name.toLowerCase())
      })
    }
    return finalList.filter(debtRec => debtRec[debtRec.length - 1] === '0');
  }

  generateText() {
    if (!this.debtList || !this.debtList.length) return 'Không còn ai nợ ai hết';

    return `Chi tiết nợ${this.filter ? ` của ${capitalizeText(this.filter.name)}` : ''}:\n` + this.debtList.map(debtRec => {
      return `\t${debtRec[0]}, ${debtRec[2]} nợ ${debtRec[4]} ${debtRec[3]} tiền ${debtRec[1]}`
    }).join("\n")
  }
}


module.exports = detailDebt;