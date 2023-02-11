// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PublicKey, Keypair, Transaction, Connection } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { createTransfer } from '@solana/pay';

export default async function handler(req, res) {
	// res.status(200).json({ name: 'John Doe' })
	const connection = new Connection("https://api.devnet.solana.com")
	if (req.method === "GET") {
		res.status(200).send({
			label: "123",
			icon: "https://toppng.com/uploads/preview/duck-115244013619fahj8jcpu.png",
		});
		return
	}
    const {pid, ref} = req.query;
	const accountField = req.body.account;
	// Compose a simple transfer transaction to return. In practice, this can be any transaction, and may be signed.
	const recipient = new PublicKey(pid)
	const amount = new BigNumber("0.1")
    const reference = new PublicKey(ref);
	// const reference = Keypair.generate().publicKey
	const label = "ok"
	const message = "Thanks for the sol"
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
  

