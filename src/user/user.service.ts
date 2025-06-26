import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor (
        @InjectRepository(User)
        private repUser: Repository<User>
    ){}

    getAll():Promise<User[]>{ {
        return this.repUser.find();
    }
}
}