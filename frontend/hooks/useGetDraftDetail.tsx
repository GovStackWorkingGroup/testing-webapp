import { useEffect, useState } from 'react';
import { getDraftDetails } from '../service/serviceAPI';
import { SoftwareDraftDetailsType } from '../service/types';

type useGetDraftDataType = {
  draftUUID: undefined | string;
};

const useGetDraftData = ({ draftUUID }: useGetDraftDataType) => {
  const [draftData, setDraftData] = useState<
    SoftwareDraftDetailsType | undefined
  >(undefined);

  useEffect(() => {
    if (draftUUID) {
      fetchData(draftUUID);
    }
  }, [draftUUID]);

  const fetchData = async (draftUUID: string) => {
    const data = await getDraftDetails(draftUUID);
    if (data.status) {
      setDraftData(data.data);
    }
  };

  return { draftData };
};

export default useGetDraftData;
