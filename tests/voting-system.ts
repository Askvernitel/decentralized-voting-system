import { BankrunProvider, startAnchor } from "anchor-bankrun";
import {VotingSystem} from "../target/types/voting_system";
import { BN, Program } from "@coral-xyz/anchor";
import {PublicKey} from "@solana/web3.js"

const IDL = require("../target/idl/voting_system.json");
const votingAddress = new PublicKey("F23EhRjr5qS5EYJ9cCTdeTA73EgAKYRh1Dbu15Zgawb");

describe("initialize test", async () => {
  it("", async ()=>{
        //anchor.setProvider(anchor.AnchorProvider.env());
        const context = await startAnchor("", [{name:"voting_system", programId:votingAddress}],[]);

        const provider = new BankrunProvider(context);

        const votingProgram = new Program<VotingSystem>(IDL,  provider);
        await votingProgram.methods.initializePoll(
        new BN(1),
        "Check",
        new BN(1771704943),
        new BN(1771704943 + 3600),
        new BN(3),
        ).rpc();

        const [pollAddress] = PublicKey.findProgramAddressSync(
                [new BN(1).toArrayLike(Buffer, "le", 8)],
                votingAddress
        );

        console.log(new BN(1).toArrayLike(Buffer, "le", 8));
        const poll = await votingProgram.account.poll.fetch(pollAddress);

        console.log(poll);

        //const program = anchor.workspace.VotingSystem as Program<VotingSystem>;
  });
});
