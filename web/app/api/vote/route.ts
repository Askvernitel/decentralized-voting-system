import {Request} from "next/dist/compiled/@edge-runtime/primitives";
import {ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse} from "@solana/actions"
import {Connection, PublicKey, Transaction} from "@solana/web3.js"
import { Program} from "@coral-xyz/anchor";
import BN from "bn.js";
import { NextRequest } from "next/server";

const IDL = require("../../../../target/idl/voting_system.json");
export const OPTIONS = GET;

export async function GET(request:NextRequest){
    let response:ActionGetResponse ={
        icon:"",
        title:"Voting",
        description: "Voting for something",
        label:"Yes it is voting for something",
        links:{
            actions:[
                {
                    type:"transaction",
                    href:"/api/vote?candidate=Daniel",
                    label:"Vote for Daniel"
                },
                {
                    type:"transaction",
                    href:"/api/vote?candidate=Other",
                    label:"Vote for Other"
                }
            ],
        }
    }

    return Response.json(response, {status: 200, headers:ACTIONS_CORS_HEADERS});
}
export async function POST(request:NextRequest){
    let url = new URL(request.url);
    let candidate = url.searchParams.get("candidate");

    if(candidate !== "Daniel" && candidate !== "Other"){
        return Response.json({message:"Error"}, {status:400, headers:ACTIONS_CORS_HEADERS});
    }

    let body:ActionPostRequest = await request.json();

    let pubKey = new PublicKey(body.account);
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    const program = new Program(IDL, {connection});
        
    const instruction = await program.methods
        .vote(new BN(1), candidate)
        .accounts({
            signer:pubKey
        })
        .instruction();

    const blockhash = await connection.getLatestBlockhash();

    const transaction = new Transaction(
        {
            feePayer:pubKey,
            blockhash:blockhash.blockhash,
            lastValidBlockHeight:blockhash.lastValidBlockHeight,
        }
    ).add(instruction);

    const response = await createPostResponse( {
        fields:{

            type:"transaction",
            transaction:transaction
        }
    })

    return Response.json(response, {headers:ACTIONS_CORS_HEADERS});
}
