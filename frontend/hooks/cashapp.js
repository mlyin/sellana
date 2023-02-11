//custom hook for transaction payments, variables, other transaction information

import { useState, useEffect } from 'react'
import { getAvatarUrl } from '../functions/getAvatarUrl'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction} from "@solana/web3.js"
import BigNumber from 'bignumber.js';

export const useCashApp = () => { //Use hook for wallet state and avatar
	const [avatar, setAvatar] = useState("")
    const [userAddress, setUserAddress] = useState("11111111111111")
	const {connected, publicKey, sendTransaction } = useWallet()
    const [receiver, setReceiver] = useState('')
    const [transactionPurpose, setTransactionPurpose] = useState('')
	const [amount, setAmount] = useState(0)
	const { connection } = useConnection()

	// Get Avatar based on the userAddress
	useEffect(() => {
		if (connected) {
			// console.log("setting avatar and user address");
			setAvatar(getAvatarUrl(publicKey.toString()))
			setUserAddress(publicKey.toString())
		} 
	}, [connected])

	// Create the transaction to send to our wallet and we can sign it then
	const makeTransaction = async(fromWallet, toWallet, amount, reference) => {
		const network = WalletAdapterNetwork.Devnet //using devnet
		const endpoint = clusterApiUrl(network)
		const connection = new Connection(endpoint)

		//get a recent blockhash to include in transaction
		const {blockhash} = await connection.getLatestBlockhash('finalized')

		const transaction = new Transaction({
			recentBlockhash: blockhash,
			feePayer: fromWallet //buyer pays for gas

		})

		// Create the instruction to send SOL from owner to recipient
		const transferInstruction = SystemProgram.transfer({
			fromPubkey: fromWallet,
			lamports: amount.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
			toPubkey: toWallet
		})

		transferInstruction.keys.push({ //when we query for the reference the transaction is returned
			pubkey: reference,
			isSigner: false,
			isWritable: false,
		})

		transaction.add(transferInstruction)
		return transaction
	}

	//function to RUN transaction, added to the button
	const doTransaction = async({amount, receiver, transactionPurpose}) => {
		const fromWallet = publicKey
		const toWallet = new PublicKey(receiver) //address of receiver, need to check if valid?
		const bnAmount = new BigNumber(amount)
		const reference = Keypair.generate().publicKey
		const transaction = await makeTransaction(fromWallet, toWallet, bnAmount, reference)

		const txnHash = await sendTransaction(transaction, connection)
		console.log("txn hash: " + txnHash)

		//Create transaction history objects
	}


	return { connected, publicKey, avatar, userAddress, doTransaction, amount, setAmount, receiver, setReceiver, transactionPurpose, setTransactionPurpose }
}