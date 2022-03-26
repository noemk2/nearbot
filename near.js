const homedir = require("os").homedir();
const nearAPI = require("near-api-js");
const fs = require("fs");
const path = require("path");
const { getConfig } = require("./config");

const { type } = require("os");

const nearConfig = getConfig(process.env.NODE_ENV || "development");

const CREDENTIALS_DIR =
  nearConfig.networkId === "mainnet"
    ? ".near-credentials/mainnet/"
    : ".near-credentials/testnet/";

const GAS = "50000000000000";


module.exports = {

  NearView: async function (contract, operation, parameters) {
    const nearRpc = new nearAPI.providers.JsonRpcProvider(nearConfig.nodeUrl);

    const account = new nearAPI.Account({ provider: nearRpc });
    const view = await account.viewFunction(contract, operation, parameters);
      return view
  }, 


  ViewWallet: async function (account_id, account_query) {
    const near = await nearAPI.connect({
      networkId: "default",
      nodeUrl: nearConfig.nodeUrl,
      signer: new nearAPI.InMemorySigner(account_id),
    });

    const account = await near.account(account_query);
    const balance = await account.getAccountBalance();

    return balance;

  }, 
  
NearSend: async function (account_id, account_recive, amount) {
    const privateKey = await GetPrivateKey(account_id);

    const keyPair = nearAPI.utils.KeyPair.fromString(privateKey);
    const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
  // obtener el keystore


    keyStore.setKey("default", account_id, keyPair);


    const near = await nearAPI.connect({
      networkId: "default",
      deps: { keyStore },
      masterAccount: account_id,
      nodeUrl: nearConfig.nodeUrl
    });

    const account = await near.account(account_id);
    const envio= await account.sendMoney(
        account_recive,
        amount
    )

    // return envio;

  }, 


 NearCall: async function (account_id, contract, operation, parameters, attachedDeposit = 0, gas = GAS) {
    const privateKey = await GetPrivateKey(account_id);

    const keyPair = nearAPI.utils.KeyPair.fromString(privateKey);
    const keyStore = new nearAPI.keyStores.InMemoryKeyStore();


    keyStore.setKey("default", account_id, keyPair);

    const near = await nearAPI.connect({
      networkId: "default",
      deps: { keyStore },
      masterAccount: account_id,
      nodeUrl: nearConfig.nodeUrl,
    });

    const account = await near.account(account_id);

    const call = await account.functionCall({
      contractId: contract,
      methodName: operation,
      args: parameters === {} ? {} : parameters,
      gas: gas,
      attachedDeposit: attachedDeposit, 
    });

    try {
      if (call["status"].hasOwnProperty("SuccessValue")) {
        let logs = [];
        call["receipts_outcome"].map((receipts_outcome) => {
          if (receipts_outcome ?? ["outcome"] ?? ["logs"].length)
            receipts_outcome["outcome"]["logs"].map((log) => logs.push(log));
        });
        return `Successful operation: ${operation}!\n\r${logs.join("\n\r")}`;
      } else {
        return `Failed operation: ${operation}`;
      }
    } catch (e) {
      return "Call processed with unknown result";
    }
  }, 



};



const GetPrivateKey = async function (account_id) {
    const credentialsPath = path.join(homedir, CREDENTIALS_DIR); 
    const keyPath = credentialsPath + account_id + ".json";
    try {
      const credentials = JSON.parse(fs.readFileSync(keyPath));
      return credentials.private_key;
    } catch (e) {
      throw new Error(
        "Key not found for account " + keyPath + ". Error: " + e.message
      );
    }
  };