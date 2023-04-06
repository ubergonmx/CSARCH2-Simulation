import Decimal from 'decimal.js'


// gets exponent field from given exponent
export function getexponent (exponent: string) : string{
    var solvedexponent = solveexponent(exponent);
    var exponentfield = solvedexponent.substring(2);
    return exponentfield;
}

//gets combination field from given exponent and msd
export function getcombination (msd:string, exponent: string) :string{
    var combifield = "";
    var solvedexponent = solveexponent(exponent);  //solved exponent is the exponent added to 398 and is in 10 bit format
    console.log(solvedexponent);
    let tempDec = new Decimal(msd);
    var msdbin = tempDec.toBinary().replace('0b', '');
    if(msdbin.length < 3){
        while(msdbin.length != 3){
            msdbin = '0' + msdbin;
        }
    }
    if(parseInt(msd) < 8){
        combifield += solvedexponent.substring(0,2);
        combifield += msdbin;
    }
    else{
        //if msd is 8 or 9
        combifield = "11";
        combifield += solvedexponent.substring(0,2); //get first two bits of exponent
        combifield += msdbin[msdbin.length-1]; //get lsb of msd
    }
    return combifield;
}

function solveexponent(exponent:string) :string{
    var exponentbin = "";
    var exponentDec;

    exponent = (parseInt(exponent) + 398).toString();
    exponentDec  = new Decimal(exponent);
    exponentbin = exponentDec.toBinary().replace('0b', '');
    if(exponentbin.length < 10){
        while(exponentbin.length != 10){ 
            exponentbin = '0' + exponentbin; 
        }
    }
    return exponentbin;
}