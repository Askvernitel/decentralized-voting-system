import { BankrunProvider, startAnchor } from "anchor-bankrun";
import {VotingSystem} from "../target/types/voting_system";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import {PublicKey} from "@solana/web3.js"
import {before} from "mocha";

const IDL = require("../target/idl/voting_system.json");
const votingAddress = new PublicKey("DjqR34cfmyTkMzMAHSR1i5ziWxGWAtKkX6XPtRKp3d3b");

describe("voting test", async () => {
    let context;
    let provider = AnchorProvider.env();
    let votingProgram;
    before("Before All", async ()=>{
        provider = AnchorProvider.env();
        votingProgram = new Program<VotingSystem>(IDL, provider);

        /*context = await startAnchor("", [{name:"voting_system", programId:votingAddress}],[]);
        provider = new BankrunProvider(context);
        votingProgram = new Program<VotingSystem>(IDL,  provider);*/
    })

    it("voting initialization", async ()=>{
        await votingProgram.methods.initializePoll(
        new BN(1),
        "Check",
        new BN(1771704943),
        new BN(1771704943 + 3600),
        new BN(0),
        ).rpc();

        const [pollAddress] = PublicKey.findProgramAddressSync(
                [new BN(1).toArrayLike(Buffer, "le", 8)],
                votingAddress
        );

        console.log(new BN(1).toArrayLike(Buffer, "le", 8));
        const poll = await votingProgram.account.poll.fetch(pollAddress);

        console.log("Poll: ", poll);
    });

    it("candidate initialization", async()=>{
        await votingProgram.methods.initializeCandidate(new BN(1), "Daniel").rpc();
        await votingProgram.methods.initializeCandidate(new BN(1), "Other").rpc();

        const [candidateAddress] = PublicKey.findProgramAddressSync(
            [new BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Daniel")],
            votingAddress
        )
        const [pollAddress] = PublicKey.findProgramAddressSync(
            [new BN(1).toArrayLike(Buffer, "le", 8)],
            votingAddress
        );

        const candidate = await votingProgram.account.candidate.fetch(candidateAddress);
        const poll = await votingProgram.account.poll.fetch(pollAddress);

        console.log("Candidate: ", candidate);
        console.log("Poll: ", poll);
    });


    it("vote", async()=>{
        await votingProgram.methods.vote(new BN(1), "Daniel").rpc();

        const [candidateAddress] = PublicKey.findProgramAddressSync(
            [new BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Daniel")],
            votingAddress
        )

        const candidate = await votingProgram.account.candidate.fetch(candidateAddress);

        console.log("Voted Candidate: ", candidate);
    })

});
