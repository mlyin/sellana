import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getParsedNftAccountsByOwner,isValidSolanaAddress, createConnectionConfig,} from "@nfteyez/sol-rayz";
import React, { useEffect, useState } from "react";
//Import all above libraries
//create a connection of devnet
const createConnection = () => {
    return new Connection(clusterApiUrl("devnet"));
};

//check solana on window. This is useful to fetch address of your wallet.
const getProvider = () => {
	if ("solana" in window) {
	const provider = window.solana;
	if (provider.isPhantom) {
	  return provider;
	 }
	}
  };

  //Function to get all NFT information.
//get NFT
const getAllNftData = async () => {
    try {
      if (connectData === true) {
        const connect =    createConnectionConfig(clusterApiUrl("devnet"));
        const provider = getProvider();
        let ownerToken = provider.publicKey;
        const result = isValidSolanaAddress(ownerToken);
        console.log("result", result);
		const nfts = await getParsedNftAccountsByOwner({
          publicAddress: ownerToken,
          connection: connect,
          serialization: true,
        });
        return nfts;
      }
    } catch (error) {
      console.log(error);
    }
  };

  import axios from "axios";
  //Function to get all nft data
  const getNftTokenData = async () => {
	try {
	  let nftData = await getAllNftData();
	  var data = Object.keys(nftData).map((key) => nftData[key]);                                                                    
	  let arr = [];
	  let n = data.length;
	  for (let i = 0; i < n; i++) {
		console.log(data[i].data.uri);
		let val = await axios.get(data[i].data.uri);
		arr.push(val);
	  }
	  return arr;
	} catch (error) {
	  console.log(error);
	}
  };

const Rewards = () => {
	const [nftData, setNftData] = useState([]);
	const [loading, setLoading] = useState(false);
  //Define createConnection function here
	//Define getProvider function here
	//Define getAllNftData function here
  useEffect(() => {
	  async function data() {
		let res = await getAllNftData();
		setNftData(res);
		setLoading(true);
	  }
	  data();
	}, []);
  return (
	  <>
			<section className="nft mt-2 my-5">
			  <div className="container">
				<div className="row text-center">
				  <div className="col-12">
					<h4 className="title">NFT</h4>
				  </div>
				</div>
				<div className="row  d-flex justify-content-center">
				  {loading ? (
					<>
					  {nftData &&
						nftData.length > 0 &&
						nftData.map((val, ind) => {
						  return (
							<div className="col-4 mt-3" key={ind}>
							  <div className="cart text-center">
								<div className="img mt-4 pt-3">
								  <img src={val.data.image} alt="loading..." />
								  <p className="mt-1">{val.data.name}</p>
								  <h6 className=" mt-2">
									{val.data.description}
								  </h6>
								</div>
							  </div>
							</div>
						  );
						})}
					</>
				  ) : (
					<>
					  <p className="text-center">loading...</p>
					</>
				  )}
				</div>
			  </div>
			</section>
	  </>
	);
  };

export default Rewards