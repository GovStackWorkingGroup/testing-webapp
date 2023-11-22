import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SoftwareComplianceForm from '../../../components/form/SoftwareComplianceForm';
import { getDraftDetails } from '../../../service/serviceAPI';
import { SoftwareDraftDetailsType } from '../../../service/types';

const SoftwareComplianceDraftWithUUID = () => {
  const [draftDetail, setDraftDetail] = useState<
    SoftwareDraftDetailsType | undefined
  >();
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
      fetchData(draftUUID as string);
    }
  }, [draftUUID]);

  return <SoftwareComplianceForm savedDraftDetail={draftDetail} />;
};

export default SoftwareComplianceDraftWithUUID;
