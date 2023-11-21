import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SoftwareComplianceForm from '../../../components/form/SoftwareComplianceForm';
import { getDraftDetails } from '../../../service/serviceAPI';

const SoftwareComplianceDraftWithUUID = () => {
  const [draftDetail, setDraftDetail] = useState();
  const router = useRouter();
  const { draftUUID } = router.query;

  const fetchData = async (draftUUID: string) => {
    const data = await getDraftDetails(draftUUID);
    if (data.status) {
      setDraftDetail(data.data);
    }
  };

  useEffect(() => {
    if (draftUUID) {
      // fetchData(draftUUID)
    }
  }, [draftUUID]);

  return <SoftwareComplianceForm />;
};

export default SoftwareComplianceDraftWithUUID;
