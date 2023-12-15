import { NodeMailerClient } from './emailClient';
import { appConfig } from '../../config';

type EmailTemplateData = {
    recipient: string;

    parameters: { [key: string]: string };
};

type Template = {
    subject: string;
    body: string;
}

export class EmailTemplateSender {
    private mailClient: NodeMailerClient;
    private templates: Map<string, (data: EmailTemplateData) => Template>;

    constructor(mailClient: NodeMailerClient) {
        this.mailClient = mailClient;
        this.templates = new Map<string, (data: EmailTemplateData) => Template>();
        
        // Initialize templates
        this.templates.set('draft', this.draftTemplate);
        this.templates.set('submit', this.submitTemplate);
        // Add more templates as needed
    }

    async sendEmail(templateKey: string, data: EmailTemplateData): Promise<void> {
        if (!this.templates.has(templateKey)) {
            throw new Error(`Template ${templateKey} not found`);
        }
        const template = this.templates.get(templateKey);
        if (template) {
            const mailContent = this.processTemplate(template, data);
            await this.mailClient.sendMail({
                from: 'no-reply@example.com',
                to: data.recipient,
                subject: mailContent.subject,
                text: mailContent.body
            });
        }
    }
    private draftTemplate(data: EmailTemplateData): Template {
        return {
            subject: `Header`,
            body: `Dear ${data.parameters['name'] || 'User'},
            Your Draft Was Created: ${data.parameters['username']}.`
        };
    }

    private submitTemplate(data: EmailTemplateData): Template {
        return {
            subject: `Header`,
            body: `Dear ${data.parameters['name'] || 'User'},
            Your Draft Was Created: ${data.parameters['username']}.`
        };
    }

    private processTemplate(template: (data: EmailTemplateData) => Template, data: EmailTemplateData): Template {
        let {subject, body} = template(data);
        Object.keys(data.parameters).forEach(key => {
            subject = subject.replace(new RegExp(`\\$\{${key}\}`, 'g'), data.parameters[key]);
            body = body.replace(new RegExp(`\\$\{${key}\}`, 'g'), data.parameters[key]);
        });
        return {
            body, 
            subject,
        };
    }

}
/**
 * Usage Example:
 * 
 * const smtpConfig = {
 *     host: 'smtp.example.com',
 *     port: 587,
 *     secure: false,
 *     auth: {
 *         user: 'user@example.com',
 *         pass: 'password'
 *     }
 * };
 * 
 * const mailClient = nodemailer.createTransport(smtpConfig);
 * const emailSender = new EmailTemplateSender(mailClient);
 * 
 * const emailData: EmailTemplateData = {
 *     recipient: 'recipient@example.com',
 *     subject: 'Welcome to Our Service!',
 *     parameters: {
 *         name: 'John Doe',
 *         username: 'john.doe'
 *     }
 * };
 * 
 * this.emailSender.sendEmail('templateKey', {
 *     'recipient': 'email@example.com,
 *     'parameters': {'softwareName': softwareName}
 *  }).then(() => console.log('Email sent using customized template'))
 *     .catch(error => console.error('Error sending email:', error));
 */

export function defaultEmailSender(): EmailTemplateSender {
    return new EmailTemplateSender(new NodeMailerClient(appConfig.smtpConfig))
}

