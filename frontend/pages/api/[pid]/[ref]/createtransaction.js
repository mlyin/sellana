// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PublicKey, Keypair, Transaction, Connection } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { createTransfer } from '@solana/pay';
import { getAvatarUrl } from '../../../../functions/getAvatarUrl';

export default async function handler(req, res) {
	const connection = new Connection("https://api.devnet.solana.com")
    const {pid, ref} = req.query;

	if (req.method === "GET") {
		res.status(200).send({
			label: pid.toString(),
			icon: "https://toppng.com/uploads/preview/duck-115244013619fahj8jcpu.png",
		});
		return
	}
	const accountField = req.body.account;
	// Compose a simple transfer transaction to return. In practice, this can be any transaction, and may be signed.
	const recipient = new PublicKey(pid)
	const amount = new BigNumber(req.query.amount || "0.2");
    const reference = new PublicKey(ref);
	const label = "ok"
	const message = "Thanks for the coffee!"
	const splToken = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU")
    
    let transaction = await createTransfer(connection, new PublicKey(accountField), {
        recipient,
        amount,
        // splToken,
        reference,
		label,
    });

    // Serialize and deserialize the transaction. This ensures consistent ordering of the account keys for signing.
    transaction = Transaction.from(
        transaction.serialize({
            verifySignatures: false,
            requireAllSignatures: false,
        })
    );

    // Serialize and return the unsigned transaction.
    const serialized = transaction.serialize({
        verifySignatures: false,
        requireAllSignatures: false,
    });
    const base64 = serialized.toString('base64');

    res.status(200).send({ transaction: base64, message });
  }
  

