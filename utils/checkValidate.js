export const checkIfEmpty = (requestBody) => {
    const values = Object.values(requestBody);
    let isEmpty = values.filter((el) => (el ? !el.toString().trim() : !el));
    return {
      isValid: isEmpty.length > 0 ? false : true,
    };
  };