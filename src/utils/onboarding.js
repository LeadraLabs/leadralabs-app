import { ApiError } from '../hooks/useApi';

export async function needsOnboarding(getProfile) {
  try {
    const profile = await getProfile();
    return !profile?.primary_capability;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return true;
    return false;
  }
}
