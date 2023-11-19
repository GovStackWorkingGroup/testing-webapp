import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SoftwareComplianceForm from '../../../components/form/SoftwareComlianceForm';

const SoftwareComplianceDraftWithUUID = () => {
  const router = useRouter();
  const { draftUUID } = router.query;

  useEffect(() => {
    if (draftUUID) {
      // get from BE and pass to SoftwareComplianceForm
    }
  }, [draftUUID]);

  return <SoftwareComplianceForm />;
};

export default SoftwareComplianceDraftWithUUID;
