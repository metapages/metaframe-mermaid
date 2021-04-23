import { useCallback, useEffect, useState } from "preact/hooks";

// type HashParams = {[key in string]:string|undefined};
/**
 * Hook for getting/setting hash params
 */
export const useHashParam = (key: string):[string|undefined,(v:string|undefined)=>void] => {
  const [hashParam, setHashParamInternal] = useState<string | undefined>(
    getHashParams()[key]
  );

  useEffect(() => {
    const onHashChange = (_: HashChangeEvent) => {
      const paramHash = getHashParams();
      setHashParamInternal(paramHash[key]);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const setParam :(v:string|undefined)=>void = useCallback((value: string | undefined) => {
    const paramHash = getHashParams();

    let changed = false;
    if (
      (paramHash.hasOwnProperty(key) && value === null) ||
      value === undefined
    ) {
      delete paramHash[key];
      changed = true;
    } else {
      if (paramHash[key] !== value) {
        paramHash[key] = value;
        changed = true;
      }
    }

    // don't do work if unneeded
    if (!changed) {
      return [];
    }

    const keys = Object.keys(paramHash);
    keys.sort();
    const hash = keys
      .map((key, i) => {
        return `${key}=${paramHash[key]}`;
      })
      .join("&");
    window.location.hash = hash;
  }, []);

  return [hashParam, setParam];
};

const getHashParams = () =>
  Object.fromEntries(
    window.location.hash
      .substr(1)
      .split("&")
      .filter((s) => s.length > 0)
      .map((s) => s.split("="))
  );


//   const { useState, useEffect, useCallback } = require('react');

// const getHashSearchParams = (location) => {
//   const hash = location.hash.slice(1);
//   const [prefix, query] = hash.split('?');

//   return [prefix, new URLSearchParams(query)];
// };

// const getHashParam = (key, location = window.location) => {
//   const [_, searchParams] = getHashSearchParams(location);
//   return searchParams.get(key);
// };

// const setHashParam = (key, value, location = window.location) => {
//   const [prefix, searchParams] = getHashSearchParams(location);

//   if (typeof value === 'undefined' || value === '') {
//     searchParams.delete(key);
//   } else {
//     searchParams.set(key, value);
//   }

//   const search = searchParams.toString();
//   location.hash = search ? `${prefix}?${search}` : prefix;
// };

// const useHashParam = (key, defaultValue) => {
//   const [innerValue, setInnerValue] = useState(getHashParam(key));

//   useEffect(() => {
//     const handleHashChange = () => setInnerValue(getHashParam(key));
//     window.addEventListener('hashchange', handleHashChange);
//     return () => window.removeEventListener('hashchange', handleHashChange);
//   }, [key]);

//   const setValue = useCallback((value) => {
//     if (typeof value === 'function') {
//       setHashParam(key, value(getHashParam(key)));
//     } else {
//       setHashParam(key, value);
//     }
//   }, [key]);

//   return [innerValue || defaultValue, setValue];
// };
// module.exports = useHashParam;
