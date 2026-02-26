import { Injectable } from '@nestjs/common';

import {
  BeforeActionExecuteParams,
  BeforeHookParamsWithFiles,
} from 'src/qnatk/src/dto/Hooks.dto';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { FilesService } from 'src/files/files.service';
import { InjectModel } from '@nestjs/sequelize';
import { BaseHook } from 'src/qnatk/src/hooks/base-hook';
import { Plan } from 'src/model/Client/Plan';
import { UserDTO } from 'src/dto/user-token.dto';

@Injectable()
export class BeforeUpdateImageRemoveExistingImageOnThisCurrentAccount extends BaseHook {
  priority = 1;

  constructor(
    private sequelize: Sequelize,
    private fileService: FilesService,
    @InjectModel(Plan)
    private planModel: typeof Plan,
  ) {
    super();
  }

  async execute(
    previousData: BeforeHookParamsWithFiles<Plan, UserDTO>,
    transaction: Transaction,
  ) {
    console.log('Plan Before Edit', previousData.modelInstance);
    throw new Error('plan before edit');
    return previousData;
    // transactions: accountTransactions,
  }
}
