import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { FilesService } from 'src/files/files.service';
import { AfterHookParamsWithFiles } from 'src/qnatk/src';
import { BaseHook } from 'src/qnatk/src/hooks/base-hook';
import { Plan } from 'src/model/Client/Plan';

@Injectable()
export class SaveImageUrlForPlanCreate extends BaseHook {
  priority = 3;

  constructor(private fileService: FilesService) {
    super();
  }

  async execute(
    previousData: AfterHookParamsWithFiles<Plan, any>,
    transaction: Transaction,
  ): Promise<AfterHookParamsWithFiles<Plan, any>> {
    console.log('previousData.files', previousData.files);
    console.log('previousData.files 1 ', previousData.files[0]);
    // throw new Error('test');
    const photoFilePath = await this.fileService.uploadFile(
      `uploads/Plan_${previousData.modelInstance.id}`,
      'plan_image_url',
      previousData.files[0],
    );

    previousData.modelInstance.plan_image_url = photoFilePath;
    await previousData.modelInstance.save({ transaction });

    return previousData;
  }
}
