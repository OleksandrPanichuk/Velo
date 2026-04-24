import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModel} from "@/models/User.model";
import {UsersRepository} from "@/modules/users/users.repository";
import {UsersService} from "@/modules/users/users.service";
import {UsersResolver} from "@/modules/users/users.resolver";
import {UsersLoader} from "@/modules/users/users.loader";

@Module({
    imports: [TypeOrmModule.forFeature([UserModel])],
    providers: [UsersResolver, UsersService, UsersRepository, UsersLoader],
    exports: [UsersService, UsersLoader]
})
export class UsersModule {
}
