module convince_me::utils {
    use aptos_framework::aptos_coin::{AptosCoin as APT};
    use aptos_framework::coin;
    use aptos_framework::fungible_asset::Metadata;
    use aptos_framework::object::{Object};
    use std::option;

    /// Price per prompt; hardcoded to 1 APT dure to time constraints
    const PROMPT_PRICE: u64 = 1_00000000;

    public fun apt_metadata(): Object<Metadata> {
        let paired_metadata_opt = coin::paired_metadata<APT>();
        option::extract(&mut paired_metadata_opt)
    }

    public fun prompt_price(): u64 { PROMPT_PRICE }
}