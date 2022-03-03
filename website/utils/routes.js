import qs from 'qs';

import { ROUTES_LIST } from '../constants/routes';

export const alphabeticCompare = (aString, otherString) => aString.localeCompare(otherString) === 0;

export const routeCompare = (route, pathname) => {
  const routePath = route?.split('/');
  const pathnamePath = pathname?.split('/');

  return routePath?.every(
    (routePathPart, index) =>
      alphabeticCompare(routePathPart, pathnamePath[index]) || routePathPart.includes(':')
  );
};

export const getActualRoute = () =>
  ROUTES_LIST.find((route) => routeCompare(route.pagePath, window?.location?.pathname));

export const getQueryString = (queryObject) =>
  qs.stringify(queryObject, { addQueryPrefix: true, indices: false });
