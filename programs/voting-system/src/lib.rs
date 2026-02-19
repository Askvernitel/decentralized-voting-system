use anchor_lang::prelude::*;

declare_id!("F23EhRjr5qS5EYJ9cCTdeTA73EgAKYRh1Dbu15Zgawb");

#[program]
pub mod voting_system {
    use super::*;

    pub fn initialize_poll(ctx: Context<InitPoll>, poll_id:u64, description:String, poll_start:u64, poll_end:u64, candidate_amount:u64) -> Result<()>{
        ctx.accounts.poll.poll_id = poll_id;
        ctx.accounts.poll.description = description;
        ctx.accounts.poll.poll_start = poll_start;
        ctx.accounts.poll.poll_end = poll_end;
        ctx.accounts.poll.candidate_amount = candidate_amount;

        Ok(())
    }
    /*
    pub fn vote(ctx: Context<Vote>, poll_id:u64) -> Result<()>{
        Ok(())
    }*/

}

#[derive(Accounts)]
#[instruction(poll_id:u64)]
pub struct InitPoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
    init,
    payer = signer,
    space = 8 + Poll::INIT_SPACE,
    seeds = [poll_id.to_le_bytes().as_ref()],
    bump
    )]
    pub poll: Account<'info, Poll>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll{
    pub poll_id:u64,
    #[max_len(32)]
    pub description:String,
    pub poll_start:u64,
    pub poll_end:u64,
    pub candidate_amount:u64,
}