import React from "react";
import { Card } from "@mui/joy";
import PoolCreator from "./PoolCreator";

export function CreatePoolCard() {
    return (
        <Card sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
            <PoolCreator />
        </Card>
    )
}

