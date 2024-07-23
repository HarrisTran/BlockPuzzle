import { JWT } from "google-auth-library";
import { google } from "googleapis";
import { readFile, readFileSync } from "read-file-safe";
const GOOGLE_APPLICATION_CREDENTIALS_PATH = './my-sheets-api-project-b3e6cd32bd69.json';

export class DataGameManager {

    private authenticationService: JWT

    private getCredentials() {
        try {
            const data = JSON.parse(readFileSync(GOOGLE_APPLICATION_CREDENTIALS_PATH));
            this.authenticationService = new JWT({
                email: data.client_email,
                key: data.private_key,
                scopes: ["https://www.googleapis.com/auth/spreadsheets"],
            })
        } catch (error) {
            console.error("Error reading credentials file:", error);
            throw error;
        }
    }

    public constructor() {
        this.getCredentials();
    }

    async readGoogleSheet(spreadsheetId: string, sheetName: string) {
        const sheets = google.sheets({
            version: "v4",
            auth: this.authenticationService
        });

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: `${sheetName}!A2:C17`,
            });
            const values = response.data.values;
            return values;
        } catch (error) {
            console.error("Error reading sheet:", error);
        }
    }
}


