import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/features/auth/api/authApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthState } from '@/features/auth/slices/authSlice';
import { useSelector } from 'react-redux';

const useCurrentUserQuery = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const { isSuccess, data: result } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: authState.user === null,
  })

  useEffect(() => {
    if (isSuccess) {
      console.log("success:", result.data.data)
      dispatch(setAuthState(result.data.data));
    }
  }, [isSuccess]);

  return null;
}

export default useCurrentUserQuery;
