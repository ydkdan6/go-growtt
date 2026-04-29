import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfileApi, updateUserImageApi } from "../../api/general.api";
import { userKeys } from "@/config/queryKeys";
import { getStoredUserId } from "./useUserDetails";

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: (payload: { full_name?: string; phone_number?: string; address?: string }) =>
      updateUserProfileApi(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
};

export const useUpdateProfileImage = () => {
  const qc = useQueryClient();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: (file: File) => updateUserImageApi(userId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.detail(userId) });
    },
  });
};
