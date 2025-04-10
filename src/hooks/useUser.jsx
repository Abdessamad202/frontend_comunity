import { useQuery } from '@tanstack/react-query';
import { getUser } from '../apis/apiCalls';

const useUser = () => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'], // Using the same key for the cache
    queryFn: getUser,
    staleTime: 5 * 60 * 1000, // Cache valid for 5 minutes
    retry: 2,
  });
  return {
    user,
    isLoading,
    error,
  };
};

export default useUser;
