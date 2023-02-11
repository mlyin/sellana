import Modal from '../Modal'
import { createQR, encodeURL, findReference, validateTransfer, FindReferenceError, ValidateTransferError } from "@solana/pay"
import { PublicKey, Keypair } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useRef, useState } from 'react';
import { truncate } from "../../utils/string"




const TransactionQRModal = ({ modalOpen, setModalOpen, userAddress, setQrCode }) => {
    const qrRef = useRef() //gives back an object
    const { connection } = useConnection()
    // Need to generate QR code based on public key
    // Set the state to true to rerender the component with generated QR
    const loadQr = () => {
        setQrCode(true)
    }

    useEffect(() => {
        //Do something when the component first renders (generate QR)
        console.log("LOGGING USER ADDRESS" + userAddress + typeof(userAddress));
        const recipient = new PublicKey(userAddress.toString())
        const amount = new BigNumber("1")
        const reference = Keypair.generate().publicKey
        const label = "Evil cookies inc"
        const message = "Thanks for the sol"

        const urlParams = { //need to adjust to take other currencies
            recipient,
            amount,
            reference,
            label,
            message,
        }

        const url = encodeURL(urlParams)
        const qr = createQR(url, 488, 'transparent')
        if (qrRef.current) {
            qrRef.current.innerHTML = ''
            qr.append(qrRef.current)
        }
    })

    return (
        <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
            <div >
                <div className="flex flex-col items-center justify-center space-y-1">
                    <div ref={qrRef}/>
                </div>

                <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="text-lg font-medium text-gray-800">{truncate(userAddress)}</p>

                    <p className="text-sm font-light text-gray-600">Scan to pay ${truncate(userAddress)}</p>

                    <button onClick={() => loadQr()} className="w-full rounded-lg bg-[#16d542] py-3 hover:bg-opacity-70">
                        <span className="font-medium text-white">Load QR code</span>
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default TransactionQRModal
