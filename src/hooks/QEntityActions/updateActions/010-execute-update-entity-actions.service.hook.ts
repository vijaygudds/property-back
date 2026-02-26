import { Injectable } from '@nestjs/common';
import { BaseHook } from 'src/qnatk/src/hooks/base-hook';
import { ActionExecuteParams } from '../../../qnatk/src';
import QEntityActions from '../../../qnatk/src/models/QEntityActions';
import { UserDTO } from '../../../dto/user-token.dto';
import { Transaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { ModelActions } from '../../../model-actions';
import QRolePermissions from '../../../qnatk/src/models/QRolePermissions';

@Injectable()
export class UpdateEntityActions extends BaseHook {
    priority = 1;
    // AccountArray = defaultSchemeAccounts.SavingSchemeDefaultAccounts;

    constructor(
        @InjectModel(QEntityActions)
        private qEntityActionsModel: typeof QEntityActions,
        @InjectModel(QRolePermissions)
        private qRolePermissionsModel: typeof QRolePermissions,
    ) {
        super();
    }

    async execute(
        previousData: ActionExecuteParams<QEntityActions, null, UserDTO>,
        transaction: Transaction,
    ): Promise<ActionExecuteParams<QEntityActions, null, UserDTO>> {
        const modelActions = ModelActions;

        const allModelActions = this.flattenModelActions(modelActions);
        const existingActions = await this.qEntityActionsModel.findAll({
            transaction,
        });

        const actionsToDelete = this.getActionsToDelete(
            existingActions,
            allModelActions,
        );
        await this.deleteActions(actionsToDelete, transaction);

        await this.syncActions(allModelActions, transaction);

        return previousData;
    }

    private flattenModelActions(modelActions): any[] {
        const flattenedActions = [];
        for (const baseModel in modelActions) {
            const actions = modelActions[baseModel];
            for (const actionName in actions) {
                if (actions[actionName].hideInAcl) continue;
                flattenedActions.push({
                    BaseModel: baseModel,
                    Action: actionName,
                });
            }
        }
        return flattenedActions;
    }

    private getActionsToDelete(existingActions, allModelActions): number[] {
        return existingActions
            .filter(
                (qEntityAction) =>
                    !allModelActions.some(
                        (action) =>
                            action.BaseModel === qEntityAction.BaseModel &&
                            action.Action === qEntityAction.Action,
                    ),
            )
            .map((qEntityAction) => qEntityAction.id);
    }

    private async deleteActions(
        actionsToDelete: number[],
        transaction: Transaction,
    ): Promise<void> {
        if (actionsToDelete.length > 0) {
            await this.qRolePermissionsModel.destroy({
                where: { entity_action_id: actionsToDelete },
                transaction,
            });

            await this.qEntityActionsModel.destroy({
                where: { id: actionsToDelete },
                transaction,
            });
        }
    }

    private async syncActions(
        allModelActions,
        transaction: Transaction,
    ): Promise<void> {
        for (const action of allModelActions) {
            const existingAction = await this.qEntityActionsModel.findOne({
                where: {
                    BaseModel: action.BaseModel,
                    Action: action.Action,
                },
                transaction,
            });

            if (existingAction) {
                // Update existing action
                await existingAction.update(action, { transaction });
            } else {
                // Create new action
                await this.qEntityActionsModel.create(action, { transaction });
            }
        }
    }
}
