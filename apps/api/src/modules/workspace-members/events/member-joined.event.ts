export class MemberJoinedEvent {
	static readonly EVENT = "member.joined";

	constructor(
		public readonly workspaceId: string,
		public readonly memberId: string,
		public readonly actorId: string,
	) {}
}
