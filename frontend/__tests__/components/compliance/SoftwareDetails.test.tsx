import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import SoftwareDetails from '../../../components/compliance/SoftwareDetails';
import { handleDeleteSoftwareForm } from '../../../service/serviceAPI';
import { COMPLIANCE_TESTING_RESULT_PAGE } from '../../../service/constants';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('../../../service/serviceAPI', () => ({
  handleDeleteSoftwareForm: jest.fn(),
}));
jest.mock('../../../hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    format: (key: string) => key,
  }),
}));

describe('SoftwareDetails component', () => {
  const mockRouter = {
    query: { draftUUID: '123', softwareName: 'TestSoftware' },
    replace: jest.fn(),
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with basic props', () => {
    render(
      <SoftwareDetails title="Test Title">
        <div>Test Content</div>
      </SoftwareDetails>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders edit button when editButton prop is true', () => {
    render(
      <SoftwareDetails title="Test Title" editButton={true} redirectToStep={2}>
        <div>Test Content</div>
      </SoftwareDetails>
    );

    const editButton = screen.getByText('app.edit.label');
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);
    expect(mockRouter.replace).toHaveBeenCalledWith({
      query: { draftUUID: '123', formStep: 2 },
    });
  });

  it('renders compliance section with delete and view report buttons', () => {
    render(
      <SoftwareDetails
        title="Test Title"
        complianceSection={true}
        softwareVersion="1.0"
        softwareId="456"
        viewReportDetails={true}
      >
        <div>Test Content</div>
      </SoftwareDetails>
    );

    expect(screen.getByText('form.software_delete.label')).toBeInTheDocument();
    expect(screen.getByText('app.view_report_details.label')).toBeInTheDocument();
    expect(screen.getByText('table.software_name.label 1.0')).toBeInTheDocument();
  });

  it('handles software deletion', async () => {
    (handleDeleteSoftwareForm as jest.Mock).mockResolvedValue({ status: true });

    render(
      <SoftwareDetails
        title="Test Title"
        complianceSection={true}
        softwareId="456"
      >
        <div>Test Content</div>
      </SoftwareDetails>
    );

    fireEvent.click(screen.getByText('form.software_delete.label'));
    expect(screen.getByText('software_details.delete_confirm_modal.title')).toBeInTheDocument();

    fireEvent.click(screen.getByText('software_details.delete_confirm_modal.delete'));

    await waitFor(() => {
      expect(handleDeleteSoftwareForm).toHaveBeenCalledWith('456');
      expect(toast.success).toHaveBeenCalledWith('form.form_deleted_success.message', expect.any(Object));
      expect(mockRouter.push).toHaveBeenCalledWith(COMPLIANCE_TESTING_RESULT_PAGE);
    });
  });

  it('handles software deletion error', async () => {
    (handleDeleteSoftwareForm as jest.Mock).mockResolvedValue({ status: false });

    render(
      <SoftwareDetails
        title="Test Title"
        complianceSection={true}
        softwareId="456"
      >
        <div>Test Content</div>
      </SoftwareDetails>
    );

    fireEvent.click(screen.getByText('form.software_delete.label'));
    fireEvent.click(screen.getByText('software_details.delete_confirm_modal.delete'));

    await waitFor(() => {
      expect(handleDeleteSoftwareForm).toHaveBeenCalledWith('456');
      expect(toast.error).toHaveBeenCalledWith('form.form_deleted_error.message', expect.any(Object));
    });
  });

  it('closes delete confirmation modal when cancel is clicked', () => {
    render(
      <SoftwareDetails
        title="Test Title"
        complianceSection={true}
        softwareId="456"
      >
        <div>Test Content</div>
      </SoftwareDetails>
    );

    fireEvent.click(screen.getByText('form.software_delete.label'));
    expect(screen.getByText('software_details.delete_confirm_modal.title')).toBeInTheDocument();

    fireEvent.click(screen.getByText('software_details.delete_confirm_modal.cancel'));
    expect(screen.queryByText('software_details.delete_confirm_modal.title')).not.toBeInTheDocument();
  });
});
