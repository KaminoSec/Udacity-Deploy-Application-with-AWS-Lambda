export const getUserId = (event) =>
  event?.requestContext?.authorizer?.principalId
