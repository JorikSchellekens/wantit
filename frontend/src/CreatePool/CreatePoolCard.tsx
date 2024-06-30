import React from "react";
import { Button, Card } from "@mui/joy";
import { Link } from "react-router-dom";

export function CreatePoolCard() {
    return (
        <Card sx={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center'}} >
            <Link to="/create"><Button>Create Pool</Button></Link>
        </Card>
    )
}

