"use client"

import { Button } from "@/components/ui/components/button";
import { push_messaging_token } from "@/lib/push-message";

export default function page() {
    return (
        <div>
            <h1>Test Push Messaging</h1>
            <Button onClick={
                ()=>{
                    push_messaging_token()
                }
            }>
                Test Push Messaging
            </Button>
        </div>
    );
};
