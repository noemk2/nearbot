const near = require("./near");
const config = require("./config")

const nearConfig = config.getConfig(process.env.NODE_ENV || "development");

var bigInt = require("big-integer");
var Big = require('big.js');


// const exp = bigInt(10).pow(24);
const exp = "1000000000000000000000000";
    
// transfor amount to yocto
function getYocto(amount) {
        let expresion = Big(amount).times(exp).toExponential()
        return bigInt(expresion).toString()
    }

// transfor yocto to amount
function printYocto_number(amount) {
        let expresion = (Big(amount).div(exp)).toNumber()
        return expresion
    }


async function main() {

    // swap near to wnear (deposit near ref-finance)
    // amount: int | float 
    async function Deposit_wnear(account_id, amount) {
        await near.NearCall(account_id, "wrap.testnet", "near_deposit", {}, `${getYocto(amount)}`); 
        console.log(`Swap ${amount} wnear`);
    }



    // swap wnear to near (withdraw near ref-finance) 
    async function Withdraw_near(account_id, amount) {
        let args= {
                amount: `${getYocto(amount)}` 
            }
        await near.NearCall(account_id, "wrap.testnet", "near_withdraw", args, "1"); 
        console.log(`Swap ${amount} near`);
    }



    // send near to other wallet
    async function Send(account, account_recive, amount){
        let amount_send= getYocto(amount)

        await near.NearSend(account, account_recive, amount_send); 
        let resp = printYocto_number(amount) 
        console.log(`Send ${resp} Near to ${account_recive}`);
    }



    // swap near to usdc
    async function Swap_near_usdc(account_id, amount) {
    let MONTO= getYocto(amount)
    let actionList = []
    let POOL_ID= 465

    let argu = {
        pool_id: POOL_ID,
        token_in: "wrap.testnet",
        amount_in: MONTO,
        token_out: "usdc.fakes.testnet",
    }

    let min  = await near.NearView("exchange.ref-dev.testnet", "get_return", argu );


    actionList.push({
         pool_id: POOL_ID,
        token_in: "wrap.testnet",
        token_out: "usdc.fakes.testnet",
        amount_in: MONTO,
        min_amount_out: min 
    })


    let cargo = {
        receiver_id: "exchange.ref-dev.testnet",
        amount: MONTO, 
        msg: JSON.stringify({
           force: 0,
           actions: actionsList, 

        })
      }
        await near.NearCall(account_id, "wrap.testnet", "ft_transfer_call", cargo , "1", "180000000000000");
        console.log(`Swap ${amount} near to usdc`);

    }


}

main()