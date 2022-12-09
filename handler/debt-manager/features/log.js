const {google} = require('googleapis');

const{ getData } = require('../googleapis/common.js')
const{ capitalizeText } = require('../../utility/util.js');




class logDebt {
  constructor(props) {
    this.cb = props.cb;

    this.range = 'A2:F500';
    
    this.load();

  }

  load() {
    getData({
      range: this.range,
      type: "log"
    },(data) => {
      if (!data || data.length <= 0) return this.cb('Không có log update nợ nào hết');
      
      const result = this.generateText(data);
      if (this.cb) this.cb(result);
    })
  }

  generateText(data) {
    return `Log update nợ tính đến hiện tại:\n` + data.map(rec => {
      return `\t${rec[0]}, ${rec[2]} - Updated by ${rec[1]}`
    }).join("\n")
  }
}


module.exports = logDebt;