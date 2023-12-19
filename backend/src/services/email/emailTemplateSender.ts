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
        this.templates.set('draftSubmitted', this.draftTemplate);
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
            subject: `GovStack Compliance Draft for ${data.parameters['softwareName'] || '[Software]'}`,
            body: 
`Hello,

Thank you for starting a new compliance draft for ${data.parameters['softwareName'] || '[Software]'}. You can edit and finalize your draft by following this unique link: 

   ${data.parameters['draftLink'] || '[Error]'}.

This link will remain active for editing until you submit your form or until the draft expiration date of ${data.parameters['expireDate'] || '[Undefined]'}.

Regards,

GovStack Team`
        };
    }

    private submitTemplate(data: EmailTemplateData): Template {
        return {
            subject: `Confirmation of Compliance Form Submission for ${data.parameters['softwareName'] || '[Software]'}`,
            body: 
`Hello,

Your compliance form for ${data.parameters['softwareName'] || '[Software]'} has been successfully submitted. We will review it and notify you of the results. You can track the progress on Jira: ${data.parameters['jiraLink'] || '[Link]'}.

Thank you for submitting the ${data.parameters['softwareName'] || '[Software]'} form!

Regards,
GovStack Team
`
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

