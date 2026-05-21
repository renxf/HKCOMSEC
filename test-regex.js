const str = "Free and open company data on Hong Kong company ALIBABA.COM CHINA HOLDING LIMITED (company number 0681612)";
const m = str.match(/Hong Kong company ([\s\S]+?) \(company number/);
console.log(m ? m[1] : null);
