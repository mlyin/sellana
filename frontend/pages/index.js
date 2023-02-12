import { useState, useEffect, useContext } from 'react'
import Action from '../components/header/Action'
import NavMenu from '../components/header/NavMenu'
import Profile from '../components/header/Profile'
import SearchBar from '../components/home/SearchBar'
import NewTransactionModal from '../components/transaction/NewTransactionModal'
import TransactionsList from '../components/transaction/TransactionsList'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import TransactionQRModal from '../components/transaction/TransactionQRModal'
import { getAvatarUrl } from "../functions/getAvatarUrl"
import { useCashApp } from '../hooks/cashapp'
import { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"

import { coffeeShopItems } from '../data/coffeeShopData'
import Storefront from '../components/home/Storefront'
import { CartContext } from '../hooks/cartContext'

const Home = () => {
    const connection = new Connection("https://api.devnet.solana.com")
    const [transactions, setTransactions] = useState([])
    const { connected, publicKey, avatar, userAddress,  newTransactionModalOpen, setNewTransactionModalOpen } = useCashApp()
    const [transactionQRModalOpen, setTransactionQRModalOpen] = useState(false)
    // const [newTransactionModalOpen, setNewTransactionModalOpen] = useState(false)
    const [qrCode, setQrCode] = useState(false)
    const [cartPrice, setCartPrice] = useState(0);
    const [cart, setCart] = useState([]);


    useEffect(() => { //get transactions
        const fetchData = async() => {
            if (connected) {
                const requestedConfirmedSignatures = await connection.getConfirmedSignaturesForAddress2(new PublicKey(publicKey.toBase58()))
                console.log(requestedConfirmedSignatures);
                const signatures = await requestedConfirmedSignatures.map(x => x.signature);
                const transactionResponses = await Promise.all(signatures.map(x => connection.getTransaction(x)))
                console.log(transactionResponses)
                const confirmedTransactionMetas = transactionResponses.map(x => x.meta);
                console.log(confirmedTransactionMetas)
                console.log(confirmedTransactionMetas[0])
                const tempTransactions = []
                for (let i = 0; i < confirmedTransactionMetas.length; i++) {
                    console.log()
                    const transactionObj = ({
                        id: transactionResponses[i].transaction.signatures[0],
                        from: {
                            name: transactionResponses[i].transaction.message.accountKeys[0].toString(),
                            avatar: getAvatarUrl(transactionResponses[i].transaction.message.accountKeys[0].toString()),
                            verified: false,
                        },
                        to: {
                            name: transactionResponses[i].transaction.message.accountKeys[1].toString(),
                            avatar: getAvatarUrl(transactionResponses[i].transaction.message.accountKeys[1].toString()),
                            verified: false,
                        },
                        description: 'sample desc',
                        transactionDate: new Date(1000 * transactionResponses[i].blockTime),
                        status: 'Completed',
                        amount: 1/1000000000 * (confirmedTransactionMetas[i].postBalances[0] - confirmedTransactionMetas[i].preBalances[0] < 0 ? 
                                                confirmedTransactionMetas[i].preBalances[0] - confirmedTransactionMetas[i].postBalances[0] : 
                                                confirmedTransactionMetas[i].postBalances[0] - confirmedTransactionMetas[i].preBalances[0]) //all calculations based on sender
                    })
                    tempTransactions.push(transactionObj);
                }
                setTransactions(tempTransactions)
            }
        }

        fetchData().catch(console.error);
    }, [connected])
 
    return (
        <CartContext.Provider value={{cartPrice, setCartPrice, cart, setCart}}>
            <div className="flex min-h-screen ">
                <header className="flex w-[300px] flex-col bg-[#f02c4c] p-12">
                    <Profile setModalOpen={setTransactionQRModalOpen} avatar={avatar} userAddress={userAddress} />
                    <TransactionQRModal modalOpen={transactionQRModalOpen} setModalOpen={setTransactionQRModalOpen} userAddress={userAddress} myKey={publicKey} setQrCode={setQrCode} />

                    <NavMenu connected={connected} myKey={publicKey} publicKey={publicKey} />

                    <Action setModalOpen={setNewTransactionModalOpen} />
                    <NewTransactionModal modalOpen={newTransactionModalOpen} setModalOpen={setNewTransactionModalOpen} />
                </header>

                <main className="flex flex-1 flex-col">
                    <SearchBar />
                    <Storefront items={coffeeShopItems}/>
                    <TransactionsList connected={connected} transactions={transactions} />
                </main>
            </div>
        </CartContext.Provider>
    )
}

export default Home
