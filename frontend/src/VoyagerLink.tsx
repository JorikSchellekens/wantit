import React from "react";
import { Link } from "@mui/joy";
import { Identity } from "./types";

export enum LinkType {
    "Contract",
    "Class",
    "Identity",
    "Transaction",
    "Block",
}

interface IdentityLinkProps {
    identity: Identity;
    type: LinkType
}

export const VoyagerLink: React.FC<IdentityLinkProps> = ({ identity, type }) => {
    switch (type) {
        case LinkType.Contract:
            return (
                <Link href={`https://sepolia.voyager.online/contract/${identity.address}`} sx={{verticalAlign: 'center'}}>
                    {identity.snid || `${identity.address.substring(0, 10)}......${identity.address.substring(identity.address.length - 8)}`}
                </Link>
            );
        case LinkType.Class:
            return (
                <Link href={`https://sepolia.voyager.online/class/${identity.address}`} sx={{verticalAlign: 'center'}}>
                    {identity.snid || `${identity.address.substring(0, 10)}......${identity.address.substring(identity.address.length - 8)}`}
                </Link>
            );
        case LinkType.Identity:
            return (
                <Link href={`https://sepolia.voyager.online/contract/${identity.address}`} sx={{verticalAlign: 'center'}}>
                    {identity.snid || `${identity.address.substring(0, 10)}......${identity.address.substring(identity.address.length - 8)}`}
                </Link>
            );
        case LinkType.Transaction:
            return (
                <Link href={`https://sepolia.voyager.online/transaction/${identity.address}`} sx={{verticalAlign: 'center'}}>
                    {identity.snid || `${identity.address.substring(0, 10)}......${identity.address.substring(identity.address.length - 8)}`}
                </Link>
            ); 
        case LinkType.Block:
            return (
                <Link href={`https://sepolia.voyager.online/block/${identity.address}`} sx={{verticalAlign: 'center'}}>
                    {identity.snid || `${identity.address.substring(0, 10)}......${identity.address.substring(identity.address.length - 8)}`}
                </Link>
            );
    }
};
