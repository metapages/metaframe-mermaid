import { useCallback, useEffect, useState } from "preact/hooks"
import { useHashParam } from "./useHashParam"

/**
 * Hook for getting/setting hash params
 */
export const useHashParamJson = <T,>(key:string):[T|undefined,(v:T|undefined)=>void] => {
  const [hashParamString, setHashParamString] = useHashParam(key);
  // const s :string|undefined = hashParamString;
  // console.log('setHashParamString', setHashParamString);
  const [hashBlob, setHashBlob] = useState<T>(blobFromBase64String(hashParamString));

  // if the hash string value changes
  useEffect(() => {
    setHashBlob(blobFromBase64String(hashParamString))
  }, [key, hashParamString, setHashBlob]);


  const setJsonBlob = useCallback((blob:T|undefined) => {
    if (blob === null || blob === undefined) {
      setHashParamString(undefined);
    } else {
      const base64Json = btoa(JSON.stringify(blob));
      setHashParamString(base64Json);
    }
  }, [setHashParamString]);

  return [hashBlob, setJsonBlob];
};


const blobFromBase64String = (value :string|undefined) => {
  if (value && value.length > 0) {
    try {
      const blob = JSON.parse(atob(value));
      return blob;
    } catch(err) {
      console.error(err);
    }
  }
  return undefined;
}
