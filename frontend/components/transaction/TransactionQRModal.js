import Modal from '../Modal'
import { createQR, encodeURL, findReference, validateTransfer, FindReferenceError, ValidateTransferError, createTransfer } from "@solana/pay"
import { PublicKey, Keypair } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useRef, useState, useContext } from 'react';
import { truncate } from "../../utils/string"
import { useCashApp } from '../../hooks/cashapp'
import { getAvatarUrl } from '../../functions/getAvatarUrl'
import { CartContext } from '../../hooks/cartContext';

const TransactionQRModal = ({ modalOpen, setModalOpen, userAddress, setQrCode }) => {
    const [confirmed, setConfirmed] = useState(false);
    const {transactions, setTransactions, avatar} = useCashApp()
    const qrRef = useRef() //gives back an object
    const { connection } = useConnection()
    const {cartPrice, setCartPrice, cart, setCart} = useContext(CartContext)



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
        // console.log(reference)
        // console.log(reference.toBase58())
        const url = "solana:https://7516-2607-f470-6-3001-9197-a9be-765-5798.ngrok.io/api/" + userAddress + "/" + reference.toBase58() + "/createtransaction"
        const qr = createQR(url, 488, 'transparent')
        if (qrRef.current) {
            qrRef.current.innerHTML = ''
            qr.append(qrRef.current)
        }

        //Wait for user to send transaction
        const interval = setInterval(async() => {
            try {
                const foundReference = await findReference(connection, reference);
                console.log("FOUND REFERENCE", foundReference);
                if (foundReference.confirmationStatus === 'confirmed') {
                    setConfirmed(true);
                    setQrCode(false);
                }
            } catch {
                console.log("No reference found");
            }
            }, 5000)
            return () => clearInterval(interval)
    })

    return (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div>
                <div className="flex flex-col items-center justify-center space-y-1">
                    {cartPrice} SOL
                </div>
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
