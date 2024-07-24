{

    function cleanup_t_bool(value) -> cleaned {
        cleaned := iszero(iszero(value))
    }

    function abi_encode_t_bool_to_t_bool_fromStack(value, pos) {
        mstore(pos, cleanup_t_bool(value))
    }

    function abi_encode_tuple_t_bool__to_t_bool__fromStack_reversed(headStart , value0) -> tail {
        tail := add(headStart, 32)

        abi_encode_t_bool_to_t_bool_fromStack(value0,  add(headStart, 0))

    }

    function cleanup_t_uint160(value) -> cleaned {
        cleaned := and(value, 0xffffffffffffffffffffffffffffffffffffffff)
    }

    function cleanup_t_address_payable(value) -> cleaned {
        cleaned := cleanup_t_uint160(value)
    }

    function abi_encode_t_address_payable_to_t_address_payable_fromStack(value, pos) {
        mstore(pos, cleanup_t_address_payable(value))
    }

    function abi_encode_tuple_t_address_payable__to_t_address_payable__fromStack_reversed(headStart , value0) -> tail {
        tail := add(headStart, 32)

        abi_encode_t_address_payable_to_t_address_payable_fromStack(value0,  add(headStart, 0))

    }

    function cleanup_t_uint256(value) -> cleaned {
        cleaned := value
    }

    function abi_encode_t_uint256_to_t_uint256_fromStack(value, pos) {
        mstore(pos, cleanup_t_uint256(value))
    }

    function abi_encode_tuple_t_uint256__to_t_uint256__fromStack_reversed(headStart , value0) -> tail {
        tail := add(headStart, 32)

        abi_encode_t_uint256_to_t_uint256_fromStack(value0,  add(headStart, 0))

    }

    function allocate_unbounded() -> memPtr {
        memPtr := mload(64)
    }

    function revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() {
        revert(0, 0)
    }

    function revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() {
        revert(0, 0)
    }

    function validator_revert_t_uint256(value) {
        if iszero(eq(value, cleanup_t_uint256(value))) { revert(0, 0) }
    }

    function abi_decode_t_uint256(offset, end) -> value {
        value := calldataload(offset)
        validator_revert_t_uint256(value)
    }

    function abi_decode_tuple_t_uint256(headStart, dataEnd) -> value0 {
        if slt(sub(dataEnd, headStart), 32) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }

        {

            let offset := 0

            value0 := abi_decode_t_uint256(add(headStart, offset), dataEnd)
        }

    }

    function cleanup_t_address(value) -> cleaned {
        cleaned := cleanup_t_uint160(value)
    }

    function abi_encode_t_address_to_t_address_fromStack(value, pos) {
        mstore(pos, cleanup_t_address(value))
    }

    function abi_encode_tuple_t_address__to_t_address__fromStack_reversed(headStart , value0) -> tail {
        tail := add(headStart, 32)

        abi_encode_t_address_to_t_address_fromStack(value0,  add(headStart, 0))

    }

    function validator_revert_t_address(value) {
        if iszero(eq(value, cleanup_t_address(value))) { revert(0, 0) }
    }

    function abi_decode_t_address(offset, end) -> value {
        value := calldataload(offset)
        validator_revert_t_address(value)
    }

    function abi_decode_tuple_t_address(headStart, dataEnd) -> value0 {
        if slt(sub(dataEnd, headStart), 32) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }

        {

            let offset := 0

            value0 := abi_decode_t_address(add(headStart, offset), dataEnd)
        }

    }

    function array_length_t_array$_t_address_$dyn_memory_ptr(value) -> length {

        length := mload(value)

    }

    function array_storeLengthForEncoding_t_array$_t_address_$dyn_memory_ptr_fromStack(pos, length) -> updated_pos {
        mstore(pos, length)
        updated_pos := add(pos, 0x20)
    }

    function array_dataslot_t_array$_t_address_$dyn_memory_ptr(ptr) -> data {
        data := ptr

        data := add(ptr, 0x20)

    }

    function abi_encode_t_address_to_t_address(value, pos) {
        mstore(pos, cleanup_t_address(value))
    }

    function abi_encodeUpdatedPos_t_address_to_t_address(value0, pos) -> updatedPos {
        abi_encode_t_address_to_t_address(value0, pos)
        updatedPos := add(pos, 0x20)
    }

    function array_nextElement_t_array$_t_address_$dyn_memory_ptr(ptr) -> next {
        next := add(ptr, 0x20)
    }

    // address[] -> address[]
    function abi_encode_t_array$_t_address_$dyn_memory_ptr_to_t_array$_t_address_$dyn_memory_ptr_fromStack(value, pos)  -> end  {
        let length := array_length_t_array$_t_address_$dyn_memory_ptr(value)
        pos := array_storeLengthForEncoding_t_array$_t_address_$dyn_memory_ptr_fromStack(pos, length)
        let baseRef := array_dataslot_t_array$_t_address_$dyn_memory_ptr(value)
        let srcPtr := baseRef
        for { let i := 0 } lt(i, length) { i := add(i, 1) }
        {
            let elementValue0 := mload(srcPtr)
            pos := abi_encodeUpdatedPos_t_address_to_t_address(elementValue0, pos)
            srcPtr := array_nextElement_t_array$_t_address_$dyn_memory_ptr(srcPtr)
        }
        end := pos
    }

    function abi_encode_tuple_t_array$_t_address_$dyn_memory_ptr__to_t_array$_t_address_$dyn_memory_ptr__fromStack_reversed(headStart , value0) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_array$_t_address_$dyn_memory_ptr_to_t_array$_t_address_$dyn_memory_ptr_fromStack(value0,  tail)

    }

    function array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, length) -> updated_pos {
        mstore(pos, length)
        updated_pos := add(pos, 0x20)
    }

    function store_literal_in_memory_6da534ee323afac2e14f07be613908b1b07604853ab306787cf6651b24e4241f(memPtr) {

        mstore(add(memPtr, 0), "Beneficiary can't bid on their o")

        mstore(add(memPtr, 32), "wn auction.")

    }

    function abi_encode_t_stringliteral_6da534ee323afac2e14f07be613908b1b07604853ab306787cf6651b24e4241f_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 43)
        store_literal_in_memory_6da534ee323afac2e14f07be613908b1b07604853ab306787cf6651b24e4241f(pos)
        end := add(pos, 64)
    }

    function abi_encode_tuple_t_stringliteral_6da534ee323afac2e14f07be613908b1b07604853ab306787cf6651b24e4241f__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_6da534ee323afac2e14f07be613908b1b07604853ab306787cf6651b24e4241f_to_t_string_memory_ptr_fromStack( tail)

    }

    function panic_error_0x11() {
        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)
        mstore(4, 0x11)
        revert(0, 0x24)
    }

    function checked_add_t_uint256(x, y) -> sum {
        x := cleanup_t_uint256(x)
        y := cleanup_t_uint256(y)
        sum := add(x, y)

        if gt(x, sum) { panic_error_0x11() }

    }

    function abi_encode_tuple_t_address_t_uint256__to_t_address_t_uint256__fromStack_reversed(headStart , value1, value0) -> tail {
        tail := add(headStart, 64)

        abi_encode_t_address_to_t_address_fromStack(value0,  add(headStart, 0))

        abi_encode_t_uint256_to_t_uint256_fromStack(value1,  add(headStart, 32))

    }

    function store_literal_in_memory_ce9a2510cdbe7ade2a731d7eecf6db92301c5534973e514f79562c6971afb873(memPtr) {

        mstore(add(memPtr, 0), "Rating must be from 1 to 5.")

    }

    function abi_encode_t_stringliteral_ce9a2510cdbe7ade2a731d7eecf6db92301c5534973e514f79562c6971afb873_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 27)
        store_literal_in_memory_ce9a2510cdbe7ade2a731d7eecf6db92301c5534973e514f79562c6971afb873(pos)
        end := add(pos, 32)
    }

    function abi_encode_tuple_t_stringliteral_ce9a2510cdbe7ade2a731d7eecf6db92301c5534973e514f79562c6971afb873__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_ce9a2510cdbe7ade2a731d7eecf6db92301c5534973e514f79562c6971afb873_to_t_string_memory_ptr_fromStack( tail)

    }

    function store_literal_in_memory_8226a325ec28258d6cc0377dc357cf0d99168b9e1bffa6ff78a8d1b8a5dae865(memPtr) {

        mstore(add(memPtr, 0), "You can rate only if you have pr")

        mstore(add(memPtr, 32), "eviously bid.")

    }

    function abi_encode_t_stringliteral_8226a325ec28258d6cc0377dc357cf0d99168b9e1bffa6ff78a8d1b8a5dae865_to_t_string_memory_ptr_fromStack(pos) -> end {
        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, 45)
        store_literal_in_memory_8226a325ec28258d6cc0377dc357cf0d99168b9e1bffa6ff78a8d1b8a5dae865(pos)
        end := add(pos, 64)
    }

    function abi_encode_tuple_t_stringliteral_8226a325ec28258d6cc0377dc357cf0d99168b9e1bffa6ff78a8d1b8a5dae865__to_t_string_memory_ptr__fromStack_reversed(headStart ) -> tail {
        tail := add(headStart, 32)

        mstore(add(headStart, 0), sub(tail, headStart))
        tail := abi_encode_t_stringliteral_8226a325ec28258d6cc0377dc357cf0d99168b9e1bffa6ff78a8d1b8a5dae865_to_t_string_memory_ptr_fromStack( tail)

    }

}
