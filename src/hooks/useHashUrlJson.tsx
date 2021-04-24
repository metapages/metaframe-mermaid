import { useCallback, useEffect, useState } from "preact/hooks";

/**
 * Hook for getting/setting a base64 encoded JSON value in the # hash part of a URL
 */
export const useHashUrlJson = <T,>() => {
  const [jsonBlob, setJsonBlobInternal] = useState<T|undefined>(undefined);
  useEffect(() => {
    const onHashChange = (_: HashChangeEvent) => {
      let hashString :string|undefined = window.location.hash;
      if (hashString && hashString.startsWith('#')) {
        hashString = hashString.substr(1);
      }
      if (hashString && hashString.startsWith('/')) {
        hashString = hashString.substr(1);
      }

      let blob:any;
      if (hashString) {
        try {
          blob = JSON.parse(atob(hashString));
          setJsonBlobInternal(blob);
        } catch(err) {
          console.error(err);
          setJsonBlobInternal(undefined);
        }
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setJsonBlob = useCallback((blob:T|undefined) => {
    if (blob === null || blob === undefined) {
      window.location.hash = '#';
    } else {
      const hashBase64Json = btoa(JSON.stringify(blob));
      window.location.hash = `#${hashBase64Json}`;
    }
  }, []);

  return [jsonBlob, setJsonBlob]
};
