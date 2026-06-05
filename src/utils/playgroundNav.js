import { savePlaygroundReturn } from '../constants/playground';

export function navigateToPlayground(navigate, returnPath, targetPath = '/playground/products', extraState = {}) {
  savePlaygroundReturn(returnPath);
  navigate(targetPath, { state: { returnTo: returnPath, ...extraState } });
}
