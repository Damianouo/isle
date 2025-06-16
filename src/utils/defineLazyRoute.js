export const defineLazyRoute =
  (componentPromise, loaderPromise = Promise.resolve({}), actionPromise = Promise.resolve({})) =>
  async () => {
    const [componentModule, loaderModule, actionModule] = await Promise.all([
      componentPromise,
      loaderPromise,
      actionPromise,
    ]);
    const routeExports = {
      Component: componentModule.default,
    };

    if (loaderModule && typeof loaderModule.loader !== "undefined") {
      routeExports.loader = loaderModule.loader;
    }
    if (actionModule && typeof actionModule.action !== "undefined") {
      routeExports.action = actionModule.action;
    }

    return routeExports;
  };
