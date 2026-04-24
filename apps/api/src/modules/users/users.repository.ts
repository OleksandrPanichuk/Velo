import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Repository} from "typeorm";
import {UserModel} from "@/models/User.model";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(UserModel)
        private readonly repo: Repository<UserModel>,
    ) {
    }

    findAll() {
        return this.repo.find();
    }

    findById(id: string) {
        return this.repo.findOne({where: {id}});
    }

    findByIds(ids: readonly string[]) {
        return this.repo.find({where: {id: In(ids)}});
    }

    createQueryBuilder(alias: string) {
        return this.repo.createQueryBuilder(alias);
    }
}
