const {google} = require('googleapis');

const{ getData } = require('../googleapis/common.js')



class listDebt {
  constructor(props) {
    this.filter = props.filter;
    this.user = props.user;
    this.cb = props.cb;


    this.lender = [];
    this.debtList = [];
    this.borrower = [];
    this.debtDetail = [];

    this.getList = this.getList;

    this.range = 'L37:Z60';
    
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

  getList(cb) {
    if (!this.debtList.length) {
      this.load(true, cb)
    }
    else {
      cb(this.debtList)
    }
  }

  load(isGet = false, cb) {
    getData({
      range: this.range,
      type: "sheet"
    },(data) => {
      if (!data || data.length <= 0) return 'Không có lịch sử nợ nào hết';
      // console.log(data)
      this.lender = data[0].slice(1);
      if (this.lender.length <= 0) return;

      const debtListTemp = {};
      this.borrower = [];
      for (let i = 1; i < data.length; i++) {
        const currentRow = data[i];
        debtListTemp[currentRow[0]] = currentRow.slice(1);
        this.borrower.push(currentRow[0])
      } 

      // console.log(this.lender, this.borrower)

      const tempArr = [...this.lender, ...this.borrower];
      for (let i = 1; i < tempArr.length; i++) {
        this.debtList.push({
          name: tempArr[i],
          borrow: [],
          lend: []
        })
      }

      this.processDebt(debtListTemp);

      // console.log(this.debtList)
      if (isGet && cb) return cb(this.debtList); 
      const result = this.generateText();
      if (this.cb) this.cb(result);
    })
  }

  processDebt(debtList) {
    let finalList = '';
    Object.keys(debtList).forEach(borrower => {
      const debtSingle = this.debtList.find(item => item.name.toLowerCase() === borrower.toLowerCase());

      if (!debtSingle) return;

      debtList[borrower].forEach((debtAmount, pos) => {
        if (Number(debtAmount) > 0) {
          debtSingle.borrow.push({
            name: this.lender[pos],
            amount: Number(debtAmount)
          })
          const lenderSingle = this.debtList.find(item => item.name.toLowerCase() === this.lender[pos].toLowerCase());
          if (lenderSingle && lenderSingle.lend) {
            lenderSingle.lend.push({
              name: borrower,
              amount: Number(debtAmount)
            })
          }
        }
      })
    })
  }

  generateText() {
    if (this.filter) {
      const debtSingle = this.debtList.find(item => item.name.toLowerCase() === this.filter.name.toLowerCase());
      if (debtSingle) {
        let string = `-----${debtSingle.name}-----\n`;
        if (debtSingle.borrow.length > 0) {
          string += `  Chưa trả:\n`;
          debtSingle.borrow.forEach(({name, amount}) => {
            string += `\t     - Nợ ${name} ${amount}\n`
          })
        }
        else {
          string += `\t    - Không còn nợ ai hết\n`
        }
        if (debtSingle.lend.length > 0) {
          string += `  Chưa đòi:\n`;
          debtSingle.lend.forEach(({name, amount}) => {
            string += `\t     - ${name} thiếu ${debtSingle.name} ${amount}\n`
          })
        }
        return string;
      }
      return '';
    }
    return this.debtList.map(debtSingle => {
      let string = '';
      if (debtSingle.borrow.length <= 0) return string;
      string += `-----${debtSingle.name}-----\n`
      if (debtSingle.borrow.length > 0) {
        debtSingle.borrow.forEach(({name, amount}) => {
          string += `\t    - Nợ ${name} ${amount}\n`
        })
      }
      return string;
    }).join("")
  }
}



module.exports = listDebt;