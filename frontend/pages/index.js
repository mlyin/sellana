import { useState, useEffect } from 'react'
import Action from '../components/header/Action'
import NavMenu from '../components/header/NavMenu'
import Profile from '../components/header/Profile'
import SearchBar from '../components/home/SearchBar'
import NewTransactionModal from '../components/transaction/NewTransactionModal'
import TransactionsList from '../components/transaction/TransactionsList'
import { useWallet } from '@solana/wallet-adapter-react'
import TransactionQRModal from '../components/transaction/TransactionQRModal'
import { transactions } from '../data/transactions'
import { getAvatarUrl } from "../functions/getAvatarUrl"
import { useCashApp } from '../hooks/cashapp'
import { useConnection } from '@solana/wallet-adapter-react'
import { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"

const Home = () => {
    const connection = new Connection("https://api.devnet.solana.com")
    const [transactions, setTransactions] = useState([])

    const [transactionQRModalOpen, setTransactionQRModalOpen] = useState(false)
    // const [newTransactionModalOpen, setNewTransactionModalOpen] = useState(false)
    const [qrCode, setQrCode] = useState(false)
    const { connected, publicKey, avatar, userAddress,  newTransactionModalOpen, setNewTransactionModalOpen } = useCashApp()
    const wallet = useWallet()
    useEffect(() => {
        const fetchData = async() => {
            const requestedConfirmedSignatures = await connection.getConfirmedSignaturesForAddress2(wallet.publicKey.toBase58())
            const signatures = (confirmedSignatures.map(x => x.signature));
            const transactionResponses = (signatures.map(x => connection.getTransaction(x)));
            const confirmedTransactionMetas = transactionResponses.map(x => x.meta);
            console.log(confirmedTransactionMetas);
        }

    })
 
    return (
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

                <TransactionsList connected={connected} transactions={transactions} />
            </main>
        </div>
    )
}

export default Home
