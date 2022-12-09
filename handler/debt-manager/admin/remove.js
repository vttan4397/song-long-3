const {google} = require('googleapis');

const{ getData, writeData, appendData } = require('../googleapis/common.js');
const{ capitalizeText } = require('../../utility/util.js');


const listDebt = require("../features/list.js");




class removeDebtRoot {
  constructor(props) {
    this.filter = props.filter;
    this.borrower = props.borrower;
    this.lender = props.lender;
    this.cb = props.cb;

    this.debtList = [];
    this.removeRecs = [];
    this.lenderDebtObj = {};
    this.borrowRecord = undefined;

    this.range = 'A4:F500';

    this.load();
  }


  fetchDebtObject(cb) {
    const listDebtObj = new listDebt({ user: this.lender, filter: this.lender });
    listDebtObj.getList((res) => {
      this.lenderDebtObj = res.find(single => this.lender.names.includes(single.name.toLowerCase()));
      const lenderLendList = this.lenderDebtObj && this.lenderDebtObj.lend;
      this.borrowRecord = lenderLendList && lenderLendList.find(borrower => this.borrower.names.includes(borrower.name.toLowerCase()));
      
      if (!this.borrowRecord) return this.cb(`${capitalizeText(this.borrower.name)} có nợ ${capitalizeText(this.lender.name)} đâu mà trả`);
      //Debt exists
      // console.log(this.lenderDebtObj)
      cb(true);
    });
  }

  load(cb) {
    getData({
      range: this.range,
      type: 'sheet'
    },(data) => {
      if (!data || data.length <= 0) return 'Không có lịch sử nợ nào hết';;


      this.fetchDebtObject((isProceed) => {
        if (isProceed) {
          this.debtList = this.processDebt(data);

          // console.log(debtList, this.removeRecs);
          const fullList = [...this.debtList];
          if (this.debtList.length < data.length) {
            const limit = data.length - this.debtList.length;
            for (let i = 0; i < limit; i++) {
              fullList.push(['','','','','',''])
            }
          }
          // return console.log(fullList);
          writeData({
            range: this.range,
            type: "sheet",
            values: fullList
          },(res, err) => {
            if (err) {
              return this.cb("Xảy ra lỗi khi update sheet, vui lòng thử lại")
            }
            if (res) {
             const notice = `${capitalizeText(this.borrower.name)} đã trả ${this.borrowRecord.amount} cho ${capitalizeText(this.lender.name)}\n`;

             this.logRecord(notice);
             this.generateText(notice);
           }
         })

        }
      })

      


      
    })

    
  }
  processDebt(debtList) {
    return debtList.filter(debtRec => {
      let isQualified = false;
      if (debtRec[debtRec.length - 1] === '0' && 
        !(debtRec.find(item => this.borrower.names.includes(item.toLowerCase())) 
          && debtRec.find(item => this.lender.names.includes(item.toLowerCase()))
          )
        ) {
        isQualified = true;
    }
    else {
      this.removeRecs.push(debtRec);
    }
    return isQualified;
  })
  }

  logRecord(notice) {
   let newLog = [];
   const currentTime = new Date();
   newLog.push(`${currentTime.getDate()}/${currentTime.getMonth()+1} ${currentTime.toLocaleTimeString()}`);
   newLog = newLog.concat([ 'An (Root)', notice, `Xóa:\n ${this.removeRecs.map(rec => rec.join(' - ')).join('\n')}`]);
   appendData({
    content: [newLog],
    range: '',
    type: 'log'
  })
 }

 generateText(notice) {
  const listDebtObj = new listDebt({ user: this.borrower, filter: this.borrower, cb: (res) => {
    this.cb(`${notice}${res}`)
  } });
}
}

module.exports = removeDebtRoot;