import { EmailTemplateSender } from '../src/services/email/emailTemplateSender';
import { NodeMailerClient } from '../src/services/email/emailClient'; // Import your actual NodeMailerClient class
import { expect } from 'chai';
import sinon from 'sinon';


describe('EmailTemplateSender', () => {
    let emailSender: EmailTemplateSender;
    let mockMailClient: sinon.SinonStubbedInstance<NodeMailerClient>;

    beforeEach(() => {
        // Create a stub instance of NodeMailerClient
        mockMailClient = sinon.createStubInstance(NodeMailerClient);
        emailSender = new EmailTemplateSender(mockMailClient as any);
    });

    afterEach(() => {
        sinon.restore(); // Restore the original functionality
    });

    it('should send an email using the draft template', async () => {
        const emailData = {
            recipient: 'test@example.com',
            parameters: {
                softwareName: 'TestSoftware',
                draftLink: 'http://example.com/draft',
                expireDate: '2023-12-31'
            }
        };

        await emailSender.sendEmail('draft', emailData);

        expect(mockMailClient.sendMail.calledOnce).to.be.true;
        const args = mockMailClient.sendMail.getCall(0).args[0];
        expect(args).to.include({
            to: 'test@example.com',
            subject: 'GovStack Compliance Draft for TestSoftware'
        });
        expect(args.text).to.include('http://example.com/draft');
    });

    it('should send an email using the submit template', async () => {
        const emailData = {
            recipient: 'submit@example.com',
            parameters: {
                softwareName: 'SubmitSoftware',
                jiraLink: 'http://jira.example.com'
            }
        };

        await emailSender.sendEmail('submit', emailData);

        expect(mockMailClient.sendMail.calledOnce).to.be.true;
        const args = mockMailClient.sendMail.getCall(0).args[0];
        expect(args).to.include({
            to: 'submit@example.com',
            subject: 'Confirmation of Compliance Form Submission for SubmitSoftware'
        });
        expect(args.text).to.include('http://jira.example.com');
    });

    it('should throw an error if the template is not found', async () => {
        const emailData = {
            recipient: 'error@example.com',
            parameters: {}
        };

        try {
            await emailSender.sendEmail('nonexistent', emailData);
            expect.fail('Expected error was not thrown');
        } catch (error) {
            const typedError = error as Error; // Type assertion
            expect(typedError.message).to.equal('Template nonexistent not found');
        }
    });
});
