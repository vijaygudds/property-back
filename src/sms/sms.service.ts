import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs'; // Assuming you're using ConfigModule for configuration
import { InjectModel } from '@nestjs/sequelize';
// import { Member } from 'src/models/Member';
import { send } from 'process';

@Injectable()
export class SmsService {
  constructor(
    // @InjectModel(Member) private memberModel: typeof Member,
    private httpService: HttpService,
    private configService: ConfigService, // Use ConfigService to access application config
  ) {}

  async sendMessage(
    no: string,
    msg: string,
    templateId: string,
    apiRequest: string = 'Text', // Default value "Text"
  ): Promise<any> {
    const sendSms = this.configService.get<'true' | 'false'>(
      'SEND_SMS',
      'false',
    );
    // Remove extra spaces, commas, and special characters except digits and '+'
    no = no.replace(/[^\d+]/g, '').trim();
    if (sendSms !== 'true') {
      console.log(`${no} ${msg}`);
      return `${no} ${msg}<br/>`; // Just for demonstration, in real scenario you might not want to return this.
    }

    const msgEncoded = encodeURIComponent(msg);
    const user = this.configService.get<string>('SMS_USER');
    const senderId = this.configService.get<string>('SMS_SENDER_ID');
    const apiKey = this.configService.get<string>('SMS_API_KEY');

    console.log('msgEncoded >>>>.', msgEncoded);
    console.log('user..... ', user);
    console.log('senderID..... ', senderId);
    console.log('apiKey..... ', apiKey);
    console.log('templateId..... ', templateId);
    console.log('apiRequest..... ', apiRequest);
    // throw new Error('Invalid');
    // const url = `http://cloud.smsindiahub.in/vendorsms/pushsms.aspx?user=${user}&password=${password}&msisdn=${no}&sid=${senderId}&msg=${msgEncoded}&fl=0&gwid=2`;
    const url = `http://sms.stewindia.com/sms-panel/api/http/index.php?username=${user}&apikey=${apiKey}&apirequest=${apiRequest}&sender=${senderId}&mobile=${no}&message=${msgEncoded}&route=TRANS&TemplateID=${templateId}&format=JSON`;
    console.log('url===.....>>>> ', url);
    // Using HttpService to make the GET request
    // throw new Error('Invalid');
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      console.log('SMS response received', response.data);
      return response.data; // Or handle the response as needed
    } catch (error) {
      // Handle error
      console.error(error);
      // throw new Error('Failed to send SMS');
    }
  }

  // async sendMessageToMember(
  //     memberId: number,
  //     msg: string,
  //     templateId: string,
  //     apiRequest: string = 'Text', // Default value "Text"
  // ): Promise<any> {
  //     const member = await this.memberModel.findOne({
  //         where: { id: memberId },
  //     });
  //     if (member) {
  //         const mobileNo = member.PhoneNos.split(',')[0];

  //         const sms = this.sendMessage(mobileNo, msg, templateId, apiRequest);
  //         // console.log('sms APu ', sms);
  //         // throw new Error('sms ');
  //         return sms;
  //     } else {
  //         throw new Error('Member not found');
  //     }
  // }
}
