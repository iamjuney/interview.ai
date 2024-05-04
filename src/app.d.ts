// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		// we omit the id property because lucia automatically generate it for us when we create a user
		type DatabaseUserAttributes = {
			role: string;
			username?: string;
			first_name: string;
			last_name: string;
			email: string;
			image: string;
			show_onboarding: boolean;
		};
		type DatabaseSessionAttributes = {};
	}
}

export {};
