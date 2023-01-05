import {SigningCosmWasmClient, Secp256k1HdWallet, GasPrice} from "cosmwasm";
import {OKCSecp256k1Wallet,crypto} from "@okexchain/javascript-sdk"
import * as fs from "fs";

// This is your rpc endpoint
const rpcEndpoint = "http://127.0.0.1:26657/";

// Using a random generated mnemonic
const mnemonic = 'puzzle glide follow cruel say burst deliver wild tragic galaxy lumber offer';

async function main() {
    // Create a wallet

    // const signer = await Secp256k1HdWallet.fromMnemonic(mnemonic, {prefix:'ex'});
    const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic)
    // console.log(privateKey)
    const signer = await OKCSecp256k1Wallet.fromKey(Buffer.from(privateKey, 'hex'), 'ex')


    // Using
    const client = await SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        signer,
        {gasPrice: GasPrice.fromString('200000000wei'), prefix: 'ex'}
    );
    const wasmCode = fs.readFileSync("/Users/finefine/go/src/github.com/okex/exchain/dev/wasm/test/burner.wasm")
    const accounts = await signer.getAccounts()
    console.log(accounts)
    const seq = await client.getSequence(accounts[0].address)
    console.log(accounts[0].address)
    const res = await client.upload(accounts[0].address, wasmCode, 'auto', "upload")
    console.log(JSON.stringify(res))
}

main();
