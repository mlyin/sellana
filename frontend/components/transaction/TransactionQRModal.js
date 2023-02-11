import Modal from '../Modal'
import { createQR, encodeURL, findReference, validateTransfer, FindReferenceError, ValidateTransferError, createTransfer } from "@solana/pay"
import { PublicKey, Keypair } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useRef, useState } from 'react';
import { truncate } from "../../utils/string"
import { useCashApp } from '../../hooks/cashapp'
import { getAvatarUrl } from '../../functions/getAvatarUrl';



const TransactionQRModal = ({ modalOpen, setModalOpen, userAddress, setQrCode }) => {
    const [confirmed, setConfirmed] = useState(false);
    const {transactions, setTransactions, avatar} = useCashApp()
    const qrRef = useRef() //gives back an object
    const { connection } = useConnection()
    // Need to generate QR code based on public key
    // Set the state to true to rerender the component with generated QR
    const loadQr = () => {
        setQrCode(true)
    }

    useEffect(() => {
        //Do something when the component first renders (generate QR)
        // console.log("LOGGING USER ADDRESS" + userAddress + typeof(userAddress));
        // const recipient = new PublicKey(userAddress)
        // const amount = new BigNumber("1")
        const reference = Keypair.generate().publicKey
        // const label = "ok"
        // const message = "Thanks for the sol"
        // const splToken = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU")

        // const urlParams = { //need to adjust to take other currencies
        //     recipient,
        //     amount,
        //     splToken,
        //     reference,
        //     label,
        //     message,
        // }

        
        // const url = encodeURL(urlParams)
        const url = "solana:https://57d0-2607-f470-6-2001-58ad-4bdc-9852-7d1a.ngrok.io/api/" + userAddress + "/" + reference.toBase58() + "/createtransaction"
        const qr = createQR(url, 488, 'transparent')
        if (qrRef.current) {
            qrRef.current.innerHTML = ''
            qr.append(qrRef.current)
        }



        //Wait for user to send transaction

        const interval = setInterval(async() => {
        //     console.log("waiting for transaction confirmation")
        //     try {
        //         //check if there's any transactions for the reference
        //         const signatureInfo = await findReference(connection, reference, {finality: 'confirmed'})
        //         console.log("validating")
        //         await validateTransfer(
        //             connection,
        //             signatureInfo.signature,
        //             {
        //                 recipient,
        //                 amount,
        //                 reference,
        //             },
        //             {commitment: 'confirmed'}
        //         )
        //         //Add transaction to local storage
        //         const newID = (transactions.length + 1).toString()
        //         const newTransaction = {
        //             id: newID,
        //             from: { 
        //                 name: recipient,
        //                 handle: recipient,
        //                 avatar: getAvatarUrl(recipient.toString()),
        //                 verified: true
        //             },
        //             to: {
        //                 name: reference,
        //                 handle: '-',
        //                 avatar: getAvatarUrl(reference.toString()),
        //                 verified: false,
        //             },
        //             description: 'User sent you SOL through Phantom',
        //             transactionDate: new Date(),
        //             status: 'Completed',
        //             amount: amount,
        //             source: '-',
        //             identified: '-',
        //         }
        //         setModalOpen(false)
        //         setTransactions([newTransaction,...transactions])

        //         clearInterval(interval)
        //     } catch (e) {
        //         if (e instanceof FindReferenceError) {
        //             //no transaction found
        //             return
        //         }
        //         if (e instanceof ValidateTransferError) {
        //             //tx invalid
        //             console.error("Transaction invalid", e)
        //         }
        //         console.error("unknown error")
        //         console.log(e.message)
        //     }
        // }, 2000)
        try {
            const foundReference = await findReference(connection, reference);
            console.log("FOUND REFERENCE", foundReference);
            if (foundReference.confirmationStatus === 'confirmed') {
                setConfirmed(true);
                setQrCode(false);
            }
        } catch {
            console.log("not found");
        }
        }, 5000)
        return () => clearInterval(interval)
    })

    return (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div >
                {!confirmed && 
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <div ref={qrRef}/>
                    </div>
                }
                    <div className="flex flex-col items-center justify-center space-y-1">
                        <p className="text-lg font-medium text-gray-800">{confirmed ? "Transaction Confirmed!" : truncate(userAddress)}</p>

                        {!confirmed && <p className="text-sm font-light text-gray-600"> Scan to pay ${truncate(userAddress)}</p>}

                        {!confirmed && <button onClick={() => loadQr()} className="w-full rounded-lg bg-[#16d542] py-3 hover:bg-opacity-70">
                            <span className="font-medium text-white">Load QR code</span>
                        </button>
                        }
                    </div>
            </div>
        </Modal>
    )
}

export default TransactionQRModal
