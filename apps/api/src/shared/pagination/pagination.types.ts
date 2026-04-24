import {Type} from "@nestjs/common";
import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";
import {Max, Min} from "class-validator";

@InputType()
export class PaginationArgs {
    @Field(() => Int, {nullable: true, defaultValue: 10})
    @Min(1)
    @Max(100)
    first?: number;

    @Field(() => String, {nullable: true})
    after?: string;
}

@ObjectType("PageInfo")
export class PageInfo {
    @Field(() => Boolean)
    hasNextPage!: boolean;

    @Field(() => Boolean)
    hasPreviousPage!: boolean;

    @Field(() => String, {nullable: true})
    startCursor?: string;

    @Field(() => String, {nullable: true})
    endCursor?: string;
}

export interface IPaginatedType<T> {
    edges: { cursor: string; node: T }[];
    nodes: T[];
    totalCount: number;
    pageInfo: PageInfo;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
    @ObjectType(`${classRef.name}Edge`)
    abstract class EdgeType {
        @Field(() => String)
        cursor!: string;

        @Field(() => classRef)
        node!: T;
    }

    @ObjectType({isAbstract: true})
    abstract class PaginatedType implements IPaginatedType<T> {
        @Field(() => [EdgeType], {nullable: true})
        edges!: EdgeType[];

        @Field(() => [classRef], {nullable: true})
        nodes!: T[];

        @Field(() => Int)
        totalCount!: number;

        @Field(() => PageInfo)
        pageInfo!: PageInfo;
    }

    return PaginatedType as Type<IPaginatedType<T>>;
}
