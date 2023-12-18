import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

type SMTPConfig = {
    host: string,
    port: number,
    secure: boolean,
    auth: {
        user: string,
        pass: string
    }
}


export class NodeMailerClient {
    private transporter: Transporter;

    constructor(smtpConfig: nodemailer.SmtpOptions) {
        this.transporter = nodemailer.createTransport(smtpConfig);
    }

    async sendMail(mailOptions: SendMailOptions): Promise<void> {
        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }    
    }
}
