/*
    This module is a PoC example of the simple convince me game.
    Post hackathon version will have more features and will be more complex.
*/
module convince_me::core {
    use aptos_framework::event;
    use aptos_framework::fungible_asset::{Self, FungibleStore};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::option::{Self, Option};
    use aptos_framework::primary_fungible_store;
    use convince_me::utils;
    use std::signer;
    use std::string::{Self, String};

    // ------
    // Errors
    // ------

    /// The agent has a pending prompt
    const EAGENT_HAS_PENDING_PROMPT: u64 = 1;
    /// The signer is not the ai agent
    const ENOT_AGENT: u64 = 2;

    // ---------
    // Resources
    // ---------

    /// Global storage for the game info
    struct Info has key {
        treasury: Object<FungibleStore>,
        treasury_extend_ref: object::ExtendRef,
        /// the current prompt that is available for the agent to handle
        current_prompt: Option<Prompt>
    }

    /// Global storage for the prompt that the agent has to handle
    struct Prompt has copy, drop, store {
        message: String,
        submitter_address: address,
    }

    // ------
    // Events
    // ------

    #[event]
    struct TreasureInitialized has drop, store {
        treasury: address,
    }

    #[event]
    struct PromptSubmitted has drop, store {
        submitter: address,
        prompt: String,
        apt_added_to_treasury: u64,
    }

    // --------------
    // Initialization
    // --------------

    fun init_module(convince_me: &signer) {
        let constructor_ref = &object::create_object(signer::address_of(convince_me));
        // let default_prompt = Prompt { message: string::utf8(b""), submitter_address: @dead_wallet };
        let info = Info {
            treasury: fungible_asset::create_store(constructor_ref, utils::apt_metadata()),
            treasury_extend_ref: object::generate_extend_ref(constructor_ref),
            current_prompt: option::none(),
        };
        
        move_to(convince_me, info);
    }

    // ----------------
    // Public Functions
    // ----------------

    /// Submit a prompt to the game
    entry fun submit_prompt(submitter: &signer, message: String) acquires Info {
        // ensure there is no pending prompt 
        assert!(!is_prompt_available(), EAGENT_HAS_PENDING_PROMPT);
        // set the prompt
        let prompt = Prompt { message, submitter_address: signer::address_of(submitter) };
        option::some(prompt);
        let info = borrow_global_mut<Info>(@convince_me);
        info.current_prompt = option::some(prompt);
        // withdraw 1 APT from the submitter and deposit it into the treasury
        fungible_asset::transfer(
            submitter,
            primary_fungible_store::ensure_primary_store_exists(
                signer::address_of(submitter),
                utils::apt_metadata()
            ),
            treasury(),
            utils::prompt_price()
        );
        // emit event
        event::emit(PromptSubmitted {
            submitter: signer::address_of(submitter),
            prompt: message,
            apt_added_to_treasury: utils::prompt_price(),
        });
    }

    /// Settle the prompt and pay the prompt submitter
    entry fun settle_prompt(agent: &signer) acquires Info {
        assert!(signer::address_of(agent) == @agent_addr, ENOT_AGENT);
        let (current_prompt_submitter_addr, _) = current_prompt();
        // transfer 1 APT from the treasury to the agent
        fungible_asset::transfer(
            &treasury_signer(),
            treasury(),
            primary_fungible_store::ensure_primary_store_exists(
                current_prompt_submitter_addr,
                utils::apt_metadata()
            ),
            treasury_balance()
        );
        // set the prompt to default
        let info = borrow_global_mut<Info>(@convince_me);
        option::extract(&mut info.current_prompt);
    }

    /// Reject the prompt
    entry fun reject_prompt(agent: &signer) acquires Info {
        assert!(signer::address_of(agent) == @agent_addr, ENOT_AGENT);
        // set the prompt to default
        let current_prompt = mut_prompt();
        *current_prompt = Prompt { message: string::utf8(b""), submitter_address: @dead_wallet };
    }

    // --------------
    // View Functions
    // --------------

    #[view]
    /// Returns the amount of APT to pay per prompt
    public fun prompt_price(): u64 { utils::prompt_price() }

    #[view]
    /// Returns the treasury object store
    public fun treasury(): Object<FungibleStore> acquires Info {
        let info = borrow_global<Info>(@convince_me);
        info.treasury
    }

    #[view]
    /// Returns the treasury balance
    public fun treasury_balance(): u64 acquires Info {
        let info = borrow_global<Info>(@convince_me);
        fungible_asset::balance(info.treasury)
    }

    #[view]
    /// Returns if there is a prompt available
    public fun is_prompt_available(): bool acquires Info {
        let info = borrow_global<Info>(@convince_me);
        option::is_some(&info.current_prompt)
    }

    #[view]
    /// Returns the current prompt (tuple: address, message)
    public fun current_prompt(): (address, String) acquires Info {
        let prompt = prompt();
        (prompt.submitter_address, prompt.message)
    }

    // ----------------
    // Helper Functions
    // ----------------

    /// Returns the treasury signer
    fun treasury_signer(): signer acquires Info {
        let info = borrow_global<Info>(@convince_me);
        object::generate_signer_for_extending(&info.treasury_extend_ref)
    }

    /// Returns the prompt resource
    fun prompt(): Prompt acquires Info {
        let info = borrow_global<Info>(@convince_me);
        *option::borrow(&info.current_prompt)
    }

    /// Returns the mut prompt resource
    inline fun mut_prompt(): &mut Prompt acquires Info {
        let info = borrow_global_mut<Info>(@convince_me);
        option::borrow_mut(&mut info.current_prompt)
    }


    // ----------
    // Unit Tests
    // ----------
}
