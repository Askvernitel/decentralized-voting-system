

#[cfg(test)]
mod tests{
    use mollusk_svm::{result::Check, Mollusk};
    use solana_sdk::{instruction::Instruction, pubkey::Pubkey};

    #[test]
    fn test_hello_world() {
        let program_id = Pubkey::new_unique();
        let mollusk = Mollusk::new(&program_id, "target/deploy/voting_system");

        let instruction = Instruction::new_with_bytes(program_id, &[], vec![]);
        mollusk.process_and_validate_instruction(&instruction, &[], &[Check::success()]);
    }

}