import {ConfigService} from "@nestjs/config";
import {HelmetOptions} from "helmet";
import type {Env} from "@/config";
import {NodeEnv} from "@/constants";


export const getHelmetConfig = (config: ConfigService<Env>): HelmetOptions => {
    const baseUrl = config.get("BASE_URL") as string;
    const isProduction = config.get("NODE_ENV") === NodeEnv.PRODUCTION;

    const sandboxScriptSrc = [
        "https://embeddable-sandbox.cdn.apollographql.com",
        "https://sandbox.embed.apollographql.com"
    ];

    const sandboxConnectSrc = [
        "https://embeddable-sandbox.cdn.apollographql.com",
        "https://sandbox.embed.apollographql.com",
        "https://apollo-server-landing-page.cdn.apollographql.com",
        "https://graphql.api.apollographql.com"
    ];

    return {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:"],
                scriptSrc: isProduction
                    ? ["'self'"]
                    : ["'self'", "'unsafe-inline'", ...sandboxScriptSrc],
                connectSrc: isProduction
                    ? ["'self'", "wss:", "ws:", baseUrl]
                    : ["'self'", "wss:", "ws:", baseUrl, ...sandboxConnectSrc],
                frameSrc: isProduction
                    ? ["'self'"]
                    : ["'self'", "https://sandbox.embed.apollographql.com", "https://studio.apollographql.com"]
            }
        },
        crossOriginEmbedderPolicy: false
    };
};