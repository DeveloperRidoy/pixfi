import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  web3Enable,
  web3Accounts,
  web3FromAddress,
} from "@polkadot/extension-dapp";
import { RECEIVER_ADDRESS, WESTEND_RPC } from "@/lib/credentials";

export const sendFakeDonation = async (): Promise<boolean> => {
  try {
    // Step 1: Connect to Westend node
    const provider = new WsProvider(WESTEND_RPC);
    const api = await ApiPromise.create({ provider });
    await api.isReady;

    // Step 2: Enable extension
    const extensions = await web3Enable("PixFi");
    if (!extensions.length) return false;

    // Step 3: Get user account
    const accounts = await web3Accounts();
    if (!accounts.length) return false;

    const sender = accounts[0];
    const injector = await web3FromAddress(sender.address);

    // Step 4: Create and send transaction
    const tx = api.tx.balances.transferAllowDeath(RECEIVER_ADDRESS, 0);

    return new Promise((resolve) => {
      tx.signAndSend(
        sender.address,
        { signer: injector.signer },
        ({ status, dispatchError }) => {
          if (dispatchError) {
            resolve(false);
          } else if (status.isInBlock || status.isFinalized) {
            resolve(true);
          }
        }
      ).catch(() => {
        resolve(false);
      });
    });
  } catch {
    return false;
  }
};
