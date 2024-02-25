import fetch from "node-fetch";
import type { EmbedsDiscordWebhookPayload } from "./discord-webhook.d.ts";

type DieType =
	| "d4"
	| "d6"
	| "pd6"
	| "dF"
	| "d8"
	| "d10"
	| "d00"
	| "d%"
	| "d12"
	| "d20";

export interface PixelsJsonPayload {
	pixelName: string;
	profileName: string;
	actionValue: DieType | string;
	faceValue:
		| 1
		| 2
		| 3
		| 4
		| 5
		| 6
		| 7
		| 8
		| 9
		| 10
		| 11
		| 12
		| 13
		| 14
		| 15
		| 16
		| 17
		| 18
		| 19
		| 20;
}

export const forwardRequestToDiscord = async (
	payload: PixelsJsonPayload,
): Promise<number> => {
	console.log(`Received roll data ${JSON.stringify(payload)}`);

	const { pixelName, profileName, actionValue, faceValue } = payload;
	const discordEmbedsPayload: EmbedsDiscordWebhookPayload = {
		embeds: [
			{
				title: `You rolled with your Pixels die "${pixelName}"`,
				type: "rich",
				color: 7419530, // Examples at https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812
				description: `You rolled a ${faceValue} with your die ${pixelName}. :tada:`,
				thumbnail: determineThumbnail(actionValue),
				footer: {
					text: `action: ${actionValue} / profile: ${profileName}`,
				},
				timestamp: new Date().toISOString(),
			},
		],
	};

	const response = await fetch(process.env.DISCORD_WEBHOOK_URL as string, {
		method: "POST",
		body: JSON.stringify(discordEmbedsPayload),
		headers: {
			"Content-Type": "application/json",
		},
	});
	console.log(`Received status ${response.status} from Discord`);
	return response.status;
};

const determineThumbnail = (
	actionValue: DieType | string,
):
	| {
			url: string;
			height?: number;
			width?: number;
	  }
	| undefined => {
	switch (actionValue) {
		case "d4":
			return {
				url: "https://raw.githubusercontent.com/blalasaadri/pixels-discord-adapter/main/assets/Pictogrammers-Material-Dice-d4-outline.png",
			};
		case "d6":
		case "dF":
			return {
				url: "https://raw.githubusercontent.com/blalasaadri/pixels-discord-adapter/main/assets/Pictogrammers-Material-Dice-d6-outline.png",
			};
		case "pd6":
			return {
				url: "https://raw.githubusercontent.com/blalasaadri/pixels-discord-adapter/main/assets/Pictogrammers-Material-Dice-6-outline.png",
			};
		case "d8":
			return {
				url: "https://raw.githubusercontent.com/blalasaadri/pixels-discord-adapter/main/assets/Pictogrammers-Material-Dice-d8-outline.png",
			};
		case "d10":
		case "d00":
		case "d%":
			return {
				url: "https://raw.githubusercontent.com/blalasaadri/pixels-discord-adapter/main/assets/Pictogrammers-Material-Dice-d10-outline.png",
			};
		case "d12":
			return {
				url: "https://raw.githubusercontent.com/blalasaadri/pixels-discord-adapter/main/assets/Pictogrammers-Material-Dice-d12-outline.png",
			};
		case "d20":
			return {
				url: "https://raw.githubusercontent.com/blalasaadri/pixels-discord-adapter/main/assets/Pictogrammers-Material-Dice-d20-outline.png",
			};
		default:
			return undefined;
	}
};
