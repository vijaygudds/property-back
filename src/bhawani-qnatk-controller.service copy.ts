import { Injectable, Inject } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { BhawaniQnatkService } from './bhawani-qnatk.service';
import {
    ActionListDTO,
    HooksService,
    QnatkControllerService,
} from './qnatk/src';
import { Transaction } from 'sequelize';
import { UserDTO as OriginalUserDTO } from './dto/user-token.dto';

@Injectable()
export class BhawaniQnatkControllerService extends QnatkControllerService {
    constructor(
        protected readonly qnatkService: BhawaniQnatkService, // Assuming QnatkService is injectable and used in the base class
        protected readonly hooksService: HooksService, // Assuming HooksService is injectable and used in the base class
        @InjectConnection('default') protected sequelize: Sequelize, // Injecting named connection
        @Inject('MODEL_ACTIONS') protected modelActions: ActionListDTO, // Assuming this is a dependency of your base class
    ) {
        super(qnatkService, hooksService, sequelize, modelActions);
    }

    async addNew<UserDTO = any>(
        baseModel: string,
        data: any,
        user: UserDTO,
        transaction?: Transaction,
    ) {
        data.createdAt = (user as OriginalUserDTO).workingDate.toString(false);
        data.created_at = (user as OriginalUserDTO).workingDate.toString(false);
        return super.addNew<UserDTO>(baseModel, data, user, transaction);
    }

    async addNewWithFile<UserDTO = any>(
        baseModel: string,
        data: any,
        files: Array<Express.Multer.File>,
        user: UserDTO,
        transaction?: Transaction, // Add an optional transaction parameter
    ) {
        data.createdAt = (user as OriginalUserDTO).workingDate.toString(false);
        data.created_at = (user as OriginalUserDTO).workingDate.toString(false);
        return super.addNewWithFile<UserDTO>(
            baseModel,
            data,
            files,
            user,
            transaction,
        );
    }
}
