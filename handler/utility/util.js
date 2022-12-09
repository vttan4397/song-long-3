
const capitalizeText = (string = '') => string.length ? string[0].toUpperCase() + string.slice(1) : string;

const checkInclude = (source = "", dest = "") => {
	if (!source.length || !dest.length) return false;

	let isAdjenc = source.includes(dest);

	const destArr = dest.split("");
	let sourceArr = source.split("");
	let percent = 0;

	let tokenNext = 0;
	let destCount = 0;
	destArr.forEach(char => {
		const index = sourceArr.indexOf(char.toLowerCase());
		if (index > -1) {
			sourceArr = sourceArr.slice(0,index-1) + sourceArr.slice(index+1);
			percent+=0.1;
			if (tokenNext) percent+=0.05;
			tokenNext = 1;
			destCount++;
		}
		else {
			tokenNext = 0;
		}
		// console.log(char, percent, tokenNext)
	});

	percent+=(destCount/source.length)*0.1;

	return percent;
}

const findMax = (arr, param) => {
	if (!arr || !arr.length) return {};
	let maxValue = arr[0];
	arr.forEach(ele => {
		if (Number(ele[param]) > Number(maxValue[param])) maxValue = ele;
	})
	return maxValue;
}

const editDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

const similarity = (s1, s2) => {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

module.exports = {
	capitalizeText,
	checkInclude,
	findMax,
	similarity
}