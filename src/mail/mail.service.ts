import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'marcis2023vlad@gmail.com',
                pass: 'ulby cxiu pcrr nqww',
            },
        });
    }

    async sendActivationMail(to: string, link: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: 'marcis2023vlad@gmail.com',
                to,
                subject: 'Активація аккаунта на сайті',
                html: `
                    <div>
                        <h1>Для активації перейдіть за посиланням</h1>
                        <a href=${link}>Click here to activate</a>
                    </div>
                `,
            });
            console.log('Лист успішно відправлено!');
        } catch (error) {
            console.error('Помилка при відправці листа:', error);
        }
    }
}
