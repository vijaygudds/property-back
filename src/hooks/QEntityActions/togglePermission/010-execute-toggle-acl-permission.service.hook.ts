import { Injectable } from '@nestjs/common';
import { BaseHook } from 'src/qnatk/src/hooks/base-hook';
import { ActionExecuteParams } from '../../../qnatk/src';
import QEntityActions from '../../../qnatk/src/models/QEntityActions';
import { TogglePermissionDTO } from './toggle-permission.dto';
import { UserDTO } from '../../../dto/user-token.dto';
import { Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import QRolePermissions from '../../../qnatk/src/models/QRolePermissions';

@Injectable()
export class TogglePermissionACL extends BaseHook {
    priority = 1;
    // AccountArray = defaultSchemeAccounts.SavingSchemeDefaultAccounts;

    constructor(
        @InjectModel(QRolePermissions)
        private qRolePermissionsModel: typeof QRolePermissions,
    ) {
        super();
    }

    async execute(
        previousData: ActionExecuteParams<
            QEntityActions,
            TogglePermissionDTO,
            UserDTO
        >,
        transaction: Transaction,
    ): Promise<
        ActionExecuteParams<QEntityActions, TogglePermissionDTO, UserDTO>
    > {
        const existingRecord = await this.qRolePermissionsModel.findOne({
            where: {
                entity_action_id: previousData.data.id,
                role_id: previousData.data.role_id,
            },
            transaction,
        });
        if (!existingRecord) {
            await this.qRolePermissionsModel.create(
                {
                    entity_action_id: previousData.data.id,
                    role_id: previousData.data.role_id,
                    status: previousData.data.toChangeValue,
                },
                { transaction },
            );
        } else {
            await this.qRolePermissionsModel.update(
                {
                    status: previousData.data.toChangeValue,
                },
                {
                    where: {
                        entity_action_id: previousData.data.id,
                        role_id: previousData.data.role_id,
                    },
                    transaction,
                },
            );
        }
        return previousData;
    }
}
