import { RouteProp, useRoute } from '@react-navigation/native';
import { HistoryStackParamList } from '@/navigation/types';

export const useHistoryDetailContent = () => {
  const route = useRoute<RouteProp<HistoryStackParamList, 'HistoryDetail'>>();
  const { recordId } = route.params;

  return {
    recordId,
  };
};
