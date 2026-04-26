import { Injectable } from "@nestjs/common";
import { decode, encode } from "base-64";
import { SelectQueryBuilder } from "typeorm";
import { IPaginatedType, PaginationArgs } from "./pagination.types";

@Injectable()
export class PaginationService {
	public async paginate<T extends { id: string | number }>(
		queryBuilder: SelectQueryBuilder<T>,
		paginationArgs: PaginationArgs,
	): Promise<IPaginatedType<T>> {
		const { first = 10, after } = paginationArgs;

		const query = queryBuilder.clone();

		if (after) {
			const decodedId = decode(after);
			query.andWhere(`${queryBuilder.alias}.id > :cursorId`, {
				cursorId: decodedId,
			});
		}

		const [entities, totalCount] = await query
			.orderBy(`${queryBuilder.alias}.id`, "ASC")
			.take(first + 1)
			.getManyAndCount();

		const hasNextPage = entities.length > first;
		const nodes = hasNextPage ? entities.slice(0, first) : entities;

		const edges = nodes.map((node) => ({
			cursor: encode(String(node.id)),
			node,
		}));

		return {
			edges,
			nodes,
			totalCount,
			pageInfo: {
				hasNextPage,
				hasPreviousPage: !!after,
				startCursor: edges.length > 0 ? edges[0]?.cursor : undefined,
				endCursor: edges.length > 0 ? edges[edges.length - 1]?.cursor : undefined,
			},
		};
	}
}
