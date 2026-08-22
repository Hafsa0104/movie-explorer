import { useEffect } from 'react';

const SITE_NAME = 'Movie Explorer';

export function useDocumentTitle(pageTitle?: string): void {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} — ${SITE_NAME}` : SITE_NAME;
  }, [pageTitle]);
}