function commaNumber(inputNumber) {
    let number, stringNumber, decimal;


    const separator = ',';
    const decimalChar = '.';

    switch (typeof inputNumber) {

    case 'string':
        if (inputNumber.length < (inputNumber[0] === '-' ? 5 : 4))
            return inputNumber;
        stringNumber = inputNumber;

        number = decimalChar !== '.' ? Number(stringNumber.replace(decimalChar, '.'))
            : Number(stringNumber);
        break;
    case 'number':
        stringNumber = String(inputNumber);
        number = inputNumber;
        break;
    default: return inputNumber;
    }

    if ((number > -1000 && number < 1000) || isNaN(number) || !isFinite(number))
        return stringNumber;

    const decimalIndex = stringNumber.lastIndexOf(decimalChar);

    if (decimalIndex > -1) {
        decimal = stringNumber.slice(decimalIndex);
        stringNumber = stringNumber.slice(0, -decimal.length);
    }

    stringNumber = parse(stringNumber, separator);
    return decimal ? stringNumber + decimal : stringNumber;
}


function parse(stringNumber, separator) {
    const start = stringNumber[0] === '-' ? 1 : 0; // start after minus sign
    const count = stringNumber.length - start - 1; // count digits after first
    let i = (count % 3) + 1 + start; // index for first separator
    const strings = [ // hold string parts

        stringNumber.slice(0, i),
    ];

    while (i < stringNumber.length) {
        strings.push(stringNumber.substr(i, 3));
        i += 3;
    }

    return strings.join(separator);
}

function bindWith(separator, decimalChar) {
    return function(number) {
        return commaNumber(number, separator, decimalChar);
    };
}

module.exports = commaNumber;
module.exports.bindWith = bindWith;
