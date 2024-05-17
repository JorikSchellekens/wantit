export type class_ = {
    classhash: string;
    // This is an ai best guess based off of exampel abi objects. This should be checked for correctness.
    abi: {
        type: string;
        name: string;
        interface_name?: string;
        members?: {
            name: string;
            type: string;
        }[];
        items?: {
            type: string;
            name: string;
            inputs?: {
                name: string;
                type: string;
            }[];
            outputs?: {
                type: string;
            }[];
            state_mutability?: string;
        }[];
        inputs?: {
            name: string;
            type: string;
        }[];
        kind?: string;
        variants?: {
            name: string;
            type: string;
            kind?: string;
        }[];
    }[];
}