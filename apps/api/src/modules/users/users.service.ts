import {Injectable} from '@nestjs/common';
import {UsersRepository} from "@/modules/users/users.repository";
import {PaginationArgs, PaginationService} from "@/shared/pagination";

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly paginationService: PaginationService
    ) {
    }

    findAll() {
        return this.usersRepository.findAll();
    }

    findById(id: string) {
        return this.usersRepository.findById(id);
    }

    findByIds(ids: readonly string[]) {
        return this.usersRepository.findByIds(ids);
    }

    findAllPaginated(paginationArgs: PaginationArgs) {
        const qb = this.usersRepository.createQueryBuilder('user');
        return this.paginationService.paginate(qb, paginationArgs);
    }
}
