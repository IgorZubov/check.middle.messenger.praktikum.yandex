export async function resolve(specifier, context, next) {
  const nextResult = await next(specifier, context);

  if (!specifier.endsWith(".scss")) {
    return nextResult;
  }

  return {
    url: nextResult.url,
    format: "scss",
    shortCircuit: true,
  };
}

export async function load(url, context, next) {
  if (context.format !== "scss") {
    return await next(url, context);
  }

  return {
    format: "module",
    shortCircuit: true,
    source: "",
  };
}
