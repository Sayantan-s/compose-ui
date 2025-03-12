const validateFiles = (files: File[], accept: string, maxSize?: number) =>
  Array.from(files).filter((file) => {
    if (maxSize && file.size > maxSize)
      return [`File ${file.name} exceeds size limit.`, false];

    if (accept && !accept.split(",").includes(file.type))
      return [`File ${file.name} is not a valid type.`, false];

    return [null, true];
  });
