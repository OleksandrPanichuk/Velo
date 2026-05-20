import { registerEnumType } from "@nestjs/graphql";

export enum OAuthProvider {
	GOOGLE = "google",
	GITHUB = "github",
}

registerEnumType(OAuthProvider, {
	name: "OAuthProvider",
});
