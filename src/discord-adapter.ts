import fetch from 'node-fetch';
import type { ContentDiscordWebhookPayload } from './discord-webhook.d.ts';

type DieType = "d4" | "d6" | "pd6" | "dF" | "d8" | "d10" | "d00" | "d%" | "d12" | "d20";

export interface PixelsJsonPayload {
    pixelName: string;
    profileName: string;
    actionValue: DieType | string;
    faceValue: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
}

export const forwardRequestToDiscord = async (payload: PixelsJsonPayload): Promise<number> => {
    console.log(`Received roll data ${JSON.stringify(payload)}, sending it to ${process.env.DISCORD_WEBHOOK_URL}`);
    
    const {pixelName, profileName, actionValue, faceValue} = payload;
    const discordPayload: ContentDiscordWebhookPayload = {
        content: `You rolled a ${faceValue} on ${pixelName}`,
        //username: profileName,
    };

    const response = await fetch(
        process.env.DISCORD_WEBHOOK_URL as string,
        {
            method: 'POST',
            body: JSON.stringify(discordPayload),
            headers: {
                "Content-Type": "application/json",
            }
        }
    );
    console.log(`Received status ${response.status} from Discord`)
    return response.status;
}